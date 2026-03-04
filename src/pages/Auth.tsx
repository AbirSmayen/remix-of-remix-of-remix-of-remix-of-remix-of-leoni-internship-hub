import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import signInBg from "@/assets/auth-signin-bg.png";
import signUpBg from "@/assets/auth-signup-bg.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const stored = sessionStorage.getItem("leoni_user");
      if (stored) {
        const user = JSON.parse(stored);
        const routes: Record<string, string> = { rh: "/dashboard/rh", encadrant: "/dashboard/encadrant", director: "/dashboard/director/voting", admin: "/dashboard/admin" };
        navigate(routes[user.role] || "/dashboard/rh");
      }
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-leoni-dark via-leoni-navy to-leoni-dark" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-4xl font-bold text-white mb-8 tracking-[0.3em]">LEONI</motion.h1>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-5xl mx-4 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex min-h-[560px]">
          <div className="hidden lg:block w-1/2 relative">
            <img src={isLogin ? signInBg : signUpBg} alt="LEONI Corporate" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-leoni-dark/80 via-leoni-dark/60 to-leoni-dark/90" />
            <div className="relative z-10 flex flex-col justify-center h-full px-12">
              <AnimatePresence mode="wait">
                <motion.div key={isLogin ? "welcome" : "join"} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4 }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs text-white/70 mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-leoni-cyan animate-pulse" />
                    {isLogin ? t("auth.secureLogin") : t("auth.accountRegistration")}
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                    {isLogin ? (<>{t("auth.welcomeBack")}<br /><span className="text-leoni-cyan">{t("auth.back")}</span></>) : (<>{t("auth.join")}<br /><span className="text-leoni-cyan">LEONI</span></>)}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                    {isLogin ? t("auth.loginDesc") : t("auth.signupDesc")}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-leoni-card-dark/80 backdrop-blur-xl p-10 flex flex-col justify-center border-l border-white/5">
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? "login" : "signup"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold text-white text-center mb-1">{isLogin ? t("auth.signIn") : t("auth.createAccount")}</h2>
                <p className="text-center text-white/40 text-sm mb-8">{isLogin ? t("auth.enterCredentials") : t("auth.acceptedOnly")}</p>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </motion.div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="grid grid-cols-2 gap-3">
                      <GlassInput icon={User} placeholder={t("auth.firstName")} />
                      <GlassInput icon={User} placeholder={t("auth.lastName")} />
                    </div>
                  )}
                  <GlassInput icon={Mail} placeholder={t("auth.email")} type="email" value={email} onChange={setEmail} />
                  {!isLogin && <GlassInput icon={Phone} placeholder={t("auth.phone")} type="tel" />}
                  <GlassInput icon={Lock} placeholder={t("auth.password")} type={showPassword ? "text" : "password"} value={password} onChange={setPassword}
                    suffix={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/30 hover:text-white/60 transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                  />
                  {!isLogin && <GlassInput icon={Lock} placeholder={t("auth.confirmPassword")} type="password" />}
                  {isLogin && (<div className="flex justify-end"><button type="button" className="text-leoni-cyan text-xs hover:underline">{t("auth.forgotPassword")}</button></div>)}

                  <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-leoni-cyan text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (<>{isLogin ? t("auth.signIn") : t("auth.createAccount")}<ArrowRight className="h-4 w-4" /></>)}
                  </button>

                  {isLogin && (
                    <button type="button" className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-sm">
                      <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      {t("auth.loginGoogle")}
                    </button>
                  )}
                </form>

                <p className="text-center text-white/40 text-sm mt-6">
                  {isLogin ? t("auth.noAccount") + " " : t("auth.haveAccount") + " "}
                  <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-leoni-cyan hover:underline font-medium">
                    {isLogin ? t("auth.signUp") : t("auth.signIn")}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="relative z-10 text-white/20 text-xs mt-8 tracking-wider">{t("auth.platformBranding")}</motion.p>
    </div>
  );
};

interface GlassInputProps { icon: React.ElementType; placeholder: string; type?: string; value?: string; onChange?: (val: string) => void; suffix?: React.ReactNode; }
const GlassInput = ({ icon: Icon, placeholder, type = "text", value, onChange, suffix }: GlassInputProps) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icon className="h-4 w-4 text-white/20 group-focus-within:text-leoni-cyan transition-colors" /></div>
    <input type={type} placeholder={placeholder} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:border-leoni-cyan/50 focus:bg-white/[0.07] transition-all text-sm" />
    {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
  </div>
);

export default Auth;
