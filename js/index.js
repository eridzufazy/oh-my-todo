// import
import { addTodo, displayTodo, removeTodo } from '/js/todo.js'
import { changeTheme } from '/js/theme.js'
import { updateCategory } from '/js/category.js'

// event listener
addToDoBtn.addEventListener('click', addTodo)
darkBtn.addEventListener('click', e => changeTheme(e))
lightBtn.addEventListener('click', e => changeTheme(e))

// run
displayTodo()
changeTheme()
updateCategory()

// console.log(howManyAgo(new Date('2025-01-25T22:00:00')))
