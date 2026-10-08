<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import HeaderNav from '../components/HeaderNav.vue'
import FooterSection from '../components/FooterSection.vue'
import IndustrialToast from '../components/IndustrialToast.vue'
import ContactBar from '../components/ContactBar.vue'
import { useToast } from '../composables/useToast'
import { isValidEmail, isValidPhone, isValidName } from '../utils/validators'

// Async Modals matching project standard
const PrivacyPolicyModal = defineAsyncComponent(() => import('../components/PrivacyPolicyModal.vue'))
const TermsModal = defineAsyncComponent(() => import('../components/TermsModal.vue'))
const DpdpPortalModal = defineAsyncComponent(() => import('../components/DpdpPortalModal.vue'))
const GoogleSignInModal = defineAsyncComponent(() => import('../components/GoogleSignInModal.vue'))
const ScalabilityModal = defineAsyncComponent(() => import('../components/ScalabilityModal.vue'))

const router = useRouter()
const { showToast } = useToast()

// Modal States
const showSignInModal = ref(false)
const showPrivacyModal = ref(false)
const showTermsModal = ref(false)
const showDpdpPortalModal = ref(false)
const showScalabilityModal = ref(false)
const activeScalabilitySlide = ref(1)

// Inquiry form state with validation
const formName = ref('')
const formEmail = ref('')
const formPhone = ref('')
const formCams = ref('500')
const formMessage = ref('')
const formErrors = ref<Record<string, string>>({})
const formSubmitted = ref(false)

function submitInquiry() {
  formErrors.value = {}
  if (!isValidName(formName.value)) {
    formErrors.value.name = 'Please provide a valid contact name (at least 2 characters)'
  }
  if (!formEmail.value.trim()) {
    formErrors.value.email = 'Work email is required'
  } else if (!isValidEmail(formEmail.value.trim())) {
    formErrors.value.email = 'Please provide a valid email address'
  }
  if (formPhone.value.trim() && !isValidPhone(formPhone.value.trim())) {
    formErrors.value.phone = 'Please provide a valid phone number (10–15 digits)'
  }

  if (Object.keys(formErrors.value).length > 0) {
    showToast({
      title: 'VALIDATION FAILED',
      message: 'Please resolve errors in the inquiry form.',
      type: 'ALERT',
    })
    return
  }

  formSubmitted.value = true
  showToast({
    title: 'INQUIRY LOGGED',
    message: 'ShadowWatch compliance & deployment parameters recorded. Engineering dispatch scheduled.',
    type: 'SUCCESS',
  })
}

function resetForm() {
  formSubmitted.value = false
  formName.value = ''
  formEmail.value = ''
  formPhone.value = ''
  formMessage.value = ''
  formErrors.value = {}
}

// ── ACCREDITATIONS & REGULATORY MANDATES ──
interface AccreditationItem {
  id: string
  code: string
  title: string
  authority: string
  statutoryRef: string
  accent: string
  icon: string
  summary: string
  provisions: string[]
}

const accreditationsList: AccreditationItem[] = [
  {
    id: 'dpdp-act',
    code: 'DPDP-2023',
    title: 'Digital Personal Data Protection Act, 2023',
    authority: 'Government of India · Data Protection Board',
    statutoryRef: 'DPDP Act 2023, Sections 8(5), 9 & Data Localization Mandates',
    accent: '#3d8b5e',
    icon: 'gavel',
    summary:
      'Enforces sovereign local data residency for CCTV footage and biometric records. Eliminates public cloud processor liability, cross-border transmission breaches, and ₹250 Cr statutory non-compliance exposure.',
    provisions: [
      '100% on-premise local data localization; zero foreign server transit',
      'Dynamic automated bystander blurring & privacy masking on footage',
      'Immutable cryptographic access ledger recording every query and view',
      'Quarterly Data Protection Officer (DPO) automated compliance audit packs',
    ],
  },
  {
    id: 'stqc-esr',
    code: 'STQC-ESR',
    title: 'STQC & MeitY Hardware Reliability & Security Certification',
    authority: 'Ministry of Electronics and Information Technology (MeitY)',
    statutoryRef: 'MeitY Public Procurement Order · STQC CCTV Security Guidelines',
    accent: '#c49a3c',
    icon: 'verified',
    summary:
      'Maintains an active Equipment Security and Reliability (ESR) compliance register across all cameras on the network. Audits firmware for backdoor risks, enforces credential rotation, and segregates non-certified legacy devices.',
    provisions: [
      'Automated camera inventory identifies uncertified hardware models',
      'Enforces mandatory 90-day automated password and credential rotation',
      'Air-gapped camera VLAN isolation prevents unauthorized WAN communication',
      'Monthly departmental hardware compliance scorecards for refresh cycles',
    ],
  },
  {
    id: 'bsa-sec-63',
    code: 'BSA-SEC-63',
    title: 'Bharatiya Sakshya Adhiniyam (BSA) Section 63 Evidence Standard',
    authority: 'Supreme Court & High Courts of India · Forensic Evidence Mandates',
    statutoryRef: 'BSA 2023, Section 63 (Admissibility of Electronic Records)',
    accent: '#750d37',
    icon: 'verified_user',
    summary:
      'Automates generation of court-admissible electronic evidence packages. Every exported video clip includes cryptographic SHA-256 container hashes, microsecond timestamp watermarking, and an automated electronic certificate.',
    provisions: [
      '1-click export of tamper-evident forensic video bundles',
      'Cryptographic SHA-256 seal proves footage was unaltered since incident time',
      'Automated chain-of-custody metadata certificate signed by duty officer',
      'Full legal standing during departmental inquiries and judicial trials',
    ],
  },
  {
    id: 'iso-standards',
    code: 'ISO-27001/27701',
    title: 'ISO/IEC 27001:2022 & ISO/IEC 27701:2019 Information Security',
    authority: 'International Organization for Standardization · Quality Certifications',
    statutoryRef: 'Annex A.11 Physical Security & A.12 Operations Security',
    accent: '#4a7ebb',
    icon: 'shield',
    summary:
      'Provides systematic enterprise governance for video security operations. Implements zero-trust role boundaries, segregated management subnets, and cryptographically verified system logs.',
    provisions: [
      'Zero-trust Logic Lock authentication prevents brute force and token theft',
      'Role-Based Access Control (RBAC) scopes camera visibility per officer tier',
      'Continuous audit trail captures operator sessions, exports, and config edits',
      'Automated failover and storage replication guarantee 99.99% system readiness',
    ],
  },
  {
    id: 'life-safety-nfpa',
    code: 'NFPA-72/101',
    title: 'Life Safety Code & Fire Alarm Interlock (NFPA & NBC India)',
    authority: 'National Building Code of India (Part 4) · NFPA 72 & 101 Standards',
    statutoryRef: 'NBC 2016 Fire & Life Safety · NFPA 101 Emergency Egress Regulations',
    accent: '#c44a4a',
    icon: 'local_fire_department',
    summary:
      'Enforces real-time life safety compliance by continuously inspecting fire exit routes, stairwells, and emergency doors. Interlocks with Fire Alarm Control Panels for automated visual verification and fail-safe door unlocks.',
    provisions: [
      'Real-time computer vision audits emergency exit paths for physical obstructions',
      'Instant video wall spotlighting of cameras nearest to triggered smoke sensors',
      'Emergency egress unlock overrides fail magnetic access doors open',
      'Automated corridor crush and crowd stampede density alerts',
    ],
  },
  {
    id: 'workplace-safety',
    code: 'FACTORIES-ACT',
    title: 'Workplace Safety & Occupational Health (Factories Act / OSHA)',
    authority: 'Directorate General of Factory Advice Service and Labour Institutes (DGFASLI)',
    statutoryRef: 'Factories Act 1948, Sections 21-41 · Occupational Safety Mandates',
    accent: '#9a1a4e',
    icon: 'engineering',
    summary:
      'Automates continuous inspection of high-hazard zones, cleanrooms, and industrial floors. Detects missing safety gear, unauthorized personnel in restricted machine bays, and slip/fall hazards in real time.',
    provisions: [
      'Automated PPE detection: flags missing helmets, vests, and safety goggles',
      'Virtual tripwires detect unauthorized entry into hazardous machinery zones',
      'Automated slip, trip, and fall pose estimation triggers instant first-aid response',
      'Shift-wise workplace safety compliance audit reports for statutory inspectors',
    ],
  },
]

// ── REAL-TIME VIOLATION TELEMETRY & REPORTING STREAM ──
interface ViolationIncident {
  id: string
  code: string
  title: string
  severity: 'CRITICAL' | 'MAJOR' | 'WARNING'
  severityColor: string
  timestamp: string
  locus: string
  camera: string
  statutoryRule: string
  automatedAction: string
  reportStatus: string
}

