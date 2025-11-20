<template>
  <div class="notes-grid">
    <article v-for="note in notes" :key="note._id" class="note-card">
      <h3>{{ note.title }}</h3>
      <p class="content">{{ note.content }}</p>
      <div class="summary">
        <strong>AI:</strong>
        <p class="summary-text">{{ note.summary }}</p>
      </div>
      <div class="meta">
        <span class="tag" :class="note.category">
          {{ note.category }}
        </span>
        <small>{{ formatDate(note.createdAt) }}</small>
        <button
          class="delete"
          :disabled="props.deletingId === note._id"
          @click="emit('delete-note', note._id)"
        >
          {{ props.deletingId === note._id ? "Menghapus..." : "Hapus" }}
        </button>
      </div>
    </article>
  </div>
</template>

<script setup>
const props = defineProps({
  notes: {
    type: Array,
    default: () => [],
  },
  deletingId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["delete-note"]);

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.notes-grid {
  display: grid;
  gap: 1.5rem;
}
.note-card {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}
.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px var(--shadow-hover);
}
.note-card h3 {
  color: var(--header-gradient-start);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}
.content {
  margin: 1.25rem 0;
  line-height: 1.8;
  color: var(--text-primary);
  text-align: left;
  white-space: pre-wrap; /* Mempertahankan line breaks dan whitespace */
  word-wrap: break-word; /* Memecah kata panjang jika perlu */
  font-size: 1rem;
}
.summary {
  background: linear-gradient(
    135deg,
    var(--summary-bg-start) 0%,
    var(--summary-bg-end) 100%
  );
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid var(--summary-border);
  margin: 1rem 0;
  text-align: left;
}
.summary strong {
  color: var(--summary-label);
  font-weight: 700;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
}
.summary-text {
  color: var(--summary-text);
  font-size: 0.95rem;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: 500;
  line-height: 1.6;
}

.delete {
  border: none;
  background: transparent;
  color: #e53e3e;
  font-weight: 600;
  cursor: pointer;
}
.delete:hover {
  text-decoration: underline;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-input);
}
.tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px var(--shadow-color);
}
.tag.belajar {
  background: linear-gradient(
    135deg,
    var(--tag-belajar-start) 0%,
    var(--tag-belajar-end) 100%
  );
  color: var(--tag-belajar-text);
}
.tag.kerja {
  background: linear-gradient(
    135deg,
    var(--tag-kerja-start) 0%,
    var(--tag-kerja-end) 100%
  );
  color: var(--tag-kerja-text);
}
.tag.pribadi {
  background: linear-gradient(
    135deg,
    var(--tag-pribadi-start) 0%,
    var(--tag-pribadi-end) 100%
  );
  color: var(--tag-pribadi-text);
}
small {
  font-weight: 500;
}
</style>
