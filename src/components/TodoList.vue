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
          <a-date-picker
            ref="datePickerRef"
            v-model:value="selectedDate"
            placeholder="截止日期"
            style="font-size: 12px;color: #6B7280;"
          />
            <div class="inline-block relative">
              <button
                class="default-button focus:outline-none whitespace-nowrap px-3 py-2 min-w-fit"
                :class="[
                  filterStatus === 'priority'
                    ? 'border-2 text-gray-900'
                    : 'bg-white text-gray-500'
                ]"
                @click.prevent="toggleColorDots"
              >
                <i class="mdi mdi-flag text-sm mr-1"></i>
                優先級
              </button>
        
              <div
                v-if="showColorDots"
                class="absolute z-50 mt-2 p-2 bg-white border border-gray-300 rounded shadow flex space-x-2"
              >
                <div
                  v-for="c in colorOptions"
                  :key="c.value"
                  class="w-4 h-4 rounded-full cursor-pointer border-2"
                  :class="{
                    'ring-2 ring-offset-1': color === c.value,
                    'border-white': color !== c.value
                  }"
                  :style="{ backgroundColor: c.value }"
                  @click="selectColor(c.value)"
                  :title="c.label"
                ></div>
              </div>
            </div>
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
          class="relative flex flex-col cursor-pointer space-y-1 items-start"
          @dblclick="startEditTodo(todoIndex)"
        >
          <i
            class="mdi mdi-flag text-sm absolute top-[2.25rem] right-[-5.25rem]"
            :style="{ color: todo.color || '#ccc' }"
            title="優先級"
          ></i>
          
          <span
            :class="{ 'line-through text-gray-400': todo.done }"
            class="text-gray-500 pr-4"
          >
            {{ todo.text }}
          </span>
        
          <div v-if="todo.deadline" class="text-sm text-gray-400">
            <i class="mdi mdi-calendar-clock-outline mr-1"></i>
            {{ formatDate(todo.deadline) }}
          </div>
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

const showColorDots = ref(false)
const color = ref('') // 當前選中的顏色

// 顏色選項
const colorOptions = [
  { label: '紅色', value: '#f87171' },
  { label: '橘色', value: '#fb923c' },
  { label: '黃色', value: '#facc15' },
  { label: '綠色', value: '#4ade80' },
  { label: '藍色', value: '#60a5fa' },
  { label: '紫色', value: '#a78bfa' }
]

const toggleColorDots = () => {
  showColorDots.value = !showColorDots.value
}

const selectColor = (selected: string) => {
  color.value = selected
  showColorDots.value = false
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
}
const isEditMode = ref<boolean[]>([]);
const handleAddTodo = () => {
  if(newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value, selectedDate.value, color.value);
    newTodo.value = '';
    filterStatus.value = 'all';
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