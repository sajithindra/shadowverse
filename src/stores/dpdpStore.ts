import { defineStore } from 'pinia'
import { ref } from 'vue'
import { trackEvent } from '../utils/analytics'

export interface DpdpTicket {
  refNo: string
  type: 'REPORT' | 'ERASURE' | 'CORRECTION' | 'NOMINATION' | 'GRIEVANCE'
  applicantName: string
  submittedAt: string
  status: string
  details?: any
}

const DPDP_STORAGE_KEY = 'shadowverse_dpdp_tickets'

export const useDpdpStore = defineStore('dpdp', () => {
  const tickets = ref<DpdpTicket[]>([])

  function loadTickets() {
    try {
      const raw = sessionStorage.getItem(DPDP_STORAGE_KEY) || localStorage.getItem(DPDP_STORAGE_KEY)
      if (raw) {
        tickets.value = JSON.parse(raw)
      }
    } catch {
      tickets.value = []
    }
  }

  function addTicket(ticket: DpdpTicket) {
    tickets.value.unshift(ticket)
    const serialized = JSON.stringify(tickets.value)
    sessionStorage.setItem(DPDP_STORAGE_KEY, serialized)
    localStorage.setItem(DPDP_STORAGE_KEY, serialized)

    trackEvent('dpdp_ticket_created', {
      type: ticket.type,
      refNo: ticket.refNo,
    })
  }

  loadTickets()

  return {
    tickets,
    addTicket,
  }
})
