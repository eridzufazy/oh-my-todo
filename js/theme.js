export function changeTheme(e) {
	if (e) {
		const theme = e.target.getAttribute('value')
		document.querySelector('html').style.colorScheme = theme
		localStorage.setItem('theme', theme)
		return
	}

	const themeSaved = localStorage.getItem('theme') || 'dark'
	document.querySelector('html').style.colorScheme = themeSaved
}
