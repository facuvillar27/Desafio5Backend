async function postLogin(email, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    console.log(data)
    if (data.message === 'Login OK') {
        window.location.href = '/views/products'
    } else {
        alert('Usuario o contraseña incorrecta')
    }
}

const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    postLogin(email, password)
})

document.addEventListener('DOMContentLoaded', () => {
    const githubButton = document.getElementById('github-button')
    githubButton.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = '/api/sessions/github'
    })
}
)
