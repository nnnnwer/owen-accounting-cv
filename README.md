# Owen Thilakoun — เว็บไซต์ CV และ Portfolio ด้านบัญชี

เว็บไซต์แบบ frontend อย่างเดียว (React + Vite + Tailwind CSS + React Router) มี 5 หน้า รองรับภาษาลาว (ภาษาหลัก) และภาษาอังกฤษ และมี **หน้าแสดงผลงาน Excel หน้าตาเหมือน Microsoft Excel** ที่ทำงานในเบราว์เซอร์ทั้งหมด ไม่มี backend ไม่มีฐานข้อมูล

| หน้า | URL | เนื้อหา |
|---|---|---|
| Home | `/` | แนะนำตัว รูปโปรไฟล์ (หรืออักษรย่อ) อายุคำนวณอัตโนมัติ เป้าหมายอาชีพ ทักษะหลัก ลิงก์ติดต่อ |
| About / Resume | `/resume` | การศึกษา ประสบการณ์ ใบรับรอง ทักษะ แผนพัฒนาตนเอง ปุ่มพิมพ์ / บันทึกเป็น PDF |
| Accounting Portfolio | `/portfolio` | โปรเจกต์รายงานการเงิน สเปรดชีต การวิเคราะห์ข้อมูล (ตัวอย่างมีป้าย "ข้อมูลสมมุติ") |
| Excel Work | `/dashboard` | แสดงเฉพาะไฟล์ Excel ของคุณ เหมือนเปิดใน Excel (แถบชีต, ช่องสูตร fx, A B C / 1 2 3) — ผู้เยี่ยมชมดู/ดาวน์โหลดได้ แต่อัปโหลดไม่ได้ |
| Contact | `/contact` | ช่องทางติดต่อ + ฟอร์มที่เปิดแอปอีเมลของผู้ส่ง (mailto) |

---

## 1. ติดตั้งและรันบนเครื่อง

ต้องใช้ **Node.js 20.19 ขึ้นไป** (แนะนำ Node 22 LTS) ดาวน์โหลดได้ที่ https://nodejs.org

```bash
cd owen-accounting-cv
npm install          # ติดตั้ง dependencies (ครั้งแรกครั้งเดียว)
npm run dev          # เปิดโหมดพัฒนา → http://localhost:5173
```

คำสั่ง build สำหรับ production (คำสั่งที่ Vercel/Netlify ใช้):

```bash
npm run build        # ได้ไฟล์เว็บในโฟลเดอร์ dist/
npm run preview      # ดูผลลัพธ์ build จริงที่ http://localhost:4173
```

> หมายเหตุ: SheetJS ติดตั้งจาก CDN ทางการของ SheetJS (`https://cdn.sheetjs.com/...`) ตามที่ SheetJS แนะนำ เพราะเวอร์ชันใน npm registry (0.18.5) เก่าและมีช่องโหว่ที่รู้กันอยู่แล้ว

---

## 2. แก้ไขข้อมูลส่วนตัว (ไฟล์เดียวจบ)

| ต้องการแก้ | ไฟล์ |
|---|---|
| ชื่อ, วันเกิด, ที่อยู่, เป้าหมายอาชีพ, **ข้อมูลติดต่อ**, การศึกษา, ประสบการณ์, ใบรับรอง, ทักษะ | `src/data/profile.js` |
| โปรเจกต์ใน Portfolio | `src/data/portfolio.js` |
| ข้อความเมนู/ปุ่มทั้งหมด (ลาว/อังกฤษ) | `src/i18n/translations.js` |
| **ไฟล์ Excel ที่จะโชว์ในหน้า Excel Work** | `public/excel/` + `src/data/excelShowcase.js` |
| ข้อมูลสมมุติของโปรเจกต์ตัวอย่างใน Portfolio | `src/data/demoData.js` |
| สีของเว็บไซต์ | `src/index.css` (ส่วน `@theme`) |

**สิ่งที่ต้องทำก่อนเผยแพร่**

