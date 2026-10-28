'use strict';

const APP_VERSION = '0.7.2';

// Note di rilascio mostrate nell'app (tocca la versione in fondo alla pagina). Aggiungere in cima a ogni rilascio.
const RELEASE_NOTES = [
  { v: '0.7.2', notes: ['Scheda del vino: se ha più foto (fronte e retro) si vedono tutte in alto, affiancate.'] },
  { v: '0.7.1', notes: ['Raggruppa le foto: niente più proposta automatica di Gemini, le foto dello stesso vino si mettono insieme a mano con un tocco.'] },
  { v: '0.7.0', notes: [
    'Più foto insieme: Gemini propone quali sono della stessa bottiglia (fronte e retro, due scatti) e tu confermi nella schermata Raggruppa, dove puoi spostare o separare le foto con un tocco.',
    'Doppioni: se due vini hanno stesso produttore, nome e annata, la lista lo segnala e la scheda propone di unirli (bottiglie sommate, foto, note e bevute insieme).',
  ] },
  { v: '0.6.4', notes: ['Le mie note: nella scheda di ogni vino c\'è un riquadro per scrivere note personali, visibili anche nella lista e trovabili con la ricerca.'] },
  { v: '0.6.3', notes: ['Diario: le bevute hanno la stessa targhetta della cantina (foto, calice, nome, produttore) con in più dove, prezzo, note e voto.'] },
  { v: '0.6.2', notes: ['Spumanti: bollicine che salgono sopra il calice, così si distinguono dai bianchi fermi.'] },
  { v: '0.6.1', notes: ['Spumanti: calice a tulipano con le bollicine al posto della flûte.'] },
  { v: '0.6.0', notes: [
    'Il colore del vino è un calice colorato (a tulipano con le bollicine per gli spumanti) invece della scritta.',
    'Filtri: colore, quando berlo, provenienza, prezzo e negozio. Il pulsante accanto alla ricerca mostra quanti filtri sono attivi.',
    'Dati di acquisto: dove, quando e prezzo pagato (in "Modifica i dati del vino"). Il prezzo pagato sostituisce la stima nella lista; la stima ha la ~.',
    'Annate: nuova scheda nella barra in basso con le finestre di consumo su una linea del tempo e la linea di oggi.',
    'Anteprima ritagliata sulla bottiglia: per i nuovi vini arriva con la lettura dell\'etichetta; per quelli già inseriti c\'è "Ritaglia sulla bottiglia" nella modifica.',
    'Le impostazioni sono nella barra in basso.',
  ] },
  { v: '0.5.2', notes: ['Scheda del vino più ordinata: Annulla e Salva sempre in alto; informazioni a blocchi (in cantina, quando berlo, il vino, in tavola) con abbinamenti e descrizione da leggere per intero.', 'Modifica dei dati divisa per argomento, campi corti due per riga, caselle di testo che si allungano da sole.'] },
  { v: '0.5.1', notes: ['Il tasto fotocamera ora fa scegliere tra scattare una foto e prenderle dalla libreria (anche più di una).'] },
  { v: '0.5.0', notes: ['Grafica rifatta da zero come nei prototipi, sempre scura.', 'Scheda del vino nuova: foto grande, quando berlo con la linea di oggi, bottiglie con − e +, prezzo e bevute. I dati da modificare sono in fondo, sotto "Modifica i dati del vino".'] },
  { v: '0.4.4', notes: ['Corretto: con un valore della cantina sopra i 100 € con i centesimi la lista restava vuota e le foto nuove non comparivano.'] },
  { v: '0.4.3', notes: ['Se il database del telefono non risponde o c\'è un errore, compare un riquadro con i dettagli da copiare.'] },
  { v: '0.4.2', notes: ['Corretto: dopo l\'aggiornamento alla 0.4 la lista poteva restare vuota e le foto non venivano salvate. I vini non erano persi.', 'Tema scuro sempre attivo.'] },
  { v: '0.4.1', notes: ['Nuova grafica come nei prototipi: titolo grande senza fascia rossa, ricerca con lente, schede e fogli che salgono dal basso. Il riquadro di Drive compare solo se non hai fatto l\'accesso.'] },
  { v: '0.4.0', notes: [
    'Nuova barra in basso: Cantina, fotocamera al centro, Diario. "Importa foto" è sopra la lista.',
    'La lista mostra prezzo e bottiglie di ogni vino. Di base è in ordine di aggiunta, dal più recente; tocca "Ordine" per cambiarlo (nome, annata, prezzo, da bere prima, colore).',
    'Scorri un vino verso sinistra per segnarlo bevuto: si apre il foglio con voto da 1 a 100, a casa o fuori, data e note. Puoi annullare.',
    'Diario: tutte le bevute per data, con il riassunto del mese. Puoi aggiungere anche vini bevuti fuori o non presenti in cantina.',
    'I vini finiti spariscono dalla cantina ma restano nella ricerca e nel diario. Nella scheda del vino ci sono le sue bevute e il pulsante "Segna bevuta".',
  ] },
  { v: '0.3.10', notes: ['Drive: le foto vanno tutte in una sola cartella "Cantina". Le cartelle doppie create prima vengono unite da sole all\'accesso e quelle vuote finiscono nel cestino.'] },
  { v: '0.3.9', notes: ['Accesso a Drive con il pulsante "Accedi con Google": non serve più inserire il Client ID nelle impostazioni.'] },
  { v: '0.3.8', notes: [
    'Momento migliore per bere il vino, cercato sul web solo per i vini con annata: "Da bere dal", "Al meglio entro" e una nota.',
    'Nella lista un\'etichetta dice se il vino è da aspettare, pronto o oltre il momento migliore.',
  ] },
  { v: '0.3.7', notes: ['Note di rilascio: tocca la versione in fondo alla pagina; dopo un aggiornamento un avviso ti porta qui.'] },
  { v: '0.3.6', notes: [
    'Ricerca dei dettagli più mirata: produttore tra virgolette e la parola "vino" (niente più risultati su criptovalute o aziende omonime).',
    'Vini esteri: la prima fase legge la nazione e la ricerca usa vin, Wein, vinho o wine, preferendo i siti di quel paese.',
    'Scartati i risultati che non nominano né il produttore né il vino.',
  ] },
  { v: '0.3.5', notes: [
    'Prezzo stimato a bottiglia nella scheda e nella lista.',
    'Valore stimato della cantina sotto il titolo "Vini".',
    'Il costo stimato di Gemini è ora solo nel registro di debug.',
  ] },
  { v: '0.3.4', notes: ['Stima del costo di Gemini se si passasse a un piano a pagamento.'] },
  { v: '0.3.3', notes: ['Velocità: Gemini Flash-Lite con ragionamento minimo per entrambe le fasi (prima fino a 5 minuti, ora pochi secondi).'] },
  { v: '0.3.1', notes: ['Registro di debug nella scheda del vino, con output completo di ogni passaggio, errori e pulsante "Copia registro".'] },
  { v: '0.3.0', notes: [
    'Ricerca gratuita dei dettagli con Tavily (1.000 ricerche al mese), in alternativa a Google.',
    'Pulsante "Cerca su Google" nella scheda del vino.',
    'Gestione dei limiti del piano gratuito di Gemini: attesa e nuovo tentativo, poi ripiego senza ricerca.',
  ] },
  { v: '0.2.2', notes: ['Zoom della pagina bloccato; toccando una foto nella scheda si apre ingrandita e zoomabile.'] },
  { v: '0.2.1', notes: ["Aggiornamento automatico all'apertura, come nell'app Palestrina."] },
  { v: '0.2.0', notes: ['Riconoscimento in due fasi: lettura rapida di produttore, nome, tipo e annata, poi ricerca dei dettagli sul web.'] },
  { v: '0.1.3', notes: [
    'Colore (anche orange), stile e caratteristiche al posto della tipologia.',
    'Verifica dei dati con la ricerca Google di Gemini.',
    'Corrette le foto mostrate con il punto di domanda su iOS.',
  ] },
  { v: '0.1.0', notes: ['Primo prototipo: foto o import di più immagini, caricamento su Drive, riconoscimento con Gemini, archivio locale ed esportazione JSON.'] },
];

// ---------- Impostazioni ----------

// Flash-Lite: sul piano gratuito Flash rispondeva anche dopo 2-5 minuti.
const RECOMMENDED_MODEL = 'gemini-flash-lite-latest';
const readModel = () => settings.geminiModel || RECOMMENDED_MODEL;
const detailsModel = () => settings.detailsModel || RECOMMENDED_MODEL;

const DEFAULT_SETTINGS = {
  geminiKey: '',
  // Vuoti = modello consigliato (RECOMMENDED_MODEL).
  geminiModel: '',
  detailsModel: '',
  driveFolder: 'Cantina',
  search: 'auto',
  tavilyKey: '',
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('cantina.settings') || '{}');
    // Fino alla 0.2.x c'era solo "webCheck" (sì/no).
    if (saved.webCheck === 'no' && !saved.search) saved.search = 'none';
    delete saved.webCheck;
    // Fino alla 0.3.2 il modulo salvava il modello predefinito di allora come se fosse una scelta.
    if (saved.geminiModel === 'gemini-flash-latest' && !saved.modelsMigrated) saved.geminiModel = '';
    saved.modelsMigrated = true;
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let settings = loadSettings();
localStorage.setItem('cantina.settings', JSON.stringify(settings));

function saveSettings(next) {
  settings = { ...settings, ...next };
  localStorage.setItem('cantina.settings', JSON.stringify(settings));
}

// ---------- Database locale (IndexedDB) ----------

const DB_NAME = 'cantina';
const STORE = 'wines';
// Le bevute (il Diario) stanno in un database a parte: aggiungere una tabella a "cantina" richiedeva
// di alzarne la versione, e su iPhone l'aggiornamento restava bloccato finché una vecchia copia dell'app era aperta.
const DRINKS_DB = 'cantina-bevute';
const DRINKS = 'drinks';
const dbPromises = new Map();

// Riquadro di diagnosi: compare se il database non risponde o se c'è un errore, con i dettagli da mandare.
const diagLines = [];
function diag(line, show = true) {
  diagLines.push(`${new Date().toLocaleTimeString('it-IT')} ${line}`);
  const box = document.getElementById('diag');
  if (!box) return;
  document.getElementById('diag-log').textContent = diagLines.join('\n');
  if (show) box.hidden = false;
}
window.addEventListener('error', (e) => diag(`Errore: ${e.message} (${(e.filename || '').split('/').pop()}:${e.lineno})`));
window.addEventListener('unhandledrejection', (e) => diag(`Errore: ${e.reason?.message || e.reason}`));

function openDb(name, version, stores) {
  if (!dbPromises.has(name)) {
    dbPromises.set(name, new Promise((resolve, reject) => {
      const req = version ? indexedDB.open(name, version) : indexedDB.open(name);
      let done = false;
      setTimeout(async () => {
        if (done) return;
        let list = '';
        try { list = (await indexedDB.databases()).map((x) => `${x.name} v${x.version}`).join(', '); } catch (e) { list = 'elenco non disponibile'; }
        diag(`Il database "${name}" non risponde da 4 secondi. Database presenti: ${list || 'nessuno'}.`);
      }, 4000);
      req.addEventListener('success', () => { done = true; });
      req.addEventListener('error', () => { done = true; diag(`Database "${name}": ${req.error?.name} ${req.error?.message}`); });
      req.onupgradeneeded = () => {
        for (const s of stores) {
          if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => {
        const d = req.result;
        // Se una versione più nuova dell'app deve aggiornare il database, questa copia si fa da parte.
        d.onversionchange = () => d.close();
        resolve(d);
      };
      req.onerror = () => reject(req.error);
      req.onblocked = () => diag(`Database "${name}" bloccato da un'altra copia dell'app aperta.`);
    }));
  }
  return dbPromises.get(name);
}

// "cantina" si apre alla versione che ha già (1, oppure 2 per chi ha avuto la 0.4.0): mai aggiornamenti bloccanti.
async function db() {
  const d = await openDb(DB_NAME, null, [STORE]);
  if (d.objectStoreNames.contains(STORE)) return d;
  // Telefono nuovo: il database non esisteva ancora.
  d.close();
  dbPromises.delete(DB_NAME);
  return openDb(DB_NAME, d.version + 1, [STORE]);
}

const drinksDb = () => openDb(DRINKS_DB, 1, [DRINKS]);

async function store(mode, fn, name = STORE) {
  const d = await (name === DRINKS ? drinksDb() : db());
  return new Promise((resolve, reject) => {
    const tx = d.transaction(name, mode);
    const req = fn(tx.objectStore(name));
    tx.oncomplete = () => resolve(req?.result);
    tx.onerror = () => reject(tx.error);
  });
}

const getWine = (id) => store('readonly', (s) => s.get(id));
const allWines = () => store('readonly', (s) => s.getAll());
const putWine = (w) => store('readwrite', (s) => s.put({ ...w, updatedAt: Date.now() }));
const deleteWine = (id) => store('readwrite', (s) => s.delete(id));

const allDrinks = () => store('readonly', (s) => s.getAll(), DRINKS);
const putDrink = (d) => store('readwrite', (s) => s.put({ ...d, updatedAt: Date.now() }), DRINKS);
const deleteDrink = (id) => store('readwrite', (s) => s.delete(id), DRINKS);

// Chi ha usato la 0.4.0 può avere bevute nella tabella "drinks" del database "cantina": si spostano qui una volta.
async function migrateDrinks() {
  const d = await db();
  if (!d.objectStoreNames.contains(DRINKS)) return;
  const old = await new Promise((resolve, reject) => {
    const req = d.transaction(DRINKS, 'readonly').objectStore(DRINKS).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  const have = new Set((await allDrinks()).map((x) => x.id));
  for (const x of old) if (!have.has(x.id)) await store('readwrite', (s) => s.put(x), DRINKS);
}

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
const thumbBlob = (p) => p.thumb || new Blob([p.cropBytes || p.thumbBytes], { type: 'image/jpeg' });
// Nella scheda la prima foto si mostra ritagliata sulla bottiglia, se il ritaglio c'è.
const heroBlob = (p) => (p.cropBytes ? new Blob([p.cropBytes], { type: 'image/jpeg' }) : photoBlob(p));

// Ritaglia la foto sul riquadro [ymin, xmin, ymax, xmax] in millesimi indicato da Gemini, con un po' di margine.
async function cropToBox(blob, box) {
  if (!Array.isArray(box) || box.length !== 4) return null;
  let [y0, x0, y1, x1] = box.map((n) => Math.min(1000, Math.max(0, Number(n) || 0)) / 1000);
  if (y1 - y0 < 0.1 || x1 - x0 < 0.05) return null;
  const padY = (y1 - y0) * 0.04;
  const padX = (x1 - x0) * 0.12;
  y0 = Math.max(0, y0 - padY); y1 = Math.min(1, y1 + padY);
  x0 = Math.max(0, x0 - padX); x1 = Math.min(1, x1 + padX);
  const img = await loadImage(blob);
  const sx = x0 * img.naturalWidth;
  const sy = y0 * img.naturalHeight;
  const sw = (x1 - x0) * img.naturalWidth;
  const sh = (y1 - y0) * img.naturalHeight;
  const scale = Math.min(1, 900 / Math.max(sw, sh));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sw * scale);
  canvas.height = Math.round(sh * scale);
  canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
  return out ? out.arrayBuffer() : null;
}

async function applyCrop(id, box) {
  const w = await getWine(id);
  const i = w?.photos.findIndex((p) => !p.lost);
  if (!w || i < 0) return false;
  const cropBytes = await cropToBox(photoBlob(w.photos[i]), box).catch(() => null);
  if (!cropBytes) return false;
  await updateWine(id, (cur) => ({ ...cur, photos: cur.photos.map((p, j) => (j === i ? { ...p, cropBytes } : p)) }));
  return true;
}

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

// Client OAuth del progetto Google Cloud "Cantina": non è segreto, Google lo accetta solo da gorod91.github.io.
const GOOGLE_CLIENT_ID = '1064744217533-lvklnkmf9grdhfcns6ujmg4en6khccvr.apps.googleusercontent.com';
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
  if (tokenClient || !window.google?.accounts?.oauth2) return tokenClient;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
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
      driveFolderId().catch(() => {});
      processPending();
    },
  });
  return tokenClient;
}

