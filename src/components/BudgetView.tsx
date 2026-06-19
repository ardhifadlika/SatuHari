/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  PieChart, 
  Paperclip,
  Wrench,
  Calculator
} from 'lucide-react';
import { BudgetItem, BudgetCategory, BudgetContributor, PaymentStatus } from '../types';

interface BudgetViewProps {
  budgets: BudgetItem[];
  estimatedBudget: number; // Workspace budget
  onAddBudgetItem: (item: Omit<BudgetItem, 'id' | 'isDeleted' | 'deletedAt' | 'isArchived'>) => void;
  onUpdateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  onDeleteBudgetItem: (id: string) => void;
  currentUser: string;
}

export default function BudgetView({
  budgets,
  estimatedBudget,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
  currentUser
}: BudgetViewProps) {
  
  // Navigation & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<BudgetCategory | 'ALL'>('ALL');
  const [filterContributor, setFilterContributor] = useState<BudgetContributor | 'ALL'>('ALL');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'ALL'>('ALL');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState<BudgetCategory>('Catering');
  const [newVendor, setNewVendor] = useState('');
  const [newBudgetAmt, setNewBudgetAmt] = useState<number>(15000000);
  const [newActualCost, setNewActualCost] = useState<number>(15000000);
  const [newPaidAmt, setNewPaidAmt] = useState<number>(5000000);
  const [newDueDate, setNewDueDate] = useState('2026-09-01');
  const [newContributor, setNewContributor] = useState<BudgetContributor>('Couple');
  const [newPayStatus, setNewPayStatus] = useState<PaymentStatus>('DP Paid');
  const [newNotes, setNewNotes] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  // Active items calculation (Ignore Soft Deleted)
  const activeBudgets = budgets.filter(b => !b.isDeleted);

  // Financial summary numbers
  const targetBudget = estimatedBudget;
  const committedBudget = activeBudgets.reduce((sum, b) => sum + (b.actualCost || b.budgetAmount), 0);
  const paidBudget = activeBudgets.reduce((sum, b) => sum + b.paidAmount, 0);
  const remainingBudget = Math.max(0, committedBudget - paidBudget);

  const budgetProgressExceeded = committedBudget > targetBudget;

  const formatIDR = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  const categories: BudgetCategory[] = [
    'Venue', 'Catering', 'Decoration', 'WO', 'Documentation', 'MUA', 
    'Attire', 'Entertainment', 'Invitation', 'Souvenir', 'Transportation', 'Miscellaneous'
  ];

  const contributors: BudgetContributor[] = ['Couple', 'Bride Family', 'Groom Family', 'Other'];
  const paymentStatuses: PaymentStatus[] = ['Not Paid', 'DP Paid', 'Partially Paid', 'Paid Off'];

  // Filter logic
  const filteredBudgets = activeBudgets.filter(item => {
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    if (filterContributor !== 'ALL' && item.contributor !== filterContributor) return false;
    if (filterPayment !== 'ALL' && item.paymentStatus !== filterPayment) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.vendor.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.trim()) {
      alert('Mohon sebutkan nama vendor / target alokasi! 💰');
      return;
    }

    onAddBudgetItem({
      category: newCat,
      vendor: newVendor,
      budgetAmount: newBudgetAmt,
      actualCost: newActualCost,
      paidAmount: newPaidAmt,
      dueDate: newDueDate,
      contributor: newContributor,
      paymentStatus: newPayStatus,
      notes: newNotes,
      attachmentName: newAttachment ? newAttachment : null,
      attachmentUrl: newAttachment ? '#' : null
    });

    // Reset fields
    setNewVendor('');
    setNewBudgetAmt(15000000);
    setNewActualCost(15000000);
    setNewPaidAmt(5000000);
    setNewNotes('');
    setNewAttachment('');
    setShowAddModal(false);
  };

  // Group by category to draw simple visual bar charts
  const categoryAllocations = categories.map(cat => {
    const items = activeBudgets.filter(b => b.category === cat);
    const totalAlloc = items.reduce((sum, b) => sum + b.actualCost, 0);
    const totalPaid = items.reduce((sum, b) => sum + b.paidAmount, 0);
    return { category: cat, allocated: totalAlloc, paid: totalPaid, count: items.length };
  }).filter(c => c.count > 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D312E]">Keuangan & Anggaran</h2>
          <p className="text-sm text-[#A5A58D]">Kalkulasi modal, tenggat waktu, dan kelancaran pembayaran cicilan vendor.</p>
        </div>
        <button
          id="btn-open-add-budget-modal"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#6B705C] hover:bg-[#5C614E] text-[#FDFBF7] rounded-xl text-sm font-semibold flex items-center shadow-xs transition self-start md:self-auto cursor-pointer border-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Alokasi Budget
        </button>
      </div>

      {/* DETAILED BUDGET METRIC ROWS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#A5A58D] block font-mono pl-0.5">Target Rencana Utama</span>
          <span className="text-lg md:text-xl font-extrabold text-[#2D312E] block mt-1">{formatIDR(targetBudget)}</span>
          <span className="text-[10px] text-[#A5A58D]">Plafon anggaran dasar</span>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${budgetProgressExceeded ? 'bg-red-50/50 border-red-200 text-red-950' : 'bg-white border-[#E8E2D9]'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-[#A5A58D] block font-mono">Beban Berkontrak</span>
            {budgetProgressExceeded && (
              <span className="bg-red-200 text-red-900 font-bold text-[9px] px-1.5 rounded-full font-mono">over-budget!</span>
            )}
          </div>
          <span className={`text-lg md:text-xl font-extrabold block mt-1 ${budgetProgressExceeded ? 'text-red-600' : 'text-[#2D312E]'}`}>{formatIDR(committedBudget)}</span>
          <span className="text-[10px] text-[#A5A58D]">
            {budgetProgressExceeded ? `Melebihi target Rp ${(committedBudget - targetBudget).toLocaleString('id-ID')}` : 'Sesuai dengan target rencana'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#CB997E] block font-mono">Total Terbayar</span>
          <span className="text-lg md:text-xl font-extrabold text-[#CB997E] block mt-1">{formatIDR(paidBudget)}</span>
          <span className="text-[10px] text-[#A5A58D] font-medium">Lunas / Uang Muka (DP)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#6B705C] block font-mono">Sisa Pelunasan</span>
          <span className="text-lg md:text-xl font-extrabold text-[#6B705C] block mt-1">{formatIDR(remainingBudget)}</span>
          <span className="text-[10px] text-[#A5A58D]">Tagihan tersisa</span>
        </div>
      </div>

      {/* INTERACTIVE COMPACT CATEGORIES ALLOCATION SUMMARY */}
      {categoryAllocations.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-[#6B705C]" />
            <h4 className="text-sm font-bold text-[#2D312E] uppercase tracking-wider font-mono">Alokasi Berdasarkan Kategori</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryAllocations.map(c => {
              const allocationPct = committedBudget > 0 ? (c.allocated / committedBudget) * 100 : 0;
              const paidPct = c.allocated > 0 ? (c.paid / c.allocated) * 100 : 0;
              return (
                <div key={c.category} className="p-3 bg-[#FAF9F5] rounded-xl space-y-2 border border-[#E8E2D9] text-xs">
                  <div className="flex justify-between items-center font-bold text-[#2D312E]">
                    <span>{c.category} ({c.count} item)</span>
                    <span className="font-mono">{formatIDR(c.allocated)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#A5A58D]">
                      <span>Porsi Anggaran Total:</span>
                      <span>{Math.round(allocationPct)}%</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#6B705C] font-semibold">
                      <span>Rasio Terbayar:</span>
                      <span>{Math.round(paidPct)}%</span>
                    </div>
                    {/* Multi bar visual representation */}
                    <div className="w-full bg-[#E8E2D9] h-1.5 rounded-full overflow-hidden relative">
                      <div className="bg-[#6B705C] h-full rounded-full transition-all" style={{ width: `${paidPct}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Vendor Search */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-[#A5A58D] absolute left-3 top-3" />
            <input
              id="search-budget-input"
              type="text"
              placeholder="Cari alokasi katering, dekorator, fotografer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C] bg-[#FAF9F5] text-[#2D312E]"
            />
          </div>

          {/* Category Filter */}
          <select
            id="filter-budget-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:border-[#6B705C] bg-white cursor-pointer font-bold text-[#2D312E]"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* Contributor Filter */}
          <select
            id="filter-budget-contributor"
            value={filterContributor}
            onChange={(e) => setFilterContributor(e.target.value as any)}
            className="px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:border-[#6B705C] bg-white cursor-pointer font-bold text-[#2D312E]"
          >
            <option value="ALL">Penyumbang: Semua</option>
            {contributors.map(con => <option key={con} value={con}>{con}</option>)}
          </select>

          {/* Payment Status Filter */}
          <select
            id="filter-budget-payment"
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value as any)}
            className="px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:border-[#6B705C] bg-white cursor-pointer font-bold text-[#2D312E]"
          >
            <option value="ALL">Status Cicilan: Semua</option>
            {paymentStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      {/* DETAILED BUDGET ITEMS TABLE */}
      {filteredBudgets.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F5] flex items-center justify-center mx-auto text-[#A5A58D]">
            <DollarSign className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-sm font-semibold text-[#2D312E]">"No budget items yet. Start planning your wedding budget."</p>
          <p className="text-xs text-[#A5A58D]">Atur pembiayaan perhiasan kawin, katering prasmanan, sanggar makeup, dan sewa busana pendamping.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E8E2D9] text-[#2D312E] uppercase font-mono tracking-wider font-extrabold">
                <tr>
                  <th className="p-4">Kategori & Vendor</th>
                  <th className="p-4 text-right">Rencana Pokok</th>
                  <th className="p-4 text-right">Biaya Aktual</th>
                  <th className="p-4 text-right">Telah Terbayar</th>
                  <th className="p-4 text-right">Sisa Tagihan</th>
                  <th className="p-4">Status & Donatur</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]/40 font-medium">
                {filteredBudgets.map((item) => {
                  const billLeft = Math.max(0, item.actualCost - item.paidAmount);
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF9F5]/40 transition">
                      <td className="p-4">
                        <span className="font-bold text-[#2D312E] block">{item.vendor}</span>
                        <div className="flex items-center space-x-2 pt-1 text-[11px] text-[#A5A58D]">
                          <span className="bg-[#CB997E]/10 text-[#CB997E] font-bold px-2 py-0.5 rounded-lg font-mono uppercase text-[9px]">{item.category}</span>
                          {item.attachmentName && (
                            <span className="flex items-center text-zinc-400 truncate max-w-28 font-mono" title={item.attachmentName}>
                              <Paperclip className="w-3 h-3 mr-0.5" />
                              {item.attachmentName}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4 text-right font-mono text-zinc-700">
                        {formatIDR(item.budgetAmount)}
                      </td>
                      
                      <td className="p-4 text-right font-mono font-bold text-zinc-900">
                        <input
                          id={`input-actual-${item.id}`}
                          type="number"
                          value={item.actualCost}
                          onChange={(e) => onUpdateBudgetItem(item.id, { actualCost: parseInt(e.target.value) || 0 })}
                          className="w-24 text-right p-1.5 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] text-[#2D312E] focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20"
                        />
                      </td>

                      <td className="p-4 text-right font-mono text-emerald-800">
                        <input
                          type="number"
                          value={item.paidAmount}
                          onChange={(e) => onUpdateBudgetItem(item.id, { paidAmount: parseInt(e.target.value) || 0 })}
                          className="w-24 text-right p-1.5 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] text-[#2D312E] focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20"
                        />
                      </td>

                      <td className="p-4 text-right font-mono font-bold text-amber-900">
                        {formatIDR(billLeft)}
                      </td>

                      <td className="p-4 space-y-1">
                        {/* Interactive Status Changer */}
                        <select
                          id={`select-pay-status-${item.id}`}
                          value={item.paymentStatus}
                          onChange={(e) => onUpdateBudgetItem(item.id, { paymentStatus: e.target.value as PaymentStatus })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer focus:outline-none uppercase border ${item.paymentStatus === 'Paid Off' ? 'bg-[#6B705C]/10 text-[#6B705C] border-[#6B705C]/20' : item.paymentStatus === 'Partially Paid' ? 'bg-blue-50 text-blue-800 border-blue-100' : item.paymentStatus === 'DP Paid' ? 'bg-[#FAF9F5] border-[#E8E2D9] text-[#2D312E]' : 'bg-red-50 text-red-800 border-red-100'}`}
                        >
                          <option value="Not Paid">Belum Bayar</option>
                          <option value="DP Paid">DP Masuk (Uang Muka)</option>
                          <option value="Partially Paid">Cicilan Berjalan</option>
                          <option value="Paid Off">Selesai / Lunas</option>
                        </select>

                        <div className="text-[10px] text-[#A5A58D] font-bold block pt-0.5">
                          Penyokong: <span className="text-[#2D312E] underline">{item.contributor}</span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          id={`btn-delete-budget-${item.id}`}
                          onClick={() => onDeleteBudgetItem(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition inline-block border-0 cursor-pointer"
                          title="Hapus Alokasi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD BUDGET MODAL POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#2D312E]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 md:p-8 border border-[#E8E2D9] relative overflow-hidden">
            {/* Background Decorative Blur Blobs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#CB997E]/5 rounded-full filter blur-2xl -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#6B705C]/5 rounded-full filter blur-xl -translate-x-6 translate-y-6"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-[#2D312E] mb-1 font-sans">Tambah Alokasi Keuangan</h3>
              <p className="text-xs text-[#A5A58D] mb-6 font-medium">Integrasikan perkiraan jasa, DP cicilan, berkontrak pelunasan.</p>

              <form onSubmit={handleCreateBudgetItem} className="space-y-4 text-xs font-semibold text-[#2D312E]">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[1.5rem] flex items-end pb-1.5 font-sans">Kategori Tradisional *</label>
                    <select
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value as BudgetCategory)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-white focus:outline-none font-medium text-[#2D312E] h-10 border-[#E8E2D9] focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[1.5rem] flex items-end pb-1.5 font-sans">Nama Jasa / Vendor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Catering Syamil Adat..."
                      value={newVendor}
                      onChange={(e) => setNewVendor(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] focus:outline-none text-[#2D312E] h-10 focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[2.5rem] flex items-end pb-1.5 leading-tight font-sans">Anggaran Awal</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Rp"
                      value={newBudgetAmt}
                      onChange={(e) => setNewBudgetAmt(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] focus:outline-none text-[#2D312E] h-10 focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[2.5rem] flex items-end pb-1.5 leading-tight font-sans">Biaya Riil (Negosiasi)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Rp"
                      value={newActualCost}
                      onChange={(e) => setNewActualCost(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] focus:outline-none text-[#2D312E] h-10 focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[2.5rem] flex items-end pb-1.5 leading-tight font-sans">Uang Muka (DP/Bayar)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Rp"
                      value={newPaidAmt}
                      onChange={(e) => setNewPaidAmt(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] focus:outline-none text-[#2D312E] h-10 focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[2.25rem] flex items-end pb-1.5 leading-tight font-sans">Status Pembayaran</label>
                    <select
                      value={newPayStatus}
                      onChange={(e) => setNewPayStatus(e.target.value as PaymentStatus)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-white focus:outline-none font-medium text-[#2D312E] h-10 border-[#E8E2D9] focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    >
                      <option value="Not Paid">Belum Bayar</option>
                      <option value="DP Paid">DP Masuk (Uang Muka)</option>
                      <option value="Partially Paid">Cicilan Berjalan</option>
                      <option value="Paid Off">Selesai / Lunas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[2.25rem] flex items-end pb-1.5 leading-tight font-sans">Sumber Penyokong Donatur</label>
                    <select
                      value={newContributor}
                      onChange={(e) => setNewContributor(e.target.value as BudgetContributor)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-white focus:outline-none font-medium text-[#2D312E] h-10 border-[#E8E2D9] focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    >
                      <option value="Couple">Tabungan Berdua (Couple)</option>
                      <option value="Bride Family">Keluarga Wanita (Bride)</option>
                      <option value="Groom Family">Keluarga Pria (Groom)</option>
                      <option value="Other">Pihak Lainnya (Sponsor/Kado)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[2.5rem] flex items-end pb-1.5 leading-tight font-sans">Tenggat Tanggal Tagihan</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] focus:outline-none text-[#2D312E] h-10 focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2D312E] min-h-[2.5rem] flex items-end pb-1.5 leading-tight font-sans">Nama Lampiran Berkas (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Kuitansi_Pelunasan.pdf"
                      value={newAttachment}
                      onChange={(e) => setNewAttachment(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] focus:outline-none text-[#2D312E] h-10 focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D312E] mb-1.5 font-sans">Catatan Tambahan</label>
                  <textarea
                    rows={2}
                    placeholder="Kriteria menu penambahan, bonus dekorasi panggung, dlsb."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl text-xs bg-[#FAF9F5] focus:outline-none font-medium text-[#2D312E] focus:ring-2 focus:ring-[#6B705C]/20 focus:border-[#6B705C]"
                  />
                </div>

                <div className="flex space-x-3 pt-5 border-t border-[#E8E2D9] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-[#E8E2D9] hover:bg-[#FAF9F5] rounded-xl text-[#2D312E] transition font-bold cursor-pointer bg-white"
                  >
                    Kembali
                  </button>
                  <button
                    id="btn-confirm-add-budget"
                    type="submit"
                    className="flex-1 py-3 bg-[#6B705C] hover:bg-[#5C614E] text-[#FDFBF7] rounded-xl transition font-bold shadow-xs cursor-pointer border-0"
                  >
                    Simpan Finansial
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
