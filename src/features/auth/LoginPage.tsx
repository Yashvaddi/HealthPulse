/**
 * LoginPage – Authentication feature module.
 *
 * Improvements:
 *  - Uses shared constants and utilities where applicable.
 *  - Cleaned up form handling and state.
 *  - Memoised feature list.
 *  - Wrapped with React.memo.
 */
import React, { useState, memo } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../shared/services/firebase';
import { Mail, Lock, ArrowRight, Activity, Shield, HeartPulse, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../shared/store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../shared/config/routes';

const FEATURES = [
  { icon: HeartPulse, title: 'Real-time Patient Monitoring', desc: 'Track vital signs and clinical alerts across all departments', color: '#ef4444' },
  { icon: Activity, title: 'Clinical Analytics Dashboard', desc: 'Advanced insights into patient flow and recovery rates', color: '#3b82f6' },
  { icon: Shield, title: 'HIPAA-Compliant Security', desc: 'Enterprise-grade auth powered by Google Firebase', color: '#10b981' },
];

const LoginPage: React.FC = memo(() => {
  const [email, setEmail] = useState('doctor@healthpulse.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { addNotification } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      addNotification({ 
        title: 'Login Successful', 
        message: `Welcome back, ${email}`, 
        type: 'update' 
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      let errorMessage = 'Invalid credentials. Please check your email and password.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'The email or password you entered is incorrect. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f8faff] via-[#eef2ff] to-[#fdf4ff]">
      {/* Left Panel - Branding (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 w-[520px] bg-gradient-to-br from-[#1e3a8a] to-[#3b0764] relative overflow-hidden shrink-0">
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] bg-white/5 rounded-full" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-13 h-13 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center">
            <Activity size={28} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight m-0">HealthPulse</h1>
            <p className="text-white/50 text-xs font-medium m-0 uppercase tracking-widest">Clinical Suite</p>
          </div>
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white leading-tight tracking-tighter mb-6"
          >
            Smarter Health<br />
            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Precision Care
            </span>
          </motion.h2>
          <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-sm">
            Empowering medical professionals with real-time patient data and enterprise-grade clinical tools.
          </p>
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
              >
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm m-0">{title}</p>
                  <p className="text-white/40 text-xs m-0 mt-1 leading-normal">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs m-0 relative z-10">© 2026 HealthPulse. HIPAA Compliant Platform.</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px]"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                <Activity size={24} color="white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">HealthPulse</h1>
                <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] m-0">Healthcare Intelligence</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back 👋</h2>
            <p className="text-slate-500 font-medium">Please enter your credentials to access the command center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3"
                >
                  <Shield size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-rose-600 text-xs font-bold leading-relaxed m-0">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="doctor@healthpulse.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </motion.button>
          </form>

          <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Authorized Medical Personnel Only
          </p>
        </motion.div>
      </div>
    </div>
  );
});

LoginPage.displayName = 'LoginPage';
export default LoginPage;
