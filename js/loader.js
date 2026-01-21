async function loadEntries(limit = null) {
    const response = await fetch('data.json');
    const entries = await response.json();

    const entriesToShow = limit ? entries.slice(-limit) : entries;

    const container = document.getElementById('entries-container');
    container.innerHTML = ''; // limpiar
    entriesToShow.forEach(entry => {
        const div = document.createElement('div');
        div.classList.add('entry');

        div.innerHTML = `
      <img src="${entry.img}" alt="${entry.title}" />
      <button class="preview-btn">Ver</button>
    `;

        div.querySelector('.preview-btn').addEventListener('click', () => {
            openPreview(entry.html);
        });

        container.appendChild(div);
    });
}

function openPreview(htmlPath) {
    fetch(htmlPath)
        .then(res => res.text())
        .then(data => {
            // Crear modal
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">Cerrar</button>
            <div class="rendered-container"></div>
            <h3>HTML:</h3>
            <pre><code>${escapeHtml(data)}</code></pre>
            <div class="buttons">
                <button class="copy-btn">Copiar HTML</button>
                <button class="download-btn">Descargar HTML</button>
            </div>
        </div>
      `;
            document.body.appendChild(modal);

            const renderedDiv = modal.querySelector('.rendered-container');
            renderedDiv.innerHTML = data;

            modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
            modal.querySelector('.copy-btn').addEventListener('click', () => {
                navigator.clipboard.writeText(data);
                alert('HTML copiado al portapapeles');
            });
            modal.querySelector('.download-btn').addEventListener('click', () => {
                downloadFile(htmlPath, data);
            });
        });
}


function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.split('/').pop();
    link.click();
    URL.revokeObjectURL(link.href);
}


async function loadAllEntries() {
    const response = await fetch('data.json');
    const entries = await response.json();

    const container = document.getElementById('entries-container');
    container.innerHTML = '';

    entries.reverse().forEach(entry => {
        const div = document.createElement('div');
        div.classList.add('entry');
        div.innerHTML = `
      <img src="${entry.img}" alt="${entry.title}" />
      <button class="preview-btn">Ver</button>
    `;
        div.querySelector('.preview-btn').addEventListener('click', () => {
            openPreview(entry.html);
        });
        container.appendChild(div);
    });
}
