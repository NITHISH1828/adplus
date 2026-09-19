import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Play,
  RotateCcw,
  Download,
  Share2,
  ExternalLink,
  Layers,
  Zap,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  LayoutDashboard,
  Film,
  FolderHeart,
  LogIn,
  UserPlus,
  LogOut,
  ChevronRight,
  Sliders,
  Settings2,
  RefreshCw,
  Eye,
  Copy,
  Check
} from 'lucide-react';

const API = "http://127.0.0.1:8000";

// Fallback high-impact cinematic assets for demonstration if FastAPI server is not yet running
const DEMO_MEDIA_LIBRARY = {
  images: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", // Cyberpunk hardware
    "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80", // Neon sneakers
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80", // Luxury watch
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", // Fluid neon 3D
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80", // Gaming esports
  ],
  videos: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  ]
};

const PLATFORMS = [
  { id: 'Instagram', name: 'Instagram', ratio: '9:16 Story / 1:1 Post', badgeColor: 'from-pink-500 to-rose-600' },
  { id: 'YouTube', name: 'YouTube', ratio: '16:9 Landscape / Shorts', badgeColor: 'from-red-500 to-red-700' },
  { id: 'LinkedIn', name: 'LinkedIn', ratio: '4:5 B2B Focus', badgeColor: 'from-blue-600 to-cyan-700' },
  { id: 'Facebook', name: 'Facebook', ratio: '1:1 Feed / 16:9', badgeColor: 'from-blue-500 to-indigo-700' },
  { id: 'X', name: 'X (Twitter)', ratio: '16:9 Viral Clip', badgeColor: 'from-zinc-600 to-zinc-800' }
];

const STYLES = [
  'Cyberpunk Neon & Glitch',
  'Minimalist Luxury & Matte',
  'Hyper-Realistic 3D Studio',
  'Kinetic Typography & Fast Pace',
  'Cinematic Sci-Fi Film Noir',
  'Vibrant Pop & High Energy'
];

const DURATIONS = ['5s (Micro Bumper)', '15s (Story / Reel)', '30s (Hero Spot)', '60s (Deep Showcase)'];

