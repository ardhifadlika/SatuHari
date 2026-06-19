/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Folder, 
  FolderHeart, 
  Search, 
  Trash2, 
  Filter, 
  CheckCircle,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { SharedAttachment } from '../types';

interface MediaLibraryViewProps {
  attachments: SharedAttachment[];
  onUploadAttachment: (attachment: Omit<SharedAttachment, 'id' | 'uploadedAt'>) => void;
  onDeleteAttachment: (id: string) => void;
  currentUser: string;
}

export default function MediaLibraryView({
  attachments,
  onUploadAttachment,
  onDeleteAttachment,
  currentUser
}: MediaLibraryViewProps) {
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [dragActive, setDragActive] = useState(false);
  
  // New file manual state
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'Image' | 'Spreadsheet' | 'Document'>('PDF');
  const [fileArea, setFileArea] = useState<'Budget' | 'Vendor' | 'Checklist' | 'Rundown' | 'Seserahan'>('Budget');
  const [fileSize, setFileSize] = useState('1.5 MB');

  const filteredAttachments = attachments.filter(file => {
    if (filterArea !== 'ALL' && file.area !== filterArea) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        file.name.toLowerCase().includes(q) ||
        file.uploadedBy.toLowerCase().includes(q) ||
        file.area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-8 h-8 text-red-650 text-red-500 stroke-1" />;
      case 'Image': return <ImageIcon className="w-8 h-8 text-blue-650 text-blue-500 stroke-1" />;
      case 'Spreadsheet': return <FileCode className="w-8 h-8 text-emerald-650 text-emerald-600 stroke-1" />;
      case 'Document': return <FileText className="w-8 h-8 text-indigo-650 text-indigo-500 stroke-1" />;
      default: return <FileText className="w-8 h-8 text-stone-500 stroke-1" />;
    }
  };

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    // Clean extension
    const cleanName = fileName.includes('.') 
      ? fileName 
      : `${fileName}.${fileType.toLowerCase() === 'spreadsheet' ? 'xlsx' : fileType.toLowerCase() === 'document' ? 'docx' : fileType.toLowerCase()}`;

    onUploadAttachment({
      name: cleanName,
      type: fileType,
      area: fileArea,
      size: fileSize,
      uploadedBy: currentUser,
      url: '#'
    });

    setFileName('');
    setFileSize('1.5 MB');
    alert(`Berkas "${cleanName}" berhasil diunggah kolaboratif! 📂💕`);
  };

  // Mock drag events for a beautiful UX
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Simulate drop
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      let detectedType: 'PDF' | 'Image' | 'Spreadsheet' | 'Document' = 'PDF';
      if (droppedFile.type.includes('image')) detectedType = 'Image';
      else if (droppedFile.name.endsWith('xlsx') || droppedFile.name.endsWith('csv')) detectedType = 'Spreadsheet';
      else if (droppedFile.name.endsWith('docx') || droppedFile.name.endsWith('doc')) detectedType = 'Document';

      // Safe size formatter
      const sizeMB = (droppedFile.size / (1024 * 1024)).toFixed(1) + ' MB';

      onUploadAttachment({
        name: droppedFile.name,
        type: detectedType,
        area: 'Checklist',
        size: sizeMB,
        uploadedBy: currentUser,
        url: '#'
      });

      alert(`Berkas "${droppedFile.name}" berhasil dijatuhkan (diunggah) di folder Checklist! 📂🎉`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Lampiran Berkas Bersama</h2>
        <p className="text-sm text-stone-500">Folder terpadu penyimpan proposal katering, invoice pelunasan pelaminan, draf list tamu undangan pernikahan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DRAG AND DROP & METADATA UPLOADER (Left/Right) */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Uploader Box */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`bg-white border-2 border-dashed rounded-xl p-6 text-center transition flex flex-col items-center justify-center space-y-3 cursor-pointer ${dragActive ? 'border-amber-700 bg-amber-50/15' : 'border-stone-200/80 hover:border-amber-700'}`}
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 mx-auto">
              <Upload className="w-6 h-6 stroke-1.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">Jatuhkan Berkas di Sini</span>
              <p className="text-[11px] text-zinc-500 mt-1">Dukung format: PDF, JPEG, PNG, XLSX, DOCX hingga 15MB</p>
            </div>
            
            <span className="text-stone-400 font-mono text-[10px]">ATAU</span>

            <form onSubmit={handleManualUpload} className="w-full space-y-2 text-left text-[11px] font-semibold text-stone-700">
              <div>
                <label className="block mb-0.5">Nama Berkas</label>
                <input
                  type="text"
                  required
                  placeholder="pricelist-vendor-dekor"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-lg text-[11px] bg-stone-50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-0.5">Tipe</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full p-1.5 border border-stone-200 rounded-lg text-[11px] bg-white focus:outline-none"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Image">Gambar (PNG/JPG)</option>
                    <option value="Spreadsheet">Excel Spreadsheet</option>
                    <option value="Document">Word Document</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-0.5">Penempatan Area</label>
                  <select
                    value={fileArea}
                    onChange={(e) => setFileArea(e.target.value as any)}
                    className="w-full p-1.5 border border-stone-200 rounded-lg text-[11px] bg-white focus:outline-none"
                  >
                    <option value="Budget">Budget / Finansial</option>
                    <option value="Vendor">Vendor Jasa</option>
                    <option value="Checklist">Checklist Persiapan</option>
                    <option value="Rundown">Rundown Hari H</option>
                    <option value="Seserahan">Seserahan Box</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-[#FAF9F5] font-bold rounded-lg transition mt-1.5"
              >
                Unduh Berkas Ke Workspace
              </button>
            </form>
          </div>

          {/* Quick Stats folders counts */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/70 text-xs space-y-2.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Direktori Folder Aktif (Sektor)</span>
            
            <div className="space-y-1.5 font-medium text-stone-700">
              {['Budget', 'Vendor', 'Checklist', 'Rundown', 'Seserahan'].map(area => {
                const count = attachments.filter(f => f.area === area).length;
                return (
                  <button
                    key={area}
                    onClick={() => setFilterArea(area)}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg transition ${filterArea === area ? 'bg-amber-100/40 font-bold' : 'hover:bg-amber-50/10'}`}
                  >
                    <span className="flex items-center"><Folder className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Folder {area}</span>
                    <span className="bg-stone-100 text-stone-600 font-bold font-mono px-1.5 py-0.5 rounded text-[10px]">{count} Berkas</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* LIST OF CURRENT SHARED ATTACHMENTS (Middle/Right) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* SEARCH & ACCENT FILTER CONTROL */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/70 shadow-xs flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari draf file proposal katering, menu kwitansi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-600 bg-stone-50"
              />
            </div>

            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-amber-600 bg-white cursor-pointer font-semibold text-zinc-700"
            >
              <option value="ALL">Semua Folder Sektor</option>
              <option value="Budget">Budget</option>
              <option value="Vendor">Vendor</option>
              <option value="Checklist">Checklist</option>
              <option value="Rundown">Rundown</option>
              <option value="Seserahan">Seserahan</option>
            </select>
          </div>

          {/* FILES CARD GRID */}
          {filteredAttachments.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200/60 p-12 text-center text-zinc-400 space-y-2">
              <FolderHeart className="w-10 h-10 mx-auto stroke-1 text-zinc-300" />
              <p className="text-xs font-medium">Belum ada berkas terunggah di filter area ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAttachments.map((file) => (
                <div 
                  key={file.id} 
                  className="bg-white border border-stone-200/70 p-4 rounded-xl hover:shadow-md transition flex items-start justify-between gap-3"
                >
                  <div className="flex items-start space-x-3 truncate">
                    {getFileIcon(file.type)}
                    <div className="truncate space-y-1">
                      <span className="font-bold text-stone-900 block text-xs truncate" title={file.name}>
                        {file.name}
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono font-medium">
                        <span className="bg-amber-50 text-amber-805 text-amber-800 font-bold px-1.5 rounded py-0.2 uppercase select-none">{file.area}</span>
                        <span>{file.size}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        Diunggah oleh: <span className="font-semibold text-stone-800">{file.uploadedBy}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => alert(`Simulasi mengunduh berkas "${file.name}" ke komputer Anda! 📥`)}
                      className="p-1 px-1.5 text-zinc-500 hover:text-amber-800 rounded hover:bg-stone-50 transition"
                      title="Download Berkas"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAttachment(file.id)}
                      className="p-1 px-1.5 text-zinc-450 hover:text-red-600 rounded hover:bg-red-50 transition"
                      title="Hapus Berkas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
