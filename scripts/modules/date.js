/**
 * date.js - Funcionalidades de fecha y hora
 */

const CONFIG = {
  LOCALE: 'en-US',
  YEAR_ELEMENT: 'currentYear',
  LAST_MODIFIED_ELEMENT: 'lastModified'
};

export function updateCopyrightYear() {
  const element = document.getElementById(CONFIG.YEAR_ELEMENT);
  if (element) {
    element.textContent = new Date().getFullYear();
  }
}

export function updateLastModified() {
  const element = document.getElementById(CONFIG.LAST_MODIFIED_ELEMENT);
  if (element && document.lastModified) {
    const lastModified = new Date(document.lastModified);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const formattedDate = lastModified.toLocaleDateString(CONFIG.LOCALE, options);
    element.textContent = `Last modified: ${formattedDate}`;
    element.setAttribute('datetime', lastModified.toISOString());
  }
}

export function initDate() {
  updateCopyrightYear();
  updateLastModified();
}

export default {
  updateCopyrightYear,
  updateLastModified,
  initDate
};