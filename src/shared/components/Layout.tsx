/**
 * Layout – application shell component.
 *
 * Improvements:
 *  - Uses shared constants (DOCTOR_INFO, ROUTES).
 *  - Memoised sub-components (SidebarContent, SidebarItem, NotificationItem).
 *  - Optimized resize handling.
 *  - Wrapped with React.memo.
 */
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Users, 
  Bell, 
  LogOut, 
  Activity,
  Search,
  X,
  CheckCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { auth } from '../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { ROUTES } from '../config/routes';
import { DOCTOR_INFO } from '../config/constants';

const MENU_ITEMS = [
  { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Overview' },
  { path: ROUTES.ANALYTICS, icon: BarChart2, label: 'Analytics' },
  { path: ROUTES.PATIENTS, icon: Users, label: 'My Patients' },
];

const SidebarItem = memo(({ item, active, onClick }: { item: any; active: boolean; onClick: () => void }) => (
  <Link 
    to={item.path} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
      active 
      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
      : 'hover:bg-white/5 hover:text-white'
    }`}
  >
    <item.icon size={18} className={active ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-semibold text-xs whitespace-nowrap">
      {item.label}
    </span>
  </Link>
));
SidebarItem.displayName = 'SidebarItem';

const NotificationItem = memo(({ n, isLast }: { n: any; isLast: boolean }) => (
  <div className={`p-4 hover:bg-[var(--bg-tertiary)] transition-colors flex gap-4 cursor-pointer relative group ${!isLast ? 'border-b border-[var(--border-color)]' : ''}`}>
    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />}
    <div className={`w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0`}>
      <Bell size={18} className="text-sky-500" />
    </div>
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-[var(--text-primary)]">{n.title}</p>
        <span className="text-[10px] text-[var(--text-secondary)] font-medium">{n.time}</span>
      </div>
      <p className="text-[10px] text-[var(--text-secondary)] mt-1 leading-relaxed">{n.message}</p>
    </div>
  </div>
));
NotificationItem.displayName = 'NotificationItem';

const Layout: React.FC = memo(() => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, notifications, markNotificationsAsRead } = useStore();

  useEffect(() => {
    if (notifications.length > 0 && !notifications[0].read) {
      const timer = setTimeout(() => {
        markNotificationsAsRead();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notifications, markNotificationsAsRead]);


  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = useCallback(async () => {
    try { await auth.signOut(); } catch { /* ignore */ }
    setUser(null);
    navigate(ROUTES.LOGIN);
  }, [setUser, navigate]);

  const SidebarContent = useCallback(() => (
    <div className="flex flex-col h-full bg-[#1e293b] text-slate-300">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Activity size={22} color="white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">BrightCare</span>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 ml-1">Clinic</p>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-8 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-sky-500/30 p-1">
             <img 
               src={DOCTOR_INFO.avatar} 
               alt={DOCTOR_INFO.name} 
               className="w-full h-full rounded-full object-cover"
             />
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[#1e293b] rounded-full"></div>
        </div>
        <h3 className="text-white font-bold text-sm">{DOCTOR_INFO.name}</h3>
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">{DOCTOR_INFO.credentials}</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {MENU_ITEMS.map(item => (
          <SidebarItem 
            key={item.path} 
            item={item} 
            active={location.pathname === item.path} 
            onClick={() => setMobileMenuOpen(false)} 
          />
        ))}
      </nav>

      <div className="p-4 space-y-1">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white w-full transition-all group font-semibold text-xs"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  ), [location.pathname, handleLogout]);

  const activePageLabel = useMemo(() => {
    return MENU_ITEMS.find(item => item.path === location.pathname)?.label || 'HealthPulse';
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 80 }}
        className="hidden lg:flex flex-col bg-[#1e293b] z-50 overflow-hidden relative"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#1e293b] shadow-2xl z-[70] flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] z-40 sticky top-0">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              {activePageLabel}
            </h2>
            <div className="relative group hidden md:flex items-center">
              <Search className="absolute left-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Appointment, Patient or etc" 
                className="pl-11 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-[var(--bg-secondary)] w-64 lg:w-96 text-xs transition-all font-medium text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) markNotificationsAsRead();
                }}
                className={`w-10 h-10 flex items-center justify-center bg-[var(--bg-tertiary)] rounded-xl transition-all ${notificationsOpen ? 'text-sky-500' : 'text-slate-500'}`}
              >
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[var(--bg-secondary)]"></span>
                )}
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setNotificationsOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] rounded-2xl shadow-2xl border border-[var(--border-color)] z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">Notifications</h3>
                        <span className="text-[10px] font-bold text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full">
                          {notifications.filter(n => !n.read).length} New
                        </span>
                      </div>
                      <div className="max-h-96 overflow-y-auto no-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((n, idx) => (
                            <NotificationItem key={n.id} n={n} isLast={idx === notifications.length - 1} />
                          ))
                        ) : (
                          <div className="p-12 text-center">
                             <Bell className="mx-auto text-slate-200 mb-4" size={40} />
                             <p className="text-xs text-slate-400 font-bold">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-[var(--bg-tertiary)] text-center">
                        <button 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest hover:text-sky-500 transition-colors"
                        >
                          Close Panel
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth no-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {notifications.length > 0 && !notifications[0].read && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-6 right-6 z-[100] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
          >
            <div className="w-8 h-8 bg-sky-500 rounded-xl flex items-center justify-center">
              <CheckCircle size={18} className="text-white" />
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold tracking-tight">{notifications[0].title}</p>
              <p className="text-[10px] text-white/60 font-medium">{notifications[0].message}</p>
            </div>
            <button 
              onClick={() => markNotificationsAsRead()}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Layout.displayName = 'Layout';
export default Layout;
