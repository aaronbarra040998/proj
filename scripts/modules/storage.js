/**
 * storage.js - Módulo ES6 para LocalStorage avanzado
 */

export const Storage = {
  // Tema
  setTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      return true;
    } catch (error) {
      console.error('Error saving theme:', error);
      return false;
    }
  },
  
  getTheme() {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (error) {
      console.error('Error getting theme:', error);
      return 'light';
    }
  },
  
  // Vista del directorio
  setDirectoryView(view) {
    try {
      localStorage.setItem('directoryView', view);
      return true;
    } catch (error) {
      console.error('Error saving directory view:', error);
      return false;
    }
  },
  
  getDirectoryView() {
    try {
      return localStorage.getItem('directoryView') || 'grid';
    } catch (error) {
      console.error('Error getting directory view:', error);
      return 'grid';
    }
  },
  
  // Favoritos de Pokémon
  togglePokemonFavorite(id) {
    try {
      const favorites = this.getFavorites();
      const index = favorites.indexOf(id);
      
      if (index === -1) {
        favorites.push(id);
      } else {
        favorites.splice(index, 1);
      }
      
      localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      return favorites;
    } catch (error) {
      console.error('Error toggling Pokémon favorite:', error);
      return [];
    }
  },
  
  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');
    } catch (error) {
      console.error('Error getting Pokémon favorites:', error);
      return [];
    }
  },
  
  // Datos de Pokémon
  setPokemonData(pokemon) {
    try {
      localStorage.setItem('pokemonData', JSON.stringify(pokemon));
      return true;
    } catch (error) {
      console.error('Error saving Pokémon data:', error);
      return false;
    }
  },
  
  getPokemonById(id) {
    try {
      const data = JSON.parse(localStorage.getItem('pokemonData') || '[]');
      return data.find(p => p.id == id) || null;
    } catch (error) {
      console.error('Error getting Pokémon by ID:', error);
      return null;
    }
  },
  
  // Seguimiento de visitas
  setLastVisit() {
    try {
      localStorage.setItem('lastVisit', Date.now().toString());
      return true;
    } catch (error) {
      console.error('Error saving last visit:', error);
      return false;
    }
  },
  
  getLastVisit() {
    try {
      return localStorage.getItem('lastVisit');
    } catch (error) {
      console.error('Error getting last visit:', error);
      return null;
    }
  },
  
  // Datos del formulario
  saveFormData(data) {
    try {
      localStorage.setItem('formData', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving form data:', error);
      return false;
    }
  },
  
  getFormData() {
    try {
      return JSON.parse(localStorage.getItem('formData') || '{}');
    } catch (error) {
      console.error('Error getting form data:', error);
      return {};
    }
  }
};

export default Storage;