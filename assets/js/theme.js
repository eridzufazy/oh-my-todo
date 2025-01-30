export function changeTheme(e) {
	if (e) {
		const theme = e.target.getAttribute('value')
		document.querySelector('html').style.colorScheme = theme
		localStorage.setItem('theme', theme)
		return
	}

	document.querySelector('html').style.colorScheme = localStorage.getItem('theme') || 'dark light'
}
