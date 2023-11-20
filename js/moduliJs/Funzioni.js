import { BarraSinistra, PaginaCentrale, Cerca, Playlist, Audio,  } from "./Selezioni.js";

const barraSinistra = new BarraSinistra;
const audio = new Audio;
const paginaCentrale = new PaginaCentrale;
const cerca = new Cerca;
const playlist = new Playlist;



function showSection(sectionToShow) {
     const sections = [paginaCentrale.centralPage, cerca.contenitoreCerca, playlist.playlistPage];
 
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

function showSectionCenter(sectionToShow) {
     showSection(paginaCentrale.centralPage);
     const sections = [paginaCentrale.sezioneAlbum, paginaCentrale.sezioneArtist, paginaCentrale.sezioneHome];
 
     sections.forEach(section => {
         if (section === sectionToShow) {
 
             section.classList.remove('hidden-element');
         } else {
             section.classList.add('hidden-element');
         }
     });
 }




export{showSection, showSectionCenter}