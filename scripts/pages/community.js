/**
 * community.js - Módulo ES6 para la página Community
 */

import { Storage } from '../modules/storage.js';
import { isValidEmail } from '../utils/helpers.js';

/**
 * Inicializa la página Community
 */
export function initCommunity() {
  console.log('Initializing community page...');
  
  initFanArtGallery();
  initCommunityForm();
  
  console.log('Community page initialized successfully');
}

/**
 * Inicializa galería de fan art con lazy loading
 */
function initFanArtGallery() {
  const gallery = document.getElementById('fanart-grid');
  if (!gallery) return;
  
  // 15 imágenes de ejemplo con lazy loading
  const fanArtImages = Array.from({ length: 15 }, (_, i) => ({
    src: `https://picsum.photos/seed/pokemon${i}/300/300`,
    alt: `Fan Art ${i + 1} - Pokémon artwork by community member`
  }));
  
  gallery.innerHTML = fanArtImages
    .map(img => `
      <img src="${img.src}" alt="${img.alt}" loading="lazy" width="300" height="300">
    `)
    .join('');
}

/**
 * Inicializa formulario de comunidad
 */
function initCommunityForm() {
  const form = document.getElementById('communityForm');
  const timestamp = document.getElementById('timestamp');
  
  if (!form) return;
  
  // Establecer timestamp
  if (timestamp) {
    timestamp.value = new Date().toISOString();
  }
  
  // Validación
  form.addEventListener('submit', function(e) {
    const emailField = document.getElementById('email');
    
    if (emailField.value && !isValidEmail(emailField.value)) {
      e.preventDefault();
      alert('Please enter a valid email address.');
      return;
    }
    
    // Guardar datos en localStorage
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    Storage.saveFormData(data);
    
    console.log('Community form submitted:', data);
  });
  
  // Cargar datos guardados
  loadSavedFormData(form);
}

/**
 * Carga datos guardados del formulario
 */
function loadSavedFormData(form) {
  const savedData = Storage.getFormData();
  Object.keys(savedData).forEach(key => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field && savedData[key]) {
      field.value = savedData[key];
    }
  });
}

// Inicialización automática
if (document.getElementById('communityForm')) {
  document.addEventListener('DOMContentLoaded', initCommunity);
}

export default { initCommunity };