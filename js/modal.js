// Función para abrir GitHub en nueva pestaña
function openGitHub(url) {
    window.open(url, '_blank');
}

// Función para abrir el modal o GitHub
function openModal(type, repo) {
    if (type === 'readme') {
        // Redirigir directamente a GitHub en lugar de intentar cargar el README
        const githubUrl = `https://github.com/${repo}`;
        window.open(githubUrl, '_blank');
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('contentModal');
    if (modal && event.target == modal) {
        modal.style.display = 'none';
    }
}