/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Workspace, 
  Task, 
  BudgetItem, 
  VendorItem, 
  GuestItem, 
  RundownItem, 
  SeserahanItem, 
  ActivityLog, 
  SharedAttachment 
} from './types';
import { Language, translations } from './data/translations';
import { LogOut } from 'lucide-react';
import { formatRupiah } from './utils/currency';

// Templates/Presets Data
import { 
  DEMO_WORKSPACE, 
  DEMO_TASKS, 
  DEMO_BUDGETS, 
  DEMO_VENDORS, 
  DEMO_GUESTS, 
  DEMO_RUNDOWNS, 
  DEMO_SESERAHANS, 
  DEMO_ACTIVITY_LOGS, 
  DEMO_ATTACHMENTS 
} from './data/templates';

// Components Imports
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ChecklistView from './components/ChecklistView';
import BudgetView from './components/BudgetView';
import VendorView from './components/VendorView';
import GuestView from './components/GuestView';
import RundownView from './components/RundownView';
import SeserahanView from './components/SeserahanView';
import MediaLibraryView from './components/MediaLibraryView';
import TrashHistoryView from './components/TrashHistoryView';

export default function App() {
  // Global Workspace Instance State
  const [workspace, setWorkspace] = useState<Workspace | null>(() => {
    const saved = localStorage.getItem('satuhari_workspace');
    return saved ? JSON.parse(saved) : null;
  });

  // Language state (Indonesian & English)
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('satuhari_lang') as Language) || 'id';
  });

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('satuhari_lang', newLang);
  };

  const t = translations[lang];

  // In-app modal state for exiting demo mode (reliably works in iframe!)
  const [showExitDemoModal, setShowExitDemoModal] = useState(false);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Mobile drawer open status
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active Role User 'Ami' or 'Ardhi' (Simulating collaboration!)
  const [currentUser, setCurrentUser] = useState<'Ami' | 'Ardhi'>(() => {
    return (localStorage.getItem('satuhari_user') as any) || 'Ami';
  });

  // Core Data Lists loaded from localStorage or Demo templates
  const [tasks, setTasks] = useState<Task[]>([]);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [rundowns, setRundowns] = useState<RundownItem[]>([]);
  const [seserahans, setSeserahans] = useState<SeserahanItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [attachments, setAttachments] = useState<SharedAttachment[]>([]);

  // Monitor workspace change to populate default databases
  useEffect(() => {
    if (workspace) {
      localStorage.setItem('satuhari_workspace', JSON.stringify(workspace));
      
      // Load tables depending on demo or empty
      const prefix = workspace.isDemo ? 'demo_' : 'custom_';
      
      const loadOrSet = (key: string, initial: any) => {
        const saved = localStorage.getItem(prefix + key);
        return saved ? JSON.parse(saved) : initial;
      };

      setTasks(loadOrSet('tasks', workspace.isDemo ? DEMO_TASKS : []));
      setBudgets(loadOrSet('budgets', workspace.isDemo ? DEMO_BUDGETS : []));
      setVendors(loadOrSet('vendors', workspace.isDemo ? DEMO_VENDORS : []));
      setGuests(loadOrSet('guests', workspace.isDemo ? DEMO_GUESTS : []));
      setRundowns(loadOrSet('rundowns', workspace.isDemo ? DEMO_RUNDOWNS : []));
      setSeserahans(loadOrSet('seserahans', workspace.isDemo ? DEMO_SESERAHANS : []));
      setActivityLogs(loadOrSet('activityLogs', workspace.isDemo ? DEMO_ACTIVITY_LOGS : []));
      setAttachments(loadOrSet('attachments', workspace.isDemo ? DEMO_ATTACHMENTS : []));
    } else {
      localStorage.removeItem('satuhari_workspace');
    }
  }, [workspace]);

  // Synchronize dynamic updates back to localStorage
  useEffect(() => {
    if (workspace) {
      const prefix = workspace.isDemo ? 'demo_' : 'custom_';
      localStorage.setItem(prefix + 'tasks', JSON.stringify(tasks));
      localStorage.setItem(prefix + 'budgets', JSON.stringify(budgets));
      localStorage.setItem(prefix + 'vendors', JSON.stringify(vendors));
      localStorage.setItem(prefix + 'guests', JSON.stringify(guests));
      localStorage.setItem(prefix + 'rundowns', JSON.stringify(rundowns));
      localStorage.setItem(prefix + 'seserahans', JSON.stringify(seserahans));
      localStorage.setItem(prefix + 'activityLogs', JSON.stringify(activityLogs));
      localStorage.setItem(prefix + 'attachments', JSON.stringify(attachments));
    }
  }, [tasks, budgets, vendors, guests, rundowns, seserahans, activityLogs, attachments, workspace]);

  // Handle saving role switch (optionally specifying exact user)
  const handleToggleUser = (targetUser?: 'Ami' | 'Ardhi') => {
    const nextUser = targetUser || (currentUser === 'Ami' ? 'Ardhi' : 'Ami');
    setCurrentUser(nextUser);
    localStorage.setItem('satuhari_user', nextUser);
  };

  // Exit demo handler
  const handleExitDemo = () => {
    setWorkspace(null);
    setShowExitDemoModal(false);
  };

  // Triggering new Log record helper
  const triggerLog = (action: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      user: currentUser,
      action: action,
      avatarStyle: currentUser === 'Ami' ? 'bg-pink-100 text-pink-800' : 'bg-indigo-100 text-indigo-800'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // ENTER DEMO VIEW (Guest Mode)
  const handleSelectDemoMode = () => {
    setWorkspace(DEMO_WORKSPACE);
    setCurrentTab('dashboard');
  };

  // CREATE CUSTOM WORKSPACE
  const handleCreateWorkspace = (data: Omit<Workspace, 'id' | 'createdAt' | 'inviteStatus' | 'inviteMethod'>) => {
    const custom: Workspace = {
      ...data,
      id: 'ws-' + Date.now(),
      inviteStatus: 'PENDING',
      inviteMethod: null,
      createdAt: new Date().toISOString()
    };
    setWorkspace(custom);
    // Setup typical default rundowns for Indonesian wedding
    setRundowns([
      { id: 'dr-1', time: '07:00', activity: 'MUA Rias Wajah', personInCharge: 'Sanggar MUA', location: 'Ruang Rias', notes: 'Persiapan awal pengantin berganti pakaian.', vendorName: 'Vendor Makeup' },
      { id: 'dr-2', time: '09:00', activity: 'Prosesi Akad Nikah', personInCharge: 'Penghulu KUA', location: 'Masjid/Pelaminan Utama', notes: 'Siapkan mas kawin, saksi nikah & cincin kawin.', vendorName: 'KUA' },
      { id: 'dr-3', time: '11:00', activity: 'Resepsi Pernikahan', personInCharge: 'Tim WO', location: 'Ballroom Resepsi', notes: 'Salaman, catering prasmanan utama dibuka resmi.', vendorName: 'Wedding Organizer' },
      { id: 'dr-4', time: '13:00', activity: 'Penutupan Acara', personInCharge: 'Keluarga Inti', location: 'Pintu Keluar', notes: 'Merapikan sisa katering bersama keluarga.', vendorName: 'Catering' }
    ]);
  };

  // SIMULATE JOIN (Approve Pending Invite)
  const handleSimulatePartnerJoin = () => {
    if (workspace) {
      const activeWS: Workspace = {
        ...workspace,
        inviteStatus: 'ACCEPTED',
        inviteMethod: 'LINK'
      };
      setWorkspace(activeWS);
      triggerLog(`mengaktifkan tautan workspace. ${activeWS.partnerBName} sekarang bergabung bersama! 👫🎉`);
      setCurrentTab('dashboard');
    }
  };

  // --- CHECKLIST ACTION MANAGERS ---
  const handleAddTask = (taskData: Omit<Task, 'id' | 'isDeleted' | 'deletedAt' | 'isArchived'>) => {
    const task: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      isDeleted: false,
      deletedAt: null,
      isArchived: false
    };
    setTasks(prev => [task, ...prev]);
    triggerLog(`menambahkan tugas persiapan baru: "${task.title}"`);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (updates.status && updates.status !== t.status) {
          triggerLog(`mengubah status "${t.title}" menjadi: ${updates.status.replace('_', ' ')}`);
        }
        return { ...t, ...updates };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        triggerLog(`menghapus sementara tugas: "${t.title}" (ke tempat sampah)`);
        return { ...t, isDeleted: true, deletedAt: new Date().toISOString() };
      }
      return t;
    }));
  };

  const handleRestoreTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        triggerLog(`memulihkan kembali tugas: "${t.title}"`);
        return { ...t, isDeleted: false, deletedAt: null };
      }
      return t;
    }));
  };

  const handlePermanentDeleteTask = (id: string) => {
    if (window.confirm('Hapus permanen tugas ini? Tindakan ini tidak bisa dibatalkan!')) {
      const target = tasks.find(t => t.id === id);
      setTasks(prev => prev.filter(t => t.id !== id));
      if (target) triggerLog(`menghapus secara permanen tugas: "${target.title}"`);
    }
  };

  const handleArchiveTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextArchived = !t.isArchived;
        triggerLog(`${nextArchived ? 'mengarsipkan' : 'mengembalikan dari arsip'} tugas: "${t.title}"`);
        return { ...t, isArchived: nextArchived };
      }
      return t;
    }));
  };


  // --- BUDGET ACTION MANAGERS ---
  const handleAddBudgetItem = (itemData: Omit<BudgetItem, 'id' | 'isDeleted' | 'deletedAt' | 'isArchived'>) => {
    const budget: BudgetItem = {
      ...itemData,
      id: 'budget-' + Date.now(),
      isDeleted: false,
      isArchived: false,
      deletedAt: null
    };
    setBudgets(prev => [budget, ...prev]);
    triggerLog(`menambahkan anggaran ${budget.category}: "${budget.vendor}" sebesar ${formatRupiah(budget.budgetAmount)}`);
  };

  const handleUpdateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === id) {
        if (updates.paymentStatus && updates.paymentStatus !== b.paymentStatus) {
          triggerLog(`memperbarui cicilan "${b.vendor}" menjadi: ${updates.paymentStatus}`);
        }
        return { ...b, ...updates };
      }
      return b;
    }));
  };

  const handleDeleteBudgetItem = (id: string) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === id) {
        triggerLog(`menghapus sementara anggaran: "${b.vendor}" (ke sampah)`);
        return { ...b, isDeleted: true, deletedAt: new Date().toISOString() };
      }
      return b;
    }));
  };

  const handleRestoreBudget = (id: string) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === id) {
        triggerLog(`memulihkan kembali anggaran: "${b.vendor}"`);
        return { ...b, isDeleted: false, deletedAt: null };
      }
      return b;
    }));
  };

  const handlePermanentDeleteBudget = (id: string) => {
    const target = budgets.find(b => b.id === id);
    setBudgets(prev => prev.filter(b => b.id !== id));
    if (target) triggerLog(`menghapus permanen anggaran: "${target.vendor}"`);
  };


  // --- VENDOR ACTION MANAGERS ---
  const handleAddVendor = (vendorData: Omit<VendorItem, 'id' | 'isDeleted' | 'isArchived' | 'deletedAt'>) => {
    const vendor: VendorItem = {
      ...vendorData,
      id: 'vendor-' + Date.now(),
      isDeleted: false,
      isArchived: false,
      deletedAt: null
    };
    setVendors(prev => [vendor, ...prev]);
    triggerLog(`menambahkan kontak vendor ${vendor.category}: "${vendor.name}"`);
  };

  const handleUpdateVendor = (id: string, updates: Partial<VendorItem>) => {
    setVendors(prev => prev.map(v => {
      if (v.id === id) {
        if (updates.status && updates.status !== v.status) {
          triggerLog(`mengubah status vendor "${v.name}" menjadi: ${updates.status}`);
        }
        return { ...v, ...updates };
      }
      return v;
    }));
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id === id) {
        triggerLog(`menghapus sementara vendor: "${v.name}"`);
        return { ...v, isDeleted: true, deletedAt: new Date().toISOString() };
      }
      return v;
    }));
  };

  const handleRestoreVendor = (id: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id === id) {
        triggerLog(`memulihkan kembali vendor: "${v.name}"`);
        return { ...v, isDeleted: false, deletedAt: null };
      }
      return v;
    }));
  };

  const handlePermanentDeleteVendor = (id: string) => {
    const target = vendors.find(v => v.id === id);
    setVendors(prev => prev.filter(v => v.id !== id));
    if (target) triggerLog(`menghapus permanen vendor: "${target.name}"`);
  };


  // --- GUEST (TAMU) ACTION MANAGERS ---
  const handleAddGuest = (guestData: Omit<GuestItem, 'id' | 'isDeleted' | 'isArchived' | 'deletedAt'>) => {
    const guest: GuestItem = {
      ...guestData,
      id: 'guest-' + Date.now(),
      isDeleted: false,
      isArchived: false,
      deletedAt: null
    };
    setGuests(prev => [guest, ...prev]);
    triggerLog(`menambahkan pengundang tamu: "${guest.name}" (${guest.pax} Pax)`);
  };

  const handleUpdateGuest = (id: string, updates: Partial<GuestItem>) => {
    setGuests(prev => prev.map(g => {
      if (g.id === id) {
        if (updates.rsvpStatus && updates.rsvpStatus !== g.rsvpStatus) {
          triggerLog(`memperbarui RSVP "${g.name}" ke tahap: ${updates.rsvpStatus}`);
        }
        return { ...g, ...updates };
      }
      return g;
    }));
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(prev => prev.map(g => {
      if (g.id === id) {
        triggerLog(`menghapus sementara tamu: "${g.name}"`);
        return { ...g, isDeleted: true, deletedAt: new Date().toISOString() };
      }
      return g;
    }));
  };

  const handleRestoreGuest = (id: string) => {
    setGuests(prev => prev.map(g => {
      if (g.id === id) {
        triggerLog(`memulihkan kembali tamu undangan: "${g.name}"`);
        return { ...g, isDeleted: false, deletedAt: null };
      }
      return g;
    }));
  };

  const handlePermanentDeleteGuest = (id: string) => {
    const target = guests.find(g => g.id === id);
    setGuests(prev => prev.filter(g => g.id !== id));
    if (target) triggerLog(`menghapus permanen tamu: "${target.name}"`);
  };


  // --- RUNDOWN ACTION MANAGERS ---
  const handleAddRundownItem = (itemData: Omit<RundownItem, 'id'>) => {
    const item: RundownItem = {
      ...itemData,
      id: 'rundown-' + Date.now()
    };
    setRundowns(prev => [...prev, item]);
    triggerLog(`menjadwalkan agenda baru pukul ${item.time}: "${item.activity}"`);
  };

  const handleUpdateRundownItem = (id: string, updates: Partial<RundownItem>) => {
    setRundowns(prev => prev.map(item => {
      if (item.id === id) return { ...item, ...updates };
      return item;
    }));
  };

  const handleDeleteRundownItem = (id: string) => {
    const target = rundowns.find(r => r.id === id);
    setRundowns(prev => prev.filter(r => r.id !== id));
    if (target) triggerLog(`menghapus mata acara rundown: "${target.activity}"`);
  };


  // --- SESERAHAN ACTION MANAGERS ---
  const handleAddSeserahan = (itemData: Omit<SeserahanItem, 'id' | 'isDeleted' | 'isArchived' | 'deletedAt'>) => {
    const item: SeserahanItem = {
      ...itemData,
      id: 'seserahan-' + Date.now(),
      isDeleted: false,
      isArchived: false,
      deletedAt: null
    };
    setSeserahans(prev => [item, ...prev]);
    triggerLog(`menambahkan item parcel seserahan baru: "${item.itemName}"`);
  };

  const handleUpdateSeserahan = (id: string, updates: Partial<SeserahanItem>) => {
    setSeserahans(prev => prev.map(s => {
      if (s.id === id) {
        // Log changes
        if (updates.purchased !== undefined && updates.purchased !== s.purchased) {
          triggerLog(`${updates.purchased ? 'membeli' : 'membatalkan pembelian'} barang seserahan: "${s.itemName}"`);
        }
        if (updates.packed !== undefined && updates.packed !== s.packed) {
          triggerLog(`${updates.packed ? 'mengemas & menghias' : 'membongkar kembali'} kotak seserahan: "${s.itemName}"`);
        }
        if (updates.delivered !== undefined && updates.delivered !== s.delivered) {
          triggerLog(`${updates.delivered ? 'mengirimkan' : 'menarik kembali'} hantaran seserahan: "${s.itemName}" ke lokasi pernikahan`);
        }
        return { ...s, ...updates };
      }
      return s;
    }));
  };

  const handleDeleteSeserahan = (id: string) => {
    setSeserahans(prev => prev.map(s => {
      if (s.id === id) {
        triggerLog(`menghapus sementara seserahan: "${s.itemName}"`);
        return { ...s, isDeleted: true, deletedAt: new Date().toISOString() };
      }
      return s;
    }));
  };

  const handleRestoreSeserahan = (id: string) => {
    setSeserahans(prev => prev.map(s => {
      if (s.id === id) {
        triggerLog(`memulihkan kembali parcel seserahan: "${s.itemName}"`);
        return { ...s, isDeleted: false, deletedAt: null };
      }
      return s;
    }));
  };

  const handlePermanentDeleteSeserahan = (id: string) => {
    const target = seserahans.find(s => s.id === id);
    setSeserahans(prev => prev.filter(s => s.id !== id));
    if (target) triggerLog(`menghapus permanen parcel seserahan: "${target.itemName}"`);
  };


  // --- MEDIA LIBRARY ACTION MANAGERS ---
  const handleUploadAttachment = (itemData: Omit<SharedAttachment, 'id' | 'uploadedAt'>) => {
    const file: SharedAttachment = {
      ...itemData,
      id: 'file-' + Date.now(),
      uploadedAt: new Date().toISOString().substring(0, 10)
    };
    setAttachments(prev => [file, ...prev]);
    triggerLog(`mengunggah berkas kolaboratif: "${file.name}" di folder ${file.area}`);
  };

  const handleDeleteAttachment = (id: string) => {
    const target = attachments.find(a => a.id === id);
    setAttachments(prev => prev.filter(a => a.id !== id));
    if (target) triggerLog(`menghapus berkas bersama: "${target.name}"`);
  };

  // EMPTY TRASH ALL ACTION
  const handleEmptyTrashAll = () => {
    setTasks(prev => prev.filter(t => !t.isDeleted));
    setBudgets(prev => prev.filter(b => !b.isDeleted));
    setVendors(prev => prev.filter(v => !v.isDeleted));
    setGuests(prev => prev.filter(g => !g.isDeleted));
    setSeserahans(prev => prev.filter(s => !s.isDeleted));
    triggerLog(`mengosongkan seluruh riwayat tempat sampah (kosongkan permanen)`);
  };

  // --- RENDERING ROUTER SYSTEM (TAB HANDLER) ---
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            workspace={workspace!}
            tasks={tasks}
            budgets={budgets}
            guests={guests}
            activityLogs={activityLogs}
            currentUser={currentUser}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        );
      case 'checklist':
        return (
          <ChecklistView
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onArchiveTask={handleArchiveTask}
            currentUser={currentUser}
          />
        );
      case 'budget':
        return (
          <BudgetView
            budgets={budgets}
            estimatedBudget={workspace!.estimatedBudget}
            onAddBudgetItem={handleAddBudgetItem}
            onUpdateBudgetItem={handleUpdateBudgetItem}
            onDeleteBudgetItem={handleDeleteBudgetItem}
            currentUser={currentUser}
          />
        );
      case 'vendor':
        return (
          <VendorView
            vendors={vendors}
            onAddVendor={handleAddVendor}
            onUpdateVendor={handleUpdateVendor}
            onDeleteVendor={handleDeleteVendor}
            currentUser={currentUser}
          />
        );
      case 'guests':
        return (
          <GuestView
            guests={guests}
            onAddGuest={handleAddGuest}
            onUpdateGuest={handleUpdateGuest}
            onDeleteGuest={handleDeleteGuest}
            currentUser={currentUser}
          />
        );
      case 'rundown':
        return (
          <RundownView
            rundown={rundowns}
            onAddRundownItem={handleAddRundownItem}
            onUpdateRundownItem={handleUpdateRundownItem}
            onDeleteRundownItem={handleDeleteRundownItem}
            currentUser={currentUser}
          />
        );
      case 'seserahan':
        return (
          <SeserahanView
            seserahan={seserahans}
            onAddSeserahan={handleAddSeserahan}
            onUpdateSeserahan={handleUpdateSeserahan}
            onDeleteSeserahan={handleDeleteSeserahan}
            currentUser={currentUser}
          />
        );
      case 'media':
        return (
          <MediaLibraryView
            attachments={attachments}
            onUploadAttachment={handleUploadAttachment}
            onDeleteAttachment={handleDeleteAttachment}
            currentUser={currentUser}
          />
        );
      case 'trash':
        return (
          <TrashHistoryView
            tasks={tasks}
            budgets={budgets}
            vendors={vendors}
            guests={guests}
            seserahans={seserahans}
            onRestoreTask={handleRestoreTask}
            onRestoreBudget={handleRestoreBudget}
            onRestoreVendor={handleRestoreVendor}
            onRestoreGuest={handleRestoreGuest}
            onRestoreSeserahan={handleRestoreSeserahan}
            onPermanentDeleteTask={handlePermanentDeleteTask}
            onPermanentDeleteBudget={handlePermanentDeleteBudget}
            onPermanentDeleteVendor={handlePermanentDeleteVendor}
            onPermanentDeleteGuest={handlePermanentDeleteGuest}
            onPermanentDeleteSeserahan={handlePermanentDeleteSeserahan}
            onEmptyTrashAll={handleEmptyTrashAll}
          />
        );
      default:
        return <div>Sub-View tidak ditemukan.</div>;
    }
  };

  // --- 1. IF NOT LOGGED IN / IN ONBOARDING FLOW ---
  if (!workspace) {
    return (
      <Onboarding
        onSelectGuestMode={handleSelectDemoMode}
        onCreateWorkspace={handleCreateWorkspace}
        lang={lang}
        onToggleLang={handleToggleLang}
      />
    );
  }

  // --- 2. IF WORKSPACE IS CREATED BUT LACKS PARTNER ACTIVATION (PENDING STATUS) ---
  if (workspace.inviteStatus === 'PENDING') {
    return (
      <Onboarding
        onSelectGuestMode={handleSelectDemoMode}
        onCreateWorkspace={handleCreateWorkspace}
        pendingWorkspace={workspace}
        onSimulateJoin={handleSimulatePartnerJoin}
        lang={lang}
        onToggleLang={handleToggleLang}
      />
    );
  }

  // --- 3. IF ACTIVE FULLY UNLOCKED PRESET COUPLING VIEW ---
  const deletedCounts = {
    tasks: tasks.filter(t => t.isDeleted).length,
    budgets: budgets.filter(b => b.isDeleted).length,
    vendors: vendors.filter(v => v.isDeleted).length,
    guests: guests.filter(g => g.isDeleted).length,
    seserahans: seserahans.filter(s => s.isDeleted).length
  };

  return (
    <div className="min-h-screen bg-[#F7F1F0] text-[#2D3D36] font-sans flex flex-col lg:flex-row relative">
      
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        workspace={workspace}
        currentUser={currentUser}
        onToggleUser={handleToggleUser}
        deletedCounts={deletedCounts}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenExitDemoModal={() => setShowExitDemoModal(true)}
      />

      {/* Main workspace arena */}
      <main className="flex-grow min-h-screen lg:pl-72 pt-14 lg:pt-0 max-w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 space-y-4">
          
          {/* Header warning for Demo/Guest mode reset simulation */}
          {workspace.isDemo && (
            <div className="p-3 bg-[#F2E9E8] rounded-2xl border border-[#E8DDD9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#0D1C17] no-print shadow-xs">
              <span className="font-semibold">
                ✨ {t.demoBannerText} ({workspace.partnerAName} & {workspace.partnerBName})
              </span>
              <button
                id="btn-quit-demo"
                type="button"
                onClick={() => setShowExitDemoModal(true)}
                className="px-3.5 py-1.5 bg-[#1C3E33] hover:bg-[#142F26] text-[#F7F1F0] font-bold rounded-xl transition cursor-pointer border-0 shadow-xs flex items-center shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                {t.exitDemoBtn}
              </button>
            </div>
          )}

          {/* Core Tab Content Router */}
          <div className="transition-all duration-300">
            {renderTabContent()}
          </div>
          
        </div>
      </main>

      {/* IN-APP EXIT DEMO CONFIRMATION MODAL (Bypasses browser iframe window.confirm block) */}
      {showExitDemoModal && (
        <div 
          id="modal-exit-demo"
          className="fixed inset-0 bg-[#0D1C17]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-[#E8DDD9] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <LogOut className="w-6 h-6 stroke-1.5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0D1C17]">{t.exitDemoModalTitle}</h3>
              <p className="text-xs text-[#788A82] mt-1.5 leading-relaxed">{t.exitDemoModalDesc}</p>
            </div>
            <div className="flex space-x-2 pt-2 border-t border-[#E8DDD9]">
              <button
                id="btn-cancel-exit-demo"
                type="button"
                onClick={() => setShowExitDemoModal(false)}
                className="flex-1 py-2.5 border border-[#E8DDD9] hover:bg-[#FAF5F5] rounded-xl text-xs font-semibold text-[#0D1C17] transition cursor-pointer bg-white"
              >
                {t.cancelBtn}
              </button>
              <button
                id="btn-confirm-exit-demo"
                type="button"
                onClick={handleExitDemo}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer border-0 shadow-xs"
              >
                {t.exitDemoModalConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
