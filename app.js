'use strict';

const APP_VERSION = '0.1.4';

// ---------- Impostazioni ----------

const DEFAULT_SETTINGS = {
  geminiKey: '',
  geminiModel: 'gemini-flash-latest',
  googleClientId: '',
  driveFolder: 'Cantina',
  webCheck: 'si',
};

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('cantina.settings') || '{}') };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let settings = loadSettings();

function saveSettings(next) {
  settings = { ...settings, ...next };
  localStorage.setItem('cantina.settings', JSON.stringify(settings));
}

// ---------- Database locale (IndexedDB) ----------

const DB_NAME = 'cantina';
const STORE = 'wines';
let dbPromise;

function db() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function store(mode, fn) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req?.result);
    tx.onerror = () => reject(tx.error);
  });
}

const getWine = (id) => store('readonly', (s) => s.get(id));
const allWines = () => store('readonly', (s) => s.getAll());
const putWine = (w) => store('readwrite', (s) => s.put({ ...w, updatedAt: Date.now() }));
const deleteWine = (id) => store('readwrite', (s) => s.delete(id));

// Le modifiche sono in coda: caricamento su Drive e riconoscimento lavorano in parallelo sullo stesso vino.
let writeQueue = Promise.resolve();

function updateWine(id, patch) {
  const job = writeQueue.then(async () => {
    const w = await getWine(id);
    if (!w) return null;
    const next = typeof patch === 'function' ? patch(w) : { ...w, ...patch };
    await putWine(next);
    scheduleRender();
    return next;
  });
  writeQueue = job.catch(() => {});
  return job;
}

// ---------- Immagini ----------

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Immagine non leggibile')); };
    img.src = url;
  });
}

function resize(img, maxSide, quality) {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

// Le foto si salvano come ArrayBuffer: su iOS i Blob letti da IndexedDB a volte risultano illeggibili.
async function preparePhoto(file) {
  const img = await loadImage(file);
  const full = await resize(img, 1600, 0.85);
  const thumb = await resize(img, 320, 0.75);
  if (!full || !thumb) throw new Error('Impossibile elaborare la foto');
  return {
    id: crypto.randomUUID(),
    bytes: await full.arrayBuffer(),
    thumbBytes: await thumb.arrayBuffer(),
    driveId: null,
    error: null,
  };
}

const photoBlob = (p) => p.blob || new Blob([p.bytes], { type: 'image/jpeg' });
const thumbBlob = (p) => p.thumb || new Blob([p.thumbBytes], { type: 'image/jpeg' });

// Converte le foto salvate come Blob dalla versione 0.1.0.
async function migratePhotos() {
  for (const w of await allWines()) {
    if (!w.photos.some((p) => p.blob)) continue;
    const photos = [];
    for (const p of w.photos) {
      if (!p.blob) { photos.push(p); continue; }
      const { blob, thumb, ...rest } = p;
      try {
        photos.push({ ...rest, bytes: await blob.arrayBuffer(), thumbBytes: await thumb.arrayBuffer() });
      } catch {
        photos.push({ ...rest, bytes: null, thumbBytes: null, lost: true, driveId: rest.driveId || 'perduta' });
      }
    }
    await updateWine(w.id, (cur) => ({ ...cur, photos }));
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

// ---------- Google Drive ----------

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
let tokenClient = null;

function loadToken() {
  try {
    const t = JSON.parse(localStorage.getItem('cantina.token') || 'null');
    return t && t.expiresAt > Date.now() + 60_000 ? t : null;
  } catch {
    return null;
  }
}

function driveToken() {
  return loadToken()?.accessToken || null;
}

function initTokenClient() {
  if (tokenClient || !settings.googleClientId || !window.google?.accounts?.oauth2) return tokenClient;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: settings.googleClientId,
    scope: DRIVE_SCOPE,
    callback: (resp) => {
      if (resp.error) {
        toast('Accesso a Drive non riuscito: ' + resp.error);
        return;
      }
      localStorage.setItem('cantina.token', JSON.stringify({
        accessToken: resp.access_token,
        expiresAt: Date.now() + Number(resp.expires_in) * 1000,
      }));
      updateDriveStatus();
      processPending();
    },
  });
  return tokenClient;
}

function login() {
  if (!settings.googleClientId) {
    toast('Inserisci prima il Client ID Google nelle impostazioni.');
    openSettings();
    return;
  }
  const client = initTokenClient();
  if (!client) {
    toast('Libreria Google non ancora caricata, riprova tra un attimo.');
    return;
  }
  client.requestAccessToken({ prompt: localStorage.getItem('cantina.token') ? '' : 'consent' });
}

function logout() {
  const t = loadToken();
  if (t && window.google?.accounts?.oauth2) google.accounts.oauth2.revoke(t.accessToken);
  localStorage.removeItem('cantina.token');
  localStorage.removeItem('cantina.folderId');
  updateDriveStatus();
}

function updateDriveStatus() {
  const ok = !!driveToken();
  $('#drive-status').textContent = ok ? 'Drive: collegato' : 'Drive: non collegato';
  $('#btn-login').hidden = ok;
}

async function driveFetch(url, opts = {}) {
  const token = driveToken();
  if (!token) throw new Error('Drive non collegato');
  const res = await fetch(url, { ...opts, headers: { ...opts.headers, Authorization: 'Bearer ' + token } });
  if (res.status === 401) {
    localStorage.removeItem('cantina.token');
    updateDriveStatus();
    throw new Error('Sessione Drive scaduta: accedi di nuovo');
  }
  if (!res.ok) throw new Error('Drive ' + res.status + ': ' + (await res.text()).slice(0, 200));
  return res.json();
}

async function driveFolderId() {
  const cached = localStorage.getItem('cantina.folderId');
  if (cached) return cached;
  const name = settings.driveFolder || 'Cantina';
  const q = `name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const found = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=files(id)&q=' + encodeURIComponent(q));
  let id = found.files?.[0]?.id;
  if (!id) {
    const created = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder' }),
    });
    id = created.id;
  }
  localStorage.setItem('cantina.folderId', id);
  return id;
}

async function driveUpload(blob, name) {
  const folder = await driveFolderId();
  const boundary = 'cantina' + Math.random().toString(36).slice(2);
  const meta = JSON.stringify({ name, parents: [folder] });
  const body = new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n`,
    `--${boundary}\r\nContent-Type: image/jpeg\r\n\r\n`,
    blob,
    `\r\n--${boundary}--`,
  ]);
  const res = await driveFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
  return res.id;
}

