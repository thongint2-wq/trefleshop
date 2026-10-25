# Trefle Plant Shop

เว็บค้นหาและศึกษาข้อมูลต้นไม้ที่ใช้ **React + Vite** เป็น Frontend, **Express** เป็น Backend และ **Trefle API** เป็นแหล่งข้อมูล ช่วยให้ผู้ใช้ค้นหาต้นไม้ ดูข้อมูลและแนวทางการดูแล บันทึกรายการโปรด และย้อนดูประวัติการเปิดรายละเอียดต้นไม้ได้

## 1. ฟีเจอร์หลัก

- ค้นหาต้นไม้จากชื่อ
- แสดงดอกไม้แนะนำ โดยจัดอันดับจากความครบถ้วนของข้อมูลการดูแล
- ดูรายละเอียดต้นไม้และข้อมูลการดูแล
- เรียงผลการค้นหาตามชื่อสามัญ A–Z ด้วย Insertion Sort
- เพิ่มและลบต้นไม้จากรายการโปรด
- ดูและล้างประวัติการเปิดดูต้นไม้
- แสดงสถานะ Loading, Empty, Error และผลลัพธ์สำเร็จในหน้าที่เกี่ยวข้อง

## 2. เทคโนโลยีและสถาปัตยกรรม

- **Frontend:** React, Vite, React Router, HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **External API:** Trefle API
- **Data storage:** รายการโปรดเก็บในหน่วยความจำของ Express; สถานะค้นหาและประวัติการดูเก็บใน `sessionStorage` ของเบราว์เซอร์

ภาพรวมการทำงาน: React เรียก Express ผ่าน endpoint `/api/...` แล้ว Express ติดต่อ Trefle API เพื่อซ่อน API token จากฝั่ง Frontend และจัดการการตอบกลับ/ข้อผิดพลาดก่อนส่งข้อมูลกลับ

## 3. การติดตั้งและรันโปรเจกต์

1. ติดตั้ง Node.js ที่รองรับเวอร์ชันของ dependencies ใน `package.json`
2. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

3. สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ แล้วกำหนด token:

   ```env
   TREFLE_TOKEN=ใส่_TREFLE_API_TOKEN_ของคุณ
   ```

4. รัน Frontend และ Express ในโหมดพัฒนา:

   ```bash
   npm run dev
   ```

5. สร้างไฟล์สำหรับ production:

   ```bash
   npm run build
   ```

6. รัน Express:

   ```bash
   npm start
   ```

> อย่า commit ไฟล์ `.env` หรือเปิดเผย `TREFLE_TOKEN` ในโค้ดสาธารณะ หาก deploy ให้ตั้งค่า token ใน Environment Variables ของแพลตฟอร์มก่อน

## 4. API Endpoints

| Method | Endpoint | หน้าที่ |
|---|---|---|
| GET | `/api/plants/search?q=rose` | ค้นหาต้นไม้จากคำค้น `q`; ถ้าไม่มีคำค้นจะตอบสถานะ 400 |
| GET | `/api/plants/recommendations` | ส่งรายการดอกไม้แนะนำ โดยรวบรวมข้อมูลจากหลายคำค้นและจัดอันดับความครบถ้วนของข้อมูลดูแล |
| GET | `/api/plants/:slug` | ดึงรายละเอียดต้นไม้จาก slug |
| GET | `/api/favorites` | ดึงรายการโปรดทั้งหมด |
| POST | `/api/favorites` | เพิ่มต้นไม้โปรด โดยตรวจสอบว่ามี `slug` ที่เป็นข้อความไม่ว่าง |
| GET | `/api/favorites/:slug` | ตรวจสอบว่าต้นไม้เป็นรายการโปรดหรือไม่ |
| DELETE | `/api/favorites/:slug` | ลบต้นไม้ออกจากรายการโปรด |
| GET | `/api/test` | ตรวจสอบว่า Express API ทำงานอยู่ |

**หมายเหตุเกี่ยวกับข้อมูล:** รายการแนะนำถูก cache ในหน่วยความจำเซิร์ฟเวอร์ 30 นาที ส่วนรายการโปรดเก็บในหน่วยความจำ จึงถูกล้างเมื่อเซิร์ฟเวอร์เริ่มใหม่ ประวัติการดูและสถานะค้นหาเก็บใน `sessionStorage` ของแท็บ/เซสชันเบราว์เซอร์

