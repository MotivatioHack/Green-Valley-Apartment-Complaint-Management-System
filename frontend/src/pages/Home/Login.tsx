import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Home, Mail, Lock, Eye, EyeOff, Sun, Moon, Loader2, ArrowLeft } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true); // Start loading animation
    setErrors({}); // Clear old errors

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Store auth data in browser storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);

        console.log("Login successful. Role:", data.user.role);

        // 2. ROLE-BASED DASHBOARD REDIRECTION
        // We use the 'data' directly from the server response for the most accuracy
        const role = data.user.role.toUpperCase(); // Ensure case-insensitive check

        if (role === 'ADMIN') {
          navigate('/admin/dashboard'); 
        } else {
          navigate('/user/dashboard');
        }
      } else {
        // Display the error message from the backend (e.g., "Invalid credentials")
        setErrors({ auth: data.message || "Login failed. Please check your credentials." });
      }
    } catch (err) {
      console.error("Connection error:", err);
      setErrors({ auth: "Network error. Please ensure the backend server is running on port 5000." });
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.auth) {
      setErrors((prev) => ({ ...prev, [name]: "", auth: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col transition-colors duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-lg hover:bg-background/50 transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-background/50 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg transition-transform group-hover:scale-105">
              <Building2 className="w-6 h-6 text-primary-foreground" />
              <Home className="w-4 h-4 text-primary-foreground -ml-1" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-foreground">Green Valley</span>
              <span className="block text-xs text-muted-foreground -mt-0.5">Residential Society</span>
            </div>
          </Link>

          <div className="bg-card border border-border rounded-xl p-8 shadow-card">
            <h1 className="font-heading text-2xl font-bold text-foreground text-center mb-2">Resident Login</h1>
            <p className="text-muted-foreground text-center text-sm mb-8">Access your resident portal</p>

            {errors.auth && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center animate-in fade-in duration-300">
                {errors.auth}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    disabled={isLoading}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`form-input pl-10 ${errors.email ? "border-destructive" : ""} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    disabled={isLoading}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`form-input pl-10 pr-10 ${errors.password ? "border-destructive" : ""} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  
                 
                </label>
                <a href="#" className="text-primary hover:underline font-medium"></a>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full flex items-center justify-center gap-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              New resident? <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link>
            </p>
          </div>

          <p className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
