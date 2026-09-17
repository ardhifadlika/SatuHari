/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Task, 
  BudgetItem, 
  VendorItem, 
  GuestItem, 
  RundownItem, 
  SeserahanItem, 
  ActivityLog, 
  SharedAttachment,
  Workspace
} from '../types';

export const DEMO_WORKSPACE: Workspace = {
  id: 'demo-workspace',
  isDemo: true,
  partnerAName: 'Ami',
  partnerBName: 'Ardhi',
  weddingDate: '2026-10-17',
  city: 'Jakarta Selatan',
  estimatedGuests: 500,
  estimatedBudget: 350000000,
  inviteStatus: 'ACCEPTED',
  inviteMethod: 'LINK',
  createdAt: '2026-03-01T09:00:00Z'
};

export const DEMO_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Booking Gedung Pernikahan',
    description: 'Konfirmasi tanggal 17 Oktober 2026 ke pengelola Gedung Arkadia dan bayar DP pertama.',
    owner: 'TOGETHER',
    dueDate: '2026-04-15',
    status: 'COMPLETED',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: '#',
    attachmentName: 'Kuitansi_DP1_Venue.pdf'
  },
  {
    id: 't2',
    title: 'Food Tasting dengan Catering Syamil',
    description: 'Memilih menu gubukan (stall) dan menu utama prasmanan untuk 500 porsi.',
    owner: 'PARTNER_A',
    dueDate: '2026-05-10',
    status: 'COMPLETED',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: '#',
    attachmentName: 'Menu_Pilihan_Syamil.pdf'
  },
  {
    id: 't3',
    title: 'Finalisasi Tema Dekorasi Tradisional Jawa Modern',
    description: 'Berdiskusi dengan dekorator mengenai warna gebyok, jenis bunga, dan layout pelaminan.',
    owner: 'TOGETHER',
    dueDate: '2026-06-25',
    status: 'IN_PROGRESS',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: '#',
    attachmentName: 'Inspirasi_Pelaminan_Jawa.png'
  },
  {
    id: 't4',
    title: 'Fitting Pertama Kebaya & Beskap Akad',
    description: 'Jadwalkan fitting di Sanggar Busana Merak untuk busana adat Jawa dasteran.',
    owner: 'PARTNER_A',
    dueDate: '2026-07-05',
    status: 'IN_PROGRESS',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: null,
    attachmentName: null
  },
  {
    id: 't5',
    title: 'Pendaftaran Berkas ke KUA Cilandak',
    description: 'Menyerahkan surat pengantar RT/RW, fotokopi KTP, akta kelahiran, dan foto latar biru.',
    owner: 'PARTNER_B',
    dueDate: '2026-08-15',
    status: 'NOT_STARTED',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: null,
    attachmentName: null
  },
  {
    id: 't6',
    title: 'Membeli Kotak Seserahan & Hiasan',
    description: 'Membeli 8 kotak seserahan kayu akrilik di Pasar Mayestik beserta pita hiasannya.',
    owner: 'PARTNER_B',
    dueDate: '2026-06-10',
    status: 'COMPLETED',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: null,
    attachmentName: null
  },
  {
    id: 't7',
    title: 'Konfirmasi Jumlah Undangan dan Cetak',
    description: 'Menyusun list tamu final dari kedua belah keluarga untuk proses cetak undangan fisik.',
    owner: 'TOGETHER',
    dueDate: '2026-08-01',
    status: 'NOT_STARTED',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: null,
    attachmentName: null
  },
  {
    id: 't8',
    title: 'Sewa Jasa Sound System & Genset Tambahan',
    description: 'Koordinasi dengan vendor musik untuk spek sound system minimum 5000 watt.',
    owner: 'PARTNER_B',
    dueDate: '2026-08-20',
    status: 'NOT_STARTED',
    isDeleted: false,
    deletedAt: null,
    isArchived: false,
    attachmentUrl: null,
    attachmentName: null
  }
];

