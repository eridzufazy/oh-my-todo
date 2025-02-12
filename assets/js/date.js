export function getDate() {
	const today = new Date()
	const date = String(today.getDate()).padStart(2, '0')
	const month = String(today.getMonth() + 1).padStart(2, '0')
	const year = today.getFullYear()

	return `${year}-${month}-${date}`
}

export function getTime() {
	const today = new Date()
	const hours = String(today.getHours()).padStart(2, '0')
	const minutes = String(today.getMinutes()).padStart(2, '0')
	const seconds = String(today.getSeconds()).padStart(2, '0')

	return `${hours}:${minutes}:${seconds}`
}

export function howManyAgo(timeBegin) {
	const now = new Date()
	const timeDifference = now - timeBegin
	const plural = a => (a > 1 ? 's' : '')

	const seconds = Math.floor(timeDifference / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)
	const weeks = Math.floor(days / 7)
	const years = now.getFullYear() - timeBegin.getFullYear()
	const months = years * 12 + (now.getMonth() - timeBegin.getMonth())

	if (years > 0) return `${years} year${plural(years)} ago`
	else if (months > 0) return `${months} month${plural(months)} ago`
	else if (weeks > 0) return `${weeks} week${plural(weeks)} ago`
	else if (days > 0) return `${days} day${plural(days)} ago`
	else if (hours > 0) return `${hours} hour${plural(hours)} ago`
	else if (minutes > 0) return `${minutes} minute${plural(minutes)} ago`
	else if (seconds > 0) return `${seconds} second${plural(seconds)} ago`
	else return 'just now'
}

export function printToday($targetParent) {
	let today = new Date()
	let date = today.getDate()
	let month = today.toLocaleString('en-US', { month: 'long' })
	let year = today.getFullYear()

	$targetParent.innerHTML = `${month} ${date} ${year}`
}

export function printGreeting($targetParent) {
	let clock = new Date().getHours()
	let greeting = 'good '

	if (clock < 5) greeting += 'Midnight'
	else if (clock < 6) greeting += 'Early Morning'
	else if (clock < 12) greeting += 'Morning'
	else if (clock < 15) greeting += 'Afternoon'
	else if (clock < 18) greeting += 'Late Afternoon'
	else if (clock < 20) greeting += 'Evening'
	else if (clock < 24) greeting += 'Night'

	$targetParent.innerHTML = greeting
}
