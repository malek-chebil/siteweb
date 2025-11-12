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
 * Enregistrer une visite
 * @returns {object} - Statistiques de visite
 */
export function recordVisit() {
  try {
    // Compteur total de visites
    const currentCount = parseInt(getCookie(VISIT_COUNT_COOKIE) || '0')
    const newCount = currentCount + 1
    setCookie(VISIT_COUNT_COOKIE, newCount.toString(), COOKIE_EXPIRY_DAYS)
    
    // Première visite
    const firstVisit = getCookie(FIRST_VISIT_COOKIE)
    if (!firstVisit) {
      setCookie(FIRST_VISIT_COOKIE, new Date().toISOString(), COOKIE_EXPIRY_DAYS)
    }
    
    // Dernière visite
    setCookie(LAST_VISIT_COOKIE, new Date().toISOString(), COOKIE_EXPIRY_DAYS)
    
    // Visites quotidiennes
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const dailyVisits = getCookieJSON(DAILY_VISITS_COOKIE) || {}
    
    if (dailyVisits[today]) {
      dailyVisits[today] += 1
    } else {
      // Nettoyer les anciennes entrées (garder seulement les 30 derniers jours)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      Object.keys(dailyVisits).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
          delete dailyVisits[date]
        }
      })
      
      dailyVisits[today] = 1
    }
    
    setCookieJSON(DAILY_VISITS_COOKIE, dailyVisits, COOKIE_EXPIRY_DAYS)
    
    return {
      totalVisits: newCount,
      firstVisit: firstVisit || new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      todayVisits: dailyVisits[today] || 1,
      dailyVisits: dailyVisits
    }
  } catch (error) {
    console.error('Error recording visit:', error)
    return null
  }
}

/**
 * Obtenir les statistiques de visite
 * @returns {object} - Statistiques de visite
 */
export function getVisitStats() {
  try {
    const totalVisits = parseInt(getCookie(VISIT_COUNT_COOKIE) || '0')
    const firstVisit = getCookie(FIRST_VISIT_COOKIE)
    const lastVisit = getCookie(LAST_VISIT_COOKIE)
    const dailyVisits = getCookieJSON(DAILY_VISITS_COOKIE) || {}
    const today = new Date().toISOString().split('T')[0]
    
    return {
      totalVisits,
      firstVisit,
      lastVisit,
      todayVisits: dailyVisits[today] || 0,
      dailyVisits,
      isFirstVisit: !firstVisit
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
 * Obtenir le nombre total de visites
 * @returns {number}
 */
export function getTotalVisits() {
  return parseInt(getCookie(VISIT_COUNT_COOKIE) || '0')
}

/**
 * Vérifier si c'est la première visite
 * @returns {boolean}
 */
export function isFirstVisit() {
  return !getCookie(FIRST_VISIT_COOKIE)
}

/**
 * Obtenir le nombre de visites aujourd'hui
 * @returns {number}
 */
export function getTodayVisits() {
  const dailyVisits = getCookieJSON(DAILY_VISITS_COOKIE) || {}
  const today = new Date().toISOString().split('T')[0]
  return dailyVisits[today] || 0
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