function login() {
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
  folderPromise = null;
  updateDriveStatus();
}

function updateDriveStatus() {
  const ok = !!driveToken();
  // Il riquadro compare solo quando serve accedere.
  $('#drive-status').textContent = 'Drive non collegato';
  $('#status-bar').hidden = ok;
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

// Una sola ricerca per sessione, condivisa tra i caricamenti in parallelo:
// prima ogni foto cercava la cartella per conto suo e, non trovandola ancora, ne creava un'altra.
let folderPromise = null;

function driveFolderId() {
  folderPromise ??= findOrCreateFolder().catch((e) => {
    folderPromise = null;
    throw e;
  });
  return folderPromise;
}

async function findOrCreateFolder() {
  const name = settings.driveFolder || 'Cantina';
  const q = `name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const found = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=files(id)&orderBy=createdTime&q=' + encodeURIComponent(q));
  const [first, ...dupes] = found.files || [];
  if (!first) {
    const created = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder' }),
    });
    return created.id;
  }
  for (const dupe of dupes) await mergeFolder(dupe.id, first.id);
  return first.id;
}

// Sposta le foto delle cartelle doppie (create dalla 0.3.9 e precedenti) nella prima e cestina quelle vuote.
async function mergeFolder(fromId, toId) {
  try {
    const q = `'${fromId}' in parents and trashed=false`;
    const list = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=files(id)&pageSize=1000&q=' + encodeURIComponent(q));
    for (const f of list.files || []) {
      await driveFetch(`https://www.googleapis.com/drive/v3/files/${f.id}?addParents=${toId}&removeParents=${fromId}&fields=id`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
    }
    await driveFetch(`https://www.googleapis.com/drive/v3/files/${fromId}?fields=id`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trashed: true }),
    });
  } catch (e) {
    console.warn('Unione cartelle Drive non riuscita', e);
  }
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
  { k: 'produttore', quick: true, l: 'Produttore' },
  { k: 'nome', quick: true, l: 'Nome del vino' },
  { k: 'denominazione', quick: true, l: 'Denominazione' },
  { k: 'classificazione', quick: true, l: 'Classificazione' },
  { k: 'colore', quick: true, l: 'Colore', options: ['rosso', 'bianco', 'rosato', 'orange'] },
  { k: 'stile', quick: true, l: 'Stile', options: ['fermo', 'frizzante', 'spumante metodo classico', 'spumante metodo Martinotti/Charmat', 'rifermentato in bottiglia / col fondo', 'passito', 'vendemmia tardiva', 'muffato', 'liquoroso/fortificato'] },
  { k: 'caratteristiche', l: 'Caratteristiche (biologico, naturale…)', type: 'ARRAY' },
  { k: 'annata', quick: true, l: 'Annata', type: 'INTEGER' },
  { k: 'nazione', quick: true, l: 'Nazione' },
  { k: 'vitigni', l: 'Vitigni', type: 'ARRAY' },
  { k: 'regione', l: 'Regione' },
  { k: 'gradazione', l: 'Gradazione (% vol)', type: 'NUMBER' },
  { k: 'formato_ml', l: 'Formato (ml)', type: 'INTEGER' },
  { k: 'affinamento', l: 'Affinamento' },
  { k: 'temperatura_servizio', l: 'Temperatura di servizio' },
  { k: 'bere_dal', l: 'Da bere dal (anno)', type: 'INTEGER', drink: true },
  { k: 'bere_entro', l: 'Al meglio entro (anno)', type: 'INTEGER', drink: true },
  { k: 'finestra_consumo', l: 'Quando berlo (nota)', drink: true },
  { k: 'prezzo', l: 'Prezzo stimato a bottiglia (€)', type: 'NUMBER' },
  { k: 'abbinamenti', l: 'Abbinamenti' },
  { k: 'descrizione', l: 'Descrizione' },
];

const OPTIONS = Object.fromEntries(FIELDS.filter((f) => f.options).map((f) => [f.k, f.options]));

const QUICK = FIELDS.filter((f) => f.quick);
const DETAILS = FIELDS.filter((f) => !f.quick);

// Primo passaggio: solo i dati che identificano il vino, per avere la scheda in pochi secondi.
const QUICK_PROMPT = `Le immagini mostrano l'etichetta (ed eventualmente la retroetichetta) di UNA bottiglia di vino.
Leggi solo: produttore, nome del vino, denominazione, classificazione (DOCG, DOC, IGT, IGP, AOC…), colore, stile, annata, nazione.
Usa ciò che è scritto; se un dato non è leggibile lascialo null. Non inventare l'annata.
Nazione: in italiano (Italia, Francia, Spagna…), dedotta anche da denominazione, lingua dell'etichetta o indirizzo del produttore.
Colore: "orange" per i bianchi macerati sulle bucce ("macerato", "ramato", "amber", "skin contact").
Stile: il più specifico; un Prosecco col fondo è "rifermentato in bottiglia / col fondo", un Franciacorta è "spumante metodo classico".
In "campi_incerti" elenca le chiavi poco leggibili o dedotte.
In "riquadro_bottiglia" dai il riquadro della bottiglia intera (dal tappo al fondo) nella PRIMA immagine, come [ymin, xmin, ymax, xmax] in millesimi da 0 a 1000; null se la bottiglia non si vede intera.`;

function fieldSchema(f) {
  if (f.type === 'ARRAY') return { type: 'ARRAY', items: { type: 'STRING' }, nullable: true };
  return { type: f.type || 'STRING', nullable: true, ...(f.options && { enum: f.options }) };
}

function quickSchema() {
  const props = Object.fromEntries(QUICK.map((f) => [f.k, fieldSchema(f)]));
  props.campi_incerti = { type: 'ARRAY', items: { type: 'STRING' } };
  props.e_un_vino = { type: 'BOOLEAN' };
  props.riquadro_bottiglia = { type: 'ARRAY', items: { type: 'INTEGER' }, nullable: true };
  return { type: 'OBJECT', properties: props, required: ['e_un_vino', 'campi_incerti'] };
}

// Le chiamate a Gemini partono una alla volta: con molte foto insieme si superava il limite al minuto del piano gratuito.
let geminiQueue = Promise.resolve();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// hooks: { wait(secondi), log(passo, testo), label } per il conto alla rovescia e il registro di debug.
// ---------- Stima dei costi ----------

// Prezzi indicativi del piano a pagamento (USD per milione di token, ottobre 2026, da verificare sul listino).
// Sul piano gratuito il costo reale è zero: la stima serve a sapere quanto costerebbe passare a pagamento.
const PRICES = [
  { match: /flash-lite/, input: 0.1, output: 0.4 },
  { match: /flash/, input: 0.5, output: 3 },
  { match: /pro/, input: 2, output: 12 },
];
const GOOGLE_SEARCH_USD = 0.014; // per ricerca, oltre la quota gratuita
const TAVILY_USD = 0.008; // per ricerca base, oltre le 1.000 gratuite al mese
const USD_TO_EUR = 0.9;

function geminiCostUsd(model, usage) {
  const price = PRICES.find((p) => p.match.test(model)) || PRICES[1];
  const input = usage?.promptTokenCount || 0;
  // I token di ragionamento si pagano come output.
  const output = (usage?.candidatesTokenCount || 0) + (usage?.thoughtsTokenCount || 0);
  return (input * price.input + output * price.output) / 1e6;
}

const formatEur = (usd) => {
  const eur = usd * USD_TO_EUR;
  return eur < 0.01 ? `${(eur * 100).toFixed(2).replace('.', ',')} cent` : `${eur.toFixed(2).replace('.', ',')} €`;
};

// Totali del mese sul dispositivo (anche per i vini poi eliminati).
function monthUsage() {
  const month = new Date().toISOString().slice(0, 7);
  try {
    const u = JSON.parse(localStorage.getItem('cantina.usage') || 'null');
    if (u?.month === month) return u;
  } catch { /* si riparte da zero */ }
  return { month, usd: 0, gemini: 0, google: 0, tavily: 0 };
}

function addMonthUsage(patch) {
  const u = monthUsage();
  for (const [k, v] of Object.entries(patch)) u[k] = (u[k] || 0) + v;
  localStorage.setItem('cantina.usage', JSON.stringify(u));
}

let geminiPending = 0;

function geminiCall(body, hooks) {
  if (geminiPending) hooks?.log?.(`${hooks.label || 'Gemini'} · in coda`, `${geminiPending} richieste prima di questa`);
  geminiPending++;
  const job = geminiQueue.then(() => geminiFetch(body, hooks)).finally(() => geminiPending--);
  geminiQueue = job.catch(() => {});
  return job;
}

function describeRequest(body) {
  const parts = body.contents.flatMap((c) => c.parts);
  const images = parts.filter((p) => p.inline_data).length;
  const text = parts.map((p) => p.text).filter(Boolean).join('\n');
  const extra = { ...body.generationConfig };
  delete extra.responseSchema;
  return `${images ? `[${images} immagini]\n` : ''}${body.tools ? `[strumenti: ${body.tools.map((t) => Object.keys(t)[0]).join(', ')}]\n` : ''}[config: ${JSON.stringify(extra)}]\n\n${text}`;
}

