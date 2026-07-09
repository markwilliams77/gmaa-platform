import { useState } from "react";
import { authService } from "../services/authService";

interface Props {
  onLogin: (vendor: any) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authService.login(username, password);

      localStorage.setItem("vendorToken", response.token);
      localStorage.setItem("vendorData", JSON.stringify(response.vendor));

      onLogin(response.vendor);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#060b16] text-white font-sans antialiased">
      
      {/* LEFT PANEL: Branding & Global Network Visual */}
      <div 
        className="hidden lg:flex flex-col justify-between p-16 relative bg-cover bg-center"
        style={{ 
          // Using a high-quality abstract medical network visual matching the "Global" globe in the logo
          backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')` 
        }}
      >
        {/* Dark navy overlay to match brand colors and preserve text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060b16]/90 via-[#060b16]/70 to-[#060b16]" />

        {/* Company Logo Display */}
        <div className="relative z-10 flex flex-col items-start">
          <img 
            src="/gmaa-logo.png" // Replace with your actual local path to the GMAA logo file
            alt="GMAA Logo" 
            className="h-16 w-auto object-contain bg-white/10 backdrop-blur-sm p-2 rounded-lg"
            onError={(e) => {
              // Fallback text if the image is not yet placed in the assets folder
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'text-xl font-bold tracking-wider text-blue-400';
                fallback.innerText = 'GMAA';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>

        {/* Brand Core Message */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-light tracking-wide mb-4 leading-tight">
            Global Med Access <br />
            <span className="font-semibold text-blue-400">Alliance Pvt. Ltd.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Connecting medical networks, vendors, and global healthcare access points. Log in to manage your active alliances, verify credentials, and streamline service coordination.
          </p>

          {/* Clean Medical / Tech Graphic Element */}
          <div className="border-t border-white/10 pt-4 flex items-center space-x-2 text-white/40 text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#D91B24] animate-pulse" />
            <span>Secure Vendor Network Access</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Vendor Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-20 bg-[#060b16] relative">
        <div className="w-full max-w-md">
          
          <div className="mb-12">
            <h1 className="text-white text-4xl font-light tracking-wide">
              Vendor Sign In
            </h1>
            <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">
              Global Med Access Alliance Portal
            </p>
          </div>

          <div className="space-y-8">
            {/* Username/Email Input */}
            <div className="relative border-b border-white/20 focus-within:border-[#D91B24] transition-colors duration-300 py-1">
              <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">
                Username / Registered Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="name@globalmedaccess.com"
                className="w-full bg-transparent text-white placeholder-white/20 text-sm py-1 focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="relative border-b border-white/20 focus-within:border-[#D91B24] transition-colors duration-300 py-1">
              <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-transparent text-white placeholder-white/20 text-sm py-1 focus:outline-none tracking-widest"
              />
            </div>
          </div>

          {/* Display Error Message */}
          {error && (
            <p className="text-rose-500 text-xs mt-6 transition-all">
              {error}
            </p>
          )}

          {/* Actions: Submit Button & Auxiliary Link */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-[#D91B24] hover:bg-[#b8121a] disabled:bg-[#D91B24]/40 text-white text-sm font-semibold tracking-wide py-3 px-8 rounded-sm flex items-center space-x-3 transition-all active:scale-[0.98]"
            >
              <span>{loading ? "Verifying..." : "Sign in"}</span>
              {!loading && (
                // Pulse Line Arrow Icon
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>

            <button 
              type="button"
              className="text-white/40 hover:text-white text-xs underline underline-offset-4 transition-colors"
            >
              Need portal assistance?
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}