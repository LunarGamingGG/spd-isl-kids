import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Home, Calendar, Users, Table, Trophy, ShieldCheck } from 'lucide-react';

const menuItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Fixtures', path: '/fixtures', icon: Calendar },
  { name: 'Teams', path: '/teams', icon: Users },
  { name: 'Table', path: '/points-table', icon: Table },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Rules', path: '/rules', icon: ShieldCheck },
];

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on resize if we move to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="flex items-center justify-end w-full">
      {/* Desktop Menu - Visible only on extra large screens (1280px+) */}
      <div className="hidden xl:flex items-center space-x-1 xl:space-x-4">
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className="relative inline-block group"
          >
            <span className="relative z-10 block uppercase text-slate-400 font-sans font-bold transition-colors duration-300 group-hover:text-slate-950 xl:text-xs py-2 px-4">
              {item.name}
            </span>
            <span className="absolute inset-0 border-t-2 border-b-2 border-white transform scale-y-[2] opacity-0 transition-all duration-300 origin-center group-hover:scale-y-100 group-hover:opacity-100" />
            <span className="absolute top-[2px] left-0 w-full h-[calc(100%-4px)] bg-white transform scale-0 opacity-0 transition-all duration-300 origin-top group-hover:scale-100 group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* Mobile/Tablet Trigger - Visible up to 1279px */}
      <button 
        onClick={() => setIsOpen(true)}
        className="xl:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Side Slide-in Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-md xl:hidden"
            />

            {/* Side Drawer - Full Length/Height */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed top-0 right-0 z-[100] h-full w-full sm:w-[400px] bg-slate-900 border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] xl:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header Area */}
                <div className="flex items-center justify-between p-6 h-20 border-b border-white/5 bg-slate-950/40">
                  <div className="flex flex-col">
                    <span className="text-lg font-black tracking-tighter text-white">
                      SPD ISL <span className="text-emerald-400">KIDS</span>
                    </span>
                    <span className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">Edition 2026</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Close menu"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                {/* Main Navigation - Vertical Scrollable List */}
                <div className="flex-1 overflow-y-auto px-6 py-10">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] px-2">Tournament Hub</p>
                      <ul className="space-y-3">
                        {menuItems.map((item, index) => (
                          <motion.li 
                            key={item.name}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.06 }}
                          >
                            <Link
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 group transition-all duration-300"
                            >
                              <div className="flex items-center gap-5">
                                <div className="p-3 rounded-xl bg-slate-800 border border-white/5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500">
                                  <item.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">
                                  {item.name}
                                </span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Access or Extra Info could go here */}
                    <div className="pt-6 px-2">
                       <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                          <p className="text-xs font-bold text-slate-300 mb-2 italic">"Young Talent, Great Spirit"</p>
                          <div className="w-8 h-1 bg-emerald-500 mx-auto rounded-full" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Area */}
                <div className="p-10 border-t border-white/5 bg-slate-950/80">
                   <div className="flex flex-col items-center gap-3">
                      <p className="text-[10px] font-medium text-slate-500 text-center uppercase tracking-[0.2em]">
                        Sai Purvi Symphony • Bangalore
                      </p>
                      <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
