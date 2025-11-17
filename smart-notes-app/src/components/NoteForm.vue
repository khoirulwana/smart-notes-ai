<!--
  @fileoverview Komponen form untuk membuat catatan baru
  @description Form input untuk judul dan konten, dengan integrasi AI untuk generate summary
  @component NoteForm
  @emits note-added - Event yang di-emit ketika catatan berhasil dibuat
-->
<template>
  <form @submit.prevent="submitNote" class="note-form">
    <input v-model="title" placeholder="Judul catatan..." required />
    <textarea
      v-model="content"
      placeholder="Tulis apa saja..."
      rows="5"
      required
    ></textarea>
    <button type="submit" :disabled="loading">
      {{ loading ? "Mengolah AI..." : "Simpan" }}
    </button>
  </form>
</template>

<script setup>
/**
 * @module NoteForm
 * @description Komponen form untuk membuat catatan baru dengan AI-powered summary
 */

import { ref } from "vue";
import axios from "axios";

/**
 * Define emits untuk komunikasi dengan parent component
 * @emits {Object} note-added - Emit ketika catatan baru berhasil dibuat
 */
const emit = defineEmits(["note-added"]);

/**
 * Reactive state untuk judul catatan
 * @type {import('vue').Ref<String>}
 */
const title = ref("");

/**
 * Reactive state untuk konten catatan
 * @type {import('vue').Ref<String>}
 */
const content = ref("");

/**
 * Reactive state untuk loading status saat proses AI dan save
 * @type {import('vue').Ref<Boolean>}
 */
const loading = ref(false);

/**
 * Handler untuk submit form
 * @async
 * @function submitNote
 * @description
 * 1. Mengirim konten ke API untuk generate summary menggunakan AI
 * 2. Menyimpan catatan lengkap (title, content, summary) ke database
 * 3. Emit event 'note-added' dengan data catatan baru
 * 4. Reset form setelah berhasil
 * @throws {Error} Menampilkan alert jika terjadi error
 */
const submitNote = async () => {
  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Step 1: Get AI summary dari Google Gemini API
    const summaryRes = await axios.post(`${API_URL}/api/summarize`, {
      text: content.value,
    });
    const summary = summaryRes.data.summary;

    // Step 2: Save catatan lengkap ke database
    const res = await axios.post(`${API_URL}/api/notes`, {
      title: title.value,
      content: content.value,
      summary,
    });

    // Step 3: Emit event ke parent component
    emit("note-added", res.data);

    // Step 4: Reset form
    title.value = "";
    content.value = "";
  } catch (err) {
    alert("Error: " + (err.response?.data?.error || err.message));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.note-form {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}
input,
textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.25rem;
  border: 2px solid var(--border-input);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: var(--bg-input);
  color: var(--text-primary);
}
input:focus,
textarea:focus {
  outline: none;
  border-color: var(--focus-color);
  box-shadow: 0 0 0 3px rgba(183, 148, 246, 0.15);
  background: var(--bg-input);
}
input::placeholder,
textarea::placeholder {
  color: var(--text-muted);
}
textarea {
  resize: vertical;
  min-height: 120px;
}
button {
  background: linear-gradient(
    135deg,
    var(--button-gradient-start) 0%,
    var(--button-gradient-end) 100%
  );
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(159, 122, 234, 0.3);
  width: 100%;
}
button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(159, 122, 234, 0.4);
  background: linear-gradient(
    135deg,
    var(--button-hover-start) 0%,
    var(--button-hover-end) 100%
  );
}
button:active:not(:disabled) {
  transform: translateY(0);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
