/**
 * navigation.js - Navegación accesible con ES6 Module
 */

let focusTrapEnabled = false;

export function toggleNavigation() {
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  
  if (!menuBtn || !mainNav) return;
  
  const isExpanded = mainNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isExpanded.toString());
  
  const menuIcon = menuBtn.querySelector('.menu-icon');
  if (menuIcon) {
    menuIcon.textContent = isExpanded ? '✕' : '☰';
  }
  
  if (isExpanded) {
    enableFocusTrap(mainNav);
  } else {
    disableFocusTrap(mainNav);
  }
}

function enableFocusTrap(mainNav) {
  if (focusTrapEnabled) return;
  
  const focusableElements = Array.from(mainNav.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleKeydown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    if (e.key === 'Escape') {
      closeNavigation();
      disableFocusTrap(mainNav);
      document.getElementById('menuBtn').focus();
    }
  }
  
  mainNav.addEventListener('keydown', handleKeydown);
  mainNav._focusHandler = handleKeydown;
  focusTrapEnabled = true;
  setTimeout(() => firstElement.focus(), 100);
}

function disableFocusTrap(mainNav) {
  if (!focusTrapEnabled) return;
  
  if (mainNav && mainNav._focusHandler) {
    mainNav.removeEventListener('keydown', mainNav._focusHandler);
    delete mainNav._focusHandler;
    focusTrapEnabled = false;
  }
}

function closeNavigation() {
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  
  if (mainNav) {
    mainNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelector('.menu-icon').textContent = '☰';
  }
}

export function initNavigation() {
  const menuBtn = document.getElementById('menuBtn');
  if (!menuBtn) return;
  
  menuBtn.addEventListener('click', toggleNavigation);
  
  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    const mainNav = document.getElementById('mainNav');
    if (mainNav && mainNav.classList.contains('open') && 
        !mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
      closeNavigation();
      disableFocusTrap(mainNav);
    }
  });
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    const mainNav = document.getElementById('mainNav');
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('open')) {
      closeNavigation();
      disableFocusTrap(mainNav);
      menuBtn.focus();
    }
  });
}

export default {
  initNavigation,
  toggleNavigation
};