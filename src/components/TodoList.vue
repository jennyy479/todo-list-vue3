<template>
  <div class="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 space-y-4">
    <h2 class="text-2xl font-bold text-gray-500">{{ today }}</h2>
    <p class="text-gray-600">{{ todos.length }} 項任務</p>

    <form @submit.prevent="handleAddTodo" class="flex space-x-2">
      <input
        type="text"
        v-model="newTodo"
        placeholder="新增待辦事項"
        class="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
        @keydown.enter="handleAddTodo"
      />
    </form>

    <ul class="space-y-2">
      <li
      v-for="(todo, todoIndex) in todos"
      :key="todo.id"
      class="group relative flex items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
    >
      <div class="flex items-center space-x-2 w-full pr-8">
        <div v-if="!isEditMode[todoIndex]" class="checkbox-wrapper-46">
          <input
            class="inp-cbx"
            :id="`cbx-${todo.id}`" 
            type="checkbox"
            v-model="todo.done"
          />
          <label class="cbx" :for="`cbx-${todo.id}`">
            <span>
              <svg width="12px" height="10px" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </svg>
            </span>
          </label>
        </div>
        
        <div
          v-if="!isEditMode[todoIndex]"
          class="flex-1 cursor-pointer"
          @dblclick="startEditTodo(todoIndex)"
        >
          <span :class="{ 'line-through text-gray-400': todo.done }">
            {{ todo.text }}
          </span>
        </div>
    
        <div v-else class="flex-1">
          <input
            type="text"
            v-model="todo.text"
            placeholder="修改待辦事項"
            @keyup.enter="saveEdit(todo, todoIndex)"
            class="w-full px-2 py-1 border rounded focus:outline-none"
          />
        </div>
      </div>
      <button
        v-if="!isEditMode[todoIndex]"
        @click="handleRemoveTodo(todo.id)"
        class="absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6 text-xs rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 transition opacity-0 group-hover:opacity-100 flex items-center justify-center"
      >
        ✕
      </button>
    </li>
  </ul>    
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { useTodoStore, type TodoItem } from "../store/todoStore";

const newTodo = ref('');
const todoStore = useTodoStore();
const { todos } = toRefs(todoStore);
const today = new Date().toLocaleDateString();

const isEditMode = ref<boolean[]>([]);
const handleAddTodo = () => {
  if(newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value);
    newTodo.value = '';
  }
};

const handleRemoveTodo = (targetId: number) => {
  const index = todos.value.findIndex((todo) => todo.id === targetId)
  todos.value.splice(index, 1)
};

const startEditTodo = (index: number) => {
  isEditMode.value[index] = true;
}

const saveEdit = (todo: TodoItem, index: number) => {
  if (todo.text?.trim()) {
    todo.text = todo.text.trim()
  }
  isEditMode.value[index] = false
}
</script>