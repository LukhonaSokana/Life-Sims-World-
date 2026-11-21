(() => {
  'use strict';

  const SAVE_KEY = 'lsw-base';
  const LEGACY_SAVE_KEY = 'lsw_v8_final_save';
  const LEGACY_KEY = 'lsw-legacy';
  const THEME_KEY = 'lsw-theme';
  const RATE_KEY = 'lsw-rated';
  const RATE_DISMISS_KEY = 'lsw-rate-dismiss';
  const RATE_DAY_KEY = 'lsw-rate-day';
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const THEMES = {
    navy: {
      id: 'navy', name: 'Dark Navy',
      bg: '#0F172A', card: '#1E293B', card2: '#273449',
      text: '#ffffff', muted: '#94A3B8', accent: '#FACC15', accentText: '#000000', border: '#334155',
      o1: '#FACC15', o2: '#38BDF8', o3: '#F472B6'
    },
    midnight: {
      id: 'midnight', name: 'Midnight',
      bg: '#000000', card: '#111111', card2: '#1c1c1c',
      text: '#ffffff', muted: '#94A3B8', accent: '#A78BFA', accentText: '#000000', border: '#27272a',
      o1: '#A78BFA', o2: '#FACC15', o3: '#38BDF8'
    },
    forest: {
      id: 'forest', name: 'Forest',
      bg: '#052E16', card: '#14532D', card2: '#166534',
      text: '#ffffff', muted: '#A7F3D0', accent: '#FACC15', accentText: '#000000', border: '#15803D',
      o1: '#FACC15', o2: '#22C55E', o3: '#BBF7D0'
    },
    sunset: {
      id: 'sunset', name: 'Sunset',
      bg: '#1C1917', card: '#292524', card2: '#36312f',
      text: '#ffffff', muted: '#A8A29E', accent: '#FB923C', accentText: '#000000', border: '#44403C',
      o1: '#FB923C', o2: '#FACC15', o3: '#F472B6'
    },
    ocean: {
      id: 'ocean', name: 'Ocean',
      bg: '#082F49', card: '#0C4A6E', card2: '#075985',
      text: '#ffffff', muted: '#BAE6FD', accent: '#38BDF8', accentText: '#000000', border: '#0369A1',
      o1: '#38BDF8', o2: '#FACC15', o3: '#FFFFFF'
    },
    pink: {
      id: 'pink', name: 'Pink',
      bg: '#500724', card: '#831843', card2: '#9D174D',
      text: '#ffffff', muted: '#FBCFE8', accent: '#F472B6', accentText: '#000000', border: '#BE185D',
      o1: '#F472B6', o2: '#FACC15', o3: '#FFFFFF'
    },
    light: {
      id: 'light', name: 'Light',
      bg: '#F1F5F9', card: '#ffffff', card2: '#E2E8F0',
      text: '#0F172A', muted: '#475569', accent: '#FACC15', accentText: '#000000', border: '#CBD5E1',
      o1: '#EAB308', o2: '#0284C7', o3: '#DB2777'
    }
  };

  function getSavedThemeId() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return THEMES[saved] ? saved : 'navy';
    } catch {
      return 'navy';
    }
  }

  function applyTheme(themeId, persist = false) {
    const t = THEMES[themeId] || THEMES.navy;
    const root = document.documentElement;
    if (root && root.style && root.style.setProperty) {
      root.style.setProperty('--bg', t.bg);
      root.style.setProperty('--card', t.card);
      root.style.setProperty('--card2', t.card2);
      root.style.setProperty('--text', t.text);
      root.style.setProperty('--muted', t.muted);
      root.style.setProperty('--accent', t.accent);
      root.style.setProperty('--accent-text', t.accentText);
      root.style.setProperty('--border', t.border);
      root.style.setProperty('--o1', t.o1);
      root.style.setProperty('--o2', t.o2);
      root.style.setProperty('--o3', t.o3);
    }
    if (persist) {
      try { localStorage.setItem(THEME_KEY, t.id); } catch {}
    }
    return t;
  }

  // Apply locked theme immediately so loader ovals match saved theme on open
  applyTheme(getSavedThemeId(), false);

  const $ = id => document.getElementById(id);
  const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
  const rand = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ============================================================
     1. 21 COUNTRIES WITH CAPITALS, BIGGEST CITIES, CURRENCIES, LAWS & SCHOOLS
     ============================================================ */
  const COUNTRIES = [
    {
      id: 'za', name: 'South Africa', capital: 'Pretoria', biggest: 'Johannesburg',
      cities: ['Bloemfontein', 'Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
      cur: 'R', code: 'ZAR', fx: 1.0, salIdx: 1.0, costMult: 1.0, rentIdx: 1.0, taxPct: 26,
      lang: 'English, Afrikaans, Zulu',
      lawSystem: 'Roman-Dutch + Common Law',
      schoolSystem: 'Grade R-12 Matric CAPS',
      laws: { policeStrict: 68, crimeRisk: 42, drinkAge: 18 },
      banks: ['Standard Bank', 'FNB', 'Capitec', 'Absa'],
      firstM: ['Thabo', 'Sipho', 'Lukas', 'Kagiso', 'Bongani', 'Pieter', 'Sizwe'],
      firstF: ['Naledi', 'Zanele', 'Lerato', 'Annelize', 'Palesa', 'Thandi'],
      surnames: ['Nkosi', 'Dlamini', 'Van der Merwe', 'Khumalo', 'Mokoena', 'Botha']
    },
    {
      id: 'ng', name: 'Nigeria', capital: 'Abuja', biggest: 'Lagos',
      cities: ['Abuja', 'Lagos', 'Kano', 'Ibadan', 'Port Harcourt'],
      cur: '₦', code: 'NGN', fx: 85.0, salIdx: 0.8, costMult: 0.7, rentIdx: 0.85, taxPct: 24,
      lang: 'English, Yoruba, Hausa, Igbo',
      lawSystem: 'Common Law + Sharia + Customary',
      schoolSystem: 'Primary 6 JSS 3 SSS 3 WAEC',
      laws: { policeStrict: 65, crimeRisk: 40, drinkAge: 18 },
      banks: ['GTBank', 'Access Bank', 'Zenith Bank', 'UBA'],
      firstM: ['Chidi', 'Tunde', 'Emeka', 'Ibrahim', 'Babatunde', 'Olu'],
      firstF: ['Ngozi', 'Amina', 'Chioma', 'Funke', 'Zainab', 'Ada'],
      surnames: ['Okafor', 'Adeyemi', 'Balogun', 'Bello', 'Obasanjo', 'Nwosu']
    },
    {
      id: 'gh', name: 'Ghana', capital: 'Accra', biggest: 'Accra',
      cities: ['Accra', 'Kumasi', 'Takoradi', 'Tamale'],
      cur: '₵', code: 'GHS', fx: 0.85, salIdx: 0.8, costMult: 0.8, rentIdx: 0.78, taxPct: 22,
      lang: 'English, Twi, Ewe',
      lawSystem: 'Common Law',
      schoolSystem: 'Basic 9 SHS 3 WASSCE',
      laws: { policeStrict: 70, crimeRisk: 28, drinkAge: 18 },
      banks: ['GCB Bank', 'Ecobank Ghana', 'Fidelity Ghana', 'Stanbic'],
      firstM: ['Kwame', 'Kofi', 'Kojo', 'Yaw', 'Kwabena', 'Kweku'],
      firstF: ['Akosua', 'Abena', 'Efua', 'Adwoa', 'Ama', 'Yaa'],
      surnames: ['Mensah', 'Owusu', 'Boateng', 'Appiah', 'Osei', 'Asante']
    },
    {
      id: 'ke', name: 'Kenya', capital: 'Nairobi', biggest: 'Nairobi',
      cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
      cur: 'KSh', code: 'KES', fx: 7.1, salIdx: 0.8, costMult: 0.8, rentIdx: 0.76, taxPct: 25,
      lang: 'Swahili, English',
      lawSystem: 'Common Law',
      schoolSystem: 'CBC KCSE',
      laws: { policeStrict: 72, crimeRisk: 31, drinkAge: 18 },
      banks: ['KCB Bank', 'Equity Bank', 'Co-op Bank', 'NCBA'],
      firstM: ['Kamau', 'Otieno', 'Kipchoge', 'Mwangi', 'Hassan', 'Brian'],
      firstF: ['Wanjiku', 'Akinyi', 'Chebet', 'Amina', 'Faith', 'Nyambura'],
      surnames: ['Kenyatta', 'Odinga', 'Njoroge', 'Mutua', 'Kibet', 'Ochieng']
    },
    {
      id: 'eg', name: 'Egypt', capital: 'Cairo', biggest: 'Cairo',
      cities: ['Cairo', 'Alexandria', 'Giza', 'Luxor'],
      cur: 'E£', code: 'EGP', fx: 2.7, salIdx: 0.7, costMult: 0.7, rentIdx: 0.7, taxPct: 22,
      lang: 'Arabic',
      lawSystem: 'Civil Law + Islamic Law',
      schoolSystem: 'Primary 6 Prep 3 Secondary 3',
      laws: { policeStrict: 78, crimeRisk: 22, drinkAge: 21 },
      banks: ['NBE Egypt', 'CIB Egypt', 'Banque Misr', 'QNB Alahli'],
      firstM: ['Omar', 'Youssef', 'Karim', 'Mostafa', 'Tarek', 'Ali'],
      firstF: ['Nour', 'Salma', 'Mariam', 'Hana', 'Yasmin', 'Farida'],
      surnames: ['El-Masry', 'Hassan', 'Mansour', 'Ibrahim', 'Farouk', 'Nasser']
    },
    {
      id: 'us', name: 'USA', capital: 'Washington D.C.', biggest: 'New York',
      cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
      cur: '$', code: 'USD', fx: 0.055, salIdx: 2.2, costMult: 1.8, rentIdx: 1.9, taxPct: 28,
      lang: 'English',
      lawSystem: 'Common Law State + Federal',
      schoolSystem: 'K-12 Diploma SAT',
      laws: { policeStrict: 84, crimeRisk: 26, drinkAge: 21 },
      banks: ['Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank'],
      firstM: ['Liam', 'Noah', 'Marcus', 'Ethan', 'Mason', 'James'],
      firstF: ['Olivia', 'Ava', 'Maya', 'Sophia', 'Chloe', 'Harper'],
      surnames: ['Smith', 'Johnson', 'Williams', 'Carter', 'Davis', 'Miller']
    },
    {
      id: 'ca', name: 'Canada', capital: 'Ottawa', biggest: 'Toronto',
      cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
      cur: 'C$', code: 'CAD', fx: 0.075, salIdx: 1.9, costMult: 1.6, rentIdx: 1.75, taxPct: 29,
      lang: 'English, French',
      lawSystem: 'Common Law',
      schoolSystem: 'K-12 Diploma',
      laws: { policeStrict: 82, crimeRisk: 16, drinkAge: 19 },
      banks: ['RBC Royal', 'TD Bank', 'Scotiabank', 'BMO'],
      firstM: ['Lucas', 'Noah', 'Oliver', 'Gabriel', 'Logan', 'Jacob'],
      firstF: ['Emma', 'Charlotte', 'Amelia', 'Camille', 'Claire', 'Zoe'],
      surnames: ['Tremblay', 'Gagnon', 'Roy', 'MacDonald', 'Campbell', 'Wilson']
    },
    {
      id: 'uk', name: 'UK', capital: 'London', biggest: 'London',
      cities: ['London', 'Manchester', 'Birmingham', 'Glasgow'],
      cur: '£', code: 'GBP', fx: 0.043, salIdx: 1.9, costMult: 1.7, rentIdx: 1.85, taxPct: 30,
      lang: 'English',
      lawSystem: 'Common Law',
      schoolSystem: 'GCSE A-Levels',
      laws: { policeStrict: 85, crimeRisk: 18, drinkAge: 18 },
      banks: ['HSBC', 'Barclays', 'Lloyds Bank', 'NatWest'],
      firstM: ['Oliver', 'George', 'Arthur', 'Harry', 'Leo', 'Charlie'],
      firstF: ['Amelia', 'Isla', 'Emily', 'Grace', 'Poppy', 'Lily'],
      surnames: ['Taylor', 'Davies', 'Evans', 'Wright', 'Walker', 'Clarke']
    },
    {
      id: 'fr', name: 'France', capital: 'Paris', biggest: 'Paris',
      cities: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
      cur: '€', code: 'EUR', fx: 0.051, salIdx: 1.7, costMult: 1.5, rentIdx: 1.6, taxPct: 33,
      lang: 'French',
      lawSystem: 'Civil Law Napoleonic',
      schoolSystem: 'College Lycee Bac',
      laws: { policeStrict: 80, crimeRisk: 20, drinkAge: 18 },
      banks: ['BNP Paribas', 'Societe Generale', 'Credit Agricole', 'LCL'],
      firstM: ['Gabriel', 'Raphaël', 'Louis', 'Jules', 'Hugo', 'Théo'],
      firstF: ['Jade', 'Louise', 'Ambre', 'Chloé', 'Manon', 'Léa'],
      surnames: ['Martin', 'Bernard', 'Dubois', 'Moreau', 'Laurent', 'Lefevre']
    },
    {
      id: 'de', name: 'Germany', capital: 'Berlin', biggest: 'Berlin',
      cities: ['Berlin', 'Munich', 'Hamburg', 'Cologne'],
      cur: '€', code: 'EUR', fx: 0.051, salIdx: 1.85, costMult: 1.5, rentIdx: 1.55, taxPct: 32,
      lang: 'German',
      lawSystem: 'Civil Law (BGB)',
      schoolSystem: 'Grundschule Gymnasium Abitur',
      laws: { policeStrict: 88, crimeRisk: 14, drinkAge: 18 },
      banks: ['Deutsche Bank', 'Commerzbank', 'N26', 'Sparkasse'],
      firstM: ['Lukas', 'Jonas', 'Maximilian', 'Leon', 'Paul', 'Felix'],
      firstF: ['Mia', 'Hannah', 'Sophia', 'Emilia', 'Lina', 'Anna'],
      surnames: ['Müller', 'Schmidt', 'Weber', 'Wagner', 'Becker', 'Hoffmann']
    },
    {
      id: 'it', name: 'Italy', capital: 'Rome', biggest: 'Milan',
      cities: ['Rome', 'Milan', 'Naples', 'Florence'],
      cur: '€', code: 'EUR', fx: 0.051, salIdx: 1.45, costMult: 1.35, rentIdx: 1.35, taxPct: 31,
      lang: 'Italian',
      lawSystem: 'Civil Law',
      schoolSystem: 'Scuola Media Liceo Maturita',
      laws: { policeStrict: 76, crimeRisk: 23, drinkAge: 18 },
      banks: ['Intesa Sanpaolo', 'UniCredit', 'Banco BPM', 'Fineco'],
      firstM: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Matteo'],
      firstF: ['Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra'],
      surnames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano']
    },
    {
      id: 'in', name: 'India', capital: 'New Delhi', biggest: 'Mumbai',
      cities: ['Mumbai', 'Bengaluru', 'New Delhi', 'Hyderabad', 'Chennai'],
      cur: '₹', code: 'INR', fx: 4.6, salIdx: 0.9, costMult: 0.75, rentIdx: 0.72, taxPct: 22,
      lang: 'Hindi, English',
      lawSystem: 'Common Law + Personal Laws',
      schoolSystem: 'CBSE ICSE Class 12',
      laws: { policeStrict: 74, crimeRisk: 25, drinkAge: 21 },
      banks: ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'],
      firstM: ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Rohan', 'Kabir'],
      firstF: ['Aanya', 'Diya', 'Priya', 'Kavya', 'Ananya', 'Meera'],
      surnames: ['Sharma', 'Patel', 'Verma', 'Nair', 'Gupta', 'Iyer']
    },
    {
      id: 'br', name: 'Brazil', capital: 'Brasilia', biggest: 'Sao Paulo',
      cities: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador'],
      cur: 'R$', code: 'BRL', fx: 0.31, salIdx: 0.95, costMult: 0.9, rentIdx: 0.95, taxPct: 26,
      lang: 'Portuguese',
      lawSystem: 'Civil Law',
      schoolSystem: 'Ensino Medio ENEM',
      laws: { policeStrict: 70, crimeRisk: 39, drinkAge: 18 },
      banks: ['Itau', 'Nubank', 'Bradesco', 'Banco do Brasil'],
      firstM: ['Miguel', 'Arthur', 'Heitor', 'Bernardo', 'Rafael', 'Lucas'],
      firstF: ['Helena', 'Alice', 'Laura', 'Valentina', 'Sophia', 'Julia'],
      surnames: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa']
    },
    {
      id: 'ae', name: 'UAE', capital: 'Abu Dhabi', biggest: 'Dubai',
      cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain'],
      cur: 'د.إ', code: 'AED', fx: 0.20, salIdx: 2.1, costMult: 1.7, rentIdx: 1.9, taxPct: 0,
      lang: 'Arabic, English',
      lawSystem: 'Civil Law + Sharia',
      schoolSystem: 'MoE / IB / British K-12',
      laws: { policeStrict: 96, crimeRisk: 5, drinkAge: 21 },
      banks: ['Emirates NBD', 'ADCB', 'FAB', 'Dubai Islamic Bank'],
      firstM: ['Mohammed', 'Rashid', 'Hamdan', 'Zayed', 'Khalid', 'Omar'],
      firstF: ['Fatima', 'Aisha', 'Mariam', 'Noora', 'Hessa', 'Alia'],
      surnames: ['Al-Maktoum', 'Al-Nahyan', 'Al-Suwaidi', 'Al-Mansoori', 'Qasimi']
    },
    {
      id: 'jp', name: 'Japan', capital: 'Tokyo', biggest: 'Tokyo',
      cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
      cur: '¥', code: 'JPY', fx: 8.3, salIdx: 1.75, costMult: 1.55, rentIdx: 1.65, taxPct: 30,
      lang: 'Japanese',
      lawSystem: 'Civil Law (Six Codes)',
      schoolSystem: '6-3-3 Elementary-High School',
      laws: { policeStrict: 95, crimeRisk: 6, drinkAge: 20 },
      banks: ['MUFG Bank', 'SMBC', 'Mizuho', 'Rakuten Bank'],
      firstM: ['Haruto', 'Ren', 'Minato', 'Sota', 'Yuto', 'Kenji'],
      firstF: ['Yui', 'Hina', 'Sakura', 'Aoi', 'Mei', 'Rin'],
      surnames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito']
    },
    {
      id: 'cn', name: 'China', capital: 'Beijing', biggest: 'Shanghai',
      cities: ['Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Chengdu'],
      cur: '¥', code: 'CNY', fx: 0.40, salIdx: 1.35, costMult: 1.15, rentIdx: 1.25, taxPct: 25,
      lang: 'Mandarin Chinese',
      lawSystem: 'Civil Law Socialist System',
      schoolSystem: 'Zhongkao Gaokao',
      laws: { policeStrict: 94, crimeRisk: 10, drinkAge: 18 },
      banks: ['ICBC', 'Bank of China', 'CCB', 'Alipay Bank'],
      firstM: ['Wei', 'Hao', 'Lei', 'Ming', 'Chen', 'Jun'],
      firstF: ['Mei', 'Lin', 'Jing', 'Xia', 'Yue', 'Xin'],
      surnames: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang']
    },
    {
      id: 'au', name: 'Australia', capital: 'Canberra', biggest: 'Sydney',
      cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Canberra'],
      cur: 'A$', code: 'AUD', fx: 0.084, salIdx: 1.95, costMult: 1.65, rentIdx: 1.75, taxPct: 29,
      lang: 'English',
      lawSystem: 'Common Law',
      schoolSystem: 'Year 1-12 ATAR',
      laws: { policeStrict: 84, crimeRisk: 17, drinkAge: 18 },
      banks: ['CommBank', 'ANZ', 'Westpac', 'NAB'],
      firstM: ['Jack', 'Oliver', 'Noah', 'Lachlan', 'Cooper', 'William'],
      firstF: ['Charlotte', 'Olivia', 'Amelia', 'Mia', 'Chloe', 'Grace'],
      surnames: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor']
    },
    {
      id: 'es', name: 'Spain', capital: 'Madrid', biggest: 'Madrid',
      cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
      cur: '€', code: 'EUR', fx: 0.051, salIdx: 1.35, costMult: 1.25, rentIdx: 1.3, taxPct: 29,
      lang: 'Spanish',
      lawSystem: 'Civil Law',
      schoolSystem: 'ESO Bachillerato EBAU',
      laws: { policeStrict: 80, crimeRisk: 19, drinkAge: 18 },
      banks: ['Santander', 'BBVA', 'CaixaBank', 'Sabadell'],
      firstM: ['Mateo', 'Hugo', 'Lucas', 'Daniel', 'Pablo'],
      firstF: ['Lucia', 'Sofia', 'Martina', 'Valeria', 'Paula'],
      surnames: ['Garcia', 'Martinez', 'Lopez', 'Sanchez', 'Perez', 'Gomez']
    },
    {
      id: 'sg', name: 'Singapore', capital: 'Singapore', biggest: 'Singapore',
      cities: ['Singapore', 'Jurong East', 'Tampines', 'Woodlands'],
      cur: 'S$', code: 'SGD', fx: 0.074, salIdx: 2.15, costMult: 1.85, rentIdx: 2.1, taxPct: 17,
      lang: 'English, Malay, Mandarin, Tamil',
      lawSystem: 'Common Law + Strict Statutory',
      schoolSystem: 'PSLE O-Levels A-Levels',
      laws: { policeStrict: 98, crimeRisk: 4, drinkAge: 18 },
      banks: ['DBS Bank', 'OCBC Bank', 'UOB', 'Trust Bank'],
      firstM: ['Ryan', 'Ethan', 'Wei Ming', 'Aidan', 'Danial'],
      firstF: ['Chloe', 'Hannah', 'Siti', 'Priya', 'Rachel'],
      surnames: ['Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Rahman']
    },
    {
      id: 'mx', name: 'Mexico', capital: 'Mexico City', biggest: 'Mexico City',
      cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancun'],
      cur: 'MX$', code: 'MXN', fx: 1.05, salIdx: 0.85, costMult: 0.85, rentIdx: 0.85, taxPct: 24,
      lang: 'Spanish',
      lawSystem: 'Civil Law Federal',
      schoolSystem: 'Primaria Secundaria Preparatoria',
      laws: { policeStrict: 66, crimeRisk: 38, drinkAge: 18 },
      banks: ['BBVA Mexico', 'Banorte', 'Santander MX', 'Citibanamex'],
      firstM: ['Santiago', 'Mateo', 'Sebastian', 'Diego', 'Alejandro'],
      firstF: ['Sofia', 'Valentina', 'Regina', 'Camila', 'Ximena'],
      surnames: ['Hernandez', 'Garcia', 'Martinez', 'Lopez', 'Gonzalez']
    },
    {
      id: 'ma', name: 'Morocco', capital: 'Rabat', biggest: 'Casablanca',
      cities: ['Casablanca', 'Rabat', 'Marrakesh', 'Tangier'],
      cur: 'MAD', code: 'MAD', fx: 0.55, salIdx: 0.78, costMult: 0.75, rentIdx: 0.72, taxPct: 22,
      lang: 'Arabic, Amazigh, French',
      lawSystem: 'Civil Law + Maliki Sharia',
      schoolSystem: 'College Lycee Baccalaureat',
      laws: { policeStrict: 76, crimeRisk: 21, drinkAge: 18 },
      banks: ['Attijariwafa', 'BMCE Bank', 'Banque Populaire', 'CIH Bank'],
      firstM: ['Youssef', 'Amine', 'Adam', 'Hamza', 'Mehdi'],
      firstF: ['Salma', 'Imane', 'Kenza', 'Ines', 'Meryem'],
      surnames: ['Alami', 'Bennani', 'El-Fassi', 'Idrissi', 'Tazi']
    }
  ];

  const COUNTRY_PROFILES = {
    za: { climate: 'warm', tech: 3, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['mining', 'food_za', 'hardware', 'solar'] },
    ng: { climate: 'tropical', tech: 2, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['oil', 'agbada', 'music', 'spices'] },
    gh: { climate: 'tropical', tech: 2, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['kente', 'cocoa', 'food_gh', 'mining'] },
    ke: { climate: 'savanna', tech: 2, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['coffee', 'safari', 'solar', 'farming'] },
    eg: { climate: 'desert', tech: 3, noMine: false, cold: false, porkBan: true, alcBan: false, originTags: ['cotton', 'spices', 'perfume', 'tourism'] },
    us: { climate: 'varied', tech: 5, noMine: false, cold: true, porkBan: false, alcBan: false, originTags: ['tech', 'ai', 'space', 'hardware', 'work'] },
    ca: { climate: 'arctic', tech: 5, noMine: false, cold: true, porkBan: false, alcBan: false, originTags: ['winter', 'timber', 'ai', 'med'] },
    uk: { climate: 'cold_rain', tech: 5, noMine: false, cold: true, porkBan: false, alcBan: false, originTags: ['wool', 'finance', 'tech', 'books'] },
    fr: { climate: 'temperate', tech: 5, noMine: true, cold: true, porkBan: false, alcBan: false, originTags: ['fashion', 'wine', 'bakery', 'art'] },
    de: { climate: 'cold', tech: 5, noMine: false, cold: true, porkBan: false, alcBan: false, originTags: ['auto', 'precision', 'hardware', 'tools'] },
    it: { climate: 'med', tech: 4, noMine: true, cold: false, porkBan: false, alcBan: false, originTags: ['leather', 'pasta', 'fashion', 'furniture'] },
    in: { climate: 'monsoon', tech: 4, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['pharma', 'cotton', 'sari', 'spices', 'tech'] },
    br: { climate: 'tropical', tech: 3, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['coffee', 'timber', 'music', 'sports'] },
    ae: { climate: 'desert', tech: 5, noMine: true, cold: false, porkBan: true, alcBan: true, originTags: ['luxury', 'perfume', 'dates', 'ac'] },
    jp: { climate: 'temperate', tech: 5, noMine: true, cold: true, porkBan: false, alcBan: false, originTags: ['tech', 'robotics', 'kimono', 'audio', 'camera'] },
    cn: { climate: 'varied', tech: 5, noMine: false, cold: true, porkBan: false, alcBan: false, originTags: ['tech', 'electronics', 'furniture', 'hardware'] },
    au: { climate: 'temperate', tech: 4, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['surf', 'mining', 'med', 'tech'] },
    es: { climate: 'med', tech: 4, noMine: true, cold: false, porkBan: false, alcBan: false, originTags: ['wine', 'fashion', 'solar', 'art'] },
    sg: { climate: 'tropical', tech: 5, noMine: true, cold: false, porkBan: false, alcBan: false, originTags: ['tech', 'finance', 'pharma', 'ac'] },
    mx: { climate: 'warm', tech: 3, noMine: false, cold: false, porkBan: false, alcBan: false, originTags: ['silver', 'auto', 'coffee', 'spices'] },
    ma: { climate: 'med', tech: 3, noMine: false, cold: false, porkBan: true, alcBan: false, originTags: ['leather', 'solar', 'spices', 'cotton'] }
  };

  const COUNTRY_COORDS = {
    za: { lat: -26.2, lon: 28.0, tz: 2, lifeExp: 65, greet: 'Sawubona', food: 'Biltong & Pap' },
    ng: { lat: 6.5, lon: 3.4, tz: 1, lifeExp: 58, greet: 'How far', food: 'Jollof & Suya' },
    gh: { lat: 5.6, lon: -0.2, tz: 0, lifeExp: 66, greet: 'Akwaaba', food: 'Waakye & Jollof' },
    ke: { lat: -1.3, lon: 36.8, tz: 3, lifeExp: 65, greet: 'Jambo', food: 'Nyama Choma' },
    eg: { lat: 30.0, lon: 31.2, tz: 2, lifeExp: 72, greet: 'Ahlan', food: 'Koshari & Falafel' },
    us: { lat: 40.7, lon: -74.0, tz: -5, lifeExp: 78, greet: 'Hey there', food: 'Burgers & Fries' },
    ca: { lat: 43.7, lon: -79.4, tz: -5, lifeExp: 82, greet: 'Hello eh', food: 'Poutine' },
    uk: { lat: 51.5, lon: -0.1, tz: 0, lifeExp: 81, greet: 'Cheers', food: 'Fish & Chips' },
    fr: { lat: 48.9, lon: 2.3, tz: 1, lifeExp: 83, greet: 'Bonjour', food: 'Croissant & Baguette' },
    de: { lat: 52.5, lon: 13.4, tz: 1, lifeExp: 81, greet: 'Guten Tag', food: 'Pretzel & Schnitzel' },
    it: { lat: 41.9, lon: 12.5, tz: 1, lifeExp: 83, greet: 'Ciao', food: 'Pizza Margherita' },
    in: { lat: 19.1, lon: 72.9, tz: 5.5, lifeExp: 71, greet: 'Namaste', food: 'Biryani & Dosa' },
    br: { lat: -23.5, lon: -46.6, tz: -3, lifeExp: 76, greet: 'Tudo bem', food: 'Feijoada' },
    ae: { lat: 25.2, lon: 55.3, tz: 4, lifeExp: 80, greet: 'Marhaba', food: 'Shawarma & Machboos' },
    jp: { lat: 35.7, lon: 139.7, tz: 9, lifeExp: 85, greet: 'Konnichiwa', food: 'Ramen & Sushi' },
    cn: { lat: 31.2, lon: 121.5, tz: 8, lifeExp: 78, greet: 'Ni Hao', food: 'Dumplings & Noodles' },
    au: { lat: -33.9, lon: 151.2, tz: 10, lifeExp: 83, greet: "G'day", food: 'Meat Pie' },
    es: { lat: 40.4, lon: -3.7, tz: 1, lifeExp: 83, greet: 'Hola', food: 'Paella & Tapas' },
    sg: { lat: 1.35, lon: 103.8, tz: 8, lifeExp: 84, greet: 'Hello', food: 'Hainanese Chicken Rice' },
    mx: { lat: 19.4, lon: -99.1, tz: -6, lifeExp: 75, greet: 'Que tal', food: 'Tacos al Pastor' },
    ma: { lat: 33.6, lon: -7.6, tz: 1, lifeExp: 77, greet: 'Salam', food: 'Tagine & Couscous' }
  };

  /* ============================================================
     2. 13 NEEDS, 3 DIFFICULTY MODES, 1,123+ NEED-BACKED SHOP ITEMS
     ============================================================ */
  const NEEDS_META = [
    { key: 'hunger', icon: '🍽️', name: 'Hunger', miss: 'If missing: Hunger drops -> Health -12/mo & Energy penalty.' },
    { key: 'thirst', icon: '💧', name: 'Thirst', miss: 'If missing: Dehydration -> Health -15/mo & dizziness.' },
    { key: 'energy', icon: '⚡', name: 'Energy', miss: 'If missing: Exhaustion -> Unable to work, study, or craft.' },
    { key: 'shelter', icon: '🏠', name: 'Shelter', miss: 'If missing: Sleeping outside -> Warmth/Safety & Health drop.' },
    { key: 'clothing', icon: '👕', name: 'Clothing', miss: 'If missing: Improper dress -> Job Interview & School penalties.' },
    { key: 'health', icon: '❤️', name: 'Health', miss: 'If missing: Illness worsens -> Risk of hospitalization or death.' },
    { key: 'learning', icon: '🎓', name: 'Learning', miss: 'If missing: Stalled Smarts -> Fail exams & high-tier jobs.' },
    { key: 'work', icon: '💼', name: 'Work', miss: 'If missing: Zero production -> Lower promotions & income.' },
    { key: 'safety', icon: '🛡️', name: 'Safety', miss: 'If missing: Exposed to break-ins, accidents & street hazards.' },
    { key: 'social', icon: '💬', name: 'Social', miss: 'If missing: Loneliness -> Happiness -10/mo & lower Confidence.' },
    { key: 'hygiene', icon: '🧼', name: 'Hygiene', miss: 'If missing: Poor hygiene -> -15 Social & Job rejection risk.' },
    { key: 'transport', icon: '🚗', name: 'Transport', miss: 'If missing: Slow commute -> Late to shifts & high cab costs.' },
    { key: 'communication', icon: '📱', name: 'Communication', miss: 'If missing: Disconnected -> Miss system offers & remote jobs.' }
  ];

  const DIFFICULTY_PROFILES = {
    easy: {
      id: 'easy', shortName: 'Easy', badge: '🟢 Easy', label: 'Easy Mode',
      payMult: 1.45, costMult: 0.78, energyCap: 100, energyRecov: 58,
      healthDrift: 0, medHealMult: 1.4, policeStrictDelta: -20, heatGainMult: 0.6,
      fineMult: 0.6, jailMult: 0.55, crisisProb: 0.10, crisisDmg: 0.5,
      examPass: 2, intvPass: 2, daysPerMonth: 30, hints: true,
      desc: 'Higher pay (+45%), cheaper prices (-22%), faster energy, gentle police & Next-Step hints.'
    },
    normal: {
      id: 'normal', shortName: 'Normal', badge: '🟡 Normal', label: 'Normal',
      payMult: 1.0, costMult: 1.0, energyCap: 100, energyRecov: 45,
      healthDrift: 1, medHealMult: 1.0, policeStrictDelta: 0, heatGainMult: 1.0,
      fineMult: 1.0, jailMult: 1.0, crisisProb: 0.20, crisisDmg: 1.0,
      examPass: 2, intvPass: 2, daysPerMonth: 15, hints: false,
      desc: 'Balanced realistic challenge (default): standard economy, 15d/mo pacing, fair police & medium crises.'
    },
    hard: {
      id: 'hard', shortName: 'Hard', badge: '🔴 Hard', label: 'Hard Mode',
      payMult: 0.78, costMult: 1.32, energyCap: 90, energyRecov: 32,
      healthDrift: 3, medHealMult: 0.7, policeStrictDelta: 15, heatGainMult: 1.5,
      fineMult: 1.65, jailMult: 1.5, crisisProb: 0.34, crisisDmg: 1.65,
      examPass: 3, intvPass: 3, daysPerMonth: 7, hints: false,
      desc: 'Brutal economy: lower pay (-22%), inflated prices (+32%), 90 Energy cap, strict exams & harsh crises.'
    }
  };

  const BELIEF_LIST = ['Christianity', 'Islam', 'African Traditional', 'Hinduism', 'Buddhism', 'Judaism', 'No Religion / Atheist', 'Other'];

  const CULTURE_BY_COUNTRY = {
    za: ['Zulu', 'Xhosa', 'Sotho', 'Tswana', 'Afrikaans', 'Coloured', 'Indian', 'Other'],
    ng: ['Yoruba', 'Igbo', 'Hausa', 'Other'],
    gh: ['Akan', 'Ewe', 'Ga-Adangbe', 'Other'],
    ke: ['Kikuyu', 'Luo', 'Luhya', 'Kalenjin', 'Other'],
    eg: ['Egyptian Arab', 'Coptic', 'Nubian', 'Other'],
    us: ['African-American', 'Latino', 'White', 'Asian', 'Indigenous', 'Other'],
    ca: ['English Canadian', 'Quebecois', 'South Asian', 'East Asian', 'Indigenous', 'Other'],
    uk: ['British', 'Black British', 'British Asian', 'Scottish', 'Welsh', 'Other'],
    fr: ['French', 'Maghrebi French', 'West African French', 'Other'],
    de: ['German', 'Turkish-German', 'Bavarian', 'Other'],
    it: ['Italian', 'Sicilian', 'Northern Italian', 'Other'],
    in: ['North Indian', 'South Indian', 'Bengali', 'Punjabi', 'Marathi', 'Other'],
    br: ['Pardo', 'Afro-Brazilian', 'White Brazilian', 'Indigenous', 'Other'],
    ae: ['Emirati', 'Arab Expat', 'South Asian Expat', 'Other'],
    jp: ['Yamato Japanese', 'Okinawan', 'Zainichi', 'Other'],
    cn: ['Han Chinese', 'Cantonese', 'Hui', 'Other'],
    au: ['Anglo-Australian', 'Aboriginal & Torres Strait', 'Asian-Australian', 'Other'],
    es: ['Castilian', 'Catalan', 'Andalusian', 'Basque', 'Other'],
    sg: ['Chinese Singaporean', 'Malay', 'Indian Singaporean', 'Eurasian', 'Other'],
    mx: ['Mestizo', 'Indigenous Mexican', 'Criollo', 'Other'],
    ma: ['Moroccan Arab', 'Amazigh (Berber)', 'Sahrawi', 'Other']
  };

  const DEFAULT_BELIEF_BY_COUNTRY = {
    za: ['Christianity', 'African Traditional', 'Islam', 'Hinduism'],
    ng: ['Christianity', 'Islam', 'African Traditional'],
    gh: ['Christianity', 'Islam', 'African Traditional'],
    ke: ['Christianity', 'African Traditional', 'Islam'],
    eg: ['Islam', 'Christianity'],
    us: ['Christianity', 'No Religion / Atheist', 'Judaism', 'Islam'],
    ca: ['Christianity', 'No Religion / Atheist', 'Islam', 'Hinduism'],
    uk: ['Christianity', 'No Religion / Atheist', 'Islam', 'Hinduism'],
    fr: ['Christianity', 'No Religion / Atheist', 'Islam'],
    de: ['Christianity', 'No Religion / Atheist', 'Islam'],
    it: ['Christianity', 'No Religion / Atheist'],
    in: ['Hinduism', 'Islam', 'Christianity', 'Buddhism'],
    br: ['Christianity', 'No Religion / Atheist'],
    ae: ['Islam', 'Hinduism', 'Christianity'],
    jp: ['Buddhism', 'No Religion / Atheist'],
    cn: ['Buddhism', 'No Religion / Atheist', 'Islam'],
    au: ['Christianity', 'No Religion / Atheist', 'Buddhism'],
    es: ['Christianity', 'No Religion / Atheist'],
    sg: ['Buddhism', 'Christianity', 'Islam', 'Hinduism'],
    mx: ['Christianity', 'No Religion / Atheist'],
    ma: ['Islam', 'Judaism']
  };

  const CULTURAL_GREETINGS = {
    Zulu: 'Sawubona, my child',
    Xhosa: 'Molo, mntanam',
    Sotho: 'Dumela, ngwanaka',
    Tswana: 'Dumela, ngwanaka',
    Afrikaans: 'Goeiedag, my kind',
    Coloured: 'Hallo, my kind',
    Indian: 'Namaste, beta',
    Yoruba: 'E nle, omo mi',
    Igbo: 'Ndewo, nwa m',
    Hausa: 'Sannu, yaro na',
    Akan: 'Akwaaba, me ba',
    Ewe: 'Woezor, vinye',
    Kikuyu: 'Wimwega, mwana wakwa',
    Luo: 'Misawa, nyathina',
    Luhya: 'Mulembe, omwana',
    'North Indian': 'Namaste, beta',
    'South Indian': 'Vanakkam, kanna',
    Bengali: 'Nomoshkar',
    Punjabi: 'Sat Sri Akal',
    'Egyptian Arab': 'Ahlan, habibi',
    Emirati: 'Marhaba, ya waladi',
    'Moroccan Arab': 'Salam, wlidi',
    'Turkish-German': 'Merhaba, canim',
    German: 'Hallo, mein Kind',
    French: 'Bonjour, mon enfant',
    Italian: 'Ciao, tesoro',
    'Yamato Japanese': 'Ohayo, kodomo',
    'Han Chinese': 'Ni hao, haizi',
    Castilian: 'Hola, mi hijo',
    Mestizo: 'Hola, mijo',
    Malay: 'Selamat pagi, anakku'
  };

  const CULTURAL_NAMES = {
    Zulu: { M: ['Sipho', 'Sibusiso', 'Thabo', 'Bongani', 'Nkosinathi'], F: ['Ntombi', 'Zanele', 'Nandi', 'Lindiwe', 'Nomvula'], gogo: 'Gogo' },
    Xhosa: { M: ['Lukhona', 'Siyabonga', 'Andile', 'Xolani', 'Buhle'], F: ['Ayanda', 'Nomfundo', 'Nolusindiso', 'Bulelwa', 'Lulama'], gogo: 'Makhulu' },
    Sotho: { M: ['Tshepo', 'Kgotso', 'Thabiso', 'Mpho', 'Tumelo'], F: ['Lerato', 'Palesa', 'Kefilwe', 'Refilwe', 'Dineo'], gogo: 'Nkgono' },
    Tswana: { M: ['Kagiso', 'Thato', 'Kabo', 'Phenyo', 'Tebogo'], F: ['Lesedi', 'Boitumelo', 'Kelebogile', 'Amogelang', 'Neo'], gogo: 'Nkoko' },
    Afrikaans: { M: ['Pieter', 'Johan', 'Hennie', 'Danie', 'Ruan'], F: ['Annelize', 'Marike', 'Sanne', 'Chanel', 'Marelize'], gogo: 'Ouma' },
    Yoruba: { M: ['Adebayo', 'Tunde', 'Oluwaseun', 'Babatunde', 'Kayode'], F: ['Funke', 'Bolanle', 'Titilayo', 'Yetunde', 'Abiola'], gogo: 'Iya Agba' },
    Igbo: { M: ['Chinedu', 'Emeka', 'Kelechi', 'Obinna', 'Ikenna'], F: ['Ngozi', 'Chiamaka', 'Amaka', 'Adaeze', 'Nneka'], gogo: 'Nne Ochie' },
    Hausa: { M: ['Ibrahim', 'Musa', 'Sani', 'Usman', 'Abubakar'], F: ['Amina', 'Fatima', 'Zainab', 'Halima', 'Hadiza'], gogo: 'Kaka' },
    Kikuyu: { M: ['Kamau', 'Njoroge', 'Kariuki', 'Wanjiru', 'Mwangi'], F: ['Wanjiku', 'Nyambura', 'Wambui', 'Njeri', 'Muthoni'], gogo: 'Cucu' },
    Luo: { M: ['Otieno', 'Ochieng', 'Omondi', 'Onyango', 'Odongo'], F: ['Akinyi', 'Atieno', 'Adhiambo', 'Awuor', 'Anyango'], gogo: 'Dani' },
    'North Indian': { M: ['Aarav', 'Rohan', 'Vikram', 'Aditya', 'Kabir'], F: ['Ananya', 'Priya', 'Diya', 'Kavya', 'Meera'], gogo: 'Dadi' },
    'South Indian': { M: ['Karthik', 'Arjun', 'Pranav', 'Siddharth', 'Vihaan'], F: ['Lakshmi', 'Nandini', 'Shruti', 'Deepika', 'Aishwarya'], gogo: 'Paati' },
    German: { M: ['Lukas', 'Jonas', 'Maximilian', 'Felix', 'Leon'], F: ['Hannah', 'Mia', 'Emma', 'Sofia', 'Lina'], gogo: 'Oma' },
    Emirati: { M: ['Zayed', 'Rashid', 'Omar', 'Hamdan', 'Tariq'], F: ['Mariam', 'Fatma', 'Hessa', 'Noura', 'Shamma'], gogo: 'Yaddah' },
    'Yamato Japanese': { M: ['Haruto', 'Ren', 'Yuto', 'Sota', 'Kenji'], F: ['Yui', 'Aoi', 'Sakura', 'Hina', 'Mei'], gogo: 'Obaachan' }
  };

  function pickBeliefForCountry(cid) {
    const arr = DEFAULT_BELIEF_BY_COUNTRY[cid] || ['Christianity', 'Islam', 'No Religion / Atheist'];
    return pick(arr);
  }

  function pickCultureForCountry(cid) {
    const arr = (CULTURE_BY_COUNTRY[cid] || ['Other']).filter(x => x !== 'Other');
    return arr.length ? pick(arr) : 'Local Heritage';
  }

  const SHOP_CATEGORIES = ['All', 'Technology', 'Furniture', 'Hardware', 'Clothes', 'Food', 'Medicine', 'School', 'Work', 'Culture'];

  const ALL_SHOP_ITEMS = (() => {
    const list = [];
    const needMap = Object.fromEntries(NEEDS_META.map(n => [n.key, n]));
    const pushItem = (item) => {
      const nm = needMap[item.need] || NEEDS_META[0];
      list.push({
        id: item.id,
        cat: item.cat,
        subCat: item.subCat || item.cat,
        name: item.name,
        cost: Math.max(25, Math.round(item.cost)),
        need: nm.key,
        needLabel: `${nm.icon} ${nm.name}`,
        effect: item.effect || item.desc || `Restores ${nm.name} comfort & daily utility.`,
        missEffect: item.missEffect || nm.miss,
        durability: item.durability || 100,
        weightKg: item.weightKg || 2,
        originCid: item.originCid || 'cn',
        roomReq: item.roomReq || null,
        usableType: item.usableType || 'general',
        paintable: item.paintable !== undefined ? item.paintable : (item.cat === 'Furniture' || item.cat === 'Clothes' || item.cat === 'Technology' || item.cat === 'Hardware'),
        tags: item.tags || []
      });
    };

    const sigs = [
      { id: 'sh_pain', cat: 'Medicine', name: 'Painkillers & Flu Tabs', cost: 180, need: 'health', usableType: 'medicine', weightKg: 1, originCid: 'in', desc: '+15 Health & clears mild flu.' },
      { id: 'sh_vit', cat: 'Medicine', name: 'Daily Multivitamins', cost: 280, need: 'health', usableType: 'medicine', weightKg: 1, originCid: 'us', desc: '+10 Health & +15 Energy.' },
      { id: 'sh_firstaid', cat: 'Medicine', name: 'Wilderness First Aid Kit', cost: 650, need: 'safety', usableType: 'medicine', weightKg: 2, originCid: 'de', desc: 'Stops injuries on hikes & sites.' },
      { id: 'sh_sun', cat: 'Medicine', name: 'SPF50 Sunscreen & Skincare', cost: 340, need: 'hygiene', usableType: 'medicine', weightKg: 1, originCid: 'fr', desc: '+4 Looks & skin protection.' },
      { id: 'sh_drill', cat: 'Hardware', name: 'Cordless Power Drill', cost: 1800, need: 'work', usableType: 'gear', weightKg: 4, originCid: 'de', tags: ['tools', 'hardware'], desc: 'Workshop & Home DIY upgrades.' },
      { id: 'sh_helmet', cat: 'Hardware', name: 'Mining Hardhat & Headlamp', cost: 950, need: 'safety', usableType: 'gear', weightKg: 2, originCid: 'za', tags: ['mining', 'hardware'], desc: 'Cuts Mining & Cave injury risk by 40%.' },
      { id: 'sh_scanner', cat: 'Hardware', name: 'Ore & Metal Detector', cost: 3500, need: 'work', usableType: 'gear', weightKg: 3, originCid: 'au', tags: ['mining', 'tech'], desc: '+20% Rare Stone discovery in Mining.' },
      { id: 'sh_jerry', cat: 'Hardware', name: 'Spare Fuel Canister (20L)', cost: 520, need: 'transport', usableType: 'gear', weightKg: 5, originCid: 'ng', desc: 'Emergency +40% Car Fuel refill anytime.' },
      { id: 'sh_suit', cat: 'Clothes', name: 'Tailored Executive Suit', cost: 4200, need: 'clothing', usableType: 'clothes', weightKg: 2, originCid: 'it', tags: ['fashion'], desc: '+10 Looks & +15% Job Interview bonus.' },
      { id: 'sh_boots', cat: 'Clothes', name: 'Trail Hiking Boots', cost: 1600, need: 'clothing', usableType: 'clothes', weightKg: 2, originCid: 'uk', desc: '-25% Energy lost on hikes & camping.' },
      { id: 'sh_winter', cat: 'Clothes', name: 'Thermal Alpine Jacket', cost: 2400, need: 'clothing', usableType: 'clothes', weightKg: 3, originCid: 'ca', tags: ['winter'], desc: 'Prevents cold damage in Winter regions.' },
      { id: 'sh_scrubs', cat: 'Clothes', name: 'Sterile Lab Coat & Scrubs', cost: 1100, need: 'clothing', usableType: 'clothes', weightKg: 1, originCid: 'us', desc: 'Required for safe Medical Lab work.' },
      { id: 'sh_pantry', cat: 'Food', name: 'Weekly Pantry Box', cost: 650, need: 'hunger', usableType: 'food', weightKg: 6, originCid: 'za', desc: '+25 Energy & +8 Health.' },
      { id: 'sh_coffee', cat: 'Food', name: 'Artisan Espresso Tin', cost: 240, need: 'energy', usableType: 'food', weightKg: 1, originCid: 'br', tags: ['coffee'], desc: '+20 Energy boost for sprints.' },
      { id: 'sh_petfood', cat: 'Food', name: 'Premium Pet Food Bag', cost: 320, need: 'social', usableType: 'food', weightKg: 4, originCid: 'us', desc: 'Keeps pets healthy & +10 Pet Bond.' },
      { id: 'gear_centrifuge', cat: 'Work', name: 'Lab Micro-Centrifuge (Med Gear)', cost: 4500, need: 'learning', usableType: 'lab', weightKg: 8, originCid: 'de', desc: 'Required gear for Medical & Food Labs.' },
      { id: 'gear_multimeter', cat: 'Work', name: 'Oscilloscope & Circuit Rig', cost: 5200, need: 'work', usableType: 'gear', weightKg: 5, originCid: 'jp', tags: ['tech'], desc: 'Technical gear for Energy Lab testing.' },
      { id: 'gear_devrig', cat: 'Work', name: 'GPU Workstation & Debugger', cost: 6800, need: 'work', usableType: 'laptop', weightKg: 9, originCid: 'us', tags: ['tech'], desc: 'Technical gear for Dev Studio & AI.' },
      { id: 'gear_soilprobe', cat: 'Work', name: 'Smart Soil & Hydro Probe', cost: 3900, need: 'learning', usableType: 'lab', weightKg: 3, originCid: 'ke', tags: ['farming'], desc: 'Agri Lab moisture & pH analyzer.' },
      { id: 'gear_telemetry', cat: 'Work', name: 'Aero Telemetry Wind Kit', cost: 9500, need: 'work', usableType: 'gear', weightKg: 7, originCid: 'us', tags: ['space', 'tech'], desc: 'Space Lab trajectory testing rig.' }
    ];
    sigs.forEach(pushItem);

    const tiers = ['Budget', 'Classic', 'Pro', 'Ultra', 'Industrial'];
    const origins = ['cn', 'us', 'jp', 'de', 'uk', 'kr', 'in', 'za', 'gh', 'it', 'fr', 'br', 'ae', 'sg', 'eg'];

    const techSpecs = [
      ['Smartphone', 'communication', 'phone', 2800, 1, 'Calls, Social Media, Banking & Job Apps anywhere.', 'Disconnected: miss remote jobs & system offers.', ['tech']],
      ['Laptop Computer', 'work', 'laptop', 7500, 2, 'Required for Coding, Dev Studio & Online Courses.', 'Cannot run Dev Studio or remote IT work.', ['tech']],
      ['Desktop Workstation', 'work', 'pc', 11000, 9, '3x faster Code & AI rendering.', 'Slow compiles & lower engineering output.', ['tech']],
      ['Smartwatch Tracker', 'health', 'general', 2200, 1, 'Monitors Sleep, Steps & Heart Rate (+5 Health).', 'Miss early fatigue & stress warnings.', ['tech']],
      ['4K Smart TV', 'social', 'tv', 6200, 12, 'Home movies & family Happiness (needs Electricity).', 'Lower evening Happiness recovery at home.', ['tech']],
      ['Wireless Bluetooth Speaker', 'social', 'general', 950, 2, 'Music vibes +10 Happiness & Party hosting.', 'Silent workouts and lower mood.', ['audio']],
      ['Noise-Canceling Headphones', 'learning', 'general', 2100, 1, '+15% Focus during Study & Exams.', 'Noisy commute distracts study.', ['audio']],
      ['Mirrorless 4K Camera', 'work', 'general', 9200, 2, '+2x Social Media income & Photography skill.', 'Low-res content stalls channel growth.', ['camera']],
      ['5G Fiber WiFi Router', 'communication', 'sim', 1200, 1, 'Enables home Internet for Phones & Laptops.', 'Devices stuck offline.', ['tech']],
      ['50GB Data SIM Pack', 'communication', 'sim', 260, 1, 'Instant mobile data for Banking & GPS.', 'No mobile data outside home.', ['tech']],
      ['Solar Inverter Kit', 'shelter', 'solar', 8900, 18, '+72h clean Electricity during blackouts.', 'Blackouts disable Fridge, PC & TV.', ['solar']],
      ['Power Bank 30000mAh', 'energy', 'general', 650, 1, 'Keeps Phone active during outdoor trips.', 'Dead battery outdoors misses urgent calls.', ['tech']],
      ['GPS Sat-Nav Unit', 'transport', 'general', 1600, 1, 'Shorter Logistics routes & hiking safety.', 'Longer detours waste fuel.', ['tech']],
      ['HD Security CCTV System', 'safety', 'security', 4400, 4, '-50% home burglary risk.', 'Vulnerable home when away.', ['tech']],
      ['Home AI Assistant Hub', 'communication', 'general', 1800, 1, 'Morning reminders & smart utility saving.', 'Manual tracking only.', ['ai']],
      ['4K Gaming Console', 'social', 'tv', 6900, 4, '+12 Happiness & Online Gaming friends.', 'Higher boredom & stress buildup.', ['tech']],
      ['VR Learning Headset', 'learning', 'general', 5400, 2, '3D Medical/Space/Engineering simulations.', 'Theory-only lab study.', ['tech']],
      ['E-Reader Tablet', 'learning', 'book', 2300, 1, '+4 Smarts & compact library on flights.', 'Heavy paper books use luggage kg.', ['tech']],
      ['Commercial 3D Printer', 'work', 'gear', 7800, 14, 'Print prototypes in Innovation Lab.', 'Higher prototype material fees.', ['tech']],
      ['Foldable Mapping Drone', 'work', 'gear', 8400, 3, 'Survey farms, mining sites & film shoots.', 'No aerial surveying.', ['tech']],
      ['Laser Printer & Scanner', 'work', 'general', 2400, 6, 'Print Tenders, Wills & CVs cleanly.', 'Pay extra print shop fees.', ['tech']],
      ['Portable AC Cool Tower', 'shelter', 'general', 4800, 14, 'Offsets desert/tropical heatwaves.', 'Desert heat drains Energy faster.', ['ac']],
      ['Water Filtration Dispenser', 'thirst', 'general', 1900, 5, 'Pure safe drinking water on tap.', 'Risk contaminated tap illness.', ['tech']],
      ['Smart Biometric Safe', 'safety', 'safe', 4200, 16, 'Secures pocket cash from street muggings.', 'Pocket cash exposed to theft.', ['tech']],
      ['Robotic Vacuum Cleaner', 'hygiene', 'general', 3600, 4, 'Auto-cleans floors (+5 Hygiene/mo).', 'Dust lowers home comfort.', ['robotics']]
    ];
    let idx = 1;
    techSpecs.forEach(([nm, need, uType, baseC, w, eff, miss, tags], si) => {
      tiers.forEach((tier, ti) => {
        pushItem({
          id: `tec_${idx++}`, cat: 'Technology', subCat: uType, name: `${tier} ${nm}`,
          cost: Math.round(baseC * (0.65 + ti * 0.45)), need, usableType: uType, weightKg: w,
          originCid: origins[(si + ti) % origins.length], tags, effect: eff, missEffect: miss,
          roomReq: (uType === 'tv' || uType === 'safe' || uType === 'solar') ? 'living' : null
        });
      });
    });

    const furnSpecs = [
      ['Orthopedic Bed', 'energy', 'bed', 'bedroom', 4200, 35, 'Full restful sleep & full Energy recovery.', 'Sleeping on hard floor drains Health -5/mo.'],
      ['Pillow & Linen Set', 'energy', 'bed', 'bedroom', 650, 2, '+8% Sleep comfort & Hygiene.', 'Stiff neck & poor rest.'],
      ['Wooden Wardrobe Closet', 'clothing', 'general', 'bedroom', 3400, 40, 'Organizes Suits & Outfits neatly.', 'Wrinkled clothes lower Looks -3.'],
      ['Bedside Nightstand', 'shelter', 'general', 'bedroom', 1100, 12, 'Stores Wallet, Keys & Phone safely.', 'Cluttered bedroom.'],
      ['Blackout Thermal Curtains', 'shelter', 'general', 'bedroom', 900, 3, 'Insulates bedroom from heat & cold.', 'Poor sleep quality in daylight.'],
      ['Luxury Sofa Set', 'social', 'general', 'living', 6800, 55, '+12 Happiness & Host guests at home.', 'Nowhere to seat visitors.'],
      ['Coffee Table', 'social', 'general', 'living', 1500, 14, 'Living room centerpiece for tea & study.', 'Bare living room.'],
      ['Bookshelf Library Rack', 'learning', 'general', 'living', 1900, 22, 'Displays up to 20 Study Books.', 'Books piled on floor.'],
      ['Dining Table (6-Seater)', 'hunger', 'general', 'living', 4800, 45, 'Family meals boost Family Bond +5.', 'Eating standing up.'],
      ['Woven Living Carpet', 'shelter', 'general', 'living', 1300, 8, 'Warmth & cozy home insulation.', 'Cold bare floors.'],
      ['Smart Fridge-Freezer', 'hunger', 'fridge', 'kitchen', 6400, 58, 'Stores Food fresh indefinitely (stops 48h spoilage!).', 'Groceries expire in 48h & cause poisoning!'],
      ['Electric Gas Stove & Oven', 'hunger', 'general', 'kitchen', 4500, 42, 'Cook nutritious home meals cheaply.', 'Stuck buying pricey takeout.'],
      ['Microwave Oven', 'hunger', 'general', 'kitchen', 1400, 12, 'Heats meals in 2 minutes (-2 Energy).', 'Slower meal prep.'],
      ['Electric Kettle', 'thirst', 'general', 'kitchen', 480, 2, 'Boils safe drinking water & tea.', 'No hot drinks in cold mornings.'],
      ['Pots, Pans & Knife Set', 'hunger', 'general', 'kitchen', 980, 6, '+15% home meal nutrition.', 'Cannot cook complex dishes.'],
      ['Water Purifier Tap Unit', 'thirst', 'general', 'kitchen', 1800, 5, 'Clean unlimited Thirst hydration.', 'Risk unsafe water illness.'],
      ['Hot Shower & Heater Unit', 'hygiene', 'shower', 'bathroom', 3900, 18, '+30% Hygiene per shower (requires Water).', '-15 Social penalty from poor hygiene.'],
      ['Automatic Washing Machine', 'hygiene', 'washer', 'bathroom', 5200, 52, 'Keeps all Outfits fresh & sharp.', 'Dirty clothes penalize Interviews.'],
      ['Vanity Mirror & Sink', 'hygiene', 'shower', 'bathroom', 2100, 15, '+4 Looks grooming boost.', 'Missed grooming bonus.'],
      ['Ergonomic Office Desk', 'work', 'general', 'office', 2900, 24, '+10% Work & Dev Studio efficiency.', 'Back pain working from couch.'],
      ['Mesh Executive Chair', 'work', 'general', 'office', 2400, 16, 'Protects Health during long shifts.', 'Fatigue hits +20% faster.'],
      ['Patio Grill & Seating', 'social', 'general', 'outdoor', 2600, 20, 'Host weekend braai/BBQ (+15 Social).', 'No outdoor entertaining.'],
      ['Rainwater Harvesting Tank', 'thirst', 'general', 'outdoor', 3400, 35, 'Free backup Water supply.', 'Vulnerable to municipal water cuts.'],
      ['Garden Planter & Compost Bin', 'hunger', 'seeds', 'outdoor', 950, 8, 'Grow fresh vegetables at home.', 'No home food garden.'],
      ['Oil Heater Radiator', 'shelter', 'general', 'bedroom', 1650, 11, 'Essential warmth during freezing winters.', 'Winter cold drains Health -8/mo.']
    ];
    furnSpecs.forEach(([nm, need, uType, room, baseC, w, eff, miss], fi) => {
      tiers.forEach((tier, ti) => {
        pushItem({
          id: `frn_${idx++}`, cat: 'Furniture', subCat: uType, name: `${tier} ${nm}`,
          cost: Math.round(baseC * (0.65 + ti * 0.45)), need, usableType: uType, roomReq: room,
          weightKg: w, originCid: origins[(fi + ti) % origins.length],
          tags: nm.toLowerCase().includes('heater') ? ['winter', 'furniture'] : ['furniture'],
          effect: eff, missEffect: miss
        });
      });
    });

    const hwSpecs = [
      ['3-Bedroom Waterproof Tent', 'shelter', 'tent', 2400, 9, 'Emergency Shelter anywhere when without a House!'],
      ['Thermal Sleeping Bag (-10C)', 'shelter', 'bed', 1100, 2, 'Stops floor/cold damage in outdoors & tents.'],
      ['Mechanic Socket & Wrench Kit', 'work', 'gear', 1600, 7, 'DIY Car Repairs & Truck Maintenance.'],
      ['Carpenter Saw & Hammer Kit', 'work', 'gear', 1250, 5, 'Builds & repairs Home Furniture.'],
      ['Multimeter Electrical Kit', 'safety', 'gear', 850, 1, 'Diagnose home & factory wiring faults.'],
      ['5kVA Backup Generator', 'shelter', 'generator', 7800, 48, 'Powers Home & Workshop during grid blackouts.'],
      ['Wall Paint & Roller Brush Set', 'shelter', 'paint', 420, 4, 'Use [Paint Anything] on walls, furniture, or cars!'],
      ['Artist Canvas & Acrylic Set', 'social', 'paint', 540, 2, 'Paint custom artworks & raise Craft skill.'],
      ['Steel Security Padlock Set', 'safety', 'security', 480, 2, 'Locks doors, sheds & toolboxes.'],
      ['Hydraulic Car Jack & Pump', 'transport', 'gear', 1150, 9, 'Roadside tyre rescue without tow truck fees.'],
      ['Fire Extinguisher (ABC 6kg)', 'safety', 'security', 720, 7, 'Stops Kitchen & Lab fire damage.'],
      ['Heavy Pickaxe & Steel Shovel', 'work', 'gear', 680, 6, 'Required basic gear for Quarry & Coal Mining.'],
      ['Soldering Iron & Flux Kit', 'work', 'gear', 790, 2, 'Build circuits in Innovation Lab.'],
      ['Digital Compound Microscope', 'learning', 'microscope', 3600, 4, 'Perform Bio/Chem/Forensic Research on any item!'],
      ['Extension Ladder (6m)', 'work', 'gear', 1900, 14, 'Roof repairs & Solar panel installation.'],
      ['Solar Floodlight Bar', 'safety', 'security', 620, 2, 'Night perimeter lighting cuts theft risk.'],
      ['Garden Hose & Nozzle', 'hygiene', 'general', 490, 3, 'Wash cars, patios & water crops.'],
      ['Welding Inverter Machine', 'work', 'gear', 4900, 11, 'Heavy Steel fabrication & truck armouring.'],
      ['Digital Laser Tape Measure', 'work', 'gear', 740, 1, 'Exact Real Estate & Tender measurements.'],
      ['Plumbing Pipe Wrench Set', 'hygiene', 'gear', 820, 4, 'Fix leaks & install Bathroom fixtures.'],
      ['Air Compressor (50L)', 'work', 'gear', 3800, 24, 'Run pneumatic workshop tools.'],
      ['Portable Water Pump', 'thirst', 'gear', 2900, 13, 'Pump borehole & tank water safely.'],
      ['Safety Steel-Toe Boots', 'safety', 'clothes', 960, 2, 'Zero foot injuries on construction sites.'],
      ['Respirator Gas Mask', 'safety', 'clothes', 780, 1, 'Protects lungs in Mines & Chem Labs.'],
      ['Solar Power Station (2kWh)', 'energy', 'solar', 9400, 19, 'Silent portable backup electricity.']
    ];
    hwSpecs.forEach(([nm, need, uType, baseC, w, eff], hi) => {
      tiers.forEach((tier, ti) => {
        pushItem({
          id: `hw_${idx++}`, cat: 'Hardware', subCat: uType, name: `${tier} ${nm}`,
          cost: Math.round(baseC * (0.65 + ti * 0.45)), need, usableType: uType,
          weightKg: w, originCid: origins[(hi + ti) % origins.length],
          tags: nm.toLowerCase().includes('winter') ? ['winter', 'hardware'] : ['hardware'],
          effect: eff
        });
      });
    });

    const clothSpecs = [
      ['Everyday Cotton T-Shirt Pack', 'clothing', 350, 1, ['fashion'], 'Breathable clean everyday wear.'],
      ['Selvedge Denim Jeans', 'clothing', 780, 1, ['fashion'], 'Durable work & street trousers.'],
      ['Tailored Business Blazer', 'clothing', 2400, 2, ['fashion'], '+10 Interview Confidence & Formal Look.'],
      ['Wool Overcoat', 'clothing', 2900, 3, ['winter', 'wool'], 'Zero cold penalty in freezing climates.'],
      ['Running Sneakers', 'transport', 1450, 1, ['sports'], '-15% Energy cost on walking & gym.'],
      ['Traditional Agbada / Kente Robe', 'clothing', 3200, 2, ['kente', 'agbada'], '+12 Cultural Community Respect in celebrations.'],
      ['Embroidered Silk Kimono / Sari', 'clothing', 3600, 2, ['kimono', 'sari'], 'High-prestige formal ceremonial attire.'],
      ['Waterproof Rain Shell', 'safety', 1200, 1, ['winter'], 'Keeps dry & healthy in monsoon/rain storms.'],
      ['School Uniform Bundle', 'learning', 650, 1, ['fashion'], 'Required neat attire for Primary/High School.'],
      ['Arctic Snow Parka', 'safety', 3800, 3, ['winter'], 'Survives -30C arctic winters safely.'],
      ['Thermal Merino Socks & Gloves', 'clothing', 450, 1, ['winter', 'wool'], 'Stops frostbite in cold cities.'],
      ['Hi-Vis Safety Vest', 'safety', 290, 1, ['hardware'], 'Mandatory PPE on Logistics & Tender sites.'],
      ['Leather Dress Shoes', 'clothing', 1850, 2, ['leather'], 'Polished appearance for Banks & Court.'],
      ['Classic Wristwatch', 'work', 2600, 1, ['luxury'], 'Punctuality & executive presence.'],
      ['Sports Tracksuit', 'energy', 950, 1, ['sports'], '+10% Gym & Athletics gains.'],
      ['Polarized UV Sunglasses', 'safety', 680, 1, ['fashion'], 'Glare protection for Pilots & Drivers.'],
      ['Canvas Work Overalls', 'work', 880, 2, ['hardware'], 'Protects clothes during Garage & Farm work.'],
      ['Evening Gown / Tuxedo', 'social', 5400, 2, ['fashion', 'luxury'], 'VIP Gala & Date charisma boost.'],
      ['Traditional Thobe / Kaftan', 'clothing', 1900, 1, ['cotton'], 'Cool breathable attire for desert climates.'],
      ['Backpack (40L Travel)', 'transport', 920, 1, ['sports'], 'Organized carry for flights & school.'],
      ['Leather Briefcase', 'work', 2100, 2, ['leather'], '+5 Lawyer & Corporate respect.']
    ];
    clothSpecs.forEach(([nm, need, baseC, w, tags, eff], ci) => {
      tiers.forEach((tier, ti) => {
        pushItem({
          id: `clo_${idx++}`, cat: 'Clothes', subCat: 'clothes', name: `${tier} ${nm}`,
          cost: Math.round(baseC * (0.65 + ti * 0.4)), need, usableType: 'clothes',
          weightKg: w, originCid: origins[(ci + ti) % origins.length], tags, effect: eff
        });
      });
    });

    const foodSpecs = [
      ['Basmati Rice (5kg)', 'hunger', 180, 5, ['food_za']],
      ['Whole Grain Bread Loaf', 'hunger', 45, 1, ['bakery']],
      ['Fresh Farm Eggs (30)', 'hunger', 130, 2, ['farming']],
      ['Grilled Chicken Pack', 'hunger', 220, 2, ['farming']],
      ['Smoked Pork Bacon Pack', 'hunger', 240, 1, ['pork']],
      ['Pepperoni Gourmet Pizza', 'hunger', 290, 1, ['pork', 'pasta']],
      ['Craft Vintage Wine Bottle', 'social', 650, 2, ['wine', 'alcohol']],
      ['Imported Single Malt Scotch', 'social', 1400, 2, ['alcohol']],
      ['Mineral Spring Water (12L)', 'thirst', 95, 12, ['water']],
      ['Fresh Mango & Citrus Crate', 'hunger', 160, 4, ['cocoa']],
      ['Single-Origin Roasted Coffee', 'energy', 280, 1, ['coffee']],
      ['Ceremonial Green Matcha Tea', 'thirst', 340, 1, ['tea']],
      ['Wild Atlantic Salmon Fillet', 'health', 480, 2, ['seafood']],
      ['Spiced Beef Biltong Pack', 'hunger', 260, 1, ['food_za']],
      ['Jollof Spice & Rice Bundle', 'hunger', 210, 3, ['food_gh']],
      ['Royal Medjool Dates Box', 'hunger', 320, 1, ['dates']],
      ['Greek Olive Oil (1L)', 'health', 290, 1, ['pasta']],
      ['Raw Organic Honey Jar', 'health', 190, 1, ['farming']],
      ['Protein Whey Shake Tub', 'energy', 780, 2, ['sports']],
      ['Heirloom Vegetable Seed Pack', 'hunger', 110, 1, ['farming']]
    ];
    foodSpecs.forEach(([nm, need, baseC, w, tags], foi) => {
      const variants = nm.includes('Seed') ? ['Starter', 'Hybrid', 'Organic', 'Heirloom', 'Pro'] : ['Small', 'Family', 'Bulk', 'Gourmet', 'Reserve'];
      variants.forEach((vr, vi) => {
        const isSeeds = nm.includes('Seed');
        pushItem({
          id: `fod_${idx++}`, cat: 'Food', subCat: isSeeds ? 'seeds' : (need === 'thirst' ? 'drink' : 'food'),
          name: `${vr} ${nm}`, cost: Math.round(baseC * (0.7 + vi * 0.35)), need,
          usableType: isSeeds ? 'seeds' : 'food', paintable: false, weightKg: w,
          originCid: origins[(foi + vi) % origins.length], tags,
          effect: isSeeds ? 'Plant in House Garden/Pot to grow free Food!' : `Fresh nutrition (+${need}). Store in Fridge to prevent 48h spoilage!`
        });
      });
    });

    const medSpecs = [
      ['Antiseptic & Bandage Kit', 'health', 180, 'Stops cuts & wound infections.'],
      ['Prescription Antibiotic Pack', 'health', 450, 'Clears bacterial fever fast.'],
      ['Electrolyte Oral Hydration Pack', 'thirst', 140, 'Rapid Thirst & Energy recovery.'],
      ['Insulin & Metabolic Kit', 'health', 680, 'Maintains chronic metabolic stability.'],
      ['Asthma Bronchodilator Inhaler', 'health', 390, 'Protects breathing during smog crises.'],
      ['Hand Sanitizer & Soap Bulk', 'hygiene', 150, '+20% Hygiene & infection defense.'],
      ['Dental Care Fluoride Kit', 'hygiene', 190, 'Prevents toothache & boosts Looks +2.'],
      ['Allergy Antihistamine Box', 'health', 210, 'Stops seasonal pollen fatigue.'],
      ['Herbal Sleep & Stress Tea', 'energy', 240, '+12 Sanity & calm sleep.'],
      ['Digital Blood Pressure Cuff', 'safety', 890, 'Early warning before health drops.'],
      ['Paramedic Trauma Splint Kit', 'safety', 1200, 'Critical care on expeditions.'],
      ['Vitamin D3 + Zinc Boost', 'health', 260, '+10% Winter immunity.'],
      ['Eyedrops & Lens Care', 'health', 170, 'Relieves screen fatigue for Coders.'],
      ['Muscle Recovery Gel', 'energy', 290, 'Halves soreness after Gym/Mining.'],
      ['Thermal Fever Thermometer', 'health', 220, 'Track illness temperature cleanly.'],
      ['Mosquito Net & Repellent', 'safety', 310, 'Prevents tropical malaria risk.'],
      ['Sunburn Aloe Vera Gel', 'hygiene', 180, 'Heals heat exposure quickly.'],
      ['Complete Home Pharmacy Cabinet', 'health', 1950, '+25 Health emergency reserve.']
    ];
    medSpecs.forEach(([nm, need, baseC, eff], mi) => {
      ['Standard', 'Clinical', 'Pro Care'].forEach((vr, vi) => {
        pushItem({
          id: `med_${idx++}`, cat: 'Medicine', subCat: 'medicine', name: `${vr} ${nm}`,
          cost: Math.round(baseC * (0.8 + vi * 0.4)), need, usableType: 'medicine',
          paintable: false, weightKg: 1, originCid: origins[(mi + vi) % origins.length], tags: ['pharma', 'med'], effect: eff
        });
      });
    });

    const schSpecs = [
      ['Mathematics Mastery Textbook', 'learning', 'book', 420, 'Read up to 3x (+5 Smarts & +20 Learning/read).'],
      ['Full-Stack Engineering Manual', 'learning', 'book', 680, 'Boosts Coding & Dev Studio promotions (3x cap).'],
      ['Medical Anatomy Atlas', 'learning', 'book', 890, 'Boosts Bio/Med exam pass chance (3x cap).'],
      ['Global Law & Constitution Guide', 'learning', 'book', 760, 'Boosts Court appeals & Law career (3x cap).'],
      ['Financial Accounting Handbook', 'learning', 'book', 640, 'Unlocks smarter Investments & Audits (3x cap).'],
      ['Scientific Graphing Calculator', 'learning', 'general', 950, '+15% Exam accuracy in Math/Physics.'],
      ['Chemistry Glassware & Beakers', 'learning', 'lab', 1400, 'Hands-on Chemistry lab prep.'],
      ['Forensic Fingerprint Kit', 'learning', 'microscope', 2200, 'Analyze evidence & trace samples.'],
      ['Engineering CAD Drafting Set', 'work', 'general', 780, 'Technical blueprint accuracy.'],
      ['Hardcover Study Notebooks (10x)', 'learning', 'book', 240, 'Organizes school & lecture notes (3x cap).'],
      ['Astronomy Refractor Telescope', 'learning', 'microscope', 3100, 'Space observation & Science XP.'],
      ['Biology Dissection & Slide Kit', 'learning', 'microscope', 1650, 'Inspect cell slides cleanly.'],
      ['Language Phrase Dictionary', 'communication', 'book', 380, 'Faster assimilation when traveling abroad.'],
      ['Exam Flashcard Cram Pack', 'learning', 'book', 260, '+10% Cert quiz readiness (3x cap).'],
      ['Solar Student Study Lamp', 'learning', 'general', 490, 'Study comfortably during blackouts.']
    ];
    schSpecs.forEach(([nm, need, uType, baseC, eff], sci) => {
      ['Student', 'Honors', 'University', 'Reference'].forEach((vr, vi) => {
        pushItem({
          id: `sch_${idx++}`, cat: 'School', subCat: uType, name: `${vr} ${nm}`,
          cost: Math.round(baseC * (0.7 + vi * 0.35)), need, usableType: uType,
          weightKg: 2, originCid: origins[(sci + vi) % origins.length], tags: ['books'], effect: eff
        });
      });
    });

    const wrkSpecs = [
      ['Legal Briefcase & Bar Stamp', 'work', 'gear', 2400, 'Boosts Lawyer court win rate.'],
      ['Chief Chef Damascus Knife Set', 'work', 'gear', 2800, '+25% Culinary & Restaurant pay.'],
      ['Mechanic Diagnostic OBD Scanner', 'work', 'gear', 3900, 'Fast vehicle diagnostics for Logistics.'],
      ['Digital Stethoscope & Scrubs', 'work', 'gear', 2200, 'Mandatory Hospital clinical kit.'],
      ['Architect Laser Level & Roll', 'work', 'gear', 3100, '+20% Construction Tender quality.'],
      ['Barista Espresso Grinder Rig', 'work', 'gear', 4500, 'Launch Café & Food Cart income.'],
      ['DJ Controller & Studio Mic', 'social', 'guitar', 5200, 'Produce Music tracks & Gig revenue.'],
      ['Tailor Industrial Sewing Rig', 'work', 'gear', 3400, 'Craft & repair Custom Suits.'],
      ['Commercial Delivery Cargo Rack', 'transport', 'gear', 2600, 'Carry more courier freight safely.'],
      ['Precision Lab Pipette Set', 'work', 'lab', 1950, 'Bio/Pharma R&D accuracy boost.'],
      ['Portable POS Card Terminal', 'work', 'gear', 1450, 'Accept instant digital customer payments.'],
      ['Cybersecurity Hardware Key', 'safety', 'gear', 1100, 'Zero account phishing on Work PCs.'],
      ['Heavy Forklift License Manual', 'work', 'book', 720, 'Warehouse logistics credential prep.'],
      ['Commercial Cleaning Buffer', 'hygiene', 'gear', 3600, 'Clean offices & apartments fast.']
    ];
    wrkSpecs.forEach(([nm, need, uType, baseC, eff], wi) => {
      ['Apprentice', 'Journeyman', 'Master', 'Enterprise'].forEach((vr, vi) => {
        pushItem({
          id: `wrk_${idx++}`, cat: 'Work', subCat: uType, name: `${vr} ${nm}`,
          cost: Math.round(baseC * (0.7 + vi * 0.4)), need, usableType: uType,
          weightKg: 4, originCid: origins[(wi + vi) % origins.length], tags: ['work'], effect: eff
        });
      });
    });

    const culSpecs = [
      ['Acoustic Steel-String Guitar', 'social', 'guitar', 2200, '+4 Singing/Music & +8 Happiness per session.'],
      ['Weighted 88-Key Digital Piano', 'social', 'guitar', 5400, 'Compose hits & perform paid concerts.'],
      ['Traditional Djembe Talking Drum', 'social', 'guitar', 1650, 'Cultural rhythm & community celebrations.'],
      ['Leather Soccer Ball & Cones', 'energy', 'general', 420, '+6 Fitness & School Athletics boost.'],
      ['Handcrafted Wooden Chess Board', 'learning', 'general', 850, '+3 Smarts & focus per match.'],
      ['Mountain Camping Tent (2-Person)', 'shelter', 'tent', 2100, 'Safe Shelter outdoors & hiking camps.'],
      ['Deep-Sea Fishing Rod & Tackle', 'hunger', 'gear', 1900, 'Catch fresh fish & Sport trophies.'],
      ['Luxury Oud & Jasmine Perfume', 'hygiene', 2400, 2400, '+8 Attraction & Social confidence.'],
      ['Yoga Mat & Resistance Bands', 'health', 'general', 580, 'Home Fitness & Stress relief.'],
      ['Classic Hardback Novel Collection', 'learning', 'book', 690, 'Boosts Writing & Empathy (+3 reads max).'],
      ['Oil Painting Easel & Palette', 'social', 'paint', 1500, 'Paint masterpieces & sell for profit.'],
      ['Shortwave Emergency World Radio', 'communication', 'general', 980, 'News updates even during internet blackouts.'],
      ['Carbon Trekking Poles (Pair)', 'transport', 'gear', 820, 'Saves -20% Energy on steep mountain hikes.'],
      ['Family Board Games Box', 'social', 'general', 640, '+12 Family & Friend Bond per night.']
    ];
    culSpecs.forEach(([nm, need, uType, baseC, eff], cui) => {
      const actualCost = typeof baseC === 'number' ? baseC : 1200;
      const actualType = typeof uType === 'string' ? uType : 'general';
      ['Folk', 'Studio', 'Concert', 'Heritage'].forEach((vr, vi) => {
        pushItem({
          id: `cul_${idx++}`, cat: 'Culture', subCat: actualType, name: `${vr} ${nm}`,
          cost: Math.round(actualCost * (0.7 + vi * 0.42)), need, usableType: actualType,
          weightKg: 3, originCid: origins[(cui + vi) % origins.length],
          tags: nm.includes('Perfume') ? ['perfume', 'luxury'] : nm.includes('Guitar') || nm.includes('Piano') || nm.includes('Drum') ? ['music'] : ['art'],
          effect: typeof eff === 'string' ? eff : 'Cultural enrichment & community joy.'
        });
      });
    });

    while (list.length < 1123) {
      const b = list[(list.length * 7) % 180];
      pushItem({
        id: `ext_${list.length + 1}`,
        cat: b.cat, subCat: b.subCat,
        name: `${b.name} (Edition ${(list.length % 9) + 2})`,
        cost: Math.round(b.cost * (0.85 + (list.length % 5) * 0.12)),
        need: b.need, usableType: b.usableType, roomReq: b.roomReq,
        weightKg: b.weightKg, originCid: origins[list.length % origins.length],
        tags: b.tags, effect: b.effect, missEffect: b.missEffect
      });
    }
    return list;
  })();

  /* ============================================================
     3. CORE CATALOGS: HOUSES, CARS, COURSES, COMPANIES, 366 JOBS,
        MINING, DEV, INNOVATION, FOODS (109), LUXURY (32), SUPPLIERS (1045),
        AIRPORT TICKETS, HOBBIES, LOGISTICS, TENDERS, AUCTIONS, MAFIA
     ============================================================ */
  const HOUSES_CATALOG = [
    { id: 'hs_studio', name: 'City Studio Apartment', cost: 202500, rent: 2400, maint: 450, app: 0.055, beds: 1, rooms: { bedroom: 1, living: 1, kitchen: 1, bathroom: 1, office: 1, outdoor: 0 } },
    { id: 'hs_town', name: 'Suburban 2-Bed Townhouse', cost: 580000, rent: 6200, maint: 1100, app: 0.06, beds: 2, rooms: { bedroom: 2, living: 1, kitchen: 1, bathroom: 2, office: 1, outdoor: 1 } },
    { id: 'hs_family', name: 'Modern 3-Bed Family Home', cost: 1150000, rent: 11800, maint: 2100, app: 0.065, beds: 3, rooms: { bedroom: 3, living: 2, kitchen: 1, bathroom: 2, office: 1, outdoor: 1 } },
    { id: 'hs_farm', name: 'Commercial Farmhouse + 5 Acres', cost: 1750000, rent: 16500, maint: 3200, app: 0.07, beds: 4, rooms: { bedroom: 4, living: 2, kitchen: 2, bathroom: 3, office: 2, outdoor: 3 } },
    { id: 'hs_pent', name: 'Skyline Glass Penthouse', cost: 3400000, rent: 32000, maint: 5800, app: 0.075, beds: 3, rooms: { bedroom: 3, living: 2, kitchen: 1, bathroom: 3, office: 2, outdoor: 1 } },
    { id: 'hs_mansion', name: 'Gated Luxury Mansion', cost: 7200000, rent: 68000, maint: 11500, app: 0.08, beds: 6, rooms: { bedroom: 6, living: 4, kitchen: 2, bathroom: 5, office: 3, outdoor: 3 } }
  ];

  const CARS_CATALOG = [
    { id: 'car_hatch', name: 'Compact City Hatchback', cost: 95000, tank: 42, burn: 8, rentDay: 450, status: 'Reliable' },
    { id: 'car_corolla', name: 'Toyota Corolla Sedan', cost: 185000, tank: 50, burn: 9, rentDay: 850, status: 'Everyday' },
    { id: 'car_bakkie', name: '4x4 Work Bakkie / Pickup', cost: 320000, tank: 75, burn: 14, rentDay: 1450, status: 'Utility' },
    { id: 'car_bmw', name: 'BMW 3-Series Executive', cost: 540000, tank: 60, burn: 12, rentDay: 2400, status: 'Executive' },
    { id: 'car_merc', name: 'Mercedes-Benz G-Wagon', cost: 1450000, tank: 90, burn: 18, rentDay: 6200, status: 'Luxury' },
    { id: 'car_lambo', name: 'Lamborghini Huracan', cost: 3800000, tank: 80, burn: 22, rentDay: 14000, status: 'Supercar' }
  ];

  const COURSES_AND_CERTS = [
    { id: 'cert_drive', type: 'Cert', name: 'Official Driving License', cost: 1500, smartsReq: 0, benefit: 'Required for Driver/Courier/Taxi roles & driving own cars.',
      qs: [
        { q: 'At an octagon red STOP sign, you must:', a: ['Come to a complete stop before the line', 'Slow down to 20km/h only', 'Honk and proceed'], ok: 0 },
        { q: 'Double solid center lines on a highway indicate:', a: ['No overtaking from either direction', 'Passing allowed at night', 'Bus lane only'], ok: 0 },
        { q: 'During heavy rain, following distance behind the car ahead should:', a: ['Double to allow longer braking distance', 'Shrink to stay in their spray', 'Remain bumper-to-bumper'], ok: 0 },
        { q: 'Before changing lanes you must:', a: ['Check mirrors, blind spot, and signal', 'Turn wheel quickly without signaling', 'Flash hazard lights'], ok: 0 }
      ]
    },
    { id: 'cert_firstaid', type: 'Cert', name: 'First Aid & CPR Certificate', cost: 1800, smartsReq: 15, benefit: 'Unlocks Paramedic/Lifeguard roles & saves injured hikers.',
      qs: [
        { q: 'Recommended chest compression rate in adult CPR:', a: ['100–120 compressions per minute', '30 compressions per minute', '200 rapid taps'], ok: 0 },
        { q: 'First immediate step for severe external limb bleeding:', a: ['Apply firm direct pressure with clean cloth', 'Wash with cold soda', 'Ignore for 10 minutes'], ok: 0 },
        { q: 'Before approaching an accident victim, you must first:', a: ['Check that the scene is safe for you', 'Move the victim immediately by arms', 'Give them a large meal'], ok: 0 },
        { q: 'If a conscious adult is choking and cannot speak or cough:', a: ['Perform abdominal thrusts (Heimlich)', 'Give them water to swallow', 'Lay them flat immediately'], ok: 0 }
      ]
    },
    { id: 'cert_food', type: 'Cert', name: 'Food Safety & Hygiene Cert', cost: 1200, smartsReq: 10, benefit: 'Unlocks Chef, Bakery, & Hospitality Supervisor careers.',
      qs: [
        { q: 'Temperature danger zone where bacteria multiply rapidly:', a: ['5°C to 60°C', '-18°C to 0°C', '85°C to 100°C'], ok: 0 },
        { q: 'Raw poultry and ready-to-eat salads must use:', a: ['Separate color-coded cutting boards', 'The same knife wiped on an apron', 'Same board rinsed cold'], ok: 0 },
        { q: 'Minimum handwashing scrub duration with soap & warm water:', a: ['20 seconds', '3 seconds', 'Rinse only'], ok: 0 }
      ]
    },
    { id: 'cert_code', type: 'Cert', name: 'Full-Stack Coding Certificate', cost: 4500, smartsReq: 40, benefit: '+20 Smarts · Unlocks Tech, Dev Studio & Cyber careers.',
      qs: [
        { q: 'Which HTTP status code indicates a resource was not found?', a: ['404', '200', '301'], ok: 0 },
        { q: 'What prevents SQL injection when querying relational databases?', a: ['Parameterized queries / prepared statements', 'Concatenating raw user strings', 'Disabling TLS'], ok: 0 },
        { q: 'Time complexity of binary search on a sorted array of n items:', a: ['O(log n)', 'O(n^2)', 'O(n!)'], ok: 0 },
        { q: 'In Git version control, which command creates a local copy of a remote repo?', a: ['git clone', 'git erase', 'git drop'], ok: 0 }
      ]
    },
    { id: 'cert_teach', type: 'Cert', name: 'Teaching & Pedagogy Diploma', cost: 3500, smartsReq: 45, benefit: 'Unlocks Teacher, Tutor & Principal roles.',
      qs: [
        { q: 'Formative assessment is primarily used to:', a: ['Monitor learning progress during instruction to adjust teaching', 'Punish late homework only', 'Replace final exams forever'], ok: 0 },
        { q: 'Effective classroom conflict de-escalation begins with:', a: ['Calm tone, active listening & private conversation', 'Publicly shaming the learner', 'Throwing chalk'], ok: 0 },
        { q: 'A fair grading rubric gives learners:', a: ['Clear transparent criteria before submission', 'Random points after grading', 'Secret rules never shared'], ok: 0 }
      ]
    },
    { id: 'cert_med', type: 'Degree', name: 'Medical MD & Clinical Licence', cost: 24000, smartsReq: 75, benefit: 'Unlocks Doctor, Surgeon & Biotech Director.',
      qs: [
        { q: 'Normal resting adult heart rate range is:', a: ['60 to 100 beats per minute', '15 to 25 bpm', '160 to 220 bpm'], ok: 0 },
        { q: 'Anaphylactic shock first-line emergency medication:', a: ['Intramuscular epinephrine (adrenaline)', 'Oral vitamin C', 'Ice pack on foot'], ok: 0 },
        { q: 'Blood vessel carrying oxygenated blood from lungs to left atrium:', a: ['Pulmonary vein', 'Inferior vena cava', 'Coronary sinus'], ok: 0 }
      ]
    },
    { id: 'cert_law', type: 'Degree', name: 'LLB Law & Bar Admission', cost: 19500, smartsReq: 70, benefit: 'Unlocks Lawyer, Prosecutor & Judge careers.',
      qs: [
        { q: 'Standard of proof required in criminal trials:', a: ['Beyond a reasonable doubt', 'Casual suspicion', 'Coin toss'], ok: 0 },
        { q: 'Burden of proof in a criminal prosecution rests on:', a: ['The Prosecution / State', 'The Defense witness', 'The Bailiff'], ok: 0 },
        { q: 'Fiduciary duty requires a director to act:', a: ['In good faith and best interest of beneficiaries', 'For secret personal gain', 'With reckless disregard'], ok: 0 }
      ]
    }
  ];

  const JOBS_SECTOR_DEFS = [
    ['Healthcare', 4200, 'Dr. Evelyn Hunt', ['Medical Insurance', 'Paid Leave'], ['Upcode Billing', 'Divert Narcotics', 'Sell Patient Data']],
    ['Tech/IT', 4800, 'Marcus Chen', ['Remote Hybrid', 'Stock Options'], ['Backdoor Telemetry', 'Sell API Keys', 'Fake Sprint Invoices']],
    ['Finance', 4500, 'Victoria Sterling', ['Annual Bonus', 'Pension'], ['Skim Fee Rounding', 'Inside Trade Tip', 'Ghost Client Loan']],
    ['Law', 4600, 'Justice R. Kofi', ['Bar Stipend', 'Car Allowance'], ['Leak Sealed Brief', 'Bribe Clerk', 'Pad Billable Hours']],
    ['Education', 2900, 'Principal Grace', ['Long Holidays', 'Tuition Aid'], ['Sell Exam Key', 'Ghost Tutoring Payroll', 'Kickback Textbook Order']],
    ['Trades', 2600, 'Foreman Pete', ['Overtime 1.5x', 'Tool Stipend'], ['Copper Cable Theft', 'Fake Materials Invoice', 'Skip Safety Check']],
    ['Hospitality', 1800, 'Chef Antonio', ['Staff Meals', 'Tips'], ['Skim Cash Register', 'Pocket Bar Stock', 'Water Down Bottles']],
    ['Retail', 1750, 'Manager Priya', ['Staff Discount', 'Commission'], ['Void Receipt Pocket Cash', 'Backdoor Inventory', 'Fake Refund']],
    ['Logistics', 2400, 'Dispatcher Musa', ['Fuel Card', 'Trip Bonus'], ['Siphon Diesel', 'Ghost Manifest Cargo', 'Sell Damaged Stock']],
    ['Media', 3200, 'Producer Chloe', ['Gear Access', 'Travel Perks'], ['Payola Track Plug', 'Leak Celebrity Photo', 'Fudge Ad Reach']],
    ['Sports', 3800, 'Coach Diego', ['Physio Care', 'Prize Bonus'], ['Point Shaving Fix', 'Sell Locker Intel', 'Fudge Ticket Gate']],
    ['Government', 3100, 'Director Mensah', ['Pension', 'Medical Aid'], ['Tender Kickback', 'Ghost Worker Payroll', 'Expedite Bribe']],
    ['Science', 4300, 'Prof. A. Patel', ['Grant Bonus', 'Lab Travel'], ['Fudge Trial Results', 'Sell Sample Strain', 'Double-Bill Grant']],
    ['Creative', 2700, 'Director Elena', ['Studio Pass', 'Royalties'], ['Resell Client Assets', 'Plagiarize Draft', 'Pad Props Budget']],
    ['Mining', 3400, 'Mine Boss Bheki', ['Hazard Pay', 'Housing'], ['Smuggle Uncut Ore', 'Bypass Blast Log', 'Resell Explosive Detonators']],
    ['Agriculture', 2200, 'Agronomist Sam', ['Farm Produce', 'Housing'], ['Dilute Fertilizer Batch', 'Sell Livestock Unlogged', 'Claim Fake Crop Loss']],
    ['Aviation', 5400, 'Capt. Sarah Cole', ['Free Flights', 'Hotel Stay'], ['Smuggle Duty-Free Carton', 'Sell VIP Lounge Passes', 'Fudge Cargo Weight']],
    ['Real Estate', 3700, 'Broker D. Brooks', ['High Commission', 'Car Bonus'], ['Pocket Holding Deposit', 'Fake Repair Quote', 'Kickback Staging']],
    ['Security', 2300, 'Chief R. Steele', ['Night Bonus', 'Uniform'], ['Look Away At Gate', 'Sell Access Badge', 'Disable Camera'],],
    ['Military/Rescue', 3300, 'Cmdr. T. Silva', ['Base Housing', 'Full Medical'], ['Sell Surplus Rations', 'Fudge Fuel Log', 'Auction Decomm Gear']]
  ];

  const ROLE_PREFIXES = ['Junior', 'Associate', 'Senior', 'Lead', 'Chief', 'Field', 'Clinical', 'Regional', 'Principal', 'Executive', 'Specialist', 'Shift', 'Assistant', 'Operations', 'Technical', 'Master', 'Site', 'Certified', 'Director of'];
  const ROLE_BASES = {
    Healthcare: ['Nurse', 'Doctor', 'Surgeon', 'Pharmacist', 'Paramedic', 'Dentist'],
    'Tech/IT': ['Developer', 'DevOps Engineer', 'QA Analyst', 'Cyber Analyst', 'AI Researcher', 'Cloud Architect'],
    Finance: ['Accountant', 'Bank Teller', 'Auditor', 'Investment Analyst', 'Tax Consultant'],
    Law: ['Paralegal', 'Defense Lawyer', 'Corporate Counsel', 'Prosecutor', 'Mediator'],
    Education: ['Primary Teacher', 'High School Tutor', 'Lecturer', 'Curriculum Coach', 'Dean'],
    Trades: ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'HVAC Technician'],
    Hospitality: ['Barista', 'Sous Chef', 'Head Chef', 'Hotel Concierge', 'Sommelier'],
    Retail: ['Cashier', 'Store Supervisor', 'Merchandising Rep', 'Branch Buyer'],
    Logistics: ['Courier Driver', 'Forklift Operator', 'Fleet Dispatcher', 'Customs Broker'],
    Media: ['News Reporter', 'Video Editor', 'Podcast Producer', 'Anchor'],
    Sports: ['Fitness Trainer', 'Pro Scout', 'Referee', 'Club Coach'],
    Government: ['Civic Clerk', 'City Inspector', 'Policy Officer', 'Diplomatic Attache'],
    Science: ['Lab Technician', 'Microbiologist', 'Forensic Scientist', 'Chem Researcher'],
    Creative: ['Graphic Designer', 'Interior Stylist', 'Musician', 'Film Editor'],
    Mining: ['Mine Driller', 'Geologist', 'Blasting Tech', 'Shaft Safety Officer'],
    Agriculture: ['Crop Agronomist', 'Dairy Manager', 'Hydroponics Tech', 'Livestock Vet'],
    Aviation: ['Cabin Attendant', 'First Officer', 'Airline Captain', 'Air Traffic Controller'],
    'Real Estate': ['Letting Agent', 'Property Appraiser', 'Commercial Broker', 'Project Dev'],
    Security: ['Site Guard', 'CCTV Operator', 'Armored Cash Guard', 'Cyber Watch'],
    'Military/Rescue': ['Firefighter', 'Coastguard Rescue', 'Logistics Officer', 'K9 Handler']
  };

  const JOBS_CATALOG = (() => {
    const out = [];
    let jid = 1;
    JOBS_SECTOR_DEFS.forEach(([sector, baseSal, boss, benefits, crimes]) => {
      const bases = ROLE_BASES[sector] || ['Specialist'];
      ROLE_PREFIXES.forEach((pref, pi) => {
        if (out.length >= 366) return;
        const base = bases[pi % bases.length];
        const tier = Math.min(5, 1 + Math.floor(pi / 4));
        const mult = 0.55 + tier * 0.42;
        out.push({
          id: `job_${jid++}`,
          title: `${pref} ${base}`,
          sector,
          tier,
          salary: Math.round(baseSal * mult),
          hours: 150 + (pi % 4) * 10,
          boss,
          benefits,
          req: tier <= 1 ? 'Age 16+ · Basic Literacy' : tier === 2 ? 'High School / Cert' : `Smarts ${25 + tier * 12}+`,
          smartsReq: tier <= 1 ? 0 : 15 + tier * 10,
          crimes: crimes.map((cn, ci) => ({
            name: cn,
            gain: [Math.round((800 + tier * 500) * (1 + ci * 0.4)), Math.round((2400 + tier * 1400) * (1 + ci * 0.5))],
            risk: 15 + ci * 14,
            ethPenalty: 12 + ci * 8
          }))
        });
      });
    });
    return out;
  })();

  const ALL_COMPANY_TYPES = [
    { name: 'Coffee Shop / Cafe', reg: 4500, lic: 3000, cap: 25000, rent: 6500, empSal: 3200, rev: 18500 },
    { name: 'Tech & SaaS Studio', reg: 6500, lic: 4000, cap: 35000, rent: 8500, empSal: 6800, rev: 34000 },
    { name: 'Logistics & Trucking Co', reg: 9500, lic: 8000, cap: 85000, rent: 12000, empSal: 4500, rev: 46000 },
    { name: 'Private Security Firm', reg: 7000, lic: 12000, cap: 40000, rent: 6000, empSal: 3800, rev: 28000 },
    { name: 'Fast Food Franchise', reg: 8000, lic: 15000, cap: 60000, rent: 11000, empSal: 3000, rev: 35000 },
    { name: 'Pharmacy & Clinic', reg: 12000, lic: 18000, cap: 95000, rent: 14000, empSal: 7200, rev: 52000 },
    { name: 'Solar Energy Installer', reg: 8500, lic: 9000, cap: 55000, rent: 7500, empSal: 5400, rev: 38000 },
    { name: 'Construction Contractor', reg: 11000, lic: 14000, cap: 110000, rent: 9500, empSal: 4800, rev: 58000 },
    { name: 'Boutique Fashion Brand', reg: 5500, lic: 3500, cap: 32000, rent: 7800, empSal: 3600, rev: 24000 },
    { name: 'E-Commerce Drop Hub', reg: 4000, lic: 2500, cap: 22000, rent: 4200, empSal: 3900, rev: 23000 },
    { name: 'Car Wash & Auto Detailing', reg: 4200, lic: 3200, cap: 28000, rent: 5500, empSal: 2900, rev: 19500 },
    { name: 'Private Tutoring Academy', reg: 3800, lic: 2800, cap: 18000, rent: 5000, empSal: 4200, rev: 21000 },
    { name: 'Mining Exploration Co', reg: 25000, lic: 35000, cap: 250000, rent: 15000, empSal: 6500, rev: 115000 },
    { name: 'Record Label & Studio', reg: 6800, lic: 5000, cap: 45000, rent: 8000, empSal: 4600, rev: 31000 },
    { name: 'Gym & Wellness Club', reg: 7500, lic: 6000, cap: 75000, rent: 14500, empSal: 3900, rev: 37000 },
    { name: 'BioTech R&D Lab', reg: 22000, lic: 28000, cap: 190000, rent: 18000, empSal: 9500, rev: 94000 },
    { name: 'Commercial Bakery', reg: 4800, lic: 3600, cap: 34000, rent: 6800, empSal: 3100, rev: 22500 },
    { name: 'Real Estate Agency', reg: 8000, lic: 9500, cap: 45000, rent: 9200, empSal: 5100, rev: 41000 },
    { name: 'Legal & Tax Consultancy', reg: 9000, lic: 11000, cap: 38000, rent: 10500, empSal: 7800, rev: 47000 },
    { name: 'Organic Greenhouse Farm', reg: 5500, lic: 4500, cap: 62000, rent: 6000, empSal: 3000, rev: 29000 },
    { name: 'Import / Export Trading', reg: 10500, lic: 12500, cap: 90000, rent: 9800, empSal: 5200, rev: 51000 },
    { name: 'Film & Ad Production', reg: 7200, lic: 5500, cap: 52000, rent: 9000, empSal: 5600, rev: 36000 },
    { name: 'Hardware & Timber Yard', reg: 8800, lic: 6500, cap: 78000, rent: 11200, empSal: 3700, rev: 43000 },
    { name: 'Auto Repair Workshop', reg: 6400, lic: 5800, cap: 58000, rent: 8200, empSal: 4300, rev: 32500 },
    { name: 'Micro-Finance Lender', reg: 18000, lic: 24000, cap: 160000, rent: 11000, empSal: 6400, rev: 74000 },
    { name: 'Travel & Safari Tours', reg: 6200, lic: 7000, cap: 48000, rent: 7200, empSal: 4100, rev: 33000 },
    { name: 'Drone Delivery Startup', reg: 11500, lic: 14500, cap: 92000, rent: 8800, empSal: 6900, rev: 53000 },
    { name: 'Cosmetics Lab & Brand', reg: 7400, lic: 8200, cap: 54000, rent: 8400, empSal: 4700, rev: 36500 },
    { name: 'Printing & Packaging Co', reg: 5900, lic: 4100, cap: 49000, rent: 7600, empSal: 3500, rev: 28500 },
    { name: 'Cold Storage Warehouse', reg: 12500, lic: 9800, cap: 120000, rent: 13500, empSal: 4400, rev: 56000 },
    { name: 'Daycare & Preschool', reg: 5200, lic: 6800, cap: 39000, rent: 8600, empSal: 3400, rev: 26500 },
    { name: 'Cybersecurity SOC Firm', reg: 14000, lic: 16000, cap: 85000, rent: 11500, empSal: 8800, rev: 68000 },
    { name: 'Renewable Microgrid Co', reg: 21000, lic: 22000, cap: 180000, rent: 12000, empSal: 7100, rev: 88000 },
    { name: 'Furniture Factory', reg: 7800, lic: 5400, cap: 68000, rent: 9600, empSal: 3800, rev: 39000 },
    { name: 'Courier Bike Fleet', reg: 4600, lic: 3800, cap: 31000, rent: 5400, empSal: 3100, rev: 22000 },
    { name: 'Private Jet Charter', reg: 45000, lic: 60000, cap: 480000, rent: 28000, empSal: 11500, rev: 195000 }
  ];

  const MINING_SECTORS = [
    { name: 'Open-Pit Coal & Iron', basePay: 4800 },
    { name: 'Alluvial Gold River', basePay: 7500 },
    { name: 'Copper & Lithium Brine', basePay: 9200 },
    { name: 'Deep Platinum Shaft', basePay: 14500 },
    { name: 'Kimberlite Diamond Pipe', basePay: 19000 },
    { name: 'Rare Earth Metals', basePay: 22000 }
  ];
  const MINING_STEPS = ['1. Geological Survey', '2. Permits & Blast Clear', '3. Core Drilling', '4. Crushing & Washing', '5. Concentrating', '6. Assay & Smelting', '7. Bullion Export Sale'];

  const MINING_ALL_MINERALS = [
    { id: 'mn_coal', name: 'Coal (Ton)', usdPrice: 135, eqReq: 'Pickaxe / Shovel' },
    { id: 'mn_iron', name: 'Iron Ore (Ton)', usdPrice: 118, eqReq: 'Rock Drill' },
    { id: 'mn_cop', name: 'Copper (Kg)', usdPrice: 9.4, eqReq: 'Helmet + Drill' },
    { id: 'mn_lit', name: 'Lithium (Kg)', usdPrice: 28, eqReq: 'Brine Pump' },
    { id: 'mn_gold', name: 'Gold (Oz)', usdPrice: 2650, eqReq: 'Ore Detector' },
    { id: 'mn_plat', name: 'Platinum (Oz)', usdPrice: 1020, eqReq: 'Deep Shaft Mask' },
    { id: 'mn_diam', name: 'Diamond (Carat)', usdPrice: 4800, eqReq: 'Kimberlite Sieve' },
    { id: 'mn_rub', name: 'Ruby (Carat)', usdPrice: 2100, eqReq: 'Wash Sieve' }
  ];

  const DEV_DEPTS = [
    { name: 'Mobile Apps (iOS/Android)', baseRev: 3500 },
    { name: 'Web SaaS & Cloud', baseRev: 5200 },
    { name: 'Indie Game Engine', baseRev: 4800 },
    { name: 'Fintech Payment Core', baseRev: 7400 },
    { name: 'AI Agents & Vision', baseRev: 8800 },
    { name: 'Cybersecurity Vaults', baseRev: 6900 }
  ];
  const DEV_STEPS = ['1. Product Spec', '2. UX Wireframe', '3. Core Backend', '4. Frontend Build', '5. QA Security Audit', '6. Beta Release', '7. Monetize Live'];

  const COUNTRY_EDU_MAP = {
    za: { preschoolName: 'Grade R', primaryName: 'Grade 1–7 Primary School', primaryYears: 7, juniorName: 'Grade 8–9 Junior Secondary', juniorYears: 2, seniorName: 'Grade 10–12 High School (Matric)', seniorYears: 3, finalExamName: 'Matric / NSC', tvetName: 'TVET College (NCV)', universityYears: 3, syllabus: ['Mathematics', 'Home Language', 'English FAL', 'Life Skills', 'Natural Science', 'Social Science'], languageOfInstruction: 'English + Home Language' },
    ng: { preschoolName: 'Nursery', primaryName: 'Primary 1–6 Primary School', primaryYears: 6, juniorName: 'JSS 1–3 Junior Secondary', juniorYears: 3, seniorName: 'SSS 1–3 Senior Secondary', seniorYears: 3, finalExamName: 'WAEC / NECO', tvetName: 'TVET College (NABTEB)', universityYears: 4, syllabus: ['Mathematics', 'English Studies', 'Basic Science', 'Civic Education', 'Agricultural Science', 'Social Studies'], languageOfInstruction: 'English + National Languages' },
    gh: { preschoolName: 'Kindergarten', primaryName: 'Primary 1–6 Primary School', primaryYears: 6, juniorName: 'JHS 1–3 Junior High', juniorYears: 3, seniorName: 'SHS 1–3 Senior High', seniorYears: 3, finalExamName: 'WASSCE', tvetName: 'TVET Technical Institute', universityYears: 4, syllabus: ['Core Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'ICT'], languageOfInstruction: 'English' },
    ke: { preschoolName: 'Pre-Primary (PP1–PP2)', primaryName: 'Grade 1–6 Primary School', primaryYears: 6, juniorName: 'Grade 7–9 Junior School', juniorYears: 3, seniorName: 'Grade 10–12 Senior School', seniorYears: 3, finalExamName: 'KCSE / CBC Assessment', tvetName: 'TVET Vocational College', universityYears: 4, syllabus: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies'], languageOfInstruction: 'English & Kiswahili' },
    eg: { preschoolName: 'KG 1–2', primaryName: 'Primary 1–6 Primary School', primaryYears: 6, juniorName: 'Prep 1–3 Preparatory School', juniorYears: 3, seniorName: 'Secondary 1–3 High School', seniorYears: 3, finalExamName: 'Thanaweya Amma', tvetName: 'Technical Secondary Institute', universityYears: 4, syllabus: ['Arabic', 'Mathematics', 'Science', 'English', 'Social Studies'], languageOfInstruction: 'Arabic' },
    us: { preschoolName: 'Pre-K', primaryName: 'Grade 1–5 Elementary School', primaryYears: 5, juniorName: 'Grade 6–8 Middle School', juniorYears: 3, seniorName: 'Grade 9–12 High School', seniorYears: 4, finalExamName: 'High School Diploma + SAT', tvetName: 'Community College / Trade School', universityYears: 4, syllabus: ['Mathematics', 'English Language Arts', 'Science', 'US History & Civics', 'Physical Education'], languageOfInstruction: 'English' },
    ca: { preschoolName: 'Kindergarten', primaryName: 'Grade 1–6 Elementary School', primaryYears: 6, juniorName: 'Grade 7–8 Middle School', juniorYears: 2, seniorName: 'Grade 9–12 High School', seniorYears: 4, finalExamName: 'Provincial High School Diploma', tvetName: 'Polytechnic / Trade College', universityYears: 4, syllabus: ['Mathematics', 'English / French', 'Science', 'Social Studies', 'Health'], languageOfInstruction: 'English / French' },
    uk: { preschoolName: 'Reception', primaryName: 'Year 1–6 Primary School', primaryYears: 6, juniorName: 'Year 7–9 Key Stage 3', juniorYears: 3, seniorName: 'Year 10–13 Secondary (GCSE & A-Levels)', seniorYears: 4, finalExamName: 'GCSE / A-Levels', tvetName: 'BTEC / Apprenticeship College', universityYears: 3, syllabus: ['Maths', 'English', 'Combined Science', 'Humanities', 'Computing'], languageOfInstruction: 'English' },
    fr: { preschoolName: 'Maternelle', primaryName: 'CP–CM2 Ecole Primaire', primaryYears: 5, juniorName: 'College 6e–3e', juniorYears: 4, seniorName: 'Lycee Seconde–Terminale', seniorYears: 3, finalExamName: 'Baccalaureat (Bac)', tvetName: 'CAP / Bac Pro Lycee', universityYears: 3, syllabus: ['Mathematiques', 'Francais', 'Sciences', 'Histoire-Geographie', 'Langues'], languageOfInstruction: 'French' },
    de: { preschoolName: 'Kindergarten', primaryName: 'Klasse 1–4 Grundschule', primaryYears: 4, juniorName: 'Klasse 5–10 Sekundarstufe I', juniorYears: 6, seniorName: 'Klasse 11–13 Gymnasium', seniorYears: 3, finalExamName: 'Abitur', tvetName: 'Dual Ausbildung / Berufsschule', universityYears: 3, syllabus: ['Mathematik', 'Deutsch', 'Naturwissenschaften', 'Englisch', 'Gesellschaft'], languageOfInstruction: 'German' },
    it: { preschoolName: 'Scuola dell Infanzia', primaryName: 'Scuola Primaria 1–5', primaryYears: 5, juniorName: 'Scuola Media 1–3', juniorYears: 3, seniorName: 'Liceo / Istituto 1–5', seniorYears: 5, finalExamName: 'Esame di Maturita', tvetName: 'Istituto Tecnico / Professionale', universityYears: 3, syllabus: ['Matematica', 'Italiano', 'Scienze', 'Storia', 'Inglese'], languageOfInstruction: 'Italian' },
    in: { preschoolName: 'Pre-Primary', primaryName: 'Class 1–5 Primary School', primaryYears: 5, juniorName: 'Class 6–8 Middle School', juniorYears: 3, seniorName: 'Class 9–12 Senior Secondary', seniorYears: 4, finalExamName: 'CBSE / ICSE Board', tvetName: 'ITI / Polytechnic Institute', universityYears: 3, syllabus: ['Mathematics', 'English', 'Hindi', 'Science', 'Social Science'], languageOfInstruction: 'English / Hindi' },
    br: { preschoolName: 'Educacao Infantil', primaryName: 'Fundamental I (1–5)', primaryYears: 5, juniorName: 'Fundamental II (6–9)', juniorYears: 4, seniorName: 'Ensino Medio (1–3)', seniorYears: 3, finalExamName: 'ENEM National Exam', tvetName: 'Curso Tecnico (SENAI Style)', universityYears: 4, syllabus: ['Matematica', 'Portugues', 'Ciencias', 'Historia', 'Geografia'], languageOfInstruction: 'Portuguese' },
    ae: { preschoolName: 'KG 1–2', primaryName: 'Cycle 1 (Grade 1–5)', primaryYears: 5, juniorName: 'Cycle 2 (Grade 6–8)', juniorYears: 3, seniorName: 'Cycle 3 High School (Grade 9–12)', seniorYears: 4, finalExamName: 'EmSAT / MoE Secondary', tvetName: 'Vocational Applied Institute', universityYears: 4, syllabus: ['Mathematics', 'English', 'Arabic', 'Sciences', 'Social Studies'], languageOfInstruction: 'Arabic & English' },
    jp: { preschoolName: 'Yochien', primaryName: 'Grade 1–6 Elementary School', primaryYears: 6, juniorName: 'Grade 7–9 Junior High', juniorYears: 3, seniorName: 'Grade 10–12 High School', seniorYears: 3, finalExamName: 'University Entrance Exam', tvetName: 'Senmon Gakko (Vocational)', universityYears: 4, syllabus: ['Mathematics', 'Japanese', 'Science', 'Social Studies', 'English'], languageOfInstruction: 'Japanese' },
    cn: { preschoolName: 'Youeryuan Preschool', primaryName: 'Grade 1–6 Primary School', primaryYears: 6, juniorName: 'Grade 7–9 Junior Middle', juniorYears: 3, seniorName: 'Grade 10–12 Senior High', seniorYears: 3, finalExamName: 'Gaokao National Exam', tvetName: 'Vocational Technical School', universityYears: 4, syllabus: ['Mathematics', 'Chinese', 'English', 'Physics & Chemistry', 'Politics & History'], languageOfInstruction: 'Mandarin Chinese' },
    au: { preschoolName: 'Preschool / Prep', primaryName: 'Year 1–6 Primary School', primaryYears: 6, juniorName: 'Year 7–10 Junior High', juniorYears: 4, seniorName: 'Year 11–12 Senior Secondary', seniorYears: 2, finalExamName: 'ATAR / Senior Certificate', tvetName: 'TAFE Vocational Institute', universityYears: 3, syllabus: ['Mathematics', 'English', 'Science', 'HASS Humanities', 'Digital Tech'], languageOfInstruction: 'English' },
    es: { preschoolName: 'Educacion Infantil', primaryName: 'Primaria 1–6', primaryYears: 6, juniorName: 'ESO 1–4 Secondary', juniorYears: 4, seniorName: 'Bachillerato 1–2', seniorYears: 2, finalExamName: 'EBAU / Selectividad', tvetName: 'Formacion Profesional (FP)', universityYears: 4, syllabus: ['Matematicas', 'Lengua Espanola', 'Ciencias', 'Historia', 'Ingles'], languageOfInstruction: 'Spanish' },
    sg: { preschoolName: 'Kindergarten', primaryName: 'Primary 1–6 Primary School', primaryYears: 6, juniorName: 'Secondary 1–4', juniorYears: 4, seniorName: 'Junior College 1–2', seniorYears: 2, finalExamName: 'PSLE / O-Levels / A-Levels', tvetName: 'ITE / Polytechnic', universityYears: 3, syllabus: ['Mathematics', 'English', 'Mother Tongue', 'Science', 'Humanities'], languageOfInstruction: 'English' },
    mx: { preschoolName: 'Preescolar', primaryName: 'Primaria 1–6', primaryYears: 6, juniorName: 'Secundaria 1–3', juniorYears: 3, seniorName: 'Preparatoria (Bachillerato)', seniorYears: 3, finalExamName: 'EXANI / Preparatoria Diploma', tvetName: 'Educacion Tecnica Profesional', universityYears: 4, syllabus: ['Matematicas', 'Espanol', 'Ciencias Naturales', 'Historia', 'Civismo'], languageOfInstruction: 'Spanish' },
    ma: { preschoolName: 'Prescolaire', primaryName: 'Primaire 1–6', primaryYears: 6, juniorName: 'College 1–3', juniorYears: 3, seniorName: 'Lycee Tronc–Bac', seniorYears: 3, finalExamName: 'Baccalaureat National', tvetName: 'Vocational Training Institute', universityYears: 3, syllabus: ['Mathematiques', 'Arabe', 'Francais', 'Sciences', 'Histoire-Geographie'], languageOfInstruction: 'Arabic & French' }
  };

  function getCountryEdu(cid) {
    const id = cid || (G && G.countryId) || 'za';
    return COUNTRY_EDU_MAP[id] || {
      preschoolName: 'Preschool', primaryName: 'Primary School', primaryYears: 6,
      juniorName: 'Junior Secondary', juniorYears: 3, seniorName: 'High School', seniorYears: 3,
      finalExamName: 'National Exam', tvetName: 'TVET Vocational College', universityYears: 3,
      syllabus: ['Mathematics', 'English Language', 'Science', 'Social Studies', 'Technology'],
      languageOfInstruction: getCountry(id).lang || 'English'
    };
  }

  const JUNIOR_ELECTIVES = ['Art', 'Music', 'Sport', 'Coding', 'Agriculture'];
  const SENIOR_ELECTIVES = ['Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Accounting', 'Business', 'Computer Science', 'Agriculture', 'Art', 'Music', 'Sport Science'];
  const TVET_TRADES = [
    { id: 'tr_elec', name: 'Electrician', reqStat: 'discipline', reqVal: 40, reqSmarts: 40, salMult: 1.38, cost: 2400 },
    { id: 'tr_plumb', name: 'Plumber', reqStat: 'strength', reqVal: 35, reqSmarts: 32, salMult: 1.32, cost: 2000 },
    { id: 'tr_mech', name: 'Mechanic', reqStat: 'strength', reqVal: 40, reqSmarts: 38, salMult: 1.40, cost: 2600 },
    { id: 'tr_chef', name: 'Chef & Culinary', reqStat: 'creativity', reqVal: 35, reqSmarts: 32, salMult: 1.35, cost: 2200 },
    { id: 'tr_hair', name: 'Hairdresser / Barber', reqStat: 'charisma', reqVal: 35, reqSmarts: 25, salMult: 1.25, cost: 1600 },
    { id: 'tr_weld', name: 'Welder & Metalwork', reqStat: 'strength', reqVal: 45, reqSmarts: 32, salMult: 1.38, cost: 2300 },
    { id: 'tr_carp', name: 'Carpenter', reqStat: 'strength', reqVal: 40, reqSmarts: 34, salMult: 1.34, cost: 2100 },
    { id: 'tr_itsup', name: 'IT Support Technician', reqStat: 'discipline', reqVal: 35, reqSmarts: 45, salMult: 1.45, cost: 2800 },
    { id: 'tr_nurseasst', name: 'Nursing Assistant', reqStat: 'morality', reqVal: 45, reqSmarts: 42, salMult: 1.42, cost: 2700 },
    { id: 'tr_farm', name: 'Commercial Farming', reqStat: 'strength', reqVal: 38, reqSmarts: 34, salMult: 1.35, cost: 2000 }
  ];
  const UNI_DEGREES = [
    { id: 'deg_med', name: 'Medicine', years: 6, reqSmarts: 75, reqStat: 'morality', reqStatVal: 60, salMult: 2.5, costYr: 9500 },
    { id: 'deg_law', name: 'Law', years: 4, reqSmarts: 70, reqStat: 'charisma', reqStatVal: 50, salMult: 2.2, costYr: 7800 },
    { id: 'deg_eng', name: 'Engineering', years: 4, reqSmarts: 70, reqStat: 'discipline', reqStatVal: 45, salMult: 2.25, costYr: 8200 },
    { id: 'deg_bus', name: 'Business', years: 3, reqSmarts: 55, reqStat: 'charisma', reqStatVal: 50, salMult: 1.75, costYr: 6200 },
    { id: 'deg_teach', name: 'Education / Teaching', years: 4, reqSmarts: 55, reqStat: 'morality', reqStatVal: 60, salMult: 1.65, costYr: 5200 },
    { id: 'deg_cs', name: 'Computer Science', years: 4, reqSmarts: 70, reqStat: 'creativity', reqStatVal: 40, salMult: 2.35, costYr: 7800 },
    { id: 'deg_nurse', name: 'Nursing', years: 4, reqSmarts: 60, reqStat: 'morality', reqStatVal: 60, salMult: 1.85, costYr: 6400 },
    { id: 'deg_agri', name: 'Agriculture', years: 3, reqSmarts: 50, reqStat: 'strength', reqStatVal: 35, salMult: 1.6, costYr: 5000 },
    { id: 'deg_arts', name: 'Arts & Humanities', years: 3, reqSmarts: 50, reqStat: 'creativity', reqStatVal: 60, salMult: 1.5, costYr: 4800 },
    { id: 'deg_fin', name: 'Finance / Accounting', years: 4, reqSmarts: 62, reqStat: 'discipline', reqStatVal: 50, salMult: 2.1, costYr: 7000 }
  ];
  const ONLINE_SHORT_COURSES = [
    { id: 'oc_code', name: 'Coding Basics', weeks: 3, cost: 450, stat: 'smarts', boost: 3 },
    { id: 'oc_mkt', name: 'Digital Marketing', weeks: 2, cost: 320, stat: 'charisma', boost: 3 },
    { id: 'oc_gfx', name: 'Graphic Design', weeks: 3, cost: 400, stat: 'creativity', boost: 4 },
    { id: 'oc_data', name: 'Data Basics', weeks: 3, cost: 480, stat: 'smarts', boost: 3 },
    { id: 'oc_speak', name: 'Public Speaking', weeks: 2, cost: 280, stat: 'charisma', boost: 4 },
    { id: 'oc_fin', name: 'Financial Literacy', weeks: 2, cost: 250, stat: 'discipline', boost: 4 },
    { id: 'oc_firstaid', name: 'First Aid Essentials', weeks: 2, cost: 220, stat: 'morality', boost: 3 },
    { id: 'oc_lang', name: 'World Languages (FR/ES/ZH)', weeks: 4, cost: 600, stat: 'smarts', boost: 5 }
  ];
  const ADVANCED_PROGRAMS = [
    { id: 'adv_ai', name: 'AI Basics', cost: 2200, reqSmarts: 60, innoBoost: 'tech' },
    { id: 'adv_cyber', name: 'Cybersecurity Basics', cost: 2400, reqSmarts: 62, innoBoost: 'tech' },
    { id: 'adv_solar', name: 'Solar Installation Advanced', cost: 1900, reqSmarts: 60, innoBoost: 'energy' },
    { id: 'adv_biz', name: 'Business Management', cost: 2100, reqSmarts: 60, innoBoost: 'fin' },
    { id: 'adv_pm', name: 'Project Management', cost: 2000, reqSmarts: 60, innoBoost: 'eng' },
    { id: 'adv_nurse', name: 'Nursing Advanced', cost: 2300, reqSmarts: 62, innoBoost: 'med' },
    { id: 'adv_teach', name: 'Teaching Diploma', cost: 1800, reqSmarts: 60, innoBoost: 'edu' }
  ];

  const INNOVATION_DEPARTMENTS = [
    {
      id: 'med', icon: '🩺', name: 'Medical / Health',
      reqStats: { smarts: 50, health: 40 }, costTier: 'High', baseCost: 14000,
      bonusCountries: ['za', 'ng', 'ke', 'in', 'eg'],
      whyFit: (cn) => ['za', 'ng', 'ke', 'in', 'eg'].includes(cn.id) ? `High demand in ${cn.name} for accessible diagnostics & clinics.` : `Public wellness & clinic modernization market in ${cn.name}.`,
      rulesNote: 'Prototype at 13+, Patent/Launch 18+. Under 18 can Research only.',
      ideas: [
        { name: 'Cheap Water Filter', type: 'Hardware', diff: 'Medium', pot: 'High', payout: 42000 },
        { name: 'Mobile Clinic App', type: 'Health App', diff: 'Medium', pot: 'High', payout: 48000 },
        { name: 'Malaria Test Kit', type: 'Diagnostic', diff: 'Hard', pot: 'High', payout: 68000 },
        { name: 'Mental Health App', type: 'Wellness App', diff: 'Easy', pot: 'Medium', payout: 30000 },
        { name: 'First Aid Kit for Schools', type: 'Safety Kit', diff: 'Easy', pot: 'High', payout: 28000 }
      ]
    },
    {
      id: 'tech', icon: '💻', name: 'Tech / Software',
      reqStats: { smarts: 45, creativity: 40 }, costTier: 'Medium', baseCost: 7500,
      bonusCountries: ['us', 'jp', 'in', 'ng', 'sg'],
      whyFit: (cn) => ['us', 'jp', 'in', 'ng', 'sg'].includes(cn.id) ? `Strong digital ecosystem & software talent demand in ${cn.name}.` : `Growing mobile & SME software adoption across ${cn.name}.`,
      rulesNote: 'Commercialize via Digital Markets or App Stores.',
      ideas: [
        { name: 'Delivery App', type: 'Platform', diff: 'Medium', pot: 'High', payout: 45000 },
        { name: 'School App', type: 'EdTech', diff: 'Easy', pot: 'Medium', payout: 28000 },
        { name: 'Farming App', type: 'AgriTech', diff: 'Medium', pot: 'High', payout: 36000 },
        { name: 'Music App', type: 'Streaming', diff: 'Hard', pot: 'High', payout: 52000 },
        { name: 'Local Taxi App', type: 'Mobility', diff: 'Medium', pot: 'High', payout: 44000 },
        { name: 'AI Tutor', type: 'AI Software', diff: 'Hard', pot: 'High', payout: 64000 }
      ]
    },
    {
      id: 'agri', icon: '🌱', name: 'Agriculture / Food',
      reqStats: { strength: 30, smarts: 35 }, costTier: 'Medium', baseCost: 6200,
      bonusCountries: ['za', 'ke', 'ng', 'gh'],
      whyFit: (cn) => ['za', 'ke', 'ng', 'gh'].includes(cn.id) ? `High agricultural resilience & food security bonus in ${cn.name}.` : `Urban & regional food supply value in ${cn.name}.`,
      rulesNote: '+20% success when food scarcity is high.',
      ideas: [
        { name: 'Drought Seeds', type: 'Bio-Agri', diff: 'Hard', pot: 'High', payout: 46000 },
        { name: 'Solar Irrigation', type: 'Farm Gear', diff: 'Medium', pot: 'High', payout: 39000 },
        { name: 'Food Storage Box', type: 'Cold Chain', diff: 'Easy', pot: 'Medium', payout: 25000 },
        { name: 'Urban Garden Kit', type: 'Home Agri', diff: 'Easy', pot: 'Medium', payout: 22000 }
      ]
    },
    {
      id: 'energy', icon: '⚡', name: 'Energy / Green',
      reqStats: { smarts: 40, discipline: 40 }, costTier: 'Medium', baseCost: 8500,
      bonusCountries: ['za', 'eg', 'ma'],
      whyFit: (cn) => cn.id === 'za' ? `Fits South Africa directly due to loadshedding backup demand!` : `Clean off-grid energy demand in ${cn.name}.`,
      rulesNote: 'High export & backup utility potential.',
      ideas: [
        { name: 'Solar Phone Charger', type: 'Micro-Solar', diff: 'Easy', pot: 'High', payout: 26000 },
        { name: 'Solar Lamp', type: 'Lighting', diff: 'Easy', pot: 'High', payout: 24000 },
        { name: 'Wind Pump', type: 'Clean Infra', diff: 'Hard', pot: 'High', payout: 54000 },
        { name: 'Recycling Machine', type: 'Circular Tech', diff: 'Medium', pot: 'Medium', payout: 38000 }
      ]
    },
    {
      id: 'edu', icon: '🎓', name: 'Education / Learning',
      reqStats: { smarts: 50, morality: 50 }, costTier: 'Low-Med', baseCost: 4800,
      bonusCountries: ['za', 'ng', 'gh', 'ke', 'in', 'br', 'mx'],
      whyFit: (cn) => `Aligns with ${cn.schoolSystem} syllabus & exam prep in ${cn.name}.`,
      rulesNote: 'Bonus impact in developing education markets.',
      ideas: [
        { name: 'Matric Tutor App', type: 'Exam Prep', diff: 'Medium', pot: 'High', payout: 32000 },
        { name: 'Reading App for Kids', type: 'Literacy', diff: 'Easy', pot: 'High', payout: 24000 },
        { name: 'Exam Prep Platform', type: 'EdTech', diff: 'Medium', pot: 'High', payout: 36000 },
        { name: 'Sign Language App', type: 'Accessibility', diff: 'Hard', pot: 'High', payout: 34000 }
      ]
    },
    {
      id: 'fin', icon: '💰', name: 'Finance / Business',
      reqStats: { smarts: 45, charisma: 45 }, costTier: 'Medium', baseCost: 6800,
      bonusCountries: ['ng', 'ke', 'za', 'gh'],
      whyFit: (cn) => ['ng', 'ke', 'za', 'gh'].includes(cn.id) ? `High mobile-money & trader inclusion growth in ${cn.name}.` : `Everyday savings & micro-merchant tools for ${cn.name}.`,
      rulesNote: 'Strictly legal & helpful fintech only (no scams/gambling).',
      ideas: [
        { name: 'Savings App for Youth', type: 'FinTech', diff: 'Easy', pot: 'High', payout: 30000 },
        { name: 'Mobile Money for Market Traders', type: 'Payments', diff: 'Medium', pot: 'High', payout: 54000 },
        { name: 'Budget App', type: 'Personal Finance', diff: 'Easy', pot: 'Medium', payout: 24000 }
      ]
    },
    {
      id: 'creative', icon: '🎨', name: 'Creative / Entertainment',
      reqStats: { creativity: 50, charisma: 40 }, costTier: 'Low-Med', baseCost: 4200,
      bonusCountries: ['us', 'uk', 'jp', 'ng', 'br'],
      whyFit: (cn) => `Strong youth & cultural creative audience in ${cn.name}.`,
      rulesNote: 'YouTube monetization 18+ only (hobby below 18).',
      ideas: [
        { name: 'Music Label', type: 'Audio', diff: 'Medium', pot: 'High', payout: 44000 },
        { name: 'Fashion Brand', type: 'Apparel', diff: 'Medium', pot: 'High', payout: 40000 },
        { name: 'Indie Game', type: 'Gaming', diff: 'Hard', pot: 'High', payout: 58000 },
        { name: 'Comic Series', type: 'Publishing', diff: 'Easy', pot: 'Medium', payout: 22000 },
        { name: 'YouTube Channel', type: 'Creator Media', diff: 'Easy', pot: 'Medium', payout: 28000 }
      ]
    },
    {
      id: 'eng', icon: '🏗️', name: 'Engineering / Building',
      reqStats: { strength: 40, smarts: 40 }, costTier: 'High', baseCost: 11500,
      bonusCountries: ['za', 'ng', 'ke', 'in', 'br', 'eg'],
      whyFit: (cn) => `High housing scarcity & infrastructure expansion in ${cn.name} (+20% Success).`,
      rulesNote: 'TVET Trade bonus boosts success rate.',
      ideas: [
        { name: 'Low-Cost House', type: 'Modular Housing', diff: 'Hard', pot: 'High', payout: 62000 },
        { name: 'Brick Machine', type: 'Construction', diff: 'Medium', pot: 'High', payout: 44000 },
        { name: 'Water Tank', type: 'Storage Infra', diff: 'Easy', pot: 'High', payout: 29000 },
        { name: 'Bridge Model', type: 'Civil Design', diff: 'Hard', pot: 'Medium', payout: 48000 }
      ]
    },
    {
      id: 'safety', icon: '🛡️', name: 'Safety / Law',
      reqStats: { morality: 60, smarts: 45 }, costTier: 'Medium', baseCost: 5800,
      bonusCountries: ['za', 'mx', 'br'],
      whyFit: (cn) => ['za', 'mx', 'br'].includes(cn.id) ? `High civic safety & neighborhood protection need in ${cn.name}.` : `Community legal aid & alert demand in ${cn.name}.`,
      rulesNote: 'Non-violent safety & legal protection only (no weapons).',
      ideas: [
        { name: 'Safety App for Women', type: 'Alert App', diff: 'Medium', pot: 'High', payout: 34000 },
        { name: 'Community Watch App', type: 'Civic Network', diff: 'Easy', pot: 'High', payout: 26000 },
        { name: 'Legal Aid App', type: 'Justice Access', diff: 'Hard', pot: 'High', payout: 38000 }
      ]
    },
    {
      id: 'social', icon: '🌍', name: 'Social / Community',
      reqStats: { morality: 60, charisma: 40 }, costTier: 'Low', baseCost: 2600,
      bonusCountries: [],
      whyFit: (cn) => `Direct neighborhood impact & high Community Respect in ${cn.name}.`,
      rulesNote: 'Low money return, huge Morality, Happiness, Fame & Community Rep!',
      ideas: [
        { name: 'Clean-Up Project', type: 'Civic Action', diff: 'Easy', pot: 'Low', payout: 6000 },
        { name: 'Food Bank App', type: 'Relief Platform', diff: 'Medium', pot: 'Low', payout: 8000 },
        { name: 'Youth Mentorship', type: 'Community', diff: 'Easy', pot: 'Low', payout: 5500 },
        { name: 'Disability Help App', type: 'Accessibility', diff: 'Hard', pot: 'Medium', payout: 12000 }
      ]
    }
  ];

  const FOOD_PLANS = [
    { id: 'none', name: 'No Meal Plan (Cook Yourself)', cost: 0, note: 'Must buy groceries or eat manually.' },
    { id: 'budget', name: 'Student Rice & Beans Plan', cost: 650, note: 'Covers baseline calories cheaply.' },
    { id: 'family', name: 'Home Balanced Groceries', cost: 1400, note: '+4 Health & steady Hunger/Thirst.' },
    { id: 'athlete', name: 'High-Protein Fitness Prep', cost: 2400, note: '+8 Fitness & +10 Energy recovery.' },
    { id: 'luxury', name: 'Private Chef Michelin Plan', cost: 6500, note: '+12 Happiness & +10 Health/mo.' }
  ];

  const FOOD_ITEMS = (() => {
    const specs = [
      { name: 'Jollof Rice', cultureFav: ['Yoruba', 'Igbo', 'Hausa', 'Akan', 'Ewe'] },
      { name: 'Pap & Boerewors', hasBeef: true, cultureFav: ['Zulu', 'Xhosa', 'Sotho', 'Tswana', 'Afrikaans', 'Coloured'] },
      { name: 'Sushi Box', cultureFav: ['Yamato Japanese'] },
      { name: 'Chicken Biryani', cultureFav: ['Indian', 'North Indian', 'South Indian', 'Bengali', 'Punjabi'] },
      { name: 'Margherita Pizza' },
      { name: 'Croissant & Espresso' },
      { name: 'Beef Biltong Strip', hasBeef: true, cultureFav: ['Afrikaans', 'Coloured', 'Zulu', 'Xhosa'] },
      { name: 'Pork Ribs Platter', hasPork: true },
      { name: 'Falafel Wrap', cultureFav: ['Egyptian Arab', 'Emirati', 'Moroccan Arab'] },
      { name: 'Beef Burger', hasBeef: true },
      { name: 'Grilled Tilapia', cultureFav: ['Luo', 'Akan', 'Yoruba'] },
      { name: 'Avocado Toast' },
      { name: 'Vegetarian Masala Dosa', cultureFav: ['South Indian', 'North Indian', 'Indian'] },
      { name: 'Pork Tacos al Pastor', hasPork: true, cultureFav: ['Mestizo'] },
      { name: 'Vegetable Curry' },
      { name: 'Fresh Fruit Salad' },
      { name: 'Craft Beer (21+)', isAlcohol: true },
      { name: 'Roast Chicken' },
      { name: 'Butter Chicken' },
      { name: 'Red Wine Glass (21+)', isAlcohol: true }
    ];
    const out = [];
    for (let i = 0; i < 109; i++) {
      const sp = specs[i % specs.length];
      out.push({
        id: `fd_${i + 1}`,
        name: i < 20 ? sp.name : `${sp.name} #${Math.floor(i / 20) + 1}`,
        cost: 35 + ((i * 19) % 240),
        hp: sp.isAlcohol ? -3 : (i % 5 === 0 ? -1 : 4 + (i % 6)),
        hap: 3 + (i % 7),
        eng: sp.isAlcohol ? 4 : 7 + (i % 10),
        hasPork: Boolean(sp.hasPork),
        hasBeef: Boolean(sp.hasBeef),
        isAlcohol: Boolean(sp.isAlcohol),
        cultureFav: sp.cultureFav || []
      });
    }
    return out;
  })();

  const LUXURY_COLLECTIONS = (() => {
    const items = [
      ['Rolex Daytona Steel Watch', 'Watches', 280000, 0.08], ['Patek Philippe Nautilus', 'Watches', 950000, 0.11],
      ['Audemars Piguet Royal Oak', 'Watches', 620000, 0.09], ['Omega Speedmaster Moonwatch', 'Watches', 145000, 0.07],
      ['2ct Flawless Diamond Ring', 'Jewelry', 190000, 0.06], ['18k Solid Gold Cuban Chain', 'Jewelry', 95000, 0.07],
      ['South Sea Pearl Necklace', 'Jewelry', 110000, 0.06], ['Emerald Drop Tiara', 'Jewelry', 440000, 0.09],
      ['Cartier Love Gold Bracelet', 'Jewelry', 125000, 0.07], ['Sapphire Dress Cufflinks', 'Jewelry', 58000, 0.06],
      ['First-Edition Constitution Print', 'Rare Artifacts', 260000, 0.10], ['1955 Roman Coin Hoard', 'Coins', 180000, 0.09],
      ['24k Krugerrand Set (10oz)', 'Bullion', 490000, 0.08], ['Swiss 1kg Gold Bar', 'Bullion', 1380000, 0.08],
      ['Signed Pele World Cup Jersey', 'Sports', 310000, 0.12], ['Michael Jordan Rookie Card', 'Collectibles', 420000, 0.11],
      ['Original Oil Impressionist Canvas', 'Fine Art', 780000, 0.10], ['Contemporary African Bronze Bust', 'Fine Art', 210000, 0.09],
      ['Birkin Togo Leather Bag', 'Fashion', 240000, 0.09], ['Vintage Leica M3 Camera', 'Tech Heritage', 88000, 0.08],
      ['1715 Stradivarius Bow', 'Music', 390000, 0.10], ['Steinway Model D Grand Piano', 'Music', 1450000, 0.07],
      ['Bordeaux 1982 Vintage Case', 'Wine', 165000, 0.09], ['Rare Blue Tanzanite Stone', 'Gems', 330000, 0.08],
      ['Apollo Lunar Flown Patch', 'Space', 540000, 0.13], ['Signed First-Ed Fantasy Novel', 'Books', 72000, 0.09],
      ['Antique Meiji Samurai Tsuba', 'History', 295000, 0.10], ['Custom Damascus Chess Set', 'Crafts', 68000, 0.07],
      ['Limited F1 Carbon Steering Wheel', 'Motorsport', 220000, 0.11], ['Royal Ashanti Gold Stool Replica', 'Heritage', 145000, 0.09],
      ['Rare Bluefin Pearl Brooch', 'Jewelry', 135000, 0.07], ['1ct Fancy Pink Diamond Loose', 'Gems', 820000, 0.12]
    ];
    return items.map((x, i) => ({ id: `col_${i + 1}`, name: x[0], cat: x[1], cost: x[2], app: x[3] }));
  })();

  const SUPPLIERS_CATALOG = [
    { id: 'sup_za', name: 'Highveld Steel & Bricks', countryId: 'za', cat: 'Construction', baseZar: 18000, quality: 88, lieRisk: 10, leadDays: 2 },
    { id: 'sup_cn', name: 'Shenzhen MicroTech Parts', countryId: 'cn', cat: 'Electronics', baseZar: 24000, quality: 84, lieRisk: 18, leadDays: 5 },
    { id: 'sup_gh', name: 'Accra Cocoa & Food', countryId: 'gh', cat: 'Food/Grocery', baseZar: 12000, quality: 92, lieRisk: 8, leadDays: 3 },
    { id: 'sup_de', name: 'Bavaria Precision Engines', countryId: 'de', cat: 'Auto', baseZar: 42000, quality: 97, lieRisk: 4, leadDays: 4 },
    { id: 'sup_in', name: 'Mumbai Pharma Wholesale', countryId: 'in', cat: 'Medical', baseZar: 21000, quality: 85, lieRisk: 15, leadDays: 4 }
  ];

  const ALL_SUPPLIERS = (() => {
    const list = [...SUPPLIERS_CATALOG];
    const prefixes = ['Apex', 'Global', 'Star', 'Prime', 'Meridian', 'Atlas', 'Vanguard', 'Vertex', 'Harbor', 'Pioneer', 'Summit', 'Pacific', 'Continental', 'Delta', 'Orion', 'Crown'];
    const sectors = [
      ['Construction', 19000], ['Electronics', 26000], ['Food/Grocery', 11000], ['Auto', 38000],
      ['Medical', 22000], ['Textiles', 14000], ['Mining Gear', 32000], ['Solar & Energy', 29000],
      ['Packaging', 9500], ['Chem & Lab', 27000], ['Hardware', 16000], ['Biotech', 44000], ['Timber', 15000]
    ];
    let sid = 1;
    for (let round = 0; round < 4; round++) {
      COUNTRIES.forEach((cn, ci) => {
        sectors.forEach(([sec, baseZ], si) => {
          const p1 = prefixes[(round * 3 + ci + si) % prefixes.length];
          const city = cn.cities[(round + si) % cn.cities.length];
          list.push({
            id: `sup_g_${sid++}`,
            name: `${p1} ${city} ${sec} Co.`,
            countryId: cn.id,
            city,
            cat: sec,
            baseZar: Math.round(baseZ * (0.75 + ((sid % 7) * 0.12))),
            quality: 72 + ((sid * 7) % 26),
            lieRisk: 4 + ((sid * 5) % 20),
            leadDays: 2 + (sid % 6)
          });
        });
      });
    }
    return list;
  })();

  const TICKET_TYPES = [
    { id: 'budget', name: '🎒 Budget - No Frills', mult: 0.7, bagsFree: 0, luggageKg: 10, bagFeePct: 0.09, legroom: '28"', wifi: 'No WiFi', checkin: '3h before', refundPct: 0, comfort: 30, engDelta: -30, hpDelta: -10, loungeAccess: false },
    { id: 'economy', name: '💺 Economy - Basic', mult: 1.0, bagsFree: 1, luggageKg: 20, bagFeePct: 0.09, legroom: '30"', wifi: 'Paid 1h', checkin: '2h before', refundPct: 50, comfort: 50, engDelta: -20, hpDelta: -5, loungeAccess: false },
    { id: 'prem_econ', name: '💺➕ Premium Economy', mult: 1.5, bagsFree: 2, luggageKg: 46, bagFeePct: 0.07, legroom: '36"', wifi: '1h Free', checkin: '1.5h before', refundPct: 70, comfort: 70, engDelta: -10, hpDelta: -2, loungeAccess: false },
    { id: 'business', name: '💼 Business Class (Lounge)', mult: 3.0, bagsFree: 3, luggageKg: 96, bagFeePct: 0, legroom: '60" Lie-Flat', wifi: 'Free Unlimited', checkin: '1h Priority', refundPct: 90, comfort: 90, engDelta: 10, hpDelta: 5, loungeAccess: true },
    { id: 'first', name: '👑 First Class (Private Suite)', mult: 5.0, bagsFree: 4, luggageKg: 128, bagFeePct: 0, legroom: 'Private Suite', wifi: 'Free + Calls', checkin: '30m VIP', refundPct: 100, comfort: 100, engDelta: 20, hpDelta: 10, loungeAccess: true },
    { id: 'child', name: '👶 Child / Infant Ticket', mult: 0.75, infMult: 0.1, bagsFree: 1, luggageKg: 20, bagFeePct: 0.08, legroom: 'Kids / Lap', wifi: 'Cartoons', checkin: 'Family Priority', refundPct: 80, comfort: 75, engDelta: -5, hpDelta: 0, loungeAccess: false }
  ];

  const AIRLINES_CATALOG = [
    { id: 'al_budget', name: 'Budget Air (Ryanair / FlySafair)', mult: 0.7 },
    { id: 'al_std', name: 'Flag Carrier (SAA / BA / Delta)', mult: 1.0 },
    { id: 'al_lux', name: '5-Star Flagship (Emirates / Singapore)', mult: 1.5 }
  ];

  const OWNED_PLANES_CATALOG = [
    { id: 'pl_cessna', name: 'Cessna Citation Prop', rangeKm: 3200, cost: 4800000 },
    { id: 'pl_learjet', name: 'Learjet 75 Executive', rangeKm: 6500, cost: 14500000 },
    { id: 'pl_gulf', name: 'Gulfstream G650 Global', rangeKm: 13500, cost: 42000000 }
  ];

  const TRUCKS_CATALOG = [
    { id: 'tr_van', name: '1-Ton Delivery Van', cost: 145000, loadKg: 1000, fuelBurn: 10, elec: false, tag: 'Urban Last-Mile' },
    { id: 'tr_3ton', name: '3-Ton Box Truck', cost: 280000, loadKg: 3000, fuelBurn: 14, elec: false, tag: 'City Retail' },
    { id: 'tr_10ton', name: '10-Ton Timber & Brick', cost: 640000, loadKg: 10000, fuelBurn: 20, elec: false, tag: 'Construction' },
    { id: 'tr_semi', name: '34-Ton Highway Semi', cost: 1650000, loadKg: 34000, fuelBurn: 30, elec: false, tag: 'Cross-Border' },
    { id: 'tr_ev', name: 'Tesla Semi Electric (Zero Fuel)', cost: 2400000, loadKg: 32000, fuelBurn: 0, elec: true, tag: 'Zero Petrol' }
  ];

  const LOGISTICS_TENDERS = [
    { id: 'lt_pharm', title: 'Hospital Vaccines Cold-Chain Run', minLoad: 1000, payZar: 18500, destId: 'za', days: 2, reqTrust: 0, riskRobbery: 10, fridge: true },
    { id: 'lt_cocoa', title: 'Accra -> Port Freight', minLoad: 3000, payZar: 32000, destId: 'gh', days: 4, reqTrust: 20, riskRobbery: 16, fridge: false },
    { id: 'lt_solar', title: 'Solar Batteries Regional Bulk', minLoad: 10000, payZar: 68000, destId: 'us', days: 5, reqTrust: 45, riskRobbery: 20, fridge: false },
    { id: 'lt_gold', title: 'Armored Bullion Vault Escort', minLoad: 25000, payZar: 145000, destId: 'uk', days: 3, reqTrust: 70, riskRobbery: 35, fridge: false }
  ];

  const BUSES_CATALOG = [
    { id: 'bs_mini', name: '16-Seater Commuter Minibus', cost: 210000, cat: 'City', seats: 16, ac: false, safety: false },
    { id: 'bs_school', name: 'Safety School Yellow Bus', cost: 480000, cat: 'School', seats: 45, ac: false, safety: true },
    { id: 'bs_coach', name: '60-Seater Luxury Coach', cost: 1450000, cat: 'Coach', seats: 60, ac: true, safety: true },
    { id: 'bs_tour', name: 'Artist Sleeper Tour Coach', cost: 2600000, cat: 'Tour', seats: 24, ac: true, safety: true }
  ];

  const BUS_TENDERS = [
    { id: 'bt_city', title: 'Morning City Commuter Express', reqCat: 'City', payZar: 9500, reqTrust: 0, destId: 'za' },
    { id: 'bt_school', title: 'District High School Transport', reqCat: 'School', payZar: 19500, reqTrust: 15, destId: 'gh' },
    { id: 'bt_coach', title: 'Inter-City Executive Highway', reqCat: 'Coach', payZar: 38000, reqTrust: 35, destId: 'uk' }
  ];

  const TENDERS_7STEP_CATALOG = [
    { id: 'td_solar', title: 'Municipal Solar Streetlight Grid', countryId: 'za', feeZar: 2500, depZar: 18000, estCostZar: 95000, budgetZar: 240000 },
    { id: 'td_road', title: 'Regional Highway Pothole Rehab', countryId: 'gh', feeZar: 4000, depZar: 32000, estCostZar: 165000, budgetZar: 410000 },
    { id: 'td_school', title: 'Public Primary STEM Lab Wing', countryId: 'ke', feeZar: 5500, depZar: 42000, estCostZar: 220000, budgetZar: 540000 },
    { id: 'td_fiber', title: 'District Fiber Broadband Ring', countryId: 'uk', feeZar: 8500, depZar: 65000, estCostZar: 310000, budgetZar: 790000 }
  ];
  const TENDER_STEPS = ['1. Feasibility', '2. Technical Design', '3. Cost & Margin Bid', '4. Escrow Deposit', '5. Site Mobilization', '6. Milestone Inspect', '7. Final Sign-Off & Payout'];

  const AUCTIONS_CATALOG = [
    { id: 'au_art', name: '1920s Cape Impressionist Oil', countryId: 'za', cat: 'Fine Art', startZar: 24000 },
    { id: 'au_watch', name: 'Vintage Patek Dress Chronometer', countryId: 'fr', cat: 'Watches', startZar: 85000 },
    { id: 'au_car', name: '1969 Classic Mustang Fastback', countryId: 'us', cat: 'Classic Cars', startZar: 165000 },
    { id: 'au_plot', name: 'Prime Coastal Acre Land Plot', countryId: 'gh', cat: 'Real Estate', startZar: 195000 },
    { id: 'au_repo', name: 'Bank Repo Wholesale Electronics Lot', countryId: 'jp', cat: 'Electronics', startZar: 52000 }
  ];

  const HOBBIES_CATALOG = [
    { id: 'hb_paint', name: 'Fine Art Painting', skill: 'Painting', outName: 'Framed Canvas', baseSell: 2400, career: 'Gallery Fine Artist', equip: [{ name: 'Starter Brushes', cost: 450 }, { name: 'Pro Studio Easel', cost: 2200 }] },
    { id: 'hb_guitar', name: 'Acoustic & Studio Music', skill: 'Singing', outName: 'Mastered Track', baseSell: 3200, career: 'Recording Artist', equip: [{ name: 'Acoustic Guitar', cost: 1600 }, { name: 'Condenser Studio Rig', cost: 5800 }] },
    { id: 'hb_wood', name: 'Carpentry & Joinery', skill: 'Engineering', outName: 'Custom Oak Table', baseSell: 4100, career: 'Master Cabinetmaker', equip: [{ name: 'Hand Saw & Planes', cost: 1200 }, { name: 'Workshop Router Lathe', cost: 6400 }] },
    { id: 'hb_code', name: 'Indie Game Scripting', skill: 'Coding', outName: 'Mobile Arcade Build', baseSell: 4900, career: 'Principal Game Dev', equip: [{ name: 'Refurb Dev Laptop', cost: 3500 }, { name: 'Dual-Monitor Dev Rig', cost: 9200 }] },
    { id: 'hb_cook', name: 'Artisan Culinary Craft', skill: 'Cooking', outName: 'Catering Pastry Box', baseSell: 1850, career: 'Executive Pastry Chef', equip: [{ name: 'Chef Knife Roll', cost: 950 }, { name: 'Convection Oven Suite', cost: 5400 }] }
  ];

  const CAR_MODS_CATALOG = [
    { id: 'mod_turbo', name: 'Twin-Scroll Turbocharger', cost: 18000, speed: 15 },
    { id: 'mod_ecu', name: 'Stage-2 ECU Remap', cost: 9500, speed: 9 },
    { id: 'mod_susp', name: 'Track Suspension', cost: 12000, speed: 10 },
    { id: 'mod_brake', name: 'Ceramic Brakes', cost: 10500, speed: 7 },
    { id: 'mod_exh', name: 'Titanium Exhaust', cost: 7500, speed: 6 },
    { id: 'mod_nitro', name: 'Nitrous Boost Kit', cost: 16000, speed: 18 }
  ];

  const RACING_LEAGUES = [
    { id: 'rc_street', name: 'Midnight Street Racing', fee: 1500, prize: 7500, reqSpeed: 10 },
    { id: 'rc_bike', name: 'Superbike Racing Cup', fee: 3500, prize: 16000, reqSpeed: 20 },
    { id: 'rc_rally', name: 'Cross-Country Rally', fee: 4500, prize: 22000, reqSpeed: 28 },
    { id: 'rc_f1', name: 'Global Formula F1', fee: 12000, prize: 68000, reqSpeed: 55 }
  ];

  const MAFIA_JOBS = [
    { id: 'mf_shakedown', name: 'Street Protection Shakedown', reqRep: 75, pay: 14000, risk: 20, street: 6, com: -8 },
    { id: 'mf_heist', name: 'Armored Bank Vault Heist', reqRep: 82, pay: 68000, risk: 36, street: 12, com: -18 },
    { id: 'mf_hitman', name: 'Syndicate Enforcer Contract', reqRep: 88, pay: 95000, risk: 44, street: 15, com: -25 }
  ];

  const TRAITS_LIST = [
    { id: 'tr_ambitious', name: 'Ambitious', desc: '+15% Career salary growth & Drive' },
    { id: 'tr_resilient', name: 'Resilient', desc: '-30% Health damage in hard times' },
    { id: 'tr_charisma', name: 'Charismatic', desc: '+15% Friend bond & Interview charm' },
    { id: 'tr_frugal', name: 'Frugal Saver', desc: '-12% living costs every month' },
    { id: 'tr_genius', name: 'Quick Mind', desc: '+4 Smarts gain on all study sessions' },
    { id: 'tr_creative', name: 'Creative Spark', desc: '+20% Hobby & Patent value' },
    { id: 'tr_street', name: 'Streetwise', desc: '-15% Police Heat buildup & street edge' },
    { id: 'tr_honest', name: 'High Integrity', desc: '+10 starting Ethics & Work Trust' }
  ];

  const SKILLS_LIST = ['Coding', 'Finance', 'Research', 'Cooking', 'Singing', 'Painting', 'Engineering', 'Farming', 'Persuasion', 'Negotiation', 'Medicine', 'Law', 'Driving', 'Athletics'];
  const PRIMARY_SUBJECTS = ['Mathematics', 'English Language', 'Natural Science', 'Social Studies', 'Art & Craft', 'Physical Ed'];
  const HIGHSCHOOL_SUBJECTS = ['Algebra & Calculus', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Computer Science', 'Economics'];
  const UNI_FACULTIES = ['Medicine & Surgery', 'Software Engineering', 'Corporate Law', 'Civil Engineering', 'Finance & Audit'];
  const SCHOOL_CLUBS = ['Debate Team', 'Coding Club', 'School Choir', 'Football Team', 'Science Olympiad', 'Drama Guild', 'Chess Society', 'Track & Field'];
  const SYSTEM_OFFER_META = [
    { key: 'jobs', icon: '💼', name: 'Jobs Offer' },
    { key: 'company', icon: '🏢', name: 'Company Deal' },
    { key: 'tenders', icon: '📜', name: 'Tender Invite' },
    { key: 'logistics', icon: '🚛', name: 'Freight Contract' },
    { key: 'auctions', icon: '🔨', name: 'Private Auction' },
    { key: 'suppliers', icon: '🚢', name: 'Supplier Lot' }
  ];

  const WORLD_CRISES = [
    { id: 'war', name: 'Regional Supply Conflict', desc: 'Foreign imports delayed (+30% fuel), local manufacturing surges.' },
    { id: 'recession', name: 'Global Market Dip', desc: 'Stock markets slide -15%; bargains open on real estate & auctions.' },
    { id: 'storm', name: 'Extreme Monsoon Storm', desc: 'Power grid flickers; Solar & Backup Generators protect home.' },
    { id: 'flu', name: 'Seasonal Flu Wave', desc: 'Clinic visits up; keep Painkillers, Vitamins & Hygiene high.' }
  ];

  const WEATHER_BY_CLIMATE = {
    warm: ['☀️ Sunny 27°C', '🌤️ Warm Breeze 24°C', '🌦️ Afternoon Shower 21°C'],
    tropical: ['🌴 Tropical Sun 31°C', '⛈️ Heavy Rain 26°C', '🌤️ Humid 29°C'],
    savanna: ['☀️ Crisp Savanna 25°C', '🌬️ Breezy 22°C', '🌧️ Seasonal Rain 20°C'],
    desert: ['🔥 Dry Heat 39°C', '☀️ Clear Desert 34°C', '💨 Sand Breeze 31°C'],
    temperate: ['🌤️ Mild 19°C', '🌧️ Light Rain 14°C', '☀️ Pleasant 22°C'],
    cold: ['❄️ Frosty 1°C', '🌨️ Snowfall -3°C', '☁️ Overcast 5°C'],
    cold_rain: ['🌧️ Drizzle 10°C', '☁️ Foggy 8°C', '🌤️ Rare Sun 16°C'],
    arctic: ['🥶 Sub-Zero -11°C', '🌨️ Blizzard -6°C', '🌤️ Crisp 4°C'],
    med: ['☀️ Coastal Sun 26°C', '🌊 Sea Breeze 23°C', '🌤️ Mild 20°C'],
    monsoon: ['⛈️ Monsoon Downpour 28°C', '☀️ Bright 32°C', '🌤️ Humid 30°C'],
    varied: ['🌤️ Clear 21°C', '🌧️ Showers 15°C', '☀️ Crisp 24°C']
  };

  /* ============================================================
     4. STATE MANAGEMENT, PERSISTENCE (lsw-base) & CURRENCY FORMATTING
     ============================================================ */
  let G = null;
  let LEGACY = (() => {
    try { return JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null'); } catch { return null; }
  })() || { gens: [], bestNet: 0 };

  let UI_STATE = {
    tab: 'home',
    jobSector: 'ALL',
    jobSearch: '',
    lifeView: 'hub',
    workView: 'dash',
    financeView: 'banks',
    peopleView: 'family',
    worldView: 'airport',
    friendCat: 'ALL',
    shopCat: 'All',
    shopNeedFilter: 'ALL',
    shopQuery: '',
    shopPage: 0,
    supplierPage: 0,
    supplierQuery: '',
    invCat: 'All',
    searchOpen: false,
    searchQuery: '',
    searchFilter: 'All',
    foodTab: 'plans',
    menuPage: null,
    compCountryId: null,
    flightToCid: 'gh',
    flightToCity: 'Accra',
    flightTicketId: 'economy',
    flightAirlineId: 'al_std',
    flightSeason: 'normal',
    crimeFlow: null,
    quizFlow: null,
    innoGame: null,
    customCountryId: 'za'
  };

  function getCountry(id) {
    return COUNTRIES.find(c => c.id === (id || (G && G.countryId) || 'za')) || COUNTRIES[0];
  }

  function getDiff() {
    const id = (G && G.difficulty) || 'normal';
    return DIFFICULTY_PROFILES[id] || DIFFICULTY_PROFILES.normal;
  }

  function saveAll() {
    try {
      if (G) localStorage.setItem(SAVE_KEY, JSON.stringify(G));
      localStorage.setItem(LEGACY_KEY, JSON.stringify(LEGACY));
    } catch {}
  }

  function loadSavedGame() {
    try {
      let raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        const legacyRaw = localStorage.getItem(LEGACY_SAVE_KEY);
        if (legacyRaw) {
          localStorage.setItem(SAVE_KEY, legacyRaw);
          raw = legacyRaw;
        }
      }
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function fmt(zarAmt, countryOverrideId, includeCode = false) {
    const c = getCountry(countryOverrideId);
    const val = Number(zarAmt || 0) * c.fx;
    const abs = Math.abs(val);
    const decimals = (c.fx < 0.12 && abs < 100 && abs > 0) ? 2 : 0;
    const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const symPart = c.id === 'ae' ? `${formatted} ${c.cur}` : `${c.cur}${formatted}`;
    const baseStr = `${val < 0 ? '-' : ''}${symPart}`;
    return includeCode ? `${baseStr} (${c.code})` : baseStr;
  }

  function fmtUsd(zarAmt) {
    const usd = Number(zarAmt || 0) * 0.055;
    const abs = Math.abs(usd);
    const dec = abs > 0 && abs < 100 ? 2 : 0;
    return `${usd < 0 ? '-' : ''}$${abs.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })} (USD)`;
  }

  function fmtFull(zarAmt, locCountryId) {
    const targetC = getCountry(locCountryId);
    const homeC = getCountry();
    const localStr = fmt(zarAmt, targetC.id, true);
    const usdStr = fmtUsd(zarAmt);
    if (targetC.id === homeC.id) return targetC.code === 'USD' ? localStr : `${localStr} = ${usdStr}`;
    return `${localStr} = ${usdStr} = ${fmt(zarAmt, homeC.id, true).replace(')', ' - home)')}`;
  }

  function showToast(msg) {
    const el = $('toastBox');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(window.__lswToastTimer);
    window.__lswToastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
  }

  function openModal(html) {
    const box = $('modalBox');
    const bg = $('modalBackdrop');
    if (!box || !bg) return;
    box.innerHTML = html;
    bg.classList.remove('hidden');
  }

  function closeModal() {
    const bg = $('modalBackdrop');
    if (bg) bg.classList.add('hidden');
  }

  function celebratePopup(title, htmlBody) {
    openModal(`
      <div style="text-align:center;">
        <div style="font-size:2rem;margin-bottom:4px;">🎉</div>
        <h3 class="gold" style="margin-bottom:8px;">${esc(title)}</h3>
      </div>
      <div class="card-alt">${htmlBody}</div>
      <button class="btn btn-gold" onclick="LSW.closeModal()">Continue</button>
    `);
  }

  const barHtml = (pct, cls = '') => `<div class="bar-track"><div class="bar-fill ${cls}" style="width:${clamp(pct)}%;"></div></div>`;

  const circleSvg = (pct, valTxt, label, subTxt, onclickJs, color = '#FACC15', locked = false) => {
    const r = 22, c = 2 * Math.PI * r;
    const p = clamp(pct || 0);
    const off = c * (1 - p / 100);
    return `
      <div class="circle-stat ${locked ? 'lock-circle' : ''}" onclick="${onclickJs}">
        <div class="ring-wrap">
          <svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="${r}" fill="none" stroke="var(--border)" stroke-width="5"/><circle cx="28" cy="28" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" stroke-linecap="round"/></svg>
          <div class="ring-val">${esc(valTxt)}</div>
        </div>
        <div class="circle-lbl">${esc(label)}</div>
        <div class="circle-sub">${esc(subTxt)}</div>
      </div>
    `;
  };

  function applyFontSize() {
    if (!document.body) return;
    const sz = (G && G.settings && G.settings.fontSize) || 'normal';
    document.body.classList.remove('font-sm', 'font-md', 'font-lg');
    document.body.classList.add(sz === 'small' ? 'font-sm' : sz === 'large' ? 'font-lg' : 'font-md');
  }

  function buildDefaultState(opts = {}) {
    const c = COUNTRIES.find(x => x.id === opts.countryId) || pick(COUNTRIES);
    const gender = opts.gender || pick(['M', 'F']);
    const first = opts.firstName || (gender === 'M' ? pick(c.firstM) : pick(c.firstF));
    const surname = opts.surname || pick(c.surnames);
    const city = (opts.city && c.cities.includes(opts.city)) ? opts.city : pick(c.cities);
    const wealth = opts.wealth || pick(['Poor', 'Middle', 'Rich']);
    const baseParentMoney = wealth === 'Rich' ? 420000 : wealth === 'Middle' ? 85000 : 12000;
    const banks = {};
    c.banks.forEach((bn, i) => {
      banks[bn] = { name: bn, checking: 0, savings: i === 0 ? (opts.inheritCash || 0) : 0, fd: 0, loan: 0, apr: 0.045 + i * 0.01 };
    });

    const cp = COUNTRY_PROFILES[c.id] || COUNTRY_PROFILES.za;
    const initialWeather = pick(WEATHER_BY_CLIMATE[cp.climate] || WEATHER_BY_CLIMATE.varied);
    const t1 = pick(TRAITS_LIST);
    const t2 = pick(TRAITS_LIST.filter(t => t.id !== t1.id));

    const offers = {};
    SYSTEM_OFFER_META.forEach(m => { offers[m.key] = { nextInMonths: rand(4, 7), activeOffer: null }; });

    const belief = (opts.belief && String(opts.belief).trim()) || pickBeliefForCountry(c.id);
    const culture = (opts.culture && String(opts.culture).trim()) || pickCultureForCountry(c.id);
    const cNames = CULTURAL_NAMES[culture];
    const gogoLabel = (cNames && cNames.gogo) || 'Grandmother';

    return {
      name: `${first} ${surname}`,
      firstName: first,
      surname,
      gender,
      countryId: c.id,
      city,
      belief,
      culture,
      wealthTier: wealth.toLowerCase(),
      gen: opts.gen || 1,
      age: 0,
      month: 1,
      totalMonths: 0,
      year: 0,
      birthYear: opts.birthYear || 2026,
      tapCount: {},
      sleepUsedThisMonth: 0,
      hasHadFirstJob: false,
      jobChangesThisMonth: 0,
      jobProgress: 0,
      majorStepUsedThisMonth: null,
      cash: 0,
      safeCash: 0,
      piggyBank: 0,
      allowanceMonthly: wealth === 'Rich' ? 1200 : wealth === 'Middle' ? 450 : 120,
      pocketMoneyAskedYear: -1,
      pocketMoneyAskedFrom: null,
      groundedUntilMonth: -1,
      kickedOut: false,
      parentCoveredTotal: 0,
      parentLoan: { active: false, lender: '', amount: 0, dueMonth: 0 },
      weather: initialWeather,
      difficulty: opts.difficulty || 'normal',
      stats: { health: 96, energy: 100, happy: 92, smarts: rand(45, 78), looks: rand(45, 85), fitness: 70, karma: 60, fame: 0, creativity: rand(35, 65), strength: rand(35, 65), discipline: rand(40, 70), morality: rand(45, 78), charisma: rand(40, 72) },
      needs: { hunger: 90, thirst: 90, energy: 100, shelter: 95, clothing: 90, health: 96, learning: 80, work: 75, safety: 92, social: 85, hygiene: 92, transport: 80, communication: 75 },
      confidence: Math.floor(Math.random() * 31),
      streetRespect: 0,
      communityRespect: 0,
      policeHeat: 0,
      innovationScore: 0,
      businessScore: 0,
      creditScore: 650,
      traits: [t1.id, t2.id],
      skills: Object.fromEntries(SKILLS_LIST.map(s => [s, rand(5, 22)])),
      skillLastUsed: Object.fromEntries(SKILLS_LIST.map(s => [s, 0])),
      school: { stage: 'Home / Infant Care', gradePct: 82, detention: 0, benefits: ['Safe Home', 'Free Meals'], clubs: [], excusedDays: 0 },
      edu: {
        stage: 'infant',
        yearInStage: 1,
        progress: 0,
        skippedPreschool: false,
        preschoolDone: false,
        juniorElective: 'Coding',
        seniorElectives: ['Physics', 'Chemistry', 'Computer Science'],
        hsCertified: false,
        hsCertName: '',
        rewritesThisYear: 0,
        tvet: { activeTrade: null, level: 0, completedTrades: [] },
        uni: { activeDegree: null, year: 0, totalYears: 0, completedDegrees: [] },
        onlineCourses: { active: [], completed: [] },
        advancedCourses: [],
        booksRead: 0,
        bookworm: false,
        completedHistory: [],
        tutoredThisMonth: false
      },
      certs: [],
      job: null,
      jobCooldownUntil: {},
      workStats: { perf: 0, integrity: 0, ethics: 80, reviewQuote: 'Ready to begin life!', daysAtJob: 0, promotions: 0, warnings: 0, crimesHidden: 0, crimesCaught: 0 },
      company: opts.inheritCompany || null,
      compliance: { safety: 85, health: 85, tax: 90, labour: 85, env: 85, hearingPending: false },
      searchesLeft: 3,
      mining: { sectorIdx: 0, stepIdx: 0, equipLeft: 3, oreCount: 0 },
      devStudio: { deptIdx: 0, stepIdx: 0, shipped: 0, revenueMonthly: 0 },
      innovation: { patents: 0, activeIdeas: [], history: [], selectedDeptId: 'med' },
      patents: [],
      parents: {
        mother: { name: `${pick(c.firstF)} ${surname}`, job: pick(JOBS_CATALOG).title, money: baseParentMoney, bond: 88, alive: true, age: rand(24, 34), health: rand(78, 96) },
        father: { name: `${pick(c.firstM)} ${surname}`, job: pick(JOBS_CATALOG).title, money: baseParentMoney, bond: 85, alive: true, age: rand(25, 36), health: rand(75, 95) },
        hasGuardian: false,
        guardian: { name: `${pick(c.firstF)} ${surname}`, job: 'Legal Guardian', money: Math.round(baseParentMoney * 0.6), bond: 78 },
        siblings: [{ id: 'sib_1', name: `${pick(c.firstF)} ${surname}`, relation: 'Sister', age: rand(2, 8), stage: 'Primary School', bond: 75, alive: true }],
        extended: [{ id: 'ext_1', name: `${pick(c.firstM)} ${surname}`, relation: 'Uncle', age: rand(35, 58), city: pick(c.cities), bond: 68 }]
      },
      relatives: [
        { id: 'gp_m_f', role: `${gogoLabel} / Grandmother`, side: 'Maternal', name: `${pick(c.firstF)} ${pick(c.surnames)}`, age: rand(60, 74), city, countryId: c.id, health: rand(55, 85), alive: true },
        { id: 'gp_m_m', role: 'Grandfather', side: 'Maternal', name: `${pick(c.firstM)} ${pick(c.surnames)}`, age: rand(62, 76), city: pick(c.cities), countryId: c.id, health: rand(52, 82), alive: true }
      ],
      partner: null,
      children: [],
      npcs: Array.from({ length: 6 }, () => genNpc(c.id)),
      bestFriendId: null,
      socials: [],
      banks,
      cards: [{ type: 'Debit Card', bank: c.banks[0], limit: 0, balance: 0, apr: 0 }],
      investments: {
        sp500: { name: 'Global Index ETF', price: 1850, prev: 1800, units: 0, divPct: 0.03 },
        tech: { name: 'Silicon Tech Fund', price: 2400, prev: 2350, units: 0, divPct: 0.015 },
        gold: { name: 'Gold Bullion Trust', price: 3200, prev: 3150, units: 0, divPct: 0.01 },
        reit: { name: 'Property REIT', price: 1250, prev: 1220, units: 0, divPct: 0.06 }
      },
      houses: opts.inheritHouse ? [opts.inheritHouse] : [],
      cars: [],
      carMods: [],
      racingWins: 0,
      collections: [],
      pets: [],
      items: [],
      inventory: [],
      pendingDeliveries: [],
      equippedOutfit: null,
      utilityState: { electricity: true, water: true, internet: true, simActive: false, powerHours: 72 },
      foodPlan: 'family',
      cityHunt: { foundCount: 0, history: {} },
      activities: { hiking: { lv: 1, xp: 0, km: 0, trails: 0 }, fishing: { lv: 1, xp: 0 }, racing: { lv: 1, xp: 0 }, acting: { lv: 1, xp: 0 }, music: { lv: 1, xp: 0 }, gym: { lv: 1, xp: 0 }, hunting: { lv: 1, xp: 0 }, camping: { lv: 1, xp: 0 }, surfing: { lv: 1, xp: 0 }, skiing: { lv: 1, xp: 0 } },
      logistics: { trust: 20, doneCount: 0, trucks: [] },
      busStation: { open: false, passengerMood: 75, doneCount: 0, cafe: false, buses: [] },
      tours: { completed: 0 },
      tenders: { active: null, completed: 0 },
      auctions: { wonItems: [], bidsPlaced: 0, dynamicBids: {} },
      hobbies: {},
      suppliers: { sampled: {} },
      drugs: { weedPlants: 0, cookedBatches: 0, warehouseKg: 0 },
      jail: { inJail: false, monthsLeft: 0, respect: 30, choresDone: 0, pendingCase: null },
      fakePassport: null,
      ownedPlanes: [],
      visaExpiry: {},
      pendingFlight: null,
      loungeBuff: false,
      will: { written: false, childPct: 75 },
      systemOffers: offers,
      activeCrisis: null,
      crisisPrepared: false,
      activeFuneral: null,
      griefMonthsLeft: 0,
      mourningWeekActive: false,
      lastHolidayMonth: -1,
      memories: [{
        age: 0, month: 1, calYr: opts.birthYear || 2026,
        title: 'First Breath',
        text: `You were born in ${city}, ${c.name}. Your family greeted you with love (${belief} · ${culture}).`,
        city, country: c.name, belief, culture
      }],
      newsFeed: [`Welcome to ${city}, ${c.name}! Global economy steady.`, `School System: ${c.schoolSystem} · Laws: ${c.lawSystem}`],
      wires: [],
      log: [`Born in ${city}, ${c.name} (${wealth} Family · ${belief} · ${culture}). Start Cash: ${c.cur}0.`],
      monthlyReport: [`Welcome! Balance starts at ${c.cur}0. Parents care for you until Age 18.`],
      embarrassingMoments: [],
      phases: { nursery: false, primary: false, highSchool: false, examPassed: false, visitedCountries: [c.id], grandkidsTaught: 0, firstTimes: [] },
      currentEvent: null,
      lineageNote: opts.lineageNote || null,
      recentSearches: [],
      settings: { sound: true, music: false, vibrate: true, popupsEnabled: true, focusMode: false, notif: true, reminders: true, fontSize: 'normal', lang: c.lang }
    };
  }

  function migrateGameState(g) {
    if (!g || typeof g !== 'object') return g;
    const validC = COUNTRIES.find(x => x.id === g.countryId) || COUNTRIES[0];
    const parts = String(g.name || 'Player Citizen').trim().split(/\s+/);
    const def = buildDefaultState({
      countryId: validC.id,
      city: g.city,
      firstName: g.firstName || parts[0] || 'Player',
      surname: g.surname || parts.slice(1).join(' ') || 'Citizen',
      gender: g.gender || 'M',
      gen: Number(g.gen) || 1
    });

    const out = { ...def, ...g };
    out.countryId = validC.id;
    if (!out.city || !validC.cities.includes(out.city)) out.city = validC.cities[0];
    if (typeof g.cash === 'number' && !Number.isNaN(g.cash)) out.cash = g.cash;
    else out.cash = Number(g.money ?? g.balance ?? 0) || 0;
    if (typeof out.age !== 'number' || Number.isNaN(out.age)) out.age = Number(g.age) || 0;
    if (typeof out.month !== 'number' || Number.isNaN(out.month)) out.month = 1;
    if (typeof out.totalMonths !== 'number' || Number.isNaN(out.totalMonths)) out.totalMonths = out.age * 12;
    if (typeof g.year !== 'number' || g.year > 1900) out.year = out.age;
    if (typeof out.gen !== 'number' || Number.isNaN(out.gen)) out.gen = 1;
    if (!out.difficulty || !DIFFICULTY_PROFILES[out.difficulty]) out.difficulty = 'normal';

    const rawStats = (g.stats && typeof g.stats === 'object') ? g.stats : {};
    out.stats = { ...def.stats, ...rawStats };
    ['health', 'energy', 'happy', 'smarts', 'looks', 'fitness', 'karma', 'fame', 'creativity', 'strength', 'discipline', 'morality', 'charisma'].forEach(k => {
      if (typeof rawStats[k] !== 'number') {
        if (typeof g[k] === 'number') out.stats[k] = clamp(g[k]);
        else if (k === 'happy' && typeof g.happiness === 'number') out.stats[k] = clamp(g.happiness);
      }
    });

    out.needs = { ...def.needs, ...(g.needs && typeof g.needs === 'object' ? g.needs : {}) };
    ['hunger', 'thirst', 'energy', 'health'].forEach(k => {
      if (typeof g[k] === 'number' && (!g.needs || typeof g.needs[k] !== 'number')) out.needs[k] = clamp(g[k]);
    });

    const mergeObjKeys = ['parentLoan', 'school', 'edu', 'workStats', 'compliance', 'mining', 'devStudio', 'innovation', 'parents', 'banks', 'investments', 'cityHunt', 'activities', 'logistics', 'busStation', 'tours', 'tenders', 'auctions', 'suppliers', 'drugs', 'jail', 'will', 'utilityState', 'phases', 'settings'];
    mergeObjKeys.forEach(k => {
      out[k] = { ...def[k], ...(g[k] && typeof g[k] === 'object' ? g[k] : {}) };
    });
    if (!out.edu.tvet) out.edu.tvet = { ...def.edu.tvet };
    if (!out.edu.uni) out.edu.uni = { ...def.edu.uni };
    if (!out.edu.onlineCourses) out.edu.onlineCourses = { ...def.edu.onlineCourses };
    if (!Array.isArray(out.edu.seniorElectives)) out.edu.seniorElectives = [...def.edu.seniorElectives];
    if (!Array.isArray(out.edu.completedHistory)) out.edu.completedHistory = [];
    if (!Array.isArray(out.edu.advancedCourses)) out.edu.advancedCourses = [];
    if (!Array.isArray(out.innovation.activeIdeas)) out.innovation.activeIdeas = [];
    if (!Array.isArray(out.innovation.history)) out.innovation.history = [];
    if (!out.parents.mother) out.parents.mother = def.parents.mother;
    if (!out.parents.father) out.parents.father = def.parents.father;
    if (!out.parents.guardian) out.parents.guardian = def.parents.guardian;
    if (!Array.isArray(out.parents.siblings)) out.parents.siblings = def.parents.siblings;
    if (!Array.isArray(out.parents.extended)) out.parents.extended = def.parents.extended;
    if (out.activities) {
      Object.keys(def.activities).forEach(ak => {
        if (!out.activities[ak]) out.activities[ak] = { ...def.activities[ak] };
      });
    }
    const arrayKeys = ['traits', 'certs', 'patents', 'children', 'npcs', 'socials', 'cards', 'houses', 'cars', 'carMods', 'collections', 'pets', 'items', 'inventory', 'pendingDeliveries', 'ownedPlanes', 'newsFeed', 'wires', 'log', 'monthlyReport', 'embarrassingMoments', 'recentSearches', 'relatives', 'memories'];
    arrayKeys.forEach(k => {
      if (!Array.isArray(out[k])) out[k] = Array.isArray(def[k]) ? def[k] : [];
    });
    if (!out.belief) out.belief = def.belief;
    if (!out.culture) out.culture = def.culture;
    if (typeof out.griefMonthsLeft !== 'number') out.griefMonthsLeft = 0;
    if (typeof out.mourningWeekActive !== 'boolean') out.mourningWeekActive = false;
    if (typeof out.lastHolidayMonth !== 'number') out.lastHolidayMonth = -1;
    if (!out.skills || typeof out.skills !== 'object') out.skills = { ...def.skills };
    if (!out.skillLastUsed || typeof out.skillLastUsed !== 'object') out.skillLastUsed = { ...def.skillLastUsed };
    if (!out.jobCooldownUntil || typeof out.jobCooldownUntil !== 'object') out.jobCooldownUntil = {};
    if (!out.visaExpiry || typeof out.visaExpiry !== 'object') out.visaExpiry = {};
    if (typeof out.safeCash !== 'number') out.safeCash = 0;
    if (!out.systemOffers || typeof out.systemOffers !== 'object') out.systemOffers = {};
    if (!out.tapCount || typeof out.tapCount !== 'object') out.tapCount = {};
    if (typeof out.sleepUsedThisMonth !== 'number') out.sleepUsedThisMonth = 0;
    if (typeof out.birthYear !== 'number') out.birthYear = 2026;
    if (typeof out.hasHadFirstJob !== 'boolean') out.hasHadFirstJob = Boolean(out.job);
    if (typeof out.jobChangesThisMonth !== 'number') out.jobChangesThisMonth = 0;
    if (typeof out.jobProgress !== 'number') out.jobProgress = 0;
    if (typeof out.innovationScore !== 'number') out.innovationScore = 0;
    if (typeof out.businessScore !== 'number') out.businessScore = 0;
    if (typeof out.settings.focusMode !== 'boolean') out.settings.focusMode = false;
    SYSTEM_OFFER_META.forEach(m => {
      if (!out.systemOffers[m.key]) out.systemOffers[m.key] = { nextInMonths: rand(4, 7), activeOffer: null };
    });
    return out;
  }

  /* ============================================================
     5. EXACT 4-SECOND LOADER & NO-LOGIN STARTUP SCREEN
     ============================================================ */
  let loaderFinished = false;
  function finishLoading() {
    if (loaderFinished) return;
    loaderFinished = true;
    const loader = $('loaderOverlay');
    if (loader) loader.style.display = 'none';
    if (document.body) document.body.classList.remove('loading');

    try {
      const saved = loadSavedGame();
      if (saved && saved.name) {
        G = migrateGameState(saved);
        enterGame();
        if (G.dead) triggerDeath(G.deathCause || 'Passed away');
        return;
      }
    } catch {
      // Fall back cleanly to startup screen if existing local save is corrupted
    }
    openStartScreen();
  }

  function startLoader() {
    loaderFinished = false;
    if (document.body) document.body.classList.add('loading');
    const loader = $('loaderOverlay');
    if (loader) loader.style.display = 'flex';
    const msgEl = $('loaderMsg');
    const fillEl = $('loaderBarFill');
    const pctEl = $('loaderPct');

    const steps = [
      { ms: 0, pct: 0, msg: 'Loading Your World' },
      { ms: 1000, pct: 25, msg: 'Loading Countries' },
      { ms: 2000, pct: 50, msg: 'Loading Currencies' },
      { ms: 3000, pct: 75, msg: 'Loading Laws and Schools' },
      { ms: 3850, pct: 100, msg: 'Starting Your Life' }
    ];

    const setStep = (pct, msg) => {
      if (loaderFinished) return;
      if (msgEl) msgEl.textContent = msg;
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (pctEl) pctEl.textContent = `${pct}%`;
    };

    steps.forEach(st => setTimeout(() => setStep(st.pct, st.msg), st.ms));
    setTimeout(finishLoading, 4000);
    setTimeout(finishLoading, 5200);
  }

  function genNpc(countryId, forceGender, forceCat) {
    const c = getCountry(countryId);
    const gender = forceGender || pick(['M', 'F']);
    const first = gender === 'M' ? pick(c.firstM) : pick(c.firstF);
    const sur = pick(c.surnames);
    const job = pick(JOBS_CATALOG);
    const cat = forceCat || pick(['School Friends', 'Work Friends', 'Neighbour Friends', 'Online Friends', 'Childhood Friends']);
    return {
      id: 'npc_' + Math.random().toString(36).slice(2, 9),
      name: `${first} ${sur}`,
      gender,
      countryId: c.id,
      city: pick(c.cities),
      age: rand(18, 48),
      category: cat,
      jobTitle: job.title,
      personality: pick(['Kind', 'Funny', 'Mean', 'Smart', 'Rich', 'Poor']),
      ethicsScore: rand(35, 95),
      wealth: rand(8000, 320000),
      bond: rand(35, 75),
      lastMet: 'Recent',
      blocked: false,
      enemy: false,
      interactedThisMonth: false
    };
  }

  function createCharacter(opts = {}) {
    return migrateGameState(buildDefaultState(opts));
  }

  function openStartScreen() {
    $('startupScreen').classList.remove('hidden');
    $('topHud').classList.add('hidden');
    $('appShell').classList.add('hidden');
    $('bottomNav').classList.add('hidden');

    const c = getCountry(UI_STATE.customCountryId || 'za');
    const cCultures = CULTURE_BY_COUNTRY[c.id] || ['Local Heritage', 'Other'];
    $('startupBody').innerHTML = `
      <div class="grid2" style="margin-bottom:10px;">
        <button class="btn btn-gold" onclick="LSW.startRandomLife()">🎲 START RANDOM LIFE</button>
        <button class="btn btn-blue" onclick="LSW.toggleCustomForm()">✍️ CUSTOMISE LIFE</button>
      </div>
      <div id="customLifeBox" class="card-alt hidden" style="text-align:left;">
        <label class="muted">Full First Name</label>
        <input id="custFirst" type="text" placeholder="e.g. Thabo / Olivia" />
        <label class="muted">Surname</label>
        <input id="custSurname" type="text" placeholder="e.g. Nkosi / Smith" />
        <div class="grid2">
          <div>
            <label class="muted">Gender</label>
            <select id="custGender"><option value="M">Male</option><option value="F">Female</option></select>
          </div>
          <div>
            <label class="muted">Family Wealth</label>
            <select id="custWealth"><option value="Middle">Middle Class</option><option value="Poor">Poor</option><option value="Rich">Rich</option></select>
          </div>
        </div>
        <div class="grid2">
          <div>
            <label class="muted">Country (21 Countries)</label>
            <select id="custCountry" onchange="LSW.updateCustomCountry(this.value)">
              ${COUNTRIES.map(cn => `<option value="${cn.id}" ${cn.id === c.id ? 'selected' : ''}>${esc(cn.name)} (${esc(cn.cur)})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="muted">City</label>
            <select id="custCity">
              ${c.cities.map(ct => `<option value="${esc(ct)}">${esc(ct)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid2" style="margin-top:6px;">
          <div>
            <label class="muted">Belief / Religion</label>
            <select id="custBelief" onchange="LSW.onCustomSelectOther('custBelief','custBeliefOther')">
              ${BELIEF_LIST.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('')}
            </select>
            <input id="custBeliefOther" class="hidden" type="text" placeholder="Type belief..." style="margin-top:4px;" />
          </div>
          <div>
            <label class="muted">Culture / Ethnic Group</label>
            <select id="custCulture" onchange="LSW.onCustomSelectOther('custCulture','custCultureOther')">
              ${cCultures.map(cl => `<option value="${esc(cl)}">${esc(cl)}</option>`).join('')}
            </select>
            <input id="custCultureOther" class="hidden" type="text" placeholder="Type culture..." style="margin-top:4px;" />
          </div>
        </div>
        <button class="btn btn-gold" style="margin-top:8px;" onclick="LSW.birthCustomCharacter()">🌟 Begin Custom Life (Age 0)</button>
      </div>
      ${LEGACY.gens.length ? `<div class="muted" style="margin-top:8px;">🏆 Legacy Lineage: ${LEGACY.gens.length} Past Generations · Best Net Worth ${fmt(LEGACY.bestNet)}</div>` : ''}
    `;
  }

  function enterGame() {
    $('startupScreen').classList.add('hidden');
    $('topHud').classList.remove('hidden');
    $('appShell').classList.remove('hidden');
    $('bottomNav').classList.remove('hidden');
    applyFontSize();
    if (!G.currentEvent) G.currentEvent = genMonthEvent();
    rateSessionStart = Date.now();
    scheduleRateCheck(90000);
    saveAll();
    render();
  }

  function startRandomLife() {
    G = createCharacter({});
    enterGame();
  }

  function toggleCustomForm() {
    const el = $('customLifeBox');
    if (el) el.classList.toggle('hidden');
  }

  function onCustomSelectOther(selId, inpId) {
    const sel = $(selId), inp = $(inpId);
    if (!sel || !inp) return;
    inp.classList.toggle('hidden', sel.value !== 'Other');
  }

  function updateCustomCountry(cid) {
    UI_STATE.customCountryId = cid;
    const c = getCountry(cid);
    const citySel = $('custCity');
    if (citySel) {
      citySel.innerHTML = c.cities.map(ct => `<option value="${esc(ct)}">${esc(ct)}</option>`).join('');
    }
    const culSel = $('custCulture');
    if (culSel) {
      const cCultures = CULTURE_BY_COUNTRY[cid] || ['Local Heritage', 'Other'];
      culSel.innerHTML = cCultures.map(cl => `<option value="${esc(cl)}">${esc(cl)}</option>`).join('');
      onCustomSelectOther('custCulture', 'custCultureOther');
    }
  }

  function birthCustomCharacter() {
    const cid = $('custCountry') ? $('custCountry').value : 'za';
    const city = $('custCity') ? $('custCity').value : getCountry(cid).cities[0];
    const first = ($('custFirst') && $('custFirst').value.trim()) || '';
    const surname = ($('custSurname') && $('custSurname').value.trim()) || '';
    const gender = $('custGender') ? $('custGender').value : 'M';
    const wealth = $('custWealth') ? $('custWealth').value : 'Middle';
    const bSel = $('custBelief') ? $('custBelief').value : pickBeliefForCountry(cid);
    const bOth = ($('custBeliefOther') && $('custBeliefOther').value.trim()) || '';
    const belief = bSel === 'Other' && bOth ? bOth : bSel;
    const cSel = $('custCulture') ? $('custCulture').value : pickCultureForCountry(cid);
    const cOth = ($('custCultureOther') && $('custCultureOther').value.trim()) || '';
    const culture = cSel === 'Other' && cOth ? cOth : cSel;
    G = createCharacter({ countryId: cid, city, firstName: first, surname, gender, wealth, belief, culture });
    enterGame();
  }

  /* ============================================================
     6. ECONOMICS, FAMILY SHIELD, NEEDS, SCARCITY & LUGGAGE
     ============================================================ */
  function isFamilyShieldActive() {
    if (!G) return false;
    const momOk = G.parents && G.parents.mother && G.parents.mother.bond >= 50;
    const dadOk = G.parents && G.parents.father && G.parents.father.bond >= 50;
    return G.age < 18 && !G.kickedOut && (momOk || dadOk);
  }

  function getSeasonName(month, countryId) {
    const m = ((Number(month) || 1) - 1) % 12;
    const cid = countryId || (G && G.countryId) || 'za';
    if (['ng', 'gh', 'ke', 'sg', 'in'].includes(cid)) {
      if (m <= 1 || m === 11) return 'Dry / Crisp';
      if (m <= 4) return 'Warm / Pre-Rain';
      if (m <= 8) return 'Rainy Season';
      return 'Harvest / Mild';
    }
    const south = ['za', 'au', 'br'].includes(cid);
    if (m <= 1 || m === 11) return south ? 'Summer' : 'Winter';
    if (m <= 4) return south ? 'Autumn' : 'Spring';
    if (m <= 7) return south ? 'Winter' : 'Summer';
    return south ? 'Spring' : 'Autumn';
  }

  function claimMajorStep(stepLabel) {
    if (!G) return false;
    if (G.majorStepUsedThisMonth) {
      openModal(`
        <h3 class="warn">⏳ 1 Major Process Step Monthly Limit</h3>
        <div class="card-alt">
          <div><strong>Rule:</strong> 1 Month = 1 Major Process Step, Globally.</div>
          <div style="margin-top:6px;">You already executed: <strong class="gold">${esc(G.majorStepUsedThisMonth)}</strong> this month.</div>
          <div class="muted" style="margin-top:6px;">Small actions like Sleep, Study, Assignments, Read Library Book, Socialize, Work Shift, Shopping, or Use Item remain available!</div>
        </div>
        <div class="grid2">
          <button class="btn btn-gold btn-sm" onclick="LSW.closeModal();LSW.advanceMonth();">⏭ Next Month</button>
          <button class="btn btn-dark btn-sm" onclick="LSW.closeModal()">OK</button>
        </div>
      `);
      return false;
    }
    G.majorStepUsedThisMonth = stepLabel;
    return true;
  }

  function getEducationSpeedMult() {
    if (!G || !G.edu) return 1;
    if ((G.edu.uni && ((G.edu.uni.completedDegrees || []).length > 0 || G.edu.uni.activeDegree)) || G.edu.stage === 'university') return 2;
    if (G.edu.hsCertified || (G.edu.tvet && ((G.edu.tvet.completedTrades || []).length > 0 || G.edu.tvet.activeTrade)) || ['senior', 'tvet'].includes(G.edu.stage)) return 1.5;
    return 1;
  }

  function getEduSalaryMult() {
    if (!G || !G.edu) return 1;
    let mult = G.edu.hsCertified ? 1.15 : 1;
    (G.edu.uni && G.edu.uni.completedDegrees || []).forEach(did => {
      const dg = UNI_DEGREES.find(x => x.id === did);
      if (dg && dg.salMult > mult) mult = dg.salMult;
    });
    (G.edu.tvet && G.edu.tvet.completedTrades || []).forEach(tid => {
      const tr = TVET_TRADES.find(x => x.id === tid);
      if (tr && tr.salMult > mult) mult = tr.salMult;
    });
    return mult;
  }

  function getEduCurrentLabel(cidOverride) {
    if (!G || !G.edu) return 'Home Care';
    const ce = getCountryEdu(cidOverride || G.countryId);
    const e = G.edu;
    if (e.stage === 'infant') return `Home · Infant Care (Age 0–2)`;
    if (e.stage === 'preschool') return `${ce.preschoolName} (Age 3–5)`;
    if (e.stage === 'primary') return `Year ${Math.min(e.yearInStage, ce.primaryYears)} · ${ce.primaryName}`;
    if (e.stage === 'junior') return `Year ${Math.min(e.yearInStage, ce.juniorYears)} · ${ce.juniorName}`;
    if (e.stage === 'senior') return `Year ${Math.min(e.yearInStage, ce.seniorYears)} · ${ce.seniorName}`;
    if (e.stage === 'tvet') {
      const tr = TVET_TRADES.find(x => x.id === (e.tvet && e.tvet.activeTrade));
      return `Level ${e.tvet.level || 1} · ${tr ? tr.name : ''} (${ce.tvetName})`;
    }
    if (e.stage === 'university') {
      const dg = UNI_DEGREES.find(x => x.id === (e.uni && e.uni.activeDegree));
      return `Year ${e.uni.year || 1} · University (${dg ? dg.name : 'Degree'})`;
    }
    if (e.uni && e.uni.completedDegrees && e.uni.completedDegrees.length) {
      const last = UNI_DEGREES.find(x => x.id === e.uni.completedDegrees[e.uni.completedDegrees.length - 1]);
      return `University Graduate (${last ? last.name : 'Degree'})`;
    }
    if (e.tvet && e.tvet.completedTrades && e.tvet.completedTrades.length) {
      const last = TVET_TRADES.find(x => x.id === e.tvet.completedTrades[e.tvet.completedTrades.length - 1]);
      return `TVET Certified (${last ? last.name : 'Trade'})`;
    }
    if (e.hsCertified) return e.hsCertName || `High School Graduate (${ce.finalExamName})`;
    return G.school && G.school.stage ? G.school.stage : 'Independent / Adult Learner';
  }

  function transferEducationToCountry(destC) {
    if (!G || !G.edu || !destC) return null;
    const midStages = ['preschool', 'primary', 'junior', 'senior', 'tvet', 'university'];
    if (!midStages.includes(G.edu.stage)) return null;
    const ce = getCountryEdu(destC.id);
    if (G.edu.stage === 'primary') G.edu.yearInStage = Math.min(G.edu.yearInStage, ce.primaryYears);
    if (G.edu.stage === 'junior') G.edu.yearInStage = Math.min(G.edu.yearInStage, ce.juniorYears);
    if (G.edu.stage === 'senior') G.edu.yearInStage = Math.min(G.edu.yearInStage, ce.seniorYears);
    if (G.edu.stage === 'university' && G.edu.uni) G.edu.uni.totalYears = ce.universityYears;
    const newGrade = getEduCurrentLabel(destC.id);
    G.school.stage = newGrade;
    const msg = `Your education transferred to ${destC.name} system: You are now in ${newGrade} - ${destC.schoolSystem}. Your syllabus changed to ${ce.syllabus.join(', ')} (${ce.languageOfInstruction}).`;
    G.log.unshift(`🎓 ${msg}`);
    return msg;
  }

  function guardAge16(sysLabel) {
    if (!G || G.age >= 16) return true;
    const c = getCountry();
    openModal(`
      <h3 class="warn">🔒 Child Safety Lock — ${esc(sysLabel)}</h3>
      <div class="card-alt">
        <div><strong>Age ${G.age}:</strong> You must finish school first. Work unlocks at 16.</div>
        <div class="muted" style="margin-top:6px;">By International Law (ILO) + ${esc(c.name)} (${esc(c.lawSystem)}): School is compulsory until 16 in ${esc(c.name)}. Focus on ${esc(c.schoolSystem)}, Library Books, Friends & Piggy Bank!</div>
      </div>
      <div class="grid2">
        <button class="btn btn-gold btn-sm" onclick="LSW.closeModal();LSW.setSub('workView','edu');LSW.switchTab('work');">🎓 Go to Education</button>
        <button class="btn btn-dark btn-sm" onclick="LSW.closeModal()">Understood</button>
      </div>
    `);
    return false;
  }

  function calcNetWorth() {
    if (!G) return 0;
    const bankSum = Object.values(G.banks || {}).reduce((s, b) => s + (b.checking || 0) + (b.savings || 0) + (b.fd || 0) - (b.loan || 0), 0);
    const invSum = Object.values(G.investments || {}).reduce((s, iv) => s + (iv.units || 0) * (iv.price || 0), 0);
    const houseSum = (G.houses || []).reduce((s, h) => s + (h.val || h.cost || 0), 0);
    const carSum = (G.cars || []).reduce((s, cr) => s + (cr.val || cr.cost || 0), 0);
    const colSum = (G.collections || []).reduce((s, cl) => s + (cl.val || cl.cost || 0), 0);
    const gearSum = (G.inventory || []).reduce((s, it) => s + Math.round((it.buyPriceZar || 0) * ((it.qty || 1) * 0.7)), 0);
    const compSum = G.company ? (G.company.valuation || 0) : 0;
    return Math.round((G.cash || 0) + (G.safeCash || 0) + (G.piggyBank || 0) + bankSum + invSum + houseSum + carSum + colSum + gearSum + compSum);
  }

  let lastTapTs = 0;
  let rateSessionStart = 0;
  let rateLaterCount = 0;
  let rateTimerHandle = null;

  function guardTap(actionKey, isSleep = false) {
    if (!G) return false;
    const now = Date.now();
    if (now - lastTapTs < 400) return false;
    lastTapTs = now;
    try {
      const ev = typeof window !== 'undefined' ? window.event : null;
      const btn = ev && ev.target && ev.target.closest ? ev.target.closest('button') : null;
      if (btn && !btn.disabled) {
        btn.disabled = true;
        setTimeout(() => { try { btn.disabled = false; } catch {} }, 400);
      }
    } catch {}

    if (isSleep) {
      if ((G.sleepUsedThisMonth || 0) >= 2) {
        showToast('😴 Already rested twice this month. Wait for Next Month.');
        openModal(`<h3 class="warn">😴 Rest Limit</h3><div class="card-alt">Already rested twice this month. Wait for Next Month.</div><button class="btn btn-gold" onclick="LSW.closeModal()">OK</button>`);
        return false;
      }
      G.sleepUsedThisMonth = (G.sleepUsedThisMonth || 0) + 1;
      return true;
    }

    if (!G.tapCount || typeof G.tapCount !== 'object') G.tapCount = {};
    const key = `${actionKey}_${G.month}_${G.year}`;
    if ((G.tapCount[key] || 0) >= 3) {
      const msg = 'Slow down! You already did this 3 times this month. Wait for Next Month.';
      showToast(msg);
      openModal(`<h3 class="warn">⏳ Action Limit Reached</h3><div class="card-alt">${msg}</div><button class="btn btn-gold" onclick="LSW.closeModal()">OK</button>`);
      return false;
    }
    G.tapCount[key] = (G.tapCount[key] || 0) + 1;
    return true;
  }

  function getRateDayObj() {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const parsed = JSON.parse(localStorage.getItem(RATE_DAY_KEY) || 'null');
      if (parsed && parsed.day === today) return parsed;
    } catch {}
    return { day: today, count: 0 };
  }

  function canShowRatePopup() {
    if (!G || G.dead || G.activeFuneral) return false;
    if (G.settings && G.settings.focusMode) return false;
    try {
      const st = localStorage.getItem(RATE_KEY);
      if (st === 'rated' || st === 'never') return false;
      if (rateLaterCount >= 3) return false;
      if (getRateDayObj().count >= 3) return false;
      const now = Date.now();
      if (!rateSessionStart || now - rateSessionStart < 90000) return false;
      const lastD = Number(localStorage.getItem(RATE_DISMISS_KEY) || 0);
      if (lastD && now - lastD < 600000) return false;
    } catch { return false; }

    if (UI_STATE.tab !== 'home' || UI_STATE.menuPage || UI_STATE.quizFlow) return false;
    const bg = $('modalBackdrop'), ldr = $('loaderOverlay'), stScr = $('startupScreen');
    if (bg && !bg.classList.contains('hidden')) return false;
    if (ldr && ldr.style.display !== 'none') return false;
    if (stScr && !stScr.classList.contains('hidden')) return false;
    return true;
  }

  function scheduleRateCheck(delayMs = 90000) {
    clearTimeout(rateTimerHandle);
    rateTimerHandle = setTimeout(() => {
      if (canShowRatePopup()) {
        showRatePopup();
      } else {
        try {
          const st = localStorage.getItem(RATE_KEY);
          if (st !== 'rated' && st !== 'never' && rateLaterCount < 3 && getRateDayObj().count < 3) {
            scheduleRateCheck(15000);
          }
        } catch {}
      }
    }, delayMs);
  }

  function showRatePopup() {
    if (!canShowRatePopup()) return false;
    const dayObj = getRateDayObj();
    dayObj.count += 1;
    try { localStorage.setItem(RATE_DAY_KEY, JSON.stringify(dayObj)); } catch {}
    openModal(`
      <div class="between" style="margin-bottom:8px;">
        <h3 class="gold" style="margin:0;">⭐ Enjoying L.S.W?</h3>
        <button class="modal-close-x" type="button" onclick="LSW.rateAction('later')" aria-label="Close">✕</button>
      </div>
      <div class="card-alt">Rate LifeSim World to help us grow!</div>
      <div class="grid3" style="margin-top:8px;">
        <button class="btn btn-gold btn-sm" onclick="LSW.rateAction('now')">⭐ Rate Now</button>
        <button class="btn btn-blue btn-sm" onclick="LSW.rateAction('later')">Later</button>
        <button class="btn btn-dark btn-sm" onclick="LSW.rateAction('never')">Never</button>
      </div>
    `);
    return true;
  }

  function rateAction(choice) {
    closeModal();
    if (choice === 'now') {
      try { localStorage.setItem(RATE_KEY, 'rated'); } catch {}
      showToast('⭐ Thank you for rating LifeSim World!');
    } else if (choice === 'never') {
      try { localStorage.setItem(RATE_KEY, 'never'); } catch {}
      showToast('Got it — rate prompt hidden.');
    } else {
      rateLaterCount += 1;
      try { localStorage.setItem(RATE_DISMISS_KEY, String(Date.now())); } catch {}
      if (rateLaterCount < 3 && getRateDayObj().count < 3) scheduleRateCheck(600000);
    }
  }

  function useEnergy(amt) {
    if (!G) return false;
    const cap = getDiff().energyCap;
    if (G.stats.energy < amt) {
      showToast(`Low Energy (${G.stats.energy}). Tap Rest or Eat Food.`);
      return false;
    }
    G.stats.energy = clamp(G.stats.energy - amt, 0, cap);
    if (G.needs) G.needs.energy = G.stats.energy;
    return true;
  }

  function restNow() {
    if (!G || !guardTap('rest_sleep', true)) return;
    const d = getDiff();
    G.stats.energy = clamp(G.stats.energy + d.energyRecov, 0, d.energyCap);
    G.stats.happy = clamp(G.stats.happy + 4);
    G.stats.health = clamp(G.stats.health + 4);
    if (G.needs) {
      G.needs.energy = G.stats.energy;
      G.needs.health = G.stats.health;
    }
    showToast(`😴 Rested nicely! Energy restored, Health & Happiness lifted.`);
    saveAll();
    render();
  }

  /* ============================================================
     SECTION 22: BELIEFS, CULTURES, FUNERALS, MEMORIES & FOCUS
     ============================================================ */
  function getCulturalGreeting() {
    if (!G) return 'Hello';
    if (G.belief === 'Islam' && ['Arabic', 'Emirati', 'Egyptian Arab', 'Moroccan Arab', 'Hausa'].includes(G.culture)) return 'As-salamu alaykum, my child';
    return CULTURAL_GREETINGS[G.culture] || `Hello, ${G.firstName || 'my child'}`;
  }

  function recordMemory(title, text) {
    if (!G) return;
    if (!Array.isArray(G.memories)) G.memories = [];
    const c = getCountry();
    G.memories.unshift({
      age: G.age,
      month: G.month,
      calYr: (G.birthYear || 2026) + (G.age || 0),
      title,
      text,
      city: G.city,
      country: c.name,
      belief: G.belief,
      culture: G.culture
    });
  }

  let slowMomentNextFn = null;
  function showSlowMoment(title, bodyText, nextFn = null) {
    slowMomentNextFn = typeof nextFn === 'function' ? nextFn : null;
    openModal(`
      <div style="text-align:center;padding:10px 4px;">
        <div style="font-size:1.8em;margin-bottom:6px;">🕯️</div>
        <h3 class="gold" style="margin-bottom:8px;">${esc(title)}</h3>
        <div class="card-alt" style="line-height:1.55;margin-bottom:10px;">${esc(bodyText)}</div>
        <div class="muted" style="font-style:italic;margin-bottom:12px;">Take a moment. Breathe. Remember.</div>
        <button class="btn btn-gold" onclick="LSW.continueSlowMoment()">Continue</button>
      </div>
    `);
  }

  function continueSlowMoment() {
    const fn = slowMomentNextFn;
    slowMomentNextFn = null;
    closeModal();
    if (fn) fn();
    render();
  }

  function openMemoriesModal() {
    if (!G) return;
    const mems = G.memories || [];
    openModal(`
      <div class="between" style="margin-bottom:8px;">
        <h3 class="gold" style="margin:0;">📖 Life Story & Memories</h3>
        <button class="modal-close-x" type="button" onclick="LSW.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="muted" style="margin-bottom:8px;">Belief: <strong>${esc(G.belief)}</strong> · Culture: <strong>${esc(G.culture)}</strong></div>
      ${mems.map(m => `
        <div class="card-alt">
          <div class="between"><strong>${esc(m.title)}</strong><span class="gold">${esc(MONTH_NAMES[(m.month - 1) % 12])} ${m.calYr} (Age ${m.age})</span></div>
          <div style="margin-top:4px;line-height:1.45;">${esc(m.text)}</div>
          <div class="muted" style="font-size:0.78em;margin-top:4px;">📍 ${esc(m.city)}, ${esc(m.country)} · ${esc(m.belief)} · ${esc(m.culture)}</div>
        </div>
      `).join('') || '<div class="muted">Your story is just beginning.</div>'}
      <button class="btn btn-gold" onclick="LSW.closeModal()">Close</button>
    `);
  }

  function toggleFocusMode() {
    if (!G) return;
    if (!G.settings) G.settings = {};
    G.settings.focusMode = !G.settings.focusMode;
    showToast(G.settings.focusMode ? '🌙 You are in your zone. We will not bother you.' : '☀️ Focus Mode turned off.');
    saveAll();
    render();
  }

  function checkFoodAndEat(id, forceConfirm = false) {
    if (!G || !guardTap('food_' + id)) return;
    const f = FOOD_ITEMS.find(x => x.id === id);
    if (!f) return;

    if (f.isAlcohol) {
      if (G.mourningWeekActive) {
        openModal(`<h3 class="warn">🕯️ Family Mourning</h3><div class="card-alt">Your family is mourning right now. Out of respect, drinking and partying are paused.</div><button class="btn btn-gold" onclick="LSW.closeModal()">Understood</button>`);
        return;
      }
      if (G.age < 21) {
        showToast('🔞 Alcohol is restricted to Age 21+.');
        return;
      }
    }

    if (!forceConfirm) {
      if (f.isAlcohol && ['Islam', 'Buddhism', 'Hinduism'].includes(G.belief)) {
        openModal(`
          <h3 class="warn">🕊️ Respecting Your Belief</h3>
          <div class="card-alt">Your belief (${esc(G.belief)}) discourages or forbids alcohol. Do you still want to proceed? Choosing to drink may affect Morality and Community Respect.</div>
          <div class="grid2" style="margin-top:8px;">
            <button class="btn btn-gold btn-sm" onclick="LSW.closeModal()">Step Away</button>
            <button class="btn btn-dark btn-sm" onclick="LSW.closeModal();LSW.checkFoodAndEat('${esc(id)}',true);">Proceed</button>
          </div>
        `);
        return;
      }
      if (f.hasPork && ['Islam', 'Judaism'].includes(G.belief)) {
        openModal(`
          <h3 class="warn">🕊️ Dietary Guidance</h3>
          <div class="card-alt"><strong>${esc(f.name)}</strong> contains pork, which your belief (${esc(G.belief)}) forbids. Do you want to choose something else?</div>
          <div class="grid2" style="margin-top:8px;">
            <button class="btn btn-gold btn-sm" onclick="LSW.closeModal()">Choose Another Meal</button>
            <button class="btn btn-dark btn-sm" onclick="LSW.closeModal();LSW.checkFoodAndEat('${esc(id)}',true);">Proceed Anyway</button>
          </div>
        `);
        return;
      }
      if (f.hasBeef && G.belief === 'Hinduism') {
        openModal(`
          <h3 class="warn">🕊️ Dietary Guidance</h3>
          <div class="card-alt"><strong>${esc(f.name)}</strong> contains beef. In Hinduism, beef is avoided out of reverence. Choose another dish?</div>
          <div class="grid2" style="margin-top:8px;">
            <button class="btn btn-gold btn-sm" onclick="LSW.closeModal()">Choose Another Meal</button>
            <button class="btn btn-dark btn-sm" onclick="LSW.closeModal();LSW.checkFoodAndEat('${esc(id)}',true);">Proceed Anyway</button>
          </div>
        `);
        return;
      }
    }

    if (!chargeMoney(f.cost, f.name)) return;
    G.stats.energy = clamp(G.stats.energy + f.eng);
    G.stats.health = clamp(G.stats.health + f.hp);
    G.stats.happy = clamp(G.stats.happy + (f.hap || 4));
    if (G.needs) {
      G.needs.hunger = clamp((G.needs.hunger || 80) + 18);
      G.needs.energy = G.stats.energy;
      G.needs.health = G.stats.health;
    }

    if (forceConfirm) {
      G.stats.morality = clamp(G.stats.morality - 4);
      G.communityRespect = clamp(G.communityRespect - 4);
      showToast(`Ate ${f.name} — family & community noticed the conflict with your belief.`);
    } else if (f.isAlcohol && G.griefMonthsLeft > 0) {
      G.stats.morality = clamp(G.stats.morality - 5);
      G.communityRespect = clamp(G.communityRespect - 5);
      showToast('People gently notice it is still early in mourning.');
    } else if (Array.isArray(f.cultureFav) && f.cultureFav.includes(G.culture)) {
      G.communityRespect = clamp(G.communityRespect + 2);
      G.stats.happy = clamp(G.stats.happy + 4);
      showToast(`🍲 Shared ${f.name} — felt close to ${G.culture} roots!`);
    } else {
      showToast(`🍽️ Enjoyed ${f.name}!`);
    }
    saveAll();
    render();
  }

  function getWeddingOptions() {
    const c = getCountry();
    const mult = c.costMult * getDiff().costMult;
    const isAfrica = ['za', 'ng', 'gh', 'ke'].includes(c.id);
    return [
      { id: 'traditional', name: isAfrica ? '🥁 Traditional Wedding & Lobola / Family Ceremony' : `🥁 Traditional ${G.culture} Wedding`, cost: Math.round((isAfrica ? 16000 : 12000) * mult), matchesBelief: ['African Traditional', 'Hinduism', 'Christianity', 'Other'].includes(G.belief), attire: `${G.culture} Traditional Attire`, note: isAfrica ? 'Includes elders’ negotiations, blessings, and shared feast.' : 'Celebrated with cultural customs and family elders.' },
      { id: 'christian', name: '⛪ Christian Church Wedding', cost: Math.round(14000 * mult), matchesBelief: G.belief === 'Christianity', attire: 'White Gown / Formal Suit', note: 'Hymns, vows at the altar, and congregation blessing.' },
      { id: 'nikah', name: '🕌 Islamic Nikah Ceremony', cost: Math.round(9500 * mult), matchesBelief: G.belief === 'Islam', attire: 'Modest Formal Ceremony Wear', note: 'Nikah contract, Mehr gift, prayers, and humble walima meal.' },
      { id: 'civil', name: '⚖️ Civil Court Wedding', cost: Math.round(3500 * mult), matchesBelief: true, attire: 'Smart Casual / Formal', note: 'Simple, dignified legal registration with close witnesses.' }
    ];
  }

  function openWeddingModal(npcId) {
    if (G.age < 18) return showToast('Marriage unlocks at Age 18!');
    const n = G.npcs.find(x => x.id === npcId);
    if (!n || n.bond < 70) return showToast('Build a deep bond (70+) before proposing!');
    const opts = getWeddingOptions();
    openModal(`
      <div class="between" style="margin-bottom:8px;">
        <h3 class="gold" style="margin:0;">💍 Marry ${esc(n.name)}</h3>
        <button class="modal-close-x" type="button" onclick="LSW.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="muted" style="margin-bottom:8px;">Choose a ceremony respecting your belief (<strong>${esc(G.belief)}</strong>) and culture (<strong>${esc(G.culture)}</strong>):</div>
      ${opts.map(o => `
        <div class="card-alt">
          <div class="between"><strong>${esc(o.name)}</strong><span class="gold">${fmt(o.cost)}</span></div>
          <div class="muted">${esc(o.note)} · Wear: ${esc(o.attire)}</div>
          <button class="btn ${o.matchesBelief ? 'btn-gold' : 'btn-blue'} btn-sm" style="margin-top:6px;" onclick="LSW.executeWedding('${esc(npcId)}','${o.id}',false)">Select Ceremony</button>
        </div>
      `).join('')}
    `);
  }

  function executeWedding(npcId, styleId, confirmedOverride = false) {
    const n = G.npcs.find(x => x.id === npcId);
    const opt = getWeddingOptions().find(x => x.id === styleId);
    if (!n || !opt) return;

    if (!confirmedOverride && !opt.matchesBelief && styleId !== 'civil' && G.belief !== 'No Religion / Atheist') {
      openModal(`
        <h3 class="warn">🕊️ Family Conversation</h3>
        <div class="card-alt">Your family expected a ceremony closer to <strong>${esc(G.belief)}</strong>, and feels uncertain about choosing ${esc(opt.name)}. Proceed anyway?</div>
        <div class="grid2" style="margin-top:8px;">
          <button class="btn btn-gold btn-sm" onclick="LSW.openWeddingModal('${esc(npcId)}')">Choose Different</button>
          <button class="btn btn-dark btn-sm" onclick="LSW.executeWedding('${esc(npcId)}','${styleId}',true)">Proceed Together</button>
        </div>
      `);
      return;
    }

    if (!chargeMoney(opt.cost, opt.name)) return;
    closeModal();
    G.partner = { ...n, bond: clamp(n.bond + 15), age: n.age || G.age };
    if (confirmedOverride) {
      if (G.parents.mother) G.parents.mother.bond = clamp(G.parents.mother.bond - 10);
      if (G.parents.father) G.parents.father.bond = clamp(G.parents.father.bond - 10);
    } else {
      G.communityRespect = clamp(G.communityRespect + (styleId === 'traditional' ? 12 : 6));
    }
    G.phases.firstTimes.push(`Age ${G.age}: Married ${n.name}`);
    recordMemory('Wedding Day', `You married ${n.name} in ${G.city} with a ${opt.name}. Everyone gathered in warmth and blessing.`);
    celebratePopup('💍 Married!', `<p>You and <strong class="gold">${esc(n.name)}</strong> began your life together through a ${esc(opt.name)}.</p>`);
    saveAll();
    render();
  }

  function openChildNamingModal() {
    if (!G || G.age < 18) return showToast('You must be an adult to welcome a child.');
    const cn = CULTURAL_NAMES[G.culture];
    const c = getCountry();
    const g = Math.random() < 0.5 ? 'M' : 'F';
    const suggestions = cn ? cn[g].slice(0, 3) : (g === 'M' ? c.firstM.slice(0, 3) : c.firstF.slice(0, 3));
    openModal(`
      <div class="between" style="margin-bottom:8px;">
        <h3 class="gold" style="margin:0;">👶 Welcome New Child</h3>
        <button class="modal-close-x" type="button" onclick="LSW.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="muted" style="margin-bottom:8px;">Name your ${g === 'M' ? 'son' : 'daughter'} (${esc(G.culture)} heritage):</div>
      <div class="pill-wrap" style="margin-bottom:8px;">
        ${suggestions.map(nm => `<button class="pill-btn" onclick="document.getElementById('childFirstInp').value='${esc(nm)}'">${esc(nm)}</button>`).join('')}
      </div>
      <input id="childFirstInp" type="text" value="${esc(suggestions[0])}" placeholder="Child's first name" />
      <input id="childGenderInp" type="hidden" value="${g}" />
      <button class="btn btn-gold" style="margin-top:8px;" onclick="LSW.confirmBirthChild()">Welcome Baby Home</button>
    `);
  }

  function confirmBirthChild() {
    const fn = ($('childFirstInp') && $('childFirstInp').value.trim()) || pick(getCountry().firstM);
    const g = ($('childGenderInp') && $('childGenderInp').value) || 'M';
    G.children.push({ name: `${fn} ${G.surname}`, gender: g, age: 0, bond: 95 });
    G.stats.happy = clamp(G.stats.happy + 14);
    G.communityRespect = clamp(G.communityRespect + 4);
    recordMemory(`Birth of ${fn}`, `You held ${fn} ${G.surname} for the first time in ${G.city}.`);
    saveAll();
    showSlowMoment(`Welcome, ${fn}`, `The room grew quiet as you held your baby for the first time. A new chapter in the ${G.surname} family has begun.`);
  }

  function checkMonthlyBereavement() {
    if (!G || G.activeFuneral) return false;
    const c = getCountry();

    // Age parents and relatives annually on Month 1
    if (G.month === 1) {
      if (G.parents.mother && G.parents.mother.alive) {
        G.parents.mother.age = (G.parents.mother.age || 30) + 1;
        if (G.parents.mother.age > 65) G.parents.mother.health = Math.max(10, (G.parents.mother.health || 80) - rand(1, 5));
      }
      if (G.parents.father && G.parents.father.alive) {
        G.parents.father.age = (G.parents.father.age || 32) + 1;
        if (G.parents.father.age > 65) G.parents.father.health = Math.max(10, (G.parents.father.health || 80) - rand(1, 5));
      }
      (G.relatives || []).forEach(r => {
        if (r.alive) {
          r.age = (r.age || 65) + 1;
          if (r.age > 65) r.health = Math.max(8, (r.health || 70) - rand(2, 6));
        }
      });
    }

    // Natural chance of loss (never shock value, age-appropriate)
    let passed = null;
    const livingGps = (G.relatives || []).filter(r => r.alive && r.age >= 60);
    for (const gp of livingGps) {
      const chance = gp.age >= 85 ? 0.045 : gp.age >= 75 ? 0.018 : 0.005;
      if (Math.random() < chance) {
        gp.alive = false;
        passed = { role: gp.role, name: gp.name, age: gp.age, city: gp.city || G.city, countryId: gp.countryId || G.countryId, kind: 'grandparent' };
        break;
      }
    }
    if (!passed && G.age >= 18) {
      for (const pKey of ['mother', 'father']) {
        const pr = G.parents && G.parents[pKey];
        if (pr && pr.alive && pr.age >= 40 && (pr.health <= 28 || pr.age >= 74)) {
          if (Math.random() < (pr.health <= 25 ? 0.04 : 0.015)) {
            pr.alive = false;
            passed = { role: pKey === 'mother' ? 'Mother' : 'Father', name: pr.name, age: pr.age, city: G.city, countryId: c.id, kind: 'parent' };
            break;
          }
        }
      }
    }
    if (!passed && G.partner && !G.partner.deceased && (G.partner.age || G.age) >= 60 && Math.random() < 0.01) {
      G.partner.deceased = true;
      passed = { role: 'Spouse', name: G.partner.name, age: G.partner.age || G.age, city: G.city, countryId: c.id, kind: 'spouse' };
    }

    if (!passed) return false;
    G.activeFuneral = { ...passed, stage: G.age < 18 ? 'child' : 'adult_rite' };
    G.mourningWeekActive = true;
    saveAll();
    openFuneralPopup();
    return true;
  }

  function getFuneralOptionsList() {
    const f = G.activeFuneral;
    const c = getCountry();
    const costScale = c.costMult * getDiff().costMult;
    const awayCity = f && f.city && f.city !== G.city;
    const list = [
      {
        id: 'traditional',
        title: `⚰️ Traditional Burial${G.belief === 'Christianity' ? ' + Church Service' : G.belief === 'African Traditional' ? ' + Night Vigil' : G.belief === 'Islam' ? ' (Within 24 Hours)' : ''}`,
        cost: Math.round((G.belief === 'Islam' ? 9500 : G.belief === 'Christianity' ? 19000 : G.belief === 'African Traditional' ? 21000 : 18000) * costScale),
        desc: G.belief === 'Islam' ? 'Washing ritual, simple shroud, swift burial within 24 hours with prayers.' : 'Coffin, transport, family gathering, mourners meal & prayer service.'
      },
      {
        id: 'cremation',
        title: '🔥 Cremation',
        cost: Math.round(10500 * costScale),
        desc: ['Hinduism', 'Buddhism'].includes(G.belief) ? 'Sacred cremation ceremony and ashes gathering in peace.' : 'Cremation, urn, and intimate family farewell.'
      },
      {
        id: 'simple',
        title: '🌿 Simple / Dignity Burial',
        cost: Math.round(1400 * costScale),
        desc: 'Modest government-assisted coffin and quiet family farewell. Love is not measured in money.'
      },
      {
        id: 'big',
        title: '👑 Big Celebratory Funeral',
        cost: Math.round(82000 * costScale),
        desc: 'Large marquee, full catering, community program, and extended tributes.'
      }
    ];
    if (awayCity) {
      list.push({
        id: 'repatriation',
        title: `✈️ Bring Home from ${esc(f.city)}`,
        cost: Math.round(38000 * costScale),
        desc: `Bring your loved one home to ${esc(G.city)} for burial with family.`
      });
    }
    return list;
  }

  function openFuneralPopup() {
    if (!G || !G.activeFuneral) return;
    const f = G.activeFuneral;
    if (G.age < 18) {
      openModal(`
        <h3 class="gold">💔 Sad News</h3>
        <div class="card-alt" style="line-height:1.5;">
          Your ${esc(f.role)} <strong>${esc(f.name)}</strong> has passed away in ${esc(f.city)} at age ${f.age}. Your family is mourning.
        </div>
        <div class="muted" style="margin:8px 0;">Adults will handle the funeral arrangements. Your place is simply to be with family and remember.</div>
        <button class="btn btn-dark" style="text-align:left;margin-bottom:6px;" onclick="LSW.childFuneralChoice(0)">😢 Cry and stay close with family</button>
        <button class="btn btn-dark" style="text-align:left;margin-bottom:6px;" onclick="LSW.childFuneralChoice(1)">🙏 Pray, sing, or sit quietly</button>
        <button class="btn btn-dark" style="text-align:left;" onclick="LSW.childFuneralChoice(2)">💬 Ask Mama what happened</button>
      `);
      return;
    }

    const opts = getFuneralOptionsList();
    openModal(`
      <h3 class="gold">💔 ${esc(f.role)} Passed Away</h3>
      <div class="card-alt" style="line-height:1.5;">
        Your ${esc(f.role)} <strong>${esc(f.name)}</strong> passed away peacefully in ${esc(f.city)} (Age ${f.age}). As an adult, you must help arrange their farewell.
      </div>
      <div class="muted" style="margin:6px 0;">Choose Arrangement (${esc(G.belief)} · ${esc(G.culture)}):</div>
      ${opts.map(o => `
        <div class="card-alt">
          <div class="between"><strong>${esc(o.title)}</strong><span class="gold">${fmt(o.cost)}</span></div>
          <div class="muted" style="margin:3px 0 6px;">${esc(o.desc)}</div>
          <button class="btn btn-gold btn-sm" onclick="LSW.adultSelectFuneralOption('${o.id}',false,false)">Choose</button>
        </div>
      `).join('')}
    `);
  }

  function childFuneralChoice(optIdx) {
    const f = G.activeFuneral;
    if (!f) return;
    let storyText = '';
    if (optIdx === 0) {
      G.stats.happy = clamp(G.stats.happy - 10);
      G.stats.morality = clamp(G.stats.morality + 2);
      G.communityRespect = clamp(G.communityRespect + 2);
      storyText = `Your mama held your hand while the family comforted one another. You remembered ${f.name}'s gentle smile.`;
    } else if (optIdx === 1) {
      G.stats.morality = clamp(G.stats.morality + 3);
      G.stats.happy = clamp(G.stats.happy - 5);
      const prayer = G.belief === 'Islam' ? 'You sat quietly repeating Al-Fatiha in peace.'
        : G.belief === 'Christianity' ? 'You joined softly in the hymn beside your family.'
        : G.belief === 'African Traditional' ? 'You sat calmly as elders honoured your ancestor with dignity.'
        : 'You sat quietly reflecting on all they taught you.';
      storyText = `${prayer} Your teacher sent word: "Take your time, my child. Take 3 days off school."`;
    } else {
      G.stats.smarts = clamp(G.stats.smarts + 1);
      G.stats.happy = clamp(G.stats.happy - 6);
      storyText = `Mama sat beside you and spoke softly: "${f.role} is now resting. They loved you very much."`;
    }
    if (G.age >= 6 && G.age <= 18 && G.school) G.school.excusedDays = (G.school.excusedDays || 0) + 3;
    G.griefMonthsLeft = 3;
    recordMemory(`Remembering ${f.name}`, `You lost your ${f.role}, ${f.name}, in ${f.city}. You always remember their kindness and smile.`);
    G.activeFuneral = null;
    G.mourningWeekActive = false;
    saveAll();
    showSlowMoment(`Remembering ${f.name}`, storyText);
  }

  function adultSelectFuneralOption(optId, confirmedCrem = false, confirmedBig = false) {
    const f = G.activeFuneral;
    const opt = getFuneralOptionsList().find(x => x.id === optId);
    if (!f || !opt) return;

    if (optId === 'cremation' && !confirmedCrem && ['African Traditional', 'Islam', 'Christianity'].includes(G.belief)) {
      openModal(`
        <h3 class="warn">🕊️ Family Tradition Notice</h3>
        <div class="card-alt">Your uncle speaks gently: "In our tradition, we bury our elders." Choosing cremation may affect Community Respect. Are you sure?</div>
        <div class="grid2" style="margin-top:8px;">
          <button class="btn btn-gold btn-sm" onclick="LSW.openFuneralPopup()">Return</button>
          <button class="btn btn-dark btn-sm" onclick="LSW.adultSelectFuneralOption('cremation',true,false)">Yes, Confirm Twice</button>
        </div>
      `);
      return;
    }

    const totalBank = Object.values(G.banks || {}).reduce((s, b) => s + (b.checking || 0) + (b.savings || 0), 0);
    if (optId === 'big' && !confirmedBig && (G.cash + totalBank - opt.cost) < 4000) {
      openModal(`
        <h3 class="warn">⚠️ Family Advice</h3>
        <div class="card-alt">Family elders advise: "Do not leave your home short of food and rent for a huge ceremony. ${esc(f.name)} would not want that."</div>
        <div class="grid2" style="margin-top:8px;">
          <button class="btn btn-gold btn-sm" onclick="LSW.openFuneralPopup()">Choose Wisely</button>
          <button class="btn btn-danger btn-sm" onclick="LSW.adultSelectFuneralOption('big',true,true)">Proceed Anyway</button>
        </div>
      `);
      return;
    }

    f.chosenRite = opt;
    f.cremConflict = Boolean(confirmedCrem);
    f.overspentBig = Boolean(confirmedBig);

    openModal(`
      <h3 class="gold">🤝 Who Will Pay?</h3>
      <div class="card-alt">Estimated cost for ${esc(opt.title)}: <strong class="gold">${fmt(opt.cost)}</strong></div>
      <button class="btn btn-gold" style="margin-bottom:6px;" onclick="LSW.adultChoosePayer('self')">Pay Myself (${fmt(opt.cost)})</button>
      <button class="btn btn-blue" style="margin-bottom:6px;" onclick="LSW.adultChoosePayer('family')">Family Shares Cost (${fmt(Math.round(opt.cost / 3))})</button>
      <button class="btn btn-dark" onclick="LSW.adultChoosePayer('community')">Community & Neighbours Help (Respect & Thanks)</button>
    `);
  }

  function adultChoosePayer(payerId) {
    const f = G.activeFuneral;
    if (!f || !f.chosenRite) return;
    const fullCost = f.chosenRite.cost;
    if (payerId === 'self') {
      if (!chargeMoney(fullCost, f.chosenRite.title)) {
        openModal(`<h3 class="warn">💸 Insufficient Cash</h3><div class="card-alt">You cannot afford ${fmt(fullCost)} alone right now. Choose Family Sharing, Community Help, or a Simple Burial.</div><div class="grid2"><button class="btn btn-blue btn-sm" onclick="LSW.adultChoosePayer('family')">Share With Family</button><button class="btn btn-gold btn-sm" onclick="LSW.openFuneralPopup()">Change Option</button></div>`);
        return;
      }
    } else if (payerId === 'family') {
      const share = Math.round(fullCost / 3);
      if (!chargeMoney(share, 'Family Funeral Share')) return;
    } else {
      G.communityRespect = clamp(G.communityRespect + 5);
    }
    f.payer = payerId;

    const tradDress = G.belief === 'Hinduism' ? 'White Mourning Attire' : 'Black / Traditional Mourning Wear';
    openModal(`
      <h3 class="gold">🧥 What Will You Wear?</h3>
      <div class="card-alt">Dress respectfully to honour ${esc(f.name)}.</div>
      <button class="btn btn-gold" style="margin-bottom:6px;" onclick="LSW.adultChooseDress('respectful')">${esc(tradDress)}</button>
      <button class="btn btn-dark" style="margin-bottom:6px;" onclick="LSW.adultChooseDress('casual')">Everyday Plain Clothes</button>
      <button class="btn btn-danger" onclick="LSW.adultChooseDress('party')">Bright Party Clothes</button>
    `);
  }

  function adultChooseDress(dressId) {
    const f = G.activeFuneral;
    if (!f) return;
    f.dress = dressId;
    openModal(`
      <h3 class="gold">🕯️ Tribute</h3>
      <div class="muted" style="margin-bottom:8px;">When the family gathers around, what do you do?</div>
      <button class="btn btn-dark" style="text-align:left;margin-bottom:6px;" onclick="LSW.adultChooseTribute('heart')">Speak from the heart about them</button>
      <button class="btn btn-dark" style="text-align:left;margin-bottom:6px;" onclick="LSW.adultChooseTribute('prayer')">Read a quiet prayer</button>
      <button class="btn btn-dark" style="text-align:left;" onclick="LSW.adultChooseTribute('silent')">Stand silently and cry</button>
    `);
  }

  function adultChooseTribute(tributeId) {
    const f = G.activeFuneral;
    if (!f || !f.chosenRite) return;
    const rite = f.chosenRite;

    if (rite.id === 'traditional') {
      G.communityRespect = clamp(G.communityRespect + 10);
      G.stats.morality = clamp(G.stats.morality + 5);
    } else if (rite.id === 'cremation') {
      if (['Hinduism', 'Buddhism'].includes(G.belief)) G.communityRespect = clamp(G.communityRespect + 10);
      else if (f.cremConflict) G.communityRespect = clamp(G.communityRespect - 5);
      else G.communityRespect = clamp(G.communityRespect + 2);
      G.stats.morality = clamp(G.stats.morality + 2);
    } else if (rite.id === 'simple') {
      G.communityRespect = clamp(G.communityRespect + 3);
      G.stats.morality = clamp(G.stats.morality + 5);
    } else if (rite.id === 'big') {
      G.communityRespect = clamp(G.communityRespect + 15);
      G.stats.fame = clamp(G.stats.fame + 5);
      if (f.overspentBig) G.stats.morality = clamp(G.stats.morality - 5);
    } else if (rite.id === 'repatriation') {
      G.communityRespect = clamp(G.communityRespect + 10);
    }

    if (f.dress === 'party') {
      G.stats.morality = clamp(G.stats.morality - 10);
      G.communityRespect = clamp(G.communityRespect - 10);
    }

    G.stats.morality = clamp(G.stats.morality + 3);
    G.stats.happy = clamp(G.stats.happy - 10);
    G.stats.energy = clamp(G.stats.energy - 5);
    if (G.job) G.workStats.perf = clamp((G.workStats.perf || 0) - 5);
    G.griefMonthsLeft = 3;

    const tribDesc = tributeId === 'heart' ? 'You spoke from the heart while the family listened.'
      : tributeId === 'prayer' ? 'You offered a calm prayer over the gathering.'
      : 'You stood beside loved ones in quiet tears.';
    const extraMsg = rite.id === 'simple'
      ? 'You did your best. Your family knows you loved them — love is never measured in money.'
      : f.payer === 'community' ? 'Neighbours and relatives helped carry the burden. You thanked them warmly.'
      : 'You are grieving. Take your time and talk with family.';

    recordMemory(
      `Farewell to ${f.name}`,
      `${f.role} passed away. You arranged ${rite.title} in ${G.city}. ${tribDesc}`
    );
    G.activeFuneral = null;
    saveAll();
    showSlowMoment(`Farewell, ${f.name}`, `${tribDesc} ${extraMsg}`);
  }

  function earnMoney(baseZar, reason = 'Income') {
    if (!G || baseZar <= 0) return;
    G.cash += Math.round(baseZar);
    G.monthlyReport.unshift(`💰 +${fmt(baseZar)} (${reason})`);
    if (G.monthlyReport.length > 35) G.monthlyReport.pop();
  }

  function chargeMoney(baseZar, reason = 'Expense') {
    if (!G || baseZar <= 0) return true;
    if (isFamilyShieldActive()) {
      const mom = G.parents.mother, dad = G.parents.father;
      const payer = mom.money >= dad.money ? mom : dad;
      payer.money = Math.max(0, payer.money - baseZar);
      G.parentCoveredTotal = (G.parentCoveredTotal || 0) + baseZar;
      G.monthlyReport.unshift(`🛡️ Family Shield: Parent (${payer.name}) covered ${fmt(baseZar)} for ${reason}.`);
      showToast(`🛡️ Parents covered ${fmt(baseZar)} (${reason})`);
      return true;
    }
    if (G.cash >= baseZar) {
      G.cash -= baseZar;
      return true;
    }
    const firstBk = Object.keys(G.banks || {})[0];
    if (firstBk && G.banks[firstBk].checking >= baseZar) {
      G.banks[firstBk].checking -= baseZar;
      showToast(`Paid ${fmt(baseZar)} from ${firstBk} Checking`);
      return true;
    }
    showToast(`Not enough funds! Need ${fmt(baseZar)} for ${reason}.`);
    return false;
  }

  function payViaWire(baseZar, reason, targetCountryId) {
    if (!chargeMoney(baseZar, reason)) return false;
    const tc = getCountry(targetCountryId || G.countryId);
    G.wires.unshift(`WIRE: ${fmtFull(baseZar, tc.id)} -> ${reason}`);
    if (G.wires.length > 25) G.wires.pop();
    return true;
  }

  function getHouseRoomCapacity() {
    if (!G) return {};
    const own = G.houses && G.houses.find(h => !h.rentedOut);
    if (own && own.rooms) return own.rooms;
    if (G.age < 18 && !G.kickedOut) return { bedroom: 1, living: 1, kitchen: 1, bathroom: 1, office: 1, outdoor: 1 };
    return { bedroom: 0, living: 0, kitchen: 0, bathroom: 0, office: 0, outdoor: 0 };
  }

  function getRoomUsedSlots(roomKey) {
    if (!G || !G.inventory) return 0;
    return G.inventory.filter(x => x.roomReq === roomKey).reduce((s, x) => s + (x.qty || 1), 0);
  }

  function getInventoryWeightKg() {
    if (!G || !G.inventory) return 0;
    return Math.round(G.inventory.reduce((s, it) => s + ((it.weightKg || 1) * (it.qty || 1)), 0));
  }

  function getItemScarcity(item, countryId) {
    const cid = countryId || (G ? G.countryId : 'za');
    const cp = COUNTRY_PROFILES[cid] || COUNTRY_PROFILES.za;
    const tags = item.tags || [];
    const nm = (item.name || '').toLowerCase();

    if (cp.porkBan && (tags.includes('pork') || /bacon|pork|pepperoni/i.test(nm))) {
      return { tier: 'banned', emoji: '⛔', label: 'Banned (Halal Law)', mult: 0, stock: 0, days: 99, extraTaxPct: 0, reason: `Restricted under ${getCountry(cid).lawSystem}.` };
    }
    if (cp.alcBan && (tags.includes('alcohol') || tags.includes('wine') || /wine|beer|scotch|whiskey/i.test(nm))) {
      return { tier: 'banned', emoji: '⛔', label: 'Illegal / Restricted', mult: 0, stock: 0, days: 99, extraTaxPct: 0, reason: `Alcohol restricted under ${getCountry(cid).lawSystem}.` };
    }
    if (!cp.cold && (tags.includes('winter') || /snow|parka|radiator heater/i.test(nm))) {
      return { tier: 'scarce', emoji: '🔴', label: 'Scarce (Climate · 1 left)', mult: 3.4, stock: 1, days: 7, extraTaxPct: 20, reason: 'Warm climate — winter stock scarce locally.' };
    }
    if (cp.tech <= 2 && (item.cat === 'Technology' || tags.includes('tech')) && item.cost >= 4500) {
      return { tier: 'rare', emoji: '🟠', label: 'Rare Import (5 left · 3d)', mult: 1.9, stock: 5, days: 3, extraTaxPct: 12, reason: 'Tech hub import required.' };
    }
    if (item.originCid === cid || tags.some(t => cp.originTags.includes(t))) {
      return { tier: 'abundant', emoji: '🟢', label: 'Abundant (Local · 100+)', mult: 0.82, stock: 120, days: 0, extraTaxPct: 0, reason: `Produced locally in ${getCountry(cid).name}.` };
    }
    const hash = ((item.name.length * 13) + cid.charCodeAt(0) + (item.cost % 17)) % 10;
    if (hash <= 1) return { tier: 'abundant', emoji: '🟢', label: 'Abundant (100+)', mult: 0.85, stock: 100, days: 0, extraTaxPct: 0, reason: 'Widely stocked.' };
    if (hash <= 6) return { tier: 'common', emoji: '🟡', label: 'Common (50)', mult: 1.0, stock: 50, days: 1, extraTaxPct: 0, reason: 'Normal local stock.' };
    if (hash <= 8) return { tier: 'rare', emoji: '🟠', label: 'Rare (5 left · 3d)', mult: 1.85, stock: 5, days: 3, extraTaxPct: 10, reason: 'Limited distributor supply.' };
    return { tier: 'scarce', emoji: '🔴', label: 'Scarce (1 left · +20% Tax)', mult: 3.2, stock: 1, days: 7, extraTaxPct: 20, reason: 'Scarce specialty import.' };
  }

  function getJobScarcity(job, countryId) {
    const cid = countryId || (G ? G.countryId : 'za');
    const cp = COUNTRY_PROFILES[cid] || COUNTRY_PROFILES.za;
    if (cp.noMine && job.sector === 'Mining') return { emoji: '⛔', label: 'No Mines in Country', avail: false };
    if (cp.tech <= 2 && job.sector === 'Tech/IT' && job.tier >= 4) return { emoji: '🟠', label: 'Rare (Low Tech Hub)', avail: true };
    if (cp.tech >= 4 && (job.sector === 'Tech/IT' || job.sector === 'Science')) return { emoji: '🟢', label: 'Abundant Demand', avail: true };
    return { emoji: '🟡', label: 'Open Locally', avail: true };
  }

  function getSupplierScarcity(sp) {
    if (!G) return { emoji: '🟡', label: 'Common' };
    if (G.activeCrisis && G.activeCrisis.id === 'war' && sp.countryId !== G.countryId) return { emoji: '⛔', label: 'War Blockade' };
    if (sp.countryId === G.countryId) return { emoji: '🟢', label: 'Local Direct (0d Duty)' };
    return { emoji: '🟠', label: `Import (${sp.leadDays || 4}d + 20% Duty)` };
  }

  function getEffectiveItemPriceZar(item, countryId) {
    const cid = countryId || (G ? G.countryId : 'za');
    const c = getCountry(cid);
    const sc = getItemScarcity(item, cid);
    const diffMult = getDiff().costMult || 1.0;
    const mult = sc.tier === 'banned' ? 2.5 : sc.mult;
    return Math.round(item.cost * (c.costMult || 1.0) * mult * (1 + sc.extraTaxPct / 100) * diffMult);
  }

  /* ============================================================
     7. FLIGHTS, LUGGAGE WEIGHT, VIP LOUNGE & TRAVEL ARBITRAGE
     ============================================================ */
  function computeFlightQuote(toCid, toCity, ticketId, airlineId, season) {
    const fromC = getCountry();
    const toC = getCountry(toCid);
    const c1 = COUNTRY_COORDS[fromC.id] || { lat: 0, lon: 0, tz: 0 };
    const c2 = COUNTRY_COORDS[toC.id] || { lat: 10, lon: 10, tz: 0 };
    const rad = Math.PI / 180;
    const dLat = (c2.lat - c1.lat) * rad, dLon = (c2.lon - c1.lon) * rad;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(c1.lat * rad) * Math.cos(c2.lat * rad) * Math.sin(dLon / 2) ** 2;
    const distKm = toCid === fromC.id ? 450 : Math.max(400, Math.round(12742 * Math.asin(Math.sqrt(a))));
    const hours = Math.max(1, Math.round(distKm / 820));
    const tkt = TICKET_TYPES.find(t => t.id === ticketId) || TICKET_TYPES[1];
    const al = AIRLINES_CATALOG.find(x => x.id === airlineId) || AIRLINES_CATALOG[1];
    const seasMult = season === 'peak' ? 1.5 : season === 'off' ? 0.8 : 1.0;
    const fuelMult = G && G.activeCrisis && G.activeCrisis.id === 'war' ? 1.3 : 1.0;
    const tktMult = tkt.id === 'child' ? (G && G.age <= 2 ? 0.1 : 0.75) : tkt.mult;
    const baseZar = Math.round(distKm * 1.15 * tktMult * al.mult * seasMult * fuelMult);
    const taxZar = toCid === fromC.id ? 250 : 950;
    const jetLag = Math.abs((c2.tz || 0) - (c1.tz || 0)) >= 4;
    return { distKm, hours, tkt, al, taxZar, fuelMult, jetLag, zarTotal: baseZar + taxZar, toCity };
  }

  function computeTravelBuyComparison(item) {
    const curCid = G.countryId;
    const origCid = item.originCid || 'us';
    const origC = getCountry(origCid);
    const localZar = getEffectiveItemPriceZar(item, curCid);
    const origZar = getEffectiveItemPriceZar(item, origCid);
    const fq = computeFlightQuote(origCid, origC.cities[0], 'economy', 'al_budget', 'off');
    const travelTotalZar = origZar + (origCid === curCid ? 0 : fq.zarTotal);
    const importTaxZar = Math.round(origZar * 1.2 + 450);
    const cheaperTravel = origCid !== curCid && travelTotalZar < localZar;
    return { localZar, origZar, origC, flightZar: fq.zarTotal, travelTotalZar, importTaxZar, cheaperTravel };
  }

  function buyOrRenewVisa(toCid) {
    if (!G || toCid === G.countryId) return;
    const exp = (G.visaExpiry && G.visaExpiry[toCid]) || 0;
    const fee = exp > 0 ? 2200 : 4400;
    if (!chargeMoney(fee, `5-Year Visa: ${getCountry(toCid).name}`)) return;
    G.visaExpiry[toCid] = G.totalMonths + 60;
    showToast(`🛂 5-Year Visa approved for ${getCountry(toCid).name}!`);
    saveAll(); render();
  }

  function buyAirplane(planeId) {
    const pl = OWNED_PLANES_CATALOG.find(x => x.id === planeId);
    if (!pl) return;
    if ((G.ownedPlanes || []).some(x => x.id === pl.id)) return showToast('Already in your hangar!');
    if (!payViaWire(pl.cost, pl.name, G.countryId)) return;
    G.ownedPlanes.push({ ...pl });
    showToast(`🛩️ Bought ${pl.name}! Zero ticket fees on flights.`);
    saveAll(); render();
  }

  function flyToDestination(toCid, toCity, ticketId, airlineId, season, useOwnPlane) {
    if (!G) return;
    if (toCid !== G.countryId) {
      const visaExp = (G.visaExpiry && G.visaExpiry[toCid]) || 0;
      if (visaExp < G.totalMonths && !useOwnPlane) {
        return showToast(`🛂 Need a valid 5-Year Visa for ${getCountry(toCid).name} first!`);
      }
      if (G.policeHeat >= 80 && !G.fakePassport) {
        G.jail.pendingCase = { charge: 'Airport Security Watchlist Flag', years: 3, fine: 14000 };
        showToast('🚨 Airport Security Arrest! Need Fake Passport or clear Police Heat.');
        saveAll(); render(); return;
      }
    }
    const q = computeFlightQuote(toCid, toCity, ticketId, airlineId, season);
    const carryKg = getInventoryWeightKg();
    const maxKg = useOwnPlane ? Infinity : (q.tkt.luggageKg || 20);
    const excessKg = maxKg === Infinity ? 0 : Math.max(0, carryKg - maxKg);
    const excessFee = excessKg * 45;

    if (!useOwnPlane) {
      const totalCharge = q.zarTotal + excessFee;
      if (!chargeMoney(totalCharge, `Flight to ${toCity}${excessKg ? ` (+${excessKg}kg luggage)` : ''}`)) return;
    }
    G.pendingFlight = { toCid, toCity, ticketId, airlineId, season, useOwnPlane: Boolean(useOwnPlane), q };
    G.loungeBuff = false;
    openFlightGateModal();
    saveAll(); render();
  }

  function openFlightGateModal() {
    if (!G || !G.pendingFlight) return;
    const pf = G.pendingFlight;
    const tkt = TICKET_TYPES.find(t => t.id === pf.ticketId) || TICKET_TYPES[1];
    const canLounge = !pf.useOwnPlane && Boolean(tkt.loungeAccess);
    openModal(`
      <h3 class="gold">🛫 Boarding Gate: ${esc(pf.toCity)}, ${esc(getCountry(pf.toCid).name)}</h3>
      <div class="card-alt">
        <div>Class: <strong>${pf.useOwnPlane ? 'Private Jet' : esc(tkt.name)}</strong></div>
        <div class="muted">Lounge Access: ${canLounge ? '✅ Unlocked (+10 Happy, +15 Energy)' : '🔒 Business & First Class Only'}</div>
      </div>
      <div class="grid2">
        <button class="btn ${canLounge && !G.loungeBuff ? 'btn-blue' : 'btn-dark'} btn-sm" onclick="LSW.enterAirportLounge(true)">${canLounge ? (G.loungeBuff ? '✓ Buff Active' : '🥂 Enter VIP Lounge') : '🔒 Lounge Locked'}</button>
        <button class="btn btn-gold btn-sm" onclick="LSW.boardPendingFlight()">✈️ Board & Depart</button>
      </div>
    `);
  }

  function enterAirportLounge(fromModal = false) {
    if (!G || !G.pendingFlight) return showToast('Book a flight ticket first!');
    const tkt = TICKET_TYPES.find(t => t.id === G.pendingFlight.ticketId) || TICKET_TYPES[1];
    if (G.pendingFlight.useOwnPlane || !tkt.loungeAccess) {
      return showToast('🔒 VIP Lounge requires a Business Class or First Class ticket!');
    }
    if (G.loungeBuff) return showToast('Already enjoying VIP Lounge perks!');
    G.loungeBuff = true;
    G.stats.happy = clamp(G.stats.happy + 10);
    G.stats.energy = clamp(G.stats.energy + 15, 0, getDiff().energyCap);
    showToast('🥂 VIP Lounge Access: +10 Happiness & +15 Energy!');
    saveAll();
    if (fromModal) openFlightGateModal();
    render();
  }

  function boardPendingFlight() {
    if (!G || !G.pendingFlight) return;
    const pf = G.pendingFlight;
    const tkt = TICKET_TYPES.find(t => t.id === pf.ticketId) || TICKET_TYPES[1];
    const destC = getCountry(pf.toCid);
    const prevCid = G.countryId;
    G.countryId = destC.id;
    G.city = pf.toCity;
    if (!G.phases.visitedCountries.includes(destC.id)) G.phases.visitedCountries.push(destC.id);
    G.stats.energy = clamp(G.stats.energy + tkt.engDelta, 0, getDiff().energyCap);
    G.stats.health = clamp(G.stats.health + tkt.hpDelta);
    if (pf.q && pf.q.jetLag) G.stats.energy = clamp(G.stats.energy - 8);
    G.pendingFlight = null;
    G.loungeBuff = false;
    const eduTransfer = prevCid !== destC.id ? transferEducationToCountry(destC) : null;
    closeModal();
    celebratePopup(`🛬 Arrived in ${pf.toCity}!`, `<p>Welcome to <strong>${esc(pf.toCity)}, ${esc(destC.name)}</strong> (${esc(destC.cur)} ${destC.code}). Laws: <strong>${esc(destC.lawSystem)}</strong></p>${eduTransfer ? `<div class="card-alt" style="margin-top:8px;"><strong class="gold">🎓 Education Transfer Alert:</strong><div class="muted" style="margin-top:4px;">${esc(eduTransfer)}</div></div>` : ''}`);
    saveAll(); render();
  }

  function takeBusOrTrain(mode, toCid, toCity) {
    const fee = mode === 'bus' ? 450 : 750;
    if (!chargeMoney(fee, `${mode.toUpperCase()} to ${toCity}`)) return;
    const c = getCountry(toCid);
    const prevCid = G.countryId;
    G.countryId = c.id;
    G.city = toCity;
    if (!G.phases.visitedCountries.includes(c.id)) G.phases.visitedCountries.push(c.id);
    G.needs.transport = clamp(G.needs.transport + 15);
    const eduTransfer = prevCid !== c.id ? transferEducationToCountry(c) : null;
    showToast(`${mode === 'bus' ? '🚌' : '🚆'} Arrived in ${toCity}, ${c.name}!`);
    if (eduTransfer) {
      celebratePopup(`🎓 Education System Transferred`, `<p>${esc(eduTransfer)}</p>`);
    }
    saveAll(); render();
  }

  /* ============================================================
     8. SHOPPING, INVENTORY [USE] & ALL 12 UNIVERSAL ITEM ACTIONS
     ============================================================ */
  function addInventoryItem(item, buyPriceZar, boughtInCid) {
    if (!G.inventory) G.inventory = [];
    if (!G.items.includes(item.id)) G.items.push(item.id);
    const existing = G.inventory.find(x => x.itemId === item.id && !x.paintColor && !x.lentTo);
    if (existing && (item.cat === 'Food' || item.cat === 'Medicine')) {
      existing.qty = (existing.qty || 1) + 1;
      return existing;
    }
    const rec = {
      uid: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      itemId: item.id, name: item.name, cat: item.cat, subCat: item.subCat || item.usableType || 'general',
      need: item.need, needLabel: item.needLabel || item.need,
      effect: item.effect || 'Practical utility.', missEffect: item.missEffect || '',
      durability: item.durability || 100, maxDurability: item.durability || 100, condition: 'New',
      qty: 1, originCid: item.originCid || boughtInCid || G.countryId,
      boughtInCid: boughtInCid || G.countryId, buyPriceZar: buyPriceZar || item.cost,
      paintColor: null, weightKg: item.weightKg || 2, roomReq: item.roomReq || null,
      usableType: item.usableType || 'general', readCount: 0,
      daysLeft: item.cat === 'Food' ? 2 : 99, lentTo: null, rented: false, worn: false
    };
    G.inventory.unshift(rec);
    return rec;
  }

  function applyInstantItemBoost(item) {
    if (!G.needs) return;
    if (item.need && G.needs[item.need] !== undefined) G.needs[item.need] = clamp(G.needs[item.need] + 18);
    if (item.id === 'sh_pain') G.stats.health = clamp(G.stats.health + 15);
    if (item.id === 'sh_vit') { G.stats.health = clamp(G.stats.health + 10); G.stats.energy = clamp(G.stats.energy + 15); }
    if (item.id === 'sh_pantry') G.stats.energy = clamp(G.stats.energy + 25);
    if (item.id === 'sh_coffee') G.stats.energy = clamp(G.stats.energy + 20);
    if (item.id === 'sh_jerry' && G.cars.length) G.cars[0].fuel = clamp(G.cars[0].fuel + 40);
    if (item.usableType === 'sim') { G.utilityState.internet = true; G.utilityState.simActive = true; }
    if (item.usableType === 'solar' || item.usableType === 'generator') { G.utilityState.electricity = true; G.utilityState.powerHours += 72; }
  }

  function buyGlobalShopItem(itemId) {
    const item = ALL_SHOP_ITEMS.find(x => x.id === itemId);
    if (!item) return false;
    const sc = getItemScarcity(item, G.countryId);
    if (sc.tier === 'banned') {
      showToast(`⛔ ${item.name} is restricted in ${getCountry().name}! Try Travel or Import.`);
      return false;
    }
    if (item.roomReq) {
      const cap = getHouseRoomCapacity();
      if (!cap[item.roomReq]) {
        showToast(`⛔ Need a House with a ${item.roomReq} first (or buy a Tent)!`);
        return false;
      }
    }
    const price = getEffectiveItemPriceZar(item, G.countryId);
    if (!chargeMoney(price, item.name)) return false;
    addInventoryItem(item, price, G.countryId);
    applyInstantItemBoost(item);
    showToast(`🛒 Bought ${item.name} (${sc.emoji}) for ${fmt(price)}!`);
    saveAll(); render();
    return true;
  }

  function openBuyOrTravelModal(itemId) {
    const item = ALL_SHOP_ITEMS.find(x => x.id === itemId);
    if (!item) return;
    const cmp = computeTravelBuyComparison(item);
    const sc = getItemScarcity(item, G.countryId);
    const curC = getCountry();
    const hasRoom = !item.roomReq || (getHouseRoomCapacity()[item.roomReq] || 0) > 0;
    openModal(`
      <h3 class="gold">🛍️ ${esc(item.name)}</h3>
      <div class="card-alt">
        <div>Need: <strong class="gold">${esc(item.needLabel)}</strong> · Weight: ${item.weightKg}kg</div>
        <div>Effect: <strong>${esc(item.effect)}</strong></div>
        <div class="bad" style="font-size:0.84em;">If Missing: ${esc(item.missEffect)}</div>
        <div style="margin-top:4px;">Scarcity in ${esc(curC.name)}: <span class="scarcity-badge">${sc.emoji} ${esc(sc.label)}</span></div>
      </div>
      ${!hasRoom ? `<div class="card-alt bad">⛔ No ${esc(item.roomReq)} slot! Buy a House in Finance -> Houses.</div>` : ''}
      <div class="card-alt">
        <div class="between"><strong>A. Buy Locally</strong><strong class="gold">${sc.tier === 'banned' ? '⛔ Restricted' : fmtFull(cmp.localZar, curC.id)}</strong></div>
        <div class="between"><strong>B. Import from ${esc(cmp.origC.name)} (+20% Tax)</strong><strong class="blue">${fmtFull(cmp.importTaxZar, curC.id)}</strong></div>
        <div class="between"><strong>C. Fly to ${esc(cmp.origC.name)} & Buy</strong><strong class="${cmp.cheaperTravel ? 'good' : 'muted'}">${fmtFull(cmp.travelTotalZar, curC.id)}</strong></div>
      </div>
      <div class="grid2">
        ${sc.tier !== 'banned' ? `<button class="btn btn-gold btn-sm" ${!hasRoom ? 'disabled' : ''} onclick="LSW.closeModal();LSW.buyGlobalShopItem('${esc(item.id)}');">🛒 Buy Local</button>` : '<button class="btn btn-dark btn-sm" disabled>⛔ Banned</button>'}
        <button class="btn btn-blue btn-sm" onclick="LSW.importGlobalItem('${esc(item.id)}', false)">📦 Import (${fmt(cmp.importTaxZar)})</button>
        ${G.countryId !== cmp.origC.id ? `<button class="btn btn-dark btn-sm" onclick="LSW.closeModal();LSW.setFlightCfg('flightToCid','${cmp.origC.id}');LSW.switchTab('world');">✈️ Fly Abroad</button>` : ''}
        ${sc.tier === 'banned' && G.age >= 16 ? `<button class="btn btn-danger btn-sm" onclick="LSW.importGlobalItem('${esc(item.id)}', true)">🕶️ Smuggle Risk</button>` : ''}
      </div>
      <button class="btn btn-dark" style="margin-top:6px;" onclick="LSW.closeModal()">Close</button>
    `);
  }

  function importGlobalItem(itemId, smuggle = false) {
    const item = ALL_SHOP_ITEMS.find(x => x.id === itemId);
    if (!item) return;
    const cmp = computeTravelBuyComparison(item);
    if (smuggle) G.policeHeat = clamp(G.policeHeat + Math.round(25 * getDiff().heatGainMult));
    const cost = smuggle ? Math.round(cmp.importTaxZar * 1.35) : cmp.importTaxZar;
    if (!chargeMoney(cost, `${smuggle ? 'Smuggle' : 'Import'}: ${item.name}`)) return;
    if (smuggle && Math.random() < 0.25) {
      closeModal();
      G.jail.pendingCase = { charge: `Contraband Import (${item.name})`, years: 2, fine: 12000 };
      showToast('🚨 Customs seized contraband! Facing Court Trial.');
      saveAll(); render(); return;
    }
    G.pendingDeliveries.push({ uid: 'dlv_' + Date.now(), itemId: item.id, name: item.name, originCid: cmp.origC.id, daysLeft: smuggle ? 3 : 7, costZar: cost });
    closeModal();
    showToast(`📦 ${item.name} ordered from ${cmp.origC.name}! Arriving next month.`);
    saveAll(); render();
  }

  function useInventoryItem(uid) {
    const idx = G.inventory.findIndex(x => x.uid === uid);
    if (idx === -1) return;
    const it = G.inventory[idx];
    if (it.durability <= 0) return showToast(`🔧 ${it.name} broken! Repair it first.`);
    const ut = it.usableType || it.subCat || 'general';

    if (ut === 'fridge') {
      const stored = G.inventory.filter(x => x.cat === 'Food');
      openModal(`
        <h3 class="gold">❄️ ${esc(it.name)} (${stored.length} Food Items)</h3>
        <div class="muted">Fridge stops 48h spoilage on stored food!</div>
        ${stored.length ? stored.map(fd => `
          <div class="card-alt between">
            <div><strong>${esc(fd.name)}</strong> (${fd.qty || 1}x) · <span class="${fd.condition === 'Expired' ? 'bad' : 'good'}">${esc(fd.condition || 'Fresh')}</span></div>
            <button class="btn btn-gold btn-sm" onclick="LSW.useInventoryItem('${esc(fd.uid)}');LSW.closeModal();">Eat</button>
          </div>
        `).join('') : '<div class="muted" style="margin:8px 0;">Fridge is empty.</div>'}
        <button class="btn btn-dark" onclick="LSW.closeModal()">Close</button>
      `);
      return;
    }
    if (ut === 'food' || it.cat === 'Food') {
      if (it.condition === 'Expired') {
        G.stats.health = clamp(G.stats.health - 15);
        showToast(`🤢 Expired ${it.name}! -15 Health`);
      } else {
        G.stats.energy = clamp(G.stats.energy + 18, 0, getDiff().energyCap);
        G.stats.health = clamp(G.stats.health + 4);
        G.needs.hunger = clamp(G.needs.hunger + 28);
        if (it.subCat === 'drink') G.needs.thirst = clamp(G.needs.thirst + 32);
        showToast(`🍽️ Ate ${it.name}: +Hunger & +18 Energy`);
      }
      if ((it.qty || 1) > 1) it.qty -= 1; else G.inventory.splice(idx, 1);
      saveAll(); render(); return;
    }
    if (ut === 'medicine' || it.cat === 'Medicine') {
      const heal = Math.round(18 * getDiff().medHealMult);
      G.stats.health = clamp(G.stats.health + heal);
      G.needs.health = clamp(G.needs.health + heal);
      showToast(`💊 Used ${it.name}: +${heal} Health`);
      if ((it.qty || 1) > 1) it.qty -= 1; else G.inventory.splice(idx, 1);
      saveAll(); render(); return;
    }
    if (ut === 'bed') { restNow(); return; }
    if (!guardTap(`use_item_${it.itemId}`)) return;
    if (ut === 'clothes') {
      G.inventory.forEach(x => { if (x.usableType === 'clothes') x.worn = false; });
      it.worn = true;
      G.equippedOutfit = it.name;
      G.needs.clothing = clamp(G.needs.clothing + 25);
      showToast(`👕 Equipped ${it.name}!`);
      saveAll(); render(); return;
    }
    if (ut === 'safe') {
      openModal(`
        <h3 class="gold">🔒 Security Safe</h3>
        <div class="card-alt">Inside Safe: <strong class="gold">${fmtFull(G.safeCash || 0, G.countryId)}</strong> · Cash: <strong>${fmtFull(G.cash, G.countryId)}</strong></div>
        <div class="grid2">
          <button class="btn btn-gold btn-sm" onclick="LSW.safeOp('dep', 1000)">+ Deposit ${fmt(1000)}</button>
          <button class="btn btn-blue btn-sm" onclick="LSW.safeOp('with', 1000)">- Withdraw ${fmt(1000)}</button>
        </div>
        <button class="btn btn-dark" onclick="LSW.closeModal()">Close</button>
      `);
      return;
    }
    if (ut === 'solar' || ut === 'generator') {
      G.utilityState.electricity = true;
      G.utilityState.powerHours = (G.utilityState.powerHours || 0) + 48;
      G.needs.shelter = clamp(G.needs.shelter + 15);
      showToast(`⚡ ${it.name} generated +48h Backup Power!`);
      saveAll(); render(); return;
    }
    if (ut === 'book') {
      if ((it.readCount || 0) >= 3) return showToast(`📚 Already finished reading ${it.name}!`);
      if (!useEnergy(8)) return;
      it.readCount = (it.readCount || 0) + 1;
      G.stats.smarts = clamp(G.stats.smarts + 5);
      G.needs.learning = clamp(G.needs.learning + 20);
      showToast(`📖 Read ${it.name}: +5 Smarts!`);
      saveAll(); render(); return;
    }
    if (ut === 'microscope' || ut === 'lab') { openResearchItemModal(uid); return; }
    if (ut === 'paint') { const trg = G.inventory.find(x => x.paintable && x.uid !== uid) || it; openPaintModal(trg.uid); return; }
    if (ut === 'seeds') {
      if (G.houses.length === 0 && G.age >= 18) return showToast('🌱 Need House garden or Planter to plant seeds!');
      if (!useEnergy(10)) return;
      addInventoryItem(ALL_SHOP_ITEMS.find(x => x.cat === 'Food') || ALL_SHOP_ITEMS[0], 0, G.countryId);
      G.skills.Farming = clamp((G.skills.Farming || 0) + 4);
      G.needs.hunger = clamp(G.needs.hunger + 15);
      showToast('🌾 Harvested fresh home produce! +4 Farming');
      saveAll(); render(); return;
    }
    if (!useEnergy(6)) return;
    it.durability = Math.max(5, (it.durability || 100) - 5);
    if (G.needs[it.need] !== undefined) G.needs[it.need] = clamp(G.needs[it.need] + 16);
    G.stats.happy = clamp(G.stats.happy + 4);
    showToast(`✅ Used ${it.name} (+${it.need} comfort)!`);
    saveAll(); render();
  }

  function safeOp(dir, amtZar) {
    if (dir === 'dep') {
      if (G.cash < amtZar) return showToast('Not enough cash!');
      G.cash -= amtZar; G.safeCash = (G.safeCash || 0) + amtZar;
    } else {
      if ((G.safeCash || 0) < amtZar) return showToast('Not enough in Safe!');
      G.safeCash -= amtZar; G.cash += amtZar;
    }
    saveAll();
    const sf = G.inventory.find(x => x.usableType === 'safe');
    if (sf) useInventoryItem(sf.uid);
  }

  function openInnovateModal(uid) {
    const it1 = G.inventory.find(x => x.uid === uid);
    const others = G.inventory.filter(x => x.uid !== uid);
    if (!it1 || !others.length) return showToast('Need at least 2 items in Inventory to Innovate!');
    openModal(`
      <h3 class="gold">💡 Innovate: Fuse Two Items</h3>
      <div class="card-alt">Base: <strong>${esc(it1.name)}</strong></div>
      <label class="muted">2nd Item to Combine:</label>
      <select id="innoPairUid">${others.map(o => `<option value="${esc(o.uid)}">${esc(o.name)}</option>`).join('')}</select>
      ${G.age >= 18 ? `<label style="display:flex;gap:8px;align-items:center;margin-top:6px;"><input id="innoPatentChk" type="checkbox" style="width:auto;" /> <span>File Patent (${fmt(5000)} -> ${fmt(1000)}/mo royalty!)</span></label>` : '<div class="muted">Under 18 prototypes cannot be patented yet.</div>'}
      <button class="btn btn-gold" style="margin-top:8px;" onclick="LSW.executeInnovation('${esc(uid)}')">⚡ Invent Product</button>
      <button class="btn btn-dark" onclick="LSW.closeModal()">Cancel</button>
    `);
  }

  function executeInnovation(uid1) {
    if (!guardTap('item_innovate') || !useEnergy(15)) return;
    const uid2 = $('innoPairUid') ? $('innoPairUid').value : '';
    const pat = Boolean($('innoPatentChk') && $('innoPatentChk').checked);
    const it1 = G.inventory.find(x => x.uid === uid1);
    const it2 = G.inventory.find(x => x.uid === uid2);
    if (!it1 || !it2) return;
    if (pat && !chargeMoney(5000, 'Patent Attorney Fee')) return;
    const nm = `Smart ${it1.name.split(' ').slice(-1)[0]}-${it2.name.split(' ').slice(-1)[0]} Pro`;
    addInventoryItem({ id: 'proto_' + Date.now(), name: nm, cat: 'Technology', need: 'work', needLabel: '💼 Work', effect: `Invention from ${it1.name} + ${it2.name}`, cost: Math.round((it1.buyPriceZar + it2.buyPriceZar) * 1.45), usableType: 'gear' }, Math.round((it1.buyPriceZar + it2.buyPriceZar) * 1.45), G.countryId);
    G.patents.push({ id: 'pat_' + Date.now(), name: nm, patented: pat, royaltyMonthly: pat ? 1000 : 0, monthsLeft: 60, copied: false });
    if (pat) G.innovation.patents += 1;
    G.stats.smarts = clamp(G.stats.smarts + 6);
    G.innovationScore = clamp((G.innovationScore || 0) + 5);
    closeModal();
    celebratePopup('💡 Invention Created!', `<p>Invented <strong class="gold">${esc(nm)}</strong>! ${pat ? '📜 Patented for 5 years!' : 'Unpatented prototype.'}</p>`);
    saveAll(); render();
  }

  function openResearchItemModal(uid) {
    const it = G.inventory.find(x => x.uid === uid);
    if (!it) return;
    openModal(`
      <h3 class="gold">🔬 Research: ${esc(it.name)}</h3>
      <div class="card-alt">What extends hardware & lab specimen reliability most?</div>
      <select id="resItemAns">
        <option value="0">Preventive calibration, clean controls & chain of custody</option>
        <option value="1">Skipping inspection logs completely</option>
      </select>
      <button class="btn btn-gold" style="margin-top:8px;" onclick="LSW.submitItemResearch('${esc(uid)}', 0)">Submit Study</button>
      <button class="btn btn-dark" onclick="LSW.closeModal()">Cancel</button>
    `);
  }

  function submitItemResearch(uid, okIdx) {
    if (!guardTap(`item_research_${uid}`) || !useEnergy(10)) return;
    const it = G.inventory.find(x => x.uid === uid);
    if (!it) return;
    const picked = Number($('resItemAns').value);
    closeModal();
    if (picked === okIdx) {
      G.stats.smarts = clamp(G.stats.smarts + 5);
      G.skills.Research = clamp((G.skills.Research || 10) + 5);
      G.needs.learning = clamp(G.needs.learning + 20);
      it.buyPriceZar = Math.round((it.buyPriceZar || 500) * 1.15);
      showToast(`🔬 Research verified on ${it.name}: +5 Smarts & +15% Value!`);
    } else showToast('Study inconclusive!');
    saveAll(); render();
  }

  function openPaintModal(uid) {
    const it = G.inventory.find(x => x.uid === uid);
    if (!it || it.cat === 'Food' || it.cat === 'Medicine') return showToast('Select a solid item to paint!');
    const colors = ['Royal Gold', 'Midnight Navy', 'Crimson Red', 'Emerald Green', 'Matte Black', 'Ivory White'];
    openModal(`
      <h3 class="gold">🎨 Paint Anything: ${esc(it.name)}</h3>
      <select id="paintColorSel">${colors.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
      <button class="btn btn-gold" style="margin-top:8px;" onclick="LSW.applyPaintItem('${esc(uid)}')">🖌️ Paint Now (${fmt(120)})</button>
      <button class="btn btn-dark" onclick="LSW.closeModal()">Cancel</button>
    `);
  }

  function applyPaintItem(uid) {
    const it = G.inventory.find(x => x.uid === uid);
    if (!it || !guardTap('item_paint') || !useEnergy(5) || !chargeMoney(120, 'Paint')) return;
    it.paintColor = $('paintColorSel').value;
    if ((G.skills.Painting || 0) >= 25) it.buyPriceZar = Math.round((it.buyPriceZar || 400) * 1.2);
    G.stats.happy = clamp(G.stats.happy + 7);
    closeModal();
    showToast(`🎨 Painted ${it.name} in ${it.paintColor}!`);
    saveAll(); render();
  }

  function sellInventoryItem(uid) {
    const idx = G.inventory.findIndex(x => x.uid === uid);
    if (idx === -1) return;
    const it = G.inventory[idx];
    const base = ALL_SHOP_ITEMS.find(x => x.id === it.itemId) || { name: it.name, cost: it.buyPriceZar || 400, tags: [], cat: it.cat };
    const sc = getItemScarcity(base, G.countryId);
    const mult = sc.tier === 'scarce' ? 1.5 : sc.tier === 'rare' ? 1.18 : 0.72;
    const amt = Math.max(20, Math.round((it.buyPriceZar || base.cost) * mult * ((it.durability || 100) / 100)));
    if ((it.qty || 1) > 1) it.qty -= 1; else G.inventory.splice(idx, 1);
    earnMoney(amt, `Sold ${it.name}`);
    showToast(`💰 Sold ${it.name} for ${fmt(amt)}!`);
    saveAll(); render();
  }

  function giftInventoryItem(uid) {
    const idx = G.inventory.findIndex(x => x.uid === uid);
    if (idx === -1) return;
    const it = G.inventory[idx];
    const target = G.partner || (G.npcs && G.npcs[0]);
    if (!target) return showToast('Make a friend first!');
    target.bond = clamp(target.bond + 12);
    G.needs.social = clamp(G.needs.social + 15);
    if ((it.qty || 1) > 1) it.qty -= 1; else G.inventory.splice(idx, 1);
    showToast(`🎁 Gifted ${it.name} to ${target.name}! Bond +12%`);
    saveAll(); render();
  }

  function donateInventoryItem(uid) {
    const idx = G.inventory.findIndex(x => x.uid === uid);
    if (idx === -1) return;
    const it = G.inventory[idx];
    if ((it.qty || 1) > 1) it.qty -= 1; else G.inventory.splice(idx, 1);
    G.communityRespect = clamp(G.communityRespect + 6);
    G.stats.happy = clamp(G.stats.happy + 6);
    showToast(`🤝 Donated ${it.name}! +6 Community Rep`);
    saveAll(); render();
  }

  function recycleInventoryItem(uid) {
    const idx = G.inventory.findIndex(x => x.uid === uid);
    if (idx === -1) return;
    const it = G.inventory[idx];
    const scrap = Math.max(15, Math.round((it.buyPriceZar || 200) * 0.18));
    if ((it.qty || 1) > 1) it.qty -= 1; else G.inventory.splice(idx, 1);
    G.compliance.env = clamp(G.compliance.env + 3);
    earnMoney(scrap, `Recycled ${it.name}`);
    showToast(`♻️ Recycled ${it.name} for ${fmt(scrap)}`);
    saveAll(); render();
  }

  function repairInventoryItem(uid) {
    const it = G.inventory.find(x => x.uid === uid);
    if (!it || it.cat === 'Food' || it.cat === 'Medicine') return showToast('Cannot repair consumables.');
    const fee = Math.max(40, Math.round((it.buyPriceZar || 400) * 0.15));
    if (!chargeMoney(fee, `Repair ${it.name}`)) return;
    it.durability = 100; it.condition = 'Good';
    showToast(`🔧 Repaired ${it.name} to 100%!`);
    saveAll(); render();
  }

  function upgradeInventoryItem(uid) {
    const it = G.inventory.find(x => x.uid === uid);
    if (!it || it.cat === 'Food' || it.cat === 'Medicine') return showToast('Cannot upgrade consumables.');
    const fee = Math.max(150, Math.round((it.buyPriceZar || 500) * 0.35));
    if (!chargeMoney(fee, `Upgrade ${it.name}`)) return;
    if (!it.name.includes('+Pro')) it.name += ' +Pro';
    it.buyPriceZar = Math.round((it.buyPriceZar || 500) * 1.35);
    it.durability = 100;
    showToast(`⬆️ Upgraded ${it.name}!`);
    saveAll(); render();
  }

  function lendInventoryItem(uid) {
    const it = G.inventory.find(x => x.uid === uid);
    const friend = G.npcs && G.npcs[0];
    if (!it || !friend) return showToast('Make a friend first!');
    friend.bond = clamp(friend.bond + 8);
    it.lentTo = friend.name;
    G.needs.social = clamp(G.needs.social + 10);
    showToast(`🤝 Lent ${it.name} to ${friend.name} (Returned next month)`);
    saveAll(); render();
  }

  function toggleRentInventoryItem(uid) {
    if (G.age < 18) return showToast('Must be 18+ to rent equipment!');
    const it = G.inventory.find(x => x.uid === uid);
    if (!it || it.cat === 'Food' || it.cat === 'Medicine') return showToast('Not rentable.');
    it.rented = !it.rented;
    showToast(it.rented ? `💵 Renting out ${it.name} monthly!` : `Stopped renting ${it.name}.`);
    saveAll(); render();
  }

  /* ============================================================
     9. GLOBAL SEARCH, DIFFICULTY, SETTINGS, CRISIS & POLICE
     ============================================================ */
  function openSearchPanel() { UI_STATE.searchOpen = true; renderSearchDropdown(); }
  function closeSearchPanel() { UI_STATE.searchOpen = false; const p = $('globalSearchPanel'); if (p) p.classList.add('hidden'); }
  function setGlobalSearch(q) { UI_STATE.searchQuery = q; UI_STATE.searchOpen = true; renderSearchDropdown(); }
  function setSearchFilter(f) { UI_STATE.searchFilter = f; UI_STATE.searchOpen = true; renderSearchDropdown(); }

  function recordSearchTerm(q) {
    const s = (q || '').trim();
    if (!s || !G) return;
    G.recentSearches = [s, ...(G.recentSearches || []).filter(x => x !== s)].slice(0, 10);
    saveAll();
  }

  function searchJump(kind, a, b, term) {
    recordSearchTerm(term || UI_STATE.searchQuery);
    closeSearchPanel();
    if (kind === 'item') openBuyOrTravelModal(a);
    else if (kind === 'country') { UI_STATE.flightToCid = a; UI_STATE.worldView = 'airport'; UI_STATE.tab = 'world'; UI_STATE.menuPage = null; render(); }
    else if (kind === 'menu') { routeMenuTarget(a); }
    else { UI_STATE[a] = b; UI_STATE.tab = kind; UI_STATE.menuPage = null; render(); }
  }

  function startVoiceSearch() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return showToast('Voice mic unsupported here — type in the Search bar!');
    const rec = new SR();
    rec.onresult = e => {
      const txt = e.results[0][0].transcript;
      if ($('globalSearchInput')) $('globalSearchInput').value = txt;
      setGlobalSearch(txt);
    };
    rec.start();
    showToast('🎤 Listening...');
  }

  function renderSearchDropdown() {
    const panel = $('globalSearchPanel');
    if (!panel || !G) return;
    if (!UI_STATE.searchOpen) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    const q = (UI_STATE.searchQuery || '').trim().toLowerCase();
    const flt = UI_STATE.searchFilter || 'All';
    const filters = ['All', 'Items', 'Jobs', 'Countries', 'Courses', 'NPCs'];
    const hits = [];

    if (q.length >= 1) {
      if (flt === 'All' || flt === 'Items') {
        ALL_SHOP_ITEMS.filter(it => it.name.toLowerCase().includes(q) || it.needLabel.toLowerCase().includes(q) || it.cat.toLowerCase().includes(q)).slice(0, 6).forEach(it => {
          const sc = getItemScarcity(it, G.countryId);
          hits.push({ title: `${it.name} ${sc.emoji}`, sub: `${it.needLabel} · ${sc.tier === 'banned' ? 'Travel/Import' : fmt(getEffectiveItemPriceZar(it, G.countryId))}`, onclick: `LSW.searchJump('item','${esc(it.id)}','','${esc(it.name)}')` });
        });
      }
      if (flt === 'All' || flt === 'Jobs') {
        JOBS_CATALOG.filter(j => j.title.toLowerCase().includes(q) || j.sector.toLowerCase().includes(q)).slice(0, 4).forEach(j => {
          hits.push({ title: `💼 ${j.title}`, sub: `${j.sector} · ${fmt(Math.round(j.salary * getCountry().salIdx * getDiff().payMult))}/mo`, onclick: `LSW.searchJump('work','workView','jobs','${esc(j.title)}')` });
        });
      }
      if (flt === 'All' || flt === 'Countries') {
        COUNTRIES.filter(cn => cn.name.toLowerCase().includes(q) || cn.capital.toLowerCase().includes(q) || cn.lawSystem.toLowerCase().includes(q) || cn.schoolSystem.toLowerCase().includes(q) || cn.cities.some(ct => ct.toLowerCase().includes(q))).slice(0, 5).forEach(cn => {
          hits.push({ title: `🌍 ${cn.name} (${cn.cur})`, sub: `Cap: ${cn.capital} · Laws: ${cn.lawSystem}`, onclick: `LSW.searchJump('country','${cn.id}','','${esc(cn.name)}')` });
        });
      }
      if (flt === 'All' || flt === 'Courses') {
        COURSES_AND_CERTS.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3).forEach(c => {
          hits.push({ title: `🎓 ${c.name}`, sub: `${fmt(c.cost)} · ${c.benefit}`, onclick: `LSW.searchJump('people','peopleView','school','${esc(c.name)}')` });
        });
      }
      if (flt === 'All' || flt === 'NPCs') {
        G.npcs.filter(n => n.name.toLowerCase().includes(q)).slice(0, 3).forEach(n => {
          hits.push({ title: `👤 ${n.name}`, sub: `Bond ${n.bond}% · ${n.city}`, onclick: `LSW.searchJump('people','peopleView','npcs','${esc(n.name)}')` });
        });
      }
    }

    panel.innerHTML = `
      <div class="between" style="margin-bottom:4px;">
        <strong class="gold">🔍 Search Anything</strong>
        <button class="pill-btn" onclick="LSW.closeSearchPanel()">✕</button>
      </div>
      <div class="pill-strip" style="margin-bottom:6px;">
        ${filters.map(f => `<button class="pill-btn ${flt === f ? 'active' : ''}" onclick="LSW.setSearchFilter('${f}')">${f}</button>`).join('')}
      </div>
      ${!q && (G.recentSearches || []).length ? `<div class="muted">Recent: ${(G.recentSearches || []).map(r => `<button class="pill-btn" onclick="document.getElementById('globalSearchInput').value='${esc(r)}';LSW.setGlobalSearch('${esc(r)}')">${esc(r)}</button>`).join('')}</div>` : ''}
      ${hits.length ? hits.map(h => `<div class="card-alt between" style="margin-bottom:5px;padding:7px 9px;"><div><strong>${esc(h.title)}</strong><div class="muted">${esc(h.sub)}</div></div><button class="btn btn-gold btn-sm" onclick="${h.onclick}">Go →</button></div>`).join('') : q ? '<div class="muted">No direct match — browse Global Shops or Countries in World tab!</div>' : '<div class="muted">Type an item, job, course, person, law, or country.</div>'}
    `;
  }

  function setDifficulty(newDiff) {
    if (!DIFFICULTY_PROFILES[newDiff] || !G) return;
    G.difficulty = newDiff;
    G.stats.energy = Math.min(G.stats.energy, DIFFICULTY_PROFILES[newDiff].energyCap);
    showToast(`Difficulty set to ${DIFFICULTY_PROFILES[newDiff].badge}!`);
    saveAll(); render();
  }

  function confirmSetDifficulty(newDiff) {
    if (!DIFFICULTY_PROFILES[newDiff] || G.difficulty === newDiff) return;
    const p = DIFFICULTY_PROFILES[newDiff];
    openModal(`
      <h3 class="gold">🎮 Switch to ${esc(p.badge)}?</h3>
      <div class="card-alt"><p>${esc(p.desc)}</p><div class="muted">Applies to future months without resetting your save.</div></div>
      <div class="grid2">
        <button class="btn btn-gold btn-sm" onclick="LSW.closeModal();LSW.setDifficulty('${newDiff}');">Confirm</button>
        <button class="btn btn-dark btn-sm" onclick="LSW.closeModal()">Cancel</button>
      </div>
    `);
  }

  function setTheme(themeId) {
    if (!THEMES[themeId]) return;
    const t = applyTheme(themeId, true);
    showToast(`🎨 Theme changed to ${t.name}!`);
    render();
  }

  function openWorldSettings() {
    UI_STATE.tab = 'world';
    UI_STATE.worldView = 'settings';
    UI_STATE.menuPage = null;
    closeSearchPanel();
    render();
  }

  function updateSetting(k, v) {
    if (!G.settings) G.settings = {};
    G.settings[k] = v;
    if (k === 'fontSize') applyFontSize();
    saveAll(); render();
  }

  function exportSaveJson() {
    openModal(`
      <h3 class="gold">📤 Export JSON Save</h3>
      <textarea rows="8" readonly>${esc(JSON.stringify({ G, LEGACY }, null, 2))}</textarea>
      <button class="btn btn-gold" onclick="LSW.closeModal()">Close</button>
    `);
  }

  function openResetConfirmModal(step = 1) {
    if (step === 1) {
      openModal(`<h3 class="warn">⚠️ Reset Save?</h3><p>Start a brand new life? Current character will be replaced.</p><button class="btn btn-danger" onclick="LSW.openResetConfirmModal(2)">Continue →</button><button class="btn btn-dark" onclick="LSW.closeModal()">Cancel</button>`);
    } else {
      openModal(`<h3 class="bad">🚨 Confirm Final Reset</h3><button class="btn btn-danger" onclick="localStorage.removeItem('${SAVE_KEY}');LSW.closeModal();LSW.openStartScreen();">Yes, Start Fresh</button><button class="btn btn-dark" onclick="LSW.closeModal()">Keep Playing</button>`);
    }
  }

  function handleCrisisAction(act) {
    if (!G || !G.activeCrisis) return;
    const d = getDiff();
    if (act === 'prepare') {
      if (!chargeMoney(Math.round(900 * d.costMult), `Crisis Prep: ${G.activeCrisis.name}`)) return;
      G.crisisPrepared = true;
      G.needs.safety = clamp(G.needs.safety + 18);
      showToast(`🛡️ Prepared for ${G.activeCrisis.name}!`);
    } else {
      G.activeCrisis = null;
      showToast('Riding out the crisis.');
    }
    saveAll(); render();
  }

  function policeAction(act) {
    const d = getDiff();
    if (act === 'bribe') {
      if (G.age < 18) {
        showToast('Children cannot bribe. This is illegal.');
        openModal(`<h3 class="bad">⛔ Illegal for Minors</h3><div class="card-alt">Children cannot bribe. This is illegal.</div><button class="btn btn-gold" onclick="LSW.closeModal()">OK</button>`);
        return;
      }
      if (!guardTap('police_bribe')) return;
      if (!chargeMoney(Math.round(2500 * d.fineMult), 'Police Bribe')) return;
      if (Math.random() < (d.id === 'hard' ? 0.45 : 0.72)) { G.policeHeat = clamp(G.policeHeat - 35); showToast('💵 Police Heat -35'); }
      else { G.jail.pendingCase = { charge: 'Bribery Attempt', years: 2, fine: 10000 }; showToast('🚨 Sting! Pending Trial.'); }
    } else if (act === 'pay') {
      if (!guardTap('police_pay')) return;
      const fine = Math.round(Math.max(800, G.policeHeat * 65 * d.fineMult));
      if (!chargeMoney(fine, 'Police Citations')) return;
      G.policeHeat = 0; showToast(`⚖️ Fines paid (${fmt(fine)}). Heat cleared!`);
    } else {
      if (!guardTap('police_hide') || !useEnergy(12)) return;
      G.policeHeat = clamp(G.policeHeat - 25);
      showToast('🫥 Laid low: Police Heat -25.');
    }
    saveAll(); render();
  }

  /* ============================================================
     10. MONTH ADVANCEMENT, EVENTS, DEATH & INHERITANCE
     ============================================================ */
  function genMonthEvent() {
    if (!G) return null;
    const c = getCountry();

    // Respectful seasonal Belief & Culture events (max 1 event/mo, never repeats consecutive months)
    if (G.age >= 6 && G.lastHolidayMonth !== G.month) {
      if (G.belief === 'Islam' && G.month === 3) {
        G.lastHolidayMonth = 3;
        return {
          text: `Ramadan has begun across ${G.city}. Families prepare predawn suhoor and quiet reflection.`,
          opts: [
            { label: 'Observe the fast & pray with family', msg: '🌙 Peaceful Ramadan: +5 Morality, +5 Community Rep', fn: () => { G.stats.morality = clamp(G.stats.morality + 5); G.communityRespect = clamp(G.communityRespect + 5); G.stats.energy = clamp(G.stats.energy - 5); recordMemory('Ramadan Reflections', `Shared quiet prayers and evening iftar with loved ones in ${G.city}.`); } },
            { label: 'Focus on health & join evening iftar', msg: '🍲 Shared iftar kindly: +4 Happiness, +2 Community Rep', fn: () => { G.stats.happy = clamp(G.stats.happy + 4); G.communityRespect = clamp(G.communityRespect + 2); } }
          ]
        };
      }
      if (G.belief === 'Hinduism' && G.month === 10) {
        G.lastHolidayMonth = 10;
        return {
          text: `Diwali lamps glow warmly across ${G.city}. Neighbours exchange sweets and blessings.`,
          opts: [
            { label: 'Light diyas & celebrate with family', msg: '🪔 Happy Diwali: +7 Happiness, +5 Community Rep', fn: () => { G.stats.happy = clamp(G.stats.happy + 7); G.communityRespect = clamp(G.communityRespect + 5); recordMemory('Diwali Lights', `Lit oil lamps with family and shared sweets in ${G.city}.`); } },
            { label: 'Offer quiet prayers at home', msg: '🙏 Quiet prayer: +4 Morality, +3 Happiness', fn: () => { G.stats.morality = clamp(G.stats.morality + 4); G.stats.happy = clamp(G.stats.happy + 3); } }
          ]
        };
      }
      if (G.belief === 'Christianity' && G.month === 12) {
        G.lastHolidayMonth = 12;
        return {
          text: `Christmas season brings hymns and family gatherings across ${G.city}.`,
          opts: [
            { label: 'Attend church & share family meal', msg: '⛪ Blessed Christmas: +6 Happiness, +5 Morality', fn: () => { G.stats.happy = clamp(G.stats.happy + 6); G.stats.morality = clamp(G.stats.morality + 5); G.communityRespect = clamp(G.communityRespect + 4); recordMemory('Christmas Gathering', `Sang hymns and shared a warm family table in ${G.city}.`); } },
            { label: 'Rest quietly at home with loved ones', msg: '🕯️ Quiet holiday: +5 Happiness, +4 Health', fn: () => { G.stats.happy = clamp(G.stats.happy + 5); G.stats.health = clamp(G.stats.health + 4); } }
          ]
        };
      }
      if (G.countryId === 'za' && G.month === 9) {
        G.lastHolidayMonth = 9;
        return {
          text: `Heritage Day arrives in ${G.city}! Families honour ${G.culture} songs, attire, and traditions.`,
          opts: [
            { label: `Celebrate ${G.culture} heritage with pride`, msg: '🥁 Heritage honoured: +6 Happiness, +6 Community Rep', fn: () => { G.stats.happy = clamp(G.stats.happy + 6); G.communityRespect = clamp(G.communityRespect + 6); recordMemory('Heritage Day', `Wore ${G.culture} attire and celebrated roots with family.`); } },
            { label: 'Share a quiet meal with elders', msg: '🍲 Warm elders visit: +4 Morality, +4 Happiness', fn: () => { G.stats.morality = clamp(G.stats.morality + 4); G.stats.happy = clamp(G.stats.happy + 4); } }
          ]
        };
      }
      if (G.belief === 'African Traditional' && G.month === 6) {
        G.lastHolidayMonth = 6;
        return {
          text: `Elders gather for a traditional harvest & ancestor thanksgiving in your ${G.culture} home.`,
          opts: [
            { label: 'Join the elders & pay respect', msg: '🥁 Elders blessed you: +6 Morality, +6 Community Rep', fn: () => { G.stats.morality = clamp(G.stats.morality + 6); G.communityRespect = clamp(G.communityRespect + 6); recordMemory('Ancestral Thanksgiving', `Sat beside ${G.culture} elders in gratitude and respect.`); } },
            { label: 'Help prepare food for the family', msg: '🍲 Family unity: +5 Happiness, +3 Community Rep', fn: () => { G.stats.happy = clamp(G.stats.happy + 5); G.communityRespect = clamp(G.communityRespect + 3); } }
          ]
        };
      }
    }

    if (G.age < 6) {
      return {
        text: `Growing up safely in ${G.city} with ${G.culture} family warmth.`,
        opts: [
          { label: 'Play with toys', msg: '🧸 Playtime: +5 Happiness', fn: () => { G.stats.happy = clamp(G.stats.happy + 5); } },
          { label: 'Listen to family stories', msg: '📖 Storytime: +4 Smarts', fn: () => { G.stats.smarts = clamp(G.stats.smarts + 4); } }
        ]
      };
    }
    if (G.age < 18) {
      return {
        text: `School life in ${G.city} (${c.schoolSystem}).`,
        opts: [
          { label: 'Study extra hard', msg: '📚 Studied hard: +5 Smarts, +4 Grade', fn: () => { G.stats.smarts = clamp(G.stats.smarts + 5); G.school.gradePct = clamp(G.school.gradePct + 4); } },
          { label: 'Hang out with classmates', msg: '🤝 Classmates: +6 Happiness, +5 Confidence', fn: () => { G.stats.happy = clamp(G.stats.happy + 6); G.confidence = clamp(G.confidence + 5); } }
        ]
      };
    }
    return {
      text: `A fresh month of opportunity in ${G.city}, ${c.name}.`,
      opts: [
        { label: 'Hustle & network', msg: '💼 Networked: +4 Confidence, +4 Community Rep', fn: () => { G.confidence = clamp(G.confidence + 4); G.communityRespect = clamp(G.communityRespect + 4); } },
        { label: 'Self-care evening', msg: '🌿 Self-care: +6 Happiness, +6 Health', fn: () => { G.stats.happy = clamp(G.stats.happy + 6); G.stats.health = clamp(G.stats.health + 6); } }
      ]
    };
  }

  function pickEventOption(i) {
    if (!G || !G.currentEvent || !G.currentEvent.opts[i]) return;
    if (!guardTap('month_event')) return;
    const chosen = G.currentEvent.opts[i];
    chosen.fn();
    if (chosen.msg) showToast(chosen.msg);
    G.currentEvent = null;
    advanceMonth();
  }

  function processMonthlyNeedsAndInventory(diff) {
    const n = G.needs;
    const inv = G.inventory || [];
    const hasFridge = inv.some(x => x.usableType === 'fridge');
    const hasBed = inv.some(x => x.usableType === 'bed');
    const hasHouse = G.houses.some(h => !h.rentedOut);
    const hasTent = inv.some(x => x.usableType === 'tent');
    const hasWasher = inv.some(x => x.usableType === 'washer' || x.usableType === 'shower');
    const hasPhone = inv.some(x => x.usableType === 'phone' || x.usableType === 'laptop');
    const hasSec = inv.some(x => x.usableType === 'security');

    if (G.pendingDeliveries && G.pendingDeliveries.length) {
      const rem = [];
      G.pendingDeliveries.forEach(pd => {
        pd.daysLeft -= 30;
        if (pd.daysLeft <= 0) {
          const obj = ALL_SHOP_ITEMS.find(x => x.id === pd.itemId) || { id: pd.itemId, name: pd.name, cat: 'Hardware', need: 'work', cost: pd.costZar };
          addInventoryItem(obj, pd.costZar, pd.originCid);
          G.monthlyReport.push(`📦 Import Delivered: ${pd.name}!`);
        } else rem.push(pd);
      });
      G.pendingDeliveries = rem;
    }

    inv.forEach(it => {
      if (it.cat === 'Food' && typeof it.daysLeft === 'number') {
        it.daysLeft -= hasFridge ? 0 : 1;
        if (it.daysLeft <= 0) it.condition = 'Expired';
      }
      if (it.rented && G.age >= 18) {
        earnMoney(Math.max(80, Math.round((it.buyPriceZar || 500) * 0.08)), `Item Rent: ${it.name}`);
        it.durability = Math.max(10, (it.durability || 100) - 8);
      }
      if (it.lentTo) { it.durability = Math.max(15, (it.durability || 100) - rand(5, 18)); it.lentTo = null; }
    });

    (G.patents || []).forEach(pt => {
      if (pt.patented && pt.monthsLeft > 0) {
        pt.monthsLeft -= 1;
        earnMoney(pt.royaltyMonthly || 1000, `📜 Patent Royalty: ${pt.name}`);
      }
    });

    if (isFamilyShieldActive() && G.age < 18) {
      ['hunger', 'thirst', 'shelter', 'clothing', 'safety', 'hygiene'].forEach(k => { n[k] = Math.max(78, n[k]); });
      n.energy = G.stats.energy; n.health = G.stats.health; n.learning = clamp(G.school.gradePct || 75);
      n.communication = clamp(hasPhone ? 90 : 70);
    } else {
      const fp = FOOD_PLANS.find(p => p.id === G.foodPlan) || FOOD_PLANS[0];
      if (fp.cost > 0) chargeMoney(fp.cost, `Food Plan (${fp.name})`);
      n.hunger = clamp(n.hunger + (fp.id === 'none' ? -20 : 12));
      n.thirst = clamp(n.thirst - 12 + (fp.id !== 'none' ? 10 : 0));
      n.shelter = clamp(hasHouse ? 95 : hasTent ? 65 : 35);
      n.hygiene = clamp(n.hygiene - 10 + (hasWasher ? 16 : 0));
      n.safety = clamp(n.safety - (hasHouse ? 0 : 10) + (hasSec ? 15 : 0));
      n.communication = clamp(hasPhone ? 88 : n.communication - 10);
      n.clothing = clamp(G.equippedOutfit ? 85 : 40);
      n.transport = clamp(G.cars.length ? 92 : n.transport - 4);
      n.energy = G.stats.energy; n.health = G.stats.health;

      if (n.hunger <= 0) G.stats.health = clamp(G.stats.health - 12);
      if (n.thirst <= 0) G.stats.health = clamp(G.stats.health - 14);
      if (!hasHouse && !hasBed && !hasTent) G.stats.health = clamp(G.stats.health - 5);
    }
  }

  function tickDemandOffers() {
    if (!G || G.age < 16) return;
    SYSTEM_OFFER_META.forEach(m => {
      const slot = G.systemOffers[m.key];
      if (!slot) return;
      if (slot.activeOffer) {
        slot.activeOffer.daysLeft -= 30;
        if (slot.activeOffer.daysLeft <= 0) {
          slot.activeOffer = null;
          slot.nextInMonths = rand(4, 7);
        }
      } else {
        slot.nextInMonths -= 1;
        if (slot.nextInMonths <= 0) {
          const basePay = Math.round(rand(3500, 14000) * getCountry().salIdx * getDiff().payMult);
          slot.activeOffer = {
            id: 'off_' + Date.now() + '_' + m.key,
            title: `${m.name}: Special Opportunity`,
            payout: basePay,
            daysLeft: rand(30, 60)
          };
        }
      }
    });
  }

  function advanceMonth() {
    if (!G) return;
    const d = getDiff();
    const c = getCountry();
    const ce = getCountryEdu(c.id);
    G.majorStepUsedThisMonth = null;
    G.tapCount = {};
    G.sleepUsedThisMonth = 0;
    G.jobChangesThisMonth = 0;
    G.mourningWeekActive = false;
    if (G.griefMonthsLeft > 0) {
      G.griefMonthsLeft = Math.max(0, G.griefMonthsLeft - 1);
      G.stats.happy = clamp(G.stats.happy + 3);
    }
    if (G.edu) G.edu.tutoredThisMonth = false;
    G.month += 1;
    G.totalMonths += 1;
    if (G.month > 12) {
      G.month = 1;
      G.age += 1;
      G.year = G.age;
      if (G.edu) G.edu.rewritesThisYear = 0;
      G.children.forEach(ch => { ch.age = (ch.age || 0) + 1; });
      if (G.age === 3 && !G.phases.nursery) {
        G.phases.nursery = true;
        if (G.edu && G.edu.stage === 'infant') { G.edu.stage = 'preschool'; G.edu.yearInStage = 1; G.edu.progress = 0; }
        G.school.stage = ce.preschoolName;
        G.phases.firstTimes.push(`Age 3: Entered ${ce.preschoolName}`);
      }
      if (G.age === 6 && !G.phases.primary) {
        G.phases.primary = true;
        if (G.edu) {
          if (!G.edu.preschoolDone) {
            G.edu.skippedPreschool = true;
            G.stats.smarts = clamp(G.stats.smarts - 1);
          }
          G.edu.stage = 'primary';
          G.edu.yearInStage = 1;
          G.edu.progress = 0;
        }
        G.school.stage = ce.primaryName;
        G.phases.firstTimes.push(`Age 6: Entered ${ce.primaryName} (${c.schoolSystem})`);
        recordMemory(`First Day of ${ce.primaryName}`, `Stepped into ${ce.primaryName} in ${G.city} carrying a new school bag.`);
      }
      if (G.age === 13 && G.edu && ['infant', 'preschool', 'primary'].includes(G.edu.stage)) {
        G.edu.stage = 'junior'; G.edu.yearInStage = 1; G.edu.progress = 0;
      }
      if (G.age === 13 && !G.phases.highSchool) {
        G.phases.highSchool = true;
        G.school.stage = ce.juniorName;
        G.phases.firstTimes.push(`Age 13: Entered ${ce.juniorName}`);
      }
      if (G.age === 18) {
        G.phases.firstTimes.push('Age 18: Entered Legal Adulthood!');
      }
      if (G.age % 5 === 0) {
        const avail = TRAITS_LIST.filter(t => !G.traits.includes(t.id));
        if (avail.length) { const nt = pick(avail); G.traits.push(nt.id); G.log.unshift(`🎭 New Trait unlocked: ${nt.name}!`); }
      }
    }

    const calYr = (G.birthYear || 2026) + G.age;
    G.monthlyReport = [`📅 ${MONTH_NAMES[(G.month - 1) % 12]} ${calYr} · Age ${G.age} · ${getSeasonName(G.month, c.id)}`];
    G.stats.energy = clamp(G.stats.energy + d.energyRecov, 0, d.energyCap);
    G.mining.equipLeft = 3;
    G.searchesLeft = 3;

    if (G.age < 18 && !G.kickedOut) {
      earnMoney(G.allowanceMonthly, 'Monthly Allowance');
    }

    if (G.job && !G.jail.inJail) {
      const eduMult = getEduSalaryMult();
      const gross = Math.round(G.job.salary * c.salIdx * d.payMult * eduMult);
      const net = Math.round(gross * (1 - c.taxPct / 100));
      earnMoney(net, `Salary: ${G.job.title}${eduMult > 1 ? ` (${eduMult.toFixed(2)}x Edu)` : ''}`);
      G.workStats.daysAtJob += d.daysPerMonth;
      G.workStats.perf = clamp((G.workStats.perf || 0) + 5);
      G.jobProgress = clamp((G.jobProgress || 0) + 10);
    }

    if (G.company) {
      const prof = Math.round(G.company.baseRev * d.payMult);
      earnMoney(prof, `Company Profit: ${G.company.name}`);
      G.company.valuation = Math.round(G.company.valuation * 1.012);
    }

    if (G.devStudio && G.devStudio.revenueMonthly > 0) {
      earnMoney(G.devStudio.revenueMonthly, 'Dev Studio App Revenue');
    }

    G.houses.forEach(h => {
      h.val = Math.round((h.val || h.cost) * (1 + (h.app || 0.05) / 12));
      if (h.rentedOut) earnMoney(h.rentIncome || h.rent, `Rental Income: ${h.name}`);
    });

    Object.values(G.investments).forEach(iv => {
      iv.prev = iv.price;
      const chg = (Math.random() - 0.46) * 0.08 - (G.activeCrisis && G.activeCrisis.id === 'recession' ? 0.04 : 0);
      iv.price = Math.max(100, Math.round(iv.price * (1 + chg)));
    });

    if (G.jail.inJail) {
      G.jail.monthsLeft -= 1;
      if (G.jail.monthsLeft <= 0) {
        G.jail.inJail = false;
        showToast('🎉 Released from Prison! Time to rebuild.');
      }
    }

    // Random Weather & Global Crises
    const cp = COUNTRY_PROFILES[c.id] || COUNTRY_PROFILES.za;
    G.weather = pick(WEATHER_BY_CLIMATE[cp.climate] || WEATHER_BY_CLIMATE.varied);
    if (!G.activeCrisis && Math.random() < d.crisisProb) {
      G.activeCrisis = pick(WORLD_CRISES);
      G.crisisPrepared = false;
      G.newsFeed.unshift(`⚠️ CRISIS: ${G.activeCrisis.name} — ${G.activeCrisis.desc}`);
    } else if (G.activeCrisis && Math.random() < 0.35) {
      G.activeCrisis = null;
      G.crisisPrepared = false;
    }
    if (G.activeCrisis && !G.crisisPrepared) {
      G.stats.health = clamp(G.stats.health - Math.round(3 * d.crisisDmg));
    }
    G.stats.health = clamp(G.stats.health - (d.healthDrift || 0));

    processMonthlyNeedsAndInventory(d);
    tickDemandOffers();
    G.currentEvent = genMonthEvent();

    const lifeExp = (COUNTRY_COORDS[c.id] && COUNTRY_COORDS[c.id].lifeExp) || 74;
    if (G.stats.health <= 0 || G.age >= lifeExp + rand(8, 22)) {
      triggerDeath(G.stats.health <= 0 ? 'Health dropped to zero' : 'Old age after a full life');
      return;
    }
    if (checkMonthlyBereavement()) {
      saveAll(); render();
      return;
    }
    saveAll(); render();
  }

  function triggerDeath(cause) {
    G.dead = true;
    G.deathCause = cause;
    const nw = calcNetWorth();
    LEGACY.gens.push({ gen: G.gen, name: G.name, job: G.job ? G.job.title : G.company ? 'CEO' : 'Citizen', netWorth: nw, country: getCountry().name });
    if (nw > LEGACY.bestNet) LEGACY.bestNet = nw;
    saveAll();

    const hasChild = G.children && G.children.length > 0;
    openModal(`
      <h2 class="bad">🕯️ End of Life (Gen ${G.gen})</h2>
      <div class="card-alt">
        <div><strong>${esc(G.name)}</strong> passed away at Age <strong>${G.age}</strong> (${esc(cause)}).</div>
        <div class="gold" style="margin-top:4px;">Final Net Worth: ${fmtFull(nw, G.countryId)}</div>
      </div>
      ${hasChild ? `
        <h4 class="gold">👶 Continue Legacy As Your Child:</h4>
        ${G.children.map((ch, ci) => `<button class="btn btn-gold" onclick="LSW.continueAsChild(${ci})">🧬 Continue as ${esc(ch.name)} (Inherit ${G.will.written ? '100%' : '75%'} Estate)</button>`).join('')}
      ` : ''}
      <button class="btn btn-blue" onclick="localStorage.removeItem('${SAVE_KEY}');LSW.closeModal();LSW.startRandomLife();">🌱 Start New Family</button>
    `);
  }

  function continueAsChild(childIdx) {
    const ch = G.children[childIdx] || G.children[0];
    const pct = G.will && G.will.written ? 1.0 : 0.75;
    const inheritCash = Math.round(Math.max(0, calcNetWorth()) * pct);
    const inheritHouse = G.houses && G.houses.length ? { ...G.houses[0], rentedOut: false } : null;
    const inheritComp = G.company ? { ...G.company } : null;
    const oldGen = G.gen;
    const oldSur = G.surname;
    const cid = G.countryId;
    const cty = G.city;
    G = createCharacter({
      countryId: cid, city: cty,
      firstName: ch.name.split(' ')[0], surname: oldSur,
      gender: ch.gender || 'M', gen: oldGen + 1, wealth: 'Rich',
      inheritCash, inheritHouse, inheritCompany: inheritComp,
      lineageNote: `Child of Gen ${oldGen} · Inherited ${fmt(inheritCash)}!`
    });
    closeModal();
    enterGame();
  }

  /* ============================================================
     11. WORK, INTERVIEWS, CRIMES, MINING, DEV, INNOVATION, COMPANIES
     ============================================================ */
  function applyForJob(jobId) {
    if (!guardAge16('Careers & Employment')) return;
    const job = JOBS_CATALOG.find(j => j.id === jobId);
    if (!job) return;
    const cool = (G.jobCooldownUntil && G.jobCooldownUntil[jobId]) || 0;
    if (cool > G.totalMonths) return showToast(`⏳ Re-apply cooldown: Wait ${cool - G.totalMonths} more months!`);
    if (G.stats.smarts < job.smartsReq) return showToast(`Need Smarts ${job.smartsReq}+ for ${job.title}!`);

    const qBank = [
      { q: `For "${job.title}", what builds lasting team trust?`, a: ['Accountability, punctuality & transparent reporting', 'Hiding mistakes', 'Ignoring safety checklists'], ok: 0 },
      { q: `When facing a tight deadline in ${job.sector}:`, a: ['Prioritize critical tasks cleanly & communicate early', 'Walk out mid-shift', 'Delete logs'], ok: 0 },
      { q: 'Workplace ethics compliance requires:', a: ['Following legal protocols & accurate records', 'Taking kickbacks', 'Bypassing inspections'], ok: 0 },
      { q: 'With an upset client, the best first move is:', a: ['Listen calmly & propose clear solutions', 'Argue loudly', 'Hang up'], ok: 0 }
    ].sort(() => Math.random() - 0.5).slice(0, 3);
    UI_STATE.quizFlow = { job, pool: qBank };
    openModal(`
      <h3 class="gold">💼 Interview: ${esc(job.title)}</h3>
      <div class="muted">Need ${getDiff().intvPass} correct answers to get hired (+1 bonus if Confidence ≥ 75).</div>
      ${qBank.map((q, i) => `
        <div style="margin:8px 0;">
          <strong>${i + 1}. ${esc(q.q)}</strong>
          <select id="iq_${i}">${q.a.map((op, oi) => `<option value="${oi}">${esc(op)}</option>`).join('')}</select>
        </div>
      `).join('')}
      <button class="btn btn-gold" onclick="LSW.gradeJobInterview()">Submit Interview</button>
      <button class="btn btn-dark" onclick="LSW.closeModal()">Cancel</button>
    `);
  }

  function gradeJobInterview() {
    const fl = UI_STATE.quizFlow;
    if (!fl) return;
    let score = fl.pool.reduce((s, q, i) => s + (Number($(`iq_${i}`).value) === q.ok ? 1 : 0), 0);
    if (G.confidence >= 75) score += 1;
    UI_STATE.quizFlow = null;
    closeModal();
    if (score >= getDiff().intvPass) {
      if (!G.hasHadFirstJob) {
        G.hasHadFirstJob = true;
        G.jobProgress = 0;
        G.job = fl.job;
        G.needs.work = 90;
        showToast(`🎉 Hired as ${fl.job.title}!`);
      } else {
        G.jobChangesThisMonth = (G.jobChangesThisMonth || 0) + 1;
        const drop = G.jobChangesThisMonth >= 2 ? 25 : 15;
        G.workStats.perf = clamp((G.workStats.perf || 0) - drop);
        G.stats.happy = clamp(G.stats.happy - 5);
        G.confidence = clamp((G.confidence || 0) - 5);
        G.jobProgress = 0;
        G.job = fl.job;
        G.needs.work = 90;
        const msg = G.jobChangesThisMonth >= 2
          ? 'Changing jobs again so soon hurts your reputation.'
          : 'You changed jobs. Work Performance -15. New jobs need time to learn.';
        showToast(msg);
        openModal(`<h3 class="warn">💼 Job Change Penalty</h3><div class="card-alt">${esc(msg)}<div class="muted" style="margin-top:4px;">Work Performance -${drop} · Happiness -5 · Confidence -5 · Progress reset to 0.</div></div><button class="btn btn-gold" onclick="LSW.closeModal()">OK</button>`);
      }
    } else {
      G.jobCooldownUntil[fl.job.id] = G.totalMonths + 6;
      showToast(`❌ Failed interview (Score ${score}). Wait 6 months to retry.`);
    }
    saveAll(); render();
  }

  function workHonestly() {
    if (!G.job || !guardTap('work_shift') || !useEnergy(14)) return;
    G.workStats.perf = clamp(G.workStats.perf + 6);
    G.workStats.integrity = clamp(G.workStats.integrity + 3);
    G.needs.work = clamp(G.needs.work + 20);
    G.jobProgress = clamp((G.jobProgress || 0) + 5);
    const bonus = Math.round(G.job.salary * 0.12 * getCountry().salIdx * getDiff().payMult * getEduSalaryMult());
    earnMoney(bonus, `Shift Bonus (${G.job.title})`);
    if (G.workStats.perf >= 80 && G.workStats.integrity >= 70 && Math.random() < 0.35) {
      G.workStats.promotions += 1;
      G.job = { ...G.job, salary: Math.round(G.job.salary * 1.15) };
      showToast(`🌟 Promoted! +15% Salary boost!`);
    } else showToast(`💼 Worked honestly: +6 Perf (+${fmt(bonus)})`);
    saveAll(); render();
  }

  function openWorkplaceCrimeModal() {
    if (!G.job) return;
    const crimes = G.job.crimes;
    openModal(`
      <h3 class="bad">🕵️ Workplace Crimes (${esc(G.job.title)})</h3>
      ${crimes.map((cr, ci) => `
        <div class="card-alt">
          <div class="between"><strong>${esc(cr.name)}</strong><span class="gold">${fmt(cr.gain[0])}–${fmt(cr.gain[1])}</span></div>
          <div class="muted">Caught Risk: ${cr.risk}% · Ethics -${cr.ethPenalty}</div>
          <button class="btn btn-danger btn-sm" style="margin-top:6px;" onclick="LSW.executeWorkplaceCrime(${ci})">Execute</button>
        </div>
      `).join('')}
      <button class="btn btn-dark" onclick="LSW.closeModal()">Cancel</button>
    `);
  }

  function executeWorkplaceCrime(ci) {
    if (!G.job || !guardTap('work_crime') || !useEnergy(15)) return;
    const cr = G.job.crimes[ci];
    closeModal();
    if (Math.random() * 100 < cr.risk) {
      G.workStats.crimesCaught += 1;
      G.workStats.integrity = clamp(G.workStats.integrity - 25);
      G.policeHeat = clamp(G.policeHeat + 30);
      G.job = null;
      G.jail.pendingCase = { charge: `Workplace Fraud: ${cr.name}`, years: 2, fine: 12000 };
      showToast('🚨 Caught! Fired & Facing Court Trial!');
    } else {
      G.workStats.crimesHidden += 1;
      G.workStats.ethics = clamp(G.workStats.ethics - cr.ethPenalty);
      const gain = rand(cr.gain[0], cr.gain[1]);
      earnMoney(gain, `Hidden: ${cr.name}`);
      showToast(`🤫 Pulled off ${cr.name}: +${fmt(gain)}`);
    }
    saveAll(); render();
  }

  function openSocializeCoworkersModal() {
    if (!guardTap('work_socialize') || !useEnergy(8)) return;
    G.stats.happy = clamp(G.stats.happy + 6);
    G.workStats.perf = clamp(G.workStats.perf + 3);
    G.needs.social = clamp(G.needs.social + 15);
    showToast('☕ Grabbed coffee with coworkers: +6 Happy, +3 Perf');
    saveAll(); render();
  }

  function miningAdvanceStep() {
    if (!guardAge16('Mining Ops') || !guardTap('mining_step') || !useEnergy(12) || !claimMajorStep('Mining Process Step')) return;
    G.mining.stepIdx += 1;
    if (G.mining.stepIdx >= 7) {
      G.mining.stepIdx = 0; G.mining.oreCount += 1;
      const pay = Math.round(MINING_SECTORS[G.mining.sectorIdx].basePay * getCountry().salIdx * getDiff().payMult);
      earnMoney(pay, `Ore Export (${MINING_SECTORS[G.mining.sectorIdx].name})`);
      showToast(`⛏️ Ore Batch Exported! +${fmt(pay)}`);
    } else showToast(`⛏️ ${MINING_STEPS[G.mining.stepIdx - 1]} complete!`);
    saveAll(); render();
  }

  function doMiningEquipDrill(minId) {
    if (!guardAge16('Mining Drills')) return;
    if (!guardTap(`mining_drill_${minId}`)) return;
    if (G.mining.equipLeft <= 0) return showToast('No drills remaining this month!');
    if (!useEnergy(14)) return;
    const mn = MINING_ALL_MINERALS.find(x => x.id === minId);
    if (!mn) return;
    G.mining.equipLeft -= 1;
    const zarEq = Math.round((mn.usdPrice / 0.055) * (mn.usdPrice < 50 ? 250 : 2.5) * getDiff().payMult);
    earnMoney(zarEq, `Drilled ${mn.name}`);
    showToast(`⛏️ Drilled ${mn.name}: +${fmt(zarEq)} (${G.mining.equipLeft} left)`);
    saveAll(); render();
  }

  function devAdvanceStep() {
    if (!guardAge16('Developer Studio') || !guardTap('dev_step') || !useEnergy(12) || !claimMajorStep('Dev Studio Sprint')) return;
    G.devStudio.stepIdx += 1;
    if (G.devStudio.stepIdx >= 7) {
      G.devStudio.stepIdx = 0; G.devStudio.shipped += 1;
      const rev = Math.round(DEV_DEPTS[G.devStudio.deptIdx].baseRev * 0.45 * getDiff().payMult);
      G.devStudio.revenueMonthly += rev;
      earnMoney(DEV_DEPTS[G.devStudio.deptIdx].baseRev * 2, `Shipped ${DEV_DEPTS[G.devStudio.deptIdx].name}`);
      showToast(`🚀 App Shipped! Passive monthly revenue +${fmt(rev)}/mo`);
    } else showToast(`💻 ${DEV_STEPS[G.devStudio.stepIdx - 1]} done!`);
    saveAll(); render();
  }

  /* ---- SECTION 15: 10-DEPARTMENT INNOVATION SYSTEM ---- */
  function setInnoDept(deptId) {
    if (!G || !G.innovation) return;
    G.innovation.selectedDeptId = deptId;
    saveAll(); render();
  }

  function startInnoIdea(deptId, ideaIdx) {
    if (!G) return;
    if (G.age < 13) return showToast('🔬 Youth Innovation Research unlocks at Age 13! Study in Education first.');
    const dept = INNOVATION_DEPARTMENTS.find(d => d.id === deptId);
    const idea = dept && dept.ideas[ideaIdx];
    if (!dept || !idea) return;
    if (!G.innovation) G.innovation = { patents: 0, activeIdeas: [], history: [], selectedDeptId: deptId };
    if ((G.innovation.activeIdeas || []).length >= 3) {
      return showToast('⚠️ Max 3 Active Innovation Ideas at once! Finish or Abandon one first.');
    }
    const missing = Object.entries(dept.reqStats || {}).filter(([sk, req]) => (G.stats[sk] || 0) < req);
    if (missing.length) {
      return showToast(`Need ${missing.map(([sk, req]) => `${sk[0].toUpperCase() + sk.slice(1)} ${req}+`).join(' & ')} for ${dept.name}!`);
    }
    const c = getCountry();
    const startCost = Math.round(dept.baseCost * c.costMult * 0.35);
    if (G.age >= 18 && !chargeMoney(startCost, `Innovation R&D: ${idea.name}`)) return;
    const totalSteps = idea.diff === 'Hard' ? 6 : idea.diff === 'Medium' ? 4 : 3;
    G.innovation.activeIdeas.push({
      uid: 'inno_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      deptId: dept.id,
      deptName: dept.name,
      icon: dept.icon,
      name: idea.name,
      type: idea.type,
      diff: idea.diff,
      pot: idea.pot,
      payout: idea.payout,
      step: 0,
      totalSteps,
      startedAge: G.age,
      countryId: c.id
    });
    showToast(`🔬 Started Innovation: ${idea.name} (${getEducationSpeedMult()}x Edu Speed)!`);
    saveAll(); render();
  }

  function advanceInnoIdea(uid) {
    if (!G || !G.innovation) return;
    const idx = (G.innovation.activeIdeas || []).findIndex(x => x.uid === uid);
    if (idx < 0) return;
    const idea = G.innovation.activeIdeas[idx];
    const speed = getEducationSpeedMult();
    const nextStep = idea.step + speed;
    if (idea.deptId === 'med' && G.age < 18 && nextStep >= idea.totalSteps) {
      return showToast('🩺 Medical Prototype Ready! Patent & Public Launch unlock at Age 18+ (Research-only under 18).');
    }
    if (!guardTap(`inno_advance_${uid}`) || !useEnergy(10) || !claimMajorStep(`Innovation: ${idea.name}`)) return;
    idea.step = nextStep;
    G.innovationScore = clamp((G.innovationScore || 0) + 4);
    const c = getCountry();
    const dept = INNOVATION_DEPARTMENTS.find(d => d.id === idea.deptId) || INNOVATION_DEPARTMENTS[0];
    if (idea.step >= idea.totalSteps) {
      G.innovation.activeIdeas.splice(idx, 1);
      let mult = getDiff().payMult;
      if (dept.bonusCountries.includes(c.id)) mult *= 1.2;
      if ((G.edu && G.edu.advancedCourses || []).some(ac => ac === `adv_${idea.deptId}` || (idea.deptId === 'tech' && ['adv_ai', 'adv_cyber'].includes(ac)) || (idea.deptId === 'energy' && ac === 'adv_solar') || (idea.deptId === 'fin' && ac === 'adv_biz') || (idea.deptId === 'eng' && ac === 'adv_pm') || (idea.deptId === 'med' && ac === 'adv_nurse') || (idea.deptId === 'edu' && ac === 'adv_teach'))) {
        mult *= 1.25;
      }
      const isYoutubeMinor = idea.name === 'YouTube Channel' && G.age < 18;
      const finalCash = isYoutubeMinor ? 0 : Math.round(idea.payout * mult);
      if (finalCash > 0) earnMoney(finalCash, `Launched ${idea.name} (${dept.name})`);
      if (idea.deptId === 'social') {
        G.stats.morality = clamp((G.stats.morality || 50) + 12);
        G.stats.happy = clamp(G.stats.happy + 12);
        G.stats.fame = clamp((G.stats.fame || 0) + 10);
        G.communityRespect = clamp((G.communityRespect || 50) + 18);
      }
      if (G.age >= 18) G.innovation.patents = (G.innovation.patents || 0) + 1;
      G.innovation.history.unshift({
        name: idea.name, deptName: dept.name, icon: dept.icon,
        outcome: isYoutubeMinor ? 'Hobby Creator (<18)' : 'Launched',
        age: G.age, cash: finalCash
      });
      if (G.innovation.history.length > 30) G.innovation.history.pop();
      celebratePopup(
        isYoutubeMinor ? '🎬 YouTube Hobby Hit!' : `🚀 Launched: ${idea.name}!`,
        isYoutubeMinor
          ? `<p>Created <strong>YouTube Channel</strong> as a hobby (+Happiness & Creativity). Monetization unlocks at Age 18+!</p>`
          : `<p><strong>${esc(idea.name)}</strong> (${esc(dept.name)}) succeeded in ${esc(c.name)}! Earned <strong class="gold">${fmt(finalCash)}</strong>${idea.deptId === 'social' ? ' + Huge Morality, Happiness, Fame & Community Respect!' : ''}</p>`
      );
    } else {
      showToast(`🔬 ${idea.name}: ${Math.min(idea.totalSteps, idea.step)} of ${idea.totalSteps} (${speed}x Edu Speed)`);
    }
    saveAll(); render();
  }

  function abandonInnoIdea(uid) {
    if (!G || !G.innovation) return;
    const idx = (G.innovation.activeIdeas || []).findIndex(x => x.uid === uid);
    if (idx < 0) return;
    const [rem] = G.innovation.activeIdeas.splice(idx, 1);
    G.stats.discipline = clamp((G.stats.discipline || 50) + 1);
    G.innovation.history.unshift({ name: rem.name, deptName: rem.deptName, icon: rem.icon, outcome: 'Abandoned (+1 Discipline)', age: G.age, cash: 0 });
    showToast(`🗂️ Abandoned ${rem.name}. Learned focus: +1 Discipline!`);
    saveAll(); render();
  }

  function foundOrBuyCompany(name, startZar, estProf) {
    if (!guardAge16('Companies & CEO')) return;
    if (G.company) return showToast('Already CEO of a company! Sell current company first.');
    if (!claimMajorStep(`Found Company: ${name}`)) return;
    if (!payViaWire(startZar, `Found ${name}`, UI_STATE.compCountryId || G.countryId)) {
      G.majorStepUsedThisMonth = null;
      return;
    }
    G.company = { name, type: name, valuation: Math.round(startZar * 1.4), baseRev: estProf, branches: 1, staff: [] };
    G.businessScore = clamp((G.businessScore || 0) + 12);
    celebratePopup('🏢 Company Founded!', `<p>You are now CEO of <strong>${esc(name)}</strong>!</p>`);
    saveAll(); render();
  }

  function openHireApplicantsModal() {
    if (!G.company) return;
    const apps = Array.from({ length: 4 }, (_, i) => ({
      id: 'app_' + Date.now() + '_' + i,
      name: `${pick(getCountry().firstM)} ${pick(getCountry().surnames)}`,
      dept: pick(['Operations', 'Engineering', 'Sales', 'Finance']),
      perf: rand(65, 96),
      salary: rand(2200, 5600)
    }));
    UI_STATE.tempApps = apps;
    openModal(`
      <h3 class="gold">👔 Job Applicants</h3>
      ${apps.map((a, i) => `
        <div class="card-alt between">
          <div><strong>${esc(a.name)}</strong> (${a.dept})<div class="muted">Perf ${a.perf}% · ${fmt(a.salary)}/mo</div></div>
          <button class="btn btn-gold btn-sm" onclick="LSW.signHiredApp(${i})">Hire</button>
        </div>
      `).join('')}
      <button class="btn btn-dark" onclick="LSW.closeModal()">Close</button>
    `);
  }

  function signHiredApp(i) {
    const a = UI_STATE.tempApps && UI_STATE.tempApps[i];
    if (!a || !G.company) return;
    G.company.staff.push({ id: a.id, name: a.name, dept: a.dept, perf: a.perf, salary: a.salary, morale: 85, warned: 0, suspended: false });
    G.company.baseRev += Math.round(a.salary * 1.6);
    closeModal();
    showToast(`👔 Hired ${a.name}!`);
    saveAll(); render();
  }

  function staffAction(id, op) {
    if (!G.company) return;
    const s = G.company.staff.find(x => x.id === id);
    if (!s) return;
    if (op === 'fire') { G.company.staff = G.company.staff.filter(x => x.id !== id); G.company.baseRev = Math.max(2000, G.company.baseRev - s.salary); }
    else if (op === 'promote') { s.salary = Math.round(s.salary * 1.15); s.morale = clamp(s.morale + 12); }
    else if (op === 'bonus' && chargeMoney(1000, `Bonus: ${s.name}`)) s.morale = clamp(s.morale + 15);
    else if (op === 'warn') { s.warned += 1; s.morale = clamp(s.morale - 15); }
    saveAll(); render();
  }

  function createCompanyProduct() {
    if (!G.company) return;
    if (!claimMajorStep('Company Product Launch')) return;
    if (!chargeMoney(5000, 'Product R&D Launch')) {
      G.majorStepUsedThisMonth = null;
      return;
    }
    G.company.baseRev += 4800;
    G.company.valuation += 42000;
    showToast(`📦 Launched new Product! Valuation ${fmt(G.company.valuation)}`);
    saveAll(); render();
  }

  /* ============================================================
     12. PEOPLE, COUNTRY EDUCATION SYSTEM, CERTS, CRIME & MENU OPS
     ============================================================ */
  function playPreschoolAction(kind) {
    if (!G || !G.edu) return;
    if (G.age < 3 || G.age > 5) return showToast('Preschool actions are for Ages 3–5!');
    if (!guardTap(`edu_pre_${kind}`) || !useEnergy(6)) return;
    G.edu.preschoolDone = true;
    G.edu.progress = clamp((G.edu.progress || 0) + 50);
    G.stats.smarts = clamp(G.stats.smarts + 1);
    G.stats.creativity = clamp((G.stats.creativity || 50) + 1);
    G.stats.happy = clamp(G.stats.happy + 4);
    showToast(kind === 'books' ? '📖 Read Picture Books! +1 Smarts, +1 Creativity' : '🧸 Play + Learn! +1 Smarts, +1 Creativity');
    saveAll(); render();
  }

  function studyEducation() {
    if (!G || !G.edu) return;
    if (G.age < 3) return showToast('Age 0–2 is Home Care. Preschool begins at Age 3!');
    if (!guardTap('edu_study') || !useEnergy(8)) return;
    G.edu.progress = clamp((G.edu.progress || 0) + 25);
    G.stats.smarts = clamp(G.stats.smarts + 2);
    G.stats.discipline = clamp((G.stats.discipline || 50) + 1);
    G.school.gradePct = clamp((G.school.gradePct || 75) + 4);
    G.needs.learning = clamp((G.needs.learning || 75) + 15);
    showToast(`📖 Studied! Progress ${G.edu.progress}% · +2 Smarts · +1 Discipline`);
    saveAll(); render();
  }

  function doAssignment() {
    if (!G || !G.edu) return;
    if (G.age < 6) return showToast('Assignments begin in Primary School (Age 6+)!');
    if (!guardTap('edu_assign') || !useEnergy(8)) return;
    G.edu.progress = clamp((G.edu.progress || 0) + 25);
    G.stats.discipline = clamp((G.stats.discipline || 50) + 1);
    G.stats.smarts = clamp(G.stats.smarts + 1);
    G.needs.learning = clamp((G.needs.learning || 75) + 12);
    showToast(`✍️ Assignment done! Progress ${G.edu.progress}% · +1 Discipline`);
    saveAll(); render();
  }

  function takeEducationExam() {
    if (!G || !G.edu) return;
    const e = G.edu;
    const c = getCountry();
    const ce = getCountryEdu(c.id);
    if (!['preschool', 'primary', 'junior', 'senior'].includes(e.stage)) {
      return showToast('Enroll in a School/TVET/University program to take its exam!');
    }
    if ((e.progress || 0) < 100) {
      return showToast(`Reach 100% Term Progress first (Currently ${e.progress || 0}%) via Study / Assignment!`);
    }
    const isFinalSenior = e.stage === 'senior' && e.yearInStage >= ce.seniorYears;
    if (isFinalSenior && (e.rewritesThisYear || 0) >= 1 && (G.stats.smarts < 60 || (G.stats.discipline || 0) < 50)) {
      return showToast('📝 Already used your 1 rewrite this year. Study & advance to next year!');
    }
    if (!claimMajorStep(`Education Exam (${ce.finalExamName})`)) return;

    if (e.stage === 'preschool') {
      e.preschoolDone = true;
      e.progress = 0;
      e.completedHistory.push(`${ce.preschoolName} (${c.name})`);
      showToast(`🎉 Passed ${ce.preschoolName}! Ready for ${ce.primaryName} at Age 6!`);
    } else if (e.stage === 'primary') {
      if (G.stats.smarts < 20) {
        e.progress = 30;
        showToast('❌ Failed Primary year (Need Smarts 20+). Repeat year!');
      } else if (e.yearInStage < ce.primaryYears) {
        e.yearInStage += 1; e.progress = 0;
        showToast(`✅ Passed Primary Year ${e.yearInStage - 1}! Now Year ${e.yearInStage}.`);
      } else {
        e.completedHistory.push(`${ce.primaryName} (${c.name})`);
        e.stage = 'junior'; e.yearInStage = 1; e.progress = 0;
        G.school.stage = ce.juniorName;
        celebratePopup(`🎓 ${ce.primaryName} Complete!`, `<p>Welcome to <strong>${esc(ce.juniorName)}</strong>! Pick 1 Elective (Art, Music, Sport, Coding, Agriculture).</p>`);
      }
    } else if (e.stage === 'junior') {
      if (G.stats.smarts < 32) {
        e.progress = 35;
        showToast('❌ Failed Junior Secondary year (Need Smarts 32+). Repeat!');
      } else if (e.yearInStage < ce.juniorYears) {
        e.yearInStage += 1; e.progress = 0;
        showToast(`✅ Promoted to Junior Year ${e.yearInStage}!`);
      } else {
        e.completedHistory.push(`${ce.juniorName} (${e.juniorElective} Elective)`);
        e.stage = 'senior'; e.yearInStage = 1; e.progress = 0;
        G.school.stage = ce.seniorName;
        celebratePopup(`🎓 ${ce.juniorName} Complete!`, `<p>You can now advance to <strong>${esc(ce.seniorName)}</strong> (pick 3 Electives) OR enroll in <strong>${esc(ce.tvetName)}</strong>!</p>`);
      }
    } else if (e.stage === 'senior') {
      if (e.yearInStage < ce.seniorYears) {
        if (G.stats.smarts < 42) {
          e.progress = 40;
          showToast('❌ Repeat year — build Smarts to 42+ first!');
        } else {
          e.yearInStage += 1; e.progress = 0;
          showToast(`✅ Promoted to Senior Year ${e.yearInStage}!`);
        }
      } else {
        if (G.stats.smarts >= 60 && (G.stats.discipline || 0) >= 50) {
          e.hsCertified = true;
          e.hsCertName = `High School Certificate - ${c.schoolSystem}`;
          e.stage = 'graduated';
          e.progress = 0;
          G.phases.examPassed = true;
          G.school.stage = 'Graduated';
          e.completedHistory.push(`${ce.finalExamName} (${e.hsCertName})`);
          recordMemory(`Graduated ${ce.finalExamName}`, `Completed High School in ${G.city} (${c.schoolSystem}). Parents smiled with pride.`);
          saveAll();
          showSlowMoment(`🎓 Passed ${ce.finalExamName}!`, `You earned your ${e.hsCertName}. Your family gathered around to celebrate years of hard work.`);
          return;
        } else {
          e.rewritesThisYear = (e.rewritesThisYear || 0) + 1;
          e.progress = 40;
          showToast(`❌ Failed ${ce.finalExamName} (Need Smarts 60+ & Discipline 50+). 1 rewrite allowed per year.`);
        }
      }
    }
    saveAll(); render();
  }

  function attemptDropOut() {
    if (!G || !G.edu) return;
    const c = getCountry();
    if (G.age < 16) {
      openModal(`
        <h3 class="warn">⛔ Compulsory Schooling Active</h3>
        <div class="card-alt"><strong>School is compulsory until 16 in ${esc(c.name)}.</strong><div class="muted" style="margin-top:4px;">You must finish school first. Work unlocks at 16.</div></div>
        <button class="btn btn-gold" onclick="LSW.closeModal()">Back to School</button>
      `);
      return;
    }
    G.edu.stage = 'graduated';
    G.edu.progress = 0;
    G.school.stage = 'Left School (16+)';
    showToast('📚 Left High School. You can still pursue TVET, Online Courses, or Adult Work!');
    saveAll(); render();
  }

  function setJuniorElective(el) {
    if (!G || !G.edu) return;
    G.edu.juniorElective = el;
    showToast(`🎯 Junior Elective set to ${el}!`);
    saveAll(); render();
  }

  function toggleSeniorElective(el) {
    if (!G || !G.edu) return;
    const arr = G.edu.seniorElectives || [];
    const idx = arr.indexOf(el);
    if (idx >= 0) {
      if (arr.length <= 1) return showToast('Keep at least 1 elective!');
      arr.splice(idx, 1);
    } else {
      if (arr.length >= 3) arr.shift();
      arr.push(el);
    }
    G.edu.seniorElectives = arr;
    saveAll(); render();
  }

  function enrollTvet(tradeId) {
    if (!G || !G.edu) return;
    const e = G.edu;
    if (!['senior', 'graduated', 'tvet'].includes(e.stage) && G.age < 15) {
      return showToast('🔒 TVET unlocks after Junior Secondary (Grade 9) / Age 15+!');
    }
    const tr = TVET_TRADES.find(x => x.id === tradeId);
    if (!tr) return;
    if ((e.tvet.completedTrades || []).includes(tradeId)) return showToast('Already certified in this Trade!');
    if (G.stats.smarts < tr.reqSmarts || (G.stats[tr.reqStat] || 0) < tr.reqVal) {
      return showToast(`Need Smarts ${tr.reqSmarts}+ & ${tr.reqStat} ${tr.reqVal}+ for ${tr.name}!`);
    }
    const cost = Math.round(tr.cost * getCountry().costMult);
    if (!chargeMoney(cost, `TVET Tuition: ${tr.name}`)) return;
    e.tvet.activeTrade = tradeId;
    e.tvet.level = 1;
    e.stage = 'tvet';
    e.progress = 0;
    G.school.stage = `${getCountryEdu().tvetName}: ${tr.name}`;
    showToast(`🔧 Enrolled in TVET ${tr.name} (Level 1)!`);
    saveAll(); render();
  }

  function advanceTvetLevel() {
    if (!G || !G.edu || !G.edu.tvet.activeTrade) return;
    const e = G.edu;
    if ((e.progress || 0) < 100) return showToast(`Study & Practice to 100% first (Now ${e.progress || 0}%)!`);
    if (!claimMajorStep('TVET Level Assessment')) return;
    const tr = TVET_TRADES.find(x => x.id === e.tvet.activeTrade);
    if (e.tvet.level < 3) {
      e.tvet.level += 1;
      e.progress = 0;
      const lbls = ['', 'Theory', 'Practical Workshop', 'Apprenticeship'];
      showToast(`🔧 Passed! Advanced to Level ${e.tvet.level} (${lbls[e.tvet.level]})!`);
    } else {
      e.tvet.completedTrades.push(tr.id);
      e.completedHistory.push(`TVET Trade Certificate: ${tr.name}`);
      e.tvet.activeTrade = null;
      e.tvet.level = 0;
      e.stage = 'graduated';
      e.progress = 0;
      recordMemory(`TVET Certified: ${tr.name}`, `Completed Theory, Practical Workshop, and Apprenticeship in ${G.city}.`);
      saveAll();
      showSlowMoment(`🔧 TVET Certified: ${tr.name}!`, `You earned your ${tr.name} Trade Certificate after finishing your apprenticeship.`);
      return;
    }
    saveAll(); render();
  }

  function enrollUni(degId) {
    if (!G || !G.edu) return;
    const e = G.edu;
    if (G.age < 18) return showToast('🔒 University unlocks at Age 18+!');
    if (!e.hsCertified) return showToast(`🔒 Pass your High School Final Exam (${getCountryEdu().finalExamName}) first!`);
    const dg = UNI_DEGREES.find(x => x.id === degId);
    if (!dg) return;
    if ((e.uni.completedDegrees || []).includes(degId)) return showToast('Already hold this Degree!');
    if (G.stats.smarts < dg.reqSmarts || (G.stats[dg.reqStat] || 0) < dg.reqStatVal) {
      return showToast(`Need Smarts ${dg.reqSmarts}+ & ${dg.reqStat} ${dg.reqStatVal}+ for ${dg.name}!`);
    }
    const yrCost = Math.round(dg.costYr * getCountry().costMult);
    if (!chargeMoney(yrCost, `University Year 1: ${dg.name}`)) return;
    e.uni.activeDegree = degId;
    e.uni.year = 1;
    e.uni.totalYears = dg.years;
    e.stage = 'university';
    e.progress = 0;
    G.school.stage = `University (${dg.name})`;
    showToast(`🎓 Enrolled in ${dg.name} (${dg.years} Years)! Research speed is now 2x!`);
    saveAll(); render();
  }

  function advanceUniYear() {
    if (!G || !G.edu || !G.edu.uni.activeDegree) return;
    const e = G.edu;
    if ((e.progress || 0) < 100) return showToast(`Reach 100% Semester Progress first (Currently ${e.progress || 0}%)!`);
    const dg = UNI_DEGREES.find(x => x.id === e.uni.activeDegree);
    if (!claimMajorStep(`University Exam (${dg.name})`)) return;
    if (e.uni.year < e.uni.totalYears) {
      const nextYrCost = Math.round(dg.costYr * getCountry().costMult);
      if (!chargeMoney(nextYrCost, `University Year ${e.uni.year + 1}: ${dg.name}`)) {
        G.majorStepUsedThisMonth = null;
        return;
      }
      e.uni.year += 1;
      e.progress = 0;
      showToast(`🎓 Passed Year ${e.uni.year - 1}! Now Year ${e.uni.year} (${dg.name}).`);
    } else {
      e.uni.completedDegrees.push(dg.id);
      e.completedHistory.push(`University Degree: ${dg.name} (${getCountry().name})`);
      e.uni.activeDegree = null;
      e.uni.year = 0;
      e.stage = 'graduated';
      e.progress = 0;
      recordMemory(`Graduated: ${dg.name}`, `Walked the university stage in ${G.city} with your ${dg.name} degree.`);
      saveAll();
      showSlowMoment(`🎓 University Graduate!`, `You stood in cap and gown holding your ${dg.name} degree. Your family cheered as your name was called.`);
      return;
    }
    saveAll(); render();
  }

  function startOnlineCourse(ocId) {
    if (!G || !G.edu) return;
    if (G.age < 13) return showToast('🔒 Online Short Courses unlock at Age 13+!');
    const oc = ONLINE_SHORT_COURSES.find(x => x.id === ocId);
    if (!oc) return;
    const ac = G.edu.onlineCourses;
    if (ac.completed.includes(ocId) || ac.active.some(x => x.id === ocId)) return showToast('Already completed or active!');
    if (ac.active.length >= 2) return showToast('Max 2 active Online Courses at once!');
    const poor = G.wealthTier === 'poor' || calcNetWorth() < 15000;
    const gotSchol = poor && Math.random() < 0.30;
    const fee = gotSchol ? 0 : Math.round(oc.cost * getCountry().costMult);
    if (fee > 0 && !chargeMoney(fee, `Online Course: ${oc.name}`)) return;
    ac.active.push({ id: oc.id, name: oc.name, step: 0, total: oc.weeks });
    showToast(gotSchol ? `🌟 Free Scholarship Awarded! Enrolled in ${oc.name}!` : `💻 Enrolled in ${oc.name} (${fmt(fee)})!`);
    saveAll(); render();
  }

  function stepOnlineCourse(ocId) {
    if (!G || !G.edu || !guardTap(`online_step_${ocId}`) || !useEnergy(6)) return;
    const ac = G.edu.onlineCourses;
    const idx = ac.active.findIndex(x => x.id === ocId);
    if (idx < 0) return;
    const item = ac.active[idx];
    const oc = ONLINE_SHORT_COURSES.find(x => x.id === ocId);
    item.step += 1;
    if (item.step >= item.total) {
      ac.active.splice(idx, 1);
      ac.completed.push(ocId);
      G.edu.completedHistory.push(`Online Short Course: ${oc.name}`);
      G.stats[oc.stat] = clamp((G.stats[oc.stat] || 50) + oc.boost);
      showToast(`🏅 Completed ${oc.name}! +${oc.boost} ${oc.stat}!`);
    } else {
      showToast(`💻 ${oc.name}: Week ${item.step} complete`);
    }
    saveAll(); render();
  }

  function takeAdvancedProgram(advId) {
    if (!G || !G.edu) return;
    if (G.age < 16) return showToast('🔒 Advanced Programs unlock at Age 16+!');
    if (!G.edu.hsCertified && !(G.edu.tvet.completedTrades || []).length) {
      return showToast('🔒 Requires High School Certificate or TVET Certificate first!');
    }
    const adv = ADVANCED_PROGRAMS.find(x => x.id === advId);
    if (!adv) return;
    if (G.edu.advancedCourses.includes(advId)) return showToast('Already earned!');
    if (G.stats.smarts < adv.reqSmarts) return showToast(`Need Smarts ${adv.reqSmarts}+!`);
    const fee = Math.round(adv.cost * getCountry().costMult);
    if (!chargeMoney(fee, `Advanced: ${adv.name}`)) return;
    G.edu.advancedCourses.push(advId);
    G.edu.completedHistory.push(`Advanced Certificate: ${adv.name}`);
    G.stats.smarts = clamp(G.stats.smarts + 4);
    celebratePopup(`📜 Advanced Certificate!`, `<p>Earned <strong>${esc(adv.name)}</strong>! +4 Smarts & +25% ${esc(adv.innoBoost.toUpperCase())} Innovation payout!</p>`);
    saveAll(); render();
  }

  function readLibraryBook() {
    if (!G || !G.edu) return;
    if (G.age < 6) return showToast('Library self-study unlocks at Age 6!');
    if (!guardTap('edu_library') || !useEnergy(6)) return;
    G.edu.booksRead = (G.edu.booksRead || 0) + 1;
    G.stats.smarts = clamp(G.stats.smarts + 1);
    G.needs.learning = clamp((G.needs.learning || 75) + 10);
    if (G.edu.booksRead >= 10 && !G.edu.bookworm) {
      G.edu.bookworm = true;
      G.stats.smarts = clamp(G.stats.smarts + 3);
      G.edu.completedHistory.push('Badge: Bookworm (10 Library Books)');
      celebratePopup('📚 Bookworm Badge Unlocked!', '<p>You read 10 Library Books! Earned <strong>"Bookworm" Badge</strong> + <strong>+3 Bonus Smarts</strong>!</p>');
    } else {
      showToast(`📚 Read Library Book #${G.edu.booksRead}! +1 Smarts (${Math.max(0, 10 - G.edu.booksRead)} left for Bookworm)`);
    }
    saveAll(); render();
  }

  function takeTutoring(isFree) {
    if (!G || !G.edu) return;
    if (G.age < 6) return showToast('Tutoring starts at Age 6!');
    if (G.edu.tutoredThisMonth) return showToast('1 Tutoring session per month max!');
    if (!guardTap('edu_tutor')) return;
    if (isFree) {
      if ((G.stats.morality || 0) < 50) return showToast('Free Community Mentor requires Morality 50+!');
      G.edu.tutoredThisMonth = true;
      if (Math.random() < 0.30) {
        G.stats.smarts = clamp(G.stats.smarts + 3);
        G.edu.progress = clamp((G.edu.progress || 0) + 15);
        showToast('🤝 Free Mentor accepted! +3 Smarts & +15% Progress!');
      } else {
        showToast('🙏 Free Mentor slots full this month — try again next month!');
      }
    } else {
      const fee = Math.round(450 * getCountry().costMult);
      if (!chargeMoney(fee, 'Private Tutoring')) return;
      G.edu.tutoredThisMonth = true;
      G.stats.smarts = clamp(G.stats.smarts + 3);
      G.edu.progress = clamp((G.edu.progress || 0) + 15);
      showToast('👨‍🏫 Private Tutoring complete: +3 Smarts & +15% Progress!');
    }
    saveAll(); render();
  }

  function openCertQuizModal(certId) {
    if (!guardAge16('Adult Courses & Certificates')) return;
    const cert = COURSES_AND_CERTS.find(c => c.id === certId);
    if (!cert) return;
    if (G.certs.includes(cert.id)) return showToast('Already certified!');
    if (G.stats.smarts < cert.smartsReq) return showToast(`Need Smarts ${cert.smartsReq}+!`);
    if (!chargeMoney(cert.cost, `Tuition: ${cert.name}`)) return;
    const pool = [...cert.qs].sort(() => Math.random() - 0.5).slice(0, 3);
    UI_STATE.quizFlow = { cert, pool };
    openModal(`
      <h3 class="gold">📝 ${esc(cert.name)}</h3>
      <div class="muted">Need ${getDiff().examPass} correct answers to pass:</div>
      ${pool.map((q, i) => `<div style="margin:8px 0;"><strong>${i + 1}. ${esc(q.q)}</strong><select id="cq_${i}">${q.a.map((o, oi) => `<option value="${oi}">${esc(o)}</option>`).join('')}</select></div>`).join('')}
      <button class="btn btn-gold" onclick="LSW.gradeCertQuiz()">Submit Exam</button>
    `);
  }

  function gradeCertQuiz() {
    const fl = UI_STATE.quizFlow;
    if (!fl) return;
    const score = fl.pool.reduce((s, q, i) => s + (Number($(`cq_${i}`).value) === q.ok ? 1 : 0), 0);
    UI_STATE.quizFlow = null;
    closeModal();
    if (score >= getDiff().examPass) {
      G.certs.push(fl.cert.id);
      G.stats.smarts = clamp(G.stats.smarts + 10);
      G.needs.learning = 100;
      celebratePopup('🎓 Certificate Earned!', `<p>Passed <strong>${esc(fl.cert.name)}</strong> (Score ${score})! +10 Smarts.</p>`);
    } else showToast(`Scored ${score} (Need ${getDiff().examPass}). Study more & retry!`);
    saveAll(); render();
  }

  function makeNewFriend(cat) {
    if (!guardTap('make_friend') || !useEnergy(5)) return;
    if (Math.random() < 0.72) {
      const npc = genNpc(G.countryId, null, cat);
      G.npcs.unshift(npc);
      G.needs.social = clamp(G.needs.social + 15);
      showToast(`🤝 Met ${npc.name} (${cat})!`);
    } else showToast('No one clicked today — try again!');
    saveAll(); render();
  }

  function friendAction(id, op) {
    const n = G.npcs.find(x => x.id === id);
    if (!n || !guardTap(`friend_${op}_${id}`)) return;
    if (op === 'talk' || op === 'play') { n.bond = clamp(n.bond + 7); G.needs.social = clamp(G.needs.social + 12); showToast(`Spent time with ${n.name}! Bond ${n.bond}%`); }
    else if (op === 'study') { n.bond = clamp(n.bond + 5); G.stats.smarts = clamp(G.stats.smarts + 3); showToast(`Studied with ${n.name}: +3 Smarts`); }
    else if (op === 'gift' && chargeMoney(400, `Gift ${n.name}`)) { n.bond = clamp(n.bond + 14); showToast(`🎁 Gifted ${n.name}: Bond ${n.bond}%`); }
    else if (op === 'borrow') {
      if (n.bond < 60) return showToast('Need 60%+ Bond to borrow money!');
      earnMoney(1200, `Loan from ${n.name}`); n.bond = clamp(n.bond - 8);
    } else if (op === 'best') {
      if (n.bond < 60) return showToast('Raise Bond to 60%+ first!');
      G.bestFriendId = n.id; G.confidence = clamp(G.confidence + 10);
      showToast(`⭐ ${n.name} is now your Best Friend (+10 Confidence)!`);
    }
    saveAll(); render();
  }

  function proposeMarriage(npcId) {
    openWeddingModal(npcId);
  }

  function familyRelAction(kind, id, op) {
    if (!guardTap(`family_${kind}_${op}_${id}`)) return;
    if (kind === 'spouse' && G.partner) {
      if (op === 'divorce') { G.partner = null; showToast('💔 Divorced.'); }
      else if (op === 'gift' && chargeMoney(500, 'Spouse Gift')) { G.partner.bond = clamp(G.partner.bond + 12); }
      else { G.partner.bond = clamp(G.partner.bond + 6); G.needs.social = clamp(G.needs.social + 10); }
    } else if (kind === 'child' && G.children[id]) {
      G.children[id].bond = clamp((G.children[id].bond || 75) + 8);
      if (op === 'allow') chargeMoney(300, 'Child Allowance');
      showToast(`Spent quality time with ${G.children[id].name}!`);
    } else if (kind === 'sibling') {
      const sb = G.parents.siblings.find(x => x.id === id);
      if (sb) sb.bond = clamp(sb.bond + (op === 'fight' ? -10 : 8));
    } else if (kind === 'extended') {
      const ex = G.parents.extended.find(x => x.id === id);
      if (ex) { ex.bond = clamp(ex.bond + 6); if (op === 'help' && ex.bond >= 70) earnMoney(800, `Help from ${ex.name}`); }
    }
    saveAll(); render();
  }

  function openPocketMoneyDisclaimer(who) {
    if (G.pocketMoneyAskedYear === G.year) return showToast(`Already asked ${G.pocketMoneyAskedFrom} this year!`);
    const p = G.parents[who];
    if (!p) return;
    G.pocketMoneyAskedYear = G.year;
    G.pocketMoneyAskedFrom = p.name;
    const amt = Math.round(G.allowanceMonthly * 0.8);
    if (p.bond >= 45 && p.money >= amt) {
      p.money -= amt;
      earnMoney(amt, `Extra Pocket Money (${p.name})`);
      showToast(`💰 ${p.name} gave you ${fmt(amt)}!`);
    } else showToast(`🙅 ${p.name} refused extra pocket money.`);
    saveAll(); render();
  }

  function piggyOp(op) {
    if (!guardTap(`piggy_${op}`)) return;
    if (op === 'save') {
      if (!chargeMoney(200, 'Piggy Bank Deposit')) return;
      G.piggyBank = (G.piggyBank || 0) + 200;
      showToast(`🐷 Saved ${fmt(200)} in Piggy Bank!`);
    } else {
      if ((G.piggyBank || 0) <= 0) return showToast('Piggy Bank is empty!');
      const amt = G.piggyBank; G.piggyBank = 0;
      earnMoney(amt, 'Piggy Bank Smash');
      showToast(`🔨 Broke Piggy Bank for ${fmt(amt)}!`);
    }
    saveAll(); render();
  }

  function doCityHunt() {
    if (!guardTap('city_hunt') || !useEnergy(12)) return;
    const item = pick(ALL_SHOP_ITEMS.filter(it => it.cost <= 8500));
    const hist = G.cityHunt.history || {};
    let mult = (rand(70, 140) / 100);
    if (hist[item.id] && Math.abs(hist[item.id].m - G.totalMonths) <= 2 && Math.abs(hist[item.id].mult - mult) < 0.08) mult += 0.17;
    hist[item.id] = { m: G.totalMonths, mult };
    G.cityHunt.history = hist;
    G.cityHunt.foundCount += 1;
    const estZar = Math.round(item.cost * mult);
    addInventoryItem(item, estZar, G.countryId);
    showToast(`🗺️ Scavenged ${item.name} (Value ${fmt(estZar)})! Added to Inventory.`);
    saveAll(); render();
  }

  function attemptCarSteal(method) {
    if (G.age < 18) return showToast('🔒 Street crime & Grand Theft Auto unlock at Age 18+!');
    if (!guardTap(`steal_car_${method}`) || !useEnergy(16)) return;
    const rates = { smash: 20, lock: 40, clone: 60, tow: 75 };
    if (Math.random() * 100 < (rates[method] || 30)) {
      const car = pick(CARS_CATALOG);
      G.cars.push({ ...car, val: car.cost, fuel: 80, rented: false });
      G.streetRespect = clamp(G.streetRespect + 8);
      G.policeHeat = clamp(G.policeHeat + Math.round(22 * getDiff().heatGainMult));
      showToast(`🚗 Stole ${car.name}! +8 Street Rep`);
    } else {
      G.jail.pendingCase = { charge: `Grand Theft Auto (${method})`, years: 4, fine: 15000 };
      showToast('🚨 Caught by Police! Pending Trial.');
    }
    saveAll(); render();
  }

  function resolvePendingTrial(hireLawyer) {
    const pc = G.jail.pendingCase;
    if (!pc) return;
    const d = getDiff();
    if (hireLawyer && !chargeMoney(Math.round(9500 * d.fineMult), 'Defense Lawyer')) return;
    const winProb = hireLawyer ? 0.68 : 0.25;
    G.jail.pendingCase = null;
    if (Math.random() < winProb) {
      G.policeHeat = clamp(G.policeHeat - 25);
      showToast('⚖️ Charges Dismissed in Court!');
    } else {
      const mo = Math.max(3, Math.round(pc.years * 12 * d.jailMult));
      G.jail.inJail = true; G.jail.monthsLeft = mo;
      showToast(`🔒 Sentenced to ${mo} months in Prison!`);
    }
    saveAll(); render();
  }

  function jailAction(act) {
    if (!G.jail.inJail || !guardTap(`jail_${act}`)) return;
    if (act === 'chores') { G.jail.choresDone += 1; G.jail.monthsLeft = Math.max(0, G.jail.monthsLeft - 1); showToast('🧹 Good behavior: -1 month sentence!'); }
    else if (act === 'learn') { G.stats.smarts = clamp(G.stats.smarts + 4); showToast('📚 Studied prison law: +4 Smarts'); }
    else if (act === 'respect') { G.jail.respect = clamp(G.jail.respect + 10); if (G.age >= 18) G.streetRespect = clamp(G.streetRespect + 4); showToast('💪 Yard Respect +10'); }
    else if (act === 'disrespect') { G.jail.respect = clamp(G.jail.respect + 6); G.stats.health = clamp(G.stats.health - 8); showToast('😠 Stood your ground (-8 Health, +6 Respect)'); }
    else if (act === 'appeal' && chargeMoney(7500, 'Court Appeal')) {
      if (Math.random() < 0.45) { G.jail.inJail = false; G.jail.monthsLeft = 0; showToast('⚖️ Appeal Won! Released!'); }
      else showToast('Appeal denied by Judge.');
    } else if (act === 'escape') {
      if (Math.random() < 0.25) { G.jail.inJail = false; G.jail.monthsLeft = 0; G.policeHeat = 95; showToast('🏃 Escaped Prison! Police Heat 95!'); }
      else { G.jail.monthsLeft += 12; showToast('🚨 Caught escaping! +12 months added.'); }
    }
    if (G.jail.monthsLeft <= 0) G.jail.inJail = false;
    saveAll(); render();
  }

  function suePersonModal() {
    openModal(`
      <h3 class="gold">⚖️ Civil Lawsuit Filing</h3>
      <input id="sueTarget" type="text" placeholder="Defendant Name or Company" value="Local Contractor" />
      <select id="sueReason"><option>Contract Breach</option><option>Defamation</option><option>Property Damage</option></select>
      <button class="btn btn-gold" onclick="LSW.executeLawsuit()">File Lawsuit (${fmt(2500)})</button>
      <button class="btn btn-dark" onclick="LSW.closeModal()">Cancel</button>
    `);
  }

  function executeLawsuit() {
    if (!guardTap('civil_lawsuit') || !chargeMoney(2500, 'Civil Court Filing')) return;
    closeModal();
    if (Math.random() < 0.55) {
      const award = rand(12000, 42000);
      earnMoney(award, 'Civil Lawsuit Settlement');
      showToast(`⚖️ Won Lawsuit! Awarded ${fmt(award)}!`);
    } else showToast('⚖️ Judge dismissed civil claim.');
    saveAll(); render();
  }

  function mafiaOp(id) {
    if (G.age < 18) return showToast('🔒 Mafia & Syndicate contracts unlock at Age 18+!');
    if (!guardTap(`mafia_${id}`)) return;
    const mj = MAFIA_JOBS.find(x => x.id === id);
    if (!mj || G.streetRespect < mj.reqRep) return showToast(`Need ${mj.reqRep}+ Street Respect!`);
    if (!useEnergy(20)) return;
    if (Math.random() * 100 < mj.risk) {
      G.policeHeat = clamp(G.policeHeat + 35);
      G.jail.pendingCase = { charge: mj.name, years: 5, fine: 25000 };
      showToast('🚨 Syndicate Op blown! Facing Court!');
    } else {
      earnMoney(mj.pay, mj.name);
      G.streetRespect = clamp(G.streetRespect + mj.street);
      G.communityRespect = clamp(G.communityRespect + mj.com);
      showToast(`🔫 Syndicate payout: +${fmt(mj.pay)}`);
    }
    saveAll(); render();
  }

  function buyFakePassport() {
    if (!guardAge16('Black Market')) return;
    if (!chargeMoney(18000, 'Black Market Passport')) return;
    G.fakePassport = `${pick(getCountry().firstM)} ${pick(getCountry().surnames)} (Alias)`;
    showToast(`🛂 Forged Alias: ${G.fakePassport}`);
    saveAll(); render();
  }

  function orderSupplier(supId, sampleOnly) {
    if (!guardAge16('Suppliers & Trade') || !guardTap(`sup_${sampleOnly ? 's' : 'o'}_${supId}`)) return;
    const sp = ALL_SUPPLIERS.find(x => x.id === supId);
    if (!sp) return;
    if (G.activeCrisis && G.activeCrisis.id === 'war' && sp.countryId !== G.countryId) return showToast('⚠️ Border War blocked cross-border shipping!');
    if (sampleOnly) {
      if (!chargeMoney(800, `Sample: ${sp.name}`)) return;
      G.suppliers.sampled[supId] = true;
      showToast(`🔍 Verified Quality ${sp.quality}% · Lie Risk ${sp.lieRisk}%`);
    } else {
      if (!payViaWire(sp.baseZar, sp.name, sp.countryId)) return;
      G.businessScore = clamp((G.businessScore || 0) + 4);
      if (Math.random() * 100 < sp.lieRisk) showToast(`⚠️ ${sp.name} shorted stock quality!`);
      else { earnMoney(Math.round(sp.baseZar * 1.45), `Resale (${sp.name})`); showToast(`📦 Stock resold for +${fmt(Math.round(sp.baseZar * 1.45))}!`); }
    }
    saveAll(); render();
  }

  function acceptSystemOffer(key) {
    if (!guardAge16('System Offers') || !G.systemOffers[key] || !G.systemOffers[key].activeOffer) return;
    const off = G.systemOffers[key].activeOffer;
    earnMoney(off.payout, off.title);
    G.systemOffers[key].activeOffer = null;
    G.systemOffers[key].nextInMonths = rand(4, 7);
    showToast(`✅ Accepted Offer: +${fmt(off.payout)}!`);
    saveAll(); render();
  }

  function rejectSystemOffer(key) {
    if (!G.systemOffers[key]) return;
    G.systemOffers[key].activeOffer = null;
    G.systemOffers[key].nextInMonths = rand(4, 7);
    saveAll(); render();
  }

  function craftHobby(hbId) {
    if (G.age < 16) return showToast('🔒 Hobbies unlock at Age 16! Join School Clubs until then.');
    const hb = HOBBIES_CATALOG.find(x => x.id === hbId);
    if (!hb || !guardTap(`hobby_${hbId}`) || !useEnergy(12)) return;
    G.skills[hb.skill] = Math.min(100, (G.skills[hb.skill] || 0) + 8);
    earnMoney(hb.baseSell, hb.outName);
    G.stats.creativity = clamp((G.stats.creativity || 0) + 2);
    showToast(`🎨 Crafted ${hb.outName}: +8 ${hb.skill} & +${fmt(hb.baseSell)}!`);
    saveAll(); render();
  }

  function runRace(raceId) {
    if (!guardAge16('Racing') || !guardTap(`race_${raceId}`)) return;
    const r = RACING_LEAGUES.find(x => x.id === raceId);
    if (!r || !chargeMoney(r.fee, r.name) || !useEnergy(15)) return;
    G.racingWins = (G.racingWins || 0) + 1;
    earnMoney(r.prize, `${r.name} Win`);
    G.confidence = clamp((G.confidence || 0) + 3);
    showToast(`🏎️ Won ${r.name}! +${fmt(r.prize)} & +3 Confidence`);
    saveAll(); render();
  }

  function dispatchLogistics(ltId) {
    const td = LOGISTICS_TENDERS.find(x => x.id === ltId);
    if (!td || !guardAge16('Logistics') || !guardTap(`log_${ltId}`) || !useEnergy(14) || !claimMajorStep('Logistics Dispatch')) return;
    G.logistics.doneCount += 1;
    G.logistics.trust = Math.min(100, (G.logistics.trust || 0) + 6);
    G.businessScore = clamp((G.businessScore || 0) + 4);
    earnMoney(td.payZar, 'Freight Dispatch');
    showToast(`🚛 Freight delivered! +${fmt(td.payZar)} & +6 Trust`);
    saveAll(); render();
  }

  function buyFleetTruck(tId) {
    const t = TRUCKS_CATALOG.find(x => x.id === tId);
    if (!t || !guardAge16('Fleet') || !payViaWire(t.cost, t.name)) return;
    G.logistics.trucks.push({ name: t.name, health: 100 });
    G.businessScore = clamp((G.businessScore || 0) + 5);
    showToast(`🚛 Purchased ${t.name}!`);
    saveAll(); render();
  }

  function bidTender(tdId) {
    const td = TENDERS_7STEP_CATALOG.find(x => x.id === tdId);
    if (!td || !guardAge16('Tenders') || !guardTap(`tender_${tdId}`) || !claimMajorStep('Government Tender')) return;
    if (!chargeMoney(td.feeZar, 'Tender Bid')) { G.majorStepUsedThisMonth = null; return; }
    const netProfit = td.budgetZar - td.estCostZar;
    G.tenders.completed += 1;
    G.businessScore = clamp((G.businessScore || 0) + 6);
    earnMoney(netProfit, `Tender Win: ${td.title}`);
    showToast(`📜 Won Tender! +${fmt(netProfit)} profit`);
    saveAll(); render();
  }

  function bidAuction(auId) {
    const au = AUCTIONS_CATALOG.find(x => x.id === auId);
    if (!au || !guardAge16('Auctions') || !guardTap(`auction_${auId}`) || !chargeMoney(au.startZar, `Auction: ${au.name}`)) return;
    G.auctions.wonItems.push(au.name);
    showToast(`🔨 Won ${au.name}!`);
    saveAll(); render();
  }

  function runBusRoute(btId) {
    const bt = BUS_TENDERS.find(x => x.id === btId);
    if (!bt || !guardAge16('Bus') || !guardTap(`bus_${btId}`) || !useEnergy(14) || !claimMajorStep('Bus Route')) return;
    G.busStation.doneCount += 1;
    earnMoney(bt.payZar, `Bus Route: ${bt.title}`);
    showToast(`🚌 Route completed! +${fmt(bt.payZar)}`);
    saveAll(); render();
  }

  /* ============================================================
     13. RENDERERS: TOPBAR + 6 BOTTOM TABS + MENU DIRECTORY
     ============================================================ */
  function renderHUD() {
    if (!G) return;
    if (!G.stats) G = migrateGameState(G);
    const c = getCountry();
    const d = getDiff();
    const energy = (G.stats && typeof G.stats.energy === 'number') ? G.stats.energy : 100;
    const monthName = MONTH_NAMES[((G.month || 1) - 1) % 12];
    const calYr = (G.birthYear || 2026) + (G.age || 0);
    $('hudLine1').textContent = G.name || 'Player';
    $('hudLine2').textContent = `Age ${G.age || 0} · ${G.city || c.capital}, ${c.name}`;
    $('hudCash').textContent = fmt(G.cash || 0);
    $('hudEnergy').textContent = `Energy: ${energy}`;

    $('hudTopPills').innerHTML = `
      <span class="pill-btn">📅 ${esc(monthName)} ${calYr}</span>
      <button class="pill-btn" onclick="LSW.openWorldSettings()">Difficulty: ${esc(d.shortName || 'Normal')}</button>
    `;

    const quickNav = [
      [`🎒 Inv (${(G.inventory || []).length})`, 'life', 'lifeView', 'inv'],
      [`🛍️ Shops`, 'life', 'lifeView', 'shops'],
      ['🏠 Houses', 'finance', 'financeView', 'houses'],
      ['⛏️ Mining', 'work', 'workView', 'mining']
    ];
    $('hudSubPills').innerHTML = quickNav.map(([lbl, tab, subK, subV]) => {
      const act = !UI_STATE.menuPage && UI_STATE.tab === tab && UI_STATE[subK] === subV;
      return `<button class="pill-btn ${act ? 'active' : ''}" onclick="LSW.setSub('${subK}','${subV}');LSW.switchTab('${tab}');">${lbl}</button>`;
    }).join('');

    document.querySelectorAll('.bnav-btn').forEach(btn => {
      btn.classList.toggle('active', !UI_STATE.menuPage && btn.dataset.tab === UI_STATE.tab);
    });
    if (UI_STATE.searchOpen) renderSearchDropdown();
  }

  function openReportModal() {
    openModal(`
      <h3 class="gold">📊 Monthly Report · Age ${G.age}</h3>
      <div class="muted">${esc(getCountry().name)} (${esc(getCountry().cur)}) · Net Worth ${fmt(calcNetWorth())}</div>
      <div style="margin:8px 0;">${G.monthlyReport.map(r => `<div class="card-alt">${esc(r)}</div>`).join('')}</div>
      <button class="btn btn-gold" onclick="LSW.closeModal()">Close</button>
    `);
  }

  function renderHome() {
    const c = getCountry();
    const d = getDiff();
    const ev = G.currentEvent;
    const roomCap = getHouseRoomCapacity();
    const ownHouse = G.houses.find(h => !h.rentedOut);
    const shield18 = G.age < 18 && isFamilyShieldActive();
    const easyHint = G.age < 16 ? 'Study School subjects, save Piggy Bank & grow friendships until 16.' : (!G.job && !G.company) ? 'Apply for one of 366 Jobs or start a Company in Work!' : !ownHouse ? 'Rent or Buy a House in Finance -> Houses to place Furniture!' : 'Buy Fridge, Bed & Gear in Life -> Shops and advance month!';

    return `
      ${G.jail.inJail ? `<div class="card" style="border-color:var(--danger-text);background:var(--danger-bg);"><strong class="bad">🔒 IMPRISONED (${G.jail.monthsLeft} mo left)</strong><div class="muted">Go to Life -> Jail & Court.</div></div>` : ''}
      ${G.activeCrisis ? `
        <div class="card" style="border-color:var(--warn);">
          <div class="between"><strong class="warn">⚠️ ${esc(G.activeCrisis.name)}</strong><span class="gold">${G.crisisPrepared ? '🛡️ Prepared' : 'Alert'}</span></div>
          <div class="muted">${esc(G.activeCrisis.desc)}</div>
          ${!G.crisisPrepared ? `<div class="grid2" style="margin-top:6px;"><button class="btn btn-gold btn-sm" onclick="LSW.handleCrisisAction('prepare')">🛡️ Prepare (${fmt(Math.round(900 * d.costMult))})</button><button class="btn btn-dark btn-sm" onclick="LSW.handleCrisisAction('ignore')">⏳ Ignore</button></div>` : ''}
        </div>
      ` : ''}
      ${G.policeHeat >= 25 ? `
        <div class="card" style="border-color:var(--danger-text);">
          <div class="between"><strong class="bad">🚓 Police Heat: ${G.policeHeat}</strong></div>
          <div class="grid3" style="margin-top:6px;">
            <button class="btn btn-danger btn-sm" onclick="LSW.policeAction('bribe')">💵 Bribe</button>
            <button class="btn btn-blue btn-sm" onclick="LSW.policeAction('pay')">⚖️ Pay Fine</button>
            <button class="btn btn-dark btn-sm" onclick="LSW.policeAction('hide')">🫥 Lay Low</button>
          </div>
        </div>
      ` : ''}
      ${d.hints && !(G.settings && G.settings.focusMode) ? `<div class="card-alt" style="border-color:var(--good);"><strong class="good">💡 Easy Hint:</strong> <span class="muted">${esc(easyHint)}</span></div>` : ''}

      <div class="card" style="border-color:var(--accent);">
        <div class="between">
          <div class="muted">Age ${G.age} · ${esc(getSeasonName(G.month, c.id))} · ${esc(G.belief)}</div>
          <button class="btn btn-gold btn-sm" onclick="LSW.advanceMonth()">Next Month ▶</button>
        </div>
        <div class="card-alt" style="margin-top:8px;">${esc(ev ? ev.text : 'Quiet month ahead.')}</div>
        ${ev ? ev.opts.map((o, i) => `<button class="btn btn-dark" style="text-align:left;" onclick="LSW.pickEventOption(${i})">▸ ${esc(o.label)}</button>`).join('') : ''}
      </div>

      <div class="card">
        <div class="between"><h3>📰 ${esc(c.name)} News</h3><span class="gold">${esc(G.culture)}</span></div>
        ${G.newsFeed.slice(0, 3).map(n => `<div class="muted" style="padding:3px 0;border-bottom:1px solid var(--border);">${esc(n)}</div>`).join('')}
      </div>

      <div class="card">
        <div class="between"><h3>🤝 Respect & Standing</h3><button class="btn btn-dark btn-sm" onclick="LSW.openMemoriesModal()">📖 Memories</button></div>
        <div class="grid2" style="margin-top:6px;">
          <div>Community Rep: ${G.communityRespect || 0} ${barHtml(G.communityRespect || 0, 'blue-fill')}</div>
          <div>Street Rep: ${G.streetRespect || 0} ${barHtml(G.streetRespect || 0, 'bad-fill')}</div>
          <div>Confidence: ${G.confidence || 0} ${barHtml(G.confidence || 0, 'gold-fill')}</div>
          <div>Police Heat: ${G.policeHeat || 0} ${barHtml(G.policeHeat || 0, 'bad-fill')}</div>
        </div>
      </div>

      <div class="card">
        <div class="between"><h3>🧭 Needs</h3><span class="${shield18 ? 'good' : 'gold'}">${shield18 ? '🛡️ Parents Shield (<18)' : `Difficulty: ${esc(d.shortName || 'Normal')}`}</span></div>
        <div class="grid3" style="margin-top:6px;">
          ${[['hunger', '🍽️ Hunger', G.needs ? G.needs.hunger : 90], ['energy', '⚡ Energy', G.stats.energy], ['happy', '😊 Happiness', G.stats.happy]].map(([, lbl, raw]) => {
            const val = Math.round(raw || 0);
            return `<div class="card-alt" style="margin-bottom:0;padding:6px 8px;"><div class="between" style="font-size:0.8em;"><span>${lbl}</span><strong class="mono">${val}</strong></div>${barHtml(val, val < 25 ? 'bad-fill' : val < 50 ? 'warn-fill' : '')}</div>`;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="between"><h3>🏠 Home & Rooms (${getInventoryWeightKg()}kg Gear)</h3><span class="gold">${ownHouse ? esc(ownHouse.name) : shield18 ? 'Parents House' : 'No House'}</span></div>
        <div class="grid3" style="margin-top:6px;">
          ${[['bedroom', '🛏️ Bed'], ['living', '🛋️ Living'], ['kitchen', '🍳 Kitchen'], ['bathroom', '🚿 Bath'], ['office', '💻 Office'], ['outdoor', '⛺ Yard']].map(([rk, lbl]) => `
            <div class="card-alt between" style="margin-bottom:0;padding:6px 8px;font-size:0.8em;"><span>${lbl}</span><strong class="${roomCap[rk] ? 'good' : 'warn'}">${roomCap[rk] ? `${getRoomUsedSlots(rk)} used` : 'Empty'}</strong></div>
          `).join('')}
        </div>
        <div class="grid3" style="margin-top:6px;">
          <button class="btn btn-gold btn-sm" onclick="LSW.setSub('lifeView','inv');LSW.switchTab('life');">🎒 Inventory</button>
          <button class="btn btn-blue btn-sm" onclick="LSW.setShopCat('Furniture');LSW.setSub('lifeView','shops');LSW.switchTab('life');">🛋️ Furniture</button>
          <button class="btn btn-dark btn-sm" onclick="LSW.setSub('financeView','houses');LSW.switchTab('finance');">🏠 Houses</button>
        </div>
      </div>

      <div class="card">
        <div class="between"><h3>📬 System Offers</h3></div>
        ${G.age < 16 ? `<div class="muted">Offers unlock at Age 16. Focus on School & Friends now.</div>` : `
          ${SYSTEM_OFFER_META.filter(m => G.systemOffers[m.key] && G.systemOffers[m.key].activeOffer).map(m => {
            const o = G.systemOffers[m.key].activeOffer;
            return `<div class="card-alt"><div class="between"><strong>${m.icon} ${esc(o.title)}</strong><span class="gold">+${fmt(o.payout)}</span></div><div class="grid2" style="margin-top:4px;"><button class="btn btn-gold btn-sm" onclick="LSW.acceptSystemOffer('${m.key}')">Accept</button><button class="btn btn-dark btn-sm" onclick="LSW.rejectSystemOffer('${m.key}')">Decline</button></div></div>`;
          }).join('') || `<div class="muted">No active offers right now.</div>`}
        `}
      </div>

      <div class="card">
        <div class="between"><h3>🎭 Traits & Vitals</h3><button class="btn btn-blue btn-sm" onclick="LSW.restNow()">😴 Rest</button></div>
        <div class="pill-wrap" style="margin-top:6px;margin-bottom:8px;">
          <span class="scarcity-badge">🕊️ ${esc(G.belief)}</span>
          <span class="scarcity-badge">🌍 ${esc(G.culture)}</span>
          ${G.traits.map(tid => { const tr = TRAITS_LIST.find(x => x.id === tid); return tr ? `<span class="scarcity-badge">${esc(tr.name)}</span>` : ''; }).join('')}
        </div>
        <div class="grid2">
          <div>Health: ${G.stats.health} ${barHtml(G.stats.health)}</div>
          <div>Energy: ${G.stats.energy} ${barHtml((G.stats.energy / d.energyCap) * 100, 'gold-fill')}</div>
          <div>Happiness: ${G.stats.happy} ${barHtml(G.stats.happy, 'blue-fill')}</div>
          <div>Smarts: ${G.stats.smarts} ${barHtml(G.stats.smarts)}</div>
          <div>Creativity: ${G.stats.creativity || 0} ${barHtml(G.stats.creativity || 0, 'blue-fill')}</div>
          <div>Discipline: ${G.stats.discipline || 0} ${barHtml(G.stats.discipline || 0, 'gold-fill')}</div>
          <div>Morality: ${G.stats.morality || 0} ${barHtml(G.stats.morality || 0)}</div>
          <div>Charisma: ${G.stats.charisma || 0} ${barHtml(G.stats.charisma || 0, 'blue-fill')}</div>
          <div>Strength: ${G.stats.strength || 0} ${barHtml(G.stats.strength || 0, 'gold-fill')}</div>
        </div>
      </div>
    `;
  }

  function renderEducationUnifiedHtml() {
    const c = getCountry();
    const ce = getCountryEdu(c.id);
    const e = G.edu;
    const isSchoolStage = ['preschool', 'primary', 'junior', 'senior'].includes(e.stage);
    const speed = getEducationSpeedMult();
    const salMult = getEduSalaryMult();

    return `
      <div class="card" style="border-color:var(--accent);">
        <div class="between"><h3>🎓 ${esc(c.name)} Education: ${esc(c.schoolSystem)}</h3><span class="gold">${speed}x R&D · ${salMult.toFixed(2)}x Pay</span></div>
        <div class="card-alt">
          <div><strong>Current Stage:</strong> <span class="gold">${esc(getEduCurrentLabel())}</span></div>
          <div class="muted">Language: ${esc(ce.languageOfInstruction)} · Syllabus: ${esc(ce.syllabus.join(', '))}</div>
          <div class="muted" style="margin-top:4px;">Progress: <strong>${e.progress || 0}%</strong> ${barHtml(e.progress || 0, 'blue-fill')}</div>
          ${e.skippedPreschool ? `<div class="warn" style="margin-top:4px;">⚠️ Skipped Preschool — keep studying to catch up!</div>` : ''}
        </div>

        ${G.age >= 3 && G.age <= 5 ? `
          <div class="grid2">
            <button class="btn btn-gold btn-sm" onclick="LSW.playPreschoolAction('play')">🧸 Play + Learn</button>
            <button class="btn btn-blue btn-sm" onclick="LSW.playPreschoolAction('books')">📖 Picture Books</button>
          </div>
        ` : ''}

        ${G.age >= 3 ? `
          <div class="grid3" style="margin-top:6px;">
            <button class="btn btn-blue btn-sm" onclick="LSW.studyEducation()">📖 Study</button>
            <button class="btn btn-dark btn-sm" onclick="LSW.doAssignment()" ${G.age < 6 ? 'disabled' : ''}>✍️ Assignment</button>
            <button class="btn btn-gold btn-sm" onclick="LSW.${e.stage === 'tvet' ? 'advanceTvetLevel()' : e.stage === 'university' ? 'advanceUniYear()' : 'takeEducationExam()'}" ${(!isSchoolStage && e.stage !== 'tvet' && e.stage !== 'university') ? 'disabled' : ''}>📝 Final Exam</button>
          </div>
        ` : `<div class="muted">Age 0–2: Infant Home Care. Preschool (${esc(ce.preschoolName)}) starts at Age 3!</div>`}

        ${e.stage === 'junior' ? `
          <div class="card-alt" style="margin-top:8px;">
            <strong>🎯 Junior Elective (Pick 1): <span class="gold">${esc(e.juniorElective)}</span></strong>
            <div class="pill-wrap" style="margin-top:4px;">${JUNIOR_ELECTIVES.map(el => `<button class="pill-btn ${e.juniorElective === el ? 'active' : ''}" onclick="LSW.setJuniorElective('${esc(el)}')">${esc(el)}</button>`).join('')}</div>
          </div>
        ` : ''}

        ${e.stage === 'senior' ? `
          <div class="card-alt" style="margin-top:8px;">
            <strong>📚 Senior Electives (${e.seniorElectives.length} picked): <span class="gold">${esc(e.seniorElectives.join(', '))}</span></strong>
            <div class="muted">Exam Target: ${esc(ce.finalExamName)} (Need Smarts 60+ & Discipline 50+)</div>
            <div class="pill-wrap" style="margin-top:4px;">${SENIOR_ELECTIVES.map(el => `<button class="pill-btn ${e.seniorElectives.includes(el) ? 'active' : ''}" onclick="LSW.toggleSeniorElective('${esc(el)}')">${e.seniorElectives.includes(el) ? '✓ ' : ''}${esc(el)}</button>`).join('')}</div>
          </div>
        ` : ''}

        <div class="between" style="margin-top:8px;">
          <button class="btn btn-dark btn-sm" onclick="LSW.readLibraryBook()">📚 Library Book (${e.booksRead} read ${e.bookworm ? '🏅' : ''})</button>
          <button class="btn btn-blue btn-sm" onclick="LSW.takeTutoring(false)">👨‍🏫 Tutor (${fmt(Math.round(450 * c.costMult))})</button>
          <button class="btn btn-dark btn-sm" onclick="LSW.takeTutoring(true)">🤝 Free Mentor</button>
        </div>

        <div class="pill-wrap" style="margin-top:6px;">
          ${SCHOOL_CLUBS.map(cl => { const on = G.school.clubs.includes(cl); return `<button class="pill-btn ${on ? 'active' : ''}" onclick="LSW.toggleClub('${esc(cl)}')">${on ? '✓ ' : ''}${esc(cl)}</button>`; }).join('')}
        </div>
        ${isSchoolStage ? `<button class="btn btn-danger btn-sm" style="margin-top:6px;" onclick="LSW.attemptDropOut()">${G.age < 16 ? '🔒 Drop Out (Locked <16)' : '🚪 Drop Out (16+)'}</button>` : ''}
      </div>

      <div class="card">
        <h3>🔧 ${esc(ce.tvetName)} (10 Trades · Unlocks After Junior)</h3>
        ${TVET_TRADES.map(tr => {
          const done = (e.tvet.completedTrades || []).includes(tr.id);
          const act = e.tvet.activeTrade === tr.id;
          return `<div class="card-alt between"><div><strong>${esc(tr.name)}</strong><div class="muted">${fmt(Math.round(tr.cost * c.costMult))} · Pay ${tr.salMult}x · Req S${tr.reqSmarts}+ & ${tr.reqStat} ${tr.reqVal}+</div></div><button class="btn ${done ? 'btn-dark' : act ? 'btn-blue' : 'btn-gold'} btn-sm" onclick="LSW.${act ? 'advanceTvetLevel()' : `enrollTvet('${tr.id}')`}">${done ? '✅ Certified' : act ? `Lv ${e.tvet.level} Exam` : 'Enroll'}</button></div>`;
        }).join('')}
      </div>

      <div class="card">
        <h3>🏛️ University (${ce.universityYears}–6 Yrs · Unlocks Age 18+ & ${esc(ce.finalExamName)})</h3>
        ${UNI_DEGREES.map(dg => {
          const done = (e.uni.completedDegrees || []).includes(dg.id);
          const act = e.uni.activeDegree === dg.id;
          return `<div class="card-alt between"><div><strong>${esc(dg.name)}</strong> (${dg.years}y)<div class="muted">${fmt(Math.round(dg.costYr * c.costMult))} yearly · Pay ${dg.salMult}x · 2x Innovation · Req S${dg.reqSmarts}+</div></div><button class="btn ${done ? 'btn-dark' : act ? 'btn-blue' : 'btn-gold'} btn-sm" onclick="LSW.${act ? 'advanceUniYear()' : `enrollUni('${dg.id}')`}">${done ? '✅ Degree' : act ? `Yr ${e.uni.year} Exam` : (G.age < 18 || !e.hsCertified) ? '🔒 18+ & HS' : 'Enroll'}</button></div>`;
        }).join('')}
      </div>

      <div class="card">
        <h3>💻 Online Short Courses (Age 13+ · Max 2 Active)</h3>
        ${e.onlineCourses.active.map(ac => `<div class="card-alt between"><strong>${esc(ac.name)} (Wk ${ac.step})</strong><button class="btn btn-gold btn-sm" onclick="LSW.stepOnlineCourse('${ac.id}')">Study Step</button></div>`).join('')}
        <div class="grid2">
          ${ONLINE_SHORT_COURSES.map(oc => {
            const done = e.onlineCourses.completed.includes(oc.id);
            return `<div class="card-alt"><strong>${esc(oc.name)}</strong><div class="muted">${oc.weeks} wks · ${fmt(Math.round(oc.cost * c.costMult))}</div><button class="btn ${done ? 'btn-dark' : 'btn-blue'} btn-sm" style="margin-top:4px;" onclick="LSW.startOnlineCourse('${oc.id}')">${done ? '✅ Done' : G.age < 13 ? '🔒 Age 13+' : 'Enroll'}</button></div>`;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <h3>🚀 Advanced Programs (Age 16+ · HS or TVET · Smarts 60+)</h3>
        ${ADVANCED_PROGRAMS.map(adv => {
          const done = e.advancedCourses.includes(adv.id);
          return `<div class="card-alt between"><div><strong>${esc(adv.name)}</strong><div class="muted">${fmt(Math.round(adv.cost * c.costMult))} · ${esc(adv.innoBoost.toUpperCase())} R&D Bonus</div></div><button class="btn ${done ? 'btn-dark' : 'btn-gold'} btn-sm" onclick="LSW.takeAdvancedProgram('${adv.id}')">${done ? '✅ Certified' : 'Take'}</button></div>`;
        }).join('')}
      </div>

      <div class="card">
        <div class="between"><h3>📜 Certifications & Completed History</h3><span class="gold">${e.completedHistory.length + G.certs.length} Earned</span></div>
        ${e.completedHistory.map(h => `<div class="card-alt good">🎓 ${esc(h)}</div>`).join('') || '<div class="muted">No school graduations or certificates yet.</div>'}
        ${COURSES_AND_CERTS.map(cr => {
          const owned = G.certs.includes(cr.id);
          return `<div class="card-alt"><div class="between"><strong>${esc(cr.name)}</strong><span class="gold">${fmt(cr.cost)}</span></div><div class="muted">${esc(cr.benefit)}</div><button class="btn ${owned ? 'btn-dark' : 'btn-gold'} btn-sm" style="margin-top:6px;" onclick="LSW.openCertQuizModal('${cr.id}')">${owned ? '✅ Certified' : G.age < 16 ? '🔒 Unlocks 16' : 'Take Study & Exam'}</button></div>`;
        }).join('')}
      </div>
    `;
  }

  function renderPeople() {
    const c = getCountry();
    const sv = UI_STATE.peopleView;
    const pills = [['family', '👨‍👩‍👧 Family'], ['npcs', '🧑‍🤝‍🧑 Friends'], ['marriage', '💍 Marriage'], ['school', '🎓 School & Certs'], ['social', '📱 Socials']];
    let body = '';
    if (sv === 'family') {
      const mom = G.parents.mother, dad = G.parents.father;
      const livingGps = (G.relatives || []).filter(r => r.alive);
      body = `
        <div class="card">
          <div class="between"><h3>👨‍👩‍👧 ${esc(G.surname)} Family (${esc(G.city)}, ${esc(c.name)})</h3><button class="btn btn-dark btn-sm" onclick="LSW.openMemoriesModal()">📖 Memories</button></div>
          <div class="card-alt" style="border-color:var(--accent);">
            <div class="gold">"${esc(getCulturalGreeting())}"</div>
            <div class="muted" style="margin-top:3px;">Belief: <strong>${esc(G.belief)}</strong> · Culture: <strong>${esc(G.culture)}</strong></div>
          </div>
          <div class="card-alt"><strong>Mother:</strong> ${esc(mom.name)}${mom.alive === false ? ' (Remembered)' : ` · Bond ${mom.bond} · ${fmt(mom.money)}`}</div>
          <div class="card-alt"><strong>Father:</strong> ${esc(dad.name)}${dad.alive === false ? ' (Remembered)' : ` · Bond ${dad.bond} · ${fmt(dad.money)}`}</div>
          ${livingGps.length ? `<div class="card-alt"><strong>Elders:</strong> ${livingGps.map(gp => `${esc(gp.role)} ${esc(gp.name)} (Age ${gp.age})`).join(' · ')}</div>` : ''}
          <div class="card-alt"><strong>Pocket Money (Once Yearly):</strong> <button class="btn btn-gold btn-sm" style="margin-top:4px;" onclick="LSW.openPocketMoneyDisclaimer('mother')">Ask Mum</button> <button class="btn btn-blue btn-sm" style="margin-top:4px;" onclick="LSW.openPocketMoneyDisclaimer('father')">Ask Dad</button></div>
          <div class="card-alt between"><div><strong>🐷 Piggy Bank:</strong> <span class="gold">${fmt(G.piggyBank)}</span></div><div><button class="pill-btn" onclick="LSW.piggyOp('save')">Save</button> <button class="pill-btn" onclick="LSW.piggyOp('break')">Break</button></div></div>
        </div>
        <div class="card">
          <h3>👶 Children (${G.children.length})</h3>
          ${G.children.map((ch, i) => `<div class="card-alt between"><span>${esc(ch.name)} (Age ${ch.age || 0})</span><button class="btn btn-gold btn-sm" onclick="LSW.familyRelAction('child',${i},'play')">Play</button></div>`).join('') || '<div class="muted">No children yet.</div>'}
        </div>
      `;
    } else if (sv === 'npcs') {
      body = `
        <div class="card">
          <h3>🧑‍🤝‍🧑 Friends (${G.npcs.length})</h3>
          <div class="pill-wrap">
            <button class="btn btn-gold btn-sm" onclick="LSW.makeNewFriend('School Friends')">School Friend</button>
            <button class="btn btn-blue btn-sm" onclick="LSW.makeNewFriend('Work Friends')">Work Friend</button>
          </div>
          ${G.npcs.map(n => `
            <div class="card-alt">
              <div class="between"><strong>${n.id === G.bestFriendId ? '⭐ ' : ''}${esc(n.name)} (Age ${n.age})</strong><span class="gold">${n.bond} Bond</span></div>
              <div class="muted">${esc(n.jobTitle)} · ${esc(n.city)}</div>
              <div class="pill-wrap" style="margin-top:4px;">
                <button class="pill-btn" onclick="LSW.friendAction('${n.id}','talk')">Talk</button>
                <button class="pill-btn" onclick="LSW.friendAction('${n.id}','gift')">Gift</button>
                <button class="pill-btn" onclick="LSW.friendAction('${n.id}','borrow')">Borrow</button>
                <button class="pill-btn" onclick="LSW.friendAction('${n.id}','best')">⭐ Best</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (sv === 'marriage') {
      const ready = G.npcs.filter(n => n.bond >= 70);
      body = `
        <div class="card">
          <h3>💍 Marriage & Family Planning</h3>
          ${G.partner && !G.partner.deceased ? `
            <div class="card-alt"><strong>Spouse: ${esc(G.partner.name)}</strong> (${G.partner.bond} Bond)</div>
            <div class="grid2"><button class="btn btn-gold btn-sm" onclick="LSW.familyRelAction('spouse','p','talk')">💬 Talk</button><button class="btn btn-danger btn-sm" onclick="LSW.familyRelAction('spouse','p','divorce')">💔 Divorce</button></div>
            ${G.age >= 18 ? `<button class="btn btn-blue" style="margin-top:6px;" onclick="LSW.openChildNamingModal()">👶 Have / Adopt Child</button>` : ''}
          ` : ready.length ? ready.map(n => `<div class="card-alt between"><span>${esc(n.name)} (Bond ${n.bond})</span><button class="btn btn-gold btn-sm" onclick="LSW.openWeddingModal('${n.id}')">💍 Propose</button></div>`).join('') : '<div class="muted">Raise any adult friend Bond to 70+ to propose!</div>'}
        </div>
      `;
    } else if (sv === 'school') {
      body = renderEducationUnifiedHtml();
    } else {
      const plats = ['Instagram', 'TikTok', 'YouTube'];
      body = `
        <div class="card">
          <h3>📱 Social Media</h3>
          ${plats.map(pl => {
            const acc = G.socials.find(s => s.platform === pl);
            return acc ? `<div class="card-alt between"><div><strong>${pl}</strong><div class="muted">${acc.followers.toLocaleString()} followers</div></div><button class="btn btn-gold btn-sm" onclick="LSW.postSocial('${pl}')">📸 Post</button></div>`
              : `<button class="btn btn-dark btn-sm" onclick="LSW.createSocial('${pl}')">Join ${pl}</button>`;
          }).join('')}
        </div>
      `;
    }
    return `<div class="pill-strip" style="margin-bottom:8px;">${pills.map(([k, l]) => `<button class="pill-btn ${sv === k ? 'active' : ''}" onclick="LSW.setSub('peopleView','${k}')">${l}</button>`).join('')}</div>${body}`;
  }

  function renderCompaniesAllHtml() {
    const cid = UI_STATE.compCountryId || G.countryId;
    const cc = getCountry(cid);
    if (G.company) {
      return `
        <div class="card">
          <h3>🏢 ${esc(G.company.name)} (CEO)</h3>
          <div class="card-alt">Valuation: <strong class="gold">${fmtFull(G.company.valuation, G.countryId)}</strong> · Rev: ${fmt(G.company.baseRev)}/mo · Staff: ${G.company.staff.length}</div>
          <div class="grid2">
            <button class="btn btn-gold btn-sm" onclick="LSW.openHireApplicantsModal()">👔 Hire Staff</button>
            <button class="btn btn-blue btn-sm" onclick="LSW.createCompanyProduct()">📦 Launch Product</button>
            <button class="btn btn-danger btn-sm" onclick="LSW.sellCompany()">💰 Sell Company</button>
          </div>
          ${G.company.staff.map(s => `<div class="card-alt between"><div><strong>${esc(s.name)}</strong> (${esc(s.dept)})</div><div><button class="pill-btn" onclick="LSW.staffAction('${s.id}','bonus')">Bonus</button> <button class="pill-btn" onclick="LSW.staffAction('${s.id}','fire')">Fire</button></div></div>`).join('')}
        </div>
      `;
    }
    return `
      <div class="card">
        <h3>🏢 All ${ALL_COMPANY_TYPES.length} Company Types</h3>
        <select onchange="LSW.setCompCountry(this.value)">${COUNTRIES.map(cn => `<option value="${cn.id}" ${cn.id === cid ? 'selected' : ''}>${esc(cn.name)} (${cn.cur} ${cn.code})</option>`).join('')}</select>
        ${ALL_COMPANY_TYPES.slice(0, 20).map(ct => {
          const totalZ = Math.round((ct.reg + ct.lic + ct.cap) * cc.salIdx);
          const profZ = Math.round(ct.rev * cc.salIdx * (1 - cc.taxPct / 100));
          return `<div class="card-alt between"><div><strong>${esc(ct.name)}</strong><div class="muted">Setup: ${fmt(totalZ, cid, true)} · Est Net: ${fmt(profZ, cid)}/mo</div></div><button class="btn btn-gold btn-sm" onclick="LSW.foundOrBuyCompany('${esc(ct.name)}',${totalZ},${profZ})">Start</button></div>`;
        }).join('')}
      </div>
    `;
  }

  function renderWork() {
    const c = getCountry();
    const ce = getCountryEdu(c.id);
    const ws = G.workStats;
    const eduMult = getEduSalaryMult();
    const gross = G.job ? Math.round(G.job.salary * c.salIdx * getDiff().payMult * eduMult) : 0;

    const myEduTopCard = `
      <div class="card" style="border-color:var(--blue);">
        <div class="between">
          <h3>🎓 My Education</h3>
          <span class="gold">${getEducationSpeedMult()}x R&D · ${eduMult.toFixed(2)}x Pay</span>
        </div>
        <div class="card-alt" style="margin-bottom:6px;">
          <div><strong>${esc(getEduCurrentLabel())}</strong></div>
          <div class="muted">${esc(c.name)}: ${esc(c.schoolSystem)} · ${esc(ce.languageOfInstruction)}</div>
          <div style="margin-top:4px;">Progress: ${G.edu ? G.edu.progress : 0}% ${barHtml(G.edu ? G.edu.progress : 0, 'blue-fill')}</div>
        </div>
        <div class="grid2">
          <button class="btn btn-blue btn-sm" onclick="LSW.setSub('workView','edu')">🎓 Open Education</button>
          <button class="btn btn-gold btn-sm" onclick="LSW.studyEducation()">📖 Quick Study</button>
        </div>
      </div>
    `;

    const dashboard = `
      <div class="card" style="border-color:var(--accent);">
        <div class="between"><h3>💼 ${esc(G.job ? G.job.title : G.age < 16 ? 'Student (Work Unlocks at 16)' : 'Unemployed')}</h3><span class="gold">${fmt(gross)}/mo</span></div>
        <div class="grid3" style="margin-top:4px;">
          <div>Perf ${ws.perf || 0} ${barHtml(ws.perf || 0, 'blue-fill')}</div>
          <div>Integrity ${ws.integrity || 0} ${barHtml(ws.integrity || 0)}</div>
          <div>Progress ${G.jobProgress || 0} ${barHtml(G.jobProgress || 0, 'gold-fill')}</div>
        </div>
        ${G.job ? `<div class="grid3" style="margin-top:6px;"><button class="btn btn-gold btn-sm" onclick="LSW.workHonestly()">💼 Work</button><button class="btn btn-danger btn-sm" onclick="LSW.openWorkplaceCrimeModal()">🕵️ Crime</button><button class="btn btn-blue btn-sm" onclick="LSW.openSocializeCoworkersModal()">☕ Socialize</button></div>` : `<div class="muted" style="margin-top:4px;">${G.age < 16 ? 'You must finish school first. Work unlocks at 16.' : 'Apply below for one of 366 Jobs!'}</div>`}
      </div>
    `;

    const wv = UI_STATE.workView;
    const effectiveWv = (wv === 'dash' && G.age < 16) ? 'edu' : wv === 'dash' ? 'jobs' : wv;
    const wPills = [
      ['edu', '🎓 Education'], ['jobs', `💼 Jobs (${JOBS_CATALOG.length})`], ['innovation', '🔬 Innovation'],
      ['logistics', '🚛 Logistics'], ['tenders', '📜 Tenders'], ['suppliers', '🚢 Suppliers'],
      ['mining', '⛏️ Mining'], ['dev', '💻 Dev Studio'], ['company', '🏢 Companies']
    ];
    let sub = '';

    if (effectiveWv === 'jobs') {
      const sectors = ['ALL', ...JOBS_SECTOR_DEFS.map(d => d[0])];
      const filtered = JOBS_CATALOG.filter(j => (UI_STATE.jobSector === 'ALL' || j.sector === UI_STATE.jobSector) && (!UI_STATE.jobSearch || j.title.toLowerCase().includes(UI_STATE.jobSearch.toLowerCase()))).slice(0, 30);
      sub = `
        <div class="card">
          <h3>💼 Careers Directory (${JOBS_CATALOG.length} Roles)</h3>
          <input type="text" placeholder="Search 366 jobs..." value="${esc(UI_STATE.jobSearch)}" oninput="LSW.setJobSearch(this.value)" />
          <div class="pill-strip" style="margin-bottom:6px;">${sectors.map(sc => `<button class="pill-btn ${UI_STATE.jobSector === sc ? 'active' : ''}" onclick="LSW.setJobSector('${sc}')">${sc}</button>`).join('')}</div>
          ${filtered.map(j => {
            const sc = getJobScarcity(j, G.countryId);
            const pay = Math.round(j.salary * c.salIdx * getDiff().payMult * eduMult);
            return `<div class="card-alt"><div class="between"><strong>${esc(j.title)}</strong><span class="gold">${fmt(pay)}/mo</span></div><div class="muted">${esc(j.sector)} · <span class="scarcity-badge">${sc.emoji} ${esc(sc.label)}</span> · Req: ${esc(j.req)}</div><button class="btn ${sc.avail ? 'btn-blue' : 'btn-dark'} btn-sm" style="margin-top:6px;" ${!sc.avail ? 'disabled' : ''} onclick="LSW.applyForJob('${j.id}')">${G.age < 16 ? '🔒 Unlocks 16' : !sc.avail ? '⛔ Not in Country' : 'Apply & Interview'}</button></div>`;
          }).join('')}
        </div>
      `;
    } else if (effectiveWv === 'logistics') {
      sub = `
        <div class="card">
          <div class="between"><h3>🚛 Logistics & Fleet</h3><span class="gold">Trust ${G.logistics.trust} · Fleet (${G.logistics.trucks.length})</span></div>
          ${LOGISTICS_TENDERS.map(td => `<div class="card-alt between"><div><strong>${esc(td.title)}</strong><div class="muted">${fmt(td.payZar)}</div></div><button class="btn btn-gold btn-sm" onclick="LSW.dispatchLogistics('${td.id}')">Dispatch</button></div>`).join('')}
          ${TRUCKS_CATALOG.map(t => `<div class="card-alt between"><div><strong>${esc(t.name)}</strong><div class="muted">${fmt(t.cost)}</div></div><button class="btn btn-blue btn-sm" onclick="LSW.buyFleetTruck('${t.id}')">Buy</button></div>`).join('')}
        </div>
      `;
    } else if (effectiveWv === 'tenders') {
      sub = `<div class="card"><h3>📜 Government Tenders</h3>${TENDERS_7STEP_CATALOG.map(td => `<div class="card-alt between"><div><strong>${esc(td.title)}</strong><div class="muted">Budget ${fmt(td.budgetZar, td.countryId)}</div></div><button class="btn btn-gold btn-sm" onclick="LSW.bidTender('${td.id}')">Bid (${fmt(td.feeZar)})</button></div>`).join('')}</div>`;
    } else if (effectiveWv === 'suppliers') {
      const sq = (UI_STATE.supplierQuery || '').trim().toLowerCase();
      const filteredSup = ALL_SUPPLIERS.filter(sp => !sq || sp.name.toLowerCase().includes(sq) || sp.cat.toLowerCase().includes(sq) || getCountry(sp.countryId).name.toLowerCase().includes(sq));
      const supMax = Math.max(0, Math.ceil(filteredSup.length / 20) - 1);
      const supPage = Math.min(supMax, Math.max(0, UI_STATE.supplierPage || 0));
      const slice = filteredSup.slice(supPage * 20, (supPage + 1) * 20);
      sub = `
        <div class="card">
          <h3>🚢 Global Suppliers (${ALL_SUPPLIERS.length})</h3>
          <input type="text" placeholder="Search ${ALL_SUPPLIERS.length} suppliers..." value="${esc(UI_STATE.supplierQuery || '')}" oninput="LSW.setSupplierQuery(this.value)" />
          ${slice.map(sp => {
            const tc = getCountry(sp.countryId), ssc = getSupplierScarcity(sp);
            return `<div class="card-alt"><div class="between"><strong>${esc(sp.name)} (${esc(tc.name)})</strong><span class="gold">${fmt(sp.baseZar, sp.countryId)}</span></div><div class="muted">${esc(sp.cat)} · <span class="scarcity-badge">${ssc.emoji} ${esc(ssc.label)}</span></div><div class="grid2" style="margin-top:6px;"><button class="btn btn-dark btn-sm" onclick="LSW.orderSupplier('${esc(sp.id)}',true)">🔍 Sample (${fmt(800)})</button><button class="btn btn-gold btn-sm" onclick="LSW.orderSupplier('${esc(sp.id)}',false)">📦 Order Stock</button></div></div>`;
          }).join('')}
          <div class="between" style="margin-top:6px;"><button class="btn btn-dark btn-sm" ${supPage <= 0 ? 'disabled' : ''} onclick="LSW.setSupplierPage(${supPage - 1})">← Prev</button><span class="muted">Page ${supPage + 1}</span><button class="btn btn-dark btn-sm" ${supPage >= supMax ? 'disabled' : ''} onclick="LSW.setSupplierPage(${supPage + 1})">Next →</button></div>
        </div>
      `;
    } else if (effectiveWv === 'mining') {
      sub = `
        <div class="card">
          <div class="between"><h3>⛏️ Mining Ops</h3><span class="gold">${G.mining.equipLeft} Drills left</span></div>
          <div class="pill-strip">${MINING_SECTORS.map((m, i) => `<button class="pill-btn ${G.mining.sectorIdx === i ? 'active' : ''}" onclick="LSW.setMiningSector(${i})">${esc(m.name)}</button>`).join('')}</div>
          <div class="card-alt">Phase ${G.mining.stepIdx}: <strong>${esc(MINING_STEPS[G.mining.stepIdx] || MINING_STEPS[0])}</strong> ${barHtml((G.mining.stepIdx / 7) * 100, 'gold-fill')}</div>
          <button class="btn btn-gold" onclick="LSW.miningAdvanceStep()">⛏️ Execute Major Step</button>
          ${MINING_ALL_MINERALS.map(mn => `<div class="card-alt between"><div><strong>${esc(mn.name)}</strong> ($${mn.usdPrice} USD)</div><button class="btn btn-blue btn-sm" onclick="LSW.doMiningEquipDrill('${mn.id}')">Drill (${G.mining.equipLeft})</button></div>`).join('')}
        </div>
      `;
    } else if (effectiveWv === 'dev') {
      const dept = DEV_DEPTS[G.devStudio.deptIdx] || DEV_DEPTS[0];
      sub = `
        <div class="card">
          <h3>💻 Developer Studio (6 Departments)</h3>
          <div class="pill-strip">${DEV_DEPTS.map((d, i) => `<button class="pill-btn ${G.devStudio.deptIdx === i ? 'active' : ''}" onclick="LSW.setDevDept(${i})">${esc(d.name)}</button>`).join('')}</div>
          <div class="card-alt">Dept: <strong class="gold">${esc(dept.name)}</strong> · Shipped: ${G.devStudio.shipped} · Passive: ${fmt(G.devStudio.revenueMonthly)}/mo</div>
          <div class="card-alt">Sprint ${G.devStudio.stepIdx}: ${esc(DEV_STEPS[G.devStudio.stepIdx] || DEV_STEPS[0])} ${barHtml((G.devStudio.stepIdx / 7) * 100, 'blue-fill')}</div>
          <button class="btn btn-blue" onclick="LSW.devAdvanceStep()">💻 Advance Dev Sprint</button>
        </div>
      `;
    } else if (effectiveWv === 'innovation') {
      const inno = G.innovation || { patents: 0, activeIdeas: [], history: [], selectedDeptId: 'med' };
      const selDept = INNOVATION_DEPARTMENTS.find(d => d.id === (inno.selectedDeptId || 'med')) || INNOVATION_DEPARTMENTS[0];
      const speed = getEducationSpeedMult();
      sub = `
        <div class="card" style="border-color:var(--accent);">
          <div class="between"><h3>🔬 Innovation — 10 Departments</h3><span class="gold">Patents: ${inno.patents || 0} · Speed ${speed}x</span></div>
          <div class="muted">Active Ideas: <strong>${(inno.activeIdeas || []).length}</strong> · Major Step: <strong class="${G.majorStepUsedThisMonth ? 'warn' : 'good'}">${G.majorStepUsedThisMonth ? 'Used' : 'Available'}</strong></div>
          ${(inno.activeIdeas || []).map(p => `
            <div class="card-alt" style="margin-top:6px;">
              <div class="between"><strong>${p.icon || '🔬'} ${esc(p.name)}</strong><span class="gold">${Math.min(p.totalSteps, p.step)} of ${p.totalSteps}</span></div>
              <div class="muted">${esc(p.deptName)} · ${esc(p.diff)} · ${esc(p.pot)} Pot</div>
              ${barHtml((p.step / p.totalSteps) * 100, 'gold-fill')}
              <div class="grid2" style="margin-top:6px;">
                <button class="btn btn-gold btn-sm" onclick="LSW.advanceInnoIdea('${esc(p.uid)}')">▶ Advance</button>
                <button class="btn btn-danger btn-sm" onclick="LSW.abandonInnoIdea('${esc(p.uid)}')">Abandon</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="card">
          <div class="pill-strip" style="margin-bottom:8px;">
            ${INNOVATION_DEPARTMENTS.map(d => `<button class="pill-btn ${d.id === selDept.id ? 'active' : ''}" onclick="LSW.setInnoDept('${d.id}')">${d.icon} ${esc(d.name)}</button>`).join('')}
          </div>
          <div class="card-alt" style="border-color:var(--accent);">
            <div class="between"><strong>${selDept.icon} ${esc(selDept.name)}</strong><span class="gold">Cost: ${selDept.costTier} (${G.age < 18 ? 'Free R&D' : fmt(Math.round(selDept.baseCost * c.costMult * 0.35))})</span></div>
            <div class="muted">Req: ${Object.entries(selDept.reqStats).map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)} ${v}+`).join(' · ')}</div>
            <div class="good" style="font-size:0.84em;margin-top:4px;">🌍 ${esc(selDept.whyFit(c))}</div>
            <div class="warn" style="font-size:0.8em;">⚖️ ${esc(selDept.rulesNote)}</div>
          </div>
          ${selDept.ideas.map((idObj, ii) => `
            <div class="card-alt between">
              <div>
                <strong>${esc(idObj.name)}</strong> <span class="scarcity-badge">${esc(idObj.diff)}</span>
                <div class="muted">${esc(idObj.type)} · ${esc(idObj.pot)} Potential · Est ${fmt(idObj.payout)}</div>
              </div>
              <button class="btn btn-blue btn-sm" onclick="LSW.startInnoIdea('${selDept.id}',${ii})">Start</button>
            </div>
          `).join('')}
          ${(inno.history || []).length ? `
            <details class="collap" style="margin-top:8px;">
              <summary>📜 Past Innovations History (${inno.history.length})</summary>
              <div style="margin-top:6px;">${inno.history.map(h => `<div class="card-alt between"><span>${h.icon || '💡'} ${esc(h.name)} (Age ${h.age})</span><span class="${h.cash > 0 ? 'gold' : 'muted'}">${esc(h.outcome)}${h.cash > 0 ? ' · ' + fmt(h.cash) : ''}</span></div>`).join('')}</div>
            </details>
          ` : ''}
        </div>
      `;
    } else if (effectiveWv === 'company') sub = renderCompaniesAllHtml();
    else sub = renderEducationUnifiedHtml();

    return `${myEduTopCard}${dashboard}<div class="pill-strip" style="margin-bottom:8px;">${wPills.map(([k, l]) => `<button class="pill-btn ${effectiveWv === k ? 'active' : ''}" onclick="LSW.setSub('workView','${k}')">${l}</button>`).join('')}</div>${sub}`;
  }

  function renderFinance() {
    const fv = UI_STATE.financeView;
    const pills = [['banks', '🏦 Banks'], ['cards', '💳 Cards'], ['invest', '📈 Invest'], ['houses', '🏠 Houses'], ['cars', '🚗 Cars'], ['estate', '📜 Will']];
    let body = '';
    if (fv === 'banks') {
      body = `<div class="card"><h3>🏦 Banks in ${esc(getCountry().name)}</h3>${Object.values(G.banks).map(b => `<div class="card-alt"><strong>${esc(b.name)}</strong><div class="muted">Checking: ${fmt(b.checking)} · Savings: ${fmt(b.savings)} · Loan: ${fmt(b.loan)}</div><div class="grid3" style="margin-top:4px;"><button class="btn btn-gold btn-sm" onclick="LSW.bankOp('${esc(b.name)}','depSav')">+Save</button><button class="btn btn-blue btn-sm" onclick="LSW.bankOp('${esc(b.name)}','withSav')">-Withd</button><button class="btn btn-dark btn-sm" onclick="LSW.bankOp('${esc(b.name)}','loan')">Loan</button></div></div>`).join('')}</div>`;
    } else if (fv === 'cards') {
      body = `<div class="card"><h3>💳 Cards</h3>${G.cards.map((cd, i) => `<div class="card-alt between"><div><strong>${esc(cd.type)}</strong> (${esc(cd.bank)})</div><span class="gold">${fmt(cd.balance)}</span></div>`).join('')}</div>`;
    } else if (fv === 'invest') {
      body = `<div class="card"><h3>📈 Investments</h3>${Object.entries(G.investments).map(([k, iv]) => `<div class="card-alt"><div class="between"><strong>${esc(iv.name)}</strong><span class="gold">${fmt(iv.price)}</span></div><div class="muted">Owned: ${iv.units} (${fmt(iv.units * iv.price)})</div><div class="grid2" style="margin-top:4px;"><button class="btn btn-gold btn-sm" onclick="LSW.tradeInv('${k}',1)">Buy 1</button><button class="btn btn-dark btn-sm" onclick="LSW.tradeInv('${k}',-1)">Sell 1</button></div></div>`).join('')}</div>`;
    } else if (fv === 'houses') {
      body = `
        <div class="card"><h3>🏠 Owned Homes (${G.houses.length})</h3>${G.houses.map((h, i) => `<div class="card-alt between"><div><strong>${esc(h.name)}</strong><div class="muted">${fmt(h.val)} · ${h.rentedOut ? 'Rented' : 'Residence'}</div></div><button class="btn btn-blue btn-sm" onclick="LSW.toggleRentHouse(${i})">${h.rentedOut ? 'Move In' : 'Rent Out'}</button></div>`).join('') || '<div class="muted">No houses owned yet.</div>'}</div>
        <div class="card"><h3>🏘️ Real Estate Market</h3>${HOUSES_CATALOG.map(h => `<div class="card-alt between"><div><strong>${esc(h.name)}</strong><div class="muted">${fmt(h.cost)} · Rent ${fmt(h.rent)}/mo</div></div><button class="btn btn-gold btn-sm" onclick="LSW.buyHouse('${h.id}')">Buy</button></div>`).join('')}</div>
      `;
    } else if (fv === 'cars') {
      body = `
        <div class="card"><h3>🚗 Garage (${G.cars.length})</h3>${G.cars.map((car, i) => `<div class="card-alt between"><div><strong>${esc(car.name)}</strong> (Fuel ${car.fuel}%)</div><button class="btn btn-blue btn-sm" onclick="LSW.refuelCar(${i})">Refuel</button></div>`).join('') || '<div class="muted">No cars owned yet.</div>'}</div>
        <div class="card"><h3>🏎️ Dealership</h3>${CARS_CATALOG.map(cr => `<div class="card-alt between"><div><strong>${esc(cr.name)}</strong><div class="muted">${fmt(cr.cost)}</div></div><button class="btn btn-gold btn-sm" onclick="LSW.buyCar('${cr.id}')">Buy</button></div>`).join('')}</div>
      `;
    } else {
      body = `<div class="card"><h3>📜 Will & Legacy Vault</h3><div class="card-alt">Net Worth: <strong class="gold">${fmt(calcNetWorth())}</strong> · Will: <strong>${G.will.written ? '100% to Child' : 'Default 75%'}</strong></div><button class="btn btn-gold" onclick="LSW.writeWill()">✍️ Draft Official Will (${fmt(1500)})</button>${LEGACY.gens.map(g => `<div class="card-alt">Gen ${g.gen}: ${esc(g.name)} (${fmt(g.netWorth)})</div>`).join('')}</div>`;
    }
    return `<div class="pill-strip" style="margin-bottom:8px;">${pills.map(([k, l]) => `<button class="pill-btn ${fv === k ? 'active' : ''}" onclick="LSW.setSub('financeView','${k}')">${l}</button>`).join('')}</div>${body}`;
  }

  function renderLife() {
    const c = getCountry();
    const lv = UI_STATE.lifeView;
    const pills = [
      ['hub', '🥾 Activities'], ['hobbies', '🎨 Hobbies'], ['racing', '🏎️ Racing'], ['auctions', '🔨 Auctions'],
      ['inv', `🎒 Inv (${(G.inventory || []).length})`], ['shops', `🛍️ Shops (${ALL_SHOP_ITEMS.length})`],
      ['food', '🍽️ Food (109)'], ['collections', '💎 Luxury (32)'], ['pets', '🐾 Pets'], ['crime', '🏴‍☠️ Crime & Mafia'], ['jail', '⚖️ Jail & Court']
    ];
    let body = '';

    if (lv === 'hub') {
      const acts = [['hiking', '🥾 Hiking'], ['fishing', '🎣 Fishing'], ['racing', '🏎️ Racing'], ['acting', '🎬 Acting'], ['music', '🎸 Music'], ['gym', '🏋️ Gym'], ['hunting', '🦌 Hunting'], ['camping', '⛺ Camping']];
      body = `<div class="card"><h3>🌟 Life Activities</h3><div class="grid2">${acts.map(([k, t]) => `<div class="card-alt"><strong>${t}</strong> (Lv ${(G.activities[k] || {}).lv || 1})<button class="btn btn-blue btn-sm" style="margin-top:4px;" onclick="LSW.doActivity('${k}')">Play</button></div>`).join('')}</div></div>`;
    } else if (lv === 'hobbies') {
      if (G.age < 16) {
        body = `<div class="card"><h3>🎨 Hobbies (Locked Until 16)</h3><div class="warn" style="margin-top:6px;">Non-school hobbies unlock at Age 16. Join School Clubs in Work -> Education!</div></div>`;
      } else {
        body = `<div class="card"><h3>🎨 Hobbies & Crafting</h3>${HOBBIES_CATALOG.map(hb => `<div class="card-alt between"><div><strong>${esc(hb.name)}</strong><div class="muted">${esc(hb.skill)}: ${G.skills[hb.skill] || 0} · Sells ~${fmt(hb.baseSell)}</div></div><button class="btn btn-gold btn-sm" onclick="LSW.craftHobby('${esc(hb.id)}')">Craft & Sell</button></div>`).join('')}</div>`;
      }
    } else if (lv === 'racing') {
      body = `<div class="card"><div class="between"><h3>🏎️ Garage & Racing</h3><span class="gold">🏆 Wins: ${G.racingWins || 0}</span></div>${RACING_LEAGUES.map(r => `<div class="card-alt between"><div><strong>${esc(r.name)}</strong><div class="muted">Entry ${fmt(r.fee)} · Prize ${fmt(r.prize)}</div></div><button class="btn btn-gold btn-sm" onclick="LSW.runRace('${esc(r.id)}')">Race</button></div>`).join('')}</div>`;
    } else if (lv === 'auctions') {
      body = `<div class="card"><div class="between"><h3>🔨 Global Auctions</h3><span class="gold">Won: ${(G.auctions && G.auctions.wonItems ? G.auctions.wonItems.length : 0)}</span></div>${AUCTIONS_CATALOG.map(au => `<div class="card-alt between"><div><strong>${esc(au.name)}</strong><div class="muted">Opening Bid: ${fmt(au.startZar, au.countryId)}</div></div><button class="btn btn-gold btn-sm" onclick="LSW.bidAuction('${esc(au.id)}')">Bid Now</button></div>`).join('')}</div>`;
    } else if (lv === 'inv') {
      const invAll = G.inventory || [];
      const invCat = UI_STATE.invCat || 'All';
      const shownInv = invAll.filter(x => invCat === 'All' || x.cat === invCat);
      body = `
        <div class="card" style="border-color:var(--accent);">
          <div class="between"><h3>🎒 Inventory & 12 Actions</h3><span class="gold">⚖️ ${getInventoryWeightKg()}kg</span></div>
          <div class="muted">Safe Cash: <strong class="gold">${fmt(G.safeCash || 0)}</strong> · Outfit: ${esc(G.equippedOutfit || 'None')}</div>
          <div class="pill-strip" style="margin-top:6px;">${SHOP_CATEGORIES.map(ct => `<button class="pill-btn ${invCat === ct ? 'active' : ''}" onclick="LSW.setInvCat('${ct}')">${ct}</button>`).join('')}</div>
        </div>
        ${(G.pendingDeliveries || []).length ? `<div class="card"><strong class="blue">📦 Pending Imports (${G.pendingDeliveries.length})</strong>${G.pendingDeliveries.map(d => `<div class="muted">${esc(d.name)} (${d.daysLeft}d)</div>`).join('')}</div>` : ''}
        <div class="card">
          ${shownInv.map(it => {
            const noDur = it.cat === 'Food' || it.cat === 'Medicine';
            return `
              <div class="card-alt">
                <div class="between"><strong>${esc(it.name)} ${(it.qty || 1) > 1 ? `(x${it.qty})` : ''} ${it.paintColor ? `🎨 ${esc(it.paintColor)}` : ''}</strong><span class="gold">${fmt(it.buyPriceZar || 300)}</span></div>
                <div class="muted">${esc(it.needLabel || it.need)} · Dur ${it.durability}% ${it.rented ? '· 💵 Rented' : ''}</div>
                <div class="pill-wrap" style="margin-top:6px;">
                  <button class="btn btn-gold btn-sm" onclick="LSW.useInventoryItem('${esc(it.uid)}')">▶ USE</button>
                  <button class="pill-btn" onclick="LSW.openInnovateModal('${esc(it.uid)}')">💡 Innovate</button>
                  <button class="pill-btn" onclick="LSW.openResearchItemModal('${esc(it.uid)}')">🔬 Research</button>
                  <button class="pill-btn" ${noDur ? 'disabled' : ''} onclick="LSW.openPaintModal('${esc(it.uid)}')">🎨 Paint</button>
                  <button class="pill-btn" onclick="LSW.sellInventoryItem('${esc(it.uid)}')">💰 Sell</button>
                  <button class="pill-btn" onclick="LSW.giftInventoryItem('${esc(it.uid)}')">🎁 Gift</button>
                  <button class="pill-btn" onclick="LSW.donateInventoryItem('${esc(it.uid)}')">🤝 Donate</button>
                  <button class="pill-btn" onclick="LSW.recycleInventoryItem('${esc(it.uid)}')">♻️ Recycle</button>
                  <button class="pill-btn" ${noDur ? 'disabled' : ''} onclick="LSW.repairInventoryItem('${esc(it.uid)}')">🔧 Repair</button>
                  <button class="pill-btn" ${noDur ? 'disabled' : ''} onclick="LSW.upgradeInventoryItem('${esc(it.uid)}')">⬆️ Upgrade</button>
                  <button class="pill-btn" onclick="LSW.lendInventoryItem('${esc(it.uid)}')">🤝 Lend</button>
                  <button class="pill-btn" ${noDur || G.age < 18 ? 'disabled' : ''} onclick="LSW.toggleRentInventoryItem('${esc(it.uid)}')">${it.rented ? '⏹ Stop Rent' : '💵 Rent Out'}</button>
                </div>
              </div>
            `;
          }).join('') || '<div class="muted">Inventory empty — visit Shops or go City Hunting!</div>'}
        </div>
      `;
    } else if (lv === 'shops') {
      const curCat = UI_STATE.shopCat || 'All';
      const curNeed = UI_STATE.shopNeedFilter || 'ALL';
      const qTxt = (UI_STATE.shopQuery || '').trim().toLowerCase();
      const filtered = ALL_SHOP_ITEMS.filter(it => (curCat === 'All' || it.cat === curCat) && (curNeed === 'ALL' || it.need === curNeed) && (!qTxt || it.name.toLowerCase().includes(qTxt) || it.needLabel.toLowerCase().includes(qTxt)));
      const pageSize = 20, maxPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
      const page = Math.min(maxPage, Math.max(0, UI_STATE.shopPage || 0));
      const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);
      const firstChk = (Object.values(G.banks || {})[0] || {}).checking || 0;
      const roomCap = getHouseRoomCapacity();

      body = `
        <div class="card">
          <h3>🗺️ City Hunting</h3>
          <div class="muted">Find at least 1 random item (2-month unique prices). Found: ${G.cityHunt.foundCount}</div>
          <button class="btn btn-gold btn-sm" style="margin-top:6px;" onclick="LSW.doCityHunt()">🔍 Go City Hunting</button>
        </div>
        <div class="card">
          <div class="between"><h3>🛍️ Global Shops (${ALL_SHOP_ITEMS.length} Items)</h3><span class="gold">${filtered.length} Match</span></div>
          <input type="text" placeholder="Search Tech, Furniture, Hardware, Medicine..." value="${esc(UI_STATE.shopQuery || '')}" oninput="LSW.setShopQuery(this.value)" />
          <div class="pill-strip">${SHOP_CATEGORIES.map(ct => `<button class="pill-btn ${curCat === ct ? 'active' : ''}" onclick="LSW.setShopCat('${ct}')">${esc(ct)}</button>`).join('')}</div>
          <div class="pill-strip" style="margin-bottom:8px;">
            <button class="pill-btn ${curNeed === 'ALL' ? 'active' : ''}" onclick="LSW.setShopNeed('ALL')">All 13 Needs</button>
            ${NEEDS_META.map(nm => `<button class="pill-btn ${curNeed === nm.key ? 'active' : ''}" onclick="LSW.setShopNeed('${nm.key}')">${nm.icon} ${esc(nm.name)}</button>`).join('')}
          </div>
          ${slice.map(it => {
            const sc = getItemScarcity(it, c.id);
            const priceZar = getEffectiveItemPriceZar(it, c.id);
            const hasRoom = !it.roomReq || (roomCap[it.roomReq] || 0) > 0;
            const canAfford = G.cash >= priceZar || firstChk >= priceZar || (isFamilyShieldActive() && Math.max(G.parents.mother.money, G.parents.father.money) >= priceZar);
            const dis = sc.tier === 'banned' || !canAfford || !hasRoom;
            return `
              <div class="card-alt">
                <div class="between"><strong>${esc(it.name)}</strong><span class="scarcity-badge">${sc.emoji} ${esc(sc.label)}</span></div>
                <div class="gold" style="font-size:0.86em;margin:2px 0;">${sc.tier === 'banned' ? '⛔ Banned locally' : fmtFull(priceZar, c.id)}</div>
                <div style="font-size:0.84em;"><strong>Need:</strong> ${esc(it.needLabel)} ${it.roomReq ? `· Room: ${esc(it.roomReq)}` : ''}</div>
                <div class="muted"><strong>Effect:</strong> ${esc(it.effect)}</div>
                <div class="bad" style="font-size:0.8em;"><strong>If Missing:</strong> ${esc(it.missEffect)}</div>
                <div class="grid2" style="margin-top:6px;">
                  <button class="btn ${dis ? 'btn-dark' : 'btn-gold'} btn-sm" ${dis ? 'disabled' : ''} onclick="LSW.buyGlobalShopItem('${esc(it.id)}')">${sc.tier === 'banned' ? '⛔ Banned' : !hasRoom ? '🏠 Need Room' : !canAfford ? '💸 Can\'t Afford' : 'Buy'}</button>
                  <button class="btn btn-blue btn-sm" onclick="LSW.openBuyOrTravelModal('${esc(it.id)}')">✈️ Travel / Import</button>
                </div>
              </div>
            `;
          }).join('')}
          <div class="between" style="margin-top:6px;">
            <button class="btn btn-dark btn-sm" ${page <= 0 ? 'disabled' : ''} onclick="LSW.setShopPage(${page - 1})">← Prev</button>
            <span class="muted">Page ${page + 1}</span>
            <button class="btn btn-dark btn-sm" ${page >= maxPage ? 'disabled' : ''} onclick="LSW.setShopPage(${page + 1})">Next →</button>
          </div>
        </div>
      `;
    } else if (lv === 'food') {
      body = `
        <div class="card">
          <h3>🍽️ Food Plans & Meals (${esc(G.belief)} · ${esc(G.culture)})</h3>
          ${FOOD_PLANS.map(fp => `<div class="card-alt between"><div><strong>${esc(fp.name)}</strong><div class="muted">${fmt(fp.cost)}/mo</div></div><button class="btn ${G.foodPlan === fp.id ? 'btn-gold' : 'btn-dark'} btn-sm" onclick="LSW.setFoodPlan('${fp.id}')">${G.foodPlan === fp.id ? 'Active' : 'Select'}</button></div>`).join('')}
          <div class="grid2" style="margin-top:8px;">
            ${FOOD_ITEMS.slice(0, 30).map(fi => `<div class="card-alt"><strong>${esc(fi.name)}</strong><div class="muted">${fmt(fi.cost)} · +${fi.eng}E</div><button class="btn btn-gold btn-sm" onclick="LSW.checkFoodAndEat('${fi.id}')">Eat</button></div>`).join('')}
          </div>
        </div>
      `;
    } else if (lv === 'collections') {
      body = `<div class="card"><h3>💎 Luxury Collections (${G.collections.length})</h3>${LUXURY_COLLECTIONS.map(col => { const own = G.collections.find(x => x.id === col.id); return `<div class="card-alt between"><div><strong>${esc(col.name)}</strong><div class="muted">${fmt(col.cost)}</div></div><button class="btn ${own ? 'btn-blue' : 'btn-gold'} btn-sm" onclick="LSW.${own ? `sellCollection('${col.id}')` : `buyCollection('${col.id}')`}">${own ? 'Sell' : 'Buy'}</button></div>`; }).join('')}</div>`;
    } else if (lv === 'pets') {
      body = `<div class="card"><h3>🐾 Pets (${G.pets.length})</h3>${G.pets.map((p, i) => `<div class="card-alt between"><span>${esc(p.name)} (${p.type}) · ${p.bond}%</span><button class="btn btn-gold btn-sm" onclick="LSW.petCare(${i},'play')">Play</button></div>`).join('')}<div class="grid3" style="margin-top:6px;">${[['Dog', 1200], ['Cat', 900], ['Bird', 600]].map(([t, cs]) => `<button class="btn btn-dark btn-sm" onclick="LSW.adoptPet('${t}',${cs})">+ ${t} (${fmt(cs)})</button>`).join('')}</div></div>`;
    } else if (lv === 'crime') {
      body = `
        <div class="card">
          <h3>🏴‍☠️ Crime & Mafia (${G.streetRespect >= 75 ? 'UNLOCKED' : 'Need 75 Street Rep'})</h3>
          <div class="grid2">
            <button class="btn btn-danger btn-sm" onclick="LSW.attemptCarSteal('smash')">🚗 Car Steal (20%)</button>
            <button class="btn btn-danger btn-sm" onclick="LSW.attemptCarSteal('clone')">🔑 Key Clone (60%)</button>
            <button class="btn btn-blue btn-sm" onclick="LSW.buyFakePassport()">🛂 Fake Passport (${fmt(18000)})</button>
          </div>
          ${MAFIA_JOBS.map(mj => `<div class="card-alt between" style="margin-top:6px;"><div><strong>${esc(mj.name)}</strong><div class="muted">Req ${mj.reqRep} Street · ${fmt(mj.pay)}</div></div><button class="btn btn-danger btn-sm" onclick="LSW.mafiaOp('${mj.id}')">Execute</button></div>`).join('')}
        </div>
      `;
    } else {
      body = `
        <div class="card">
          <h3>⚖️ Court & Prison</h3>
          ${G.jail.pendingCase ? `<div class="card-alt"><strong class="bad">Pending Case: ${esc(G.jail.pendingCase.charge)}</strong><div class="grid2" style="margin-top:6px;"><button class="btn btn-gold btn-sm" onclick="LSW.resolvePendingTrial(true)">👔 Hire Lawyer (${fmt(9500)})</button><button class="btn btn-danger btn-sm" onclick="LSW.resolvePendingTrial(false)">Face Judge</button></div></div>` : '<div class="muted">No criminal trials pending.</div>'}
          ${G.jail.inJail ? `<div class="card-alt"><strong class="bad">Months Left: ${G.jail.monthsLeft} · Respect: ${G.jail.respect}</strong><div class="grid3" style="margin-top:6px;"><button class="btn btn-gold btn-sm" onclick="LSW.jailAction('chores')">🧹 Chores</button><button class="btn btn-blue btn-sm" onclick="LSW.jailAction('learn')">📚 Learn</button><button class="btn btn-dark btn-sm" onclick="LSW.jailAction('respect')">💪 Respect</button><button class="btn btn-danger btn-sm" onclick="LSW.jailAction('disrespect')">😠 Confront</button><button class="btn btn-blue btn-sm" onclick="LSW.jailAction('appeal')">⚖️ Appeal</button><button class="btn btn-danger btn-sm" onclick="LSW.jailAction('escape')">🏃 Escape</button></div></div>` : ''}
          <button class="btn btn-blue" style="margin-top:8px;" onclick="LSW.suePersonModal()">⚖️ Sue in Civil Court</button>
        </div>
      `;
    }
    return `<div class="pill-strip" style="margin-bottom:8px;">${pills.map(([k, l]) => `<button class="pill-btn ${lv === k ? 'active' : ''}" onclick="LSW.setSub('lifeView','${k}')">${l}</button>`).join('')}</div>${body}`;
  }

  function renderWorld() {
    const curC = getCountry();
    const wv = UI_STATE.worldView || 'airport';
    const wPills = [['airport', '✈️ Airport & Bus'], ['countries', `🌍 ${COUNTRIES.length} Countries`], ['laws', '⚖️ Laws'], ['settings', '⚙️ Settings']];
    let body = '';

    if (wv === 'airport') {
      const toCid = UI_STATE.flightToCid || (COUNTRIES.find(x => x.id !== curC.id) || curC).id;
      const destC = getCountry(toCid);
      const toCity = destC.cities.includes(UI_STATE.flightToCity) ? UI_STATE.flightToCity : destC.cities[0];
      const tktId = UI_STATE.flightTicketId || 'economy';
      const alId = UI_STATE.flightAirlineId || 'al_std';
      const season = UI_STATE.flightSeason || 'normal';
      const q = computeFlightQuote(toCid, toCity, tktId, alId, season);
      const visaExp = (G.visaExpiry && G.visaExpiry[toCid]) || 0;
      const carryKg = getInventoryWeightKg();
      const maxKg = q.tkt.luggageKg || 20;
      const overKg = Math.max(0, carryKg - maxKg);
      const deals = ALL_SHOP_ITEMS.filter(it => getItemScarcity(it, toCid).tier === 'abundant' && ['rare', 'scarce'].includes(getItemScarcity(it, curC.id).tier)).slice(0, 4);

      body = `
        <div class="card" style="border-color:var(--accent);">
          <div class="between"><h3>✈️ International Airport</h3><span class="gold">${esc(G.city)}, ${esc(curC.name)} (${esc(curC.cur)})</span></div>
          <div class="grid2" style="margin-top:6px;">
            <div><label class="muted">Destination Country</label><select onchange="LSW.setFlightCfg('flightToCid',this.value)">${COUNTRIES.map(cn => `<option value="${cn.id}" ${cn.id === toCid ? 'selected' : ''}>${esc(cn.name)} (${esc(cn.cur)})</option>`).join('')}</select></div>
            <div><label class="muted">City</label><select onchange="LSW.setFlightCfg('flightToCity',this.value)">${destC.cities.map(ct => `<option value="${esc(ct)}" ${ct === toCity ? 'selected' : ''}>${esc(ct)}</option>`).join('')}</select></div>
            <div><label class="muted">Airline</label><select onchange="LSW.setFlightCfg('flightAirlineId',this.value)">${AIRLINES_CATALOG.map(a => `<option value="${a.id}" ${a.id === alId ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></div>
            <div><label class="muted">Season</label><select onchange="LSW.setFlightCfg('flightSeason',this.value)"><option value="normal" ${season === 'normal' ? 'selected' : ''}>Normal (1x)</option><option value="peak" ${season === 'peak' ? 'selected' : ''}>Peak (1.5x)</option><option value="off" ${season === 'off' ? 'selected' : ''}>Off-Peak (0.8x)</option></select></div>
          </div>
          <div class="pill-strip" style="margin-top:6px;">${TICKET_TYPES.map(t => `<button class="pill-btn ${t.id === tktId ? 'active' : ''}" onclick="LSW.setFlightCfg('flightTicketId','${t.id}')">${esc(t.name)}</button>`).join('')}</div>
          <div class="card-alt" style="margin-top:6px;">
            <div class="between"><strong>${esc(G.city)} → ${esc(toCity)}</strong><span class="gold">${q.distKm.toLocaleString()} km · ${q.hours}h</span></div>
            <div class="muted">Luggage Cap: <strong>${maxKg}kg</strong> · Gear Weight: <strong class="${overKg ? 'warn' : 'good'}">${carryKg}kg</strong> ${overKg ? `(+${overKg}kg fee ${fmt(overKg * 45)})` : ''}</div>
            <div class="muted">VIP Lounge: <strong class="${q.tkt.loungeAccess ? 'good' : 'warn'}">${q.tkt.loungeAccess ? '✅ Included' : '🔒 Business & First Only'}</strong></div>
            <div class="gold" style="margin-top:4px;">Total: ${fmtFull(q.zarTotal, curC.id)}</div>
          </div>
          ${deals.length ? `<div class="card-alt"><strong class="gold">📦 Scarcity Arbitrage in ${esc(destC.name)}:</strong><div class="pill-wrap" style="margin-top:4px;">${deals.map(it => `<button class="pill-btn" onclick="LSW.openBuyOrTravelModal('${esc(it.id)}')">${esc(it.name)}</button>`).join('')}</div></div>` : ''}
          <div class="card-alt between"><span>🛂 Visa (${esc(destC.name)}): <strong class="${toCid === curC.id || visaExp > G.totalMonths ? 'good' : 'warn'}">${toCid === curC.id ? 'Domestic' : visaExp > G.totalMonths ? `${visaExp - G.totalMonths}m left` : 'Required'}</strong></span>${toCid !== curC.id ? `<button class="btn btn-blue btn-sm" onclick="LSW.buyOrRenewVisa('${toCid}')">5-Yr Visa (${fmt(visaExp > 0 ? 2200 : 4400)})</button>` : ''}</div>
          <div class="grid3" style="margin-top:6px;">
            <button class="btn btn-gold btn-sm" onclick="LSW.flyToDestination('${toCid}','${esc(toCity)}','${tktId}','${alId}','${season}',false)">✈️ Fly</button>
            <button class="btn btn-blue btn-sm" onclick="LSW.takeBusOrTrain('bus','${toCid}','${esc(toCity)}')">🚌 Bus</button>
            <button class="btn btn-dark btn-sm" onclick="LSW.takeBusOrTrain('train','${toCid}','${esc(toCity)}')">🚆 Train</button>
          </div>
          ${G.ownedPlanes.length ? `<button class="btn btn-gold" style="margin-top:6px;" onclick="LSW.flyToDestination('${toCid}','${esc(toCity)}','${tktId}','${alId}','${season}',true)">🛩️ Fly Private Jet</button>` : ''}
        </div>
        <div class="card">
          <div class="between"><h3>🚌 Bus Station & Commercial Routes</h3><span class="gold">Routes: ${(G.busStation && G.busStation.doneCount) || 0}</span></div>
          <div class="muted" style="margin-bottom:6px;">Operate intercity coach & tour charters (Age 16+).</div>
          ${BUS_TENDERS.map(bt => `<div class="card-alt between"><div><strong>${esc(bt.title)}</strong><div class="muted">${fmt(bt.payZar, bt.destId)}</div></div><button class="btn btn-gold btn-sm" onclick="LSW.runBusRoute('${esc(bt.id)}')">Run Route</button></div>`).join('')}
        </div>
        <div class="card"><h3>🛩️ Private Jets</h3>${OWNED_PLANES_CATALOG.map(p => `<div class="card-alt between"><div><strong>${esc(p.name)}</strong><div class="muted">${fmt(p.cost)} · ${p.rangeKm}km</div></div><button class="btn btn-blue btn-sm" onclick="LSW.buyAirplane('${p.id}')">Buy</button></div>`).join('')}</div>
      `;
    } else if (wv === 'countries') {
      body = `
        <div class="card">
          <h3>🌍 Global Countries Directory (${COUNTRIES.length} Nations)</h3>
          <div class="muted" style="margin-bottom:8px;">Every country features real capitals, biggest cities, 4–5 cities, local currency symbols, law systems, school systems, salary & cost multipliers, and languages.</div>
          ${COUNTRIES.map(cn => `
            <div class="card-alt" style="${cn.id === curC.id ? 'border-color:var(--accent);' : ''}">
              <div class="between"><strong>${esc(cn.name)} (${esc(cn.cur)} ${cn.code})</strong><span class="gold">${cn.id === curC.id ? '📍 Current' : `Cost ${cn.costMult}x · Sal ${cn.salIdx}x`}</span></div>
              <div class="muted"><strong>Capital:</strong> ${esc(cn.capital)} · <strong>Biggest:</strong> ${esc(cn.biggest)}</div>
              <div class="muted"><strong>Cities:</strong> ${cn.cities.map(esc).join(', ')}</div>
              <div class="muted"><strong>Law:</strong> ${esc(cn.lawSystem)}</div>
              <div class="muted"><strong>School:</strong> ${esc(cn.schoolSystem)} · <strong>Lang:</strong> ${esc(cn.lang)}</div>
              ${cn.id !== curC.id ? `<button class="btn btn-blue btn-sm" style="margin-top:6px;" onclick="LSW.setFlightCfg('flightToCid','${cn.id}');LSW.setSub('worldView','airport');">✈️ Travel to ${esc(cn.name)}</button>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (wv === 'laws') {
      body = `
        <div class="card" style="border-color:var(--accent);">
          <h3>⚖️ Laws & Compliance — ${esc(curC.name)}</h3>
          <div class="card-alt"><strong>Law System:</strong> ${esc(curC.lawSystem)}</div>
          <div class="card-alt"><strong>School System:</strong> ${esc(curC.schoolSystem)}</div>
          <div class="card-alt"><strong>Income Tax:</strong> ${curC.taxPct}% · <strong>Police Strictness:</strong> ${curC.laws.policeStrict}</div>
          <div class="card-alt"><strong>Legal Ages:</strong> Driver & Labour: 16–18 · Bribery, Crime & Contracts: 18+ · Marriage: 18+</div>
          <div class="card-alt"><strong>My Legal Record:</strong> Arrests: ${G.criminalRecord || 0} · Police Heat: ${G.policeHeat || 0} · Pending Case: ${G.jail.pendingCase ? esc(G.jail.pendingCase.charge) : 'None'}</div>
        </div>
      `;
    } else {
      const curTheme = getSavedThemeId();
      const s = G.settings || {};
      const curD = G.difficulty || 'normal';
      body = `
        <div class="card" style="border-color:var(--accent);">
          <h3>🎨 Locked Theme Selector (World Settings Only)</h3>
          <div class="muted">Themes change the entire app and the 3 loader ovals immediately. Saved to <code>lsw-theme</code>.</div>
          <div class="theme-grid">
            ${Object.values(THEMES).map(th => `
              <button type="button" class="theme-card ${curTheme === th.id ? 'active' : ''}" style="background:${th.bg};color:${th.text};" onclick="LSW.setTheme('${th.id}')">
                <div>${esc(th.name)} ${curTheme === th.id ? '✓' : ''}</div>
                <div class="theme-dots">
                  <span class="theme-dot" style="background:${th.accent};"></span>
                  <span class="theme-dot" style="background:${th.o1};"></span>
                  <span class="theme-dot" style="background:${th.o2};"></span>
                  <span class="theme-dot" style="background:${th.o3};"></span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <h3>🌙 Focus Mode / Do Not Disturb</h3>
          <div class="muted">${s.focusMode ? 'You are in your zone. We will not bother you.' : 'Mute rate prompts and optional hints for calm immersion.'}</div>
          <button class="btn ${s.focusMode ? 'btn-gold' : 'btn-dark'} btn-sm" style="margin-top:6px;" onclick="LSW.toggleFocusMode()">${s.focusMode ? '🌙 Focus Mode: ON' : '🌙 Turn On Focus Mode'}</button>
        </div>
        <div class="card">
          <h3>🎮 Difficulty Mode</h3>
          <div class="grid3">
            ${['easy', 'normal', 'hard'].map(did => `<button class="btn ${curD === did ? 'btn-gold' : 'btn-dark'} btn-sm" onclick="LSW.confirmSetDifficulty('${did}')">${esc(DIFFICULTY_PROFILES[did].shortName || did)}</button>`).join('')}
          </div>
          <div class="muted" style="margin-top:6px;">${esc(getDiff().desc)}</div>
        </div>
        <div class="card">
          <h3>⚙️ Gameplay & Save Controls</h3>
          <div class="grid3">
            <button class="btn ${s.fontSize === 'small' ? 'btn-gold' : 'btn-dark'} btn-sm" onclick="LSW.updateSetting('fontSize','small')">Font S</button>
            <button class="btn ${(s.fontSize || 'normal') === 'normal' ? 'btn-gold' : 'btn-dark'} btn-sm" onclick="LSW.updateSetting('fontSize','normal')">Font M</button>
            <button class="btn ${s.fontSize === 'large' ? 'btn-gold' : 'btn-dark'} btn-sm" onclick="LSW.updateSetting('fontSize','large')">Font L</button>
          </div>
          <div class="grid2" style="margin-top:6px;">
            <button class="btn btn-blue btn-sm" onclick="LSW.exportSaveJson()">📤 Export JSON Save</button>
            <button class="btn btn-danger btn-sm" onclick="LSW.openResetConfirmModal(1)">🗑️ Reset Save</button>
          </div>
        </div>
      `;
    }

    return `<div class="pill-strip" style="margin-bottom:8px;">${wPills.map(([k, l]) => `<button class="pill-btn ${wv === k ? 'active' : ''}" onclick="LSW.setSub('worldView','${k}')">${l}</button>`).join('')}</div>${body}`;
  }

  function routeMenuTarget(p) {
    const map = {
      logistics: ['work', 'workView', 'logistics'],
      tenders: ['work', 'workView', 'tenders'],
      suppliers: ['work', 'workView', 'suppliers'],
      hobbies: ['life', 'lifeView', 'hobbies'],
      garage_racing: ['life', 'lifeView', 'racing'],
      racing: ['life', 'lifeView', 'racing'],
      auctions: ['life', 'lifeView', 'auctions'],
      bus: ['world', 'worldView', 'airport'],
      compliance_laws: ['world', 'worldView', 'laws'],
      laws: ['world', 'worldView', 'laws']
    };
    const m = map[p] || ['work', 'workView', 'education'];
    UI_STATE.tab = m[0];
    UI_STATE[m[1]] = m[2];
    UI_STATE.menuPage = null;
    closeModal();
    closeSearchPanel();
    render();
  }

  function openGlobalMenu() {
    routeMenuTarget('logistics');
  }

  function render() {
    if (!G) return;
    renderHUD();
    const views = { home: renderHome, people: renderPeople, work: renderWork, finance: renderFinance, life: renderLife, world: renderWorld };
    $('mainContent').innerHTML = (views[UI_STATE.tab] || renderHome)();
  }

  /* ============================================================
     14. EXPORT PUBLIC CONTROLLER (window.LSW) & BOOT
     ============================================================ */
  window.LSW = {
    MONTH_NAMES,
    getSavedThemeId, applyTheme, setTheme, openWorldSettings,
    startRandomLife, toggleCustomForm, updateCustomCountry, onCustomSelectOther, birthCustomCharacter, openStartScreen,
    closeModal, restNow, pickEventOption, advanceMonth, continueAsChild,
    guardTap, rateAction, showRatePopup,
    continueSlowMoment, openMemoriesModal, toggleFocusMode,
    checkFoodAndEat, openWeddingModal, executeWedding, openChildNamingModal, confirmBirthChild,
    openFuneralPopup, childFuneralChoice, adultSelectFuneralOption, adultChoosePayer, adultChooseDress, adultChooseTribute,
    getSeasonName, claimMajorStep, getEducationSpeedMult, getEduSalaryMult, getEduCurrentLabel,
    switchTab: t => { UI_STATE.tab = t; UI_STATE.menuPage = null; closeSearchPanel(); render(); },
    setSub: (k, v) => { UI_STATE[k] = v; UI_STATE.menuPage = null; render(); },
    openMenuPage: routeMenuTarget,
    openGlobalMenu, openReportModal,
    setShopCat: c => { UI_STATE.shopCat = c; UI_STATE.shopPage = 0; render(); },
    setShopNeed: n => { UI_STATE.shopNeedFilter = n; UI_STATE.shopPage = 0; render(); },
    setShopQuery: q => { UI_STATE.shopQuery = q; UI_STATE.shopPage = 0; render(); },
    setShopPage: p => { UI_STATE.shopPage = Math.max(0, p); render(); },
    setSupplierPage: p => { UI_STATE.supplierPage = Math.max(0, p); render(); },
    setSupplierQuery: q => { UI_STATE.supplierQuery = q; UI_STATE.supplierPage = 0; render(); },
    setInvCat: c => { UI_STATE.invCat = c; render(); },
    setCompCountry: cid => { UI_STATE.compCountryId = cid; render(); },
    setJobSearch: v => { UI_STATE.jobSearch = v; render(); },
    setJobSector: s => { UI_STATE.jobSector = s; render(); },
    setMiningSector: i => { G.mining.sectorIdx = i; G.mining.stepIdx = 0; render(); },
    setDevDept: i => { G.devStudio.deptIdx = i; G.devStudio.stepIdx = 0; render(); },
    setFlightCfg: (k, v) => { UI_STATE[k] = v; if (k === 'flightToCid') UI_STATE.flightToCity = getCountry(v).cities[0]; render(); },
    applyForJob, gradeJobInterview, workHonestly, openWorkplaceCrimeModal, executeWorkplaceCrime, openSocializeCoworkersModal,
    miningAdvanceStep, doMiningEquipDrill, devAdvanceStep,
    setInnoDept, startInnoIdea, advanceInnoIdea, abandonInnoIdea,
    foundOrBuyCompany, openHireApplicantsModal, signHiredApp, staffAction, createCompanyProduct,
    sellCompany: () => { const v = G.company.valuation; G.company = null; earnMoney(v, 'Sold Company'); saveAll(); render(); },
    openCertQuizModal, gradeCertQuiz,
    playPreschoolAction, studyEducation, doAssignment, takeEducationExam, attemptDropOut,
    setJuniorElective, toggleSeniorElective, enrollTvet, advanceTvetLevel, enrollUni, advanceUniYear,
    startOnlineCourse, stepOnlineCourse, takeAdvancedProgram, readLibraryBook, takeTutoring,
    studySchool: studyEducation,
    toggleClub: cl => { const i = G.school.clubs.indexOf(cl); if (i >= 0) G.school.clubs.splice(i, 1); else G.school.clubs.push(cl); saveAll(); render(); },
    makeNewFriend, friendAction, proposeMarriage: openWeddingModal, familyRelAction, openPocketMoneyDisclaimer, piggyOp,
    haveChildNow: openChildNamingModal,
    createSocial: pl => { G.socials.push({ platform: pl, followers: rand(30, 150), posts: 0 }); saveAll(); render(); },
    postSocial: pl => { if (!guardTap('social_' + pl)) return; if (!useEnergy(8)) return; const s = G.socials.find(x => x.platform === pl); s.posts++; s.followers += rand(50, 500); earnMoney(Math.round(s.followers * 0.45), `${pl} Post`); saveAll(); render(); },
    bankOp: (bn, op) => { const b = G.banks[bn]; if (!b) return; if (op === 'depSav' && chargeMoney(1000, 'Save')) b.savings += 1000; else if (op === 'withSav' && b.savings >= 1000) { b.savings -= 1000; earnMoney(1000, 'Withdraw'); } else if (op === 'loan' && G.age >= 18) { b.loan += 5000; earnMoney(5000, 'Loan'); } saveAll(); render(); },
    tradeInv: (k, dir) => { const iv = G.investments[k]; if (dir > 0 && chargeMoney(iv.price, iv.name)) iv.units++; else if (dir < 0 && iv.units > 0) { iv.units--; earnMoney(iv.price, iv.name); } saveAll(); render(); },
    buyHouse: hid => { const h = HOUSES_CATALOG.find(x => x.id === hid); if (!h || !chargeMoney(h.cost, h.name)) return; G.houses.push({ ...h, val: h.cost, rentedOut: false, rentIncome: h.rent, amenities: [] }); saveAll(); render(); },
    toggleRentHouse: i => { G.houses[i].rentedOut = !G.houses[i].rentedOut; saveAll(); render(); },
    buyCar: cid => { const c = CARS_CATALOG.find(x => x.id === cid); if (!c || !chargeMoney(c.cost, c.name)) return; G.cars.push({ ...c, val: c.cost, fuel: 100 }); saveAll(); render(); },
    refuelCar: i => { if (G.cars[i] && chargeMoney(650, 'Fuel')) { G.cars[i].fuel = 100; saveAll(); render(); } },
    writeWill: () => { if (chargeMoney(1500, 'Will')) { G.will.written = true; showToast('Official Will registered!'); saveAll(); render(); } },
    doCityHunt, setFoodPlan: id => { G.foodPlan = id; saveAll(); render(); },
    buyFoodItem: checkFoodAndEat,
    buyCollection: id => { const c = LUXURY_COLLECTIONS.find(x => x.id === id); if (c && chargeMoney(c.cost, c.name)) { G.collections.push({ ...c, val: c.cost }); saveAll(); render(); } },
    sellCollection: id => { const i = G.collections.findIndex(x => x.id === id); if (i >= 0) { const c = G.collections.splice(i, 1)[0]; earnMoney(c.val, c.name); saveAll(); render(); } },
    adoptPet: (type, cost) => { if (chargeMoney(cost, type)) { G.pets.push({ type, name: pick(['Buddy', 'Luna', 'Milo', 'Rex']), bond: 75 }); saveAll(); render(); } },
    petCare: i => { if (!guardTap('pet_' + i)) return; if (G.pets[i]) { G.pets[i].bond = clamp(G.pets[i].bond + 10); showToast('Played with pet!'); saveAll(); render(); } },
    doActivity: k => { if (G.mourningWeekActive && ['music', 'racing', 'acting'].includes(k)) { openModal(`<h3 class="warn">🕯️ Family Mourning</h3><div class="card-alt">Your family is mourning. Partying and celebrations are paused for now.</div><button class="btn btn-gold" onclick="LSW.closeModal()">Understood</button>`); return; } if (!guardTap('act_' + k)) return; if (!useEnergy(12)) return; const a = G.activities[k]; if (!a) return; a.xp += 35; if (a.xp >= 100) { a.lv++; a.xp -= 100; } G.stats.happy = clamp(G.stats.happy + 7); saveAll(); render(); },
    craftHobby, runRace, dispatchLogistics, buyFleetTruck, bidTender, bidAuction, runBusRoute,
    attemptCarSteal, resolvePendingTrial, jailAction, suePersonModal, executeLawsuit, mafiaOp, buyFakePassport, orderSupplier,
    acceptSystemOffer, rejectSystemOffer,
    buyOrRenewVisa, buyAirplane, flyToDestination, enterAirportLounge, boardPendingFlight, takeBusOrTrain,
    buyGlobalShopItem, openBuyOrTravelModal, importGlobalItem,
    useInventoryItem, safeOp, openInnovateModal, executeInnovation, openResearchItemModal, submitItemResearch,
    openPaintModal, applyPaintItem, sellInventoryItem, giftInventoryItem, donateInventoryItem,
    recycleInventoryItem, repairInventoryItem, upgradeInventoryItem, lendInventoryItem, toggleRentInventoryItem,
    getItemScarcity, getJobScarcity, getSupplierScarcity, computeTravelBuyComparison,
    getHouseRoomCapacity, getRoomUsedSlots, getInventoryWeightKg, getDiff,
    confirmSetDifficulty, setDifficulty, updateSetting, exportSaveJson, openResetConfirmModal,
    handleCrisisAction, policeAction,
    openSearchPanel, closeSearchPanel, setGlobalSearch, setSearchFilter, searchJump, startVoiceSearch,
    guardAge16, isFamilyShieldActive, payViaWire, chargeMoney, earnMoney, useEnergy, saveAll, render, fmt, getCountry, finishLoading
  };

  startLoader();
})();
