/**
 * home.js - Módulo ES6 para la página home
 */

import { Storage } from '../modules/storage.js';
import { isValidEmail } from '../utils/helpers.js';

// Data de efectividad de tipos
const TYPE_EFFECTIVENESS = {
  Fire: { Grass: 2, Water: 0.5, Fire: 0.5, Ice: 2, Dragon: 0.5 },
  Water: { Fire: 2, Grass: 0.5, Water: 0.5, Ground: 2, Dragon: 0.5 },
  Grass: { Water: 2, Fire: 0.5, Grass: 0.5, Ground: 2, Dragon: 0.5 },
  Electric: { Water: 2, Grass: 0.5, Electric: 0.5, Ground: 0, Dragon: 0.5 },
  Psychic: { Fighting: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Ice: { Grass: 2, Fire: 0.5, Water: 0.5, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Psychic: 0.5, Flying: 0.5, Fairy: 0.5 }
};

/**
 * Inicializa la calculadora de tipos
 */
function initTypeCalculator() {
  const attackerSelect = document.getElementById('attackerType');
  const defenderSelect = document.getElementById('defenderType');
  const resultBox = document.getElementById('calculationResult');

  if (!attackerSelect || !defenderSelect || !resultBox) {
    console.warn('Calculator elements not found');
    return;
  }

  // Event listeners
  attackerSelect.addEventListener('change', calculateEffectiveness);
  defenderSelect.addEventListener('change', calculateEffectiveness);

  function calculateEffectiveness() {
    const attacker = attackerSelect.value;
    const defender = defenderSelect.value;

    if (!attacker || !defender) {
      resultBox.textContent = 'Select both types to see effectiveness...';
      resultBox.style.background = 'var(--bg-body)';
      resultBox.style.borderColor = 'var(--primary)';
      return;
    }

    const effectiveness = TYPE_EFFECTIVENESS[attacker]?.[defender] || 1;
    let message = '';
    let bgColor = '';

    switch (effectiveness) {
      case 2:
        message = '🔥 Super Effective! (2x damage)';
        bgColor = '#51cf66';
        break;
      case 0.5:
        message = '⚠️ Not Very Effective (0.5x damage)';
        bgColor = '#ffd43b';
        break;
      case 0:
        message = '❌ No Effect (0x damage)';
        bgColor = '#ff6b6b';
        break;
      default:
        message = '➡️ Normal Effectiveness (1x damage)';
        bgColor = 'var(--bg-body)';
    }

    resultBox.textContent = message;
    resultBox.style.background = bgColor;
    resultBox.style.borderColor = 'var(--primary-dark)';
  }
}

/**
 * Inicializa la página home
 */
export function initHome() {
  console.log('Initializing home page...');
  
  initTypeCalculator();
  
  // Registrar visita
  Storage.setLastVisit();
  
  console.log('Home page initialized successfully');
}

// Inicialización automática
if (document.getElementById('attackerType')) {
  document.addEventListener('DOMContentLoaded', initHome);
}

export default { initHome };