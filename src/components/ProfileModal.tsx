import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  User,
  Camera,
  Upload,
  Cloud,
  Download,
  UploadCloud,
  Check,
  Droplets,
  Footprints,
  Heart,
  Scale,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useApp, DEFAULT_CARTOON_AVATAR } from '../context/AppContext';
import { UnitSystem, ThemeMode, Language } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartoonAvatar {
  id: string;
  name: string;
  tag: string;
  url: string;
}

export const CARTOON_AVATARS: CartoonAvatar[] = [
  {
    id: 'cartoon-runner',
    name: 'Runner Alex',
    tag: 'Athletic Runner',
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9',
  },
  {
    id: 'cartoon-milo',
    name: 'Speedster Milo',
    tag: 'Speed Pacer',
    url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Milo&backgroundColor=ffd5dc,ffdfbf',
  },
  {
    id: 'cartoon-bot',
    name: 'CyberFit Bot',
    tag: 'AI Companion',
    url: 'https://api.dicebear.com/9.x/bottts/svg?seed=CyberFit&backgroundColor=c0aede,ffd5dc',
  },
  {
    id: 'cartoon-zen',
    name: 'Zen Droplet',
    tag: 'Hydra Master',
    url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=HydrateWater&backgroundColor=b6e3f4',
  },
  {
    id: 'cartoon-explorer',
    name: 'Cosmic Fit',
    tag: 'Endurance',
    url: 'https://api.dicebear.com/9.x/micah/svg?seed=FitExplorer&backgroundColor=d1d4f9',
  },
  {
    id: 'cartoon-dash',
    name: 'Champion Dash',
    tag: 'HIIT & Sprint',
    url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Dash&clothing=graphicShirt&top=shortHairShortFlat',
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    updateProfile,
    backupToCloud,
    exportBackupJson,
    restoreBackupJson,
    cloudSyncStatus,
    t,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userProfile?.name ?? 'Alex Rivera');
  const [email, setEmail] = useState(userProfile?.email ?? 'alex.rivera@example.com');
  const [waterGoalMl, setWaterGoalMl] = useState((userProfile?.waterGoalMl ?? 2800).toString());
  const [stepGoal, setStepGoal] = useState((userProfile?.dailyStepGoal ?? userProfile?.stepGoal ?? 10000).toString());
  const [currentWeight, setCurrentWeight] = useState((userProfile?.currentWeightKg ?? 68.5).toString());
  const [targetWeight, setTargetWeight] = useState((userProfile?.targetWeightKg ?? 65.0).toString());
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(userProfile?.unitSystem ?? 'metric');
  const [theme, setTheme] = useState<ThemeMode>(userProfile?.theme ?? 'dark');
  const [language, setLanguage] = useState<Language>(userProfile?.language ?? 'en');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && userProfile) {
      setName(userProfile.name ?? 'Alex Rivera');
      setEmail(userProfile.email ?? 'alex.rivera@example.com');
      setWaterGoalMl((userProfile.waterGoalMl ?? 2800).toString());
      setStepGoal((userProfile.dailyStepGoal ?? userProfile.stepGoal ?? 10000).toString());
      setCurrentWeight((userProfile.currentWeightKg ?? 68.5).toString());
      setTargetWeight((userProfile.targetWeightKg ?? 65.0).toString());
      setUnitSystem(userProfile.unitSystem ?? 'metric');
      setTheme(userProfile.theme ?? 'dark');
      setLanguage(userProfile.language ?? 'en');
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProfile({ avatarUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        restoreBackupJson(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedStepGoal = parseInt(stepGoal, 10) || 10000;
    updateProfile({
      name: name.trim() || userProfile.name,
      email: email.trim() || userProfile.email,
      waterGoalMl: parseInt(waterGoalMl, 10) || 2800,
      dailyStepGoal: parsedStepGoal,
      stepGoal: parsedStepGoal,
      currentWeightKg: parseFloat(currentWeight) || 68.5,
      targetWeightKg: parseFloat(targetWeight) || 65.0,
      unitSystem,
      theme,
      language,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {t('userProfile')} & Settings
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Hydration target, step goals, units, and cloud sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* User Photo & Cartoon Avatar Customization */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-4 border-emerald-500/70 shadow-md bg-zinc-200 dark:bg-zinc-700">
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                  title="Upload picture"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  Upload
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Profile Cartoon Picture
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Cartoon Active</span>
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                  Select your favorite cartoon fitness character or upload your own:
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => updateProfile({ avatarUrl: DEFAULT_CARTOON_AVATAR })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-200/80 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                    title="Reset to default cartoon avatar"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Cartoon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{t('uploadPhoto')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cartoon Characters Grid */}
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2.5">
                Choose Cartoon Character
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CARTOON_AVATARS.map((cartoon) => {
                  const isSelected = userProfile.avatarUrl === cartoon.url;
                  return (
                    <button
                      key={cartoon.id}
                      type="button"
                      onClick={() => updateProfile({ avatarUrl: cartoon.url })}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-zinc-800'
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700">
                        <img
                          src={cartoon.url}
                          alt={cartoon.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <span className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {cartoon.name}
                        </p>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate">
                          {cartoon.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Basic User Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Hydration & Daily Activity Targets */}
          <div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2.5 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Hydration & Fitness Targets</span>
            </h4>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900">
                <label className="block text-xs font-bold text-sky-700 dark:text-sky-300 mb-1">
                  Water Goal (ml / day)
                </label>
                <input
                  type="number"
                  step="100"
                  value={waterGoalMl}
                  onChange={(e) => setWaterGoalMl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-800 border border-sky-300 dark:border-sky-800 text-zinc-900 dark:text-zinc-100 font-bold"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Default: 2,800 ml</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900">
                <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                  Daily Step Goal
                </label>
                <input
                  type="number"
                  step="500"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-800 border border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100 font-bold"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Default: 10,000 steps</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Unit System, Theme & Localization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Measurement Units
              </label>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                <option value="metric">{t('metric')} (km, ml, kg)</option>
                <option value="imperial">{t('imperial')} (miles, oz, lbs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Visual Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeMode)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                <option value="dark">{t('darkMode')}</option>
                <option value="light">{t('lightMode')}</option>
                <option value="system">{t('systemMode')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          {/* Cloud Backup & Data Recovery */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-emerald-500" />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {t('cloudBackup')} & Offline Sync
                </h4>
              </div>
              <span className="text-xs text-zinc-500">
                Status: <strong className="text-emerald-500">{cloudSyncStatus}</strong>
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Your water history, walking & running sessions, heart metrics, and watch configuration are securely synchronized.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => backupToCloud()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{t('backupNow')}</span>
              </button>

              <button
                type="button"
                onClick={exportBackupJson}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('exportJson')}</span>
              </button>

              <button
                type="button"
                onClick={() => restoreInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{t('restoreData')}</span>
              </button>

              <input
                type="file"
                ref={restoreInputRef}
                accept=".json"
                className="hidden"
                onChange={handleRestoreFile}
              />
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            ) : (
              <span className="text-xs text-zinc-400">Settings saved locally & in cloud</span>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                {t('save')} Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
