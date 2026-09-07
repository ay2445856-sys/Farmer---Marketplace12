/**
 * FarmDirect - Core Application Logic & State Management
 * Smart India Hackathon (SIH)
 * Strict Authentication Gating:
 * Farmer, Buyer & Admin only open AFTER Mobile OTP Verification!
 */

const AppState = {
  // Authentication State
  isLoggedIn: false,
  currentUser: null,
  loginRole: 'farmer', // 'farmer', 'buyer', 'admin'
  otpSent: false,
  sentOtpCode: '1234',

  viewMode: 'prototype', // 'prototype', 'portal', 'workflow'
  protoScreen: 1,        // 1 to 5
  portalTab: 'tab-landing',
  currentRole: 'farmer',
  language: 'hi',        // 'hi' or 'en'
  selectedCropForBuy: null,
  activeFilterCategory: 'all',
  maxRadiusKm: 50,
  searchQuery: '',
  selectedPhotoUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600',

  // 1. Database Table: Products
  crops: [
    {
      id: 1,
      farmerId: 1,
      name: "Onion (प्याज) - Bhadohi",
      category: "vegetables",
      farmer: "रामेश्वर पाटिल (Rameshwar)",
      location: "भदोही (Bhadohi)",
      distanceKm: 8.5,
      quantity: 500, // 500 kg
      pricePerKg: 25, // ₹25/kg
      price: 25,
      unit: "kg",
      isOrganic: true,
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600",
      harvestDate: "2026-09-02"
    },
    {
      id: 2,
      farmerId: 2,
      name: "Potato (आलू) - Prayagraj",
      category: "vegetables",
      farmer: "कमलेश कुमार (Kamlesh)",
      location: "प्रयागराज (Prayagraj)",
      distanceKm: 28.0,
      quantity: 300, // 300 kg
      pricePerKg: 22, // ₹22/kg
      price: 22,
      unit: "kg",
      isOrganic: false,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
      harvestDate: "2026-08-30"
    },
    {
      id: 3,
      farmerId: 1,
      name: "Jyoti Potato (आलू) - Farmer Listing",
      category: "vegetables",
      farmer: "रामेश्वर पाटिल (आप)",
      location: "भदोही फार्म गेट",
      distanceKm: 0,
      quantity: 500, // 500 kg
      pricePerKg: 22, // ₹22/kg
      price: 22,
      unit: "kg",
      isOrganic: true,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
      harvestDate: "2026-09-01"
    },
    {
      id: 4,
      farmerId: 3,
      name: "Desi Tomato (टमाटर) - Varanasi",
      category: "vegetables",
      farmer: "अनिल यादव (Anil)",
      location: "वाराणसी (Varanasi)",
      distanceKm: 42.0,
      quantity: 250,
      pricePerKg: 18,
      price: 18,
      unit: "kg",
      isOrganic: true,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
      harvestDate: "2026-09-05"
    },
    {
      id: 5,
      farmerId: 4,
      name: "Sharbati Wheat (गेहूं) - Mirzapur",
      category: "grains",
      farmer: "राजेंद्र सिंह (Rajendra)",
      location: "मिर्जापुर (Mirzapur)",
      distanceKm: 55.0,
      quantity: 1000,
      pricePerKg: 28,
      price: 28,
      unit: "kg",
      isOrganic: false,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
      harvestDate: "2026-08-28"
    }
  ],

  // 2. Database Table: Orders
  orders: [
    {
      id: "FD-8924",
      buyerId: 5,
      farmerId: 1,
      productId: 1,
      cropName: "Onion (प्याज)",
      quantity: 200, // 200 kg matching prompt
      pricePerKg: 25,
      totalPrice: 5000, // ₹5,000
      deliveryCharge: 300, // ₹300 delivery
      grandTotal: 5300, // ₹5,300 Grand Total
      paymentStatus: "Escrow Held (सुरक्षित एस्क्रो)",
      deliveryStatus: "Transport Assigned",
      currentStageIndex: 2, // 0: Placed, 1: Confirmed, 2: Assigned, 3: Out, 4: Delivered
      buyer: "सुनील किराना मार्ट, प्रयागराज",
      farmer: "रामेश्वर पाटिल (भदोही)",
      vehicle: "Tata Ace Gold ('छोटा हाथी')",
      vehicleNumber: "UP-66-T-3321",
      driver: "राम सिंह (+91 98390 12345)",
      destination: "सिविल लाइंस, प्रयागराज",
      createdAt: "2026-09-08 01:10"
    }
  ],

  // 3. Database Table: Users
  users: [
    { id: 1, name: "रामेश्वर पाटिल", phone: "9823012345", role: "farmer", address: "ग्राम रामपुर, पोस्ट ज्ञानपुर", location: "भदोही (UP)" },
    { id: 2, name: "कमलेश कुमार", phone: "9876500011", role: "farmer", address: "नैनी औद्योगिक क्षेत्र", location: "प्रयागराज (UP)" },
    { id: 3, name: "अनिल यादव", phone: "9876500022", role: "farmer", address: "राजातालाब मंडी", location: "वाराणसी (UP)" },
    { id: 4, name: "राजेंद्र सिंह", phone: "9876500033", role: "farmer", address: "चुनार रोड", location: "मिर्जापुर (UP)" },
    { id: 5, name: "सुनील किराना मार्ट", phone: "9893011223", role: "buyer", address: "सिविल लाइंस, थोक बाजार", location: "प्रयागराज (UP)" },
    { id: 6, name: "Dr. Anil Sharma", phone: "9999900000", role: "admin", address: "Agri Directorate", location: "नोडल सेंटर, लखनऊ" }
  ],

  // 4. Database Table: Transport
  transportFleet: [
    { id: 1, vehicleNumber: "UP-66-EV-1002", vehicleType: "Electric 3-Wheeler (Treo Zor)", capacity: 500, currentLocation: "भदोही बाईपास", costPerKm: 6.5, status: "Available" },
    { id: 2, vehicleNumber: "UP-66-T-3321", vehicleType: "Tata Ace Gold ('छोटा हाथी')", capacity: 1500, currentLocation: "गोपीगंज NH-19", costPerKm: 12.0, status: "Assigned" },
    { id: 3, vehicleNumber: "UP-70-B-8840", vehicleType: "Mahindra Bolero Maxi Truck", capacity: 3500, currentLocation: "हंडिया टोल प्लाजा", costPerKm: 18.0, status: "Available" },
    { id: 4, vehicleNumber: "UP-70-E-9912", vehicleType: "Eicher Pro 14 Feet Truck", capacity: 7500, currentLocation: "प्रयागराज ट्रांसपोर्ट नगर", costPerKm: 28.0, status: "Available" }
  ],

  // 5. Database Table: Complaints
  complaints: [
    {
      id: 1,
      userId: 5,
      userName: "सुनील किराना मार्ट",
      orderId: "FD-8890",
      complaint: "बोरी में 2% अधिक नमी पाई गई।",
      status: "resolved",
      adminResponse: "डिजिटल नमी मीटर डेटा अनुसार ₹600 का क्रेडिट खरीदार को जारी किया गया।",
      createdAt: "2026-09-07 14:30"
    },
    {
      id: 2,
      userId: 5,
      userName: "सुनील किराना मार्ट",
      orderId: "FD-8924",
      complaint: "चालक द्वारा अनुमानित समय से 15 मिनट देरी की सूचना।",
      status: "open",
      adminResponse: "ट्रक जीपीएस सक्रिय है, NH-19 पर भारी यातायात के कारण 15 मिनट विलंब।",
      createdAt: "2026-09-08 01:15"
    }
  ],

  // Farmer Stats (Screen 2 matching prompt)
  farmerStats: {
    ordersCount: 12,
    pendingOrders: 3,
    completedOrders: 9,
    paymentReceived: 18500
  },

  // Admin Stats (Screen 5 matching prompt)
  adminStats: {
    farmersCount: 1250,
    buyersCount: 840,
    activeOrders: 326,
    completedOrders: 2450,
    onionDemandGrowth: "↑ 18%",
    onionDemandTag: "HIGH",
    potatoDemandTag: "Stable",
    tomatoDemandGrowth: "↑ 12%",
    activeDeliveries: 86,
    routesOptimized: 72,
    estimatedSavings: 24500
  }
};