export const DEMO_BUDGETS: BudgetItem[] = [
  {
    id: 'b1',
    category: 'Venue',
    vendor: 'Gedung Arkadia Cilandak',
    budgetAmount: 110000000,
    actualCost: 105000000,
    paidAmount: 50000000,
    dueDate: '2026-08-01',
    contributor: 'Couple',
    paymentStatus: 'Partially Paid',
    notes: 'Sudah DP 1 & DP 2. Pelunasan paling lambat H-45.',
    attachmentUrl: '#',
    attachmentName: 'Kontrak_Arkadia.pdf',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'b2',
    category: 'Catering',
    vendor: 'Syamil Catering Service',
    budgetAmount: 120000000,
    actualCost: 125000000,
    paidAmount: 37500000,
    dueDate: '2026-09-01',
    contributor: 'Bride Family',
    paymentStatus: 'DP Paid',
    notes: 'DP 30% dibayar oleh keluarga perempuan. Menu sudah final (3 pondokan, 1 buffet).',
    attachmentUrl: '#',
    attachmentName: 'Invoice_Catering_Syamil.pdf',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'b3',
    category: 'Decoration',
    vendor: 'Artea Decoration',
    budgetAmount: 40000000,
    actualCost: 38000000,
    paidAmount: 38000000,
    dueDate: '2026-06-15',
    contributor: 'Couple',
    paymentStatus: 'Paid Off',
    notes: 'Lunas. Tambahan rincian pergola jalan masuk dibebaskan biaya.',
    attachmentUrl: '#',
    attachmentName: 'Invoice_Lunas_Artea.pdf',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'b4',
    category: 'WO',
    vendor: 'Sahabat Wedding Planner',
    budgetAmount: 25000000,
    actualCost: 25000000,
    paidAmount: 10000000,
    dueDate: '2025-10-01',
    contributor: 'Couple',
    paymentStatus: 'DP Paid',
    notes: 'DP On the Day service. Sisa dibayarkan H+3 paska pernikahan.',
    attachmentUrl: '#',
    attachmentName: 'Quotation_SahabatWO.pdf',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'b5',
    category: 'Documentation',
    vendor: 'Kala Studio (Foto & Video)',
    budgetAmount: 20000000,
    actualCost: 20000000,
    paidAmount: 5000000,
    dueDate: '2026-08-10',
    contributor: 'Groom Family',
    paymentStatus: 'DP Paid',
    notes: 'Paket meliput prewedding, akad nikah, dan resepsi satu hari penuh.',
    attachmentUrl: null,
    attachmentName: null,
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'b6',
    category: 'MUA',
    vendor: 'Sanggar Anggun Lestari',
    budgetAmount: 15000000,
    actualCost: 16000000,
    paidAmount: 16000000,
    dueDate: '2026-05-15',
    contributor: 'Bride Family',
    paymentStatus: 'Paid Off',
    notes: 'Lunas. Make up pengantin akad & resepsi, Ibu kedua belah pihak, dan 4 pagar ayu.',
    attachmentUrl: null,
    attachmentName: null,
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'b7',
    category: 'Attire',
    vendor: 'Jahit Kebaya Ibu Tien Malik',
    budgetAmount: 10000000,
    actualCost: 12000000,
    paidAmount: 0,
    dueDate: '2026-09-15',
    contributor: 'Couple',
    paymentStatus: 'Not Paid',
    notes: 'Daftar tunggu jahit kebaya akad adat beludru.',
    attachmentUrl: null,
    attachmentName: null,
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  }
];