async function driveRename(fileId, name) {
  await driveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

function photoName(wine, index) {
  const d = wine.data || {};
  const parts = [d.produttore, d.nome, d.annata].filter(Boolean).join(' - ');
  const base = parts || new Date(wine.createdAt).toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const suffix = wine.photos.length > 1 ? ` (${index + 1})` : '';
  return (base + suffix).replace(/[\\/:*?"<>|]/g, '_') + '.jpg';
}

async function uploadPhotos(id) {
  if (!driveToken()) return;
  let wine = await getWine(id);
  for (let i = 0; i < wine.photos.length; i++) {
    if (wine.photos[i].driveId) continue;
    try {
      const driveId = await driveUpload(photoBlob(wine.photos[i]), photoName(wine, i));
      wine = await updateWine(id, (w) => {
        w.photos[i] = { ...w.photos[i], driveId, named: !!w.data, error: null };
        return w;
      });
    } catch (e) {
      wine = await updateWine(id, (w) => {
        w.photos[i] = { ...w.photos[i], error: e.message };
        return w;
      });
    }
  }
}

// Dopo il riconoscimento rinomina su Drive le foto caricate con il nome provvisorio.
async function renamePhotos(id) {
  if (!driveToken()) return;
  const wine = await getWine(id);
  for (let i = 0; i < wine.photos.length; i++) {
    const p = wine.photos[i];
    if (!p.driveId || p.named || !wine.data) continue;
    try {
      await driveRename(p.driveId, photoName(wine, i));
      await updateWine(id, (w) => {
        w.photos[i] = { ...w.photos[i], named: true };
        return w;
      });
    } catch {
      // Il nome provvisorio va bene comunque.
    }
  }
}

// ---------- Gemini ----------

const FIELDS = [
  { k: 'produttore', l: 'Produttore' },
  { k: 'nome', l: 'Nome del vino' },
  { k: 'denominazione', l: 'Denominazione' },
  { k: 'classificazione', l: 'Classificazione (DOCG, DOC, IGT…)' },
  { k: 'colore', l: 'Colore', options: ['rosso', 'bianco', 'rosato', 'orange'] },
  { k: 'stile', l: 'Stile', options: ['fermo', 'frizzante', 'spumante metodo classico', 'spumante metodo Martinotti/Charmat', 'rifermentato in bottiglia / col fondo', 'passito', 'vendemmia tardiva', 'muffato', 'liquoroso/fortificato'] },
  { k: 'caratteristiche', l: 'Caratteristiche (biologico, naturale…)', type: 'ARRAY' },
  { k: 'annata', l: 'Annata', type: 'INTEGER' },
  { k: 'vitigni', l: 'Vitigni', type: 'ARRAY' },
  { k: 'regione', l: 'Regione' },
  { k: 'nazione', l: 'Nazione' },
  { k: 'gradazione', l: 'Gradazione (% vol)', type: 'NUMBER' },
  { k: 'formato_ml', l: 'Formato (ml)', type: 'INTEGER' },
  { k: 'affinamento', l: 'Affinamento' },
  { k: 'temperatura_servizio', l: 'Temperatura di servizio' },
  { k: 'finestra_consumo', l: 'Quando berlo (stima)' },
  { k: 'abbinamenti', l: 'Abbinamenti' },
  { k: 'descrizione', l: 'Descrizione' },
];

const OPTIONS = Object.fromEntries(FIELDS.filter((f) => f.options).map((f) => [f.k, f.options]));

const PROMPT = `Sei un sommelier esperto. Le immagini mostrano l'etichetta (ed eventualmente la retroetichetta) di UNA bottiglia di vino.
Estrai più informazioni possibili. Usa prima ciò che è scritto sull'etichetta; per i campi non scritti (vitigni, regione, temperatura di servizio, finestra di consumo, abbinamenti, descrizione) puoi usare la tua conoscenza del vino, ma solo se lo hai identificato con ragionevole sicurezza.
Se un dato non è ricavabile lascialo null. Non inventare l'annata: se non è visibile è null.
Colore: "orange" per i bianchi macerati sulle bucce (anche se l'etichetta dice "macerato", "ramato", "amber" o "skin contact"); il ramato di Pinot grigio è orange se macerato, altrimenti rosato.
Stile: scegli il più specifico; un Prosecco col fondo è "rifermentato in bottiglia / col fondo", un Franciacorta è "spumante metodo classico", un Marsala o un Porto è "liquoroso/fortificato".
Caratteristiche: solo se indicate o certe, per esempio biologico, biodinamico, naturale, senza solfiti aggiunti, non filtrato, vegano, dosaggio (brut nature, extra brut, brut, extra dry, dry, demi-sec, dolce), residuo zuccherino (secco, abboccato, amabile, dolce).
In "campi_incerti" elenca le chiavi dei campi dedotti o poco leggibili. Rispondi in italiano.`;

function geminiSchema() {
  const props = {};
  for (const f of FIELDS) {
    props[f.k] = f.type === 'ARRAY'
      ? { type: 'ARRAY', items: { type: 'STRING' }, nullable: true }
      : { type: f.type || 'STRING', nullable: true, ...(f.options && { enum: f.options }) };
  }
  props.campi_incerti = { type: 'ARRAY', items: { type: 'STRING' } };
  props.e_un_vino = { type: 'BOOLEAN' };
  return { type: 'OBJECT', properties: props, required: ['e_un_vino', 'campi_incerti'] };
}

async function geminiCall(body) {
  const model = settings.geminiModel || DEFAULT_SETTINGS.geminiModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(settings.geminiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error('Gemini ' + res.status + ': ' + (json.error?.message || 'errore'));
  const candidate = json.candidates?.[0];
  const text = candidate?.content?.parts?.filter((p) => !p.thought).map((p) => p.text || '').join('');
  if (!text) throw new Error('Gemini non ha restituito dati');
  return { text, grounding: candidate.groundingMetadata };
}

async function geminiRecognize(blobs) {
  const parts = [{ text: PROMPT }];
  for (const b of blobs) parts.push({ inline_data: { mime_type: 'image/jpeg', data: await blobToBase64(b) } });
  const { text } = await geminiCall({
    contents: [{ role: 'user', parts }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: geminiSchema(), temperature: 0.2 },
  });
  return JSON.parse(text);
}

// Campi che di solito non sono sull'etichetta e che la ricerca Google può correggere.
const WEB_FIELDS = ['vitigni', 'regione', 'colore', 'stile', 'caratteristiche', 'affinamento', 'gradazione',
  'temperatura_servizio', 'finestra_consumo', 'abbinamenti', 'descrizione'];

function parseJsonText(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('Risposta della ricerca non leggibile');
  return JSON.parse(text.slice(start, end + 1));
}

// Seconda chiamata con ricerca Google: la ricerca non si può combinare con lo schema JSON
// su tutti i modelli, quindi il JSON viene chiesto nel testo.
async function geminiWebCheck(data) {
  const who = [data.produttore, data.nome, data.denominazione, data.annata].filter(Boolean).join(', ');
  const fields = WEB_FIELDS.map((k) => `"${k}"`).join(', ');
  const prompt = `Cerca su Google la scheda tecnica di questo vino: ${who}.
Preferisci il sito del produttore, poi enoteche e guide affidabili. Se l'annata specifica non si trova, usa la scheda più recente dello stesso vino.
Dati letti dall'etichetta (possono contenere errori di deduzione): ${JSON.stringify(data)}
Rispondi SOLO con un oggetto JSON con le chiavi ${fields}, "vino_trovato" (true/false) e "confermati" (elenco delle chiavi che hai verificato su una fonte).
"vitigni" e "caratteristiche" sono elenchi di stringhe; "gradazione" è un numero; una chiave non verificata vale null.
Colore: uno tra ${OPTIONS.colore.join(', ')}. Stile: uno tra ${OPTIONS.stile.join(', ')}. Rispondi in italiano.`;
  const { text, grounding } = await geminiCall({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: { temperature: 0.1 },
  });
  const result = parseJsonText(text);
  const sources = (grounding?.groundingChunks || [])
    .map((c) => c.web).filter(Boolean)
    .map((w) => ({ title: w.title || w.uri, uri: w.uri }));
  return { result, sources };
}

// ---------- Avanzamento ----------

// Gemini non comunica l'avanzamento: la barra si basa sulla durata media delle ultime richieste.
const DEFAULT_TIMINGS = { label: 8000, web: 15000 };
const progress = new Map();

function timings() {
  try {
    return { ...DEFAULT_TIMINGS, ...JSON.parse(localStorage.getItem('cantina.timings') || '{}') };
  } catch {
    return { ...DEFAULT_TIMINGS };
  }
}

function recordTiming(phase, ms) {
  const t = timings();
  t[phase] = Math.round(t[phase] * 0.7 + ms * 0.3);
  localStorage.setItem('cantina.timings', JSON.stringify(t));
}

async function timed(id, phase, fn) {
  const start = Date.now();
  progress.set(id, { phase, start, web: settings.webCheck !== 'no' });
  tickProgress();
  const out = await fn();
  recordTiming(phase, Date.now() - start);
  return out;
}

function progressInfo(id) {
  const p = progress.get(id);
  if (!p) return null;
  const t = timings();
  const total = t.label + (p.web ? t.web : 0);
  const done = (p.phase === 'web' ? t.label : 0) + (Date.now() - p.start);
  const left = Math.max(1, Math.round((total - done) / 1000));
  const label = p.phase === 'web' ? 'Verifica su Google' : 'Lettura etichetta';
  const step = p.web ? (p.phase === 'web' ? ' (2/2)' : ' (1/2)') : '';
  return {
    pct: Math.min(95, Math.round((done / total) * 100)),
    text: done < total ? `${label}${step}… circa ${left} s` : `${label}${step}… quasi fatto`,
  };
}

let ticker = null;
function tickProgress() {
  for (const el of document.querySelectorAll('.progress[data-id]')) {
    const info = progressInfo(el.dataset.id);
    if (!info) continue;
    el.querySelector('i').style.width = info.pct + '%';
    el.querySelector('span').textContent = info.text;
  }
  if (progress.size && !ticker) ticker = setInterval(tickProgress, 250);
  if (!progress.size && ticker) { clearInterval(ticker); ticker = null; }
}

async function recognize(id) {
  if (!settings.geminiKey) return;
  const wine = await getWine(id);
  await updateWine(id, { status: 'recognizing', error: null });
  try {
    const result = await timed(id, 'label', () => geminiRecognize(wine.photos.filter((p) => !p.lost).map(photoBlob)));
    const { campi_incerti, e_un_vino, ...data } = result;
    let uncertain = campi_incerti || [];
    let web = null;
    if (settings.webCheck !== 'no' && e_un_vino !== false && (data.produttore || data.nome)) {
      try {
        const { result: found, sources } = await timed(id, 'web', () => geminiWebCheck(data));
        const confirmed = new Set(found.vino_trovato === false ? [] : found.confermati || []);
        for (const k of WEB_FIELDS) {
          if (confirmed.has(k) && found[k] != null && found[k] !== '') data[k] = found[k];
        }
        uncertain = uncertain.filter((k) => !confirmed.has(k));
        web = { found: found.vino_trovato !== false, confirmed: [...confirmed], sources, at: Date.now() };
      } catch (e) {
        web = { error: e.message, at: Date.now() };
      }
    }
    await updateWine(id, {
      status: 'ok',
      data: { ...data, ...pickUserEdits(wine) },
      uncertain,
      web,
      notWine: e_un_vino === false,
      error: null,
    });
    await renamePhotos(id);
  } catch (e) {
    await updateWine(id, { status: 'error', error: e.message });
  } finally {
    progress.delete(id);
    tickProgress();
  }
}

// I campi già corretti a mano non vengono sovrascritti da un nuovo riconoscimento.
function pickUserEdits(wine) {
  const out = {};
  for (const k of wine.edited || []) if (wine.data?.[k] != null) out[k] = wine.data[k];
  return out;
}

// ---------- Flusso di inserimento ----------

const running = new Set();

async function processWine(id) {
  if (running.has(id)) return;
  running.add(id);
  try {
    const wine = await getWine(id);
    await Promise.all([
      uploadPhotos(id),
      wine.status === 'ok' ? null : recognize(id),
    ]);
  } finally {
    running.delete(id);
    scheduleRender();
  }
}

async function processPending() {
  const wines = await allWines();
  for (const w of wines) {
    if (w.status !== 'ok' || w.photos.some((p) => !p.driveId)) processWine(w.id);
  }
}

async function addFiles(files, sameWine) {
  if (!files.length) return;
  const groups = sameWine ? [files] : files.map((f) => [f]);
  for (const group of groups) {
    try {
      const photos = [];
      for (const f of group) photos.push(await preparePhoto(f));
      const wine = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        status: 'new',
        data: null,
        edited: [],
        quantita: 1,
        posizione: '',
        photos,
      };
      await putWine(wine);
      scheduleRender();
      processWine(wine.id);
    } catch (e) {
      toast(e.message);
    }
  }
  if (!settings.geminiKey) toast('Foto salvate. Inserisci la chiave Gemini nelle impostazioni per il riconoscimento.');
  else if (!driveToken()) toast('Foto salvate sul telefono. Accedi a Drive per caricarle.');
}

// ---------- Interfaccia ----------

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Gli URL della lista e del dettaglio si liberano separatamente, così un aggiornamento della lista non rompe il dettaglio aperto.
const objectUrls = { list: [], dialog: [] };
function blobUrl(blob, group) {
  const u = URL.createObjectURL(blob);
  objectUrls[group].push(u);
  return u;
}
function releaseUrls(group) {
  objectUrls[group].forEach(URL.revokeObjectURL);
  objectUrls[group] = [];
}
const imgTag = (p, getBlob, group) => p.lost
  ? '<span class="lost">Foto non recuperabile</span>'
  : `<img src="${blobUrl(getBlob(p), group)}" alt="">`;

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.append(el);
  setTimeout(() => el.remove(), 4000);
}

function wineTitle(w) {
  const d = w.data || {};
  return [d.produttore, d.nome].filter(Boolean).join(' · ') || 'Vino senza nome';
}

function wineSubtitle(w) {
  const d = w.data || {};
  return [d.denominazione, d.annata, d.colore || d.tipologia, d.stile !== 'fermo' && d.stile].filter(Boolean).join(' · ');
}

function wineBadges(w) {
  const b = [];
  if (w.status === 'new' && settings.geminiKey && !progress.has(w.id)) b.push('In coda…');
  if (w.status === 'new' && !settings.geminiKey) b.push('Da riconoscere');
  if (w.status === 'error') b.push('Errore Gemini');
  if (w.notWine) b.push('Non sembra un vino');
  if (w.photos.some((p) => !p.driveId)) b.push('Drive in attesa');
  return b;
}

function progressBar(id) {
  const info = progressInfo(id);
  return info
    ? `<div class="progress" data-id="${id}"><b><i style="width:${info.pct}%"></i></b><span>${esc(info.text)}</span></div>`
    : '';
}

let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; render(); });
}

