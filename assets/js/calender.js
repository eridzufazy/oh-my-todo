export function getCalendar(year, month) {
	// create an array to store the results
	let calendar = []

	// Get the number of days in a given month
	let daysInMonth = new Date(year, month, 0).getDate()

	// looping daysInMonth to get day
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month - 1, day)
		const dayName = date.toDateString()
		calendar.push({ date: day, dayName, thisMonth: false })
	}

	return calendar
}

export function getOverCalendar(year, month) {
	let prevMonth = getCalendar(month === 1 ? year - 1 : year, month === 1 ? 12 : month - 1)
	let nextMonth = getCalendar(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
	let thisMonth = getCalendar(year, month)

	let daysNameOnWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
	let totalPrevMonth = 0
	let overCalendar = []
	let prevMonthShow = []
	let nextMonthShow = []

	// change this month true
	thisMonth.map(item => (item.thisMonth = true))

	// looping daysNameOnWeek to get totalPrevMonth
	for (let i = 0; i < daysNameOnWeek.length; i++) if (daysNameOnWeek[i] === thisMonth[0].dayName.replace(/\s.*/, '').toLowerCase()) totalPrevMonth = i

	let totalRow = Math.ceil((thisMonth.length + totalPrevMonth) / 7)
	let totalCell = totalRow * 7
	let totalNextMonth = totalCell - thisMonth.length - totalPrevMonth

	// looping for push item value of day in previous month to show
	for (let i = prevMonth[prevMonth.length - 1].date; i > prevMonth[prevMonth.length - 1].date - totalPrevMonth; i--) prevMonthShow.push(prevMonth[i - 1])

	// looping for push item value of day in next month to show
	for (let i = 0; i < totalNextMonth; i++) nextMonthShow.push(nextMonth[i])

	// combine prevMonthShow, thisMonth, and nextMonthShow on overCalendar
	overCalendar = [...prevMonthShow.reverse(), ...thisMonth, ...nextMonthShow]

	return overCalendar
}

// console.log(getOverCalendar(2025, 1))

export function printDates(year, month, $targetParent) {
	const overCalendar = getOverCalendar(year, month)

	for (let i = 0; i < overCalendar.length; i++) {
		$targetParent.innerHTML += `<label class="date ${overCalendar[i].thisMonth ? 'this-month' : null}">${overCalendar[i].date}<input type="radio" name="dates" hidden /></label>`
	}
}
