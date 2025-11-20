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
          <span v-if="isDark">Sun</span>
          <span v-else>Moon</span>
        </button>
      </div>
    </header>

    <NoteForm @note-added="addNote" />
    <NoteList :notes="notes" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import NoteForm from "./components/NoteForm.vue";
import NoteList from "./components/NoteList.vue";
import { API_BASE_URL } from "./config";

const notes = ref([]);
const isDark = ref(false);

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  isDark.value = saved ? saved === "dark" : prefersDark === "dark";
  applyTheme(isDark.value);
};

const applyTheme = (darkMode) => {
  const theme = darkMode ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
};

const fetchNotes = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/notes`);
    notes.value = data;
  } catch (err) {
    console.error("Gagal mengambil catatan:", err);
  }
};

const addNote = (newNote) => {
  notes.value.unshift(newNote);
};

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
header h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
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
}
.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-hover);
  border-color: var(--focus-color);
}
</style>
