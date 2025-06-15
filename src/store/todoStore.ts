import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface TodoItem {
  id: number
  text: string
  done: boolean
}

export const useTodoStore = defineStore('todo', () => { 
  const todos = ref<TodoItem[]>([])

  const resortTodos = computed(() => {
    return todos.value.slice().sort((a, b) => Number(a.done) - Number(b.done))
  })
  const addTodo = (text: string) => {
    todos.value.push({
      id: Date.now(),
      text,
      done: false
    })
  }

  const editTodo = (text: string) => {
   console.log(todos.value, text)
  }

  const removeTodo = (id: number) => {
    const index = todos.value.findIndex((todo) => todo.id === id)
    todos.value.splice(index, 1)
  };

  return {
    addTodo,
    editTodo,
    removeTodo,
    resortTodos,
    todos
  }
})