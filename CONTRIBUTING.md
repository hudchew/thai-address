# Contributing to Thai Address

First off, thank you for considering contributing to `thai-address`! It's people like you that make Open Source software such a great community to learn, inspire, and create.

## How to Contribute

The primary goal of this repository is to keep the Thai address database (`thailand-address-bilingual.json`) accurate and up-to-date. If you spot a typo, a missing subdistrict, or an incorrect zipcode, please help us fix it!

### 1. Fork the Repository

Click the "Fork" button at the top right of this repository to create your own copy. Clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/thai-address.git
cd thai-address
```

### 2. Make Your Changes

Open `thailand-address-bilingual.json` and make the necessary corrections or additions.

** Important Rules for the JSON file:**
- Every object must follow the strict abbreviation schema:
  - `p` = Province
  - `d` = District
  - `s` = Subdistrict
  - `n` = Name object `{ "th": "...", "en": "..." }`
  - `z` = Zipcode (String)
- Keep the structure clean and well-formatted.

### 3. Validate Your Changes

Before committing, you **MUST** run the validation script to ensure no data is broken:

```bash
npm run validate
# or
node scripts/validate.js
```

If the script outputs `✅ ข้อมูลถูกต้องพร้อมใช้งานครับ!`, your changes are good to go!
If it outputs an error (`❌ ตรวจพบข้อผิดพลาด`), please fix the issue before proceeding.

### 4. Commit and Push

Create a new branch for your changes:

```bash
git checkout -b fix/missing-subdistrict
```

Commit your changes with a clear message:

```bash
git commit -m "fix(data): add missing subdistrict X in district Y, province Z"
```

Push to your forked repository:

```bash
git push origin fix/missing-subdistrict
```

### 5. Open a Pull Request

Go back to the original `hudchew/thai-address` repository on GitHub. You should see a prompt to "Compare & pull request". Click it, provide a brief description of what you fixed or added, and submit the PR.

 Maintainer จะรีบเข้ามาตรวจและ merge ให้เร็วที่สุดครับ! 🚀

## Questions?

If you have any questions, feel free to open an issue before making a PR.
