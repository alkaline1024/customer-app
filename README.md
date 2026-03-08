# Customer App (React Native)

[TH](#-thai) | [EN](#-english)

---

## Thai

โปรเจกต์นี้เป็น take-home assignment สำหรับจัดการข้อมูลลูกค้าแบบง่ายๆ
มี flow หลักคือ list, search, pagination, ดูรายละเอียด, แก้ไขข้อมูล, และ activate/deactivate

### วิธีรันโปรเจกต์

1. ติดตั้งแพ็กเกจ

```sh
npm install
```

2. เปิด Metro

```sh
npm start
```

3. รันแอป

Android:

```sh
npm run android
```

iOS:

```sh
npm run ios
```

4. รันเทสต์

```sh
npm test
```

### โครงสร้างโปรเจกต์

- `src/screens/` หน้าจอหลัก เช่น list/detail/edit
- `src/components/` UI component ย่อย เช่น `CustomerListItem`, `CustomerListSkeleton`
- `src/context/CustomersContext.tsx` context provider และ hook (`useCustomers`)
- `src/context/customersStore.ts` state/reducer/action types ของลูกค้า
- `src/context/useCustomersActions.ts` async actions เช่น load/search/loadMore/edit/toggle
- `src/services/customerService.ts` mock API (fetch/search/pagination/update/status)
- `src/data/mockCustomers.ts` ข้อมูล mock
- `src/themes/` design tokens และ theme กลาง
- `__tests__/` unit tests

### การตัดสินใจทางเทคนิคที่สำคัญ

- ใช้ `Context + useReducer` เพื่อให้ state flow ชัดและอธิบายง่าย
- ใช้ mock service แยกจาก UI เพื่อจำลอง async จริง (loading/error)
- ใช้ API เดียว (`fetchCustomers`) รองรับทั้ง `search` และ `pagination`
- search มี debounce และโหลดต่อ (load more) ได้ในโหมดค้นหา
- ใช้ design tokens รวมศูนย์ใน `src/themes` เพื่อคุม style ง่าย
- ฟอร์มแก้ไขลูกค้าใช้ `react-hook-form + zod` เพื่อให้ validation อ่านง่าย

### ข้อสมมติและ trade-offs

- ตอนนี้ข้อมูลเป็น in-memory mock เท่านั้น (ยังไม่ต่อ backend จริง)
- `customerService` จำลอง network delay เพื่อให้เห็น loading state
- เน้นโค้ดอ่านง่ายก่อน optimization เชิงลึก
- ยังไม่ได้แยก error state ละเอียดทุก action เป็นรายจุด

### ถ้ามีเวลาเพิ่ม จะพัฒนาอะไรต่อ

- เพิ่ม request cancel/guard ให้ครบทุก async action
- แยก error state ต่อ action ให้ละเอียดขึ้น (load/search/edit/toggle)
- เพิ่ม empty states และ retry UX ให้ครบทุกกรณี
- เชื่อม backend จริง และจัดการ caching

### หมายเหตุ

- โปรเจกต์นี้เน้นทำให้เข้าใจง่าย อธิบายง่าย ตามแนว take-home 4-6 ชั่วโมง

---

## English

This project is a simple take-home assignment for customer management.
Main flows are list, search, pagination, detail, edit, and activate/deactivate.

### How to run the project

1. Install dependencies

```sh
npm install
```

2. Start Metro

```sh
npm start
```

3. Run the app

Android:

```sh
npm run android
```

iOS:

```sh
npm run ios
```

4. Run tests

```sh
npm test
```

### Project structure overview

- `src/screens/` main screens like list/detail/edit
- `src/components/` reusable UI components such as `CustomerListItem`, `CustomerListSkeleton`
- `src/context/CustomersContext.tsx` context provider and `useCustomers` hook
- `src/context/customersStore.ts` customer state/reducer/action types
- `src/context/useCustomersActions.ts` async actions (load/search/loadMore/edit/toggle)
- `src/services/customerService.ts` mock API (fetch/search/pagination/update/status)
- `src/data/mockCustomers.ts` mock data source
- `src/themes/` design tokens and shared theme
- `__tests__/` unit tests

### Key technical decisions

- Use `Context + useReducer` for clear, interview-friendly state flow
- Keep async logic in mock service and state layer, not in UI
- Use one API (`fetchCustomers`) for both search and pagination
- Add debounced search and load-more pagination for search mode
- Use centralized design tokens from `src/themes`
- Use `react-hook-form + zod` for readable and predictable form validation

### Assumptions and trade-offs

- Data is in-memory mock only (no real backend yet)
- `customerService` simulates network delay for loading/error states
- Prioritized readability over deep optimization
- Error states are not fully separated by every action yet

### What I would improve with more time

- Add request cancellation/guard for all async actions
- Separate error states more clearly per action (load/search/edit/toggle)
- Improve empty/error/retry UX for each case
- Connect to real backend and add caching strategy

### Note

- This project is intentionally kept simple and easy to explain for a 4-6 hour take-home scope.
