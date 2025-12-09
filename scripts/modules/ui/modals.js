/**
 * modals.js - Módulo ES6 para modales accesibles
 */

let activeModal = null;

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal ${modalId} not found`);
    return;
  }
  
  // Cerrar modal activo si existe
  if (activeModal) {
    closeModal();
  }
  
  // Mostrar modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  activeModal = modal;
  modal.setAttribute('aria-hidden', 'false');
  
  // Enfocar primer elemento enfocable
  setTimeout(() => {
    const focusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();
  }, 100);
  
  // Event listeners
  document.addEventListener('keydown', handleEscapeKey);
}

export function closeModal() {
  if (!activeModal) return;
  
  activeModal.style.display = 'none';
  document.body.style.overflow = 'auto';
  activeModal.setAttribute('aria-hidden', 'true');
  
  // Remover event listeners
  document.removeEventListener('keydown', handleEscapeKey);
  
  // Retornar foco al elemento que abrió el modal
  const trigger = activeModal._trigger;
  if (trigger) trigger.focus();
  
  activeModal = null;
}

export function initModals() {
  // Botones para abrir modales
  const modalTriggers = document.querySelectorAll('[data-modal]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal._trigger = trigger;
        openModal(modalId);
      }
    });
  });
  
  // Botones para cerrar modales
  const closeButtons = document.querySelectorAll('.modal-close, [data-close-modal]');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Cerrar al hacer clic fuera
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });
}

function handleEscapeKey(e) {
  if (e.key === 'Escape' && activeModal) {
    closeModal();
  }
}

export default {
  openModal,
  closeModal,
  initModals
};