async function geminiFetch(body, hooks = {}) {
  const log = (step, text) => hooks.log?.(`${hooks.label || 'Gemini'} · ${step}`, text);
  const model = hooks.model || readModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(settings.geminiKey)}`;
  for (let attempt = 0; ; attempt++) {
    log(`richiesta a ${model}${attempt ? ` (tentativo ${attempt + 1})` : ''}`, describeRequest(body));
    const started = Date.now();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      const candidate = json.candidates?.[0];
      const text = candidate?.content?.parts?.filter((p) => !p.thought).map((p) => p.text || '').join('');
      const g = candidate?.groundingMetadata;
      log(`risposta in ${((Date.now() - started) / 1000).toFixed(1)} s`, [
        text || '(vuota)',
        g?.webSearchQueries?.length ? `\n[ricerche Google: ${g.webSearchQueries.join(' | ')}]` : '',
        json.usageMetadata ? `\n[token: ${JSON.stringify(json.usageMetadata)}]` : '',
        candidate?.finishReason && candidate.finishReason !== 'STOP' ? `\n[fine: ${candidate.finishReason}]` : '',
      ].join(''));
      if (!text) throw new Error('Gemini non ha restituito dati');
      const searches = g?.webSearchQueries?.length || 0;
      const usd = geminiCostUsd(model, json.usageMetadata) + searches * GOOGLE_SEARCH_USD;
      addMonthUsage({ usd, gemini: 1, google: searches });
      hooks.cost?.({ step: hooks.label || 'Gemini', model, usd, searches, usage: json.usageMetadata });
      return { text, grounding: candidate.groundingMetadata };
    }
    log(`errore ${res.status} in ${((Date.now() - started) / 1000).toFixed(1)} s`, JSON.stringify(json.error || json, null, 2));
    const details = json.error?.details || [];
    const retry = details.find((d) => d.retryDelay)?.retryDelay;
    const seconds = retry ? Math.ceil(parseFloat(retry)) : 0;
    const daily = details.some((d) => (d.violations || []).some((v) => /PerDay/i.test(v.quotaId || '')));
    // Limite al minuto: si aspetta il tempo indicato da Gemini e si riprova.
    if (res.status === 429 && !daily && attempt < 2 && seconds > 0 && seconds <= 70) {
      log('attesa', `Limite al minuto: riprovo tra ${seconds} s`);
      hooks.wait?.(seconds);
      await sleep(seconds * 1000 + 500);
      continue;
    }
    const err = new Error('Gemini ' + res.status + ': ' + (json.error?.message || 'errore'));
    err.status = res.status;
    err.daily = daily;
    throw err;
  }
}

// Opzioni per rispondere prima: ragionamento al minimo (thinkingLevel per Gemini 3, thinkingBudget per 2.x)
// e immagini a risoluzione media. Non tutti i modelli accettano tutte le opzioni: si prova in ordine
// e si ricorda per ogni modello la prima accettata.
const FAST_VARIANTS = [
  { thinkingConfig: { thinkingLevel: 'minimal' } },
  { thinkingConfig: { thinkingLevel: 'low' } },
  { thinkingConfig: { thinkingBudget: 0 } },
  {},
];
const fastVariant = new Map();

async function geminiFast(body, hooks, withImages) {
  const model = hooks.model || readModel();
  for (let v = fastVariant.get(model) || 0; v < FAST_VARIANTS.length; v++) {
    const extra = { ...FAST_VARIANTS[v], ...(withImages && v < FAST_VARIANTS.length - 1 && { mediaResolution: 'MEDIA_RESOLUTION_MEDIUM' }) };
    try {
      const out = await geminiCall({ ...body, generationConfig: { ...body.generationConfig, ...extra } }, hooks);
      fastVariant.set(model, v);
      return out;
    } catch (e) {
      if (e.status !== 400 || v === FAST_VARIANTS.length - 1) throw e;
      hooks.log?.(`${hooks.label} · opzione non accettata`, `${JSON.stringify(extra)}: provo la successiva`);
    }
  }
}

async function geminiBox(blob, hooks) {
  const out = await geminiFast({
    contents: [{ role: 'user', parts: [
      { text: 'Dai il riquadro della bottiglia di vino intera (dal tappo al fondo) nella foto, come [ymin, xmin, ymax, xmax] in millesimi da 0 a 1000. null se non si vede intera.' },
      { inline_data: { mime_type: 'image/jpeg', data: await blobToBase64(blob) } },
    ] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0, responseSchema: {
      type: 'OBJECT', properties: { riquadro_bottiglia: { type: 'ARRAY', items: { type: 'INTEGER' }, nullable: true } },
    } },
  }, { ...hooks, label: 'Ritaglio bottiglia', model: readModel() }, true);
  return JSON.parse(out.text).riquadro_bottiglia;
}

async function geminiQuick(blobs, hooks) {
  const parts = [{ text: QUICK_PROMPT }];
  for (const b of blobs) parts.push({ inline_data: { mime_type: 'image/jpeg', data: await blobToBase64(b) } });
  const out = await geminiFast({
    contents: [{ role: 'user', parts }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: quickSchema(), temperature: 0.1 },
  }, { ...hooks, label: 'Lettura etichetta', model: readModel() }, true);
  return JSON.parse(out.text);
}

function parseJsonText(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('Risposta non leggibile');
  return JSON.parse(text.slice(start, end + 1));
}

// Secondo passaggio: con i dati univoci del vino cerca su Google e compila il resto.
// La ricerca non si può combinare con lo schema JSON su tutti i modelli, quindi il JSON è chiesto nel testo.
// Ricerca con Tavily (piano gratuito, senza carta): restituisce già il testo delle pagine trovate,
// che Gemini legge senza usare la sua ricerca Google (non inclusa in tutti i piani gratuiti).
async function tavilySearch(query, country, log, cost) {
  log?.('Tavily · ricerca', query + (country ? `\n(siti preferiti: ${country})` : ''));
  const started = Date.now();
  let res;
  try {
    res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + settings.tavilyKey },
      body: JSON.stringify({ query, search_depth: 'basic', max_results: 8, include_answer: false, ...(country && { topic: 'general', country }) }),
    });
    // Se Tavily non accetta il paese si riprova senza.
    if (res.status === 400 && country) return tavilySearch(query, null, log, cost);
  } catch (e) {
    log?.('Tavily · errore di rete', `${e.message}\n(può essere un blocco CORS: Tavily non accetta chiamate dirette dal browser)`);
    throw new Error('Tavily non raggiungibile');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) log?.(`Tavily · errore ${res.status}`, JSON.stringify(json, null, 2));
  if (!res.ok) throw new Error('Tavily ' + res.status + ': ' + (json.detail?.error || json.detail || json.error || 'errore'));
  const results = (json.results || []).map((r) => ({ title: r.title || r.url, uri: r.url, content: (r.content || '').slice(0, 1500) }));
  log?.(`Tavily · ${results.length} risultati in ${((Date.now() - started) / 1000).toFixed(1)} s`,
    results.map((r, n) => `[${n + 1}] ${r.title}\n${r.uri}\n${r.content}`).join('\n\n') || '(nessuno)');
  // Le prime 1.000 ricerche del mese sono gratuite anche per chi paga Gemini.
  const usd = monthUsage().tavily >= 1000 ? TAVILY_USD : 0;
  addMonthUsage({ usd, tavily: 1 });
  cost?.({ step: 'Tavily', model: 'tavily', usd, searches: 1 });
  return results;
}

// Ordine in cui provare le ricerche: se una non è disponibile si passa alla successiva, fino ai soli dati di Gemini.
function searchPlan() {
  const tavily = settings.tavilyKey ? 'tavily' : null;
  const plans = {
    auto: [tavily || 'google', 'none'],
    google: ['google', tavily, 'none'],
    tavily: [tavily, 'none'],
    none: ['none'],
  };
  return (plans[settings.search] || plans.auto).filter(Boolean);
}

const SEARCH_NAME = { google: 'Google', tavily: 'Tavily' };

// La parola "vino" nella lingua del paese fa capire al motore che si tratta di vino
// (senza, "Pietta Kairos scheda tecnica prezzo" restituiva criptovalute e aziende omonime).
// country fa preferire a Tavily i siti di quel paese: produttore ed enoteche locali.
const SEARCH_LANG = [
  { match: /ital/i, word: 'vino', country: 'italy', window: 'quando berlo longevità drinking window' },
  { match: /franc/i, word: 'vin', country: 'france' },
  { match: /spagn|spain|españa/i, word: 'vino', country: 'spain' },
  { match: /argentin/i, word: 'vino', country: 'argentina' },
  { match: /cile|chile/i, word: 'vino', country: 'chile' },
  { match: /portog|portugal/i, word: 'vinho', country: 'portugal' },
  { match: /german|deutsch/i, word: 'Wein', country: 'germany' },
  { match: /austria|österr/i, word: 'Wein', country: 'austria' },
  { match: /svizzer|switz/i, word: 'vin Wein', country: 'switzerland' },
  { match: /stati uniti|\busa\b|america|california/i, word: 'wine', country: 'united states' },
  { match: /australia/i, word: 'wine', country: 'australia' },
  { match: /zelanda|zealand/i, word: 'wine', country: 'new zealand' },
  { match: /sudafrica|south africa/i, word: 'wine', country: 'south africa' },
];

function searchLang(data) {
  return SEARCH_LANG.find((l) => l.match.test(data.nazione || 'Italia')) || { word: 'wine' };
}

function searchQuery(data) {
  const who = data.produttore ? `"${data.produttore}"` : '';
  return [who, data.nome, data.denominazione, data.annata, searchLang(data).word].filter(Boolean).join(' ');
}

// Scarta i risultati che non nominano né il produttore né il vino: sono omonimi o pagine fuori tema.
function relevantResults(results, data) {
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const names = [data.produttore, data.nome].filter(Boolean).map(norm);
  if (!names.length) return results;
  return results.filter((r) => names.some((n) => norm(r.title + ' ' + r.uri + ' ' + r.content).includes(n)));
}

async function geminiDetails(data, hooks, mode) {
  const who = QUICK.map((f) => data[f.k]).filter(Boolean).join(', ');
  const keys = DETAILS.map((f) => `"${f.k}"`).join(', ');
  let intro = `Compila la scheda di questo vino: ${who}.`;
  let sources = [];
  if (mode === 'google') {
    intro = `Cerca su Google la scheda tecnica di questo vino: ${who}.${data.annata ? `
Cerca anche il momento migliore per berlo (finestra di consumo, "drinking window") dell'annata ${data.annata}.` : ''}
Cerca per esempio: ${searchQuery(data)} (includi sempre la parola "vino" nella lingua del paese di origine, altrimenti trovi pagine che non parlano di vino).
Preferisci il sito del produttore, poi enoteche e guide affidabili. Se l'annata specifica non si trova, usa la scheda più recente dello stesso vino.`;
  } else if (mode === 'tavily') {
    const lang = searchLang(data);
    const found = await tavilySearch(searchQuery(data), lang.country, hooks.log, hooks.cost);
    // Seconda ricerca solo con l'annata: le schede tecniche raramente dicono quando berlo, critici e guide sì.
    if (data.annata) {
      const more = await tavilySearch(`${searchQuery(data)} ${lang.window || 'drinking window'}`, null, hooks.log, hooks.cost).catch(() => []);
      found.push(...more.filter((r) => !found.some((f) => f.uri === r.uri)));
    }
    sources = relevantResults(found, data);
    if (sources.length < found.length) hooks.log?.(`Tavily · scartati ${found.length - sources.length} risultati che non nominano il vino`, '');
    intro = `Compila la scheda di questo vino: ${who}.
Usa i risultati di ricerca qui sotto, preferendo il sito del produttore. Se riguardano un altro vino o un'altra annata, tienine conto.
${sources.map((r, n) => `[${n + 1}] ${r.title} (${r.uri})\n${r.content}`).join('\n\n') || '(nessun risultato)'}`;
  }
  const prompt = `${intro}
Rispondi SOLO con un oggetto JSON con le chiavi ${keys}, "vino_trovato" (true/false) e "confermati" (elenco delle chiavi verificate su una fonte${mode === 'none' ? '; senza fonti è vuoto' : ''}).
"vitigni" e "caratteristiche" sono elenchi di stringhe; "gradazione" è un numero; "prezzo" è il prezzo medio in euro di una bottiglia da 0,75 l di questa annata in enoteca o negozio online in Italia (numero; una stima ragionevole va bene anche senza fonte esatta); "formato_ml" è un intero. Un dato che non conosci con sicurezza vale null.
Caratteristiche: solo se certe, per esempio biologico, biodinamico, naturale, senza solfiti aggiunti, non filtrato, dosaggio (brut nature, extra brut, brut…), residuo zuccherino (secco, amabile, dolce).
${data.annata
    ? `Momento migliore per bere l'annata ${data.annata}: "bere_dal" e "bere_entro" sono gli anni (interi) della finestra ideale, presi preferibilmente da produttore, critici o guide (drinking window); se le fonti non ne parlano stimali da tipo, denominazione e annata e non metterli in "confermati". "finestra_consumo" è una breve nota, per esempio "al massimo tra il 2027 e il 2032, regge fino al 2036".`
    : '"bere_dal", "bere_entro" e "finestra_consumo" valgono null: l\'annata non è nota.'}
