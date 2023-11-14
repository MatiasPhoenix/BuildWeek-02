document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value;
    searchMusic(query);
});

function searchMusic(query) {
    const url = new URL('https://striveschool-api.herokuapp.com/api/deezer/search');
    url.search = new URLSearchParams({ q: query });

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const albumIds = data.data.map(track => track.album.id);
            displayResults(data.data, albumIds);
        })
        .catch(error => console.error('Error:', error));
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
            trackElement.textContent = `Track: ${track.title}, Rank: ${track.rank}, Duration: ${secondToMinutes(track.duration)}`;
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
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(results, albumIds) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const albums = results.reduce((acc, track) => {
        acc[track.album.id] = acc[track.album.id] || { tracks: [], cover: track.album.cover, totalDuration: 0 };
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

        const albumTitle = document.createElement('h5');
        albumTitle.textContent = `Album: ${album.tracks[0].album.title}`;
        albumContainer.appendChild(albumTitle);

        const totalDurationElement = document.createElement("div");
        totalDurationElement.textContent = `Total Duration: ${formatDuration(album.totalDuration)}`;
        albumContainer.appendChild(totalDurationElement);

        resultsContainer.appendChild(albumContainer);

        albumContainer.addEventListener('click', function () {
            loadTracks(album.tracks[0].album.id);
        });

        // Calcola la durata totale degli album
        calculateTotalDuration([albumId])
            .then(totalDuration => {
                totalDurationElement.textContent = `Total Duration: ${totalDuration}`;
            })
            .catch(error => {
                console.error(`Errore durante il calcolo della durata totale per l'album ${albumId}:`, error);
            });
    });
}

async function calculateTotalDuration(albumIds) {
    let totalDuration = 0;

    // Itera su ciascun ID dell'album
    for (const albumId of albumIds) {
        try {
            // Esegui una chiamata API per ottenere le tracce dell'album
            const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
            const data = await response.json();

            // Verifica se le tracce sono presenti e non vuote
            if (data && data.tracks && data.tracks.data) {
                // Calcola la durata totale delle tracce dell'album
                const albumTotalDuration = data.tracks.data.reduce((acc, track) => acc + track.duration, 0);
                totalDuration += albumTotalDuration;
            }
        } catch (error) {
            console.error(`Errore durante il recupero delle informazioni per l'album ${albumId}:`, error);
        }
    }

    // Restituisci la durata totale formattata
    return formatDuration(totalDuration);
}