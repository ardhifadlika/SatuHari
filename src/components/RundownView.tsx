/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Printer, 
  Share2, 
  Search, 
  AlertCircle, 
  MapPin, 
  User, 
  Briefcase,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { RundownItem } from '../types';

interface RundownViewProps {
  rundown: RundownItem[];
  onAddRundownItem: (item: Omit<RundownItem, 'id'>) => void;
  onUpdateRundownItem: (id: string, updates: Partial<RundownItem>) => void;
  onDeleteRundownItem: (id: string) => void;
  currentUser: string;
}

export default function RundownView({
  rundown,
  onAddRundownItem,
  onUpdateRundownItem,
  onDeleteRundownItem,
  currentUser
}: RundownViewProps) {
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSharePayload, setCopiedSharePayload] = useState(false);

  // New item states
  const [newTime, setNewTime] = useState('08:00');
  const [newActivity, setNewActivity] = useState('');
  const [newPIC, setNewPIC] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Sort chronologically by time (e.g. "07:00", "09:30")
  const sortedRundown = [...rundown].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  // Filter
  const filteredRundown = sortedRundown.filter(item => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.activity.toLowerCase().includes(q) ||
        item.personInCharge.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateRundown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim() || !newTime.trim() || !newPIC.trim()) {
      alert('Mohon sebutkan Waktu, Agenda Kegiatan, dan PJ Penanggungjawab! ⏱️');
      return;
    }

    onAddRundownItem({
      time: newTime,
      activity: newActivity,
      personInCharge: newPIC,
      location: newLoc,
      vendorName: newVendor,
      notes: newNotes
    });

    // Reset Form
    setNewTime('08:00');
    setNewActivity('');
    setNewPIC('');
    setNewLoc('');
    setNewVendor('');
    setNewNotes('');
    setShowAddModal(false);
  };

  // Copy-Share custom text format for WhatsApp
  const handleCopyWhatsAppText = () => {
    let payload = `📋 *SUSUNAN ACARA RUNDOWN PERNIKAHAN* 📋\n_Merencanakan Hari Bahagia Bersama SatuHari_\n\n`;
    
    sortedRundown.forEach(item => {
      payload += `⏰ *Pukul ${item.time}* \n`;
      payload += `✨ *Kegiatan*: ${item.activity}\n`;
      payload += `📍 *Lokasi*: ${item.location ? item.location : '-'}\n`;
      payload += `👤 *PJ*: ${item.personInCharge}\n`;
      if (item.notes) payload += `📝 *Catatan*: ${item.notes}\n`;
      payload += `---------------------------------------\n`;
    });

    payload += `\n_Dibuat berdua kolaboratif di SatuHari.id_`;

    navigator.clipboard.writeText(payload);
    setCopiedSharePayload(true);
    setTimeout(() => setCopiedSharePayload(false), 2000);
  };

  // Browser system Print handler
  const handlePrintRundown = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans printable-section">
      
      {/* Title Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0D1C17]">Rundown Acara Hari H</h2>
          <p className="text-sm text-[#788A82]">Petakan garis waktu acara akad nikah, sakralitas resepsi, hingga istirahat ganti busana pengantin.</p>
        </div>

        <div className="flex flex-wrap gap-2.5 self-start md:self-auto">
          <button
            id="btn-copy-rundown-wa"
            onClick={handleCopyWhatsAppText}
            className={`px-3.5 py-2 border rounded-xl text-xs font-bold flex items-center transition cursor-pointer ${copiedSharePayload ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-[#E8DDD9] bg-white hover:border-[#1C3E33] text-[#0D1C17]'}`}
          >
            {copiedSharePayload ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 mr-1.5" />}
            {copiedSharePayload ? 'Format WA Tersalin!' : 'Salin Format WA'}
          </button>
          <button
            id="btn-print-rundown"
            onClick={handlePrintRundown}
            className="px-3.5 py-2 border border-[#E8DDD9] bg-white hover:border-[#1C3E33] text-[#0D1C17] font-bold rounded-xl text-xs flex items-center transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Cetak Rundown / PDF
          </button>
          <button
            id="btn-open-add-rundown-modal"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] font-bold rounded-xl text-xs flex items-center shadow-xs transition cursor-pointer border-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Agenda Baru
          </button>
        </div>
      </div>

      {/* SEARCH TIMELINE */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DDD9] shadow-xs no-print">
        <div className="relative">
          <Search className="w-4 h-4 text-[#788A82] absolute left-3 top-3" />
          <input
            id="search-rundown-input"
            type="text"
            placeholder="Cari kegiatan: MUA, Akad, Resepsi, Sesi Foto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E8DDD9] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17]"
          />
        </div>
      </div>

      {/* PRINT STYLES SHEET EMBED */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          aside, header, footer {
            display: none !important;
          }
          .printable-section {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* VERTICAL CHRONOLOGICAL METICULOUS TIMELINE */}
      {filteredRundown.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DDD9] p-12 text-center max-w-xl mx-auto space-y-3 no-print">
          <div className="w-12 h-12 rounded-full bg-[#FAF5F5] flex items-center justify-center mx-auto text-[#788A82]">
            <Clock className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-sm font-semibold text-[#0D1C17]">Tidak ada susunan acara rundown.</p>
          <p className="text-xs text-[#788A82]">Buat rancangan agenda akad nikah dan resepsi pernikahan berdua saat ini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Printable Layout Title Header (Only show during printf!) */}
          <div className="hidden print:block text-center border-b-2 border-stone-900 pb-4 mb-6">
            <h1 className="text-2xl font-bold">RUNDOWN ACARA PERNIKAHAN HARI-H</h1>
            <p className="text-sm italic">SatuHari Workspace — Merencanakan Hari Bahagia, Bersama.</p>
          </div>

          <div className="relative border-l border-[#E8DDD9] ml-3.5 space-y-6 md:space-y-8">
            {filteredRundown.map((item) => (
              <div key={item.id} className="relative pl-7 md:pl-9">
                {/* Timeline Indicator Hub */}
                <span className="absolute -left-2 top-0.5 w-4 h-4 bg-[#1C3E33] rounded-full ring-4 ring-[#1C3E33]/15 border border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
                
                {/* Inner Card Content */}
                <div className="bg-white border border-[#E8DDD9] p-5 rounded-2xl shadow-xs transition hover:shadow-sm">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DDD9] pb-2.5 mb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-extrabold text-[#1C3E33] font-mono flex items-center bg-[#1C3E33]/10 px-2 py-0.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 mr-1 text-[#1C3E33]" />
                        Pukul {item.time}
                      </span>
                      <h3 className="text-sm font-bold text-[#0D1C17]">
                        {item.activity}
                      </h3>
                    </div>

                    <p className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block font-mono">
                      PJ: {item.personInCharge}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#2D3D36] mb-2 font-medium">
                    <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-[#788A82]" /> <span className="font-bold text-[#0D1C17]">Sektor:</span>&nbsp;{item.location || '-'}</p>
                    {item.vendorName && (
                      <p className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1.5 text-[#788A82]" /> <span className="font-bold text-[#0D1C17]">Vendor:</span>&nbsp;{item.vendorName}</p>
                    )}
                  </div>

                  {item.notes && (
                    <div className="p-3 bg-[#FAF5F5] rounded-xl text-xs text-[#2D3D36] border border-[#E8DDD9] font-medium">
                      <span className="font-bold text-[#0D1C17] block text-[10px] uppercase font-mono tracking-wide">Poin Instruksi Penting:</span>
                      <p className="leading-relaxed mt-0.5">{item.notes}</p>
                    </div>
                  )}

                  {/* Delete Item (Hidden in printing!) */}
                  <div className="flex justify-end pt-2 mt-2 border-t border-[#E8DDD9]/60 no-print text-xs font-mono">
                    <button
                      id={`btn-delete-rundown-${item.id}`}
                      onClick={() => onDeleteRundownItem(item.id)}
                      className="text-zinc-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition font-medium flex items-center shrink-0 cursor-pointer border-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Hapus Agenda
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD RUNDOWN ACARA MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0D1C17]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-[#E8DDD9]">
            <h3 className="text-lg font-bold text-[#0D1C17] mb-1">Tambah Agenda Hari-H</h3>
            <p className="text-xs text-[#788A82] mb-4 font-normal">Buatlah silsilah jam waktu yang berselang teratur agar acara lancar.</p>

            <form onSubmit={handleCreateRundown} className="space-y-3 text-xs font-semibold text-[#0D1C17]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Waktu Mulai (HH:MM) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 09:00 / 11:30"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none font-mono text-[#0D1C17]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Nama Agenda / Acara *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Upacara Akad Nikah..."
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none text-[#0D1C17]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">PJ Penanggungjawab *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak RT / Crew WO"
                    value={newPIC}
                    onChange={(e) => setNewPIC(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none text-[#0D1C17]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Vendor Terkait (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kala Studio / Anggun MUA"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none text-[#0D1C17]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Sektor / Ruang Lokasi</label>
                <input
                  type="text"
                  placeholder="Contoh: Masjid Lantai 1 / Pelaminan Ballroom"
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none text-[#0D1C17]"
                />
              </div>

              <div>
                <label className="block mb-1">Poin Instruksi Penting (Notes)</label>
                <textarea
                  rows={2.5}
                  placeholder="Catatan mikrofon, mahar disimpan PJ, waktu ganti lipstik dll..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none font-medium text-[#0D1C17]"
                />
              </div>

              <div className="flex space-x-2 pt-4 border-t border-[#E8DDD9] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-[#E8DDD9] hover:bg-[#FAF5F5] rounded-xl text-[#0D1C17] transition cursor-pointer bg-white"
                >
                  Kembali
                </button>
                <button
                  id="btn-confirm-add-rundown"
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] rounded-xl transition cursor-pointer border-0 shadow-xs"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
