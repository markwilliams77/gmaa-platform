import React from 'react';
import { motion } from 'motion/react';
import { Shield, Brain, Globe, Database, ArrowRight, Activity, ClipboardCheck, Sparkles } from 'lucide-react';

const ECOSYSTEM_SERVICES = [
  {
    id: 'emergency',
    title: 'Urgent & Emergency Care',
    description: 'Get immediate support with coordinates for flying ICU air ambulances, fast ground ambulance dispatches, and emergency crews.',
    icon: Shield,
    color: 'text-brand-red',
    bgColor: 'bg-brand-red/5',
    features: ['24/7 Red-Alert Support', 'Urgent Transport', 'First Aid Dispatch']
  },
  {
    id: 'non-emergency',
    title: 'At-Home & Senior Support',
    description: 'Connect with patient home nursing, gentle physical therapists, recovery assistants, and cozy senior communities.',
    icon: Brain,
    color: 'text-navy',
    bgColor: 'bg-navy/5',
    features: ['Cozy In-House Nursing', 'Recovering After Surgery', 'Gentle Companionship']
  },
  {
    id: 'equipment',
    title: 'Importing Specialized Devices',
    description: 'Secure, ship, and custom-order critical items like medical beds, specialized oxygen aids, mobility chairs, and braces.',
    icon: Sparkles,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/5',
    features: ['Specialized Oxygen Aids', 'Mobility & Braces', 'Local Custom Ordering']
  },
  {
    id: 'specialists',
    title: 'Consultations & Travel',
    description: 'Easily book video appointments with welcoming doctors or plan travel itineraries for expert centers abroad.',
    icon: Globe,
    color: 'text-cyan',
    bgColor: 'bg-cyan/5',
    features: ['Friendly Virtual Doctors', 'Travel Concierge Support', 'Language Guides']
  }
];

export default function ServiceEcosystem() {
  return (
    <section className="py-32 bg-slate-bg/30 relative overflow-hidden">
      {/* Decorative architectural elements */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-navy/5" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-navy/5" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-start mb-24">
          <div className="lg:w-1/3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-1 bg-brand-red rounded-full" />
              <span className="text-navy font-bold uppercase tracking-[0.4em] text-[10px]">How we help</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light tracking-tighter text-navy mb-8 leading-[0.9]">
              Every service you <br />
              <span className="font-serif italic font-medium text-gradient">could need.</span>
            </h2>
            <p className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] text-navy/50 font-medium leading-relaxed mb-12">
              Accessing emergency flights, arranging comforting homecare layers, or importing custom medical gear should be incredibly simple. We connect you to reliable teams, anywhere.
            </p>
            
            <div className="flex flex-col gap-6">
               <div className="p-6 rounded-3xl bg-white border border-navy/5 shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                     <ClipboardCheck className="text-cyan" size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-navy">Quality Checked</span>
                  </div>
                  <p className="text-[10px] text-navy/40 font-medium italic">
                    Every clinic in our network undergoes a rigorous review of their safety and success protocols.
                  </p>
               </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
            {ECOSYSTEM_SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-10 rounded-[48px] border border-navy/5 hover:border-cyan/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative Pattern Background */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none translate-x-10 -translate-y-10">
                   <Database size={120} />
                </div>

                <div className={`w-14 h-14 ${service.bgColor} ${service.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon size={28} />
                </div>

                <h3 className="text-2xl font-bold text-navy mb-4">{service.title}</h3>
                <p className="text-sm text-navy/50 leading-relaxed mb-8">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan/20" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy/60">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="flex items-center gap-3 text-navy hover:text-cyan transition-colors group/btn">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Learn More</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Connectivity Visualization */}
        <div className="bg-navy rounded-[48px] p-12 md:p-20 text-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] noise" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-md">
                 <h3 className="text-3xl font-light tracking-tight mb-6">A more <br /><span className="font-serif italic text-cyan">complete way to care.</span></h3>
                 <p className="text-sm text-white/40 leading-relaxed">
                   We believe that high-quality, practical health coordination should be accessible to everyone, no matter whether they need simple equipment imports or comprehensive surgery pathways.
                 </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                 {[
                   { label: 'Patient Support', val: '24/7' },
                   { label: 'Families Assisted', val: '120k+' },
                   { label: 'Trusted Partners', val: '4,200+' }
                 ].map(stat => (
                   <div key={stat.label} className="text-center">
                     <div className="text-3xl md:text-5xl font-light mb-2">{stat.val}</div>
                     <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">{stat.label}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
