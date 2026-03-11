const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../thailand-address-bilingual.json');

try {
  const content = fs.readFileSync(FILE_PATH, 'utf8');
  const data = JSON.parse(content);
  
  data.forEach((province) => {
    if (!province.p.th || !province.p.en) throw new Error(`ชื่อจังหวัดไม่ครบ: ${JSON.stringify(province.p)}`);
    
    province.d.forEach((district) => {
      if (!district.n.th || !district.n.en) throw new Error(`ชื่ออำเภอไม่ครบ: ${JSON.stringify(district.n)}`);
      
      district.s.forEach((sub) => {
        if (!sub.n.th || !sub.n.en) throw new Error(`ชื่อตำบลไม่ครบ: ${sub.n.th}`);
        if (!sub.z || sub.z.length !== 5) throw new Error(`รหัสไปรษณีย์ [${sub.z}] ไม่ถูกต้อง: ${sub.n.th}`);
      });
    });
  });

  console.log('✅ ข้อมูลถูกต้องพร้อมใช้งานครับ!');
} catch (e) {
  console.error('❌ ตรวจพบข้อผิดพลาด:', e.message);
  process.exit(1);
}