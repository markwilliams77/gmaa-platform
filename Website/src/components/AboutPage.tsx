import { motion } from "motion/react";
import {
  Shield,
  Globe,
  Activity,
  Users,
  Award,
  Zap,
  ArrowRight,CheckCircle2,Target,Sparkles,Heart
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-red selection:text-white">
      
      {/* 1. THE CONNECTOR LINE (Visual Guide) */}
      <div className="fixed left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-navy/10 to-transparent z-0 hidden lg:block" />

      {/* ========================= HERO SECTION ========================= */}
      <section className="relative h-[65vh] lg:h-[75vh] flex flex-col border-b border-navy/5 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/about-hero-bg.png"
            alt="Healthcare Ecosystem"
            className="absolute top-0 right-[-20%] w-full h-full object-cover object-[80%_50%] scale-135 opacity-90 select-none pointer-events-none"
          />

          {/* Gradient Overlay - Softened to let the image show through the bottom */}

          <div className=" absolute inset-0 bg-gradient-to-r from-white via-white/78 via-[50%] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-20 w-full max-w-[1800px] mx-auto px-6 lg:px-28 pt-24 flex-grow flex flex-col justify-center">
          <div className="max-w-[800px]">
             {/* GHOST TYPOGRAPHY */}
             <span className="absolute -top-10 left-0 text-[15rem] font-bold text-navy/[0.02] select-none pointer-events-none uppercase">Alliance</span>
             
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-1 bg-brand-red rounded-full" />
                <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-navy/60">GMAA Global</span>
             </div>
             <h1 className="text-[clamp(2.5rem,5vw,5.5rem)] leading-[1] tracking-tighter font-light text-navy mb-8">
                Borderless <span className="text-gradient font-bold">Healthcare</span> <br/> 
                Infrastructure.
             </h1>
             <p className="max-w-xl text-lg text-navy/60 leading-relaxed mb-10">
                Building the world’s most reliable directory and coordination layer for international medical access.
             </p>
             <button className="px-10 py-4 rounded-full bg-navy text-white text-[10px] uppercase tracking-widest font-bold hover:bg-brand-red transition-all flex items-center gap-3 shadow-xl">
                The Journey <ArrowRight size={16} />
              </button>
          </div>
        </div>

        {/* STATS PILL */}
        <div className="relative z-30 px-6 pb-12 mt-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-full shadow-2xl border border-white/50 overflow-hidden divide-x divide-navy/5">
              {[
                { v: "50,000+", l: "Vetted Partners" },
                { v: "120+", l: "Countries" },
                { v: "Global", l: "Coordination" },
                { v: "24/7", l: "Response" }
              ].map((s, i) => (
                <div key={i} className="px-8 py-8 flex flex-col items-center lg:items-start">
                  <p className="text-2xl font-bold text-brand-red tracking-tighter">{s.v}</p>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-navy/40">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= MISSION & VISION (DARK BG PHOTO) ========================= */}
      <section className="relative py-32 lg:py-48 text-white overflow-hidden bg-navy">
        {/* BACKGROUND IMAGE - Modern Hospital Interior */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 scale-110"
            alt="Mission background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/80 to-navy" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-20">
          {/* LARGE GHOST TEXT */}
          <div className="absolute top-0 right-0 text-[20vw] font-bold text-white/[0.03] leading-none select-none translate-y-[-20%]">GMAA</div>

          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-brand-red font-bold tracking-[0.5em] text-xs uppercase">
                  <Shield size={20} /> Our Mission
                </div>
                <h2 className="text-4xl lg:text-7xl font-light leading-[0.9] tracking-tighter">
                  Bridging <span className="italic font-normal">Capacities.</span>
                </h2>
              </div>
              <p className="text-xl text-white/60 leading-relaxed max-w-lg">
                To simplify the complexity of global healthcare through an intelligent directory that puts patient outcomes over geographic convenience.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="border-l border-brand-red pl-6">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Verified Providers</p>
                </div>
                <div className="border-l border-cyan pl-6">
                  <p className="text-3xl font-bold">Zero</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Access Barriers</p>
                </div>
              </div>
            </div>

            <div className="p-1 lg:p-12 rounded-[60px] bg-white/5 border border-white/10 backdrop-blur-sm">
               <Activity className="text-cyan mb-8" size={40} />
               <h3 className="text-3xl font-light mb-6">Our Vision</h3>
               <p className="text-lg text-white/50 leading-relaxed mb-8">
                  By 2030, GMAA aims to be the standard institutional layer for every cross-border medical journey, reducing waiting lists globally by 40%.
               </p>
               <ul className="space-y-4">
                 {['Universal Directory Access', 'Unified Medical Logistics', 'Instant Provider Verification'].map(li => (
                   <li key={li} className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white/70">
                     <div className="w-1.5 h-1.5 rounded-full bg-cyan" /> {li}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= BENEFITS (WITH SECTION BACKGROUND) ========================= */}
<section className="relative py-32 lg:py-48 overflow-hidden bg-white">
  
  {/* 1. SECTION BACKGROUND IMAGE */}
  <div className="absolute inset-0 z-0">
    <img 
      src="https://images.unsplash.com/photo-1579154238328-1c32b0d804f5?auto=format&fit=crop&q=80&w=2000" 
      alt="Medical Lab Background" 
      className="w-full h-full object-cover opacity-10"
    />
    {/* Soft white gradients to blend the image into the page flow */}
    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-60" />
  </div>

  {/* 2. GHOST TYPOGRAPHY LAYER */}
  <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[22vw] font-bold text-navy/[0.02] select-none whitespace-nowrap z-0">
    NETWORK
  </div>

  {/* 3. CONTENT LAYER */}
  <div className="relative z-10 container mx-auto px-6 lg:px-20">
    <div className="max-w-3xl mb-24">
      <span className="text-brand-red font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">
        The Advantage
      </span>
      <h2 className="text-4xl lg:text-7xl font-light tracking-tighter text-navy mb-8 leading-tight">
        A Direct Path to <br/> <span className="text-gradient font-bold">Global Care.</span>
      </h2>
      <p className="text-xl text-navy/60 leading-relaxed">
        We replace fragmented medical searches with a single, audited ecosystem designed for speed and reliability.
      </p>
    </div>

    {/* THE COLORED CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { 
          t: "Powerful Directory", 
          d: "Over 50,000 audited providers vetted for real-world performance.", 
          pic: "https://images.unsplash.com/photo-1576091160611-259eb2d99619?auto=format&fit=crop&q=80&w=800" 
        },
        { 
          t: "All-in-One", 
          d: "Handling every layer from diagnostics to post-operative recovery.", 
          pic: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" 
        },
        { 
          t: "Quick Response", 
          d: "Built for urgency. Cut through bureaucracy and get answers in hours.", 
          pic: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800" 
        },
        { 
          t: "Global Reach", 
          d: "Bridging world-class medical talent with patients in 120+ countries.", 
          pic: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800" 
        }
      ].map((v, i) => (
        <div key={i} className="group relative h-[500px] rounded-[40px] overflow-hidden border border-navy/5 shadow-lg hover:shadow-2xl transition-all duration-700 bg-navy">
          {/* IMAGE */}
          <img 
            src={v.pic} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100" 
            alt={v.t} 
          />
          
          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          <div className="relative p-10 h-full flex flex-col justify-end z-10">
            <div className="text-brand-red font-bold text-4xl mb-4 opacity-100 drop-shadow-md">0{i+1}</div>
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">{v.t}</h3>
            <p className="text-sm text-white/80 leading-relaxed font-medium drop-shadow-sm">
              {v.d}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ========================= CORE VALUES (HUMAN TOUCH PHOTO) ========================= */}
      <section className="relative py-32 lg:py-48 bg-slate-bg/50">
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-5 mix-blend-multiply"
            alt="Values background"
           />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-20">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <span className="text-cyan font-bold tracking-[0.6em] text-[10px] uppercase mb-6 inline-block">The GMAA Standard</span>
            <h2 className="text-4xl lg:text-7xl font-light text-navy tracking-tighter mb-8 leading-tight">
              Safety is our <br/> <span className="font-bold text-navy underline decoration-brand-red decoration-4 underline-offset-8">Only Priority.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/5 rounded-[40px] overflow-hidden border border-navy/5 shadow-2xl">
            {[
              { icon: Target, t: "Radical Transparency", d: "Direct cost mapping with zero hidden margins." },
              { icon: Sparkles, t: "Institutional Quality", d: "Audited facilities that pass international safety tiers." },
              { icon: Globe, t: "Cultural Fluency", d: "Native support in every strategic healthcare region." },
              { icon: Heart, t: "Patient Advocacy", d: "We represent you, not the clinic or the provider." },
              { icon: Shield, t: "Safety Infrastructure", d: "Real-time monitoring of all active medical travel." },
              { icon: Zap, t: "Agile Response", d: "Reducing the gap between diagnosis and treatment." }
            ].map((v, i) => (
              <div key={i} className="bg-white p-12 lg:p-16 group hover:bg-navy transition-all duration-700">
                <v.icon className="text-brand-red group-hover:text-cyan transition-all mb-8" size={32} />
                <h3 className="text-2xl font-bold text-navy group-hover:text-white mb-4 transition-colors">{v.t}</h3>
                <p className="text-navy/40 group-hover:text-white/40 leading-relaxed font-medium transition-colors">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= STORY & FOUNDER (ARCHITECTURE PHOTO) ========================= */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="w-full lg:w-1/2 relative">
               <div className="aspect-[4/5] rounded-[48px] lg:rounded-[80px] overflow-hidden relative group shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Founder" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-12 left-12">
                     <p className="text-white text-3xl font-light mb-1">Dr. Alisha Singh</p>
                     <p className="text-brand-red font-bold text-xs uppercase tracking-widest">Founder & CEO</p>
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 w-48 h-48 bg-slate-bg rounded-full -z-10 animate-pulse opacity-50" />
            </div>

            <div className="w-full lg:w-1/2 space-y-12">
               <div className="space-y-6">
                  <span className="text-brand-red font-bold uppercase tracking-[0.4em] text-[10px]">Strategic Vision</span>
                  <h2 className="text-4xl lg:text-7xl font-light text-navy tracking-tighter leading-none">
                    Unifying Global <br/> <span className="text-gradient font-bold">Capacity.</span>
                  </h2>
                  <p className="text-2xl text-navy/40 leading-relaxed font-medium italic">
                    "We didn't just build a directory. We built an alliance that eliminates the friction of borders."
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-12 pt-10 border-t border-navy/5">
                <div>
                  <p className="text-5xl font-bold text-navy tracking-tighter mb-2">15+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30">Coordination Expertise</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-navy tracking-tighter mb-2">120</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30">Strategic Regions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