// ==========================================================
// INITIALIZATION
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  window.AppState = AppState;
  
  // Render initial views
  renderCrops();
  renderFarmerListings();
  renderOrdersTable();
  renderDatabaseViewer();
  renderComplaintsTable();
  updateFarmerStatsUI();
  updateAdminStatsUI();
  updateAuthUI();

  // Initialize Map and AI Charts
  setTimeout(() => {
    if (typeof window.initOpenStreetMap === 'function') {
      window.initOpenStreetMap('bhadohi');
    }
    if (typeof window.renderDemandForecastChart === 'function') {
      window.renderDemandForecastChart('onion');
    }
    if (typeof window.renderFleetComparisonChart === 'function') {
      window.renderFleetComparisonChart();
    }
  }, 300);

  // Sync with backend if available
  fetchBackendData();
});

// ==========================================================
// AUTHENTICATION & ROLE SELECTION LOGIC
// ==========================================================

// Role selection on Login Screen (Farmer / Buyer / Admin)
function selectLoginRole(role) {
  AppState.loginRole = role;
  
  document.querySelectorAll('.login-role-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  const isHindi = AppState.language === 'hi';
  const phoneInput = document.getElementById('protoLoginPhone');
  const nameInput = document.getElementById('protoLoginName');
  const locInput = document.getElementById('protoLoginLocation');
  const verifyBtn = document.getElementById('verifyLoginBtn');

  if (role === 'farmer') {
    if (phoneInput) phoneInput.value = "9823012345";
    if (nameInput) nameInput.value = isHindi ? "रामेश्वर पाटिल (Farmer)" : "Rameshwar Patil (Farmer)";
    if (locInput) locInput.value = isHindi ? "भदोही (Bhadohi), उत्तर प्रदेश" : "Bhadohi, Uttar Pradesh";
    if (verifyBtn) verifyBtn.innerHTML = `🔐 ${isHindi ? "सत्यापित करें व किसान डैशबोर्ड खोलें ➔" : "Verify OTP & Open Farmer Dashboard ➔"}`;
  } else if (role === 'buyer') {
    if (phoneInput) phoneInput.value = "9893011223";
    if (nameInput) nameInput.value = isHindi ? "सुनील किराना मार्ट (Buyer)" : "Sunil Traders (Buyer)";
    if (locInput) locInput.value = isHindi ? "सिविल लाइंस, प्रयागराज" : "Civil Lines, Prayagraj";
    if (verifyBtn) verifyBtn.innerHTML = `🔐 ${isHindi ? "सत्यापित करें व डिजिटल मंडी खोलें ➔" : "Verify OTP & Open Marketplace ➔"}`;
  } else if (role === 'admin') {
    if (phoneInput) phoneInput.value = "9999900000";
    if (nameInput) nameInput.value = isHindi ? "Dr. Anil Sharma (Admin)" : "Dr. Anil Sharma (Admin)";
    if (locInput) locInput.value = isHindi ? "Agri Directorate, लखनऊ" : "Agri Directorate, Lucknow";
    if (verifyBtn) verifyBtn.innerHTML = `🔐 ${isHindi ? "सत्यापित करें व एडमिन डैशबोर्ड खोलें ➔" : "Verify OTP & Open Admin Dashboard ➔"}`;
  }

  // Reset OTP status on role change
  AppState.otpSent = false;
  const banner = document.getElementById('otpSentBanner');
  if (banner) banner.style.display = 'none';
  const otpInput = document.getElementById('protoLoginOtp');
  if (otpInput) otpInput.value = "";
}

// Send OTP to user's mobile number
function sendLoginOtp() {
  const phoneInput = document.getElementById('protoLoginPhone');
  const phone = phoneInput ? phoneInput.value.trim() : "9823012345";

  if (!phone || phone.length < 10) {
    showNotification("⚠️ कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें", "error");
    return;
  }

  AppState.otpSent = true;
  AppState.sentOtpCode = "1234";

  const banner = document.getElementById('otpSentBanner');
  if (banner) {
    banner.style.display = 'block';
    banner.innerHTML = `📲 <strong>OTP भेजा गया:</strong> मोबाइल +91 ${phone} पर 4-अंकीय कोड <strong>1234</strong> भेजा गया है।`;
  }

  const otpInput = document.getElementById('protoLoginOtp');
  if (otpInput) {
    otpInput.disabled = false;
    otpInput.focus();
  }

  showNotification(`📲 OTP भेजा गया: +91 ${phone} (डेमो कोड: 1234)`, "success");
}

// 1-Click Demo OTP fill
function fillDemoOtp() {
  if (!AppState.otpSent) {
    sendLoginOtp();
  }
  const otpInput = document.getElementById('protoLoginOtp');
  if (otpInput) {
    otpInput.value = "1234";
  }
  showNotification("⚡ कोड '1234' भर दिया गया है। अब 'सत्यापित करें' बटन दबाएं।", "info");
}

// Verify OTP & Unlock Platform
function verifyLoginOtp() {
  if (!AppState.otpSent) {
    showNotification("⚠️ पहले 'OTP भेजें' बटन दबाकर OTP प्राप्त करें!", "error");
    return;
  }

  const otpInput = document.getElementById('protoLoginOtp');
  const enteredOtp = otpInput ? otpInput.value.trim() : "";

  if (enteredOtp !== "1234") {
    showNotification("❌ गलत OTP! कृपया सही कोड '1234' दर्ज करें।", "error");
    return;
  }

  const role = AppState.loginRole || 'farmer';
  const nameInput = document.getElementById('protoLoginName');
  const phoneInput = document.getElementById('protoLoginPhone');
  const locInput = document.getElementById('protoLoginLocation');

  AppState.isLoggedIn = true;
  AppState.currentRole = role;
  AppState.currentUser = {
    role: role,
    name: nameInput ? nameInput.value : (role === 'farmer' ? "रामेश्वर पाटिल" : (role === 'buyer' ? "सुनील किराना मार्ट" : "Dr. Anil Sharma")),
    phone: phoneInput ? phoneInput.value : "9823012345",
    location: locInput ? locInput.value : "भदोही"
  };

  updateAuthUI();

  showNotification(`🎉 OTP सत्यापित! स्वागत है, ${AppState.currentUser.name} (${role.toUpperCase()})`, "success");

  // Route to the corresponding role dashboard immediately
  if (role === 'farmer') {
    switchProtoScreen(2);
  } else if (role === 'buyer') {
    switchProtoScreen(3);
  } else if (role === 'admin') {
    switchProtoScreen(5);
  }
}

// Logout & Lock Platform
function logout() {
  AppState.isLoggedIn = false;
  AppState.currentUser = null;
  AppState.otpSent = false;

  const otpInput = document.getElementById('protoLoginOtp');
  if (otpInput) {
    otpInput.value = "";
    otpInput.disabled = true;
  }

  const banner = document.getElementById('otpSentBanner');
  if (banner) banner.style.display = 'none';

  updateAuthUI();
  switchProtoScreen(1);

  showNotification("👋 आप लॉगआउट हो गए हैं। कृपया पुनः OTP से लॉगिन करें।", "info");
}

// Update UI based on Login State
function updateAuthUI() {
  const isHindi = AppState.language === 'hi';
  const loggedIn = AppState.isLoggedIn;
  const user = AppState.currentUser;

  // Header User Badge & Logout
  const authSessionContainer = document.getElementById('authSessionContainer');
  if (authSessionContainer) {
    if (loggedIn && user) {
      const roleIcons = { farmer: '👨‍🌾', buyer: '🏪', admin: '👨‍💼' };
      authSessionContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="padding: 4px 10px; background: #EBF7EE; color: #166534; border: 1.5px solid var(--primary-border); border-radius: 20px; font-size: 0.78rem; font-weight: 800; display: flex; align-items: center; gap: 6px;">
            <span>${roleIcons[user.role] || '👤'}</span>
            <span>${user.name}</span>
            <span style="opacity: 0.7; font-weight: 600;">(${user.role.toUpperCase()})</span>
          </div>
          <button class="btn btn-outline btn-sm" style="color: #DC2626; border-color: #FCA5A5; font-size: 0.75rem; padding: 3px 8px;" onclick="logout()">
            🚪 ${isHindi ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      `;
    } else {
      authSessionContainer.innerHTML = `
        <div style="padding: 4px 10px; background: #FEF3C7; color: #92400E; border: 1.5px solid #F59E0B; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 6px;">
          🔒 ${isHindi ? "लॉगिन आवश्यक (Please Login)" : "Authentication Required"}
        </div>
      `;
    }
  }

  // Update Prototype Sub-Navigation Buttons (Show lock icon if not logged in)
  const protoLabels = {
    btn1: isHindi ? "1️⃣ Login / Register" : "1️⃣ Login / Register",
    btn2: loggedIn ? (isHindi ? "2️⃣ Farmer Dashboard" : "2️⃣ Farmer Dashboard") : (isHindi ? "🔒 2️⃣ Farmer Dashboard" : "🔒 2️⃣ Farmer Dashboard"),
    btn3: loggedIn ? (isHindi ? "3️⃣ Crop Marketplace" : "3️⃣ Crop Marketplace") : (isHindi ? "🔒 3️⃣ Crop Marketplace" : "🔒 3️⃣ Crop Marketplace"),
    btn4: loggedIn ? (isHindi ? "4️⃣ Order & Payment" : "4️⃣ Order & Payment") : (isHindi ? "🔒 4️⃣ Order & Payment" : "🔒 4️⃣ Order & Payment"),
    btn5: loggedIn ? (isHindi ? "5️⃣ Admin / AI Dashboard" : "5️⃣ Admin / AI Dashboard") : (isHindi ? "🔒 5️⃣ Admin / AI Dashboard" : "🔒 5️⃣ Admin / AI Dashboard")
  };

  for (let i = 1; i <= 5; i++) {
    const btn = document.querySelector(`.proto-step-btn[data-screen="${i}"]`);
    if (btn && protoLabels[`btn${i}`]) {
      btn.innerText = protoLabels[`btn${i}`];
      btn.style.opacity = (!loggedIn && i !== 1) ? '0.65' : '1';
    }
  }
}

// ==========================================================
// VIEW MODE SWITCHING (Prototype vs Portal vs Workflow)
// ==========================================================
function switchViewMode(mode) {
  AppState.viewMode = mode;

  // Update button highlights
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Hide/show main views
  document.getElementById('view-prototype').classList.toggle('active', mode === 'prototype');
  document.getElementById('view-portal').classList.toggle('active', mode === 'portal');
  document.getElementById('view-workflow').classList.toggle('active', mode === 'workflow');

  // Specific initializations
  if (mode === 'portal') {
    setTimeout(() => {
      if (typeof window.initOpenStreetMap === 'function') window.initOpenStreetMap('bhadohi');
      if (typeof window.renderDemandForecastChart === 'function') window.renderDemandForecastChart('onion');
    }, 150);
  }
}

// Prototype Screen Sub-navigation (Screens 1 to 5) with STRICT AUTH GUARD
function switchProtoScreen(screenNum) {
  // STRICT AUTH GUARD: Screens 2, 3, 4, 5 only open after OTP login!
  if (screenNum !== 1 && !AppState.isLoggedIn) {
    const isHindi = AppState.language === 'hi';
    showNotification(
      isHindi 
        ? "🔒 सुरक्षा अवरोध: स्क्रीन खोलने के लिए पहले मोबाइल नंबर और OTP से लॉगिन करें!" 
        : "🔒 Security: Please login with Mobile Number & OTP first!", 
      "error"
    );
    AppState.protoScreen = 1;
    switchProtoScreen(1);
    const phoneEl = document.getElementById('protoLoginPhone');
    if (phoneEl) phoneEl.focus();
    return;
  }

  AppState.protoScreen = screenNum;

  document.querySelectorAll('.proto-step-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.screen, 10) === screenNum);
  });

  document.querySelectorAll('.proto-screen').forEach(screen => {
    screen.classList.toggle('active', screen.id === `proto-screen-${screenNum}`);
  });

  if (screenNum === 5) {
    setTimeout(() => {
      if (typeof window.renderDemandForecastChart === 'function') {
        window.renderDemandForecastChart('onion');
      }
    }, 100);
  }
}

// Portal Navigation Tabs with STRICT AUTH GUARD
function switchTab(tabId) {
  // STRICT AUTH GUARD: Any portal tab except landing requires login!
  if (tabId !== 'tab-landing' && !AppState.isLoggedIn) {
    const isHindi = AppState.language === 'hi';
    showNotification(
      isHindi 
        ? "🔒 सुरक्षा अवरोध: पोर्टल एक्सेस के लिए पहले OTP से लॉगिन करें!" 
        : "🔒 Security: Please login with OTP to access the portal!", 
      "error"
    );
    switchViewMode('prototype');
    switchProtoScreen(1);
    return;
  }

  AppState.portalTab = tabId;

  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab-btn').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.add('active');

  const targetBtn = document.querySelector(`.nav-tab-btn[data-tab="${tabId}"]`);
  if (targetBtn) targetBtn.classList.add('active');

  if (tabId === 'tab-logistics') {
    setTimeout(() => {
      if (typeof window.initOpenStreetMap === 'function') window.initOpenStreetMap('bhadohi');
    }, 150);
  } else if (tabId === 'tab-admin') {
    setTimeout(() => {
      if (typeof window.renderDemandForecastChart === 'function') window.renderDemandForecastChart('onion');
      if (typeof window.renderFleetComparisonChart === 'function') window.renderFleetComparisonChart();
    }, 150);
  }
}

// Switch User Role
function switchRole(role) {
  if (!AppState.isLoggedIn) {
    // If not logged in yet, selecting a role selects that role on Screen 1 to log in!
    selectLoginRole(role);
    switchViewMode('prototype');
    switchProtoScreen(1);
    showNotification(`🔑 ${role.toUpperCase()} मोड चुना गया। अब कृपया OTP सत्यापन पूरा करें।`, "info");
    return;
  }

  AppState.currentRole = role;
  if (AppState.currentUser) AppState.currentUser.role = role;
  updateAuthUI();

  const isHindi = AppState.language === 'hi';
  const roleLabels = {
    farmer: isHindi ? "किसान (Farmer) मोड सक्रिय" : "Farmer Mode Active",
    buyer: isHindi ? "खरीदार (Buyer) मोड सक्रिय" : "Buyer Mode Active",
    admin: isHindi ? "एडमिन (Admin) मोड सक्रिय" : "Admin Mode Active"
  };

  showNotification(`👤 ${roleLabels[role]}`, "info");

  if (AppState.viewMode === 'prototype') {
    if (role === 'farmer') switchProtoScreen(2);
    else if (role === 'buyer') switchProtoScreen(3);
    else if (role === 'admin') switchProtoScreen(5);
  } else {
    if (role === 'farmer') switchTab('tab-farmer');
    else if (role === 'buyer') switchTab('tab-marketplace');
    else if (role === 'admin') switchTab('tab-admin');
  }
}

// Language Toggle (Hindi / English)
function toggleLanguage() {
  AppState.language = AppState.language === 'hi' ? 'en' : 'hi';
  const isHindi = AppState.language === 'hi';

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.innerHTML = isHindi ? "🇮🇳 English" : "🇮🇳 हिंदी";
  }

  showNotification(isHindi ? "भाषा हिंदी में बदली गई" : "Language switched to English", "info");

  // Re-render UI elements
  renderCrops();
  renderFarmerListings();
  renderOrdersTable();
  updateAuthUI();
  if (typeof window.renderDemandForecastChart === 'function') {
    window.renderDemandForecastChart('onion');
  }
}

// ==========================================================
// RENDERERS
// ==========================================================

// Render Marketplace Crops Grid
function renderCrops() {
  const containers = [
    document.getElementById('marketplaceGrid'),
    document.getElementById('protoMarketplaceGrid')
  ];

  const isHindi = AppState.language === 'hi';

  const filtered = AppState.crops.filter(c => {
    const matchesCategory = AppState.activeFilterCategory === 'all' || c.category === AppState.activeFilterCategory;
    const matchesDist = c.distanceKm <= AppState.maxRadiusKm;
    const matchesSearch = AppState.searchQuery === '' || c.name.toLowerCase().includes(AppState.searchQuery.toLowerCase());
    return matchesCategory && matchesDist && matchesSearch;
  });

  const htmlContent = filtered.length === 0 ? `
    <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 14px; border: 1px dashed var(--border-color);">
      <p style="font-size: 1rem; color: var(--text-muted);">${isHindi ? "कोई फसल उपलब्ध नहीं है। दूरी दायरा बढ़ाएं।" : "No crops found in this range. Increase radius."}</p>
      <button class="btn btn-outline btn-sm" style="margin-top: 10px;" onclick="resetFilters()">${isHindi ? "रीसेट करें (100 km)" : "Reset Filters (100 km)"}</button>
    </div>
  ` : filtered.map(crop => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${crop.image}" class="product-img" alt="${crop.name}" onerror="this.src='https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'">
        <div class="product-dist-tag">📍 ${crop.distanceKm} km ${isHindi ? "दूर" : "away"}</div>
        ${crop.isOrganic ? `<div class="product-organic-tag">🌿 ${isHindi ? "जैविक" : "Organic"}</div>` : ''}
      </div>
      <div class="product-body">
        <h4 class="product-title">${crop.name}</h4>
        <div class="product-farmer">
          <span style="color:#16A34A;">✔</span> ${isHindi ? "किसान:" : "Farmer:"} <strong>${crop.farmer}</strong>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
          📍 ${crop.location}
        </div>
        
        <div class="product-price-box">
          <div>
            <span class="price-main">₹${crop.pricePerKg}</span>
            <span class="price-unit">/ kg</span>
          </div>
          <div class="stock-badge">${isHindi ? "उपलब्ध:" : "Stock:"} ${crop.quantity} kg</div>
        </div>

        <button class="btn btn-primary" style="margin-top: auto; width: 100%;" onclick="openBuyModal(${crop.id})">
          🛒 ${isHindi ? "अभी खरीदें (Buy Now)" : "Buy Now"}
        </button>
      </div>
    </div>
  `).join('');

  containers.forEach(container => {
    if (container) container.innerHTML = htmlContent;
  });
}

// Render Farmer Listings (Screen 2)
function renderFarmerListings() {
  const containers = [
    document.getElementById('farmerListingsContainer'),
    document.getElementById('protoFarmerListingsContainer')
  ];

  const isHindi = AppState.language === 'hi';
  const myCrops = AppState.crops.filter(c => c.farmerId === 1 || c.farmer.includes("रामेश्वर"));

  const htmlContent = myCrops.map(crop => `
    <div style="display: flex; gap: 14px; padding: 12px; border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 12px; align-items: center; background: white;">
      <img src="${crop.image}" style="width: 64px; height: 64px; border-radius: 10px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'">
      <div style="flex: 1;">
        <div style="font-weight: 800; font-size: 0.95rem;">${crop.name}</div>
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
          ${isHindi ? "मात्रा:" : "Quantity:"} <strong>${crop.quantity} kg</strong> | ${isHindi ? "भाव:" : "Price:"} <strong>₹${crop.pricePerKg}/kg</strong>
        </div>
        <div style="display: flex; gap: 6px; margin-top: 4px;">
          <span class="badge" style="background:#EBF7EE; color:#1E6F3D; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight:700;">● ${isHindi ? "सक्रिय (Active)" : "Active"}</span>
          ${crop.isOrganic ? `<span class="badge" style="background:#DCFCE7; color:#166534; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight:700;">🌿 ${isHindi ? "जैविक" : "Organic"}</span>` : ''}
        </div>
      </div>
      <div>
        <button class="btn btn-outline btn-sm" onclick="showNotification('${isHindi ? "फसल संपादन विंडो खुली" : "Edit modal opened"}', 'info')">✏️</button>
      </div>
    </div>
  `).join('');

  containers.forEach(container => {
    if (container) container.innerHTML = htmlContent;
  });
}

// Render Orders & 5-Stage Stepper
function renderOrdersTable() {
  const containers = [
    document.getElementById('ordersListContainer'),
    document.getElementById('protoOrdersContainer')
  ];

  const isHindi = AppState.language === 'hi';

  const htmlContent = AppState.orders.map(order => `
    <div class="card" style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${isHindi ? "ऑर्डर आईडी:" : "Order ID:"} <strong>#${order.id}</strong></div>
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-top: 2px;">${order.cropName}</h4>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
            ${isHindi ? "मात्रा:" : "Quantity:"} <strong>${order.quantity} kg</strong> | ${isHindi ? "गंतव्य:" : "Destination:"} <strong>${order.destination}</strong>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary);">₹${order.grandTotal.toLocaleString('en-IN')}</div>
          <div style="display: inline-block; background: #FEF3C7; color: #92400E; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-top: 4px;">
            🚚 ${order.deliveryStatus}
          </div>
        </div>
      </div>

      <!-- Bill Breakdown Box -->
      <div style="margin-top: 12px; padding: 10px 14px; background: var(--bg-main); border-radius: 8px; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between;">
          <span>${isHindi ? "फसल राशि:" : "Crop Cost:"} <strong>${order.quantity} kg × ₹${order.pricePerKg}</strong></span>
          <strong>₹${order.totalPrice.toLocaleString('en-IN')}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 4px;">
          <span>${isHindi ? "AI परिवहन शुल्क (Tata Ace):" : "AI Transport Delivery:"}</span>
          <strong>₹${order.deliveryCharge.toLocaleString('en-IN')}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 4px; color: #16A34A; font-weight: 700;">
          <span>${isHindi ? "एस्क्रो सुरक्षा स्थिति:" : "Escrow Status:"}</span>
          <span>🛡️ ${order.paymentStatus}</span>
        </div>
      </div>

      <!-- 5-Stage Delivery Tracking Stepper -->
      <div style="margin-top: 16px;">
        <div style="font-size: 0.85rem; font-weight: 800; margin-bottom: 8px;">
          ${isHindi ? "📦 5-चरणीय डिलीवरी स्थिति (5-Stage Order Status):" : "📦 5-Stage Order Status:"}
        </div>

        <div class="timeline">
          <div class="timeline-item ${order.currentStageIndex >= 0 ? (order.currentStageIndex > 0 ? 'completed' : 'active') : ''}">
            <div class="timeline-dot">${order.currentStageIndex > 0 ? '✓' : '1'}</div>
            <div class="timeline-content">
              <h5>1. ${isHindi ? "ऑर्डर दर्ज हुआ (Order Placed)" : "Order Placed"}</h5>
              <p>${isHindi ? "खरीदार ने 200 kg प्याज का ऑर्डर दिया" : "Buyer placed order for 200 kg onion"}</p>
            </div>
          </div>

          <div class="timeline-item ${order.currentStageIndex >= 1 ? (order.currentStageIndex > 1 ? 'completed' : 'active') : ''}">
            <div class="timeline-dot">${order.currentStageIndex > 1 ? '✓' : '2'}</div>
            <div class="timeline-content">
              <h5>2. ${isHindi ? "किसान द्वारा स्वीकृत (Farmer Confirmed)" : "Farmer Confirmed"}</h5>
              <p>${isHindi ? "रामेश्वर पाटिल (भदोही) ने ऑर्डर स्वीकार किया" : "Farmer accepted order and packed stock"}</p>
            </div>
          </div>

          <div class="timeline-item ${order.currentStageIndex >= 2 ? (order.currentStageIndex > 2 ? 'completed' : 'active') : ''}">
            <div class="timeline-dot">${order.currentStageIndex > 2 ? '✓' : '→'}</div>
            <div class="timeline-content">
              <h5>3. ${isHindi ? "AI वाहन आवंटित (Transport Assigned)" : "Transport Assigned"}</h5>
              <p>${order.vehicle} (${order.vehicleNumber}) | ${order.driver}</p>
            </div>
          </div>

          <div class="timeline-item ${order.currentStageIndex >= 3 ? (order.currentStageIndex > 3 ? 'completed' : 'active') : ''}">
            <div class="timeline-dot">${order.currentStageIndex > 3 ? '✓' : '○'}</div>
            <div class="timeline-content">
              <h5>4. ${isHindi ? "डिलीवरी के लिए रवाना (Out for Delivery)" : "Out for Delivery"}</h5>
              <p>${isHindi ? "NH-19 ग्रीन कॉरिडोर: गोपीगंज ➔ हंडिया ➔ प्रयागराज" : "NH-19 Green Corridor in transit"}</p>
            </div>
          </div>

          <div class="timeline-item ${order.currentStageIndex >= 4 ? 'completed' : ''}">
            <div class="timeline-dot">${order.currentStageIndex >= 4 ? '✓' : '○'}</div>
            <div class="timeline-content">
              <h5>5. ${isHindi ? "सत्यापित डिलीवरी व भुगतान रिलीज (Delivered)" : "Delivered & Payment Released"}</h5>
              <p>${order.currentStageIndex >= 4 ? (isHindi ? "✅ डिलीवरी पूर्ण! ₹5,000 किसान बैंक खाते में जमा" : "✅ Delivered! ₹5,000 released to farmer") : (isHindi ? "वेयरहाउस आगमन व वेइंग ब्रिज जांच शेष" : "Pending weighbridge verification")}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
        <button class="btn btn-outline btn-sm" onclick="switchTab('tab-logistics'); if(typeof window.initOpenStreetMap==='function') window.initOpenStreetMap('bhadohi');">
          🗺️ ${isHindi ? "मैप पर ट्रैक करें" : "Track on Map"}
        </button>
        ${order.currentStageIndex < 4 ? `
          <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus('${order.id}')">
            ⏩ ${isHindi ? "अगला चरण सिमुलेट करें (Advance Stage)" : "Simulate Next Stage"}
          </button>
        ` : `
          <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.7;">
            🎉 ${isHindi ? "ऑर्डर पूर्ण व भुगतान रिलीज" : "Order Completed & Paid"}
          </button>
        `}
        <button class="btn btn-outline btn-sm" style="color: #DC2626; border-color: #FCA5A5;" onclick="openComplaintModal('${order.id}')">
          ⚠️ ${isHindi ? "शिकायत दर्ज करें (Complaint)" : "File Complaint"}
        </button>
      </div>
    </div>
  `).join('');

  containers.forEach(container => {
    if (container) container.innerHTML = htmlContent;
  });
}

// Render Database Viewer (Section 5 Database Tables)
function renderDatabaseViewer() {
  const container = document.getElementById('databaseViewerContainer');
  if (!container) return;

  container.innerHTML = `
    <!-- Table 1: Users -->
    <div style="margin-bottom: 24px;">
      <h4 style="font-weight: 800; margin-bottom: 8px;">1. 👥 Users Table (उपयोगकर्ता तालिका)</h4>
      <div class="db-table-wrap">
        <table class="db-table">
          <thead>
            <tr><th>id</th><th>name</th><th>phone</th><th>role</th><th>address</th><th>location</th></tr>
          </thead>
          <tbody>
            ${AppState.users.map(u => `
              <tr>
                <td><strong>${u.id}</strong></td>
                <td>${u.name}</td>
                <td>${u.phone}</td>
                <td><span class="badge" style="background:#EBF7EE; color:#1E6F3D; padding:2px 6px; border-radius:4px; font-weight:700;">${u.role}</span></td>
                <td>${u.address}</td>
                <td>${u.location}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table 2: Products -->
    <div style="margin-bottom: 24px;">
      <h4 style="font-weight: 800; margin-bottom: 8px;">2. 🌾 Products Table (फसल उत्पाद तालिका)</h4>
      <div class="db-table-wrap">
        <table class="db-table">
          <thead>
            <tr><th>id</th><th>farmer_id</th><th>crop_name</th><th>quantity</th><th>price</th><th>unit</th><th>location</th></tr>
          </thead>
          <tbody>
            ${AppState.crops.map(c => `
              <tr>
                <td><strong>${c.id}</strong></td>
                <td>${c.farmerId}</td>
                <td>${c.name}</td>
                <td>${c.quantity}</td>
                <td>₹${c.pricePerKg}</td>
                <td>${c.unit}</td>
                <td>${c.location}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table 3: Orders -->
    <div style="margin-bottom: 24px;">
      <h4 style="font-weight: 800; margin-bottom: 8px;">3. 📦 Orders Table (ऑर्डर तालिका)</h4>
      <div class="db-table-wrap">
        <table class="db-table">
          <thead>
            <tr><th>id</th><th>buyer_id</th><th>farmer_id</th><th>product_id</th><th>quantity</th><th>total_price</th><th>delivery_charge</th><th>grand_total</th><th>payment_status</th><th>delivery_status</th></tr>
          </thead>
          <tbody>
            ${AppState.orders.map(o => `
              <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.buyerId}</td>
                <td>${o.farmerId}</td>
                <td>${o.productId}</td>
                <td>${o.quantity} kg</td>
                <td>₹${o.totalPrice}</td>
                <td>₹${o.deliveryCharge}</td>
                <td><strong>₹${o.grandTotal}</strong></td>
                <td><span style="color:#16A34A; font-weight:700;">${o.paymentStatus}</span></td>
                <td>${o.deliveryStatus}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table 4: Transport -->
    <div style="margin-bottom: 24px;">
      <h4 style="font-weight: 800; margin-bottom: 8px;">4. 🚚 Transport Table (परिवहन बेड़ा तालिका)</h4>
      <div class="db-table-wrap">
        <table class="db-table">
          <thead>
            <tr><th>id</th><th>vehicle_number</th><th>vehicle_type</th><th>capacity</th><th>current_location</th><th>cost_per_km</th><th>status</th></tr>
          </thead>
          <tbody>
            ${AppState.transportFleet.map(t => `
              <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.vehicleNumber}</td>
                <td>${t.vehicleType}</td>
                <td>${t.capacity} kg</td>
                <td>${t.currentLocation}</td>
                <td>₹${t.costPerKm}/km</td>
                <td><span class="badge" style="background:#FEF3C7; color:#92400E; padding:2px 6px; border-radius:4px; font-weight:700;">${t.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table 5: Complaints -->
    <div>
      <h4 style="font-weight: 800; margin-bottom: 8px;">5. 🛡️ Complaints Table (विवाद व शिकायत तालिका)</h4>
      <div class="db-table-wrap">
        <table class="db-table">
          <thead>
            <tr><th>id</th><th>user_id</th><th>order_id</th><th>complaint</th><th>status</th><th>admin_response</th></tr>
          </thead>
          <tbody>
            ${AppState.complaints.map(comp => `
              <tr>
                <td><strong>${comp.id}</strong></td>
                <td>${comp.userId} (${comp.userName})</td>
                <td>${comp.orderId}</td>
                <td>${comp.complaint}</td>
                <td><span class="badge" style="background:${comp.status === 'resolved' ? '#DCFCE7' : '#FEF3C7'}; color:${comp.status === 'resolved' ? '#15803D' : '#92400E'}; padding:2px 6px; border-radius:4px; font-weight:700;">${comp.status}</span></td>
                <td>${comp.adminResponse}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Render Complaints Redressal Panel
function renderComplaintsTable() {
  const container = document.getElementById('complaintsListContainer');
  if (!container) return;

  const isHindi = AppState.language === 'hi';

  container.innerHTML = AppState.complaints.map(comp => `
    <div style="padding: 14px; border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 12px; background: white;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 800; font-size: 0.95rem;">${comp.userName} (Order #${comp.orderId})</span>
        <span class="badge" style="background:${comp.status === 'resolved' ? '#DCFCE7' : '#FEF3C7'}; color:${comp.status === 'resolved' ? '#15803D' : '#92400E'}; padding:3px 8px; border-radius:6px; font-weight:700; font-size:0.75rem;">
          ${comp.status === 'resolved' ? (isHindi ? 'सुलझाया गया (Resolved)' : 'Resolved') : (isHindi ? 'प्रक्रिया में (Open)' : 'Open')}
        </span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 8px;">
        <strong>${isHindi ? "शिकायत:" : "Issue:"}</strong> ${comp.complaint}
      </p>
      <div style="padding: 10px; background: var(--bg-main); border-radius: 8px; font-size: 0.82rem; color: var(--text-muted);">
        <strong>${isHindi ? "एडमिन समाधान:" : "Admin Action:"}</strong> ${comp.adminResponse}
      </div>
      ${comp.status === 'open' ? `
        <div style="margin-top: 10px; text-align: right;">
          <button class="btn btn-outline btn-sm" onclick="resolveComplaint(${comp.id})">
            ✔ ${isHindi ? "मामला सुलझाएं व केस बंद करें" : "Resolve Case"}
          </button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// Update Farmer Stats UI (Screen 2)
function updateFarmerStatsUI() {
  const s = AppState.farmerStats;
  const els = {
    myOrders: document.getElementById('farmerOrdersCount'),
    pending: document.getElementById('farmerPendingOrders'),
    completed: document.getElementById('farmerCompletedOrders'),
    payment: document.getElementById('farmerPaymentAmount')
  };

  if (els.myOrders) els.myOrders.innerText = s.ordersCount;
  if (els.pending) els.pending.innerText = s.pendingOrders;
  if (els.completed) els.completed.innerText = s.completedOrders;
  if (els.payment) els.payment.innerText = `₹${s.paymentReceived.toLocaleString('en-IN')}`;
}

// Update Admin Stats UI (Screen 5)
function updateAdminStatsUI() {
  const s = AppState.adminStats;
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setEl('adminFarmersCount', s.farmersCount.toLocaleString('en-IN'));
  setEl('adminBuyersCount', s.buyersCount.toLocaleString('en-IN'));
  setEl('adminActiveOrders', s.activeOrders.toLocaleString('en-IN'));
  setEl('adminCompletedOrders', s.completedOrders.toLocaleString('en-IN'));
  setEl('adminActiveDeliveries', s.activeDeliveries);
  setEl('adminRoutesOptimized', s.routesOptimized);
  setEl('adminEstimatedSavings', `₹${s.estimatedSavings.toLocaleString('en-IN')}`);
}

// ==========================================================
// INTERACTIVE HANDLERS
// ==========================================================

// Add Crop Photo Selector
function selectPhotoPreset(type) {
  const presets = {
    onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600",
    potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
    tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
    wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600"
  };

  if (presets[type]) {
    AppState.selectedPhotoUrl = presets[type];
    const preview = document.getElementById('cropPhotoPreview');
    if (preview) {
      preview.src = presets[type];
      preview.style.display = 'block';
    }
  }
}

function handleCustomPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    AppState.selectedPhotoUrl = e.target.result;
    const preview = document.getElementById('cropPhotoPreview');
    if (preview) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    showNotification("📸 फसल फोटो सफलतापूर्वक अपलोड हुई!", "success");
  };
  reader.readAsDataURL(file);
}

// Add New Crop Form Submit (Farmer)
function handleAddCropSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newCropName').value;
  const category = document.getElementById('newCropCategory').value;
  const quantity = parseFloat(document.getElementById('newCropQuantity').value) || 500;
  const price = parseFloat(document.getElementById('newCropPrice').value) || 25;
  const location = document.getElementById('newCropLocation').value || "भदोही फार्म गेट";
  const isOrganic = document.getElementById('newCropOrganic').checked;

  const newCrop = {
    id: Date.now(),
    farmerId: 1,
    name: name,
    category: category,
    farmer: "रामेश्वर पाटिल (आप)",
    location: location,
    distanceKm: 5.0,
    quantity: quantity,
    pricePerKg: price,
    price: price,
    unit: "kg",
    isOrganic: isOrganic,
    image: AppState.selectedPhotoUrl,
    harvestDate: "2026-09-08"
  };

  AppState.crops.unshift(newCrop);
  renderCrops();
  renderFarmerListings();
  renderDatabaseViewer();
  closeModal('addCropModal');
  showNotification("🎉 नई फसल सफलतापूर्वक डिजिटल मंडी में लिस्ट हो गई!", "success");
}

// Buy Modal
function openBuyModal(cropId) {
  const crop = AppState.crops.find(c => c.id === cropId);
  if (!crop) return;

  AppState.selectedCropForBuy = crop;
  const isHindi = AppState.language === 'hi';

  const titleEl = document.getElementById('buyModalCropTitle');
  if (titleEl) titleEl.innerText = crop.name;

  const farmerEl = document.getElementById('buyModalFarmer');
  if (farmerEl) farmerEl.innerText = crop.farmer;

  const basePriceEl = document.getElementById('buyModalBasePrice');
  if (basePriceEl) basePriceEl.innerText = `₹${crop.pricePerKg} / kg`;

  const qtyInput = document.getElementById('buyQuantityInput');
  if (qtyInput) {
    qtyInput.value = crop.name.includes("Onion") ? 200 : Math.min(100, crop.quantity);
  }

  updateBuyPriceCalculation();
  openModal('buyNowModal');
}

function updateBuyPriceCalculation() {
  const crop = AppState.selectedCropForBuy;
  if (!crop) return;

  const qty = parseFloat(document.getElementById('buyQuantityInput').value) || 200;
  const cropSubtotal = qty * crop.pricePerKg;
  
  // AI calculated delivery fee: ₹300 for nearby Bhadohi-Prayagraj corridor
  const deliveryFee = 300;
  const grandTotal = cropSubtotal + deliveryFee;

  const subEl = document.getElementById('buyCropSubtotal');
  if (subEl) subEl.innerText = `₹${cropSubtotal.toLocaleString('en-IN')}`;

  const delEl = document.getElementById('buyTransportFee');
  if (delEl) delEl.innerText = `₹${deliveryFee.toLocaleString('en-IN')}`;

  const grandEl = document.getElementById('buyGrandTotal');
  if (grandEl) grandEl.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
}

function executeOrderAndPay() {
  closeModal('buyNowModal');
  openModal('upiPaymentModal');
}

function finalizePayment() {
  closeModal('upiPaymentModal');
  const crop = AppState.selectedCropForBuy || AppState.crops[0];
  const qty = parseFloat(document.getElementById('buyQuantityInput').value) || 200;
  const subtotal = qty * crop.pricePerKg;
  const grandTotal = subtotal + 300;

  const newOrder = {
    id: `FD-${Math.floor(1000 + Math.random() * 9000)}`,
    buyerId: 5,
    farmerId: crop.farmerId || 1,
    productId: crop.id,
    cropName: crop.name,
    quantity: qty,
    pricePerKg: crop.pricePerKg,
    totalPrice: subtotal,
    deliveryCharge: 300,
    grandTotal: grandTotal,
    paymentStatus: "Escrow Held (सुरक्षित एस्क्रो)",
    deliveryStatus: "Farmer Confirmed",
    currentStageIndex: 1, // Stage 2: Farmer Confirmed
    buyer: "सुनील किराना मार्ट (प्रयागराज)",
    farmer: crop.farmer,
    vehicle: "Tata Ace Gold ('छोटा हाथी')",
    vehicleNumber: "UP-66-T-3321",
    driver: "राम सिंह (+91 98390 12345)",
    destination: "सिविल लाइंस, प्रयागराज",
    createdAt: "2026-09-08 01:25"
  };

  AppState.orders.unshift(newOrder);
  renderOrdersTable();
  renderDatabaseViewer();
  showNotification("✅ भुगतान सफल! राशि एस्क्रो खाते में जमा हुई और ऑर्डर कन्फर्म हुआ।", "success");

  if (AppState.viewMode === 'prototype') {
    switchProtoScreen(4);
  } else {
    switchTab('tab-orders');
  }
}

// Advance Order 5-Stage Stepper
function advanceOrderStatus(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  if (order.currentStageIndex < 4) {
    order.currentStageIndex++;
    const stageNames = [
      "Order Placed",
      "Farmer Confirmed",
      "Transport Assigned",
      "Out for Delivery",
      "Delivered & Payment Released"
    ];
    order.deliveryStatus = stageNames[order.currentStageIndex];

    if (order.currentStageIndex === 4) {
      order.paymentStatus = "Payment Released to Farmer";
      AppState.farmerStats.paymentReceived += order.totalPrice;
      updateFarmerStatsUI();
      showNotification(`🎉 डिलीवरी पूर्ण! ₹${order.totalPrice.toLocaleString('en-IN')} किसान के बैंक खाते में ट्रांसफर हो गए!`, "success");
    } else {
      showNotification(`🚚 चरण अपडेट हुआ: ${order.deliveryStatus}`, "info");
    }

    renderOrdersTable();
    renderDatabaseViewer();
  }
}

// Complaints
function openComplaintModal(orderId) {
  const orderInput = document.getElementById('complaintOrderId');
  if (orderInput) orderInput.value = orderId;
  openModal('complaintModal');
}

function submitComplaint(e) {
  e.preventDefault();
  const orderId = document.getElementById('complaintOrderId').value;
  const text = document.getElementById('complaintText').value;

  const newComplaint = {
    id: AppState.complaints.length + 1,
    userId: 5,
    userName: "सुनील किराना मार्ट",
    orderId: orderId,
    complaint: text,
    status: "open",
    adminResponse: "शिकायत दर्ज की गई, एडमिन जांच जारी है।",
    createdAt: "2026-09-08 01:30"
  };

  AppState.complaints.unshift(newComplaint);
  renderComplaintsTable();
  renderDatabaseViewer();
  closeModal('complaintModal');
  showNotification("🛡️ शिकायत दर्ज हुई! एडमिन पैनल में प्रेषित की गई।", "success");
}

function resolveComplaint(id) {
  const comp = AppState.complaints.find(c => c.id === id);
  if (comp) {
    comp.status = "resolved";
    comp.adminResponse = "मामला सफलतापूर्वक सुलझाया गया एवं निवारण दर्ज हुआ।";
    renderComplaintsTable();
    renderDatabaseViewer();
    showNotification("✔ शिकायत सुलझाई गई!", "success");
  }
}

// ==========================================================
// 1-CLICK END-TO-END WORKFLOW SIMULATOR
// ==========================================================
let simTimer = null;
function runInteractiveWorkflow() {
  let step = 1;
  const maxSteps = 7;
  const logEl = document.getElementById('workflowSimLog');

  function executeStep() {
    // Reset highlights
    document.querySelectorAll('.flow-step-box').forEach(box => {
      const bStep = parseInt(box.dataset.step, 10);
      box.classList.toggle('active', bStep === step);
      box.classList.toggle('completed', bStep < step);
    });

    const messages = {
      1: "👨‍🌾 चरण 1: किसान रामेश्वर पाटिल (भदोही) ने 500 kg प्याज ₹25/kg भाव पर लिस्ट किया।",
      2: "🌾 चरण 2: फसल डिजिटल मंडी में आसपास के 50 km दायरे के खरीदारों को उपलब्ध हुई।",
      3: "🏪 चरण 3: प्रयागराज के थोक खरीदार सुनील ने 200 kg प्याज का ऑर्डर प्लेस किया।",
      4: "🤖 चरण 4: AI इंजन ने भार (200kg) व दूरी (68km) अनुसार Tata Ace चुना (लागत: ₹300, CO₂ बचत: 6.2kg)।",
      5: "🚚 चरण 5: भदोही फार्म गेट से उपज लोड की गई और NH-19 कॉरिडोर से रवाना हुई।",
      6: "🏢 चरण 6: प्रयागराज वेयरहाउस पर डिलीवरी सत्यापित हुई एवं वजन/गुणवत्ता जांच पूर्ण।",
      7: "💳 चरण 7: एस्क्रो खाते से ₹5,000 किसान के बैंक खाते में सुरक्षित जारी (Released) हुआ!"
    };

    if (logEl) {
      logEl.innerHTML = `
        <div style="padding: 14px; background: #EBF7EE; border: 1.5px solid #A3D9B1; border-radius: 10px; font-weight: 700; color: #144D2A;">
          ${messages[step]}
        </div>
      `;
    }

    showNotification(messages[step], step === 7 ? "success" : "info");

    if (step < maxSteps) {
      step++;
      simTimer = setTimeout(executeStep, 2200);
    }
  }

  if (simTimer) clearTimeout(simTimer);
  executeStep();
}

// Filter Operations
function setCategoryFilter(category) {
  AppState.activeFilterCategory = category;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.category === category);
  });
  renderCrops();
}

function updateRadiusFilter(value) {
  AppState.maxRadiusKm = parseInt(value, 10);
  const label = document.getElementById('radiusFilterLabel');
  if (label) label.innerText = `${AppState.maxRadiusKm} km के अंदर`;
  renderCrops();
}

function handleSearchInput(e) {
  AppState.searchQuery = e.target.value;
  renderCrops();
}

function resetFilters() {
  AppState.maxRadiusKm = 100;
  AppState.activeFilterCategory = 'all';
  AppState.searchQuery = '';
  const slider = document.getElementById('protoRadiusSlider') || document.getElementById('radiusSlider');
  if (slider) slider.value = 100;
  updateRadiusFilter(100);
  renderCrops();
}

// Modal Utilities
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Notification Toast
function showNotification(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.background = type === 'success' ? '#1E6F3D' : (type === 'error' ? '#B91C1C' : '#0F172A');
  toast.style.color = 'white';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '10px';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.25)';
  toast.style.zIndex = '9999';
  toast.style.fontWeight = '700';
  toast.style.fontSize = '0.88rem';
  toast.innerText = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Backend Live Sync
async function fetchBackendData() {
  try {
    const res = await fetch("http://localhost:8000/api/products");
    if (res.ok) {
      console.log("Connected to live FarmDirect backend API!");
    }
  } catch (_) {
    console.log("FarmDirect standalone offline mode active.");
  }
}
