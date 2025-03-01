<template>
  <div class="welcome">
    <h2>{{ message }}</h2>
  </div>
</template>

<script setup lang="ts">
const message = "欢迎使用这个组件！";
</script>

<style scoped>
.welcome {
  padding: 20px;
  text-align: center;
}
</style>