## 5. โครงสร้างไฟล์สำคัญ

```text
src/
  components/       ส่วนประกอบ UI ที่ใช้ร่วมกัน เช่น PlantCard, PlantCare, Feedback
  pages/            HomePage, FavoritesPage, HistoryPage, PlantDetailPage
  routes/            เส้นทาง API ของ Express
  services/          การเรียก Trefle API, API client และ favorite service
  utils/             Insertion Sort และฟังก์ชันจัดการ sessionStorage
  graph.js           adjacency list ของการเชื่อมโยงหน้าต่าง ๆ และ BFS
  index.js           จุดเริ่มต้น Express
  main.jsx           จุดเริ่มต้น React และ React Router
  styles.css         CSS ของเว็บไซต์
```

## 6. Graph.js: การเชื่อมโยงหน้าเว็บ

ไฟล์ `src/graph.js` เก็บกราฟแบบ **adjacency list** โดย node คือหน้าเว็บ และ edge คือการเชื่อมไปยังหน้าอื่น

| Node | URL | หน้าที่เชื่อมไปได้ตาม `pageGraph` |
|---|---|---|
| `home` | `/` | favorites, history, detail |
| `favorites` | `/favorites.html` | home, history, detail |
| `history` | `/history.html` | home, favorites, detail |
| `detail` | `/plantDetail.html` | home, history, favorites |

นอกจากนี้ `canReach(start, end)` ใช้ **Breadth-First Search (BFS)** ตรวจว่ามีเส้นทางจากหน้าเริ่มต้นไปหน้าปลายทางหรือไม่ และ `checkGraph()` ใช้ตรวจหน้าที่ไปไม่ถึงหรือไม่มีเส้นทางกลับหน้าแรก

**ข้อควรแก้ให้ตรงข้อกำหนด Graph ของใบงาน:** ปัจจุบัน `SiteHeader` ใน `src/components/SiteLayout.jsx` ยังเขียนลิงก์เมนูเป็น `Link` แบบตายตัว ไม่ได้สร้างรายการเมนูจาก `pageGraph` ดังนั้นต้องปรับโค้ดเมนูให้สร้างจากข้อมูล Graph ก่อนนำเสนอว่าเมนูเชื่อมกับ Graph แล้ว

## 7. DSA ที่ใช้กับข้อมูลจริง

| DSA | ไฟล์/จุดที่ใช้ | เหตุผลที่เลือก | Complexity |
|---|---|---|---|
| Insertion Sort | `src/utils/plantUtils.js`, เรียกใช้ใน `src/pages/HomePage.jsx` | เรียงผลการค้นหาตาม `common_name` ก่อนแสดงผล เพื่อให้ผู้ใช้ไล่ดูชื่อ A–Z ได้ง่าย | Best case: O(n); Average/Worst case: O(n²); ใช้พื้นที่เพิ่ม O(n) เพราะคัดลอก array ก่อนเรียง |
| Hash Table ผ่าน `Map` | `src/services/favoriteService.js` | ใช้ `slug` เป็น key เพื่อเพิ่ม ตรวจสอบ และลบรายการโปรดได้ตรงรายการ และไม่สร้าง key ซ้ำเมื่อบันทึก slug เดิม | `set/has/delete` เฉลี่ย O(1); พื้นที่ O(n) ตามจำนวนรายการโปรด |
| Graph + BFS | `src/graph.js` | ใช้แทนความสัมพันธ์ของหน้า และตรวจสอบการเข้าถึงหน้าด้วย BFS | BFS โดยทั่วไป O(V + E) โดย V คือจำนวนหน้าและ E คือจำนวนเส้นเชื่อม |

## 8. ตารางส่วนร่วมของสมาชิก

กรุณาตรวจสอบชื่อ รหัส และงานที่รับผิดชอบให้ตรงกับงานจริงและ commit history ของแต่ละคนก่อนส่ง

