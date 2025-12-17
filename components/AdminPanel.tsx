import React, { useState } from 'react';
import { Lock, Plus, Trash2, Edit2, Save, X, ArrowLeft, LogOut, Layers, Loader2, ArrowUpDown, ArrowUp, ArrowDown, Check, Sparkles, Smile } from 'lucide-react';
import { LinkItem } from '../types';
import { CATEGORIES, GOOGLE_SCRIPT_URL } from '../constants';
import { createLinkInSheet, updateLinkInSheet, deleteLinkInSheet, reorderLinksInSheet } from '../services/api';

interface AdminPanelProps {
  links: LinkItem[];
  setLinks: (links: LinkItem[]) => void;
  onBack: () => void;
  refreshData: () => void;
}

// รายชื่อ AI แนะนำสำหรับครู
const RECOMMENDED_AI_TOOLS = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', description: 'AI อัจฉริยะช่วยตอบคำถาม เขียนแผนการสอน และออกข้อสอบ', category: '🤖 เครื่องมือ AI', icon: '🤖' },
  { name: 'Google Gemini', url: 'https://gemini.google.com', description: 'AI จาก Google เก่งภาษาไทย เชื่อมต่อข้อมูลปัจจุบัน', category: '🤖 เครื่องมือ AI', icon: '✨' },
  { name: 'Canva Magic', url: 'https://www.canva.com', description: 'สร้างสื่อการสอน ใบงาน และสไลด์สวยๆ ด้วย AI', category: '🤖 เครื่องมือ AI', icon: '🎨' },
  { name: 'Gamma App', url: 'https://gamma.app', description: 'สร้างสไลด์นำเสนอ (PPT) อัตโนมัติในไม่กี่วินาที', category: '🤖 เครื่องมือ AI', icon: '📊' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai', description: 'ค้นหาข้อมูลพร้อมอ้างอิงแหล่งที่มา เหมาะสำหรับทำวิจัย', category: '🤖 เครื่องมือ AI', icon: '🔎' },
  { name: 'Quillbot', url: 'https://quillbot.com', description: 'เครื่องมือช่วยเกลาภาษาอังกฤษและตรวจสอบไวยากรณ์', category: '🤖 เครื่องมือ AI', icon: '✍️' }
];

// ชุดไอคอนสำหรับให้เลือก
const ICON_SETS = [
  {
    title: "ยอดนิยม",
    icons: ["🔗", "⭐", "🔥", "📌", "📢", "🆕", "✅", "❌", "❤️", "💡"]
  },
  {
    title: "การศึกษา",
    icons: ["📚", "🎓", "🏫", "🎒", "📝", "✏️", "📏", "✂️", "🖍️", "📖", "👩‍🏫", "👨‍🏫"]
  },
  {
    title: "เอกสาร/สำนักงาน",
    icons: ["📄", "📊", "📈", "📉", "📁", "📂", "📅", "📋", "📎", "📥", "📤", "🖨️"]
  },
  {
    title: "เทคโนโลยี/AI",
    icons: ["💻", "🤖", "🧠", "📱", "🌐", "☁️", "💾", "🖱️", "⌨️", "🔌", "🔋", "📸"]
  },
  {
    title: "วิชา/กิจกรรม",
    icons: ["🔢", "🧪", "🧬", "🎨", "🎵", "⚽", "🏀", "🏊", "🌍", "🏰", "🕌", "🎎", "🇬🇧", "🇹🇭"]
  },
  {
    title: "อื่นๆ",
    icons: ["🏆", "🥇", "🎁", "🔔", "🛠️", "🚑", "🍽️", "🚌", "🏠", "💬", "🔍", "⚙️"]
  }
];

