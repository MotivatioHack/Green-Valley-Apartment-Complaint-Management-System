import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Home, Mail, Lock, Eye, EyeOff, User, Hash, Phone, MapPin, Sun, Moon, ArrowLeft } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    towerNumber: "",
    flatNumber: "",
    block: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Basic Validation Logic
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.towerNumber.trim()) newErrors.towerNumber = "Tower required";
    if (!formData.flatNumber.trim()) newErrors.flatNumber = "Flat required";
    if (!formData.block.trim()) newErrors.block = "Block required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone required";
    } else if (!/^\d{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Min 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Dynamic API Integration
        const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            tower_number: formData.towerNumber,
            flat_number: formData.flatNumber,
            block: formData.block,
            role: 'USER', 
            status: 'active' 
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful! You can now login.");
          navigate('/login');
        } else {
          setErrors({ server: data.message || "Registration failed" });
        }
      } catch (err) {
        setErrors({ server: "Server connection failed." });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.server) {
      setErrors((prev) => ({ ...prev, [name]: "", server: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-lg hover:bg-background/50 transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-background/50 transition-colors z-10"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Building2 className="w-5 h-5 text-primary-foreground" />
              <Home className="w-3 h-3 text-primary-foreground -ml-1" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-foreground">Green Valley</span>
              <span className="block text-[10px] text-muted-foreground -mt-1">Residential Society</span>
            </div>
          </Link>

          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <h1 className="font-heading text-xl font-bold text-foreground text-center mb-1">Resident Registration</h1>
            <p className="text-muted-foreground text-center text-xs mb-6">Create your resident account</p>

            {errors.server && (
              <div className="mb-4 p-2 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg text-center font-medium">
                {errors.server}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Row 1: Full Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-foreground mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={`form-input pl-9 h-9 text-sm ${errors.name ? "border-destructive" : ""}`} />
                </div>
                {errors.name && <p className="mt-0.5 text-[10px] text-destructive">{errors.name}</p>}
              </div>

              {/* Row 2: Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`form-input pl-9 h-9 text-sm ${errors.email ? "border-destructive" : ""}`} />
                  </div>
                  {errors.email && <p className="mt-0.5 text-[10px] text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact No" className={`form-input pl-9 h-9 text-sm ${errors.phone ? "border-destructive" : ""}`} />
                  </div>
                  {errors.phone && <p className="mt-0.5 text-[10px] text-destructive">{errors.phone}</p>}
                </div>
              </div>

              {/* Row 3: Tower, Block, and Flat Numbers */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="towerNumber" className="block text-xs font-medium text-foreground mb-1">Tower</label>
                  <div className="relative">
                    <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input type="text" id="towerNumber" name="towerNumber" value={formData.towerNumber} onChange={handleChange} placeholder="T1" className={`form-input pl-8 h-9 text-sm ${errors.towerNumber ? "border-destructive" : ""}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="block" className="block text-xs font-medium text-foreground mb-1">Block</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input type="text" id="block" name="block" value={formData.block} onChange={handleChange} placeholder="B" className={`form-input pl-8 h-9 text-sm ${errors.block ? "border-destructive" : ""}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="flatNumber" className="block text-xs font-medium text-foreground mb-1">Flat</label>
                  <div className="relative">
                    <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input type="text" id="flatNumber" name="flatNumber" value={formData.flatNumber} onChange={handleChange} placeholder="101" className={`form-input pl-8 h-9 text-sm ${errors.flatNumber ? "border-destructive" : ""}`} />
                  </div>
                </div>
              </div>

              {/* Row 4: Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={`form-input pl-9 pr-8 h-9 text-sm ${errors.password ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-foreground mb-1">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm" className={`form-input pl-9 pr-8 h-9 text-sm ${errors.confirmPassword ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-destructive">{errors.confirmPassword}</p>}

              <button type="submit" className="btn-primary w-full h-10 text-sm mt-4 font-bold">Create Account</button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Already registered? <Link to="/login" className="text-primary hover:underline font-medium">Sign in here</Link>
            </p>
          </div>

          <p className="text-center mt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;