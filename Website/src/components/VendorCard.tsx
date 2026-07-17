import { motion } from "motion/react";
import { Star, MapPin, ArrowUpRight } from "lucide-react";
import type { RegistryVendor } from "../types/registry";

export interface VendorCardProps extends RegistryVendor {
  onClick?: (id: string) => void;
}

export default function VendorCard({
  id,
  name,
  location,
  mainCategory,
  image,
  accreditation,
  specialty,
  rating,
  onClick,
}: VendorCardProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onClick={() => onClick && onClick(id)}
      className={`group relative flex flex-col border-r border-b border-navy/5 bg-white p-6 sm:p-8 hover:bg-navy hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy/10 transition-all duration-700 ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Background Hover Effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 origin-left bg-brand-red group-hover:scale-x-100 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Floating Category Label */}
        <div className="flex justify-between items-start mb-6 sm:mb-8">
          <div className="mixed-caps opacity-100 group-hover:text-cyan transition-colors uppercase tracking-widest text-[9px] font-bold">
            {mainCategory}
          </div>
          {rating && (
            <div className="flex items-center gap-1 group-hover:text-brand-red transition-colors text-navy/40">
              <Star size={12} className="fill-current" />
              <span className="text-[10px] font-bold">{rating}</span>
            </div>
          )}
        </div>

        {/* Name & Location */}
        <h3 className="text-2xl sm:text-[30px] leading-tight font-serif italic mb-3 text-navy group-hover:text-white transition-all duration-500 transform group-hover:translate-x-2 pr-2">
          {name}
        </h3>
        <p className="flex items-center gap-2 text-[11px] font-semibold text-navy/45 uppercase tracking-[0.12em] mb-4 sm:mb-5 group-hover:text-white/60 transition-colors">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{location}</span>
        </p>
        {specialty && (
          <p className="text-[10px] italic text-navy/30 group-hover:text-cyan mb-8 sm:mb-12 transition-colors">
            {specialty}
          </p>
        )}

        {/* Visual Anchor */}
        <div className="relative mb-6 sm:mb-10 overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] bg-slate-100 group-hover:scale-[1.02] transition-all duration-700">
          <img
            src={image ?? undefined}
            alt={name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
        </div>

        {/* Accreditation & Stats */}
        <div className="mt-auto pt-6 sm:pt-8 border-t border-navy/10 group-hover:border-white/10 flex items-center justify-between gap-4">
          {accreditation && accreditation.length > 0 ? (
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-navy/30 group-hover:text-white/40 transition-colors">
                Accredited
              </p>
              <p className="text-[11px] font-bold text-brand-red group-hover:text-white transition-colors truncate">
                {accreditation[0]}
              </p>
            </div>
          ) : (
            <div />
          )}
          {rating ? (
            <div className="text-right shrink-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-navy/30 group-hover:text-white/40 transition-colors">
                Rating
              </p>
              <p className="text-sm font-bold text-navy group-hover:text-white transition-colors underline decoration-brand-red underline-offset-4">
                {rating}/5.0
              </p>
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* Action Reveal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-xl shadow-2xl">
            <ArrowUpRight
              className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              size={24}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}