
class BarraSinistra {
     constructor() {
          this.homeIcon = document.querySelector('.homeIcon');
          this.searchIcon = document.querySelector('.searchIcon');
          this.libraryIcon = document.querySelector('.libraryIcon');
          this.creaPlaylist = document.querySelector('.creaPlaylist');
          this.favoriteTracks = document.querySelector('.favoriteTracks');
          this.yourEpisode = document.querySelector('.yourEpisode');
          this.containerPlaylist = document.querySelector('#containerPlaylist');
     }

     handleHomeIconClick() {
          this.homeIcon.addEventListener('click', () => {
          });
     }
}


class PaginaCentrale {
     constructor() {
          this.centralPage = document.querySelector('#centralPage');
          this.parteUguale = {
               bPageAccont: document.querySelectorAll('bPageAccont'),
               arrowPage: document.querySelectorAll('.arrowPage'),
               arrowLeft: document.querySelectorAll('.arrowLeft'),
               arrowRight: document.querySelectorAll('.arrowRight'),
               account: document.querySelectorAll('.account'),
               sezioneImgAccount: document.querySelectorAll('.sezioneImgAccount'),
               imgProfile: document.querySelectorAll('.imgProfile'),
               sezioneAccount: document.querySelectorAll('.sezioneAccount')
          };
          this.sezioneHome = {
               sectionHome: document.querySelector('#sectionHome'),
               songSection: document.querySelector('#songSection'),
               imgSong: document.querySelector('#imgSong'),
               dataSong: document.querySelector('#dataSong'),
               titoloCanzone: document.querySelector('#titoloCanzone'),
               artistaNome: document.querySelector('#artistaNome'),
               playSalvaButtons: document.querySelector('#playSalvaButtons'),
               playSong: document.querySelector('#playSong'),
               salvaSong: document.querySelector('#salvaSong'),
               nascAnnButton: document.querySelector('#nascAnnButton'),
               buonasera: document.querySelector('.buonasera'),
               // ... altri elementi della sezione Home
          };
          this.sezioneArtist = {
               sectionArtist: document.querySelector('#sectionArtist'),
               bgArtist: document.querySelector('#bgArtist'),
               titleSongsArtist: document.querySelector('#titleSongsArtist'),
               fanMonth: document.querySelector('.fanMonth'),
               playSongsArtist: document.querySelector('#playSongs'),
               salvaArtist: document.querySelector('#salvaArtist'),
               menuSvgArtist: document.querySelector('#menuSvg'),
               containerSongsArtist: document.querySelector('#containerSongsArtist'),

               /******Template ****/
               cloneTracksArtist: document.querySelector('.cloneTracksArtist'),
               containerTracksArtist: document.querySelector('#containerTracksArtist'),
               allTracksArtist: document.querySelector('.allTracksArtist'),
               /**/

               imgArtist: document.querySelector('.imgArtist'),
               numberLike: document.querySelector('.numberLike'),
               nameArtist: document.querySelector('.nameArtist'),
          };
          this.sezioneAlbum = {
               sectionAlbum: document.querySelector('#sectionAlbum'),
               titleSongsAlbum: document.querySelector('#titleSongsAlbum'),
               imgAlbumPar: document.querySelector('#imgAlbumPar'),
               nameArtistAlbum: document.querySelector('.nameArtistAlbum'),
               dataAlbum: document.querySelector('.dataAlbum'),
               numeroCanzoni: document.querySelector('.numeroCanzoni'),
               spanMinuteAlbum: document.querySelector('#spanMinuteAlbum'),
               containerBrani: document.querySelector('#containerBrani'),
               svgSong: document.querySelector('#svgSong'),
               playSongs: document.querySelector('#playSongs'),
               salvaAlbum: document.querySelector('#salvaArtist'),
               svgFastidioso: document.querySelector('#svgFastidioso'),
               menuSvgAlbum: document.querySelector('#menuSvg'),
               containerSongsAlbum: document.querySelector('#containerSongsAlbum'),

               /****Template *///
               cloneTraccia: document.querySelector('.cloneTraccia'),
               contenitoreCloni: document.querySelector('#contenitoreCloni'),
          };
     }
}


class Cerca {
     constructor() {
          this.contenitoreCerca = document.querySelector('#contenitoreCerca');
          this.searchForm = document.querySelector('#searchForm');
          this.artistButton = document.querySelector('#artistButton');
          this.albumButton = document.querySelector('#albumButton');
          this.searchQuery = document.querySelector('#searchQuery');
          this.isArtistSearch = document.getElementById('artistButton').getAttribute('aria-pressed') === 'true';
          this.isAlbumSearch = document.getElementById('albumButton').getAttribute('aria-pressed') === 'true';
          this.results = document.getElementById('results');
     }

     // Metodi per gestire la sezione di ricerca
     // Ad esempio:
     handleSearch() {
          this.searchForm.addEventListener('submit', (event) => {
               event.preventDefault();
               // Logica per gestire la ricerca
          });
     }

     // Altri metodi per gestire la sezione di ricerca
}

class Playlist {
     constructor() {
          this.playlistPage = document.querySelector('#playlistPage');
          this.playlistForm = document.querySelector('#playlistForm');
     }

     // Metodi per gestire la sezione playlist
     // Ad esempio:
     handlePlaylistFormSubmit() {
          this.playlistForm.addEventListener('submit', (event) => {
               event.preventDefault();
               // Logica per gestire l'invio del form della playlist
          });
     }

     // Altri metodi per gestire la sezione playlist
}



class Audio {
     constructor() {
          this.audio = document.querySelector('#audio');
          this.audioTemplate = document.querySelector('.audioTemplate');
          this.imgAudio = document.querySelector('.imgAudio');
          this.songName = document.querySelector('.songName');
          this.subtext = document.querySelector('.subtext');
          /*** */
          this.shuffleButton = document.querySelector('#shuffle-button');
          this.previousButton = document.querySelector('#previous-button');
          this.playButton = document.querySelector('#play-button');
          this.pauseButton = document.querySelector('#pause-button');
          this.nextButton = document.querySelector('#next-button');
          this.repeatButton = document.querySelector('#repeat-button');
          this.progressBar = document.querySelector('#progress-bar');
          this.mic = document.querySelector('#mic');
          this.list = document.querySelector('#list');
          this.phoneFlip = document.querySelector('#phone-flip');
          this.volumeDown = document.querySelector('#volume-down');
          this.volumeBar = document.querySelector('#volume-bar');
          this.fullscreen = document.querySelector('#fullscreen');
          this.timelineContainer = document.querySelector('#timeline-container');
          this.timelineFill = document.querySelector('#timeline-fill');
     }

     // Metodi per gestire la sezione audio
     // Ad esempio:
     handlePlayButtonClick() {
          this.playButton.addEventListener('click', () => {
               // Logica per gestire il click sul pulsante di riproduzione
          });
     }

     // Altri metodi per gestire la sezione audio
}



export {
     BarraSinistra, PaginaCentrale, Cerca, Playlist, Audio,
}



