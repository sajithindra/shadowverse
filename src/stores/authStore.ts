import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

const SESSION_STORAGE_KEY = 'shadowverse_operator_session'
const USER_PROFILES_KEY = 'shadowverse_known_users'
const AUTHORIZED_DOMAIN = '@shadowverse.in'

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

  const userProfile = ref<UserProfile | null>(null)

  const isAuthenticated = computed(() => {
    if (loginPhase.value !== 'logged-in' || !userProfile.value || userProfile.value.isFirstTime) {
      return false
    }
    // Check if session has expired
    if (sessionExpiresAt.value && new Date(sessionExpiresAt.value).getTime() < Date.now()) {
      return false
    }
    return true
  })

  const needsOnboarding = computed(() => userProfile.value !== null && userProfile.value.isFirstTime)

  function generate81AsciiCells(): string[] {
    const pool: string[] = []
    for (let i = 33; i <= 126; i++) {
      if (i < 48 || i > 57) {
        pool.push(String.fromCharCode(i))
      }
    }
    let extended = [...pool, ...pool]
    extended.sort(() => Math.random() - 0.5)
    return extended.slice(0, 81)
  }

  function generateRandomToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  function initGrid() {
    matrix81Cells.value = generate81AsciiCells()
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
      roundGridNumbers.value = Array.from({ length: 81 }, () => Math.floor(Math.random() * 10).toString())
      loginPhase.value = 'rounds'
      currentRound.value = 0
    }, 400)
  }

  function answerRound(yes: boolean) {
    if (currentRound.value < 2) {
      currentRound.value += 1
      roundGridNumbers.value = Array.from({ length: 81 }, () => Math.floor(Math.random() * 10).toString())
    } else {
      isSubmitting.value = true
      setTimeout(() => {
        isSubmitting.value = false
        loginPhase.value = 'logged-in'
        authenticatedAt.value = new Date().toISOString()
        sessionExpiresAt.value = new Date(Date.now() + 8 * 3600 * 1000).toISOString()
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
    if (!email) return false
    return email.trim().toLowerCase().endsWith(AUTHORIZED_DOMAIN)
  }

  function setGoogleUser(payload: { uid: string; email: string; displayName?: string }) {
    const normalizedEmail = payload.email.trim().toLowerCase()
    
    if (!isDomainAuthorized(normalizedEmail)) {
      throw new Error(`ACCESS DENIED: Only accounts with @shadowverse.in domain are authorized to sign in. Yours: ${payload.email}`)
    }

    const known = getKnownUsers()
    const existing = known[payload.uid || normalizedEmail]

    if (existing && existing.fullName && existing.phone) {
      // Existing user with completed onboarding
      userProfile.value = {
        ...existing,
        isFirstTime: false,
      }
      operatorId.value = existing.email
      sessionToken.value = generateRandomToken()
      securityRole.value = 'GOOGLE_SOVEREIGN_COMMANDER'
      loginPhase.value = 'logged-in'
      authenticatedAt.value = new Date().toISOString()
      sessionExpiresAt.value = new Date(Date.now() + 8 * 3600 * 1000).toISOString()
      saveSessionToStorage()
    } else {
      // First-time login: needs name & phone
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
    sessionExpiresAt.value = new Date(Date.now() + 8 * 3600 * 1000).toISOString()
    saveSessionToStorage()
  }

  function saveSessionToStorage() {
    if (!userProfile.value || userProfile.value.isFirstTime) return
    const data: SessionData = {
      operatorId: operatorId.value,
      sessionToken: sessionToken.value,
      securityRole: securityRole.value,
      authenticatedAt: authenticatedAt.value || new Date().toISOString(),
      sessionExpiresAt: sessionExpiresAt.value || new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      profile: userProfile.value,
    }
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data))
  }

  function restoreSessionFromStorage(): boolean {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!raw) return false
      const data: SessionData = JSON.parse(raw)
      
      // Check session expiration
      if (data && data.sessionExpiresAt && new Date(data.sessionExpiresAt).getTime() < Date.now()) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
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
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    userProfile.value = null
    sessionToken.value = generateRandomToken()
    loginPhase.value = 'grid'
    authenticatedAt.value = null
    sessionExpiresAt.value = null
    initGrid()
  }

  restoreSessionFromStorage()
  if (loginPhase.value !== 'logged-in') {
    initGrid()
  }

  return {
    loginPhase,
    operatorId,
    sessionToken,
    securityRole,
    authenticatedAt,
    sessionExpiresAt,
    currentRound,
    isSubmitting,
    matrix81Cells,
    roundGridNumbers,
    userProfile,
    isAuthenticated,
    needsOnboarding,
    isDomainAuthorized,
    initGrid,
    startAuthenticateRounds,
    answerRound,
    setGoogleUser,
    completeFirstTimeOnboarding,
    logout,
    restoreSessionFromStorage,
  }
})
