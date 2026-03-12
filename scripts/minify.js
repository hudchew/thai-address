const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../thailand-address-bilingual.json');
const OUTPUT_FILE = path.join(__dirname, '../thailand-address-bilingual.min.json');

try {
  console.log('⏳ กำลังย่อขนาดไฟล์ (Minifying)...');
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data));
  
  const originalSize = (fs.statSync(INPUT_FILE).size / 1024).toFixed(2);
  const minifiedSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
  
  console.log(`✅ ย่อขนาดไฟล์สำเร็จ!`);
  console.log(`📊 เดิม: ${originalSize} KB -> ใหม่: ${minifiedSize} KB`);
} catch (e) {
  console.error('❌ เกิดข้อผิดพลาดในการย่อขนาดไฟล์:', e.message);
  process.exit(1);
}
