document.getElementById('searchForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value;
    const isArtistSearch = document.getElementById('artistCheckbox').checked;
    const isAlbumSearch = document.getElementById('albumCheckbox').checked;

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Svuota i risultati precedenti

    if (!isArtistSearch && !isAlbumSearch) {
        searchTracks(query);

    } else {
        if (isArtistSearch) {
            const artistData = await searchArtistId(query);
            if (artistData) {
                // Esegui operazioni specifiche per l'artista
                // Mostra i dettagli dell'artista
                console.log('Dettagli artista:', artistData);
            }
        }
        if (isAlbumSearch) {
            searchMusic(query);
        }
    }
});

// Verifica iniziale per assicurarci che almeno un checkbox sia selezionato all'avvio
const initialArtistSearch = document.getElementById('artistCheckbox').checked;
const initialAlbumSearch = document.getElementById('albumCheckbox').checked;

if (!initialArtistSearch && !initialAlbumSearch) {
    // Nessun checkbox selezionato all'avvio, esegui la ricerca delle tracce
    searchTracks(document.getElementById('searchQuery').value);
}

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

                    // Mostra dettagli artista
                    displayArtistDetails(artistName, artistImage, artistId);

                    // Aggiungi evento clic per aprire la tracklist
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


function displayArtistDetails(name, image, artistId) {
    // Mostra dettagli artista nell'interfaccia
    const artistContainer = document.createElement('div');
    artistContainer.classList.add('artist-details');

    const artistImage = document.createElement('img');
    artistImage.src = image;
    artistImage.alt = 'Artist Image';
    artistImage.style.width = '100px';
    artistContainer.appendChild(artistImage);

    const artistName = document.createElement('h4');
    artistName.textContent = name;
    artistContainer.appendChild(artistName);

    const plusIconArtist = document.createElement('i');
    plusIconArtist.classList.add('bi', 'bi-plus-circle-fill');
    plusIconArtist.addEventListener('click', function() {
        // Salva i dati associati all'artista nel localStorage
        const artistData = {
            name: artistName,
            image: artistImage // Supponendo che artistImage sia disponibile in questo contesto
            // Aggiungi altre proprietà che desideri salvare
        };
        localStorage.setItem('artist/' + artistId, JSON.stringify({ name: name, image: image }));

        alert('Artista aggiunto al localStorage!');
    });
    artistContainer.appendChild(plusIconArtist);

    document.getElementById('results').appendChild(artistContainer);
}

async function loadArtistTracklist(artistId) {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
            displayTracks(data.data);
        } else {
            console.error('Nessuna traccia trovata per questo artista');
        }
    } catch (error) {
        console.error('Errore durante il caricamento della tracklist dell\'artista:', error);
    }
}



function secondToMinutes(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function displayTracks(tracks) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (tracks && tracks.length > 0) {
        tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.classList.add('mb-2', 'pl-3');
            trackElement.textContent = `Track: ${track.title}, Rank: ${track.rank}, Duration: ${secondToMinutes(track.duration)}, Artist: ${track.artist.name}`;
            resultsContainer.appendChild(trackElement);
            
            const playIcon = document.createElement('i');
            playIcon.classList.add('bi', 'bi-play-circle-fill', 'mr-2');
            playIcon.addEventListener('click', function() {
                playTrackPreview(track.preview); // Chiamata alla funzione per riprodurre la traccia
            });
            trackElement.appendChild(playIcon);
            
            

            const plusIconTrack = document.createElement('i');
            plusIconTrack.classList.add('bi', 'bi-plus-circle-fill');
            plusIconTrack.addEventListener('click', function() {
                // Salva i dati associati alla traccia nel localStorage
                const trackData = {
                    title: track.title,
                    rank: track.rank,
                    duration: track.duration,
                    artist: track.artist.name
                    // Aggiungi altre proprietà che desideri salvare
                };
                localStorage.setItem('track/' + track.id, JSON.stringify(trackData));
                alert('Traccia aggiunta al localStorage!');
            });
            trackElement.appendChild(plusIconTrack);
        });
    } else {
        const noTracksMessage = document.createElement('div');
        noTracksMessage.textContent = 'Nessuna traccia disponibile per questo album.';
        resultsContainer.appendChild(noTracksMessage);
    }
}

