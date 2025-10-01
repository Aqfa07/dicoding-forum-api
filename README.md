# Forum API

API forum modular dengan Hapi, PostgreSQL, dan JWT. Siap untuk pengembangan, pengujian, dan deployment.

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Persyaratan](#persyaratan)
- [Variabel Lingkungan (.env)](#variabel-lingkungan-env)
- [Quickstart](#quickstart)
- [Perintah (Scripts)](#perintah-scripts)
- [Arsitektur Singkat](#arsitektur-singkat)
- [Struktur Proyek](#struktur-proyek-ringkas)
- [API Reference](#api-reference)
- [Autentikasi](#autentikasi)
- [Pola Respons](#pola-respons)
- [Push ke GitHub (via v0)](#push-ke-github-via-v0)
- [Tips & Troubleshooting](#tips--troubleshooting)
- [Lisensi](#lisensi)

## Fitur Utama
- Registrasi pengguna dan autentikasi (login, refresh token, logout)
- Manajemen thread, komentar, dan balasan
- JWT-based auth dengan strategi Hapi terpisah
- Lapisan domain, use cases, dan infrastruktur yang terstruktur
- Migrasi database dengan node-pg-migrate
- Test terisolasi (DB test terpisah) menggunakan Jest

## Persyaratan
- Node.js LTS
- PostgreSQL
- File .env untuk konfigurasi

## Variabel Lingkungan (.env)
Siapkan variabel berikut untuk development:
- HOST, PORT
- PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
- ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY

Untuk environment test (digunakan jest), siapkan juga:
- PGHOST_TEST, PGPORT_TEST, PGUSER_TEST, PGPASSWORD_TEST, PGDATABASE_TEST

### Contoh .env
\`\`\`
HOST=localhost
PORT=5000

PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=forum_api

# Database untuk pengujian (Jest)
PGHOST_TEST=127.0.0.1
PGPORT_TEST=5432
PGUSER_TEST=postgres
PGPASSWORD_TEST=postgres
PGDATABASE_TEST=forum_api_test

ACCESS_TOKEN_KEY=your-access-secret
REFRESH_TOKEN_KEY=your-refresh-secret
\`\`\`

> Rekomendasi: buat dua database terpisah (forum_api & forum_api_test). Jangan gunakan DB yang sama untuk dev dan test.

## Quickstart
1) Siapkan .env seperti contoh di atas dan buat DB dev + test.
2) Instal dependensi: `npm install`
3) Jalankan migrasi:
   - Dev: `npm run migrate`
   - Test: `npm run migrate:test`
4) Jalankan server:
   - Dev (hot reload): `npm run start:dev`
   - Prod: `npm run start`
5) Uji cepat (smoke test):
   - Registrasi user → Login → Create thread → Get thread

## Perintah (Scripts)
- Start dev: `npm run start:dev`
- Start prod: `npm run start`
- Test: `npm test`
- Test watch (perubahan): `npm run test:watch:change`
- Test watch all + coverage: `npm run test:watch`
- Migrasi dev: `npm run migrate`
- Migrasi test: `npm run migrate:test`

## Endpoint Utama
- Users
  - POST /users

- Authentications
  - POST /authentications (login)
  - PUT /authentications (refresh access token)
  - DELETE /authentications (logout)

- Threads (butuh auth)
  - POST /threads

- Comments (butuh auth)
  - POST /threads/{threadId}/comments
  - DELETE /threads/{threadId}/comments/{commentId}

- Replies (butuh auth)
  - POST /threads/{threadId}/comments/{commentId}/replies
  - DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}

- Threads (public)
  - GET /threads/{threadId}

## Autentikasi
- Gunakan JWT Access Token pada header:
  - `Authorization: Bearer <ACCESS_TOKEN>`
- Strategi Hapi: `forum_jwt` dengan kunci `ACCESS_TOKEN_KEY`.

## Pola Respons
- Sukses:
  - `{ "status": "success", "data": { ... } }`
- Client error (validasi, dsb – ClientError):
  - `{ "status": "fail", "message": "..." }` (HTTP 4xx)
- Server error:
  - `{ "status": "error", "message": "terjadi kegagalan pada server kami" }` (HTTP 500)

Penanganan error dilakukan di `src/Infrastructures/http/createServer.js` via `onPreResponse` dan penerjemahan domain error oleh `DomainErrorTranslator`.

## Arsitektur Singkat
- Interfaces (Hapi handlers/routes) → Applications (use cases, security abstraction) → Domains (entities & repos contracts) → Infrastructures (implementasi repos, DB, JWT, DI container).
- Error ditangani di `onPreResponse` (Hapi) dan diterjemahkan oleh `DomainErrorTranslator` agar domain error memetakan ke response HTTP yang tepat.

## Struktur Proyek (ringkas)
\`\`\`bash
src/
  Applications/
  Commons/
    exceptions/
  Domains/
  Infrastructures/
    database/
    http/
    security/
  Interfaces/
    http/
      api/
        users/
        authentications/
        threads/
  app.js
migrations/
scripts/
  sql/
config/
  database/
    test.json
tests/
.env (tidak di-commit)
package.json
\`\`\`

## API Reference

Base URL: `http://HOST:PORT` (default `http://localhost:5000`)

- Users
  - Registrasi
    - POST `/users`
    - Body:
      \`\`\`json
      { "username": "johndoe", "password": "secret", "fullname": "John Doe" }
      \`\`\`
    - cURL:
      \`\`\`bash
      curl -X POST http://localhost:5000/users \
        -H "Content-Type: application/json" \
        -d '{ "username":"johndoe","password":"secret","fullname":"John Doe" }'
      \`\`\`

- Authentications
  - Login
    - POST `/authentications`
    - Body:
      \`\`\`json
      { "username": "johndoe", "password": "secret" }
      \`\`\`
    - Response (contoh):
      \`\`\`json
      { "status":"success","data":{ "accessToken":"...", "refreshToken":"..." } }
      \`\`\`
  - Refresh Access Token
    - PUT `/authentications`
    - Body:
      \`\`\`json
      { "refreshToken": "..." }
      \`\`\`
  - Logout (hapus refresh token)
    - DELETE `/authentications`
    - Body:
      \`\`\`json
      { "refreshToken": "..." }
      \`\`\`

- Threads (butuh auth)
  - Create Thread
    - POST `/threads`
    - Header: `Authorization: Bearer <ACCESS_TOKEN>`
    - Body:
      \`\`\`json
      { "title": "Judul", "body": "Konten thread" }
      \`\`\`
  - Get Thread (public)
    - GET `/threads/{threadId}`

- Comments (butuh auth)
  - Tambah Komentar
    - POST `/threads/{threadId}/comments`
    - Body:
      \`\`\`json
      { "content": "Komentar saya" }
      \`\`\`
  - Hapus Komentar (soft delete)
    - DELETE `/threads/{threadId}/comments/{commentId}`

- Replies (butuh auth)
  - Tambah Balasan
    - POST `/threads/{threadId}/comments/{commentId}/replies`
    - Body:
      \`\`\`json
      { "content": "Balasan saya" }
      \`\`\`
  - Hapus Balasan (soft delete)
    - DELETE `/threads/{threadId}/comments/{commentId}/replies/{replyId}`

> Catatan: beberapa endpoint mengembalikan bentuk data agregat (thread + comments + replies). Lihat implementasi handler pada `src/Interfaces/http/api/*/handler.js` untuk detail lengkap.

## Push ke GitHub (via v0)
- Pastikan `.gitignore` mengabaikan `node_modules`, artefak build, dan file sensitif (sudah disiapkan).
- Di v0, klik ikon GitHub di kanan atas → pilih repo/otorisasi → konfirmasi push.
- v0 menghormati `.gitignore`, sehingga `node_modules` tidak ikut ter-commit.

## Tips & Troubleshooting (tambahan)
- Invalid token → pastikan header `Authorization: Bearer <ACCESS_TOKEN>` benar dan token masih valid.
- 500 saat validasi → cek `DomainErrorTranslator` agar kesalahan domain dipetakan ke `InvariantError` (HTTP 400) dengan payload `{ status: "fail", message: "..." }`.
- Gagal migrasi → pastikan kredensial `.env` benar dan DB dev/test sudah dibuat.

## Lisensi
- ISC (sesuai package.json)
