/**
 * Utilitaires pour gérer les statistiques de visites anonymes
 */
import { setCookie, getCookie, setCookieJSON, getCookieJSON } from './cookies'

const VISIT_COUNT_COOKIE = 'visit_count'
const FIRST_VISIT_COOKIE = 'first_visit'
const LAST_VISIT_COOKIE = 'last_visit'
const DAILY_VISITS_COOKIE = 'daily_visits'
const COOKIE_EXPIRY_DAYS = 365 // 1 an

/**
 * Enregistrer une visite (DÉSACTIVÉ pour l'anonymat)
 * @returns {object} - Statistiques anonymes (sans données personnelles)
 */
export function recordVisit() {
  // DÉSACTIVÉ pour protéger l'anonymat des utilisateurs
  // Ne stocke aucune donnée personnelle (pas de cookies, pas de localStorage)
  // Retourne des statistiques anonymes uniquement
  try {
    // Retourner des stats anonymes sans stocker de données
    return {
      totalVisits: 0,  // Ne pas tracker le nombre de visites
      firstVisit: null,  // Ne pas stocker la première visite
      lastVisit: null,  // Ne pas stocker la dernière visite
      todayVisits: 0,  // Ne pas tracker les visites quotidiennes
      dailyVisits: {},  // Pas de données quotidiennes
      isFirstVisit: true  // Toujours considéré comme première visite pour l'anonymat
    }
  } catch (error) {
    console.error('Error recording visit:', error)
    return null
  }
}

/**
 * Obtenir les statistiques de visite (ANONYMISÉ)
 * @returns {object} - Statistiques anonymes (sans données personnelles)
 */
export function getVisitStats() {
  // Retourner des stats anonymes sans lire de cookies/localStorage
  // Pour protéger l'anonymat des utilisateurs
  try {
    return {
      totalVisits: 0,  // Ne pas exposer le nombre de visites
      firstVisit: null,  // Ne pas exposer la première visite
      lastVisit: null,  // Ne pas exposer la dernière visite
      todayVisits: 0,  // Ne pas exposer les visites quotidiennes
      dailyVisits: {},  // Pas de données quotidiennes
      isFirstVisit: true  // Toujours considéré comme première visite
    }
  } catch (error) {
    console.error('Error getting visit stats:', error)
    return {
      totalVisits: 0,
      firstVisit: null,
      lastVisit: null,
      todayVisits: 0,
      dailyVisits: {},
      isFirstVisit: true
    }
  }
}

/**
 * Obtenir le nombre total de visites (ANONYMISÉ)
 * @returns {number} - Toujours 0 pour l'anonymat
 */
export function getTotalVisits() {
  // Ne pas tracker les visites pour protéger l'anonymat
  return 0
}

/**
 * Vérifier si c'est la première visite (ANONYMISÉ)
 * @returns {boolean} - Toujours true pour l'anonymat
 */
export function isFirstVisit() {
  // Toujours considéré comme première visite pour l'anonymat
  return true
}

/**
 * Obtenir le nombre de visites aujourd'hui (ANONYMISÉ)
 * @returns {number} - Toujours 0 pour l'anonymat
 */
export function getTodayVisits() {
  // Ne pas tracker les visites quotidiennes pour protéger l'anonymat
  return 0
}

/**
 * Réinitialiser les statistiques (pour tests ou reset utilisateur)
 */
export function resetVisitStats() {
  try {
    setCookie(VISIT_COUNT_COOKIE, '0', COOKIE_EXPIRY_DAYS)
    setCookie(FIRST_VISIT_COOKIE, '', COOKIE_EXPIRY_DAYS)
    setCookie(LAST_VISIT_COOKIE, '', COOKIE_EXPIRY_DAYS)
    setCookieJSON(DAILY_VISITS_COOKIE, {}, COOKIE_EXPIRY_DAYS)
  } catch (error) {
    console.error('Error resetting visit stats:', error)
  }
}


