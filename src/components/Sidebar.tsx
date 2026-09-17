/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Heart, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  Users, 
  Clock, 
  Gift, 
  Layers, 
  Trash2, 
  FileText,
  Building,
  Menu,
  X,
  LogOut,
  Globe
} from 'lucide-react';
import { Workspace } from '../types';
import { Language, translations } from '../data/translations';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  workspace: Workspace;
  currentUser: 'Ami' | 'Ardhi';
  onToggleUser: (user?: 'Ami' | 'Ardhi') => void;
  deletedCounts: {
    tasks: number;
    budgets: number;
    vendors: number;
    guests: number;
    seserahans: number;
  };
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onOpenExitDemoModal?: () => void;
}

export default function Sidebar({ 
  currentTab, 
  onChangeTab, 
  workspace, 
  currentUser, 
  onToggleUser,
  deletedCounts,
  mobileOpen,
  setMobileOpen,
  lang,
  onToggleLang,
  onOpenExitDemoModal
}: SidebarProps) {
  const t = translations[lang];

  // Calculate wedding countdown
  const getCountdown = () => {
    const wedding = new Date(workspace.weddingDate);
    const today = new Date('2026-06-19'); // Local date from mock metadata
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getCountdown();

  const menuItems = [
    { id: 'dashboard', label: t.tabDashboard, icon: Layers },
    { id: 'checklist', label: t.tabChecklist, icon: CheckSquare },
    { id: 'budget', label: t.tabBudget, icon: DollarSign },
    { id: 'vendor', label: t.tabVendor, icon: Building },
    { id: 'guests', label: t.tabGuests, icon: Users },
    { id: 'rundown', label: t.tabRundown, icon: Clock },
    { id: 'seserahan', label: t.tabSeserahan, icon: Gift },
    { id: 'media', label: t.tabMedia, icon: FileText },
  ];

  const totalTrash = deletedCounts.tasks + deletedCounts.budgets + deletedCounts.vendors + deletedCounts.guests + deletedCounts.seserahans;

  const partnerAName = workspace.partnerAName || 'Ami';
  const partnerBName = workspace.partnerBName || 'Ardhi';

  const content = (
    <div className="flex flex-col h-full justify-between pb-6 select-none">
      {/* Brand, Language Switcher & Workspace Info */}
      <div className="space-y-4">
        
        {/* Brand Row + Language Switcher */}
        <div className="flex items-center justify-between border-b border-[#E8DDD9] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-[#1C3E33] rounded-2xl flex items-center justify-center shadow-xs">
              <Heart className="w-4.5 h-4.5 text-[#ECC3D3] fill-[#ECC3D3]" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#0D1C17] font-sans leading-tight">SatuHari</h2>
              <p className="text-[9px] text-[#BA3444] font-mono tracking-wider uppercase font-extrabold">{t.appTagline}</p>
            </div>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center p-0.5 bg-[#FAF5F5] rounded-xl border border-[#E8DDD9]">
            <button
              id="btn-lang-id"
              type="button"
              onClick={() => onToggleLang('id')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-0 ${
                lang === 'id' 
                  ? 'bg-[#1C3E33] text-white shadow-xs' 
                  : 'text-[#788A82] hover:text-[#0D1C17]'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              id="btn-lang-en"
              type="button"
              onClick={() => onToggleLang('en')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-0 ${
                lang === 'en' 
                  ? 'bg-[#1C3E33] text-white shadow-xs' 
                  : 'text-[#788A82] hover:text-[#0D1C17]'
              }`}
              title="English"
            >
              EN
            </button>
          </div>
        </div>

        {/* Wedding Status Card */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#E8DDD9] space-y-1.5 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#BA3444] font-mono">{t.dreamWedding}</span>
          <h3 className="text-sm font-bold text-[#0D1C17]">
            {partnerAName} & {partnerBName}
          </h3>
          
          <div className="space-y-1 text-xs text-[#2D3D36] font-medium">
            <p className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#1C3E33]" /> 
              {new Date(workspace.weddingDate).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-[11px] bg-[#1C3E33]/10 text-[#1C3E33] font-mono inline-block font-semibold px-2.5 py-0.5 rounded-full mt-0.5">
              ⌛ {daysRemaining > 0 ? `${daysRemaining} ${t.daysRemaining}` : t.weddingDayArrived}
            </p>
          </div>
        </div>

        {/* REFINED, INTUITIVE ROLE / PERSPECTIVE SWITCHER */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#E8DDD9] space-y-2.5 shadow-xs">
          <div className="flex items-center">
            <span className="text-[10px] font-extrabold text-[#0D1C17] uppercase tracking-wider font-mono flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5 text-[#1C3E33]" />
              {t.perspectiveTitle}
            </span>
          </div>

          {/* Segmented Switcher for Both Partners */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF5F5] rounded-xl border border-[#E8DDD9]">
            <button
              type="button"
              id="btn-switch-user"
              onClick={() => onToggleUser('Ami')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer border-0 ${
                currentUser === 'Ami'
                  ? 'bg-[#BA3444] text-white shadow-xs font-bold'
                  : 'text-[#2D3D36] hover:bg-white hover:text-[#0D1C17]'
              }`}
              title={`${t.switchPartner}: ${partnerAName}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                currentUser === 'Ami' ? 'bg-white/20 text-white' : 'bg-[#BA3444] text-white'
              }`}>
                {partnerAName ? partnerAName.charAt(0).toUpperCase() : 'A'}
              </span>
              <span className="text-xs font-bold truncate max-w-[70px]">{partnerAName}</span>
            </button>

            <button
              type="button"
              id="btn-switch-user-secondary"
              onClick={() => onToggleUser('Ardhi')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer border-0 ${
                currentUser === 'Ardhi'
                  ? 'bg-[#1C3E33] text-white shadow-xs font-bold'
                  : 'text-[#2D3D36] hover:bg-white hover:text-[#0D1C17]'
              }`}
              title={`${t.switchPartner}: ${partnerBName}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                currentUser === 'Ardhi' ? 'bg-white/20 text-white' : 'bg-[#1C3E33] text-white'
              }`}>
                {partnerBName ? partnerBName.charAt(0).toUpperCase() : 'A'}
              </span>
              <span className="text-xs font-bold truncate max-w-[70px]">{partnerBName}</span>
            </button>
          </div>

          <p className="text-[10px] text-[#788A82] text-center font-medium leading-tight">
            {t.actingAs} <strong className="text-[#0D1C17]">{currentUser}</strong> ({currentUser === 'Ami' ? t.partnerRoleBride : t.partnerRoleGroom})
          </p>
        </div>

        {/* Navigation items */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-[#788A82] uppercase tracking-widest block font-mono pl-2 mb-1.5">
            {t.menuWorkspace}
          </span>
          
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    onChangeTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border-0 ${isActive ? 'bg-[#1C3E33] text-[#F7F1F0] shadow-xs font-semibold' : 'text-[#2D3D36] hover:bg-[#E8DDD9]/50 hover:text-[#0D1C17]'}`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#ECC3D3]' : 'text-[#788A82]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Trash/Archive & Exit Demo at bottom */}
      <div className="space-y-2 pt-3 border-t border-[#E8DDD9]">
        <button
          id="nav-tab-trash"
          onClick={() => {
            onChangeTab('trash');
            setMobileOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer border-0 ${currentTab === 'trash' ? 'bg-red-50 text-red-950 font-bold border border-red-200/50' : 'text-[#2D3D36] hover:bg-red-50/40 hover:text-red-700'}`}
        >
          <span className="flex items-center space-x-2.5">
            <Trash2 className="w-4 h-4 text-[#788A82]" />
            <span>{t.tabTrash}</span>
          </span>
          {totalTrash > 0 && (
            <span className="bg-red-100 text-red-800 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-full border border-red-200">
              {totalTrash}
            </span>
          )}
        </button>

        {/* Exit Demo button in sidebar for fast access */}
        {workspace.isDemo && onOpenExitDemoModal && (
          <button
            id="btn-sidebar-quit-demo"
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenExitDemoModal();
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[#FAF5F5] hover:bg-red-50 text-[#788A82] hover:text-red-700 border border-[#E8DDD9] hover:border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.exitDemoBtn}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Panel Header */}
      <div className="lg:hidden h-14 bg-[#F2E9E8] border-b border-[#E8DDD9] px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40 shadow-xs">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-[#BA3444] fill-[#BA3444]" />
          <span className="font-bold text-[#0D1C17]">SatuHari</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center p-0.5 bg-[#FAF5F5] rounded-lg border border-[#E8DDD9]">
            <button
              onClick={() => onToggleLang('id')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border-0 ${lang === 'id' ? 'bg-[#1C3E33] text-white' : 'text-[#788A82]'}`}
            >
              ID
            </button>
            <button
              onClick={() => onToggleLang('en')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border-0 ${lang === 'en' ? 'bg-[#1C3E33] text-white' : 'text-[#788A82]'}`}
            >
              EN
            </button>
          </div>

          <span className="text-[11px] bg-[#1C3E33]/10 text-[#1C3E33] px-2.5 py-0.5 rounded-full font-mono font-semibold">
            {currentUser}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 hover:bg-[#E8DDD9]/40 rounded-lg text-[#0D1C17] transition border-0 cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 bg-[#F2E9E8] border-r border-[#E8DDD9] p-5 flex-shrink-0 h-screen fixed left-0 top-0 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Backdrop and Drawer */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#0D1C17]/40 backdrop-blur-xs z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#F2E9E8] p-5 z-50 transform transition-transform duration-300 ease-in-out border-r border-[#E8DDD9] overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {content}
      </aside>
    </>
  );
}

