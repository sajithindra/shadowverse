<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['close', 'openDpdpPortal'])

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

const selectedPrivacyLang = ref<string>('en')

const privacyLanguages = [
  { code: 'en', name: 'English (English)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
]

interface PrivacyTextContent {
  title: string
  subtitle: string
  preamble: string
  p1Header: string
  p1Text: string
  p2Header: string
  p2Text: string
  p3Header: string
  p3Text: string
  p4Header: string
  p4Text: string
  p5Header: string
  p5Text: string
  p6Header: string
  p6Text: string
  dpoName: string
  dpoEmail: string
  dpoDesignation: string
}

const privacyTexts: Record<string, PrivacyTextContent> = {
  en: {
    title: 'STATUTORY SOVEREIGN PRIVACY POLICY',
    subtitle: 'ENFORCEABLE UNDER DIGITAL PERSONAL DATA PROTECTION ACT, 2023 (ACT NO. 22 OF 2023, INDIA)',
    preamble: 'This Privacy Policy is a legally binding instrument governing the processing of personal data by ShadowVerse Private Cloud systems in strict adherence to Section 4, 5, 6, 7, 8, 10, 11, 12, and 13 of the Digital Personal Data Protection (DPDP) Act, 2023 (India) and Section 43A of the Information Technology Act, 2000.',
    p1Header: 'ARTICLE I — DATA FIDUCIARY STATUS & LAWFUL PROCESSING (SECTIONS 4 & 5)',
    p1Text: 'ShadowVerse operates exclusively as an on-premise Data Fiduciary. Video feeds, facial vector hashes, posture telemetry, and access logs are collected strictly pursuant to explicit consent or legitimate use for perimeter security, elder safety monitoring, and authorized access verification.',
    p2Header: 'ARTICLE II — PURPOSE LIMITATION & ZERO EXTERNAL EXPOSURE (SECTIONS 6 & 7)',
    p2Text: 'In compliance with DPDP Act Section 6 & 7, data processing is strictly confined to security functions. No personal data, raw video feed, or facial biometric embedding shall be transferred to third parties, monetized, or transmitted across public networks.',
    p3Header: 'ARTICLE III — TECHNICAL & SECURITY SAFEGUARDS (SECTION 8(5))',
    p3Text: '100% on-premise infrastructure hosted on Ubuntu Enterprise and Ceph distributed storage. All telemetry, audit logs, and RTSP streams are encrypted with AES-256 at rest and TLS 1.3 in transit. Zero byte of personal data escapes your private cloud boundary.',
    p4Header: 'ARTICLE IV — MANDATORY DATA RETENTION & CRYPTOGRAPHIC ERASURE (SECTION 8(7))',
    p4Text: 'Pursuant to DPDP Act Section 8(7), video records and audit logs are retained strictly for the duration specified by the System Commander (30, 60, or 90 days). Upon expiry, data undergoes automated immutable cryptographic erasure.',
    p5Header: 'ARTICLE V — ENFORCEABLE RIGHTS OF DATA PRINCIPALS (SECTIONS 11, 12 & 13)',
    p5Text: 'Data Principals possess enforceable statutory rights to: (i) obtain a summary of processed personal data, (ii) seek correction or complete erasure of inaccurate personal data, (iii) seek grievance redressal, and (iv) nominate another individual in the event of death or incapacity.',
    p6Header: 'ARTICLE VI — STATUTORY DESIGNATION OF DATA PROTECTION OFFICER (SECTION 10)',
    p6Text: 'In accordance with DPDP Act Section 10, ShadowVerse has designated a Data Protection Officer (DPO) to manage data principal requests and legal compliance.',
    dpoName: 'Arun Prakash Pillai',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'Data Protection Officer & Chief Operating Officer (COO)',
  },
  hi: {
    title: 'वैधानिक संप्रभु गोपनीयता नीति',
    subtitle: 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (भारत) के तहत वैधानिक रूप से लागू',
    preamble: 'यह गोपनीयता नीति डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम, 2023 (भारत) की धारा 4, 5, 6, 7, 8, 10, 11, 12 और 13 के तहत एक कानूनी रूप से बाध्यकारी दस्तावेज है।',
    p1Header: 'अनुच्छेद I — डेटा फिडुशरी स्थिति एवं वैध प्रोसेसिंग (धारा 4 एवं 5)',
    p1Text: 'शैडोवर्स केवल ऑन-प्रेमिस डेटा फिडुशरी के रूप में कार्य करता है। सभी वीडियो फीड, चेहरे के वेक्टर और टेलीमेट्री केवल परिसर सुरक्षा और बुजुर्ग देखभाल के लिए एकत्र किए जाते हैं।',
    p2Header: 'अनुच्छेद II — उद्देश्य सीमा एवं शून्य बाहरी रिसाव (धारा 6 एवं 7)',
    p2Text: 'डेटा प्रोसेसिंग केवल सुरक्षा कार्यों तक सीमित है। कोई भी डेटा तीसरे पक्ष को हस्तांतरित नहीं किया जाता है और न ही बाहरी क्लाउड पर भेजा जाता है।',
    p3Header: 'अनुच्छेद III — तकनीकी एवं सुरक्षा उपाय (धारा 8(5))',
    p3Text: '100% ऑन-प्रेमिस ढांचा। सेफ (Ceph) क्लस्टर पर सभी लॉग AES-256 एन्क्रिप्शन के साथ सुरक्षित रहते हैं।',
    p4Header: 'अनुच्छेद IV — डेटा प्रतिधारण एवं विलोपन (धारा 8(7))',
    p4Text: 'डीपीडीपी अधिनियम की धारा 8(7) के अनुसार, निर्धारित समय सीमा (30/60/90 दिन) समाप्त होने पर वीडियो और लॉग स्वचालित रूप से पूरी तरह नष्ट कर दिए जाते हैं।',
    p5Header: 'अनुच्छेद V — डेटा प्रिंसिपल के वैधानिक अधिकार (धारा 11, 12 एवं 13)',
    p5Text: 'डेटा प्रिंसिपलों को अपने संसाधित डेटा की जानकारी प्राप्त करने, सुधार करने, हटाने और नामांकित व्यक्ति नियुक्त करने का कानूनी अधिकार है।',
    p6Header: 'अनुच्छेद VI — डेटा संरक्षण अधिकारी (DPO) का वैधानिक पद (धारा 10)',
    p6Text: 'डीपीडीपी अधिनियम की धारा 10 के अनुसार, डेटा संरक्षण अधिकारी (DPO) को वैधानिक रूप से नियुक्त किया गया है।',
    dpoName: 'अरुण कुमार पिल्लई (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'डेटा संरक्षण अधिकारी एवं मुख्य परिचालन अधिकारी (COO)',
  },
  ta: {
    title: 'சட்டரீதியான தனிப்பரிசீலனை கொள்கை',
    subtitle: 'இந்திய டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்டம் 2023 இன் கீழ் சட்டபூர்வமாக அமல்படுத்தத்தக்கது',
    preamble: 'இக்கொள்கை DPDP சட்டம் 2023 விதிகள் 4, 5, 6, 7, 8, 10, 11, 12, மற்றும் 13 இன் கீழ் சட்டபூர்வமாக கட்டுப்படுத்தக்கூடிய ஆவணமாகும்.',
    p1Header: 'பிரிவு I — தரவு அறங்காவலர் அறிவிப்பு (பிரிவுகள் 4 & 5)',
    p1Text: 'அனைத்து வீடியோ ஊட்டங்களும் வளாக பாதுகாப்பு மற்றும் முதியோர் பாதுகாப்பிற்காக மட்டுமே பயன்படுத்தப்படுகின்றன.',
    p2Header: 'பிரிவு II — நோக்கம் மற்றும் தரவு குறைப்பு (பிரிவுகள் 6 & 7)',
    p2Text: 'எந்தவொரு தனிப்பட்ட தரவும் வெளிநபர்களுக்கு பகிரப்படாது அல்லது வெளி மேகக்கணிக்கு அனுப்பப்படாது.',
    p3Header: 'பிரிவு III — தொழில்நுட்ப பாதுகாப்பு (பிரிவு 8(5))',
    p3Text: 'அனைத்து தரவுகளும் AES-256 குறியாக்கத்துடன் உங்கள் உள்ளூர் சேமிப்பகத்தில் பாதுகாப்பாக இருக்கும்.',
    p4Header: 'பிரிவு IV — தரவு தக்கவைப்பு மற்றும் அழித்தல் (பிரிவு 8(7))',
    p4Text: 'குறிப்பிட்ட காலக்கெடு முடிவடைந்ததும் வீடியோ பதிவுகள் தானாகவே நிரந்தரமாக அழிக்கப்படும்.',
    p5Header: 'பிரிவு V — தனிநபர் உரிமைகள் (பிரிவுகள் 11, 12 & 13)',
    p5Text: 'தனிநபர்கள் தங்கள் தரவை பார்வையிடவும், திருத்தவும், அழிக்கவும் உரிமை பெற்றுள்ளனர்.',
    p6Header: 'பிரிவு VI — தரவு பாதுகாப்பு அதிகாரி நியமனம் (பிரிவு 10)',
    p6Text: 'சட்டப்பிரிவு 10 இன் படி நியமிக்கப்பட்ட தரவு பாதுகாப்பு அதிகாரி விபரம்:',
    dpoName: 'அருண் குமார் பிள்ளை (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'தரவு பாதுகாப்பு அதிகாரி & முதன்மை செயல் அதிகாரி (COO)',
  },
  te: {
    title: 'శాసనబద్ధ స్వయంప్రతిపత్తి గోప్యతా విధానం',
    subtitle: 'డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం 2023 (భారతదేశం) నిబంధనల ప్రకారం చట్టబద్ధంగా అమలు చేయదగినది',
    preamble: 'ఈ విధానం DPDP చట్టం 2023 యొక్క సెక్షన్ 4, 5, 6, 7, 8, 10, 11, 12, మరియు 13 ప్రకారం చట్టబద్ధమైన పత్రం.',
    p1Header: 'ఆర్టికల్ I — డేటా ఫిడ్యూషియరీ నోటీసు (సెక్షన్ 4 & 5)',
    p1Text: 'వీడియో స్ట్రీమ్‌లు కేవలం ప్రాంగణ భద్రత మరియు వృద్ధుల సంరక్షణ కోసం మాత్రమే సేకరించబడతాయి.',
    p2Header: 'ఆర్టికల్ II — డేటా పరిమితి & భద్రత (సెక్షన్ 6 & 7)',
    p2Text: 'ఏ ఒక్క డేటా బైట్ కూడా మూడవ పక్షాలకు లేదా బాహ్య క్లౌడ్ సర్వర్లకు పంపబడదు.',
    p3Header: 'ఆర్టికల్ III — సాంకేతిక రక్షణ చర్యలు (సెక్షన్ 8(5))',
    p3Text: 'స్థానిక సేఫ్ (Ceph) క్లస్టర్‌లో AES-256 ఎన్‌క్రిప్షన్‌తో రక్షణ కల్పించబడుతుంది.',
    p4Header: 'ఆర్టికల్ IV — డేటా నిల్వ & తొలగింపు (సెక్షన్ 8(7))',
    p4Text: 'నిర్ణీత కాలపరిమితి ముగిసిన వెంటనే రికార్డులు స్వయంచాలకంగా శాశ్వతంగా తొలగించబడతాయి.',
    p5Header: 'ఆర్టికల్ V — డేటా ప్రిన్సిపల్ హక్కులు (సెక్షన్ 11, 12 & 13)',
    p5Text: 'మీ డేటాను సమీక్షించడానికి, సరిచేయడానికి మరియు తొలగించమని కోరే చట్టబద్ధమైన హక్కు మీకు ఉంది.',
    p6Header: 'ఆర్టికల్ VI — డేటా ప్రొటెక్షన్ ఆఫీసర్ నియమకం (సెక్షన్ 10)',
    p6Text: 'సెక్షన్ 10 ప్రకారం నియమించబడిన డేటా ప్రొటెక్షన్ ఆఫీసర్ వివరాలు:',
    dpoName: 'అరుణ్ కుమార్ పిళ్లై (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'డేటా ప్రొటెక్షన్ ఆఫీసర్ & చీఫ్ ఆపరేటింగ్ ఆఫీసర్ (COO)',
  },
  kn: {
    title: 'ಶಾಸನಬದ್ಧ ಸಾರ್ವಭೌಮ ಗೌಪ್ಯತಾ ನೀತಿ',
    subtitle: 'ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ರಕ್ಷಣೆ ಕಾಯಿದೆ 2023 (ಭಾರತ) ರ ಅಡಿಯಲ್ಲಿ ಕಾನೂನುಬದ್ಧವಾಗಿ ಜಾರಿಗೊಳಿಸಬಹುದಾದ ನೀತಿ',
    preamble: 'ಈ ಗೌಪ್ಯತಾ ನೀತಿಯು DPDP ಕಾಯಿದೆ 2023 ರ ವಿಭಾಗ 4, 5, 6, 7, 8, 10, 11, 12, ಮತ್ತು 13 ರ ಅಡಿಯಲ್ಲಿ ಕಾನೂನುಬದ್ಧ ದಾಖಲೆಯಾಗಿದೆ.',
    p1Header: 'ಲೇಖನ I — ಡೇಟಾ ಫಿಡ್ಯೂಷಿಯರಿ ಸೂಚನೆ (ವಿಭಾಗ 4 ಮತ್ತು 5)',
    p1Text: 'ಎಲ್ಲಾ ವೀಡಿಯೊ ಫೀಡ್‌ಗಳನ್ನು ಆಸ್ತಿ ಭದ್ರತೆ ಮತ್ತು ಹಿರಿಯರ ಸುರಕ್ಷತೆಗಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ.',
    p2Header: 'ಲೇಖನ II — ಉದ್ದೇಶಿತ ಬಳಕೆಯ ಮಿತಿ (ವಿಭಾಗ 6 ಮತ್ತು 7)',
    p2Text: 'ಯಾವುದೇ ಡೇಟಾವನ್ನು ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಹಂಚಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ ಅಥವಾ ಬಾಹ್ಯ ಕ್ಲೌಡ್‌ಗೆ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ.',
    p3Header: 'ಲೇಖನ III — ತಾಂತ್ರಿಕ ಭದ್ರತಾ ಕ್ರಮಗಳು (ವಿಭಾಗ 8(5))',
    p3Text: 'ಎಲ್ಲಾ ಲಾಗ್‌ಗಳನ್ನು AES-256 ಎನ್‌ಕ್ರಿಪ್ಶನ್‌ನೊಂದಿಗೆ ಸ್ಥಳೀಯ ಸೆಫ್ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿಡಲಾಗುತ್ತದೆ.',
    p4Header: 'ಲೇಖನ IV — ಡೇಟಾ ಅಳಿಸುವಿಕೆ (ವಿಭಾಗ 8(7))',
    p4Text: 'ನಿಗದಿತ ಅವಧಿ ಮುಗಿದ ನಂತರ ವೀಡಿಯೊ ರೇಖೆಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗುತ್ತದೆ.',
    p5Header: 'ಲೇಖನ V — ವ್ಯಕ್ತಿಗತ ಹಕ್ಕುಗಳು (ವಿಭಾಗ 11, 12 ಮತ್ತು 13)',
    p5Text: 'ನಿಮ್ಮ ಡೇಟಾವನ್ನು ವೀಕ್ಷಿಸಲು, ತಿದ್ದುಪಡಿ ಮಾಡಲು ಮತ್ತು ಅಳಿಸಲು ಕಾನೂನುಬದ್ಧ ಹಕ್ಕಿದೆ.',
    p6Header: 'ಲೇಖನ VI — ಡೇಟಾ ರಕ್ಷಣೆ ಅಧಿಕಾರಿ ನೇಮಕ (ವಿಭಾಗ 10)',
    p6Text: 'ವಿಭಾಗ 10 ರ ಪ್ರಕಾರ ನೇಮಕಗೊಂಡ ಡೇಟಾ ರಕ್ಷಣೆ ಅಧಿಕಾರಿ ವಿವರಗಳು:',
    dpoName: 'ಅರುಣ್ ಕುಮಾರ್ ಪಿಳ್ಳೈ (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'ಡೇಟಾ ರಕ್ಷಣೆ ಅಧಿಕಾರಿ ಮತ್ತು ಮುಖ್ಯ ಕಾರ್ಯನಿರ್ವಹಣಾಧಿಕಾರಿ (COO)',
  },
  ml: {
    title: 'നിയമാനുസൃത പരമാധികാര സ്വകാര്യതാ നയം',
    subtitle: 'ഡിജിറ്റൽ വ്യക്തിഗത ഡാറ്റാ സംരക്ഷണ നിയമം 2023 (ഭാരതം) നിയമാനുസൃതം പ്രാബല്യത്തിൽ',
    preamble: 'ഈ സ്വകാര്യതാ നയം DPDP ആക്ട് 2023 സെക്ഷൻ 4, 5, 6, 7, 8, 10, 11, 12, 13 പ്രകാരം നിയമപരമായി ബാധകമായ രേഖയാണ്.',
    p1Header: 'ആർട്ടിക്കിൾ I — ഡാറ്റാ ഫിഡ്യൂഷ്യറി നോട്ടീസ് (സെക്ഷൻ 4 & 5)',
    p1Text: 'വീഡിയോ സ്ട്രീമുകൾ സുരക്ഷയ്ക്കും മുതിർന്നവരുടെ സംരക്ഷണത്തിനും മാത്രമായി ഉപയോഗിക്കുന്നു.',
    p2Header: 'ആർട്ടിക്കിൾ II — ഡാറ്റാ പരിമിതികൾ (സെക്ഷൻ 6 & 7)',
    p2Text: 'ഒരു ഡാറ്റയും മൂന്നാം കക്ഷികൾക്ക് കൈമാറില്ല, പുറത്തുള്ള ക്ലൗഡിലേക്ക് അയക്കില്ല.',
    p3Header: 'ആർട്ടിക്കിൾ III — സാങ്കേതിക സുരക്ഷ (സെക്ഷൻ 8(5))',
    p3Text: 'പ്രാദേശിക സെഫ് ക്ലസ്റ്ററിൽ AES-256 എൻക്രിപ്ഷനോടെ ഡാറ്റ സുരക്ഷിതമാണ്.',
    p4Header: 'ആർട്ടിക്കിൾ IV — ഡാറ്റ മായ്ക്കൽ (സെക്ഷൻ 8(7))',
    p4Text: 'കാലാവധി കഴിയുമ്പോൾ ഡാറ്റ തനിയെ പൂർണ്ണമായി മായ്ക്കപ്പെടും.',
    p5Header: 'ആർട്ടിക്കിൾ V — വ്യക്തിഗത അവകാശങ്ങൾ (സെക്ഷൻ 11, 12 & 13)',
    p5Text: 'നിങ്ങളുടെ ഡാറ്റ പരിശോധിക്കാനും തിരുത്താനും മായ്ക്കാനും അവകാശമുണ്ട്.',
    p6Header: 'ആർട്ടിക്കിൾ VI — ഡാറ്റാ സംരക്ഷണ ഓഫീസർ നിയമനം (സെക്ഷൻ 10)',
    p6Text: 'സെക്ഷൻ 10 അനുസരിച്ച് നിയമിക്കപ്പെട്ട ഡാറ്റാ പ്രൊട്ടക്ഷൻ ഓഫീസറുടെ വിവരങ്ങൾ:',
    dpoName: 'അരുൺ കുമാർ പിള്ള (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'ഡാറ്റാ പ്രൊട്ടക്ഷൻ ഓഫീസർ & ചീഫ് ഓപ്പറേറ്റിംഗ് ഓഫീസർ (COO)',
  },
  mr: {
    title: 'वैधानिक सार्वभौम गोपनीयता धोरण',
    subtitle: 'डिजिटल वैयक्तिक डेटा संरक्षण कायदा 2023 (भारत) अंतर्गत कायद्यानुसार लागू',
    preamble: 'हे धोरण DPDP कायदा 2023 च्या कलम 4, 5, 6, 7, 8, 10, 11, 12, आणि 13 अंतर्गत वैधानिक दस्तऐवज आहे.',
    p1Header: 'अनुच्छेद I — डेटा फिड्युशरी सूचना (कलम 4 आणि 5)',
    p1Text: 'सर्व व्हिडिओ आणि AI डेटा केवळ परिसर सुरक्षिततेसाठी वापरला जातो.',
    p2Header: 'अनुच्छेद II — डेटा मर्यादा (कलम 6 आणि 7)',
    p2Text: 'कोणताही डेटा तिसऱ्या पक्षास दिला जात नाही किंवा बाहेरील क्लाउडवर पाठवला जात नाही.',
    p3Header: 'अनुच्छेद III — तांत्रिक सुरक्षा (कलम 8(5))',
    p3Text: 'स्थानिक सेफ क्लस्टरवर AES-256 एनक्रिप्शनसह डेटा पूर्णपणे सुरक्षित राहतो.',
    p4Header: 'अनुच्छेद IV — डेटा नष्ट करणे (कलम 8(7))',
    p4Text: 'मुदत संपल्यानंतर व्हिडिओ नोंदी स्वयंचलितपणे कायमस्वरूपी नष्ट केल्या जातात.',
    p5Header: 'अनुच्छेद V — नागरिकांचे वैधानिक अधिकार (कलम 11, 12 आणि 13)',
    p5Text: 'आपला डेटा पाहण्याचा, दुरुस्त करण्याचा आणि हटवण्याचा पूर्ण अधिकार तुम्हाला आहे.',
    p6Header: 'अनुच्छेद VI — डेटा संरक्षण अधिकारी नियुक्ती (कलम 10)',
    p6Text: 'कलम 10 नुसार नियुक्त केलेले डेटा संरक्षण अधिकारी (DPO):',
    dpoName: 'अरुण कुमार पिल्लाई (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'डेटा संरक्षण अधिकारी आणि मुख्य कार्यपालन अधिकारी (COO)',
  },
  gu: {
    title: 'વૈધાનિક સાર્વભૌમ ગોપનીયતા નીતિ',
    subtitle: 'ડિજિટલ પર્સનલ ડેટા પ્રોટેક્શન એક્ટ 2023 (ભારત) હેઠળ કાયદેસર રીતે અમલી',
    preamble: 'આ નીતિ DPDP કાયદા 2023 ની કલમ 4, 5, 6, 7, 8, 10, 11, 12 અને 13 હેઠળ વૈધાનિક દસ્તાવેજ છે.',
    p1Header: 'અનુચ્છેદ I — ડેટા ફિડ્યુશિયરી નોટિસ (કલમ 4 અને 5)',
    p1Text: 'તમામ વિડિઓ ફીડ્સ માત્ર સુરક્ષા અને વડીલોની સંભાળ માટે વાપરવામાં આવે છે.',
    p2Header: 'અનુચ્છેદ II — ડેટા મર્યાદા (કલમ 6 અને 7)',
    p2Text: 'કોઈપણ ડેટા તૃતીય પક્ષોને આપવામાં આવતો નથી અથવા બહારના ક્લાઉડ પર મોકલવામાં આવતો નથી.',
    p3Header: 'અનુચ્છેદ III — તકનીકી સુરક્ષા (કલમ 8(5))',
    p3Text: 'તમામ ડેટા સ્થાનિક સેફ ક્લસ્ટર પર AES-256 એન્ક્રિપ્શન સાથે સુરક્ષિત રહે છે.',
    p4Header: 'અનુચ્છેદ IV — ડેટા નાબૂદી (કલમ 8(7))',
    p4Text: 'નિશ્ચિત સમયસીમા પૂરી થતાં વિડિઓ રેકોર્ડ્સ આપમેળે કાયમી ધોરણે નાબૂદ થાય છે.',
    p5Header: 'અનુચ્છેદ V — નાગરિકોના વૈધાનિક અધિકારો (કલમ 11, 12 અને 13)',
    p5Text: 'તમારા ડેટાને તપાસવા, સુધારવા અને દૂર કરાવવાનો અધિકાર તમારી પાસે છે.',
    p6Header: 'અનુચ્છેદ VI — ડેટા પ્રોટેક્શન ઓફિસર નિયુક્તિ (કલમ 10)',
    p6Text: 'કલમ 10 મુજબ નિયુક્ત ડેટા પ્રોટેક્શન ઓફિસર વિગતો:',
    dpoName: 'અરુણ કુમાર પિલ્લાઈ (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'ડેટા પ્રોટેક્શન ઓફિસર અને ચીફ ઓપરેટિંગ ઓફિસર (COO)',
  },
  bn: {
    title: 'বিধিবদ্ধ সার্বভৌম গোপনীয়তা নীতি',
    subtitle: 'ডিজিটাল ব্যক্তিগত ডেটা সুরক্ষা আইন ২০২৩ (ভারত) এর অধীনে আইনত বলবৎযোগ্য',
    preamble: 'এই গোপনীয়তা নীতিটি DPDP আইন ২০২৩ এর ধারা ৪, ৫, ৬, ৭, ৮, ১০, ১১, ১২ এবং ১৩ এর অধীনে একটি আইনত বাধ্যবাধকতামূলক দলিল।',
    p1Header: 'অনুচ্ছেদ I — ডেটা ফিডুশিয়ারি নোটিশ (ধারা 4 ও 5)',
    p1Text: 'সমস্ত ভিডিও এবং AI তথ্য কেবল নিরাপত্তা ও প্রবীণ সুরক্ষার উদ্দেশ্যে ব্যবহৃত হয়।',
    p2Header: 'অনুচ্ছেদ II — ডেটা সীমাবদ্ধতা (ধারা 6 ও 7)',
    p2Text: 'কোনো ডেটা তৃতীয় পক্ষকে হস্তান্তর করা হয় না বা বাইরের ক্লাউডে পাঠানো হয় না।',
    p3Header: 'অনুচ্ছেদ III — কারিগরি সুরক্ষা (ধারা 8(5))',
    p3Text: 'স্থানীয় সেফ ক্লাস্টারে AES-256 এনক্রিপশনের মাধ্যমে সমস্ত তথ্য সুরক্ষিত থাকে।',
    p4Header: 'অনুচ্ছেদ IV — ডেটা মুছিয়া ফেলা (ধারা 8(7))',
    p4Text: 'নির্ধারিত সময়সীমা শেষে ভিডিও রেকর্ডসমূহ স্বয়ংকিয়ভাবে স্থায়ীভাবে মুছে ফেলা হয়।',
    p5Header: 'অনুচ্ছেদ V — ডেটা প্রিন্সিপাল অধিকার (ধারা 11, 12 ও 13)',
    p5Text: 'আপনার ডেটা দেখার, সংশোধন করার এবং মুছে ফেলার বিধিবদ্ধ অধিকার রয়েছে।',
    p6Header: 'অনুচ্ছেদ VI — ডেটা সুরক্ষা কর্মকর্তা নিয়োগ (ধারা 10)',
    p6Text: 'ধারা ১০ অনুসারে নিযুক্ত ডেটা সুরক্ষা কর্মকর্তা (DPO):',
    dpoName: 'অরুণ কুমার পিল্লাই (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'ডেটা সুরক্ষা কর্মকর্তা এবং প্রধান পরিচালন কর্মকর্তা (COO)',
  },
  pa: {
    title: 'ਵੈਧਾਨਿਕ ਸੰਪੂਰਨ ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ',
    subtitle: 'ਡਿਜੀਟਲ ਨਿੱਜੀ ਡਾਟਾ ਸੁਰੱਖਿਆ ਐਕਟ 2023 (ਭਾਰਤ) ਦੇ ਤਹਿਤ ਕਾਨੂੰਨੀ ਤੌਰ ਤੇ ਲਾਗੂ',
    preamble: 'ਇਹ ਨੀਤੀ DPDP ਐਕਟ 2023 ਦੀ ਧਾਰਾ 4, 5, 6, 7, 8, 10, 11, 12, ਅਤੇ 13 ਅਧੀਨ ਕਾਨੂੰਨੀ ਦਸਤਾਵੇਜ਼ ਹੈ।',
    p1Header: 'ਆਰਟੀਕਲ I — ਡਾਟਾ ਫਿਡਿਊਸ਼ਰੀ ਨੋਟਿਸ (ਧਾਰਾ 4 ਅਤੇ 5)',
    p1Text: 'ਸਾਰੇ ਵੀਡੀਓ ਫੀਡ ਸਿਰਫ ਸੁਰੱਖਿਆ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਦੀ ਦੇਖਭਾਲ ਲਈ ਵਰਤੇ ਜਾਂਦੇ ਹਨ।',
    p2Header: 'ਆਰਟੀਕਲ II — ਡਾਟਾ ਸੀਮਾਵਾਂ (ਧਾਰਾ 6 ਅਤੇ 7)',
    p2Text: 'ਕੋਈ ਵੀ ਡਾਟਾ ਤੀਜੀ ਧਿਰ ਨਾਲ ਸਾਂਝਾ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ ਅਤੇ ਨਾ ਹੀ ਬਾਹਰੀ ਕਲਾਊਡ ਤੇ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ।',
    p3Header: 'ਆਰਟੀਕਲ III — ਤਕਨੀਕੀ ਸੁਰੱਖਿਆ (ਧਾਰਾ 8(5))',
    p3Text: 'ਸਾਰੇ ਲੌਗ ਲੋਕਲ ਸੇਫ ਕਲੱਸਟਰ ਵਿੱਚ AES-256 ਐਨਕ੍ਰਿਪਸ਼ਨ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਹਨ।',
    p4Header: 'ਆਰਟੀਕਲ IV — ਡਾਟਾ ਨਸ਼ਟ ਕਰਨਾ (ਧਾਰਾ 8(7))',
    p4Text: 'ਮਿਆਦ ਖਤਮ ਹੋਣ ਤੋਂ ਬਾਅਦ ਵੀਡੀਓ ਰਿਕਾਰਡ ਆਪਣੇ ਆਪ ਪੱਕੇ ਤੌਰ ਤੇ ਨਸ਼ਟ ਹੋ ਜਾਂਦੇ ਹਨ।',
    p5Header: 'ਆਰਟੀਕਲ V — ਨਾਗਰਿਕਾਂ ਦੇ ਅਧਿਕਾਰ (ਧਾਰਾ 11, 12 ਅਤੇ 13)',
    p5Text: 'ਤੁਹਾਨੂੰ ਆਪਣੇ ਡਾਟੇ ਦੀ ਸਮੀਖਿਆ ਕਰਨ, ਸੋਧਣ ਅਤੇ ਹਟਾਉਣ ਦਾ ਕਾਨੂੰਨੀ ਅਧਿਕਾਰ ਹੈ।',
    p6Header: 'ਆਰਟੀਕਲ VI — ਡਾਟਾ ਪ੍ਰੋਟੈਕਸ਼ਨ ਅਫਸਰ ਨਿਯੁਕਤੀ (ਧਾਰਾ 10)',
    p6Text: 'ਧਾਰਾ 10 ਅਨੁਸਾਰ ਨਿਯੁਕਤ ਡਾਟਾ ਪ੍ਰੋਟੈਕਸ਼ਨ ਅਫਸਰ (DPO):',
    dpoName: 'ਅਰੁਣ ਕੁਮਾਰ ਪਿਲਈ (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'ਡਾਟਾ ਪ੍ਰੋਟੈਕਸ਼ਨ ਅਫਸਰ ਅਤੇ ਚੀਫ ਆਪਰੇਟਿੰਗ ਅਫਸਰ (COO)',
  },
  or: {
    title: 'ବୈଧାନିକ ସ୍ୱାଧୀନ ଗୋପନୀୟତା ନୀତି',
    subtitle: 'ଡିଜିଟାଲ୍ ବ୍ୟକ୍ତିଗତ ଡାଟା ସୁରକ୍ଷା ଆଇନ 2023 (ଭାରତ) ଅଧୀନରେ ଆଇନଗତ ଭାବେ ଲାଗୁ',
    preamble: 'ଏହି ନୀତି DPDP ଆଇନ 2023 ର ଧାରା 4, 5, 6, 7, 8, 10, 11, 12, ଏବଂ 13 ଅଧୀନରେ ଆଇନଗତ ଦଲିଲ।',
    p1Header: 'ଅନୁଚ୍ଛେଦ I — ଡାଟା ଫିଡ୍ୟୁସିଆରୀ ସୂଚନା (ଧାରା 4 ଏବଂ 5)',
    p1Text: 'ସମସ୍ତ ଭିଡିଓ ଫିଡ୍ କେବଳ ସୁରକ୍ଷା ପାଇଁ ବ୍ୟବହୃତ ହୁଏ।',
    p2Header: 'ଅନୁଚ୍ଛେଦ II — ଡାଟା ସୀମା (ଧାରା 6 ଏବଂ 7)',
    p2Text: 'କୌଣସି ଡାଟା ବାହାର କ୍ଲାଉଡ୍‌କୁ ପଠାଯାଏ ନାହିଁ।',
    p3Header: 'ଅନୁଚ୍ଛେଦ III — କାରିଗରୀ ସୁରକ୍ଷା (ଧାରା 8(5))',
    p3Text: 'ସ୍ଥାନୀୟ ସେଫ୍ କ୍ଲଷ୍ଟରରେ AES-256 ଏନକ୍ରିପ୍ସନ୍ ସହିତ ଡାଟା ସୁରକ୍ଷିତ ରହେ।',
    p4Header: 'ଅନୁଚ୍ଛେଦ IV — ଡାଟା ବିଲୋପ (ଧାରା 8(7))',
    p4Text: 'ସମୟସୀମା ଶେଷ ହେବା ପରେ ଭିଡିଓ ସ୍ୱୟଂଚାଳିତ ଭାବେ ସମ୍ପୂର୍ଣ୍ଣ ବିଲୋପ ହୁଏ।',
    p5Header: 'ଅନୁଚ୍ଛେଦ V — ନାଗରିକଙ୍କ ଅଧିକାର (ଧାରା 11, 12 ଏବଂ 13)',
    p5Text: 'ଆପଣଙ୍କ ଡାଟା ଦେଖିବା, ସଂଶୋଧନ କରିବା ଏବଂ ହଟାଇବା ଅଧିକାର ଆପଣଙ୍କର ଅଛି।',
    p6Header: 'ଅନୁଚ୍ଛେଦ VI — ଡାଟା ସୁରକ୍ଷା ଅଧିକାରୀ ନିଯୁକ୍ତି (ଧାରା 10)',
    p6Text: 'ଧାରା 10 ଅନୁଯାୟୀ ନିଯୁକ୍ତ ଡାଟା ସୁରକ୍ଷା ଅଧିକାରୀ (DPO):',
    dpoName: 'ଅରୁଣ କୁମାର ପିଲ୍ଲାଇ (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'ଡାଟା ସୁରକ୍ଷା ଅଧିକାରୀ ଏବଂ ମୁଖ୍ୟ ପରିଚାଳନା ଅଧିକାରୀ (COO)',
  },
  as: {
    title: 'বৈধানিক সাৰ্বভৌম গোপনীয়তা নীতি',
    subtitle: 'ডিজিটেল ব্যক্তিগত তথ্য সুৰক্ষা আইন ২০২৩ (ভাৰত) ৰ অধীনে আইনীভাৱে বলবৎযোগ্য',
    preamble: 'এই নীতি DPDP আইন ২০২৩ ৰ ধাৰা ৪, ৫, ৬, ৭, ৮, ১০, ১১, ১২ আৰু ১৩ ৰ অধীনত এটা আইনী নথি।',
    p1Header: 'অনুচ্ছেদ I — তথ্য ফিডিউচিয়াৰী জাননী (ধাৰা 4 আৰু 5)',
    p1Text: 'সকলো ভিডিঅ\' ফিড কেৱল নিৰাপত্তা কামত ব্যৱহাৰ কৰা হয়।',
    p2Header: 'অনুচ্ছেদ II — তথ্য সীমা (ধাৰা 6 আৰু 7)',
    p2Text: 'কোনো তথ্য বাহিৰৰ ক্লাউডলৈ প্ৰেৰণ কৰা নহয়।',
    p3Header: 'অনুচ্ছেদ III — কাৰিকৰী সুৰক্ষা (ধাৰা 8(5))',
    p3Text: 'স্থানীয় ছেফ ক্লাষ্টাৰত AES-256 এনক্ৰিপশ্বনৰ সৈতে তথ্য নিৰাপদে থাকে।',
    p4Header: 'অনুচ্ছেদ IV — তথ্য মোহাৰি পেলোৱা (ধাৰা 8(7))',
    p4Text: 'নিৰ্ধাৰিত সময়ৰ পিছত ভিডিঅ\' ৰেকৰ্ড স্বয়ংক্ৰিয়ভাৱে মচি পেলোৱা হয়।',
    p5Header: 'অনুচ্ছেদ V — নাগৰিকৰ অধিকাৰ (ধাৰা 11, 12 আৰু 13)',
    p5Text: 'আপোনাৰ তথ্য পৰীক্ষা, সংশোধন আৰু মোহাৰি পেলোৱাৰ অধিকাৰ আছে।',
    p6Header: 'অনুচ্ছেদ VI — তথ্য সুৰক্ষা বিষয়া নিযুক্তি (ধাৰা 10)',
    p6Text: 'ধাৰা ১০ অনুসৰি নিযুক্ত তথ্য সুৰક્ષા বিষয়া (DPO):',
    dpoName: 'অৰুণ কুমাৰ পিল্লাই (Arun Prakash Pillai)',
    dpoEmail: 'coo@shadowverse.in',
    dpoDesignation: 'তথ্য সুৰক্ষা বিষয়া আৰু মুখ্য পৰিচালনা বিষয়া (COO)',
  },
}

const currentPrivacyText = computed<PrivacyTextContent>(() => {
  return (privacyTexts[selectedPrivacyLang.value] || privacyTexts['en']) as PrivacyTextContent
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2.5 sm:p-4 select-none animate-fade-in overflow-y-auto"
    @click.self="emit('close')"
    role="dialog"
    aria-modal="true"
    aria-labelledby="privacy-modal-title"
  >
    <div class="industrial-card max-w-3xl w-full border-[#750d37]/60 space-y-4 my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col p-3.5 sm:p-6 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111113]">
      <!-- 2px Brand Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-[#750d37]"></div>

      <!-- Top bar with Indian language dropdown -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1e1e20] shrink-0 pt-1">
        <div class="space-y-1 min-w-0">
          <span class="font-mono text-[10px] sm:text-xs text-[#750d37] font-bold tracking-widest block uppercase">// STATUTORY LEGAL INSTRUMENT // DPDP ACT 2023</span>
          <h3 id="privacy-modal-title" class="text-base sm:text-lg font-black uppercase text-white truncate">{{ currentPrivacyText.title }}</h3>
        </div>
        
        <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          <select
            v-model="selectedPrivacyLang"
            class="bg-[#0a0a0c] border border-[#750d37] px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none uppercase font-bold cursor-pointer"
          >
            <option v-for="lang in privacyLanguages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>

          <button @click="emit('close')" class="industrial-btn industrial-btn-outline text-[10px] sm:text-xs py-1.5 px-3 shrink-0">
            CLOSE [ESC]
          </button>
        </div>
      </div>

      <div class="overflow-y-auto space-y-4 pr-1 flex-1">
        <div class="font-mono text-xs text-[#a0a0a4] bg-[#0a0a0c] p-3 border border-[#1e1e20] text-center font-bold text-[#3d8b5e]">
          {{ currentPrivacyText.subtitle }}
        </div>

      <div class="p-3 bg-[#750d37]/10 border border-[#750d37]/40 font-mono text-[10px] md:text-xs text-[#e8e8ea] leading-relaxed">
        <span class="text-[#750d37] font-bold block mb-1 uppercase">// STATUTORY PREAMBLE & APPLICABILITY:</span>
        {{ currentPrivacyText.preamble }}
      </div>

      <div class="space-y-3.5 text-xs md:text-sm text-[#e8e8ea] font-sans leading-relaxed">
        <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-1">
          <div class="font-mono text-xs font-bold text-white uppercase">{{ currentPrivacyText.p1Header }}</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">{{ currentPrivacyText.p1Text }}</p>
        </div>

        <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-1">
          <div class="font-mono text-xs font-bold text-white uppercase">{{ currentPrivacyText.p2Header }}</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">{{ currentPrivacyText.p2Text }}</p>
        </div>

        <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-1">
          <div class="font-mono text-xs font-bold text-white uppercase">{{ currentPrivacyText.p3Header }}</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">{{ currentPrivacyText.p3Text }}</p>
        </div>

        <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-1">
          <div class="font-mono text-xs font-bold text-white uppercase">{{ currentPrivacyText.p4Header }}</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">{{ currentPrivacyText.p4Text }}</p>
        </div>

        <div class="p-3 bg-[#0a0a0c] border border-[#1e1e20] space-y-1 flex items-center justify-between">
          <div>
            <div class="font-mono text-xs font-bold text-white uppercase">{{ currentPrivacyText.p5Header }}</div>
            <p class="text-[#a0a0a4] text-xs leading-relaxed">{{ currentPrivacyText.p5Text }}</p>
          </div>
          <button @click="emit('openDpdpPortal'); emit('close')" class="shrink-0 ml-3 px-3 py-1.5 bg-[#3d8b5e]/20 border border-[#3d8b5e] text-[#3d8b5e] font-mono text-[10px] font-bold uppercase hover:bg-[#3d8b5e] hover:text-white transition-all">
            LAUNCH DPDP PORTAL
          </button>
        </div>

        <div class="p-3.5 bg-[#111113] border-2 border-[#750d37] space-y-2">
          <div class="font-mono text-xs font-bold text-[#9a1a4e] uppercase">{{ currentPrivacyText.p6Header }}</div>
          <p class="text-[#a0a0a4] text-xs leading-relaxed">{{ currentPrivacyText.p6Text }}</p>
          
          <!-- Statutory DPO Credentials Box -->
          <div class="mt-2 p-3 bg-[#0a0a0c] border border-[#1e1e20] font-mono text-[11px] md:text-xs space-y-1 text-white">
            <div><span class="text-[#555558]">DPO NAME:</span> <strong class="text-white">{{ currentPrivacyText.dpoName }}</strong></div>
            <div><span class="text-[#555558]">DESIGNATION:</span> <span class="text-[#3d8b5e] font-bold">{{ currentPrivacyText.dpoDesignation }}</span></div>
            <div><span class="text-[#555558]">OFFICIAL DPO EMAIL:</span> <a :href="'mailto:' + currentPrivacyText.dpoEmail" class="text-[#9a1a4e] font-bold underline">{{ currentPrivacyText.dpoEmail }}</a></div>
          </div>
        </div>
      </div>
      </div>

      <div class="pt-3 border-t border-[#1e1e20] flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-[10px] text-[#555558] shrink-0 gap-1">
        <span>STATUTORY FRAMEWORK: DPDP ACT 2023 (ACT 22 OF 2023)</span>
        <span class="text-[#3d8b5e]">SURVMONX LLP LEGAL COMPLIANT</span>
      </div>
    </div>
  </div>
</template>
