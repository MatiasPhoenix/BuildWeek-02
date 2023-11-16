
const audio = document.getElementById("audio");
const progressBar = document.getElementById("song-progress");
const volumeBar = document.getElementById("volume-bar");
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const shuffleButton = document.getElementById("shuffle-button");
const repeatButton = document.getElementById("repeat-button");

let playlist = [
    "https://cdns-preview-b.dzcdn.net/stream/c-bcf686b9b7b146a3ce3d160cbfa2d1b5-7.mp3",
    "https://cdns-preview-7.dzcdn.net/stream/c-7dcc9a004604ea2039cc484def2b27f5-9.mp3",
    "https://cdns-preview-1.dzcdn.net/stream/c-1807e30955bf78b8c62c6f8bcf72a986-7.mp3",
    "https://cdns-preview-9.dzcdn.net/stream/c-9e208326d4114be07cbadc20ee8394c8-8.mp3",
];
let currentSongIndex = 0;
let isPlaying = false;
let resumePlayback = false; // Track whether we need to resume playback
let isShuffle = false;
let repeatMode = 0; // 0: No repeat, 1: Repeat playlist, 2: Repeat current song

function playCurrentSong() {
    let currentSongUrl = playlist[currentSongIndex];
    audio.src = currentSongUrl;

    if (resumePlayback) {
        audio.currentTime = resumePlayback; // Set the saved playback position
        resumePlayback = false; // Reset the flag
    } else {
        audio.currentTime = 0; // Start from the beginning if not resuming
    }

    audio.play();
    isPlaying = true;
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    resumePlayback = audio.currentTime; // Save the current playback position
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playCurrentSong();
    }
    updatePlayPauseButtons();
}

function updatePlayPauseButtons() {
    playButton.style.display = isPlaying ? "none" : "block";
    pauseButton.style.display = isPlaying ? "block" : "none";
}

function playNextSong() {
    pauseSong(); // Pause the current song before moving to the next one

    if (isShuffle) {
        // Shuffle the playlist and pick a random song
        currentSongIndex = getRandomIndex(currentSongIndex);
    } else {
        currentSongIndex++;
        if (currentSongIndex >= playlist.length) {
            currentSongIndex = 0;
        }
    }
    // Reset the resumePlayback to start from the beginning of the next song
    resumePlayback = false;
    playCurrentSong();
    updatePlayPauseButtons();
}

function playPreviousSong() {
    pauseSong(); // Pause the current song before moving to the previous one

    if (isShuffle) {
        // Shuffle the playlist and pick a random song
        currentSongIndex = getRandomIndex(currentSongIndex);
    } else {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = playlist.length - 1;
        }
    }
    // Reset the resumePlayback to start from the beginning of the previous song
    resumePlayback = false;
    playCurrentSong();
    updatePlayPauseButtons();
}

function getRandomIndex(currentIndex) {
    let randomIndex = currentIndex;
    while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * playlist.length);
    }
    return randomIndex;
}

function playSpecificSong(url) {
    // Imposta l'URL della canzone specificata
    playlist = [url];
    currentSongIndex = 0;
    playCurrentSong();
    updatePlayPauseButtons();
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        // Shuffle the playlist
        playlist = shuffleArray(playlist);
        // Update current song index to the first song in the shuffled playlist
        currentSongIndex = 0;
    }
    updateShuffleButton();
}

function updateShuffleButton() {
    shuffleButton.style.color = isShuffle ? "#1ED760" : "white";
}

function shuffleArray(array) {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ];
    }
    return shuffledArray;
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3; // Cycle through 0, 1, 2
    updateRepeatButton();
}

function updateRepeatButton() {
    switch (repeatMode) {
        case 0:
            // No repeat
            repeatButton.style.color = "white";
            break;
        case 1:
            // Repeat playlist
            repeatButton.style.color = "#1ED760";
            break;
        case 2:
            // Repeat current song
            repeatButton.style.color = "#1ED760";
            break;
    }
}

function handleSongEnded() {
    if (repeatMode === 2) {
        // Repeat current song
        playCurrentSong();
    } else {
        // Move to the next song
        playNextSong();
    }
}

audio.addEventListener("timeupdate", function () {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
});

