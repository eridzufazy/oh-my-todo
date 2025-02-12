// import
import { addTodo, displayTodo, checkRemindMe } from './todo.js'
import { changeTheme } from './theme.js'
import { updateCategory } from './category.js'
import { typeWriter } from './typing-effect.js'
import { printToday, printGreeting, getDate, getTime } from './date.js'

// selector
const $addToDoBtn = document.getElementById('addToDoBtn')
const $darkBtn = document.getElementById('darkBtn')
const $lightBtn = document.getElementById('lightBtn')
const $userName = document.getElementById('userName')
const $today = document.querySelector('.today b')
const $greeting = document.querySelector('.greeting')
const $remindMe = document.getElementById('remindMe')
const $inputDate = document.getElementById('inputDate')
const $inputTime = document.getElementById('inputTime')

// event listener
$addToDoBtn.addEventListener('click', addTodo)
$darkBtn.addEventListener('click', e => changeTheme(e))
$lightBtn.addEventListener('click', e => changeTheme(e))
$remindMe.addEventListener('change', e => checkRemindMe($remindMe, $inputDate, $inputTime))

// set default value
$inputDate.value = getDate()
$inputTime.value = getTime()

// run
displayTodo()
changeTheme()
updateCategory()
printToday($today)
printGreeting($greeting)
checkRemindMe($remindMe, $inputDate, $inputTime)

// wait then run
setTimeout(typeWriter, 2000)

// register service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('assets/js/service-worker.js')
			.then(reg => console.log('Service Worker registered!', reg))
			.catch(err => console.log('Service Worker registration failed:', err))
	})
}
