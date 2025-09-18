     // Éléments du DOM
        const editor = document.getElementById('editor');
        const preview = document.getElementById('preview');
        const toggleUploadBtn = document.getElementById('toggle-upload');
        const uploadContainer = document.getElementById('upload-container');
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const copyMarkdownBtn = document.getElementById('copy-markdown');
        const downloadMarkdownBtn = document.getElementById('download-markdown');
        const exportHtmlBtn = document.getElementById('export-html-btn');
        const exportPopup = document.getElementById('export-popup');
        const closePopupBtn = document.querySelector('.close-popup');
        const htmlContentArea = document.getElementById('html-content');
        const copyHtmlBtn = document.getElementById('copy-html-btn');
        const downloadHtmlBtn = document.getElementById('download-html-btn');
        const clearEditorBtn = document.getElementById('clear-editor');
        
        clearEditorBtn.addEventListener('click', function() {
            if (confirm('Voulez-vous vraiment effacer tout le contenu de l’éditeur ?')) {
                editor.value = '';
                updatePreview();
            }
        });


        // Initialisation de markdown-it
        const md = window.markdownit({
            html: true,
            breaks: true,
            linkify: true,
            typographer: true
        });
        
        // Utilisation du plugin emoji si disponible
        if (window.markdownitEmoji) {
            md.use(window.markdownitEmoji);
        }

        // Fonction pour mettre à jour l'aperçu
        function updatePreview() {
            const markdownContent = editor.value;
            const htmlContent = md.render(markdownContent);
            preview.innerHTML = htmlContent;
        }

        // Fonction pour charger un contenu par défaut
        function loadDefaultContent() {
            editor.value = `# Complete Markdown Guide

## Basic Text Formatting

### Demonstration of All Features

Normal text is simply written like this.

*Italic text* or *another way to italicize*

**Bold text** or **another way to bold**

***Bold and italic text***

~Highlighted text~

[HTML](https://en.wikipedia.org/wiki/HTML) is the language of the web.

**Markdown** is a lightweight markup language created in 2004.

\`Inline code like this\`

\`\`\`python
def hello_world():
    print("Hello, World!")
    return True
\`\`\`

> Single-line quote

>"Life is a mystery to be lived, not a problem to be solved" -- Gandhi

Task list:
- [ ] Task to do
- [x] Completed task
- [X] Another completed task

Bulleted list:
- First item
- Second item
  - Sub-item
- Third item

Numbered list:
1. First step
2. Second step
3. Final step

1. Lorem ipsum dolor sit amet
1. Consectetur adipiscing elit
1. Integer molestie lorem at massa
1. Facilisis in pretium nisl aliquet

[Link to Google](https://www.google.com)

https://www.example.com

![Image description](https://example.com/image.jpg)

---

~~Strikethrough text~~

## Emoji Demonstration :smiley:

Here are some emojis:
- :joy: - Laughing out loud
- :heart: - Heart
- :thumbsup: - Thumbs up
- :cake: - Cake

| Option | Description |
| ------ | ----------- |
| data   | path to data files |
| engine | engine to be used  |
| ext    | extension to be used |

| Option | Description |
| :-: | :-: |
| data   | path to data files |
| engine | engine to be used  |
| ext    | extension to be used |

| Option | Description |
| -: | -: |
| data   | path to data files |
| engine | engine to be used  |
| ext    | extension to be used |

`;
            updatePreview();
        }

        // Événement pour la mise à jour de l'aperçu lors de la saisie
        editor.addEventListener('input', updatePreview);

        // Toggle pour le conteneur de téléversement
        toggleUploadBtn.addEventListener('click', function() {
            if (uploadContainer.style.display === 'block') {
                uploadContainer.style.display = 'none';
            } else {
                uploadContainer.style.display = 'block';
            }
        });

        // Événement pour le clic sur la zone de dépôt
        dropZone.addEventListener('click', function() {
            fileInput.click();
        });

        // Gestion du téléversement de fichier
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                editor.value = e.target.result;
                updatePreview();
                uploadContainer.style.display = 'none';
            };
            reader.readAsText(file);
        });

        // Gestion du drag & drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, function() {
                dropZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, function() {
                dropZone.classList.remove('dragover');
            });
        });

        dropZone.addEventListener('drop', function(e) {
            const file = e.dataTransfer.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    editor.value = e.target.result;
                    updatePreview();
                    uploadContainer.style.display = 'none';
                };
                reader.readAsText(file);
            }
        });

        // Copier le contenu Markdown
        copyMarkdownBtn.addEventListener('click', function() {
            editor.select();
            document.execCommand('copy');
            alert('Contenu copié dans le presse-papiers !');
        });

        // Télécharger le contenu Markdown
        downloadMarkdownBtn.addEventListener('click', function() {
            const blob = new Blob([editor.value], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // Afficher le popup d'export HTML
        exportHtmlBtn.addEventListener('click', function() {
            htmlContentArea.value = preview.innerHTML;
            exportPopup.style.display = 'block';
        });

        // Fermer le popup
        closePopupBtn.addEventListener('click', function() {
            exportPopup.style.display = 'none';
        });

        // Fermer le popup en cliquant en dehors
        window.addEventListener('click', function(event) {
            if (event.target === exportPopup) {
                exportPopup.style.display = 'none';
            }
        });

        // Copier le contenu HTML
        copyHtmlBtn.addEventListener('click', function() {
            htmlContentArea.select();
            document.execCommand('copy');
            alert('HTML copié dans le presse-papiers !');
        });

        // Télécharger le contenu HTML
        downloadHtmlBtn.addEventListener('click', function() {
            const htmlContent = `<div class="markdown-body">
${preview.innerHTML}
</div>`;
            
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // Charger le contenu par défaut au démarrage
        loadDefaultContent();