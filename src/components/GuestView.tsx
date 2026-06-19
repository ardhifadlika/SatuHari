/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  UserCheck, 
  Phone, 
  ChevronDown, 
  Sparkles,
  ClipboardList,
  MapPin
} from 'lucide-react';
import { GuestItem, GuestCategory, GuestSide, RSVPStatus } from '../types';

interface GuestViewProps {
  guests: GuestItem[];
  onAddGuest: (guest: Omit<GuestItem, 'id' | 'isDeleted' | 'isArchived' | 'deletedAt'>) => void;
  onUpdateGuest: (id: string, updates: Partial<GuestItem>) => void;
  onDeleteGuest: (id: string) => void;
  currentUser: string;
}

export default function GuestView({
  guests,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
  currentUser
}: GuestViewProps) {
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSide, setFilterSide] = useState<GuestSide | 'ALL'>('ALL');
  const [filterRSVP, setFilterRSVP] = useState<RSVPStatus | 'ALL'>('ALL');
  const [filterCat, setFilterCat] = useState<GuestCategory | 'ALL'>('ALL');

  // Modals States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // New Guest Fields
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<GuestCategory>('Family');
  const [newSide, setNewSide] = useState<GuestSide>('Both');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPax, setNewPax] = useState<number>(2);
  const [newRSVP, setNewRSVP] = useState<RSVPStatus>('Invited');
  const [newTable, setNewTable] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Bulk Import text state
  const [importText, setImportText] = useState(
    "Pak Tri Mulyono,Family,Bride,08122334455,Yogyakarta,2,Confirmed,A2\n" +
    "Siska Amelia,Friends,Both,08545556667,Jakarta Selatan,1,Invited,C4\n" +
    "Prof. Dr. Ir. Haris,Work,Groom,08119998888,Depok,2,Confirmed,B2"
  );

  // Ignore Soft Deleted
  const activeGuests = guests.filter(g => !g.isDeleted);

  // Metrics Calcs
  const totalGuestsEntries = activeGuests.length;
  // Total Guests Count is the sum of pax!
  const totalPaxCount = activeGuests.reduce((sum, g) => sum + g.pax, 0);
  
  const invitationsSentCount = activeGuests.filter(g => g.rsvpStatus !== 'Not Invited').length;
  const rsvpReceivedCount = activeGuests.filter(g => g.rsvpStatus === 'Confirmed' || g.rsvpStatus === 'Declined').reduce((sum, g) => sum + g.pax, 0);
  const attendanceCount = activeGuests.filter(g => g.rsvpStatus === 'Confirmed' || g.rsvpStatus === 'Attended').reduce((sum, g) => sum + g.pax, 0);

  const categories: GuestCategory[] = ['Family', 'Friends', 'Work', 'Community', 'Parents Relation'];
  const sides: GuestSide[] = ['Bride', 'Groom', 'Both'];
  const rsvpStatuses: RSVPStatus[] = ['Not Invited', 'Invited', 'Confirmed', 'Declined', 'Attended'];

  // Filter Logic
  const filteredGuests = activeGuests.filter(g => {
    if (filterSide !== 'ALL' && g.side !== filterSide) return false;
    if (filterRSVP !== 'ALL' && g.rsvpStatus !== filterRSVP) return false;
    if (filterCat !== 'ALL' && g.category !== filterCat) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.phoneNumber.includes(q) ||
        g.address.toLowerCase().includes(q) ||
        (g.notes && g.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddNewGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddGuest({
      name: newName,
      category: newCat,
      side: newSide,
      phoneNumber: newPhone,
      address: newAddress,
      pax: newPax,
      rsvpStatus: newRSVP,
      tableNumber: newTable || '-',
      notes: newNotes
    });

    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setNewPax(2);
    setNewRSVP('Invited');
    setNewTable('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleBulkImport = () => {
    try {
      const lines = importText.split('\n').filter(l => l.trim().length > 0);
      let count = 0;
      
      lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 1) {
          const name = parts[0]?.trim();
          const category = (parts[1]?.trim() as GuestCategory) || 'Family';
          const side = (parts[2]?.trim() as GuestSide) || 'Both';
          const phoneNumber = parts[3]?.trim() || '';
          const address = parts[4]?.trim() || '';
          const pax = parseInt(parts[5]?.trim()) || 1;
          const rsvpStatus = (parts[6]?.trim() as RSVPStatus) || 'Invited';
          const tableNumber = parts[7]?.trim() || '-';

          onAddGuest({
            name,
            category,
            side,
            phoneNumber,
            address,
            pax,
            rsvpStatus,
            tableNumber,
            notes: 'Diimpor massal dari draf spreadsheet'
          });
          count++;
        }
      });

      alert(`Sukses mengimpor ${count} tamu undangan pernikahan! 🪄✨`);
      setShowImportModal(false);
    } catch (err) {
      alert('Format teks impor salah. Pastikan format: Nama,Kategori,Pihak,Telp,Kota,Pax,RSVPStatus,Meja');
    }
  };

  const loadPresetCSV = (presetType: 'office' | 'college' | 'big_family') => {
    if (presetType === 'office') {
      setImportText(
        "Pak Herman (HRD),Work,Both,08129849204,Jakarta,2,Invited,-\n" +
        "Santi Amanda (Finance),Work,Bride,08534829393,Tangerang,1,Confirmed,A6\n" +
        "Bagas Kurniawan (IT),Work,Groom,08174920202,Bekasi,2,Confirmed,B4"
      );
    } else if (presetType === 'college') {
      setImportText(
        "Desta (Sahabat Futsal),Friends,Groom,08119293444,Jakarta,1,Confirmed,C4\n" +
        "Rara & Fadel (Geng Kampus),Friends,Both,08785930201,Depok,2,Confirmed,C5\n" +
        "Iqbal Prasetya,Friends,Bride,08122394582,Bogor,1,Declined,-"
      );
    } else {
      setImportText(
        "Bude Retno (Keluarga Solo),Family,Bride,08523495020,Yogyakarta,4,Confirmed,A1\n" +
        "Om Hardi & Tante (Keluarga Bandung),Family,Groom,08139580402,Bandung,2,Confirmed,B1\n" +
        "Paklek Joko & Sepupu,Family,Both,08114958203,Surabaya,3,Invited,-"
      );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Daftar Tamu Undangan (Tamu)</h2>
          <p className="text-sm text-stone-500">Kalkulasi total katering pack, saring kategori hubungan, dan petakan nomor meja resepsi.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 self-start md:self-auto">
          <button
            id="btn-open-import-modal"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 border border-zinc-200 hover:border-amber-700 bg-white hover:bg-amber-50/10 text-stone-700 rounded-lg text-xs font-bold flex items-center transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Impor Massal (CSV)
          </button>
          <button
            id="btn-open-add-guest-modal"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-stone-50 rounded-lg text-xs font-bold flex items-center shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Tamu
          </button>
        </div>
      </div>

      {/* METRICS SUMMARY ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono pl-0.5">Tamu Terdaftar</span>
          <span className="text-lg md:text-xl font-extrabold text-stone-900 block mt-1">{totalPaxCount} Orang</span>
          <span className="text-[10px] text-zinc-500">Dari {totalGuestsEntries} Grup Undangan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono pl-0.5">Undangan Terkirim</span>
          <span className="text-lg md:text-xl font-extrabold text-stone-900 block mt-1">{invitationsSentCount} Undangan</span>
          <span className="text-[10px] text-zinc-500">Status Bukan 'Belum Diundang'</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block font-mono pl-0.5">Kehadiran (Konfirmasi)</span>
          <span className="text-lg md:text-xl font-extrabold text-emerald-950 block mt-1">{attendanceCount} Tamu (Pax)</span>
          <span className="text-[10px] text-emerald-700 font-medium">Status 'Confirmed' / 'Attended'</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-900 block font-mono pl-0.5 font-bold">Rasio Kehadiran</span>
          <span className="text-lg md:text-xl font-extrabold text-amber-950 block mt-1">
            {rsvpReceivedCount > 0 ? Math.round((attendanceCount / rsvpReceivedCount) * 100) : 0}% Rasa
          </span>
          <span className="text-[10px] text-zinc-500">Dari total RSVP masuk</span>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Guest Name Search */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              id="search-guests-input"
              type="text"
              placeholder="Cari nama keluarga, teman, instansi, alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-600 bg-stone-50"
            />
          </div>

          {/* Family/Side Filter */}
          <select
            id="filter-guest-side"
            value={filterSide}
            onChange={(e) => setFilterSide(e.target.value as any)}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-amber-600 bg-white cursor-pointer font-semibold text-zinc-700"
          >
            <option value="ALL">Semua Pihak Keluarga</option>
            <option value="Bride">Mempelai Wanita (Bride)</option>
            <option value="Groom">Mempelai Pria (Groom)</option>
            <option value="Both">Pihak Berdua (Both)</option>
          </select>

          {/* Category Filter */}
          <select
            id="filter-guest-category"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as any)}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-amber-600 bg-white cursor-pointer font-semibold text-zinc-700"
          >
            <option value="ALL">Semua Kategori Kekerabatan</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* RSVP Status Filter */}
          <select
            id="filter-guest-rsvp"
            value={filterRSVP}
            onChange={(e) => setFilterRSVP(e.target.value as any)}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-amber-600 bg-white cursor-pointer font-semibold text-zinc-700"
          >
            <option value="ALL">Semua Status RSVP</option>
            {rsvpStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>

        </div>
      </div>

      {/* GUESTS LIST DATABASE TABLE */}
      {filteredGuests.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200/60 p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center mx-auto text-stone-400">
            <Users className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-sm font-semibold text-stone-700">"No guests yet. Start building your guest list."</p>
          <p className="text-xs text-stone-400">Impor data massal CSV atau tambahkan rekan kerja, silsilah keluarga, sahabat masa kecil, pengurus kelurahan.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200/70 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#FAF9F5] border-b border-stone-200 text-zinc-600 uppercase font-mono tracking-wider font-extrabold">
                <tr>
                  <th className="p-4">Nama Tamu & Kategori</th>
                  <th className="p-4 text-center">Pihak Kelg</th>
                  <th className="p-4 text-center">Pax (Jml)</th>
                  <th className="p-4">Lokasi & Alamat</th>
                  <th className="p-4 text-center">No Meja</th>
                  <th className="p-4">Status RSVP</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-stone-700">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-amber-50/15 transition">
                    <td className="p-4">
                      <span className="font-bold text-stone-905 text-stone-900 block">{guest.name}</span>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase font-mono tracking-wider pt-0.5 block">{guest.category}</span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${guest.side === 'Bride' ? 'bg-pink-100 text-pink-700' : guest.side === 'Groom' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'}`}>
                        {guest.side === 'Bride' ? 'Wanita' : guest.side === 'Groom' ? 'Pria' : 'Dua Sisi'}
                      </span>
                    </td>

                    <td className="p-4 text-center font-bold font-mono">
                      <input
                        id={`input-pax-${guest.id}`}
                        type="number"
                        min="1"
                        value={guest.pax}
                        onChange={(e) => onUpdateGuest(guest.id, { pax: parseInt(e.target.value) || 0 })}
                        className="w-12 p-1 border border-zinc-150 rounded text-center bg-stone-50"
                      />
                    </td>

                    <td className="p-4 text-zinc-500 max-w-44 truncate" title={guest.address}>
                      {guest.address || '-'}
                    </td>

                    <td className="p-4 text-center font-bold font-mono text-stone-900">
                      <input
                        id={`input-table-${guest.id}`}
                        type="text"
                        value={guest.tableNumber}
                        onChange={(e) => onUpdateGuest(guest.id, { tableNumber: e.target.value })}
                        className="w-14 p-1 border border-zinc-150 rounded text-center bg-stone-50"
                      />
                    </td>

                    <td className="p-4">
                      {/* Interactive RSVP Changer */}
                      <select
                        id={`select-rsvp-status-${guest.id}`}
                        value={guest.rsvpStatus}
                        onChange={(e) => onUpdateGuest(guest.id, { rsvpStatus: e.target.value as RSVPStatus })}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer focus:outline-none uppercase-label ${guest.rsvpStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : guest.rsvpStatus === 'Invited' ? 'bg-blue-100 text-blue-800' : guest.rsvpStatus === 'Declined' ? 'bg-red-50 text-red-800' : 'bg-stone-100 text-stone-700'}`}
                      >
                        <option value="Not Invited">BELUM DIUNDANG</option>
                        <option value="Invited">TELAH DIUNDANG</option>
                        <option value="Confirmed">KONFIRMASI HADIR</option>
                        <option value="Declined">TIDAK HADIR</option>
                        <option value="Attended">TELAH DATANG (Acara)</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        id={`btn-delete-guest-${guest.id}`}
                        onClick={() => onDeleteGuest(guest.id)}
                        className="p-1 px-1.5 text-zinc-400 hover:text-red-650 rounded hover:bg-red-50 transition"
                        title="Hapus Tamu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD NEW GUEST MODAL POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Tambah Tamu Undangan</h3>
            <p className="text-xs text-stone-500 mb-4">Pastikan PIC dan penggolongan porsi katering sudah sinkron.</p>

            <form onSubmit={handleAddNewGuest} className="space-y-3 text-xs font-semibold text-stone-700">
              <div>
                <label className="block mb-1">Nama Tamu / Keluarga / Instansi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Haris Setyo & Istri..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Kategori Hubungan</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as GuestCategory)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-stone-800"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Pihak Pengundang</label>
                  <select
                    value={newSide}
                    onChange={(e) => setNewSide(e.target.value as GuestSide)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-stone-800"
                  >
                    <option value="Both">Pihak Berdua (Both)</option>
                    <option value="Bride">Mempelai Wanita (Bride)</option>
                    <option value="Groom">Mempelai Pria (Groom)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">No. HP / WhatsApp (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block mb-1">Kapasitas Kursi (Pax) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPax}
                    onChange={(e) => setNewPax(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Tahap RSVP Awal</label>
                  <select
                    value={newRSVP}
                    onChange={(e) => setNewRSVP(e.target.value as RSVPStatus)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-stone-800"
                  >
                    <option value="Not Invited">Belum Diundang</option>
                    <option value="Invited">Telah Diundang</option>
                    <option value="Confirmed">Konfirmasi Hadir</option>
                    <option value="Declined">Tidak Hadir</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Nomor Kursi / Meja</label>
                  <input
                    type="text"
                    placeholder="Contoh: A4 / VIP"
                    value={newTable}
                    onChange={(e) => setNewTable(e.target.value)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Alamat Kota Tamu</label>
                <input
                  type="text"
                  placeholder="Contoh: Bandung Barat / Pancoran Mas Depok"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Alokasi Kado / Silsilah Keluarga (Catatan)</label>
                <textarea
                  rows={2}
                  placeholder="Sepupu jauh dari pihak bude solo, bawa anak kecil..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none font-medium"
                />
              </div>

              <div className="flex space-x-2 pt-4 border-t border-zinc-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-1.5 border border-zinc-200 hover:bg-stone-50 rounded-lg text-stone-600 transition"
                >
                  Kembali
                </button>
                <button
                  id="btn-confirm-add-guest"
                  type="submit"
                  className="flex-1 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition"
                >
                  Tambahkan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK IMPORT MODAL POPUP */}
      {showImportModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-stone-200">
            
            <div className="flex items-center space-x-2 mb-2">
              <ClipboardList className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-extrabold text-stone-900">Simulator Impor Tamu (CSV Text)</h3>
            </div>
            
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Ketik atau tempel draf nama kawan/keluarga dari spreadsheet dengan format koma <strong>(CSV)</strong> di bawah ini untuk mengimpor massal instan.
            </p>

            {/* QUICK PRESET GENERATORS */}
            <div className="flex gap-2.5 mb-3.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 self-center">Contoh Preset:</span>
              <button
                type="button"
                onClick={() => loadPresetCSV('office')}
                className="px-2 py-1 bg-zinc-100 hover:bg-amber-100 text-[10px] text-stone-700 rounded transition outline-none"
              >
                💼 Rekan Kantor
              </button>
              <button
                type="button"
                onClick={() => loadPresetCSV('college')}
                className="px-2 py-1 bg-zinc-100 hover:bg-amber-100 text-[10px] text-stone-700 rounded transition outline-none"
              >
                🏫 Teman Kuliah
              </button>
              <button
                type="button"
                onClick={() => loadPresetCSV('big_family')}
                className="px-2 py-1 bg-zinc-100 hover:bg-amber-100 text-[10px] text-stone-700 rounded transition"
              >
                ❤️ Keluarga Besar
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-stone-700 font-semibold">
              <textarea
                rows={6}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-2.5 border border-zinc-200 rounded-lg text-[11px] font-mono bg-stone-50 focus:outline-none"
              />
              
              <div className="text-[10px] text-zinc-500 bg-amber-50 p-2.5 rounded-lg border border-amber-100/50 leading-relaxed font-mono">
                Aturan Kolom: <br />
                <span className="font-bold text-amber-950">Nama,Kategori,Pihak(Bride/Groom/Both),Handphone,Kota,Pax(Angka),RSVPStatus,NomorMeja</span>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-zinc-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 py-1.5 border border-zinc-200 hover:bg-stone-50 rounded-lg text-stone-600 transition"
                >
                  Kembali
                </button>
                <button
                  id="btn-confirm-import-guests"
                  type="button"
                  onClick={handleBulkImport}
                  className="flex-1 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition font-bold"
                >
                  Impor {importText.split('\n').filter(l => l.trim()).length} Tamu Massal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
