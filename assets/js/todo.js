// import
import { getDate, getTime } from './date.js'
import { updateCategory } from './category.js'

export function addTodo() {
	// selector
	const $filterActived = document.querySelector('.category-filter >  *.active').value
	const $inputCategory = document.getElementById('inputCategory')
	let $filterBtnMatch = document.querySelector(`.category-filter >  *[value="${$inputCategory.value.toLowerCase()}"]`)
	const $inputTodo = document.getElementById('inputTodo')
	const $toDoList = document.getElementById('toDoList')

	// if input todo exist
	if ($inputTodo.value.trim()) {
		// get todolist from localStorage
		let todoLists = JSON.parse(localStorage.getItem('todolist')) || []
		let id = todoLists[0] ? todoLists[0].id + 1 : 1

		let Item = {
			id: id,
			completePercentage: 0,
			todo: $inputTodo.value.trim(),
			category: $inputCategory.value,
			date: getDate(),
			time: getTime()
		}

		// reset the value of inputTodo
		$inputTodo.value = ''

		// save TodoLists using localStorage
		todoLists.unshift(Item)
		localStorage.setItem('todolist', JSON.stringify(todoLists))

		// create element todolist
		let $elemTodo = document.createElement('div')
		$elemTodo.innerHTML = `
			<input type="checkbox"/>
			<li class="todo">${Item.todo}</li>
			<div class="grup-buttons">
				<button class="edit-todo fal fa-pencil"></button>
				<button class="remove-todo fal fa-trash-alt"></button>
			</div>`

		// set atribute id todolist
		$elemTodo.setAttribute('todoId', `${id}`)

		// add classList
		// and quickly remove to get the transition
		$elemTodo.classList.add('item-todo', 'new')
		setTimeout(() => $elemTodo.classList.remove('new'), 0)

		// if filter button active equals with value of inputCategory
		if ($filterActived === $inputCategory.value) {
			// add element todolist to todolist container
			$toDoList.prepend($elemTodo)
		}
		// if filter button match with value of inputCategory is exist
		else if ($filterBtnMatch) {
			// get count of new item todolist match with value of inputCategory
			const newCount = parseInt($filterBtnMatch.getAttribute('new-count')) || 0

			// and update value plus 1
			$filterBtnMatch.setAttribute('new-count', `${newCount + 1}`)
		}
		// if filter button match with value of inputCategory is not exist
		else if (!$filterBtnMatch) {
			// run updateCategory for add new category filter
			updateCategory($inputCategory.value)

			// re declaration filterBtnMatch after update category
			$filterBtnMatch = document.querySelector(`.category-filter >  *[value="${$inputCategory.value.toLowerCase()}"]`)

			// get count of new item todolist match with value of inputCategory
			const newCount = parseInt($filterBtnMatch.getAttribute('new-count')) || 0

			// and update value plus 1
			$filterBtnMatch.setAttribute('new-count', `${newCount + 1}`)
		}

		action($elemTodo)
	}
}

export function displayTodo(categoryName) {
	//selector
	const $toDoList = document.getElementById('toDoList')

	// get todolist from localStorage
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	// remove innerHTML of toDoList element
	$toDoList.innerHTML = ''

	// if categoryName equal with 'all', categoryName change to undefined to display all, not filtered todoLists
	if (categoryName === 'all') categoryName = undefined
	// if categoryName exist, filter TodoLists using categoryName
	else if (categoryName) todoLists = todoLists.filter(todo => todo.category === categoryName)

	// forEach to iteration TodoLists
	todoLists.forEach(item => {
		const $elemTodo = document.createElement('div')
		$elemTodo.setAttribute('todoId', `${item.id}`)
		$elemTodo.classList.add('item-todo')
		$elemTodo.innerHTML = `
			<input type="checkbox" />
			<li class="todo">${item.todo}</li>
			<div class="grup-buttons">
				<button class="edit-todo fal fa-pencil"></button>
				<button class="remove-todo fal fa-trash-alt"></button>
			</div>`
		$toDoList.appendChild($elemTodo)

		item.completePercentage == 100 ? $elemTodo.querySelector('input[type="checkbox"]').setAttribute('checked', '') : null

		action($elemTodo)
	})
}

function action($elemTodo) {
	// selector
	const $removeBtn = $elemTodo.querySelector('.remove-todo')
	const $editBtn = $elemTodo.querySelector('.edit-todo')
	const $checkBtn = $elemTodo.querySelector('input[type="checkbox"]')

	$removeBtn.addEventListener('click', () => removeTodo($elemTodo))
	$editBtn.addEventListener('click', () => editTodo($elemTodo))
	$checkBtn.addEventListener('change', () => completeTodo($elemTodo, $checkBtn))
}

function removeTodo($elemTodo) {
	// get todolist from localStorage
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	// add class removed
	// wait until animation finished then remove element
	$elemTodo.classList.add('removed')
	setTimeout(() => ($elemTodo.innerHTML = ''), 1000)

	// remove item from localStorage
	todoLists = todoLists.filter(item => item.id != $elemTodo.getAttribute('todoId'))

	// set new TodoLists without removed item
	localStorage.setItem('todolist', JSON.stringify(todoLists))
}

function completeTodo($elemTodo, $checkBtn) {
	// get todolist from localStorage
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	// update completePercentage
	todoLists.map(item => {
		if (item.id == $elemTodo.getAttribute('todoId')) {
			if ($checkBtn.checked) item.completePercentage = 100
			else item.completePercentage = 0
		}
	})

	// set new TodoLists with updated completePercentage
	localStorage.setItem('todolist', JSON.stringify(todoLists))
}

function editTodo($elemTodo) {
	const $inputTodoDetail = document.querySelector('#inputTodoDetail')
	const $inputCategoryDetail = document.querySelector('#inputCategoryDetail')
	const $popUp = document.getElementById('popUp')
	const $body = document.body

	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []
	todoLists = todoLists.filter(item => item.id == $elemTodo.getAttribute('todoId'))

	console.log(todoLists)

	$inputTodoDetail.value = todoLists[0].todo
	$inputCategoryDetail.value = todoLists[0].category

	document.addEventListener('click', e => {
		if (e.target === $popUp) {
			$popUp.style.display = 'none'
			$body.style.overflow = 'scroll'
		}
	})

	$popUp.style.display = 'flex'
	$body.style.overflow = 'hidden'
}
