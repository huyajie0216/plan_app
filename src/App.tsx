/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Apple, 
  Smartphone, 
  Lock, 
  ArrowRight, 
  ChevronLeft, 
  Bell, 
  Utensils, 
  Scale, 
  Pill, 
  Plus, 
  Minus,
  Droplets, 
  Check, 
  Home, 
  ClipboardList, 
  BarChart2, 
  User, 
  LogOut, 
  ChevronRight, 
  Eye, 
  EyeOff,
  Search,
  Settings,
  HelpCircle,
  Link2,
  Zap,
  Leaf,
  Shield,
  Lightbulb,
  Moon,
  Sun,
  Trash2,
  Palette,
  X,
  Camera,
  Calendar,
  MessageSquare,
  Headphones,
  BookOpen,
  History,
  UserMinus,
  Mail,
  Phone,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './api';

// --- Types ---

type Page = 'login' | 'register' | 'dashboard' | 'plan' | 'nutrition' | 'nutrient-detail' | 'profile' | 'personal-profile' | 'goal-setting' | 'account-management' | 'help-feedback';

interface CustomTracker {
  id: number;
  type: string;
  title: string;
  value: number;
  target: number;
  unit: string;
}

interface Theme {
  name: string;
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  bg: string;
  accent: string;
}

const themes: Theme[] = [
  {
    name: '活力绿',
    primary: '#006d42',
    primaryContainer: '#6ad298',
    onPrimaryContainer: '#005935',
    bg: '#f5fbf4',
    accent: '#176a21'
  },
  {
    name: '天空蓝',
    primary: '#0061a4',
    primaryContainer: '#d1e4ff',
    onPrimaryContainer: '#001d36',
    bg: '#fdfbff',
    accent: '#004a7d'
  },
  {
    name: '活力橙',
    primary: '#914d00',
    primaryContainer: '#ffdbbe',
    onPrimaryContainer: '#2f1500',
    bg: '#fffbff',
    accent: '#753c00'
  },
  {
    name: '优雅紫',
    primary: '#744da4',
    primaryContainer: '#f0dbff',
    onPrimaryContainer: '#2c0051',
    bg: '#fffbff',
    accent: '#5c358b'
  }
];

// --- Components ---