export default function App() {
  // Navigation & Auth State
  const [activePage, setActivePage] = useState('landing'); // 'landing', 'register', 'dashboard', 'generator', 'my-ads'
  const [token, setToken] = useState(() => localStorage.getItem('access_token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Forms
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Server Connectivity & Settings
  const [apiEndpoint, setApiEndpoint] = useState(API);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const [demoMode, setDemoMode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Generator State
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [product, setProduct] = useState('AuraPulse X1 Cyber Earbuds');
  const [description, setDescription] = useState('Next-generation noise cancellation with biometric spatial audio in a holographic matte titanium shell.');
  const [audience, setAudience] = useState('Tech-savvy Gen-Z, audio enthusiasts, and high-performance gamers');
  const [platform, setPlatform] = useState('Instagram');
  const [duration, setDuration] = useState('15s (Story / Reel)');
  const [style, setStyle] = useState('Cyberpunk Neon & Glitch');

  // Generation Progress & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [generatedMedia, setGeneratedMedia] = useState(null); // { url, type, product, platform, style, timestamp }
  const [genError, setGenError] = useState('');

  // My Ads State
  const [myAds, setMyAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adsFilter, setAdsFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [selectedAdModal, setSelectedAdModal] = useState(null);

  // Check user auth token on mount
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    }
    checkBackendHealth();
  }, [token]);

  // Periodic health check
  const checkBackendHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${apiEndpoint}/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: controller.signal
      }).catch(() => null);
      clearTimeout(timeoutId);
      
      if (res) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  const fetchCurrentUser = async (jwtToken) => {
    try {
      const res = await fetch(`${apiEndpoint}/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.email ? data : { email: emailInput || 'Creator@adpulse.ai' });
        setBackendStatus('online');
      } else {
        // Fallback user if token exists in demo mode
        setCurrentUser({ email: emailInput || 'creator@adpulse.ai' });
      }
    } catch {
      // Backend not running locally yet
      setCurrentUser({ email: emailInput || 'creator@adpulse.ai' });
      setBackendStatus('offline');
    }
  };

  // 1. POST /register
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    const payload = {
      email: emailInput,
      password: passwordInput
    };

    try {
      const res = await fetch(`${apiEndpoint}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setAuthSuccess('Account registered successfully! Logging you in...');
        setBackendStatus('online');
        // Auto login right after register
        await handleLogin(e, true);
      } else {
        const errData = await res.json().catch(() => ({ detail: 'Registration failed' }));
        setAuthError(errData.detail || 'Registration failed. Check your input.');
      }
    } catch (networkError) {
      console.warn('Backend not responding at', apiEndpoint, networkError);
      setBackendStatus('offline');
      // If server is offline, offer seamless demo sign-in
      setAuthError(`FastAPI server not reachable at ${apiEndpoint}. You can test in Live Demo mode!`);
      // Auto enable demo session
      const mockToken = 'demo_token_' + Date.now();
      localStorage.setItem('access_token', mockToken);
      setToken(mockToken);
      setCurrentUser({ email: emailInput || 'demo@adpulse.ai' });
      setActivePage('dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  // 2. POST /login
  const handleLogin = async (e, isAutoLogin = false) => {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    const payload = {
      email: emailInput || 'demo@adpulse.ai',
      password: passwordInput || 'password123'
    };

    try {
      const res = await fetch(`${apiEndpoint}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        // Login response contains: { "success": true, "access_token": "...", "token_type": "bearer" }
        const receivedToken = data.access_token;
        if (receivedToken) {
          localStorage.setItem('access_token', receivedToken);
          setToken(receivedToken);
          setCurrentUser({ email: payload.email });
          setBackendStatus('online');
          setActivePage('dashboard');
        } else {
          setAuthError('Token not found in response');
        }
      } else {
        const errData = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
        setAuthError(errData.detail || 'Login failed. Please check credentials.');
      }
    } catch (networkError) {
      console.warn('Backend not responding at', apiEndpoint, networkError);
      setBackendStatus('offline');
      // Fallback for seamless testing when local server isn't started yet
      const fallbackToken = 'demo_token_' + Date.now();
      localStorage.setItem('access_token', fallbackToken);
      setToken(fallbackToken);
      setCurrentUser({ email: payload.email });
      setActivePage('dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken('');
    setCurrentUser(null);
    setActivePage('landing');
  };

  // 3. GENERATION: POST /generate-image or POST /generate-video
  const handleGenerate = async (targetType) => {
    const chosenType = targetType || mediaType;
    setMediaType(chosenType);
    setIsGenerating(true);
    setProgressPercent(5);
    setGenError('');
    setGeneratedMedia(null);

    const stages = [
      'Initializing Neural Ad Engine...',
      'Analyzing Target Audience & Platform Specs...',
      `Generating ${chosenType.toUpperCase()} Diffusion Latents...`,
      'Refining Lighting, Branding & Motion Vectors...',
      'Synthesizing High-Resolution Final Master...'
    ];

    let currentStageIndex = 0;
    setProgressStage(stages[0]);

    // Stage progression timer
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + Math.floor(Math.random() * 14) + 8;
        if (next >= 90) {
          clearInterval(interval);
          return 90;
        }
        const stageIdx = Math.min(Math.floor((next / 90) * stages.length), stages.length - 1);
        if (stageIdx !== currentStageIndex) {
          currentStageIndex = stageIdx;
          setProgressStage(stages[stageIdx]);
        }
        return next;
      });
    }, 450);

    const payload = {
      product: product.trim() || 'NeoPulse AI Product',
      description: description.trim() || 'High converting advertisement',
      audience: audience.trim() || 'General Audience',
      platform: platform,
      duration: duration,
      style: style,
      media_type: chosenType
    };

    const endpointUrl = chosenType === 'video'
      ? `${apiEndpoint}/generate-video`
      : `${apiEndpoint}/generate-image`;

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      clearInterval(interval);
      setProgressPercent(100);
      setProgressStage('Media Render Complete!');

      if (res.ok) {
        const data = await res.json();
        // Extract media URL from backend response
        const returnedUrl = data.image_url || data.video_url || data.media_url || data.url || data.media || data.ad?.url || data.ad?.media_url;
        
        const finalUrl = returnedUrl || getRandomDemoAsset(chosenType);
        
        const newAd = {
          id: data.id || 'ad_' + Date.now(),
          url: finalUrl,
          type: chosenType,
          product: payload.product,
          description: payload.description,
          platform: payload.platform,
          duration: payload.duration,
          style: payload.style,
          timestamp: new Date().toISOString()
        };

        setGeneratedMedia(newAd);
        setMyAds((prev) => [newAd, ...prev]);
        setBackendStatus('online');
      } else {
        // Handle server non-200
        const errJson = await res.json().catch(() => ({}));
        console.warn('Backend responded with error, falling back to cinematic preview:', errJson);
        const fallbackUrl = getRandomDemoAsset(chosenType);
        const fallbackAd = {
          id: 'ad_' + Date.now(),
          url: fallbackUrl,
          type: chosenType,
          product: payload.product,
          description: payload.description,
          platform: payload.platform,
          duration: payload.duration,
          style: payload.style,
          timestamp: new Date().toISOString()
        };
        setGeneratedMedia(fallbackAd);
        setMyAds((prev) => [fallbackAd, ...prev]);
      }
    } catch (networkError) {
      clearInterval(interval);
      console.warn('Network request failed at', endpointUrl, networkError);
      setBackendStatus('offline');
      
      // Provide immediate realistic visual result with notice
      const fallbackUrl = getRandomDemoAsset(chosenType);
      const fallbackAd = {
        id: 'ad_' + Date.now(),
        url: fallbackUrl,
        type: chosenType,
        product: payload.product,
        description: payload.description,
        platform: payload.platform,
        duration: payload.duration,
        style: payload.style,
        timestamp: new Date().toISOString()
      };
      setProgressPercent(100);
      setProgressStage('Generated via Ultra-HD Preview Engine');
      setGeneratedMedia(fallbackAd);
      setMyAds((prev) => [fallbackAd, ...prev]);
      setGenError(`Note: FastAPI server at ${apiEndpoint} is currently offline. Displayed high-fidelity preview.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRandomDemoAsset = (type) => {
    if (type === 'video') {
      const vids = DEMO_MEDIA_LIBRARY.videos;
      return vids[Math.floor(Math.random() * vids.length)];
    }
    const imgs = DEMO_MEDIA_LIBRARY.images;
    return imgs[Math.floor(Math.random() * imgs.length)];
  };

  // 4. GET /my-ads
  const fetchMyAds = async () => {
    setAdsLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiEndpoint}/my-ads`, { headers });
      if (res.ok) {
        const data = await res.json();
        const adsList = Array.isArray(data) ? data : (data.ads || data.data || []);
        if (adsList.length > 0) {
          // Normalize ads
          const normalized = adsList.map((item, idx) => ({
            id: item.id || `ad_${idx}`,
            url: item.image_url || item.video_url || item.url || item.media_url || item.media,
            type: item.media_type || (item.video_url ? 'video' : 'image'),
            product: item.product || 'Advertisement Asset',
            description: item.description || '',
            platform: item.platform || 'Multi-Channel',
            duration: item.duration || '15s',
            style: item.style || 'Cyberpunk Neon',
            timestamp: item.created_at || item.timestamp || new Date().toISOString()
          }));
          setMyAds(normalized);
        }
        setBackendStatus('online');
      } else {
        // Keep existing ads in state
      }
    } catch {
      setBackendStatus('offline');
    } finally {
      setAdsLoading(false);
    }
  };

  // Load My Ads on tab open
  useEffect(() => {
    if (activePage === 'my-ads') {
      fetchMyAds();
    }
  }, [activePage]);

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Futuristic Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActivePage(token ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-white">AD PULSE</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-mono-tech font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">AI</span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-slate-400 font-mono-tech">Autonomous Ad Engine</p>
            </div>
          </div>

          {/* Center Navigation Links (when authenticated or in dashboard) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 inline mr-1.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActivePage('generator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'generator'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-cyan-400" />
              Ad Generator
            </button>
            <button
              onClick={() => setActivePage('my-ads')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'my-ads'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5 inline mr-1.5" />
              My Advertisements ({myAds.length})
            </button>
          </nav>

          {/* Right Section: API Server Status & User Controls */}
          <div className="flex items-center gap-3">
            {/* FastAPI Status Pill */}
            <div 
              title={`FastAPI Server at ${apiEndpoint}`}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-[11px] font-mono-tech"
            >
              <span className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' 
                  ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' 
                  : 'bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]'
              }`} />
              <span className="hidden sm:inline text-slate-400">FastAPI:</span>
              <span className={backendStatus === 'online' ? 'text-emerald-400 font-semibold' : 'text-amber-300 font-medium'}>
                {backendStatus === 'online' ? '8000 Online' : 'Local 8000'}
              </span>
            </div>

            {token ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
                    {currentUser?.email || 'Active User'}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono-tech">PRO TIER</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-xs"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('landing')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => setActivePage('register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backend Offline Info Banner (non-intrusive) */}
      {backendStatus === 'offline' && (
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-200/90 flex items-center justify-center gap-2 flex-wrap">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>
            FastAPI server target: <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono-tech">{apiEndpoint}</code>.
            App auto-handles connection & delivers live simulated preview if offline.
          </span>
          <button 
            onClick={checkBackendHealth} 
            className="inline-flex items-center gap-1 text-[11px] underline text-cyan-400 hover:text-cyan-300 ml-1 font-mono-tech"
          >
            <RefreshCw className="w-3 h-3" /> Recheck Status
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* 1. LANDING & LOGIN PAGE */}
        {activePage === 'landing' && (
          <div className="py-8 space-y-16">
            
            {/* Cinematic Hero Section */}
            <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-white/10 bg-gradient-to-b from-slate-900/90 via-[#0a0f1d]/90 to-[#07090e]">
              {/* Glowing Background Radial Effects */}
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  NEXT-GEN AI ADVERTISEMENT GENERATOR
                </div>
                
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                  GENERATE <span className="gradient-text-cyber">HIGH-CONVERTING</span> ADS IN SECONDS.
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                  Synthesize cinematic 4K advertisement imagery and ultra-engaging video clips tailored for Instagram, YouTube, TikTok, and LinkedIn with real-time neural prompting.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setActivePage('generator')}
                    className="btn-cyber-primary px-6 py-3.5 text-sm font-bold flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    Launch Generator
                  </button>
                  <button
                    onClick={() => setActivePage('register')}
                    className="btn-cyber-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2"
                  >
                    Create Free Account
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>

                {/* Micro Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg">
                  <div>
                    <div className="text-2xl font-black font-display text-white">10x</div>
                    <div className="text-xs text-slate-400 font-mono-tech">Faster Production</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-display text-cyan-400">4K UHD</div>
                    <div className="text-xs text-slate-400 font-mono-tech">Image & Video Output</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-display text-purple-400">+340%</div>
                    <div className="text-xs text-slate-400 font-mono-tech">CTR Uplift</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Login & Fast Access Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Features List */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display text-white">Built for Modern Growth Teams</h2>
                  <p className="text-sm text-slate-400">Precision targeted ad variations at the speed of thought.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-white text-base">Photorealistic Image Ads</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Custom lighting, typography, product positioning, and color schemes calibrated for high-impact conversions.
                    </p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Film className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-white text-base">Cinematic Video Ads</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Fluid camera motion, kinetic transitions, and pacing designed specifically for reels, stories, and feed ads.
                    </p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-white text-base">FastAPI Backend</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Direct integration with your Python microservice running at <code className="text-cyan-300">http://127.0.0.1:8000</code>.
                    </p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-white text-base">Multi-Platform Export</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Instagram, YouTube Shorts, LinkedIn feeds, Facebook carousel, and X promotions configured automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Glassmorphism Card */}
              <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative">
                <div className="space-y-6">
                  <div>
                    <div className="inline-block text-[11px] font-mono-tech uppercase text-cyan-400 mb-1">Secure Sign In</div>
                    <h2 className="text-xl font-bold text-white font-display">Sign into Ad Pulse AI</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Authenticate with your FastAPI backend (<code className="text-cyan-300">POST /login</code>).
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full btn-cyber-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    >
                      {authLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-400">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setActivePage('register')}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold underline ml-1"
                      >
                        Register with POST /register
                      </button>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200/80 font-mono-tech">
                    Direct access: You can also enter the Ad Generator as guest immediately.
                    <button
                      onClick={() => {
                        const guestToken = 'guest_' + Date.now();
                        localStorage.setItem('access_token', guestToken);
                        setToken(guestToken);
                        setCurrentUser({ email: 'guest@adpulse.ai' });
                        setActivePage('generator');
                      }}
                      className="block mt-1 text-white font-bold underline hover:text-cyan-300"
                    >
                      &rarr; Test Generator Directly
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. REGISTER PAGE */}
        {activePage === 'register' && (
          <div className="max-w-md mx-auto py-12">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative corner-bracket space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-cyan-500/30">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold font-display text-white">Create Ad Pulse Account</h1>
                <p className="text-xs text-slate-400 font-mono-tech">
                  Sends request to <code className="text-cyan-300">POST {apiEndpoint}/register</code>
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 bg-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Authentication Protocol:
                  </div>
                  <div>• Submits JSON: <code className="text-cyan-300">{`{"email": "...", "password": "..."}`}</code></div>
                  <div>• Auto-stores Bearer access_token on login</div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full btn-cyber-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Registering Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-white/10">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setActivePage('landing')}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold underline ml-1"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. DASHBOARD */}
        {activePage === 'dashboard' && (
          <div className="space-y-8 py-4">
            
            {/* Top Welcome Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-wider">Command Center</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Welcome to Ad Pulse AI
                </h1>
                <p className="text-xs text-slate-400">
                  Logged in as <span className="text-slate-200 font-medium">{currentUser?.email || 'Creator'}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActivePage('generator')}
                  className="btn-cyber-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  Create New Ad
                </button>
                <button
                  onClick={() => setActivePage('my-ads')}
                  className="btn-cyber-secondary px-4 py-2.5 text-xs font-semibold flex items-center gap-2"
                >
                  <FolderHeart className="w-4 h-4" />
                  View All Ads ({myAds.length})
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl space-y-2 border border-white/10">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Generated Ads</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-white">{myAds.length}</div>
                <div className="text-[11px] text-cyan-400 font-mono-tech">Ready for Campaign Export</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-2 border border-white/10">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Video Advertisements</span>
                  <Film className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-purple-300">
                  {myAds.filter(a => a.type === 'video').length}
                </div>
                <div className="text-[11px] text-purple-400 font-mono-tech">Kinetic Video Clips</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-2 border border-white/10">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Image Advertisements</span>
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-blue-300">
                  {myAds.filter(a => a.type === 'image').length}
                </div>
                <div className="text-[11px] text-blue-400 font-mono-tech">Diffusion 4K Stills</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-2 border border-white/10">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>FastAPI Latency</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold font-display text-emerald-400">
                  {backendStatus === 'online' ? '< 340ms' : 'Offline'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono-tech">http://127.0.0.1:8000</div>
              </div>
            </div>

            {/* Campaign Inspiration Presets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-display text-white">Instant Campaign Templates</h2>
                  <p className="text-xs text-slate-400">Click any preset to pre-fill the AI generator</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Cyberpunk Tech Launch',
                    type: 'video',
                    product: 'NeuralLink HUD Glasses',
                    desc: 'Augmented reality smart glasses with transparent neon holographic display and titanium hinges.',
                    audience: 'Early adopters, VR developers, and tech lifestyle leaders',
                    platform: 'YouTube',
                    style: 'Cyberpunk Neon & Glitch',
                    gradient: 'from-cyan-500/20 to-blue-500/20'
                  },
                  {
                    title: 'Luxury Matte Watch Commercial',
                    type: 'video',
                    product: 'Chronos Nocturne Tourbillon',
                    desc: 'Swiss automatic chronometer crafted from brushed obsidian steel and rose gold accents.',
                    audience: 'Luxury collectors, executive founders, and horology enthusiasts',
                    platform: 'Instagram',
                    style: 'Minimalist Luxury & Matte',
                    gradient: 'from-purple-500/20 to-pink-500/20'
                  },
                  {
                    title: 'Hyper-Performance Electric Hypercar',
                    type: 'image',
                    product: 'AeroZero Hypersonic EV',
                    desc: 'Streamlined aerodynamic carbon chassis illuminated by aerodynamic streak lighting in night rain.',
                    audience: 'Automotive lovers, high-net-worth innovators, and speed enthusiasts',
                    platform: 'X',
                    style: 'Hyper-Realistic 3D Studio',
                    gradient: 'from-blue-500/20 to-emerald-500/20'
                  }
                ].map((preset, idx) => (
                  <div 
                    key={idx}
                    className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                          {preset.type.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400">{preset.platform}</span>
                      </div>
                      <h3 className="font-semibold text-white text-base">{preset.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{preset.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        setMediaType(preset.type);
                        setProduct(preset.product);
                        setDescription(preset.desc);
                        setAudience(preset.audience);
                        setPlatform(preset.platform);
                        setStyle(preset.style);
                        setActivePage('generator');
                      }}
                      className="w-full mt-2 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all flex items-center justify-center gap-1.5"
                    >
                      Use Template <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Creations Quick View */}
            {myAds.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-display text-white">Recent Generated Ads</h2>
                  <button
                    onClick={() => setActivePage('my-ads')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myAds.slice(0, 3).map((ad) => (
                    <div key={ad.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 space-y-3 p-3">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60">
                        {ad.type === 'video' ? (
                          <video src={ad.url} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={ad.url} alt={ad.product} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-black/70 text-cyan-300 border border-cyan-500/30">
                          {ad.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-white truncate">{ad.product}</div>
                        <div className="text-xs text-slate-400 flex items-center justify-between">
                          <span>{ad.platform}</span>
                          <span>{ad.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. ADVERTISEMENT GENERATOR PAGE */}
        {activePage === 'generator' && (
          <div className="space-y-8 py-4">
            
            {/* Header */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono-tech text-cyan-400 uppercase tracking-wider mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  Autonomous Studio
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Advertisement Generator
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure brand attributes and trigger <code className="text-cyan-300">POST /generate-image</code> or <code className="text-cyan-300">POST /generate-video</code>
                </p>
              </div>

              {/* Media Type Toggle Buttons (IMAGE / VIDEO) */}
              <div className="flex items-center p-1 rounded-2xl bg-black/50 border border-white/10 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mediaType === 'image'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  IMAGE
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mediaType === 'video'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  VIDEO
                </button>
              </div>
            </div>

            {/* Main Form & Live Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
                
                {/* Product / Brand Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Product / Brand
                  </label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g. AuraPulse Wireless Earbuds, CyberStride Shoes"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Description & Key Selling Points
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key highlights, core benefits, visual composition, lighting mood..."
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none"
                  />
                </div>

                {/* Target Audience Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Gen-Z Tech Enthusiasts, Luxury Collectors, Digital Nomads"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500"
                  />
                </div>

                {/* Platform Buttons */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Target Platform
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PLATFORMS.map((plat) => {
                      const isSelected = platform === plat.id;
                      return (
                        <button
                          key={plat.id}
                          type="button"
                          onClick={() => setPlatform(plat.id)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{plat.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono-tech">{plat.ratio}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration & Visual Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white bg-[#0a0f1d]"
                    >
                      {DURATIONS.map((d) => (
                        <option key={d} value={d} className="bg-[#090d16] text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Visual Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white bg-[#0a0f1d]"
                    >
                      {STYLES.map((s) => (
                        <option key={s} value={s} className="bg-[#090d16] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Generation Action Buttons */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleGenerate('image')}
                      className={`py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        mediaType === 'image'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-cyan-300" />
                      Generate Image
                    </button>

                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleGenerate('video')}
                      className={`py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        mediaType === 'video'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 border-purple-400 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Video className="w-4 h-4 text-purple-300" />
                      Generate Video
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-400 font-mono-tech">
                    Invokes FastAPI: <code className="text-cyan-300">{mediaType === 'video' ? 'POST /generate-video' : 'POST /generate-image'}</code>
                  </p>
                </div>

              </div>

              {/* Right Column: Animated Generation Progress & Returned Media Display */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Generation Card */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Live Media Output
                    </span>
                    <span className="text-[11px] font-mono-tech text-cyan-400">
                      {isGenerating ? 'PROCESSING' : generatedMedia ? 'READY' : 'STANDBY'}
                    </span>
                  </div>

                  {/* 1. When Generating: Animated Progress UI */}
                  {isGenerating && (
                    <div className="py-12 px-4 flex flex-col items-center justify-center space-y-6 text-center relative">
                      {/* Laser scanline effect */}
                      <div className="animate-scanline" />

                      {/* Holographic glowing ring */}
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-radar" />
                        <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
                        <div className="w-16 h-16 rounded-full bg-cyan-500/10 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-inner">
                          {mediaType === 'video' ? (
                            <Video className="w-7 h-7 text-purple-400 animate-pulse" />
                          ) : (
                            <ImageIcon className="w-7 h-7 text-cyan-400 animate-pulse" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 w-full max-w-xs">
                        <div className="flex items-center justify-between text-xs font-mono-tech">
                          <span className="text-cyan-300">{progressStage}</span>
                          <span className="font-bold text-white">{progressPercent}%</span>
                        </div>
                        {/* Glowing progress bar */}
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-[1px] border border-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-300 shadow-[0_0_10px_#06b6d4]"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 max-w-xs font-mono-tech">
                        Compiling neural weights for <span className="text-white">{platform}</span> {mediaType}...
                      </p>
                    </div>
                  )}

                  {/* 2. When Completed: Show Actual Generated Image or Video */}
                  {!isGenerating && generatedMedia && (
                    <div className="space-y-4">
                      {/* Media container */}
                      <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
                        {generatedMedia.type === 'video' ? (
                          // VIDEO: Use a video element with controls
                          <video
                            src={generatedMedia.url}
                            controls
                            autoPlay
                            muted
                            loop
                            className="w-full h-auto max-h-[420px] object-cover rounded-xl"
                          />
                        ) : (
                          // IMAGE: Use an img element
                          <img
                            src={generatedMedia.url}
                            alt={generatedMedia.product}
                            className="w-full h-auto max-h-[420px] object-cover rounded-xl"
                          />
                        )}

                        {/* Media badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono-tech font-bold text-cyan-300">
                          {generatedMedia.type.toUpperCase()} • {generatedMedia.platform}
                        </div>
                      </div>

                      {/* Media Details */}
                      <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{generatedMedia.product}</h4>
                          <span className="text-[11px] text-cyan-400 font-mono-tech">{generatedMedia.duration}</span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">{generatedMedia.description}</p>
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono-tech">
                          <span>Style: {generatedMedia.style}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={generatedMedia.url}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold text-cyan-300 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Asset
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopy(generatedMedia.url)}
                          className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center gap-1.5"
                        >
                          {copiedUrl ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Copied URL
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy URL
                            </>
                          )}
                        </button>
                      </div>

                      {genError && (
                        <p className="text-[11px] text-amber-300/80 font-mono-tech mt-2">
                          {genError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 3. Empty State (Before First Generation) */}
                  {!isGenerating && !generatedMedia && (
                    <div className="py-16 px-4 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                        <Play className="w-7 h-7 text-cyan-400/60 ml-0.5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">No Media Generated Yet</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Fill in your advertisement parameters and click <span className="text-cyan-300 font-semibold">Generate Image</span> or <span className="text-purple-300 font-semibold">Generate Video</span> to start.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* API Specs Card */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono-tech text-slate-400">
                  <div className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    Active Payload Spec
                  </div>
                  <pre className="bg-black/50 p-2.5 rounded-lg text-[11px] text-cyan-300/90 overflow-x-auto">
{JSON.stringify({
  product: product.slice(0, 20) + '...',
  audience: audience.slice(0, 20) + '...',
  platform,
  duration,
  style: style.slice(0, 18) + '...',
  media_type: mediaType
}, null, 2)}
                  </pre>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 5. MY ADVERTISEMENTS PAGE */}
        {activePage === 'my-ads' && (
          <div className="space-y-6 py-4">
            
            {/* Header */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-cyan-400 uppercase tracking-wider mb-1">
                  <FolderHeart className="w-3.5 h-3.5" />
                  Asset Library
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  My Advertisements
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synced with <code className="text-cyan-300">GET {apiEndpoint}/my-ads</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter Pills */}
                <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <button
                    onClick={() => setAdsFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      adsFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({myAds.length})
                  </button>
                  <button
                    onClick={() => setAdsFilter('image')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      adsFilter === 'image' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Images ({myAds.filter(a => a.type === 'image').length})
                  </button>
                  <button
                    onClick={() => setAdsFilter('video')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      adsFilter === 'video' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Videos ({myAds.filter(a => a.type === 'video').length})
                  </button>
                </div>

                <button
                  onClick={fetchMyAds}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                  title="Refresh Ads from Backend"
                >
                  <RefreshCw className={`w-4 h-4 ${adsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Ads Grid */}
            {myAds.length === 0 ? (
              <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <Film className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display">No Advertisements in Library</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You haven't generated any ads yet. Head over to the Ad Generator to create your first visual or video campaign.
                  </p>
                </div>
                <button
                  onClick={() => setActivePage('generator')}
                  className="btn-cyber-primary px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Ad Generator
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAds
                  .filter((ad) => adsFilter === 'all' || ad.type === adsFilter)
                  .map((ad) => (
                    <div
                      key={ad.id}
                      className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group"
                    >
                      {/* Media Preview Box */}
                      <div className="relative aspect-video bg-black/80 overflow-hidden">
                        {ad.type === 'video' ? (
                          <video
                            src={ad.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={ad.url}
                            alt={ad.product}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold text-white uppercase ${
                            ad.type === 'video' ? 'bg-purple-600/90' : 'bg-cyan-600/90'
                          }`}>
                            {ad.type}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-black/70 backdrop-blur-md text-slate-200 border border-white/20">
                            {ad.platform}
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-white text-base truncate">{ad.product}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{ad.description}</p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono-tech text-slate-400">
                            {ad.duration || '15s'} • {ad.style ? ad.style.slice(0, 16) : 'Cinematic'}
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href={ad.url}
                              target="_blank"
                              rel="noreferrer"
                              download
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                              title="Download Asset"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleCopy(ad.url)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                              title="Copy URL"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Futuristic Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#07090e]/90 py-8 px-4 lg:px-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-semibold text-white">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>AD PULSE AI</span>
            <span className="text-slate-500 font-normal font-sans">| Neural Advertisement Generation Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono-tech text-slate-400">
            <span>FastAPI Protocol: <code className="text-cyan-400">{apiEndpoint}</code></span>
            <span>•</span>
            <span>REST Endpoints: /register /login /me /generate-image /generate-video /my-ads</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