1. **ใส่ข้อมูลติดต่อ** ใน `profile.js` → `contacts` (ตอนนี้ว่างไว้ เพราะไม่ได้รับภาพ CV) ช่องที่ว่างจะถูกซ่อนอัตโนมัติ
   ```js
   contacts: {
     email: 'your.name@example.com',
     phone: '+856 20 xxxx xxxx',
     whatsapp: '856201234567',          // ตัวเลขล้วน มีรหัสประเทศ
     linkedin: 'https://www.linkedin.com/in/your-name',
     facebook: '',
   },
   ```
2. **ตรวจสอบข้อมูลการศึกษา** (ชื่อปริญญา คณะ ปี 2022–2026) ใน `profile.js` → `education`
3. **ตรวจตัวสะกดภาษาลาว** โดยเฉพาะชื่อบ้าน/เมือง (`ບ້ານໂຊກຄຳ, ເມືອງໄຊເສດຖາ`) และข้อความทั้งหมดใน `translations.js` — แนะนำให้เจ้าของภาษาลาวอ่านทวนหนึ่งรอบ
4. **รูปโปรไฟล์**: วางไฟล์สี่เหลี่ยมจัตุรัสที่ `public/images/profile.webp` (ประมาณ 400×400 px, ไม่เกิน 60 KB — แปลงเป็น WebP ได้ที่ https://squoosh.app) แล้วตั้ง `photo: '/images/profile.webp'` ถ้าไม่ใส่จะแสดงอักษรย่อ "OT"
5. เพิ่มประสบการณ์/ใบรับรอง **เฉพาะที่มีจริง** (มีตัวอย่างรูปแบบอยู่ในคอมเมนต์ของไฟล์)

หลักความซื่อตรงที่ใช้ในเว็บ: ไม่มีการอ้างว่ามีปริญญาบัญชี ใบรับรอง หรือประสบการณ์งานบัญชี ทักษะไม่มีการให้คะแนน/เปอร์เซ็นต์ โปรเจกต์ตัวอย่างทุกชิ้นมีป้าย "Sample · fictional data" และตัวเลขทั้งหมดเป็นของบริษัทสมมุติ "Demo Telecom Co. (fictional)"

---

## 3. หน้า Excel Work — วิธีเอาผลงาน Excel ของคุณขึ้นโชว์

หน้านี้แสดงไฟล์ Excel ให้หน้าตาเหมือนเปิดใน Microsoft Excel: ช่องชื่อเซลล์ + ช่องสูตร **fx**, หัวคอลัมน์ A B C, เลขแถว, เส้นตาราง, ความกว้างคอลัมน์และเซลล์ที่ผสาน (merge) ตามไฟล์จริง, รูปแบบตัวเลขเหมือนใน Excel (`1,234,567`, `35.0%`, `01/01/2025`), ข้อความยาวล้นไปยังเซลล์ว่างข้าง ๆ, แถบชีตด้านล่าง, ปุ่มซูม และเลื่อนเซลล์ด้วยปุ่มลูกศรได้ **คลิกเซลล์ไหนก็จะเห็นสูตรในช่อง fx** (เช่น `=SUM(B6:B8)`) ซึ่งช่วยให้ผู้ว่าจ้างเห็นว่าคุณใช้สูตรอะไรบ้าง

**เพิ่มไฟล์ของคุณ (3 ขั้นตอน)**

1. บันทึกไฟล์ใน Excel ให้เรียบร้อย (กด Save ใน Excel เพื่อให้ผลลัพธ์ของสูตรถูกเก็บไว้ในไฟล์) แล้วคัดลอกไปไว้ที่ `public/excel/` ตั้งชื่อไฟล์เป็นภาษาอังกฤษ ไม่มีเว้นวรรค เช่น `public/excel/monthly-expenses.xlsx`
2. เปิด `src/data/excelShowcase.js` แล้วเพิ่มรายการ (ไฟล์แรกในรายการจะเปิดขึ้นมาอัตโนมัติ):
   ```js
   {
     id: 'monthly-expenses',
     file: '/excel/monthly-expenses.xlsx',
     title: { en: 'Monthly expense tracker', lo: 'ຕາຕະລາງຕິດຕາມລາຍຈ່າຍປະຈຳເດືອນ' },
     description: { en: 'What this file shows…', lo: '…' },
     isSample: false,       // false = ป้าย "My work"
     allowDownload: true,   // true = มีปุ่มดาวน์โหลดไฟล์ต้นฉบับ
   },
   ```
3. ลบรายการตัวอย่าง `sample-financial-report` ออก (และลบไฟล์ `public/excel/sample-financial-report.xlsx`) ถ้าไม่ต้องการแล้ว จากนั้น push ขึ้น GitHub → Vercel จะอัปเดตเว็บให้เอง

ถ้ามีหลายไฟล์ ด้านบนตารางจะมีปุ่มให้เลือกไฟล์

> ⚠️ ไฟล์ใน `public/` เป็นไฟล์สาธารณะ ใครก็เปิดหรือดาวน์โหลดได้ **ลบข้อมูลส่วนตัวหรือข้อมูลลับของบริษัทออกก่อน** (ชื่อคน เงินเดือน เลขบัญชี ฯลฯ) — ถ้าเป็นงานจากที่ฝึกงาน ควรขออนุญาตหรือเปลี่ยนตัวเลขเป็นตัวเลขสมมุติก่อน

หน้านี้**แสดงเฉพาะไฟล์ที่คุณใส่ไว้**ใน `excelShowcase.js` เท่านั้น ผู้เยี่ยมชมดูได้ (และดาวน์โหลดได้ถ้าตั้ง `allowDownload: true`) แต่อัปโหลดไฟล์ของตัวเองไม่ได้

**ข้อจำกัดที่ควรรู้**
- **สี ตัวหนา และเส้นขอบจากไฟล์จะไม่แสดง** เพราะ SheetJS รุ่นฟรีไม่อ่านค่าสไตล์เหล่านี้ (ส่วนข้อมูล สูตร ความกว้างคอลัมน์ merge และรูปแบบตัวเลขแสดงครบ) กราฟและรูปภาพในไฟล์ก็ไม่แสดงเช่นกัน
- แสดงได้สูงสุด 1,000 แถว × 100 คอลัมน์ต่อชีต (แสดงทีละ 200 แถวเพื่อให้มือถือไม่ช้า)
- ไม่รันสูตรหรือมาโคร ค่าที่เห็นคือผลลัพธ์ที่ Excel บันทึกไว้ในไฟล์ ไม่รับไฟล์ `.xlsm` ชีตที่ซ่อนไว้จะไม่แสดงเหมือนใน Excel

**ความปลอดภัย**: ข้อความในเซลล์แสดงเป็นตัวอักษรธรรมดาเสมอ (ทดสอบแล้วด้วยเซลล์ `<img src=x onerror=alert(1)>` → ไม่ถูกรัน), ตรวจ "magic bytes" ก่อนอ่าน (ถ้าพิมพ์ชื่อไฟล์ใน `excelShowcase.js` ผิด หน้าเว็บจะแจ้งว่า "หาไฟล์ไม่พบ") และ SheetJS ถูกโหลดเฉพาะตอนเปิดหน้านี้เท่านั้น หน้าอื่นจึงยังเบา

## 4. Deploy ขึ้น Vercel (แนะนำ)

ไฟล์ตั้งค่าพร้อมแล้ว: `vercel.json` (SPA rewrite ให้ทุก URL รีเฟรชได้, security headers, cache)

**วิธีที่ 1 — ผ่าน GitHub (อัปเดตอัตโนมัติทุกครั้งที่ push)**

1. สร้าง repository ใหม่บน https://github.com (เลือก Public หรือ Private ก็ได้)
2. ในโฟลเดอร์โปรเจกต์:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<username>/owen-accounting-cv.git
   git push -u origin main
   ```
3. เข้า https://vercel.com → Sign up ด้วยบัญชี GitHub → **Add New… → Project** → เลือก repo นี้ → **Import**
4. Vercel จะตรวจเจอ Vite เอง ตรวจว่า:
   - Framework Preset: **Vite**
   - Build Command: **`npm run build`**
   - Output Directory: **`dist`**
5. กด **Deploy** รอประมาณ 1–2 นาที จะได้ URL สาธารณะแบบ `https://owen-accounting-cv.vercel.app` (HTTPS อัตโนมัติ ไม่ต้องล็อกอินก็เข้าได้)
6. ตรวจว่า **Settings → Deployment Protection → Vercel Authentication** ปิดอยู่สำหรับ Production (ถ้าเปิด คนอื่นจะต้องล็อกอินก่อนเข้า)

**วิธีที่ 2 — ใช้คำสั่ง (ไม่ต้องใช้ GitHub)**

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 5. Deploy ขึ้น Netlify (ทางเลือก)

ไฟล์ตั้งค่าพร้อมแล้ว: `netlify.toml` และ `public/_redirects`

1. เข้า https://app.netlify.com → **Add new site → Import an existing project** → เลือก GitHub repo
2. Build command: **`npm run build`** · Publish directory: **`dist`** (อ่านจาก netlify.toml อัตโนมัติ)
3. กด **Deploy** → ได้ URL แบบ `https://<ชื่อ>.netlify.app`

หรือแบบลากวาง: รัน `npm run build` แล้วลากโฟลเดอร์ `dist` ไปวางที่ https://app.netlify.com/drop

## 6. ใช้โดเมนของตัวเอง (ถ้ามี)

- Vercel: **Project → Settings → Domains → Add** แล้วตั้ง DNS ตามที่ Vercel บอก (ปกติคือ `A` record ชี้ไป IP ของ Vercel สำหรับโดเมนหลัก และ `CNAME` ชี้ไป `cname.vercel-dns.com` สำหรับ `www`)
- Netlify: **Site configuration → Domain management → Add a domain**
- ใบรับรอง HTTPS ออกให้อัตโนมัติ (ภายในไม่กี่นาทีถึงไม่กี่ชั่วโมงหลัง DNS อัปเดต)
- หลังได้โดเมนแล้ว แนะนำเพิ่ม `Sitemap: https://<โดเมน>/sitemap.xml` ใน `public/robots.txt` และสร้าง `public/sitemap.xml` ที่มี 5 URL

---

## 7. ทดสอบการเข้าถึงผ่าน Lao Telecom (LTC)

ผมยังไม่ได้ทดสอบบนเครือข่าย Lao Telecom จริง (ทำได้หลัง deploy เท่านั้น) จึงไม่สามารถยืนยันได้ว่าเข้าได้ทุกเครือข่าย — ให้ทดสอบดังนี้:

1. **มือถือ + ข้อมูลมือถือ LTC**: ปิด Wi-Fi เปิด URL ใน Chrome และ Safari/เบราว์เซอร์อื่น ตรวจ: หน้าแรกขึ้น, กดทุกเมนู, รีเฟรชหน้า `/dashboard`, เปิดลิงก์ `/resume` ตรง ๆ, ไฟล์ Excel ของคุณแสดงในหน้า Excel Work
2. **Wi-Fi / Fiber ของ LTC** ทำซ้ำแบบเดียวกันบนคอมพิวเตอร์และมือถือ
3. **ทดสอบเครือข่ายอื่นเทียบ** (เช่น Unitel, ETL หรือ TPLUS) ถ้าเข้าได้ที่หนึ่งแต่อีกที่ไม่ได้ แสดงว่าปัญหาอยู่ที่เครือข่าย ไม่ใช่ที่เว็บ
4. **ความเร็ว**: เปิด https://pagespeed.web.dev ใส่ URL ดูคะแนนมือถือ หรือใน Chrome DevTools → Network → เลือก "Slow 4G" แล้วโหลดหน้าใหม่
5. ส่งลิงก์ให้เพื่อน 2–3 คนที่ใช้เครือข่ายต่างกันลองเปิด

### ถ้าเข้าไม่ได้ในบางเครือข่าย — วิธีไล่ปัญหา

| อาการ | สาเหตุที่น่าจะเป็น | วิธีตรวจ / แก้ |
|---|---|---|
| "This site can't be reached" / `DNS_PROBE_FINISHED_NXDOMAIN` | DNS ของผู้ให้บริการหาโดเมนไม่เจอ | ลองเปลี่ยน DNS ของเครื่องเป็น `1.1.1.1` หรือ `8.8.8.8`; ตรวจโดเมนที่ https://dnschecker.org ว่ากระจายครบทุกประเทศหรือยัง (โดเมนใหม่รอได้ถึง 24–48 ชม.) |
| ขึ้นเตือนใบรับรอง / `NET::ERR_CERT_...` | HTTPS ยังออกไม่เสร็จ หรือเวลาในเครื่องผิด | ดูสถานะใบรับรองใน Vercel/Netlify Domains; ตรวจวันที่-เวลาในมือถือ; ทดสอบที่ https://www.ssllabs.com/ssltest |
| โหลดค้าง / timeout เฉพาะบางเครือข่าย | routing ไปยัง CDN มีปัญหา หรือถูกกรอง | ทดสอบ `ping` และ `tracert <โดเมน>` (Windows) / `traceroute` (Mac) จากเครือข่ายนั้น; ลองเปิด URL `*.vercel.app` เทียบกับโดเมนของตัวเอง; ลองเปิดผ่าน VPN — ถ้า VPN เข้าได้แสดงว่าเครือข่ายกรอง |
| เปิดได้แต่ตัวหนังสือลาวเป็นกล่อง/ฟอนต์ต่าง | โหลด Google Fonts ไม่ได้ | เว็บยังใช้งานได้ (มีฟอนต์สำรอง) ถ้าต้องการ self-host ฟอนต์ ให้ติดตั้ง `@fontsource/noto-sans-lao` แล้ว import ใน `main.jsx` และลบลิงก์ Google Fonts ใน `index.html` |
| หน้าหลักเข้าได้ แต่รีเฟรช `/dashboard` แล้วขึ้น 404 | ไม่ได้ใช้ไฟล์ตั้งค่า SPA | ตรวจว่า `vercel.json` หรือ `netlify.toml`/`_redirects` อยู่ใน repo |
| เข้าไม่ได้ทั้งหมดจากเครือข่ายหนึ่ง | ผู้ให้บริการบล็อก | ติดต่อฝ่ายบริการลูกค้าของ Lao Telecom พร้อมแจ้ง URL, เวลา, ข้อความ error และผล traceroute |

---

## 8. โครงสร้างโปรเจกต์

```
owen-accounting-cv/
├── index.html                 # meta SEO / Open Graph / ฟอนต์
├── package.json               # dependencies และคำสั่ง npm
├── vite.config.js
├── vercel.json                # Vercel: SPA rewrite + security headers
├── netlify.toml               # Netlify: build + SPA redirect + headers
├── public/                    # favicon, robots.txt, _redirects, images/, excel/ (ไฟล์ผลงาน)
└── src/
    ├── main.jsx, App.jsx      # จุดเริ่มต้น + เส้นทาง (React Router)
    ├── index.css              # Tailwind + สี/ธีม
    ├── data/                  # ★ ข้อมูลที่แก้ไขได้: profile, portfolio, excelShowcase, demoData
    ├── i18n/                  # ระบบสองภาษา + ข้อความ UI
    ├── components/            # layout (sidebar, เมนูมือถือ) + UI ที่ใช้ซ้ำ
    ├── pages/                 # 5 หน้า + 404
    ├── utils/                 # คำนวณอายุ, จัดรูปแบบตัวเลข, title ของหน้า
    └── features/
        ├── excel-viewer/          # หน้า Excel Work
        │   ├── excelWorker.js     # SheetJS ใน Web Worker (อ่านไฟล์ ไม่รันสูตร)
        │   ├── excelClient.js     # ตรวจไฟล์ + สื่อสารกับ worker
        │   ├── useExcelViewer.js  # state ของหน้า
        │   └── ExcelGrid.jsx      # ตารางหน้าตาแบบ Excel
        └── reports/               # คำนวณรายงานตัวอย่างในหน้า Portfolio
```
