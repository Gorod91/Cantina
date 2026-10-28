# Cantina

Web app per catalogare i vini di casa partendo da una foto dell'etichetta.
Gira su GitHub Pages, funziona offline e si aggiorna da sola a ogni apertura.

Prototipo attuale:

- scatto diretto o import di una o più foto (opzione "stesso vino" per fronte/retro);
- le foto vengono ridotte a 1600 px e caricate nella cartella `Cantina` del tuo Google Drive;
- Gemini legge l'etichetta e compila la scheda (produttore, nome, denominazione, annata, vitigni, …);
- campi incerti evidenziati, modificabili a mano; quantità e posizione in cantina;
- archivio locale nel telefono (IndexedDB) ed esportazione JSON.

## Configurazione (una volta sola)

Chiavi e token restano solo nel dispositivo, mai nel repository.

1. **Chiave Gemini**: crea una chiave gratuita su <https://aistudio.google.com/apikey> e incollala in Impostazioni.
2. **Client ID Google per Drive**:
   1. su <https://console.cloud.google.com/> crea un progetto e abilita **Google Drive API**;
   2. in *Google Auth Platform* configura la schermata di consenso (tipo *Esterno*) e aggiungi il tuo indirizzo Gmail tra gli utenti di test;
   3. in *Client* crea un **ID client OAuth** di tipo *Applicazione web* con origine JavaScript autorizzata `https://gorod91.github.io`;
   4. copia il Client ID (`…apps.googleusercontent.com`) in Impostazioni e premi "Accedi a Drive".

L'app usa solo il permesso `drive.file`: vede esclusivamente i file che crea lei.

3. **Ricerca dei dettagli (facoltativa)**: la ricerca Google di Gemini non è sempre inclusa nel piano gratuito.
   In alternativa crea una chiave gratuita su <https://tavily.com> (1.000 ricerche al mese, senza carta) e incollala in Impostazioni:
   Tavily trova le pagine del vino e Gemini, senza la sua ricerca, compila la scheda.

## Pubblicazione

Il workflow `.github/workflows/pages.yml` pubblica il sito a ogni push.
In *Settings → Pages* del repository imposta *Source: GitHub Actions*.

Aggiornamento automatico: il service worker (`sw.js`) scarica sempre prima la versione online
e usa la cache solo offline; quando cambia, la pagina si ricarica da sola.
Ricordarsi di aumentare `APP_VERSION` in `app.js` a ogni rilascio.
