const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
        });
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Hubo un error al cerrar la sesión');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});