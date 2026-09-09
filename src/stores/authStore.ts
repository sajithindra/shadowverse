import { defineStore } from 'pinia'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { trackEvent } from '../utils/analytics'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { isDomainAuthorized as checkDomain } from '../utils/validators'
import { formatTimestampISO } from '../utils/formatters'

export interface UserProfile {
  uid: string
  email: string
  fullName: string
  phone: string
  isFirstTime: boolean
  authProvider: string
}

export interface SessionData {
  operatorId: string
  sessionToken: string
  securityRole: string
  authenticatedAt: string
  sessionExpiresAt: string
  profile: UserProfile
}

export interface UnauthorizedLoginAttempt {
  id: string
  email: string
  uid: string
  displayName: string
  timestamp: string
  userAgent: string
  reason: string
  status: 'ACCESS_DENIED'
}

const SESSION_STORAGE_KEY = 'shadowverse_operator_session'
const LOCAL_STORAGE_SESSION_KEY = 'shadowverse_operator_session_persistent'
const USER_PROFILES_KEY = 'shadowverse_known_users'
const UNAUTHORIZED_LOGS_KEY = 'shadowverse_unauthorized_login_attempts'
const AUTHORIZED_DOMAIN = '@shadowverse.in'
const DEFAULT_SESSION_DURATION_MS = 8 * 3600 * 1000 // 8 hours

function loadUnauthorizedAttemptsFromStorage(): UnauthorizedLoginAttempt[] {
  try {
    const raw = localStorage.getItem(UNAUTHORIZED_LOGS_KEY)
    return raw ? JSON.parse(raw) : [
      {
        id: 'unauth-init-01',
        email: 'intruder@external-domain.com',
        uid: 'ext-user-9912',
        displayName: 'External Account Attempt',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
        reason: 'Attempted login with unauthorized domain email: intruder@external-domain.com',
        status: 'ACCESS_DENIED'
      }
    ]
  } catch {
    return []
  }
}


