import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Share2,
  TrendingUp,
  Zap,
  Newspaper,
  Cpu,
  Stethoscope,
  Plane,
  Building2,
  Microscope,
  FlaskConical,
  HeartHandshake,
} from "lucide-react";

const INSIGHTS = [
  {
    id: 1,
    title: "Why India Is Becoming the World's Preferred Medical Tourism Destination",
    excerpt:
      "From internationally accredited hospitals to affordable world-class care, discover why thousands of patients are choosing India for complex treatments every year.",
    category: "Medical Tourism",
    date: "July 5, 2026",
    author: "GMAA Editorial",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600",
    featured: true,
  },
  {
    id: 2,
    title: "Artificial Intelligence Is Transforming Early Cancer Detection",
    excerpt:
      "Hospitals worldwide are adopting AI-powered diagnostic systems capable of detecting diseases earlier, improving treatment outcomes and reducing diagnostic delays.",
    category: "Medical Technology",
    date: "July 4, 2026",
    author: "GMAA Editorial",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600",
    featured: true,
  },
  {
    id: 3,
    title: "The Rise of Robotic Surgery Across Leading Healthcare Institutions",
    excerpt:
      "From orthopedics to cardiac procedures, robotic-assisted surgery is improving precision, reducing recovery time, and redefining modern patient care.",
    category: "Healthcare News",
    date: "July 3, 2026",
    author: "GMAA Editorial",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1600",
    featured: true,
  },
  {
    id: 4,
    title: "How Digital Hospitals Are Creating the Future of Connected Healthcare",
    excerpt:
      "Integrated patient records, virtual consultations, AI-assisted workflows and smart infrastructure are driving the next generation of healthcare delivery.",
    category: "Hospitals",
    date: "July 2, 2026",
    author: "GMAA Editorial",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=1600",
    featured: true,
  },
  {
    id: 5,
    title: "Understanding Cardiac Bypass Surgery: Everything Patients Should Know",
    excerpt:
      "A complete guide covering preparation, procedure, recovery and long-term lifestyle recommendations after bypass surgery.",
    category: "Treatment Guides",
    date: "July 1, 2026",
    author: "GMAA Editorial",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 6,
    title: "JCI Accreditation: Why It Matters When Choosing an International Hospital",
    excerpt:
      "Accreditation plays a critical role in patient safety, quality standards and trust for cross-border healthcare services.",
    category: "Hospitals",
    date: "June 30, 2026",
    author: "GMAA Editorial",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 7,
    title: "The Future of Precision Medicine Through Genomics and Personalized Care",
    excerpt:
      "Advancements in genomic research are enabling doctors to tailor treatments specifically for each patient's unique genetic profile.",
    category: "Research",
    date: "June 29, 2026",
    author: "GMAA Editorial",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 8,
    title: "How Advanced Diagnostic Imaging Is Improving Clinical Decision Making",
    excerpt:
      "Modern MRI, CT and PET imaging technologies are helping physicians diagnose diseases faster and with greater confidence.",
    category: "Diagnostics",
    date: "June 28, 2026",
    author: "GMAA Editorial",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=1600",
  },
];