async function render() {
  const wines = (await allWines()).sort((a, b) => b.createdAt - a.createdAt);
  releaseUrls('list');
  const q = $('#search').value.trim().toLowerCase();
  const shown = q
    ? wines.filter((w) => JSON.stringify(w.data || {}).toLowerCase().includes(q) || (w.posizione || '').toLowerCase().includes(q))
    : wines;
  const bottles = wines.reduce((n, w) => n + (Number(w.quantita) || 0), 0);
  $('#count').textContent = `(${wines.length} vini, ${bottles} bottiglie)`;
  $('#wine-list').innerHTML = shown.map((w) => `
    <li data-id="${w.id}">
      ${imgTag(w.photos[0], thumbBlob, 'list')}
      <div>
        <strong>${esc(wineTitle(w))}</strong>
        <small>${esc(wineSubtitle(w))}</small>
        <small>${w.quantita} bott.${w.posizione ? ' · ' + esc(w.posizione) : ''}</small>
        ${progressBar(w.id)}
        ${wineBadges(w).map((b) => `<span class="badge">${esc(b)}</span>`).join('')}
      </div>
    </li>`).join('') || '<li class="empty">Nessun vino. Scatta o importa una foto per iniziare.</li>';

  const pending = wines.filter((w) => w.status !== 'ok' || w.photos.some((p) => !p.driveId));
  $('#pending-section').hidden = pending.length === 0;
  const noDrive = wines.reduce((n, w) => n + w.photos.filter((p) => !p.driveId).length, 0);
  const noAi = wines.filter((w) => w.status !== 'ok').length;
  $('#pending-hint').textContent = [
    noDrive ? `${noDrive} foto da caricare su Drive` : '',
    noAi ? `${noAi} vini da riconoscere` : '',
  ].filter(Boolean).join(' · ');
}