"descrizione" al massimo due frasi. Rispondi in italiano.`;
  const { text, grounding } = await geminiFast({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    ...(mode === 'google' && { tools: [{ google_search: {} }] }),
    generationConfig: { temperature: 0.1 },
  }, {
    ...hooks,
    label: `Dettagli (${mode === 'none' ? 'senza ricerca' : SEARCH_NAME[mode]})`,
    model: detailsModel(),
  }, false);
  const result = parseJsonText(text);
  if (mode === 'google') {
    sources = (grounding?.groundingChunks || [])
      .map((c) => c.web).filter(Boolean)
      .map((w) => ({ title: w.title || w.uri, uri: w.uri }));
  }
  if (mode === 'none') result.confermati = [];
  return { result, sources: sources.map(({ title, uri }) => ({ title, uri })), mode };
}

// Cosa sta facendo l'app per ogni vino, mostrato nella lista.
const phases = new Map();
const PHASE_TEXT = {
  quick: 'Lettura etichetta…',
  details: 'Ricerca dettagli su Google…',
  detailsTavily: 'Ricerca dettagli sul web…',
  detailsOffline: 'Compilazione dettagli…',
};

function setPhase(id, phase) {
  if (phase) phases.set(id, phase);
  else phases.delete(id);
  scheduleRender();
}

async function recognize(id) {
  if (!settings.geminiKey) return;
  const wine = await getWine(id);
  let phase = null;
  const enter = (p) => { phase = p; setPhase(id, p); };
  // Durante l'attesa per il limite al minuto si mostra il conto alla rovescia, poi si torna alla fase in corso.
  const wait = (sec) => {
    const resume = phase;
    setPhase(id, `In attesa del limite di Gemini (${sec} s)…`);
    setTimeout(() => phase === resume && setPhase(id, resume), sec * 1000);
  };
  // Registro di debug dell'ultimo riconoscimento, visibile nella scheda.
  const log = (step, text) => updateWine(id, (w) => ({
    ...w,
    log: [...(w.log || []), { at: Date.now(), step, text: String(text ?? '').slice(0, 8000) }].slice(-60),
  }));
  const cost = (c) => updateWine(id, (w) => ({
    ...w,
    costs: [...(w.costs || []), { step: c.step, model: c.model, usd: c.usd, searches: c.searches }],
    spentUsd: (w.spentUsd || 0) + c.usd,
  }));
  const hooks = { wait, log, cost };
  await updateWine(id, (w) => ({ ...w, log: [], costs: [] }));
  log('Avvio', `Ricerca: ${settings.search} → ${searchPlan().join(' → ')} · modelli: lettura ${readModel()}, dettagli ${detailsModel()}`);
  try {
    let current = wine;
    if (wine.status !== 'details') {
      enter('quick');
      const { campi_incerti, e_un_vino, riquadro_bottiglia, ...quick } = await geminiQuick(wine.photos.filter((p) => !p.lost).map(photoBlob), hooks);
      if (riquadro_bottiglia) await applyCrop(id, riquadro_bottiglia);
      current = await updateWine(id, (w) => ({
        ...w,
        status: e_un_vino === false || !(quick.produttore || quick.nome) ? 'ok' : 'details',
        data: { ...(w.data || {}), ...quick, ...pickUserEdits(w) },
        uncertain: campi_incerti || [],
        notWine: e_un_vino === false,
        web: null,
        error: null,
      }));
      renamePhotos(id);
      if (current.status === 'ok') return;
    }
    try {
      let out;
      const skipped = [];
      for (const mode of searchPlan()) {
        enter(mode === 'none' ? 'detailsOffline' : mode === 'tavily' ? 'detailsTavily' : 'details');
        try {
          out = await geminiDetails(current.data, hooks, mode);
          break;
        } catch (e) {
          // Ricerca esaurita o non disponibile: si prova la successiva; i dati senza fonte restano in giallo.
          if (mode === 'none' || (mode === 'google' && ![400, 403, 429].includes(e.status))) throw e;
          skipped.push(`${SEARCH_NAME[mode]}: ${e.status === 429 ? 'limite del piano gratuito raggiunto' : e.message}`);
          log(`Ricerca ${SEARCH_NAME[mode]} saltata`, e.message);
        }
      }
      const { result, sources, mode } = out;
      const web = mode !== 'none';
      const confirmed = new Set(result.vino_trovato === false ? [] : result.confermati || []);
      await updateWine(id, (w) => {
        const data = { ...w.data };
        const uncertain = new Set(w.uncertain || []);
        for (const f of DETAILS) {
          if (f.drink && !data.annata) continue;
          const v = result[f.k];
          if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
          data[f.k] = v;
          if (!confirmed.has(f.k)) uncertain.add(f.k);
        }
        return {
          ...w,
          status: 'ok',
          data: { ...data, ...pickUserEdits(w) },
          uncertain: [...uncertain],
          web: web || skipped.length
            ? { provider: web ? SEARCH_NAME[mode] : null, found: result.vino_trovato !== false, confirmed: [...confirmed], sources, skipped, at: Date.now() }
            : null,
        };
      });
    } catch (e) {
      log('Errore dettagli', e.stack || e.message);
      await updateWine(id, { status: 'ok', web: { error: e.message, at: Date.now() } });
    }
  } catch (e) {
    log('Errore', e.stack || e.message);
    await updateWine(id, { status: 'error', error: e.message });
  } finally {
    log('Fine', '');
    setPhase(id, null);
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

async function addFiles(files) {
  if (!files.length) return;
  const groups = [];
  for (const f of files) {
    try { groups.push([await preparePhoto(f)]); } catch (e) { toast(e.message); }
  }
  await addPhotoGroups(groups);
}

// Ogni gruppo di foto già preparate diventa un vino.
async function addPhotoGroups(groups) {
  if (!groups.length) return;
  for (const photos of groups) {
    try {
      const wine = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        status: 'new',
        data: null,
        edited: [],
        quantita: 1,
        posizione: '',
        acquisto_data: todayIso(),
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
  else if (!driveToken()) toast('Foto salvate sul telefono. Accedi con Google per caricarle su Drive.');
}

// ---------- Più foto insieme: raggruppamento ----------

const grouping = { batch: 0, photos: [], groups: [], selected: null };

function renderGroups() {
  releaseUrls('group');
  const g = grouping;
  $('#group-list').innerHTML = g.groups.map((idx, gi) => `
    <li data-group="${gi}" class="${g.selected != null && !idx.includes(g.selected) ? 'target' : ''}">
      <span class="gnum">${gi + 1}</span>
      <div class="gphotos">${idx.map((i) => `<button type="button" class="gphoto${g.selected === i ? ' sel' : ''}" data-photo="${i}"><img src="${blobUrl(new Blob([g.photos[i].thumbBytes], { type: 'image/jpeg' }), 'group')}" alt="Foto ${i + 1}"></button>`).join('')}</div>
      <span class="gcount">${idx.length > 1 ? `${idx.length} foto, un vino` : '1 foto'}</span>
    </li>`).join('');
  const sel = g.selected != null;
  $('#group-hint').textContent = sel
    ? 'Tocca un altro vino per spostarci la foto, oppure "Separa" per metterla da sola.'
    : 'Le foto nella stessa riga diventano un solo vino. Tocca una foto per spostarla.';
  $('#btn-group-split').hidden = !sel;
  const n = g.groups.length;
  $('#btn-group-ok').textContent = `Aggiungi ${n} ${n === 1 ? 'vino' : 'vini'}`;
}

async function startGrouping(files) {
  const batch = ++grouping.batch;
  Object.assign(grouping, { photos: [], groups: [], selected: null });
  $('#group-status').textContent = 'Preparo le foto…';
  $('#group-list').innerHTML = '';
  $('#btn-group-ok').disabled = true;
  $('#dlg-group').returnValue = '';
  $('#dlg-group').showModal();
  for (const f of files) {
    try { grouping.photos.push(await preparePhoto(f)); } catch (e) { toast(e.message); }
  }
  if (batch !== grouping.batch) return;
  grouping.groups = grouping.photos.map((_, i) => [i]);
  renderGroups();
  $('#btn-group-ok').disabled = false;
  $('#group-status').textContent = 'Metti nella stessa riga le foto dello stesso vino, per esempio fronte e retro.';
}

function bindGrouping() {
  $('#group-list').addEventListener('click', (e) => {
    const g = grouping;
    const photo = e.target.closest('[data-photo]');
    const row = e.target.closest('[data-group]');
    if (!row) return;
    const gi = Number(row.dataset.group);
    if (g.selected == null) {
      if (photo) g.selected = Number(photo.dataset.photo);
    } else if (photo && Number(photo.dataset.photo) === g.selected) {
      g.selected = null;
    } else if (!g.groups[gi].includes(g.selected)) {
      // Sposta la foto scelta in questo vino.
      g.groups = g.groups.map((idx) => idx.filter((i) => i !== g.selected));
      g.groups[gi].push(g.selected);
      g.groups = g.groups.filter((idx) => idx.length);
      g.selected = null;
    } else if (photo) {
      g.selected = Number(photo.dataset.photo);
    }
    renderGroups();
  });
  $('#btn-group-split').addEventListener('click', () => {
    const g = grouping;
    if (g.selected == null) return;
    g.groups = g.groups.map((idx) => idx.filter((i) => i !== g.selected)).filter((idx) => idx.length);
    g.groups.push([g.selected]);
    g.selected = null;
    renderGroups();
  });
  $('#dlg-group').addEventListener('close', () => {
    const g = grouping;
    g.batch++;
    releaseUrls('group');
    if ($('#dlg-group').returnValue === 'ok') addPhotoGroups(g.groups.map((idx) => idx.map((i) => g.photos[i])));
    Object.assign(g, { photos: [], groups: [], selected: null });
  });
}

// ---------- Doppioni ----------

// Due vini con stesso produttore, nome e annata sono probabilmente la stessa bottiglia inserita due volte.
const norm = (v) => String(v ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
function twinKey(w) {
  const d = w.data || {};
  if (!d.produttore || !(d.nome || d.denominazione) || w.status === 'new') return null;
  return [norm(d.produttore), norm(d.nome || d.denominazione), d.annata || ''].join('|');
}
function findTwin(w, wines) {
  const k = twinKey(w);
  if (!k) return null;
  return wines.find((x) => x.id !== w.id && twinKey(x) === k && !(w.notTwin || []).includes(x.id) && !(x.notTwin || []).includes(w.id)) || null;
}

// Unisce nel vino inserito per primo: bottiglie sommate, foto e note insieme, bevute spostate.
async function mergeWines(aId, bId) {
  const [a, b] = [await getWine(aId), await getWine(bId)];
  if (!a || !b) return;
  const [keep, drop] = a.createdAt <= b.createdAt ? [a, b] : [b, a];
  await updateWine(keep.id, (cur) => ({
    ...cur,
    quantita: (Number(cur.quantita) || 0) + (Number(drop.quantita) || 0),
    photos: [...cur.photos, ...drop.photos],
    nota: [cur.nota, drop.nota].filter(Boolean).join('\n'),
    data: { ...(drop.data || {}), ...Object.fromEntries(Object.entries(cur.data || {}).filter(([, v]) => v != null && v !== '')) },
    prezzo_pagato: cur.prezzo_pagato ?? drop.prezzo_pagato ?? null,
    acquisto_luogo: cur.acquisto_luogo || drop.acquisto_luogo || '',
  }));
  for (const d of await allDrinks()) {
    if (d.wineId === drop.id) await putDrink({ ...d, wineId: keep.id });
  }
  await deleteWine(drop.id);
  scheduleRender();
  return keep.id;
}

// ---------- Interfaccia ----------

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Gli URL della lista e del dettaglio si liberano separatamente, così un aggiornamento della lista non rompe il dettaglio aperto.
const objectUrls = { list: [], dialog: [], drink: [], group: [] };
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

function toast(msg, onClick) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  if (onClick) el.addEventListener('click', () => { el.remove(); onClick(); });
  document.body.append(el);
  setTimeout(() => el.remove(), onClick ? 8000 : 4000);
}

// Con più foto (fronte e retro) si vedono affiancate, senza dover scorrere.
function renderHero(photos) {
  const hero = $('#wine-photos');
  hero.classList.toggle('two', photos.length === 2);
  hero.classList.toggle('many', photos.length > 2);
  hero.innerHTML = photos.map((p) => imgTag(p, heroBlob, 'dialog')).join('');
}

function showReleaseNotes() {
  $('#notes-list').innerHTML = RELEASE_NOTES.map((r) => `
    <h3>v${esc(r.v)}${r.v === APP_VERSION ? ' (questa)' : ''}</h3>
    <ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`).join('');
  $('#dlg-notes').showModal();
}

// Dopo un aggiornamento un avviso porta alle novità (una volta per versione).
function announceUpdate() {
  let seen = null;
  try { seen = localStorage.getItem('cantina.seenVersion'); localStorage.setItem('cantina.seenVersion', APP_VERSION); } catch {}
  if (seen && seen !== APP_VERSION) toast(`Aggiornata alla v${APP_VERSION} · tocca per le novità`, showReleaseNotes);
}

function wineTitle(w) {
  const d = w.data || {};
  return [d.produttore, d.nome].filter(Boolean).join(' · ') || 'Vino senza nome';
}

// Sopra i 100 € senza centesimi; sotto, centesimi solo se ci sono (24 €, 24,50 €).
function formatPrice(eur) {
  const n = Number(eur);
  const max = n >= 100 ? 0 : 2;
  const min = Number.isInteger(n) ? 0 : max;
  return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: min, maximumFractionDigits: max });
}

// Nella lista: il vino e l'annata in grassetto, sotto produttore e denominazione.
function listTitle(w) {
  const d = w.data || {};
  const name = d.nome || d.denominazione || d.produttore;
  return name ? [name, d.annata].filter(Boolean).join(' ') : 'Vino senza nome';
}

function listSubtitle(w) {
  const d = w.data || {};
  const name = d.nome || d.denominazione || d.produttore;
  return [d.produttore !== name && d.produttore, d.denominazione !== name && d.denominazione, w.posizione]
    .filter(Boolean).join(' · ');
}

// Colore come simbolo: calice pieno del colore del vino; per le bollicine un calice a tulipano con le bollicine.
const COLOR_NAMES = { rosso: 'Rosso', bianco: 'Bianco', rosato: 'Rosato', orange: 'Orange' };
const isBubbly = (d) => /spumante|frizzante|rifermentato/.test(d?.stile || '');
function colorIcon(d, size = 'sm') {
  const c = COLOR_NAMES[d?.colore] ? d.colore : 'ignoto';
  const title = [COLOR_NAMES[d?.colore] || 'Colore non indicato', isBubbly(d) && 'con bollicine'].filter(Boolean).join(', ');
  const shape = isBubbly(d)
    ? '<path class="wine" d="M8.3 10h7.4c0 2.4-.4 4.2-1.4 5.3a2.9 2.9 0 0 1-4.6 0c-1-1.1-1.4-2.9-1.4-5.3z"/><path class="glass" d="M8 7h8c.4 3.6.1 6.7-1.3 8.4a3.4 3.4 0 0 1-5.4 0C7.9 13.7 7.6 10.6 8 7zM12 16.6V21M8.8 21.6h6.4"/><circle class="fizz" cx="10.3" cy="4.6" r="1.15"/><circle class="fizz" cx="13.9" cy="3.2" r="1.45"/><circle class="fizz" cx="12" cy="0.9" r=".8"/><circle class="bub" cx="11" cy="12.3" r=".8"/><circle class="bub" cx="13" cy="11.2" r=".7"/>'
    : '<path class="wine" d="M7.5 8.5h9c-.4 3.8-2.2 6-4.5 6s-4.1-2.2-4.5-6z"/><path class="glass" d="M7 3h10c0 7-2 11.7-5 11.7S7 10 7 3zM12 14.7V20M8.5 21h7"/>';
  return `<svg class="cicon ${size} c-${c}" viewBox="0 0 24 24" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${shape}</svg>`;
}

// Prezzo mostrato: quello pagato se c'è, altrimenti la stima trovata sul web (con ~).
const paidOrEstimate = (w) => (Number(w.prezzo_pagato) > 0 ? Number(w.prezzo_pagato) : Number(w.data?.prezzo) > 0 ? Number(w.data.prezzo) : null);

// Stato rispetto alla finestra di consumo, solo per i vini con annata.
function drinkState(d) {
  d = d || {};
  const from = Number(d.bere_dal) || null;
  const to = Number(d.bere_entro) || null;
  if (!d.annata || (!from && !to)) return null;
  const year = new Date().getFullYear();
  if (from && year < from) return { k: 'wait', text: 'Da aspettare', title: `dal ${from}` };
  if (to && year > to) return { k: 'over', text: 'Oltre', title: `al meglio entro il ${to}` };
  if (to && year >= to - 1) return { k: 'soon', text: 'Da bere presto', title: `entro il ${to}` };
  return { k: 'ok', text: 'Pronto', title: to ? `entro il ${to}` : '' };
}

function wineBadges(w) {
  const b = [];
  if (phases.has(w.id)) b.push(PHASE_TEXT[phases.get(w.id)] || phases.get(w.id));
  else if (['new', 'details'].includes(w.status) && settings.geminiKey) b.push('In coda…');
  if (w.status === 'new' && !settings.geminiKey) b.push('Da riconoscere');
  if (w.status === 'error') b.push('Errore Gemini');
  if (w.notWine) b.push('Non sembra un vino');
  if (w.photos.some((p) => !p.driveId)) b.push('Drive in attesa');
  return b;
}

// ---------- Ordinamento della cantina ----------

const COLOR_ORDER = ['rosso', 'bianco', 'rosato', 'orange'];
const byNumber = (get, dir) => (a, b) => {
  const x = Number(get(a)) || null;
  const y = Number(get(b)) || null;
  if (x === y) return b.createdAt - a.createdAt;
  if (x == null) return 1;
  if (y == null) return -1;
  return (x - y) * dir;
};
const SORTS = {
  recenti: (a, b) => b.createdAt - a.createdAt,
  nome: (a, b) => listTitle(a).localeCompare(listTitle(b), 'it'),
  annata: byNumber((w) => w.data?.annata, 1),
  prezzo: byNumber((w) => paidOrEstimate(w), -1),
  bere: byNumber((w) => w.data?.annata && w.data?.bere_entro, 1),
  colore: (a, b) => {
    const i = (w) => { const n = COLOR_ORDER.indexOf(w.data?.colore); return n < 0 ? COLOR_ORDER.length : n; };
    return i(a) - i(b) || b.createdAt - a.createdAt;
  },
};

function sortKey() {
  try { return SORTS[localStorage.getItem('cantina.sort')] ? localStorage.getItem('cantina.sort') : 'recenti'; } catch { return 'recenti'; }
}

let showFinished = false;
let swiping = false;
let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    // Durante uno swipe la lista non si ridisegna, altrimenti la riga scapperebbe dal dito.
    if (swiping) return scheduleRenderAfterSwipe();
    render();
  });
}
let renderAfterSwipe = false;
function scheduleRenderAfterSwipe() { renderAfterSwipe = true; }

// ---------- Filtri ----------

const FILTER_KEYS = ['colore', 'stato', 'zona', 'prezzo', 'negozio'];
const PRICE_BANDS = { basso: ['fino a 15 €', 0, 15], medio: ['15–40 €', 15, 40], alto: ['oltre 40 €', 40, Infinity] };
const STATE_NAMES = { ok: 'Pronto', soon: 'Da bere presto', wait: 'Da aspettare', over: 'Oltre', none: 'Senza finestra' };

function loadFilters() {
  try {
    const f = JSON.parse(localStorage.getItem('cantina.filters') || '{}');
    return Object.fromEntries(FILTER_KEYS.map((k) => [k, Array.isArray(f[k]) ? f[k] : []]));
  } catch { return Object.fromEntries(FILTER_KEYS.map((k) => [k, []])); }
}
let filters = loadFilters();
function saveFilters() {
  try { localStorage.setItem('cantina.filters', JSON.stringify(filters)); } catch {}
}
const filterCount = () => FILTER_KEYS.reduce((n, k) => n + filters[k].length, 0);

const wineZone = (w) => w.data?.regione || w.data?.nazione || '';
const wineColor = (w) => (isBubbly(w.data) ? 'bollicine' : w.data?.colore || '');
const wineState = (w) => drinkState(w.data)?.k || 'none';

function passes(w, skip) {
  const f = filters;
  if (skip !== 'colore' && f.colore.length && !f.colore.includes(wineColor(w))) return false;
  if (skip !== 'stato' && f.stato.length && !f.stato.includes(wineState(w))) return false;
  if (skip !== 'zona' && f.zona.length && !f.zona.includes(wineZone(w))) return false;
  if (skip !== 'negozio' && f.negozio.length && !f.negozio.includes(w.acquisto_luogo || '')) return false;
  if (skip !== 'prezzo' && f.prezzo.length) {
    const p = paidOrEstimate(w);
    if (p == null || !f.prezzo.some((b) => p >= PRICE_BANDS[b][1] && p < PRICE_BANDS[b][2])) return false;
  }
  return true;
}

let lastWines = [];
function renderFilters() {
  const wines = lastWines.filter((w) => Number(w.quantita) > 0);
  const chips = (k, options) => options.map(([v, label]) => {
    const on = filters[k].includes(v);
    return `<button type="button" class="chip${on ? ' on' : ''}" data-k="${k}" data-v="${esc(v)}">${label}</button>`;
  }).join('');
  const uniq = (get) => [...new Set(wines.map(get).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'it'));
  const colors = [['rosso', 'Rosso'], ['bianco', 'Bianco'], ['rosato', 'Rosato'], ['orange', 'Orange'], ['bollicine', 'Bollicine']]
    .filter(([v]) => filters.colore.includes(v) || wines.some((w) => wineColor(w) === v))
    .map(([v, l]) => [v, `${colorIcon(v === 'bollicine' ? { stile: 'spumante', colore: 'bianco' } : { colore: v })}${l}`]);
  const zones = uniq(wineZone);
  const shops = uniq((w) => w.acquisto_luogo);
  $('#filter-body').innerHTML = `
    <span class="label">Colore</span><div class="chips">${chips('colore', colors)}</div>
    <span class="label">Quando berlo</span><div class="chips">${chips('stato', Object.entries(STATE_NAMES).filter(([v]) => filters.stato.includes(v) || wines.some((w) => wineState(w) === v)))}</div>
    ${zones.length ? `<span class="label">Provenienza</span><div class="chips">${chips('zona', zones.map((z) => [z, esc(z)]))}</div>` : ''}
    <span class="label">Prezzo</span><div class="chips">${chips('prezzo', Object.entries(PRICE_BANDS).map(([v, b]) => [v, b[0]]))}</div>
    ${shops.length ? `<span class="label">Comprato da</span><div class="chips">${chips('negozio', shops.map((z) => [z, esc(z)]))}</div>` : ''}`;
  const shown = wines.filter((w) => passes(w)).length;
  $('#btn-filter-apply').textContent = `Mostra ${shown} ${shown === 1 ? 'vino' : 'vini'}`;
}

async function render() {
  const wines = (await allWines()).sort(SORTS[sortKey()]);
  lastWines = wines;
  releaseUrls('list');
  // Il registro della scheda aperta si aggiorna mentre il riconoscimento procede.
  if (editingId && $('#dlg-wine').open) {
    const open = wines.find((x) => x.id === editingId);
    if (open) renderLog(open);
  }
  const q = $('#search').value.trim().toLowerCase();
  const matching = q
    ? wines.filter((w) => [JSON.stringify(w.data || {}), w.posizione, w.nota, w.acquisto_luogo].join(' ').toLowerCase().includes(q))
    : wines;
  // I vini finiti restano nell'app (diario, ricerca) ma non nella cantina, se non si chiede di vederli.
  const finished = matching.filter((w) => !(Number(w.quantita) > 0));
  const filtered = matching.filter((w) => passes(w));
  const shown = q || showFinished ? filtered : filtered.filter((w) => Number(w.quantita) > 0);
  const nf = filterCount();
  $('#btn-filters').classList.toggle('on', nf > 0);
  $('#filter-count').textContent = nf || '';
  const inCellar = wines.filter((w) => Number(w.quantita) > 0);
  const bottles = inCellar.reduce((n, w) => n + (Number(w.quantita) || 0), 0);
  const priced = inCellar.filter((w) => paidOrEstimate(w));
  const value = priced.reduce((n, w) => n + paidOrEstimate(w) * (Number(w.quantita) || 0), 0);
  $('#usage').textContent = [
    `${bottles} ${bottles === 1 ? 'bottiglia' : 'bottiglie'}`,
    `${inCellar.length} vini`,
    value ? `valore ~${formatPrice(value)}${priced.length < inCellar.length ? ` (prezzo noto per ${priced.length})` : ''}` : '',
  ].filter(Boolean).join(' · ');
  $('#wine-list').innerHTML = shown.map((w) => {
    const state = drinkState(w.data);
    const twin = findTwin(w, wines);
    const p = paidOrEstimate(w);
    const price = p ? `${Number(w.prezzo_pagato) > 0 ? '' : '~'}${formatPrice(p)}` : '';
    return `
    <li data-id="${w.id}" class="${Number(w.quantita) > 0 ? '' : 'finished'}">
      <div class="row-under">Bevuta</div>
      <div class="row">
        ${w.photos?.[0] ? imgTag(w.photos[0], thumbBlob, 'list') : `<span class="dot ${esc(w.data?.colore || '')}"></span>`}
        <div class="meta">
          <strong>${colorIcon(w.data)}${esc(listTitle(w))}</strong>
          <small>${esc(listSubtitle(w))}</small>
          ${w.nota ? `<small class="note">${esc(w.nota)}</small>` : ''}
          ${[...wineBadges(w), twin && 'Doppione? Apri per unire'].filter(Boolean).map((b) => `<span class="badge">${esc(b)}</span>`).join('')}
        </div>
        <div class="right">
          <span class="qty">${price ? `<span class="price">${esc(price)}</span> ` : ''}×${Number(w.quantita) || 0}</span>
          ${state ? `<span class="pill ${state.k}" title="${esc(state.title)}">${esc(state.text)}</span>` : ''}
        </div>
      </div>
    </li>`;
  }).join('') || `<li class="empty">${q || nf ? 'Nessun vino trovato con questa ricerca o questi filtri.' : 'Nessun vino in cantina. Tocca la fotocamera in basso per aggiungerne uno.'}</li>`;
  $('#btn-finished').hidden = q || !finished.length;
  $('#btn-finished').textContent = showFinished ? 'Nascondi i vini finiti' : `Mostra i vini finiti (${finished.length})`;

  const pending = wines.filter((w) => w.status !== 'ok' || w.photos.some((p) => !p.driveId));
  $('#pending-section').hidden = pending.length === 0;
  const noDrive = wines.reduce((n, w) => n + w.photos.filter((p) => !p.driveId).length, 0);
  const noAi = wines.filter((w) => w.status !== 'ok').length;
  $('#pending-hint').textContent = [
    noDrive ? `${noDrive} foto da caricare su Drive` : '',
    noAi ? `${noAi} vini da riconoscere` : '',
  ].filter(Boolean).join(' · ');
  await renderDiary(wines);
  renderVintages(wines);
  if ($('#dlg-filters').open) renderFilters();
}

// ---------- Annate ----------

function renderVintages(wines) {
  const rows = wines.filter((w) => Number(w.quantita) > 0 && drinkState(w.data))
    .map((w) => {
      const d = w.data;
      const from = Number(d.bere_dal) || null;
      const to = Number(d.bere_entro) || null;
      return { w, from: from || to - 3, to: to || from + 6, open: !to, state: drinkState(d) };
    })
    .sort((a, b) => a.to - b.to || a.from - b.from);
  const missing = wines.filter((w) => Number(w.quantita) > 0 && !drinkState(w.data)).length;
  const now = new Date().getFullYear() + new Date().getMonth() / 12;
  if (!rows.length) {
    $('#vintages').innerHTML = '<p class="hint empty">Ancora nessun vino con le date per berlo. Compaiono qui i vini con annata, quando la ricerca trova da quando e fino a quando berli.</p>';
    $('#vintage-axis').innerHTML = '';
    $('#vintage-summary').textContent = '';
    return;
  }
  const lo = Math.floor(Math.min(now, ...rows.map((r) => r.from))) - 1;
  const hi = Math.ceil(Math.max(now, ...rows.map((r) => r.to))) + 1;
  const pos = (y) => `${((y - lo) / (hi - lo) * 100).toFixed(2)}%`;
  const step = hi - lo > 24 ? 10 : 5;
  const ticks = [];
  for (let y = Math.ceil(lo / step) * step; y <= hi; y += step) if (Math.abs(y - now) > 1.6) ticks.push(y);
  const soon = rows.filter((r) => r.state.k === 'soon').length;
  const over = rows.filter((r) => r.state.k === 'over').length;
  $('#vintage-summary').textContent = [`${rows.length} vini`, soon && `${soon} da bere presto`, over && `${over} oltre il momento migliore`, missing && `${missing} senza date`].filter(Boolean).join(' · ');
  $('#vintages').innerHTML = rows.map((r) => `
    <li data-id="${r.w.id}">
      <div class="vname">${colorIcon(r.w.data)}<span><b>${esc(listTitle(r.w))}</b><small>${esc(r.w.data.produttore || '')} · ×${Number(r.w.quantita)}</small></span></div>
      <div class="lane"><span class="bar ${r.state.k}${r.open ? ' open' : ''}" style="left:${pos(r.from)};width:calc(${pos(r.to)} - ${pos(r.from)})" title="${r.from}–${r.to}"></span><i class="now" style="left:${pos(now)}"></i></div>
    </li>`).join('');
  $('#vintage-axis').innerHTML = ticks.map((y) => `<span style="left:${pos(y)}">${y}</span>`).join('') + `<i class="now" style="left:${pos(now)}"><b>oggi</b></i>`;
}

// ---------- Viste ----------

const VIEW_TITLES = { cellar: 'La mia cantina', diary: 'Diario', vintages: 'Annate' };

function showView(view) {
  for (const v of Object.keys(VIEW_TITLES)) $(`#view-${v}`).hidden = v !== view;
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.dataset.view === view));
  $('#view-title').textContent = VIEW_TITLES[view];
  window.scrollTo(0, 0);
}

