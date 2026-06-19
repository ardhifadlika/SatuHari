/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckSquare, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  FileText,
  Activity,
  ArrowRight,
  Gift
} from 'lucide-react';
import { 
  Workspace, 
  Task, 
  BudgetItem, 
  GuestItem, 
  ActivityLog 
} from '../types';

interface DashboardViewProps {
  workspace: Workspace;
  tasks: Task[];
  budgets: BudgetItem[];
  guests: GuestItem[];
  activityLogs: ActivityLog[];
  currentUser: string;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({
  workspace,
  tasks,
  budgets,
  guests,
  activityLogs,
  currentUser,
  onNavigateToTab
}: DashboardViewProps) {
  
  // 1. Countdown calculations
  const getCountdown = () => {
    const wedding = new Date(workspace.weddingDate);
    const today = new Date('2026-06-19'); // Local date from mock metadata
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getCountdown();

  // 2. Checklist metrics
  const activeTasks = tasks.filter(t => !t.isDeleted);
  const completedTasks = activeTasks.filter(t => t.status === 'COMPLETED');
  const taskProgressPct = activeTasks.length > 0 
    ? Math.round((completedTasks.length / activeTasks.length) * 100) 
    : 0;

  // 3. Budget metrics (Rp display)
  const activeBudgets = budgets.filter(b => !b.isDeleted);
  const committedBudget = activeBudgets.reduce((sum, b) => sum + (b.actualCost || b.budgetAmount), 0);
  const paidBudget = activeBudgets.reduce((sum, b) => sum + b.paidAmount, 0);
  const remainingBudget = Math.max(0, committedBudget - paidBudget);
  const targetBudget = workspace.estimatedBudget;
  const budgetUtilizationPct = targetBudget > 0 
    ? Math.round((committedBudget / targetBudget) * 100) 
    : 0;

  // 4. Guest metrics
  const activeGuests = guests.filter(g => !g.isDeleted);
  const totalGuestsCount = activeGuests.reduce((sum, g) => sum + g.pax, 0);
  const invitedGuests = activeGuests.filter(g => g.rsvpStatus !== 'Not Invited').reduce((sum, g) => sum + g.pax, 0);
  const rsvpReceivedCount = activeGuests.filter(g => g.rsvpStatus === 'Confirmed' || g.rsvpStatus === 'Declined').reduce((sum, g) => sum + g.pax, 0);
  const confirmedCount = activeGuests.filter(g => g.rsvpStatus === 'Confirmed' || g.rsvpStatus === 'Attended').reduce((sum, g) => sum + g.pax, 0);

  // Format currency helper
  const formatIDR = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Filter tasks to place under Upcoming Tasks
  const upcomingTasks = activeTasks
    .filter(t => t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Visual Greeting Header */}
      <div className="bg-gradient-to-r from-[#6B705C] to-[#5C614E] rounded-3xl p-6 md:p-8 text-[#FDFBF7] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#CB997E]/10 rounded-full filter blur-2xl -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#A5A58D]/10 rounded-full filter blur-xl -translate-x-10 translate-y-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3.5xl font-bold tracking-tight text-[#FDFBF7] leading-tight">
              Selamat Pagi, {currentUser}! ❤️
            </h2>
            <p className="text-[#FAF9F5]/90 text-sm md:text-base max-w-xl">
              Bersama pasangan, mari wujudkan pernikahan impian di <span className="font-semibold">{workspace.city}</span> pada tanggal <span className="font-semibold underline decoration-[#CB997E] decoration-2">{new Date(workspace.weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
            </p>
          </div>
          <div className="bg-[#FAF9F5]/10 backdrop-blur-md border border-[#FAF9F5]/20 p-4 rounded-xl flex items-center space-x-4 flex-shrink-0 self-start md:self-auto">
            <div className="w-10 h-10 bg-[#FAF9F5] rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#6B705C]" />
            </div>
            <div>
              <span className="text-xs text-[#FAF9F5]/80 font-mono uppercase tracking-wider block">Hitung Mundur</span>
              <span className="text-xl font-bold text-white">{daysRemaining} Hari Tersisa</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE FOUR METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Countdown / Days */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-[#F5F2ED] rounded-xl text-[#6B705C]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#A5A58D] font-semibold block">Hari Tersisa</span>
            <span className="text-lg md:text-xl font-extrabold text-[#2D312E]">{daysRemaining} Hari</span>
          </div>
        </div>

        {/* Tasks completed */}
        <div 
          onClick={() => onNavigateToTab('checklist')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center space-x-4 hover:border-[#6B705C] transition cursor-pointer"
        >
          <div className="p-3 bg-[#F5F2ED] rounded-xl text-[#CB997E]">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#A5A58D] font-semibold block">Checklist Persiapan</span>
            <span className="text-lg md:text-xl font-extrabold text-[#2D312E]">{completedTasks.length}/{activeTasks.length} Selesai</span>
          </div>
        </div>

        {/* Budget percentage */}
        <div 
          onClick={() => onNavigateToTab('budget')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center space-x-4 hover:border-[#6B705C] transition cursor-pointer"
        >
          <div className="p-3 bg-[#F5F2ED] rounded-xl text-[#6B705C]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#A5A58D] font-semibold block">Utilisasi Anggaran</span>
            <span className="text-lg md:text-xl font-extrabold text-[#2D312E]">{budgetUtilizationPct}% Pakai</span>
          </div>
        </div>

        {/* Target guest list */}
        <div 
          onClick={() => onNavigateToTab('guests')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center space-x-4 hover:border-[#6B705C] transition cursor-pointer"
        >
          <div className="p-3 bg-[#F5F2ED] rounded-xl text-[#A5A58D]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#A5A58D] font-semibold block">Total Tamu (Pax)</span>
            <span className="text-lg md:text-xl font-extrabold text-[#2D312E]">{totalGuestsCount} Orang</span>
          </div>
        </div>
      </div>

      {/* DETAILED WORKSPACE MODULE SECTION OVERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Checklist Ring / Percentage */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#2D312E] uppercase tracking-wider mb-1 font-mono">Kemajuan Persiapan</h4>
            <p className="text-xs text-[#A5A58D]">Persentase checklist yang telah ditenggelamkan berdua.</p>
          </div>
          
          <div className="py-6 flex flex-col items-center justify-center">
            {/* Elegant Circular Progress with Pure SVG */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="72" cy="72" r="60" 
                  className="stroke-[#F5F2ED]" 
                  strokeWidth="10" 
                  fill="transparent" 
                />
                <circle 
                  cx="72" cy="72" r="60" 
                  className="stroke-[#6B705C] transition-all duration-1000 ease-out" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - taskProgressPct / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-[#2D312E] block">{taskProgressPct}%</span>
                <span className="text-[10px] uppercase font-bold text-[#A5A58D]">Selesai</span>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs font-semibold text-[#4A4A4A]">{activeTasks.length - completedTasks.length} Tugas Lagi Perlu Selesai</p>
            </div>
          </div>

          <button 
            id="btn-goto-checklist"
            onClick={() => onNavigateToTab('checklist')}
            className="w-full text-center py-2.5 bg-[#F5F2ED] hover:bg-[#E8E2D9] rounded-xl text-xs font-semibold text-[#6B705C] transition border border-[#E8E2D9] inline-flex items-center justify-center"
          >
            <span>Buka Checklist Kerja</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {/* Budget Overview Card bar charts */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#2D312E] uppercase tracking-wider mb-1 font-mono font-bold">Ringkasan Anggaran</h4>
            <p className="text-xs text-[#A5A58D]">Alokasi limit vs. komitmen pengeluaran riil.</p>
          </div>

          <div className="space-y-3.5 py-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#A5A58D] font-medium">
                <span>Rencana Target Anggaran</span>
                <span className="font-semibold text-[#2D312E]">{formatIDR(targetBudget)}</span>
              </div>
              <div className="w-full bg-[#F5F2ED] h-2 rounded-full overflow-hidden">
                <div className="bg-[#A5A58D] h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#A5A58D] font-medium">
                <span>Sudah Berkontrak (Komitmen)</span>
                <span className={`font-semibold ${committedBudget > targetBudget ? 'text-red-600' : 'text-[#2D312E]'}`}>
                  {formatIDR(committedBudget)}
                </span>
              </div>
              <div className="w-full bg-[#F5F2ED] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${committedBudget > targetBudget ? 'bg-red-500' : 'bg-[#6B705C]'}`}
                  style={{ width: `${Math.min(100, (committedBudget / targetBudget) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#A5A58D] font-medium">
                <span>Sudah Dibayar (Lunas/DP)</span>
                <span className="font-semibold text-[#CB997E]">{formatIDR(paidBudget)}</span>
              </div>
              <div className="w-full bg-[#F5F2ED] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#CB997E] h-full rounded-full" 
                  style={{ width: `${Math.min(100, (paidBudget / Math.max(1, committedBudget)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E2D9] text-xs flex justify-between items-center text-[#2D312E] mt-2 font-mono">
              <span className="font-semibold">Sisa Pelunasan Vendor:</span>
              <span className="font-bold">{formatIDR(remainingBudget)}</span>
            </div>
          </div>

          <button 
            id="btn-goto-budget"
            onClick={() => onNavigateToTab('budget')}
            className="w-full text-center py-2.5 bg-[#F5F2ED] hover:bg-[#E8E2D9] rounded-xl text-xs font-semibold text-[#6B705C] transition border border-[#E8E2D9] inline-flex items-center justify-center"
          >
            <span>Detail Alokasi Keuangan</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {/* Guest List RSVP Summary */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#2D312E] uppercase tracking-wider mb-1 font-mono">Daftar Tamu & RSVP</h4>
            <p className="text-xs text-[#A5A58D]">Perhitungan kehadiran undangan secara riil.</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 py-4">
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E2D9]">
              <span className="text-[10px] text-[#A5A58D] font-bold uppercase tracking-wider block">Total Undangan</span>
              <span className="text-lg font-extrabold text-[#2D312E]">{invitedGuests} Pax</span>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E2D9]">
              <span className="text-[10px] text-[#A5A58D] font-bold uppercase tracking-wider block">RSVP Masuk</span>
              <span className="text-lg font-extrabold text-[#2D312E]">
                {rsvpReceivedCount} Pax ({invitedGuests > 0 ? Math.round((rsvpReceivedCount / invitedGuests) * 100) : 0}%)
              </span>
            </div>

            <div className="p-3 bg-[#6B705C]/10 rounded-xl border border-[#6B705C]/20">
              <span className="text-[10px] text-[#6B705C] font-bold uppercase tracking-wider block">Hadir</span>
              <span className="text-lg font-extrabold text-[#6B705C]">{confirmedCount} Pax</span>
            </div>

            <div className="p-3 bg-red-50/55 rounded-xl border border-red-100">
              <span className="text-[10px] text-red-800 font-bold uppercase tracking-wider block">Tidak Hadir (Declined)</span>
              <span className="text-lg font-extrabold text-red-950">
                {activeGuests.filter(g => g.rsvpStatus === 'Declined').reduce((sum, g) => sum + g.pax, 0)} Pax
              </span>
            </div>
          </div>

          <button 
            id="btn-goto-guests"
            onClick={() => onNavigateToTab('guests')}
            className="w-full text-center py-2.5 bg-[#F5F2ED] hover:bg-[#E8E2D9] rounded-xl text-xs font-semibold text-[#6B705C] transition border border-[#E8E2D9] inline-flex items-center justify-center"
          >
            <span>Atur Guest List & Meja</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

      </div>

      {/* ROW 2: Upcoming tasks, and activity logs side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* UPCOMING TASKS (Left) */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-light-200 border-zinc-100">
            <div>
              <h4 className="text-sm font-bold text-[#2D312E] uppercase tracking-wider font-mono">Tugas Terdekat Perlu Selesai</h4>
              <p className="text-xs text-[#A5A58D]">Tenggat terdekat yang harus dieksekusi.</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('checklist')}
              className="text-xs font-semibold text-[#6B705C] hover:underline inline-flex items-center"
            >
              Semua Tugas
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-[#A5A58D] space-y-2">
              <CheckSquare className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs font-medium">Bagus! Semua tugas terdaftar sudah diselesaikan.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8E2D9]/40">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-[#2D312E] block text-sm">{task.title}</span>
                    <p className="text-[#4A4A4A] text-xs line-clamp-1">{task.description}</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="bg-[#F5F2ED] text-[#2D312E] px-2 py-0.5 rounded font-mono text-[9px] font-bold">
                        Hingga: {new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono ${task.owner === 'PARTNER_A' ? 'bg-[#CB997E]/10 text-[#CB997E]' : task.owner === 'PARTNER_B' ? 'bg-[#6B705C]/10 text-[#6B705C]' : 'bg-[#A5A58D]/10 text-[#A5A58D]'}`}>
                        {task.owner === 'PARTNER_A' ? 'Ami' : task.owner === 'PARTNER_B' ? 'Ardhi' : 'Bersama'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="px-2.5 py-1 bg-[#FAF9F5] text-[#6B705C] font-mono font-bold text-[9px] rounded uppercase border border-[#E8E2D9]">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT ACTIVITIES (Right) */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-light-200 border-[#E8E2D9]/40">
            <div>
              <h4 className="text-sm font-bold text-[#2D312E] uppercase tracking-wider font-mono">Log Kolaborasi (Aktivitas)</h4>
              <p className="text-xs text-[#A5A58D]">Perubahan dari kedua pasangan secara berkelanjutan.</p>
            </div>
            <span className="inline-flex items-center text-xs font-mono font-medium text-[#6B705C]">
              <span className="w-1.5 h-1.5 bg-[#6B705C] rounded-full mr-1.5 animate-ping"></span>
              Real-time Active
            </span>
          </div>

          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 text-xs">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${log.user === 'Ami' ? 'bg-[#CB997E]/20 text-[#CB997E]' : 'bg-[#6B705C]/20 text-[#6B705C]'} flex-shrink-0`}>
                  {log.user[0]}
                </span>
                <div className="space-y-1 flex-grow">
                  <p className="text-zinc-700 leading-tight">
                    <span className="font-bold text-[#2D312E]">{log.user}</span> {log.action}
                  </p>
                  <span className="text-[10px] text-[#A5A58D] block font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • Hari Ini
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
