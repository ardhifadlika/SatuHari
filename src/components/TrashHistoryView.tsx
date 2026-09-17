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
import { formatRupiah } from '../utils/currency';

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
          <h2 className="text-2xl font-bold tracking-tight text-[#0D1C17]">Riwayat Sampah (Soft Delete)</h2>
          <p className="text-sm text-[#788A82]">
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
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center transition shadow-xs cursor-pointer self-start md:self-auto border-0"
          >
            <Trash className="w-4 h-4 mr-1.5" />
            Kosongkan Tempat Sampah
          </button>
        )}
      </div>

      {totalTrashCount === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DDD9] p-16 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF5F5] flex items-center justify-center mx-auto text-[#788A82]">
            <Inbox className="w-7 h-7 stroke-1" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#0D1C17]">Tempat Sampah Bersih! ✨</p>
            <p className="text-xs text-[#788A82]">Tidak ada agenda, rincian biaya katering, kontak vendor atau tamu di folder proteksi sampah.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Sub Trash Segment selectors */}
          <div className="flex border-b border-[#E8DDD9]">
            <button
              onClick={() => setTrashTab('checklist')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${trashTab === 'checklist' ? 'border-[#1C3E33] text-[#1C3E33] font-extrabold' : 'border-transparent text-[#788A82] hover:text-[#0D1C17]'}`}
            >
              Checklist ({deletedTasks.length})
            </button>
            <button
              onClick={() => setTrashTab('budget')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${trashTab === 'budget' ? 'border-[#1C3E33] text-[#1C3E33] font-extrabold' : 'border-transparent text-[#788A82] hover:text-[#0D1C17]'}`}
            >
              Budgets ({deletedBudgets.length})
            </button>
            <button
              onClick={() => setTrashTab('vendor')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${trashTab === 'vendor' ? 'border-[#1C3E33] text-[#1C3E33] font-extrabold' : 'border-transparent text-[#788A82] hover:text-[#0D1C17]'}`}
            >
              Vendors ({deletedVendors.length})
            </button>
            <button
              onClick={() => setTrashTab('guest')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${trashTab === 'guest' ? 'border-[#1C3E33] text-[#1C3E33] font-extrabold' : 'border-transparent text-[#788A82] hover:text-[#0D1C17]'}`}
            >
              Tamu ({deletedGuests.length})
            </button>
            <button
              onClick={() => setTrashTab('seserahan')}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${trashTab === 'seserahan' ? 'border-[#1C3E33] text-[#1C3E33] font-extrabold' : 'border-transparent text-[#788A82] hover:text-[#0D1C17]'}`}
            >
              Seserahan ({deletedSeserahans.length})
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DDD9] p-5 min-h-60 shadow-xs">
            
            {/* Trash Tab checklist display */}
            {trashTab === 'checklist' && (
              deletedTasks.length === 0 ? (
                <p className="text-[#788A82] text-xs italic text-center py-10">Tidak ada item checklist terhapus.</p>
              ) : (
                <div className="divide-y divide-[#E8DDD9] text-xs text-[#2D3D36]">
                  {deletedTasks.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-[#0D1C17] block text-sm">{item.title}</span>
                        <p className="text-[#788A82] text-[11px] font-medium">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreTask(item.id)}
                          className="px-3 py-1.5 border border-[#E8DDD9] hover:border-[#1C3E33] bg-white hover:bg-[#1C3E33]/5 text-[#1C3E33] font-bold rounded-xl flex items-center transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#1C3E33]" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteTask(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition cursor-pointer border-0"
                          title="Hapus Permanen"
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
                <p className="text-[#788A82] text-xs italic text-center py-10">Tidak ada alokasi pembagian biaya terhapus.</p>
              ) : (
                <div className="divide-y divide-[#E8DDD9] text-xs text-[#2D3D36]">
                  {deletedBudgets.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-[#0D1C17] block text-sm">{item.vendor}</span>
                        <p className="text-[#788A82] text-[11px] font-medium">Alokasi: <span className="text-[#0D1C17] font-bold font-mono">{formatRupiah(item.actualCost)}</span> • Kategori {item.category}</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreBudget(item.id)}
                          className="px-3 py-1.5 border border-[#E8DDD9] hover:border-[#1C3E33] bg-white hover:bg-[#1C3E33]/5 text-[#1C3E33] font-bold rounded-xl flex items-center transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#1C3E33]" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteBudget(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition cursor-pointer border-0"
                          title="Hapus Permanen"
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
                <p className="text-[#788A82] text-xs italic text-center py-10">Tidak ada draf kontak vendor terhapus.</p>
              ) : (
                <div className="divide-y divide-[#E8DDD9] text-xs text-[#2D3D36]">
                  {deletedVendors.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-[#0D1C17] block text-sm">{item.name}</span>
                        <p className="text-[#788A82] text-[11px] font-medium">Kategori: {item.category} • CP {item.contactPerson}</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreVendor(item.id)}
                          className="px-3 py-1.5 border border-[#E8DDD9] hover:border-[#1C3E33] bg-white hover:bg-[#1C3E33]/5 text-[#1C3E33] font-bold rounded-xl flex items-center transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#1C3E33]" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteVendor(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition cursor-pointer border-0"
                          title="Hapus Permanen"
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
                <p className="text-[#788A82] text-xs italic text-center py-10">Tidak ada tamu undangan terhapus.</p>
              ) : (
                <div className="divide-y divide-[#E8DDD9] text-xs text-[#2D3D36]">
                  {deletedGuests.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-[#0D1C17] block text-sm">{item.name}</span>
                        <p className="text-[#788A82] text-[11px] font-medium">Hubungan: {item.category} • Kapasitas {item.pax} Orang</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreGuest(item.id)}
                          className="px-3 py-1.5 border border-[#E8DDD9] hover:border-[#1C3E33] bg-white hover:bg-[#1C3E33]/5 text-[#1C3E33] font-bold rounded-xl flex items-center transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#1C3E33]" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteGuest(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition cursor-pointer border-0"
                          title="Hapus Permanen"
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
                <p className="text-[#788A82] text-xs italic text-center py-10">Tidak ada barang parcel seserahan terhapus.</p>
              ) : (
                <div className="divide-y divide-[#E8DDD9] text-xs text-[#2D3D36]">
                  {deletedSeserahans.map(item => (
                    <div key={item.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-[#0D1C17] block text-sm">{item.itemName}</span>
                        <p className="text-[#788A82] text-[11px]">Bagian: {item.category} • {item.notes}</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
                        <button
                          onClick={() => onRestoreSeserahan(item.id)}
                          className="px-3 py-1.5 border border-[#E8DDD9] hover:border-[#1C3E33] bg-white hover:bg-[#1C3E33]/5 text-[#1C3E33] font-bold rounded-xl flex items-center transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#1C3E33]" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDeleteSeserahan(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition cursor-pointer border-0"
                          title="Hapus Permanen"
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