// ---------- Swipe = bevuta ----------

function bindSwipe() {
  const list = $('#wine-list');
  let row = null;
  let x0 = 0;
  let y0 = 0;
  let dx = 0;
  let locked = null; // 'x' quando il gesto è orizzontale, 'y' se è uno scorrimento della pagina
  let moved = false;

  list.addEventListener('pointerdown', (e) => {
    const li = e.target.closest('li[data-id]');
    if (!li || li.classList.contains('finished') || e.button > 0) return;
    row = li.querySelector('.row');
    x0 = e.clientX;
    y0 = e.clientY;
    dx = 0;
    locked = null;
    moved = false;
    row.classList.remove('anim');
  });
  list.addEventListener('pointermove', (e) => {
    if (!row) return;
    const mx = e.clientX - x0;
    const my = e.clientY - y0;
    if (!locked && Math.hypot(mx, my) > 8) {
      locked = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (locked === 'x') { swiping = true; moved = true; row.setPointerCapture?.(e.pointerId); }
    }
    if (locked !== 'x') return;
    dx = Math.min(0, Math.max(-160, mx));
    row.style.transform = `translateX(${dx}px)`;
    row.parentElement.classList.toggle('armed', dx < -80);
  });
  const end = () => {
    if (!row) return;
    const li = row.parentElement;
    row.classList.add('anim');
    row.style.transform = '';
    li.classList.remove('armed');
    const id = li.dataset.id;
    const drink = locked === 'x' && dx < -80;
    row = null;
    swiping = false;
    if (renderAfterSwipe) { renderAfterSwipe = false; setTimeout(scheduleRender, 260); }
    if (drink) drinkFromCellar(id);
  };
  list.addEventListener('pointerup', end);
  list.addEventListener('pointercancel', end);
  // Un tocco apre la scheda, uno swipe no.
  list.addEventListener('click', (e) => {
    if (moved) { moved = false; return; }
    const li = e.target.closest('li[data-id]');
    if (li) openWine(li.dataset.id);
  });
}

