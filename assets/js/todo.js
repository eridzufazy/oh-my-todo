// import
import { getDate, getTime, howManyAgo } from './date.js'
import { updateCategory } from './category.js'

export function addTodo() {
	// selector
	const $filterActived = document.querySelector('.category-filter > *.active')
	const $inputCategory = document.getElementById('inputCategory')
	const $inputTodo = document.getElementById('inputTodo')
	const $toDoList = document.getElementById('toDoList')
	const $inputDate = document.getElementById('inputDate')
	const $inputTime = document.getElementById('inputTime')
	const $remindMe = document.getElementById('remindMe')

	// Make sure the input is filled in
	const todoText = $inputTodo.value.trim()
	const categoryText = $inputCategory.value.trim()
	if (!todoText || !categoryText) return // Hentikan jika input kosong

	// Get todolist from localStorage
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []
	const id = todoLists.length > 0 ? todoLists[0].id + 1 : 1

	// Create a new todo object
	const newTodo = {
		id,
		completePercentage: 0,
		textTodo: todoText,
		category: categoryText,
		dateCreated: getDate(),
		timeCreated: getTime(),
		subTask: [],
		dateRemindMe: $remindMe.checked && $inputDate.value,
		timeRemindMe: $remindMe.checked && $inputTime.value
	}

	// Save new todo to localStorage
	todoLists.unshift(newTodo)
	localStorage.setItem('todolist', JSON.stringify(todoLists))

	// Reset input values
	setTimeout(() => {
		$inputCategory.value = ''
		$inputTodo.value = ''
		$remindMe.checked = false
		$inputDate.value = getDate()
		$inputTime.value = getTime()
	}, 10)

	// Create a new todo element
	const $elemTodo = document.createElement('div')
	$elemTodo.innerHTML = `
    <div class="wrapper">
        <input type="checkbox" class="check-todo"/>
        <li class="todo">${newTodo.textTodo}</li>
        <div class="grup-buttons">
            <button class="edit-todo fal fa-pencil"></button>
            <button class="remove-todo fal fa-trash-alt"></button>
        </div>
    </div>
    `

	$elemTodo.setAttribute('data-id', `${id}`)
	$elemTodo.classList.add('item-todo', 'new')
	setTimeout(() => $elemTodo.classList.remove('new'), 0)

	// Get filter buttons that match the input category (use lower case for matching)
	const lowerCategory = categoryText.toLowerCase()
	let $filterBtnMatch = document.querySelector(`.category-filter > *[value="${lowerCategory}"]`)

	// Logic of adding elements based on active filters and categories
	if ($filterActived.value === categoryText) {
		// If the active filter is the same as the input category, add it directly to the todolist.
		$toDoList.prepend($elemTodo)
	} else if ($filterBtnMatch) {
		// If a filter button with that category exists,
		// update the new-count attribute and, if the active filter is 'all', display todo
		const newCount = parseInt($filterBtnMatch.getAttribute('new-count')) || 0
		$filterBtnMatch.setAttribute('new-count', `${newCount + 1}`)
		if ($filterActived.value === 'all') $toDoList.prepend($elemTodo)
	} else {
		// If none of the filter buttons match, add a new category.
		updateCategory(categoryText)
		// After the update, look for the filter button again.
		$filterBtnMatch = document.querySelector(`.category-filter > *[value="${lowerCategory}"]`)
		const newCount = parseInt($filterBtnMatch.getAttribute('new-count')) || 0
		$filterBtnMatch.setAttribute('new-count', `${newCount + 1}`)
		if ($filterActived.value === 'all') $toDoList.prepend($elemTodo)
	}

	action($elemTodo)
}

