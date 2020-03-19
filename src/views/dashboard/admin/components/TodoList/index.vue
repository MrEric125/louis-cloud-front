<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List" @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked })">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="handleEdit"
          @deleteTodo="handleDel"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
    </footer>
  </section>
</template>

<script>
import Todo from './Todo.vue'
import {getTodos,delTodo,addTodo, editTodo} from '@/api/todo'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}

export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  data() {
    return {
      visibility: 'all',   
      filters,
      todos: null
    }
  },
  created(){
    this.getTodoList("all")
  },
  computed: {
    allChecked() {
      return this.todos.every(todo => todo.done)
    },
    // 过滤的思路就是将所有的待办事项都列出来，然后每次请求的时候就不请求后台数据
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    remaining() {
      return this.todos.filter(todo => !todo.done).length
    }
  },
  methods: {
    setLocalStorage() {
      
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    addTodo(e) {
      const text = e.target.value
      if (text.trim()) {
        this.todos.push({
          text,
          done: false
        })
        this.setLocalStorage()
      }
      e.target.value = ''
    },

    /**
     * 获取待办列表
     */
    getTodoList(listquery){
      if(!listquery){
        listquery="all"
      }
      getTodos(listquery).then(response=>{
        this.todos=response.data.todos
      })
      return this.todos

    },
    toggleTodo(val) {
      console.log('toggleTodo',this.todos.length)
      // val.done = !val.done
      // this.setLocalStorage()
    },
    handleDel(todo) {
      delTodo(todo).then(response=>{
        this.todos=response.data.todos
      })
    },
    handleEdit({ todo, value }) {
      // todo.text = value
      this.setLocalStorage()
      const param={todo,value}
      editTodo(todo).then(response=>{
        this.todos.text=response.todos
      })
    },
    clearCompleted() {
      // this.todos = this.todos.filter(todo => !todo.done)
      // this.setLocalStorage()
      const todo={visibility:"completed"}
      editTodo(todo).then(response=>{
         this.todos.text=response.todos
      })
    },
    toggleAll({ done }) {

    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
