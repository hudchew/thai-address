# 🇹🇭 Thai Address (Bilingual)

ฐานข้อมูลที่อยู่ประเทศไทย (จังหวัด-อำเภอ-ตำบล-รหัสไปรษณีย์) แบบ 2 ภาษา (TH/EN) ที่เบาและอัปเดตง่ายที่สุดสำหรับนักพัฒนา

## ✨ ทำไมต้องใช้ตัวนี้?

- 🌍 **Bilingual:** รองรับทั้งภาษาไทยและภาษาอังกฤษ (ทับศัพท์มาตรฐาน)
- ⚡ **Lightweight:** โครงสร้าง JSON ขนาดเล็ก (ใช้ Key ย่อ) โหลดไว ไม่หนักแอป
- 🔄 **Easy Sync:** มีสคริปต์ช่วยดึงข้อมูลล่าสุดจาก GitHub เข้าโปรเจกต์คุณโดยตรง
- 🛠 **Type Safety:** แถม TypeScript Interfaces ให้ใช้ครบชุด

## 🚀 1. การติดตั้ง (Installation)

ไม่ต้องติดตั้ง Library ให้หนักโปรเจกต์ แค่ทำตาม 2 ขั้นตอนนี้ครับ:

1. สร้างไฟล์ `scripts/sync-address.js` ในโปรเจกต์ของคุณแล้ววางโค้ดนี้ลงไป:

```
const fs = require('fs');
const https = require('https');
const path = require('path');

const RAW_URL = 'https://raw.githubusercontent.com/hudchew/thai-address/main/thailand-address-bilingual.json';
const SAVE_PATH = './src/lib/data/thailand-address.json';

const dir = path.dirname(SAVE_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

console.log('⏳ กำลัง Sync ข้อมูลจาก hudchew/thai-address...');
https.get(RAW_URL, (res) => {
    const file = fs.createWriteStream(SAVE_PATH);
    res.pipe(file);
    file.on('finish', () => console.log('✅ Sync ข้อมูลที่อยู่เรียบร้อยที่: ' + SAVE_PATH));
});
```

1. เพิ่ม Script ใน `package.json`:

```
"scripts": {
  "sync-address": "node scripts/sync-address.js"
}
```

## 🔄 2. การอัปเดต (Update)

เมื่อมีการเพิ่มตำบลใหม่หรือแก้ไขข้อมูลใน GitHub นี้ คุณแค่รันคำสั่ง:

```
npm run sync-address
```

## 💻 3. ตัวอย่างการใช้งาน (Usage Examples)

### 📦 กำหนด Type (TypeScript)

ก๊อบปี้ไปวางใน `types/thai-address.ts`:

```
export interface ThaiName { th: string; en: string; }
export interface ThaiSubdistrict { n: ThaiName; z: string; }
export interface ThaiDistrict { n: ThaiName; s: ThaiSubdistrict[]; }
export interface ThaiProvince { p: ThaiName; d: ThaiDistrict[]; }
```

### ⚛️ การใช้ใน Next.js (React)

ตัวอย่างการทำ Cascading Select (จังหวัด > อำเภอ > ตำบล):

```
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
        const p = data.find(i => i.p[lang] === e.target.value);
        setSelectedProvince(p as ThaiProvince);
        setSelectedDistrict(null);
      }}>
        <option>เลือกจังหวัด</option>
        {data.map(item => <option key={item.p.en}>{item.p[lang]}</option>)}
      </select>

      {/* เลือกอำเภอ */}
      <select
        disabled={!selectedProvince}
        onChange={(e) => {
          const d = selectedProvince?.d.find(i => i.n[lang] === e.target.value);
          setSelectedDistrict(d as ThaiDistrict);
        }}
      >
        <option>เลือกอำเภอ</option>
        {selectedProvince?.d.map(item => <option key={item.n.en}>{item.n[lang]}</option>)}
      </select>
    </div>
  );
}
```

### 🅰️ การใช้ใน Angular

การใช้ร่วมกับ Signals ใน Angular 17+:

```
import { Component, signal, computed } from '@angular/core';
import thaiAddressData from '../lib/data/thailand-address.json';
import { ThaiProvince } from '../types/thai-address';

@Component({
  selector: 'app-address',
  template: `
    <select (change)="onProvinceChange($event)">
      @for (p of data(); track p.p.en) {
        <option [value]="p.p.en">{{ p.p.th }}</option>
      }
    </select>
  `
})
export class AppAddressComponent {
  data = signal<ThaiProvince[]>(thaiAddressData as ThaiProvince[]);
  selectedProvinceEn = signal<string>('');

  onProvinceChange(event: any) {
    this.selectedProvinceEn.set(event.target.value);
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