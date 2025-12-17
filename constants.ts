import { LinkItem } from './types';

// ============================================================================
// ⚠️ สำคัญ: นำ URL ที่ได้จากการ Deploy Google Apps Script มาใส่ตรงนี้
// ============================================================================
export const GOOGLE_SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbzT8_T6NntRECIncn05cirVVdq2Q075HBBUdUKesBzgpWMbepmuczNfMrWxnCSIkozn/exec"; 

// ชุดสีพาสเทลสำหรับตกแต่งการ์ด (เรียงสลับสี โทนร้อน/เย็น เพื่อความแตกต่างที่ชัดเจน)
export const PASTEL_PALETTE = [
  { name: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', iconBg: 'bg-blue-100', hoverBorder: 'hover:border-blue-400', ring: 'focus:ring-blue-200' },
  { name: 'Rose', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', iconBg: 'bg-rose-100', hoverBorder: 'hover:border-rose-400', ring: 'focus:ring-rose-200' },
  { name: 'Emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', iconBg: 'bg-emerald-100', hoverBorder: 'hover:border-emerald-400', ring: 'focus:ring-emerald-200' },
  { name: 'Amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', iconBg: 'bg-amber-100', hoverBorder: 'hover:border-amber-400', ring: 'focus:ring-amber-200' },
  { name: 'Violet', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600', iconBg: 'bg-violet-100', hoverBorder: 'hover:border-violet-400', ring: 'focus:ring-violet-200' },
  { name: 'Orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', iconBg: 'bg-orange-100', hoverBorder: 'hover:border-orange-400', ring: 'focus:ring-orange-200' },
  { name: 'Cyan', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', iconBg: 'bg-cyan-100', hoverBorder: 'hover:border-cyan-400', ring: 'focus:ring-cyan-200' },
  { name: 'Pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', iconBg: 'bg-pink-100', hoverBorder: 'hover:border-pink-400', ring: 'focus:ring-pink-200' },
  { name: 'Teal', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', iconBg: 'bg-teal-100', hoverBorder: 'hover:border-teal-400', ring: 'focus:ring-teal-200' },
  { name: 'Fuchsia', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600', iconBg: 'bg-fuchsia-100', hoverBorder: 'hover:border-fuchsia-400', ring: 'focus:ring-fuchsia-200' },
  { name: 'Indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', iconBg: 'bg-indigo-100', hoverBorder: 'hover:border-indigo-400', ring: 'focus:ring-indigo-200' },
  { name: 'Lime', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600', iconBg: 'bg-lime-100', hoverBorder: 'hover:border-lime-400', ring: 'focus:ring-lime-200' },
  { name: 'Sky', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600', iconBg: 'bg-sky-100', hoverBorder: 'hover:border-sky-400', ring: 'focus:ring-sky-200' },
  { name: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', iconBg: 'bg-purple-100', hoverBorder: 'hover:border-purple-400', ring: 'focus:ring-purple-200' },
];

// ข้อมูลสำรองเผื่อกรณียังไม่ได้เชื่อมต่อ
export const MOCK_DATA: LinkItem[] = [
  {
    id: '1',
    category: '⭐ ลิงก์โปรด',
    name: 'ตัวอย่าง: Google',
    url: 'https://google.com',
    description: 'เชื่อมต่อ Google Sheets เพื่อแก้ไขข้อมูล',
    icon: '🔍',
    status: 'show'
  }
];

export const CATEGORIES: string[] = [
  'ทั้งหมด',
  '⭐ ลิงก์โปรด',
  '📝 งานเอกสาร',
  '📊 วัดผล/ประเมินผล',
  '🏫 ระบบโรงเรียน',
  '🎨 สื่อการสอน',
  '🤖 เครื่องมือ AI',
  'อื่นๆ'
];