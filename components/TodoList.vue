<template>
  <div class="todo-list">
    <div class="todo-input">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="添加新任务"
      />
      <button @click="addTodo">添加</button>
    </div>

    <ul class="todos">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id, !todo.completed)"
        />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { ref, computed } from "vue";

const store = useStore();
const newTodo = ref("");

const todos = computed(() => store.getters["todo/getAllTodos"]);

const addTodo = () => {
  if (newTodo.value.trim()) {
    store.dispatch("todo/addTodo", newTodo.value);
    newTodo.value = "";
  }
};

const toggleTodo = (id: number, completed: boolean) => {
  store.dispatch("todo/toggleTodo", { id, completed });
};

const removeTodo = (id: number) => {
  store.dispatch("todo/removeTodo", id);
};
</script>

<style scoped>
.todo-list {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.todo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todos {
  list-style: none;
  padding: 0;
}

.todos li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.completed span {
  text-decoration: line-through;
  color: #999;
}
</style>
