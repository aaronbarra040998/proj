/**
 * community.js - Módulo ES6 para la página Community mejorada
 */

import { Storage } from '../modules/storage.js';
import { isValidEmail } from '../utils/helpers.js';

// Datos de ejemplo para fan art (más variados)
const FAN_ART_IMAGES = Array.from({ length: 20 }, (_, i) => ({
  src: `https://picsum.photos/seed/pokemon${i + 1}/400/400`,
  alt: `Fan Art ${i + 1} - Pokémon artwork showcasing different Pokémon and styles`,
  artist: `Trainer ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 13) % 26))}`,
  likes: Math.floor(Math.random() * 100) + 10
}));

// Contador para lazy loading de galería
let displayedImages = 0;
const IMAGES_PER_LOAD = 8;

/**
 * Inicializa la página Community
 */
export function initCommunity() {
  console.log('Initializing community page...');
  
  initCommunityStats();
  initFanArtGallery();
  initCommunityForm();
  loadRecentSubmissions();
  
  console.log('Community page initialized successfully');
}

/**
 * Inicializa estadísticas de la comunidad
 */
function initCommunityStats() {
  const submissions = JSON.parse(localStorage.getItem('communitySubmissions') || '[]');
  const favorites = Storage.getFavorites();
  
  // Animación de contadores
  animateCounter('memberCount', submissions.length + 50);
  animateCounter('fanArtCount', FAN_ART_IMAGES.length);
  animateCounter('submissionCount', submissions.length);
}

/**
 * Animación de contadores
 */
function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let current = 0;
  const increment = targetValue / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetValue) {
      current = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 30);
}

/**
 * Inicializa galería de fan art con lazy loading progresivo
 */
function initFanArtGallery() {
  const gallery = document.getElementById('fanart-grid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  if (!gallery) return;
  
  displayedImages = 0;
  loadMoreImages(gallery);
  
  // Event listener para "Load More"
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => loadMoreImages(gallery));
  }
}

/**
 * Carga más imágenes en la galería
 */
function loadMoreImages(gallery) {
  const endIndex = Math.min(displayedImages + IMAGES_PER_LOAD, FAN_ART_IMAGES.length);
  const imagesToLoad = FAN_ART_IMAGES.slice(displayedImages, endIndex);
  
  imagesToLoad.forEach(img => {
    const imgElement = document.createElement('img');
    imgElement.src = img.src;
    imgElement.alt = img.alt;
    imgElement.loading = 'lazy';
    imgElement.title = `By ${img.artist} • ❤️ ${img.likes} likes`;
    imgElement.addEventListener('click', () => openImageModal(img));
    gallery.appendChild(imgElement);
  });
  
  displayedImages = endIndex;
  
  // Ocultar botón si no hay más imágenes
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (displayedImages >= FAN_ART_IMAGES.length && loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }
}

/**
 * Abre modal con imagen ampliada
 */
