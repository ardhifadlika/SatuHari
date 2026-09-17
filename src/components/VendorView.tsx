/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  Trash2, 
  MessageSquare, 
  FileCheck, 
  CheckCircle, 
  Search, 
  Filter, 
  Paperclip, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Send,
  PhoneCall
} from 'lucide-react';
import { VendorItem, VendorCategory, VendorStatus } from '../types';
import { formatRupiah, formatNumberWithDots, parseRupiah } from '../utils/currency';

interface VendorViewProps {
  vendors: VendorItem[];
  onAddVendor: (vendor: Omit<VendorItem, 'id' | 'isDeleted' | 'isArchived' | 'deletedAt'>) => void;
  onUpdateVendor: (id: string, updates: Partial<VendorItem>) => void;
  onDeleteVendor: (id: string) => void;
  currentUser: string;
}

export default function VendorView({
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  currentUser
}: VendorViewProps) {
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<VendorCategory | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<VendorStatus | 'ALL'>('ALL');

  // New Vendor States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<VendorCategory>('Venue');
  const [newCP, setNewCP] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newQuoteAmt, setNewQuoteAmt] = useState<number>(10000000);
  const [newQuoteStatus, setNewQuoteStatus] = useState<'Received' | 'None'>('Received');
  const [newQuoteDoc, setNewQuoteDoc] = useState('');
  const [newContractStatus, setNewContractStatus] = useState<'Received' | 'None'>('None');
  const [newContractDoc, setNewContractDoc] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newStatus, setNewStatus] = useState<VendorStatus>('Researching');

  // Ignore Soft Deleted
  const activeVendors = vendors.filter(v => !v.isDeleted);

  const categories: VendorCategory[] = [
    'Venue', 'Wedding Organizer', 'Decoration', 'Catering', 
    'Photography', 'Videography', 'MUA', 'Entertainment', 'Transportation'
  ];

  const statuses: VendorStatus[] = ['Researching', 'Contacted', 'Negotiating', 'Booked', 'Completed'];

  // Filter & Search Logic
  const filteredVendors = activeVendors.filter(vendor => {
    if (filterCategory !== 'ALL' && vendor.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && vendor.status !== filterStatus) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        vendor.name.toLowerCase().includes(q) ||
        vendor.contactPerson.toLowerCase().includes(q) ||
        vendor.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('Mohon lengkapi Nama Vendor & No. Handphone CP! 📞');
      return;
    }

    onAddVendor({
      name: newName,
      category: newCat,
      contactPerson: newCP,
      phoneNumber: newPhone,
      quotation: {
        amount: newQuoteAmt,
        status: newQuoteStatus,
        attachmentUrl: newQuoteDoc ? '#' : null
      },
      contract: {
        status: newContractStatus,
        attachmentUrl: newContractDoc ? '#' : null
      },
      paymentSchedule: newSchedule,
      notes: newNotes,
      status: newStatus
    });

    // Reset Form
    setNewName('');
    setNewCP('');
    setNewPhone('');
    setNewQuoteAmt(10000000);
    setNewQuoteDoc('');
    setNewContractDoc('');
    setNewContractStatus('None');
    setNewSchedule('');
    setNewNotes('');
    setNewStatus('Researching');
    setShowAddModal(false);
  };

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case 'Researching': return 'bg-stone-100 text-stone-700 border border-stone-200';
      case 'Contacted': return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'Negotiating': return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'Booked': return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'Completed': return 'bg-[#1C3E33] text-[#F7F1F0] border border-[#1C3E33]';
      default: return 'bg-stone-100 text-stone-700 border border-stone-200';
    }
  };

  // Quick helper to generate simulated WA direct links
  const getWhatsAppLink = (phone: string, vendorName: string) => {
    // Standard cleaning of phone strings for simulation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const textMsg = encodeURIComponent(`Halo! Saya merencanakan pernikahan menggunakan workspace SatuHari. Ingin bertanya mengenai ketersediaan paket untuk vendor ${vendorName}.`);
    return `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone}?text=${textMsg}`;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0D1C17]">Manajemen Vendor</h2>
          <p className="text-sm text-[#788A82]">Kumpulkan penawaran harga, bandingkan kontrak vendor, dan hubungi langsung via WhatsApp.</p>
        </div>
        <button
          id="btn-open-add-vendor-modal"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] rounded-xl text-sm font-semibold flex items-center shadow-xs transition self-start md:self-auto cursor-pointer border-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Hubungkan Vendor Baru
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DDD9] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Vendor Search */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-[#788A82] absolute left-3 top-3" />
            <input
              id="search-vendors-input"
              type="text"
              placeholder="Cari vendor, penanggung jawab, catatan layanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E8DDD9] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33] bg-[#FAF5F5] text-[#0D1C17]"
            />
          </div>

          {/* Category Filter */}
          <select
            id="filter-vendor-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-3 py-2 border border-[#E8DDD9] rounded-xl text-xs focus:outline-none focus:border-[#1C3E33] bg-white cursor-pointer font-bold text-[#0D1C17]"
          >
            <option value="ALL">Semua Kategori Jasa</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* Status Filter */}
          <select
            id="filter-vendor-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-[#E8DDD9] rounded-xl text-xs focus:outline-none focus:border-[#1C3E33] bg-white cursor-pointer font-bold text-[#0D1C17]"
          >
            <option value="ALL">Semua Tahap Status</option>
            {statuses.map(st => <option key={st} value={st}>{st}</option>)}
          </select>

        </div>
      </div>

      {/* VENDOR ITEMS CARDS GRID */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8DDD9] p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF5F5] flex items-center justify-center mx-auto text-[#788A82]">
            <Building className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-sm font-semibold text-[#0D1C17]">"No vendors added. Let's find your dream team."</p>
          <p className="text-xs text-[#788A82]">Kumpulkan referensi penata rias (MUA), sewa mobil pengantin (transport), katering utama, foto & video dokumentasi di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div 
              key={vendor.id}
              className="bg-white border border-[#E8DDD9] rounded-2xl p-5 shadow-xs hover:shadow-sm transition flex flex-col justify-between space-y-4"
            >
              
              <div className="space-y-2.5">
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] bg-[#1C3E33]/15 text-[#1C3E33] font-extrabold px-2 py-0.5 rounded-full uppercase font-mono">{vendor.category}</span>
                    <h3 className="text-sm font-bold text-[#0D1C17] mt-1.5">{vendor.name}</h3>
                  </div>
                  
                  {/* Status Badges Selector */}
                  <select
                    id={`select-vendor-status-${vendor.id}`}
                    value={vendor.status}
                    onChange={(e) => onUpdateVendor(vendor.id, { status: e.target.value as VendorStatus })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer focus:outline-none uppercase ${getStatusColor(vendor.status)}`}
                  >
                    <option value="Researching">Researching</option>
                    <option value="Contacted">Contacted (Info)</option>
                    <option value="Negotiating">Negotiating (Warn)</option>
                    <option value="Booked">Booked (Success)</option>
                    <option value="Completed">Completed (Selesai)</option>
                  </select>
                </div>

                {/* Contact information */}
                <div className="p-3 bg-[#FAF5F5] rounded-xl border border-[#E8DDD9] text-xs space-y-1.5 font-medium text-[#2D3D36]">
                  <p className="flex items-center justify-between">
                    <span className="text-[#788A82]">Narahubung (CP):</span>
                    <span className="font-bold text-[#0D1C17]">{vendor.contactPerson || '-'}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-[#788A82]">No. HP / Kontak:</span>
                    <span className="font-mono text-[#0D1C17]">{vendor.phoneNumber}</span>
                  </p>
                  
                  <div className="pt-2 border-t border-[#E8DDD9] flex justify-end">
                    <a
                      id={`link-wa-chat-${vendor.id}`}
                      href={getWhatsAppLink(vendor.phoneNumber, vendor.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[10px] flex items-center transition shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Chat WhatsApp
                    </a>
                  </div>
                </div>

                {/* Docs, Offers, Contract Checklist */}
                <div className="text-xs space-y-1.5 font-semibold text-[#2D3D36]">
                  <span className="text-[10px] font-bold text-[#788A82] uppercase tracking-widest block font-mono">Kelengkapan Administrasi</span>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center">
                      <FileCheck className="w-3.5 h-3.5 text-[#788A82] mr-1.5" /> Penawaran Harga (Quotation)
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <input
                        id={`check-quote-${vendor.id}`}
                        type="checkbox"
                        checked={vendor.quotation.status === 'Received'}
                        onChange={(e) => onUpdateVendor(vendor.id, {
                          quotation: {
                            ...vendor.quotation,
                            status: e.target.checked ? 'Received' : 'None'
                          }
                        })}
                        className="rounded border-[#E8DDD9] accent-[#1C3E33] h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-[#788A82] font-bold">{formatRupiah(vendor.quotation.amount || 0)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 text-[#788A82] mr-1.5" /> Draf Kontrak (Signed MOU)
                    </span>
                    <input
                      id={`check-contract-${vendor.id}`}
                      type="checkbox"
                      checked={vendor.contract.status === 'Received'}
                      onChange={(e) => onUpdateVendor(vendor.id, {
                        contract: {
                          ...vendor.contract,
                          status: e.target.checked ? 'Received' : 'None'
                        }
                      })}
                      className="rounded border-[#E8DDD9] accent-[#1C3E33] h-3.5 w-3.5 cursor-pointer"
                    />
                  </div>
                </div>

                {vendor.paymentSchedule && (
                  <div className="text-xs p-2.5 bg-[#FAF5F5] rounded-xl border border-[#E8DDD9] font-mono text-[#0D1C17]">
                    <span className="text-[9px] uppercase font-extrabold text-[#1C3E33] block tracking-wide">Rencana Jadwal Pembayaran:</span>
                    <p className="text-[11px] font-medium leading-relaxed mt-0.5 text-[#2D3D36]">{vendor.paymentSchedule}</p>
                  </div>
                )}

                {vendor.notes && (
                  <div className="text-xs text-[#788A82] italic mt-1 line-clamp-2">
                    Catatan: {vendor.notes}
                  </div>
                )}
              </div>

              {/* Card Footer Delete Button */}
              <div className="pt-3 border-t border-[#E8DDD9]/60 flex justify-end text-xs font-mono">
                <button
                  id={`btn-delete-vendor-${vendor.id}`}
                  onClick={() => onDeleteVendor(vendor.id)}
                  className="p-1 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-[11px] font-medium flex items-center transition cursor-pointer border-0"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Hapus Vendor
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0D1C17]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-[#E8DDD9] relative overflow-hidden">
            <h3 className="text-lg font-bold text-[#0D1C17] mb-1">Hubungkan Vendor Baru</h3>
            <p className="text-xs text-[#788A82] mb-4">Sajikan rincian kontak agar mudah ditindaklanjuti sesama pasangan.</p>

            <form onSubmit={handleCreateVendor} className="space-y-3 text-xs font-semibold text-[#0D1C17]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Nama Vendor / Penyedia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Artea Florist..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none focus:ring-2 focus:ring-[#1C3E33]/20 focus:border-[#1C3E33]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Kategori Jasa *</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as VendorCategory)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-white focus:outline-none font-bold text-[#0D1C17]"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Narahubung (CP Nama)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mbak Nia"
                    value={newCP}
                    onChange={(e) => setNewCP(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">No. HP / WhatsApp CP *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF5F5] rounded-2xl space-y-3.5 border border-[#E8DDD9]">
                <span className="text-[9px] uppercase font-bold text-[#788A82] tracking-wider block font-mono">Tahap Quotation & Kontrak</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold text-[#0D1C17]">Estimasi Nilai Kontrak</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#788A82] font-mono font-bold">Rp</span>
                      <input
                        type="text"
                        placeholder="0"
                        value={formatNumberWithDots(newQuoteAmt)}
                        onChange={(e) => setNewQuoteAmt(parseRupiah(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 border border-[#E8DDD9] rounded-xl text-xs bg-white focus:outline-none font-mono font-bold text-right"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#0D1C17]">Tahap Status Awal</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as VendorStatus)}
                      className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-white focus:outline-none font-bold text-[#0D1C17]"
                    >
                      <option value="Researching">Meneliti (Researching)</option>
                      <option value="Contacted">Telah Hubungi (Contacted)</option>
                      <option value="Negotiating">Nego Harga (Negotiating)</option>
                      <option value="Booked">Sudah Sewa (Booked)</option>
                      <option value="Completed">Selesai Acara (Completed)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs flex items-center justify-between font-medium">
                  <label className="flex items-center space-x-2 cursor-pointer text-[#2D3D36]">
                    <input
                      type="checkbox"
                      checked={newQuoteStatus === 'Received'}
                      onChange={(e) => setNewQuoteStatus(e.target.checked ? 'Received' : 'None')}
                      className="rounded border-[#E8DDD9] accent-[#1C3E33]"
                    />
                    <span>Quotation Diterima</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer text-[#2D3D36]">
                    <input
                      type="checkbox"
                      checked={newContractStatus === 'Received'}
                      onChange={(e) => setNewContractStatus(e.target.checked ? 'Received' : 'None')}
                      className="rounded border-[#E8DDD9] accent-[#1C3E33]"
                    />
                    <span>Kontrak Disepakati</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-1">Term / Aturan Angsuran Tagihan</label>
                <input
                  type="text"
                  placeholder="Contoh: DP 50%, Pelunasan H-14 acara..."
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Catatan Keahlian / Fasilitas</label>
                <textarea
                  rows={2}
                  placeholder="Biaya charge pawang hujan, include panggung dll..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 border border-[#E8DDD9] rounded-xl text-xs bg-[#FAF5F5] focus:outline-none font-medium"
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
                  id="btn-confirm-add-vendor"
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] rounded-xl transition cursor-pointer border-0 shadow-xs"
                >
                  Simpan Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
