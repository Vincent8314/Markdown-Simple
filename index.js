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
            editor.value = `# Guide complet du Markdown

## Formatage de texte basique

### Démonstration de toutes les fonctionnalités

Le texte normal s'écrit simplement comme ceci.

*Texte en italique* ou *autre façon en italique*

**Texte en gras** ou **autre façon en gras**

***Texte en gras et italique***

~Texte surligné~

[HTML](https://fr.wikipedia.org/wiki/HTML) est le langage du web.

**Markdown** est un langage de balisage léger créé en 2004.

\`Code inline comme ceci\`

\`\`\`python
def hello_world():
    print("Hello, World!")
    return True
\`\`\`

> Citation simple sur une ligne

>"La vie est un mystère qu'il faut vivre, et non un problème à résoudre" -- Gandhi

Liste de tâches :
- [ ] Tâche à faire
- [x] Tâche terminée
- [X] Autre tâche terminée


Liste à puces :
- Premier élément
- Deuxième élément
  - Sous-élément
- Troisième élément

Liste numérotée :
1. Première étape
2. Deuxième étape
3. Dernière étape

1. Lorem ipsum dolor sit amet
1. Consectetur adipiscing elit
1. Integer molestie lorem at massa
1. Facilisis in pretium nisl aliquet

[Lien vers Google](https://www.google.com)

https://www.example.com

![Description d'une image](https://example.com/image.jpg)

---

~~Texte barré~~

## Emoji Démonstration :smiley:

Voici quelques emoji :
- :joy: - Rire aux larmes
- :heart: - Cœur
- :thumbsup: - Pouce en l'air
- :cake: - Gâteau

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