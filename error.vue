<template>
  <NuxtLayout name="error">
    <div class="error-page">
      <h1>{{ error.statusCode }}</h1>
      <p class="error-message">{{ error.message }}</p>
      <button @click="handleError">重试</button>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<style scoped>
.error-page {
  text-align: center;
}

h1 {
  font-size: 8rem;
  margin: 0;
  color: var(--primary-color);
}

.error-message {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  font-size: 1.1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

button:hover {
  opacity: 0.8;
}
</style>