const Toast = ({ 
  message, 
  isVisible, 
  onClose 
}: { 
  message: string; 
  isVisible: boolean; 
  onClose: () => void; 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[110] bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[200px]"
        >
          <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
            <Check size={14} />
          </div>
          <span className="font-bold text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-950 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full sm:hidden" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[var(--primary)]">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Plus className="rotate-45 text-gray-400" size={24} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  fullWidth = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}) => {
  const baseStyles = "flex items-center justify-center font-bold transition-all active:scale-[0.98] rounded-full py-4 px-6";
  const variants = {
    primary: "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 hover:opacity-90",
    secondary: "bg-[var(--primary-container)] text-[var(--on-primary-container)] hover:opacity-90",
    outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
    ghost: "text-[var(--primary)] hover:bg-[var(--primary)]/10"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  placeholder, 
  type = 'text', 
  icon: Icon,
  rightElement,
  prefix,
  value,
  onChange
}: { 
  label?: string; 
  placeholder?: string; 
  type?: string; 
  icon?: any;
  rightElement?: React.ReactNode;
  prefix?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="relative group w-full">
      {label && (
        <label className="absolute -top-3 left-6 bg-[var(--bg)] px-2 text-xs font-bold text-[var(--primary)] uppercase tracking-widest z-10">
          {label}
        </label>
      )}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 group-focus-within:ring-2 ring-[var(--primary)]/20 transition-all">
        {prefix && (
          <div className="pl-4 pr-2 flex items-center border-r border-gray-300 dark:border-gray-700 text-gray-600 font-semibold">
            {prefix}
          </div>
        )}
        {Icon && (
          <div className="pl-4 pr-2 flex items-center border-r border-gray-300 dark:border-gray-700 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input 
          className="w-full bg-transparent border-none focus:ring-0 py-4 px-4 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 font-medium" 
          placeholder={placeholder} 
          type={type} 
          value={value}
          onChange={onChange}
        />
        {rightElement && (
          <div className="pr-4">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Pages ---

const LoginPage = ({ onLogin, onNavigate }: { onLogin: (user: any, token: string) => void; onNavigate: (p: Page) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const { user, session } = await api.auth.login({ email, password });
      onLogin(user, session.access_token);
      onNavigate('dashboard');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-between min-h-screen p-8"
    >
      <main className="w-full max-w-md flex flex-col items-center mt-8">
        <div className="relative w-32 h-32 mb-8 group">
          <div className="absolute inset-0 bg-[var(--primary-container)] rounded-3xl rotate-6 group-hover:rotate-12 transition-transform opacity-40"></div>
          <div className="absolute inset-0 bg-[var(--primary)] rounded-3xl -rotate-3 group-hover:-rotate-6 transition-transform flex items-center justify-center">
            <Leaf className="text-white" size={64} fill="currentColor" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-extrabold italic text-4xl text-[var(--primary)] tracking-tight mb-2">活力清爽</h1>
          <p className="text-gray-500 font-medium text-lg">开启您的健康之旅</p>
        </div>

        <div className="w-full space-y-6">
          <Input 
            label="邮箱" 
            placeholder="请输入邮箱" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="space-y-2">
            <Input 
              label="密码" 
              placeholder="请输入密码" 
              type="password" 
              icon={Lock} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="text-xs font-bold text-[var(--primary)] hover:underline">忘记密码？</button>
            </div>
          </div>

          <Button fullWidth onClick={handleLogin}>
            {isLoading ? '登录中...' : '登录'}
          </Button>

          <div className="flex items-center gap-4 py-4">
            <div className="h-[1px] flex-1 bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">或通过以下方式继续</span>
            <div className="h-[1px] flex-1 bg-gray-200"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-semibold py-5 rounded-full border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all hover:bg-gray-50">
            <svg className="text-[#07C160]" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
              <path d="M19.1 11.2C19.1 7.1 15.6 3.8 11.3 3.8C6.9 3.8 3.5 7.1 3.5 11.2C3.5 14.8 6.4 17.8 10.1 18.5C10.3 18.5 10.5 18.6 10.5 18.8L10.2 20C10.1 20.3 10.3 20.5 10.5 20.4L13 18.9C13.2 18.8 13.3 18.8 13.5 18.8C17 18.2 19.1 14.9 19.1 11.2ZM8.6 10.1C8.2 10.1 7.8 9.8 7.8 9.3C7.8 8.9 8.2 8.5 8.6 8.5C9.1 8.5 9.5 8.9 9.5 9.3C9.5 9.8 9.1 10.1 8.6 10.1ZM14 10.1C13.6 10.1 13.2 9.8 13.2 9.3C13.2 8.9 13.6 8.5 14 8.5C14.5 8.5 14.8 8.9 14.8 9.3C14.8 9.8 14.5 10.1 14 10.1Z"></path>
            </svg>
            <span>微信</span>
          </button>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center gap-8 mb-4">
        <div className="text-center w-full max-w-sm">
          <p className="text-gray-500 text-sm font-medium mb-4 italic">还没有账号？</p>
          <Button variant="outline" fullWidth onClick={() => onNavigate('register')}>立即注册</Button>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl opacity-40">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent z-10"></div>
          <img 
            alt="Healthy food bowl" 
            className="w-full h-full object-cover grayscale brightness-110" 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
            referrerPolicy="no-referrer"
          />
        </div>
      </footer>
    </motion.div>
  );
};

const RegisterPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || password !== confirmPassword) return;
    setIsLoading(true);
    try {
      await api.auth.register({ email, password });
      alert('注册成功，请登录');
      onNavigate('login');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen"
    >
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
        <button onClick={() => onNavigate('login')} className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/5 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-[var(--primary)]">创建账号</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow pt-24 pb-12 px-6 max-w-md mx-auto w-full">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary-container)]/20 mb-6">
            <User className="text-[var(--primary)]" size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-800 dark:text-gray-100 mb-2">创建账号</h2>
          <p className="text-gray-500 font-medium">开启健康之旅</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="邮箱" 
            placeholder="请输入邮箱" 
            icon={Mail} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="设置密码" 
            placeholder="请输入密码" 
            type="password" 
            icon={Lock} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={<Eye size={20} className="text-gray-400" />} 
          />
          <Input 
            label="确认密码" 
            placeholder="请再次输入密码" 
            type="password" 
            icon={Lock} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rightElement={<EyeOff size={20} className="text-gray-400" />} 
          />

          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" id="privacy" className="mt-1 w-5 h-5 rounded-md border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
            <label htmlFor="privacy" className="text-xs leading-relaxed text-gray-500">
              我已阅读并同意 <span className="text-[var(--primary)] font-bold underline underline-offset-2">《隐私政策》</span> 和 <span className="text-[var(--primary)] font-bold underline underline-offset-2">《用户服务协议》</span>
            </label>
          </div>

          <Button fullWidth onClick={handleRegister} className="mt-4 flex items-center gap-2">
            <span>{isLoading ? '注册中...' : '立即注册'}</span>
            <ArrowRight size={20} />
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500">
            已有账号？ <button onClick={() => onNavigate('login')} className="text-[var(--primary)] font-bold ml-1 hover:underline">立即登录</button>
          </p>
        </div>
      </main>
    </motion.div>
  );
};

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const DashboardPage = ({ 
  onNavigate, 
  onLogAction,
  waterIntake,
  onAddWater,
  profile,
  goals,
  foodLogs,
  customTrackers,
  greeting,
  joinDays,
  onDeleteFoodLog
}: { 
  onNavigate: (p: Page) => void;
  onLogAction: (type: string) => void;
  waterIntake: number;
  onAddWater: (amount: number) => void;
  profile: any;
  goals: any;
  foodLogs: any[];
  customTrackers: CustomTracker[];
  greeting: string;
  joinDays: number;
  onDeleteFoodLog: (id: number) => void;
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayFood = foodLogs.filter(log => log.date === today);
  
  const currentCalories = todayFood.reduce((sum, log) => sum + (Number(log.calories) || 0), 0);
  const currentProtein = todayFood.reduce((sum, log) => sum + (Number(log.protein) || 0), 0);
  const currentCarbs = todayFood.reduce((sum, log) => sum + (Number(log.carbs) || 0), 0);
  const currentFat = todayFood.reduce((sum, log) => sum + (Number(log.fat) || 0), 0);

  const calorieTarget = goals?.calorie_target || 2000;
  const waterTarget = goals?.water_target_ml || 2000;
  const exerciseTarget = goals?.exercise_target_kcal || 500;
  
  const proteinTarget = Math.round(calorieTarget * (goals?.protein_pct || 30) / 100 / 4);
  const carbTarget = Math.round(calorieTarget * (goals?.carb_pct || 45) / 100 / 4);
  const fatTarget = Math.round(calorieTarget * (goals?.fat_pct || 25) / 100 / 9);

  const macroData = [
    { name: '蛋白质', value: currentProtein, total: proteinTarget, color: 'var(--primary)' },
    { name: '碳水', value: currentCarbs, total: carbTarget, color: '#60a5fa' },
    { name: '脂肪', value: currentFat, total: fatTarget, color: '#fb923c' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      <AnimatePresence>
        {isRefreshing && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 60, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--primary-container)]">
            <img 
              alt="User" 
              className="w-full h-full object-cover" 
              src={profile?.avatar_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"} 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">{greeting},</span>
            <span className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">{profile?.nickname || '用户'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${isRefreshing ? 'animate-spin text-[var(--primary)]' : 'text-gray-400'}`}
          >
            <Zap size={20} fill={isRefreshing ? "currentColor" : "none"} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
            <Bell size={24} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-950 rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-2xl mx-auto space-y-6">
        <section className="bg-[var(--primary-container)]/20 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg text-[var(--primary)]">今日状态</h2>
            <span className="text-xs font-medium text-[var(--primary)] px-2 py-1 bg-white/50 rounded-full">目标: {calorieTarget} kcal</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative flex items-center justify-center w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '已摄入', value: currentCalories },
                      { name: '剩余', value: Math.max(0, calorieTarget - currentCalories) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={58}
                    paddingAngle={5}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    <Cell fill="var(--primary)" />
                    <Cell fill="rgba(255, 255, 255, 0.4)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-[var(--on-primary-container)]">{Math.max(0, calorieTarget - currentCalories).toLocaleString()}</span>
                <span className="text-[10px] font-bold text-[var(--primary)] tracking-widest uppercase">剩余热量</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[var(--primary)] shadow-sm">
                  <Utensils size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">已摄入</p>
                  <p className="font-bold text-[var(--on-primary-container)]">{currentCalories} <span className="text-[10px] font-normal opacity-70">kcal</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
                  <Zap size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">运动消耗</p>
                  <p className="font-bold text-[var(--on-primary-container)]">{exerciseTarget} <span className="text-[10px] font-normal opacity-70">kcal</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-4">
          {[
            { icon: Utensils, label: '记饮食', color: 'text-green-500', type: 'food' },
            { icon: Scale, label: '测体重', color: 'text-blue-500', type: 'weight' },
            { icon: Pill, label: '记补剂', color: 'text-purple-500', type: 'supplement' },
            { icon: ClipboardList, label: '加计划', color: 'text-orange-500', type: 'plan' }
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => onLogAction(item.type)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-[var(--primary)] group-active:scale-90 transition-transform">
                <item.icon size={24} />
              </div>
              <span className="text-[11px] font-bold text-gray-500">{item.label}</span>
            </button>
          ))}
        </section>

        <section 
          className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-4 flex items-center justify-between border border-blue-100 dark:border-blue-800 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-blue-500 relative overflow-hidden">
              <Droplets size={24} fill="currentColor" className="z-10" />
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500/20"
                animate={{ height: `${(waterIntake / waterTarget) * 100}%` }}
              />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100">饮水进度</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400">{waterIntake}ml / {waterTarget}ml</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onAddWater(-250)}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-blue-500 flex items-center justify-center shadow-sm active:scale-90 transition-all border border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/40"
              title="减少 250ml"
            >
              <Minus size={20} />
            </button>
            <button 
              onClick={() => onAddWater(250)}
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-all hover:bg-blue-600"
              title="增加 250ml"
            >
              <Plus size={20} />
            </button>
          </div>
        </section>

        {customTrackers.length > 0 && (
          <section className="grid grid-cols-2 gap-4">
            {customTrackers.map((tracker, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm space-y-3 border border-gray-50 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                    <Pill size={20} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tracker.type}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{tracker.title}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[var(--primary)]">{tracker.value}</span>
                    <span className="text-[10px] text-gray-400 font-bold">/ {tracker.target} {tracker.unit}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(tracker.value / tracker.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">营养简报</h3>
            <span className="text-[10px] text-gray-400">每日推荐比例</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroData} layout="vertical" margin={{ left: -20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={12}>
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {macroData.map((macro, idx) => (
              <div key={idx} className="text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{macro.name}</p>
                <p className="text-sm font-black text-gray-800 dark:text-gray-100">{macro.value}g</p>
                <p className="text-[10px] text-gray-400">/ {macro.total}g</p>
              </div>
            ))}
          </div>
        </section>

        {todayFood.length > 0 && (
          <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">今日饮食记录</h3>
              <span className="text-[10px] text-gray-400">滑动删除</span>
            </div>
            <div className="space-y-3">
              {todayFood.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl group relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-[var(--primary)] shadow-sm">
                      <Utensils size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{log.food_name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{log.meal_type} • {log.quantity}{log.unit} • {log.calories}kcal</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteFoodLog(log.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="relative h-48 rounded-3xl overflow-hidden group cursor-pointer" onClick={() => onNavigate('plan')}>
          <img 
            alt="Fitness" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">今日建议</span>
            <h4 className="text-white font-bold text-lg">高强度间歇训练 (HIIT)</h4>
            <p className="text-white/80 text-xs">燃烧更多脂肪，提升心肺功能 • 25分钟</p>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

const PlanPage = ({ 
  onNavigate, 
  onShowToast, 
  waterSlots, 
  onToggleWaterSlot,
  onDeleteWaterLog,
  waterLogs
}: { 
  onNavigate: (p: Page) => void; 
  onShowToast: (m: string) => void; 
  waterSlots: any[]; 
  onToggleWaterSlot: (id: number) => void;
  onDeleteWaterLog: (id: number) => void;
  waterLogs: any[];
  plans: any[];
  onAddPlan: (title: string, desc: string) => void;
  onDeletePlan: (id: number) => void;
  onTogglePlan: (id: number) => void;
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');

  const completedCount = plans.filter(t => t.completed).length;
  const progress = plans.length > 0 ? Math.round((completedCount / plans.length) * 100) : 0;

  const handleAddPlan = () => {
    if (!newPlanTitle.trim()) {
      onShowToast('请输入计划名称');
      return;
    }
    onAddPlan(newPlanTitle, newPlanDesc);
    setNewPlanTitle('');
    setNewPlanDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-32"
    >
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <Leaf className="text-[var(--primary)]" size={24} />
          <h1 className="text-[var(--primary)] font-extrabold italic text-xl tracking-tight">Vitality</h1>
        </div>
        <button className="text-[var(--primary)] p-2 rounded-full hover:bg-[var(--primary)]/5 transition-colors">
          <Bell size={24} />
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[var(--primary)] font-semibold uppercase tracking-[0.2em] text-[10px] mb-2">今日重点</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">每日计划</h2>
            </div>
            <div className="text-right">
              <p className="text-[var(--primary)] font-black text-2xl leading-none">{progress}%</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">完成度</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-6 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-2 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-sm font-bold text-gray-400 group-hover:text-[var(--primary)]">添加今日计划</span>
          </button>
        </section>

        <div className="space-y-6">
          <div 
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6 overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <Droplets className="text-white" size={18} />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-100 block">饮水 2升</span>
                  <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">优先级 · 补水</span>
                </div>
              </div>
              <button className="text-gray-300 hover:text-[var(--primary)] transition-colors p-2">
                <Bell size={20} fill="currentColor" />
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-3">
                {waterSlots.map((slot) => (
                  <button 
                    key={slot.id}
                    onClick={() => onToggleWaterSlot(slot.id)}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center font-bold text-[10px] relative group ${
                      slot.completed 
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white' 
                        : 'bg-white dark:bg-gray-900 border-gray-200 text-gray-400 hover:border-[var(--primary)]'
                    }`}
                  >
                    {slot.time}
                    {slot.completed && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-900 rounded-full border border-[var(--primary)] flex items-center justify-center shadow-sm"
                      >
                        <Check className="text-[var(--primary)]" size={10} strokeWidth={4} />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-gray-500">
                {waterSlots.every(s => s.completed) ? '今日补水目标已达成！' : '下次饮水在 45 分钟后'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {plans.map((plan) => (
              <motion.div 
                key={plan.id} 
                layout
                className={`bg-white dark:bg-gray-900 p-6 rounded-2xl flex items-center justify-between transition-all hover:shadow-md ${plan.completed ? 'opacity-60' : ''}`}
              >
                <div 
                  className="flex items-center gap-5 flex-1 cursor-pointer"
                  onClick={() => onTogglePlan(plan.id)}
                >
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${plan.completed ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-gray-200'}`}>
                    {plan.completed && <Check className="text-white" size={14} />}
                  </div>
                  <div>
                    <span className={`text-lg font-semibold text-gray-800 dark:text-gray-100 block ${plan.completed ? 'line-through' : ''}`}>{plan.title}</span>
                    <span className="text-xs text-gray-500">{plan.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-full ${plan.completed ? 'text-[var(--primary)]' : 'text-gray-300'}`}>
                    <Bell size={20} />
                  </button>
                  <button 
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-2 rounded-full text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {waterLogs.length > 0 && (
          <section className="mt-8 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 px-2">饮水历史</h3>
            <div className="space-y-3">
              {waterLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-blue-500 shadow-sm">
                      <Droplets size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{log.amount_ml} ml</p>
                      <p className="text-[10px] text-gray-500 font-medium">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteWaterLog(log.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 bg-[var(--primary-container)]/30 p-8 rounded-3xl flex items-center gap-8 overflow-hidden relative">
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold text-[var(--on-primary-container)] leading-tight mb-2">活力里程碑</h3>
            <p className="text-[var(--on-primary-container)]/80 text-sm mb-4">您已完成 {progress}% 的每日健康目标。继续加油！</p>
            <div className="flex gap-2">
              <span className="bg-[var(--primary)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">成长</span>
              <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">活跃</span>
            </div>
          </div>
          <div className="relative flex-shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle className="text-white/20" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8" />
              <circle className="text-[var(--primary)]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (progress / 100))} strokeLinecap="round" strokeWidth="8" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-[var(--on-primary-container)]">
              <Zap size={24} fill="currentColor" />
            </div>
          </div>
        </section>
      </main>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="添加今日计划">
        <div className="space-y-6">
          <Input 
            label="计划名称" 
            placeholder="例如：晨间冥想" 
            value={newPlanTitle}
            onChange={(e) => setNewPlanTitle(e.target.value)}
          />
          <Input 
            label="备注描述" 
            placeholder="例如：10 分钟呼吸练习" 
            value={newPlanDesc}
            onChange={(e) => setNewPlanDesc(e.target.value)}
          />
          <div className="pt-4">
            <Button onClick={handleAddPlan} className="w-full py-4 text-lg">确认添加</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

const NutritionPage = ({ 
  onNavigate, 
  onLogAction, 
  customTrackers, 
  onDeleteTracker,
  onDeleteWeightLog,
  weightLogs
}: { 
  onNavigate: (p: Page) => void, 
  onLogAction: (type: string) => void,
  customTrackers: CustomTracker[],
  onDeleteTracker: (id: number) => void,
  onDeleteWeightLog: (id: number) => void,
  weightLogs: any[]
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="pb-32"
  >
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
          <img 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" 
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="font-extrabold italic text-[var(--primary)] text-xl tracking-tight">活力清爽</span>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--primary)]/5 transition-colors relative">
        <Bell size={24} className="text-[var(--primary)]" />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-950 rounded-full"></span>
      </button>
    </header>

    <main className="pt-24 px-6 max-w-md mx-auto">
      <div className="mb-8">
        <Input icon={Search} placeholder="搜索食物或营养素..." />
      </div>

      <section className="relative mb-12 flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle className="text-gray-100 dark:text-gray-800" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="14" />
            <circle className="text-[var(--primary)]" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeDasharray="691" strokeDashoffset="276" strokeLinecap="round" strokeWidth="14" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-1">已摄入热量</span>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-5xl text-gray-800 dark:text-gray-100">1200</span>
              <span className="font-bold text-sm text-gray-500">/ 2000</span>
            </div>
            <span className="text-xs font-medium text-[var(--primary)] mt-1">剩余千卡: 800</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 no-scrollbar w-full justify-center">
          {[12, 13, 14, 15, 16].map((day, idx) => (
            <div key={idx} className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all ${day === 14 ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)]' : 'opacity-40'}`}>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{day === 14 ? '今天' : `周${['一', '二', '三', '四', '五'][idx]}`}</span>
              <span className="text-lg font-extrabold">{day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="font-bold text-2xl px-2">每日宏量营养素</h2>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm space-y-8">
          {[
            { label: '蛋白质', value: '92g / 150g', percent: 61, color: 'bg-[var(--primary)]' },
            { label: '碳水', value: '145g / 250g', percent: 58, color: 'bg-blue-400' },
            { label: '脂肪', value: '48g / 70g', percent: 68, color: 'bg-orange-400' }
          ].map((macro, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{macro.label}</span>
                  <span className="font-bold text-lg">{macro.value}</span>
                </div>
                <span className="text-xs font-bold text-[var(--primary)]">{macro.percent}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${macro.color} rounded-full`} style={{ width: `${macro.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 mb-12">
        <div className="flex justify-between items-center px-2">
          <h2 className="font-bold text-2xl">自定义追踪</h2>
          <button className="text-[var(--primary)] text-xs font-bold uppercase tracking-tighter">编辑列表</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {customTrackers.map((tracker) => (
            <div 
              key={tracker.id}
              className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 flex flex-col justify-between h-40 shadow-sm border border-gray-50 dark:border-gray-800 group"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteTracker(tracker.id); }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <X size={14} />
              </button>
              <div onClick={() => onNavigate('nutrient-detail')} className="cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{tracker.type}</span>
                  <h3 className="font-bold text-lg mt-1 text-gray-800 dark:text-gray-100">{tracker.title}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500">
                    <span>{tracker.value}{tracker.unit}</span>
                    <span>{tracker.target}{tracker.unit} 目标</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min((tracker.value / tracker.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div 
            onClick={() => onLogAction('custom-tracker')}
            className="bg-white dark:bg-gray-900 rounded-3xl p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/10 border-2 border-dashed border-gray-100 dark:border-gray-800 hover:border-[var(--primary)] group h-40"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-2 shadow-sm group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight leading-tight text-gray-400 group-hover:text-[var(--primary)]">快速记录</span>
          </div>
        </div>
      </section>

      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-8">
        <img 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">健康小贴士</span>
          <p className="text-white font-bold text-lg leading-tight">维生素C与铁元素同补，吸收率提升3倍。</p>
        </div>
      </div>

      {weightLogs.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">体重记录历史</h3>
          </div>
          <div className="space-y-3">
            {weightLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-[var(--primary)] shadow-sm">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{log.weight_kg} kg</p>
                    <p className="text-[10px] text-gray-500 font-medium">{new Date(log.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteWeightLog(log.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  </motion.div>
);

const NutrientDetailPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  const chartData = [
    { name: '一', value: 40 },
    { name: '二', value: 65 },
    { name: '三', value: 30 },
    { name: '四', value: 90 },
    { name: '五', value: 50 },
    { name: '六', value: 75 },
    { name: '日', value: 20 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pb-32"
    >
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('nutrition')} className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-xl tracking-tight text-[var(--primary)]">维生素C</h1>
        </div>
        <div className="flex items-center gap-3">
          <Bell size={24} className="text-[var(--primary)]" />
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[var(--primary-container)]">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-10">
        <section className="relative text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 font-semibold">今日摄入</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-7xl font-black text-gray-800 dark:text-gray-100">500</span>
            <span className="text-2xl font-bold text-[var(--primary)] italic">mg</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">建议: 90mg/天</p>
        </section>

        <section className="flex flex-wrap justify-center gap-3">
          {['50mg', '100mg', '250mg', '500mg', '1000mg'].map((dose, idx) => (
            <button 
              key={idx} 
              className={`px-6 py-3 rounded-full font-semibold shadow-sm border transition-all active:scale-90 ${dose === '100mg' ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-100 dark:border-gray-800 hover:bg-[var(--primary)] hover:text-white'}`}
            >
              {dose}
            </button>
          ))}
        </section>

        <section className="flex flex-col items-center">
          <Button className="w-full max-w-xs h-16 flex items-center gap-3">
            <Plus size={24} />
            记录摄入
          </Button>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">周趋势</h2>
              <p className="text-gray-500 text-sm">过去 7 天维生素C摄入情况</p>
            </div>
            <div className="text-right">
              <span className="block text-3xl font-black text-[var(--primary)]">84%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">目标达成率</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm shrink-0">
              <Lightbulb size={32} className="text-[var(--primary)]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">您知道吗？</h3>
              <p className="text-sm text-gray-500 leading-relaxed">维生素C有助于铁的吸收。尝试在富含铁的进餐时补充，以获得最大效益。</p>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 space-y-3">
            <Leaf size={24} className="text-orange-600" />
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">来源建议</p>
            <p className="font-bold text-gray-800 dark:text-gray-100">新鲜橙子</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 space-y-3">
            <Shield size={24} className="text-purple-600" />
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">免疫力</p>
            <p className="font-bold text-gray-800 dark:text-gray-100">促进胶原蛋白</p>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

const AccountManagementPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="pb-32 min-h-screen bg-gray-50 dark:bg-gray-950"
  >
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 flex justify-between items-center px-6 h-16">
      <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 text-[var(--primary)]">
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-gray-800 dark:text-gray-100 font-bold text-lg">账号管理</h1>
      <button className="p-2 -mr-2 text-[var(--primary)]">
        <Settings size={24} />
      </button>
    </header>

    <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">账户安全</h3>
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
          <button className="w-full flex items-center justify-between p-6 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary-container)] flex items-center justify-center text-[var(--primary)]">
                <Lock size={24} />
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-100">修改密码</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
          <button className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary-container)] flex items-center justify-center text-[var(--primary)]">
                <Smartphone size={24} />
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-100">更换手机号</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 font-medium">138****8888</span>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">账号绑定</h3>
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
          <button className="w-full flex items-center justify-between p-6 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                <MessageSquare size={24} />
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-100">微信</span>
            </div>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-[10px] font-bold px-3 py-1 rounded-full">已绑定</span>
          </button>
          <button className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                <Mail size={24} />
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-100">邮箱</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 font-medium">未绑定</span>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">账户操作</h3>
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
          <button className="w-full flex items-center justify-between p-6 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                <UserMinus size={24} />
              </div>
              <span className="font-bold text-red-500">注销账号</span>
            </div>
            <ChevronRight size={20} className="text-red-200" />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 px-4 leading-relaxed">注销后，您的所有数据将被永久删除且无法找回，请谨慎操作。</p>
      </section>

      <div className="pt-8">
        <button 
          onClick={() => onNavigate('login')}
          className="w-full py-5 rounded-[2rem] border-2 border-[var(--primary)] text-[var(--primary)] font-black text-lg shadow-lg shadow-[var(--primary)]/10 active:scale-95 transition-all"
        >
          退出当前登录
        </button>
      </div>
    </main>
  </motion.div>
);

const HelpFeedbackPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="pb-32 min-h-screen bg-gray-50 dark:bg-gray-950"
  >
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 flex justify-between items-center px-6 h-16">
      <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 text-[var(--primary)]">
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-gray-800 dark:text-gray-100 font-bold text-lg">帮助与反馈</h1>
      <button className="p-2 -mr-2 text-[var(--primary)]">
        <Headphones size={24} />
      </button>
    </header>

    <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
      <section className="bg-[var(--primary)] rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl shadow-[var(--primary)]/20">
        <div className="relative z-10 space-y-4">
          <h2 className="text-white text-2xl font-black">在线客服</h2>
          <p className="text-white/80 text-sm font-medium">为您提供及时的专业解答 (9:00 - 22:00)</p>
          <button className="bg-white text-[var(--primary)] px-6 py-2.5 rounded-full font-black text-sm shadow-lg active:scale-95 transition-all">
            立即咨询
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-20 transform scale-150">
          <Headphones size={120} className="text-white" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black text-gray-800 dark:text-gray-100">常见问题</h3>
          <button className="text-xs font-bold text-gray-400">查看更多</button>
        </div>
        <div className="space-y-3">
          {[
            { q: '如何记录我的每日饮食？', icon: Utensils },
            { q: '如何修改我的健康目标？', icon: Zap },
            { q: '数据无法同步到健康中心怎么办？', icon: Smartphone }
          ].map((item, idx) => (
            <button key={idx} className="w-full bg-white dark:bg-gray-900 p-5 rounded-3xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-800 hover:border-[var(--primary)]/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-[var(--primary)] transition-colors">
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{item.q}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 px-2">意见反馈</h3>
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 ml-2">问题描述</label>
            <textarea 
              placeholder="请详细描述您遇到的问题或建议..."
              className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-3xl p-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 ml-2">上传图片 (最多3张)</label>
            <button className="w-24 h-24 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-[var(--primary)] transition-all group">
              <Camera size={24} className="text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-[var(--primary)] transition-colors">添加图片</span>
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 ml-2">联系方式 (可选)</label>
            <input 
              type="text"
              placeholder="手机号或邮箱，方便我们联系您"
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-full px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
          </div>
          <button className="w-full py-5 bg-[var(--primary)] text-white rounded-[2rem] font-black text-lg shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all">
            提交反馈
          </button>
          <p className="text-center text-[10px] text-gray-400">您的反馈将帮助我们不断优化 Vitality 体验</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:border-[var(--primary)] transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <div className="text-center">
            <p className="font-black text-gray-800 dark:text-gray-100">新手指南</p>
            <p className="text-[10px] font-bold text-gray-400">快速了解各项核心功能</p>
          </div>
        </button>
        <button className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 hover:border-[var(--primary)] transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
            <History size={24} />
          </div>
          <div className="text-center">
            <p className="font-black text-gray-800 dark:text-gray-100">反馈记录</p>
            <p className="text-[10px] font-bold text-gray-400">查看您的反馈处理进度</p>
          </div>
        </button>
      </div>
    </main>
  </motion.div>
);

const PersonalProfilePage = ({ 
  onNavigate,
  profile,
  onUpdate,
  onSave
}: { 
  onNavigate: (p: Page) => void,
  profile: any,
  onUpdate: (updates: any) => void,
  onSave: (updates: any) => void
}) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="pb-32 min-h-screen bg-gray-50 dark:bg-gray-950"
  >
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 flex justify-between items-center px-6 h-16">
      <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 text-[var(--primary)]">
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-gray-800 dark:text-gray-100 font-bold text-lg">个人资料</h1>
      <button className="p-2 -mr-2 text-[var(--primary)]">
        <Settings size={24} />
      </button>
    </header>

    <main className="pt-24 px-6 max-w-md mx-auto space-y-10">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white dark:border-gray-900 shadow-2xl">
            <img 
              className="w-full h-full object-cover" 
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'} 
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--primary)] text-white rounded-full shadow-xl flex items-center justify-center border-4 border-white dark:border-gray-900 active:scale-90 transition-all">
            <Camera size={20} />
          </button>
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">点击更换头像</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">昵称</label>
          <div className="relative group">
            <input 
              type="text"
              value={profile.nickname}
              onChange={(e) => onUpdate({ nickname: e.target.value })}
              className="w-full bg-white dark:bg-gray-900 rounded-[2rem] px-8 py-5 font-bold text-gray-800 dark:text-gray-100 shadow-sm border-2 border-transparent focus:border-[var(--primary)] focus:outline-none transition-all"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[var(--primary)] transition-colors">
              <Plus size={20} className="rotate-45" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">性别</label>
            <div className="relative">
              <select 
                value={profile.gender}
                onChange={(e) => onUpdate({ gender: e.target.value })}
                className="w-full bg-white dark:bg-gray-900 rounded-[2rem] px-8 py-5 font-bold text-gray-800 dark:text-gray-100 shadow-sm border-2 border-transparent focus:border-[var(--primary)] focus:outline-none appearance-none transition-all"
              >
                <option>女</option>
                <option>男</option>
                <option>其他</option>
              </select>
              <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 rotate-90 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">生日</label>
            <div className="relative group">
              <input 
                type="date"
                value={profile.birthday}
                onChange={(e) => onUpdate({ birthday: e.target.value })}
                className="w-full bg-white dark:bg-gray-900 rounded-[2rem] px-8 py-5 font-bold text-gray-800 dark:text-gray-100 shadow-sm border-2 border-transparent focus:border-[var(--primary)] focus:outline-none transition-all"
              />
              <Calendar size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[var(--primary)] transition-colors pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
          <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">健康数据</h3>
          <span className="text-[10px] font-bold text-gray-400">(用于计算卡路里消耗)</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[var(--primary-container)] rounded-[2.5rem] p-8 space-y-4 shadow-sm border border-[var(--primary)]/10">
            <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">当前身高</p>
            <div className="flex items-baseline gap-2">
              <input 
                type="number"
                value={profile.height}
                onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                className="w-20 bg-transparent text-4xl font-black text-[var(--primary)] focus:outline-none border-b-2 border-transparent focus:border-[var(--primary)]/30 transition-all"
              />
              <span className="text-sm font-bold text-[var(--primary)]/60">cm</span>
            </div>
          </div>
          <div className="bg-[var(--primary-container)] rounded-[2.5rem] p-8 space-y-4 shadow-sm border border-[var(--primary)]/10">
            <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">当前体重</p>
            <div className="flex items-baseline gap-2">
              <input 
                type="number"
                step="0.1"
                value={profile.weight}
                onChange={(e) => onUpdate({ weight: Number(e.target.value) })}
                className="w-24 bg-transparent text-4xl font-black text-[var(--primary)] focus:outline-none border-b-2 border-transparent focus:border-[var(--primary)]/30 transition-all"
              />
              <span className="text-sm font-bold text-[var(--primary)]/60">kg</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 flex gap-4 items-start border border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-[var(--primary)] shadow-sm">
            <HelpCircle size={20} />
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">为了提供更准确的健康建议，我们建议您定期更新您的体重数据。您的个人隐私将受到严格保护。</p>
        </div>
      </section>

      <button 
        onClick={() => { onSave(profile); onNavigate('profile'); }}
        className="w-full py-5 bg-[var(--primary)] text-white rounded-[2rem] font-black text-xl shadow-xl shadow-[var(--primary)]/30 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <Check size={24} />
        保存修改
      </button>
    </main>
  </motion.div>
);

const GoalSettingPage = ({ 
  onNavigate, 
  goals, 
  onSave 
}: { 
  onNavigate: (p: Page) => void, 
  goals: any,
  onSave: (data: any) => Promise<void>
}) => {
  const [localGoals, setLocalGoals] = useState(goals || {
    calorie_target: 1800,
    protein_pct: 30,
    carb_pct: 45,
    fat_pct: 25,
    water_target_ml: 2000,
    exercise_target_kcal: 500
  });

  const [saving, setSaving] = useState(false);

  const handleUpdate = (field: string, value: number) => {
    setLocalGoals((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localGoals);
      onNavigate('profile');
    } catch (err) {
      console.error('Failed to save goals:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-32 min-h-screen bg-gray-50 dark:bg-gray-950"
    >
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 flex justify-between items-center px-6 h-16">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 text-[var(--primary)]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-gray-800 dark:text-gray-100 font-bold text-lg">目标设定</h1>
        <div className="w-10"></div>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
        <section className="bg-gray-900 dark:bg-black rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white/60 text-xs font-black uppercase tracking-widest">每日热量目标</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleUpdate('calorie_target', Math.max(0, localGoals.calorie_target - 100))}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                >
                  <Minus size={16} />
                </button>
                <button 
                  onClick={() => handleUpdate('calorie_target', localGoals.calorie_target + 100)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-black text-white tracking-tighter">{localGoals.calorie_target}</span>
              <span className="text-2xl font-bold text-[var(--primary)]">kcal</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-full backdrop-blur-md">减脂模式</span>
              <span className="bg-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-bold px-4 py-2 rounded-full backdrop-blur-md">高代谢倾向</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12">
            <Utensils size={240} className="text-white" />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary-container)] flex items-center justify-center text-[var(--primary)]">
              <Leaf size={20} />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">营养素比例</h3>
          </div>

          <div className="space-y-10">
            {[
              { label: '蛋白质 (Protein)', key: 'protein_pct', color: 'bg-[var(--primary)]' },
              { label: '碳水化合物 (Carbs)', key: 'carb_pct', color: 'bg-blue-400' },
              { label: '脂肪 (Fats)', key: 'fat_pct', color: 'bg-orange-400' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUpdate(item.key, Math.max(0, localGoals[item.key] - 5))}
                      className="text-gray-400 hover:text-[var(--primary)]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-lg font-black text-gray-800 dark:text-gray-100">{localGoals[item.key]}%</span>
                    <button 
                      onClick={() => handleUpdate(item.key, Math.min(100, localGoals[item.key] + 5))}
                      className="text-gray-400 hover:text-[var(--primary)]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div 
                    className={`absolute left-0 top-0 h-full ${item.color} rounded-full transition-all duration-500`} 
                    style={{ width: `${localGoals[item.key]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 flex gap-4 items-start border border-gray-100 dark:border-gray-700">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0">
              <HelpCircle size={16} />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              比例总计应等于 100%（当前：{localGoals.protein_pct + localGoals.carb_pct + localGoals.fat_pct}%）。
              目前的设定有助于维持肌肉量并提供持续能量。
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 space-y-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
              <Droplets size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">水分目标</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-800 dark:text-gray-100">{localGoals.water_target_ml}</span>
                <span className="text-xs font-bold text-gray-400">ml</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleUpdate('water_target_ml', Math.max(0, localGoals.water_target_ml - 250))}
                className="flex-1 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-colors"
              >-</button>
              <button 
                onClick={() => handleUpdate('water_target_ml', localGoals.water_target_ml + 250)}
                className="flex-1 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-colors"
              >+</button>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 space-y-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
              <Zap size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">运动消耗</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-800 dark:text-gray-100">{localGoals.exercise_target_kcal}</span>
                <span className="text-xs font-bold text-gray-400">kcal</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleUpdate('exercise_target_kcal', Math.max(0, localGoals.exercise_target_kcal - 50))}
                className="flex-1 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-colors"
              >-</button>
              <button 
                onClick={() => handleUpdate('exercise_target_kcal', localGoals.exercise_target_kcal + 50)}
                className="flex-1 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-colors"
              >+</button>
            </div>
          </div>
        </div>

        <section className="bg-[var(--primary)] rounded-[3rem] p-10 relative overflow-hidden shadow-xl shadow-[var(--primary)]/20">
          <div className="relative z-10 space-y-2">
            <h2 className="text-white text-3xl font-black tracking-tight">优化您的生活方式</h2>
            <p className="text-white/80 font-bold">合理的营养比例是健康的第一步</p>
          </div>
          <div className="absolute -right-10 -top-10 opacity-20 transform rotate-12">
            <Leaf size={200} className="text-white" />
          </div>
        </section>

        <button 
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-5 bg-[var(--primary)] text-white rounded-[2rem] font-black text-xl shadow-xl shadow-[var(--primary)]/30 active:scale-95 transition-all flex items-center justify-center gap-3 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? '正在保存...' : '保存并应用目标'}
          <Check size={24} />
        </button>
      </main>
    </motion.div>
  );
};

const ProfilePage = ({ 
  onNavigate, 
  onThemeChange, 
  currentThemeIndex,
  profile,
  onLogout,
  joinDays,
  completedCount
}: { 
  onNavigate: (p: Page) => void, 
  onThemeChange: (idx: number) => void,
  currentThemeIndex: number,
  profile: any,
  onLogout: () => void,
  joinDays: number,
  completedCount: number
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="pb-32"
  >
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <Leaf className="text-[var(--primary)]" size={24} />
        <h1 className="text-[var(--primary)] font-extrabold italic text-xl tracking-tight">Vitality</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-[var(--primary)] p-2 rounded-full hover:bg-[var(--primary)]/5 transition-colors">
          <Bell size={24} />
        </button>
      </div>
    </header>

    <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--primary-container)]">
            <img 
              className="w-full h-full object-cover" 
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'} 
              referrerPolicy="no-referrer"
            />
          </div>
          <button onClick={() => onNavigate('personal-profile')} className="absolute bottom-0 right-0 p-2 bg-[var(--primary)] text-white rounded-full shadow-lg">
            <Plus size={16} />
          </button>
        </div>
        <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100 mb-2">{profile.nickname}</h2>
        <p className="text-gray-500 font-medium mb-4">个人简介/目标：减脂增肌</p>
        <div className="flex justify-center gap-2">
          <span className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-[10px] font-bold px-3 py-1 rounded-full">PRO 会员</span>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full">LV.12</span>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">个性化主题</h3>
          <Palette size={18} className="text-[var(--primary)]" />
        </div>
        <div className="flex justify-between gap-2">
          {themes.map((theme, idx) => (
            <button 
              key={idx}
              onClick={() => onThemeChange(idx)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${currentThemeIndex === idx ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-transparent bg-gray-50 dark:bg-gray-800'}`}
            >
              <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }}></div>
              <span className={`text-[10px] font-bold ${currentThemeIndex === idx ? 'text-[var(--primary)]' : 'text-gray-400'}`}>{theme.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-4">
        {[
          { label: '坚持天数', value: joinDays.toString(), color: 'bg-green-50 text-green-600' },
          { label: '达成计划数', value: completedCount.toString(), color: 'bg-blue-50 text-blue-600' },
          { label: '勋章数', value: Math.floor(joinDays / 10).toString(), color: 'bg-orange-50 text-orange-600' }
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color.split(' ')[0]} dark:bg-gray-800 rounded-3xl p-4 text-center space-y-1`} style={{ backgroundColor: stat.color.split(' ')[0] === 'bg-green-50' ? 'rgba(236, 253, 245, 1)' : stat.color.split(' ')[0] === 'bg-blue-50' ? 'rgba(239, 246, 255, 1)' : 'rgba(255, 247, 237, 1)' }}>
            <p className={`text-2xl font-black ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-400">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden">
        {[
          { icon: User, label: '个人资料设置', page: 'personal-profile' },
          { icon: Zap, label: '目标设定', sub: '每日热量、营养素目标', page: 'goal-setting' },
          { icon: Bell, label: '提醒设置', toggle: true },
          { icon: Link2, label: '账号关联', sub: '微信、手机号', badge: '已绑定', page: 'account-management' },
          { icon: HelpCircle, label: '帮助与反馈', page: 'help-feedback' }
        ].map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => item.page && onNavigate(item.page as Page)}
            className="flex items-center justify-between p-6 border-b border-gray-50 dark:border-gray-800 last:border-none hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{item.label}</p>
                {item.sub && <p className="text-[10px] font-bold text-gray-400">{item.sub}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.badge && <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-bold px-3 py-1 rounded-full">{item.badge}</span>}
              {item.toggle ? (
                <div className="w-10 h-5 bg-[var(--primary)] rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              ) : (
                <ChevronRight size={18} className="text-gray-300" />
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
        <button 
          onClick={onLogout}
          className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          退出登录
        </button>
      </section>
    </main>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [themeIndex, setThemeIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });
  const [waterIntake, setWaterIntake] = useState(0); // ml
  const [waterSlots, setWaterSlots] = useState<any[]>([]);
  const [showWaterPlan, setShowWaterPlan] = useState(true);
  const [customTrackers, setCustomTrackers] = useState<CustomTracker[]>([]);
  const [newTrackerType, setNewTrackerType] = useState('维生素');
  const [newTrackerTitle, setNewTrackerTitle] = useState('');
  const [newTrackerTarget, setNewTrackerTarget] = useState('');
  const [newTrackerUnit, setNewTrackerUnit] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [waterLogs, setWaterLogs] = useState<any[]>([]);
  const [foodLogs, setFoodLogs] = useState<any[]>([]);
  const [weightLogs, setWeightLogs] = useState<any[]>([]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好';
    if (hour < 11) return '早安';
    if (hour < 13) return '午安';
    if (hour < 18) return '下午好';
    return '晚安';
  }, []);

  const joinDays = useMemo(() => {
    if (!userProfile?.created_at) return 1;
    const start = new Date(userProfile.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }, [userProfile?.created_at]);

  const completedPlansCount = useMemo(() => {
    return plans.filter(p => p.completed).length;
  }, [plans]);

  // Food modal state
  const [foodName, setFoodName] = useState('');
  const [foodAmount, setFoodAmount] = useState('1');
  const [foodUnit, setFoodUnit] = useState('份');
  const [mealType, setMealType] = useState('早餐');

  // Weight modal state
  const [currentWeight, setCurrentWeight] = useState(62.5);

  const handleLogin = (user: any, token: string) => {
    setUser(user);
    localStorage.setItem('supabase_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    setUserProfile(null);
    setGoals(null);
    setWaterIntake(0);
    setWaterSlots([]);
    setCustomTrackers([]);
    setPlans([]);
    localStorage.removeItem('supabase_token');
    setCurrentPage('login');
  };

  useEffect(() => {
    const token = localStorage.getItem('supabase_token');
    if (token && !user) {
      setUser({ token }); 
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [profile, goalsData, plansData, waterLogs, slots, trackers, foodLogsData, weightLogsData] = await Promise.all([
        api.profile.get(),
        api.goals.get(),
        api.plans.list(),
        api.water.listLogs(),
        api.water.listSlots(),
        api.trackers.list(),
        api.food.listLogs(),
        api.weight.list(),
      ]);

      setUserProfile(profile);
      setGoals(goalsData);
      setPlans(plansData);
      setWaterLogs(waterLogs);
      setWaterSlots(slots);
      setCustomTrackers(trackers);
      setFoodLogs(foodLogsData);
      setWeightLogs(weightLogsData);

      const today = new Date().toISOString().split('T')[0];
      const todayWater = waterLogs
        .filter((log: any) => log.date === today)
        .reduce((sum: number, log: any) => sum + log.amount_ml, 0);
      setWaterIntake(todayWater);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const addFoodLog = async () => {
    if (!foodName.trim()) {
      showToast('请输入食物名称');
      return;
    }
    try {
      // Mock some nutritional data if not provided
      const calories = 200 * Number(foodAmount); 
      const protein = 10 * Number(foodAmount);
      const carbs = 20 * Number(foodAmount);
      const fat = 5 * Number(foodAmount);

      const newLog = await api.food.addLog({
        meal_type: mealType,
        food_name: foodName,
        quantity: Number(foodAmount),
        unit: foodUnit,
        calories,
        protein,
        carbs,
        fat,
        date: new Date().toISOString().split('T')[0]
      });
      setFoodLogs(prev => [newLog, ...prev]);
      showToast('饮食已记录');
      setActiveModal(null);
      setFoodName('');
    } catch (err) {
      showToast('记录失败');
    }
  };

  const deleteFoodLog = async (id: number) => {
    try {
      await api.food.deleteLog(id);
      setFoodLogs(prev => prev.filter(log => log.id !== id));
      showToast('记录已删除');
    } catch (err) {
      showToast('删除失败');
    }
  };

  const addWeightLog = async () => {
    try {
      const newLog = await api.weight.add({
        weight_kg: currentWeight,
        date: new Date().toISOString().split('T')[0]
      });
      setWeightLogs(prev => [newLog, ...prev]);
      setUserProfile(prev => ({ ...prev, weight: currentWeight }));
      showToast('体重已更新');
      setActiveModal(null);
    } catch (err) {
      showToast('更新失败');
    }
  };

  const deleteWeightLog = async (id: number) => {
    try {
      await api.weight.delete(id);
      setWeightLogs(prev => prev.filter(log => log.id !== id));
      showToast('体重记录已删除');
    } catch (err) {
      showToast('删除失败');
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const updated = await api.profile.update(updates);
      setUserProfile(updated);
      showToast('资料已更新');
    } catch (err) {
      showToast('更新失败');
    }
  };

  const updateGoal = async (goalData: any) => {
    try {
      const updated = await api.goals.update(goalData);
      setGoals(updated);
      showToast('健康目标已更新');
    } catch (err) {
      showToast('更新目标失败');
    }
  };

  const currentTheme = themes[themeIndex];

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  const addWater = async (amount: number) => {
    try {
      const waterTarget = goals?.water_target_ml || 2000;
      const newLog = await api.water.addLog({ amount_ml: amount, date: new Date().toISOString().split('T')[0] });
      setWaterLogs(prev => [newLog, ...prev]);
      setWaterIntake(prev => {
        const next = prev + amount;
        if (next > waterTarget * 2) return waterTarget * 2; // Allow some overflow but not infinite
        if (next < 0) return 0;
        return next;
      });
      showToast(amount > 0 ? `已添加 ${amount}ml 饮水` : `已减少 ${Math.abs(amount)}ml 饮水`);
    } catch (err) {
      showToast('保存饮水记录失败');
    }
  };

  const deleteWaterLog = async (id: number) => {
    try {
      const logToDelete = waterLogs.find(l => l.id === id);
      if (logToDelete) {
        await api.water.deleteLog(id);
        setWaterLogs(prev => prev.filter(l => l.id !== id));
        setWaterIntake(prev => Math.max(0, prev - logToDelete.amount_ml));
        showToast('饮水记录已删除');
      }
    } catch (err) {
      showToast('删除失败');
    }
  };

  const toggleWaterSlot = async (id: number) => {
    const slot = waterSlots.find(s => s.id === id);
    if (!slot) return;
    try {
      const updated = await api.water.updateSlot(id, { completed: !slot.completed });
      setWaterSlots(prev => prev.map(s => s.id === id ? updated : s));
    } catch (err) {
      showToast('更新饮水计划失败');
    }
  };

  const toggleTheme = (idx?: number) => {
    if (typeof idx === 'number') {
      setThemeIndex(idx);
    } else {
      setThemeIndex((prev) => (prev + 1) % themes.length);
    }
    showToast(`主题已更改为: ${themes[idx ?? (themeIndex + 1) % themes.length].name}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showToast(isDarkMode ? '已切换至浅色模式' : '已切换至深色模式');
  };

  const addCustomTracker = async () => {
    if (!newTrackerTitle.trim() || !newTrackerTarget) {
      showToast('请填写完整信息');
      return;
    }
    try {
      const newTracker = await api.trackers.create({
        type: newTrackerType,
        title: newTrackerTitle,
        value: 0,
        target: Number(newTrackerTarget),
        unit: newTrackerUnit || '单位'
      });
      setCustomTrackers(prev => [...prev, newTracker]);
      setNewTrackerTitle('');
      setNewTrackerTarget('');
      setNewTrackerUnit('');
      setActiveModal(null);
      showToast('追踪项已添加');
    } catch (err) {
      showToast('添加追踪项失败');
    }
  };

  const deleteCustomTracker = async (id: number) => {
    try {
      await api.trackers.delete(id);
      setCustomTrackers(prev => prev.filter(t => t.id !== id));
      showToast('追踪项已删除');
    } catch (err) {
      showToast('删除追踪项失败');
    }
  };

  const togglePlan = async (id: number) => {
    const plan = plans.find(p => p.id === id);
    if (!plan) return;
    try {
      const updated = await api.plans.update(id, { completed: !plan.completed });
      setPlans(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      showToast('更新计划失败');
    }
  };

  const addPlan = async (title: string, description: string) => {
    try {
      const newPlan = await api.plans.create({ title, description, completed: false });
      setPlans(prev => [newPlan, ...prev]);
      showToast('计划已添加');
    } catch (err) {
      showToast('添加计划失败');
    }
  };

  const deletePlan = async (id: number) => {
    try {
      await api.plans.delete(id);
      setPlans(prev => prev.filter(p => p.id !== id));
      showToast('计划已删除');
    } catch (err) {
      showToast('删除计划失败');
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply theme variables
  const themeStyles = useMemo(() => ({
    '--primary': currentTheme.primary,
    '--primary-container': currentTheme.primaryContainer,
    '--on-primary-container': currentTheme.onPrimaryContainer,
    '--bg': isDarkMode ? '#0a0a0a' : currentTheme.bg,
    '--accent': currentTheme.accent,
  } as React.CSSProperties), [currentTheme, isDarkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login': return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'register': return <RegisterPage onNavigate={setCurrentPage} />;
      case 'dashboard': return (
        <DashboardPage 
          onNavigate={setCurrentPage} 
          onLogAction={setActiveModal}
          waterIntake={waterIntake}
          onAddWater={addWater}
          profile={userProfile}
          goals={goals}
          foodLogs={foodLogs}
          customTrackers={customTrackers}
          greeting={greeting}
          joinDays={joinDays}
          onDeleteFoodLog={deleteFoodLog}
        />
      );
      case 'plan': return (
        <PlanPage 
          onNavigate={setCurrentPage} 
          onShowToast={showToast} 
          waterSlots={waterSlots}
          onToggleWaterSlot={toggleWaterSlot}
          onDeleteWaterLog={deleteWaterLog}
          waterLogs={waterLogs}
          plans={plans}
          onAddPlan={addPlan}
          onDeletePlan={deletePlan}
          onTogglePlan={togglePlan}
        />
      );
      case 'nutrition': return (
        <NutritionPage 
          onNavigate={setCurrentPage} 
          onLogAction={setActiveModal} 
          customTrackers={customTrackers}
          onDeleteTracker={deleteCustomTracker}
          onDeleteWeightLog={deleteWeightLog}
          weightLogs={weightLogs}
        />
      );
      case 'nutrient-detail': return <NutrientDetailPage onNavigate={setCurrentPage} />;
      case 'profile': return (
        <ProfilePage 
          onNavigate={setCurrentPage} 
          onThemeChange={toggleTheme} 
          currentThemeIndex={themeIndex} 
          profile={userProfile}
          onLogout={handleLogout}
          joinDays={joinDays}
          completedCount={completedPlansCount}
        />
      );
      case 'personal-profile': return (
        <PersonalProfilePage 
          onNavigate={setCurrentPage} 
          profile={userProfile}
          onUpdate={(updates) => setUserProfile(prev => ({ ...prev, ...updates }))}
          onSave={updateProfile}
        />
      );
      case 'goal-setting': return (
        <GoalSettingPage 
          onNavigate={setCurrentPage} 
          goals={goals}
          onSave={updateGoal}
        />
      );
      case 'account-management': return <AccountManagementPage onNavigate={setCurrentPage} />;
      case 'help-feedback': return <HelpFeedbackPage onNavigate={setCurrentPage} />;
      default: return <LoginPage onNavigate={setCurrentPage} />;
    }
  };

  const showNav = !['login', 'register'].includes(currentPage);

  return (
    <motion.div 
      key={themeIndex + (isDarkMode ? '-dark' : '-light')}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={themeStyles} 
      className="bg-[var(--bg)] min-h-screen font-sans transition-colors duration-300"
    >
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>

      {showNav && (
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl rounded-t-[3rem] z-50 shadow-2xl border-t border-gray-100 dark:border-gray-900">
          {[
            { id: 'dashboard', icon: Home, label: '首页' },
            { id: 'plan', icon: ClipboardList, label: '计划' },
            { id: 'nutrition', icon: BarChart2, label: '追踪' },
            { id: 'profile', icon: User, label: '我的' }
          ].map((item) => {
            const isActive = currentPage === item.id || (item.id === 'nutrition' && currentPage === 'nutrient-detail');
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-300 ${isActive ? 'bg-[var(--primary)] text-white rounded-full px-6 py-2' : 'text-gray-400 px-4 py-2'}`}
              >
                <item.icon size={isActive ? 20 : 24} className="mb-0.5" />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'block' : 'hidden md:block'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'food'} 
        onClose={() => setActiveModal(null)} 
        title="记录饮食"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {['早餐', '午餐', '晚餐', '零食'].map(type => (
              <button 
                key={type}
                onClick={() => setMealType(type)}
                className={`p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${mealType === type ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-gray-400'}`}
              >
                <Utensils size={24} className={mealType === type ? 'text-[var(--primary)]' : 'text-gray-400'} />
                <span className="font-bold text-sm">{type}</span>
              </button>
            ))}
          </div>
          <Input 
            label="食物名称" 
            placeholder="例如：燕麦牛奶" 
            icon={Search} 
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <div className="flex gap-4">
            <Input 
              label="份量" 
              placeholder="1" 
              type="number" 
              value={foodAmount}
              onChange={(e) => setFoodAmount(e.target.value)}
            />
            <div className="w-32">
              <Input 
                label="单位" 
                placeholder="碗" 
                value={foodUnit}
                onChange={(e) => setFoodUnit(e.target.value)}
              />
            </div>
          </div>
          <Button fullWidth onClick={addFoodLog}>保存记录</Button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'weight'} 
        onClose={() => setActiveModal(null)} 
        title="测体重"
      >
        <div className="space-y-6 text-center">
          <div className="py-8">
            <span className="text-6xl font-black text-gray-800 dark:text-gray-100">{currentWeight}</span>
            <span className="text-2xl font-bold text-[var(--primary)] ml-2">kg</span>
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setCurrentWeight(prev => Math.max(0, Number((prev - 0.1).toFixed(1))))}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              <Minus size={20} />
            </button>
            <button 
              onClick={() => setCurrentWeight(prev => Number((prev + 0.1).toFixed(1)))}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <Button fullWidth onClick={addWeightLog}>更新体重</Button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'custom-tracker'} 
        onClose={() => setActiveModal(null)} 
        title="添加自定义追踪"
      >
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">追踪类型</label>
              <div className="grid grid-cols-3 gap-3">
                {['维生素', '矿物质', '其他'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => setNewTrackerType(type)}
                    className={`py-3 px-2 rounded-2xl border-2 transition-all font-bold text-xs ${
                      newTrackerType === type 
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                        : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Input 
                label="追踪名称" 
                placeholder="例如：维生素 D3" 
                value={newTrackerTitle}
                onChange={(e) => setNewTrackerTitle(e.target.value)}
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input 
                    label="目标值" 
                    placeholder="100" 
                    type="number" 
                    value={newTrackerTarget}
                    onChange={(e) => setNewTrackerTarget(e.target.value)}
                  />
                </div>
                <div className="w-32">
                  <Input 
                    label="单位" 
                    placeholder="IU" 
                    value={newTrackerUnit}
                    onChange={(e) => setNewTrackerUnit(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">提醒设置</span>
                <div className="w-8 h-4 bg-[var(--primary)] rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500">开启后，系统将在每日固定时间提醒您记录该项数据。</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setActiveModal(null)}>取消</Button>
            <Button fullWidth onClick={addCustomTracker}>确认添加</Button>
          </div>
        </div>
      </Modal>

      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />

      {/* Floating Theme/Dark Toggle for Demo */}
      <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2">
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </motion.div>
  );
}
