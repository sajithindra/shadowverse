import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { trackConversion } from '../utils/analytics'

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  domain: string
  source: string
  budget: string
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'PROPOSAL_SENT' | 'DEPLOYED' | 'REJECTED'
  intentScore: number
  dateAdded: string
  notes: string
  assignedAgent: string
}

export const useLeadStore = defineStore('lead', () => {
  const leads = ref<Lead[]>([
    {
      id: 'LEAD-901',
      name: 'Vikramaditya Sharma',
      company: 'Reliance Defense & Aerospace',
      email: 'vikram@reliance.shadowverse.in',
      phone: '+91 98201 11223',
      domain: 'Defense / Aerospace Security',
      source: 'Direct Portal Inquiry',
      budget: '₹45,00,000',
      status: 'QUALIFIED',
      intentScore: 94,
      dateAdded: '2026-08-05',
      notes: 'Requesting 12,000 stream RTSP deployment for campus perimeter monitoring.',
      assignedAgent: 'ARUN KUMAR PILLAI',
    },
    {
      id: 'LEAD-902',
      name: 'Ananya Deshmukh',
      company: 'HDFC Cyber Financial Hub',
      email: 'ananya.d@hdfc.shadowverse.in',
      phone: '+91 98450 99881',
      domain: 'Banking & Financial Vaults',
      source: 'Google Auth Enterprise',
      budget: '₹75,00,000',
      status: 'PROPOSAL_SENT',
      intentScore: 98,
      dateAdded: '2026-08-04',
      notes: 'Requires logic lock ASCII matrix vault authentication for 40 bank branches.',
      assignedAgent: 'SAJITHINDRA',
    },
    {
      id: 'LEAD-903',
      name: 'Rohan Sundaram',
      company: 'Apollo Healthcare & Hospitals',
      email: 'r.sundaram@apollo.shadowverse.in',
      phone: '+91 97112 33445',
      domain: 'Elder Care & ICU Surveillance',
      source: 'Elder Fall Simulation Demo',
      budget: '₹30,00,000',
      status: 'NEW',
      intentScore: 88,
      dateAdded: '2026-08-05',
      notes: 'Interested in Elder Fall Emergency AI alert integration across 15 wards.',
      assignedAgent: 'ARUN KUMAR PILLAI',
    },
    {
      id: 'LEAD-904',
      name: 'Priya Nambiar',
      company: 'TATA Advanced Systems',
      email: 'p.nambiar@tata.shadowverse.in',
      phone: '+91 99008 77665',
      domain: 'Industrial Manufacturing',
      source: 'Sovereign Cloud Deployment Request',
      budget: '₹1,20,00,000',
      status: 'DEPLOYED',
      intentScore: 99,
      dateAdded: '2026-08-01',
      notes: 'Successfully deployed MicroK8s & Ceph 100TB private cloud infrastructure.',
      assignedAgent: 'SURVMONX LLP',
    },
    {
      id: 'LEAD-905',
      name: 'Karan Mehra',
      company: 'DLF CyberCity Properties',
      email: 'karan.mehra@dlf.shadowverse.in',
      phone: '+91 98110 55443',
      domain: 'Commercial Real Estate',
      source: 'Direct Portal Inquiry',
      budget: '₹25,00,000',
      status: 'CONTACTED',
      intentScore: 76,
      dateAdded: '2026-08-03',
      notes: 'Evaluating visitor risk profiling AI and perimeter surveillance cameras.',
      assignedAgent: 'SAJITHINDRA',
    },
    {
      id: 'LEAD-906',
      name: 'Dr. Meera Iyer',
      company: 'Manipal AI Research Labs',
      email: 'meera.i@manipal.shadowverse.in',
      phone: '+91 97400 12345',
      domain: 'Biomedical AI Research',
      source: 'DPDP Act Compliance Request',
      budget: '₹18,00,000',
      status: 'QUALIFIED',
      intentScore: 91,
      dateAdded: '2026-08-02',
      notes: 'Requires 48-hour auto-purge Ceph storage for biomedical facial vector data.',
      assignedAgent: 'SURVMONX LLP',
    },
  ])

  const totalLeads = computed(() => leads.value.length)
  const qualifiedLeads = computed(() => leads.value.filter(l => l.status === 'QUALIFIED' || l.status === 'PROPOSAL_SENT' || l.status === 'DEPLOYED').length)
  const totalPipelineValue = computed(() => '₹3.13 CR')

  function addLead(newLead: Omit<Lead, 'id' | 'dateAdded'>) {
    const id = 'LEAD-' + Math.floor(100 + Math.random() * 900)
    const today = new Date().toISOString().split('T')[0] || '2026-08-05'
    leads.value.unshift({
      id,
      dateAdded: today,
      name: newLead.name,
      company: newLead.company,
      email: newLead.email,
      phone: newLead.phone,
      domain: newLead.domain,
      source: newLead.source,
      budget: newLead.budget,
      status: newLead.status,
      intentScore: newLead.intentScore,
      notes: newLead.notes,
      assignedAgent: newLead.assignedAgent,
    })

    trackConversion('lead_submission', {
      lead_id: id,
      domain: newLead.domain,
      source: newLead.source,
    })
  }

  function updateLeadStatus(leadId: string, newStatus: Lead['status']) {
    const lead = leads.value.find(l => l.id === leadId)
    if (lead) lead.status = newStatus
  }

  return {
    leads,
    totalLeads,
    qualifiedLeads,
    totalPipelineValue,
    addLead,
    updateLeadStatus,
  }
})
