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
  UserCheck,
  Building,
  Menu,
  X
} from 'lucide-react';
import { Workspace } from '../types';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  workspace: Workspace;
  currentUser: 'Ami' | 'Ardhi';
  onToggleUser: () => void;
  deletedCounts: {
    tasks: number;
    budgets: number;
    vendors: number;
    guests: number;
    seserahans: number;
  };
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ 
  currentTab, 
  onChangeTab, 
  workspace, 
  currentUser, 
  onToggleUser,
  deletedCounts,
  mobileOpen,
  setMobileOpen
}: SidebarProps) {
  
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
    { id: 'dashboard', label: 'Ringkasan', icon: Layers },
    { id: 'checklist', label: 'Checklist Persiapan', icon: CheckSquare },
    { id: 'budget', label: 'Keuangan & Anggaran', icon: DollarSign },
    { id: 'vendor', label: 'Manajemen Vendor', icon: Building },
    { id: 'guests', label: 'Daftar Tamu (Tamu)', icon: Users },
    { id: 'rundown', label: 'Rundown Acara', icon: Clock },
    { id: 'seserahan', label: 'Buku Seserahan', icon: Gift },
    { id: 'media', label: 'Lampiran Berkas', icon: FileText },
  ];

  const totalTrash = deletedCounts.tasks + deletedCounts.budgets + deletedCounts.vendors + deletedCounts.guests + deletedCounts.seserahans;

  const content = (
    <div className="flex flex-col h-full justify-between pb-6 select-none">
      {/* Brand & Workspace Info */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#E8E2D9] pb-5">
          <div className="w-10 h-10 bg-[#6B705C] rounded-xl flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-[#FDFBF7] fill-[#FDFBF7]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#2D312E] font-sans">SatuHari</h2>
            <p className="text-[10px] text-[#6B705C] font-mono tracking-widest uppercase font-extrabold">Wedding Workspace</p>
          </div>
        </div>

        {/* Wedding Status Card */}
        <div className="p-4 bg-white rounded-2xl border border-[#E8E2D9] space-y-2 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#CB997E] font-mono">Pernikahan Impian</span>
          <h3 className="text-sm font-bold text-[#2D312E]">
            {workspace.partnerAName} & {workspace.partnerBName}
          </h3>
          
          <div className="space-y-1 text-xs text-[#4A4A4A] font-medium">
            <p className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-[#6B705C]" /> {new Date(workspace.weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-[11px] bg-[#6B705C]/10 text-[#6B705C] font-mono inline-block font-semibold px-2.5 py-0.5 rounded-full mt-1">
              ⌛ {daysRemaining > 0 ? `${daysRemaining} Hari Lagi` : 'Hari Bahagia Telah Tiba!'}
            </p>
          </div>
        </div>

        {/* Role Avatar Switcher (Super Interactive!) */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#E8E2D9] space-y-2 shadow-xs">
          <span className="text-[9px] font-bold text-[#A5A58D] uppercase tracking-widest block font-mono">Bekerja Sebagai (Simulasi):</span>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentUser === 'Ami' ? 'bg-[#CB997E] text-white ring-2 ring-[#CB997E]/30' : 'bg-[#6B705C] text-white ring-2 ring-[#6B705C]/30'}`}>
                {currentUser[0]}
              </span>
              <div>
                <span className="text-xs font-bold text-[#2D312E] block">{currentUser}</span>
                <span className="text-[10px] text-[#A5A58D] font-mono">Status: Pasangan Aktif</span>
              </div>
            </div>

            <button
              id="btn-switch-user"
              onClick={onToggleUser}
              className="px-2.5 py-1.5 bg-[#6B705C] hover:bg-[#5C614E] text-[#FDFBF7] rounded-xl text-[10px] font-bold flex items-center transition cursor-pointer shadow-xs border-0"
              title="Ganti sudut pandang pengerjaan Ami/Ardhi"
            >
              <UserCheck className="w-3 h-3 mr-1" />
              Peran
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-[#A5A58D] uppercase tracking-widest block font-mono pl-2 mb-2">Modul Workspace</span>
          
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
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#6B705C] text-[#FDFBF7] shadow-sm font-semibold' : 'text-[#4A4A4A] hover:bg-[#E8E2D9]/40 hover:text-[#2D312E]'}`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#FDFBF7]' : 'text-[#A5A58D]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Trash/Archive & Settings at bottom */}
      <div className="space-y-1 pt-4 border-t border-[#E8E2D9]">
        <button
          id="nav-tab-trash"
          onClick={() => {
            onChangeTab('trash');
            setMobileOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${currentTab === 'trash' ? 'bg-red-50 text-red-950 font-bold border border-red-200/50' : 'text-[#4A4A4A] hover:bg-red-50/20 hover:text-red-700'}`}
        >
          <span className="flex items-center space-x-2.5">
            <Trash2 className="w-4 h-4 text-[#A5A58D] group-hover:text-red-500" />
            <span>Riwayat Sampah (Soft Delete)</span>
          </span>
          {totalTrash > 0 && (
            <span className="bg-red-200 text-red-900 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-full">
              {totalTrash}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Panel Header */}
      <div className="lg:hidden h-14 bg-[#F5F2ED] border-b border-[#E8E2D9] px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-[#6B705C] fill-[#6B705C]" />
          <span className="font-bold text-[#2D312E]">SatuHari</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] bg-[#6B705C]/10 text-[#6B705C] px-2.5 py-0.5 rounded-full font-mono font-semibold">
            {currentUser}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 hover:bg-[#E8E2D9]/40 rounded-lg text-zinc-700 transition"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 bg-[#F5F2ED] border-r border-[#E8E2D9] p-6 flex-shrink-0 h-screen fixed left-0 top-0 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Backdrop and Drawer */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#F5F2ED] p-6 z-50 transform transition-transform duration-300 ease-in-out border-r border-[#E8E2D9] overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {content}
      </aside>
    </>
  );
}
