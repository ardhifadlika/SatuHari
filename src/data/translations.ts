/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'id' | 'en';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  dreamWedding: string;
  daysRemaining: string;
  weddingDayArrived: string;
  
  // Role / Perspective Switcher
  perspectiveTitle: string;
  perspectiveSubtitle: string;
  actingAs: string;
  partnerRoleBride: string;
  partnerRoleGroom: string;
  switchPartner: string;
  
  // Navigation Menu
  menuWorkspace: string;
  tabDashboard: string;
  tabChecklist: string;
  tabBudget: string;
  tabVendor: string;
  tabGuests: string;
  tabRundown: string;
  tabSeserahan: string;
  tabMedia: string;
  tabTrash: string;
  
  // Demo Mode Banner & Modal
  demoBannerText: string;
  exitDemoBtn: string;
  exitDemoModalTitle: string;
  exitDemoModalDesc: string;
  exitDemoModalConfirm: string;
  cancelBtn: string;
  
  // Common Actions
  addBtn: string;
  saveBtn: string;
  deleteBtn: string;
  restoreBtn: string;
  permanentDeleteBtn: string;
  emptyTrashBtn: string;
  searchPlaceholder: string;
  filterAll: string;
  exportPdfBtn: string;
  statusDone: string;
  statusInProgress: string;
  statusNotStarted: string;
  statusOverdue: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  id: {
    appName: 'SatuHari',
    appTagline: 'Wedding Workspace',
    dreamWedding: 'Pernikahan Impian',
    daysRemaining: 'Hari Lagi',
    weddingDayArrived: 'Hari Bahagia Telah Tiba! 🎉',
    
    // Role Switcher
    perspectiveTitle: 'Sudut Pandang Pengguna',
    perspectiveSubtitle: 'Kolaborasi dua mempelai',
    actingAs: 'Aktif sebagai',
    partnerRoleBride: 'Calon Istri',
    partnerRoleGroom: 'Calon Suami',
    switchPartner: 'Ganti Sudut Pandang',
    
    // Navigation Menu
    menuWorkspace: 'Modul Workspace',
    tabDashboard: 'Ringkasan',
    tabChecklist: 'Checklist Persiapan',
    tabBudget: 'Keuangan & Anggaran',
    tabVendor: 'Manajemen Vendor',
    tabGuests: 'Daftar Tamu (Tamu)',
    tabRundown: 'Rundown Acara',
    tabSeserahan: 'Buku Seserahan',
    tabMedia: 'Lampiran Berkas',
    tabTrash: 'Riwayat Sampah',
    
    // Demo Mode Banner & Modal
    demoBannerText: 'Anda sedang menjelajahi Workspace Demo dengan data contoh lengkap.',
    exitDemoBtn: 'Keluar Demo',
    exitDemoModalTitle: 'Keluar dari Mode Demo?',
    exitDemoModalDesc: 'Anda akan kembali ke layar sambutan / pendaftaran workspace baru. Data uji coba Anda tetap tersimpan di memori browser ini.',
    exitDemoModalConfirm: 'Ya, Keluar Demo',
    cancelBtn: 'Batal',
    
    // Common Actions
    addBtn: 'Tambah',
    saveBtn: 'Simpan',
    deleteBtn: 'Hapus',
    restoreBtn: 'Pulihkan',
    permanentDeleteBtn: 'Hapus Permanen',
    emptyTrashBtn: 'Kosongkan Tempat Sampah',
    searchPlaceholder: 'Cari sesuatu...',
    filterAll: 'Semua Kategori',
    exportPdfBtn: 'Ekspor Ringkasan (PDF)',
    statusDone: 'Selesai',
    statusInProgress: 'Sedang Proses',
    statusNotStarted: 'Belum Mulai',
    statusOverdue: 'Terlambat',
  },
  en: {
    appName: 'SatuHari',
    appTagline: 'Wedding Workspace',
    dreamWedding: 'Dream Wedding',
    daysRemaining: 'Days Left',
    weddingDayArrived: 'The Big Day is Here! 🎉',
    
    // Role Switcher
    perspectiveTitle: 'Partner Perspective',
    perspectiveSubtitle: 'Two-person collaboration',
    actingAs: 'Acting as',
    partnerRoleBride: 'Bride-to-be',
    partnerRoleGroom: 'Groom-to-be',
    switchPartner: 'Switch Perspective',
    
    // Navigation Menu
    menuWorkspace: 'Workspace Modules',
    tabDashboard: 'Overview',
    tabChecklist: 'Preparation Checklist',
    tabBudget: 'Budget & Expenses',
    tabVendor: 'Vendor Management',
    tabGuests: 'Guest List',
    tabRundown: 'Event Rundown',
    tabSeserahan: 'Gift Parcels (Seserahan)',
    tabMedia: 'Attachments',
    tabTrash: 'Trash & Archive',
    
    // Demo Mode Banner & Modal
    demoBannerText: 'You are currently exploring the Demo Workspace with full sample wedding data.',
    exitDemoBtn: 'Exit Demo',
    exitDemoModalTitle: 'Exit Demo Mode?',
    exitDemoModalDesc: 'You will return to the welcome screen. Your sample edits remain saved in your browser storage.',
    exitDemoModalConfirm: 'Yes, Exit Demo',
    cancelBtn: 'Cancel',
    
    // Common Actions
    addBtn: 'Add New',
    saveBtn: 'Save Changes',
    deleteBtn: 'Delete',
    restoreBtn: 'Restore',
    permanentDeleteBtn: 'Delete Permanently',
    emptyTrashBtn: 'Empty Trash Bin',
    searchPlaceholder: 'Search...',
    filterAll: 'All Categories',
    exportPdfBtn: 'Export Summary (PDF)',
    statusDone: 'Completed',
    statusInProgress: 'In Progress',
    statusNotStarted: 'Not Started',
    statusOverdue: 'Overdue',
  },
};
