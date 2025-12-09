/**
 * action.js - Módulo ES6 para la página de acción del formulario
 */

import { getQueryParam, formatTimestamp } from '../utils/helpers.js';
import { Storage } from '../modules/storage.js';

/**
 * Inicializa la página de acción
 */
export function initAction() {
  console.log('Initializing action page...');
  
  displaySubmissionSummary();
  recordSubmission();
  
  console.log('Action page initialized successfully');
}

/**
 * Muestra resumen de la sumisión
 */
function displaySubmissionSummary() {
  const summary = document.getElementById('submissionSummary');
  if (!summary) return;
  
  const trainerName = getQueryParam('trainerName') || 'No proporcionado';
  const email = getQueryParam('email') || 'No proporcionado';
  const favoriteType = getQueryParam('favoriteType') || 'No seleccionado';
  const message = getQueryParam('message') || 'No message';
  const timestamp = getQueryParam('timestamp') || 'No disponible';
  
  summary.innerHTML = `
    <div style="margin-bottom: 1rem;"><strong>Trainer Name:</strong> ${trainerName}</div>
    <div style="margin-bottom: 1rem;"><strong>Email:</strong> ${email}</div>
    <div style="margin-bottom: 1rem;"><strong>Favorite Type:</strong> ${favoriteType}</div>
    <div style="margin-bottom: 1rem;"><strong>Message:</strong> ${message}</div>
    <div style="margin-bottom: 1rem;"><strong>Submitted:</strong> ${formatTimestamp(timestamp)}</div>
  `;
}

/**
 * Registra la sumisión en localStorage
 */
function recordSubmission() {
  const submission = {
    trainerName: getQueryParam('trainerName'),
    email: getQueryParam('email'),
    favoriteType: getQueryParam('favoriteType'),
    message: getQueryParam('message'),
    timestamp: getQueryParam('timestamp'),
    submittedAt: new Date().toISOString()
  };
  
  const submissions = JSON.parse(localStorage.getItem('communitySubmissions') || '[]');
  submissions.push(submission);
  localStorage.setItem('communitySubmissions', JSON.stringify(submissions));
  
  console.log('Submission recorded:', submission);
}

// Inicialización automática
if (document.getElementById('submissionSummary')) {
  document.addEventListener('DOMContentLoaded', initAction);
}

export default { initAction };