// ---------- Bevute e diario ----------

const todayIso = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

// Fasce indicative accanto al voto in centesimi, come nella scheda AIS.
function scoreBand(v) {
  if (v == null) return '';
  return v >= 90 ? 'eccellente' : v >= 80 ? 'ottimo' : v >= 70 ? 'buono' : v >= 60 ? 'accettabile' : 'non mi è piaciuto';
}

function wineSnapshot(w) {
  const d = w.data || {};
  const main = d.nome || d.denominazione || d.produttore;
  return { nome: [listTitle(w), d.produttore !== main && d.produttore].filter(Boolean).join(' · '), colore: d.colore || null, stile: d.stile || null };
}

async function drinkFromCellar(id) {
  const w = await getWine(id);
  if (!w) return;
  if (!(Number(w.quantita) > 0)) return toast('Non ci sono più bottiglie di questo vino.');
  await updateWine(id, (cur) => ({ ...cur, quantita: Math.max(0, (Number(cur.quantita) || 0) - 1) }));
  const drink = {
    id: crypto.randomUUID(),
    wineId: id,
    fromCellar: true,
    ...wineSnapshot(w),
    data: todayIso(),
    dove: 'casa',
    locale: '',
    prezzo: null,
    voto: null,
    note: '',
    createdAt: Date.now(),
  };
  await putDrink(drink);
  scheduleRender();
  openDrink(drink, { fresh: true });
}

async function undoDrink(drink) {
  await deleteDrink(drink.id);
  if (drink.fromCellar && drink.wineId) {
    await updateWine(drink.wineId, (cur) => ({ ...cur, quantita: (Number(cur.quantita) || 0) + 1 }));
  }
  scheduleRender();
}

// Foglio della bevuta. "fresh": appena segnata dalla cantina; senza id: nuova bevuta scritta a mano.
const drinkEdit = { drink: null, fresh: false, saved: false, scoreSet: false };

async function openDrink(drink, { fresh = false } = {}) {
  const isNew = !drink.id;
  drinkEdit.drink = drink;
  drinkEdit.fresh = fresh;
  drinkEdit.scoreSet = drink.voto != null;
  const form = $('#drink-form');
  const wine = drink.wineId ? await getWine(drink.wineId) : null;
  releaseUrls('drink');
  $('#drink-thumb').innerHTML = wine?.photos?.[0] ? imgTag(wine.photos[0], thumbBlob, 'drink') : '';
  $('#drink-thumb').hidden = !wine?.photos?.[0];
  $('#drink-title').textContent = isNew ? 'Nuova bevuta' : drink.nome || 'Bevuta';
  $('#drink-sub').textContent = fresh
    ? `Segnata ora · ${Number(wine?.quantita) > 0 ? `ne restano ${wine.quantita}` : 'era l\'ultima bottiglia'}`
    : drink.fromCellar ? 'Dalla cantina' : '';
  $('#drink-name').hidden = !!drink.wineId;
  form.elements.nome.value = drink.nome || '';
  form.elements.dove.value = drink.dove || 'casa';
  form.elements.locale.value = drink.locale || '';
  form.elements.prezzo.value = drink.prezzo ?? '';
  form.elements.data.value = drink.data || todayIso();
  form.elements.voto.value = drink.voto ?? 80;
  form.elements.note.value = drink.note || '';
  $('#btn-drink-delete').hidden = isNew;
  $('#btn-drink-delete').textContent = drink.fromCellar ? 'Annulla bevuta' : 'Elimina';
  syncDrinkForm();
  $('#dlg-drink').returnValue = '';
  $('#dlg-drink').showModal();
}

function syncDrinkForm() {
  const form = $('#drink-form');
  $('#drink-out').hidden = form.elements.dove.value !== 'fuori';
  const v = drinkEdit.scoreSet ? Number(form.elements.voto.value) : null;
  $('#score-out').textContent = v ?? '—';
  $('#score-band').textContent = v == null ? 'trascina per votare' : scoreBand(v);
  $('#score').classList.toggle('unset', v == null);
  $('#score-clear').hidden = v == null;
}

function readDrinkForm(drink) {
  const f = $('#drink-form').elements;
  const price = Number(String(f.prezzo.value).replace(',', '.'));
  const out = f.dove.value === 'fuori';
  return {
    ...drink,
    id: drink.id || crypto.randomUUID(),
    createdAt: drink.createdAt || Date.now(),
    nome: drink.wineId ? drink.nome : f.nome.value.trim(),
    dove: f.dove.value || 'casa',
    locale: out ? f.locale.value.trim() : '',
    prezzo: out && f.prezzo.value.trim() && Number.isFinite(price) ? price : null,
    data: f.data.value || todayIso(),
    voto: drinkEdit.scoreSet ? Number(f.voto.value) : null,
    note: f.note.value.trim(),
  };
}

function bindDrinkSheet() {
  const form = $('#drink-form');
  form.addEventListener('change', syncDrinkForm);
  $('#score').addEventListener('input', () => { drinkEdit.scoreSet = true; syncDrinkForm(); });
  $('#score').addEventListener('pointerdown', () => { drinkEdit.scoreSet = true; syncDrinkForm(); });
  $('#score-clear').addEventListener('click', () => { drinkEdit.scoreSet = false; syncDrinkForm(); });
  $('#btn-drink-delete').addEventListener('click', async () => {
    const drink = drinkEdit.drink;
    drinkEdit.drink = null;
    $('#dlg-drink').close();
    await undoDrink(drink);
    toast(drink.fromCellar ? 'Bevuta annullata: la bottiglia è tornata in cantina.' : 'Bevuta eliminata.');
  });
  $('#dlg-drink').addEventListener('close', async () => {
    const drink = drinkEdit.drink;
    drinkEdit.drink = null;
    releaseUrls('drink');
    if (!drink) return;
    if ($('#dlg-drink').returnValue === 'save') {
      const next = readDrinkForm(drink);
      if (!next.nome) return toast('Scrivi il nome del vino per salvare la bevuta.');
      await putDrink(next);
      scheduleRender();
      if (drinkEdit.fresh) toast(`${next.nome} nel diario · tocca per annullare`, () => undoDrink(next));
    } else if (drinkEdit.fresh) {
      // Chiuso senza salvare: la bevuta resta (senza voto), con la possibilità di annullarla.
      toast(`${drink.nome} bevuta · tocca per annullare`, () => undoDrink(drink));
    }
  });
}

const DAY_FMT = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
const MONTH_FMT = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });

