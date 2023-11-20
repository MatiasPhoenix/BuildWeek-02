import { Cerca } from "./Selezioni.js";

const cerca = new Cerca;
const isAlbumSearch = cerca.isAlbumSearch;
const isArtistSearch = cerca.isArtistSearch;
const resultsContainer = cerca.results;
const searchQuery = cerca.searchQuery;



 async function searchTracks(searchQuery) {
     const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${searchQuery}`;
     if (searchQuery){
     try {
         const response = await fetch(apiUrl);
         if (!response.ok) {
             throw new Error('Errore nella ricerca delle tracce');
         }
 
         const data = await response.json();
         if (data && data.data && data.data.length > 0) {
               console.log(data.data)
               console.log(data)
             displayTracks(data.data);
         } else {
             console.error('Nessuna traccia trovata');
         }
     } catch (error) {
         console.error('Errore durante la ricerca delle tracce:', error);
     }}else console.log(searchQuery);
 }






 export {searchTracks}