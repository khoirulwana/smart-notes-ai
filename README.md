# Smart Notes AI

Aplikasi catatan cerdas berbasis **MEVN Stack** dengan **AI-powered summary & categorization** menggunakan **Google Gemini API**.

## 📋 Deskripsi

Smart Notes AI adalah aplikasi web modern untuk membuat dan mengelola catatan dengan bantuan Artificial Intelligence. Setiap catatan yang dibuat akan otomatis mendapatkan ringkasan dari Google Gemini AI dan dikategorikan secara otomatis berdasarkan kontennya.

## ✨ Fitur

- ✅ **Tambah Catatan** - Buat catatan dengan judul dan konten
- 🤖 **Ringkasan Otomatis oleh AI** - Setiap catatan otomatis diringkas dalam 1 kalimat oleh Google Gemini AI
- 🏷️ **Kategori Otomatis** - Sistem otomatis mengkategorikan catatan ke: `#belajar`, `#kerja`, atau `#pribadi`
- 💾 **Penyimpanan MongoDB** - Semua catatan tersimpan aman di database MongoDB
- 🎨 **Responsif & Modern UI** - Interface yang clean dan responsive untuk semua device

## 🛠️ Tech Stack

- **M**ongoDB - Database NoSQL untuk menyimpan catatan
- **E**xpress.js - Web framework untuk Node.js (Backend API)
- **V**ue.js 3 - Progressive JavaScript framework (Frontend)
- **N**ode.js - JavaScript runtime environment
- **Vite** - Build tool dan dev server untuk Vue.js
- **Google Gemini API** - AI service untuk generate summary

## 📁 Struktur Project

```
Smart Notes AI/
├── backend/                 # Backend API (Express.js)
│   ├── models/
│   │   └── Note.js         # MongoDB schema untuk Note
│   ├── server.js           # Express server dan API routes
│   └── package.json        # Dependencies backend
│
├── smart-notes-app/        # Frontend (Vue.js)
│   ├── src/
│   │   ├── components/
│   │   │   ├── NoteForm.vue    # Form untuk membuat catatan baru
│   │   │   └── NoteList.vue    # Komponen untuk menampilkan daftar catatan
│   │   ├── App.vue         # Root component
│   │   ├── main.js         # Entry point aplikasi
│   │   └── style.css       # Global styles
│   ├── vite.config.js      # Konfigurasi Vite
│   └── package.json        # Dependencies frontend
│
└── README.md               # Dokumentasi project
```

## 🚀 Setup Lokal

### Prerequisites

- Node.js (v16 atau lebih baru)
- MongoDB (local atau MongoDB Atlas)
- Google Gemini API Key ([Dapatkan di sini](https://makersuite.google.com/app/apikey))

### 1. Clone Repository

```bash
git clone <repository-url>
cd "Smart Notes AI"
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/smart-notes
# atau untuk MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-notes

GEMINI_KEY=your-google-gemini-api-key-here
PORT=5000
```

Jalankan backend:

```bash
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

Buka terminal baru:

```bash
cd smart-notes-app
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (atau port lain yang tersedia)

## 📡 API Endpoints

### `POST /api/summarize`

Generate ringkasan otomatis menggunakan Google Gemini AI.

**Request Body:**

```json
{
  "text": "Teks yang akan diringkas..."
}
```

**Response:**

```json
{
  "summary": "Ringkasan dalam 1 kalimat"
}
```

### `GET /api/notes`

Mengambil semua catatan dari database (diurutkan terbaru pertama).

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Judul Catatan",
    "content": "Isi catatan...",
    "summary": "Ringkasan AI",
    "category": "belajar",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### `POST /api/notes`

Membuat catatan baru.

**Request Body:**

```json
{
  "title": "Judul Catatan",
  "content": "Isi catatan...",
  "summary": "Ringkasan (optional)",
  "category": "belajar" // optional, akan di-generate otomatis
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Judul Catatan",
  "content": "Isi catatan...",
  "summary": "Ringkasan",
  "category": "belajar",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🧩 Komponen Vue

### `App.vue`

Root component yang mengelola state global `notes` dan layout utama aplikasi.

**Props:** Tidak ada  
**Events:** Tidak ada  
**State:**

- `notes` (Array) - Array semua catatan

### `NoteForm.vue`

Komponen form untuk membuat catatan baru dengan integrasi AI.

**Props:** Tidak ada  
**Events:**

- `note-added` - Emit ketika catatan baru berhasil dibuat (payload: note object)

**State:**

- `title` (String) - Judul catatan
- `content` (String) - Konten catatan
- `loading` (Boolean) - Status loading saat proses AI

### `NoteList.vue`

Komponen untuk menampilkan daftar semua catatan dalam format card grid.

**Props:**

- `notes` (Array) - Array catatan yang akan ditampilkan

**Events:** Tidak ada

## 🗄️ Database Schema

### Note Model

```javascript
{
  title: String (required),
  content: String (required),
  summary: String (default: "Menunggu AI..."),
  category: String (enum: ["belajar", "kerja", "pribadi"], default: "pribadi"),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 🏷️ Kategori Otomatis

Sistem akan mengkategorikan catatan berdasarkan kata kunci:

- **`belajar`**: Jika teks mengandung "belajar", "kursus", atau "tutorial"
- **`kerja`**: Jika teks mengandung "kerja", "meeting", atau "tugas"
- **`pribadi`**: Default untuk semua catatan lainnya

## 📝 Dokumentasi Kode

Semua file kode telah dilengkapi dengan dokumentasi JSDoc yang lengkap:

- **Backend**: Dokumentasi untuk semua routes, functions, dan models
- **Frontend**: Dokumentasi untuk semua components, props, events, dan functions

## 🌐 Demo

Live demo: [https://smart-notes-khoirul.vercel.app](https://smart-notes-khoirul.vercel.app)

## 📄 License

MIT License

## 👤 Author

Dibuat dengan ❤️ menggunakan MEVN Stack dan Google Gemini AI