| ชื่อ-สกุล | รหัสนักศึกษา | ชิ้นงานที่รับผิดชอบ (ไฟล์ / component / route / DSA) | ช่วงที่นำเสนอในคลิป |
|---|---|---|---|
| นางสาวธัญญ์นรี ทองอินทร์ | 681310012 | UX/UI และการจัดหน้าเว็บ — โปรดตรวจสอบให้ตรงกับงาน/commit จริง | เติมเวลาในคลิป |
| นางสาววรินทร มาสาและ | 681310022 | DSA — โปรดตรวจสอบไฟล์และ commit ที่รับผิดชอบจริง | เติมเวลาในคลิป |
| นางสาวนัทชา กำไลแก้ว | 681310402 | Backend/API — โปรดตรวจสอบ route/service และ commit ที่รับผิดชอบจริง | เติมเวลาในคลิป |

## 9. ตารางข้อแนะนำจากงานแรก → สิ่งที่แก้

| ข้อแนะนำจากงานแรก | สิ่งที่แก้ในงานนี้ | หลักฐาน Before / After |
|---|---|---|
| “อยากให้มีข้อมูลรายละเอียดมากกว่านี้” | เพิ่มหน้า Plant Detail และส่วนข้อมูลการดูแลต้นไม้ใน `PlantDetail.jsx` และ `PlantCare.jsx` | **ต้องแนบภาพจริง** หน้าเดิมจากงานแรกและหน้ารายละเอียดเวอร์ชันปัจจุบัน |
| “แต่งหน้าเว็บให้ดีขึ้น” | ปรับ layout, hero, การ์ดต้นไม้ และรูปแบบการแสดงข้อมูลใน React/CSS | **ต้องแนบภาพจริง** หน้าเว็บก่อนปรับและหลังปรับ |
| “การกดถูกใจยัง basic ไป” | เพิ่มสถานะรายการโปรดบนการ์ด/หน้ารายละเอียด พร้อมเพิ่มและลบผ่าน Express API | **ต้องแนบภาพจริง** ขั้นตอนก่อนและหลัง หรือภาพการใช้งานเพิ่ม/ลบรายการโปรด |
| เพิ่มประสบการณ์การใช้งาน | เพิ่มหน้า Viewing History และปุ่ม Clear History เพื่อย้อนดูต้นไม้ที่เปิดล่าสุด | **แนบภาพจริง** หน้าประวัติการดูและตัวอย่างการล้างประวัติ |

> ใบงานกำหนดให้แสดง Before → After ด้วยภาพจริงทั้งสองเวอร์ชัน ตารางข้อความนี้เป็นคำอธิบายประกอบเท่านั้น ไม่ทดแทนภาพหลักฐาน

## 10. ตาราง useState

ตารางนี้สรุป state ที่พบใน React components ปัจจุบัน เหตุผลที่ใช้ state คือค่าเหล่านี้เปลี่ยนระหว่างการใช้งานและมีผลต่อสิ่งที่แสดงบนหน้าจอ ส่วนค่าที่คำนวณจาก props/state อื่นไม่จำเป็นต้องเก็บซ้ำเป็น state