export function displayTodo(categoryName) {
	// selector
	const $toDoList = document.getElementById('toDoList')

	// get todolist from localStorage
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	// remove innerHTML of toDoList element
	$toDoList.innerHTML = ''

	if (categoryName) categoryName = categoryName.toLowerCase()

	// if categoryName equal with 'all', categoryName change to undefined to display all, not filtered todoLists
	if (categoryName === 'all') categoryName = undefined
	// if categoryName exist, filter TodoLists using categoryName
	else if (categoryName) todoLists = todoLists.filter(todo => todo.category.toLowerCase() === categoryName)

	// forEach to iteration TodoLists
	todoLists.forEach(item => {
		const $elemTodo = document.createElement('div')

		let subTask = ''

		if (item.subTasks) {
			item.subTasks.forEach(itemSubTask => {
				subTask += `
				<li class="sub-task" data-id="${itemSubTask.id}">
                    <input type="checkbox" class="check-sub-task" ${itemSubTask.isDone && 'checked'}/>
                    <div class="sub-task-todo">
                        <p>${itemSubTask.subTaskTodo}</p>
                    </div>
                </li>
                `
			})
		}

		$elemTodo.setAttribute('data-id', `${item.id}`)
		$elemTodo.classList.add('item-todo')

		$elemTodo.innerHTML = `
        <div class="wrapper">
            <input type="checkbox" class="check-todo"/>
            <li class="todo">${item.textTodo}</li>
            <div class="grup-buttons">
                <button class="edit-todo fal fa-pencil"></button>
                <button class="remove-todo fal fa-trash-alt"></button>
            </div>
        </div>
        <ul class="wrapper">
            ${subTask}
        </ul>
        `

		$toDoList.appendChild($elemTodo)

		const checkSubTask$ = $elemTodo.querySelectorAll('li.sub-task input[type="checkbox"]')
		checkSubTask$.forEach($checkSubTask => $checkSubTask.addEventListener('change', () => checkSubTask($checkSubTask, item.id)))

		item.completePercentage == 100 && $elemTodo.querySelector('input[type="checkbox"]').setAttribute('checked', '')

		action($elemTodo)
	})
}

function action($elemTodo) {
	// selector
	const $todo = $elemTodo.querySelector('.todo')
	const $removeBtn = $elemTodo.querySelector('.remove-todo')
	const $subTask = $elemTodo.querySelector('.wrapper:has(.sub-task)')
	const $editBtn = $elemTodo.querySelector('.edit-todo')
	const $checkBtn = $elemTodo.querySelector('input.check-todo[type="checkbox"]')

	$removeBtn.addEventListener('click', () => removeTodo($elemTodo))
	$editBtn.addEventListener('click', () => printEditTodo($elemTodo))
	$checkBtn.addEventListener('change', () => completeTodo($elemTodo, $checkBtn))
	if ($subTask) $todo.addEventListener('click', () => $subTask.classList.toggle('active'))
}

function removeTodo($elemTodo) {
	// get todolist from localStorage
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	// add class removed
	// wait until animation finished then remove element
	$elemTodo.classList.add('removed')
	setTimeout(() => ($elemTodo.innerHTML = ''), 1000)

	// remove item from localStorage
	todoLists = todoLists.filter(item => item.id != $elemTodo.getAttribute('data-id'))

	// set new TodoLists without removed item
	localStorage.setItem('todolist', JSON.stringify(todoLists))
}

function completeTodo($elemTodo, $checkBtn) {
	// get todolist from localStorage
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	// update completePercentage
	todoLists.map(item => {
		if (item.id == $elemTodo.getAttribute('data-id')) {
			if ($checkBtn.checked) item.completePercentage = 100
			else item.completePercentage = 0
		}
	})

	// set new TodoLists with updated completePercentage
	localStorage.setItem('todolist', JSON.stringify(todoLists))
}

