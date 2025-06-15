import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface TodoItem {
  id: number
  text: string
  done: boolean
}

export const useTodoStore = defineStore('todo', () => { 
  const todos = ref<TodoItem[]>([])

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

  const removeTodo = (id: string) => {

  };

  return {
    addTodo,
    editTodo,
    removeTodo,
    todos
  }
})