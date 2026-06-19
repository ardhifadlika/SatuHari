/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  Trash, 
  AlertCircle, 
  Inbox, 
  CheckSquare, 
  DollarSign, 
  Building, 
  Users, 
  Gift 
} from 'lucide-react';
import { Task, BudgetItem, VendorItem, GuestItem, SeserahanItem } from '../types';

interface TrashHistoryViewProps {
  tasks: Task[];
  budgets: BudgetItem[];
  vendors: VendorItem[];
  guests: GuestItem[];
  seserahans: SeserahanItem[];
  onRestoreTask: (id: string) => void;
  onRestoreBudget: (id: string) => void;
  onRestoreVendor: (id: string) => void;
  onRestoreGuest: (id: string) => void;
  onRestoreSeserahan: (id: string) => void;
  onPermanentDeleteTask: (id: string) => void;
  onPermanentDeleteBudget: (id: string) => void;
  onPermanentDeleteVendor: (id: string) => void;
  onPermanentDeleteGuest: (id: string) => void;
  onPermanentDeleteSeserahan: (id: string) => void;
  onEmptyTrashAll: () => void;
}

export default function TrashHistoryView({
  tasks,
  budgets,
  vendors,
  guests,
  seserahans,
  onRestoreTask,
  onRestoreBudget,
  onRestoreVendor,
  onRestoreGuest,
  onRestoreSeserahan,
  onPermanentDeleteTask,
  onPermanentDeleteBudget,
  onPermanentDeleteVendor,
  onPermanentDeleteGuest,
  onPermanentDeleteSeserahan,
  onEmptyTrashAll
}: TrashHistoryViewProps) {
  
  // Tab within trash
  const [trashTab, setTrashTab] = useState<'checklist' | 'budget' | 'vendor' | 'guest' | 'seserahan'>('checklist');

  // Filter soft deleted items
  const deletedTasks = tasks.filter(t => t.isDeleted);
  const deletedBudgets = budgets.filter(b => b.isDeleted);
  const deletedVendors = vendors.filter(v => v.isDeleted);
  const deletedGuests = guests.filter(g => g.isDeleted);
  const deletedSeserahans = seserahans.filter(s => s.isDeleted);

  const totalTrashCount = 
    deletedTasks.length + 
    deletedBudgets.length + 
    deletedVendors.length + 
    deletedGuests.length + 
    deletedSeserahans.length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Riwayat Sampah (Soft Delete)</h2>
          <p className="text-sm text-stone-500">
            Setiap data yang Anda hapus diproteksi sementara selama 30 Hari sebelum terhapus secara permanen.
          </p>
        </div>

        {totalTrashCount > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh isi tempat sampah secara permanen? 🗑️❗')) {
                onEmptyTrashAll();
              }
            }}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-stone-50 rounded-lg text-xs font-bold flex items-center transition shadow-sm cursor-pointer self-start md:self-auto"
          >
            <Trash className="w-4 h-4 mr-1.5" />
            Kosongkan Tempat Sampah
          </button>
        )}
      </div>

      {totalTrashCount === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200/60 p-16 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center mx-auto text-stone-400">
            <Inbox className="w-7 h-7 stroke-1" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-stone-700">Tempat Sampah Bersih! ✨</p>
            <p className="text-xs text-stone-400">Tidak ada agenda, rincian biaya katering, kontak vendor atau tamu di folder proteksi sampah.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Sub Trash Segment selectors */}
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setTrashTab('checklist')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition ${trashTab === 'checklist' ? 'border-amber-700 text-amber-950 font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              Checklist ({deletedTasks.length})
            </button>
            <button
              onClick={() => setTrashTab('budget')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition ${trashTab === 'budget' ? 'border-amber-700 text-amber-950 font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              Budgets ({deletedBudgets.length})
            </button>
            <button
              onClick={() => setTrashTab('vendor')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition ${trashTab === 'vendor' ? 'border-amber-700 text-amber-950 font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              Vendors ({deletedVendors.length})
            </button>
            <button
              onClick={() => setTrashTab('guest')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition ${trashTab === 'guest' ? 'border-amber-700 text-amber-950 font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              Tamu ({deletedGuests.length})
            </button>
            <button
              onClick={() => setTrashTab('seserahan')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition ${trashTab === 'seserahan' ? 'border-amber-700 text-amber-950 font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              Seserahan ({deletedSeserahans.length})
            </button>
          </div>

          <div className="bg-white rounded-xl border border-stone-200/75 p-5 min-h-60">
            
            {/* Trash Tab checklist display */}
            {trashTab === 'checklist' && (
              deletedTasks.length === 0 ? (
                <p className="text-zinc-400 text-xs italic text-center py-10">Tidak ada item checklist terhapus.</p>
              ) : (
                <div className="divide-y divide-zinc-100 text-xs text-stone-700">
                  {deletedTasks.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-stone-900 block text-sm">{item.title}</span>
                        <p className="text-zinc-500 text-[11px] font-medium">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreTask(item.id)}
                          className="px-2.5 py-1.5 border border-zinc-200 hover:border-amber-600 bg-white hover:bg-amber-50/10 text-stone-850 rounded flex items-center transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-700" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteTask(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Trash Tab budget display */}
            {trashTab === 'budget' && (
              deletedBudgets.length === 0 ? (
                <p className="text-zinc-400 text-xs italic text-center py-10">Tidak ada alokasi pembagian biaya terhapus.</p>
              ) : (
                <div className="divide-y divide-zinc-100 text-xs text-stone-700">
                  {deletedBudgets.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-stone-900 block text-sm">{item.vendor}</span>
                        <p className="text-zinc-500 text-[11px] font-medium">Alokasi: <span className="text-stone-800 font-bold font-mono">Rp {item.actualCost.toLocaleString('id-ID')}</span> • Kategori {item.category}</p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreBudget(item.id)}
                          className="px-2.5 py-1.5 border border-zinc-200 hover:border-amber-600 bg-white hover:bg-amber-50/10 text-stone-850 rounded flex items-center transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-700" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteBudget(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-55 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Trash Tab vendor display */}
            {trashTab === 'vendor' && (
              deletedVendors.length === 0 ? (
                <p className="text-zinc-400 text-xs italic text-center py-10">Tidak ada draf kontak vendor terhapus.</p>
              ) : (
                <div className="divide-y divide-zinc-100 text-xs text-stone-700">
                  {deletedVendors.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-stone-900 block text-sm">{item.name}</span>
                        <p className="text-zinc-500 text-[11px] font-medium">Kategori: {item.category} • CP {item.contactPerson}</p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreVendor(item.id)}
                          className="px-2.5 py-1.5 border border-zinc-200 hover:border-amber-600 bg-white hover:bg-amber-50/10 text-stone-850 rounded flex items-center transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-700" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteVendor(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-655 hover:bg-red-55 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Trash Tab guest display */}
            {trashTab === 'guest' && (
              deletedGuests.length === 0 ? (
                <p className="text-zinc-400 text-xs italic text-center py-10">Tidak ada tamu undangan terhapus.</p>
              ) : (
                <div className="divide-y divide-zinc-100 text-xs text-stone-700">
                  {deletedGuests.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-stone-900 block text-sm">{item.name}</span>
                        <p className="text-zinc-500 text-[11px] font-medium">Hubungan: {item.category} • Kapasitas {item.pax} Orang</p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreGuest(item.id)}
                          className="px-2.5 py-1.5 border border-zinc-200 hover:border-amber-600 bg-white hover:bg-amber-50/10 text-stone-850 rounded flex items-center transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-700" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteGuest(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-55 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Trash Tab seserahan display */}
            {trashTab === 'seserahan' && (
              deletedSeserahans.length === 0 ? (
                <p className="text-zinc-400 text-xs italic text-center py-10">Tidak ada barang parcel seserahan terhapus.</p>
              ) : (
                <div className="divide-y divide-zinc-100 text-xs text-stone-700">
                  {deletedSeserahans.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-stone-900 block text-sm">{item.itemName}</span>
                        <p className="text-zinc-500 text-[11px]">Bagian: {item.category} • {item.notes}</p>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreSeserahan(item.id)}
                          className="px-2.5 py-1.5 border border-zinc-200 hover:border-amber-600 bg-white hover:bg-amber-50/10 text-stone-850 rounded flex items-center transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-705 text-amber-700 mr-1" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteSeserahan(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-655 hover:bg-red-55 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

          </div>
        </div>
      )}

    </div>
  );
}
