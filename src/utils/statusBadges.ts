/**
 * Shared status badge style generator for lead statuses and security audits.
 */

export interface StatusStyle {
  label: string
  bgClass: string
  textClass: string
  borderClass: string
}

export function getLeadStatusStyle(status: string): StatusStyle {
  switch (status) {
    case 'QUALIFIED':
      return {
        label: 'QUALIFIED',
        bgClass: 'bg-[#3d8b5e]/20',
        textClass: 'text-[#3d8b5e]',
        borderClass: 'border-[#3d8b5e]/40',
      }
    case 'PROPOSAL_SENT':
      return {
        label: 'PROPOSAL SENT',
        bgClass: 'bg-[#750d37]/20',
        textClass: 'text-[#9a1a4e]',
        borderClass: 'border-[#750d37]/40',
      }
    case 'DEPLOYED':
      return {
        label: 'DEPLOYED',
        bgClass: 'bg-[#3d8b5e]/30',
        textClass: 'text-white',
        borderClass: 'border-[#3d8b5e]',
      }
    case 'NEW':
      return {
        label: 'NEW INQUIRY',
        bgClass: 'bg-[#1e1e20]',
        textClass: 'text-[#c8c8cc]',
        borderClass: 'border-[#88888c]/40',
      }
    case 'CONTACTED':
      return {
        label: 'CONTACTED',
        bgClass: 'bg-amber-500/20',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-500/40',
      }
    case 'REJECTED':
      return {
        label: 'REJECTED',
        bgClass: 'bg-[#c44a4a]/20',
        textClass: 'text-[#c44a4a]',
        borderClass: 'border-[#c44a4a]/40',
      }
    default:
      return {
        label: status,
        bgClass: 'bg-[#1e1e20]',
        textClass: 'text-[#c8c8cc]',
        borderClass: 'border-[#1e1e20]',
      }
  }
}