progressBar.addEventListener("input", function () {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

volumeBar.addEventListener("input", function () {
    const volume = volumeBar.value / 100;
    audio.volume = volume;
});

shuffleButton.addEventListener("click", toggleShuffle);
repeatButton.addEventListener("click", toggleRepeat);
playButton.addEventListener("click", togglePlayPause);
pauseButton.addEventListener("click", togglePlayPause);
document
    .getElementById("next-button")
    .addEventListener("click", playNextSong);
document
    .getElementById("previous-button")
    .addEventListener("click", playPreviousSong);
audio.addEventListener("ended", handleSongEnded);



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
                const tracklist = track.artist.tracklist;
                

                if (!displayedArtists.has(`${artistId}_${artistName}`)) { // Controlla se l'artista è già stato visualizzato
                    console.log('ID dell\'artista:', artistId);
                    console.log('Nome dell\'artista:', artistName);
                    console.log('URL immagine dell\'artista:', artistImage);

                    // Mostra dettagli artista
                    displayArtistDetails(artistName, artistImage, artistId, tracklist);

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


function displayArtistDetails(name, image, artistId, tracklist) {
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
    plusIconArtist.classList.add('bi', 'bi-heart');
    plusIconArtist.addEventListener('click', function () {
        // Salva i dati associati all'artista nel localStorage
        const artistData = {
            name: artistName.textContent, // Ottiene il nome dell'artista come stringa
            image: artistImage.src,
            tracklist: tracklist, // Ottiene l'URL dell'immagine dell'artista come stringa
            id: artistId // Aggiunge l'ID dell'artista
            // Aggiungi altri dati necessari
            // esempio: albums: ['album1', 'album2']
        };
    
        localStorage.setItem('artist/' + artistId, JSON.stringify(artistData));
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

            const plusIconTrack = document.createElement('i');
            plusIconTrack.classList.add('bi', 'bi-heart');
            plusIconTrack.addEventListener('click', function () {
                // Salva i dati associati alla traccia nel localStorage
                const trackData = {
                    title: track.title,
                    rank: track.rank,
                    duration: track.duration,
                    artist: track.artist.name,
                    preview: track.preview, 
                    cover: track.album.cover,
                    artistId: track.artist.id,
                    tracksArtist: track.artist.tracklist,
                    albumId: track.album.id// Supponendo che preview sia disponibile in questo contest
                    // Aggiungi altre proprietà che desideri salvare
                };
                localStorage.setItem('track/' + track.id, JSON.stringify(trackData));
                alert('Traccia aggiunta al localStorage!');

            });
            trackElement.appendChild(plusIconTrack);
            console.log(track.preview);
            const playIcon = document.createElement('i');
            playIcon.classList.add('bi', 'bi-play-circle-fill', 'mr-2');
            playIcon.addEventListener('click', function () {
                const url = track.preview; // Utilizza 'const' o 'let' invece di 'url =' per dichiarare la variabile
                console.log(url);
                playSpecificSong(url);
                console.log(playSpecificSong(url));
            });
            
            trackElement.appendChild(playIcon);

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
        acc[track.album.id] = acc[track.album.id] || { tracks: [], cover: track.album.cover, totalDuration: 0, title: track.album.title, artist: track.artist.name, id: track.album.id};
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
        plusIconAlbum.classList.add('bi', 'bi-heart');
        plusIconAlbum.addEventListener('click', function () {
            // Salva i dati associati all'album nel localStorage
            const albumData = {
                title: album.title,
                number: album.number, 
                totalDuration: album.totalDuration,
                artist: album.artist,
                cover: album.cover,
                id:album.id,
                 // Supponendo che artistName sia disponibile in questo contesto
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
    return { totalDuration: totalDuration, number: number, artist: artist };
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



//////////////////HOMEPAGE/////////////////////////////////////////////////////////////////////////////////////////

const albums = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('album/')) {
        const albumData = JSON.parse(localStorage.getItem(key));
        albums.push(albumData);
    }
}
function getRandomAlbum(albums) {
    const randomAlbumIndex = Math.floor(Math.random() * albums.length);
    return albums[randomAlbumIndex];
}
const randomAlbum = getRandomAlbum(albums);

let imgSong = document.getElementById('imgSong');
let titoloCanzone = document.getElementById('titoloCanzone');
let playSong= document.getElementById('playSong');
let artistaNome = document.getElementById('artistaNome');


if (randomAlbum) {
    imgSong.src = randomAlbum.cover; 
    titoloCanzone.textContent = `Titolo: ${randomAlbum.title}`; // Inserisci il titolo dell'album
    artistaNome.textContent = `Artista: ${randomAlbum.artist}`; // Inserisci l'artista dell'album
}

playSong.addEventListener('click', function () {
    loadTracks(randomAlbum.id);
    saveDataAsJSON();
});


const containerAlbum = document.querySelector('.containerAlbum'); // Otteniamo il container dove inserire le copie

albums.forEach(album => {
    const cardAlbum = document.createElement('div');
    cardAlbum.classList.add('cardAlbum', 'pt-3', 'px-3', 'card', 'col-3', 'mt-3');
    cardAlbum.style.width = '18rem';
    
    const cardImage = document.createElement('img');
    cardImage.classList.add('card-img-top', 'imgcardAlbum', 'rounded-2');
    cardImage.src = album.cover;
    cardImage.alt = 'Card image cap';
    cardAlbum.appendChild(cardImage);
    
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = album.title;
    cardBody.appendChild(cardTitle);
    
    const cardText = document.createElement('p');
    cardText.classList.add('card-text', 'fw-bold', 'colorCard');
    cardText.textContent = `Artista: ${album.artist}`;
    cardBody.appendChild(cardText);
    
    cardAlbum.appendChild(cardBody);
    
    containerAlbum.appendChild(cardAlbum); // Aggiungiamo la copia del blocco HTML al container
});







const artist = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('artist/')) {
        const artistData = JSON.parse(localStorage.getItem(key));
        artist.push(artistData);
    }
}
console.log(artist);

const containerArtist = document.querySelector('.containerArtist'); // Otteniamo il container dove inserire le copie

artist.forEach(artist => {
    const cardAlbum = document.createElement('div');
    cardAlbum.classList.add('cardAlbum', 'pt-3', 'px-3', 'card', 'col-3', 'mt-3');
    cardAlbum.style.width = '18rem';
    
    const cardImage = document.createElement('img');
    cardImage.classList.add('card-img-top', 'imgcardAlbum', 'rounded-2');
    cardImage.src = artist.image;
    cardImage.alt = 'Card image cap';
    cardAlbum.appendChild(cardImage);
    
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = "Artista";
    
    const cardText = document.createElement('p');
    cardText.classList.add('card-text', 'fw-bold', 'colorCard');
    cardText.textContent = `Artista: ${artist.name}`;
    cardBody.appendChild(cardText);
    
    cardAlbum.appendChild(cardBody);
    
    containerArtist.appendChild(cardAlbum); // Aggiungiamo la copia del blocco HTML al container
});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('playlistForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const playlistNameInput = document.getElementById('playlistName');
        const playlistName = playlistNameInput.value;

        if (playlistName.trim() !== '') {
            const containerPlaylist = document.getElementById('containerPlaylist');
            const newPlaylist = document.createElement('p');
            const playlistLink = document.createElement('a');

            playlistLink.href = '#';
            playlistLink.textContent = playlistName;
            newPlaylist.appendChild(playlistLink);
            containerPlaylist.prepend(newPlaylist);

            playlistNameInput.value = '';
        } else {
            alert('Inserisci un nome per la playlist.');
        }
    });
});
    
    
    
    
    
    
    
    
    
    
    
    


    
    
    
    document.addEventListener('DOMContentLoaded', function() {
        const searchIcon = document.getElementById('searchIcon');
        const plusPlaylist = document.getElementById('plus');
        const searchCentral = document.querySelector('.search-central');
        const playlistCentral = document.querySelector('.playlist-central');
        const centralPage = document.getElementById('centralPage');
        
        function showSection(sectionToShow) {
            const sections = [centralPage, searchCentral, playlistCentral];

        sections.forEach(section => {
            if (section === sectionToShow) {
                section.classList.remove('d-none');
            } else {
                section.classList.add('d-none');
            }
        });
    }
    
    searchIcon.addEventListener('click', function () {
        showSection(searchCentral);
    });
    
    plusPlaylist.addEventListener('click', function () {
        showSection(playlistCentral);
    });
});






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