// ============================================
// Life Sims World - app.js
// Professional Global Life Simulator
// Uses: countryData.js + Firebase Auth
// Theme: Real life, real consequences, per country
// ============================================

// --- FIREBASE CONFIG - PASTE YOUR KEYS HERE ---
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// --- GLOBAL STATE ---
let player = null;
let currentCountry = "southAfrica";
let firebaseApp = null;
let auth = null;

// --- INIT ---
window.onload = function() {
  initFirebase();
  loadPlayer();
  setupUI();
};

function initFirebase() {
  try {
    if (typeof firebase !== "undefined" && !firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      // Listen for auth state
      auth.onAuthStateChanged((user) => {
        if (user) {
          createPlayerFromFirebase(user);
        }
      });
    }
  } catch (e) {
    console.log("Firebase not configured yet, using offline mode:", e);
  }
}

// --- PLAYER CREATION ---
function createPlayerFromFirebase(firebaseUser) {
  const saved = localStorage.getItem("lifeSimsUser");
  if (saved) {
    player = JSON.parse(saved);
    // Update basic info from Firebase
    player.name = firebaseUser.displayName || player.name;
    player.email = firebaseUser.email || player.email;
    player.photo = firebaseUser.photoURL || player.photo;
    savePlayer();
    showHome();
    return;
  }

  // NEW PLAYER - Start in South Africa
  player = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || "New Player",
    email: firebaseUser.email || "",
    photo: firebaseUser.photoURL || "",
    provider: firebaseUser.providerData[0]?.providerId || "google",
    createdAt: new Date().toISOString(),
    age: 18,
    currentCountry: "southAfrica",
    money: 5000,
    health: 80,
    mentalHealth: 75,
    stress: 20,
    energy: 80,
    reputation: {
      southAfrica: 50,
      usa: 0,
      uk: 0,
      france: 0,
      brazil: 0,
      japan: 0
    },
    creditScore: 600, // USA/UK only, others use reputation
    trustScore: 50, // Japan
    bankReputation: 50, // France/Brazil
    blacklistStatus: "Clear", // South Africa
    documents: {
      passportExpiry: addDays(365 * 5),
      visaExpiry: addDays(90),
      workPermitExpiry: addDays(365),
      idExpiry: addDays(365 * 10),
      driversLicenseExpiry: addDays(365 * 5)
    },
    languageLevels: {
      english: 5,
      french: 1,
      portuguese: 1,
      japanese: 1,
      zulu: 2,
      xhosa: 1
    },
    job: null,
    housing: "Living with Family",
    familyReputation: 60,
    followers: 0,
    brandDeals: [],
    debts: [],
    cases: [],
    history: [],
    children: [],
    isDead: false,
    lastLogin: new Date().toISOString()
  };

  currentCountry = "southAfrica";
  savePlayer();
  showHome();
  addHistory("Signed up and started life in South Africa", true);
}

function loadPlayer() {
  const saved = localStorage.getItem("lifeSimsUser");
  if (saved) {
    player = JSON.parse(saved);
    currentCountry = player.currentCountry || "southAfrica";
    showHome();
  } else {
    showLogin();
  }
}

function savePlayer() {
  if (!player) return;
  player.currentCountry = currentCountry;
  player.lastLogin = new Date().toISOString();
  localStorage.setItem("lifeSimsUser", JSON.stringify(player));
}

// --- AUTH ---
function loginWithGoogle() {
  if (!auth) return alert("Firebase not configured yet. Paste your firebaseConfig in app.js first.");
  if (!navigator.onLine) return alert("You need internet for first sign up. After that you can play offline.");

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  auth.signInWithPopup(provider).catch(err => alert("Google Login Failed: " + err.message));
}

function loginWithFacebook() {
  if (!auth) return alert("Firebase not configured yet. Paste your firebaseConfig in app.js first.");
  if (!navigator.onLine) return alert("You need internet for first sign up. After that you can play offline.");

  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope("email");
  provider.addScope("public_profile");
  auth.signInWithPopup(provider).catch(err => alert("Facebook Login Failed: " + err.message));
}

