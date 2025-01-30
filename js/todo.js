// import
import { getDate, getTime } from '/js/date.js'
import { updateCategory } from '/js/category.js'

export function addTodo() {
	// selector
	let filterActived = document.querySelector('.category-filter >  *.active').value
	let filterBtnMatch = document.querySelector(`.category-filter >  *[value="${newCategory.value.toLowerCase()}"]`)

	// if input todo exist
	if (inputTodo.value.trim()) {
		// get todolist from localStorage
		let TodoLists = JSON.parse(localStorage.getItem('todolist')) || []

		let item = {
			todo: inputTodo.value.trim(),
			category: newCategory.value,
			date: getDate(),
			time: getTime()
		}

		// save TodoLists using localStorage
		TodoLists.unshift(item)
		localStorage.setItem('todolist', JSON.stringify(TodoLists))

		// change inputTodo placeholder & value
		inputTodo.placeholder = inputTodo.value.trim()
		inputTodo.value = ''

		// create element todolist
		let elemTodo = document.createElement('div')
		elemTodo.innerHTML = `
			<input type="checkbox"/>
			<span class="todo">${item.todo}</span>
			<div class="grup-buttons">
				<button class="edit-todo fal fa-pencil"></button>
				<button class="remove-todo fal fa-trash-alt"></button>
			</div>`

		// add classList
		// and quickly remove to get the transition
		elemTodo.classList.add('item-todo', 'new')
		setTimeout(() => elemTodo.classList.remove('new'), 0)

		// if filter button active equals with value of newCategory
		if (filterActived === newCategory.value) {
			// add element todolist to todolist container
			toDoList.prepend(elemTodo)
		}
		// if filter button match with value of newCategory is exist
		else if (filterBtnMatch) {
			// get count of new item todolist match with value of newCategory
			const newCount = parseInt(filterBtnMatch.getAttribute('new-count')) || 0

			// and update value plus 1
			filterBtnMatch.setAttribute('new-count', `${newCount + 1}`)
		}
		// if filter button match with value of newCategory is not exist
		else if (!filterBtnMatch) {
			// run updateCategory for add new category filter
			updateCategory(newCategory.value)

			// re declaration filterBtnMatch after update category
			filterBtnMatch = document.querySelector(`.category-filter >  *[value="${newCategory.value.toLowerCase()}"]`)

			// get count of new item todolist match with value of newCategory
			const newCount = parseInt(filterBtnMatch.getAttribute('new-count')) || 0

			// and update value plus 1
			filterBtnMatch.setAttribute('new-count', `${newCount + 1}`)
		}

		action(elemTodo)
	}
}

export function displayTodo(categoryName) {
	// get todolist from localStorage
	let TodoLists = JSON.parse(localStorage.getItem('todolist')) || []

	// remove innerHTML of toDoList element
	toDoList.innerHTML = ''

	// if categoryName equal with 'all', categoryName change to undefined to display all not filtered TodoLists
	if (categoryName === 'all') categoryName = undefined
	// if categoryName exist, filter TodoLists using categoryName
	else if (categoryName) TodoLists = TodoLists.filter(todo => todo.category === categoryName)

	// forEach to iteration TodoLists
	TodoLists.forEach(item => {
		const elemTodo = document.createElement('div')
		elemTodo.classList.add('item-todo')
		elemTodo.innerHTML = `
			<input type="checkbox" />
			<span class="todo">${item.todo}</span>
			<div class="grup-buttons">
				<button class="edit-todo fal fa-pencil"></button>
				<button class="remove-todo fal fa-trash-alt"></button>
			</div>`
		toDoList.appendChild(elemTodo)

		action(elemTodo)
	})
}

function action(elemTodo) {
	// selector
	const removeBtn = elemTodo.querySelector('.remove-todo')
	const editBtn = elemTodo.querySelector('.edit-todo')

	removeBtn.addEventListener('click', () => removeTodo(removeBtn))
}

export function removeTodo(btn) {
	// get parent element of the button
	const elemTodo = btn.parentElement.parentElement

	// add class removed
	// wait until animation finished then remove element
	elemTodo.classList.add('removed')
	setTimeout(() => (elemTodo.outerHTML = ''), 1000)
}