function dayLabel(iso) {
  const today = todayIso();
  if (iso === today) return 'Oggi';
  const y = new Date(Date.now() - 864e5);
  if (iso === new Date(y.getTime() - y.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) return 'Ieri';
  const s = DAY_FMT.format(new Date(iso + 'T12:00:00'));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function renderDiary(wines) {
  const drinks = (await allDrinks()).sort((a, b) => b.data.localeCompare(a.data) || b.createdAt - a.createdAt);
  const byId = new Map(wines.map((w) => [w.id, w]));
  const month = todayIso().slice(0, 7);
  const thisMonth = drinks.filter((d) => d.data.startsWith(month));
  const votes = thisMonth.filter((d) => d.voto != null);
  const m = MONTH_FMT.format(new Date());
  $('#month-summary').textContent = drinks.length
    ? `${m.charAt(0).toUpperCase() + m.slice(1)}: ${thisMonth.length} ${thisMonth.length === 1 ? 'bevuta' : 'bevute'}` +
      `${thisMonth.some((d) => d.dove === 'fuori') ? ` · ${thisMonth.filter((d) => d.dove === 'fuori').length} fuori` : ''}` +
      `${votes.length ? ` · media ${Math.round(votes.reduce((n, d) => n + d.voto, 0) / votes.length)}` : ''}`
    : '';
  $('#month-summary').hidden = !drinks.length;
  let html = '';
  let day = null;
  for (const d of drinks) {
    if (d.data !== day) {
      if (day) html += '</ul>';
      day = d.data;
      html += `<h3 class="day">${esc(dayLabel(day))}</h3><ul class="entries">`;
    }
    const wine = d.wineId ? byId.get(d.wineId) : null;
    const where = d.dove === 'fuori'
      ? ['Fuori', d.locale, d.prezzo != null && formatPrice(d.prezzo)].filter(Boolean).join(' · ')
      : `A casa${d.fromCellar ? ' · dalla cantina' : ''}`;
    // Stessa targhetta della cantina (foto, calice, nome, produttore) più le informazioni della bevuta.
    const data = wine?.data || { colore: d.colore, stile: d.stile };
    const title = wine ? listTitle(wine) : d.nome || 'Vino';
    const sub = wine ? listSubtitle({ ...wine, posizione: '' }) : '';
    html += `
      <li data-drink="${d.id}">
        <div class="row">
          ${wine?.photos?.[0] ? imgTag(wine.photos[0], thumbBlob, 'list') : `<span class="dot ${esc(d.colore || '')}"></span>`}
          <div class="meta">
            <strong>${colorIcon(data)}${esc(title)}</strong>
            ${sub ? `<small>${esc(sub)}</small>` : ''}
            <small class="where">${esc(where)}</small>
            ${d.note ? `<small class="note">${esc(d.note)}</small>` : ''}
          </div>
          <div class="right">
            ${d.voto != null ? `<span class="vote">${d.voto}</span><span class="vote-band">${esc(scoreBand(d.voto))}</span>` : '<span class="vote-band">senza voto</span>'}
          </div>
        </div>
      </li>`;
  }
  if (day) html += '</ul>';
  $('#diary').innerHTML = html || '<p class="hint empty">Ancora nessuna bevuta. Scorri un vino della cantina verso sinistra, oppure aggiungi qui sopra quello che hai bevuto.</p>';
}

let editingId = null;

function logText(w) {
  return (w.log || []).map((e) => `[${new Date(e.at).toLocaleTimeString('it-IT')}] ${e.step}${e.text ? '\n' + e.text : ''}`).join('\n\n');
}

function renderLog(w, note = '') {
  $('#wine-log').innerHTML = (note ? `<p class="hint">${esc(note)}</p>` : '') + ((w.log || []).length
    ? w.log.map((e) => `<div class="log-entry"><b>${esc(new Date(e.at).toLocaleTimeString('it-IT'))} · ${esc(e.step)}</b>${e.text ? `<pre>${esc(e.text)}</pre>` : ''}</div>`).join('')
    : '<p class="hint">Nessun registro: tocca "Riconosci di nuovo" per generarlo.</p>');
}

// Scheda in sola lettura, a blocchi: in cantina, quando berlo, il vino, in tavola. I campi da modificare stanno in fondo.
const kvRows = (rows) => rows.filter((r) => r[1]).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
const joinList = (v) => (Array.isArray(v) ? v.join(', ') : v) || '';

function renderWineHead(w) {
  const d = w.data || {};
  const main = d.nome || d.denominazione || d.produttore;
  $('#wine-name').textContent = listTitle(w);
  $('#wine-sub').textContent = [d.produttore !== main && d.produttore, d.denominazione !== main && d.denominazione].filter(Boolean).join(' · ');

  $('#qty-out').textContent = Number(w.quantita) || 0;
  const price = paidOrEstimate(w);
  const paid = Number(w.prezzo_pagato) > 0;
  const bought = [w.acquisto_luogo, w.acquisto_data && new Date(w.acquisto_data + 'T12:00:00').toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })].filter(Boolean).join(', ');
  $('#wine-kv').innerHTML = kvRows([
    ['Comprato', bought],
    [paid ? 'Pagato' : 'Prezzo stimato', price && `${formatPrice(price)} a bottiglia${Number(w.quantita) > 1 ? ` · valore ${formatPrice(price * w.quantita)}` : ''}`],
    ['Prezzo sul web', paid && Number(d.prezzo) > 0 && `~${formatPrice(d.prezzo)}`],
    ['Posizione', w.posizione],
    ['Aggiunto il', w.createdAt && new Date(w.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })],
  ]);

  const state = drinkState(d);
  const from = Number(d.bere_dal) || null;
  const to = Number(d.bere_entro) || null;
  if (state) {
    const year = new Date().getFullYear() + new Date().getMonth() / 12;
    const lo = Math.floor(Math.min(from || to - 4, year) - 1);
    const hi = Math.ceil(Math.max(to || from + 4, year) + 1);
    const pos = (y) => `${((y - lo) / (hi - lo) * 100).toFixed(1)}%`;
    const a = from || lo;
    const b = to || hi;
    const ticks = [lo, Math.round((lo * 2 + hi) / 3), Math.round((lo + hi * 2) / 3), hi];
    $('#wine-window').innerHTML = `
      <div class="box-row"><span class="label">Quando berlo</span><span class="pill ${state.k}">${esc(state.text)}</span></div>
      <div class="track"><span class="fill ${state.k}" style="left:${pos(a)};width:calc(${pos(b)} - ${pos(a)})"></span><span class="now" style="left:${pos(year)}"></span></div>
      <div class="ticks">${ticks.map((t) => `<span>${t}</span>`).join('')}</div>
      ${d.finestra_consumo ? `<p class="text">${esc(d.finestra_consumo)}</p>` : ''}`;
  }
  $('#wine-window').hidden = !state;

  const about = kvRows([
    ['Produttore', d.produttore],
    ['Denominazione', [d.denominazione, d.classificazione && !String(d.denominazione || '').includes(d.classificazione) && d.classificazione].filter(Boolean).join(' ')],
    ['Annata', d.annata],
    ['Zona', [d.regione, d.nazione].filter(Boolean).join(', ')],
    ['Vitigni', joinList(d.vitigni)],
    ['Tipo', [d.colore, d.stile].filter(Boolean).join(', ')],
    ['Gradazione', d.gradazione && `${String(d.gradazione).replace('.', ',')}% vol`],
    ['Formato', d.formato_ml && (Number(d.formato_ml) === 750 ? '75 cl' : `${Number(d.formato_ml) / 10} cl`)],
    ['Caratteristiche', joinList(d.caratteristiche)],
  ]);
  $('#wine-about').innerHTML = about ? `<span class="label">Il vino</span><dl class="kv">${about}</dl>${d.affinamento ? `<p class="text"><b>Affinamento.</b> ${esc(d.affinamento)}</p>` : ''}` : '';
  $('#wine-about').hidden = !about;

  const table = [
    d.temperatura_servizio && `<dl class="kv">${kvRows([['Servire a', d.temperatura_servizio]])}</dl>`,
    d.abbinamenti && `<p class="text"><b>Abbinamenti.</b> ${esc(joinList(d.abbinamenti))}</p>`,
    d.descrizione && `<p class="text">${esc(d.descrizione)}</p>`,
  ].filter(Boolean).join('');
  $('#wine-table').innerHTML = table ? `<span class="label">In tavola</span>${table}` : '';
  $('#wine-table').hidden = !table;
}

// Modulo di modifica diviso per argomento; i campi corti stanno due per riga.
const FIELD_GROUPS = [
  ['Il vino', ['produttore', 'nome', 'denominazione', 'classificazione', 'annata', 'nazione', 'regione']],
  ['Caratteristiche', ['colore', 'stile', 'vitigni', 'gradazione', 'formato_ml', 'caratteristiche', 'affinamento']],
  ['Quando berlo', ['bere_dal', 'bere_entro', 'finestra_consumo']],
  ['In tavola', ['temperatura_servizio', 'abbinamenti', 'descrizione']],
  ['In cantina', ['quantita', 'prezzo_pagato', 'acquisto_data', 'prezzo', 'acquisto_luogo', 'posizione']],
];
const SHORT_FIELDS = new Set(['classificazione', 'annata', 'nazione', 'regione', 'colore', 'stile', 'gradazione', 'formato_ml', 'bere_dal', 'bere_entro', 'temperatura_servizio', 'quantita', 'prezzo', 'prezzo_pagato', 'acquisto_data']);
const LONG_TEXT = new Set(['abbinamenti', 'descrizione', 'finestra_consumo', 'affinamento']);

function autosize(t) {
  t.style.height = 'auto';
  t.style.height = `${t.scrollHeight + 2}px`;
}