export default function InsightsPage() {
  const featuredPosts = INSIGHTS.filter((p) => p.featured);
  const regularPosts = INSIGHTS.filter((p) => !p.featured);

  const [activeFeatured, setActiveFeatured] = useState(0);

  const featuredPost = featuredPosts[activeFeatured];

  useEffect(() => {
    if (featuredPosts.length <= 1) return;

    const interval = setInterval(() => {
      setActiveFeatured((prev) => (prev + 1) % featuredPosts.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [featuredPosts.length]);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* ========================= HERO ========================= */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        {/* Background */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* subtle background */}

          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/40 to-white" />

          {/* artwork */}

          <img
            src="/images/insights-hero-bg.png"
            alt="Healthcare Intelligence"
            className="
        hidden lg:block
        absolute
        top-1/2
        right-[-15%]
        -translate-y-1/2
        w-[94%]
        max-w-none
        object-contain
        select-none
        opacity-100
      "
          />

          {/* left fade */}

          <div
            className="
        hidden lg:block
        absolute
        inset-0
        bg-gradient-to-r
        from-white
        via-white
        via-[38%]
        to-white/0
      "
          />

          {/* soft radial glow */}

          <div
            className="
        absolute
        left-[-10%]
        top-[-20%]
        h-[800px]
        w-[800px]
        rounded-full
        bg-brand-cyan/5
        blur-3xl
      "
          />
        </div>

        {/* Content */}

        <div className="relative z-20 mx-auto flex min-h-[74vh] lg:min-h-[78vh] w-full max-w-[1800px] items-center px-6 md:px-10 xl:px-20 2xl:px-28">
          <div className="max-w-[760px]">
            {/* Label */}

            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-14 bg-brand-red" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.42em] text-navy/55">
                Global Healthcare Intelligence
              </span>
            </div>

            {/* Heading */}

            <h1 className="text-[clamp(3.6rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.05em] text-navy">
              Healthcare
              <br />
              <span className="font-semibold text-gradient">Insights.</span>
            </h1>

            {/* Description */}

            <p className="mt-8 max-w-[650px] text-lg leading-9 text-navy/70">
              Stay informed with the latest healthcare innovations, medical
              breakthroughs, treatment guides, hospital success stories,
              industry developments, and global medical tourism insights from
              around the world.
            </p>

            {/* Search */}

            <div className="mt-10 max-w-[640px]">
              <div className="relative rounded-full border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
                <input
                  type="text"
                  placeholder="Search articles, hospitals, doctors, treatments..."
                  className="h-16 w-full rounded-full bg-transparent pl-7 pr-20 text-[15px] outline-none placeholder:text-slate-400"
                />

                <button
                  className="
              absolute
              right-2
              top-2
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-navy
              text-lg
              text-white
              transition
              hover:bg-brand-red
            "
                >
                  →
                </button>
              </div>
            </div>

            {/* Trending */}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.35em] text-navy/40">
                Trending
              </span>

              {[
                "AI in Healthcare",
                "Cancer",
                "Cardiology",
                "IVF",
                "Medical Tourism",
                "Robotic Surgery",
                "JCI Hospitals",
                "Diagnostics",
              ].map((item) => (
                <button
                  key={item}
                  className="
              rounded-full
              border
              border-slate-200
              bg-white/95
              px-5
              py-2.5
              text-[11px]
              font-semibold
              text-navy/75
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-brand-red/30
              hover:bg-brand-red
              hover:text-white
              hover:shadow-lg
            "
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Artwork */}

        <div className="relative z-10 lg:hidden px-6 pb-14">
          <img
            src="/images/insights-hero-bg.png"
            alt="Healthcare Intelligence"
            className="mx-auto w-full max-w-xl object-contain"
          />
        </div>
      </section>

      {featuredPost && (
        <section className="py-16 md:py-20 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-16">
            <motion.div
              key={featuredPost.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Label */}

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-px bg-brand-red" />
                <span className="uppercase tracking-[0.4em] text-[11px] font-semibold text-navy/50">
                  Featured Insight
                </span>
              </div>

              {/* Content */}

              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-navy/45 mb-4">
                  <span className="px-4 py-2 rounded-full bg-brand-red text-white">
                    {featuredPost.category}
                  </span>

                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {featuredPost.date}
                  </span>

                  <span className="flex items-center gap-2">
                    <BookOpen size={14} />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-[clamp(2.8rem,5vw,5.2rem)] leading-[0.95] tracking-[-0.04em] text-navy font-light">
                  {featuredPost.title}
                </h2>

                <p className="mt-5 max-w-3xl text-xl leading-9 text-navy/65">
                  {featuredPost.excerpt}
                </p>

                <button className="group mt-7 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-navy hover:text-brand-red transition">
                  Read Article
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Image */}

              <div className="group mt-10 overflow-hidden rounded-[36px] shadow-[0_35px_90px_rgba(15,23,42,0.12)]">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full aspect-[16/7] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Controls */}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() =>
                    setActiveFeatured(
                      (activeFeatured - 1 + featuredPosts.length) %
                        featuredPosts.length,
                    )
                  }
                  className="text-sm font-semibold text-navy hover:text-brand-red transition"
                >
                  ← Previous
                </button>

                <div className="flex gap-3">
                  {featuredPosts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeatured(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === activeFeatured
                          ? "w-8 bg-brand-red"
                          : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setActiveFeatured(
                      (activeFeatured + 1) % featuredPosts.length,
                    )
                  }
                  className="text-sm font-semibold text-navy hover:text-brand-red transition"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ========================= HEALTHCARE CATEGORIES ========================= */}

      <section className="py-16 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-16">
          {/* Heading */}

          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-px bg-brand-red" />
                <span className="uppercase tracking-[0.4em] text-[11px] font-semibold text-navy/50">
                  Explore
                </span>
              </div>

              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light tracking-tight text-navy">
                Browse by
                <span className="font-semibold text-gradient"> Category.</span>
              </h2>
            </div>
          </div>

          {/* Categories */}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Newspaper,
                title: "Healthcare News",
                description:
                  "Industry updates, policies and healthcare developments.",
                count: "124 Articles",
              },
              {
                icon: Cpu,
                title: "Medical Technology",
                description:
                  "AI, robotics, digital health and medical innovation.",
                count: "48 Articles",
              },
              {
                icon: Stethoscope,
                title: "Treatment Guides",
                description:
                  "Understand procedures, recovery and treatment options.",
                count: "92 Articles",
              },
              {
                icon: Plane,
                title: "Medical Tourism",
                description:
                  "Travel, visas, destinations and patient experiences.",
                count: "61 Articles",
              },
              {
                icon: Building2,
                title: "Hospitals",
                description:
                  "Hospital profiles, achievements and success stories.",
                count: "83 Articles",
              },
              {
                icon: Microscope,
                title: "Diagnostics",
                description:
                  "Screening, pathology, imaging and lab advancements.",
                count: "57 Articles",
              },
              {
                icon: FlaskConical,
                title: "Research",
                description:
                  "Clinical studies and medical research breakthroughs.",
                count: "39 Articles",
              },
              {
                icon: HeartHandshake,
                title: "Vendor Spotlight",
                description:
                  "Featured hospitals, clinics and healthcare providers.",
                count: "22 Stories",
              },
            ].map((category, index) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group cursor-pointer rounded-[28px] border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-brand-red/20 hover:shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-8 transition group-hover:bg-brand-red group-hover:text-white">
                    <Icon size={26} />
                  </div>

                  <h3 className="text-2xl font-semibold text-navy mb-4 group-hover:text-brand-red transition-colors">
                    {category.title}
                  </h3>

                  <p className="text-navy/60 leading-7 mb-8">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold text-navy/40">
                      {category.count}
                    </span>

                    <span className="flex items-center gap-2 text-sm font-semibold text-navy group-hover:text-brand-red transition-colors">
                      Explore
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Daily Update Newsletter */}
      <section className="py-16 md:py-24">
        <div className="max-w-[95%] md:max-w-[80%] mx-auto px-4 md:px-0">
          <div className="bg-navy rounded-[32px] md:rounded-[64px] p-8 md:p-16 relative overflow-hidden text-center text-white">
            <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-6xl font-light tracking-tighter leading-tight">
                Institutional{" "}
                <span className="font-bold text-gradient pr-2">
                  Intelligence.
                </span>
              </h2>
              <p className="text-white/50 font-medium text-sm md:text-base">
                Subscribe for daily morning briefings delivered to your terminal
                every day at 06:00 GMT.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 md:px-8 py-4 md:py-5 focus:outline-none focus:border-brand-red transition-all font-medium text-sm"
                />
                <button className="bg-white text-navy px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] hover:bg-brand-red hover:text-white transition-all shadow-2xl active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
