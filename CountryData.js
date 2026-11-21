// ============================================
// Life Sims World - countryData.js
// Professional Country-Based Config
// All systems MUST read from this file.
// No hard-coded global rules.
// ============================================

const countryData = {
  southAfrica: {
    id: "southAfrica",
    name: "South Africa",
    flag: "🇿🇦",
    currency: "Rand",
    currencySymbol: "R",
    currencyCode: "ZAR",
    languages: ["English", "Zulu", "Xhosa", "Afrikaans"],
    primaryLanguage: "English",
    languageGateLevel: 1,
    capital: "Pretoria",
    timezone: "Africa/Johannesburg",

    // BUREAUCRACY
    documentsRequired: ["SA ID", "Passport", "Driver's License"],
    visaRules: {
      citizenNeedsVisa: false,
      visitorVisaDays: 90,
      workPermitRequired: false,
      renewalCost: 500,
      expiryPenalty: "Fine R2000, then court"
    },

    // COURT + LAW
    courtRules: {
      system: "Bail System + Community Service",
      lawyerCheapCost: 5000,
      lawyerExpertCost: 25000,
      convictionRate: 0.60,
      deportationForForeigners: "Only for serious crimes",
      jailHarshness: "Moderate",
      bailAvailable: true
    },

    // MONEY + CREDIT
    moneySystem: {
      type: "Blacklisting System",
      creditScoreName: "Blacklist Status",
      creditScoreMin: 0,
      creditScoreMax: 100,
      loanTypes: ["Bank Loan", "Mashonisa / Loan Shark", "Store Credit"],
      loanInterestBank: 0.18,
      loanInterestShark: 0.50,
      averageSalary: 15000,
      minWage: 5000
    },

    // HEALTH
    healthSystem: {
      system: "Public vs Private",
      publicHospitalCost: 500,
      privateHospitalCost: 15000,
      publicWaitTime: "Long - 8 hours",
      privateWaitTime: "Fast - 30 mins",
      insuranceMonthly: 1200,
      insuranceCoverage: 0.80,
      governmentCoverage: 0.30
    },

    // FAMILY + CULTURE
    culture: {
      familyExpectation: "High - Send money home monthly",
      weddingSystem: "Lobola System",
      lobolaEnabled: true,
      lobolaBaseCost: 50000,
      lobolaNegotiation: true,
      funeralCost: 25000,
      weddingCost: 80000,
      familyCallFrequency: "Weekly",
      respectSystem: "Ubuntu - Community Respect"
    },

    // JOBS
    jobs: [
      { title: "Taxi Driver", salary: 12000, hours: 12, stress: 70, skillRequired: "Driving", languageLevel: 1 },
      { title: "Retail Cashier", salary: 8000, hours: 9, stress: 40, skillRequired: "Customer Service", languageLevel: 1 },
      { title: "Call Centre Agent", salary: 14000, hours: 8, stress: 60, skillRequired: "English", languageLevel: 2 },
      { title: "Miner", salary: 18000, hours: 10, stress: 80, skillRequired: "Physical", languageLevel: 1 },
      { title: "Content Creator", salary: 10000, hours: 6, stress: 50, skillRequired: "Creativity", languageLevel: 1 }
    ],

    // HOUSING
    housing: {
      rentShack: 1500,
      rentFlat: 6000,
      rentHouse: 12000,
      buyHouse: 1200000,
      evictionAfterMonthsLate: 2,
      specialEvent: "Load Shedding - Power cut 4 hours, affects work and business",
      landlordRule: "Landlord can increase rent yearly by 10%"
    },

    // SOCIAL + REPUTATION
    reputation: {
      startScore: 50,
      brandDealMinReputation: 60,
      brandDealPayMin: 1000,
      brandDealPayMax: 8000
    },

    // DAILY LIFE
    dailyCosts: {
      food: 150,
      transport: 80,
      data: 100,
      rentAverage: 6000
    }
  },

  usa: {
    id: "usa",
    name: "United States of America",
    flag: "🇺🇸",
    currency: "Dollar",
    currencySymbol: "$",
    currencyCode: "USD",
    languages: ["English", "Spanish"],
    primaryLanguage: "English",
    languageGateLevel: 1,
    capital: "Washington D.C.",
    timezone: "America/New_York",

    documentsRequired: ["Passport", "Visa", "Work Permit", "SSN"],
    visaRules: {
      citizenNeedsVisa: true,
      visitorVisaDays: 90,
      workPermitRequired: true,
      renewalCost: 500,
      expiryPenalty: "Deportation + 5 Year Ban"
    },

    courtRules: {
      system: "Jury Trial + Plea Bargain",
      lawyerCheapCost: 2000,
      lawyerExpertCost: 15000,
      convictionRate: 0.70,
      deportationForForeigners: "Very Common - Even for minor crimes",
      jailHarshness: "High - Long sentences",
      bailAvailable: true
    },

    moneySystem: {
      type: "Credit Score System",
      creditScoreName: "Credit Score",
      creditScoreMin: 300,
      creditScoreMax: 850,
      loanTypes: ["Credit Card", "Student Loan", "Car Loan", "Mortgage"],
      loanInterestBank: 0.22,
      loanInterestShark: 0.60,
      averageSalary: 3500,
      minWage: 1200
    },

    healthSystem: {
      system: "Private Insurance Required",
      publicHospitalCost: 5000,
      privateHospitalCost: 15000,
      publicWaitTime: "Medium - 3 hours",
      privateWaitTime: "Fast - 1 hour",
      insuranceMonthly: 400,
      insuranceCoverage: 0.80,
      governmentCoverage: 0.0
    },

    culture: {
      familyExpectation: "Low - Independent",
      weddingSystem: "Expensive Wedding",
      lobolaEnabled: false,
      lobolaBaseCost: 0,
      funeralCost: 8000,
      weddingCost: 25000,
      familyCallFrequency: "Monthly",
      respectSystem: "Individual Reputation"
    },

    jobs: [
      { title: "Fast Food Worker", salary: 1800, hours: 8, stress: 50, skillRequired: "Customer Service", languageLevel: 1 },
      { title: "Delivery Driver", salary: 2500, hours: 10, stress: 60, skillRequired: "Driving", languageLevel: 1 },
      { title: "Retail Associate", salary: 2000, hours: 8, stress: 40, skillRequired: "Customer Service", languageLevel: 1 },
      { title: "Tech Support", salary: 4000, hours: 8, stress: 55, skillRequired: "Tech", languageLevel: 2 },
      { title: "Content Creator", salary: 3000, hours: 6, stress: 45, skillRequired: "Creativity", languageLevel: 1 }
    ],

    housing: {
      rentShack: 800,
      rentFlat: 1500,
      rentHouse: 2800,
      buyHouse: 350000,
      evictionAfterMonthsLate: 1,
      specialEvent: "Rent Increase - Landlord increases rent by
