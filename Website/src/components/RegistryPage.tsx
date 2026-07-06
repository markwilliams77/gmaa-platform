import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  MapPin,
  Activity,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import VendorCard from "./VendorCard";
import type { RegistryVendor } from "../types/registry";
import { buildSearchIndex } from "../search/buildSearchIndex";
import { search } from "../search";
import { VENDOR_CATEGORIES } from "../constants/vendorCategories";
import { Country } from "country-state-city";

interface RegistryPageProps {
  onSelectVendor?: (id: string) => void;
}

export default function RegistryPage({ onSelectVendor }: RegistryPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [vendors, setVendors] = useState<RegistryVendor[]>([]);
  const [categoryFilterSearch, setCategoryFilterSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );
  const [subCategoryFilterSearch, setSubCategoryFilterSearch] = useState("");
  const selectedCategory =
    searchParams.get("category") || searchParams.get("service") || null;
  const selectedCountry = searchParams.get("country") || null;
  const availableCountries = useMemo(() => {
    return Country.getAllCountries()
      .map((country) => country.name)
      .sort();
  }, []);

  const availableCategories = useMemo(() => {
    return VENDOR_CATEGORIES.map((category) => category.mainCategory);
  }, []);

  const availableSubCategories = useMemo(() => {
    if (!selectedCategory) return [];

    const category = VENDOR_CATEGORIES.find(
      (c) => c.mainCategory === selectedCategory,
    );

    if (!category) return [];

    return category.subCategories.map((sub) => sub.name);
  }, [selectedCategory]);

  useEffect(() => {
    fetch("http://localhost:5000/api/registry/vendors")
      .then(
        (
          res,
        ): Promise<{
          data: RegistryVendor[];
        }> => res.json(),
      )
      .then(({ data }) => {
        setVendors(data);

        buildSearchIndex(data);
      })
      .catch((err) => {
        console.error("Failed to load vendors", err);
      });
  }, []);

  const setSelectedCategory = (category: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category) {
      nextParams.set("category", category);
    } else {
      nextParams.delete("category");
    }
    setSearchParams(nextParams);
  };

  const setSelectedCountry = (country: string | null) => {
    const nextParams = new URLSearchParams(searchParams);

    if (country) {
      nextParams.set("country", country);
    } else {
      nextParams.delete("country");
    }

    setSearchParams(nextParams);
  };

  const filteredVendors = useMemo(() => {
    const result = search(searchQuery);

    return result.vendors.filter((vendor) => {
      const matchesCategory =
        !selectedCategory ||
        vendor.mainCategory
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      const matchesSubCategory =
        !selectedSubCategory ||
        vendor.subCategory
          .toLowerCase()
          .includes(selectedSubCategory.toLowerCase());

      const matchesCountry =
        !selectedCountry || vendor.country === selectedCountry;

      return matchesCategory && matchesSubCategory && matchesCountry;
    });
  }, [
    vendors,
    searchQuery,
    selectedCategory,
    selectedSubCategory,
    selectedCountry,
  ]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-1 bg-brand-red rounded-full" />
            <span className="text-navy font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
              VERIFIED GLOBAL DIRECTORY
            </span>
          </div>
          <h1 className="text-[clamp(2rem,4vw,4rem)] md:text-8xl font-light tracking-tighter leading-[1.1] md:leading-[0.9] text-navy mb-6 md:mb-8">
            Global Healthcare{" "}
            <span className="font-serif italic text-gradient font-medium pr-2">
              Directory.
            </span>
          </h1>
          <p className="text-navy/40 max-w-xl text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] font-medium leading-relaxed">
            Browse GMAA verified healthcare providers across hospitals,
            laboratories, pharmacies, medical equipment suppliers, home
            healthcare, rehabilitation, medical tourism facilitators and other
            healthcare organizations worldwide.
          </p>
        </div>

        {/* Filter/Search Bar */}
        <div className="sticky top-24 z-30 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow group">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/25 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by organization, service, specialty or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white border border-navy/10 rounded-3xl outline-none text-navy font-medium shadow-lg shadow-slate-200/40 transition-all focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-8 py-6 rounded-3xl border flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${
                showFilters
                  ? "bg-brand-red text-white border-brand-red shadow-brand-red/20"
                  : "bg-white text-navy border-navy/10 hover:border-brand-red hover:text-brand-red"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {(selectedCategory || selectedCountry) && (
                <span className="w-4 h-4 rounded-full bg-brand-red text-white flex items-center justify-center text-[8px]">
                  {(selectedCategory ? 1 : 0) + (selectedCountry ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters Overlay */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 right-0 mt-4 p-8 bg-white border border-navy/5 rounded-[40px] shadow-2xl shadow-navy/10 z-50 overflow-hidden"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* ========================= MAIN CATEGORY ========================= */}

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-6">
                      Main Category
                    </h4>

                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30"
                      />

                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categoryFilterSearch}
                        onChange={(e) =>
                          setCategoryFilterSearch(e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:border-cyan"
                      />
                    </div>

                    <div className="mt-4 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                      <div className="divide-y divide-slate-100">
                        <label
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                            !selectedCategory
                              ? "bg-cyan/10"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={!selectedCategory}
                            onChange={() => setSelectedCategory(null)}
                            className="accent-cyan"
                          />

                          <span className="text-sm text-navy">
                            All Categories
                          </span>
                        </label>

                        {availableCategories
                          .filter((c) =>
                            c
                              .toLowerCase()
                              .includes(categoryFilterSearch.toLowerCase()),
                          )
                          .map((c) => (
                            <label
                              key={c}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                                selectedCategory === c
                                  ? "bg-cyan/10"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={selectedCategory === c}
                                onChange={() => setSelectedCategory(c)}
                                className="accent-cyan"
                              />

                              <span className="text-sm text-navy">{c}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* ========================= SUB CATEGORY ========================= */}

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-6">
                      Sub Category
                    </h4>

                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30"
                      />

                      <input
                        type="text"
                        placeholder="Search sub categories..."
                        value={subCategoryFilterSearch}
                        onChange={(e) =>
                          setSubCategoryFilterSearch(e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:border-cyan"
                        disabled={!selectedCategory}
                      />
                    </div>

                    <div className="mt-4 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                      {!selectedCategory ? (
                        <div className="h-64 flex items-center justify-center px-6 text-center text-sm text-navy/40">
                          Select a Main Category to view its Sub Categories.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          <label
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                              !selectedSubCategory
                                ? "bg-cyan/10"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="subcategory"
                              checked={!selectedSubCategory}
                              onChange={() => setSelectedSubCategory(null)}
                              className="accent-cyan"
                            />

                            <span className="text-sm text-navy">
                              All Sub Categories
                            </span>
                          </label>

                          {availableSubCategories
                            .filter((sub) =>
                              sub
                                .toLowerCase()
                                .includes(
                                  subCategoryFilterSearch.toLowerCase(),
                                ),
                            )
                            .map((sub) => (
                              <label
                                key={sub}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                                  selectedSubCategory === sub
                                    ? "bg-cyan/10"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="subcategory"
                                  checked={selectedSubCategory === sub}
                                  onChange={() => setSelectedSubCategory(sub)}
                                  className="accent-cyan"
                                />

                                <span className="text-sm text-navy">{sub}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ========================= COUNTRY ========================= */}

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-6">
                      Country
                    </h4>

                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30"
                      />

                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:border-cyan"
                      />
                    </div>

                    <div className="mt-4 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                      <div className="divide-y divide-slate-100">
                        <label
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                            !selectedCountry
                              ? "bg-cyan/10"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={!selectedCountry}
                            onChange={() => setSelectedCountry(null)}
                            className="accent-cyan"
                          />

                          <span className="text-sm text-navy">
                            All Countries
                          </span>
                        </label>

                        {availableCountries
                          .filter((country) =>
                            country
                              .toLowerCase()
                              .includes(countrySearch.toLowerCase()),
                          )
                          .map((country) => (
                            <label
                              key={country}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                                selectedCountry === country
                                  ? "bg-cyan/10"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={selectedCountry === country}
                                onChange={() => setSelectedCountry(country)}
                                className="accent-cyan"
                              />

                              <span className="text-sm text-navy">
                                {country}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-navy/5 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                      setSelectedCountry(null);

                      setCategoryFilterSearch("");
                      setSubCategoryFilterSearch("");
                      setCountrySearch("");

                      setSearchQuery("");

                      setSearchParams(new URLSearchParams());
                    }}
                    className="text-brand-red text-[10px] font-bold uppercase tracking-widest hover:underline"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="bg-navy text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  >
                    Apply Selection
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Info */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10 pb-6 border-b border-navy/10">
          {(selectedCategory || selectedCountry || searchQuery) && (
            <div className="flex gap-2">
              {selectedCategory && (
                <span className="flex items-center gap-2 bg-cyan/10 text-cyan px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  {selectedCategory}
                  <X
                    size={10}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                      setSelectedCountry(null);

                      setCategoryFilterSearch("");
                      setSubCategoryFilterSearch("");
                      setCountrySearch("");

                      setSearchQuery("");

                      setSearchParams(new URLSearchParams());
                    }}
                  />
                </span>
              )}
              {selectedCountry && selectedCountry !== "Global" && (
                <span className="flex items-center gap-2 bg-navy/10 text-navy px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  {selectedCountry}
                  <X
                    size={10}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                      setSelectedCountry(null);

                      setCategoryFilterSearch("");
                      setSubCategoryFilterSearch("");
                      setCountrySearch("");

                      setSearchQuery("");

                      setSearchParams(new URLSearchParams());
                    }}
                  />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid Layout */}
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-navy/5">
            {filteredVendors.map((v) => (
              <VendorCard
                key={v.id}
                id={v.id}
                name={v.name}
                location={v.location}
                country={v.country}
                state={v.state}
                city={v.city}
                mainCategory={v.mainCategory}
                subCategory={v.subCategory}
                image={v.image}
                accreditation={v.accreditation}
                specialty={v.specialty}
                services={v.services}
                rating={v.rating}
                onClick={onSelectVendor}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <Activity className="mx-auto text-brand-red/20 mb-8" size={72} />
            <h3 className="text-4xl font-light text-navy tracking-tight">
              No healthcare partners found.
            </h3>

            <p className="mt-4 text-navy/50 max-w-lg mx-auto">
              Try adjusting your search terms or removing one or more filters to
              explore additional verified healthcare organizations.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
                setSelectedCountry(null);

                setCategoryFilterSearch("");
                setSubCategoryFilterSearch("");
                setCountrySearch("");

                setSearchQuery("");

                setSearchParams(new URLSearchParams());
              }}
              className="mt-10 inline-flex rounded-full bg-brand-red px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition hover:bg-navy"
            >
              Clear filters & search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
