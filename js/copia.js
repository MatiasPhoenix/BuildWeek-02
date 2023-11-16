class AlbumCard {
  constructor(nome,artist) {
    this.artist = artist; 
    this.nome = nome;
    this.divAlbums = document.getElementById("cont-album");
    this.card = this.createCard(nome,artist);
    this.divAlbums.appendChild(this.card);

    // Aggiungi un listener di evento alla card stessa
    this.card.addEventListener('click', () => {
      this.handleCardClick();
    });
  }

  createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    element.classList.add(className);
    element.textContent = textContent;
    return element;
  }

  createLink(tag, className, textContent) {
    const link = this.createElement(tag, className, textContent);
    link.href = '#';
    return link;
  }

  createCard(nome,artist) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.appendChild(this.createElement('h4', 'title-card', nome));

    const img = this.createElement('img', 'card-img-top', '');
    img.src = imgUrl;
    img.alt = `${nome} cover`;
    card.appendChild(img);

    const cardLinks = this.createElement('div', 'card-body', '');
    const link1 = this.createLink('a', 'card-link', '');
    const link2 = this.createLink('a', 'card-link', '');
    link1.textContent = `${year}`;
    link2.textContent = `${artist}`;

    cardLinks.appendChild(link1);
    cardLinks.appendChild(link2);
    card.appendChild(cardLinks);

    return card;
  }

  handleCardClick() {
    console.log(this.artist);
    this.fetchAlbums();
  }

  fetchAlbums() {
    const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${this.nome}`;
    this.retrieveAlbums(apiUrl);
  }

  retrieveAlbums(apiUrl) {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Errore nella risposta API: ${response.status}`);
        }
        return response.json();
      })
      .then(data => { 
        const albums = data.data; // Accedi all'array di dati
        albums.forEach(album => {
          nome = album.title;
          imgUrl = album.cover;
          
        });
      })
      .catch(error => console.error('Errore durante la richiesta API', error));
  }
  
  
}
let array = [];
let divAlbums = document.getElementById("cont-album");
let albumCard = new AlbumCard("Fire", "assets/imgs/main/image-1.jpg", "2020", "The beatles");
let albumCard2 = new AlbumCard("The Eminem Show", "Eminem");



let totalSeconds = 311;

let minutes = Math.floor(totalSeconds / 60); // Trova il numero di minuti interi
let seconds = totalSeconds % 60; // Trova il numero di secondi rimanenti

console.log(`${totalSeconds} secondi sono ${minutes} minuti e ${seconds} secondi.`);