| ชื่อ state | เก็บข้อมูลอะไร | อยู่ใน component | เปลี่ยนค่าเมื่อใด / โดยใคร | ทำไมต้องเป็น state |
|---|---|---|---|---|
| `query` | คำค้นต้นไม้ | `HomePage` | ผู้ใช้พิมพ์ผ่าน `HomeHero` และ `onQueryChange` | ให้ช่องค้นหาแสดงค่าล่าสุด |
| `searchViewActive` | เปิดโหมดแสดงผลค้นหาหรือไม่ | `HomePage` | เมื่อเริ่มค้นหา ล้างคำค้น หรือกู้คืนคำค้นเดิม | ควบคุมว่าจะแสดงส่วนแนะนำหรือผลค้นหา |
| `plants` | ผลการค้นหาหรือ `null` ก่อนค้นหา | `HomePage` | เมื่อ API ตอบกลับ ค้นหาล้มเหลว หรือล้างการค้นหา | ใช้แสดงผลลัพธ์และสถานะว่าง |
| `selectedSlug` | slug ของต้นไม้ที่เลือก | `HomePage` | เมื่อเปิดรายละเอียดหรือเริ่มค้นหาใหม่ | แสดงว่าการ์ดใดถูกเลือก |
| `searchLoading` | กำลังค้นหาหรือไม่ | `HomePage` | ก่อน/หลังคำขอค้นหา | แสดง Loading ระหว่างรอ API |
| `searchError` | การค้นหาผิดพลาดหรือไม่ | `HomePage` | เมื่อคำขอล้มเหลว หรือเริ่มค้นหาใหม่ | แสดงข้อความ Error ที่เหมาะสม |
| `recommendations` | รายการต้นไม้แนะนำ | `HomePage` | หลัง API คำแนะนำสำเร็จ | แสดงรายการแนะนำที่โหลดจาก Express |
| `recommendationsLoading` | กำลังโหลดคำแนะนำหรือไม่ | `HomePage` | เริ่มต้นเป็น true และเปลี่ยนหลัง API เสร็จ | แสดง Loading ของส่วนแนะนำ |
| `recommendationsError` | คำขอคำแนะนำผิดพลาดหรือไม่ | `HomePage` | เมื่อ API ล้มเหลว | แสดง Error ของส่วนแนะนำ |
| `plants` | รายการโปรด | `FavoritesPage` | หลังโหลด API และเมื่อลบรายการจากการ์ด | อัปเดตรายการที่เห็นโดยไม่โหลดทั้งหน้า |
| `loading` | กำลังโหลดรายการโปรดหรือไม่ | `FavoritesPage` | ระหว่างเรียก API รายการโปรด | แสดง Loading |
| `error` | โหลดรายการโปรดผิดพลาดหรือไม่ | `FavoritesPage` | เมื่อคำขอล้มเหลว | แสดง Error |
| `plants` | ประวัติการเปิดดู | `HistoryPage` | เริ่มจาก sessionStorage และเปลี่ยนเมื่อกด Clear History | แสดงประวัติล่าสุดและผลหลังล้าง |
| `plant` | รายละเอียดต้นไม้ที่โหลดแล้ว | `PlantDetailPage` | เมื่อ slug เปลี่ยนและ API ตอบกลับ | แสดงข้อมูลต้นไม้ที่ตรงกับ URL |
| `loading` | กำลังโหลดรายละเอียดหรือไม่ | `PlantDetailPage` | ก่อน/หลังเรียก API รายละเอียด | แสดง Loading |
| `error` | โหลดรายละเอียดผิดพลาดหรือไม่ | `PlantDetailPage` | เมื่อไม่มี slug หรือ API ล้มเหลว | แสดง Error แทนรายละเอียดที่ไม่มี |
| `favorite` | สถานะรายการโปรดของต้นไม้ | `PlantCard` | หลังตรวจสอบ API และเมื่อเพิ่ม/ลบรายการ | เปลี่ยนป้ายและปุ่ม Save/Remove ตามข้อมูลจริง |
| `saving` | กำลังบันทึกหรือลบรายการโปรดหรือไม่ | `PlantCard` | ระหว่าง POST/DELETE | ป้องกันการกดซ้ำและแสดงข้อความกำลังทำงาน |
| `imageFailed` | รูปภาพการ์ดโหลดไม่สำเร็จหรือไม่ | `PlantCard` | เมื่อรูปเกิด `onError` | ซ่อนรูปที่โหลดไม่ได้ |
| `favoriteError` | ข้อความข้อผิดพลาดการตรวจสอบรายการโปรด | `PlantCard` | เมื่อ API ตรวจสอบสถานะล้มเหลว | แสดง feedback และป้องกันการกดปุ่มที่สถานะไม่แน่นอน |
| `favorite` | สถานะรายการโปรดในหน้ารายละเอียด | `PlantDetail` | หลังตรวจสอบ API และเมื่อเพิ่ม/ลบ | อัปเดตปุ่มรายการโปรด |
| `saving` | กำลังเพิ่มหรือลบรายการโปรดหรือไม่ | `PlantDetail` | ระหว่าง POST/DELETE | แสดงสถานะระหว่างบันทึกและป้องกันการกดซ้ำ |
| `favoriteError` | การตรวจสอบสถานะรายการโปรดผิดพลาดหรือไม่ | `PlantDetail` | เมื่อ API ตรวจสอบสถานะล้มเหลว | แสดงข้อความแจ้งผู้ใช้ |

