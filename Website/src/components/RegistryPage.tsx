import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Activity,
  SlidersHorizontal,
  X,
} from "lucide-react";
import VendorCard from "./VendorCard";
import type { RegistryVendor } from "../types/registry";
import { VENDOR_CATEGORIES } from "../constants/vendorCategories";
import { Country } from "country-state-city";
import { getRegistryVendors } from "../services/registry";

interface RegistryPageProps {
  onSelectVendor?: (id: string) => void;
}

export default function RegistryPage({ onSelectVendor }: RegistryPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") ?? "",
  );
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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const urlSearch = searchParams.get("search") ?? "";

  if (urlSearch !== searchQuery) {
    setSearchQuery(urlSearch);
    return;
  }

  useEffect(() => {
    setLoading(true);

    getRegistryVendors({
      page,
      limit: 8,
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      country: selectedCountry || undefined,
    })
      .then(({ data, pagination }) => {
        setVendors(data);
        setTotalPages(pagination.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, searchQuery, selectedCategory, selectedCountry]);

  const setSelectedCategory = (category: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category) {
      nextParams.set("category", category);
    } else {
      nextParams.delete("category");
    }
    setPage(1);
    setSearchParams(nextParams);
  };

  const setSelectedCountry = (country: string | null) => {
    const nextParams = new URLSearchParams(searchParams);

    if (country) {
      nextParams.set("country", country);
    } else {
      nextParams.delete("country");
    }
    setPage(1);
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-24 bg-white relative overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-1 bg-brand-red rounded-full" />
            <span className="text-navy font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[8px] md:text-[10px]">
              VERIFIED GLOBAL DIRECTORY
            </span>
          </div>
          <h1 className="text-[clamp(1.85rem,5.5vw,4.5rem)] md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.1] md:leading-[0.9] text-navy mb-4 sm:mb-6">
            Global Healthcare{" "}
            <span className="font-serif italic text-gradient font-medium pr-2 block sm:inline">
              Directory.
            </span>
          </h1>
          <p className="text-navy/40 max-w-xl text-base sm:text-lg leading-relaxed">
            Browse GMAA verified healthcare providers across hospitals,
            laboratories, pharmacies, medical equipment suppliers, home
            healthcare, rehabilitation, medical tourism facilitators and other
            healthcare organizations worldwide.
          </p>
        </div>

        {/* Filter/Search Bar */}
        <div className="sticky top-20 sm:top-24 z-30 mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="relative flex-grow group">
              <Search
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-navy/25 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by organization, specialty..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;

                  setSearchQuery(value);
                  setPage(1);

                  const nextParams = new URLSearchParams(searchParams);

                  if (value.trim()) {
                    nextParams.set("search", value);
                  } else {
                    nextParams.delete("search");
                  }

                  setSearchParams(nextParams);
                }}
                className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 sm:py-5 md:py-6 bg-white border border-navy/10 rounded-2xl md:rounded-3xl outline-none text-navy font-medium shadow-lg shadow-slate-200/40 transition-all focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-2xl md:rounded-3xl border flex items-center justify-center gap-3 font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 shrink-0 ${
                showFilters
                  ? "bg-brand-red text-white border-brand-red shadow-brand-red/20"
                  : "bg-white text-navy border-navy/10 hover:border-brand-red hover:text-brand-red"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {(selectedCategory || selectedCountry) && (
                <span className="w-4 h-4 rounded-full bg-brand-red text-white flex items-center justify-center text-[8px] font-bold">
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
                className="absolute top-full left-0 right-0 mt-4 p-5 sm:p-8 bg-white border border-navy/5 rounded-[24px] sm:rounded-[40px] shadow-2xl shadow-navy/10 z-50 overflow-y-auto max-h-[60vh] lg:max-h-none"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* ========================= MAIN CATEGORY ========================= */}
                  <div>
                    <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-navy/30 mb-4 sm:mb-6">
                      Main Category
                    </h4>

                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30"
                      />

                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categoryFilterSearch}
                        onChange={(e) =>
                          setCategoryFilterSearch(e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm outline-none focus:border-cyan text-navy"
                      />
                    </div>

                    <div className="mt-4 max-h-52 sm:max-h-64 overflow-y-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white">
                      <div className="divide-y divide-slate-100">
                        <label
                          className={`flex items-center gap-3 px-4 py-2.5 sm:py-3 cursor-pointer transition ${
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

                          <span className="text-xs sm:text-sm text-navy">
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
                              className={`flex items-center gap-3 px-4 py-2.5 sm:py-3 cursor-pointer transition ${
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

                              <span className="text-xs sm:text-sm text-navy">{c}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* ========================= SUB CATEGORY ========================= */}
                  <div>
                    <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-navy/30 mb-4 sm:mb-6">
                      Sub Category
                    </h4>

                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30"
                      />

                      <input
                        type="text"
                        placeholder="Search sub categories..."
                        value={subCategoryFilterSearch}
                        onChange={(e) =>
                          setSubCategoryFilterSearch(e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm outline-none focus:border-cyan text-navy"
                        disabled={!selectedCategory}
                      />
                    </div>

                    <div className="mt-4 max-h-52 sm:max-h-64 overflow-y-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white">
                      {!selectedCategory ? (
                        <div className="h-44 sm:h-64 flex items-center justify-center px-4 sm:px-6 text-center text-xs sm:text-sm text-navy/40">
                          Select a Main Category to view its Sub Categories.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          <label
                            className={`flex items-center gap-3 px-4 py-2.5 sm:py-3 cursor-pointer transition ${
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

                            <span className="text-xs sm:text-sm text-navy">
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
                                className={`flex items-center gap-3 px-4 py-2.5 sm:py-3 cursor-pointer transition ${
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

                                <span className="text-xs sm:text-sm text-navy">{sub}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ========================= COUNTRY ========================= */}
                  <div>
                    <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-navy/30 mb-4 sm:mb-6">
                      Country
                    </h4>

                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30"
                      />

                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm outline-none focus:border-cyan text-navy"
                      />
                    </div>

                    <div className="mt-4 max-h-52 sm:max-h-64 overflow-y-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white">
                      <div className="divide-y divide-slate-100">
                        <label
                          className={`flex items-center gap-3 px-4 py-2.5 sm:py-3 cursor-pointer transition ${
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

                          <span className="text-xs sm:text-sm text-navy">
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
                              className={`flex items-center gap-3 px-4 py-2.5 sm:py-3 cursor-pointer transition ${
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

                              <span className="text-xs sm:text-sm text-navy">
                                {country}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 sm:mt-12 pt-4 sm:pt-8 border-t border-navy/5 flex justify-between items-center">
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
                      setPage(1);
                    }}
                    className="text-brand-red text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:underline"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="bg-navy text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Apply Selection
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Info */}
        {(selectedCategory || selectedCountry || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 pb-4 border-b border-navy/10">
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
                    setPage(1);
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
                    setPage(1);
                  }}
                />
              </span>
            )}
          </div>
        )}

        {/* Grid Layout */}
        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-navy/5">
            {vendors.map((v) => (
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
          <div className="py-24 sm:py-40 text-center">
            <Activity className="mx-auto text-brand-red/20 mb-6 sm:mb-8 shrink-0" size={56} />
            <h3 className="text-2xl sm:text-4xl font-light text-navy tracking-tight px-4">
              No healthcare partners found.
            </h3>

            <p className="mt-4 text-xs sm:text-sm md:text-base text-navy/50 max-w-lg mx-auto px-4 leading-relaxed">
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
                setPage(1);
              }}
              className="mt-8 sm:mt-10 inline-flex rounded-full bg-brand-red px-6 sm:px-8 py-3.5 sm:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white transition hover:bg-navy shadow-lg active:scale-95"
            >
              Clear filters & search
            </button>
          </div>
        )}

        {/* ========================= PAGINATION ========================= */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 text-navy"
              >
                Previous
              </button>

              {/* Desktop Page Numbers */}
              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
                        page === pageNumber
                          ? "bg-navy text-white shadow-md shadow-navy/20"
                          : "border border-slate-200 hover:bg-slate-100 text-navy"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ),
                )}
              </div>

              {/* Mobile Page indicator */}
              <span className="sm:hidden text-xs font-semibold uppercase tracking-widest text-navy/55 px-2">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 text-navy"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}