class AlbumCard {
  constructor(nome, imgUrl, year, artist) {
    this.divAlbums = document.getElementById("cont-album");
    this.card = this.createCard(nome, imgUrl, year, artist);
    this.divAlbums.appendChild(this.card);
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
}

let divAlbums = document.getElementById("cont-album");
let cardHTML = new AlbumCard("Fire", "assets/imgs/main/image-1.jpg", "2020", "Adele");