const AdminPanel: React.FC<AdminPanelProps> = ({ links, setLinks, onBack, refreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reorder Mode State
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Icon Picker State
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LinkItem>>({
    category: '⭐ ลิงก์โปรด',
    status: 'show',
    icon: '🔗'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin4444') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const resetForm = () => {
    setFormData({
      category: '⭐ ลิงก์โปรด',
      status: 'show',
      icon: '🔗',
      name: '',
      url: '',
      description: ''
    });
    setEditingId(null);
    setShowIconPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;
    
    if (GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่") {
      alert("ไม่สามารถบันทึกได้: กรุณาเชื่อมต่อ Google Sheets ก่อน");
      return;
    }

    setIsSubmitting(true);

    if (editingId) {
      // Edit existing
      const updatedLink = { ...formData, id: editingId } as LinkItem;
      await updateLinkInSheet(updatedLink);
      
      const updatedLinks = links.map(link => 
        link.id === editingId ? updatedLink : link
      );
      setLinks(updatedLinks);
    } else {
      // Add new
      const newLink: LinkItem = {
        id: Date.now().toString(),
        name: formData.name || '',
        url: formData.url || '',
        description: formData.description || '',
        category: formData.category || 'อื่นๆ',
        icon: formData.icon || '🔗',
        status: (formData.status as 'show' | 'hide') || 'show'
      };
      await createLinkInSheet(newLink);
      
      setLinks([...links, newLink]);
    }

    setIsSubmitting(false);
    resetForm();
    setTimeout(() => refreshData(), 1000);
  };

  const handleAddRecommendedAI = async () => {
    if (GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่") {
      alert("กรุณาเชื่อมต่อ Google Sheets ก่อน");
      return;
    }

    if (!window.confirm(`ระบบจะทำการเพิ่มลิงก์เครื่องมือ AI จำนวน ${RECOMMENDED_AI_TOOLS.length} รายการลงในฐานข้อมูล ยืนยันหรือไม่?`)) {
      return;
    }

    setIsSubmitting(true);
    let currentLinks = [...links];

    // Loop through recommended tools and add them
    for (const tool of RECOMMENDED_AI_TOOLS) {
      // Check if already exists (simple check by name)
      const exists = currentLinks.some(l => l.name === tool.name);
      if (!exists) {
        const newLink: LinkItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          ...tool,
          status: 'show'
        } as LinkItem;
        
        // Add to sheet
        await createLinkInSheet(newLink);
        // Add to local state temporarily
        currentLinks.push(newLink);
        
        // Small delay to prevent overwhelming the script
        await new Promise(r => setTimeout(r, 800));
      }
    }

    setLinks(currentLinks);
    setIsSubmitting(false);
    alert("เพิ่มเครื่องมือ AI แนะนำเรียบร้อยแล้ว!");
    setTimeout(() => refreshData(), 1000);
  };

  const handleEdit = (item: LinkItem) => {
    if (isReorderMode) return;
    setFormData(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (isReorderMode) return;
    if (window.confirm('คุณต้องการลบลิงก์นี้ใช่หรือไม่?')) {
      if (GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่") {
        alert("ไม่สามารถลบได้: กรุณาเชื่อมต่อ Google Sheets ก่อน");
        return;
      }

      setIsSubmitting(true);
      await deleteLinkInSheet(id);
      
      setLinks(links.filter(link => link.id !== id));
      if (editingId === id) resetForm();
      
      setIsSubmitting(false);
      setTimeout(() => refreshData(), 1000);
    }
  };

  // Reorder Logic
  const toggleReorderMode = () => {
    if (isReorderMode) {
      setIsReorderMode(false);
      refreshData();
    } else {
      setIsReorderMode(true);
      setEditingId(null);
      resetForm();
    }
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links];
    if (direction === 'up' && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    } else if (direction === 'down' && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    }
    setLinks(newLinks);
  };

  const saveOrder = async () => {
    if (GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่") {
      alert("ไม่สามารถบันทึกได้: กรุณาเชื่อมต่อ Google Sheets ก่อน");
      return;
    }

    setIsSubmitting(true);
    const orderedIds = links.map(link => link.id);
    await reorderLinksInSheet(orderedIds);
    setIsSubmitting(false);
    setIsReorderMode(false);
    setTimeout(() => refreshData(), 1500); 
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-indigo-50">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 text-indigo-600 shadow-sm">
              <Lock size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบแอดมิน</h2>
            <p className="text-slate-500 mt-2">กรุณากรอกรหัสผ่านเพื่อจัดการข้อมูล</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg"
                placeholder="รหัสผ่าน"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 pl-1 font-medium">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5"
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 text-sm"
            >
              ← กลับหน้าหลัก
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <Loader2 className="animate-spin text-indigo-600 mb-3" size={40} />
            <span className="text-slate-800 font-semibold">กำลังบันทึกข้อมูล...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onBack} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white shadow-sm border border-white/20 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">จัดการข้อมูลลิงก์</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             {isReorderMode ? (
               <>
                 <button
                   onClick={saveOrder}
                   className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all font-semibold shadow-md shadow-indigo-200 whitespace-nowrap"
                 >
                   <Check size={18} />
                   <span>บันทึกลำดับ</span>
                 </button>
                 <button
                   onClick={toggleReorderMode}
                   className="flex items-center gap-2 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl transition-all font-medium whitespace-nowrap"
                 >
                   <X size={18} />
                   <span>ยกเลิก</span>
                 </button>
               </>
             ) : (
               <>
                 <button
                   onClick={handleAddRecommendedAI}
                   className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 px-4 py-2.5 rounded-xl transition-all font-medium shadow-sm whitespace-nowrap"
                   title="เพิ่มลิงก์ AI ยอดนิยมอัตโนมัติ"
                 >
                   <Sparkles size={18} />
                   <span className="hidden sm:inline">เพิ่ม AI แนะนำ</span>
                   <span className="inline sm:hidden">AI</span>
                 </button>

                 <div className="h-8 w-px bg-slate-300 mx-1 hidden sm:block"></div>

                 <button
                   onClick={toggleReorderMode}
                   className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl transition-all font-medium shadow-sm whitespace-nowrap"
                 >
                   <ArrowUpDown size={18} />
                   <span className="hidden sm:inline">จัดเรียง</span>
                 </button>

                 <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 bg-white hover:bg-red-50 border border-slate-100 hover:border-red-100 px-4 py-2.5 rounded-xl transition-all font-medium shadow-sm whitespace-nowrap"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">ออก</span>
                </button>
               </>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section (Hidden in Reorder Mode) */}
        <div className={`lg:col-span-1 transition-all duration-300 ${isReorderMode ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className={`p-2 rounded-lg ${editingId ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
              </div>
              {editingId ? 'แก้ไขลิงก์' : 'เพิ่มลิงก์ใหม่'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 p-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50/50"
                  disabled={isSubmitting || isReorderMode}
                >
                  {CATEGORIES.filter(c => c !== 'ทั้งหมด').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ชื่อลิงก์</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 p-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                  placeholder="เช่น Google Docs"
                  disabled={isSubmitting || isReorderMode}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL</label>
                <input
                  type="url"
                  required
                  value={formData.url || ''}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 p-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-slate-500"
                  placeholder="https://..."
                  disabled={isSubmitting || isReorderMode}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">คำอธิบาย</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 p-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none"
                  placeholder="รายละเอียดสั้นๆ"
                  disabled={isSubmitting || isReorderMode}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">ไอคอน</label>
                  <div className="relative">
                    <div className="flex gap-2">
                       <input
                        type="text"
                        value={formData.icon || ''}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        className="w-full rounded-xl border border-slate-200 p-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-center text-xl"
                        placeholder="📝"
                        disabled={isSubmitting || isReorderMode}
                      />
                      <button
                        type="button"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        className={`px-3 rounded-xl border transition-all ${showIconPicker ? 'bg-indigo-100 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                      >
                         <Smile size={20} />
                      </button>
                    </div>

                    {/* Icon Picker Popover */}
                    {showIconPicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-60 overflow-y-auto">
                        <div className="space-y-4">
                          {ICON_SETS.map((set) => (
                            <div key={set.title}>
                              <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{set.title}</h4>
                              <div className="grid grid-cols-5 gap-2">
                                {set.icons.map((icon) => (
                                  <button
                                    key={icon}
                                    type="button"
                                    onClick={() => {
                                      setFormData({...formData, icon: icon});
                                      setShowIconPicker(false);
                                    }}
                                    className="h-8 w-8 flex items-center justify-center text-lg rounded hover:bg-indigo-50 hover:scale-110 transition-all cursor-pointer"
                                  >
                                    {icon}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'show' | 'hide'})}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50/50"
                    disabled={isSubmitting || isReorderMode}
                  >
                    <option value="show">แสดง</option>
                    <option value="hide">ซ่อน</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isReorderMode}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold flex justify-center items-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  บันทึกข้อมูล
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting || isReorderMode}
                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className={`bg-white rounded-2xl shadow-sm border ${isReorderMode ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'} overflow-hidden transition-all duration-300`}>
            <div className={`p-5 border-b flex justify-between items-center ${isReorderMode ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/50 border-slate-100'}`}>
              <h3 className={`font-bold text-lg ${isReorderMode ? 'text-indigo-700' : 'text-slate-700'}`}>
                {isReorderMode ? '🏗️ กำลังจัดเรียงลำดับ...' : `รายการลิงก์ทั้งหมด (${links.length})`}
              </h3>
              {isReorderMode && (
                <span className="text-sm text-indigo-500 font-medium animate-pulse">
                  กดลูกศรขึ้น/ลง เพื่อย้ายตำแหน่ง
                </span>
              )}
            </div>
            <div className="divide-y divide-slate-100 max-h-[75vh] overflow-y-auto">
              {links.length === 0 ? (
                <div className="p-12 text-center">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                     <Layers size={32} />
                   </div>
                   <p className="text-slate-500">ยังไม่มีข้อมูลลิงก์</p>
                </div>
              ) : (
                links.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-4 sm:p-5 flex items-start justify-between transition-all duration-200 
                      ${isReorderMode 
                        ? 'hover:bg-indigo-50/50 cursor-move' 
                        : 'hover:bg-slate-50 group'
                      }
                      ${editingId === item.id ? 'bg-indigo-50/30' : ''}
                    `}
                  >
                    <div className="flex gap-4 sm:gap-5 items-center">
                      {isReorderMode && (
                        <div className="flex flex-col gap-1 text-slate-400">
                          <button 
                            onClick={() => moveLink(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:text-indigo-600 hover:bg-indigo-100 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                          >
                            <ArrowUp size={20} />
                          </button>
                          <button 
                             onClick={() => moveLink(index, 'down')}
                             disabled={index === links.length - 1}
                             className="p-1 hover:text-indigo-600 hover:bg-indigo-100 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                          >
                            <ArrowDown size={20} />
                          </button>
                        </div>
                      )}
                      
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-inner">
                        {item.icon}
                      </div>
                      
                      <div className="pt-1">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-base sm:text-lg">
                          {item.name}
                          {item.status === 'hide' && (
                            <span className="text-xs bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full font-medium">ซ่อน</span>
                          )}
                        </h4>
                        <div className="text-sm text-slate-500 mt-1 line-clamp-1 max-w-[150px] sm:max-w-md">
                          {isReorderMode ? (
                            <span className="text-slate-400 select-none">
                              {item.category} • {item.description}
                            </span>
                          ) : (
                            <>
                              <a href={item.url} target="_blank" className="text-indigo-500 hover:underline mr-2">Link</a>
                              <span className="text-slate-300">|</span> {item.description}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isReorderMode && (
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all self-center">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={isSubmitting}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 disabled:opacity-50"
                          title="แก้ไข"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isSubmitting}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                          title="ลบ"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;