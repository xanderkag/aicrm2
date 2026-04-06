'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    // Break redirect loop: only redirect if authenticated and NO error is present
    if (status === 'authenticated' && !error) {
      router.push('/');
    }
  }, [status, router, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    if (isSignUp) {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        
        if (res.ok) {
          // Auto login after signup
          const result = await signIn('credentials', { 
            email, 
            password, 
            redirect: false,
            callbackUrl: '/' 
          });
          if (result?.error) {
             setLocalError('Ошибка входа после регистрации');
          } else {
             router.push('/');
          }
        } else {
          setLocalError(data.error || 'Ошибка регистрации');
        }
      } catch (err) {
        setLocalError('Ошибка сети. Попробуйте позже.');
      }
    } else {
      const res = await signIn('credentials', { 
        email, 
        password, 
        redirect: false,
        callbackUrl: '/' 
      });
      if (res?.error) {
        setLocalError('Неверный email или пароль');
      } else if (res?.ok) {
        router.push('/');
      }
    }
    setLoading(false);
  };

  const errorMessages: Record<string, string> = {
    'OAuthCallback': 'Ошибка при обмене данными с Google. Проверьте настройки на сервере.',
    'AccessDenied': 'Доступ запрещен: ваш аккаунт не авторизован.',
    'Configuration': 'Ошибка конфигурации авторизации на сервере.',
    'Default': 'Произошла ошибка при входе. Попробуйте снова.'
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 chat-pattern relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-accent rounded-[22px] flex items-center justify-center shadow-lg shadow-accent/20 mb-6 group cursor-default"
          >
            <Zap size={32} className="text-white group-hover:scale-110 transition-transform" />
          </motion.div>
          <h1 className="text-[32px] font-black tracking-tight text-white mb-2">AI-CRM 2.0</h1>
          <p className="text-[14px] font-medium text-white/30 uppercase tracking-[0.3em]">
            {isSignUp ? 'Create Workspace Account' : 'Access Management'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 rounded-[32px] border border-white/5 bg-secondary/40 backdrop-blur-3xl shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[32px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex bg-white/5 p-1 rounded-2xl mb-2">
              <button 
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all ${!isSignUp ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all ${isSignUp ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-[11px] font-black uppercase tracking-widest text-white/20 ml-1">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Alexander Liapustin"
                        className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-[14px] focus:outline-none focus:border-accent/40 focus:bg-white/[0.07] transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isSignUp}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/20 ml-1">Work Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-[14px] focus:outline-none focus:border-accent/40 focus:bg-white/[0.07] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/20 ml-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-[14px] focus:outline-none focus:border-accent/40 focus:bg-white/[0.07] transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Error messages */}
              {(error || localError) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] font-medium flex items-start gap-3"
                >
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                  <p>{localError || errorMessages[error!] || errorMessages.Default}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-accent text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-[15px] hover:bg-accent/90 active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>
                    <span>{isSignUp ? 'Create Workspace' : 'Continue into CRM'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]"><span className="bg-secondary/40 px-3 text-white/10 backdrop-blur-3xl">Alternative access</span></div>
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-bold text-[15px] hover:bg-white/90 active:scale-[0.98] transition-all group overflow-hidden relative shadow-xl shadow-white/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Instant Login with Google</span>
            </button>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-[12px] text-white/20 font-medium font-inter"
        >
          Secured by Antigravity CRM Infrastructure
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
