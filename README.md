# 🇹🇭 Thai Address (Bilingual)

ฐานข้อมูลที่อยู่ประเทศไทย (จังหวัด-อำเภอ-ตำบล-รหัสไปรษณีย์) แบบ 2 ภาษา (TH/EN) ที่เบาและอัปเดตง่ายที่สุดสำหรับนักพัฒนา
## ✨ ทำไมต้องใช้ตัวนี้?

- 🌍 **Bilingual:** รองรับทั้งภาษาไทยและภาษาอังกฤษ (ชื่อเฉพาะ คลีน ไม่มีคำนำหน้า Khet/Amphoe/Tambon)
- 🆔 **Official IDs:** มีรหัสมาตรฐานกรมการปกครอง (DOPA Codes) ให้ครบทั้ง จังหวัด-อำเภอ-ตำบล
- ⚡ **Lightweight:** โครงสร้าง JSON ขนาดเล็ก (ใช้ Key ย่อ) และมีเวอร์ชัน **Minified (เพียง 655 KB)**
- 🔄 **Easy Sync:** มีสคริปต์ช่วยดึงข้อมูลล่าสุดจาก GitHub เข้าโปรเจกต์คุณโดยตรง
- 🛠 **Type Safety:** แถม TypeScript Interfaces ให้ใช้ครบชุด

## 🚀 1. การติดตั้ง (Installation)

ไม่ต้องติดตั้ง Library ให้หนักโปรเจกต์ แค่เลือกไฟล์ที่ต้องการ (แนะนำเวอร์ชัน Minified):

- **Full:** `thailand-address-bilingual.json` (~1.5 MB)
- **Minified:** `thailand-address-bilingual.min.json` (**~655 KB** - แนะนำ!)

สร้างไฟล์ `scripts/sync-address.js` ในโปรเจกต์ของคุณ:

```javascript
const fs = require('fs');
const https = require('https');
const path = require('path');

// เปลี่ยนเป็น .min.json หากต้องการความเบาที่สุด
const RAW_URL = 'https://raw.githubusercontent.com/hudchew/thai-address/main/thailand-address-bilingual.min.json';

const LOCAL_PATH = './src/lib/data/thailand-address.json';
```
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
```

1. เพิ่ม Script ใน `package.json`:

```json
"scripts": {
  "sync-address": "node scripts/sync-address.js"
}
```

## 🔄 2. การอัปเดต (Update)

เมื่อมีการเพิ่มตำบลใหม่หรือแก้ไขข้อมูลใน GitHub นี้ คุณแค่รันคำสั่ง:

```bash
npm run sync-address
```

## 💻 3. ตัวอย่างการใช้งาน (Usage Examples)

### 📦 กำหนด Type (TypeScript)

ก๊อบปี้ไปวางใน `types/thai-address.ts`:

```typescript
export interface ThaiName { th: string; en: string; }
export interface ThaiSubdistrict { i: string; n: ThaiName; z: string; }
export interface ThaiDistrict { i: string; n: ThaiName; s: ThaiSubdistrict[]; }
export interface ThaiProvince { i: string; p: ThaiName; d: ThaiDistrict[]; }
```

### ⚛️ การใช้ใน Next.js (React)

ตัวอย่างการทำ Cascading Select (จังหวัด > อำเภอ > ตำบล) โดยใช้ ID ในการอ้างอิง:

```tsx
import { useState } from 'react';
import data from '@/lib/data/thailand-address.json';
import { ThaiProvince, ThaiDistrict } from '@/types/thai-address';

export default function AddressSelector() {
  const [selectedProvince, setSelectedProvince] = useState<ThaiProvince | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<ThaiDistrict | null>(null);
  const lang = 'th'; // หรือ 'en'

  return (
    <div className="space-y-4">
      {/* เลือกจังหวัด */}
      <select onChange={(e) => {
        const p = data.find(i => i.i === e.target.value);
        setSelectedProvince(p as ThaiProvince);
        setSelectedDistrict(null);
      }}>
        <option>เลือกจังหวัด</option>
        {data.map(item => <option key={item.i} value={item.i}>{item.p[lang]}</option>)}
      </select>

      {/* เลือกอำเภอ */}
      <select
        disabled={!selectedProvince}
        onChange={(e) => {
          const d = selectedProvince?.d.find(i => i.i === e.target.value);
          setSelectedDistrict(d as ThaiDistrict);
        }}
      >
        <option>เลือกอำเภอ</option>
        {selectedProvince?.d.map(item => <option key={item.i} value={item.i}>{item.n[lang]}</option>)}
      </select>
    </div>
  );
}
```

### 🅰️ การใช้ใน Angular

การใช้ร่วมกับ Signals ใน Angular 17+:

```typescript
import { Component, signal, computed } from '@angular/core';
import thaiAddressData from '../lib/data/thailand-address.json';
import { ThaiProvince } from '../types/thai-address';

@Component({
  selector: 'app-address',
  template: `
    <select (change)="onProvinceChange($event)">
      @for (p of data(); track p.i) {
        <option [value]="p.i">{{ p.p[lang()] }}</option>
      }
    </select>
  `
})
export class AppAddressComponent {
  data = signal<ThaiProvince[]>(thaiAddressData as ThaiProvince[]);
  lang = signal<'th' | 'en'>('th');
  selectedProvinceId = signal<string>('');

  onProvinceChange(event: any) {
    this.selectedProvinceId.set(event.target.value);
  }
}
```

## 🤝 4. การมีส่วนร่วม (Contribution)

พบคำสะกดผิด? หรืออยากเพิ่มตำบลใหม่? เรายินดีต้อนรับทุกคนครับ! 

กรุณาอ่าน [คู่มือการมีส่วนร่วม (CONTRIBUTING.md)](CONTRIBUTING.md) สำหรับขั้นตอนการ Fork, Validate, และเปิด Pull Request.

ขั้นตอนคร่าวๆ:
1. **Fork** Repository นี้
2. แก้ไขข้อมูลใน `thailand-address-bilingual.json`
3. รันเช็กความถูกต้อง:
   ```bash
   npm run validate
   # หรือ
   node scripts/validate.js
   ```
4. ส่ง **Pull Request** มาได้เลยครับ!

## 📜 License

MIT © [hudchew](https://github.com/hudchew)