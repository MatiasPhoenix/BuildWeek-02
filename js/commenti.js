// Gestisce l'evento di ricerca quando viene inviato il form
document.getElementById('searchForm').addEventListener('submit', async function (event) {
     event.preventDefault(); // Impedisce il comportamento predefinito del form
 
     // Ottiene il testo di ricerca e verifica quali checkbox sono selezionati
     const query = document.getElementById('searchQuery').value;
     const isArtistSearch = document.getElementById('artistCheckbox').checked;
     const isAlbumSearch = document.getElementById('albumCheckbox').checked;
 
     const resultsContainer = document.getElementById('results');
     resultsContainer.innerHTML = ''; // Svuota i risultati precedenti
 
     // Gestisce la ricerca in base ai checkbox selezionati
     if (!isArtistSearch && !isAlbumSearch) {
         searchTracks(query); // Se nessun checkbox è selezionato, esegue la ricerca delle tracce
     } else {
         if (isArtistSearch) {
             const artistData = await searchArtistId(query); // Esegue la ricerca dell'artista
             if (artistData) {
                 // Esegue operazioni specifiche per l'artista e mostra i dettagli
                 console.log('Dettagli artista:', artistData);
             }
         }
         if (isAlbumSearch) {
             searchMusic(query); // Esegue la ricerca dell'album
         }
     }
 });
 
 // Verifica iniziale per assicurarsi che almeno un checkbox sia selezionato all'avvio
 const initialArtistSearch = document.getElementById('artistCheckbox').checked;
 const initialAlbumSearch = document.getElementById('albumCheckbox').checked;
 
 // Se nessun checkbox è selezionato all'avvio, esegue la ricerca delle tracce
 if (!initialArtistSearch && !initialAlbumSearch) {
     searchTracks(document.getElementById('searchQuery').value);
 }
 
 // Funzione per cercare tracce musicali
 function searchMusic(query) {
     const url = new URL('https://striveschool-api.herokuapp.com/api/deezer/search');
     url.search = new URLSearchParams({ q: query });
 
     fetch(url)
         .then(response => response.json())
         .then(data => {
             const albumIds = data.data.map(track => track.album.id);
             displayResults(data.data, albumIds, query);
         })
         .catch(error => console.error('Error:', error));
 }
 
 // Funzione asincrona per cercare l'ID dell'artista
 async function searchArtistId(artistName) {
     try {
         const url = new URL('https://striveschool-api.herokuapp.com/api/deezer/search');
         url.search = new URLSearchParams({ q: artistName });
 
         const response = await fetch(url);
         const data = await response.json();
 
         if (data && data.data && data.data.length > 0) {
             const displayedArtists = new Set(); // Insieme per tenere traccia degli artisti visualizzati
 
             data.data.forEach(track => {
                 const artistId = track.artist.id;
                 const artistImage = track.artist.picture_medium;
                 const artistName = track.artist.name;
 
                 if (!displayedArtists.has(`${artistId}_${artistName}`)) { // Controlla se l'artista è già stato visualizzato
                     console.log('ID dell\'artista:', artistId);
                     console.log('Nome dell\'artista:', artistName);
                     console.log('URL immagine dell\'artista:', artistImage);
 
                     // Mostra dettagli artista nell'interfaccia
                     displayArtistDetails(artistName, artistImage, artistId);
 
                     // Aggiunge evento clic per aprire la tracklist
                     const artistElement = document.createElement("div");
                     artistElement.textContent = `Artist: ${artistName}`;
                     artistElement.style.cursor = "pointer";
                     artistElement.addEventListener('click', function () {
                         loadArtistTracklist(artistId);
                         saveDataAsJSON()
                     });
                     document.getElementById('results').appendChild(artistElement);
 
                     displayedArtists.add(`${artistId}_${artistName}`); // Aggiunge l'artista visualizzato all'insieme
                 }
             });
 
             return { displayedArtists };
         } else {
             console.error('Nessun artista trovato');
             return null;
         }
     } catch (error) {
         console.error('Errore durante la ricerca dell\'artista:', error);
         return null;
     }
 }
 
 
 // Funzione per visualizzare i dettagli di un artista nell'interfaccia
 function displayArtistDetails(name, image, artistId) {
     const artistContainer = document.createElement('div'); // Crea un container per i dettagli dell'artista
     artistContainer.classList.add('artist-details'); // Aggiunge una classe per lo stile CSS
 
     const artistImage = document.createElement('img'); // Crea un'immagine per l'artista
     artistImage.src = image; // Imposta il percorso dell'immagine
     artistImage.alt = 'Artist Image'; // Imposta l'attributo 'alt' per l'accessibilità
     artistImage.style.width = '100px'; // Imposta la larghezza dell'immagine
     artistContainer.appendChild(artistImage); // Aggiunge l'immagine al container
 
     const artistName = document.createElement('h4'); // Crea un titolo per il nome dell'artista
     artistName.textContent = name; // Imposta il testo con il nome dell'artista
     artistContainer.appendChild(artistName); // Aggiunge il nome al container
 
     const plusIconArtist = document.createElement('i'); // Crea un'icona "più" per aggiungere l'artista al localStorage
     plusIconArtist.classList.add('bi', 'bi-plus-circle-fill'); // Aggiunge classi per lo stile CSS
     plusIconArtist.addEventListener('click', function() {
         // Salva i dati associati all'artista nel localStorage
         const artistData = {
             name: artistName.textContent, // Salva il nome dell'artista
             image: image // Salva il percorso dell'immagine dell'artista
             // Puoi aggiungere altre proprietà se necessario
         };
         localStorage.setItem('artist/' + artistId, JSON.stringify(artistData)); // Salva i dati come stringa JSON nel localStorage
         alert('Artista aggiunto al localStorage!'); // Mostra un messaggio di conferma
     });
     artistContainer.appendChild(plusIconArtist); // Aggiunge l'icona al container degli artisti
 
     document.getElementById('results').appendChild(artistContainer); // Aggiunge il container al DOM
 }
 
 // Funzione per caricare la tracklist di un artista
 async function loadArtistTracklist(artistId) {
     try {
         const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`);
         const data = await response.json();
 
         if (data && data.data && data.data.length > 0) {
             displayTracks(data.data); // Mostra le tracce dell'artista
         } else {
             console.error('Nessuna traccia trovata per questo artista');
         }
     } catch (error) {
         console.error('Errore durante il caricamento della tracklist dell\'artista:', error);
     }
 }
 
 // Funzione per convertire i secondi in formato mm:ss
 function secondToMinutes(timeInSeconds) {
     const minutes = Math.floor(timeInSeconds / 60);
     const seconds = timeInSeconds % 60;
     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
 }
 
 // Funzione per formattare la durata in ore:minuti:secondi
 function formatDuration(seconds) {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);
     const remainingSeconds = seconds % 60;
     return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
 }
 
 // Funzione per visualizzare le tracce
 function displayTracks(tracks) {
     const resultsContainer = document.getElementById('results');
     resultsContainer.innerHTML = ''; // Svuota il contenitore dei risultati
 
     if (tracks && tracks.length > 0) {
         tracks.forEach(track => {
             const trackElement = document.createElement('div'); // Crea un elemento per ogni traccia
             trackElement.classList.add('mb-2', 'pl-3'); // Aggiunge classi per lo stile CSS
 
             // Mostra i dettagli della traccia
             trackElement.textContent = `Track: ${track.title}, Rank: ${track.rank}, Duration: ${secondToMinutes(track.duration)}, Artist: ${track.artist.name}`;
             
             // Aggiunge un'icona di riproduzione per la traccia
             const playIcon = document.createElement('i');
             playIcon.classList.add('bi', 'bi-play-circle-fill', 'mr-2');
             playIcon.addEventListener('click', function() {
                 playTrackPreview(track.preview); // Riproduce la traccia
             });
             trackElement.appendChild(playIcon);
 
             // Aggiunge un'icona "più" per aggiungere la traccia al localStorage
             const plusIconTrack = document.createElement('i');
             plusIconTrack.classList.add('bi', 'bi-plus-circle-fill');
             plusIconTrack.addEventListener('click', function() {
                 const trackData = {
                     title: track.title,
                     rank: track.rank,
                     duration: track.duration,
                     artist: track.artist.name
                 };
                 localStorage.setItem('track/' + track.id, JSON.stringify(trackData));
                 alert('Traccia aggiunta al localStorage!');
             });
             trackElement.appendChild(plusIconTrack);
 
             resultsContainer.appendChild(trackElement); // Aggiunge l'elemento al contenitore dei risultati
         });
     } else {
         // Se non ci sono tracce disponibili, mostra un messaggio
         const noTracksMessage = document.createElement('div');
         noTracksMessage.textContent = 'Nessuna traccia disponibile per questo album.';
         resultsContainer.appendChild(noTracksMessage);
     }
 }
 
 // Funzione per caricare le tracce di un album
 function loadTracks(albumId) {
     const url = new URL(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
 
     fetch(url)
         .then(response => response.json())
         .then(data => {
             if (data && data.tracks && data.tracks.data) {
                 displayTracks(data.tracks.data); // Mostra le tracce dell'album
             } else {
                 const resultsContainer = document.getElementById('results');
                 resultsContainer.innerHTML = 'Nessuna traccia disponibile per questo album.';
             }
         })
         .catch(error => console.error('Error:', error));
 }
 
 function displayResults(results, albumIds, query) {
     const resultsContainer = document.getElementById('results');
     resultsContainer.innerHTML = ''; // Svuota il contenitore dei risultati
 
     // Raggruppa gli album e le tracce associate
     const albums = results.reduce((acc, track) => {
         acc[track.album.id] = acc[track.album.id] || { 
             tracks: [], 
             cover: track.album.cover, 
             totalDuration: 0, 
             title: track.album.title, 
             artist: track.artist.name 
         };
         acc[track.album.id].tracks.push(track);
         acc[track.album.id].totalDuration += track.duration;
         return acc;
     }, {});
 
     Object.keys(albums).forEach(albumId => {
         const album = albums[albumId];
 
         album.tracks.sort((a, b) => b.rank - a.rank); // Ordina le tracce per rank
 
         const albumContainer = document.createElement('div'); // Crea un container per ogni album
         albumContainer.classList.add('album-container'); // Aggiunge classi per lo stile CSS
 
         const albumImage = document.createElement('img'); // Crea un'immagine per l'album
         albumImage.src = album.cover; // Imposta il percorso dell'immagine
         albumImage.alt = "Album Cover"; // Imposta l'attributo 'alt' per l'accessibilità
         albumImage.style.width = "100px"; // Imposta la larghezza dell'immagine
         albumContainer.appendChild(albumImage); // Aggiunge l'immagine al container
 
         const albumTitle = document.createElement('div'); // Crea un titolo per l'album
         albumTitle.textContent = `Album: ${album.title}`; // Imposta il testo con il titolo dell'album
         albumContainer.appendChild(albumTitle); // Aggiunge il titolo al container
 
         const trackCountElement = document.createElement("div"); // Crea un elemento per il conteggio delle tracce
         trackCountElement.textContent = `Number of Tracks: ${album.tracks.length}`; // Mostra il numero di tracce
         albumContainer.appendChild(trackCountElement); // Aggiunge l'elemento al container
 
         const totalDurationElement = document.createElement("div"); // Crea un elemento per la durata totale dell'album
         totalDurationElement.textContent = `Total Duration: ${formatDuration(album.totalDuration)}`; // Mostra la durata totale
         albumContainer.appendChild(totalDurationElement); // Aggiunge l'elemento al container
 
         // Aggiunge un'icona "più" per aggiungere l'album al localStorage
         const plusIconAlbum = document.createElement('i');
         plusIconAlbum.classList.add('bi', 'bi-plus-circle-fill');
         plusIconAlbum.addEventListener('click', function() {
             const albumData = {
                 title: album.title,
                 numberOfTracks: album.tracks.length,
                 totalDuration: album.totalDuration,
                 artist: album.artist
             };
             localStorage.setItem('album/' + albumId, JSON.stringify(albumData));
             alert('Album aggiunto al localStorage!');
         });
         albumContainer.appendChild(plusIconAlbum);
 
         resultsContainer.appendChild(albumContainer); // Aggiunge il container al DOM
         albumImage.addEventListener('click', function () {
             loadTracks(album.tracks[0].album.id); // Carica le tracce dell'album al click sull'immagine
             searchArtistId(query); // Esegue una ricerca per l'artista associato
         });
 
         // Calcola la durata totale degli album
         calculateTotalDuration([albumId])
             .then(({ totalDuration, number, artist }) => {
                 totalDurationElement.textContent = `Total Duration: ${totalDuration}`;
                 trackCountElement.textContent = `Number of Tracks: ${number}`;
                 artistElement.textContent = `Artist: ${artist}`;
             })
             .catch(error => {
                 console.error(`Errore durante il calcolo della durata totale per l'album ${albumId}:`, error);
             });
     });
 }
 
 async function calculateTotalDuration(albumIds) {
     let totalDuration = 0;
     let number = 0;
     let artist = ''; // Inizializza la variabile artist
     let genre = ''; // Inizializza la variabile genre
 
     // Itera su ciascun ID dell'album
     for (const albumId of albumIds) {
         try {
             // Esegui una chiamata API per ottenere le tracce dell'album
             const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
             const data = await response.json();
 
             // Verifica se le tracce sono presenti e non vuote
             if (data && data.tracks && data.tracks.data) {
                 // Calcola la durata totale delle tracce dell'album
                 totalDuration = formatDuration(data.duration);
                 number = data.nb_tracks;
                 genre = data.genres.data[0].name;
                 console.log(genre)
                 console.log('Numero di tracce dell\'album:', number);
                 
 
                 // Assegna il nome dell'artista alla variabile artist
                 artist = data.artist.name;
 
             }
         } catch (error) {
             console.error(`Errore durante il recupero delle informazioni per l'album ${albumId}:`, error);
         }
     }
 
     // Restituisci la durata totale formattata, il numero di tracce e il nome dell'artista
     return { totalDuration: totalDuration, number : number , artist: artist };
 }
 
 // Funzione per cercare tracce utilizzando una query
 async function searchTracks(query) {
     const url = new URL('https://striveschool-api.herokuapp.com/api/deezer/search');
     url.search = new URLSearchParams({ q: query });
 
     try {
         const response = await fetch(url);
         const data = await response.json();
 
         if (data && data.data && data.data.length > 0) {
             displayTracks(data.data); // Visualizza le tracce trovate
         } else {
             console.error('Nessuna traccia trovata'); // Se non ci sono tracce corrispondenti alla query
         }
     } catch (error) {
         console.error('Errore durante la ricerca delle tracce:', error); // Gestisce gli errori di ricerca
     }
 }
 
 // Funzione per salvare i dati locali come file JSON
 function saveDataAsJSON() {
     const localStorageData = { 
         storedArtists: retrieveDataFromLocalStorage('artist'), // Recupera dati degli artisti
         storedTracks: retrieveDataFromLocalStorage('track'), // Recupera dati delle tracce
         storedAlbums: retrieveDataFromLocalStorage('album') // Recupera dati degli album
     };
 
     const jsonData = JSON.stringify(localStorageData);
     const blob = new Blob([jsonData], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
 
     const link = document.createElement('a');
     link.href = url;
     link.download = 'storedData.json';
     link.click();
 }
 
 // Funzione per recuperare dati dal localStorage
 function retrieveDataFromLocalStorage(keyPrefix) {
     const retrievedData = {};
     for (let i = 0; i < localStorage.length; i++) {
         const key = localStorage.key(i);
         if (key.startsWith(keyPrefix)) {
             const data = localStorage.getItem(key);
             retrievedData[key] = JSON.parse(data); // Ottiene e converte i dati in formato JSON
         }
     }
     return retrievedData; // Restituisce i dati recuperati dal localStorage
 }
 
 // Funzione per riprodurre l'anteprima di una traccia audio
 function playTrackPreview(previewLink) {
     const audioPlayer = document.getElementById('audioPlayer');
     const playButton = document.getElementById('play-button');
     const pauseButton = document.getElementById('pause-button');
     if (previewLink && audioPlayer) {
         playButton.addEventListener('click', function() {
             audioPlayer.play(); // Avvia la riproduzione audio
         });
     
         pauseButton.addEventListener('click', function() {
             audioPlayer.pause(); // Mette in pausa la riproduzione audio
         });
     } else {
         console.log('Nessun link di anteprima disponibile per questa traccia o elemento audio non trovato.');
     }
 }
 
 // Impostazioni per il click sull'icona di ricerca
 const searchIcon = document.getElementById('searchIcon');
 const searchCentral = document.querySelector('.search-central');
 const centralPage = document.getElementById('centralPage');
 
 searchIcon.addEventListener('click', function() {
     if (centralPage.classList.contains('d-none')) {
         centralPage.classList.remove('d-none'); // Mostra la pagina centrale
         searchCentral.classList.add('d-none'); // Nasconde l'elemento di ricerca
     } else {
         centralPage.classList.add('d-none'); // Nasconde la pagina centrale
         searchCentral.classList.remove('d-none'); // Mostra l'elemento di ricerca
     }
 });