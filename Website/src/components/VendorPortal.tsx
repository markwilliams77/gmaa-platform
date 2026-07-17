import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Plane, Home, Pill, FlaskConical, ShieldCheck, 
  Landmark, Cpu, BrainCircuit, Users, TrendingUp, Handshake,
  ArrowRight, CheckCircle2, Activity, Bell, LogOut, Network, Globe
} from 'lucide-react';

interface VendorPortalProps {
  onLogin?: () => void;
  onPartnerWithUs?: () => void;
}

export default function VendorPortal({ onLogout, onPartnerWithUs }: VendorPortalProps & { onLogout?: () => void }) {
  const [activeSegment, setActiveSegment] = useState<'benefits' | 'ecosystem' | 'marketplace' | 'tools'>('benefits');
  // Live Ticker State for Hero & Analytics
  const [analytics, setAnalytics] = useState({
    leads: 38421,
    partnerships: 4921,
    countries: 87,
    views: 452930,
    opportunities: 1248
  });

  // Section 6: Marketplace State
  const [opportunities, setOpportunities] = useState<{ id: number; badge: string; text: string; details: string; urgency: string; origin: string }[]>([
    { id: 1, badge: "🏥 Referral Partner", text: "Hospital seeking international referral partner", details: "Major spine & orthopedic rehabilitation hub in Frankfurt aims to route elective post-ops to certified Mediterranean resort partners.", urgency: "High Urgency", origin: "Germany" },
    { id: 2, badge: "🛡️ Insurance Cover", text: "Insurance company seeking provider network", details: "Middle-East insurer expanding expat packages seeks high-end outpatient clinics in Bangkok, KL, and Dubai with direct billing.", urgency: "Moderate", origin: "UAE" },
    { id: 3, badge: "✈️ Medical Tourism", text: "Medical tourism company seeking specialty hospitals", details: "Regional facilitator in North America sourcing accredited bariatric and dental surgery complexes with English travel guides.", urgency: "High Urgency", origin: "USA" },
    { id: 4, badge: "🏛️ Public Tender", text: "Government agency seeking healthcare partners", details: "Regional Health Authority requires certified at-home senior memory care nurse team dispatchers for local community trial support.", urgency: "Scheduled", origin: "Canada" },
    { id: 5, badge: "📦 Logistics Sourcing", text: "Healthcare supplier seeking distributors", details: "German cold-chain biological supply agency looking for reliable regional drug warehousing & import authorization firms.", urgency: "Immediate", origin: "UK" }
  ]);

  // Section 10: Success Stories State
  const [activeStoryTab, setActiveStoryTab] = useState<'hospital' | 'ambulance' | 'homecare' | 'diagnostic'>('hospital');

  const THE_STORIES = {
    hospital: {
      headline: "How CitySpire Hospital Secured 320% Inbound Growth",
      company: "CitySpire Hospital Group",
      story: "Before joining GMAA, our international referral pipelines relied on fragmented medical tourism agencies and manual Excel sheets. By launching our verified GMAA Digital Identity and adopting the AI Strategic Matchmaking tool, we established direct, legally compliant referral lines with three major global insurers and over 40 corporate programs. Our overseas medical admissions increased by 320% within just nine months.",
      metric: "+320% inquiries group-wide"
    },
    ambulance: {
      headline: "Enabling Instant 3-Hour Fixed-Wing Dispatches Globally",
      company: "SkyMed Flight Elite",
      story: "Speed is everything in neonatal air ambulance repatriation. GMAA's Clearinghouse feed lets us pick up emergency requests in minutes instead of waiting for days on broker tenders. By keeping our flying ICU fleet mapped on the GMAA Live Network, we have secured emergency government airlift contracts and corporate ICU routing, increasing our monthly active fly-hours by 145%.",
      metric: "145% higher fleet fly-time"
    },
    homecare: {
      headline: "From Local Nursing Crew to Multi-City Senior Care Network",
      company: "ComfortAtHome Nursing Services",
      story: "We had the staff but lacked direct client visibility outside local yellow pages. The GMAA Lead Capture system placed our specialized dementia support services directly in front of expat families caring for aging parents back in Mumbai and Saudi Arabia. Sourcing high-value international private-pay cases directly through the ecosystem helped us scale up into four new regional metros.",
      metric: "4x increase in private-pay clients"
    },
    diagnostic: {
      headline: "Securing Cross-Border Diagnostics & Biology Tenders",
      company: "BioVeritas Laboratory Networks",
      story: "GMAA's Global Opportunity Marketplace completely changed our commercial B2B strategies. Instead of speculative sales calls, we filter active requests from pharmaceutical groups and European clinical trial managers looking for accredited local biopsy diagnostics. Within six weeks, we scored two master lab service agreements that filled our off-peak capacity.",
      metric: "100% capacity utilization reached"
    }
  };

  // Section 7: Matchmaking Simulator State
  const [selectedMatchCategory, setSelectedMatchCategory] = useState<'strategic' | 'referral' | 'buyer' | 'supplier' | 'border'>('strategic');

  const MATCHES = {
    strategic: {
      title: "Strategic Partners Matches",
      items: [
        { name: "Apex Specialty Surgical Hub", match: "98% Match Score", reason: "Ready to accept specialized post-op physical rehabilitation outbound pipelines.", region: "Europe & Middle East" },
        { name: "Cigna International Health Care", match: "95% Match Score", reason: "Seeking direct cashless clinic partnerships matching specialized cardiology treatments.", region: "Global Inflow" }
      ]
    },
    referral: {
      title: "Referral Partners Matches",
      items: [
        { name: "MediQuest Concierge Services", match: "97% Match Score", reason: "Looking for premium neurological recovery & senior respite destinations for US travelers.", region: "North America" },
        { name: "Gulf Air Transport Alliance", match: "94% Match Score", reason: "Requires bedside critical handovers to accredited tertiary hospital ICUs.", region: "Middle East" }
      ]
    },
    buyer: {
      title: "Healthcare Buyers Matches",
      items: [
        { name: "Ministry of Health Out-of-Country Care", match: "99% Match Score", reason: "Actively sourcing certified robotic knee orthopedic clinics with transparent bundle pricing.", region: "Saudi Arabia" },
        { name: "Global HR Benefits Group (FinTerra)", match: "91% Match Score", reason: "Requires customizable outpatient health checks for remote workforce coverage.", region: "Asia Pacific" }
      ]
    },
    supplier: {
      title: "Healthcare Suppliers Matches",
      items: [
        { name: "Vitalsen Oxygen Systems Ltd", match: "96% Match Score", reason: "Direct supplier of clinical ventilators and heavy medical beds seeking local renters.", region: "Germany" },
        { name: "PharmaLink biologicals Group", match: "92% Match Score", reason: "Cold-chain pharmaceutical delivery networks offering urgent medication logistics.", region: "India / UK" }
      ]
    },
    border: {
      title: "Cross-Border Collaborations Matches",
      items: [
        { name: "TeleDoc Virtual Network", match: "95% Match Score", reason: "Integrates on-demand local specialist panels with virtual triage software tools.", region: "Global Network" },
        { name: "EuroLink Rehab Alliance", match: "93% Match Score", reason: "Slashes borders by establishing unified standards for clinical case telemetry.", region: "Europe / Dubai" }
      ]
    }
  };

  // Section 8 Component Identity Simulator
  const [activeIdentityTab, setActiveIdentityTab] = useState<'services' | 'certifications' | 'reach' | 'analytics'>('services');

  // Real-time update simulations
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Simulate slow upward count on analytics
      setAnalytics(prev => ({
        leads: prev.leads + Math.floor(Math.random() * 3) + 1,
        partnerships: prev.partnerships + (Math.random() > 0.8 ? 1 : 0),
        countries: prev.countries,
        views: prev.views + Math.floor(Math.random() * 8) + 2,
        opportunities: prev.opportunities + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 3000);

    const marketplaceInterval = setInterval(() => {
      // Rotate opportunities to simulate live feed updates
      const simulatedQuotes = [
        { text: "Air ambulance provider seeking fixed-wing partners", details: "Emergency flight crew on standby in Cairo seeks flight clearance support networks in GCC.", origin: "Egypt" },
        { text: "Elderly homecare network seeking ventilator supplier", details: "Specialist home nursing group seeks long-term lease terms on specialized oxygen concentrators.", origin: "UAE" },
        { text: "Specialty hospital seeking outbound surgery centers", details: "Tertiary clinic requires secondary rehabilitation beds with premium memory hospitality features.", origin: "Kuwait" },
        { text: "Rehabilitation clinic seeking diagnostic lab partner", details: "Comprehensive physio group requires reliable weekly biology test turnarounds and PET-scans.", origin: "Germany" }
      ];

      const newQuote = simulatedQuotes[Math.floor(Math.random() * simulatedQuotes.length)];
      setOpportunities(prev => [
        { id: Date.now(), badge: "🤝 Live Opportunity", text: newQuote.text, details: newQuote.details, urgency: "Just Now", origin: newQuote.origin },
        ...prev.slice(0, 4)
      ]);
    }, 9000);

    return () => {
      clearInterval(updateInterval);
      clearInterval(marketplaceInterval);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-bg/10 text-navy font-sans selection:bg-cyan selection:text-white relative overflow-x-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative py-16 sm:py-24 md:py-36 bg-white overflow-hidden border-b border-navy/5 z-10">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute inset-y-0 left-[10%] w-[1px] bg-navy/5" />
           <div className="absolute inset-y-0 right-[10%] w-[1px] bg-navy/5" />
           <div className="absolute inset-y-0 left-1/2 w-[1px] bg-navy/5 opacity-50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-24 items-center">
          <div className="w-full lg:flex-1 space-y-6 sm:space-y-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-1.5 bg-brand-red rounded-full shrink-0" />
               <span className="text-cyan font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px]">SUPPLIER & TEAMS PLATFORM</span>
            </div>
            
            <h1 className="text-[clamp(2rem,6vw,6rem)] font-light leading-[1.05] tracking-tighter text-navy">
              More Visibility. <br />
              More Partnerships. <br />
              <span className="font-serif italic font-medium text-gradient pr-2">More Business.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] text-navy/60 max-w-xl font-medium leading-relaxed">
              Join a healthcare ecosystem designed to help organizations attract clients, strengthen referral networks, build international partnerships, and create sustainable business growth across domestic and global markets.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-5 w-full sm:w-auto">
              <button 
                onClick={onPartnerWithUs}
                className="relative overflow-hidden px-8 sm:px-10 py-4 sm:py-5 bg-navy text-white rounded-xl sm:rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] group/btn shadow-xl active:scale-95 transition-all w-full sm:w-auto shrink-0"
              >
                <div className="absolute inset-0 bg-cyan -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Join GMAA <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={onPartnerWithUs}
                className="px-8 sm:px-10 py-4 sm:py-5 border border-navy/15 text-navy rounded-xl sm:rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:bg-slate-bg transition-all active:scale-95 w-full sm:w-auto shrink-0"
              >
                Expand My Business
              </button>
            </div>
          </div>

          {/* DYNAMIC DASHBOARD PREVIEW / LIVE ANALYTICS */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="bg-navy p-3 rounded-[24px] sm:rounded-[40px] shadow-[0_50px_100px_rgba(10,17,31,0.25)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
              
              <div className="bg-[#051622] rounded-[18px] sm:rounded-[32px] overflow-hidden border border-white/5 p-5 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/50">Live Analytics Feed</p>
                  </div>
                  <span className="text-[8px] font-mono text-cyan uppercase font-bold tracking-widest bg-cyan/10 px-2 py-0.5 rounded">GMAA HUD</span>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-white/50 font-medium">📈 Leads Generated</span>
                    <span className="text-base sm:text-xl font-mono text-white tracking-tight shrink-0">{analytics.leads.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan" style={{ width: '74%' }} />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-white/50 font-medium">🤝 Partnerships Created</span>
                    <span className="text-base sm:text-xl font-mono text-cyan tracking-tight shrink-0">{analytics.partnerships.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan to-brand-red" style={{ width: '85%' }} />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-white/50 font-medium">🌍 Countries Reached</span>
                    <span className="text-base sm:text-xl font-mono text-white tracking-tight shrink-0">{analytics.countries} / 195</span>
                  </div>
                  <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red" style={{ width: '45%' }} />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-white/50 font-medium font-bold">💰 Business Opportunities</span>
                    <span className="text-base sm:text-xl font-mono text-emerald-400 font-bold tracking-tight shrink-0">{analytics.opportunities.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-center">
                  <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Global ecosystem activity updated in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Segment Switcher for Vendor Portal to reduce scrolling */}
      <div className="sticky top-[58px] sm:top-[64px] md:top-[72px] bg-white/95 backdrop-blur-md border-b border-navy/5 z-40 py-4 sm:py-5 shadow-sm transition-all">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center xl:text-left">
              <span className="text-[9px] font-bold text-brand-red uppercase tracking-[0.3em]">Partner Services Portal</span>
              <h2 className="text-lg sm:text-xl font-light tracking-tight text-navy leading-none mt-1">Explore Provider Alliance Programs</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center bg-slate-bg/80 p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border border-navy/5 max-w-full">
              {[
                { id: 'benefits', label: '💎 Network Benefits' },
                { id: 'ecosystem', label: '🌍 Alliance Map' },
                { id: 'marketplace', label: 'Live Marketplace' },
                { id: 'tools', label: '🛠️ AI Match & Tools' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSegment(tab.id as any);
                    const el = document.getElementById('vendor-hub-anchor');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeSegment === tab.id
                      ? 'bg-navy text-white shadow-xl shadow-navy/25 scale-100'
                      : 'text-navy/50 hover:text-navy hover:bg-navy/5 scale-95'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="vendor-hub-anchor" className="scroll-mt-48" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          {activeSegment === 'benefits' && (
            <>
              {/* SECTION 2: IMAGINE IF THE RIGHT OPPORTUNITIES FOUND YOU */}
              <section className="py-16 sm:py-24 md:py-32 bg-white relative border-b border-navy/5 z-10">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                    
                    <div className="space-y-4 sm:space-y-6">
                      <span className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px]">INTELLIGENT VISIBILITY</span>
                      <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy leading-tight">
                        Imagine If The Right <br />
                        Opportunities Found <br />
                        <span className="font-serif italic text-gradient font-medium pr-2">Your Organization</span>
                      </h2>
                    </div>

                    <div className="space-y-4 sm:space-y-6 text-navy/60 font-medium text-sm sm:text-base leading-relaxed px-1">
                      <p>
                        Imagine if hospitals looking for referral partners could discover your organization. Imagine if insurance companies searching for providers could find you instantly.
                      </p>
                      <p>
                        Imagine if medical tourism facilitators, governments, assistance companies, corporates, and healthcare buyers could connect with you through one trusted platform. That's the power of GMAA.
                      </p>
                      <div className="p-4 sm:p-6 bg-slate-bg rounded-[16px] sm:rounded-[24px] border border-navy/5 mt-4">
                        <p className="text-xs sm:text-sm text-navy font-bold flex items-start sm:items-center gap-3">
                          <CheckCircle2 className="text-cyan shrink-0" size={18} />
                          We help healthcare organizations move from being discovered by chance to being discovered by design.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: WHY JOIN GMAA? */}
              <section className="py-16 sm:py-24 md:py-32 bg-slate-bg/30 relative border-b border-navy/5 z-10" id="growth-cards">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  
                  <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-24">
                    <span className="text-cyan font-bold uppercase tracking-[0.3em] text-[10px]">BUSINESS VALUE</span>
                    <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy leading-none mt-3 sm:mt-4">
                      More Than Visibility. <br />
                      <span className="font-serif italic text-gradient font-medium pr-2">Intelligent Growth.</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {[
                      {
                        title: "Global Visibility",
                        desc: "Expand your geographic reach and connect with patient flow, healthcare programs, and corporate queries from 85+ countries.",
                        icon: Globe,
                        color: "text-blue-500"
                      },
                      {
                        title: "Lead Generation",
                        desc: "Receive qualified patient inquiries, device supply requests, and agency service requests filtered by GMAA AI.",
                        icon: TrendingUp,
                        color: "text-cyan"
                      },
                      {
                        title: "Strategic Partnerships",
                        desc: "Establish reliable legal alliances, B2B clinical referrals, and inter-hospital logistics systems safely.",
                        icon: Handshake,
                        color: "text-amber-500"
                      },
                      {
                        title: "Referral Opportunities",
                        desc: "Become a key participant in dynamic inbound and outbound patient transitions built on transparency.",
                        icon: Users,
                        color: "text-emerald-500"
                      },
                      {
                        title: "International Patient Referrals",
                        desc: "Attract certified medical travelers seeking verified clinical specialties, dental rehabs or wellness trips.",
                        icon: Plane,
                        color: "text-purple-500"
                      },
                      {
                        title: "Business Networking",
                        desc: "Co-create with hospitals, diagnostic centres, insurance TPAs, and cross-border assistance agencies.",
                        icon: Network,
                        color: "text-brand-red"
                      },
                      {
                        title: "Business Intelligence",
                        desc: "Leverage real-time search volume queries, hot destination needs, and specialty demand indexes.",
                        icon: Activity,
                        color: "text-cyan"
                      },
                      {
                        title: "Global Expansion",
                        desc: "Bring localized custom equipment, senior support services, or health flights onto the world stage seamlessly.",
                        icon: Landmark,
                        color: "text-indigo-500"
                      }
                    ].map((card, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[36px] border border-navy/5 hover:border-cyan/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="space-y-4 sm:space-y-6">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-slate-bg rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                            <card.icon size={20} className="sm:size-[22px]" strokeWidth={1.5} />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-bold text-navy leading-snug">{card.title}</h3>
                            <p className="text-xs text-navy/50 leading-relaxed font-semibold">{card.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {activeSegment === 'ecosystem' && (
            <section className="py-16 sm:py-24 md:py-32 bg-white relative z-10 border-b border-navy/5 overflow-hidden">
              <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
                  <span className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px]">ALLIANCE ECOSYSTEM MAP</span>
                  <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy mt-3 sm:mt-4 leading-tight">
                    Connect With The <br />
                    <span className="font-serif italic text-gradient font-medium pr-2">Entire Healthcare Industry</span>
                  </h2>
                </div>

                <div className="relative p-5 sm:p-10 md:p-14 bg-navy rounded-[24px] sm:rounded-[48px] overflow-hidden text-white shadow-2xl">
                  <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
                  <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan/10 rounded-full blur-[100px]" />
                  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px]" />

                  {/* Simulated Ecosystem Map UI */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center relative z-10">
                    
                    {/* Left Orbit Node block */}
                    <div className="lg:col-span-2 space-y-4">
                      {[
                        { label: "🏥 Hospitals", desc: "Share clinical cases & arrange referrals" },
                        { label: "🚑 Ambulance Providers", desc: "Coordinate air evacuations with flying ICUs" },
                        { label: "🏠 Homecare Companies", desc: "Synchronize local memory or recovery staff" },
                        { label: "💊 Pharmaceutical Companies", desc: "Route rare trial biology medicines" },
                        { label: "🔬 Diagnostic Centers", desc: "Submit scan packages and lab profiles" }
                      ].map((node, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                          <span className="text-sm font-bold text-cyan font-mono shrink-0">0{i+1}</span>
                          <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">{node.label}</div>
                            <div className="text-[10px] text-white/40 font-medium">{node.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Center Active Core node representing USER ORGANIZATION */}
                    <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8 shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan blur-2xl opacity-50 animate-pulse" />
                        <div className="w-28 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-cyan flex items-center justify-center bg-[#051622] text-white p-2 relative z-10">
                          <div className="w-24 h-24 rounded-full bg-cyan/10 border border-cyan flex flex-col items-center justify-center p-2 sm:p-3 shrink-0">
                            <Users size={18} className="text-cyan mb-1.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-white">YOUR</span>
                            <span className="text-[7.5px] font-bold uppercase tracking-wider text-white/60 mt-0.5">ORGANIZATION</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 sm:mt-8 space-y-1">
                        <h4 className="text-xs font-bold text-cyan uppercase tracking-widest">Active Core Node</h4>
                        <p className="text-[10px] text-white/40 font-mono">Mapped & fully routed to ecosystem channels</p>
                      </div>
                    </div>

                    {/* Right Orbit Node block */}
                    <div className="lg:col-span-2 space-y-4">
                      {[
                        { label: "🛡️ Insurance Companies", desc: "Secure direct-coordination expat packages" },
                        { label: "🤝 Assistance Companies", desc: "Clear travelers through local bedside teams" },
                        { label: "🌍 Medical Tourism Companies", desc: "Capture inbound surgical tourist demand" },
                        { label: "🏛️ Governments & NGOs", desc: "Service state repatriations or public aid" },
                        { label: "🧠 HealthTech Companies", desc: "Integrate on-demand clinical software tools" }
                      ].map((node, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                          <span className="text-sm font-bold text-brand-red font-mono shrink-0">0{i+6}</span>
                          <div>
                            <div className="text-xs font-bold text-white uppercase tracking-wider">{node.label}</div>
                            <div className="text-[10px] text-white/40 font-medium">{node.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSegment === 'marketplace' && (
            <>
              {/* SECTION 5: AI-POWERED GROWTH ENGINE */}
              <section className="py-16 sm:py-24 md:py-32 bg-slate-bg/30 relative border-b border-navy/5 z-10" id="ai-engine">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                    
                    <div className="order-2 lg:order-1 relative">
                      <div className="bg-white p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[40px] border border-navy/5 shadow-2xl relative">
                        <div className="absolute top-4 sm:top-6 right-5 sm:right-8 text-[9px] sm:text-[10px] font-mono text-cyan font-bold uppercase">GMAA Engine</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#051622] mb-4 sm:mb-6 flex items-center gap-2">
                          <Cpu size={14} className="text-cyan shrink-0" /> Target Sourcing Signals
                        </h3>

                        <div className="space-y-3 sm:space-y-4">
                          {[
                            { label: "Potential Partners Identified", count: "14 matching in GCC region", pct: 95, icon: Users, color: "text-blue-500" },
                            { label: "Referral Opportunities Pipeline", count: "7 active air evacuation tenders", pct: 88, icon: Plane, color: "text-purple-500" },
                            { label: "Market Expansion Areas Sourced", count: "Hot outbound surgical demand index", pct: 92, icon: Globe, color: "text-cyan" },
                            { label: "Industry Trends Sourced", count: "At-home nursing demand peaked UAE", pct: 79, icon: Activity, color: "text-brand-red" },
                            { label: "Qualified Leads Routed", count: "Dementia respite packages needed in UK/IN", pct: 97, icon: TrendingUp, color: "text-emerald-500" }
                          ].map((item, idx) => (
                            <div key={idx} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-bg/50 border border-navy/5 space-y-2">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <item.icon size={14} className={`shrink-0 ${item.color}`} />
                                  <span className="text-[10px] sm:text-[11px] font-bold text-navy uppercase tracking-wider leading-tight">{item.label}</span>
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-mono text-navy/40 shrink-0">{item.count}</span>
                              </div>
                              <div className="w-full h-1 bg-navy/5 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan" style={{ width: `${item.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
                      <div className="inline-flex items-center gap-3 mb-2 px-4 py-2 bg-slate-bg rounded-full border border-navy/5">
                        <Cpu size={14} className="text-cyan animate-spin shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">AI OPPORTUNITIES</span>
                      </div>
                      <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy leading-none">
                        Let Healthcare <br />
                        <span className="font-serif italic text-gradient font-medium pr-2">Opportunities</span> <br />
                        Find You
                      </h2>
                      <p className="text-sm sm:text-base text-navy/50 font-medium leading-relaxed px-1">
                        The traditional way of establishing medical networks takes months of manual B2B outreach, expensive business development, and legal friction. GMAA AI perpetually monitors international supply shortages, regional surgical overflows, and local gear demands to route high-value matches directly to your dashboard.
                      </p>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                          "Potential Partners",
                          "Referral Opportunities",
                          "Market Expansion",
                          "Industry Trends",
                          "Business Opportunities",
                          "Strategic Collaborations",
                          "Qualified Leads",
                          "Surgical Overflows Sourcing"
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-navy/60 leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* SECTION 6: GLOBAL OPPORTUNITY MARKETPLACE */}
              <section className="py-16 sm:py-24 md:py-32 bg-white relative z-10 border-b border-navy/5 overflow-hidden" id="marketplace">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                    
                    <div className="space-y-6 sm:space-y-8">
                      <span className="text-cyan font-bold uppercase tracking-[0.3em] text-[10px]">ALLIANCE MATCHING PORTAL</span>
                      <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy leading-[1.05]">
                        Global Opportunity <br />
                        <span className="font-serif italic text-gradient font-medium">Marketplace</span>
                      </h2>
                      <p className="text-sm sm:text-base text-navy/50 font-medium leading-relaxed">
                        Discover business opportunities originating across the globe. Our active clearinghouse tracks corporate requests, legal hospital partnerships, customized oxygen imports, and air evacuation needs in real-time.
                      </p>
                      
                      <div className="p-5 sm:p-6 bg-slate-bg rounded-[20px] sm:rounded-[28px] border border-navy/5 flex gap-4 items-start">
                        <Bell size={24} className="text-brand-red shrink-0" />
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-navy">Live Opportunity Feed</h4>
                          <p className="text-xs text-navy/50 mt-1 leading-relaxed">System parameters actively queue biological shipments, patient relocations, and health program additions.</p>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Live Feed Widget */}
                    <div className="bg-[#051622] rounded-[24px] sm:rounded-[36px] p-5 sm:p-8 border border-white/5 shadow-2xl relative text-white">
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#0e2a3c]/30 to-transparent pointer-events-none" />
                      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/5 mb-4 sm:mb-6 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/40">GMAA Opportunity Board</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/20">Updated: Dec 2026</span>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <AnimatePresence mode="popLayout">
                          {opportunities.map((opp) => (
                            <motion.div
                              layout
                              key={opp.id}
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 40 }}
                              className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl sm:rounded-2xl transition-colors"
                            >
                              <div className="flex justify-between items-start gap-4 mb-2">
                                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/5 text-white/50 text-[8px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                                  {opp.badge}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[8px] sm:text-[8.5px] font-mono text-cyan">{opp.origin}</span>
                                  <span className="text-[8px] font-sans font-extrabold uppercase text-amber-500">{opp.urgency}</span>
                                </div>
                              </div>
                              <h4 className="text-xs font-bold text-white mb-1.5">{opp.text}</h4>
                              <p className="text-[10px] sm:text-[10.5px] text-white/40 leading-relaxed font-medium">{opp.details}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            </>
          )}

          {activeSegment === 'tools' && (
            <>
              {/* SECTION 7: HEALTHCARE MATCHMAKING */}
              <section className="py-16 sm:py-24 md:py-32 bg-slate-bg/30 relative z-10 border-b border-navy/5" id="matchmaking">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-24">
                    <span className="text-cyan font-bold uppercase tracking-[0.3em] text-[10px]">AI MATCHMAKING</span>
                    <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy mt-3 sm:mt-4 leading-none">
                      Healthcare <br />
                      <span className="font-serif italic text-gradient font-medium pr-2">Matchmaking</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-navy/40 font-medium max-w-sm mx-auto mt-4 px-2">Connecting the right organizations at the right time based on objective capacities.</p>
                  </div>

                  <div className="max-w-4xl mx-auto bg-white rounded-[24px] sm:rounded-[40px] border border-navy/5 p-5 sm:p-10 md:p-14 shadow-2xl">
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 pb-4 sm:pb-6 border-b border-navy/5">
                      {[
                        { id: 'strategic', label: 'Strategic Partners' },
                        { id: 'referral', label: 'Referrals' },
                        { id: 'buyer', label: 'Buyers' },
                        { id: 'supplier', label: 'Suppliers' },
                        { id: 'border', label: 'Cross-Border' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedMatchCategory(tab.id as any)}
                          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all border ${
                            selectedMatchCategory === tab.id 
                              ? 'bg-navy text-white border-navy scale-100 shadow-xl shadow-navy/10' 
                              : 'bg-slate-bg text-navy/40 border-transparent hover:text-navy hover:bg-navy/5 scale-95'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedMatchCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-navy/5 gap-4">
                          <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#051622]">{MATCHES[selectedMatchCategory].title}</h4>
                          <span className="text-[10px] font-mono text-cyan font-bold shrink-0">{MATCHES[selectedMatchCategory].items.length} active queries</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
                          {MATCHES[selectedMatchCategory].items.map((item, i) => (
                            <div key={i} className="p-5 sm:p-6 rounded-[16px] sm:rounded-[24px] border border-navy/5 bg-slate-bg/30 hover:border-cyan/20 transition-all flex flex-col justify-between">
                              <div className="space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                  <span className="text-xs sm:text-sm font-bold text-navy uppercase tracking-wider leading-tight">{item.name}</span>
                                  <span className="text-[9.5px] font-mono text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full shrink-0">{item.match}</span>
                                </div>
                                <p className="text-xs text-navy/50 leading-relaxed font-semibold">{item.reason}</p>
                              </div>
                              <div className="pt-4 mt-4 border-t border-navy/5 flex items-center justify-between text-[9px] font-mono font-bold text-navy/30">
                                <span>REGION Focus</span>
                                <span className="text-navy/60 font-semibold">{item.region}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </section>

              {/* SECTION 8: YOUR DIGITAL HEALTHCARE IDENTITY */}
              <section className="py-16 sm:py-24 md:py-32 bg-white relative z-10 border-b border-navy/5 overflow-hidden" id="identity">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                    
                    {/* Left Content */}
                    <div className="space-y-6 sm:space-y-8">
                      <span className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px]">INSTITUTIONAL BRANDING</span>
                      <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy leading-tight">
                        Your Digital <br />
                        <span className="font-serif italic text-gradient font-medium pr-2">Healthcare Identity</span>
                      </h2>
                      <p className="text-sm sm:text-base text-navy/50 font-medium leading-relaxed">
                        Showcase your organization to international patients, assistance agencies, and public healthcare buyers. GMAA provides a beautifully responsive, pre-vetted corporate storefront designed for elite institutions.
                      </p>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                          "Verified Company Profile",
                          "Categorized Services",
                          "Verified Certifications",
                          "Accreditations Board",
                          "Logistics & Service Range",
                          "Global Travel Guides",
                          "Case Study Folders",
                          "Direct Lead Capture System",
                          "Analytics Dashboard"
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-cyan shrink-0" />
                            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-navy/60 leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Side Simulator */}
                    <div className="bg-slate-bg p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] border border-navy/5 shadow-2xl relative">
                      <div className="absolute top-4 sm:top-6 right-5 sm:right-8 text-[9px] sm:text-[10px] font-mono text-navy/30 uppercase">Interactive Storefront</div>
                      
                      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
                        
                        {/* Header Mockup */}
                        <div className="flex gap-4 items-center pb-4 sm:pb-6 border-b border-navy/5">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-navy rounded-xl sm:rounded-2xl flex items-center justify-center font-serif text-white text-base sm:text-lg font-bold shrink-0">A</div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-[#051622] uppercase tracking-wide flex items-center gap-1.5">
                              Alliance Healthcare Inc. <ShieldCheck className="text-cyan shrink-0" size={14} />
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-navy/40 font-mono mt-0.5">Frankfurt Area, Germany • Registered 2026</p>
                          </div>
                        </div>

                        {/* Tab switchers */}
                        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-navy/5">
                          {[
                            { id: 'services', label: 'Services' },
                            { id: 'certifications', label: 'Accreds' },
                            { id: 'reach', label: 'Reach' },
                            { id: 'analytics', label: 'Analytics' }
                          ].map((subtab) => (
                            <button
                              key={subtab.id}
                              onClick={() => setActiveIdentityTab(subtab.id as any)}
                              className={`px-2.5 py-1 sm:py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                                activeIdentityTab === subtab.id 
                                  ? 'bg-navy text-white shadow' 
                                  : 'bg-slate-bg text-navy/40 hover:bg-slate-bg/85'
                              }`}
                            >
                              {subtab.label}
                            </button>
                          ))}
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeIdentityTab}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4 pt-1 sm:pt-2"
                          >
                            {activeIdentityTab === 'services' && (
                              <div className="space-y-2">
                                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest">Offered Specialties</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {["Robotic-assisted Knee Repair", "Cold-chain biology logistics", "Fixed-Wing Neonatal ICU Airlift", "At-home post-op nursing squads"].map((s) => (
                                    <span key={s} className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-bg text-navy text-[9.5px] font-bold uppercase rounded border border-navy/5 leading-tight">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {activeIdentityTab === 'certifications' && (
                              <div className="space-y-2">
                                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest">Licensed Accreditations</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div className="p-2 border border-emerald-500/15 bg-emerald-500/[0.03] rounded-lg flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-500 shrink-0" size={12} />
                                    <span className="text-[9.5px] font-bold text-navy tracking-tight uppercase leading-none">JCI Accredited Facility</span>
                                  </div>
                                  <div className="p-2 border border-cyan/15 bg-cyan/[0.03] rounded-lg flex items-center gap-2">
                                    <ShieldCheck className="text-cyan shrink-0" size={12} />
                                    <span className="text-[9.5px] font-bold text-navy tracking-tight uppercase leading-none">GMAA Vetted Partner</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeIdentityTab === 'reach' && (
                              <div className="space-y-2">
                                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest">Active Air & Ground Corridors</p>
                                <p className="text-xs text-navy/60 font-medium font-serif italic leading-relaxed">"Connecting Frankfurt with patients from UAE, UK, Saudi Arabia, and Toronto coordinates."</p>
                              </div>
                            )}

                            {activeIdentityTab === 'analytics' && (
                              <div className="space-y-2">
                                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest">Dashboard Engagement</p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                  <div className="p-2 bg-slate-bg rounded-lg">
                                    <span className="text-xs sm:text-sm font-mono text-cyan block font-bold">14.8k</span>
                                    <span className="text-[7.5px] font-bold text-navy/30 uppercase tracking-widest block mt-0.5">views</span>
                                  </div>
                                  <div className="p-2 bg-slate-bg rounded-lg">
                                    <span className="text-xs sm:text-sm font-mono text-emerald-500 block font-bold">428</span>
                                    <span className="text-[7.5px] font-bold text-navy/30 uppercase tracking-widest block mt-0.5">leads</span>
                                  </div>
                                  <div className="p-2 bg-slate-bg rounded-lg">
                                    <span className="text-xs sm:text-sm font-mono text-brand-red block font-bold">4.8k</span>
                                    <span className="text-[7.5px] font-bold text-navy/30 uppercase tracking-widest block mt-0.5">Reach</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* SECTION 9: HEALTHCARE COMMAND CENTER */}
              <section className="py-16 sm:py-24 md:py-32 bg-slate-bg/30 relative border-b border-navy/5 z-10" id="command-center">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                    
                    {/* Visual Board */}
                    <div className="order-2 lg:order-1">
                      <div className="bg-[#051622] rounded-[24px] sm:rounded-[48px] p-5 sm:p-8 md:p-12 border border-white/5 text-white shadow-2xl relative">
                        <div className="absolute top-4 sm:top-6 right-5 sm:right-8 text-[9px] font-mono text-white/30 uppercase">Corporate HUD</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-cyan mb-4 sm:mb-6 flex items-center gap-2">
                          <Activity size={14} className="animate-pulse shrink-0" /> Enterprise Health Tracking
                        </h3>

                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 pb-6 sm:pb-8 border-b border-white/5 mb-6 sm:mb-8">
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9.5px] font-bold text-white/40 uppercase tracking-wider block">Lead Activity</span>
                            <span className="text-xl sm:text-2xl font-mono text-white font-bold block mt-1">+142%</span>
                            <span className="text-[8.5px] font-sans font-medium text-emerald-400 block mt-1">12 active client conversations</span>
                          </div>
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9.5px] font-bold text-white/40 uppercase tracking-wider block">Profile Performance</span>
                            <span className="text-xl sm:text-2xl font-mono text-cyan font-bold block mt-1">98.2 percentile</span>
                            <span className="text-[8.5px] font-sans font-medium text-white/30 block mt-1">Trending first in specialty category</span>
                          </div>
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9.5px] font-bold text-white/40 uppercase tracking-wider block">Partnership Requests</span>
                            <span className="text-xl sm:text-2xl font-mono text-brand-red font-bold block mt-1">18 pending</span>
                            <span className="text-[8.5px] font-sans font-medium text-white/30 block mt-1">Insurance & hospitals awaiting reviews</span>
                          </div>
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <span className="text-[9.5px] font-bold text-white/40 uppercase tracking-wider block">Market Insights</span>
                            <span className="text-xl sm:text-2xl font-mono text-white font-bold block mt-1">High Index</span>
                            <span className="text-[8.5px] font-sans font-medium text-white/30 block mt-1">Hot elective bariatric demand list</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">
                          <p>● Live Pipeline status: fully active</p>
                          <p>● Data encrypted using B2B healthcare compliance</p>
                        </div>
                      </div>
                    </div>

                    {/* Right context */}
                    <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
                      <span className="text-cyan font-bold uppercase tracking-[0.3em] text-[10px]">OPERATIONAL PORTAL</span>
                      <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy leading-none">
                        Healthcare <br />
                        <span className="font-serif italic text-gradient font-medium pr-2">Command Center</span>
                      </h2>
                      <p className="text-sm sm:text-base text-navy/50 font-medium leading-relaxed px-1">
                        Take full control of your institutional growth. Our unified Healthcare Command Center tracks client lead activities, profile visits, strategic partnership requests, diagnostic volumes, and medical tourism queries securely from one screen.
                      </p>

                      <div className="space-y-4 pt-2">
                        {[
                          { title: "Lead Activity Tracking", desc: "Instantly capture, analyze, and reply to patient queries with direct messaging." },
                          { title: "Profile Performance Auditing", desc: "Monitor daily views, organic catalog visits, and search terms used to locate your staff." },
                          { title: "Direct Partnership Requests Dispatching", desc: "No middle-man brokers. Directly trade contracts with international partners in one click." }
                        ].map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />
                            <div>
                              <h4 className="text-xs font-bold text-navy uppercase tracking-wide leading-tight">{item.title}</h4>
                              <p className="text-xs text-navy/50 font-semibold mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            </>
          )}

          {activeSegment === 'benefits' && (
            <>
              {/* SECTION 10: SUCCESS STORIES */}
              <section className="py-16 sm:py-24 md:py-32 bg-white relative z-10 border-b border-navy/5" id="success">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-24">
                    <span className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px]">MEMBER TRIUMPHS</span>
                    <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy mt-3 sm:mt-4 leading-none">
                      Real Organizations. <br />
                      <span className="font-serif italic text-gradient font-medium pr-2">Real Growth.</span>
                    </h2>
                  </div>

                  <div className="max-w-4xl mx-auto bg-slate-bg/30 rounded-[24px] sm:rounded-[48px] border border-navy/5 p-5 sm:p-10 md:p-14 shadow-xl">
                    
                    {/* Story Categories Router switcher tabs */}
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 pb-4 sm:pb-6 border-b border-navy/5">
                      {[
                        { id: 'hospital', label: 'Hospitals' },
                        { id: 'ambulance', label: 'Air Ambulance' },
                        { id: 'homecare', label: 'Homecare' },
                        { id: 'diagnostic', label: 'Diagnostics' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveStoryTab(tab.id as any)}
                          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all border ${
                            activeStoryTab === tab.id 
                              ? 'bg-navy text-white border-navy scale-100 shadow-xl shadow-navy/10' 
                              : 'bg-white text-navy/40 border-navy/5 hover:text-navy hover:bg-navy/5 scale-95'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStoryTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                          <div>
                            <h3 className="text-base sm:text-lg md:text-2xl font-light text-navy font-serif italic mb-2">"{THE_STORIES[activeStoryTab].headline}"</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 leading-tight">{THE_STORIES[activeStoryTab].company}</p>
                          </div>
                          <span className="px-3 py-1.5 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 text-[9.5px] font-black uppercase tracking-widest rounded-lg shrink-0">
                            {THE_STORIES[activeStoryTab].metric}
                          </span>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-navy/60 leading-relaxed font-semibold">
                          {THE_STORIES[activeStoryTab].story}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                  </div>
                </div>
              </section>

              {/* SECTION 11: FUTURE OF HEALTHCARE NETWORKING */}
              <section className="py-16 sm:py-24 md:py-32 bg-slate-bg/30 relative z-10 border-b border-navy/5 overflow-hidden" id="future">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                  <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                    
                    <div className="space-y-6 sm:space-y-8">
                      <div className="inline-flex items-center gap-3 mb-2 px-4 py-2 bg-white rounded-full border border-navy/5">
                        <BrainCircuit size={14} className="text-cyan animate-pulse shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">VISION ROADMAP 2027</span>
                      </div>
                      <h2 className="text-[clamp(1.75rem,4vw,4rem)] md:text-6xl font-light tracking-tighter text-navy leading-[1.05]">
                        The Future Of <br />
                        Healthcare <br />
                        <span className="font-serif italic text-gradient font-medium pr-2">Networking</span>
                      </h2>
                      <p className="text-sm sm:text-base text-navy/50 font-medium leading-relaxed">
                        Healthcare is rapidly becoming decentralized, borderless, and smart. GMAA's strategic goal is to establish the ultimate automated collaboration layer across continents, matching medical requirements with pristine safety and absolute clinical standards.
                      </p>
                    </div>

                    {/* Grid of future capability markers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {[
                        { title: "🤖 AI Partner Matchmaking", desc: "Automated verification algorithms pairing clinics with global travel planners instantly." },
                        { title: "🌍 Global Referral Exchange", desc: "Instant tokenized referral handovers to slash clinical telemetry transit delays." },
                        { title: "📊 Healthcare Intelligence Reports", desc: "Deep geographic search logs tracking specialized clinical equipment shortages." },
                        { title: "🎯 Opportunity Recommendation Engine", desc: "Proactive alarm alerts notifying equipment renters of outbound regional orders." },
                        { title: "🤝 Collaboration Marketplace", desc: "Integrated sandbox for negotiating joint services and expat insurance pricing." },
                        { title: "🎤 Global Healthcare Events", desc: "B2B webinar rooms, medical travel conventions, and exclusive networking events." },
                        { title: "🏆 Industry Recognition", desc: "Accredited awards highlighting institutions with top performance index." }
                      ].map((fut, idx) => (
                        <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-navy/5 space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-wider text-navy leading-tight">{fut.title}</h4>
                          <p className="text-[10px] sm:text-[11px] text-navy/50 leading-relaxed font-semibold">{fut.desc}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </section>

              {/* SECTION 12: FINAL CTA */}
              <section className="py-20 sm:py-32 md:py-44 bg-navy text-white text-center relative z-10 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-15 space-y-8 sm:space-y-12">
                  
                  <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                    <h2 className="text-[clamp(1.75rem,6vw,5rem)] md:text-8xl font-light leading-[1.05] tracking-tighter text-white">
                      The Future Of <br />Healthcare Growth <br />
                      <span className="font-serif italic text-gradient font-medium pr-3">Starts Here.</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-white/40 leading-relaxed max-w-xl mx-auto font-medium px-2">
                      Join a platform built to connect healthcare organizations, create opportunities, and accelerate growth across borders.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 max-w-xl sm:max-w-none mx-auto w-full">
                    <button 
                      onClick={onPartnerWithUs}
                      className="w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-cyan text-white rounded-full font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-white hover:text-navy hover:scale-103 transition-all shadow-2xl active:scale-95 duration-500"
                    >
                      🚀 Become A Partner
                    </button>
                    <button 
                      onClick={onPartnerWithUs}
                      className="w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 border border-white/20 rounded-full font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-white hover:text-navy hover:scale-103 transition-all active:scale-95 duration-500"
                    >
                      🌍 Expand Globally
                    </button>
                    <button 
                      onClick={onPartnerWithUs}
                      className="w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-brand-red text-white rounded-full font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-white hover:text-navy hover:scale-103 transition-all shadow-2xl active:scale-95 duration-500"
                    >
                      📈 Start Growing Today
                    </button>
                  </div>

                </div>
              </section>
            </>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}