## 11. ตาราง useEffect

| Component | Effect ทำอะไร | Dependency array | ทำงานตอนไหน |
|---|---|---|---|
| `HomePage` | ตั้งชื่อแท็บและเรียก API โหลดรายการแนะนำ; ใช้ cleanup flag ป้องกัน setState หลังออกจากหน้า | `[]` | เมื่อ component mount; cleanup ตอน unmount |
| `FavoritesPage` | ตั้งชื่อแท็บและโหลดรายการโปรดจาก Express พร้อมจัดการ loading/error | `[]` | เมื่อ mount; cleanup ตอน unmount |
| `HistoryPage` | ตั้งชื่อแท็บของหน้าประวัติ | `[]` | เมื่อ mount |
| `PlantDetailPage` | ตั้งชื่อแท็บ โหลดรายละเอียดตาม slug และบันทึกประวัติเมื่อโหลดสำเร็จ | `[slug]` | เมื่อ mount และเมื่อค่า slug เปลี่ยน; cleanup ป้องกันอัปเดต state ของคำขอเก่า |
| `PlantCard` | ตรวจสอบสถานะรายการโปรดของต้นไม้ ยกเว้นการ์ดที่อยู่ในหน้ารายการโปรด | `[plant.slug, Boolean(onRemove)]` | เมื่อ slug เปลี่ยนหรือเปลี่ยนโหมดการ์ด |
| `PlantDetail` | ตรวจสอบสถานะรายการโปรดของต้นไม้ในหน้ารายละเอียด | `[plant.slug]` | เมื่อ slug ของต้นไม้เปลี่ยน |

การกำหนด dependency ให้ตรงกับค่าที่ effect ใช้ ช่วยให้โหลดข้อมูลเมื่อจำเป็นเท่านั้น ส่วน cleanup flag ช่วยไม่ให้อัปเดต state หลัง component ถูกถอดออกจากหน้า

## 12. Component และ Props

ตัวอย่างทิศทางการส่ง props และ callback ในหน้าแรก:

```text
HomePage (ถือ state และจัดการค้นหา)
├── HomeHero
│   ├── query
│   ├── searchViewActive
│   ├── onQueryChange
│   ├── onSearch
│   └── onClearSearch
├── RecommendationsSection
│   ├── plants
│   ├── loading
│   └── error
└── PlantSearchSection
    ├── plants
    ├── loading
    ├── error
    ├── selectedSlug
    ├── query
    └── onOpenDetails
        └── PlantCard
            └── plant, selected, onOpenDetails
```

- `HomePage` ถือ state การค้นหา เพราะข้อมูลเหล่านี้ใช้ควบคุมหลายส่วนของหน้า
- `HomeHero` รับ `query` และ callback สำหรับแจ้งการพิมพ์ ค้นหา และล้างคำค้น
- `PlantSearchSection` รับผลค้นหาและสถานะ แล้วเลือกแสดง Loading, Error, Empty หรือรายการการ์ด
- `PlantCard` รับข้อมูลต้นไม้ผ่าน `plant` และเรียก `onOpenDetails` เมื่อผู้ใช้เปิดรายละเอียด

## 13. รายการตรวจสอบก่อนส่ง

- [ ] ใส่ภาพ Before และ After จริงจากงานแรกและงานปัจจุบัน
- [ ] ตรวจสอบชื่อ รหัสนักศึกษา งานที่รับผิดชอบ และช่วงเวลานำเสนอให้ตรงกับ commit history
- [ ] ปรับ `SiteHeader` ให้สร้างเมนูจาก `pageGraph` ตามข้อกำหนด Graph.js ของใบงาน
- [ ] ทดลองให้ครบทั้ง loading, empty, error และ success รวมถึงกรณี API error
- [ ] ตรวจสอบว่า README และคลิปอธิบาย state, effect, props/callback, Graph และ Big-O จากโค้ดจริง
