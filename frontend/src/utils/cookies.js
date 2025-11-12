/**
 * Utilitaires pour gérer les cookies dans le navigateur
 */

/**
 * Définir un cookie
 * @param {string} name - Nom du cookie
 * @param {string} value - Valeur du cookie
 * @param {number} days - Nombre de jours avant expiration (par défaut: 30)
 * @param {object} options - Options supplémentaires
 * @param {boolean} options.secure - Cookie sécurisé (HTTPS uniquement)
 * @param {string} options.sameSite - SameSite policy ('Strict', 'Lax', 'None')
 * @param {string} options.path - Chemin du cookie (par défaut: '/')
 */
export function setCookie(name, value, days = 30, options = {}) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${options.path || '/'}`;
  
  if (options.secure) {
    cookieString += '; Secure';
  }
  
  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }
  
  // Note: HttpOnly ne peut être défini que côté serveur
  if (options.httpOnly) {
    console.warn('HttpOnly doit être défini côté serveur, pas côté client');
  }
  
  document.cookie = cookieString;
}

/**
 * Lire un cookie
 * @param {string} name - Nom du cookie
 * @returns {string|null} - Valeur du cookie ou null si non trouvé
 */
export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  
  return null;
}

/**
 * Supprimer un cookie
 * @param {string} name - Nom du cookie
 * @param {string} path - Chemin du cookie (par défaut: '/')
 */
export function deleteCookie(name, path = '/') {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

/**
 * Vérifier si les cookies sont activés dans le navigateur
 * @returns {boolean} - true si les cookies sont activés
 */
export function areCookiesEnabled() {
  try {
    const testCookie = 'test_cookie_' + Date.now();
    setCookie(testCookie, 'test', 1);
    const enabled = getCookie(testCookie) === 'test';
    deleteCookie(testCookie);
    return enabled;
  } catch (e) {
    return false;
  }
}

/**
 * Obtenir tous les cookies
 * @returns {object} - Objet avec tous les cookies (nom: valeur)
 */
export function getAllCookies() {
  const cookies = {};
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c) {
      const [name, ...valueParts] = c.split('=');
      cookies[name] = decodeURIComponent(valueParts.join('='));
    }
  }
  
  return cookies;
}

/**
 * Stocker un objet JSON dans un cookie
 * @param {string} name - Nom du cookie
 * @param {object} value - Objet à stocker
 * @param {number} days - Nombre de jours avant expiration
 * @param {object} options - Options supplémentaires
 */
export function setCookieJSON(name, value, days = 30, options = {}) {
  try {
    const jsonString = JSON.stringify(value);
    setCookie(name, jsonString, days, options);
  } catch (e) {
    console.error('Error setting cookie JSON:', e);
    // Ne pas throw pour éviter de casser l'application
    // Juste logger l'erreur
  }
}

/**
 * Lire un objet JSON depuis un cookie
 * @param {string} name - Nom du cookie
 * @returns {object|null} - Objet parsé ou null si non trouvé/invalide
 */
export function getCookieJSON(name) {
  const cookieValue = getCookie(name);
  if (!cookieValue) {
    return null;
  }
  
  try {
    return JSON.parse(cookieValue);
  } catch (e) {
    console.error('Error parsing cookie JSON:', e);
    return null;
  }
}

