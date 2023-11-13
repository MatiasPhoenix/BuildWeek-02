class AlbumCard {
  constructor(nome, imgUrl, year, artist) {
    this.nome = nome; 
    this.artist = artist; 
    this.divAlbums = document.getElementById("cont-album");
    this.card = this.createCard(nome, imgUrl, year, artist);
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

  createCard(nome, imgUrl, year, artist) {
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
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${this.artist}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Esegui le operazioni desiderate con i dati ottenuti dalla chiamata API
      })
      .catch(error => console.error('Errore durante la richiesta API', error));
  }
}

let divAlbums = document.getElementById("cont-album");
let albumCard = new AlbumCard("Fire", "assets/imgs/main/image-1.jpg", "2020", "The beatles");
let albumCard2 = new AlbumCard("Mario", "assets/imgs/main/image-2.jpg", "2020", "Adele");




