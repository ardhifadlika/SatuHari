/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Archive, 
  Calendar, 
  Paperclip, 
  User, 
  UserPlus, 
  Filter, 
  Search, 
  Undo2, 
  Wand2, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Task, TaskOwner, TaskStatus } from '../types';
import { TIMELINE_TEMPLATES_12M, TIMELINE_TEMPLATES_6M, TIMELINE_TEMPLATES_3M } from '../data/templates';

interface ChecklistViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'isDeleted' | 'deletedAt' | 'isArchived'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
  currentUser: string;
}

export default function ChecklistView({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onArchiveTask,
  currentUser
}: ChecklistViewProps) {
  // Screen/State helpers
  const [filterOwner, setFilterOwner] = useState<TaskOwner | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL' | 'ARCHIVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Task state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOwner, setNewOwner] = useState<TaskOwner>('TOGETHER');
  const [newDueDate, setNewDueDate] = useState('2026-08-17');
  const [newAttachment, setNewAttachment] = useState<string>('');

  // Active / Filtered tasks calculation
  const activeTasks = tasks.filter(t => !t.isDeleted);
  
  const filteredTasks = activeTasks.filter(task => {
    if (filterStatus === 'ARCHIVED') {
      if (!task.isArchived) return false;
    } else {
      if (task.isArchived) return false;
      if (filterStatus !== 'ALL' && task.status !== filterStatus) return false;
    }

    if (filterOwner !== 'ALL' && task.owner !== filterOwner) return false;
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(q);
      const matchesDesc = task.description.toLowerCase().includes(q);
      return matchesTitle || matchesDesc;
    }
    
    return true;
  });

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      description: newDescription,
      owner: newOwner,
      dueDate: newDueDate,
      status: 'NOT_STARTED',
      attachmentName: newAttachment ? newAttachment : null,
      attachmentUrl: newAttachment ? '#' : null
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewOwner('TOGETHER');
    setNewDueDate('2026-08-17');
    setNewAttachment('');
    setShowAddModal(false);
  };

  const applyTemplate = (months: 12 | 6 | 3) => {
    const templates = months === 12 
      ? TIMELINE_TEMPLATES_12M 
      : months === 6 
        ? TIMELINE_TEMPLATES_6M 
        : TIMELINE_TEMPLATES_3M;

    const todayStr = '2026-06-19'; // Static simulation day

    templates.forEach(t => {
      onAddTask({
        title: `[T-${months}M] ${t.title}`,
        description: t.description,
        owner: t.owner as TaskOwner,
        dueDate: months === 12 ? '2026-07-31' : months === 6 ? '2026-08-17' : '2026-09-17',
        status: 'NOT_STARTED',
        attachmentName: null,
        attachmentUrl: null
      });
    });

    alert(`Berhasil menambahkan ${templates.length} tugas rekomendasi template ${months} bulan! 🪄💕`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Checklist Persiapan</h2>
          <p className="text-sm text-stone-500">Susun prioritas, jadwalkan, dan bagi tugas persiapan pernikahan bersama pasangan.</p>
        </div>
        <button
          id="btn-open-add-task-modal"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-stone-50 rounded-lg text-sm font-semibold flex items-center shadow-md transition self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Tugas Baru
        </button>
      </div>

      {/* QUICK TEMPLATE GENERATOR PRESETS PANEL */}
      <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-900 flex items-center font-mono uppercase tracking-wider">
            <Wand2 className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
            Asisten Template Rencana
          </span>
          <p className="text-xs text-stone-600">Butuh panduan? Tambahkan tugas rekomendasi pernikahan Indonesia berdasarkan jangka waktu sisa Anda.</p>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button
            id="btn-apply-template-12"
            onClick={() => applyTemplate(12)}
            className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-zinc-200 hover:border-amber-700 text-zinc-700 hover:text-amber-950 font-semibold rounded-lg text-xs transition inline-flex items-center"
          >
            🗓️ Rencana 12 Bulan
          </button>
          <button
            id="btn-apply-template-6"
            onClick={() => applyTemplate(6)}
            className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-zinc-200 hover:border-amber-700 text-zinc-700 hover:text-amber-950 font-semibold rounded-lg text-xs transition inline-flex items-center"
          >
            📆 Rencana 6 Bulan
          </button>
          <button
            id="btn-apply-template-3"
            onClick={() => applyTemplate(3)}
            className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-zinc-200 hover:border-amber-700 text-zinc-700 hover:text-amber-950 font-semibold rounded-lg text-xs transition inline-flex items-center"
          >
            ⏰ Rencana 3 Bulan
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              id="search-tasks-input"
              type="text"
              placeholder="Cari tugas persiapan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-600 bg-stone-50"
            />
          </div>

          {/* Assigned Owner Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap inline-flex items-center"><User className="w-3.5 h-3.5 mr-1" /> PIC:</span>
            <select
              id="filter-tasks-owner"
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value as any)}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-amber-600 bg-white cursor-pointer font-medium"
            >
              <option value="ALL">Semua PIC (PJP)</option>
              <option value="PARTNER_A">Ami (Calon Wanita)</option>
              <option value="PARTNER_B">Ardhi (Calon Pria)</option>
              <option value="TOGETHER">Bersama</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap inline-flex items-center"><Filter className="w-3.5 h-3.5 mr-1" /> Status:</span>
            <select
              id="filter-tasks-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-amber-600 bg-white cursor-pointer font-medium"
            >
              <option value="ALL">Semua Status Persiapan</option>
              <option value="NOT_STARTED">Belum Dimulai</option>
              <option value="IN_PROGRESS">Sedang Dikerjakan</option>
              <option value="COMPLETED">Telah Selesai</option>
              <option value="ARCHIVED">Arsip Tugas</option>
            </select>
          </div>

        </div>
      </div>

      {/* TASKS LIST */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200/60 p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center mx-auto text-stone-400">
            <CheckSquare className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-sm font-semibold text-stone-700">Tidak ada tugas persiapan pernikahan.</p>
          <p className="text-xs text-stone-400">Sesuaikan filter pencarian, gunakan asisten rencana, atau buat rencana tugas perdana Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div 
              key={task.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between space-y-4 ${task.status === 'COMPLETED' ? 'border-zinc-250 bg-stone-50/50 opacity-80' : 'border-stone-200/80'}`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`text-sm font-bold text-stone-900 ${task.status === 'COMPLETED' ? 'line-through text-stone-400' : ''}`}>
                    {task.title}
                  </h3>
                  
                  {/* Status Badges Select */}
                  <select
                    id={`status-select-${task.id}`}
                    value={task.status}
                    onChange={(e) => onUpdateTask(task.id, { status: e.target.value as TaskStatus })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer focus:outline-none uppercase-label ${task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : task.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-800' : 'bg-yellow-105 bg-amber-50 text-amber-800 border-none'}`}
                  >
                    <option value="NOT_STARTED">BELUM DIMULAI</option>
                    <option value="IN_PROGRESS">SEDANG DIKERJAKAN</option>
                    <option value="COMPLETED">SELESAI</option>
                  </select>
                </div>
                
                <p className={`text-xs text-zinc-600 line-clamp-2 ${task.status === 'COMPLETED' ? 'text-stone-400/90' : ''}`}>
                  {task.description || 'Tidak ada deskripsi rinci.'}
                </p>
              </div>

              {/* Meta & Actions */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-stone-500 font-mono">
                <div className="flex flex-wrap gap-x-3 gap-y-1 inline-flex items-center">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                    {new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                  
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${task.owner === 'PARTNER_A' ? 'bg-pink-100 text-pink-700' : task.owner === 'PARTNER_B' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'}`}>
                    PIC: {task.owner === 'PARTNER_A' ? 'Ami' : task.owner === 'PARTNER_B' ? 'Ardhi' : 'Kombinasi'}
                  </span>

                  {task.attachmentName && (
                    <span 
                      className="bg-zinc-100 px-1.5 py-0.5 rounded text-[9px] text-zinc-600 truncate flex items-center max-w-40"
                      title={task.attachmentName}
                    >
                      <Paperclip className="w-3 h-3 mr-0.5" />
                      {task.attachmentName}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                  <button
                    id={`btn-archive-${task.id}`}
                    onClick={() => onArchiveTask(task.id)}
                    className="p-1 text-zinc-400 hover:text-amber-800 rounded hover:bg-stone-100 transition"
                    title={task.isArchived ? "Keluarkan dari Arsip" : "Arsipkan Tugas"}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    id={`btn-delete-${task.id}`}
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 text-zinc-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                    title="Hapus (Soft Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD TASK MODAL POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Tambah Tugas Pernikahan</h3>
            <p className="text-xs text-stone-500 mb-4">Pastikan PIC dan tenggat pengerjaan sudah ideal bersama calon pendamping.</p>

            <form onSubmit={handleAddNewTask} className="space-y-3 text-xs font-semibold text-stone-700">
              <div>
                <label className="block mb-1">Nama Agenda / Tugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mengukur busana pernikahan..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Keterangan / Detail Cara</label>
                <textarea
                  rows={2}
                  placeholder="Kebutuhan berkas, tempat jahit, catatan kriteria dll"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Siapa Penanggung Jawab? *</label>
                  <select
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value as TaskOwner)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-white focus:outline-none"
                  >
                    <option value="TOGETHER">Bersama (Duo)</option>
                    <option value="PARTNER_A">Ami (Calon Wanita)</option>
                    <option value="PARTNER_B">Ardhi (Calon Pria)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Tenggat Waktu *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Lampirkan Nama Berkas (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: pricelist-katering.pdf / proposal-dekor.png"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  className="w-full p-2 border border-zinc-200 rounded-lg text-xs bg-stone-50 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-4 border-t border-zinc-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border border-zinc-200 hover:bg-stone-50 rounded-lg transition text-stone-600"
                >
                  Kembali
                </button>
                <button
                  id="btn-confirm-add-task"
                  type="submit"
                  className="flex-1 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition"
                >
                  Tambahkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
