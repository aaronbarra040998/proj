/**
 * main.js - Módulo principal que inicializa funcionalidades comunes
 */

// Importar módulos comunes
import { initDate, updateCopyrightYear, updateLastModified } from './modules/date.js';
import { initNavigation, toggleNavigation } from './modules/navigation.js';
import { Storage } from './modules/storage.js';
import { getQueryParam, formatTimestamp, isValidEmail, isValidPhone } from './utils/helpers.js';

// Exportar funcionalidades comunes
export {
  initDate,
  updateCopyrightYear,
  updateLastModified,
  initNavigation,
  toggleNavigation,
  Storage,
  getQueryParam,
  formatTimestamp,
  isValidEmail,
  isValidPhone
};

// Inicializar funcionalidades comunes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar navegación
  if (document.getElementById('menuBtn')) {
    initNavigation();
  }
  
  // Inicializar fechas
  initDate();
  
  // Inicializar tema si existe
  if (Storage.getTheme()) {
    document.documentElement.setAttribute('data-theme', Storage.getTheme());
  }
  
  console.log('Módulos ES6 cargados correctamente');
});

// Exportar por defecto
export default {
  initDate,
  updateCopyrightYear,
  updateLastModified,
  initNavigation,
  toggleNavigation,
  Storage,
  getQueryParam,
  formatTimestamp,
  isValidEmail,
  isValidPhone
};