export const useAuthStore = defineStore('auth', () => {
  const loginPhase = ref<'grid' | 'rounds' | 'logged-in'>('grid')
  const operatorId = ref('ADMIN_SEC_01')
  const sessionToken = ref('')
  const securityRole = ref('LEVEL_1_COMMANDER')
  const authenticatedAt = ref<string | null>(null)
  const sessionExpiresAt = ref<string | null>(null)
  const currentRound = ref(0)
  const isSubmitting = ref(false)

  const matrix81Cells = ref<string[]>([])
  const roundGridNumbers = ref<string[]>([])
  const selectedCellIndex = ref<number>(13) // Default B5 coordinate (index 13)

  function selectCell(idx: number) {
    selectedCellIndex.value = idx
  }

  const userProfile = ref<UserProfile | null>(null)

  // Session Time Remaining Calculation (in Seconds)
  const sessionRemainingSeconds = computed(() => {
    if (!sessionExpiresAt.value || loginPhase.value !== 'logged-in') return 0
    const diff = new Date(sessionExpiresAt.value).getTime() - Date.now()
    return diff > 0 ? Math.floor(diff / 1000) : 0
  })

  const isAuthenticated = computed(() => {
    if (loginPhase.value !== 'logged-in' || !userProfile.value || userProfile.value.isFirstTime) {
      return false
    }
    if (sessionExpiresAt.value && new Date(sessionExpiresAt.value).getTime() < Date.now()) {
      return false
    }
    return true
  })

  const needsOnboarding = computed(() => userProfile.value !== null && userProfile.value.isFirstTime)

  const bCellIndex = computed(() => {
    const idx = matrix81Cells.value.indexOf('B')
    return idx >= 0 ? idx : 0
  })

  const bCoordinate = computed(() => {
    const idx = bCellIndex.value
    const rowLetter = String.fromCharCode(65 + Math.floor(idx / 9))
    const colNum = (idx % 9) + 1
    return `${rowLetter}${colNum}`
  })

  const bNumberInRound = computed(() => {
    return roundGridNumbers.value[bCellIndex.value] || '00'
  })

  function createInitial81CharSet(): string[] {
    const pool: string[] = []
    for (let i = 33; i <= 126; i++) {
      if ((i < 48 || i > 57) && String.fromCharCode(i) !== 'B') {
        pool.push(String.fromCharCode(i))
      }
    }
    const result: string[] = []
    for (let i = 0; i < 80; i++) {
      const char = pool[Math.floor(Math.random() * pool.length)]
      if (char) result.push(char)
    }
    result.push('B')
    return result
  }

  const base81CharSet = ref<string[]>(createInitial81CharSet())

  function shuffleGrid(): string[] {
    const arr = [...base81CharSet.value]
    arr.sort(() => Math.random() - 0.5)
    return arr
  }

  function generateRandomToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  function initGrid() {
    matrix81Cells.value = shuffleGrid()
    selectedCellIndex.value = matrix81Cells.value.indexOf('B')
    if (!sessionToken.value) {
      sessionToken.value = generateRandomToken()
    }
    loginPhase.value = 'grid'
    currentRound.value = 0
    isSubmitting.value = false
  }

  function startAuthenticateRounds() {
    isSubmitting.value = true
    setTimeout(() => {
      isSubmitting.value = false
      roundGridNumbers.value = Array.from({ length: 81 }, () =>
        String(Math.floor(Math.random() * 100)).padStart(2, '0')
      )
      loginPhase.value = 'rounds'
      currentRound.value = 0
    }, 400)
  }

  function answerRound(yes: boolean) {
    if (currentRound.value < 3) {
      currentRound.value += 1
      roundGridNumbers.value = Array.from({ length: 81 }, () =>
        String(Math.floor(Math.random() * 100)).padStart(2, '0')
      )
    } else {
      isSubmitting.value = true
      setTimeout(() => {
        isSubmitting.value = false
        loginPhase.value = 'logged-in'
        authenticatedAt.value = new Date().toISOString()
        sessionExpiresAt.value = new Date(Date.now() + DEFAULT_SESSION_DURATION_MS).toISOString()
        saveSessionToStorage()
      }, 500)
    }
  }

  function getKnownUsers(): Record<string, UserProfile> {
    try {
      const raw = localStorage.getItem(USER_PROFILES_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  function saveKnownUser(profile: UserProfile) {
    const known = getKnownUsers()
    known[profile.uid || profile.email] = profile
    localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(known))
  }

  function isDomainAuthorized(email: string): boolean {
    return checkDomain(email, AUTHORIZED_DOMAIN)
  }

  function setGoogleUser(payload: { uid: string; email: string; displayName?: string; photoURL?: string }, skipOnboarding: boolean = false) {
    const normalizedEmail = payload.email.trim().toLowerCase()
    
    if (!isDomainAuthorized(normalizedEmail)) {
      throw new Error(`ACCESS DENIED: Account "${payload.email}" is not authorized.`)
    }

    const known = getKnownUsers()
    const existing = known[payload.uid || normalizedEmail]

    if (existing && existing.fullName && existing.phone && !existing.isFirstTime) {
      userProfile.value = {
        ...existing,
        isFirstTime: false,
      }
      operatorId.value = existing.email
      sessionToken.value = generateRandomToken()
      securityRole.value = 'GOOGLE_SOVEREIGN_COMMANDER'
      loginPhase.value = 'logged-in'
      authenticatedAt.value = new Date().toISOString()
      sessionExpiresAt.value = new Date(Date.now() + DEFAULT_SESSION_DURATION_MS).toISOString()
      saveSessionToStorage()
    } else if (skipOnboarding) {
      const profile: UserProfile = {
        uid: payload.uid || 'google-user-' + Math.random().toString(36).substring(2, 8),
        email: normalizedEmail,
        fullName: payload.displayName?.trim() || normalizedEmail.split('@')[0] || 'Presentation Viewer',
        phone: '',
        isFirstTime: false,
        authProvider: 'google.com',
      }
      userProfile.value = profile
      saveKnownUser(profile)

      operatorId.value = normalizedEmail
      sessionToken.value = generateRandomToken()
      securityRole.value = 'GOOGLE_SOVEREIGN_COMMANDER'
      loginPhase.value = 'logged-in'
      authenticatedAt.value = new Date().toISOString()
      sessionExpiresAt.value = new Date(Date.now() + DEFAULT_SESSION_DURATION_MS).toISOString()
      saveSessionToStorage()
    } else {
      userProfile.value = {
        uid: payload.uid || 'google-user-' + Math.random().toString(36).substring(2, 8),
        email: normalizedEmail,
        fullName: payload.displayName || '',
        phone: '',
        isFirstTime: true,
        authProvider: 'google.com',
      }
      operatorId.value = normalizedEmail
      sessionToken.value = generateRandomToken()
      securityRole.value = 'PENDING_ONBOARDING'
    }
  }

  function completeFirstTimeOnboarding(fullName: string, phone: string) {
    if (!userProfile.value) return

    const updated: UserProfile = {
      ...userProfile.value,
      fullName: fullName.trim(),
      phone: phone.trim(),
      isFirstTime: false,
    }

    userProfile.value = updated
    saveKnownUser(updated)

    loginPhase.value = 'logged-in'
    securityRole.value = 'GOOGLE_SOVEREIGN_COMMANDER'
    authenticatedAt.value = new Date().toISOString()
    sessionExpiresAt.value = new Date(Date.now() + DEFAULT_SESSION_DURATION_MS).toISOString()
    saveSessionToStorage()
  }

  // Active Session Touch/Renewal on Operator Activity
  function touchSession() {
    if (loginPhase.value === 'logged-in' && userProfile.value) {
      sessionExpiresAt.value = new Date(Date.now() + DEFAULT_SESSION_DURATION_MS).toISOString()
      saveSessionToStorage()
    }
  }

  function saveSessionToStorage() {
    if (!userProfile.value || userProfile.value.isFirstTime) return
    const data: SessionData = {
      operatorId: operatorId.value,
      sessionToken: sessionToken.value,
      securityRole: securityRole.value,
      authenticatedAt: authenticatedAt.value || new Date().toISOString(),
      sessionExpiresAt: sessionExpiresAt.value || new Date(Date.now() + DEFAULT_SESSION_DURATION_MS).toISOString(),
      profile: userProfile.value,
    }
    const serialized = JSON.stringify(data)
    sessionStorage.setItem(SESSION_STORAGE_KEY, serialized)
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, serialized)

    trackEvent('login', {
      method: data.profile.authProvider || 'google',
      role: data.securityRole,
    })
  }

  function restoreSessionFromStorage(): boolean {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(LOCAL_STORAGE_SESSION_KEY)
      if (!raw) return false
      const data: SessionData = JSON.parse(raw)
      
      // Check session expiration
      if (data && data.sessionExpiresAt && new Date(data.sessionExpiresAt).getTime() < Date.now()) {
        clearStorageSession()
        return false
      }

      if (data && data.sessionToken && data.profile && isDomainAuthorized(data.profile.email)) {
        operatorId.value = data.operatorId
        sessionToken.value = data.sessionToken
        securityRole.value = data.securityRole
        authenticatedAt.value = data.authenticatedAt
        sessionExpiresAt.value = data.sessionExpiresAt
        userProfile.value = data.profile
        loginPhase.value = 'logged-in'
        return true
      }
    } catch {
      clearStorageSession()
    }
    return false
  }

  function clearStorageSession() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY)
  }

  function logout() {
    clearStorageSession()
    userProfile.value = null
    sessionToken.value = generateRandomToken()
    loginPhase.value = 'grid'
    authenticatedAt.value = null
    sessionExpiresAt.value = null
    initGrid()
  }

  // Auto Session Expiration Heartbeat Interval
  let heartbeatTimer: any = null
  function startSessionHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    heartbeatTimer = setInterval(() => {
      if (loginPhase.value === 'logged-in') {
        if (sessionExpiresAt.value && new Date(sessionExpiresAt.value).getTime() < Date.now()) {
          logout()
        }
      }
    }, 10000) // Check every 10 seconds
  }

  onMounted(() => {
    startSessionHeartbeat()
  })

  onBeforeUnmount(() => {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
  })

  restoreSessionFromStorage()
  if (loginPhase.value !== 'logged-in') {
    initGrid()
  }

  const unauthorizedAttempts = ref<UnauthorizedLoginAttempt[]>(loadUnauthorizedAttemptsFromStorage())

  async function logUnauthorizedLogin(payload: { email: string; uid?: string; displayName?: string; reason?: string }) {
    const attempt: UnauthorizedLoginAttempt = {
      id: 'unauth-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000),
      email: payload.email || 'UNKNOWN_ACCOUNT',
      uid: payload.uid || 'UID_NOT_PROVIDED',
      displayName: payload.displayName || 'External Google Account',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Platform',
      reason: payload.reason || 'Attempted login with non-@shadowverse.in domain Google account.',
      status: 'ACCESS_DENIED'
    }

    unauthorizedAttempts.value.unshift(attempt)

    // 1. LocalStorage Persistence
    try {
      localStorage.setItem(UNAUTHORIZED_LOGS_KEY, JSON.stringify(unauthorizedAttempts.value))
    } catch (e) {
      console.error('Failed saving unauthorized login attempt to LocalStorage:', e)
    }

    // 2. Firestore Cloud Storage Persistence ('default' database, 'unauthorized_logins' collection)
    try {
      const colRef = collection(db, 'unauthorized_logins')
      await addDoc(colRef, attempt)
    } catch (err) {
      console.warn('Firestore unauthorized login audit write handled:', err)
    }
  }

  return {
    loginPhase,
    operatorId,
    sessionToken,
    securityRole,
    authenticatedAt,
    sessionExpiresAt,
    sessionRemainingSeconds,
    currentRound,
    isSubmitting,
    matrix81Cells,
    roundGridNumbers,
    selectedCellIndex,
    bCellIndex,
    bCoordinate,
    bNumberInRound,
    selectCell,
    userProfile,
    isAuthenticated,
    needsOnboarding,
    unauthorizedAttempts,
    isDomainAuthorized,
    logUnauthorizedLogin,
    initGrid,
    startAuthenticateRounds,
    answerRound,
    setGoogleUser,
    completeFirstTimeOnboarding,
    touchSession,
    logout,
    restoreSessionFromStorage,
  }
})
