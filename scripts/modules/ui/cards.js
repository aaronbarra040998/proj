/**
 * cards.js - Módulo ES6 para creación de tarjetas UI
 */

export function createPokemonCard(pokemon, index) {
  const card = document.createElement('article');
  card.className = 'pokemon-card';
  card.dataset.id = pokemon.id;
  card.dataset.types = pokemon.types.join(',');
  card.tabIndex = 0;
  
  card.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy" width="200" height="200">
    <h3>${pokemon.name}</h3>
    <div class="types">
      ${pokemon.types.map(type => `<span class="type-badge ${type.toLowerCase()}">${type}</span>`).join('')}
    </div>
    <p class="stats">Height: ${pokemon.height}m | Weight: ${pokemon.weight}kg</p>
    <p class="stats">XP: ${pokemon.baseExperience}</p>
    <button class="add-favorite" aria-label="Toggle favorite for ${pokemon.name}">⭐ Favorite</button>
  `;
  
  return card;
}

export default { createPokemonCard };