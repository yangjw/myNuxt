<template>
  <div class="contact-container">
    <h1>联系我们</h1>
    <div class="contact-content">
      <div class="contact-info">
        <h2>联系方式</h2>
        <p>电话：123-456-7890</p>
        <p>邮箱：contact@example.com</p>
        <p>地址：某某市某某区某某街道123号</p>
      </div>

      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">姓名：</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>

        <div class="form-group">
          <label for="email">邮箱：</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>

        <div class="form-group">
          <label for="message">留言：</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="5"
            required
          ></textarea>
        </div>

        <button type="submit">提交</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSEO } from "../composables/useSEO";

// 定义基本的页面元数据
definePageMeta({
  layout: "custom",
  pageTransition: {
    name: "slide-fade",
  },
});

// 使用 SEO composable
const { seoMeta, seoTitle, seoDescription, loadSEO } = useSEO();
const route = useRoute();

// 在组件挂载时加载 SEO 配置
onMounted(async () => {
  await loadSEO(route.path);
});

// 使用 useHead 来动态设置页面头部
useHead(() => ({
  title: seoTitle.value,
  meta: [
    {
      name: "description",
      content: seoDescription.value,
    },
    ...seoMeta.value,
  ],
}));

const form = ref({
  name: "",
  email: "",
  message: "",
});

const handleSubmit = () => {
  // 这里处理表单提交逻辑
  console.log("表单提交：", form.value);
};
</script>

<style scoped>
.contact-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-top: 20px;
}

.contact-info {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: bold;
}

input,
textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
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
