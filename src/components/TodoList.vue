<template>
  <div class="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 space-y-4">
    <div class="flex flex-col items-start">
      <h2 class="text-2xl font-bold text-gray-500">{{ today }}</h2>
      <div class="flex pt-2 gap-2 items-center">
        <p class="text-gray-500 text-sm">{{ filterByStatus.length }} 項任務</p>
        <button
          :class="[
            'default-button focus:outline-none',
            filterStatus === 'all'
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-500'
          ]"
          @click="filterStatus = 'all'"
          role="button"
        >
          全部
        </button>
        <button
          class="default-button focus:outline-none"
          :class="[ filterStatus === 'undone' ? 'bg-gray-200 text-gray-900': 'bg-white text-gray-500' ]"
          @click="filterStatus = 'undone'"
          role="button"
        >
          待處理
        </button>
        <button
          class="default-button focus:outline-none"
          :class="[ filterStatus === 'done' ? 'bg-gray-200 text-gray-900': 'bg-white text-gray-500' ]"
          @click="filterStatus = 'done'"
          role="button"
        >
          已完成
        </button>
      </div>
    </div>
    <form @submit.prevent="handleAddTodo" class="pt-4">
      <div class="input-container w-full">
        <input placeholder="新增待辦事項" class="input-field" type="text" v-model="newTodo" @keydown.enter="handleAddTodo">
        <label for="input-field" class="input-label">輸入文字</label>
        <span class="input-highlight"></span>
        <div class="flex gap-2 flex-nowrap items-center mt-2">
          <button
            class="default-button focus:outline-none whitespace-nowrap px-3 py-2 min-w-fit"
            :class="[ filterStatus === 'deadline' ? 'border-2 text-gray-900' : 'bg-white text-gray-500' ]"
            role="button"
            @click="openDatePicker"
          >
            <i class="mdi mdi-calendar-badge-outline text-sm"></i>
            截止日期
          </button>
          <a-date-picker
            ref="datePickerRef"
            v-model:value="selectedDate"
            style="position: absolute; opacity: 0.2;"
            @change="onDateChange"
          />
          <button
            class="default-button focus:outline-none whitespace-nowrap px-3 py-2 min-w-fit"
            :class="[ filterStatus === 'priority' ? 'border-2 text-gray-900': 'bg-white text-gray-500' ]"
            @click="filterStatus === 'priority'"
            role="button"
          >
            <i class="mdi mdi-flag text-sm"></i>
            優先級
          </button>
          <button
            class="default-button focus:outline-none whitespace-nowrap px-3 py-2 min-w-fit"
            :class="[ filterStatus === 'more' ? 'border-2 text-gray-900': 'bg-white text-gray-500' ]"
            @click="filterStatus === 'more'"
            role="button"
          >
          <span class="mdi mdi-dots-horizontal text-sm"></span>
          </button>
        </div>
      </div>
    </form>
    <ul class="space-y-2">
      <li
      v-for="(todo, todoIndex) in filterByStatus"
      :key="todo.id"
      class="group relative flex items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
    >
      <div class="flex items-center space-x-2 w-full">
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
          class="flex flex-col cursor-pointer"
          @dblclick="startEditTodo(todoIndex)"
        >
          <span :class="{ 'line-through text-gray-400': todo.done }" class="text-gray-500 h-auto">
            {{ todo.text }}
          </span>
          <span>
            tag
          </span>
        </div>
    
        <div v-else class="flex-1">
          <input
            type="text"
            v-model="todo.text"
            placeholder="修改待辦事項"
            @keyup.enter="saveEdit(todo, todoIndex)"
            class="w-full px-2 py-1 text-gray-500 border rounded focus:outline-none"
          />
        </div>
      </div>
      <button
        v-if="!isEditMode[todoIndex]"
        @click="handleRemoveTodo(todo.id)"
        class="absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6 text-xs rounded-full bg-transparent text-red-500 hover:ransparent hover:text-red-700 transition opacity-0 group-hover:opacity-100 flex items-center justify-center"
      >
        ✕
      </button>
    </li>
  </ul>    
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, computed } from 'vue';
import { useTodoStore, type TodoItem } from "../store/todoStore";
import { onMounted } from 'vue';

const newTodo = ref('');
const todoStore = useTodoStore();
const { resortTodos } = toRefs(todoStore);
const today = new Date().toLocaleDateString();
const filterStatus = ref('all')
const selectedDate = ref('');
const datePickerRef = ref();
const onDateChange = () => {

};

const openDatePicker = () => {
  filterStatus.value = 'deadline'
  // 透過 ref 調用 focus 打開日期選擇器彈窗
  datePickerRef.value && datePickerRef.value.focus()
}

const isEditMode = ref<boolean[]>([]);
const handleAddTodo = () => {
  if(newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value);
    newTodo.value = '';
  }
};

const handleRemoveTodo = (targetId: number) => {
  todoStore.removeTodo(targetId)
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

const filterByStatus = computed(() => {
  if(filterStatus.value === 'all') {
    return resortTodos.value
  } else if(filterStatus.value === 'undone') {
    return resortTodos.value.filter((todo) => todo.done === false)
  } else {
    return resortTodos.value.filter((todo) => todo.done === true)
  }
})

onMounted(() => 
  filterStatus.value = 'all'
)
</script>