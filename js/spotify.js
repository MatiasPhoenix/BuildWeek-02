
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
                    //document.getElementById('results').appendChild(artistElement);

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
    artistContainer.classList.add('artist-details', 'col-2');

    const artistImage = document.createElement('img');
    artistImage.src = image;
    artistImage.alt = 'Artist Image';
    artistContainer.appendChild(artistImage);

    let artistNameContainer = document.createElement('div');
    artistNameContainer.classList.add('artistNameContainer');

    let divmiocaroDiv = document.createElement('div');
    divmiocaroDiv.classList.add('divmiocaroDiv');
    artistContainer.appendChild(divmiocaroDiv);
    divmiocaroDiv.appendChild(artistNameContainer);

    const artistName = document.createElement('h4');
    artistName.classList.add('artistName');
    artistName.textContent = name;
    artistNameContainer.appendChild(artistName);

    let pArtista = document.createElement('p');
    pArtista.classList.add('pArtista');
    pArtista.textContent = 'Artista';
    artistNameContainer.appendChild(pArtista);

    const plusIconArtist = document.createElement('i');
    plusIconArtist.classList.add('bi', 'bi-heart');
    plusIconArtist.classList.add('plus-iconArtist');
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
    divmiocaroDiv.appendChild(plusIconArtist);

    document.getElementById('results').appendChild(artistContainer);
    document.getElementById('results').classList.add('container-container', 'row', 'grid', 'gap-5')
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
        console.log(tracks);
        tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.classList.add('mb-2', 'pl-3', 'trackElement');

            let divImg = document.createElement('div');
            divImg.classList.add('divImg');

            let divDurationPlay = document.createElement('div');
            divDurationPlay.classList.add('divDurationPlay');
            trackElement.appendChild(divImg);
            trackElement.appendChild(divDurationPlay);

            let cover = document.createElement('img');
            cover.classList.add('imgTrack');
            cover.src = track.album.cover;
            divImg.appendChild(cover);

            let divTitle = document.createElement('div');
            divTitle.classList.add('divTitle');
            divImg.appendChild(divTitle);

            let title = document.createElement('a');
            title.classList.add('aTitle');
            title.textContent = track.title;
            divTitle.appendChild(title);

            let artist = document.createElement('a');
            artist.classList.add('aArtist');
            artist.textContent = track.artist.name;
            divTitle.appendChild(artist);

            let duration = document.createElement('a');
            duration.classList.add('aDuration');
            duration.textContent = secondToMinutes(track.duration);
            divDurationPlay.appendChild(duration);


            // resultsContainer.appendChild(trackElement);

            const plusIconTrack = document.createElement('i');
            plusIconTrack.classList.add('bi', 'bi-heart', 'aPlus');
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
                    // Aggiungi altre proprietÃ  che desideri salvare
                };
                localStorage.setItem('track/' + track.id, JSON.stringify(trackData));
                alert('Traccia aggiunta al localStorage!');

            });

            // trackElement.appendChild(plusIconTrack);

            const playIcon = document.createElement('i');
            divDurationPlay.appendChild(playIcon);
            divDurationPlay.appendChild(plusIconTrack);
            playIcon.classList.add('bi', 'bi-play-circle-fill', 'aPlay');
            playIcon.addEventListener('click', function () {
                const url = track.preview; // Utilizza 'const' o 'let' invece di 'url =' per dichiarare la variabile

                playSpecificSong(url);

            });

            // trackElement.appendChild(playIcon);


            resultsContainer.appendChild(trackElement);
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
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(results, albumIds, query) {
    const resultsContainer = document.getElementById('results');

    let artistInfo;

    results.forEach(track => {
        artistInfo = track.artist;
    });

    // Ora artistInfo è accessibile anche al di fuori della funzione forEach


    resultsContainer.innerHTML = '';
    let divSalvaTutti = document.createElement('div');
    divSalvaTutti.classList.add('divSalvaTutti');

    const albums = results.reduce((acc, track) => {
        acc[track.album.id] = acc[track.album.id] || { tracks: [], cover: track.album.cover, totalDuration: 0, title: track.album.title, artist: track.artist.name, id: track.album.id, artistId: track.artist.id, artistImage: track.artist.picture, anno: track.album.release_date };
        acc[track.album.id].tracks.push(track);
        acc[track.album.id].totalDuration += track.duration;
        return acc;
    }, {});

    Object.keys(albums).forEach(albumId => {
        const album = albums[albumId];
        album.tracks.sort((a, b) => b.rank - a.rank);

        const albumContainer = document.createElement('div');
        albumContainer.classList.add('cardAlbum', 'pt-3', 'px-3', 'card', 'col-3', 'mt-3', 'me-5');

        const albumImage = document.createElement('img');
        albumImage.classList.add('card-img-top', 'imgcardAlbum', 'rounded-2')
        albumImage.src = album.cover;
        albumImage.alt = "Album Cover";
        albumContainer.appendChild(albumImage);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'cardFlex');
        albumContainer.appendChild(cardBody);

        let containerArtistTrack = document.createElement('div');
        cardBody.appendChild(containerArtistTrack);



        const albumTitle = document.createElement('div');
        albumTitle.classList.add('card-title');
        albumTitle.textContent = album.title;
        containerArtistTrack.appendChild(albumTitle);


        const artistElement = document.createElement("div"); // Crea l'elemento per l'artista
        artistElement.textContent = album.artist;
        containerArtistTrack.appendChild(artistElement);

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
                id: album.id,
                // Supponendo che artistName sia disponibile in questo contesto
                // Aggiungi altre proprietÃ  che desideri salvare
            };
            localStorage.setItem('album/' + albumId, JSON.stringify(albumData));
            alert('Album aggiunto al localStorage!');
        });
        cardBody.appendChild(plusIconAlbum);

        divSalvaTutti.appendChild(albumContainer);
        resultsContainer.appendChild(divSalvaTutti);
        albumImage.addEventListener('click', function () {
            showSectionCenter(sectionAlbum);
            fetchAlbumDetails(albumId)
                .then(albumDetails => {

                    let immGrande = albumDetails.cover;
                    let titolo = albumDetails.title;
                    let immCantante = albumDetails.cover;
                    let minutiAlbum = formatDuration(albumDetails.duration);
                    let nomeArtista = albumDetails.artist.name;
                    let dataAnno = albumDetails.release_date;
                    let numeroCanz = albumDetails.nb_tracks;
                    let tracks = albumDetails.tracks
                    console.log(albumDetails);

                    populatePageWithData(
                        immGrande,
                        titolo,
                        immCantante,
                        minutiAlbum,
                        nomeArtista,
                        dataAnno,
                        numeroCanz,
                        tracks
                    )

                })
                .catch(error => {
                    console.error(error);
                    // Gestisci l'errore in modo appropriato
                });
            loadTracks(album.tracks[0].album.id);
            searchArtistId(query);
        });

    });

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
let playSong = document.getElementById('playSong');
let artistaNome = document.getElementById('artistaNome');
let dataSong = document.getElementById('dataSong');
dataSong.addEventListener('click', function () {
    showSectionCenter(sectionAlbum);
});


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

    containerAlbum.appendChild(cardAlbum);

    cardAlbum.addEventListener('click', function () {
        showSectionCenter(sectionAlbum);

    });
    // Aggiungiamo la copia del blocco HTML al container
});