const realtimeViolations: ViolationIncident[] = [
  {
    id: 'VIOL-001',
    code: 'EGRESS_OBSTRUCTION',
    title: 'Fire Exit Stairwell Blocked by Staged Pallets',
    severity: 'CRITICAL',
    severityColor: '#c44a4a',
    timestamp: '15:38:22 IST',
    locus: 'Stairwell B — Ground Floor North Egress',
    camera: 'CAM-04 [Hikvision 4K Dome]',
    statutoryRule: 'NFPA 101 / NBC India Part 4 Sec 3.4',
    automatedAction: 'Facility PA alert dispatched; Nearest emergency marshal notified via SMS',
    reportStatus: 'Logged to Daily Fire Safety Digest #2026-10-08',
  },
  {
    id: 'VIOL-002',
    code: 'DPDP_UNAUTH_EXPORT',
    title: 'Footage Export Attempt Without Registered DPO Token',
    severity: 'CRITICAL',
    severityColor: '#c44a4a',
    timestamp: '15:32:05 IST',
    locus: 'Sub-Division Console #02 (Operator Terminal)',
    camera: 'SYSTEM [Video Forensic Exporter]',
    statutoryRule: 'DPDP Act 2023 Sec 8(5) & Sec 11',
    automatedAction: 'Export blocked instantly; Immutable SHA-256 incident logged to DPO audit vault',
    reportStatus: 'Filed to Statutory DPO Compliance Pack',
  },
  {
    id: 'VIOL-003',
    code: 'TAILGATE_PROXY_ENTRY',
    title: 'Secondary Unbadged Person Following Turnstile Badge',
    severity: 'MAJOR',
    severityColor: '#c49a3c',
    timestamp: '15:24:41 IST',
    locus: 'East Secure Turnstile Bank — Gate 1',
    camera: 'CAM-11 [Axis Biometric Face Interlock]',
    statutoryRule: 'Zero-Trust Physical Perimeter Mandate',
    automatedAction: 'Turnstile gate interlocked; Secondary biometric challenge prompted',
    reportStatus: 'Attached to Shift Access Log #A-104',
  },
  {
    id: 'VIOL-004',
    code: 'STQC_LEGACY_QUARANTINE',
    title: 'Non-Certified Camera Detected on Core LAN',
    severity: 'MAJOR',
    severityColor: '#c49a3c',
    timestamp: '15:10:19 IST',
    locus: 'Perimeter Boundary Fence Subnet',
    camera: 'CAM-38 [Uncertified Legacy IP Encoder]',
    statutoryRule: 'MeitY STQC CCTV Security Mandate / ESR-04',
    automatedAction: 'Quarantined to air-gapped zero-route VLAN; Internet gateway blocked',
    reportStatus: 'Added to Monthly ESR Equipment Register',
  },
  {
    id: 'VIOL-005',
    code: 'PPE_SAFETY_DEFICIT',
    title: 'Missing Mandatory Hardhat & High-Vis Vest in Active Crane Zone',
    severity: 'WARNING',
    severityColor: '#9a1a4e',
    timestamp: '14:58:30 IST',
    locus: 'Heavy Fabrication Bay 3 (Overhead Crane Locus)',
    camera: 'CAM-19 [Dahua 1080p Industrial]',
    statutoryRule: 'Factories Act 1948 Sec 38 / OSHA 1910.135',
    automatedAction: 'On-floor safety beacon flashed; Supervisor WhatsApp alert dispatched',
    reportStatus: 'Queued to Weekly OSHA Safety Dossier',
  },
  {
    id: 'VIOL-006',
    code: 'LENS_OCCLUSION_TAMPER',
    title: 'Sudden Video Signal Blindness / Spray Paint Tamper Detected',
    severity: 'CRITICAL',
    severityColor: '#c44a4a',
    timestamp: '14:41:12 IST',
    locus: 'Secure Outer Perimeter Wall — Sector 7',
    camera: 'CAM-09 [CP Plus Thermal Multi-Sensor]',
    statutoryRule: 'ISO 27001 Annex A.11.1.4 Surveillance Integrity',
    automatedAction: 'Adjacent PTZ camera auto-redirected to locus; Armed patrol team alerted',
    reportStatus: 'Secured as BSA Sec 63 Evidentiary Incident',
  },
]

// ── MULTI-TIER COMPLIANCE REPORTING PACKS ──
interface ReportingTier {
  tier: string
  title: string
  cadence: string
  audience: string
  accent: string
  icon: string
  description: string
  outputs: string[]
}

const reportingTiers: ReportingTier[] = [
  {
    tier: 'TIER 1',
    title: 'Instant Autonomous Alert & Physical Loop Dispatch',
    cadence: '< 50 Milliseconds',
    audience: 'Duty Officers · Physical Security Control · Automation Relays',
    accent: '#c44a4a',
    icon: 'bolt',
    description:
      'Immediate sub-second reaction upon detecting a statutory breach. Triggers on-screen popups on video walls, sends priority alerts via WhatsApp/SMS, and signals physical building actuators (magnetic doors, AHU dampers, turnstiles).',
    outputs: [
      'Live pop-out spotlight on operator video wall',
      'Encrypted WhatsApp & SMS push with timestamped video clip',
      'Physical relay trigger (turnstile lock / fire door release / HVAC cutoff)',
      'Immediate push to mobile duty officer console',
    ],
  },
  {
    tier: 'TIER 2',
    title: 'Daily Operational Compliance & Shift Digest',
    cadence: 'Daily at 00:00 / Shift End',
    audience: 'Facility Directors · Shift In-Charge · Safety Marshals',
    accent: '#c49a3c',
    icon: 'event_note',
    description:
      'Aggregated summary of all facility safety breaches, perimeter events, and attendance muster rolls. Flags recurrent choke points and highlights equipment anomalies before shift handover.',
    outputs: [
      'Shift-wise breakdown of physical and safety violations',
      'Corridor blockage duration and crowd bottleneck analysis',
      'Biometric muster roll reconciliations vs HRMS records',
      'Actionable resolution checklist for facility managers',
    ],
  },
  {
    tier: 'TIER 3',
    title: 'Monthly Departmental Compliance Scorecards',
    cadence: 'Monthly on 1st',
    audience: 'Executive Leadership · Department Heads · Oversight Boards',
    accent: '#4a7ebb',
    icon: 'analytics',
    description:
      'High-level governance scorecards ranking departments by regulatory adherence. Compares camera uptime SLAs, identifies vulnerable physical zones, and tracks hardware lifecycle certifications.',
    outputs: [
      'Cross-departmental compliance index rating (0% to 100%)',
      'ESR camera equipment audit: inventory of non-certified cameras for refresh',
      'Camera network uptime and packet jitter availability SLAs',
      'Quarter-on-quarter safety and security trend comparisons',
    ],
  },
  {
    tier: 'TIER 4',
    title: 'Statutory DPO Packs & BSA Section 63 Evidence Dossiers',
    cadence: 'Quarterly / On Judicial Demand',
    audience: 'Data Protection Officer (DPO) · Legal Counsel · Judicial Courts',
    accent: '#3d8b5e',
    icon: 'account_balance',
    description:
      'Official statutory reporting dossiers. Delivers cryptographically sealed audit trails to Data Protection Officers for DPDP Act audit filings, alongside court-certified evidence packages for judicial hearings.',
    outputs: [
      'DPDP Data Protection Impact Assessment (DPIA) audit pack',
      'Tamper-evident BSA Section 63 electronic evidence container (SHA-256)',
      'Cryptographically signed operator chain-of-custody certificates',
      'Immutable operator access ledger proving zero data tampering',
    ],
  },
]

// Active Property Filter Tab (Default to COMPLIANCE)
type FilterTab = 'ALL' | 'COMPLIANCE' | 'INTEGRATIONS' | 'PROTOCOLS' | 'CONSOLE' | 'HARDWARE'
const activeTab = ref<FilterTab>('COMPLIANCE')

interface PropertyCard {
  id: string
  category: 'COMPLIANCE' | 'INTEGRATIONS' | 'PROTOCOLS' | 'CONSOLE' | 'HARDWARE'
  categoryLabel: string
  title: string
  subtitle: string
  accent: string
  icon: string
  badge: string
  specs: { label: string; value: string }[]
  description: string
  highlights: string[]
}

