const fs = require('fs');
const https = require('https');
const path = require('path');

const RAW_URL = 'https://raw.githubusercontent.com/hudchew/thai-address/main/thailand-address-bilingual.json';

const LOCAL_PATH = './src/lib/data/thailand-address.json';
const dir = path.dirname(LOCAL_PATH);

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

console.log('⏳ กำลังดาวน์โหลดข้อมูลจาก hudchew/thai-address...');

https.get(RAW_URL, (res) => {
    if (res.statusCode !== 200) {
        console.error('❌ ไม่สามารถดึงข้อมูลได้ (Status Code: ' + res.statusCode + ')');
        return;
    }
    const file = fs.createWriteStream(LOCAL_PATH);
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('✅ อัปเดตข้อมูลที่อยู่ล่าสุดเรียบร้อยแล้ว!');
        console.log('📍 ไฟล์ถูกบันทึกไว้ที่: ' + LOCAL_PATH);
    });
}).on('error', (err) => {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
});