let editingId = null;

async function openWine(id) {
  const w = await getWine(id);
  if (!w) return;
  editingId = id;
  $('#wine-photos').innerHTML = w.photos.map((p) => imgTag(p, photoBlob, 'dialog')).join('');
  const state = [];
  if (w.error) state.push('Errore: ' + w.error);
  if (w.uncertain?.length) state.push('Campi incerti evidenziati in giallo.');
  if (w.web?.error) state.push('Verifica su Google non riuscita: ' + w.web.error);
  else if (w.web && !w.web.found) state.push('Vino non trovato con la ricerca Google.');
  else if (w.web) state.push(`Verificati su Google: ${w.web.confirmed.join(', ') || 'nessun campo'}.`);
  w.photos.forEach((p, i) => p.error && state.push(`Foto ${i + 1}: ${p.error}`));
  $('#wine-state').innerHTML = esc(state.join(' ')) + (w.web?.sources?.length
    ? `<details><summary>Fonti (${w.web.sources.length})</summary><ul>${w.web.sources
      .map((x) => `<li><a href="${esc(x.uri)}" target="_blank" rel="noopener">${esc(x.title)}</a></li>`).join('')}</ul></details>`
    : '');
  const d = w.data || {};
  const uncertain = new Set(w.uncertain || []);
  const input = (k, l, v, type) => `
    <label class="${uncertain.has(k) ? 'uncertain' : ''}">${esc(l)}
      ${k === 'descrizione' || k === 'abbinamenti'
        ? `<textarea name="${k}" rows="2">${esc(v)}</textarea>`
        : `<input name="${k}" value="${esc(v)}" ${type ? `inputmode="${type}"` : ''} ${OPTIONS[k] ? `list="opt-${k}"` : ''}>`}
      ${OPTIONS[k] ? `<datalist id="opt-${k}">${OPTIONS[k].map((o) => `<option value="${esc(o)}">`).join('')}</datalist>` : ''}
    </label>`;
  $('#wine-fields').innerHTML =
    `<div class="grid2">${input('quantita', 'Bottiglie', w.quantita, 'numeric')}${input('posizione', 'Posizione in cantina', w.posizione)}</div>` +
    FIELDS.map((f) => input(f.k, f.l, Array.isArray(d[f.k]) ? d[f.k].join(', ') : d[f.k],
      f.type === 'INTEGER' ? 'numeric' : f.type === 'NUMBER' ? 'decimal' : '')).join('');
  $('#dlg-wine').returnValue = '';
  $('#dlg-wine').showModal();
}

