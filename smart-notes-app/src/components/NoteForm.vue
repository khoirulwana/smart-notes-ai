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
import { ref } from "vue";
import axios from "axios";
import { API_BASE_URL } from "../config";

const emit = defineEmits(["note-added"]);
const title = ref("");
const content = ref("");
const loading = ref(false);

const submitNote = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    return;
  }

  loading.value = true;
  try {
    const { data: summaryRes } = await axios.post(
      `${API_BASE_URL}/api/summarize`,
      {
        text: content.value,
      }
    );
    const summary = summaryRes.summary;

    const { data: savedNote } = await axios.post(`${API_BASE_URL}/api/notes`, {
      title: title.value,
      content: content.value,
      summary,
    });

    emit("note-added", savedNote);
    title.value = "";
    content.value = "";
  } catch (err) {
    console.error("Gagal menyimpan catatan:", err);
    alert("Gagal menyimpan catatan. Silakan coba lagi.");
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
