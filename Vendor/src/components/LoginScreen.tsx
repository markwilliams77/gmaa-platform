import { useState } from "react";
import { authService } from "../services/authService";

interface Props {
  onLogin: (vendor: any) => void;
}

export default function LoginScreen({
  onLogin,
}: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await authService.login(
          username,
          password
        );

      localStorage.setItem(
        "vendorToken",
        response.token
      );

      localStorage.setItem(
        "vendorData",
        JSON.stringify(response.vendor)
      );

      onLogin(response.vendor);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 p-8">
        <h1 className="text-white text-2xl font-bold mb-6">
          Vendor Login
        </h1>

        <input
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Username"
          className="w-full mb-4 rounded-xl p-3"
        />

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Password"
          className="w-full mb-4 rounded-xl p-3"
        />

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-cyan-500 py-3 font-bold"
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>
      </div>
    </div>
  );
}