// import
import { addTodo, displayTodo } from './todo.js'
import { changeTheme } from './theme.js'
import { updateCategory } from './category.js'
import { getCalendar, printDates } from './calendar.js'
import { typeWriter } from './typing-effect.js'

// selector
const $addToDoBtn = document.getElementById('addToDoBtn')
const $darkBtn = document.getElementById('darkBtn')
const $lightBtn = document.getElementById('lightBtn')
const $userName = document.getElementById('userName')
const $dates = document.getElementById('dates')

// event listener
$addToDoBtn.addEventListener('click', addTodo)
$darkBtn.addEventListener('click', e => changeTheme(e))
$lightBtn.addEventListener('click', e => changeTheme(e))

// run
displayTodo()
changeTheme()
updateCategory()
printDates(2025, 3, $dates)

// wait then run
setTimeout(typeWriter, 2000)

// register service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('assets/js/service-worker.js')
			.then(reg => alert('Service Worker registered!', reg))
			.catch(err => alert('Service Worker registration failed:', err))
	})
}

// console.log(getCalendar(2025, 2))
// console.log(howManyAgo(new Date('2025-01-25T22:00:00')))