function readForm(w) {
  const fd = new FormData($('#wine-form'));
  const data = { ...(w.data || {}) };
  const edited = new Set(w.edited || []);
  for (const f of FIELDS) {
    const raw = String(fd.get(f.k) ?? '').trim();
    let v = raw === '' ? null : raw;
    if (v != null && f.type === 'ARRAY') v = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (v != null && (f.type === 'INTEGER' || f.type === 'NUMBER')) {
      const n = Number(raw.replace(',', '.'));
      v = Number.isFinite(n) ? n : null;
    }
    const before = Array.isArray(data[f.k]) ? data[f.k].join(', ') : String(data[f.k] ?? '');
    if (raw !== before) edited.add(f.k);
    data[f.k] = v;
  }
  return {
    ...w,
    data,
    edited: [...edited],
    uncertain: (w.uncertain || []).filter((k) => !edited.has(k)),
    quantita: Math.max(0, parseInt(fd.get('quantita'), 10) || 0),
    posizione: String(fd.get('posizione') || '').trim(),
  };
}

function openSettings() {
  const form = $('#settings-form');
  for (const [k, v] of Object.entries(settings)) if (form.elements[k]) form.elements[k].value = v;
  $('#dlg-settings').returnValue = '';
  $('#dlg-settings').showModal();
}