export function printEditTodo($elemTodo) {
	// declaration
	const todoLists = JSON.parse(localStorage.getItem('todolist')) || []
	const todoId = $elemTodo.getAttribute('data-id')
	const todo = todoLists.find(item => item.id == todoId)
	const manyAgo = howManyAgo(new Date(`${todo.dateCreated}T${todo.timeCreated}`))
	const $filterActived = document.querySelector('.category-filter >  *.active')

	// exit if todo not exist
	if (!todo) return

	let subTask = ''

	let coutCompleteSubTask = Array.isArray(todo.subTasks) ? todo.subTasks.filter(item => item.isDone == true).length : 0

	if (todo.subTasks) {
		todo.subTasks.forEach(itemSubTask => {
			subTask += `
			<li class="wrapper" data-id="${itemSubTask.id}">
                <input type="checkbox" class="check-sub-task" ${itemSubTask.isDone && 'checked'}/>
                <textarea readonly="">${itemSubTask.subTaskTodo}</textarea>
                <div class="grup-buttons">
                    <button class="edit-sub-task fal fa-pencil"></button>
                    <button class="remove-sub-task fal fa-trash-alt"></button>
                </div>
            </li>
            `
		})
	}

	// template HTML
	const innerPopUp = `
    <div class="input-todo">
        <div class="container">
            <div class="wrapper">
                <textarea id="inputTodoDetail" placeholder="edit your todo.">${todo.textTodo}</textarea>
                <button id="saveTodo"><i class="fal fa-save"></i></button>
            </div>
            <div class="wrapper">
                <input type="text" id="inputCategoryDetail" placeholder="edit category" list="selectCategory" value="${todo.category}" />
            </div>
            <div class="wrapper">
                <label class="remind-me">
                    <input type="checkbox" id="remindMeEdit" ${todo.dateRemindMe ? 'checked' : ''} />remind me
                </label>
                <div>
                    <input type="date" id="inputDateEdit" value="${todo.dateRemindMe || ''}" />
                    <input type="time" id="inputTimeEdit" value="${todo.timeRemindMe || ''}" />
                </div>
            </div>
            <div class="wrapper sub-task">
                <div class="wrapper">
                    <textarea id="inputSubTask" placeholder="add sub task"></textarea>
                    <button id="addSubTask"><i class="fal fa-plus"></i></button>
                </div>
                <div class="container">
                    <div class="information">
                        <p>sub task list</p>
                        <p class="complete-percentage">${todo.completePercentage}% done <span>
                        ${coutCompleteSubTask}/${Array.isArray(todo.subTasks) ? todo.subTasks.length : '0'}</span></p>
                    </div>
                    <ul>${subTask}</ul>
                </div>
            </div>
            <div class="footer">
                <p>created ${manyAgo}</p>
            </div>
        </div>
    </div>
  `

	// create element
	const $popUp = document.createElement('section')
	$popUp.classList.add('pop-up')
	$popUp.innerHTML = innerPopUp

	// selector
	const $saveTodo = $popUp.querySelector('#saveTodo')
	const $remindMe = $popUp.querySelector('#remindMeEdit')
	const $inputDate = $popUp.querySelector('#inputDateEdit')
	const $inputTime = $popUp.querySelector('#inputTimeEdit')
	const $inputTodo = $popUp.querySelector('#inputTodoDetail')
	const $inputCategory = $popUp.querySelector('#inputCategoryDetail')
	const $inputSubTask = $popUp.querySelector('#inputSubTask')
	const $addSubTask = $popUp.querySelector('#addSubTask')
	const $subTaskContainer = $popUp.querySelector('.sub-task ul')
	const editSubTask$ = $popUp.querySelectorAll('.edit-sub-task')
	const removeSubTask$ = $popUp.querySelectorAll('.remove-sub-task')
	const checkSubTask$ = $popUp.querySelectorAll('li.wrapper input[type="checkbox"]')

	// Event listener
	$addSubTask.addEventListener('click', () => addSubTask(todo, $inputSubTask, $subTaskContainer))
	$remindMe.addEventListener('change', () => checkRemindMe($remindMe, $inputDate, $inputTime))
	editSubTask$.forEach($editSubTask => $editSubTask.addEventListener('click', () => editSubTask($editSubTask, todo.id)))
	removeSubTask$.forEach($removeSubTask => $removeSubTask.addEventListener('click', () => removeSubTask($removeSubTask, todo.id)))
	checkSubTask$.forEach($checkSubTask =>
		$checkSubTask.addEventListener('change', () => {
			checkSubTask($checkSubTask, todo.id)
			displayTodo($filterActived.value)
		})
	)

	document.addEventListener('click', function handleClose(e) {
		if (e.target === $popUp) {
			$popUp.remove()
			document.removeEventListener('click', handleClose)
		}
	})

	$saveTodo.addEventListener('click', () => {
		saveTodo($popUp, {
			id: todo.id,
			textTodo: $inputTodo.value.trim(),
			category: $inputCategory.value,
			dateCreated: todo.dateCreated,
			timeCreated: todo.timeCreated,
			dateRemindMe: $remindMe.checked && $inputDate.value,
			timeRemindMe: $remindMe.checked && $inputTime.value
		})
	})

	// run
	checkRemindMe($remindMe, $inputDate, $inputTime)

	// append
	document.body.prepend($popUp)
}

