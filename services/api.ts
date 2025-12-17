import { LinkItem } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

// ฟังก์ชันดึงข้อมูลจาก Google Sheets
export const fetchLinksFromSheet = async (): Promise<LinkItem[]> => {
  if (GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่") {
    console.warn("ยังไม่ได้ตั้งค่า URL ของ Apps Script");
    return [];
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// ฟังก์ชันเพิ่มลิงก์ใหม่
export const createLinkInSheet = async (link: LinkItem) => {
  return await sendToSheet({ action: 'create', ...link });
};

// ฟังก์ชันแก้ไขลิงก์
export const updateLinkInSheet = async (link: LinkItem) => {
  return await sendToSheet({ action: 'update', ...link });
};

// ฟังก์ชันลบลิงก์
export const deleteLinkInSheet = async (id: string) => {
  return await sendToSheet({ action: 'delete', id });
};

// ฟังก์ชันจัดเรียงลำดับลิงก์
export const reorderLinksInSheet = async (orderedIds: string[]) => {
  return await sendToSheet({ action: 'reorder', orderedIds });
};

// ฟังก์ชันกลางสำหรับส่งข้อมูล (POST)
const sendToSheet = async (payload: any) => {
  if (GOOGLE_SCRIPT_URL === "วาง_URL_APPS_SCRIPT_ที่นี่") {
    alert("กรุณาใส่ URL ของ Google Apps Script ในไฟล์ constants.ts ก่อน");
    return false;
  }

  try {
    // ใช้ no-cors เพราะ Apps Script จะ redirect ซึ่ง browser ทั่วไปจะ block
    // หมายเหตุ: เราจะไม่ได้รับ response กลับมาว่าสำเร็จหรือไม่ใน mode นี้ 
    // แต่ข้อมูลจะถูกส่งไปที่ Sheet
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error("Error sending data:", error);
    return false;
  }
};