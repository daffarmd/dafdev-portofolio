---
title: "Setup Jest pada Project Node.js dengan TypeScript"
slug: "setup-jest-pada-project-node-js-dengan-typescript"
date: "2026-04-02"
readTime: "8 min read"
category: "Testing"
author: "Muhammad Daffa Ramadhan"
status: "draft"
coverImage: ""
coverImageAlt: ""
tags:
  - "Jest"
  - "Node.js"
  - "TypeScript"
  - "Babel"
  - "Unit Testing"
---

# Setup Jest pada Project Node.js dengan TypeScript

Dalam pengembangan aplikasi, testing penting untuk memastikan kode berjalan sesuai harapan. Salah satu tools yang sering digunakan untuk testing di JavaScript dan TypeScript adalah **Jest**.

Pada artikel ini, kita akan membahas cara setup **Jest** pada project **Node.js + TypeScript**, mulai dari instalasi dependency, konfigurasi Babel, konfigurasi TypeScript, sampai membuat unit test sederhana.

---

## Kenapa setup Node.js dulu, baru TypeScript?

Sebelum menggunakan TypeScript, project biasanya disiapkan dulu sebagai project **Node.js**. Alasannya, TypeScript berjalan di atas ekosistem JavaScript dan Node.js. Jadi dependency, struktur project, dan konfigurasi dasar Node.js sebaiknya sudah siap terlebih dahulu, baru kemudian ditambahkan TypeScript.

---

## 1. Install Jest untuk testing

Pertama, install Jest beserta typing-nya:

```bash
npm install --save-dev jest @types/jest
```

Penjelasan:

- `jest` digunakan untuk menjalankan testing
- `@types/jest` digunakan agar TypeScript mengenali function seperti `describe`, `it`, dan `expect`

---

## 2. Install Babel agar Jest bisa membaca modul JavaScript dan TypeScript

Agar Jest bisa memahami syntax JavaScript modern dan file TypeScript, kita bisa menggunakan Babel.

Install dependency berikut:

```bash
npm install --save-dev babel-jest @babel/preset-env @babel/preset-typescript
```

Penjelasan:

- `babel-jest` menghubungkan Babel dengan Jest
- `@babel/preset-env` untuk syntax JavaScript modern
- `@babel/preset-typescript` agar Babel bisa membaca file TypeScript

Referensi setup Babel: [https://babeljs.io/setup#installation](https://babeljs.io/setup#installation)

---

## 3. Setup TypeScript

Install TypeScript:

```bash
npm install --save-dev typescript
```

Lalu buat file konfigurasi TypeScript:

```bash
npx tsc --init
```

Perintah ini akan menghasilkan file `tsconfig.json`.

---

## 4. Konfigurasi Babel

Buat file `babel.config.json` lalu isi dengan:

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ]
}
```

Konfigurasi ini membuat Babel dapat mentranspilasi JavaScript modern dan TypeScript saat test dijalankan oleh Jest.

---

## 5. Tambahkan script test di package.json

Agar test bisa dijalankan dengan `npm test`, tambahkan script berikut di `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Dengan begitu, kita tidak perlu selalu menjalankan `npx jest`, cukup:

```bash
npm test
```

---

## 6. Jika perlu, tambahkan konfigurasi TypeScript untuk Jest

Kadang-kadang TypeScript masih menandai `describe`, `it`, atau `expect` sebagai error. Kalau itu terjadi, tambahkan konfigurasi berikut di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

Bagian ini memberi tahu TypeScript bahwa project menggunakan environment Jest dan Node.js.

---

## 7. Membuat file test pertama

Buat folder `test`, lalu buat file misalnya `test/hello.test.ts`.

Isi file:

```ts
describe("Hello", () => {
  it("should say hello", () => {
    const name = "Daffa";
    expect(name).toBe("Daffa");
  });
});
```

Test ini hanya contoh sederhana untuk memastikan Jest sudah berjalan dengan benar.

---

## 8. Membuat function sayHello

Sekarang buat file `src/say-hello.ts`:

```ts
export function sayHello(name: string): string {
  return `Hello ${name}`;
}
```

Catatan: Di TypeScript, lebih tepat menggunakan `string` kecil daripada `String` besar, karena `string` adalah tipe primitif yang umum dipakai.

---

## 9. Membuat unit test untuk sayHello

Buat file `test/say-hello.test.ts`:

```ts
import { sayHello } from "../src/say-hello";

describe("sayHello", () => {
  it("should return hello Daffa", () => {
    const name = "Daffa";
    expect(sayHello(name)).toBe("Hello Daffa");
  });
});
```

Test ini memeriksa apakah function `sayHello("Daffa")` benar-benar menghasilkan `"Hello Daffa"`.

---

## 10. Jika terjadi error pada import

Kalau muncul error saat memakai `import`, tambahkan pengaturan berikut di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}
```

Konfigurasi ini membantu TypeScript menyesuaikan sistem module dengan Node.js.

---

## 11. Menjalankan test

Setelah semua selesai, jalankan test dengan:

```bash
npm test
```

Kenapa menggunakan `npm test`, bukan `npx jest`?

Karena kita sudah menambahkan script ini di `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Artinya, `npm test` akan menjalankan Jest secara otomatis.

---

## Kesimpulan

Untuk setup Jest pada project Node.js + TypeScript, langkah-langkah utamanya adalah:

1. install Jest
2. install Babel beserta preset yang dibutuhkan
3. install dan inisialisasi TypeScript
4. buat konfigurasi Babel
5. tambahkan script test di `package.json`
6. atur `tsconfig.json` bila perlu
7. buat file source dan unit test
8. jalankan test dengan `npm test`

Dengan konfigurasi ini, kamu sudah bisa mulai menulis dan menjalankan unit test sederhana pada project TypeScript.

---

## Catatan penting

Pada catatan awal ada beberapa dependency yang sebenarnya **tidak wajib** untuk setup dasar ini:

- `ts-jest` **tidak perlu** jika kamu sudah memakai `babel-jest`
- `@jest/globals` juga **tidak wajib** kalau kamu masih memakai global API Jest biasa seperti `describe`, `it`, dan `expect`

Jadi untuk setup sederhana dengan Babel, dependency yang cukup penting adalah:

```bash
npm install --save-dev jest @types/jest typescript babel-jest @babel/preset-env @babel/preset-typescript
```

> **Next step**
> Kalau kamu mau, artikel ini bisa dibenarkan lagi menjadi versi yang lebih natural dan enak dibaca seperti tulisan blog.
