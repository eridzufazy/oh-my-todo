let username = localStorage.getItem('username') || prompt('enter your name : ') || 'have a nice day'

localStorage.setItem('username', username)

const textContainer = document.getElementById('userName')
const typingSpeed = 400
let i = 0

textContainer.textContent = ''

export function typeWriter() {
	if (i < username.length) {
		textContainer.textContent += username.charAt(i)
		i++
		setTimeout(typeWriter, Math.random() * typingSpeed)
	}
}
