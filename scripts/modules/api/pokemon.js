/**
 * pokemon.js - API module para Pokémon
 * ES6 Module con Fetch API y try...catch
 */

const CONFIG = {
  DATA_URL: 'data/pokemon.json',
  FALLBACK_DATA: 'data/pokemon-fallback.json'
};

/**
 * Fetch API con try...catch para obtener Pokémon ✅
 */
export async function fetchPokemon() {
  try {
    console.log('Fetching Pokémon data from:', CONFIG.DATA_URL);
    
    const response = await fetch(CONFIG.DATA_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully loaded ${data.length} Pokémon`);
    
    return data;
    
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    return getFallbackPokemon();
  }
}

/**
 * Fallback data si el fetch falla ✅
 */
async function getFallbackPokemon() {
  console.log('Using fallback Pokémon data...');
  
  return [
    {
      id: 25,
      name: "Pikachu",
      types: ["Electric"],
      height: 0.4,
      weight: 6.0,
      abilities: ["Static", "Lightning Rod"],
      baseExperience: 112,
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
    },
    {
      id: 1,
      name: "Bulbasaur",
      types: ["Grass", "Poison"],
      height: 0.7,
      weight: 6.9,
      abilities: ["Overgrow", "Chlorophyll"],
      baseExperience: 64,
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    },
    {
      id: 4,
      name: "Charmander",
      types: ["Fire"],
      height: 0.6,
      weight: 8.5,
      abilities: ["Blaze", "Solar Power"],
      baseExperience: 62,
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
    },
    {
      id: 7,
      name: "Squirtle",
      types: ["Water"],
      height: 0.5,
      weight: 9.0,
      abilities: ["Torrent", "Rain Dish"],
      baseExperience: 63,
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
    }
  ];
}

export default { fetchPokemon };