function loadTracks(albumId) {
    const url = new URL(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.tracks && data.tracks.data) {
                displayTracks(data.tracks.data);
            } else {
                const resultsContainer = document.getElementById('results');
                resultsContainer.innerHTML = 'Nessuna traccia disponibile per questo album.';
            }
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(results, albumIds, query) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const albums = results.reduce((acc, track) => {
        acc[track.album.id] = acc[track.album.id] || { tracks: [], cover: track.album.cover, totalDuration: 0, title: track.album.title, artist: track.artist.name };
        acc[track.album.id].tracks.push(track);
        acc[track.album.id].totalDuration += track.duration;
        return acc;
    }, {});

    Object.keys(albums).forEach(albumId => {
        const album = albums[albumId];

        album.tracks.sort((a, b) => b.rank - a.rank);

        const albumContainer = document.createElement('div');
        albumContainer.classList.add('album-container');

        const albumImage = document.createElement('img');
        albumImage.src = album.cover;
        albumImage.alt = "Album Cover";
        albumImage.style.width = "100px";
        albumContainer.appendChild(albumImage);

        const albumTitle = document.createElement('div');
        albumTitle.textContent = `Album: ${album.title}`;
        albumContainer.appendChild(albumTitle);

        const trackCountElement = document.createElement("div");
        trackCountElement.textContent = `Number of Tracks: ${album.number}`;
        albumContainer.appendChild(trackCountElement);

        
        const artistElement = document.createElement("div"); // Crea l'elemento per l'artista
        albumContainer.appendChild(artistElement);
        
        const totalDurationElement = document.createElement("div");
        totalDurationElement.textContent = `Total Duration: ${formatDuration(album.totalDuration)}`;
        albumContainer.appendChild(totalDurationElement);
        
        const plusIconAlbum = document.createElement('i');
        plusIconAlbum.classList.add('bi', 'bi-plus-circle-fill');
        plusIconAlbum.addEventListener('click', function() {
            // Salva i dati associati all'album nel localStorage
            const albumData = {
                title: album.title,
                numberOfTracks: album.tracks.length,
                totalDuration: album.totalDuration,
                artist: album.artist // Supponendo che artistName sia disponibile in questo contesto
                // Aggiungi altre proprietà che desideri salvare
            };
            localStorage.setItem('album/' + albumId, JSON.stringify(albumData));
            alert('Album aggiunto al localStorage!');
        });
        albumContainer.appendChild(plusIconAlbum); 

        resultsContainer.appendChild(albumContainer);
        albumImage.addEventListener('click', function () {
            loadTracks(album.tracks[0].album.id);
            searchArtistId(query);
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

async function searchTracks(query) {
    const url = new URL('https://striveschool-api.herokuapp.com/api/deezer/search');
    url.search = new URLSearchParams({ q: query });

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
            displayTracks(data.data);
        } else {
            console.error('Nessuna traccia trovata');
        }
    } catch (error) {
        console.error('Errore durante la ricerca delle tracce:', error);
    }
}

function saveDataAsJSON() {
    const localStorageData = { 
        // Aggiungi qui tutti i dati che vuoi salvare nel file JSON
        // Ad esempio, se hai salvato dati relativi agli artisti, tracce o album:
        storedArtists: retrieveDataFromLocalStorage('artist'),
        storedTracks: retrieveDataFromLocalStorage('track'),
        storedAlbums: retrieveDataFromLocalStorage('album')
    };

    const jsonData = JSON.stringify(localStorageData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'storedData.json';
    link.click();
}

function retrieveDataFromLocalStorage(keyPrefix) {
    const retrievedData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(keyPrefix)) {
            const data = localStorage.getItem(key);
            retrievedData[key] = JSON.parse(data);
        }
    }
    return retrievedData;
}



function playTrackPreview(previewLink) {
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    if (previewLink && audioPlayer) {
        playButton.addEventListener('click', function() {
            audioPlayer.play();
        });
    
        pauseButton.addEventListener('click', function() {
            audioPlayer.pause();
        });
    } else {
        console.log('Nessun link di anteprima disponibile per questa traccia o elemento audio non trovato.');
    }
}


const searchIcon = document.getElementById('searchIcon');
const searchCentral = document.querySelector('.search-central');
const centralPage = document.getElementById('centralPage');

searchIcon.addEventListener('click', function() {
    if (centralPage.classList.contains('d-none')) {
        centralPage.classList.remove('d-none');
        searchCentral.classList.add('d-none');
    } else {
        centralPage.classList.add('d-none');
        searchCentral.classList.remove('d-none');
    }
});




