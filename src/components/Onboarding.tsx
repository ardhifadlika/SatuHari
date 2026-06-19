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

interface OnboardingProps {
  onSelectGuestMode: () => void;
  onCreateWorkspace: (workspaceData: Omit<Workspace, 'id' | 'createdAt' | 'inviteStatus' | 'inviteMethod'>) => void;
  onSimulateJoin?: () => void;
  pendingWorkspace?: Workspace | null;
}

export default function Onboarding({ 
  onSelectGuestMode, 
  onCreateWorkspace, 
  pendingWorkspace,
  onSimulateJoin
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
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#4A4A4A] font-sans relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#CB997E]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6B705C]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-12 translate-y-12"></div>

      {/* Header */}
      <header id="onboarding-header" className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#6B705C] rounded-xl flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 text-[#FDFBF7] fill-[#FDFBF7]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#2D312E]">SatuHari</h1>
            <p className="text-[10px] text-[#CB997E] font-mono tracking-widest uppercase font-extrabold">Workspace Pasangan</p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 bg-[#F5F2ED] rounded-xl text-xs text-[#2D312E] font-semibold border border-[#E8E2D9]">
          🇮🇩 Edisi Indonesia
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex-grow flex items-center justify-center relative z-10">
        
        {mode === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-6">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#6B705C]/10 text-[#6B705C] border border-[#6B705C]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#6B705C] mr-1" />
                Workspace Kolaboratif Pernikahan Anda
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2D312E] tracking-tight leading-11">
                Merencanakan <br />
                <span className="text-[#6B705C] font-extrabold underline decoration-[#CB997E] decoration-4">Hari Bahagia</span>, Bersama.
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base">
                SatuHari adalah ruang kerja bersama yang dirancang khusus untuk pasangan Indonesia. Kelola anggaran katering, vendor dekorasi, silsilah tamu undangan, susunan rundown, hingga parcel hantaran seserahan secara transparan dan berdua.
              </p>
              
              <blockquote className="border-l-4 border-[#CB997E] pl-4 py-1.5 italic text-[#4A4A4A] bg-[#FAF9F5] rounded-r-lg max-w-md">
                "Bukan untuk saya. Untuk kita."
              </blockquote>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  id="btn-create-workspace-onboard"
                  onClick={() => setMode('create_form')}
                  className="px-6 py-3 bg-[#6B705C] hover:bg-[#5C614E] text-[#FDFBF7] rounded-xl shadow-xs transition-all duration-200 font-semibold flex items-center justify-center group cursor-pointer"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buat Workspace Baru
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  id="btn-explore-demo-onboard"
                  onClick={onSelectGuestMode}
                  className="px-6 py-3 bg-white border border-[#E8E2D9] hover:bg-[#F5F2ED] text-[#2D312E] rounded-xl shadow-xs transition-all duration-200 font-semibold flex items-center justify-center group cursor-pointer"
                >
                  <Users className="w-5 h-5 mr-2 text-[#A5A58D]" />
                  Eksplor Mode Tamu / Demo
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-200 mt-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Didukung Fitur Lengkap:</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-zinc-600">
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Checklist Persiapan</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Anggaran Rupiah</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Manajemen Vendor</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Daftar Tamu & Meja</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Susunan Rundown</span>
                  <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Buku Seserahan</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Feature Cards (Mockups stacked elegantly) */}
            <div className="relative flex justify-center items-center">
              <div className="w-full max-w-md bg-white border border-[#E8E2D9] rounded-2xl shadow-md p-6 relative z-10 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9] mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  </div>
                  <span className="text-xs bg-[#F5F2ED] text-[#6B705C] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#E8E2D9]">Pratinjau Studio</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E2D9]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-[#2D312E]">Total Anggaran (Estimasi)</span>
                      <span className="text-xxs px-1.5 py-0.5 bg-[#6B705C]/10 text-[#6B705C] font-medium rounded-full">Terkontrol</span>
                    </div>
                    <span className="text-lg font-bold text-[#2D312E]">Rp 350.000.000</span>
                    <div className="w-full bg-[#E8E2D9] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#6B705C] h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#A5A58D]">Aktivitas Terakhir Workspace:</span>
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E2D9] space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-[#CB997E]/20 text-[#CB997E] rounded-full flex items-center justify-center text-[10px] font-bold">A</span>
                        <p className="text-[#4A4A4A]"><span className="font-bold text-[#2D312E]">Ami</span> menyelesaikan checklist <span className="italic">Katering Prasmanan</span></p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-[#6B705C]/20 text-[#6B705C] rounded-full flex items-center justify-center text-[10px] font-bold">A</span>
                        <p className="text-[#4A4A4A]"><span className="font-bold text-[#2D312E]">Ardhi</span> memesan <span className="font-medium">Venue Gedung</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-stone-400 pt-2 border-t border-stone-100 font-mono">
                    <span>Target: 17 Okt 2026</span>
                    <span>120 Hari Lagi</span>
                  </div>
                </div>
              </div>

              {/* Offset decorative cards */}
              <div className="absolute top-10 left-10 w-full max-w-md bg-stone-100/40 border border-stone-200/50 rounded-2xl h-64 -rotate-3 -z-10"></div>
              <div className="absolute -bottom-6 -right-4 w-40 h-40 bg-pink-100/40 rounded-full filter blur-2xl"></div>
            </div>
          </div>
        )}

        {mode === 'create_form' && (
          <div className="w-full max-w-xl bg-white border border-[#E8E2D9] rounded-2xl shadow-md p-8 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-[#2D312E] mb-2">Mulai Langkah Bahagia</h3>
            <p className="text-sm text-[#A5A58D] mb-6">Letakkan informasi dasar perencanaan pernikahan Anda untuk menginisiasi workspace kolaboratif.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D312E] mb-1">Nama Calon Mempelai Wanita *</label>
                  <input
                    id="input-partner-a"
                    type="text"
                    required
                    placeholder="Contoh: Ami"
                    value={partnerAName}
                    onChange={(e) => setPartnerAName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C] bg-[#FAF9F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D312E] mb-1">Nama Calon Mempelai Pria *</label>
                  <input
                    id="input-partner-b"
                    type="text"
                    required
                    placeholder="Contoh: Ardhi"
                    value={partnerBName}
                    onChange={(e) => setPartnerBName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C] bg-[#FAF9F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D312E] mb-1">Rencana Tanggal Perhelatan *</label>
                  <input
                    id="input-wedding-date"
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C] bg-[#FAF9F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D312E] mb-1">Kota / Lokasi Acara *</label>
                  <input
                    id="input-city"
                    type="text"
                    required
                    placeholder="Contoh: Jakarta Selatan / Surabaya"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C] bg-[#FAF9F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D312E] mb-1">Estimasi Jumlah Undangan (Tamu)</label>
                  <input
                    id="input-estimated-guests"
                    type="number"
                    min="1"
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C] bg-[#FAF9F5]"
                  />
                  <span className="text-[10px] text-[#A5A58D]">Tip: Jumlah tamu × 2 untuk porsi catering</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D312E] mb-1">Estimasi Total Anggaran (Rupiah Rp)</label>
                  <input
                    id="input-estimated-budget"
                    type="number"
                    min="1000000"
                    step="1000000"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C] bg-[#FAF9F5]"
                  />
                  <span className="text-[10px] text-[#6B705C] font-[#6B705C] font-semibold font-mono">
                    Format: Rp {estimatedBudget.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setMode('welcome')}
                  className="flex-1 py-1 px-4 border border-[#E8E2D9] rounded-xl text-sm font-semibold hover:bg-[#FAF9F5] text-[#2D312E] transition cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  id="btn-submit-create-workspace"
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#6B705C] hover:bg-[#5C614E] text-[#FDFBF7] rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer"
                >
                  Langkah Berikutnya
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === 'invite_screen' && pendingWorkspace && (
          <div className="w-full max-w-xl bg-white border border-[#E8E2D9] rounded-2xl shadow-md p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#6B705C]/10 rounded-full flex items-center justify-center mx-auto text-[#6B705C] animate-pulse border border-[#6B705C]/20">
              <Users className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#2D312E]">Workspace Berhasil Diinisiasi!</h3>
              <p className="text-[#4A4A4A] text-sm max-w-md mx-auto">
                Tautkan impian Anda bersama pasangan. Untuk membuka semua modul, undang pasangan Anda (<span className="font-semibold text-[#CB997E]">{pendingWorkspace.partnerBName}</span>) untuk bergabung di ruang kerja ini.
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E8E2D9] text-left space-y-3">
              <p className="text-xs font-bold text-[#2D312E] uppercase tracking-wide">Status Tautan Pasangan:</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#4A4A4A] flex items-center">
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-2 inline-block"></span>
                  Menunggu {pendingWorkspace.partnerBName} Bergabung
                </span>
                <span className="text-xs bg-yellow-101 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded font-mono font-bold">PENDING</span>
              </div>
              <div className="text-xs text-[#CB997E] bg-amber-100/30 p-2.5 rounded border border-[#E8E2D9]/45">
                🔒 Modul database saat ini dalam mode terkunci (terproteksi) hingga pasangan Anda mengaktifkan tautan ini.
              </div>
            </div>

            {/* Simulated Share Options Grid */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#A5A58D] uppercase tracking-widest block">Metode Pembagian Tautan</span>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-invite-wa"
                  onClick={() => {
                    setInviteMethodUsed('WhatsApp');
                    alert(`Mensimulasikan pesan WhatsApp terkirim ke ${pendingWorkspace.partnerBName}! 📱`);
                  }}
                  className={`p-3 border text-sm font-semibold rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${inviteMethodUsed === 'WhatsApp' ? 'bg-[#6B705C]/10 border-[#6B705C]/35 text-[#6B705C]' : 'bg-[#FAF9F5] border-[#E8E2D9] hover:border-[#6B705C] hover:bg-[#F5F2ED]'}`}
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
                  className={`p-3 border text-sm font-semibold rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${inviteMethodUsed === 'Email Pernikahan' ? 'bg-[#CB997E]/10 border-[#CB997E]/35 text-[#CB997E]' : 'bg-[#FAF9F5] border-[#E8E2D9] hover:border-[#6B705C] hover:bg-[#F5F2ED]'}`}
                >
                  <span className="text-lg mb-1">📧</span>
                  Kirim Email
                </button>
              </div>

              {/* Direct share link simulator */}
              <div className="flex items-center space-x-2 mt-4 bg-[#FAF9F5] p-2 rounded-xl border border-[#E8E2D9]">
                <input
                  type="text"
                  readOnly
                  value={`https://satuhari.id/workspace-join/${pendingWorkspace.id}`}
                  className="bg-transparent border-none text-xs font-mono text-zinc-600 focus:outline-none flex-grow overflow-ellipsis select-all truncate"
                />
                <button
                  id="btn-copy-invite-link"
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 bg-[#6B705C] hover:bg-[#5C614E] text-[#FDFBF7] rounded-lg text-xs font-semibold flex items-center transition cursor-pointer border-0"
                >
                  {copiedLink ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedLink ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            {/* SIMULATE TRIGGER BUTTON */}
            <div className="pt-6 border-t border-[#E8E2D9] flex flex-col items-center">
              <p className="text-xs text-[#A5A58D] mb-3 block">
                💡 <span className="font-semibold text-[#2D312E]">Uji Coba Pengembang</span>: Klik tombol di bawah ini untuk mensimulasikan pasangan Anda menyetujui undangan, mengaktifkan tautan, dan membuka seluruh modul workspace secara kolaboratif!
              </p>
              <button
                id="btn-simulate-partner-join"
                onClick={onSimulateJoin}
                className="w-full py-3 bg-[#6B705C] hover:bg-[#5C614E] text-[#FDFBF7] rounded-xl text-sm font-bold flex items-center justify-center shadow-xs transition transform active:scale-95 cursor-pointer border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simulasikan: {pendingWorkspace.partnerBName} Bergabung Sekarang!
              </button>
              
              <button
                type="button"
                onClick={() => setMode('create_form')}
                className="text-xs text-zinc-600 hover:underline mt-4"
              >
                Kembali Ubah Detail Acara
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200/50 bg-[#F5F4EC]/50 text-center text-xs text-zinc-500 relative z-10 font-mono">
        <p>© 2026 SatuHari — Merencanakan Hari Bahagia, Bersama.</p>
        <p className="mt-1 text-[10px] text-zinc-400">Dirancang khusus untuk Adat, Tradisi & Keuangan Pasangan Indonesia</p>
      </footer>
    </div>
  );
}
