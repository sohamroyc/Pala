/* ==========================================================================
   PALA APPLICATION CORE BUSINESS LOGIC - TEMPLE ADMIN SCHEDULER
   Stateful SPA Engine - Clean Databases + Live Clock Sync + Dual Language Toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STATE & STORAGE INITIALIZATION
  // ==========================================
  
  let state = {
    calendarEra: localStorage.getItem('pala_calendarEra') || 'BS',
    language: localStorage.getItem('pala_language') || 'EN',
    activeTab: 'home',
    recordsBS: JSON.parse(localStorage.getItem('pala_recordsBS')) || [],
    recordsAD: JSON.parse(localStorage.getItem('pala_recordsAD')) || [],
    alerts: JSON.parse(localStorage.getItem('pala_alerts')) || [],
    selectedDate: { day: 1, month: 0, year: 2026 },
    currentCalendarMonth: 0,
    currentCalendarYear: 2026,
    searchQuery: '',
    recordsActiveFilter: 'name',
    alertsActiveTab: 'upcoming',
    attachedPhoto: '',
    theme: localStorage.getItem('pala_theme') || 'light',
    recordToDeleteId: null,
    adminName: localStorage.getItem('pala_adminName') || 'Temple Administrator',
    adminTemple: localStorage.getItem('pala_adminTemple') || 'Pala Admin'
  };

  // Sync to LocalStorage
  function saveStateToStorage() {
    localStorage.setItem('pala_recordsBS', JSON.stringify(state.recordsBS));
    localStorage.setItem('pala_recordsAD', JSON.stringify(state.recordsAD));
    localStorage.setItem('pala_alerts', JSON.stringify(state.alerts));
    localStorage.setItem('pala_calendarEra', state.calendarEra);
    localStorage.setItem('pala_language', state.language);
    localStorage.setItem('pala_theme', state.theme);
    localStorage.setItem('pala_adminName', state.adminName);
    localStorage.setItem('pala_adminTemple', state.adminTemple);
  }

  function getActiveRecords() {
    return state.calendarEra === 'BS' ? state.recordsBS : state.recordsAD;
  }

  function setActiveRecords(records) {
    if (state.calendarEra === 'BS') {
      state.recordsBS = records;
    } else {
      state.recordsAD = records;
    }
    saveStateToStorage();
  }

  // ==========================================
  // 2. DICTIONARY TRANSLATIONS (EN & BN WHOLE SYSTEM SWITCH)
  // ==========================================
  
  const TRANSLATIONS = {
    BN: {
      appTitle: "পালা অ্যাডমিন",
      welcomeTitle: "স্বাগতম,<br>অ্যাডমিন",
      welcomeSubtitle: "শুরু করতে আপনার পছন্দের ক্যালেন্ডার বেছে নিন।",
      homeGreetTime: "শুভ সকাল,",
      homeGreetName: "মন্দির অ্যাডমিন",
      statLabelTotal: "মোট",
      statLabelPalas: "পালা",
      statLabelUpcoming: "আসন্ন",
      statLabelShifts: "শিফট",
      statLabelActive: "সক্রিয়",
      statLabelPriests: "সেবাইত",
      headlineTitle: "আজকের পালা",
      headlineStatus: "লাইভ",
      highlightTag: "মন্দিরের পালা বণ্টন ও সময়সূচী",
      highlightTitle: "সেবা ও আরতি বণ্টন ড্যাশবোর্ড",
      highlightTimeLocation: "প্রধান সেবাইত কার্যকারিতা",
      calDetailBackLabel: "ক্যালেন্ডার ভিউ",
      palaEntriesHeadline: "পালা বণ্টন তালিকা",
      alertsHeaderH1: "বিজ্ঞপ্তি",
      alertsHeaderP: "মন্দিরের বিভিন্ন সেবা শিফটের নোটিফিকেশন ট্র্যাক করুন।",
      alertTabBtn0: "আসন্ন",
      alertTabBtn1: "আজ",
      alertTabBtn2: "ইতিহাস",
      alertsEmptyStateP: "আজ আর কোনো সেবা শিফট নেই",
      settingsHeaderUserName: "মন্দির পর্ষদ অ্যাডমিন",
      settingsHeaderUserEmail: "admin@templeboard.org",
      settingsGroupLabel0: "পছন্দসমূহ",
      settingsGroupLabel1: "ডেটা ও ব্যাকআপ",
      settingsGroupLabel2: "অ্যাপ সম্পর্কিত",
      settingsSwitchCalendarH3: "ক্যালেন্ডার পরিবর্তন",
      settingsThemeH3: "থিম পরিবর্তন",
      settingsLanguageH3: "ভাষা পরিবর্তন",
      settingsExportH3: "ডেটা এক্সপোর্ট",
      settingsBackupH3: "ক্লাউড সিঙ্ক",
      settingsAboutH3: "অ্যাপ বিবরণ",
      settingsSignOutSpan: "প্রস্থান",
      drawerTitle: "পালা অ্যাডমিন",
      drawerTextHome: "অ্যাডমিন ড্যাশবোর্ড",
      drawerTextRecords: "পালা বণ্টন তালিকা",
      drawerTextAlerts: "মন্দির বিজ্ঞপ্তি",
      drawerTextSettings: "সেটিংস ও পছন্দসমূহ",
      bottomTabHome: "ড্যাশবোর্ড",
      bottomTabCalendar: "সময়সূচী",
      bottomTabRecords: "বরাদ্দসমূহ",
      bottomTabAlerts: "বিজ্ঞপ্তি",
      bottomTabSettings: "সেটিংস",
      formTitleAdd: "মন্দিরের পালা বণ্টন (বরাদ্দ)",
      formTitleEdit: "পালা এন্ট্রি সম্পাদন (এডিট)",
      formLabelName: "সেবাইত (পালাদার)-এর নাম",
      formLabelAddress: "ঠিকানা",
      formLabelMobile: "মোবাইল নম্বর",
      formLabelNotes: "পালার বিবরণ ও সময়সীমা",
      formLabelPhoto: "ছবি যুক্ত করুন",
      formLabelInfo: "অতিরিক্ত তথ্য",
      formPlaceholderName: "যেমন: অমিতাভ দাশ",
      formPlaceholderAddress: "যেমন: গড়িয়াহাট, দক্ষিণ কলকাতা",
      formPlaceholderMobile: "যেমন: +৮৮০ ১৭১১ ০০০০০০",
      formPlaceholderNotes: "ভোগ ও আরতি বণ্টন সেবা পূজার শিফট...",
      formPlaceholderInfo: "যেমন: বিশেষ উৎসব সেবা...",
      formAttachPhotoText: "মন্দিরের ছবি বা সেবাইতের ছবি যুক্ত করুন",
      formNameErrorText: "পালাদারের পুরো নাম দেওয়া আবশ্যক",
      formSubmitSave: "সংরক্ষণ করুন",
      formSubmitUpdate: "আপডেট করুন",
      formBtnCancel: "বাতিল করুন",
      dialogDeleteH2: "মুছে ফেলবেন?",
      dialogDeleteP: "আপনি কি নিশ্চিত যে এই পালা বণ্টনটি বাতিল/মুছে ফেলতে চান? এই অ্যাকশনটি স্থায়ী।",
      dialogBtnDelete: "মুছে ফেলুন",
      dialogBtnCancel: "বাতিল",
      notifySyncSuccess: "ডেটা সফলভাবে সিঙ্ক হয়েছে!",
      notifyExportPrep: "রপ্তানি ফাইল প্রস্তুত হচ্ছে...",
      notifyExportSuccess: "ফাইল ডাউনলোড সম্পন্ন!",
      notifySignOut: "প্রস্থান করা হচ্ছে...",
      emptyRecordsMsg: "কোনো সেবা বরাদ্দ পাওয়া যায়নি।"
    },
    EN: {
      appTitle: "Pala Admin",
      welcomeTitle: "Welcome back,<br>Admin",
      welcomeSubtitle: "Select your preferred calendar to allocate temple Palas.",
      homeGreetTime: "Good Morning,",
      homeGreetName: "Temple Admin",
      statLabelTotal: "Total",
      statLabelPalas: "Palas",
      statLabelUpcoming: "Upcoming",
      statLabelShifts: "Shifts",
      statLabelActive: "Active",
      statLabelPriests: "Priests",
      headlineTitle: "Today's Palas",
      headlineStatus: "Live",
      highlightTag: "Temple Pala Duty Scheduler",
      highlightTitle: "Priest Turn Management Console",
      highlightTimeLocation: "Active Chief Administrator",
      calDetailBackLabel: "Calendar View",
      palaEntriesHeadline: "Pala Allocations",
      alertsHeaderH1: "Alerts",
      alertsHeaderP: "Track and organize temple duty allocations.",
      alertTabBtn0: "Upcoming",
      alertTabBtn1: "Today",
      alertTabBtn2: "History",
      alertsEmptyStateP: "No more alerts for today",
      settingsHeaderUserName: "Temple Administrator",
      settingsHeaderUserEmail: "admin@templeboard.org",
      settingsGroupLabel0: "Preferences",
      settingsGroupLabel1: "Data & Continuity",
      settingsGroupLabel2: "Information",
      settingsSwitchCalendarH3: "Switch Calendar Type",
      settingsThemeH3: "Theme Selection",
      settingsLanguageH3: "Language Selection",
      settingsExportH3: "Export Data",
      settingsBackupH3: "Backup & Sync",
      settingsAboutH3: "About App",
      settingsSignOutSpan: "Sign Out",
      drawerTitle: "Pala Admin",
      drawerTextHome: "Admin Dashboard",
      drawerTextRecords: "Duty Allocations",
      drawerTextAlerts: "Temple Alerts",
      drawerTextSettings: "Admin Settings",
      bottomTabHome: "Home",
      bottomTabCalendar: "Calendar",
      bottomTabRecords: "Records",
      bottomTabAlerts: "Alerts",
      bottomTabSettings: "Settings",
      formTitleAdd: "Allocate Temple Pala",
      formTitleEdit: "Edit Temple Duty Allocation",
      formLabelName: "Pala Holder Name",
      formLabelAddress: "Address",
      formLabelMobile: "Mobile Number",
      formLabelNotes: "Pala Service Details",
      formLabelPhoto: "Attach Photo",
      formLabelInfo: "Additional Information",
      formPlaceholderName: "e.g. Amitabh Mukherjee",
      formPlaceholderAddress: "e.g. Gariahat, South Kolkata",
      formPlaceholderMobile: "e.g. +91 98765 43210",
      formPlaceholderNotes: "Traditional puja duties and distribution responsibilities...",
      formPlaceholderInfo: "e.g. Special Duty Turn Shift",
      formAttachPhotoText: "Click to attach a local temple or shebait image",
      formNameErrorText: "Full name is required for registration",
      formSubmitSave: "Save Pala Turn",
      formSubmitUpdate: "Update Turn",
      formBtnCancel: "Cancel",
      dialogDeleteH2: "Delete Duty turn?",
      dialogDeleteP: "Are you sure you want to delete this priest duty allocation? This action is permanent.",
      dialogBtnDelete: "Delete",
      dialogBtnCancel: "Cancel",
      notifySyncSuccess: "Data synced successfully!",
      notifyExportPrep: "Preparing export file...",
      notifyExportSuccess: "Export file downloaded!",
      notifySignOut: "Signing out...",
      emptyRecordsMsg: "No temple duties assigned in this database."
    }
  };

  const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  const BENGALI_MONTHS_BANGLA = [
    "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", 
    "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", 
    "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
  ];

  const BENGALI_MONTHS_ENG = [
    "Boishakh", "Jyaistha", "Ashadha", "Shravana", 
    "Bhadra", "Ashwin", "Karttik", "Agrahayan", 
    "Poush", "Magha", "Falgun", "Chaitra"
  ];

  const GREGORIAN_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const BENGALI_WEEKDAYS = [
    "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
  ];

  const GREGORIAN_WEEKDAYS = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  // Helper to translate text lookups dynamically
  function getLocText(key) {
    return TRANSLATIONS[state.language][key] || "";
  }

  // Translates number digits to Bengali numerals only when global language is BN
  function formatNumber(number) {
    if (state.language === 'BN') {
      return String(number).split('').map(digit => {
        const idx = parseInt(digit, 10);
        return isNaN(idx) ? digit : BENGALI_DIGITS[idx];
      }).join('');
    }
    return String(number);
  }

  // ==========================================
  // 3. ACCURATE BENGALI-GREGORIAN DATE CONVERTER
  // ==========================================
  
  const BENGALI_MONTH_DAYS = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];

  const BENGALI_MONTH_STARTS = [
    { name: "Boishakh",  gMonth: 3, gDay: 14, yearOffset: 593 }, // Apr 14
    { name: "Jyaistha",  gMonth: 4, gDay: 15, yearOffset: 593 }, // May 15
    { name: "Ashadha",   gMonth: 5, gDay: 15, yearOffset: 593 }, // Jun 15
    { name: "Shravana",  gMonth: 6, gDay: 16, yearOffset: 593 }, // Jul 16
    { name: "Bhadra",    gMonth: 7, gDay: 16, yearOffset: 593 }, // Aug 16
    { name: "Ashwin",    gMonth: 8, gDay: 16, yearOffset: 593 }, // Sep 16
    { name: "Karttik",   gMonth: 9, gDay: 16, yearOffset: 593 }, // Oct 16
    { name: "Agrahayan", gMonth: 10, gDay: 16, yearOffset: 593 }, // Nov 16
    { name: "Poush",     gMonth: 11, gDay: 16, yearOffset: 593 }, // Dec 16
    { name: "Magha",     gMonth: 0, gDay: 15, yearOffset: 594 }, // Jan 15
    { name: "Falgun",    gMonth: 1, gDay: 14, yearOffset: 594 }, // Feb 14
    { name: "Chaitra",   gMonth: 2, gDay: 15, yearOffset: 594 }  // Mar 15
  ];

  function getBengaliFromGregorian(gYear, gMonth, gDay) {
    const targetDate = new Date(gYear, gMonth, gDay);
    const transitions = BENGALI_MONTH_STARTS.map((start, m) => {
      const year = m >= 9 ? gYear - 1 : gYear;
      return {
        monthIndex: m,
        yearOffset: start.yearOffset,
        date: new Date(year, start.gMonth, start.gDay)
      };
    });

    const firstM = transitions[9].date; // Magha 1st
    if (targetDate < firstM) {
      const startPoushPrev = new Date(gYear - 1, 11, 16);
      const diffTime = targetDate - startPoushPrev;
      const bDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return { day: bDay, month: 8, year: gYear - 594 };
    }

    for (let i = 0; i < 12; i++) {
      const chronoOrder = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
      const currentIdx = chronoOrder[i];
      const nextIdx = chronoOrder[(i + 1) % 12];
      const currTrans = transitions[currentIdx];
      
      let nextTransDate;
      if (i === 11) {
        nextTransDate = new Date(gYear + 1, 0, 15);
      } else {
        nextTransDate = transitions[nextIdx].date;
      }

      if (targetDate >= currTrans.date && targetDate < nextTransDate) {
        const diffTime = targetDate - currTrans.date;
        const bDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const bYear = gYear - currTrans.yearOffset;
        return { day: bDay, month: currentIdx, year: bYear };
      }
    }
    return { day: 1, month: 0, year: gYear - 593 };
  }

  function getGregorianFromBengali(bYear, bMonth, bDay) {
    const start = BENGALI_MONTH_STARTS[bMonth];
    let gYear = bYear + start.yearOffset;
    const startGDate = new Date(gYear, start.gMonth, start.gDay);
    startGDate.setDate(startGDate.getDate() + bDay - 1);
    return {
      day: startGDate.getDate(),
      month: startGDate.getMonth(),
      year: startGDate.getFullYear()
    };
  }

  // ==========================================
  // 4. LIVE DYNAMIC INITIALIZATION (SYNCED)
  // ==========================================
  
  const today = new Date(); // Physical clock date (June 1, 2026)
  
  function initializeDateState() {
    const currentBDate = getBengaliFromGregorian(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (state.calendarEra === 'BS') {
      state.selectedDate = { day: currentBDate.day, month: currentBDate.month, year: currentBDate.year };
      state.currentCalendarMonth = currentBDate.month;
      state.currentCalendarYear = currentBDate.year;
    } else {
      state.selectedDate = { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
      state.currentCalendarMonth = today.getMonth();
      state.currentCalendarYear = today.getFullYear();
    }
  }

  function updateClockAndTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Format minutes with leading zero
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    // 12-hour format for mock status bar (e.g. 9:10 PM)
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
    
    // Update Mock Status Bar Time — convert digits to Bengali if BN
    if (statusBarTime) {
      if (state.language === 'BN') {
        const bnAMPM = ampm === 'AM' ? 'পূর্বাহ্ন' : 'অপরাহ্ন';
        statusBarTime.textContent = `${formatNumber(hours12)}:${formatNumber(formattedMinutes)} ${bnAMPM}`;
      } else {
        statusBarTime.textContent = `${hours12}:${formattedMinutes} ${ampm}`;
      }
    }
    
    // Greeting Time Calculation
    let greetingText = "";
    if (hours >= 5 && hours < 12) {
      greetingText = state.language === 'BN' ? "শুভ সকাল," : "Good Morning,";
    } else if (hours >= 12 && hours < 17) {
      greetingText = state.language === 'BN' ? "শুভ দুপুর," : "Good Afternoon,";
    } else if (hours >= 17 && hours < 20) {
      greetingText = state.language === 'BN' ? "শুভ সন্ধ্যা," : "Good Evening,";
    } else {
      greetingText = state.language === 'BN' ? "শুভ রাত্রি," : "Good Night,";
    }
    
    if (homeGreetTime) {
      homeGreetTime.textContent = greetingText;
    }
  }



  // ==========================================
  // 5. CACHED DOM ELEMENTS BINDING
  // ==========================================
  
  const appViewport = document.getElementById('appViewport');
  const appHeaderTitle = document.getElementById('appHeaderTitle');
  const statusBarTime = document.getElementById('statusBarTime');
  const headerLanguageToggleBtn = document.getElementById('headerLanguageToggleBtn');
  
  const views = {
    home: document.getElementById('homeView'),
    calendar: document.getElementById('calendarDetailView'),
    records: document.getElementById('recordsView'),
    alerts: document.getElementById('alertsView'),
    settings: document.getElementById('settingsView'),
    welcome: document.getElementById('welcomeView')
  };

  const tabItems = {
    home: document.getElementById('bottomTabHome'),
    calendar: document.getElementById('bottomTabCalendar'),
    records: document.getElementById('bottomTabRecords'),
    alerts: document.getElementById('bottomTabAlerts'),
    settings: document.getElementById('bottomTabSettings')
  };

  // Drawer
  const menuDrawerBtn = document.getElementById('menuDrawerBtn');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openSideDrawer() {
    if (sideDrawer && drawerOverlay) {
      sideDrawer.classList.add('drawer-open');
      drawerOverlay.classList.add('drawer-open');
    }
  }

  function closeSideDrawer() {
    if (sideDrawer && drawerOverlay) {
      sideDrawer.classList.remove('drawer-open');
      drawerOverlay.classList.remove('drawer-open');
    }
  }

  if (menuDrawerBtn) menuDrawerBtn.addEventListener('click', openSideDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeSideDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeSideDrawer);

  const drawerItemHome = document.getElementById('drawerItemHome');
  const drawerItemRecords = document.getElementById('drawerItemRecords');
  const drawerItemAlerts = document.getElementById('drawerItemAlerts');
  const drawerItemSettings = document.getElementById('drawerItemSettings');

  if (drawerItemHome) drawerItemHome.addEventListener('click', () => navigateToView('home'));
  if (drawerItemRecords) drawerItemRecords.addEventListener('click', () => navigateToView('records'));
  if (drawerItemAlerts) drawerItemAlerts.addEventListener('click', () => navigateToView('alerts'));
  if (drawerItemSettings) drawerItemSettings.addEventListener('click', () => navigateToView('settings'));


  // Welcome Screen
  const selectBSEraBtn = document.getElementById('selectBSEraBtn');
  const selectADEraBtn = document.getElementById('selectADEraBtn');

  // Home Dashboard
  const homeGreetTime = document.getElementById('homeGreetTime');
  const homeGreetName = document.getElementById('homeGreetName');
  const homeHeaderEraDate = document.getElementById('homeHeaderEraDate');
  const homeEraBadge = document.getElementById('homeEraBadge');
  const calendarWidgetMonthTitle = document.getElementById('calendarWidgetMonthTitle');
  const calendarWidgetDaysGrid = document.getElementById('calendarWidgetDaysGrid');
  const calendarPrevMonthBtn = document.getElementById('calendarPrevMonthBtn');
  const calendarNextMonthBtn = document.getElementById('calendarNextMonthBtn');
  const statsTotalCount = document.getElementById('statsTotalCount');
  const statsUpcomingCount = document.getElementById('statsUpcomingCount');
  const statsMonthActiveCount = document.getElementById('statsMonthActiveCount');
  const todayHighlightCard = document.getElementById('todayHighlightCard');

  // Calendar Detail View
  const calDetailBackBtn = document.getElementById('calDetailBackBtn');
  const detailDayOfWeek = document.getElementById('detailDayOfWeek');
  const detailBSDate = document.getElementById('detailBSDate');
  const detailADDate = document.getElementById('detailADDate');
  const detailEntriesCountBadge = document.getElementById('detailEntriesCountBadge');
  const detailDayCardsContainer = document.getElementById('detailDayCardsContainer');

  // Records View
  const recordsSearchInput = document.getElementById('recordsSearchInput');
  const recordsListContainer = document.getElementById('recordsListContainer');
  const filterChips = document.querySelectorAll('.filter-chip');

  // Alerts View
  const alertsListContainer = document.getElementById('alertsListContainer');
  const alertTabBtns = document.querySelectorAll('.alert-tab-btn');
  const alertsEmptyState = document.getElementById('alertsEmptyState');

  // Settings View
  const settingsActiveEraDesc = document.getElementById('settingsActiveEraDesc');
  const settingsActiveThemeDesc = document.getElementById('settingsActiveThemeDesc');
  const themeSelectorSwitch = document.getElementById('themeSelectorSwitch');
  const toggleCalendarTypeBtn = document.getElementById('toggleCalendarTypeBtn');
  const settingsSyncReloadBtn = document.getElementById('settingsSyncReloadBtn');
  const settingsSyncText = document.getElementById('settingsSyncText');
  const toggleLanguageSettingRow = document.getElementById('toggleLanguageSettingRow');
  const settingsLanguageSwitchText = document.getElementById('settingsLanguageSwitchText');
  const settingsLanguageValue = document.getElementById('settingsLanguageValue');

  // Modal / Form elements
  const palaFabBtn = document.getElementById('palaFabBtn');
  const palaModalOverlay = document.getElementById('palaModalOverlay');
  const palaBottomSheet = document.getElementById('palaBottomSheet');
  const palaModalCloseBtn = document.getElementById('palaModalCloseBtn');
  const palaModalCancelBtn = document.getElementById('palaModalCancelBtn');
  const palaAddEntryForm = document.getElementById('palaAddEntryForm');
  const formEditEntryId = document.getElementById('formEditEntryId');
  const formPersonName = document.getElementById('formPersonName');
  const formAddress = document.getElementById('formAddress');
  const formMobile = document.getElementById('formMobile');
  const formGroupName = document.getElementById('formGroupName');
  const formPaymentToggle = document.getElementById('formPaymentToggle');
  const paymentStatusDot = document.getElementById('paymentStatusDot');
  const paymentStatusText = document.getElementById('paymentStatusText');
  const paymentAmountWrap = document.getElementById('paymentAmountWrap');
  const formPaymentAmount = document.getElementById('formPaymentAmount');
  const paymentAmountHint = document.getElementById('paymentAmountHint');
  const formPaymentLabel = document.getElementById('formPaymentLabel');
  const btnSubmitFormText = document.getElementById('btnSubmitFormText');
  const bottomSheetFormTitle = document.getElementById('bottomSheetFormTitle');

  // Delete Prompt
  const palaDeleteDialogOverlay = document.getElementById('palaDeleteDialogOverlay');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  const btnCancelDelete = document.getElementById('btnCancelDelete');

  // ==========================================
  // 6. GLOBAL DICTIONARY UI TRANSLATION REFRESHER
  // ==========================================
  
  function translateUI() {
    const isBN = state.language === 'BN';
    
    // Quick Toggle button text updates
    headerLanguageToggleBtn.querySelector('span').textContent = isBN ? 'EN' : 'বাং';
    
    // Header title
    appHeaderTitle.textContent = getLocText('appTitle');

    // Drawer menu
    document.getElementById('drawerTitle').textContent = getLocText('drawerTitle');
    document.getElementById('drawerTextHome').textContent = getLocText('drawerTextHome');
    document.getElementById('drawerTextRecords').textContent = getLocText('drawerTextRecords');
    document.getElementById('drawerTextAlerts').textContent = getLocText('drawerTextAlerts');
    document.getElementById('drawerTextSettings').textContent = getLocText('drawerTextSettings');

    // Welcome Screen
    document.getElementById('welcomeUserGreeting').innerHTML = getLocText('welcomeTitle');
    document.getElementById('welcomeSubtitle').textContent = getLocText('welcomeSubtitle');

    // Bottom Navigation
    document.querySelector('#bottomTabHome span').textContent = getLocText('bottomTabHome');
    document.querySelector('#bottomTabCalendar span').textContent = getLocText('bottomTabCalendar');
    document.querySelector('#bottomTabRecords span').textContent = getLocText('bottomTabRecords');
    document.querySelector('#bottomTabAlerts span').textContent = getLocText('bottomTabAlerts');
    document.querySelector('#bottomTabSettings span').textContent = getLocText('bottomTabSettings');

    // Stats Labels
    document.getElementById('statLabelTotal').textContent = getLocText('statLabelTotal');
    document.getElementById('statLabelPalas').textContent = getLocText('statLabelPalas');
    document.getElementById('statLabelUpcoming').textContent = getLocText('statLabelUpcoming');
    document.getElementById('statLabelShifts').textContent = getLocText('statLabelShifts');
    document.getElementById('statLabelActive').textContent = getLocText('statLabelActive');
    document.getElementById('statLabelPriests').textContent = getLocText('statLabelPriests');
    document.getElementById('headlineTitle').textContent = getLocText('headlineTitle');
    document.getElementById('headlineStatus').textContent = getLocText('headlineStatus');

    // Settings Language indicators
    settingsLanguageSwitchText.textContent = isBN ? 'EN' : 'বাং';
    settingsLanguageValue.textContent = isBN ? 'বাংলা' : 'English (US)';

    // Dynamic Weekday Header Labels for Calendar Grid
    const weekdaySpans = document.querySelectorAll('.calendar-matrix-weekdays span');
    const bnWeekShort = ['র', 'সো', 'ম', 'বু', 'বৃ', 'শু', 'শ'];
    const enWeekShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    weekdaySpans.forEach((span, i) => {
      span.textContent = isBN ? bnWeekShort[i] : enWeekShort[i];
    });

    // Refresh greeting time text when language changes
    updateClockAndTime();
  }


  // Bind Global Language Switches (Header & Preferences)
  function toggleLanguage() {
    state.language = state.language === 'EN' ? 'BN' : 'EN';
    saveStateToStorage();
    
    // Refresh all UI elements dynamically
    translateUI();
    navigateToView(state.activeTab);
    
    showDynamicAlertNotification(state.language === 'BN' ? 'সিস্টেমের ভাষা বাংলা করা হয়েছে!' : 'System language changed to English!');
  }

  headerLanguageToggleBtn.addEventListener('click', toggleLanguage);
  toggleLanguageSettingRow.addEventListener('click', toggleLanguage);

  // ==========================================
  // 7. MONTH MATRIX RENDER SYSTEMS (DYNAMIC GRID)
  // ==========================================
  
  function renderCalendarGrid() {
    calendarWidgetDaysGrid.innerHTML = '';
    
    if (state.calendarEra === 'BS') {
      // DYNAMIC BENGALI MONTH MATRIX
      const startG = getGregorianFromBengali(state.currentCalendarYear, state.currentCalendarMonth, 1);
      const startGDate = new Date(startG.year, startG.month, startG.day);
      const startDayOfWeek = startGDate.getDay();
      
      const prevM = (state.currentCalendarMonth - 1 + 12) % 12;
      const prevMDays = BENGALI_MONTH_DAYS[prevM];
      
      // Previous month padding cells
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const cell = document.createElement('span');
        cell.className = 'calendar-day-cell inactive-month-day';
        cell.textContent = formatNumber(prevMDays - i);
        calendarWidgetDaysGrid.appendChild(cell);
      }

      // Active month cells
      const totalDays = BENGALI_MONTH_DAYS[state.currentCalendarMonth];
      
      for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('span');
        cell.className = 'calendar-day-cell';
        cell.textContent = formatNumber(day);
        cell.dataset.day = day;

        const hasRecords = state.recordsBS.some(r => r.dayOfMonth === day && r.monthIndex === state.currentCalendarMonth);
        if (hasRecords) {
          const dot = document.createElement('span');
          dot.className = 'calendar-day-dot';
          cell.appendChild(dot);
        }

        // Highlight selected day
        if (day === state.selectedDate.day && state.currentCalendarMonth === state.selectedDate.month) {
          cell.classList.add('active-selected-day');
        }

        // Highlight today's dynamic date in grid
        const liveBDate = getBengaliFromGregorian(today.getFullYear(), today.getMonth(), today.getDate());
        if (day === liveBDate.day && state.currentCalendarMonth === liveBDate.month && state.currentCalendarYear === liveBDate.year) {
          cell.classList.add('active-today');
        }

        cell.addEventListener('click', () => {
          state.selectedDate.day = day;
          state.selectedDate.month = state.currentCalendarMonth;
          state.selectedDate.year = state.currentCalendarYear;
          
          renderCalendarGrid();
          navigateToView('calendar');
        });

        calendarWidgetDaysGrid.appendChild(cell);
      }

      // Next month padding cells to complete 42 elements grid (6 rows * 7 days)
      const currentCellCount = startDayOfWeek + totalDays;
      const nextMonthPadding = 42 - currentCellCount;
      for (let day = 1; day <= nextMonthPadding; day++) {
        const cell = document.createElement('span');
        cell.className = 'calendar-day-cell inactive-month-day';
        cell.textContent = formatNumber(day);
        calendarWidgetDaysGrid.appendChild(cell);
      }

    } else {
      // DYNAMIC ENGLISH AD MONTH MATRIX
      const startGDate = new Date(state.currentCalendarYear, state.currentCalendarMonth, 1);
      const startDayOfWeek = startGDate.getDay();
      
      const prevGDate = new Date(state.currentCalendarYear, state.currentCalendarMonth, 0);
      const prevMDays = prevGDate.getDate();
      
      // Previous month padding cells
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const cell = document.createElement('span');
        cell.className = 'calendar-day-cell inactive-month-day';
        cell.textContent = formatNumber(prevMDays - i);
        calendarWidgetDaysGrid.appendChild(cell);
      }

      // Active month cells
      const totalDays = new Date(state.currentCalendarYear, state.currentCalendarMonth + 1, 0).getDate();
      
      for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('span');
        cell.className = 'calendar-day-cell';
        cell.textContent = formatNumber(day);
        cell.dataset.day = day;

        const hasRecords = state.recordsAD.some(r => r.dayOfMonth === day && r.monthIndex === state.currentCalendarMonth);
        if (hasRecords) {
          const dot = document.createElement('span');
          dot.className = 'calendar-day-dot';
          cell.appendChild(dot);
        }

        // Highlight selected day
        if (day === state.selectedDate.day && state.currentCalendarMonth === state.selectedDate.month) {
          cell.classList.add('active-selected-day');
        }

        // Highlight today's dynamic date in grid
        if (day === today.getDate() && state.currentCalendarMonth === today.getMonth() && state.currentCalendarYear === today.getFullYear()) {
          cell.classList.add('active-today');
        }

        cell.addEventListener('click', () => {
          state.selectedDate.day = day;
          state.selectedDate.month = state.currentCalendarMonth;
          state.selectedDate.year = state.currentCalendarYear;
          
          renderCalendarGrid();
          navigateToView('calendar');
        });

        calendarWidgetDaysGrid.appendChild(cell);
      }

      // Next month padding cells to complete 42 elements grid (6 rows * 7 days)
      const currentCellCount = startDayOfWeek + totalDays;
      const nextMonthPadding = 42 - currentCellCount;
      for (let day = 1; day <= nextMonthPadding; day++) {
        const cell = document.createElement('span');
        cell.className = 'calendar-day-cell inactive-month-day';
        cell.textContent = formatNumber(day);
        calendarWidgetDaysGrid.appendChild(cell);
      }
    }
  }

  calendarPrevMonthBtn.addEventListener('click', () => {
    state.currentCalendarMonth--;
    if (state.currentCalendarMonth < 0) {
      state.currentCalendarMonth = 11;
      state.currentCalendarYear--;
    }
    updateCalendarHeaders();
    renderCalendarGrid();
  });

  calendarNextMonthBtn.addEventListener('click', () => {
    state.currentCalendarMonth++;
    if (state.currentCalendarMonth > 11) {
      state.currentCalendarMonth = 0;
      state.currentCalendarYear++;
    }
    updateCalendarHeaders();
    renderCalendarGrid();
  });

  function updateCalendarHeaders() {
    if (state.calendarEra === 'BS') {
      const yearBangla = formatNumber(state.currentCalendarYear);
      calendarWidgetMonthTitle.textContent = state.language === 'BN' 
        ? `${BENGALI_MONTHS_BANGLA[state.currentCalendarMonth]} ${yearBangla}`
        : `${BENGALI_MONTHS_ENG[state.currentCalendarMonth]} ${yearBangla}`;
    } else {
      calendarWidgetMonthTitle.textContent = `${GREGORIAN_MONTHS[state.currentCalendarMonth]} ${state.currentCalendarYear}`;
    }
  }

  // ==========================================
  // 8. TAB & VIEW CONTROL
  // ==========================================
  
  function navigateToView(viewId) {
    closeSideDrawer();
    closeModal();
    
    state.activeTab = viewId;
    
    Object.keys(tabItems).forEach(key => {
      tabItems[key].classList.remove('tab-selected');
    });

    Object.keys(views).forEach(key => {
      views[key].classList.remove('active-view');
    });

    // Fire translation updates
    translateUI();

    if (viewId === 'home') {
      views.home.classList.add('active-view');
      tabItems.home.classList.add('tab-selected');
      renderDashboard();
    } else if (viewId === 'calendar') {
      views.calendar.classList.add('active-view');
      tabItems.calendar.classList.add('tab-selected');
      renderDayDetails(state.selectedDate.day);
    } else if (viewId === 'records') {
      views.records.classList.add('active-view');
      tabItems.records.classList.add('tab-selected');
      renderRecordsList();
    } else if (viewId === 'alerts') {
      views.alerts.classList.add('active-view');
      tabItems.alerts.classList.add('tab-selected');
      renderAlertsList();
    } else if (viewId === 'settings') {
      views.settings.classList.add('active-view');
      tabItems.settings.classList.add('tab-selected');
      renderSettings();
    } else if (viewId === 'welcome') {
      views.welcome.classList.add('active-view');
    }
    
    if (viewId === 'calendar') {
      palaFabBtn.classList.add('alternative-style');
    } else {
      palaFabBtn.classList.remove('alternative-style');
    }

    appViewport.scrollTop = 0;
  }

  // Welcome Screen click handlers
  selectBSEraBtn.addEventListener('click', () => {
    state.calendarEra = 'BS';
    initializeDateState();
    saveStateToStorage();
    navigateToView('home');
  });

  selectADEraBtn.addEventListener('click', () => {
    state.calendarEra = 'AD';
    initializeDateState();
    saveStateToStorage();
    navigateToView('home');
  });

  // ==========================================
  // BOTTOM TAB BAR NAVIGATION
  // ==========================================
  Object.keys(tabItems).forEach(key => {
    if (tabItems[key]) {
      tabItems[key].addEventListener('click', () => navigateToView(key));
    }
  });

  // ==========================================
  // STATS WIDGET CLICK SHORTCUTS
  // ==========================================
  const statsRecordsWidgetBtn = document.getElementById('statsRecordsWidgetBtn');
  const statsEventsWidgetBtn = document.getElementById('statsEventsWidgetBtn');
  const statsMonthWidgetBtn = document.getElementById('statsMonthWidgetBtn');
  if (statsRecordsWidgetBtn) statsRecordsWidgetBtn.addEventListener('click', () => navigateToView('records'));
  if (statsEventsWidgetBtn) statsEventsWidgetBtn.addEventListener('click', () => navigateToView('alerts'));
  if (statsMonthWidgetBtn) statsMonthWidgetBtn.addEventListener('click', () => navigateToView('records'));

  // ==========================================
  // CALENDAR DETAIL BACK BUTTON
  // ==========================================
  if (calDetailBackBtn) {
    calDetailBackBtn.addEventListener('click', () => navigateToView('home'));
  }

  // ==========================================
  // AVATAR PROFILE (Opens Settings)
  // ==========================================
  const avatarProfileBtn = document.getElementById('avatarProfileBtn');
  if (avatarProfileBtn) {
    avatarProfileBtn.addEventListener('click', () => navigateToView('settings'));
  }



  // ==========================================
  // 9. DATA RENDERING & SEPARATION (BS/AD ISOLATION)
  // ==========================================

  // A. HOME DASHBOARD RENDERING
  function renderDashboard() {
    updateClockAndTime();
    
    const activeRecs = getActiveRecords();

    // Stats calculations
    statsTotalCount.textContent = formatNumber(activeRecs.length);

    const upcomingCount = state.alerts.filter(a => a.category === 'upcoming').length;
    statsUpcomingCount.textContent = formatNumber(upcomingCount);
      
    const uniquePriests = new Set(activeRecs.map(r => r.name.trim())).size;
    statsMonthActiveCount.textContent = formatNumber(uniquePriests);

    // Show real admin name (not translation override)
    homeGreetName.textContent = state.adminName;

    // Dynamic headers based on Era (NO cross-era dates displayed)
    if (state.calendarEra === 'BS') {
      const liveB = getBengaliFromGregorian(today.getFullYear(), today.getMonth(), today.getDate());
      const bMonthStr = state.language === 'BN' ? BENGALI_MONTHS_BANGLA[liveB.month] : BENGALI_MONTHS_ENG[liveB.month];
      homeHeaderEraDate.textContent = `${bMonthStr} ${formatNumber(liveB.day)}, ${formatNumber(liveB.year)}`;
      homeEraBadge.textContent = state.language === 'BN' 
        ? `${formatNumber(liveB.year)} বঙ্গাব্দ` 
        : `${formatNumber(liveB.year)} BS Era`;
    } else {
      homeHeaderEraDate.textContent = `${GREGORIAN_MONTHS[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
      homeEraBadge.textContent = `${today.getFullYear()} AD Era`;
    }

    // Render today's real Palas
    renderTodayHighlight(activeRecs);

    updateCalendarHeaders();
    renderCalendarGrid();
  }

  function renderTodayHighlight(activeRecs) {
    const container = document.getElementById('todayHighlightContainer');
    if (!container) return;
    container.innerHTML = '';

    // Find records for today's date
    let todayRecords = [];
    if (state.calendarEra === 'BS') {
      const liveB = getBengaliFromGregorian(today.getFullYear(), today.getMonth(), today.getDate());
      todayRecords = activeRecs.filter(r => r.dayOfMonth === liveB.day && r.monthIndex === liveB.month);
    } else {
      todayRecords = activeRecs.filter(r => r.dayOfMonth === today.getDate() && r.monthIndex === today.getMonth());
    }

    if (todayRecords.length === 0) {
      container.innerHTML = `
        <div class="today-empty-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${state.language === 'BN' ? 'আজকের জন্য কোনো পালা নির্ধারিত নেই' : 'No Palas allocated for today'}</span>
          <span style="font-size:12px;">${state.language === 'BN' ? '+ বোতামে ক্লিক করে পালা যোগ করুন' : 'Tap + to allocate a temple turn'}</span>
        </div>
      `;
      return;
    }

    todayRecords.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'today-pala-mini-card';
      
      const isBN = state.language === 'BN';
      const paymentBadge = rec.paid 
        ? `<span class="mini-card-tag tag-paid">₹${formatNumber(rec.paymentAmount)} ${isBN ? 'পরিশোধিত' : 'Paid'}</span>`
        : `<span class="mini-card-tag tag-unpaid">${isBN ? 'অপরিশোধিত' : 'Unpaid'}</span>`;
      
      card.innerHTML = `
        ${paymentBadge}
        <span class="mini-card-name">${rec.name}</span>
        ${rec.address ? `<span class="mini-card-address">📍 ${rec.address}</span>` : ''}
        ${rec.mobile ? `<span class="mini-card-address">📞 ${rec.mobile}</span>` : ''}
      `;
      card.addEventListener('click', () => {
        state.selectedDate.day = rec.dayOfMonth;
        state.selectedDate.month = rec.monthIndex;
        renderCalendarGrid();
        navigateToView('calendar');
      });
      container.appendChild(card);
    });
  }


  // B. CALENDAR DAY DETAIL VIEW RENDERING
  function renderDayDetails(day) {
    detailDayCardsContainer.innerHTML = '';
    
    // Separate: BS shows BS dates, AD shows AD dates (NO cross-calendar)
    if (state.calendarEra === 'BS') {
      const startG = getGregorianFromBengali(state.currentCalendarYear, state.currentCalendarMonth, day);
      const gDateObj = new Date(startG.year, startG.month, startG.day);
      
      detailDayOfWeek.textContent = state.language === 'BN' 
        ? BENGALI_WEEKDAYS[gDateObj.getDay()] 
        : GREGORIAN_WEEKDAYS[gDateObj.getDay()];
        
      const bMonthStr = state.language === 'BN' ? BENGALI_MONTHS_BANGLA[state.selectedDate.month] : BENGALI_MONTHS_ENG[state.selectedDate.month];
      detailBSDate.textContent = `${bMonthStr} ${formatNumber(day)}, ${formatNumber(state.selectedDate.year)}`;
      
      // Hide English AD subtitle completely
      detailADDate.style.display = 'none';
    } else {
      const gDateObj = new Date(state.selectedDate.year, state.selectedDate.month, day);
      
      detailDayOfWeek.textContent = state.language === 'BN'
        ? BENGALI_WEEKDAYS[gDateObj.getDay()]
        : GREGORIAN_WEEKDAYS[gDateObj.getDay()];
        
      detailBSDate.textContent = `${GREGORIAN_MONTHS[state.selectedDate.month]} ${day}, ${state.selectedDate.year}`;
      
      // Hide Bengali BS subtitle completely
      detailADDate.style.display = 'none';
    }

    // Dynamic section titles
    document.getElementById('calDetailBackLabel').textContent = getLocText('calDetailBackLabel');
    document.getElementById('palaEntriesHeadline').textContent = getLocText('palaEntriesHeadline');

    const activeRecs = getActiveRecords();
    const dayRecords = activeRecs.filter(r => r.dayOfMonth === day && r.monthIndex === state.selectedDate.month);
    
    detailEntriesCountBadge.textContent = state.language === 'BN'
      ? `${formatNumber(dayRecords.length)} টি বরাদ্দ`
      : `${dayRecords.length} ${dayRecords.length === 1 ? 'Allocation' : 'Allocations'}`;

    if (dayRecords.length === 0) {
      detailDayCardsContainer.innerHTML = `
        <div class="alert-empty-box" style="padding: 24px 0;">
          <p>${state.language === 'BN' ? 'এই তারিখে কোনো সেবা বরাদ্দ করা হয়নি।' : 'No priest duties allocated on this date.'}</p>
          <span style="font-size:12px; margin-top:6px; color:var(--color-text-light);">${state.language === 'BN' ? 'নতুন পালা বণ্টন করতে নিচের "+" বাটনে ক্লিক করুন' : 'Tap "+" below to allocate a temple turn'}</span>
        </div>
      `;
      return;
    }

    // Render cards
    dayRecords.forEach(rec => {
      const card = document.createElement('article');
      card.className = `pala-record-card ${rec.colorClass || ''}`;
      
      const isBN = state.language === 'BN';
      const paymentBadge = rec.paid 
        ? `<span class="payment-badge status-paid">
             <span class="payment-badge-dot"></span>
             ${isBN ? 'পরিশোধিত' : 'Paid'}: ₹${formatNumber(rec.paymentAmount)}
           </span>`
        : `<span class="payment-badge status-unpaid">
             <span class="payment-badge-dot"></span>
             ${isBN ? 'অপরিশোধিত' : 'Unpaid'}
           </span>`;

      card.innerHTML = `
        <div class="card-head-row">
          <div>
            <h3>${rec.name}</h3>
          </div>
          <div class="card-actions-menu">
            <button class="card-action-btn edit-record-btn" data-id="${rec.id}" aria-label="Edit record">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="card-action-btn delete-btn delete-record-btn" data-id="${rec.id}" aria-label="Delete record">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="card-loc-line">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${rec.address}</span>
        </div>
        ${rec.mobile ? `
        <div class="card-loc-line" style="margin-top:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>${rec.mobile}</span>
        </div>
        ` : ''}
        <div class="card-payment-line">
          ${paymentBadge}
        </div>
      `;

      card.querySelector('.edit-record-btn').addEventListener('click', () => openEditModal(rec.id));
      card.querySelector('.delete-record-btn').addEventListener('click', () => promptDeleteRecord(rec.id));

      detailDayCardsContainer.appendChild(card);
    });
  }

  // C. RECORDS VIEW RENDERING
  function renderRecordsList() {
    recordsListContainer.innerHTML = '';
    
    // Localize filter chips
    const chips = document.querySelectorAll('.filter-chip');
    if (state.language === 'BN') {
      chips[0].textContent = "সেবাইতের নাম";
      chips[1].textContent = "তারিখ";
      chips[2].textContent = "মাস";
      chips[3].textContent = "ঠিকানা";
      recordsSearchInput.placeholder = "পালাদার বা সেবাইত খুঁজুন...";
    } else {
      chips[0].textContent = "Priest Name";
      chips[1].textContent = "Date";
      chips[2].textContent = "Month";
      chips[3].textContent = "Address";
      recordsSearchInput.placeholder = "Search Pala duty allocations...";
    }

    let filteredRecords = [...getActiveRecords()];
    
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filteredRecords = filteredRecords.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.address.toLowerCase().includes(q) ||
        (r.mobile && r.mobile.toLowerCase().includes(q))
      );
    }

    // Sort matching active chip
    if (state.recordsActiveFilter === 'name') {
      filteredRecords.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.recordsActiveFilter === 'date') {
      filteredRecords.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
    } else if (state.recordsActiveFilter === 'month') {
      filteredRecords.sort((a, b) => a.monthIndex - b.monthIndex);
    } else if (state.recordsActiveFilter === 'address') {
      filteredRecords.sort((a, b) => a.address.localeCompare(b.address));
    }

    if (filteredRecords.length === 0) {
      recordsListContainer.innerHTML = `
        <div class="alert-empty-box">
          <p>${getLocText('emptyRecordsMsg')}</p>
        </div>
      `;
      return;
    }

    // Render cards
    filteredRecords.forEach(rec => {
      const card = document.createElement('article');
      card.className = `pala-record-card ${rec.colorClass || ''}`;
      
      const badgeText = state.calendarEra === 'BS' ? rec.eraDate : rec.gregorianDate;
      const isYellowBadge = rec.dayOfMonth % 2 === 0;
      
      const isBN = state.language === 'BN';
      const paymentBadge = rec.paid 
        ? `<span class="payment-badge status-paid">
             <span class="payment-badge-dot"></span>
             ${isBN ? 'পরিশোধিত' : 'Paid'}: ₹${formatNumber(rec.paymentAmount)}
           </span>`
        : `<span class="payment-badge status-unpaid">
             <span class="payment-badge-dot"></span>
             ${isBN ? 'অপরিশোধিত' : 'Unpaid'}
           </span>`;
      
      card.innerHTML = `
        <div class="card-head-row">
          <div>
            <span class="card-tag-badge ${isYellowBadge ? 'tag-yellow' : 'tag-maroon'}" style="display:inline-block;">${badgeText}</span>
            <h3>${rec.name}</h3>
          </div>
          <div class="card-actions-menu">
            <button class="card-action-btn edit-record-btn" data-id="${rec.id}" aria-label="Edit record">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="card-action-btn delete-btn delete-record-btn" data-id="${rec.id}" aria-label="Delete record">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="card-loc-line">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${rec.address}</span>
        </div>
        ${rec.mobile ? `
        <div class="card-loc-line" style="margin-top:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>${rec.mobile}</span>
        </div>
        ` : ''}
        <div class="card-payment-line">
          ${paymentBadge}
        </div>
      `;

      card.querySelector('.edit-record-btn').addEventListener('click', () => openEditModal(rec.id));
      card.querySelector('.delete-record-btn').addEventListener('click', () => promptDeleteRecord(rec.id));

      recordsListContainer.appendChild(card);
    });
  }

  recordsSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderRecordsList();
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active-chip'));
      chip.classList.add('active-chip');
      state.recordsActiveFilter = chip.dataset.filter;
      renderRecordsList();
    });
  });

  // D. ALERTS TIMELINE RENDERING
  function renderAlertsList() {
    alertsListContainer.innerHTML = '';
    
    // Dynamic titles
    const alertsHeader = document.querySelector('.alerts-header');
    alertsHeader.querySelector('h1').textContent = getLocText('alertsHeaderH1');
    alertsHeader.querySelector('p').textContent = getLocText('alertsHeaderP');

    const alertBtns = document.querySelectorAll('.alert-tab-btn');
    alertBtns[0].textContent = getLocText('alertTabBtn0');
    alertBtns[1].textContent = getLocText('alertTabBtn1');
    alertBtns[2].textContent = getLocText('alertTabBtn2');
    
    alertsEmptyState.querySelector('p').textContent = getLocText('alertsEmptyStateP');

    const activeAlerts = state.alerts.filter(a => a.category === state.alertsActiveTab);
    
    if (activeAlerts.length === 0) {
      alertsListContainer.style.display = 'none';
      alertsEmptyState.style.display = 'flex';
      return;
    }

    alertsListContainer.style.display = 'flex';
    alertsEmptyState.style.display = 'none';

    activeAlerts.forEach(alt => {
      const card = document.createElement('article');
      
      const isUrgent = alt.tag === "Coming in 2 hours" || alt.tag === "২ ঘণ্টার মধ্যে";
      const isGuide = alt.tag === "Heritage Guide" || alt.tag === "পরিকল্পনা শিফট";
      const isCompleted = alt.tag === "Completed" || alt.tag === "সম্পন্ন";
      
      let tagClass = "alert-tag-completed";
      if (isUrgent) tagClass = "alert-tag-urgent";
      if (isGuide) tagClass = "alert-tag-guide";
      
      const displayTag = state.language === 'BN' 
        ? (isUrgent ? '২ ঘণ্টার মধ্যে' : isGuide ? 'পরিকল্পনা শিফট' : 'সম্পন্ন') 
        : alt.tag;

      const displayTime = state.language === 'BN'
        ? (alt.time.includes('AM') ? formatNumber(alt.time.replace('AM','')) + 'পূর্বাহ্ন' : alt.time.includes('PM') ? formatNumber(alt.time.replace('PM','')) + 'অপরাহ্ন' : alt.time)
        : alt.time;

      card.className = `alert-timeline-card ${isCompleted ? 'alert-completed' : ''} ${isUrgent ? 'alert-urgent' : ''}`;
      
      card.innerHTML = `
        <div class="alert-card-meta">
          <span class="alert-card-tag ${tagClass}">${displayTag}</span>
          <button class="card-action-btn" aria-label="Alert actions">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
        <h2>${alt.title}</h2>
        <p>${alt.notes}</p>
        
        <div class="alert-footer-action">
          <div class="alert-time-indicator">
            ${isCompleted ? `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            `}
            <span>${displayTime}</span>
          </div>
          ${!isCompleted ? `
            <button class="alert-btn-action mark-done-btn" data-id="${alt.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${state.language === 'BN' ? 'সম্পন্ন করুন' : 'Mark Done'}</span>
            </button>
          ` : ''}
        </div>
      `;

      const markBtn = card.querySelector('.mark-done-btn');
      if (markBtn) {
        markBtn.addEventListener('click', () => {
          alt.category = 'history';
          alt.tag = 'Completed';
          alt.time = 'Completed';
          saveStateToStorage();
          renderAlertsList();
        });
      }

      alertsListContainer.appendChild(card);
    });
  }

  // E. SETTINGS VIEW RENDERING
  function renderSettings() {
    const prefLabel = document.querySelectorAll('.settings-group-label')[0];
    const dataLabel = document.querySelectorAll('.settings-group-label')[1];
    const infoLabel = document.querySelectorAll('.settings-group-label')[2];
    
    // Group categories
    prefLabel.textContent = getLocText('settingsGroupLabel0');
    dataLabel.textContent = getLocText('settingsGroupLabel1');
    infoLabel.textContent = getLocText('settingsGroupLabel2');

    // Switch labels
    document.querySelector('#toggleCalendarTypeBtn h3').textContent = getLocText('settingsSwitchCalendarH3');
    document.querySelector('.settings-item-row:nth-child(3) h3').textContent = getLocText('settingsThemeH3');
    document.querySelector('#toggleLanguageSettingRow h3').textContent = getLocText('settingsLanguageH3');
    document.querySelector('#settingsExportBtn h3').textContent = getLocText('settingsExportH3');
    document.querySelector('#settingsBackupBtn h3').textContent = getLocText('settingsBackupH3');
    document.querySelector('.settings-card-group:nth-child(6) h3').textContent = getLocText('settingsAboutH3');
    document.querySelector('#settingsSignOutBtn span').textContent = getLocText('settingsSignOutSpan');

    if (state.calendarEra === 'BS') {
      settingsActiveEraDesc.textContent = state.language === 'BN' ? 'বাংলা বঙ্গাব্দ (BS)' : 'Traditional Bengali Era (BS)';
    } else {
      settingsActiveEraDesc.textContent = 'Gregorian Calendar (AD)';
    }
    
    settingsActiveThemeDesc.textContent = state.theme === 'light' 
      ? (state.language === 'BN' ? 'লাইট মোড' : 'Light Mode') 
      : (state.language === 'BN' ? 'ডার্ক মোড' : 'Dark Mode');
      
    themeSelectorSwitch.checked = state.theme === 'dark';

    // Show real saved admin name (NOT translation key)
    const settingsUserNameEl = document.getElementById('settingsUserName');
    if (settingsUserNameEl) settingsUserNameEl.textContent = state.adminName;

    // Bind editable name buttons each time settings renders
    const editNameBtn = document.getElementById('editNameBtn');
    const saveAdminNameBtn = document.getElementById('saveAdminNameBtn');
    const cancelAdminNameBtn = document.getElementById('cancelAdminNameBtn');
    const editableNameWrap = document.getElementById('editableNameWrap');
    const editableNameInputWrap = document.getElementById('editableNameInputWrap');
    const adminNameInput = document.getElementById('adminNameInput');
    const adminTempleInput = document.getElementById('adminTempleInput');

    if (editNameBtn) {
      editNameBtn.onclick = () => {
        if (adminNameInput) adminNameInput.value = state.adminName;
        if (adminTempleInput) adminTempleInput.value = state.adminTemple;
        if (editableNameWrap) editableNameWrap.style.display = 'none';
        if (editableNameInputWrap) editableNameInputWrap.style.display = 'block';
      };
    }

    if (cancelAdminNameBtn) {
      cancelAdminNameBtn.onclick = () => {
        if (editableNameWrap) editableNameWrap.style.display = 'flex';
        if (editableNameInputWrap) editableNameInputWrap.style.display = 'none';
      };
    }

    if (saveAdminNameBtn) {
      saveAdminNameBtn.onclick = () => {
        const newName = adminNameInput ? adminNameInput.value.trim() : '';
        const newTemple = adminTempleInput ? adminTempleInput.value.trim() : '';
        if (newName) {
          state.adminName = newName;
          if (newTemple) state.adminTemple = newTemple;
          saveStateToStorage();
          if (settingsUserNameEl) settingsUserNameEl.textContent = state.adminName;
          if (editableNameWrap) editableNameWrap.style.display = 'flex';
          if (editableNameInputWrap) editableNameInputWrap.style.display = 'none';
          showDynamicAlertNotification(state.language === 'BN' ? 'অ্যাডমিনের নাম সংরক্ষিত হয়েছে!' : 'Administrator name saved!');
        }
      };
    }
  }


  themeSelectorSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      state.theme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      state.theme = 'light';
    }
    saveStateToStorage();
    renderSettings();
  });

  toggleCalendarTypeBtn.addEventListener('click', () => {
    state.calendarEra = state.calendarEra === 'BS' ? 'AD' : 'BS';
    
    initializeDateState();
    saveStateToStorage();
    
    renderSettings();
    showDynamicAlertNotification(state.calendarEra === 'BS' ? getLocText('BN', 'Calendar Activated') || 'Traditional Bengali Calendar Activated!' : 'English Calendar Activated!');
  });

  document.getElementById('settingsExportBtn').addEventListener('click', () => {
    showDynamicAlertNotification(getLocText('notifyExportPrep'));
    setTimeout(() => {
      showDynamicAlertNotification(getLocText('notifyExportSuccess'));
    }, 1500);
  });

  settingsSyncReloadBtn.addEventListener('click', () => {
    settingsSyncReloadBtn.style.animation = "spin 1s infinite linear";
    settingsSyncText.textContent = state.language === 'BN' ? 'সিঙ্ক করা হচ্ছে...' : 'Syncing local databases...';
    
    setTimeout(() => {
      settingsSyncReloadBtn.style.animation = "";
      settingsSyncText.textContent = state.language === 'BN' ? 'শেষ সিঙ্ক: এইমাত্র' : 'Last synced: Just now';
      showDynamicAlertNotification(getLocText('notifySyncSuccess'));
    }, 1200);
  });

  document.getElementById('settingsSignOutBtn').addEventListener('click', () => {
    showDynamicAlertNotification(getLocText('notifySignOut'));
    setTimeout(() => {
      navigateToView('welcome');
    }, 1000);
  });

  // ==========================================
  // 10. FORM OPERATIONS (CRUD & ATTACHMENTS)
  // ==========================================

  palaFabBtn.addEventListener('click', openAddModal);
  palaModalCloseBtn.addEventListener('click', closeModal);
  palaModalCancelBtn.addEventListener('click', closeModal);
  palaModalOverlay.addEventListener('click', closeModal);

  function updatePaymentUIState() {
    const isBN = state.language === 'BN';
    formPaymentLabel.textContent = isBN ? "পেমেন্ট স্ট্যাটাস" : "Payment Status";
    paymentAmountHint.textContent = isBN ? "এই পালাটির জন্য পরিশোধিত টাকার পরিমাণ লিখুন" : "Enter the amount paid for this Pala turn";
    
    if (formPaymentToggle.checked) {
      paymentStatusDot.className = 'payment-status-dot paid-dot';
      paymentStatusText.textContent = isBN ? "পরিশোধিত" : "Paid";
      paymentStatusText.className = 'payment-status-text paid-text';
      paymentAmountWrap.style.display = 'block';
    } else {
      paymentStatusDot.className = 'payment-status-dot unpaid-dot';
      paymentStatusText.textContent = isBN ? "অপরিশোধিত" : "Not Paid";
      paymentStatusText.className = 'payment-status-text';
      paymentAmountWrap.style.display = 'none';
    }
  }

  formPaymentToggle.addEventListener('change', () => {
    updatePaymentUIState();
  });

  function openAddModal() {
    palaAddEntryForm.reset();
    formEditEntryId.value = '';
    
    bottomSheetFormTitle.textContent = getLocText('formTitleAdd');
    
    document.querySelector('label[for="formPersonName"]').textContent = getLocText('formLabelName');
    document.querySelector('label[for="formAddress"]').textContent = getLocText('formLabelAddress');
    document.querySelector('label[for="formMobile"]').textContent = getLocText('formLabelMobile');
    
    formPersonName.placeholder = getLocText('formPlaceholderName');
    formAddress.placeholder = getLocText('formPlaceholderAddress');
    formMobile.placeholder = getLocText('formPlaceholderMobile');
    
    document.getElementById('formNameError').querySelector('span').textContent = getLocText('formNameErrorText');
    
    btnSubmitFormText.textContent = getLocText('formSubmitSave');
    palaModalCancelBtn.textContent = getLocText('formBtnCancel');

    formGroupName.classList.remove('has-error');
    
    formPaymentToggle.checked = false;
    formPaymentAmount.value = '';
    updatePaymentUIState();
    
    palaBottomSheet.classList.add('modal-active');
    palaModalOverlay.classList.add('modal-active');
  }

  function openEditModal(recordId) {
    const activeRecs = getActiveRecords();
    const record = activeRecs.find(r => r.id === recordId);
    if (!record) return;

    formEditEntryId.value = record.id;
    formPersonName.value = record.name;
    formAddress.value = record.address;
    formMobile.value = record.mobile;
    
    bottomSheetFormTitle.textContent = getLocText('formTitleEdit');
    
    document.querySelector('label[for="formPersonName"]').textContent = getLocText('formLabelName');
    document.querySelector('label[for="formAddress"]').textContent = getLocText('formLabelAddress');
    document.querySelector('label[for="formMobile"]').textContent = getLocText('formLabelMobile');
    
    btnSubmitFormText.textContent = getLocText('formSubmitUpdate');
    palaModalCancelBtn.textContent = getLocText('formBtnCancel');

    formGroupName.classList.remove('has-error');
    
    formPaymentToggle.checked = !!record.paid;
    formPaymentAmount.value = record.paymentAmount || '';
    updatePaymentUIState();

    palaBottomSheet.classList.add('modal-active');
    palaModalOverlay.classList.add('modal-active');
  }

  function closeModal() {
    palaBottomSheet.classList.remove('modal-active');
    palaModalOverlay.classList.remove('modal-active');
  }

  // Submit Logic
  palaAddEntryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameVal = formPersonName.value.trim();
    const addressVal = formAddress.value.trim();
    const mobileVal = formMobile.value.trim();
    const editId = formEditEntryId.value;

    if (!nameVal) {
      formGroupName.classList.add('has-error');
      palaBottomSheet.style.animation = "shake 0.3s ease";
      setTimeout(() => palaBottomSheet.style.animation = "", 300);
      return;
    }

    formGroupName.classList.remove('has-error');

    // Mapped Dates
    let eraDateStr = "";
    let gregDateStr = "";
    
    const yearBangla = formatNumber(state.selectedDate.year);
    const dayBangla = formatNumber(state.selectedDate.day);

    if (state.calendarEra === 'BS') {
      const bMonthStr = state.language === 'BN' ? BENGALI_MONTHS_BANGLA[state.selectedDate.month] : BENGALI_MONTHS_ENG[state.selectedDate.month];
      eraDateStr = `${bMonthStr} ${dayBangla}, ${yearBangla}`;
      
      const conv = getGregorianFromBengali(state.selectedDate.year, state.selectedDate.month, state.selectedDate.day);
      gregDateStr = `${GREGORIAN_MONTHS[conv.month]} ${conv.day}, ${conv.year}`;
    } else {
      gregDateStr = `${GREGORIAN_MONTHS[state.selectedDate.month]} ${state.selectedDate.day}, ${state.selectedDate.year}`;
      
      const conv = getBengaliFromGregorian(state.selectedDate.year, state.selectedDate.month, state.selectedDate.day);
      const bMonthStr = state.language === 'BN' ? BENGALI_MONTHS_BANGLA[conv.month] : BENGALI_MONTHS_ENG[conv.month];
      eraDateStr = `${bMonthStr} ${formatNumber(conv.day)}, ${formatNumber(conv.year)}`;
    }

    const activeRecs = getActiveRecords();

    const isPaid = formPaymentToggle.checked;
    const amountVal = isPaid ? parseFloat(formPaymentAmount.value) || 0 : 0;

    if (editId) {
      const index = activeRecs.findIndex(r => r.id === editId);
      if (index !== -1) {
        activeRecs[index].name = nameVal;
        activeRecs[index].address = addressVal;
        activeRecs[index].mobile = mobileVal;
        activeRecs[index].paid = isPaid;
        activeRecs[index].paymentAmount = amountVal;
        showDynamicAlertNotification(state.language === 'BN' ? 'পালা বণ্টন আপডেট হয়েছে!' : 'Duty turn updated successfully!');
      }
    } else {
      const colorOptions = ["color-maroon", ""];
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      
      const newRec = {
        id: "rec_" + Date.now(),
        name: nameVal,
        address: addressVal || (state.language === 'BN' ? "মন্দির প্রাঙ্গণ" : "Temple Sanctuary"),
        mobile: mobileVal || "+91 99999 00000",
        eraDate: eraDateStr,
        gregorianDate: gregDateStr,
        dayOfMonth: state.selectedDate.day,
        monthIndex: state.selectedDate.month,
        paid: isPaid,
        paymentAmount: amountVal,
        colorClass: randomColor
      };
      
      activeRecs.unshift(newRec);
      showDynamicAlertNotification(state.language === 'BN' ? 'নতুন পালা বণ্টন সম্পন্ন!' : 'New duty shift allocated!');
    }

    setActiveRecords(activeRecs);
    closeModal();
    navigateToView(state.activeTab);
  });

  // Delete Prompt
  function promptDeleteRecord(recordId) {
    state.recordToDeleteId = recordId;
    
    const dialog = document.querySelector('.pala-dialog-box');
    dialog.querySelector('h2').textContent = getLocText('dialogDeleteH2');
    dialog.querySelector('p').textContent = getLocText('dialogDeleteP');
    btnConfirmDelete.textContent = getLocText('dialogBtnDelete');
    btnCancelDelete.textContent = getLocText('dialogBtnCancel');
    
    palaDeleteDialogOverlay.classList.add('dialog-active');
  }

  btnCancelDelete.addEventListener('click', () => {
    state.recordToDeleteId = null;
    palaDeleteDialogOverlay.classList.remove('dialog-active');
  });

  btnConfirmDelete.addEventListener('click', () => {
    if (state.recordToDeleteId) {
      let activeRecs = getActiveRecords();
      activeRecs = activeRecs.filter(r => r.id !== state.recordToDeleteId);
      
      setActiveRecords(activeRecs);
      
      showDynamicAlertNotification(state.language === 'BN' ? 'পালা বণ্টন বাতিল করা হয়েছে।' : 'Pala turn canceled.');
      state.recordToDeleteId = null;
      palaDeleteDialogOverlay.classList.remove('dialog-active');
      
      navigateToView(state.activeTab);
    }
  });

  // ==========================================
  // 11. BOOTSTRAP INITIALIZATION
  // ==========================================
  
  if (state.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  initializeDateState();
  
  // Set correct tab text translations for bottom navigation in Bengali on init
  translateUI();
  
  navigateToView('home');

  // Dynamic floating notification alerts helper
  function showDynamicAlertNotification(text) {
    const notifyBox = document.createElement('div');
    notifyBox.style.position = 'absolute';
    notifyBox.style.top = '84px';
    notifyBox.style.left = '50%';
    notifyBox.style.transform = 'translateX(-50%) translateY(-20px)';
    notifyBox.style.backgroundColor = 'rgba(45, 38, 33, 0.9)';
    notifyBox.style.color = '#FFFFFF';
    notifyBox.style.padding = '10px 20px';
    notifyBox.style.borderRadius = '20px';
    notifyBox.style.fontSize = '12px';
    notifyBox.style.fontWeight = '600';
    notifyBox.style.zIndex = '999';
    notifyBox.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
    notifyBox.style.opacity = '0';
    notifyBox.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.3)';
    notifyBox.style.pointerEvents = 'none';
    notifyBox.style.textAlign = 'center';
    notifyBox.style.width = 'max-content';
    notifyBox.style.maxWidth = '280px';
    
    notifyBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 8 12 12 16 14"></polyline>
        </svg>
        <span>${text}</span>
      </div>
    `;

    document.querySelector('.phone-mockup-frame').appendChild(notifyBox);
    
    setTimeout(() => {
      notifyBox.style.opacity = '1';
      notifyBox.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);

    setTimeout(() => {
      notifyBox.style.opacity = '0';
      notifyBox.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => notifyBox.remove(), 300);
    }, 2500);
  }

});

const dynamicStyles = document.createElement('style');
dynamicStyles.innerHTML = `
  @keyframes shake {
    0%, 100% { transform: translateY(0); }
    20%, 60% { transform: translateY(-4px) translateX(-4px); }
    40%, 80% { transform: translateY(-4px) translateX(4px); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(dynamicStyles);