export const DEMO_VENDORS: VendorItem[] = [
  {
    id: 'v1',
    name: 'Gedung Arkadia Cilandak',
    category: 'Venue',
    contactPerson: 'Ibu Ratna',
    phoneNumber: '08123456789',
    quotation: {
      amount: 110000000,
      status: 'Received',
      attachmentUrl: '#'
    },
    contract: {
      status: 'Received',
      attachmentUrl: '#'
    },
    paymentSchedule: 'DP 1: Rp 20.000.000, DP 2: Rp 30.000.000, Pelunasan Rp 55.000.000 di H-45',
    notes: 'Kapasitas s.d 800 tamu berdiri. Parkir luas & aman.',
    status: 'Booked',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'v2',
    name: 'Syamil Catering Service',
    category: 'Catering',
    contactPerson: 'Pak Syamil',
    phoneNumber: '08139876543',
    quotation: {
      amount: 125000000,
      status: 'Received',
      attachmentUrl: '#'
    },
    contract: {
      status: 'Received',
      attachmentUrl: '#'
    },
    paymentSchedule: 'DP 30%, Term II 40%, Pelunasan H-14',
    notes: 'Terkenal dengan sate padang & kambing gulingnya yang juara.',
    status: 'Booked',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'v3',
    name: 'Artea Decoration',
    category: 'Decoration',
    contactPerson: 'Mbak Artea',
    phoneNumber: '08785556667',
    quotation: {
      amount: 38000000,
      status: 'Received',
      attachmentUrl: '#'
    },
    contract: {
      status: 'Received',
      attachmentUrl: '#'
    },
    paymentSchedule: 'Lunas 100%',
    notes: 'Sangat responsif dan memahami konsep adat Jawa modern minimalis.',
    status: 'Completed',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'v4',
    name: 'Sahabat Wedding Planner',
    category: 'Wedding Organizer',
    contactPerson: 'Bli Kadek',
    phoneNumber: '08987778888',
    quotation: {
      amount: 25000000,
      status: 'Received',
      attachmentUrl: '#'
    },
    contract: {
      status: 'Received',
      attachmentUrl: '#'
    },
    paymentSchedule: 'DP Rp 10.000.000, Sisa Rp 15.000.000 paska acara',
    notes: 'WO On-the-Day dengan crew berjumlah 12 orang.',
    status: 'Booked',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'v5',
    name: 'Kala Studio',
    category: 'Photography',
    contactPerson: 'Mas Bayu',
    phoneNumber: '08112223334',
    quotation: {
      amount: 20000000,
      status: 'Received',
      attachmentUrl: null
    },
    contract: {
      status: 'None',
      attachmentUrl: null
    },
    paymentSchedule: 'DP 5 juta, sisa saat penyerahan album cetak',
    notes: 'Sedang menanti draf kontrak foto dikirim via WhatsApp.',
    status: 'Negotiating',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'v6',
    name: 'Sanggar Anggun Lestari',
    category: 'MUA',
    contactPerson: 'Teh Anggun',
    phoneNumber: '08524445555',
    quotation: {
      amount: 16000000,
      status: 'Received',
      attachmentUrl: null
    },
    contract: {
      status: 'Received',
      attachmentUrl: null
    },
    paymentSchedule: 'Lunas di awal untuk ikat tanggal makeup',
    notes: 'Dikenal dengan style make-up Jawa Solo Putri yang manglingi.',
    status: 'Completed',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  }
];

