/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Send, 
  Users, 
  CheckCircle,
  Copy,
  FolderLock
} from 'lucide-react';
import { Workspace } from '../types';
import { Language } from '../data/translations';
import { formatRupiah, formatNumberWithDots, parseRupiah } from '../utils/currency';

interface OnboardingProps {
  onSelectGuestMode: () => void;
  onCreateWorkspace: (workspaceData: Omit<Workspace, 'id' | 'createdAt' | 'inviteStatus' | 'inviteMethod'>) => void;
  onSimulateJoin?: () => void;
  pendingWorkspace?: Workspace | null;
  lang?: Language;
  onToggleLang?: (lang: Language) => void;
}

export default function Onboarding({ 
  onSelectGuestMode, 
  onCreateWorkspace, 
  pendingWorkspace,
  onSimulateJoin,
  lang = 'id',
  onToggleLang
}: OnboardingProps) {
  const [mode, setMode] = useState<'welcome' | 'create_form' | 'invite_screen'>('welcome');
  
  // Form states
  const [partnerAName, setPartnerAName] = useState('');
  const [partnerBName, setPartnerBName] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-10-17');
  const [city, setCity] = useState('');
  const [estimatedGuests, setEstimatedGuests] = useState<number>(300);
  const [estimatedBudget, setEstimatedBudget] = useState<number>(200000000);
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteMethodUsed, setInviteMethodUsed] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerAName || !partnerBName || !city) {
      alert('Mohon lengkapi semua data wajib ya! ❤️');
      return;
    }
    onCreateWorkspace({
      partnerAName,
      partnerBName,
      weddingDate,
      city,
      estimatedGuests,
      estimatedBudget,
      isDemo: false
    });
    setMode('invite_screen');
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setInviteMethodUsed('Tautan Undangan');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F1F0] flex flex-col justify-between text-[#2D3D36] font-sans relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#BA3444]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1C3E33]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-12 translate-y-12"></div>

      {/* Header */}
      <header id="onboarding-header" className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#1C3E33] rounded-xl flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 text-[#F7F1F0] fill-[#F7F1F0]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0D1C17]">SatuHari</h1>
            <p className="text-[10px] text-[#BA3444] font-mono tracking-widest uppercase font-extrabold">Workspace Pasangan</p>
          </div>
        </div>
        {onToggleLang && (
          <div className="flex items-center p-0.5 bg-white rounded-xl border border-[#E8DDD9] shadow-2xs">
            <button
              id="btn-onboarding-lang-id"
              type="button"
              onClick={() => onToggleLang('id')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                lang === 'id' 
                  ? 'bg-[#1C3E33] text-white shadow-xs' 
                  : 'text-[#788A82] hover:text-[#0D1C17]'
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              id="btn-onboarding-lang-en"
              type="button"
              onClick={() => onToggleLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                lang === 'en' 
                  ? 'bg-[#1C3E33] text-white shadow-xs' 
                  : 'text-[#788A82] hover:text-[#0D1C17]'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex-grow flex items-center justify-center relative z-10">
        
        {mode === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-6">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1C3E33]/10 text-[#1C3E33] border border-[#1C3E33]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#1C3E33] mr-1" />
                Workspace Kolaboratif Pernikahan Anda
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0D1C17] tracking-tight leading-11">
                Merencanakan <br />
                <span className="text-[#1C3E33] font-extrabold underline decoration-[#BA3444] decoration-4">Hari Bahagia</span>, Bersama.
              </h2>
              <p className="text-[#2D3D36] leading-relaxed text-base">
                SatuHari adalah ruang kerja bersama yang dirancang khusus untuk pasangan Indonesia. Kelola anggaran katering, vendor dekorasi, silsilah tamu undangan, susunan rundown, hingga parcel hantaran seserahan secara transparan dan berdua.
              </p>
              
              <blockquote className="border-l-4 border-[#BA3444] pl-4 py-2 italic text-[#2D3D36] bg-white border-y border-r border-[#E8DDD9] rounded-r-xl max-w-md shadow-2xs">
                "Bukan untuk saya. Untuk kita."
              </blockquote>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  id="btn-create-workspace-onboard"
                  onClick={() => setMode('create_form')}
                  className="px-6 py-3 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] rounded-xl shadow-xs transition-all duration-200 font-semibold flex items-center justify-center group cursor-pointer border-0"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buat Workspace Baru
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  id="btn-explore-demo-onboard"
                  onClick={onSelectGuestMode}
                  className="px-6 py-3 bg-white border border-[#E8DDD9] hover:bg-[#FAF5F5] text-[#0D1C17] rounded-xl shadow-2xs transition-all duration-200 font-semibold flex items-center justify-center group cursor-pointer"
                >
                  <Users className="w-5 h-5 mr-2 text-[#788A82]" />
                  Eksplor Mode Tamu / Demo
                </button>
              </div>

              <div className="pt-4 border-t border-[#E8DDD9] mt-2">
                <h4 className="text-xs font-semibold text-[#788A82] uppercase tracking-wider mb-2 font-mono">Didukung Fitur Lengkap:</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#2D3D36]">
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-700 mr-2" /> Checklist Persiapan</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-700 mr-2" /> Anggaran Rupiah</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-700 mr-2" /> Manajemen Vendor</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-700 mr-2" /> Daftar Tamu & Meja</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-700 mr-2" /> Susunan Rundown</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-700 mr-2" /> Buku Seserahan</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Feature Cards (Mockups stacked elegantly) */}
            <div className="relative flex justify-center items-center">
              <div className="w-full max-w-md bg-white border border-[#E8DDD9] rounded-3xl shadow-md p-6 relative z-10 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-center pb-4 border-b border-[#E8DDD9] mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  </div>
                  <span className="text-xs bg-[#FAF5F5] text-[#1C3E33] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#E8DDD9]">Pratinjau Studio</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#FAF5F5] rounded-2xl border border-[#E8DDD9]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-[#0D1C17]">Total Anggaran (Estimasi)</span>
                      <span className="text-xxs px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium rounded-full">Terkontrol</span>
                    </div>
                    <span className="text-lg font-bold text-[#0D1C17]">{formatRupiah(350000000)}</span>
                    <div className="w-full bg-[#E8DDD9] h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#1C3E33] h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#788A82]">Aktivitas Terakhir Workspace:</span>
                    <div className="p-3 bg-[#FAF5F5] rounded-xl border border-[#E8DDD9] space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-[#BA3444]/15 text-[#BA3444] rounded-full flex items-center justify-center text-[10px] font-bold">A</span>
                        <p className="text-[#2D3D36]"><span className="font-bold text-[#0D1C17]">Ami</span> menyelesaikan checklist <span className="italic">Katering Prasmanan</span></p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-[#1C3E33]/15 text-[#1C3E33] rounded-full flex items-center justify-center text-[10px] font-bold">A</span>
                        <p className="text-[#2D3D36]"><span className="font-bold text-[#0D1C17]">Ardhi</span> memesan <span className="font-medium">Venue Gedung</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-[#788A82] pt-2 border-t border-[#E8DDD9] font-mono">
                    <span>Target: 17 Okt 2026</span>
                    <span>120 Hari Lagi</span>
                  </div>
                </div>
              </div>

              {/* Offset decorative cards */}
              <div className="absolute top-10 left-10 w-full max-w-md bg-stone-200/40 border border-stone-300/40 rounded-3xl h-64 -rotate-3 -z-10"></div>
              <div className="absolute -bottom-6 -right-4 w-40 h-40 bg-[#BA3444]/10 rounded-full filter blur-2xl"></div>
            </div>
          </div>
        )}

        {mode === 'create_form' && (
          <div className="w-full max-w-xl bg-white border border-[#E8DDD9] rounded-3xl shadow-md p-8 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-[#0D1C17] mb-2">Mulai Langkah Bahagia</h3>
            <p className="text-sm text-[#788A82] mb-6">Letakkan informasi dasar perencanaan pernikahan Anda untuk menginisiasi workspace kolaboratif.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1C17] mb-1">Nama Calon Mempelai Wanita *</label>
                  <input
                    id="input-partner-a"
                    type="text"
                    required
                    placeholder="Contoh: Ami"
                    value={partnerAName}
                    onChange={(e) => setPartnerAName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8DDD9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1C17] mb-1">Nama Calon Mempelai Pria *</label>
                  <input
                    id="input-partner-b"
                    type="text"
                    required
                    placeholder="Contoh: Ardhi"
                    value={partnerBName}
                    onChange={(e) => setPartnerBName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8DDD9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1C17] mb-1">Rencana Tanggal Perhelatan *</label>
                  <input
                    id="input-wedding-date"
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8DDD9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1C17] mb-1">Kota / Lokasi Acara *</label>
                  <input
                    id="input-city"
                    type="text"
                    required
                    placeholder="Contoh: Jakarta Selatan / Surabaya"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8DDD9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1C17] mb-1">Estimasi Jumlah Undangan (Tamu)</label>
                  <input
                    id="input-estimated-guests"
                    type="number"
                    min="1"
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-[#E8DDD9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17]"
                  />
                  <span className="text-[10px] text-[#788A82]">Tip: Jumlah tamu × 2 untuk porsi catering</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1C17] mb-1">Estimasi Total Anggaran</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-[#788A82] font-mono font-bold">Rp</span>
                    <input
                      id="input-estimated-budget"
                      type="text"
                      value={formatNumberWithDots(estimatedBudget)}
                      onChange={(e) => setEstimatedBudget(parseRupiah(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border border-[#E8DDD9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17] font-mono font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-[#1C3E33] font-semibold font-mono mt-1 block">
                    {formatRupiah(estimatedBudget)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#E8DDD9]">
                <button
                  type="button"
                  onClick={() => setMode('welcome')}
                  className="flex-1 py-2.5 px-4 border border-[#E8DDD9] rounded-xl text-sm font-semibold hover:bg-[#FAF5F5] text-[#0D1C17] transition cursor-pointer bg-white"
                >
                  Kembali
                </button>
                <button
                  id="btn-submit-create-workspace"
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer border-0"
                >
                  Langkah Berikutnya
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === 'invite_screen' && pendingWorkspace && (
          <div className="w-full max-w-xl bg-white border border-[#E8DDD9] rounded-3xl shadow-md p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#1C3E33]/10 rounded-full flex items-center justify-center mx-auto text-[#1C3E33] animate-pulse border border-[#1C3E33]/20">
              <Users className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#0D1C17]">Workspace Berhasil Diinisiasi!</h3>
              <p className="text-[#2D3D36] text-sm max-w-md mx-auto">
                Tautkan impian Anda bersama pasangan. Untuk membuka semua modul, undang pasangan Anda (<span className="font-semibold text-[#BA3444]">{pendingWorkspace.partnerBName}</span>) untuk bergabung di ruang kerja ini.
              </p>
            </div>

            <div className="p-4 bg-[#FAF5F5] rounded-2xl border border-[#E8DDD9] text-left space-y-3">
              <p className="text-xs font-bold text-[#0D1C17] uppercase tracking-wide font-mono">Status Tautan Pasangan:</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2D3D36] flex items-center">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-2 inline-block"></span>
                  Menunggu {pendingWorkspace.partnerBName} Bergabung
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 py-0.5 px-2.5 rounded-full font-mono font-bold border border-amber-200">PENDING</span>
              </div>
              <div className="text-xs text-[#BA3444] bg-[#BA3444]/5 p-2.5 rounded-xl border border-[#BA3444]/20">
                🔒 Modul database saat ini dalam mode terkunci (terproteksi) hingga pasangan Anda mengaktifkan tautan ini.
              </div>
            </div>

            {/* Simulated Share Options Grid */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#788A82] uppercase tracking-widest block font-mono">Metode Pembagian Tautan</span>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-invite-wa"
                  onClick={() => {
                    setInviteMethodUsed('WhatsApp');
                    alert(`Mensimulasikan pesan WhatsApp terkirim ke ${pendingWorkspace.partnerBName}! 📱`);
                  }}
                  className={`p-3 border text-sm font-semibold rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${inviteMethodUsed === 'WhatsApp' ? 'bg-[#1C3E33]/10 border-[#1C3E33]/35 text-[#1C3E33]' : 'bg-[#FAF5F5] border-[#E8DDD9] hover:border-[#1C3E33] hover:bg-[#F2E9E8]'}`}
                >
                  <span className="text-lg mb-1">📱</span>
                  WhatsApp
                </button>

                <button
                  id="btn-invite-email"
                  onClick={() => {
                    setInviteMethodUsed('Email Pernikahan');
                    alert(`Mensimulasikan undangan email resmi terkirim ke ${pendingWorkspace.partnerBName}! 📧`);
                  }}
                  className={`p-3 border text-sm font-semibold rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${inviteMethodUsed === 'Email Pernikahan' ? 'bg-[#BA3444]/10 border-[#BA3444]/35 text-[#BA3444]' : 'bg-[#FAF5F5] border-[#E8DDD9] hover:border-[#BA3444] hover:bg-[#F2E9E8]'}`}
                >
                  <span className="text-lg mb-1">📧</span>
                  Kirim Email
                </button>
              </div>

              {/* Direct share link simulator */}
              <div className="flex items-center space-x-2 mt-4 bg-[#FAF5F5] p-2 rounded-xl border border-[#E8DDD9]">
                <input
                  type="text"
                  readOnly
                  value={`https://satuhari.id/workspace-join/${pendingWorkspace.id}`}
                  className="bg-transparent border-none text-xs font-mono text-[#2D3D36] focus:outline-none flex-grow overflow-ellipsis select-all truncate px-2"
                />
                <button
                  id="btn-copy-invite-link"
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] rounded-lg text-xs font-semibold flex items-center transition cursor-pointer border-0"
                >
                  {copiedLink ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedLink ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            {/* SIMULATE TRIGGER BUTTON */}
            <div className="pt-6 border-t border-[#E8DDD9] flex flex-col items-center">
              <p className="text-xs text-[#788A82] mb-3 block">
                💡 <span className="font-semibold text-[#0D1C17]">Uji Coba Pengembang</span>: Klik tombol di bawah ini untuk mensimulasikan pasangan Anda menyetujui undangan, mengaktifkan tautan, dan membuka seluruh modul workspace secara kolaboratif!
              </p>
              <button
                id="btn-simulate-partner-join"
                onClick={onSimulateJoin}
                className="w-full py-3 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] rounded-xl text-sm font-bold flex items-center justify-center shadow-xs transition transform active:scale-95 cursor-pointer border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simulasikan: {pendingWorkspace.partnerBName} Bergabung Sekarang!
              </button>
              
              <button
                type="button"
                onClick={() => setMode('create_form')}
                className="text-xs text-[#788A82] hover:text-[#0D1C17] hover:underline mt-4 cursor-pointer"
              >
                Kembali Ubah Detail Acara
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E8DDD9] bg-white/50 text-center text-xs text-[#788A82] relative z-10 font-mono">
        <p>© 2026 SatuHari — Merencanakan Hari Bahagia, Bersama.</p>
        <p className="mt-1 text-[10px] text-[#788A82]/80">Dirancang khusus untuk Adat, Tradisi & Keuangan Pasangan Indonesia</p>
      </footer>
    </div>
  );
}
