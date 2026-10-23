import React, { useState } from "react";
import {
  Wallet,
  CreditCard,
  BarChart2,
  User,
  Home,
  Bell,
  ChevronLeft,
  MoreVertical,
  Send,
  PlusCircle,
  QrCode,
  PieChart,
  Plus,
  ChevronRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  LayoutGrid,
  Smartphone,
  Sparkles,
  Signal,
  Wifi,
  BatteryCharging,
  ArrowDownLeft,
  ShieldCheck,
  HelpCircle,
  ShoppingBag
} from "lucide-react";

export default function WalletApp() {
  // Mode states: Light mode as primary/default, with dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("side-by-side"); // "side-by-side" | "interactive"
  const [activeInteractiveTab, setActiveInteractiveTab] = useState("home"); // "home" | "wallet" | "profile" | "statistics"
  const [isSpendingMasked, setIsSpendingMasked] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("Week"); // "Week" | "Month" | "Year"
  const [activeCashFlowTab, setActiveCashFlowTab] = useState("Outcome"); // "Income" | "Outcome"
  const [walletTab, setWalletTab] = useState("Cards"); // "Cards" | "Account"

  // Dynamic Chart points based on selectedPeriod
  const chartDataMap = {
    Week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      path: "M 10,110 C 50,115 70,85 100,80 C 130,75 160,105 190,95 C 220,85 240,30 270,30 C 290,30 310,70 315,80",
      area: "M 10,110 C 50,115 70,85 100,80 C 130,75 160,105 190,95 C 220,85 240,30 270,30 C 290,30 310,70 315,80 L 315,130 L 10,130 Z",
      peakX: 270,
      peakY: 30,
      peakValue: "Rp 750.000",
      highlightDay: "Fri & Sat",
      insightText: "Your spending decreased from 1% the last Week. Good Job!"
    },
    Month: {
      labels: ["W1", "W2", "W3", "W4"],
      path: "M 10,95 C 60,100 110,60 160,50 C 210,40 260,70 310,40",
      area: "M 10,95 C 60,100 110,60 160,50 C 210,40 260,70 310,40 L 310,130 L 10,130 Z",
      peakX: 310,
      peakY: 40,
      peakValue: "Rp 2.100.000",
      highlightDay: "W4",
      insightText: "Spending in W4 rose by 3% due to bill payments. Still within budget!"
    },
    Year: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      path: "M 10,80 C 80,60 140,90 200,45 C 250,20 280,35 310,25",
      area: "M 10,80 C 80,60 140,90 200,45 C 250,20 280,35 310,25 L 310,130 L 10,130 Z",
      peakX: 310,
      peakY: 25,
      peakValue: "Rp 12.800.000",
      highlightDay: "Q4",
      insightText: "Yearly savings target reached 88% of annual goal. Fantastic!"
    }
  };

  const currentChart = chartDataMap[selectedPeriod];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-[#070A12] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans pb-16">
        
        {/* Top Control Bar */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0c1222]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-white dark:bg-[#0c1222] rounded-[10px] flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Fintech E-Wallet UI/UX
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
                    Figma Recreated
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Home Page • Wallet Page • Statistics (Inform)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* View Mode Toggle */}
              <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  onClick={() => setViewMode("side-by-side")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === "side-by-side"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Presentation (3 Layar)</span>
                  <span className="sm:hidden">3 Layar</span>
                </button>
                <button
                  onClick={() => setViewMode("interactive")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === "interactive"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Interactive Phone</span>
                  <span className="sm:hidden">Phone</span>
                </button>
              </div>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:shadow-md transition flex items-center gap-2 text-xs font-semibold"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Info Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <div className="bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-cyan-500/20 dark:border-cyan-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Desain Sesuai Figma: </span>
                <span className="text-slate-600 dark:text-slate-300">
                  Dibuat dengan <b>Light Mode</b> sebagai tampilan default bersih & modern, serta mendukung <b>Dark Mode</b> (neon midnight) dengan klik tombol toggle di atas.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                UI/UX Selesai
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {viewMode === "side-by-side" ? (
            /* ============================================================== */
            /* VIEW 1: SIDE-BY-SIDE PRESENTATION VIEW (All 3 Screens visible) */
            /* ============================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              
              {/* SCREEN 1: HOME PAGE */}
              <div className="flex flex-col items-center">
                <div className="mb-3 text-center">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Screen 01</span>
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Home Page</h2>
                </div>
                <HomeScreen isDark={isDarkMode} />
              </div>

              {/* SCREEN 2: WALLET PAGE */}
              <div className="flex flex-col items-center">
                <div className="mb-3 text-center">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Screen 02</span>
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Wallet Page</h2>
                </div>
                <WalletScreen
                  isDark={isDarkMode}
                  walletTab={walletTab}
                  setWalletTab={setWalletTab}
                />
              </div>

              {/* SCREEN 3: INFORM (STATISTICS) */}
              <div className="flex flex-col items-center">
                <div className="mb-3 text-center">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Screen 03</span>
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Inform (Statistics)</h2>
                </div>
                <StatisticsScreen
                  isDark={isDarkMode}
                  selectedPeriod={selectedPeriod}
                  setSelectedPeriod={setSelectedPeriod}
                  currentChart={currentChart}
                  isSpendingMasked={isSpendingMasked}
                  setIsSpendingMasked={setIsSpendingMasked}
                  activeCashFlowTab={activeCashFlowTab}
                  setActiveCashFlowTab={setActiveCashFlowTab}
                />
              </div>

            </div>
          ) : (
            /* ============================================================== */
            /* VIEW 2: SINGLE INTERACTIVE PHONE                               */
            /* ============================================================== */
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-center mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400">Interactive Phone Mode</span>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Sentuh navigasi di bawah untuk berganti halaman</h2>
              </div>

              <div className="w-[370px] h-[750px] rounded-[50px] bg-white dark:bg-[#0C101D] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors">
                {/* Dynamic Island */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-30 h-4 bg-slate-900 dark:bg-slate-950 rounded-full z-40"></div>

                {/* Screen Content based on Active Tab */}
                <div className="flex-1 overflow-y-auto pt-7 pb-20 px-5 relative z-10">
                  {activeInteractiveTab === "home" && <HomeScreenContent isDark={isDarkMode} />}
                  {activeInteractiveTab === "wallet" && (
                    <WalletScreenContent
                      isDark={isDarkMode}
                      walletTab={walletTab}
                      setWalletTab={setWalletTab}
                    />
                  )}
                  {activeInteractiveTab === "statistics" && (
                    <StatisticsScreenContent
                      isDark={isDarkMode}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      currentChart={currentChart}
                      isSpendingMasked={isSpendingMasked}
                      setIsSpendingMasked={setIsSpendingMasked}
                      activeCashFlowTab={activeCashFlowTab}
                      setActiveCashFlowTab={setActiveCashFlowTab}
                    />
                  )}
                  {activeInteractiveTab === "profile" && <ProfileScreenContent isDark={isDarkMode} />}
                </div>

                {/* Floating Bottom Nav */}
                <div className="absolute bottom-3 left-4 right-4 z-30">
                  <div className="bg-white/95 dark:bg-[#12182B]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 rounded-3xl py-2.5 px-6 shadow-xl flex items-center justify-between">
                    <button
                      onClick={() => setActiveInteractiveTab("home")}
                      className={`flex flex-col items-center gap-1 transition ${
                        activeInteractiveTab === "home" ? "text-cyan-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      {activeInteractiveTab === "home" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    </button>
                    <button
                      onClick={() => setActiveInteractiveTab("wallet")}
                      className={`flex flex-col items-center gap-1 transition ${
                        activeInteractiveTab === "wallet" ? "text-cyan-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      {activeInteractiveTab === "wallet" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    </button>
                    <button
                      onClick={() => setActiveInteractiveTab("profile")}
                      className={`flex flex-col items-center gap-1 transition ${
                        activeInteractiveTab === "profile" ? "text-cyan-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      {activeInteractiveTab === "profile" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    </button>
                    <button
                      onClick={() => setActiveInteractiveTab("statistics")}
                      className={`flex flex-col items-center gap-1 transition ${
                        activeInteractiveTab === "statistics" ? "text-cyan-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <BarChart2 className="w-5 h-5" />
                      {activeInteractiveTab === "statistics" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    </button>
                  </div>
                  <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5"></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ============================================================== */
/* SUB-COMPONENTS: SCREENS                                        */
/* ============================================================== */

// 1. Home Screen Full Mockup
function HomeScreen({ isDark }) {
  return (
    <div className="w-[360px] h-[740px] rounded-[48px] bg-white dark:bg-[#0C101D] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 dark:bg-slate-950 rounded-full z-40"></div>
      <div className="flex-1 overflow-y-auto pt-7 pb-20 px-5 relative z-10">
        <HomeScreenContent isDark={isDark} />
      </div>
      <BottomDock active="home" />
    </div>
  );
}

function HomeScreenContent({ isDark }) {
  return (
    <>
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryCharging className="w-4 h-4" />
        </div>
      </div>

      {/* Header Profile */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-400/60 p-0.5"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0C101D] rounded-full"></span>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">Welcome back!</p>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hilal (Andy)</h3>
          </div>
        </div>
        <button className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-[#0C101D]"></span>
        </button>
      </div>

      {/* Donut Gauge Balance Card */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-[#131A2E] dark:to-[#0E1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-6 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-200 dark:text-slate-800/60"
            />
            <defs>
              <linearGradient id="circleGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke="url(#circleGradReact)"
              strokeWidth="8"
              strokeDasharray="301.59"
              strokeDashoffset="75"
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Saldo Tersedia</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Rp 32.500.000</span>
            <span className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              +12.4% bulan ini
            </span>
          </div>
        </div>
      </div>

      {/* History Transaksi Section */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">History Transaksi</h4>
        <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 cursor-pointer hover:underline">
          Lihat Semua
        </span>
      </div>

      <div className="space-y-2.5">
        {/* Gopay */}
        <div className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#171F36] border border-slate-200/60 dark:border-slate-800/80 transition flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Gopay</h5>
              <p className="text-[11px] text-slate-400">28 Sept, 2024</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-rose-500 dark:text-rose-400">- Rp 150.000</span>
            <p className="text-[10px] text-slate-400">Top Up Saldo</p>
          </div>
        </div>

        {/* Dana */}
        <div className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#171F36] border border-slate-200/60 dark:border-slate-800/80 transition flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Dana</h5>
              <p className="text-[11px] text-slate-400">12 Sept, 2024</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+ Rp 250.000</span>
            <p className="text-[10px] text-slate-400">Transfer Masuk</p>
          </div>
        </div>

        {/* TokoPedia */}
        <div className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#171F36] border border-slate-200/60 dark:border-slate-800/80 transition flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">TokoPedia</h5>
              <p className="text-[11px] text-slate-400">20 Sept, 2024</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">- Rp 299.599</span>
            <p className="text-[10px] text-slate-400">Belanja Online</p>
          </div>
        </div>

        {/* Shopeepay */}
        <div className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#171F36] border border-slate-200/60 dark:border-slate-800/80 transition flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Shopeepay</h5>
              <p className="text-[11px] text-slate-400">12 Sept, 2024</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">- Rp 188.100</span>
            <p className="text-[10px] text-slate-400">Food & Delivery</p>
          </div>
        </div>
      </div>
    </>
  );
}

// 2. Wallet Screen Full Mockup
function WalletScreen({ isDark, walletTab, setWalletTab }) {
  return (
    <div className="w-[360px] h-[740px] rounded-[48px] bg-white dark:bg-[#0C101D] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 dark:bg-slate-950 rounded-full z-40"></div>
      <div className="flex-1 overflow-y-auto pt-7 pb-20 px-5 relative z-10">
        <WalletScreenContent
          isDark={isDark}
          walletTab={walletTab}
          setWalletTab={setWalletTab}
        />
      </div>
      <BottomDock active="wallet" />
    </div>
  );
}

function WalletScreenContent({ isDark, walletTab, setWalletTab }) {
  return (
    <>
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryCharging className="w-4 h-4" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Wallet</h3>
        <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center transition">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Segmented Control */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 text-xs font-semibold">
        <button
          onClick={() => setWalletTab("Cards")}
          className={`flex-1 pb-3 text-center transition ${
            walletTab === "Cards"
              ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Cards
        </button>
        <button
          onClick={() => setWalletTab("Account")}
          className={`flex-1 pb-3 text-center transition ${
            walletTab === "Account"
              ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Account
        </button>
      </div>

      {/* Stacked Cards */}
      <div className="relative pt-6 pb-2 mb-6">
        <div className="absolute top-0 left-6 right-6 h-10 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-60 shadow-sm"></div>
        <div className="absolute top-2.5 left-3 right-3 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80 shadow-md"></div>
        
        <div className="relative z-10 w-full rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#4338CA] text-white p-5 shadow-xl shadow-indigo-500/25 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-yellow-100 border border-amber-400/80 shadow-inner flex flex-col justify-around p-1">
                <div className="w-full h-0.5 bg-amber-600/50"></div>
                <div className="w-full h-0.5 bg-amber-600/50"></div>
              </div>
              <Wifi className="w-4 h-4 text-white/80 rotate-90" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-white/90">Gopay</span>
          </div>

          <p className="font-mono text-base tracking-widest font-medium text-white drop-shadow mb-4">
            5000 0000 0000 0000
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] text-white/70 block uppercase tracking-wider">Valid Thru</span>
              <span className="text-xs font-semibold tracking-wider">02/28</span>
            </div>
            <div className="flex items-center -space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-rose-500 shadow-sm"></div>
              <div className="w-6 h-6 rounded-full bg-amber-400/90 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Action Buttons */}
      <div className="grid grid-cols-4 gap-2.5 mb-6">
        <button className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#182038] border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition group">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
            <Send className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Send</span>
        </button>

        <button className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#182038] border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
            <PlusCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Top Up</span>
        </button>

        <button className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#182038] border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Pay</span>
        </button>

        <button className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#121829] dark:hover:bg-[#182038] border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center justify-center gap-1.5 transition group">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
            <PieChart className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Report</span>
        </button>
      </div>

      {/* Add E-Wallet */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-[#131A2E] dark:to-[#17203A] border border-dashed border-cyan-400/40 dark:border-cyan-500/30 hover:border-cyan-500 transition cursor-pointer flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">+ Add E-Wallet</h5>
            <p className="text-[11px] text-slate-400">Add your E-wallet / Money</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101627] border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 dark:text-slate-500">Nomor E-wallet:</span>
        <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">0812-9842-****</span>
      </div>
    </>
  );
}

// 3. Statistics Screen Full Mockup
function StatisticsScreen({
  isDark,
  selectedPeriod,
  setSelectedPeriod,
  currentChart,
  isSpendingMasked,
  setIsSpendingMasked,
  activeCashFlowTab,
  setActiveCashFlowTab
}) {
  return (
    <div className="w-[360px] h-[740px] rounded-[48px] bg-white dark:bg-[#0C101D] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 dark:bg-slate-950 rounded-full z-40"></div>
      <div className="flex-1 overflow-y-auto pt-7 pb-20 px-5 relative z-10">
        <StatisticsScreenContent
          isDark={isDark}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          currentChart={currentChart}
          isSpendingMasked={isSpendingMasked}
          setIsSpendingMasked={setIsSpendingMasked}
          activeCashFlowTab={activeCashFlowTab}
          setActiveCashFlowTab={setActiveCashFlowTab}
        />
      </div>
      <BottomDock active="statistics" />
    </div>
  );
}

function StatisticsScreenContent({
  isDark,
  selectedPeriod,
  setSelectedPeriod,
  currentChart,
  isSpendingMasked,
  setIsSpendingMasked,
  activeCashFlowTab,
  setActiveCashFlowTab
}) {
  return (
    <>
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryCharging className="w-4 h-4" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Statistics</h3>
        <div className="w-9"></div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2 mb-5">
        {["Week", "Month", "Year"].map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPeriod(p)}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${
              selectedPeriod === p
                ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Total Spendings */}
      <div className="text-center py-4 mb-4">
        <span className="text-xs font-semibold text-slate-400 block mb-1">Total Spendings</span>
        <div className="flex items-center justify-center gap-2">
          <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-wider">
            {isSpendingMasked ? "Rp **.***.***,**" : "Rp 8.450.000,00"}
          </h4>
          <button
            onClick={() => setIsSpendingMasked(!isSpendingMasked)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {isSpendingMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Income vs Outcome */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-5 text-xs font-semibold">
        <button
          onClick={() => setActiveCashFlowTab("Income")}
          className={`flex-1 pb-2.5 text-center transition ${
            activeCashFlowTab === "Income"
              ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setActiveCashFlowTab("Outcome")}
          className={`flex-1 pb-2.5 text-center transition ${
            activeCashFlowTab === "Outcome"
              ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Outcome
        </button>
      </div>

      {/* Speech Bubble Insight Banner */}
      <div className="relative bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-[#0E2439] dark:to-[#0D1C2F] border border-cyan-200 dark:border-cyan-500/40 rounded-2xl p-3.5 mb-6 shadow-sm">
        <p className="text-xs font-semibold text-cyan-900 dark:text-cyan-300 leading-relaxed">
          {currentChart.insightText}
        </p>
        <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-[#0E2439] dark:to-[#0D1C2F] border-r border-b border-cyan-200 dark:border-cyan-500/40 transform rotate-45"></div>
      </div>

      {/* Wave / Area Chart */}
      <div className="relative pt-2 pb-6">
        <div className="absolute top-2 right-12 z-20 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-[10px] font-bold shadow-lg">
          <span>{currentChart.peakValue}</span>
        </div>

        <div className="w-full h-36">
          <svg viewBox="0 0 320 140" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="chartGradientReact" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#00F0FF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGradReact" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            <line x1="0" y1="30" x2="320" y2="30" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800/80" />
            <line x1="0" y1="80" x2="320" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800/80" />

            <path d={currentChart.area} fill="url(#chartGradientReact)" className="transition-all duration-500" />
            <path d={currentChart.path} fill="none" stroke="url(#lineGradReact)" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />

            <circle cx={currentChart.peakX} cy={currentChart.peakY} r="5" fill="#00F0FF" className="animate-pulse" />
            <circle cx={currentChart.peakX} cy={currentChart.peakY} r="10" fill="#00F0FF" fillOpacity="0.3" />
          </svg>
        </div>

        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-1 mt-1">
          {currentChart.labels.map((lbl, idx) => (
            <span
              key={idx}
              className={lbl.includes("Fri") || lbl.includes("Sat") || lbl === "W4" || lbl === "Q4" ? "text-cyan-500 font-bold" : ""}
            >
              {lbl}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

// 4. Profile Screen (For Interactive mode)
function ProfileScreenContent({ isDark }) {
  return (
    <>
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-4 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" />
          <BatteryCharging className="w-4 h-4" />
        </div>
      </div>
      <div className="text-center py-6">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
          alt="Avatar"
          className="w-20 h-20 rounded-full mx-auto ring-4 ring-cyan-400 p-0.5 object-cover mb-3"
        />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Hilal (Andy)</h3>
        <p className="text-xs text-slate-400">hilal.andy@fintech.id</p>
      </div>
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121829] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Keamanan Akun
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121829] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-cyan-500" /> Notifikasi Transaksi
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121829] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-purple-500" /> Pusat Bantuan
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </>
  );
}

// Bottom Dock for static preview
function BottomDock({ active }) {
  return (
    <div className="absolute bottom-3 left-4 right-4 z-30">
      <div className="bg-white/90 dark:bg-[#12182B]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 rounded-3xl py-2.5 px-6 shadow-xl flex items-center justify-between">
        <button className={active === "home" ? "text-cyan-500 flex flex-col items-center gap-1" : "text-slate-400 dark:text-slate-500 hover:text-slate-700"}>
          <Home className="w-5 h-5" />
          {active === "home" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
        </button>
        <button className={active === "wallet" ? "text-cyan-500 flex flex-col items-center gap-1" : "text-slate-400 dark:text-slate-500 hover:text-slate-700"}>
          <CreditCard className="w-5 h-5" />
          {active === "wallet" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
        </button>
        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700">
          <User className="w-5 h-5" />
        </button>
        <button className={active === "statistics" ? "text-cyan-500 flex flex-col items-center gap-1" : "text-slate-400 dark:text-slate-500 hover:text-slate-700"}>
          <BarChart2 className="w-5 h-5" />
          {active === "statistics" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
        </button>
      </div>
      <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5"></div>
    </div>
  );
}