export const DEMO_GUESTS: GuestItem[] = [
  {
    id: 'g1',
    name: 'Pak Setyo & Ibu (Om Ami)',
    category: 'Family',
    side: 'Bride',
    phoneNumber: '08129990001',
    address: 'Jl. Merdeka No. 45, Tebet, Jakarta',
    pax: 2,
    rsvpStatus: 'Confirmed',
    tableNumber: 'A1',
    notes: 'Keluarga inti pihak perempuan.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'g2',
    name: 'Rian Antoro (Teman Kuliah Ardhi)',
    category: 'Friends',
    side: 'Groom',
    phoneNumber: '08138887771',
    address: 'Sentul City, Bogor',
    pax: 1,
    rsvpStatus: 'Confirmed',
    tableNumber: 'B3',
    notes: 'Teman satu faksi main game & kuliah IT.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'g3',
    name: 'Bu Diana (Atasan Ami)',
    category: 'Work',
    side: 'Bride',
    phoneNumber: '08113334442',
    address: 'Kuningan Place, Jakarta',
    pax: 2,
    rsvpStatus: 'Invited',
    tableNumber: 'A5',
    notes: 'Manager Divisi Marketing.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'g4',
    name: 'Pak RT Heru & Istri',
    category: 'Community',
    side: 'Both',
    phoneNumber: '08521112223',
    address: 'Kompleks Arkadia Blok C',
    pax: 2,
    rsvpStatus: 'Invited',
    tableNumber: 'Common',
    notes: 'Pengurus RT alamat rumah baru.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'g5',
    name: 'Ibu Ningsih (Sahabat Ibu Ardhi)',
    category: 'Parents Relation',
    side: 'Groom',
    phoneNumber: '08784445559',
    address: 'Kebayoran Lama, Jakarta',
    pax: 2,
    rsvpStatus: 'Confirmed',
    tableNumber: 'B1',
    notes: 'Hubungan karib Ibu dari pengajian.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'g6',
    name: 'Farhan & Nisa (Grup Sahabat)',
    category: 'Friends',
    side: 'Both',
    phoneNumber: '08125556667',
    address: 'Bintaro Jaya Sektor 9',
    pax: 2,
    rsvpStatus: 'Confirmed',
    tableNumber: 'C1',
    notes: 'Sahabat dekat masa SMA kedua belah pihak.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'g7',
    name: 'Bpk. H. Ahmad Fauzi (Relasi Ayah)',
    category: 'Parents Relation',
    side: 'Bride',
    phoneNumber: '08137777111',
    address: 'Kelapa Gading, Jakarta Utara',
    pax: 2,
    rsvpStatus: 'Not Invited',
    tableNumber: '-',
    notes: 'Teman kerja ayah di kementerian.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 'g8',
    name: 'Dwi Cahyo (Rekan Kantor Ardhi)',
    category: 'Work',
    side: 'Groom',
    phoneNumber: '08534444999',
    address: 'Sudirman, Jakarta',
    pax: 1,
    rsvpStatus: 'Declined',
    tableNumber: '-',
    notes: 'Lembur dinas luar kota pada hari H.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  }
];

export const DEMO_RUNDOWNS: RundownItem[] = [
  {
    id: 'r1',
    time: '05:00',
    activity: 'MUA & Persiapan Berbusana',
    personInCharge: 'Teh Anggun (MUA)',
    location: 'Kamar Rias Utama Gedung Arkadia',
    vendorName: 'Sanggar Anggun Lestari',
    notes: 'Keluarga inti sudah harus hadir dan siap dirias sebelum pukul 06:00.'
  },
  {
    id: 'r2',
    time: '08:30',
    activity: 'Briefing WO & Sambutan Keluarga',
    personInCharge: 'Bli Kadek (WO)',
    location: 'Selasar Utama Masjid / Gedung',
    vendorName: 'Sahabat Wedding Planner',
    notes: 'Cek mikrofon, saksi nikah, mas kawin, dan berkas KUA.'
  },
  {
    id: 'r3',
    time: '09:00',
    activity: 'Akad Nikah',
    personInCharge: 'Penghulu KUA (Pak Slamet)',
    location: 'Pelaminan / Meja Akad Masjid Arkadia',
    vendorName: 'Kala Studio (Foto & Video)',
    notes: 'Dipandu Khotbah Nikah, Ijab Qobul, penandatanganan buku nikah, penyerahan mahar.'
  },
  {
    id: 'r4',
    time: '10:00',
    activity: 'Sesi Foto Keluarga & Ganti Busana',
    personInCharge: 'Mas Bayu (Foto)',
    location: 'Pelaminan Utama & Kamar Ganti',
    vendorName: 'Kala Studio & Sanggar Anggun',
    notes: 'Ganti busana kebaya basahan menjadi Kebaya Beludru Jawa resepsi.'
  },
  {
    id: 'r5',
    time: '11:00',
    activity: 'Resepsi Pernikahan (Grand Entrance)',
    personInCharge: 'Bli Kadek (Music & WO)',
    location: 'Main Ballroom Gedung Arkadia',
    vendorName: 'Sahabat Wedding Planner',
    notes: 'Tari Cucuk Lampah pembuka, sambutan perwakilan, salaman, hidangan dibuka.'
  },
  {
    id: 'r6',
    time: '13:00',
    activity: 'Penutupan & Selesai',
    personInCharge: 'Crew WO',
    location: 'Main Ballroom',
    vendorName: 'Artea Decoration & Syamil Catering',
    notes: 'Oleh-oleh katering sisa dibungkus, foto panitia selesai, pengembalian kunci gedung.'
  }
];

export const DEMO_SESERAHANS: SeserahanItem[] = [
  {
    id: 's1',
    itemName: 'Sajadah & Mukena Sutra',
    category: 'Prayer Items',
    purchased: true,
    packed: true,
    delivered: true,
    notes: 'Melambangkan tiang agama dalam pernikahan. Dibeli di Thamrin City.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 's2',
    itemName: 'Bahan Kebaya Pengantin & Batik Danar Hadi',
    category: 'Fashion',
    purchased: true,
    packed: true,
    delivered: false,
    notes: 'Warna senada sage green untuk resepsi keluarga besar.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 's3',
    itemName: 'Satu Set Skincare Laneige',
    category: 'Beauty',
    purchased: true,
    packed: false,
    delivered: false,
    notes: 'Paket pelembab, serum wajah, dan sleeping mask.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 's4',
    itemName: 'Tas Pesta Charles & Keith',
    category: 'Accessories',
    purchased: true,
    packed: true,
    delivered: false,
    notes: 'Warna netral krem muda dengan rantai emas.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 's5',
    itemName: 'Sepatu Heels 5cm Staccato',
    category: 'Accessories',
    purchased: true,
    packed: true,
    delivered: false,
    notes: 'Sepatu warna putih mutiara ukuran 38.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 's6',
    itemName: 'Buah-Buahan Segar (Jeruk, Apel, Anggur, Pir)',
    category: 'Food',
    purchased: false,
    packed: false,
    delivered: false,
    notes: 'Pesan H-2 pernikahan agar masih fresh di parcel keranjang hias.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 's7',
    itemName: 'Perhiasan Emas Kuning 10 Gram',
    category: 'Accessories',
    purchased: true,
    packed: true,
    delivered: true,
    notes: 'Kalung dan gelang emas karat tinggi.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  },
  {
    id: 's8',
    itemName: 'Kue Basah Tradisional Adat (Jadah & Wajik)',
    category: 'Food',
    purchased: false,
    packed: false,
    delivered: false,
    notes: 'Melambangkan harapan agar jodoh lengket selamanya.',
    isDeleted: false,
    deletedAt: null,
    isArchived: false
  }
];

export const DEMO_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log1',
    timestamp: '2026-06-19T07:15:00Z',
    user: 'Ami',
    action: 'Menyelesaikan checklist "Food Tasting dengan Catering Syamil"',
    avatarStyle: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'log2',
    timestamp: '2026-06-19T06:40:00Z',
    user: 'Ardhi',
    action: 'Mengunggah Kuitansi Pembayaran DP Artea Decoration',
    avatarStyle: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'log3',
    timestamp: '2026-06-18T15:20:00Z',
    user: 'Ami',
    action: 'Mengonfirmasi kehadiran tamu "Pak Setyo & Ibu (Om Ami)" dengan pax: 2',
    avatarStyle: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'log4',
    timestamp: '2026-06-17T09:12:00Z',
    user: 'Ardhi',
    action: 'Menambahkan vendor dekorasi baru "Artea Decoration"',
    avatarStyle: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'log5',
    timestamp: '2026-06-16T11:00:00Z',
    user: 'Ami',
    action: 'Mengemas kotak seserahan "Sajadah & Mukena Sutra"',
    avatarStyle: 'bg-emerald-100 text-emerald-800'
  }
];