function addSubTask(todo, $inputSubTask, $subTaskContainer) {
	if (!$inputSubTask.value.trim()) return

	const $filterActived = document.querySelector('.category-filter >  *.active')
	const $infoCompletePercentage = $subTaskContainer.parentElement.querySelector('.information .complete-percentage')
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []
	const todoUpdated = todoLists.find(item => item.id == todo.id)

	const Item = {
		id: todoUpdated.subTasks && todoUpdated.subTasks.length > 0 ? todoUpdated.subTasks[0].id + 1 : 1,
		subTaskTodo: $inputSubTask.value.trim(),
		isDone: false
	}

	const $subTask = document.createElement('li')
	$subTask.classList.add('wrapper')
	$subTask.setAttribute('data-id', Item.id)
	$subTask.innerHTML = `
    <input type="checkbox" class="check-sub-task" ${Item.isDone && 'checked'}" />
    <textarea readonly="">${Item.subTaskTodo}</textarea>
    <div class="grup-buttons">
        <button class="edit-sub-task fal fa-pencil"></button>
        <button class="remove-sub-task fal fa-trash-alt"></button>
    </div>
    `
	$subTaskContainer.prepend($subTask)

	const $editSubTask = $subTask.querySelector('.edit-sub-task')
	const $removeSubTask = $subTask.querySelector('.remove-sub-task')
	const $checkSubTask = $subTask.querySelector('li.wrapper input[type="checkbox"]')

	$editSubTask.addEventListener('click', () => editSubTask($editSubTask, todo.id))
	$removeSubTask.addEventListener('click', () => removeSubTask($removeSubTask, todo.id))
	$checkSubTask.addEventListener('change', () => {
		checkSubTask($checkSubTask, todo.id)
		displayTodo($filterActived.value)
	})

	todoLists.map(item => {
		if (item.id === todo.id) item.subTasks ? item.subTasks.unshift(Item) : (item.subTasks = [Item])
	})

	localStorage.setItem('todolist', JSON.stringify(todoLists))

	// clear value
	$inputSubTask.value = ''

	// run
	displayTodo($filterActived.value)
	printCountSubTask($infoCompletePercentage, todo.id)
}

function checkSubTask($checkSubTask, todoId) {
	const $subTask = $checkSubTask.parentElement
	const $infoCompletePercentage = $subTask.parentElement.parentElement.querySelector('.information .complete-percentage')
	const todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	todoLists.map(item => {
		if (item.id == todoId) item.subTasks.forEach(itemSubTask => itemSubTask.id == $subTask.getAttribute('data-id') && (itemSubTask.isDone = $checkSubTask.checked))
	})

	const todo = todoLists.find(item => item.id == todoId)
	const countSubTask = todo.subTasks.length
	const countSubTaskDone = todo.subTasks.filter(item => item.isDone == true).length
	const completePercentage = Math.round(100 / (countSubTask / countSubTaskDone))

	todoLists.map(item => item.id == todoId && (item.completePercentage = completePercentage))

	localStorage.setItem('todolist', JSON.stringify(todoLists))

	printCountSubTask($infoCompletePercentage, todoId)
}

