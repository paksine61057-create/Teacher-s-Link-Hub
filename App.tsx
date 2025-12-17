import React, { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Layers, Search, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { LinkItem } from './types';
import { MOCK_DATA, CATEGORIES, GOOGLE_SCRIPT_URL } from './constants';
import LinkCard from './components/LinkCard';
import SearchBar from './components/SearchBar';
import AdminPanel from './components/AdminPanel';
import { fetchLinksFromSheet } from './services/api';

function App() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [view, setView] = useState<'home' | 'admin'>('home');

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    if (GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่") {
       setLinks(MOCK_DATA);
       setLoading(false);
       return;
    }

    const data = await fetchLinksFromSheet();
    if (data.length > 0) {
      setLinks(data);
    } else {
      // Fallback if empty or error, verify if it's just empty sheet or connection error
      // For now, keep empty array
      setLinks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Data Logic
  const filteredData = useMemo(() => {
    let data = links.filter(item => item.status === 'show');

    if (activeCategory !== 'ทั้งหมด') {
      data = data.filter(item => item.category === activeCategory);
    }

    if (searchTerm.trim() !== '') {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.name.toLowerCase().includes(lowerTerm) || 
        item.description.toLowerCase().includes(lowerTerm) ||
        item.category.toLowerCase().includes(lowerTerm)
      );
    }

    return data;
  }, [searchTerm, activeCategory, links]);

  if (view === 'admin') {
    return (
      <AdminPanel 
        links={links} 
        setLinks={setLinks} 
        onBack={() => {
          setView('home');
          loadData(); // Reload data when returning from admin to ensure sync
        }}
        refreshData={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-white/50 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => {setSearchTerm(''); setActiveCategory('ทั้งหมด');}}>
              <div className="bg-white p-1 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden border border-slate-100">
                <img 
                  src="https://img5.pic.in.th/file/secure-sv1/5bc66fd0-c76e-41c4-87ed-46d11f4a36fa.png" 
                  alt="Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight tracking-tight">
                  รวมลิงค์สำหรับคุณครูโรงเรียนประจักษ์ศิลปาคม
                </h1>
                <p className="text-sm text-indigo-600 font-medium">
                  Teacher's Link Hub
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 w-full md:max-w-md">
               <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Warning if no URL setup */}
        {GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 text-yellow-800">
             <AlertCircle className="shrink-0 mt-0.5" />
             <div>
               <h3 className="font-bold">ยังไม่ได้เชื่อมต่อฐานข้อมูล</h3>
               <p className="text-sm">กรุณาสร้าง Google Sheets และนำ URL มาใส่ในไฟล์ <code>constants.ts</code> เพื่อให้ระบบทำงานได้สมบูรณ์ (ดูข้อมูลตัวอย่างไปก่อน)</p>
             </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex space-x-3 min-w-max px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap shadow-sm border
                  ${activeCategory === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 shadow-md transform -translate-y-0.5' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="animate-spin mb-4" size={32} />
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                {activeCategory === 'ทั้งหมด' ? (
                  <>
                    <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                      <LayoutGrid size={20} />
                    </div>
                    ลิงก์ทั้งหมด
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                      <Layers size={20} />
                    </div>
                    หมวด: {activeCategory}
                  </>
                )}
              </h2>
              <span className="text-sm font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                {filteredData.length} รายการ
              </span>
            </div>

            {/* Grid Layout */}
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.map((item) => (
                  <LinkCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-white p-8 rounded-full mb-6 shadow-sm border border-slate-100">
                  <Search size={48} className="text-indigo-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">ไม่พบข้อมูลลิงก์</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ "ทั้งหมด"
                </p>
                <button 
                  onClick={() => {setSearchTerm(''); setActiveCategory('ทั้งหมด');}}
                  className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-semibold transition-colors"
                >
                  ล้างคำค้นหา
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="font-semibold text-slate-700">© 2024 รวมลิงค์สำหรับคุณครูโรงเรียนประจักษ์ศิลปาคม</p>
              <p className="text-xs text-slate-400 mt-1">
                พัฒนาเพื่อการศึกษาไทย
              </p>
            </div>
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setView('admin')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100"
              >
                <Settings size={16} />
                <span className="font-medium">สำหรับแอดมิน</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;