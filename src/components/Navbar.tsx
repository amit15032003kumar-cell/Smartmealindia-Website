import React, { useState, useRef, useEffect } from 'react';
import {
  HeartPulse,
  Cloud,
  CloudCheck,
  RotateCw,
  Sun,
  Moon,
  Monitor,
  Check,
  Bell,
  Share2,
  Globe,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, ThemeMode } from '../types';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenShare: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenShare,
  onOpenNotifications,
}) => {
  const {
    userProfile,
    updateProfile,
    cloudSyncStatus,
    lastCloudSyncTime,
    backupToCloud,
    notifications,
    t,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  const themeOptions: { mode: ThemeMode; label: string; description: string; icon: typeof Sun }[] = [
    {
      mode: 'system',
      label: t('systemMode'),
      description: 'Match system theme',
      icon: Monitor,
    },
    {
      mode: 'light',
      label: t('lightMode'),
      description: 'Clean high contrast',
      icon: Sun,
    },
    {
      mode: 'dark',
      label: t('darkMode'),
      description: 'Low-light eye comfort',
      icon: Moon,
    },
  ];

  const handleSelectTheme = (mode: ThemeMode) => {
    updateProfile({ theme: mode });
    setThemeMenuOpen(false);
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
                Smartmeal<span className="text-emerald-600 dark:text-emerald-400">india</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 shrink-0">
                PRO FREE
              </span>
            </div>
            <p className="hidden md:block text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => backupToCloud()}
            title="Click to sync cloud backup"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
          >
            {cloudSyncStatus === 'syncing' ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>{t('syncing')}</span>
              </>
            ) : (
              <>
                <CloudCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="truncate">Cloud: {lastCloudSyncTime}</span>
              </>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Share Milestone */}
          <button
            onClick={onOpenShare}
            aria-label="Share Milestone"
            className="p-1.5 sm:p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Share Milestone"
          >
            <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Language Switcher */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer"
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span className="uppercase text-[11px] sm:text-xs">{userProfile.language}</span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-400" />
            </button>

            {langMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-36 rounded-xl shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 text-xs"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      updateProfile({ language: lang.code });
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                      userProfile.language === lang.code
                        ? 'font-bold text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span>
                      {lang.flag} {lang.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dedicated Theme Toggle Button (System Default / Light / Dark) */}
          <div className="relative" ref={themeMenuRef}>
            <button
              id="theme-toggle-btn"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              aria-label={`Theme mode: currently ${userProfile.theme}. Click to switch between system-default, light, and dark modes`}
              title={`Current Theme: ${userProfile.theme === 'system' ? 'System Default' : userProfile.theme === 'light' ? 'Light' : 'Dark'} (click to change)`}
              aria-haspopup="true"
              aria-expanded={themeMenuOpen}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              {userProfile.theme === 'light' && (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500/20" />
              )}
              {userProfile.theme === 'dark' && (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 fill-indigo-400/20" />
              )}
              {userProfile.theme === 'system' && (
                <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="hidden sm:inline capitalize text-[11px] sm:text-xs">
                {userProfile.theme === 'system' ? 'System' : userProfile.theme}
              </span>
              <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-400 transition-transform ${themeMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {themeMenuOpen && (
              <div
                id="theme-menu-dropdown"
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 text-xs"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                  Appearance
                </div>

                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = userProfile.theme === option.mode;

                  return (
                    <button
                      key={option.mode}
                      id={`theme-option-${option.mode}`}
                      role="menuitem"
                      onClick={() => handleSelectTheme(option.mode)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'font-bold bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs leading-tight">
                            {option.label}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight">
                            {option.description}
                          </span>
                        </div>
                      </div>
                      {isActive && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-1.5 sm:p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
            )}
          </button>

          {/* User Profile Avatar with custom picture */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-0.5 sm:pl-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full"
            aria-label="Open User Profile"
            title="User Profile & Settings"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-emerald-500/70 group-hover:border-emerald-500 transition-all shadow-sm">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
