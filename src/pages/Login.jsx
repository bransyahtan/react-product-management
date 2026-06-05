import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { loginUser, clearError } from "@/store/auth";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Username dan password wajib diisi",
        confirmButtonColor: "#18181b",
      });
      return;
    }

    dispatch(loginUser({ username, password })).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        navigate("/dashboard");
      } else if (loginUser.rejected.match(result)) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: result.payload || "Username atau password salah",
          confirmButtonColor: "#18181b",
        });
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign In
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400 dark:text-zinc-500">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="pl-9"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                htmlFor="password"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400 dark:text-zinc-500">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-9 pr-9"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};