const propertiesList: PropertyCard[] = [
  // ── COMPLIANCE & ACCREDITATION ──
  {
    id: 'dpdp-compliance',
    category: 'COMPLIANCE',
    categoryLabel: '// STATUTORY COMPLIANCE',
    title: 'DPDP Act (2023) Sovereign Compliance Architecture',
    subtitle: 'Air-gapped on-premise data localization with immutable audit protection',
    accent: '#3d8b5e',
    icon: 'gavel',
    badge: 'DPDP ACT 2023 COMPLIANT',
    specs: [
      { label: 'Data Residency', value: '100% On-Premise (Zero Outbound Cloud Egress)' },
      { label: 'Audit Trail', value: 'Cryptographic immutable logging of every view & query' },
      { label: 'Access Control', value: 'Granular Role-Based Access Control (RBAC)' },
      { label: 'Privacy Defense', value: 'Dynamic bystander blurring & automated masking' },
    ],
    description:
      'Engineered specifically for India’s Digital Personal Data Protection (DPDP) Act 2023. Video streams, facial vectors, and operator audit entries are processed entirely within the local facility perimeter. Eliminates cloud processor liabilities, non-compliance penalties, and cross-border data transfer risks.',
    highlights: [
      'Zero external network dependencies eliminates public cloud processor exposure',
      'Tamper-evident audit ledger tracks every query, export, and operator view',
      'Role-scoped camera permissions protect sensitive employee and public zones',
    ],
  },
  {
    id: 'court-evidence-ledger',
    category: 'COMPLIANCE',
    categoryLabel: '// LEGAL & EVIDENCE',
    title: 'Bharatiya Sakshya Adhiniyam (BSA) Section 63 Evidence Ledger',
    subtitle: 'Automated court-admissible forensic packages with cryptographic proof',
    accent: '#750d37',
    icon: 'verified_user',
    badge: 'COURT ADMISSIBLE',
    specs: [
      { label: 'Hash Standard', value: 'SHA-256 Frame & Container Hashing' },
      { label: 'Chain of Custody', value: 'Operator cryptographically signed electronic certificate' },
      { label: 'Watermarking', value: 'Frame-accurate microsecond timestamp watermarking' },
      { label: 'Export Format', value: 'Cryptographic container with verification checksum' },
    ],
    description:
      'ShadowWatch automates the generation of court-admissible digital evidence packages in full alignment with Section 63 of the Bharatiya Sakshya Adhiniyam, 2023. Every exported video clip includes cryptographic hash verification, operator chain-of-custody certificates, and microsecond camera clock stamps.',
    highlights: [
      '1-click export bundles video clips, metadata, and hash certificates',
      'Cryptographic SHA-256 seal proves footage was untouched since incident time',
      'Eliminates legal evidentiary challenges during court and disciplinary hearings',
    ],
  },
  {
    id: 'esr-stqc-register',
    category: 'COMPLIANCE',
    categoryLabel: '// HARDWARE GOVERNANCE',
    title: 'ESR & STQC Hardware Security Compliance Register',
    subtitle: 'Fleet-wide inventory auditing of camera vulnerabilities and certifications',
    accent: '#c49a3c',
    icon: 'verified',
    badge: 'SECURITY AUDIT REGISTER',
    specs: [
      { label: 'Certifications', value: 'STQC / ESR Hardware Certification Registry' },
      { label: 'Credential Guard', value: 'Automated 90-day camera password rotation' },
      { label: 'VLAN Isolation', value: 'Camera subnet air-gapping with zero WAN routing' },
      { label: 'Reporting', value: 'Monthly departmental compliance and health audit' },
    ],
    description:
      'ShadowWatch maintains an active Equipment Security and Reliability (ESR) compliance register across all cameras. It audits camera firmware, enforces credential rotation, isolates uncertified legacy units on segregated VLANs, and flags units for departmental procurement refresh cycles.',
    highlights: [
      'Automated inventory identifies uncertified or outdated camera models',
      'Isolates legacy cameras behind zero-trust gateway with no internet route',
      'Issues monthly departmental compliance scorecards to governance boards',
    ],
  },

  // ── PHYSICAL FACILITY INTEGRATIONS ──
  {
    id: 'biometric-integration',
    category: 'INTEGRATIONS',
    categoryLabel: '// PHYSICAL INTEGRATIONS',
    title: 'Biometric Access & Multi-Factor Turnstile Interlock',
    subtitle: 'Cross-verifies biometric sensor scans against live camera facial vectors',
    accent: '#3d8b5e',
    icon: 'fingerprint',
    badge: 'ZERO-TRUST ACCESS',
    specs: [
      { label: 'Protocols', value: 'Wiegand, OSDP v2, TCP/IP, ONVIF Profile C' },
      { label: 'Verification', value: '2-Factor (Biometric Scan + Visual Camera Match)' },
      { label: 'Latency', value: '< 120 ms turnstile release decision' },
      { label: 'HRMS Sync', value: 'Instant shift log & automated muster audit' },
    ],
    description:
      'ShadowWatch pairs physical biometric readers (fingerprint, IRIS, and facial access terminals) with overhead surveillance cameras. A single scanned credential triggers simultaneous visual identity matching, stopping tailgating, proxy clock-ins, and borrowed access cards instantly.',
    highlights: [
      'Two-factor check prevents badge lending at secure turnstiles',
      'Automated shift attendance logging without physical queues',
      'Instant access revocation and perimeter lockdown on threat alerts',
    ],
  },
  {
    id: 'fire-alarm-integration',
    category: 'INTEGRATIONS',
    categoryLabel: '// PHYSICAL INTEGRATIONS',
    title: 'Fire Alarm Control Panel (FACP) & Life Safety Automation',
    subtitle: 'Direct hardware loop with building fire panels, smoke sensors, and egress routes',
    accent: '#c44a4a',
    icon: 'local_fire_department',
    badge: 'LIFE SAFETY AUTOMATION',
    specs: [
      { label: 'Protocols', value: 'BACnet IP, Modbus, Dry Contact Relays, NFPA 72 Loop' },
      { label: 'Response', value: 'Immediate visual fire/smoke angle projection' },
      { label: 'Safety Mode', value: 'Fail-safe egress door magnetic release' },
      { label: 'Egress Tracking', value: 'Corridor choke-point & density monitoring' },
    ],
    description:
      'When an addressable fire alarm panel or aspirating smoke detector trips, ShadowWatch instantly elevates all camera feeds within that zone onto the primary operator video wall. It confirms smoke visually, audits evacuation routes for trapped occupants, and commands magnetic access locks to fail open for safe exit.',
    highlights: [
      'Instant spotlighting of fire-zone cameras on operator video wall',
      'Evacuation corridor monitoring detects crush points and blocked exits',
      'Automated emergency override signals release magnetic egress doors',
    ],
  },
  {
    id: 'hvac-integration',
    category: 'INTEGRATIONS',
    categoryLabel: '// PHYSICAL INTEGRATIONS',
    title: 'HVAC & Environmental Building Management (BMS)',
    subtitle: 'Automated smoke isolation, contaminant lockdown, and occupancy modulation',
    accent: '#4a7ebb',
    icon: 'hvac',
    badge: 'BMS AUTOMATION',
    specs: [
      { label: 'Protocols', value: 'BACnet MS/TP, BACnet IP, Modbus TCP, MQTT' },
      { label: 'Emergency Override', value: 'Automatic AHU fan cutoff & damper seal' },
      { label: 'Energy Saving', value: '20% to 35% commercial HVAC reduction' },
      { label: 'Zone Control', value: 'Dynamic airflow modulation via visual occupancy' },
    ],
    description:
      'ShadowWatch bridges CCTV spatial intelligence directly with central HVAC chillers, air handling units (AHUs), and motorized fire dampers. In emergency events, it commands ventilation dampers shut to contain toxic smoke. During normal shifts, it dynamically throttles cooling based on real-time room crowd density.',
    highlights: [
      'Emergency smoke containment: auto-shuts AHU units to prevent smoke propagation',
      'Breach isolation: commands negative air pressure in contaminated or quarantined zones',
      'Occupancy-driven climate modulation: reduces cooling load in unoccupied sectors',
    ],
  },

  // ── INGESTION & PROTOCOLS ──
  {
    id: 'universal-camera-ingest',
    category: 'PROTOCOLS',
    categoryLabel: '// STREAM INGESTION',
    title: 'Universal Multi-Vendor Camera Ingestion (12,000+ Streams)',
    subtitle: 'Zero camera replacement: connects to any manufacturer’s existing cameras',
    accent: '#750d37',
    icon: 'videocam',
    badge: '12,000+ STREAMS',
    specs: [
      { label: 'Protocols', value: 'RTSP, ONVIF (Profile S, G, T), HTTP, RTMP' },
      { label: 'Vendors Supported', value: 'Hikvision, Dahua, CP Plus, Axis, Honeywell, Hanwha, Uniview, Bosch' },
      { label: 'Video Codecs', value: 'Hardware-decoded H.264, H.265 (HEVC), MJPEG' },
      { label: 'Architecture', value: 'Dual-stream (High-Res Storage + Low-Res Display Grid)' },
    ],
    description:
      'ShadowWatch ingests feeds from any camera already installed in the facility. Utilizing hardware-accelerated NVDEC decoding and CuPy tensor memory, a single server cluster aggregates up to 12,000+ concurrent live video streams with zero proprietary hardware lock-in or rewiring.',
    highlights: [
      'Works with the cameras you already own — no proprietary hardware replacement',
      'Dual-stream pipeline preserves bandwidth while recording at full 4K/1080p resolution',
      'Built-in jitter buffers and auto-reconnect handle erratic branch network links',
    ],
  },
  {
    id: 'bidirectional-engine',
    category: 'PROTOCOLS',
    categoryLabel: '// CORE ENGINE',
    title: 'Bidirectional Read/Write Telemetry & State Hub',
    subtitle: 'Central governance hexagonal hub managing alerts, state, and forensic write-backs',
    accent: '#3d8b5e',
    icon: 'sync_alt',
    badge: 'BIDIRECTIONAL HUB',
    specs: [
      { label: 'Data Bus', value: 'High-throughput async WebSocket & gRPC bus' },
      { label: 'Telemetry Stream', value: 'Real-time bounding boxes, vectors, and sensor states' },
      { label: 'Write-Back', value: 'Forensic tags, incident triage notes, and dispatch state' },
      { label: 'Latency', value: 'Sub-50 ms glass-to-glass pipeline latency' },
    ],
    description:
      'Unlike passive NVR screens that only display footage, ShadowWatch acts as a bidirectional governance hub. It continuously receives AI detection telemetry and environmental sensor signals, evaluates dispatch rules, and writes back verified incident states and operator decisions into the audit database.',
    highlights: [
      'Two-way sync: receives AI detections and writes back officer triage logs',
      'Decoupled client architecture ensures video wall stays responsive under high load',
      'WebSocket telemetry distributes live alerts to multiple command screens simultaneously',
    ],
  },

  // ── OPERATOR CONSOLE & VMS ──
  {
    id: 'vms-matrix-console',
    category: 'CONSOLE',
    categoryLabel: '// OPERATOR CONSOLE',
    title: 'Multi-Branch Unified Video Wall & Matrix Console',
    subtitle: 'Single pane of glass across hundreds of remote sites and thousands of cameras',
    accent: '#4a7ebb',
    icon: 'grid_view',
    badge: 'UNIFIED VMS',
    specs: [
      { label: 'Grid Layouts', value: '1×1, 2×2, 3×3, 4×4, 8×8, Dynamic Incident Spotlight' },
      { label: 'Playback Sync', value: 'Simultaneous multi-camera synchronized timeline scrub' },
      { label: 'Site Mapping', value: 'Interactive 2D/3D GIS floorplans with real-time FOV cones' },
      { label: 'PTZ Control', value: 'Virtual PTZ digital crop & ROI zoom with zero hardware lag' },
    ],
    description:
      'ShadowWatch consolidates disparate branch recorders and edge servers into a unified operator dashboard. Duty officers can customize split screens, inspect spatial camera view cones on floor plans, perform synchronous timeline scrubbing, and zoom digitally without mechanical wear.',
    highlights: [
      'One unified screen monitors cameras across all branches and facility buildings',
      'Synchronized multi-camera playback reconstructs events from every perspective',
      'Interactive GIS floor plan displays camera locations and active incident alerts',
    ],
  },
  {
    id: 'forensic-investigator',
    category: 'CONSOLE',
    categoryLabel: '// POLICING FORENSICS',
    title: '"Palantir for Policing" Forensic Investigation Console',
    subtitle: 'Natural language search, photo matching, trajectory mapping, and case graphs',
    accent: '#750d37',
    icon: 'local_police',
    badge: 'INVESTIGATOR SUITE',
    specs: [
      { label: 'Search Query', value: 'Natural language attributes & reference photograph match' },
      { label: 'Vector Index', value: 'Qdrant 512-dimensional facial cosine index' },
      { label: 'Trajectory', value: 'Cross-camera journey path & timeline reconstruction' },
      { label: 'Case Graph', value: 'Interactive knowledge graph of suspects, vehicles, and loci' },
    ],
    description:
      'Built for police investigators and enterprise security chiefs, ShadowWatch transforms hours of manual footage review into instant queries. Officers can search across days of multi-branch recordings using plain language, trace suspect transit routes on maps, and generate interconnected case graphs.',
    highlights: [
      'Natural language search: find subjects by clothing, vehicle color, or incident type',
      'Cross-camera trajectory tracking reconstructs complete subject journey timelines',
      'Interactive case graph links co-travelers, license plates, and timestamps',
    ],
  },

  // ── HARDWARE BENCHMARKS ──
  {
    id: 'hardware-benchmark-engine',
    category: 'HARDWARE',
    categoryLabel: '// HARDWARE BENCHMARKS',
    title: 'GPU-Accelerated Throughput & Hardware Scaling Benchmarks',
    subtitle: 'Direct hardware specifications and verified camera stream capacities',
    accent: '#c49a3c',
    icon: 'developer_board',
    badge: 'VERIFIED BENCHMARKS',
    specs: [
      { label: 'Edge Standard', value: 'RTX 4060 (8GB): 24–30 streams @ 720p 30 FPS' },
      { label: 'Facility Pro', value: 'RTX 5070 (16GB): 60–75 streams @ 720p 30 FPS' },
      { label: 'Rack Server', value: 'NVIDIA L4 (24GB): 140–180 streams @ 720p 30 FPS' },
      { label: 'Hyperscale DC', value: 'NVIDIA A100 (80GB): 500–650 streams @ 720p 30 FPS' },
    ],
    description:
      'ShadowWatch scales from small single-site edge boxes up to national data centers. By routing stream decoding and tensor pipelines directly through GPU VRAM, physical rack space and electricity costs drop by up to 70% compared to legacy CPU-based video surveillance platforms.',
    highlights: [
      '70% lower power and rack footprint than traditional CPU server deployments',
      'Linear cluster scalability handles deployments from 10 cameras to 12,000+ feeds',
      'Supports mixed-mode operations (pure streaming, AI detection, or hybrid workloads)',
    ],
  },
]

