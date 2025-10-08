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
        const themeToggleBtn = document.getElementById('theme-toggle');

        // ===== THEME TOGGLE FUNCTIONALITY =====
        
        // Adjust body max-height based on screen size
        function adjustForScreenSize() {
            const screenHeight = window.innerHeight;
            const body = document.body;
            
            // Remove all screen size classes first
            body.classList.remove('large-screen', 'huge-screen');
            
            if (screenHeight > 2000) {
                // 4K/8K screen detected
                body.classList.add('huge-screen');
            } else if (screenHeight > 1200) {
                // 2K screen detected
                body.classList.add('large-screen');
            }
            // Normal screens get no max-height (just 100vh)
        }
        
        function detectBrowserTheme() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('reverse');
            }
        }

        function toggleTheme() {
            document.body.classList.toggle('reverse');
        }

        const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        themeMediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reverse');
            } else {
                document.body.classList.remove('reverse');
            }
        });

        themeToggleBtn.addEventListener('click', toggleTheme);
        
        // Listen for window resize to adjust for screen size
        window.addEventListener('resize', adjustForScreenSize);
        
        // Initialize on page load
        adjustForScreenSize();
        detectBrowserTheme();

        // ===== MARKDOWN EDITOR =====
        clearEditorBtn.addEventListener('click', function() {
            if (confirm('Voulez-vous vraiment effacer tout le contenu de l\'éditeur ?')) {
                editor.value = '';
                updatePreview();
            }
        });

        const md = window.markdownit({
            html: true,
            breaks: true,
            linkify: true,
            typographer: true
        });

        if (window.markdownitEmoji) {
            md.use(window.markdownitEmoji);
        }

        function updatePreview() {
            const markdownContent = editor.value;
            const htmlContent = md.render(markdownContent);
            preview.innerHTML = htmlContent;
        }

        function loadDefaultContent() {
            editor.value = `# Complete Markdown Guide

## Basic Text Formatting

Normal text is simply written like this.

*Italic text* or _another way to italicize_

**Bold text** or __another way to bold__

***Bold and italic text***

[HTML](https://en.wikipedia.org/wiki/HTML) is the language of the web.

\`Inline code like this\`

\`\`\`python
def hello_world():
    print("Hello, World!")
    return True
\`\`\`

> Single-line quote

Task list:
- [ ] Task to do
- [x] Completed task

Bulleted list:
- First item
- Second item
  - Sub-item

Numbered list:
1. First step
2. Second step
3. Final step

[Link to Google](https://www.google.com)

---

~~Strikethrough text~~

## Emoji Demonstration :smiley:

- :joy: - Laughing
- :heart: - Heart
- :thumbsup: - Thumbs up

| Option | Description |
| ------ | ----------- |
| data   | path to data files |
| engine | engine to be used  |
| ext    | extension to be used |
`;
            updatePreview();
        }

        editor.addEventListener('input', updatePreview);

        toggleUploadBtn.addEventListener('click', function() {
            uploadContainer.style.display = uploadContainer.style.display === 'block' ? 'none' : 'block';
        });

        dropZone.addEventListener('click', function() {
            fileInput.click();
        });

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

        copyMarkdownBtn.addEventListener('click', function() {
            editor.select();
            document.execCommand('copy');
            alert('Contenu copié dans le presse-papiers !');
        });

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

        exportHtmlBtn.addEventListener('click', function() {
            htmlContentArea.value = preview.innerHTML;
            exportPopup.style.display = 'block';
        });

        closePopupBtn.addEventListener('click', function() {
            exportPopup.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === exportPopup) {
                exportPopup.style.display = 'none';
            }
        });

        copyHtmlBtn.addEventListener('click', function() {
            htmlContentArea.select();
            document.execCommand('copy');
            alert('HTML copié dans le presse-papiers !');
        });

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

        loadDefaultContent()