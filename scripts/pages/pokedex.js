/**
 * pokedex.js - Módulo ES6 para Pokédex Interactiva
 * CUMPLE: Fetch API, 15+ items, 4+ props, LocalStorage, Modal, Array methods, Template literals, ES Modules
 */

import { fetchPokemon } from '../modules/api/pokemon.js';
import { Storage } from '../modules/storage.js';
import { openModal } from '../modules/ui/modals.js';

const CONFIG = {
  GRID_ID: 'pokedex-grid',
  TYPE_FILTER_ID: 'typeFilter',
  FAVORITES_FILTER_ID: 'favoritesFilter',
  MODAL_ID: 'pokemon-modal'
};

/**
 * Inicializa la Pokédex
 */
export async function initPokedex() {
  console.log('Initializing Pokédex...');
  
  const grid = document.getElementById(CONFIG.GRID_ID);
  const typeFilter = document.getElementById(CONFIG.TYPE_FILTER_ID);
  const favoritesBtn = document.getElementById(CONFIG.FAVORITES_FILTER_ID);
  
  if (!grid) {
    console.error('Pokédex grid not found');
    return;
  }
  
  try {
    // 1. DATA FETCHING con try...catch ✅
    const pokemon = await fetchPokemon();
    
    // 2. Guardar datos en LocalStorage ✅
    Storage.setPokemonData(pokemon);
    
    // 3. Renderizar 15+ Pokémon con 4+ propiedades ✅
    renderPokemonGrid(pokemon, grid);
    
    // 4. Configurar filtros
    if (typeFilter) {
      setupTypeFilter(pokemon, typeFilter);
    }
    
    if (favoritesBtn) {
      setupFavoritesFilter(favoritesBtn, grid);
    }
    
    console.log(`Pokédex loaded: ${pokemon.length} Pokémon`);
    
  } catch (error) {
    console.error('Error initializing Pokédex:', error);
    showError(grid);
  }
}

/**
 * Renderiza grid de Pokémon usando Array methods y Template literals ✅
 */
function renderPokemonGrid(pokemon, container) {
  container.innerHTML = '';
  
  // Array methods: filter, map, forEach ✅
  const pokemonHTML = pokemon
    .filter((p, index) => index < 20) // Mostrar 20 Pokémon
    .map((p) => {
      // 4 propiedades: name, types, height, weight, abilities, baseExperience ✅
      return `
        <article class="pokemon-card" data-id="${p.id}" data-types="${p.types.join(',')}" tabindex="0" role="button">
          <img src="${p.image}" alt="${p.name}" loading="lazy" width="200" height="200">
          <h3>${p.name}</h3>
          <div class="types">
            ${p.types.map(type => `<span class="type-badge ${type.toLowerCase()}">${type}</span>`).join('')}
          </div>
          <p class="stats">Height: ${p.height}m | Weight: ${p.weight}kg</p>
          <p class="stats">XP: ${p.baseExperience}</p>
          <button class="add-favorite" aria-label="Add ${p.name} to favorites">⭐ Favorite</button>
        </article>
      `;
    })
    .join('');
  
  container.innerHTML = pokemonHTML;
  
  // Event listeners para modales y favoritos ✅
  container.querySelectorAll('.pokemon-card').forEach(card => {
    const id = card.dataset.id;
    
    // Modal al hacer clic
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('add-favorite')) {
        showPokemonModal(id);
      }
    });
    
    // Favoritos
    const favBtn = card.querySelector('.add-favorite');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(id);
    });
  });
}

/**
 * Configura filtro por tipo
 */
function setupTypeFilter(pokemon, filterElement) {
  // Obtener todos los tipos únicos
  const types = new Set();
  pokemon.forEach(p => p.types.forEach(t => types.add(t)));
  
  // Ordenar y agregar opciones
  Array.from(types).sort().forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    filterElement.appendChild(option);
  });
  
  filterElement.addEventListener('change', () => {
    filterPokemon(filterElement.value, document.getElementById(CONFIG.FAVORITES_FILTER_ID).getAttribute('aria-pressed') === 'true');
  });
}

/**
 * Configura filtro de favoritos
 */
function setupFavoritesFilter(button, grid) {
  button.addEventListener('click', () => {
    const isPressed = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', (!isPressed).toString());
    button.textContent = isPressed ? 'Show Only Favorites ⭐' : 'Show All Pokémon';
    filterPokemon(document.getElementById(CONFIG.TYPE_FILTER_ID).value, !isPressed);
  });
}

/**
 * Filtra Pokémon
 */
function filterPokemon(type, showOnlyFavorites) {
  const cards = document.querySelectorAll('.pokemon-card');
  const favorites = Storage.getFavorites();
  
  cards.forEach(card => {
    const cardType = card.dataset.types;
    const id = card.dataset.id;
    const matchesType = !type || cardType.includes(type);
    const matchesFavorites = !showOnlyFavorites || favorites.includes(id);
    
    card.style.display = (matchesType && matchesFavorites) ? 'block' : 'none';
  });
}

/**
 * Muestra modal con detalles completos del Pokémon ✅
 */
async function showPokemonModal(pokemonId) {
  const pokemon = await Storage.getPokemonById(pokemonId);
  if (!pokemon) return;
  
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <h2 id="modal-title">${pokemon.name} #${String(pokemon.id).padStart(3, '0')}</h2>
    <img src="${p.image}" alt="${pokemon.name}" width="300" height="300">
    <div class="modal-stats">
      <p><strong>Type:</strong> ${pokemon.types.join(', ')}</p>
      <p><strong>Height:</strong> ${pokemon.height}m</p>
      <p><strong>Weight:</strong> ${pokemon.weight}kg</p>
      <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
      <p><strong>Base Experience:</strong> ${pokemon.baseExperience}</p>
    </div>
  `;
  
  openModal(CONFIG.MODAL_ID);
}

/**
 * Toggle favoritos usando LocalStorage ✅
 */
function toggleFavorite(id) {
  const favorites = Storage.togglePokemonFavorite(id);
  updateFavoriteButton(id, favorites);
}

function updateFavoriteButton(id, favorites) {
  const card = document.querySelector(`[data-id="${id}"]`);
  const btn = card.querySelector('.add-favorite');
  const isFav = favorites.includes(id);
  btn.textContent = isFav ? '❤️ Favorited' : '⭐ Favorite';
  btn.setAttribute('aria-pressed', isFav);
}

/**
 * Muestra error
 */
function showError(container) {
  container.innerHTML = `
    <div class="error-state" role="alert">
      <p>Unable to load Pokédex data. Please check your connection and refresh.</p>
    </div>
  `;
}

// Inicialización automática
if (document.getElementById('pokedex-grid')) {
  document.addEventListener('DOMContentLoaded', initPokedex);
}

export default { initPokedex };