const artist = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('artist/')) {
        const artistData = JSON.parse(localStorage.getItem(key));
        artist.push(artistData);
    }
}


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
    cardAlbum.addEventListener('click', function () {
        showSectionCenter(sectionArtist);
    });
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

















const searchIcon = document.getElementById('searchIcon');
const plusPlaylist = document.getElementById('plus');
const homeButton = document.getElementById('homeButton'); // Aggiungi il riferimento al pulsante Home
const searchCentral = document.querySelector('.search-central');
const playlistCentral = document.querySelector('.playlist-central');
const centralPage = document.getElementById('centralPage');

function showSection(sectionToShow) {
    const sections = [centralPage, searchCentral, playlistCentral];

    sections.forEach(section => {
        if (section === sectionToShow) {
            section.classList.remove('d-lg-none');
            section.classList.add('d-lg-block');
        } else {
            section.classList.add('d-lg-none');
            section.classList.remove('d-lg-block');
        }
    });
}

searchIcon.addEventListener('click', function () {
    showSection(searchCentral);
});

plusPlaylist.addEventListener('click', function () {
    showSection(playlistCentral);
});

homeButton.addEventListener('click', function () {
    showSection(centralPage);
    showSectionCenter(sectionHome);
});





const sectionHome = document.getElementById('sectionHome');
const sectionArtist = document.getElementById('sectionArtist');
const sectionAlbum = document.getElementById('sectionAlbum');

