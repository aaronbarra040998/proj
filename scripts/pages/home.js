/**
 * home.js - Módulo ES6 para la página home mejorada con fetch automático
 */

import { Storage } from '../modules/storage.js';
import { fetchPokemon } from '../modules/api/pokemon.js';

// Constantes mejoradas
const TYPE_DATA = {
  Normal: { icon: '⚪', color: '#A8A878' },
  Fire: { icon: '🔥', color: '#F08030' },
  Water: { icon: '💧', color: '#6890F0' },
  Electric: { icon: '⚡', color: '#F8D030' },
  Grass: { icon: '🌿', color: '#78C850' },
  Ice: { icon: '❄️', color: '#98D8D8' },
  Fighting: { icon: '🥊', color: '#C03028' },
  Poison: { icon: '☠️', color: '#A040A0' },
  Ground: { icon: '🌍', color: '#E0C068' },
  Flying: { icon: '🦅', color: '#A890F0' },
  Psychic: { icon: '🔮', color: '#F85888' },
  Bug: { icon: '🐛', color: '#A8B820' },
  Rock: { icon: '🪨', color: '#B8A038' },
  Ghost: { icon: '👻', color: '#705898' },
  Dragon: { icon: '🐉', color: '#7038F8' },
  Dark: { icon: '🌙', color: '#705848' },
  Steel: { icon: '🔩', color: '#B8B8D0' },
  Fairy: { icon: '🧚', color: '#EE99AC' }
};

const TYPE_EFFECTIVENESS = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 0.5, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 }
};

/**
 * Inicializa la calculadora mejorada
 */
function initTypeCalculator() {
  const attackerSelect = document.getElementById('attackerType');
  const defenderSelect = document.getElementById('defenderType');
  const resultBox = document.getElementById('calculationResult');
  const recommendedDiv = document.getElementById('recommendedPokemon');

  if (!attackerSelect || !defenderSelect || !resultBox) {
    console.warn('Calculator elements not found');
    return;
  }

  // Poblar selects con tipos
  Object.keys(TYPE_DATA).forEach(type => {
    const option1 = new Option(`${TYPE_DATA[type].icon} ${type}`, type);
    const option2 = new Option(`${TYPE_DATA[type].icon} ${type}`, type);
    attackerSelect.appendChild(option1);
    defenderSelect.appendChild(option2);
  });

  // Event listeners
  attackerSelect.addEventListener('change', () => calculateEffectiveness(attackerSelect, defenderSelect, resultBox, recommendedDiv));
  defenderSelect.addEventListener('change', () => calculateEffectiveness(attackerSelect, defenderSelect, resultBox, recommendedDiv));
}

/**
 * Calcula efectividad y muestra Pokémon recomendado
 */
async function calculateEffectiveness(attackerSelect, defenderSelect, resultBox, recommendedDiv) {
  const attacker = attackerSelect.value;
  const defender = defenderSelect.value;

  if (!attacker || !defender) {
    resultBox.className = 'result-box';
    resultBox.innerHTML = `
      <div class="result-emoji">❓</div>
      <div class="result-text">Select both types to see effectiveness...</div>
      <div class="result-details"></div>
    `;
    recommendedDiv.querySelector('.pokemon-suggestion').innerHTML = 
      '<p>Select a type above to see a Pokémon with that type!</p>';
    return;
  }

  const effectiveness = TYPE_EFFECTIVENESS[attacker]?.[defender] || 1;
  let message = '', details = '', emoji = '', cssClass = '';

  switch (effectiveness) {
    case 2:
      message = 'Super Effective!';
      details = `${attacker} attacks deal 2x damage to ${defender} types`;
      emoji = '💥';
      cssClass = 'super-effective';
      break;
    case 0.5:
      message = 'Not Very Effective';
      details = `${attacker} attacks deal 0.5x damage to ${defender} types`;
      emoji = '🛡️';
      cssClass = 'not-effective';
      break;
    case 0:
      message = 'No Effect';
      details = `${attacker} attacks have no effect on ${defender} types`;
      emoji = '❌';
      cssClass = 'no-effect';
      break;
    default:
      message = 'Normal Effectiveness';
      details = `${attacker} attacks deal normal damage to ${defender} types`;
      emoji = '➡️';
  }

  resultBox.className = `result-box ${cssClass}`;
  resultBox.innerHTML = `
    <div class="result-emoji">${emoji}</div>
    <div class="result-text">${message}</div>
    <div class="result-details">${details}</div>
  `;

  // Mostrar Pokémon recomendado
  if (attacker) {
    await showRecommendedPokemon(attacker, recommendedDiv);
  }
}

/**
 * Muestra un Pokémon con el tipo seleccionado
 * AHORA CON FETCH AUTOMÁTICO SI NO HAY DATOS
 */
