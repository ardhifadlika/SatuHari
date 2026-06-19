/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Gift, 
  Plus, 
  Trash2, 
  CheckCircle, 
  ShoppingBag, 
  PackageCheck, 
  Truck, 
  Search, 
  Filter, 
  PlusCircle, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { SeserahanItem, SeserahanCategory } from '../types';

interface SeserahanViewProps {
  seserahan: SeserahanItem[];
  onAddSeserahan: (item: Omit<SeserahanItem, 'id' | 'isDeleted' | 'isArchived' | 'deletedAt'>) => void;
  onUpdateSeserahan: (id: string, updates: Partial<SeserahanItem>) => void;
  onDeleteSeserahan: (id: string) => void;
  currentUser: string;
}

export default function SeserahanView({
  seserahan,
  onAddSeserahan,
  onUpdateSeserahan,
  onDeleteSeserahan,
  currentUser
}: SeserahanViewProps) {
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<SeserahanCategory | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item state
  const [newValName, setNewValName] = useState('');
  const [newCat, setNewCat] = useState<SeserahanCategory>('Fashion');
  const [newNotes, setNewNotes] = useState('');

  // Ignore Deleted
  const activeSeserahans = seserahan.filter(s => !s.isDeleted);

  const categories: SeserahanCategory[] = ['Fashion', 'Accessories', 'Beauty', 'Prayer Items', 'Food', 'Custom'];

  // Filtering
  const filteredSeserahans = activeSeserahans.filter(item => {
    if (filterCat !== 'ALL' && item.category !== filterCat) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate Metrics
  const totalItems = activeSeserahans.length;
  const purchasedCount = activeSeserahans.filter(s => s.purchased).length;
  const packedCount = activeSeserahans.filter(s => s.packed).length;
  const deliveredCount = activeSeserahans.filter(s => s.delivered).length;

  const handleCreateSeserahan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValName.trim()) {
      alert('Mohon tulis nama barang seserahan! 🎁');
      return;
    }

    onAddSeserahan({
      itemName: newValName,
      category: newCat,
      purchased: false,
      packed: false,
      delivered: false,
      notes: newNotes
    });

    // Reset Fields
    setNewValName('');
    setNewCat('Fashion');
    setNewNotes('');
    setShowAddModal(false);
  };

  const getCategoryEmoji = (category: SeserahanCategory) => {
    switch (category) {
      case 'Fashion': return '👗';
      case 'Accessories': return '💍';
      case 'Beauty': return '💄';
      case 'Prayer Items': return '🕌';
      case 'Food': return '🍲';
      case 'Custom': return '🎁';
      default: return '🎁';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Buku Hantaran Seserahan (Seserahan)</h2>
          <p className="text-sm text-stone-500">Tradisi hantaran adat Indonesia. Kelola daftar pembelian barang, proses hias kotak, dan serah terima berdua.</p>
        </div>
        <button
          id="btn-open-add-seserahan-modal"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-stone-50 rounded-lg text-sm font-semibold flex items-center shadow-md transition self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Barang Seserahan
        </button>
      </div>

      {/* DETAILED SESERAHAN METRICS PANEL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono pl-0.5">Total Bingkisan</span>
          <span className="text-lg md:text-xl font-extrabold text-stone-900 block mt-1">{totalItems} Kotak</span>
          <span className="text-[10px] text-zinc-500">Target serah terima</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono pl-0.5">1. Selesai Dibeli</span>
            <span className="text-lg font-extrabold text-neutral-800 mt-1 block">{purchasedCount} / {totalItems}</span>
          </div>
          <ShoppingBag className="w-7 h-7 text-indigo-500 stroke-1" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono pl-0.5">2. Selesai Dihias/Kemas</span>
            <span className="text-lg font-extrabold text-neutral-800 mt-1 block">{packedCount} / {totalItems}</span>
          </div>
          <PackageCheck className="w-7 h-7 text-amber-600 stroke-1" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 block font-mono pl-0.5">3. Telah Tiba di Lokasi</span>
            <span className="text-lg font-extrabold text-emerald-950 mt-1 block">{deliveredCount} / {totalItems}</span>
          </div>
          <Truck className="w-7 h-7 text-emerald-600 stroke-1" />
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Item Search */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              id="search-seserahan-input"
              type="text"
              placeholder="Cari wadah seserahan, mukena, satu set kosmetik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-600 bg-stone-50"
            />
          </div>

          {/* Category Filter */}
          <select
            id="filter-seserahan-category"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as any)}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-amber-600 bg-white cursor-pointer font-semibold text-zinc-700"
          >
            <option value="ALL">Semua Kategori Seserahan</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

        </div>
      </div>

      {/* SESERAHAN PARCELS GRID LIST */}
      {filteredSeserahans.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200/60 p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center mx-auto text-stone-400">
            <Gift className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-sm font-semibold text-stone-700">"No seserahan items yet."</p>
          <p className="text-xs text-stone-400">Mulailah menyusun daftar bingkisan seserahan impian Anda berdua.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeserahans.map((item) => {
            
            // Calculate a mini step percentage (0%, 33%, 66%, 100%)
            let stepsDone = 0;
            if (item.purchased) stepsDone += 1;
            if (item.packed) stepsDone += 1;
            if (item.delivered) stepsDone += 1;
            const progressPercent = Math.round((stepsDone / 3) * 100);

            return (
              <div 
                key={item.id}
                className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Decorative Parcel Header Background */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${progressPercent === 100 ? 'bg-emerald-600' : progressPercent >= 33 ? 'bg-amber-600' : 'bg-stone-200'}`}></div>

                <div className="space-y-3">
                  {/* Category and Title */}
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        {getCategoryEmoji(item.category)} {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 mt-1 leading-tight">{item.itemName}</h4>
                    </div>
                    {progressPercent === 100 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono flex items-center shrink-0">
                        <CheckCircle className="w-3 h-3 mr-0.5" /> READY
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-xs text-stone-500 italic line-clamp-2">
                      "{item.notes}"
                    </p>
                  )}

                  {/* THREE-STEP INTERACTIVE STATE TOGGLES (Very original and engaging!) */}
                  <div className="pt-3 border-t border-stone-100 space-y-2.5">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Langkah-Langkah Hantaran:</span>
                    
                    <div className="space-y-2 text-xs">
                      {/* Step 1: Purchased */}
                      <label 
                        id={`label-purchased-${item.id}`}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-stone-50 cursor-pointer transition"
                      >
                        <span className="flex items-center space-x-2 text-stone-700 font-medium">
                          <ShoppingBag className={`w-3.5 h-3.5 ${item.purchased ? 'text-indigo-600' : 'text-stone-400'}`} />
                          <span>1. Selesai Dibeli</span>
                        </span>
                        <input
                          id={`check-purchased-${item.id}`}
                          type="checkbox"
                          checked={item.purchased}
                          onChange={(e) => onUpdateSeserahan(item.id, { purchased: e.target.checked })}
                          className="rounded border-zinc-350 select-none cursor-pointer h-4 w-4 text-amber-700"
                        />
                      </label>

                      {/* Step 2: Packed */}
                      <label 
                        id={`label-packed-${item.id}`}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-stone-50 cursor-pointer transition"
                      >
                        <span className="flex items-center space-x-2 text-stone-700 font-medium">
                          <PackageCheck className={`w-3.5 h-3.5 ${item.packed ? 'text-amber-700' : 'text-stone-400'}`} />
                          <span>2. Selesai Dihias & Kemas</span>
                        </span>
                        <input
                          id={`check-packed-${item.id}`}
                          type="checkbox"
                          checked={item.packed}
                          onChange={(e) => onUpdateSeserahan(item.id, { packed: e.target.checked })}
                          className="rounded border-zinc-350 select-none cursor-pointer h-4 w-4 text-amber-700"
                        />
                      </label>

                      {/* Step 3: Delivered */}
                      <label 
                        id={`label-delivered-${item.id}`}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-stone-50 cursor-pointer transition"
                      >
                        <span className="flex items-center space-x-2 text-stone-700 font-medium">
                          <Truck className={`w-3.5 h-3.5 ${item.delivered ? 'text-emerald-600' : 'text-stone-400'}`} />
                          <span>3. Tiba di Lokasi (Gedung)</span>
                        </span>
                        <input
                          id={`check-delivered-${item.id}`}
                          type="checkbox"
                          checked={item.delivered}
                          onChange={(e) => onUpdateSeserahan(item.id, { delivered: e.target.checked })}
                          className="rounded border-zinc-350 select-none cursor-pointer h-4 w-4 text-amber-700"
                        />
                      </label>
                    </div>

                  </div>
                </div>

                {/* Footer and Delete Actions */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Progres: {progressPercent}%</span>
                  <button
                    id={`btn-delete-seserahan-${item.id}`}
                    onClick={() => onDeleteSeserahan(item.id)}
                    className="p-1 text-zinc-400 hover:text-red-650 hover:bg-neutral-50 rounded transition flex items-center shrink-0 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Hapus
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW SESERAHAN BOX MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Tambah Bingkisan Seserahan</h3>
            <p className="text-xs text-stone-500 mb-4">Setiap kotak hantaran melambangkan kesiapan berumah tangga.</p>

            <form onSubmit={handleCreateSeserahan} className="space-y-3 text-xs font-semibold text-stone-700">
              <div>
                <label className="block mb-1">Nama Barang / Bingkisan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perlengkapan Ibadah / Sepatu Pesta..."
                  value={newValName}
                  onChange={(e) => setNewValName(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Kategori Hantaran *</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as SeserahanCategory)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-stone-850"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1">Arti Makna / Detail Isi Box</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Mukena katun sutra, dibeli di Thamrin City..."
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
                  id="btn-confirm-add-seserahan"
                  type="submit"
                  className="flex-1 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition"
                >
                  Simpan Bingkisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