async function exportJson() {
  const wines = (await allWines()).map(({ photos, ...w }) => ({ ...w, foto_drive: photos.map((p) => p.driveId) }));
  const blob = new Blob([JSON.stringify({ versione: APP_VERSION, esportato: new Date().toISOString(), vini: wines }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cantina-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function bindUi() {
  $('#app-version').textContent = APP_VERSION;
  for (const sel of ['#in-camera', '#in-files']) {
    $(sel).addEventListener('change', (e) => {
      const files = [...e.target.files];
      e.target.value = '';
      addFiles(files, sel === '#in-files' && $('#same-wine').checked);
    });
  }
  $('#btn-login').addEventListener('click', login);
  $('#btn-logout').addEventListener('click', () => { logout(); toast('Disconnesso da Drive'); });
  $('#btn-settings').addEventListener('click', openSettings);
  $('#btn-export').addEventListener('click', exportJson);
  $('#btn-retry').addEventListener('click', () => {
    if (!driveToken() && settings.googleClientId) login();
    processPending();
  });
  $('#search').addEventListener('input', scheduleRender);
  $('#wine-list').addEventListener('click', (e) => {
    const li = e.target.closest('li[data-id]');
    if (li) openWine(li.dataset.id);
  });

  $('#dlg-settings').addEventListener('close', () => {
    if ($('#dlg-settings').returnValue !== 'save') return;
    const form = $('#settings-form');
    const prevClient = settings.googleClientId;
    const prevFolder = settings.driveFolder;
    saveSettings(Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((k) => [k, form.elements[k].value.trim()])));
    if (prevClient !== settings.googleClientId) tokenClient = null;
    if (prevFolder !== settings.driveFolder) localStorage.removeItem('cantina.folderId');
    processPending();
    scheduleRender();
  });

  $('#dlg-wine').addEventListener('close', async () => {
    const id = editingId;
    editingId = null;
    releaseUrls('dialog');
    if ($('#dlg-wine').returnValue !== 'save' || !id) return;
    if (await updateWine(id, readForm)) renamePhotos(id);
  });
  $('#btn-rerun').addEventListener('click', async () => {
    const id = editingId;
    await updateWine(id, readForm);
    $('#dlg-wine').close();
    if (!settings.geminiKey) return toast('Manca la chiave Gemini nelle impostazioni.');
    await updateWine(id, { status: 'new' });
    processWine(id);
  });
  $('#btn-delete').addEventListener('click', async () => {
    if (!confirm('Eliminare questo vino dall\'app? Le foto su Drive restano.')) return;
    const id = editingId;
    $('#dlg-wine').close();
    await deleteWine(id);
    scheduleRender();
  });
}

// ---------- Aggiornamento automatico ----------

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) location.reload();
  });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update();
    });
  });
}

// ---------- Avvio ----------

bindUi();
updateDriveStatus();
registerServiceWorker();
navigator.storage?.persist?.();
migratePhotos().catch(() => {}).then(render).then(processPending);