function openImageModal(img) {
  // Crear modal dinámico si no existe
  let modal = document.getElementById('fanart-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'fanart-modal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  // Contenido del modal
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <img src="${img.src}" alt="${img.alt}" style="width:100%; max-height:80vh; object-fit:contain;">
    <div style="padding:1rem; text-align:center;">
      <p><strong>Artist:</strong> ${img.artist}</p>
      <p>❤️ ${img.likes} likes</p>
    </div>
  `;
  
  // Mostrar modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/**
 * Inicializa formulario de comunidad con validación visual
 */
function initCommunityForm() {
  const form = document.getElementById('communityForm');
  const timestamp = document.getElementById('timestamp');
  const charCount = document.getElementById('charCount');
  const messageField = document.getElementById('message');
  
  if (!form) return;
  
  // Establecer timestamp
  if (timestamp) {
    timestamp.value = new Date().toISOString();
  }
  
  // Contador de caracteres
  if (messageField && charCount) {
    messageField.addEventListener('input', () => {
      const count = messageField.value.length;
      charCount.textContent = count;
      charCount.parentElement.classList.toggle('warning', count > 180);
    });
  }
  
  // Validación en tiempo real
  form.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      validateField(e.target);
    }
  });
  
  // Submit del formulario
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const isValid = Array.from(form.elements).every(element => {
      if (element.required || element.type === 'email') {
        return validateField(element);
      }
      return true;
    });
    
    if (!isValid) {
      // Mostrar mensaje de error general
      const errorField = document.querySelector('.error-message.general');
      if (errorField) {
        errorField.textContent = 'Please fix the errors above before submitting.';
        errorField.classList.add('show');
      }
      return;
    }
    
    // Mostrar estado de carga
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.submit-text');
    const spinner = submitBtn.querySelector('.loading-spinner');
    
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // Simular envío (para demo)
    setTimeout(() => {
      // Guardar datos
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      Storage.saveFormData(data);
      saveSubmission(data);
      
      // Mostrar éxito
      document.getElementById('formSuccess').style.display = 'block';
      
      // Resetear formulario
      form.reset();
      charCount.textContent = '0';
      
      // Restaurar botón
      btnText.style.display = 'inline-block';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        document.getElementById('formSuccess').style.display = 'none';
      }, 5000);
      
      // Recargar submissions
      loadRecentSubmissions();
    }, 1000);
  });
  
  // Cargar datos guardados
  loadSavedFormData(form);
}

/**
 * Valida un campo individual
 */
function validateField(field) {
  const errorElement = document.getElementById(`${field.id}-error`);
  let isValid = true;
  let message = '';
  
  if (field.required && !field.value.trim()) {
    isValid = false;
    message = 'This field is required.';
  } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    isValid = false;
    message = 'Please enter a valid email address.';
  } else if (field.id === 'trainerName' && field.value.length < 3) {
    isValid = false;
    message = 'Trainer name must be at least 3 characters.';
  }
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.toggle('show', !isValid);
  }
  
  field.setAttribute('aria-invalid', !isValid);
  
  return isValid;
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
      // Trigger input event para contador de caracteres
      field.dispatchEvent(new Event('input'));
    }
  });
}

/**
 * Guarda submission en localStorage
 */
function saveSubmission(data) {
  const submissions = JSON.parse(localStorage.getItem('communitySubmissions') || '[]');
  const submission = {
    ...data,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString()
  };
  submissions.unshift(submission); // Añadir al principio
  localStorage.setItem('communitySubmissions', JSON.stringify(submissions));
  console.log('Submission saved:', submission);
}

/**
 * Carga submissions recientes
 */
function loadRecentSubmissions() {
  const submissionsList = document.getElementById('submissionsList');
  const submissions = JSON.parse(localStorage.getItem('communitySubmissions') || '[]');
  
  if (!submissionsList) return;
  
  if (submissions.length === 0) {
    submissionsList.innerHTML = '<p class="placeholder">No submissions yet. Be the first to join!</p>';
    return;
  }
  
  submissionsList.innerHTML = submissions.slice(0, 5).map(sub => {
    const date = new Date(sub.submittedAt || sub.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `
      <div class="submission-item">
        <h4>${sub.trainerName || 'Anonymous Trainer'}</h4>
        <span class="trainer-type">${sub.favoriteType || 'Unknown'}-type Trainer</span>
        ${sub.message ? `<p class="trainer-message">"${sub.message.substring(0, 120)}${sub.message.length > 120 ? '...' : ''}"</p>` : ''}
        <p class="submission-date">${formattedDate}</p>
      </div>
    `;
  }).join('');
  
  // Actualizar contador de miembros
  document.getElementById('memberCount').textContent = submissions.length + 50;
  document.getElementById('submissionCount').textContent = submissions.length;
}

// Inicialización automática
if (document.getElementById('communityForm')) {
  document.addEventListener('DOMContentLoaded', initCommunity);
}

export default { initCommunity };