async function showRecommendedPokemon(type, container) {
  try {
    // Verificar si hay datos en localStorage
    let pokemonData = Storage.getPokemonData();
    
    // Si no hay datos, hacer fetch automáticamente
    if (!pokemonData || pokemonData.length === 0) {
      console.log('No Pokemon data found, fetching from API...');
      pokemonData = await fetchPokemon();
      // Guardar los datos para futuras usos
      Storage.setPokemonData(pokemonData);
    }
    
    console.log('Pokemon data available:', pokemonData.length);
    
    // Verificar que los datos sean un array válido
    if (!Array.isArray(pokemonData)) {
      throw new Error('Pokemon data is not an array');
    }
    
    const matchingPokemon = pokemonData.filter(p => 
      p && p.types && Array.isArray(p.types) && p.types.includes(type)
    );
    
    const suggestionDiv = container.querySelector('.pokemon-suggestion');
    
    if (matchingPokemon.length === 0) {
      suggestionDiv.innerHTML = `<p>No ${type}-type Pokémon found in your Pokédex!</p>`;
      return;
    }

    const randomPokemon = matchingPokemon[Math.floor(Math.random() * matchingPokemon.length)];
    
    // Manejo seguro de stats con optional chaining
    const hp = randomPokemon.stats?.hp || 'N/A';
    const attack = randomPokemon.stats?.attack || 'N/A';
    
    suggestionDiv.innerHTML = `
      <img src="${randomPokemon.image}" alt="${randomPokemon.name}" width="80" height="80" loading="lazy">
      <div>
        <p><strong>${randomPokemon.name}</strong> is a ${TYPE_DATA[type].icon} ${type}-type Pokémon!</p>
        <p>HP: ${hp} | Attack: ${attack}</p>
      </div>
    `;
  } catch (error) {
    console.error('Error showing recommended Pokemon:', error);
    container.querySelector('.pokemon-suggestion').innerHTML = 
      `<p>Unable to load Pokémon recommendation. Error: ${error.message}</p>`;
  }
}

/**
 * TRIBIA FUNCTIONALITY
 */

let triviaQuestions = [];
let currentQuestionIndex = 0;
let triviaScore = 0;

/**
 * Inicializa la trivia
 */
async function initTrivia() {
  const triviaContent = document.getElementById('trivia-content');
  if (!triviaContent) return;

  try {
    const response = await fetch('data/trivia.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    triviaQuestions = await response.json();
    console.log(`Loaded ${triviaQuestions.length} trivia questions`);
    
    if (triviaQuestions.length > 0) {
      loadQuestion();
    }
  } catch (error) {
    console.error('Error loading trivia:', error);
    triviaContent.innerHTML = '<p class="error-state">Unable to load trivia. Please refresh the page.</p>';
    return;
  }

  // Event listeners
  document.getElementById('nextQuestion')?.addEventListener('click', loadQuestion);
  document.getElementById('restartTrivia')?.addEventListener('click', restartTrivia);
}

/**
 * Carga una pregunta de trivia
 */
function loadQuestion() {
  if (currentQuestionIndex >= triviaQuestions.length) {
    showTriviaCompletion();
    return;
  }

  const question = triviaQuestions[currentQuestionIndex];
  const questionDiv = document.querySelector('.trivia-question');
  const optionsDiv = document.querySelector('.trivia-options');
  const feedbackDiv = document.querySelector('.trivia-feedback');
  const nextBtn = document.getElementById('nextQuestion');

  // Reset UI
  feedbackDiv.classList.remove('show');
  nextBtn.style.display = 'none';
  feedbackDiv.textContent = '';

  // Mostrar pregunta
  questionDiv.textContent = question.question;

  // Mostrar opciones
  optionsDiv.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.dataset.index = index;
    button.addEventListener('click', () => selectAnswer(index));
    optionsDiv.appendChild(button);
  });

  // Actualizar score
  document.getElementById('trivia-score').textContent = triviaScore;
  document.getElementById('trivia-total').textContent = currentQuestionIndex;
}

/**
 * Maneja la selección de respuesta
 */
function selectAnswer(selectedIndex) {
  const question = triviaQuestions[currentQuestionIndex];
  const options = document.querySelectorAll('.trivia-options button');
  const feedbackDiv = document.querySelector('.trivia-feedback');
  const nextBtn = document.getElementById('nextQuestion');

  // Deshabilitar botones
  options.forEach(btn => btn.disabled = true);

  // Mostrar respuesta correcta/incorrecta
  options[question.correct].classList.add('correct');
  
  if (selectedIndex !== question.correct) {
    options[selectedIndex].classList.add('incorrect');
    feedbackDiv.textContent = `❌ Incorrect. ${question.explanation}`;
  } else {
    triviaScore++;
    feedbackDiv.textContent = `✅ Correct! ${question.explanation}`;
  }

  // Mostrar feedback y botón siguiente
  feedbackDiv.classList.add('show');
  nextBtn.style.display = 'inline-block';

  currentQuestionIndex++;
}

/**
 * Muestra pantalla de finalización
 */
function showTriviaCompletion() {
  document.getElementById('trivia-content').style.display = 'none';
  document.querySelector('.trivia-controls').style.display = 'none';
  document.querySelector('.trivia-score').style.display = 'none';
  
  const completion = document.getElementById('trivia-completion');
  completion.style.display = 'block';
  document.getElementById('final-score').textContent = triviaScore;
  document.getElementById('final-total').textContent = triviaQuestions.length;
}

/**
 * Reinicia la trivia
 */
function restartTrivia() {
  currentQuestionIndex = 0;
  triviaScore = 0;
  
  document.getElementById('trivia-content').style.display = 'block';
  document.querySelector('.trivia-controls').style.display = 'block';
  document.querySelector('.trivia-score').style.display = 'block';
  document.getElementById('trivia-completion').style.display = 'none';
  
  loadQuestion();
}

/**
 * Inicializa la página home completa
 */
export function initHome() {
  console.log('Initializing home page...');
  
  initTypeCalculator();
  initTrivia();
  
  // Registrar visita
  Storage.setLastVisit();
  
  console.log('Home page initialized successfully');
}

// Inicialización automática
if (document.getElementById('attackerType')) {
  document.addEventListener('DOMContentLoaded', initHome);
}

export default { initHome };