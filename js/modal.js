// Función para abrir el modal
function openModal(type, url) {
    const modal = document.getElementById('contentModal');
    const modalBody = document.getElementById('modalBody');
    
    // Limpiar contenido anterior
    modalBody.innerHTML = '';
    
    if (type === 'readme') {
        // Cargar README desde GitHub
        const repoUrl = url.replace('https://github.com/', '').replace('.git', '');
        const rawUrl = `https://raw.githubusercontent.com/${repoUrl}/main/README.md`;
        
        fetch(rawUrl)
            .then(response => response.text())
            .then(data => {
                // Convertir Markdown a HTML simple
                const htmlContent = markdownToHtml(data);
                modalBody.innerHTML = htmlContent;
                modal.style.display = 'block';
            })
            .catch(error => {
                modalBody.innerHTML = `
                    <div style="padding: 20px; text-align: center;">
                        <p>No se pudo cargar el README.</p>
                        <a href="${url}" target="_blank" class="btn btn-primary" style="margin-top: 20px;">
                            Abrir en GitHub
                        </a>
                    </div>
                `;
                modal.style.display = 'block';
            });
    } 
    else if (type === 'notebook') {
        // Abrir notebook en GitHub o nbviewer
        const notebookUrl = url.includes('.ipynb') 
            ? url.replace('github.com', 'nbviewer.jupyter.org')
            : `${url}/blob/main/notebook.ipynb`;
        
        modalBody.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2>📓 Notebook</h2>
                <p>El notebook se abrirá en una nueva pestaña.</p>
                <a href="${notebookUrl}" target="_blank" class="btn btn-secondary" style="margin-top: 20px; display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, var(--accent-gold), #c9a961); color: #0f0f0f; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Abrir Notebook
                </a>
                <a href="${url}" target="_blank" class="btn btn-primary" style="margin-top: 20px; display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, var(--accent-blue), #00b8d4); color: #0f0f0f; border-radius: 8px; text-decoration: none; font-weight: 600; margin-left: 10px;">
                    Ver en GitHub
                </a>
            </div>
        `;
        modal.style.display = 'block';
    }
    else if (type === 'presentation') {
        // Abrir presentación
        modalBody.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2>📊 Presentación</h2>
                <p>La presentación se abrirá en una nueva pestaña.</p>
                <a href="${url}" target="_blank" class="btn btn-tertiary" style="margin-top: 20px; display: inline-block; padding: 12px 24px; background: rgba(102, 126, 234, 0.15); color: #667eea; border: 1px solid #667eea; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Abrir Presentación
                </a>
            </div>
        `;
        modal.style.display = 'block';
    }
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('contentModal');
    modal.style.display = 'none';
}

// Función simple para convertir Markdown a HTML
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Títulos
    html = html.replace(/^### (.*?)$/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gim, '<h1>$1</h1>');
    
    // Negrita
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Cursiva
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Listas
    html = html.replace(/^\* (.*?)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    
    // Enlaces
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">$1</a>');
    
    // Párrafos
    html = html.replace(/\n\n/gim, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Bloques de código
    html = html.replace(/```(.*?)```/gs, '<pre style="background: #1a1a1a; padding: 15px; border-radius: 8px; overflow-x: auto; margin: 15px 0;"><code style="color: #00d4ff;">$1</code></pre>');
    
    return `
        <div style="padding: 30px; max-height: 80vh; overflow-y: auto; text-align: left;">
            ${html}
        </div>
    `;
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('contentModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}