export const DEMO_ATTACHMENTS: SharedAttachment[] = [
  {
    id: 'a1',
    name: 'Kontrak_Arkadia_Venue.pdf',
    type: 'PDF',
    area: 'Budget',
    size: '1.8 MB',
    uploadedBy: 'Ardhi',
    uploadedAt: '2026-06-12',
    url: '#'
  },
  {
    id: 'a2',
    name: 'Inspirasi_Pelaminan_Jawa.png',
    type: 'Image',
    area: 'Checklist',
    size: '4.2 MB',
    uploadedBy: 'Ami',
    uploadedAt: '2026-06-14',
    url: '#'
  },
  {
    id: 'a3',
    name: 'Invoice_Lunas_Artea.pdf',
    type: 'PDF',
    area: 'Vendor',
    size: '520 KB',
    uploadedBy: 'Ardhi',
    uploadedAt: '2026-06-18',
    url: '#'
  },
  {
    id: 'a4',
    name: 'Menu_Pilihan_Syamil.pdf',
    type: 'PDF',
    area: 'Budget',
    size: '1.2 MB',
    uploadedBy: 'Ami',
    uploadedAt: '2026-06-19',
    url: '#'
  }
];

export const TIMELINE_TEMPLATES_12M = [
  { title: 'Menentukan Anggaran Kasar Pernikahan', description: 'Menghitung dana pribadi, kontribusi orang tua, dan menetapkan plafon pengeluaran.', owner: 'TOGETHER', category: 'WO' },
  { title: 'Pertemuan Keluarga Besar pertama', description: 'Silaturahmi keluarga calon mempelai pria dan wanita untuk membicarakan rencana tanggal.', owner: 'TOGETHER', category: 'Miscellaneous' },
  { title: 'Membuat Daftar Kasar Tamu Undangan', description: 'Meminta core guest list dari orang tua calon mempelai perempuan dan laki-laki.', owner: 'TOGETHER', category: 'Invitation' },
  { title: 'Survey Tempat Pernikahan (Gedung/Masjid)', description: 'Mencari venue strategis yang muat kapasitas tamu dan sesuai ketersediaan tanggal.', owner: 'TOGETHER', category: 'Venue' }
];

