export interface LinkItem {
  id: string;
  category: string;
  name: string;
  url: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
  status: 'show' | 'hide';
}

export type Category = 
  | 'ทั้งหมด' 
  | '⭐ ลิงก์โปรด' 
  | '📝 งานเอกสาร' 
  | '📊 วัดผล/ประเมินผล' 
  | '🏫 ระบบโรงเรียน' 
  | '🎨 สื่อการสอน' 
  | '🤖 เครื่องมือ AI'
  | 'อื่นๆ';