function showSectionCenter(sectionToShow) {
    showSection(centralPage);
    const sections = [sectionAlbum, sectionArtist, sectionHome];

    sections.forEach(section => {
        if (section === sectionToShow) {

            section.classList.remove('hidden-element');
        } else {
            section.classList.add('hidden-element');
        }
    });
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








let cardHomePlaylist = document.querySelectorAll('.cardHomePlaylist');
cardHomePlaylist.forEach(card => {
    card.addEventListener('click', function () {
        showSectionCenter(sectionAlbum);
    })
});

let playListCentral = document.querySelectorAll('.playListCentral');
playListCentral.forEach(card => {
    card.addEventListener('click', function () {
        showSectionCenter(sectionAlbum);
    })
});


let arrowLeft = document.querySelectorAll('.arrowLeft');
arrowLeft.forEach(arrow => {
    arrow.addEventListener('click', function () {
        showSectionCenter(sectionHome);
    });
});










/*************************************************************** ALBUM **************************************************/

/*
function fillPageWithAlbumData(albumDetails, songsList) {
    // Funzione per popolare dinamicamente i dettagli dell'album
    function populateAlbumDetails() {
      const albumCover = document.getElementById("imgAlbumGrand");
      const albumTitle = document.getElementById("titleSongs");
      const albumDuration = document.getElementById("spanMinuteAlbum");
      // Popolare gli elementi HTML con i dati dell'album
      albumCover.src = albumDetails.coverImage;
      albumTitle.textContent = `${albumDetails.title} - ${albumDetails.artist} (${albumDetails.year})`;
      albumDuration.textContent = albumDetails.duration;
    }
  
    // Funzione per popolare dinamicamente la lista delle canzoni
    function populateSongsList() {
      const containerSongs = document.getElementById("containerSongsAlbum");
      // Ciclo attraverso i dati delle canzoni e aggiungi elementi HTML
      songsList.forEach((song) => {
        const songElement = document.createElement("div");
        songElement.classList.add("row", "justify-content-around", "mt-4");
        songElement.innerHTML = `
          <div class="col-6 d-flex align-items-center">
              <div>${song.trackNumber}</div>
              <div class="d-flex flex-column grid gap-2 ms-3">
                  <p>${song.title}</p>
                  <span>${song.artist}</span>
              </div>
          </div>
          <div class="col-2 d-flex justify-content-end">${song.trackNumber}</div>
          <div class="col-2 d-flex justify-content-end">${song.duration}</div>
        `;
        containerSongs.appendChild(songElement);
      });
    }
  
    // Chiamare le funzioni per popolare la pagina quando il documento è pronto
    document.addEventListener("DOMContentLoaded", () => {
      populateAlbumDetails();
      populateSongsList();
      // Eventuali altre operazioni che desideri eseguire quando la pagina è caricata
    });
  }
  
  // Esempio di dati JSON simulati per l'album e le canzoni
  const albumData = {
    title: "Gioventù Brucata",
    artist: "Pinguini Tattici Nucleari",
    year: 2017,
    duration: "53 min 20 sec",
    coverImage: "assets/imgs/main/image-15.jpg",
    // Altri dettagli dell'album...
  };
  
  const songsData = [
    { trackNumber: 1, title: "Montanelli - Intro", artist: "Pinguini Tattici Nucleari", duration: "3:45" },
    // Altre canzoni...
  ];
  
  // Chiamata alla funzione per popolare la pagina con i dati dell'album e delle canzoni
  fillPageWithAlbumData(albumData, songsData);
  


  */


function populatePageWithData(
    immGrande,
    titolo,
    immCantante,
    minutiAlbum,
    nomeArtista,
    dataAnno,
    numeroCanz,
    tracks,
) {
    console.log(tracks);
    console.log(titolo);
    let imgAlbumGrande = document.getElementById("imgAlbumGrand");
    imgAlbumGrande.src = immGrande;

    let cloneTraccia = document.getElementById("cloneTraccia");
    let contenitoreCloni = document.getElementById("contenitoreCloni");
    let contatoreAlbumTrack = document.querySelector(".contatoreAlbumTrack");
    contatoreAlbumTrack.textContent = 1;
    contenitoreCloni.innerHTML = '';

    
    let titleSongsAlbum = document.getElementById("titleSongsAlbum");
    titleSongsAlbum.textContent = titolo;
    
    let imgAlbumPar = document.getElementById("imgAlbumPar");
    imgAlbumPar.src = immCantante;
    
    let spanMinuteAlbum = document.getElementById("spanMinuteAlbum");
    spanMinuteAlbum.textContent = minutiAlbum;
    
    
    let nameTrack = document.querySelector(".nameTrack");
    nameTrack.textContent = "nomeTraccia";

    let nameArtist = document.querySelectorAll(".nameArtist");
    nameArtist.forEach(nome => {
        nome.textContent = nomeArtista
    });
    
    let dataAlbum = document.querySelector(".dataAlbum");
    dataAlbum.textContent = dataAnno;

    let numeroCanzoni = document.querySelector(".numeroCanzoni");
    numeroCanzoni.textContent = numeroCanz;

    
    for (const track of tracks.data) {
        console.log(track.title);
        console.log(track.rank);
        let clone = cloneTraccia.children[0].cloneNode(true);
        
        // Modifica il clone con i dati della traccia corrente
        let testoParagrafo = clone.querySelector('.nameTrack');
        let testoSpan = clone.querySelector('.nameArtist');
        let rank = clone.querySelector('.rank');
        testoParagrafo.textContent = track.title; // Supponendo che 'nome' sia 'title' nella tua struttura dati
        testoSpan.textContent = track.artista;   // Supponendo che 'artista' sia 'artist' nella tua struttura dati
        contatoreAlbumTrack.textContent ++;
        rank.textContent = track.rank;
        // Aggiungi il clone al contenitore
        contenitoreCloni.appendChild(clone);
    }

}




async function fetchAlbumDetails(albumId) {
    const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`;

    return fetch(albumUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel recupero dei dettagli dell\'album');
            }
            return response.json();
        })
        .then(albumData => {
            return albumData; // Restituisce i dettagli dell'album come Promise
        })
        .catch(error => {
            throw new Error('Errore durante il recupero dei dettagli dell\'album:', error);
        });
}