export const TIMELINE_TEMPLATES_6M = [
  { title: 'Memilih Vendor Catering Sesuai Anggaran', description: 'Melakukan food-testing dan negosiasi paket porsi.', owner: 'PARTNER_A', category: 'Catering' },
  { title: 'Menyewa Jasa Wedding Organizer (WO)', description: 'Mencari tim pelaksana hari H (On The Day) yang profesional.', owner: 'TOGETHER', category: 'WO' },
  { title: 'Memulai Pesan Baju Akad & Resepsi', description: 'Mencari desainer kebaya/beskap atau menyewa jas adat Jawa.', owner: 'PARTNER_A', category: 'Attire' }
];

export const TIMELINE_TEMPLATES_3M = [
  { title: 'Mengumpulkan Dokumen Persyaratan KUA', description: 'Mengurus surat N1, N2, N4 dari Kelurahan masing-masing calon pengantin.', owner: 'PARTNER_B', category: 'Miscellaneous' },
  { title: 'Membeli Cincin Kawin & Logam Mulia', description: 'Mencari cincin emas/palladium sesuai keinginan bersama.', owner: 'TOGETHER', category: 'Miscellaneous' },
  { title: 'Mematangkan Rundown Hari H', description: 'Melakukan rapat technical meeting perdana draf draf rundown acara.', owner: 'TOGETHER', category: 'WO' }
];