const filteredProperties = computed(() => {
  if (activeTab.value === 'ALL') return propertiesList
  return propertiesList.filter((p) => p.category === activeTab.value)
})

// Hardware Capacity Matrix Table
const hardwareTable = [
  { tier: 'Entry Edge', gpu: 'T400 / GTX 1050', vram: '2 GB', streams480p: '12 – 16', streams720p: '7 – 10', streams1080p: '4 – 6', role: 'Small Facility / Gatehouse' },
  { tier: 'Entry Plus', gpu: 'T600 / GTX 1650', vram: '4 GB', streams480p: '22 – 28', streams720p: '13 – 17', streams1080p: '7 – 10', role: 'Retail Branch / Warehouse' },
  { tier: 'Branch Standard', gpu: 'RTX 4060', vram: '8 GB', streams480p: '42 – 52', streams720p: '24 – 30', streams1080p: '13 – 17', role: 'Enterprise Branch Office' },
  { tier: 'High-Throughput', gpu: 'RTX 3070', vram: '8 GB', streams480p: '50 – 62', streams720p: '28 – 36', streams1080p: '15 – 20', role: 'Regional Hub / Campus' },
  { tier: 'Pro Surveillance', gpu: 'RTX 4070', vram: '12 GB', streams480p: '80 – 100', streams720p: '45 – 58', streams1080p: '24 – 32', role: 'Hospital / University Campus' },
  { tier: 'Next-Gen Edge Server', gpu: 'RTX 5070', vram: '16 GB', streams480p: '120 – 150', streams720p: '60 – 75', streams1080p: '32 – 42', role: 'Airport / Industrial Plant' },
  { tier: 'Enterprise Rack', gpu: 'NVIDIA L4', vram: '24 GB', streams480p: '280 – 350', streams720p: '140 – 180', streams1080p: '75 – 95', role: 'Central Command Center' },
  { tier: 'Data Center AI Engine', gpu: 'NVIDIA L40S', vram: '48 GB', streams480p: '600 – 750', streams720p: '300 – 380', streams1080p: '160 – 200', role: 'Metropolitan Police Grid' },
  { tier: 'Hyperscale Cluster', gpu: 'NVIDIA A100', vram: '80 GB', streams480p: '1000 – 1200', streams720p: '500 – 650', streams1080p: '270 – 340', role: 'National Security Command' },
]

function handleOpenScalability() {
  router.push('/scalability/1')
}

