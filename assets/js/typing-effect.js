const cursorBlink = document.querySelector('.cursor')
const textContainer = document.getElementById('userName')
const typingSpeed = 1000

let username = localStorage.getItem('username') || prompt('enter your name : ') || 'have a nice day'
let i = 0

localStorage.setItem('username', username)
textContainer.textContent = ''

cursorBlink.addEventListener('click', () => {
	username = prompt('enter your name : ') || username
	localStorage.setItem('username', username)
	textContainer.textContent = ''
	i = 0
	setTimeout(typeWriter, 2000)
})

export function typeWriter() {
	if (i < 40) {
		textContainer.textContent += username.charAt(i)
		i++
		setTimeout(typeWriter, Math.random() * typingSpeed)
	}
}