function printCountSubTask($infoCompletePercentage, todoId) {
	const todoLists = JSON.parse(localStorage.getItem('todolist')) || []
	const todo = todoLists.find(item => item.id == todoId)

	console.log(todoId)

	console.log(todo)

	const countSubTask = todo.subTasks.length
	const countSubTaskDone = todo.subTasks.filter(item => item.isDone == true).length
	const completePercentage = Math.round(100 / (countSubTask / countSubTaskDone))

	if ($infoCompletePercentage) {
		$infoCompletePercentage.innerHTML = `
        ${completePercentage}% done 
        <span>
            ${countSubTaskDone}/${Array.isArray(todo.subTasks) ? countSubTask : '0'}
        </span>
        `
	}
}

function removeSubTask($removeSubTask, todoId) {
	const $subTask = $removeSubTask.parentElement.parentElement
	const $infoCompletePercentage = $subTask.parentElement.parentElement.querySelector('.information .complete-percentage')
	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []

	todoLists.map(item => item.id == todoId && (item.subTasks = item.subTasks.filter(item => item.id != $subTask.getAttribute('data-id'))))

	$subTask.classList.add('removed')
	setTimeout(() => ($subTask.outerHTML = ''), 1000)

	localStorage.setItem('todolist', JSON.stringify(todoLists))

	printCountSubTask($infoCompletePercentage, todoId)
}

function editSubTask($editSubTask, todoId) {
	const $subTask = $editSubTask.parentElement.parentElement
	const $textarea = $subTask.querySelector('textarea')
	const todoLists = JSON.parse(localStorage.getItem('todolist')) || []
	const subTask = todoLists.find(item => item.id == todoId).subTasks.find(item => item.id == $subTask.getAttribute('data-id'))

	$editSubTask.classList.contains('fa-pencil') ? edit() : save()

	function edit() {
		$editSubTask.classList.remove('fa-pencil')
		$editSubTask.classList.add('fa-save')
		$textarea.readOnly = false
	}

	function save() {
		const $filterActived = document.querySelector('.category-filter >  *.active')

		$editSubTask.classList.remove('fa-save')
		$editSubTask.classList.add('fa-pencil')
		$textarea.readOnly = true

		// update the sub task content
		todoLists.map(item => {
			if (item.id == todoId) item.subTasks.forEach(itemSubTask => itemSubTask.id == $subTask.getAttribute('data-id') && (itemSubTask.subTaskTodo = $textarea.value.trim()))
		})

		localStorage.setItem('todolist', JSON.stringify(todoLists))

		displayTodo($filterActived.value)
	}
}

function saveTodo($popUp, data) {
	const $filterBtnMatch = document.querySelector(`.category-filter >  *[value="${data.category.toLowerCase()}"]`)
	const $filterActived = document.querySelector('.category-filter >  *.active')

	let todoLists = JSON.parse(localStorage.getItem('todolist')) || []
	todoLists.map(item => {
		if (item.id === data.id) {
			item.textTodo = data.textTodo
			item.dateCreated = data.dateCreated
			item.timeCreated = data.timeCreated
			item.timeRemindMe = data.timeRemindMe
			item.dateRemindMe = data.dateRemindMe
			item.category = data.category
		}
	})

	localStorage.setItem('todolist', JSON.stringify(todoLists))

	!$filterBtnMatch && updateCategory($inputCategory.value)
	displayTodo($filterActived.value)
	setTimeout(() => ($popUp.outerHTML = ''), 10)
}

export function checkRemindMe($remindMe, $inputDate, $inputTime) {
	const enable = $remindMe.checked
	$inputDate.disabled = !enable
	$inputTime.disabled = !enable
}
