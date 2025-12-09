/**
 * attributions.js - Módulo ES6 para interacciones en la página de atribuciones
 */

/**
 * Inicializa la página de atribuciones
 */
export function initAttributions() {
  console.log('Initializing attributions page...');
  
  countResources();
  addResourceInteractions();
  animateCategories();
  
  console.log('Attributions page initialized successfully');
}

/**
 * Cuenta recursos por categoría
 */
function countResources() {
  const categories = [
    { id: 'images-resources', countId: 'images-count' },
    { id: 'fonts-resources', countId: 'fonts-count' },
    { id: 'tools-resources', countId: 'tools-count' }
  ];
  
  categories.forEach(category => {
    const list = document.getElementById(category.id);
    const counter = document.getElementById(category.countId);
    
    if (list && counter) {
      const items = list.querySelectorAll('.resource-item').length;
      counter.textContent = items;
    }
  });
}

/**
 * Añade interacciones a los recursos
 */
function addResourceInteractions() {
  const resourceLinks = document.querySelectorAll('.resource-link');
  
  resourceLinks.forEach(link => {
    // Añadir target="_blank" a enlaces externos automáticamente
    if (link.hostname && link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
    
    // Añadir evento de click con animación
    link.addEventListener('click', (e) => {
      console.log(`Navigating to: ${link.href}`);
    });
  });
}

/**
 * Anima las categorías al cargar
 */
function animateCategories() {
  const cards = document.querySelectorAll('.category-card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Inicialización automática
if (document.querySelector('.attributions-grid')) {
  document.addEventListener('DOMContentLoaded', initAttributions);
}

export default { initAttributions };