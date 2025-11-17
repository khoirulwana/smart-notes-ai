<!--
  @fileoverview Komponen utama aplikasi Smart Notes AI
  @description Root component yang mengatur state global dan layout utama aplikasi
  @component App
-->
<template>
  <div class="container">
    <header>
      <div class="header-content">
        <div>
          <h1>Smart Notes AI</h1>
          <p>Catatan cerdas dengan AI: ringkasan & kategori otomatis</p>
        </div>
        <button
          @click="toggleTheme"
          class="theme-toggle"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </header>

    <!-- Form untuk menambah catatan baru -->
    <NoteForm @note-added="addNote" />

    <!-- Daftar semua catatan -->
    <NoteList :notes="notes" />
  </div>
</template>

<script setup>
/**
 * @module App
 * @description Komponen utama aplikasi yang mengelola state notes dan komunikasi dengan API
 */

import { ref, onMounted } from "vue";
import axios from "axios";
import NoteForm from "./components/NoteForm.vue";
import NoteList from "./components/NoteList.vue";

/**
 * Reactive state untuk menyimpan array semua catatan
 * @type {import('vue').Ref<Array>}
 */
const notes = ref([]);

/**
 * Reactive state untuk dark mode
 * @type {import('vue').Ref<Boolean>}
 */
const isDark = ref(false);

/**
 * Mendeteksi preferensi tema sistem atau dari localStorage
 * @function initTheme
 */
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = prefersDark;
  }

  applyTheme();
};

/**
 * Menerapkan tema ke document
 * @function applyTheme
 */
const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
};

/**
 * Toggle antara light dan dark mode
 * @function toggleTheme
 */
const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme();
};

/**
 * Mengambil semua catatan dari API backend
 * @async
 * @function fetchNotes
 * @description Fetch semua catatan dari endpoint GET /api/notes dan update state notes
 */
const fetchNotes = async () => {
  const res = await axios.get("/api/notes");
  notes.value = res.data;
};

/**
 * Menambahkan catatan baru ke awal array notes
 * @function addNote
 * @param {Object} newNote - Objek catatan baru yang akan ditambahkan
 * @description Dipanggil ketika event 'note-added' di-emit dari NoteForm component
 */
const addNote = (newNote) => {
  notes.value.unshift(newNote);
};

// Lifecycle hooks
onMounted(() => {
  initTheme();
  fetchNotes();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto",
    sans-serif;
  background: linear-gradient(
    135deg,
    var(--bg-gradient-start) 0%,
    var(--bg-gradient-mid) 30%,
    var(--bg-gradient-end) 100%
  );
  min-height: 100vh;
  color: var(--text-primary);
  padding: 2rem 0;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}
header {
  margin-bottom: 3rem;
  padding: 2rem 0;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
header > div:first-child {
  text-align: left;
  flex: 1;
}
header h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 400;
}
.theme-toggle {
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-hover);
  border-color: var(--focus-color);
}
.theme-toggle:active {
  transform: translateY(0);
}
</style>