async function openWine(id) {
  const w = await getWine(id);
  if (!w) return;
  editingId = id;
  renderHero(w.photos);
  $('#btn-crop').hidden = !settings.geminiKey || !w.photos.some((p) => !p.lost);
  const state = [];
  if (w.error) state.push('Errore: ' + w.error);
  if (w.uncertain?.length) state.push('Campi incerti evidenziati in giallo.');
  if (w.web?.error) state.push('Verifica su Google non riuscita: ' + w.web.error);
  else if (w.web) {
    const skipped = Array.isArray(w.web.skipped) ? w.web.skipped : w.web.skipped ? [`Google: ${w.web.skipped}`] : [];
    if (skipped.length) state.push(`Ricerca non riuscita (${skipped.join('; ')}).`);
    const where = w.web.provider || (w.web.confirmed && !skipped.length ? 'Google' : null);
    if (!where) state.push('Dettagli compilati da Gemini senza verifica (in giallo).');
    else if (!w.web.found) state.push(`Vino non trovato con la ricerca ${where}.`);
    else state.push(`Verificati con ${where}: ${w.web.confirmed.join(', ') || 'nessun campo'}.`);
  }
  const apiCost = [];
  if (w.costs?.length) {
    const last = w.costs.reduce((n, c) => n + c.usd, 0);
    const parts = w.costs.map((c) => `${c.step.replace(/ \(.*\)/, '')} ${c.model === 'tavily' && !c.usd ? 'gratis' : formatEur(c.usd)}`).join(' · ');
    const total = w.spentUsd > last + 1e-9 ? ` Totale per questo vino: ${formatEur(w.spentUsd)}.` : '';
    apiCost.push(`Costo API stimato a pagamento: ${formatEur(last)} (${parts}); sul piano gratuito 0 €.${total}`);
  }
  w.photos.forEach((p, i) => p.error && state.push(`Foto ${i + 1}: ${p.error}`));
  $('#wine-state').innerHTML = esc(state.join(' ')) + (w.web?.sources?.length
    ? `<details><summary>Fonti (${w.web.sources.length})</summary><ul>${w.web.sources
      .map((x) => `<li><a href="${esc(x.uri)}" target="_blank" rel="noopener">${esc(x.title)}</a></li>`).join('')}</ul></details>`
    : '');
  const drinks = (await allDrinks()).filter((x) => x.wineId === id).sort((a, b) => b.data.localeCompare(a.data));
  $('#wine-drinks').innerHTML = drinks.length
    ? `<span class="label">Bevute</span><ul class="history">${drinks.map((x) => `<li><span>${esc(dayLabel(x.data))}${x.dove === 'fuori' ? ` · ${esc(x.locale || 'fuori')}` : ', a casa'}</span><b>${x.voto ?? ''}</b></li>`).join('')}</ul>`
    : '';
  $('#wine-drinks').hidden = !drinks.length;
  renderWineHead(w);
  const d = w.data || {};
  const uncertain = new Set(w.uncertain || []);
  const input = (k, l, v, type) => `
    <label class="${uncertain.has(k) ? 'uncertain' : ''} ${SHORT_FIELDS.has(k) ? '' : 'span2'}">${esc(l)}
      ${LONG_TEXT.has(k)
        ? `<textarea name="${k}" rows="2">${esc(v)}</textarea>`
        : `<input name="${k}" value="${esc(v)}" ${type ? `inputmode="${type}"` : ''} ${OPTIONS[k] ? `list="opt-${k}"` : ''}>`}
      ${OPTIONS[k] ? `<datalist id="opt-${k}">${OPTIONS[k].map((o) => `<option value="${esc(o)}">`).join('')}</datalist>` : ''}
    </label>`;
  const byKey = Object.fromEntries(FIELDS.map((f) => [f.k, f]));
  const field = (k) => {
    if (k === 'quantita') return input(k, 'Bottiglie', w.quantita, 'numeric');
    if (k === 'posizione') return input(k, 'Posizione in cantina', w.posizione);
    if (k === 'prezzo_pagato') return input(k, 'Prezzo pagato (€)', w.prezzo_pagato, 'decimal');
    if (k === 'acquisto_data') return `<label>Comprato il<input type="date" name="acquisto_data" value="${esc(w.acquisto_data || '')}"></label>`;
    if (k === 'acquisto_luogo') return `<label class="span2">Comprato da (negozio, cantina, regalo…)<input name="acquisto_luogo" value="${esc(w.acquisto_luogo || '')}" list="opt-shops" autocomplete="off"><datalist id="opt-shops">${
      [...new Set(lastWines.map((x) => x.acquisto_luogo).filter(Boolean))].map((x) => `<option value="${esc(x)}">`).join('')}</datalist></label>`;
    const f = byKey[k];
    return input(f.k, f.l, joinList(d[f.k]), f.type === 'INTEGER' ? 'numeric' : f.type === 'NUMBER' ? 'decimal' : '');
  };
  $('#wine-fields').innerHTML = FIELD_GROUPS.map(([title, keys]) =>
    `<fieldset><legend>${esc(title)}</legend>${keys.map(field).join('')}</fieldset>`).join('');
  renderLog(w, apiCost.join(''));
  // I dati da modificare stanno in fondo, chiusi; si aprono da soli solo se il vino non è stato riconosciuto.
  $('#wine-edit').open = w.status !== 'ok' || !!w.error;
  $('#wine-check').hidden = !w.uncertain?.length || $('#wine-edit').open;
  const twin = findTwin(w, await allWines());
  $('#wine-twin').hidden = !twin;
  if (twin) {
    $('#twin-text').textContent = `Sembra lo stesso vino di un'altra scheda (${listTitle(twin)}, ${Number(twin.quantita) || 0} bott., aggiunta il ${new Date(twin.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}).`;
    $('#btn-merge').dataset.twin = twin.id;
    $('#btn-not-twin').dataset.twin = twin.id;
  }
  $('#dlg-wine').returnValue = '';
  $('#dlg-wine').showModal();
  $('#dlg-wine').scrollTop = 0;
  $('#wine-form').elements.nota.value = w.nota || '';
  $('#dlg-wine').querySelectorAll('textarea').forEach(autosize);
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
    nota: String(fd.get('nota') || '').trim(),
    acquisto_luogo: String(fd.get('acquisto_luogo') || '').trim(),
    acquisto_data: String(fd.get('acquisto_data') || ''),
    prezzo_pagato: (() => { const n = Number(String(fd.get('prezzo_pagato') || '').replace(',', '.')); return String(fd.get('prezzo_pagato') || '').trim() && Number.isFinite(n) ? n : null; })(),
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
  const blob = new Blob([JSON.stringify({ versione: APP_VERSION, esportato: new Date().toISOString(), vini: wines, bevute: await allDrinks() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cantina-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- Visore foto ----------

// La pagina non si può ingrandire; le foto della scheda si aprono a tutto schermo con zoom a due dita,
// trascinamento e doppio tocco, gestiti qui con i pointer events.
const viewer = { urls: [], index: 0, scale: 1, x: 0, y: 0, pointers: new Map(), start: null, lastTap: 0 };

function viewerApply(animate) {
  const img = $('#viewer-img');
  img.style.transition = animate ? 'transform 0.2s' : 'none';
  img.style.transform = `translate(${viewer.x}px, ${viewer.y}px) scale(${viewer.scale})`;
}

function viewerShow(index) {
  viewer.index = (index + viewer.urls.length) % viewer.urls.length;
  Object.assign(viewer, { scale: 1, x: 0, y: 0 });
  $('#viewer-img').src = viewer.urls[viewer.index];
  viewerApply(false);
  const many = viewer.urls.length > 1;
  $('#viewer-prev').hidden = !many;
  $('#viewer-next').hidden = !many;
}

function openViewer(urls, index) {
  viewer.urls = urls;
  viewerShow(index);
  $('#dlg-photo').showModal();
}

function bindViewer() {
  const area = $('#viewer');
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const center = () => {
    const r = area.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  // Zoom attorno a un punto dello schermo, tenendo fermo quel punto sotto le dita.
  const zoomAt = (scale, p, base) => {
    const c = center();
    const s = Math.min(6, Math.max(1, scale));
    const k = s / base.scale;
    viewer.x = (p.x - c.x) - k * (p.x - c.x - base.x);
    viewer.y = (p.y - c.y) - k * (p.y - c.y - base.y);
    viewer.scale = s;
    if (s === 1) { viewer.x = 0; viewer.y = 0; }
  };
  const snapshot = () => {
    const pts = [...viewer.pointers.values()];
    viewer.start = { pts, scale: viewer.scale, x: viewer.x, y: viewer.y };
  };

  area.addEventListener('pointerdown', (e) => {
    area.setPointerCapture(e.pointerId);
    viewer.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    snapshot();
  });
  area.addEventListener('pointermove', (e) => {
    if (!viewer.pointers.has(e.pointerId)) return;
    viewer.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...viewer.pointers.values()];
    const st = viewer.start;
    if (pts.length >= 2 && st.pts.length >= 2) {
      const m = mid(pts[0], pts[1]);
      const m0 = mid(st.pts[0], st.pts[1]);
      zoomAt(st.scale * (dist(pts[0], pts[1]) / dist(st.pts[0], st.pts[1])), m0, st);
      viewer.x += m.x - m0.x;
      viewer.y += m.y - m0.y;
    } else if (pts.length === 1 && viewer.scale > 1) {
      viewer.x = st.x + pts[0].x - st.pts[0].x;
      viewer.y = st.y + pts[0].y - st.pts[0].y;
    }
    viewerApply(false);
  });
  const end = (e) => {
    if (!viewer.pointers.has(e.pointerId)) return;
    const st = viewer.start;
    const p = viewer.pointers.get(e.pointerId);
    viewer.pointers.delete(e.pointerId);
    if (viewer.pointers.size === 0 && st.pts.length === 1) {
      const dx = p.x - st.pts[0].x;
      const moved = Math.hypot(dx, p.y - st.pts[0].y);
      if (moved < 10) {
        // Doppio tocco: ingrandisce dove si tocca, o torna alla foto intera.
        if (Date.now() - viewer.lastTap < 300) {
          if (viewer.scale > 1) Object.assign(viewer, { scale: 1, x: 0, y: 0 });
          else zoomAt(2.5, p, { scale: 1, x: 0, y: 0 });
          viewerApply(true);
          viewer.lastTap = 0;
        } else {
          viewer.lastTap = Date.now();
        }
      } else if (viewer.scale === 1 && Math.abs(dx) > 60 && viewer.urls.length > 1) {
        viewerShow(viewer.index + (dx < 0 ? 1 : -1));
      }
    }
    if (viewer.scale < 1.05) { Object.assign(viewer, { scale: 1, x: 0, y: 0 }); viewerApply(true); }
    snapshot();
  };
  area.addEventListener('pointerup', end);
  area.addEventListener('pointercancel', end);
  $('#viewer-close').addEventListener('click', () => $('#dlg-photo').close());
  $('#viewer-prev').addEventListener('click', () => viewerShow(viewer.index - 1));
  $('#viewer-next').addEventListener('click', () => viewerShow(viewer.index + 1));
  $('#wine-photos').addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    const imgs = [...$('#wine-photos').querySelectorAll('img')];
    openViewer(imgs.map((i) => i.src), imgs.indexOf(img));
  });
}

// Safari su iOS ignora user-scalable=no: si bloccano a mano pizzico e doppio tocco sulla pagina.
function blockPageZoom() {
  for (const ev of ['gesturestart', 'gesturechange']) {
    document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });
  }
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
}

function bindUi() {
  bindViewer();
  blockPageZoom();
  $('#diag-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(`Cantina ${APP_VERSION} (${BUILD})\n${navigator.userAgent}\n${diagLines.join('\n')}`); toast('Dettagli copiati'); } catch { toast('Copia non riuscita'); }
  });
  $('#diag-reload').addEventListener('click', () => location.reload());
  $('#app-version').textContent = APP_VERSION + (BUILD === 'dev' ? '' : ` (${BUILD})`);
  $('#btn-notes').addEventListener('click', showReleaseNotes);
  announceUpdate();
  // Il tasto fotocamera non forza la fotocamera: iOS propone Scatta foto, Libreria foto o Scegli file.
  // Più foto scelte insieme: si raggruppano a mano nella schermata Raggruppa.
  $('#btn-import').addEventListener('click', () => $('#in-files').click());
  for (const sel of ['#in-camera', '#in-files']) $(sel).addEventListener('change', (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    if (files.length < 2) addFiles(files);
    else startGrouping(files);
  });
  bindGrouping();
  $('#btn-merge').addEventListener('click', async () => {
    const id = editingId;
    const twin = $('#btn-merge').dataset.twin;
    $('#dlg-wine').close();
    const kept = await mergeWines(id, twin);
    toast('Vini uniti: bottiglie, foto e bevute ora sono in un\'unica scheda.');
    if (kept) openWine(kept);
  });
  $('#btn-not-twin').addEventListener('click', async () => {
    const id = editingId;
    const twin = $('#btn-not-twin').dataset.twin;
    await updateWine(id, (w) => ({ ...w, notTwin: [...(w.notTwin || []), twin] }));
    $('#wine-twin').hidden = true;
  });
  document.querySelectorAll('.tab[data-view]').forEach((t) => t.addEventListener('click', () => showView(t.dataset.view)));
  $('#btn-filters').addEventListener('click', () => { renderFilters(); $('#dlg-filters').showModal(); });
  $('#filter-body').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const { k, v } = chip.dataset;
    filters[k] = filters[k].includes(v) ? filters[k].filter((x) => x !== v) : [...filters[k], v];
    saveFilters();
    renderFilters();
    scheduleRender();
  });
  $('#btn-filter-reset').addEventListener('click', () => {
    filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, []]));
    saveFilters();
    renderFilters();
    scheduleRender();
  });
  $('#vintages').addEventListener('click', (e) => {
    const li = e.target.closest('li[data-id]');
    if (li) openWine(li.dataset.id);
  });
  $('#btn-crop').addEventListener('click', async () => {
    const id = editingId;
    const w = await getWine(id);
    const photo = w?.photos.find((p) => !p.lost);
    if (!photo) return;
    $('#btn-crop').disabled = true;
    $('#btn-crop').textContent = 'Ritaglio in corso…';
    try {
      const box = await geminiBox(photoBlob(photo), {});
      if (!(await applyCrop(id, box))) throw new Error('bottiglia non trovata intera nella foto');
      toast('Foto ritagliata sulla bottiglia');
      if (editingId === id) {
        const cur = await getWine(id);
        releaseUrls('dialog');
        renderHero(cur.photos);
      }
    } catch (err) {
      toast('Ritaglio non riuscito: ' + err.message);
    } finally {
      $('#btn-crop').disabled = false;
      $('#btn-crop').textContent = 'Ritaglia sulla bottiglia';
    }
  });
  $('#sort').value = sortKey();
  $('#sort').addEventListener('change', () => {
    try { localStorage.setItem('cantina.sort', $('#sort').value); } catch {}
    scheduleRender();
  });
  $('#btn-finished').addEventListener('click', () => { showFinished = !showFinished; scheduleRender(); });
  bindSwipe();
  bindDrinkSheet();
  $('#btn-drink-home').addEventListener('click', () => openDrink({ dove: 'casa', fromCellar: false }));
  $('#btn-drink-out').addEventListener('click', () => openDrink({ dove: 'fuori', fromCellar: false }));
  $('#diary').addEventListener('click', async (e) => {
    const li = e.target.closest('li[data-drink]');
    if (!li) return;
    const drink = (await allDrinks()).find((d) => d.id === li.dataset.drink);
    if (drink) openDrink(drink);
  });
  $('#dlg-wine .stepper').addEventListener('click', (e) => {
    const step = Number(e.target.closest('button[data-step]')?.dataset.step);
    if (!step) return;
    const input = $('#wine-form').elements.quantita;
    const q = Math.max(0, (parseInt(input.value, 10) || 0) + step);
    input.value = q;
    $('#qty-out').textContent = q;
  });
  $('#wine-form').addEventListener('input', (e) => {
    if (e.target.name === 'quantita') $('#qty-out').textContent = Math.max(0, parseInt(e.target.value, 10) || 0);
    if (e.target.tagName === 'TEXTAREA') autosize(e.target);
  });
  // I campi nascosti nel riquadro chiuso hanno altezza zero: si misurano quando si apre.
  $('#wine-edit').addEventListener('toggle', () => $('#wine-fields').querySelectorAll('textarea').forEach(autosize));
  $('#btn-open-edit').addEventListener('click', () => {
    $('#wine-edit').open = true;
    $('#wine-check').hidden = true;
    $('#wine-edit').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#btn-wine-drink').addEventListener('click', async () => {
    const id = editingId;
    await updateWine(id, readForm);
    $('#dlg-wine').close();
    drinkFromCellar(id);
  });
  $('#btn-login').addEventListener('click', login);
  $('#btn-logout').addEventListener('click', () => { logout(); toast('Disconnesso da Drive'); });
  $('#btn-settings').addEventListener('click', openSettings);
  $('#btn-export').addEventListener('click', exportJson);
  $('#btn-retry').addEventListener('click', () => {
    if (!driveToken() && localStorage.getItem('cantina.token')) login();
    processPending();
  });
  $('#search').addEventListener('input', scheduleRender);

  $('#dlg-settings').addEventListener('close', () => {
    if ($('#dlg-settings').returnValue !== 'save') return;
    const form = $('#settings-form');
    const prevFolder = settings.driveFolder;
    saveSettings(Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((k) => [k, form.elements[k].value.trim()])));
    if (prevFolder !== settings.driveFolder) folderPromise = null;
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
  // Ricerca manuale: apre Google con i dati che identificano il vino, come sono ora nella scheda.
  $('#btn-copy-log').addEventListener('click', async () => {
    const w = await getWine(editingId);
    try {
      await navigator.clipboard.writeText(logText(w));
      toast('Registro copiato');
    } catch {
      toast('Copia non riuscita');
    }
  });
  $('#btn-google').addEventListener('click', () => {
    const form = $('#wine-form').elements;
    const data = Object.fromEntries(['produttore', 'nome', 'denominazione', 'annata', 'nazione'].map((k) => [k, form[k]?.value.trim()]));
    if (!data.produttore && !data.nome) return toast('Compila almeno produttore o nome.');
    window.open('https://www.google.com/search?q=' + encodeURIComponent(searchQuery(data) + ' scheda'), '_blank', 'noopener');
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

// A ogni pubblicazione GitHub scrive la versione nel meta "app-version" e in version.json: se non coincidono l'app si ricarica.
// Come nell'app Palestrina: il controllo parte all'avvio e ogni volta che l'app torna in primo piano,
// perché su iOS l'app aperta dall'icona spesso viene solo ripresa, senza ricaricare la pagina.
const BUILD = (document.querySelector('meta[name="app-version"]') || {}).content || 'dev';

/** Mai ricaricare durante un riconoscimento o con una scheda aperta. */
function busyNow() {
  return running.size > 0 || swiping || ['#dlg-wine', '#dlg-settings', '#dlg-drink', '#dlg-group'].some((s) => $(s).open);
}

async function checkForUpdate() {
  if (BUILD === 'dev') return;
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    const { v } = await res.json();
    if (!v || v === BUILD) return;
    if (busyNow()) {
      setTimeout(checkForUpdate, 5000);
      return;
    }
    // Se dopo la ricarica la pagina è ancora vecchia (CDN non ancora aggiornata) non si riprova subito.
    const last = JSON.parse(localStorage.getItem('cantina.reloadFor') || 'null');
    if (last && last.v === v && Date.now() - last.at < 120000) return;
    localStorage.setItem('cantina.reloadFor', JSON.stringify({ v, at: Date.now() }));
    toast('Aggiornamento…');
    setTimeout(() => location.reload(), 400);
  } catch { /* offline: si riprova alla prossima apertura */ }
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) location.reload();
  });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {});
    });
  });
}

// ---------- Avvio ----------

bindUi();
checkForUpdate();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkForUpdate();
});
window.addEventListener('pageshow', (e) => e.persisted && checkForUpdate());
updateDriveStatus();
if (driveToken()) driveFolderId().catch(() => {});
registerServiceWorker();
navigator.storage?.persist?.();
migratePhotos().catch(() => {}).then(() => migrateDrinks().catch(() => {})).then(render).then(processPending);
