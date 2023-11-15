fetch('dati.json') // Sostituisci 'artisti_e_album.json' con il nome effettivo del tuo file JSON
  .then(response => response.json())
  .then(data => {
    // Estrai gli artisti e gli album dall'oggetto JSON
    const artisti = data.artisti;
    const album = data.album;

    // Mostra gli artisti
    artisti.forEach(artista => {
      const contenitoreArtista = document.createElement('div');
      contenitoreArtista.classList.add('contenitore-artista');

      const nomeArtista = document.createElement('p');
      nomeArtista.textContent = `Nome: ${artista.nome}`;

      const genereArtista = document.createElement('p');
      genereArtista.textContent = `Genere: ${artista.genere}`;

      const immagineArtista = document.createElement('img');
      immagineArtista.src = artista.immagine;
      immagineArtista.alt = artista.nome;

      const linkTopCanzoni = document.createElement('a');
      linkTopCanzoni.textContent = 'Top Canzoni';
      linkTopCanzoni.href = artista.topCanzoni;
      linkTopCanzoni.target = '_blank'; // Apre il link in una nuova finestra/tab

      contenitoreArtista.appendChild(nomeArtista);
      contenitoreArtista.appendChild(genereArtista);
      contenitoreArtista.appendChild(immagineArtista);
      contenitoreArtista.appendChild(document.createElement('br'));
      contenitoreArtista.appendChild(linkTopCanzoni);

      document.body.appendChild(contenitoreArtista);
    });

    // Mostra gli album
    album.forEach(album => {
      const contenitoreAlbum = document.createElement('div');
      contenitoreAlbum.classList.add('contenitore-album');

      const titoloAlbum = document.createElement('p');
      titoloAlbum.textContent = `Titolo Album: ${album.titolo}`;

      const immagineAlbum = document.createElement('img');
      immagineAlbum.src = album.immagine;
      immagineAlbum.alt = album.titolo;

      const linkTracklistAlbum = document.createElement('a');
      linkTracklistAlbum.textContent = 'Tracklist Album';
      linkTracklistAlbum.href = album.tracklist;
      linkTracklistAlbum.target = '_blank'; // Apre il link in una nuova finestra/tab

      contenitoreAlbum.appendChild(titoloAlbum);
      contenitoreAlbum.appendChild(immagineAlbum);
      contenitoreAlbum.appendChild(document.createElement('br'));
      contenitoreAlbum.appendChild(linkTracklistAlbum);

      document.body.appendChild(contenitoreAlbum);
    });
  })
  .catch(error => {
    console.error('Si è verificato un errore:', error);
  });

   