function logout() {
  if (confirm("Log out? Your progress is saved.")) {
    localStorage.removeItem("lifeSimsUser");
    if (auth) auth.signOut();
    player = null;
    showLogin();
  }
}

// --- UI SETUP ---
function setupUI() {
  const googleBtn = document.getElementById("googleLoginBtn");
  const fbBtn = document.getElementById("facebookLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (googleBtn) googleBtn.onclick = loginWithGoogle;
  if (fbBtn) fbBtn.onclick = loginWithFacebook;
  if (logoutBtn) logoutBtn.onclick = logout;

  // Travel buttons
  document.querySelectorAll("[data-travel]").forEach(btn => {
    btn.onclick = () => travelTo(btn.dataset.travel);
  });
}

function showLogin() {
  hideAllScreens();
  const el = document.getElementById("loginScreen");
  if (el) el.style.display = "block";
  const offlineMsg = document.getElementById("offlineMsg");
  if (offlineMsg) {
    offlineMsg.style.display = !navigator.onLine ? "block" : "none";
  }
}

function showHome() {
  if (!player) return showLogin();
  hideAllScreens();
  const el = document.getElementById("homeScreen");
  if (el) el.style.display = "block";
  renderHome();
  checkExpiryWarnings();
  checkMentalHealth();
}

function hideAllScreens() {
  ["loginScreen", "homeScreen", "govScreen", "courtScreen", "bankScreen", "hospitalScreen", "jobScreen", "housingScreen", "socialScreen", "familyScreen"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function showScreen(screenId) {
  hideAllScreens();
  const el = document.getElementById(screenId);
  if (el) el.style.display = "block";
  if (screenId === "homeScreen") renderHome();
  if (screenId === "govScreen") renderGov();
  if (screenId === "courtScreen") renderCourt();
  if (screenId === "bankScreen") renderBank();
  if (screenId === "hospitalScreen") renderHospital();
  if (screenId === "jobScreen") renderJobs();
  if (screenId === "housingScreen") renderHousing();
  if (screenId === "familyScreen") renderFamily();
  if (screenId === "socialScreen") renderSocial();
}

// --- RENDER HOME - COUNTRY BASED ---
function renderHome() {
  const c = getCountryData(currentCountry);
  setText("playerName", player.name);
  setText("playerCountry", c.flag + " " + c.name);
  setText("playerMoney", formatMoney(player.money, currentCountry));
  setText("playerAge", "Age: " + player.age);
  setText("playerHealth", "Health: " + player.health + "/100");
  setText("playerMental", "Mental Health: " + player.mentalHealth + "/100");
  setText("playerReputation", "Reputation in " + c.name + ": " + getReputation(currentCountry) + "/100");
  setText("playerJob", player.job ? player.job.title : "Unemployed");
  setText("playerHousing", player.housing);
  setText("playerCurrency", "Currency: " + c.currency + " (" + c.currencySymbol + ")");
  setText("playerLanguageReq", "Language Required: " + c.primaryLanguage + " Level " + c.languageGateLevel);

  // Credit / Trust display per country
  const moneyLabel = document.getElementById("playerCreditLabel");
  if (moneyLabel) {
    if (currentCountry === "usa" || currentCountry === "uk") {
      moneyLabel.textContent = c.moneySystem.creditScoreName + ": " + player.creditScore;
    } else if (currentCountry === "japan") {
      moneyLabel.textContent = "Trust Score: " + player.trustScore;
    } else if (currentCountry === "france" || currentCountry === "brazil") {
      moneyLabel.textContent = "Bank Reputation: " + player.bankReputation;
    } else if (currentCountry === "southAfrica") {
      moneyLabel.textContent = "Blacklist Status: " + player.blacklistStatus;
    }
  }

  // Special country event
  setText("countryEvent", "📍 " + c.name + ": " + c.housing.specialEvent);
}

function getReputation(countryId) {
  return player.reputation[countryId] || 0;
}

function addReputation(countryId, amount) {
  player.reputation[countryId] = Math.max(0, Math.min(100, (player.reputation[countryId] || 0) + amount));
  savePlayer();
}

// --- TRAVEL - COUNTRY BASED ---
function travelTo(countryId) {
  const target = getCountryData(countryId);
  const current = getCountryData(currentCountry);

  // Check passport
  if (isExpired(player.documents.passportExpiry)) {
    return alert("Your Passport has expired. Go to Government Office to renew before travelling.");
  }

  // Check visa rules for target country
  if (countryId !== "southAfrica") {
    const needsVisa = target.visaRules.citizenNeedsVisa;
    if (needsVisa && isExpired(player.documents.visaExpiry)) {
      return alert("You need a valid Visa for " + target.name + ". Go to Government Office to apply. Penalty if expired: " + target.visaRules.expiryPenalty);
    }
  }

  // Check language gate for jobs in new country (warning only, not block travel)
  const langLevel = getLanguageLevel(target.primaryLanguage);
  if (langLevel < target.languageGateLevel) {
    if (!confirm("Warning: You need " + target.primaryLanguage + " Level " + target.languageGateLevel + " for good jobs in " + target.name + ". Your level is " + langLevel + ". Travel anyway?")) {
      return;
    }
  }

  // Travel cost
  const travelCost = 2000;
  if (player.money < travelCost) {
    return alert("You need " + formatMoney(travelCost, currentCountry) + " to travel.");
  }

  player.money -= travelCost;
  const oldCountry = currentCountry;
  currentCountry = countryId;
  player.currentCountry = countryId;

  // Reset visa expiry for new country
  player.documents.visaExpiry = addDays(target.visaRules.visitorVisaDays);

  savePlayer();
  addHistory(`Travelled from ${getCountryData(oldCountry).name} to ${target.name}`, false);
  alert(`Welcome to ${target.flag} ${target.name}! Currency is now ${target.currency} (${target.currencySymbol}). Language: ${target.primaryLanguage}.`);
  showHome();
}

function getLanguageLevel(languageName) {
  const map = {
    "English": player.languageLevels.english,
    "French": player.languageLevels.french,
    "Portuguese": player.languageLevels.portuguese,
    "Japanese": player.languageLevels.japanese,
    "Zulu": player.languageLevels.zulu,
    "Xhosa": player.languageLevels.xhosa
  };
  return map[languageName] || 1;
}

// --- GOVERNMENT / BUREAUCRACY ---
function renderGov() {
  const c = getCountryData(currentCountry);
  setText("govTitle", "Government Office - " + c.name);
  setText("govDocs", "Required: " + c.documentsRequired.join(", "));
  setText("govPassport", "Passport Expiry: " + formatDate(player.documents.passportExpiry));
  setText("govVisa", "Visa Expiry: " + formatDate(player.documents.visaExpiry) + " - Penalty: " + c.visaRules.expiryPenalty);
  setText("govWorkPermit", "Work Permit Expiry: " + formatDate(player.documents.workPermitExpiry));
  setText("govRenewCost", "Renewal Cost: " + formatMoney(c.visaRules.renewalCost, currentCountry));
}

function renewDocument(docType) {
  const c = getCountryData(currentCountry);
  const cost = c.visaRules.renewalCost;
  if (player.money < cost) return alert("Not enough money. Need " + formatMoney(cost, currentCountry));

  // Language check for France
  if (currentCountry === "france" && docType === "visa") {
    if (player.languageLevels.french < 2) {
      return alert("France requires French Level 2 to renew Visa. Study French first.");
    }
  }

  // Japan requires job
  if (currentCountry === "japan" && docType === "visa" && !player.job) {
    return alert("Japan requires you to have a job to renew Visa.");
  }

  player.money -= cost;
  if (docType === "passport") player.documents.passportExpiry = addDays(365 * 5);
  if (docType === "visa") player.documents.visaExpiry = addDays(c.visaRules.visitorVisaDays);
  if (docType === "workPermit") player.documents.workPermitExpiry = addDays(365);

  savePlayer();
  alert("Document renewed in " + c.name);
  renderGov();
  renderHome();
}

function checkExpiryWarnings() {
  const c = getCountryData(currentCountry);
  const daysVisa = daysUntil(player.documents.visaExpiry);
  const daysPassport = daysUntil(player.doc// ============================================
// Life Sims World - app.js
// Professional Global Life Simulator
// Uses: countryData.js + Firebase Auth
// Theme: Real life, real consequences, per country
// ============================================

// --- FIREBASE CONFIG - PASTE YOUR KEYS HERE ---
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// --- GLOBAL STATE ---
let player = null;
let currentCountry = "southAfrica";
let firebaseApp = null;
let auth = null;

// --- INIT ---
window.onload = function() {
  initFirebase();
  loadPlayer();
  setupUI();
};

function initFirebase() {
  try {
    if (typeof firebase !== "undefined" && !firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      // Listen for auth state
      auth.onAuthStateChanged((user) => {
        if (user) {
          createPlayerFromFirebase(user);
        }
      });
    }
  } catch (e) {
    console.log("Firebase not configured yet, using offline mode:", e);
  }
}

// --- PLAYER CREATION ---
function createPlayerFromFirebase(firebaseUser) {
  const saved = localStorage.getItem("lifeSimsUser");
  if (saved) {
    player = JSON.parse(saved);
    // Update basic info from Firebase
    player.name = firebaseUser.displayName || player.name;
    player.email = firebaseUser.email || player.email;
    player.photo = firebaseUser.photoURL || player.photo;
    savePlayer();
    showHome();
    return;
  }

  // NEW PLAYER - Start in South Africa
  player = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || "New Player",
    email: firebaseUser.email || "",
    photo: firebaseUser.photoURL || "",
    provider: firebaseUser.providerData[0]?.providerId || "google",
    createdAt: new Date().toISOString(),
    age: 18,
    currentCountry: "southAfrica",
    money: 5000,
    health: 80,
    mentalHealth: 75,
    stress: 20,
    energy: 80,
    reputation: {
      southAfrica: 50,
      usa: 0,
      uk: 0,
      france: 0,
      brazil: 0,
      japan: 0
    },
    creditScore: 600, // USA/UK only, others use reputation
    trustScore: 50, // Japan
    bankReputation: 50, // France/Brazil
    blacklistStatus: "Clear", // South Africa
    documents: {
      passportExpiry: addDays(365 * 5),
      visaExpiry: addDays(90),
      workPermitExpiry: addDays(365),
      idExpiry: addDays(365 * 10),
      driversLicenseExpiry: addDays(365 * 5)
    },
    languageLevels: {
      english: 5,
      french: 1,
      portuguese: 1,
      japanese: 1,
      zulu: 2,
      xhosa: 1
    },
    job: null,
    housing: "Living with Family",
    familyReputation: 60,
    followers: 0,
    brandDeals: [],
    debts: [],
    cases: [],
    history: [],
    children: [],
    isDead: false,
    lastLogin: new Date().toISOString()
  };

  currentCountry = "southAfrica";
  savePlayer();
  showHome();
  addHistory("Signed up and started life in South Africa", true);
}

function loadPlayer() {
  const saved = localStorage.getItem("lifeSimsUser");
  if (saved) {
    player = JSON.parse(saved);
    currentCountry = player.currentCountry || "southAfrica";
    showHome();
  } else {
    showLogin();
  }
}

function savePlayer() {
  if (!player) return;
  player.currentCountry = currentCountry;
  player.lastLogin = new Date().toISOString();
  localStorage.setItem("lifeSimsUser", JSON.stringify(player));
}

// --- AUTH ---
function loginWithGoogle() {
  if (!auth) return alert("Firebase not configured yet. Paste your firebaseConfig in app.js first.");
  if (!navigator.onLine) return alert("You need internet for first sign up. After that you can play offline.");

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  auth.signInWithPopup(provider).catch(err => alert("Google Login Failed: " + err.message));
}

function loginWithFacebook() {
  if (!auth) return alert("Firebase not configured yet. Paste your firebaseConfig in app.js first.");
  if (!navigator.onLine) return alert("You need internet for first sign up. After that you can play offline.");

  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope("email");
  provider.addScope("public_profile");
  auth.signInWithPopup(provider).catch(err => alert("Facebook Login Failed: " + err.message));
}

function logout() {
  if (confirm("Log out? Your progress is saved.")) {
    localStorage.removeItem("lifeSimsUser");
    if (auth) auth.signOut();
    player = null;
    showLogin();
  }
}

// --- UI SETUP ---
function setupUI() {
  const googleBtn = document.getElementById("googleLoginBtn");
  const fbBtn = document.getElementById("facebookLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (googleBtn) googleBtn.onclick = loginWithGoogle;
  if (fbBtn) fbBtn.onclick = loginWithFacebook;
  if (logoutBtn) logoutBtn.onclick = logout;

  // Travel buttons
  document.querySelectorAll("[data-travel]").forEach(btn => {
    btn.onclick = () => travelTo(btn.dataset.travel);
  });
}

function showLogin() {
  hideAllScreens();
  const el = document.getElementById("loginScreen");
  if (el) el.style.display = "block";
  const offlineMsg = document.getElementById("offlineMsg");
  if (offlineMsg) {
    offlineMsg.style.display = !navigator.onLine ? "block" : "none";
  }
}

function showHome() {
  if (!player) return showLogin();
  hideAllScreens();
  const el = document.getElementById("homeScreen");
  if (el) el.style.display = "block";
  renderHome();
  checkExpiryWarnings();
  checkMentalHealth();
}

function hideAllScreens() {
  ["loginScreen", "homeScreen", "govScreen", "courtScreen", "bankScreen", "hospitalScreen", "jobScreen", "housingScreen", "socialScreen", "familyScreen"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function showScreen(screenId) {
  hideAllScreens();
  const el = document.getElementById(screenId);
  if (el) el.style.display = "block";
  if (screenId === "homeScreen") renderHome();
  if (screenId === "govScreen") renderGov();
  if (screenId === "courtScreen") renderCourt();
  if (screenId === "bankScreen") renderBank();
  if (screenId === "hospitalScreen") renderHospital();
  if (screenId === "jobScreen") renderJobs();
  if (screenId === "housingScreen") renderHousing();
  if (screenId === "familyScreen") renderFamily();
  if (screenId === "socialScreen") renderSocial();
}

// --- RENDER HOME - COUNTRY BASED ---
function renderHome() {
  const c = getCountryData(currentCountry);
  setText("playerName", player.name);
  setText("playerCountry", c.flag + " " + c.name);
  setText("playerMoney", formatMoney(player.money, currentCountry));
  setText("playerAge", "Age: " + player.age);
  setText("playerHealth", "Health: " + player.health + "/100");
  setText("playerMental", "Mental Health: " + player.mentalHealth + "/100");
  setText("playerReputation", "Reputation in " + c.name + ": " + getReputation(currentCountry) + "/100");
  setText("playerJob", player.job ? player.job.title : "Unemployed");
  setText("playerHousing", player.housing);
  setText("playerCurrency", "Currency: " + c.currency + " (" + c.currencySymbol + ")");
  setText("playerLanguageReq", "Language Required: " + c.primaryLanguage + " Level " + c.languageGateLevel);

  // Credit / Trust display per country
  const moneyLabel = document.getElementById("playerCreditLabel");
  if (moneyLabel) {
    if (currentCountry === "usa" || currentCountry === "uk") {
      moneyLabel.textContent = c.moneySystem.creditScoreName + ": " + player.creditScore;
    } else if (currentCountry === "japan") {
      moneyLabel.textContent = "Trust Score: " + player.trustScore;
    } else if (currentCountry === "france" || currentCountry === "brazil") {
      moneyLabel.textContent = "Bank Reputation: " + player.bankReputation;
    } else if (currentCountry === "southAfrica") {
      moneyLabel.textContent = "Blacklist Status: " + player.blacklistStatus;
    }
  }

  // Special country event
  setText("countryEvent", "📍 " + c.name + ": " + c.housing.specialEvent);
}

function getReputation(countryId) {
  return player.reputation[countryId] || 0;
}

function addReputation(countryId, amount) {
  player.reputation[countryId] = Math.max(0, Math.min(100, (player.reputation[countryId] || 0) + amount));
  savePlayer();
}

// --- TRAVEL - COUNTRY BASED ---
function travelTo(countryId) {
  const target = getCountryData(countryId);
  const current = getCountryData(currentCountry);

  // Check passport
  if (isExpired(player.documents.passportExpiry)) {
    return alert("Your Passport has expired. Go to Government Office to renew before travelling.");
  }

  // Check visa rules for target country
  if (countryId !== "southAfrica") {
    const needsVisa = target.visaRules.citizenNeedsVisa;
    if (needsVisa && isExpired(player.documents.visaExpiry)) {
      return alert("You need a valid Visa for " + target.name + ". Go to Government Office to apply. Penalty if expired: " + target.visaRules.expiryPenalty);
    }
  }

  // Check language gate for jobs in new country (warning only, not block travel)
  const langLevel = getLanguageLevel(target.primaryLanguage);
  if (langLevel < target.languageGateLevel) {
    if (!confirm("Warning: You need " + target.primaryLanguage + " Level " + target.languageGateLevel + " for good jobs in " + target.name + ". Your level is " + langLevel + ". Travel anyway?")) {
      return;
    }
  }

  // Travel cost
  const travelCost = 2000;
  if (player.money < travelCost) {
    return alert("You need " + formatMoney(travelCost, currentCountry) + " to travel.");
  }

  player.money -= travelCost;
  const oldCountry = currentCountry;
  currentCountry = countryId;
  player.currentCountry = countryId;

  // Reset visa expiry for new country
  player.documents.visaExpiry = addDays(target.visaRules.visitorVisaDays);

  savePlayer();
  addHistory(`Travelled from ${getCountryData(oldCountry).name} to ${target.name}`, false);
  alert(`Welcome to ${target.flag} ${target.name}! Currency is now ${target.currency} (${target.currencySymbol}). Language: ${target.primaryLanguage}.`);
  showHome();
}

function getLanguageLevel(languageName) {
  const map = {
    "English": player.languageLevels.english,
    "French": player.languageLevels.french,
    "Portuguese": player.languageLevels.portuguese,
    "Japanese": player.languageLevels.japanese,
    "Zulu": player.languageLevels.zulu,
    "Xhosa": player.languageLevels.xhosa
  };
  return map[languageName] || 1;
}

// --- GOVERNMENT / BUREAUCRACY ---p
function renderGov() {
  const c = getCountryData(currentCountry);
  setText("govTitle", "Government Office - " + c.name);
  setText("govDocs", "Required: " + c.documentsRequired.join(", "));
  setText("govPassport", "Passport Expiry: " + formatDate(player.documents.passportExpiry));
  setText("govVisa", "Visa Expiry: " + formatDate(player.documents.visaExpiry) + " - Penalty: " + c.visaRules.expiryPenalty);
  setText("govWorkPermit", "Work Permit Expiry: " + formatDate(player.documents.workPermitExpiry));
  setText("govRenewCost", "Renewal Cost: " + formatMoney(c.visaRules.renewalCost, currentCountry));
}

function renewDocument(docType) {
  const c = getCountryData(currentCountry);
  const cost = c.visaRules.renewalCost;
  if (player.money < cost) return alert("Not enough money. Need " + formatMoney(cost, currentCountry));

  // Language check for France
  if (currentCountry === "france" && docType === "visa") {
    if (player.languageLevels.french < 2) {
      return alert("France requires French Level 2 to renew Visa. Study French first.");
    }
  }

  // Japan requires job
  if (currentCountry === "japan" && docType === "visa" && !player.job) {
    return alert("Japan requires you to have a job to renew Visa.");
  }

  player.money -= cost;
  if (docType === "passport") player.documents.passportExpiry = addDays(365 * 5);
  if (docType === "visa") player.documents.visaExpiry = addDays(c.visaRules.visitorVisaDays);
  if (docType === "workPermit") player.documents.workPermitExpiry = addDays(365);

  savePlayer();
  alert("Document renewed in " + c.name);
  renderGov();
  renderHome();
}

function checkExpiryWarnings() {
  const c = getCountryData(currentCountry);
  const daysVisa = daysUntil(player.documents.visaExpiry);
  const daysPassport = daysUntil(player.doc