function handleOpenSiteSignIn() {
  showSignInModal.value = true
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0c] text-[#f0f0f4] font-sans antialiased selection:bg-[#750d37] selection:text-white flex flex-col overflow-x-hidden">
    
    <!-- Top Global App Bar -->
    <HeaderNav
      @openDpdpPortal="showDpdpPortalModal = true"
      @openSignIn="handleOpenSiteSignIn"
    />

    <!-- Main Content Area -->
    <main class="flex-1 pt-20 md:pt-24 pb-16">
      
      <!-- HERO & COMPLIANCE EXECUTIVE HEADER -->
      <section class="py-10 md:py-16 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-gradient-to-b from-[#111113] via-[#0a0a0c] to-[#0a0a0c] relative">
        <div class="max-w-7xl mx-auto space-y-6">
          
          <!-- Breadcrumb Navigation & Sovereignty Tag -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div class="flex items-center gap-2 text-[#88888c]">
              <router-link to="/" class="hover:text-white transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">home</span>
                <span>HOME</span>
              </router-link>
              <span>/</span>
              <span class="text-[#750d37] font-bold">SHADOWWATCH PLATFORM</span>
              <span>/</span>
              <span class="text-[#3d8b5e] font-bold">COMPLIANCE &amp; ACCREDITATIONS</span>
            </div>

            <div class="inline-flex items-center gap-2 px-2.5 py-1 bg-[#3d8b5e]/10 border border-[#3d8b5e]/30 text-[#3d8b5e] font-bold tracking-wider uppercase text-[10px]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#3d8b5e] animate-pulse"></span>
              <span>SOVEREIGN SURVEILLANCE &amp; COMPLIANCE GOVERNANCE PLATFORM</span>
            </div>
          </div>

          <!-- Hero Main Title -->
          <div class="max-w-4xl space-y-4">
            <div class="section-tag text-xs font-bold font-mono text-[#750d37]">
              // SOVEREIGN REGULATORY ACCREDITATION &amp; COMPLIANCE PLATFORM
            </div>
            
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
              SHADOWWATCH<br />
              <span style="color: #750d37">COMPLIANCE &amp; ACCREDITATION</span><br />
              <span>SURVEILLANCE PLATFORM</span>
            </h1>

            <p class="text-[#c8c8cc] text-base sm:text-lg leading-relaxed max-w-3xl">
              The sovereign video management system (VMS) built for <strong>statutory accreditation, real-time violation reporting, and continuous physical compliance</strong>. Aggregates up to 12,000+ cameras, validates physical safety codes across <strong>biometric turnstiles, fire panels, and HVAC systems</strong>, and generates tamper-evident legal audit packs—100% on-premises without third-party cloud leaks.
            </p>
          </div>

          <!-- Accredited Frameworks Ribbon Badges -->
          <div class="pt-2">
            <div class="text-[10px] font-mono uppercase tracking-widest text-[#88888c] mb-2 font-bold">
              // RECOGNIZED STATUTORY ACCREDITATIONS &amp; REGULATORY FRAMEWORKS
            </div>
            <div class="flex flex-wrap gap-2 font-mono text-xs">
              <span class="px-2.5 py-1 bg-[#3d8b5e]/10 border border-[#3d8b5e] text-[#3d8b5e] font-bold">
                ✓ DPDP ACT 2023 (DATA RESIDENCY)
              </span>
              <span class="px-2.5 py-1 bg-[#c49a3c]/10 border border-[#c49a3c] text-[#c49a3c] font-bold">
                ✓ STQC / MEITY ESR HARDWARE REGISTER
              </span>
              <span class="px-2.5 py-1 bg-[#750d37]/15 border border-[#750d37] text-white font-bold">
                ✓ BSA SEC 63 DIGITAL EVIDENCE
              </span>
              <span class="px-2.5 py-1 bg-[#4a7ebb]/10 border border-[#4a7ebb] text-[#4a7ebb] font-bold">
                ✓ ISO/IEC 27001 &amp; 27701
              </span>
              <span class="px-2.5 py-1 bg-[#c44a4a]/10 border border-[#c44a4a] text-[#c44a4a] font-bold">
                ✓ NFPA 72/101 &amp; NBC LIFE SAFETY
              </span>
              <span class="px-2.5 py-1 bg-[#9a1a4e]/10 border border-[#9a1a4e] text-[#9a1a4e] font-bold">
                ✓ FACTORIES ACT / OSHA
              </span>
            </div>
          </div>

          <!-- 4 Core Metric Callout Boxes -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pt-2 font-mono">
            <div class="industrial-card p-4 bg-[#111113] border-l-4 border-l-[#3d8b5e] shadow-lg">
              <span class="text-[10px] text-[#88888c] uppercase font-bold block">// COMPLIANCE RESIDENCY</span>
              <div class="text-2xl sm:text-3xl font-black text-white mt-1">100%</div>
              <span class="text-xs text-[#c8c8cc] mt-0.5 block">Air-Gapped Premise Storage</span>
            </div>

            <div class="industrial-card p-4 bg-[#111113] border-l-4 border-l-[#c44a4a] shadow-lg">
              <span class="text-[10px] text-[#88888c] uppercase font-bold block">// REAL-TIME VIOLATION ALERT</span>
              <div class="text-2xl sm:text-3xl font-black text-white mt-1">&lt; 50 ms</div>
              <span class="text-xs text-[#c8c8cc] mt-0.5 block">Detection-to-Report Latency</span>
            </div>

            <div class="industrial-card p-4 bg-[#111113] border-l-4 border-l-[#750d37] shadow-lg">
              <span class="text-[10px] text-[#88888c] uppercase font-bold block">// COURT ADMISSIBILITY</span>
              <div class="text-2xl sm:text-3xl font-black text-white mt-1">SHA-256</div>
              <span class="text-xs text-[#c8c8cc] mt-0.5 block">BSA Sec 63 Sealed Evidence</span>
            </div>

            <div class="industrial-card p-4 bg-[#111113] border-l-4 border-l-[#4a7ebb] shadow-lg">
              <span class="text-[10px] text-[#88888c] uppercase font-bold block">// FACILITY INTERLOCKS</span>
              <div class="text-2xl sm:text-3xl font-black text-white mt-1">3-WAY</div>
              <span class="text-xs text-[#c8c8cc] mt-0.5 block">Biometric · Fire · HVAC Loops</span>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 1: STATUTORY ACCREDITATIONS & REGULATORY MANDATES -->
      <section class="py-12 md:py-20 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-[#0c0c0e]">
        <div class="max-w-7xl mx-auto space-y-10">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div class="space-y-2">
              <div class="section-tag text-xs font-bold font-mono text-[#3d8b5e]">
                // ACCREDITATION &amp; STATUTORY COMPLIANCE ARCHITECTURE
              </div>
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                ACCREDITATIONS &amp; REGULATORY STANDARDS
              </h2>
              <p class="text-[#c8c8cc] text-xs sm:text-sm font-sans max-w-2xl">
                ShadowWatch is purpose-built to eliminate institutional compliance risk, protect personal data rights, and produce indisputable evidence for legal proceedings.
              </p>
            </div>
            
            <div class="text-xs font-mono text-[#88888c] shrink-0">
              // 6 GOVERNED STATUTORY FRAMEWORKS
            </div>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in accreditationsList"
              :key="item.id"
              class="industrial-card p-6 bg-[#111113] border border-[#1e1e20] flex flex-col justify-between space-y-5"
            >
              <div class="space-y-3.5">
                <div class="flex items-center justify-between">
                  <span
                    class="w-10 h-10 border flex items-center justify-center shrink-0"
                    :style="{ backgroundColor: `${item.accent}15`, borderColor: `${item.accent}50` }"
                  >
                    <span class="material-symbols-outlined text-xl" :style="{ color: item.accent }">
                      {{ item.icon }}
                    </span>
                  </span>

                  <span
                    class="text-[10px] font-mono font-bold px-2 py-0.5 border"
                    :style="{ color: item.accent, borderColor: `${item.accent}40`, backgroundColor: `${item.accent}10` }"
                  >
                    {{ item.code }}
                  </span>
                </div>

                <div>
                  <h3 class="text-lg font-black text-white leading-snug">
                    {{ item.title }}
                  </h3>
                  <div class="text-[11px] font-mono text-[#88888c] mt-0.5">
                    {{ item.authority }}
                  </div>
                  <div class="text-[10px] font-mono mt-1 font-bold" :style="{ color: item.accent }">
                    {{ item.statutoryRef }}
                  </div>
                </div>

                <p class="text-[#c8c8cc] text-xs leading-relaxed">
                  {{ item.summary }}
                </p>
              </div>

              <div class="pt-3 border-t border-[#1e1e20] space-y-1.5 font-mono text-[11px]">
                <div
                  v-for="(prov, pIdx) in item.provisions"
                  :key="pIdx"
                  class="flex items-start gap-1.5 text-[#c8c8cc]"
                >
                  <span :style="{ color: item.accent }">✓</span>
                  <span>{{ prov }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 2: REAL-TIME COMPLIANCE VIOLATION DETECTION & LIVE STREAM -->
      <section class="py-12 md:py-20 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-[#0a0a0c]">
        <div class="max-w-7xl mx-auto space-y-10">
          
          <div class="space-y-3 max-w-3xl">
            <div class="section-tag text-xs font-bold font-mono text-[#c44a4a]">
              // ACTIVE TELEMETRY ENGINE &amp; INCIDENT DISPATCH
            </div>
            <h2 class="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">
              REAL-TIME COMPLIANCE VIOLATION DETECTION<br />
              <span style="color: #750d37">&amp; AUTOMATED REPORTING</span>
            </h2>
            <p class="text-[#c8c8cc] text-sm sm:text-base leading-relaxed">
              ShadowWatch evaluates video streams and physical sensor states every millisecond. When a safety code, perimeter rule, or privacy protocol is breached, it raises instant alerts and generates automated compliance dossiers.
            </p>
          </div>

          <!-- Live Violation Telemetry Feed Box -->
          <div class="industrial-card p-6 md:p-8 bg-[#111113] border border-[#1e1e20] shadow-2xl font-mono">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e1e20]">
              <div class="flex items-center gap-2.5">
                <span class="w-3 h-3 rounded-full bg-[#c44a4a] animate-ping"></span>
                <span class="text-xs font-black text-white uppercase tracking-wider">
                  SHADOWWATCH REAL-TIME COMPLIANCE VIOLATION FEED
                </span>
              </div>
              <div class="text-[11px] text-[#3d8b5e] font-bold bg-[#3d8b5e]/10 px-2.5 py-1 border border-[#3d8b5e]/30">
                ACTIVE MONITORING · &lt; 50 MS INFERENCE DISPATCH
              </div>
            </div>

            <!-- Incidents Table / Cards -->
            <div class="divide-y divide-[#1e1e20] pt-2">
              <div
                v-for="viol in realtimeViolations"
                :key="viol.id"
                class="py-4 hover:bg-[#161619] transition-colors px-2 rounded-sm"
              >
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  
                  <!-- Left: Icon, Code & Title -->
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span
                        class="px-2 py-0.5 text-[9px] font-bold border uppercase"
                        :style="{
                          color: viol.severityColor,
                          borderColor: `${viol.severityColor}40`,
                          backgroundColor: `${viol.severityColor}15`
                        }"
                      >
                        {{ viol.severity }} · {{ viol.code }}
                      </span>
                      <span class="text-xs font-bold text-white">{{ viol.title }}</span>
                    </div>

                    <div class="text-[11px] text-[#88888c] flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Locus: <strong class="text-[#c8c8cc]">{{ viol.locus }}</strong></span>
                      <span>•</span>
                      <span>Source: <strong class="text-[#c8c8cc]">{{ viol.camera }}</strong></span>
                      <span>•</span>
                      <span class="text-[#3d8b5e]">Rule: <strong>{{ viol.statutoryRule }}</strong></span>
                    </div>
                  </div>

                  <!-- Right: Timestamp & Automated Reporting Action -->
                  <div class="lg:text-right space-y-1 shrink-0">
                    <div class="text-xs font-bold text-[#f0f0f4]">
                      {{ viol.timestamp }}
                    </div>
                    <div class="text-[10px] text-[#c49a3c]">
                      ⚡ {{ viol.automatedAction }}
                    </div>
                    <div class="text-[10px] text-[#88888c]">
                      📁 {{ viol.reportStatus }}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Footer Ticker Note -->
            <div class="pt-4 border-t border-[#1e1e20] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#88888c]">
              <div>All violation occurrences are cryptographically signed with microsecond hardware timestamps.</div>
              <div class="text-[#3d8b5e] font-bold">100% On-Premise Audit Ledger · Tamper-Evident Storage</div>
            </div>
          </div>

          <!-- MULTI-TIER AUTOMATED COMPLIANCE REPORTING PACKS -->
          <div class="space-y-6 pt-4">
            <div>
              <div class="section-tag text-xs font-bold font-mono text-[#3d8b5e]">// REPORTING ARCHITECTURE</div>
              <h3 class="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                AUTOMATED MULTI-TIER REPORTING CADENCE
              </h3>
              <p class="text-[#c8c8cc] text-xs sm:text-sm font-sans max-w-2xl mt-1">
                ShadowWatch automatically formats raw incident data into actionable, role-tailored compliance packs for field officers, executive leadership, and judicial courts.
              </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div
                v-for="rep in reportingTiers"
                :key="rep.tier"
                class="industrial-card p-5 bg-[#111113] border-t-4 flex flex-col justify-between space-y-4 shadow-lg"
                :style="{ borderTopColor: rep.accent }"
              >
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold px-2 py-0.5 border" :style="{ color: rep.accent, borderColor: `${rep.accent}50`, backgroundColor: `${rep.accent}15` }">
                      {{ rep.tier }}
                    </span>
                    <span class="material-symbols-outlined text-lg" :style="{ color: rep.accent }">
                      {{ rep.icon }}
                    </span>
                  </div>

                  <div>
                    <h4 class="text-sm font-black text-white leading-tight">
                      {{ rep.title }}
                    </h4>
                    <div class="text-[10px] text-[#88888c] mt-0.5">
                      Cadence: <span class="text-white font-bold">{{ rep.cadence }}</span>
                    </div>
                  </div>

                  <p class="text-[#c8c8cc] text-[11px] leading-relaxed font-sans">
                    {{ rep.description }}
                  </p>
                </div>

                <div class="pt-2 border-t border-[#1e1e20] space-y-1 text-[10px]">
                  <div class="text-[#88888c] font-bold uppercase">// OUTPUT DELIVERABLES:</div>
                  <div v-for="(out, oIdx) in rep.outputs" :key="oIdx" class="text-[#c8c8cc] flex items-start gap-1">
                    <span :style="{ color: rep.accent }">▸</span>
                    <span>{{ out }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 3: DEEP-DIVE PHYSICAL FACILITY INTEGRATIONS (BIOMETRIC, FIRE ALARM, HVAC) -->
      <section class="py-12 md:py-20 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-[#111113]">
        <div class="max-w-7xl mx-auto space-y-10">
          
          <div class="space-y-3 max-w-3xl">
            <div class="section-tag text-xs font-bold font-mono text-[#c49a3c]">
              // PHYSICAL &amp; BUILDING AUTOMATION INTERFACE
            </div>
            <h2 class="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">
              HARDWARE-LEVEL INTEGRATIONS:<br />
              <span style="color: #750d37">BIOMETRICS, FIRE ALARMS &amp; HVAC</span>
            </h2>
            <p class="text-[#c8c8cc] text-sm sm:text-base leading-relaxed">
              ShadowWatch links video streams directly with physical building equipment to automate emergency response and eliminate facility operational blindspots.
            </p>
          </div>

          <div class="grid lg:grid-cols-3 gap-6">
            
            <!-- BIOMETRICS -->
            <div class="industrial-card p-6 bg-[#0a0a0c] border border-[#1e1e20] flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="w-11 h-11 bg-[#3d8b5e]/20 border border-[#3d8b5e] flex items-center justify-center text-[#3d8b5e]">
                    <span class="material-symbols-outlined text-2xl">fingerprint</span>
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 bg-[#3d8b5e]/15 border border-[#3d8b5e] text-[#3d8b5e] font-bold">
                    WIEGAND · OSDP · TCP/IP
                  </span>
                </div>

                <div>
                  <div class="text-xs font-mono text-[#3d8b5e] font-bold uppercase">PHYSICAL ACCESS CONTROL</div>
                  <h3 class="text-xl font-black text-white mt-1">Biometric Readers &amp; Turnstiles</h3>
                </div>

                <p class="text-[#c8c8cc] text-xs sm:text-sm leading-relaxed">
                  Bridges fingerprint scanners, biometric turnstiles, and smart locks with overhead surveillance feeds to execute <strong>instant two-factor cross-verification</strong>.
                </p>

                <div class="space-y-2 pt-2 border-t border-[#1e1e20] font-mono text-xs">
                  <div class="flex items-start gap-2">
                    <span class="text-[#3d8b5e] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Tailgate Prevention:</strong> Compares biometric badge event with camera pose to detect trailing intruders.</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#3d8b5e] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Proxy Clock-in Stop:</strong> Flags mismatched facial vectors during fingerprint check-ins.</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#3d8b5e] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Automated HRMS Audit:</strong> Streams real-time muster roll logs into payroll systems.</span>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-[#111113] border border-[#26262a] text-[11px] font-mono text-[#88888c]">
                Decision Latency: <span class="text-white font-bold">&lt; 120 ms</span> · Door Release Relay
              </div>
            </div>

            <!-- FIRE ALARM -->
            <div class="industrial-card p-6 bg-[#0a0a0c] border border-[#1e1e20] flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="w-11 h-11 bg-[#c44a4a]/20 border border-[#c44a4a] flex items-center justify-center text-[#c44a4a]">
                    <span class="material-symbols-outlined text-2xl">local_fire_department</span>
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 bg-[#c44a4a]/15 border border-[#c44a4a] text-[#c44a4a] font-bold">
                    BACNET · DRY CONTACT · NFPA
                  </span>
                </div>

                <div>
                  <div class="text-xs font-mono text-[#c44a4a] font-bold uppercase">LIFE SAFETY AUTOMATION</div>
                  <h3 class="text-xl font-black text-white mt-1">Fire Panels &amp; Smoke Loops</h3>
                </div>

                <p class="text-[#c8c8cc] text-xs sm:text-sm leading-relaxed">
                  Interlinks addressable Fire Alarm Control Panels (FACP) and smoke detectors directly with live camera matrix switching.
                </p>

                <div class="space-y-2 pt-2 border-t border-[#1e1e20] font-mono text-xs">
                  <div class="flex items-start gap-2">
                    <span class="text-[#c44a4a] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Visual Verification:</strong> Alarm trigger immediately pops fire-zone camera feeds onto central video walls.</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#c44a4a] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Egress Route Monitoring:</strong> Monitors evacuation stairwells in real time for stampedes or blockages.</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#c44a4a] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Fail-Safe Door Release:</strong> Signals magnetic doors on evacuation paths to fail open instantly.</span>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-[#111113] border border-[#26262a] text-[11px] font-mono text-[#88888c]">
                Alert Switching: <span class="text-white font-bold">&lt; 50 ms</span> · Automated Egress Corridor Audit
              </div>
            </div>

            <!-- HVAC -->
            <div class="industrial-card p-6 bg-[#0a0a0c] border border-[#1e1e20] flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="w-11 h-11 bg-[#4a7ebb]/20 border border-[#4a7ebb] flex items-center justify-center text-[#4a7ebb]">
                    <span class="material-symbols-outlined text-2xl">hvac</span>
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 bg-[#4a7ebb]/15 border border-[#4a7ebb] text-[#4a7ebb] font-bold">
                    BACNET IP · MODBUS · MQTT
                  </span>
                </div>

                <div>
                  <div class="text-xs font-mono text-[#4a7ebb] font-bold uppercase">BUILDING MANAGEMENT SYSTEM</div>
                  <h3 class="text-xl font-black text-white mt-1">HVAC &amp; Damper Automation</h3>
                </div>

                <p class="text-[#c8c8cc] text-xs sm:text-sm leading-relaxed">
                  Controls commercial air handling units (AHUs), variable air volume (VAV) dampers, and chillers for safety containment and energy optimization.
                </p>

                <div class="space-y-2 pt-2 border-t border-[#1e1e20] font-mono text-xs">
                  <div class="flex items-start gap-2">
                    <span class="text-[#4a7ebb] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Emergency Smoke Containment:</strong> Shuts down AHU fans and seals fire dampers in fire zones to prevent toxic spread.</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#4a7ebb] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Breach Pressure Seal:</strong> Maintains negative air pressure in contaminated or quarantined sectors.</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[#4a7ebb] font-bold">▸</span>
                    <span class="text-[#e8e8ea]"><strong>Occupancy Climate Modulation:</strong> Cuts cooling in empty rooms, slashing facility energy costs by 20–35%.</span>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-[#111113] border border-[#26262a] text-[11px] font-mono text-[#88888c]">
                Energy Savings: <span class="text-white font-bold">20% – 35%</span> · Automatic Smoke Damper Cutoff
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- SECTION 4: INTERACTIVE PROPERTY SPECIFICATION CATALOG -->
      <section class="py-12 md:py-20 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-[#0a0a0c]">
        <div class="max-w-7xl mx-auto space-y-8">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div class="section-tag text-xs font-bold font-mono text-[#750d37]">// COMPREHENSIVE SPECIFICATION MATRIX</div>
              <h2 class="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
                SHADOWWATCH PROPERTIES &amp; CAPABILITIES
              </h2>
            </div>
            
            <!-- Category Tabs (Defaults to COMPLIANCE) -->
            <div class="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <button
                @click="activeTab = 'COMPLIANCE'"
                class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
                :class="activeTab === 'COMPLIANCE' ? 'bg-[#750d37] border-[#750d37] text-white shadow' : 'bg-[#111113] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
              >
                // Compliance &amp; Accreditations
              </button>
              <button
                @click="activeTab = 'INTEGRATIONS'"
                class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
                :class="activeTab === 'INTEGRATIONS' ? 'bg-[#750d37] border-[#750d37] text-white shadow' : 'bg-[#111113] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
              >
                Facility Loops
              </button>
              <button
                @click="activeTab = 'PROTOCOLS'"
                class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
                :class="activeTab === 'PROTOCOLS' ? 'bg-[#750d37] border-[#750d37] text-white shadow' : 'bg-[#111113] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
              >
                Protocols &amp; Scale
              </button>
              <button
                @click="activeTab = 'CONSOLE'"
                class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
                :class="activeTab === 'CONSOLE' ? 'bg-[#750d37] border-[#750d37] text-white shadow' : 'bg-[#111113] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
              >
                VMS Console
              </button>
              <button
                @click="activeTab = 'HARDWARE'"
                class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
                :class="activeTab === 'HARDWARE' ? 'bg-[#750d37] border-[#750d37] text-white shadow' : 'bg-[#111113] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
              >
                Hardware
              </button>
              <button
                @click="activeTab = 'ALL'"
                class="px-3 py-1.5 border transition-all uppercase font-bold cursor-pointer"
                :class="activeTab === 'ALL' ? 'bg-[#750d37] border-[#750d37] text-white shadow' : 'bg-[#111113] border-[#1e1e20] text-[#c8c8cc] hover:text-white'"
              >
                All ({{ propertiesList.length }})
              </button>
            </div>
          </div>

          <!-- Property Cards Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="prop in filteredProperties"
              :key="prop.id"
              class="industrial-card p-6 bg-[#111113] border border-[#1e1e20] flex flex-col justify-between space-y-5"
            >
              <div class="space-y-4">
                <!-- Header with Icon & Category Badge -->
                <div class="flex items-center justify-between">
                  <span
                    class="w-10 h-10 border flex items-center justify-center shrink-0"
                    :style="{ backgroundColor: `${prop.accent}15`, borderColor: `${prop.accent}50` }"
                  >
                    <span class="material-symbols-outlined text-xl" :style="{ color: prop.accent }">
                      {{ prop.icon }}
                    </span>
                  </span>

                  <span
                    class="text-[9px] font-mono font-bold px-2 py-0.5 border"
                    :style="{ color: prop.accent, borderColor: `${prop.accent}40`, backgroundColor: `${prop.accent}10` }"
                  >
                    {{ prop.badge }}
                  </span>
                </div>

                <div>
                  <div class="text-[10px] font-mono text-[#88888c] font-bold uppercase tracking-wider">
                    {{ prop.categoryLabel }}
                  </div>
                  <h3 class="text-lg font-black text-white mt-1 leading-snug">
                    {{ prop.title }}
                  </h3>
                  <div class="text-xs text-[#88888c] mt-0.5 font-mono">
                    {{ prop.subtitle }}
                  </div>
                </div>

                <p class="text-[#c8c8cc] text-xs leading-relaxed">
                  {{ prop.description }}
                </p>

                <!-- Spec Table -->
                <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-1.5 font-mono text-[11px]">
                  <div
                    v-for="(spec, sIdx) in prop.specs"
                    :key="sIdx"
                    class="flex items-start justify-between gap-2 border-b border-[#161619] last:border-b-0 pb-1 last:pb-0"
                  >
                    <span class="text-[#88888c] shrink-0">{{ spec.label }}:</span>
                    <span class="text-[#f0f0f4] font-bold text-right truncate">{{ spec.value }}</span>
                  </div>
                </div>
              </div>

              <!-- Highlights list -->
              <div class="pt-3 border-t border-[#1e1e20] space-y-1.5 font-mono text-[11px]">
                <div
                  v-for="(hl, hIdx) in prop.highlights"
                  :key="hIdx"
                  class="flex items-start gap-1.5 text-[#c8c8cc]"
                >
                  <span :style="{ color: prop.accent }">▪</span>
                  <span>{{ hl }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 5: HARDWARE CAPACITY BENCHMARK SPECIFICATION TABLE -->
      <section class="py-12 md:py-20 px-4 md:px-12 lg:px-20 border-b border-[#1e1e20] bg-[#111113]">
        <div class="max-w-7xl mx-auto space-y-8 font-mono">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div class="section-tag text-xs font-bold text-[#3d8b5e]">// HARDWARE SCALE MATRIX</div>
              <h2 class="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
                VERIFIED GPU THROUGHPUT BENCHMARKS
              </h2>
              <p class="text-[#c8c8cc] text-xs sm:text-sm mt-1 max-w-2xl font-sans">
                Tested stream counts per card at 70% sustained operational load. GPU tensor acceleration cuts rack footprint and electricity by 70%.
              </p>
            </div>

            <router-link
              to="/#shadowwatch"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#750d37] hover:bg-[#8f1244] text-white text-xs font-bold uppercase transition-all shadow-md active:scale-95 shrink-0"
            >
              <span class="material-symbols-outlined text-sm">tune</span>
              <span>OPEN INTERACTIVE SIMULATOR</span>
            </router-link>
          </div>

          <!-- Benchmark Table -->
          <div class="industrial-card bg-[#0a0a0c] border border-[#1e1e20] overflow-x-auto shadow-2xl">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[#161619] border-b border-[#26262a] text-[#88888c] uppercase text-[10px]">
                  <th class="p-3.5 font-bold">Deployment Tier</th>
                  <th class="p-3.5 font-bold">GPU Hardware</th>
                  <th class="p-3.5 font-bold">VRAM</th>
                  <th class="p-3.5 font-bold text-center">480p Streams</th>
                  <th class="p-3.5 font-bold text-center text-white">720p HD Streams</th>
                  <th class="p-3.5 font-bold text-center">1080p FHD Streams</th>
                  <th class="p-3.5 font-bold">Target Operational Site</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1e20] text-[#c8c8cc]">
                <tr
                  v-for="(row, idx) in hardwareTable"
                  :key="idx"
                  class="hover:bg-[#111113] transition-colors"
                  :class="idx === 2 ? 'bg-[#750d37]/5' : ''"
                >
                  <td class="p-3.5 font-bold text-white whitespace-nowrap">{{ row.tier }}</td>
                  <td class="p-3.5 text-[#e8e8ea] font-mono whitespace-nowrap">{{ row.gpu }}</td>
                  <td class="p-3.5 text-[#3d8b5e] font-bold">{{ row.vram }}</td>
                  <td class="p-3.5 text-center text-[#88888c]">{{ row.streams480p }}</td>
                  <td class="p-3.5 text-center font-bold text-white bg-[#750d37]/10 border-x border-[#750d37]/20">{{ row.streams720p }}</td>
                  <td class="p-3.5 text-center text-[#88888c]">{{ row.streams1080p }}</td>
                  <td class="p-3.5 text-xs text-[#a0a0a4] font-sans">{{ row.role }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-[#88888c] pt-2">
            <div>* Inference benchmarks configured with ROI-triggered detection, NVDEC hardware decoders, and CuPy shared GPU memory.</div>
            <div class="text-[#3d8b5e] font-bold">Zero Proprietary Camera Lock-in · Universal ONVIF/RTSP</div>
          </div>

        </div>
      </section>

      <!-- SECTION 6: ENTERPRISE COMPLIANCE & DEPLOYMENT INQUIRY FORM -->
      <section class="py-12 md:py-20 px-4 md:px-12 lg:px-20 bg-[#0a0a0c]">
        <div class="max-w-4xl mx-auto space-y-8 font-mono">
          
          <div class="text-center space-y-3">
            <div class="section-tag text-xs font-bold text-[#750d37]">// FACILITY COMPLIANCE DISPATCH</div>
            <h2 class="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              REQUEST COMPLIANCE ARCHITECTURE AUDIT
            </h2>
            <p class="text-[#c8c8cc] text-sm font-sans max-w-xl mx-auto">
              Provide your existing camera fleet and compliance mandates (DPDP, STQC, BSA Sec 63, Fire/HVAC). Our sovereign deployment engineers will structure an air-gapped compliance architecture.
            </p>
          </div>

          <!-- Inquiry Card Form -->
          <div class="industrial-card p-6 md:p-8 bg-[#111113] border border-[#1e1e20] shadow-2xl">
            <div v-if="formSubmitted" class="p-6 bg-[#3d8b5e]/10 border border-[#3d8b5e] text-center space-y-3">
              <span class="material-symbols-outlined text-4xl text-[#3d8b5e]">verified</span>
              <h3 class="text-xl font-black text-white">DISPATCH PARAMETERS LOGGED</h3>
              <p class="text-xs text-[#c8c8cc] font-sans max-w-md mx-auto">
                Thank you, <strong>{{ formName }}</strong>. Your facility requirements have been queued into the local dispatch pipeline. An engineering architect will contact <strong>{{ formEmail }}</strong> within 4 business hours.
              </p>
              <button
                @click="resetForm"
                class="mt-4 px-4 py-2 bg-[#1e1e22] hover:bg-[#26262a] text-white text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Submit Another Specification
              </button>
            </div>

            <form v-else @submit.prevent="submitInquiry" class="space-y-5">
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label for="input-name" class="text-xs font-bold text-white uppercase block">
                    Contact Name <span class="text-[#c44a4a]">*</span>
                  </label>
                  <input
                    id="input-name"
                    v-model="formName"
                    type="text"
                    placeholder="e.g. Col. Rajesh Sharma / Chief Security Officer"
                    class="industrial-input text-xs py-2.5 px-3 w-full"
                    :class="{ '!border-[#c44a4a]': formErrors.name }"
                  />
                  <span v-if="formErrors.name" class="text-[10px] text-[#c44a4a] font-bold block">{{ formErrors.name }}</span>
                </div>

                <div class="space-y-1.5">
                  <label for="input-email" class="text-xs font-bold text-white uppercase block">
                    Enterprise / Agency Work Email <span class="text-[#c44a4a]">*</span>
                  </label>
                  <input
                    id="input-email"
                    v-model="formEmail"
                    type="email"
                    placeholder="officer@organization.gov.in"
                    class="industrial-input text-xs py-2.5 px-3 w-full"
                    :class="{ '!border-[#c44a4a]': formErrors.email }"
                  />
                  <span v-if="formErrors.email" class="text-[10px] text-[#c44a4a] font-bold block">{{ formErrors.email }}</span>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label for="input-phone" class="text-xs font-bold text-white uppercase block">
                    Mobile / Contact Number
                  </label>
                  <input
                    id="input-phone"
                    v-model="formPhone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    class="industrial-input text-xs py-2.5 px-3 w-full"
                    :class="{ '!border-[#c44a4a]': formErrors.phone }"
                  />
                  <span v-if="formErrors.phone" class="text-[10px] text-[#c44a4a] font-bold block">{{ formErrors.phone }}</span>
                </div>

                <div class="space-y-1.5">
                  <label for="input-cams" class="text-xs font-bold text-white uppercase block">
                    Existing Camera Fleet Size
                  </label>
                  <select
                    id="input-cams"
                    v-model="formCams"
                    class="industrial-input text-xs py-2.5 px-3 w-full cursor-pointer"
                  >
                    <option value="50">Up to 50 Cameras (Edge Single-Site)</option>
                    <option value="250">50 – 250 Cameras (Branch Hub)</option>
                    <option value="500">250 – 1,000 Cameras (Multi-Facility)</option>
                    <option value="3000">1,000 – 5,000 Cameras (Campus / District Grid)</option>
                    <option value="12000">5,000 – 12,000+ Cameras (National / Enterprise)</option>
                  </select>
                </div>
              </div>

              <div class="space-y-1.5">
                <label for="input-msg" class="text-xs font-bold text-white uppercase block">
                  Mandates &amp; Integrations (DPDP Act, STQC, BSA Sec 63, Biometrics, Fire, HVAC)
                </label>
                <textarea
                  id="input-msg"
                  v-model="formMessage"
                  rows="3"
                  placeholder="Detail statutory compliance mandates, existing biometric hardware, fire panels, or BMS controllers..."
                  class="industrial-input text-xs py-2.5 px-3 w-full resize-none font-sans"
                ></textarea>
              </div>

              <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-[11px] text-[#88888c]">
                  🔒 100% Confidential. All data handled under DPDP Act sovereign data residency principles.
                </div>

                <button
                  type="submit"
                  class="industrial-btn industrial-btn-primary px-6 py-3 text-xs font-bold tracking-wider uppercase cursor-pointer w-full sm:w-auto shadow-lg"
                >
                  DISPATCH AUDIT REQUEST →
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

    </main>

    <!-- Sticky Contact Bar -->
    <ContactBar />

    <!-- Global Footer -->
    <FooterSection
      @openPrivacy="showPrivacyModal = true"
      @openTerms="showTermsModal = true"
      @openDpdpPortal="showDpdpPortalModal = true"
      @openScalability="handleOpenScalability"
    />

    <!-- Global Modals -->
    <GoogleSignInModal
      v-if="showSignInModal"
      @close="showSignInModal = false"
    />

    <PrivacyPolicyModal
      v-if="showPrivacyModal"
      @close="showPrivacyModal = false"
    />

    <TermsModal
      v-if="showTermsModal"
      @close="showTermsModal = false"
    />

    <DpdpPortalModal
      v-if="showDpdpPortalModal"
      @close="showDpdpPortalModal = false"
    />

    <ScalabilityModal
      v-if="showScalabilityModal"
      :initialSlide="activeScalabilitySlide"
      @close="showScalabilityModal = false"
    />

    <IndustrialToast />

  </div>
</template>
