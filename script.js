document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL PORTFOLIO STATE ---
    let currentLanguage = 'en';
    let initialSetupDone = false;
    let searchIndex = [];
    let tipsLoaded = false;
    
    // --- PORTFOLIO INITIALIZATION ---
    function initializePortfolio() {
        // --- LANGUAGE AND MODAL LOGIC ---
        const languageModal = document.getElementById('language-selection-modal');
        const languageModalCloseBtn = languageModal.querySelector('.close-modal');
        const disclaimerModal = document.getElementById('disclaimer-modal');

        window.changeLanguage = (lang) => {
            currentLanguage = lang;
            document.documentElement.lang = lang;
            
            document.querySelectorAll('[data-en]').forEach(el => {
                const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
                const isSpanInAppIcon = el.matches('.app-icon span');
                const isSimpleTextElement = el.matches('h1, h2, h3, p, label, .main-footer p, button, .store-link a, #life-tips-content p, #life-tips-content h3') && !isSpanInAppIcon;

                if (isSimpleTextElement || isSpanInAppIcon) {
                     el.textContent = text;
                }
            });

            document.querySelectorAll('[data-lang-section]').forEach(el => {
                el.style.display = el.dataset.langSection === lang ? '' : 'none';
            });
            
            document.querySelectorAll('.language-button').forEach(button => {
                button.classList.toggle('selected', button.dataset.lang === lang);
            });

            // NEW: Translate the main page title
            const pageTitleEl = document.querySelector('title');
            if (pageTitleEl) {
                const titles = {
                    en: "DedSec Project",
                    gr: "Έργο DedSec"
                };
                document.title = titles[lang];
            }

            const searchInput = document.getElementById('main-search-input');
            if (searchInput) {
                searchInput.placeholder = lang === 'gr' ? 'Αναζήτηση...' : 'Search...';
            }
        };
        
        languageModal.querySelectorAll('.language-button').forEach(button => {
            button.addEventListener('click', () => {
                changeLanguage(button.dataset.lang);
                languageModal.classList.remove('visible');
                if (!initialSetupDone) {
                    disclaimerModal.classList.add('visible');
                }
            });
        });
        
        document.getElementById('lang-switcher-btn').addEventListener('click', () => {
            if (languageModalCloseBtn) languageModalCloseBtn.style.display = '';
            languageModal.classList.add('visible');
        });

        // --- THEME SWITCHER LOGIC ---
        const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
        const themeIcon = themeSwitcherBtn.querySelector('i');
        const themeSpan = themeSwitcherBtn.querySelector('span');

        const updateThemeButton = (isLightTheme) => {
            if (isLightTheme) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                themeSpan.setAttribute('data-en', 'Light Theme');
                themeSpan.setAttribute('data-gr', 'Φωτεινό Θέμα');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                themeSpan.setAttribute('data-en', 'Dark Theme');
                themeSpan.setAttribute('data-gr', 'Σκοτεινό Θέμα');
            }
            // Re-apply language to update the button text
            changeLanguage(currentLanguage);
        };

        themeSwitcherBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeButton(isLight);
        });
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
        updateThemeButton(document.body.classList.contains('light-theme'));

        document.getElementById('accept-disclaimer').addEventListener('click', () => {
            disclaimerModal.classList.remove('visible');
            initialSetupDone = true;
        });
        document.getElementById('decline-disclaimer').addEventListener('click', () => window.location.href = 'https://www.google.com');

        document.querySelectorAll('.app-icon[data-modal], a.app-icon[target="_blank"]').forEach(icon => {
            if (icon.dataset.modal) {
                icon.addEventListener('click', () => {
                    const modalId = `${icon.dataset.modal}-modal`;
                    const modal = document.getElementById(modalId);
                    if (modal) {
                         modal.classList.add('visible');
                         if (modalId === 'certification-modal' && window.resetQuiz) {
                             window.resetQuiz();
                         }
                         if (modalId === 'life-tips-modal' && !tipsLoaded) {
                            fetchLifeTips();
                         }
                    }
                });
            }
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    modal.classList.remove('visible');
                }
            });
            const closeModalButton = modal.querySelector('.close-modal');
            if (closeModalButton) {
                closeModalButton.addEventListener('click', () => {
                    modal.classList.remove('visible');
                });
            }
        });

        const profilePic = document.querySelector('.profile-pic');
        const imageViewer = document.getElementById('image-viewer-modal');
        
        if (profilePic) {
            profilePic.addEventListener('click', () => {
                const style = window.getComputedStyle(profilePic);
                const bgImage = style.backgroundImage;
                const imageUrl = bgImage.slice(5, -2);
                imageViewer.querySelector('#expanded-img').src = imageUrl;
                imageViewer.classList.add('visible');
            });
        }

        if(imageViewer) {
            imageViewer.addEventListener('click', () => {
                imageViewer.classList.remove('visible');
            });
        }
        
        // --- MODERNIZED & SECURE COPY TO CLIPBOARD ---
        window.copyToClipboard = async (button, targetId) => {
            const codeElement = document.getElementById(targetId);
            if (!codeElement || !navigator.clipboard) return;

            try {
                await navigator.clipboard.writeText(codeElement.innerText);
                const originalText = button.textContent;
                button.textContent = (currentLanguage === 'gr') ? 'Αντιγράφηκε!' : 'Copied!';
                setTimeout(() => { button.textContent = originalText; }, 1500);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // You could add a user-facing error message here if desired
            }
        };
        
        const carousel = document.querySelector('.gym-carousel');
        if (carousel) {
            const images = carousel.querySelectorAll('.gym-clothing-images img');
            const prevBtn = carousel.querySelector('.carousel-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-btn.next');
            let currentIndex = 0;
            const totalImages = images.length;

            if (totalImages > 0) {
                const showImage = (index) => {
                    images.forEach((img, i) => {
                        img.style.display = i === index ? 'block' : 'none';
                    });
                };
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalImages - 1;
                    showImage(currentIndex);
                });
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex < totalImages - 1) ? currentIndex + 1 : 0;
                    showImage(currentIndex);
                });
                showImage(currentIndex);
            }
        }
        
        // --- SEARCH FUNCTIONALITY (ADVANCED) ---
        function buildSearchIndex() {
            searchIndex = [];
            const weights = { MODAL_BUTTON: 10, H2: 8, H3: 7, B: 5, LI: 4, CODE: 3, TIP: 2, DEFAULT: 1 };

            document.querySelectorAll('.app-icon[data-modal]').forEach(el => {
                const span = el.querySelector('span');
                if (span && el.dataset.modal) {
                    searchIndex.push({
                        en: span.getAttribute('data-en') || '', gr: span.getAttribute('data-gr') || '',
                        type: 'modal_button', target: el.dataset.modal, weight: weights.MODAL_BUTTON, element: el
                    });
                }
            });

            document.querySelectorAll('.modal-content').forEach(modal => {
                const modalId = modal.parentElement.id.replace('-modal', '');
                const title = modal.querySelector('.modal-header h2');
                if (title) {
                     searchIndex.push({
                        en: title.getAttribute('data-en') || '', gr: title.getAttribute('data-gr') || '',
                        type: 'content', target: modalId, element: title, weight: weights.H2
                    });
                }
                
                const selector = '.modal-body p, .modal-body li, .modal-body h3, .modal-body b, .modal-body code';
                modal.querySelectorAll(selector).forEach(el => {
                    const section = el.closest('[data-lang-section]');
                    if (!section) return;
                    
                    const lang = section.dataset.langSection;
                    const text = el.textContent.trim();
                    if (text.length < 4) return;

                    const existingEntry = searchIndex.find(item => item.element === el);
                    if (!existingEntry) {
                        let weight = weights.DEFAULT;
                        if (el.closest('.tip')) weight = weights.TIP;
                        if (el.tagName === 'CODE') weight = weights.CODE;
                        if (el.tagName === 'LI') weight = weights.LI;
                        if (el.tagName === 'B' || el.tagName === 'STRONG') weight = weights.B;
                        if (el.tagName === 'H3') weight = weights.H3;

                        let entry = { type: 'content', target: modalId, element: el, en: '', gr: '', weight: weight };
                        entry[lang] = text;
                        searchIndex.push(entry);
                    } else {
                        existingEntry[lang] = text;
                    }
                });
            });
        }
        
        function initializeSearch() {
            const searchInput = document.getElementById('main-search-input');
            const resultsContainer = document.getElementById('search-results-container');
            const searchContainer = document.querySelector('.search-container');

            // Function to escape special characters for use in a RegExp
            const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();
                resultsContainer.innerHTML = '';

                if (query.length < 2) {
                    resultsContainer.classList.add('hidden');
                    return;
                }
                
                const queryWords = query.split(/\s+/).filter(w => w.length > 0);
                let results = [];

                searchIndex.forEach(item => {
                    const text = (item[currentLanguage] || item['en'] || '').toLowerCase();
                    if (!text) return;
                    let score = 0;
                    if (text.includes(query)) score += 50;

                    const foundWords = new Set();
                    queryWords.forEach(word => {
                        if (text.includes(word)) {
                            score += 5;
                            foundWords.add(word);
                        }
                    });
                    
                    if (foundWords.size === queryWords.length) score += 20;
                    
                    if (score > 0) {
                        score *= item.weight;
                        results.push({ ...item, score });
                    }
                });
                
                results.sort((a, b) => b.score - a.score);

                if (results.length > 0) {
                    results.slice(0, 7).forEach(result => {
                        const itemEl = document.createElement('div');
                        itemEl.classList.add('search-result-item');
                        
                        const mainText = result[currentLanguage] || result['en'];
                        const locationText = {
                            en: `In: ${result.target.replace(/-/g, ' ')}`,
                            gr: `Σε: ${result.target.replace(/-/g, ' ')}`
                        };
                        
                        let snippet = (mainText.length > 100) ? mainText.substring(0, 100) + '...' : mainText;

                        // BUG FIX: Escape search words before creating RegExp
                        queryWords.forEach(word => {
                             const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
                             snippet = snippet.replace(regex, '<strong>$1</strong>');
                        });

                        itemEl.innerHTML = `${snippet} <small>${locationText[currentLanguage]}</small>`;
                        
                        itemEl.addEventListener('click', () => {
                            searchInput.value = '';
                            resultsContainer.classList.add('hidden');
                            const targetElement = result.type === 'modal_button' ? result.element : document.querySelector(`.app-icon[data-modal="${result.target}"]`);
                            if(targetElement){ targetElement.click(); }

                            if (result.type === 'content') {
                                setTimeout(() => {
                                    result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    result.element.classList.add('content-highlight');
                                    setTimeout(() => result.element.classList.remove('content-highlight'), 2000);
                                }, 300);
                            }
                        });
                        resultsContainer.appendChild(itemEl);
                    });
                    resultsContainer.classList.remove('hidden');
                } else {
                    const noResultEl = document.createElement('div');
                    noResultEl.classList.add('search-result-item', 'no-results');
                    noResultEl.textContent = currentLanguage === 'gr' ? 'Δεν βρέθηκαν αποτελέσματα' : 'No results found';
                    resultsContainer.appendChild(noResultEl);
                    resultsContainer.classList.remove('hidden');
                }
            });

            document.addEventListener('click', (e) => {
                if (searchContainer && !searchContainer.contains(e.target)) {
                    resultsContainer.classList.add('hidden');
                }
            });
        }
        
        function initializeScrollIndicator() {
            const scrollContainer = document.querySelector('.home-screen');
            const scrollIndicatorThumb = document.getElementById('scroll-indicator-thumb');
            if (!scrollContainer || !scrollIndicatorThumb) return;

            const handleScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollHeight <= clientHeight) {
                    scrollIndicatorThumb.style.opacity = '0';
                    return;
                }
                scrollIndicatorThumb.style.opacity = '1';
                const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
                scrollIndicatorThumb.style.transform = `translateY(${scrollPercentage * (clientHeight - scrollIndicatorThumb.clientHeight)}px)`;
            };
            scrollContainer.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);
            setTimeout(handleScroll, 100);
        }

        // Final setup steps
        if (languageModalCloseBtn) languageModalCloseBtn.style.display = 'none';
        languageModal.classList.add('visible');
        changeLanguage('en'); 
        document.querySelector('#language-selection-modal .modal-header h2').textContent = 'Choose Language / Επιλογή Γλώσσas';
        
        buildSearchIndex();
        initializeSearch();
        initializeScrollIndicator();
    }

    // --- FIXED & IMPROVED: LIFE TIPS MODAL LOGIC ---
    async function fetchLifeTips() {
        const navContainer = document.getElementById('life-tips-nav');
        const contentContainer = document.getElementById('life-tips-content');
        const GITHUB_API_URL = 'https://api.github.com/repos/dedsec1121fk/dedsec1121fk.github.io/contents/Life_Tips';
        
        navContainer.innerHTML = `<p data-en="Loading..." data-gr="Φόρτωση..."></p>`;
        changeLanguage(currentLanguage);
        
        // MAIN FIX: A map to hold translations for the filenames.
        // This makes the dynamically generated buttons translatable.
        const titleMap = {
            "How_to_Download_a_GitHub_Repository_1.html": {
                en: "How to Download a GitHub Repository",
                gr: "Πώς να Κατεβάσετε ένα Αποθετήριο GitHub"
            },
            "Coming_Soon_1.html": {
                en: "Coming Soon",
                gr: "Σύντομα Διαθέσιμο"
            }
            // Add new mappings here as you add more .html files to your repo
        };

        try {
            const response = await fetch(GITHUB_API_URL);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            
            const files = await response.json();
            navContainer.innerHTML = '';
            
            const htmlFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.html'));
            
            if (htmlFiles.length === 0) {
                 navContainer.innerHTML = `<p data-en="No tips found." data-gr="Δεν βρέθηκαν συμβουλές."></p>`;
                 changeLanguage(currentLanguage);
                 return;
            }

            htmlFiles.forEach((file, index) => {
                const button = document.createElement('div');
                button.className = 'app-icon';
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-book-open';
                
                const span = document.createElement('span');
                const titles = titleMap[file.name];

                if (titles) {
                    span.setAttribute('data-en', titles.en);
                    span.setAttribute('data-gr', titles.gr);
                } else {
                    // Fallback for any file not in our titleMap
                    const fallbackTitle = file.name.replace(/_\d*\.html$/, '').replace(/_/g, ' ');
                    span.setAttribute('data-en', fallbackTitle);
                    span.setAttribute('data-gr', fallbackTitle);
                }
                
                button.appendChild(icon);
                button.appendChild(span);
                
                button.addEventListener('click', () => {
                    loadTipContent(file.download_url);
                    // UX IMPROVEMENT: Highlight the currently active tip button
                    navContainer.querySelectorAll('.app-icon').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
                navContainer.appendChild(button);

                // Automatically load and display the first tip
                if (index === 0) {
                    button.click();
                }
            });
            
            // Apply the current language to all newly created buttons
            changeLanguage(currentLanguage);
            tipsLoaded = true;

        } catch (error) {
            console.error('Failed to fetch life tips:', error);
            navContainer.innerHTML = `<p style="color: var(--nm-danger);" data-en="Failed to load content." data-gr="Αποτυχία φόρτωσης περιεχομένου."></p>`;
            changeLanguage(currentLanguage);
        }
    }

    async function loadTipContent(url) {
        const contentContainer = document.getElementById('life-tips-content');
        contentContainer.innerHTML = `<p data-en="Loading..." data-gr="Φόρτωση..."></p>`;
        changeLanguage(currentLanguage);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch content: ${response.status}`);
            
            const htmlContent = await response.text();
            contentContainer.innerHTML = htmlContent;
            
            // Re-apply language to new dynamic content
            changeLanguage(currentLanguage);
        } catch (error) {
            console.error('Failed to load tip content:', error);
            contentContainer.innerHTML = `<p style="color: var(--nm-danger);" data-en="Failed to load content." data-gr="Αποτυχία φόρτωσης περιεχομένου."></p>`;
            changeLanguage(currentLanguage);
        }
    }
    
    // --- CERTIFICATION QUIZ LOGIC ---
    function initializeCertificationQuiz() {
        const fullQuizData = [
            // Book 1: First Contact & Navigation
            { id: 1, book: 1, question_en: "Which command is used to find out your current location in the filesystem?", question_gr: "Ποια εντολή χρησιμοποιείται για να μάθετε την τρέχουσα τοποθεσία σας στο σύστημα αρχείων;", options_en: ["whoami", "ls", "pwd", "cd"], options_gr: ["whoami", "ls", "pwd", "cd"], correct_answer: 2 },
            { id: 2, book: 1, question_en: "What does the `~` (tilde) character represent in the command prompt?", question_gr: "Τι αντιπροσωπεύει ο χαρακτήρας `~` (περισπωμένη) στη γραμμή εντολών;", options_en: ["The root directory", "The previous directory", "The user's home directory", "A temporary directory"], options_gr: ["Τον ριζικό κατάλογο", "Τον προηγούμενο κατάλογο", "Τον κατάλογο χρήστη", "Έναν προσωρινό κατάλογο"], correct_answer: 2 },
            { id: 3, book: 1, question_en: "How do you list all files, including hidden ones, in a long format?", question_gr: "Πώς εμφανίζετε όλα τα αρχεία, συμπεριλαμβανομένων των κρυφών, σε αναλυτική μορφή;", options_en: ["ls -l", "ls -a", "ls -h", "ls -la"], options_gr: ["ls -l", "ls -a", "ls -h", "ls -la"], correct_answer: 3 },
            { id: 4, book: 1, question_en: "Which command takes you to the parent directory (one level up)?", question_gr: "Ποια εντολή σας μεταφέρει στον γονικό κατάλογο (ένα επίπεδο πάνω);", options_en: ["cd /", "cd ~", "cd ..", "cd ."], options_gr: ["cd /", "cd ~", "cd ..", "cd ."], correct_answer: 2 },
            // Book 2: File Management & Permissions
            { id: 5, book: 2, question_en: "Which command creates an empty file named 'report.txt'?", question_gr: "Ποια εντολή δημιουργεί ένα κενό αρχείο με το όνομα 'report.txt';", options_en: ["mkdir report.txt", "create report.txt", "touch report.txt", "new report.txt"], options_gr: ["mkdir report.txt", "create report.txt", "touch report.txt", "new report.txt"], correct_answer: 2 },
            { id: 6, book: 2, question_en: "To copy a directory and all its contents, which option must be used with `cp`?", question_gr: "Για να αντιγράψετε έναν κατάλογο και όλα τα περιεχόμενά του, ποια επιλογή πρέπει να χρησιμοποιηθεί με την `cp`;", options_en: ["-c", "-a", "-d", "-r"], options_gr: ["-c", "-a", "-d", "-r"], correct_answer: 3 },
            { id: 7, book: 2, question_en: "What does the permission string `r-x` mean?", question_gr: "Τι σημαίνει η συμβολοσειρά δικαιωμάτων `r-x`;", options_en: ["Read and write", "Read and execute", "Write and execute", "Only read"], options_gr: ["Ανάγνωση και εγγραφή", "Ανάγνωση και εκτέλεση", "Εγγραφή και εκτέλεση", "Μόνο ανάγνωση"], correct_answer: 1 },
            { id: 8, book: 2, question_en: "Which octal (numeric) permission is equivalent to `rwxr-xr-x`?", question_gr: "Ποιο οκταδικό (αριθμητικό) δικαίωμα είναι ισοδύναμο με το `rwxr-xr-x`;", options_en: ["644", "777", "755", "700"], options_gr: ["644", "777", "755", "700"], correct_answer: 2 },
            // Book 3: Composing Commands
            { id: 9, book: 3, question_en: "What is the file descriptor number for Standard Error (stderr)?", question_gr: "Ποιος είναι ο αριθμός περιγραφέα αρχείου για το Τυπικό Σφάλμα (stderr);", options_en: ["0", "1", "2", "3"], options_gr: ["0", "1", "2", "3"], correct_answer: 2 },
            { id: 10, book: 3, question_en: "Which command chain counts the number of lines containing the word 'error' in 'log.txt'?", question_gr: "Ποια αλυσίδα εντολών μετρά τον αριθμό των γραμμών που περιέχουν τη λέξη 'error' στο 'log.txt';", options_en: ["cat log.txt | wc -l 'error'", "grep 'error' log.txt | wc -l", "wc -l log.txt | grep 'error'", "find 'error' log.txt | count"], options_gr: ["cat log.txt | wc -l 'error'", "grep 'error' log.txt | wc -l", "wc -l log.txt | grep 'error'", "find 'error' log.txt | count"], correct_answer: 1 },
            { id: 11, book: 3, question_en: "What does the `&` symbol do when placed at the end of a command?", question_gr: "Τι κάνει το σύμβολο `&` όταν τοποθετείται στο τέλος μιας εντολής;", options_en: ["Combines two commands", "Runs the command in the background", "Redirects output", "Stops the command"], options_gr: ["Συνδυάζει δύο εντολές", "Εκτελεί την εντολή στο παρασκήνιο", "Ανακατευθύνει την έξοδο", "Σταματά την εντολή"], correct_answer: 1 },
            // Book 4: Software & Text Editing
            { id: 12, book: 4, question_en: "What is the correct command to update package lists and upgrade installed packages in Termux?", question_gr: "Ποια είναι η σωστή εντολή για την ενημέρωση των λιστών πακέτων και την αναβάθμιση των εγκατεστημένων πακέτων στο Termux;", options_en: ["pkg update && pkg upgrade", "pkg install --all", "termux-update", "apt update-all"], options_gr: ["pkg update && pkg upgrade", "pkg install --all", "termux-update", "apt update-all"], correct_answer: 0 },
            { id: 13, book: 4, question_en: "In the `nano` editor, how do you save a file (Write Out)?", question_gr: "Στον επεξεργαστή `nano`, πώς αποθηκεύετε ένα αρχείο (Write Out);", options_en: ["Ctrl+S", "Ctrl+X", "Ctrl+W", "Ctrl+O"], options_gr: ["Ctrl+S", "Ctrl+X", "Ctrl+W", "Ctrl+O"], correct_answer: 3 },
            { id: 14, book: 4, question_en: "In Vim, which key is pressed to return to Normal Mode from any other mode?", question_gr: "Στο Vim, ποιο πλήκτρο πατιέται για να επιστρέψετε στην Κανονική Λειτουργία από οποιαδήποτε άλλη λειτουργία;", options_en: ["Enter", "Shift", "Tab", "Esc"], options_gr: ["Enter", "Shift", "Tab", "Esc"], correct_answer: 3 },
            { id: 15, book: 4, question_en: "What is the Vim command (in Normal Mode) to save the file and quit?", question_gr: "Ποια είναι η εντολή του Vim (σε Κανονική Λειτουργία) για αποθήκευση του αρχείου και έξοδο;", options_en: [":q!", ":w", ":wq", ":q"], options_gr: [":q!", ":w", ":wq", ":q"], correct_answer: 2 },
            // ... (Adding many more questions)
            { id: 16, book: 5, question_en: "How do you assign the output of the `date` command to a variable named `TODAY`?", question_gr: "Πώς αναθέτετε την έξοδο της εντολής `date` σε μια μεταβλητή με το όνομα `TODAY`;", options_en: ["TODAY=date", "let TODAY=date", "TODAY=$(date)", "TODAY=[date]"], options_gr: ["TODAY=date", "let TODAY=date", "TODAY=$(date)", "TODAY=[date]"], correct_answer: 2 },
            { id: 17, book: 5, question_en: "Which command reads user input silently (for passwords)?", question_gr: "Ποια εντολή διαβάζει την είσοδο του χρήστη αθόρυβα (για κωδικούς πρόσβασης);", options_en: ["read -p", "read -s", "input", "get-input -s"], options_gr: ["read -p", "read -s", "input", "get-input -s"], correct_answer: 1 },
            { id: 18, book: 6, question_en: "Which operator is used for integer equality testing inside `[ ]`?", question_gr: "Ποιος τελεστής χρησιμοποιείται για τον έλεγχο ισότητας ακεραίων μέσα στο `[ ]`;", options_en: ["=", "==", "-eq", "-equals"], options_gr: ["=", "==", "-eq", "-equals"], correct_answer: 2 },
            { id: 19, book: 6, question_en: "What is the purpose of a `for` loop in shell scripting?", question_gr: "Ποιος είναι ο σκοπός ενός βρόχου `for` στη συγγραφή σεναρίων κελύφους;", options_en: ["To loop until a condition is false", "To iterate over a list of items", "To make a decision", "To read user input"], options_gr: ["Να επαναλαμβάνεται μέχρι μια συνθήκη να γίνει ψευδής", "Να διατρέχει μια λίστα στοιχείων", "Να παίρνει μια απόφαση", "Να διαβάζει την είσοδο του χρήστη"], correct_answer: 1 },
            { id: 20, book: 7, question_en: "How do you declare a variable that is only visible inside a function?", question_gr: "Πώς δηλώνετε μια μεταβλητή που είναι ορατή μόνο μέσα σε μια συνάρτηση;", options_en: ["var NAME", "private NAME", "local NAME", "function NAME"], options_gr: ["var NAME", "private NAME", "local NAME", "function NAME"], correct_answer: 2 },
            { id: 21, book: 7, question_en: "How do you access all elements of an array named `SERVERS` safely?", question_gr: "Πώς αποκτάτε πρόσβαση σε όλα τα στοιχεία ενός πίνακα με το όνομα `SERVERS` με ασφάλεια;", options_en: ["$SERVERS", "$SERVERS[*]", "${SERVERS[@]}", "${SERVERS}"], options_gr: ["$SERVERS", "$SERVERS[*]", "${SERVERS[@]}", "${SERVERS}"], correct_answer: 2 },
            { id: 22, book: 8, question_en: "In Regex, what does `^` mean at the beginning of a pattern?", question_gr: "Στις Regex, τι σημαίνει το `^` στην αρχή ενός μοτίβου;", options_en: ["Matches any character", "Matches the end of a line", "Negates a character set", "Matches the start of a line"], options_gr: ["Αντιστοιχεί σε οποιονδήποτε χαρακτήρα", "Αντιστοιχεί στο τέλος μιας γραμμής", "Αρνείται ένα σύνολο χαρακτήρων", "Αντιστοιχεί στην αρχή μιας γραμμής"], correct_answer: 3 },
            { id: 23, book: 8, question_en: "What does the Regex quantifier `+` mean?", question_gr: "Τι σημαίνει ο ποσοδείκτης `+` στις Regex;", options_en: ["Zero or more times", "Zero or one time", "Exactly one time", "One or more times"], options_gr: ["Μηδέν ή περισσότερες φορές", "Μηδέν ή μία φορά", "Ακριβώς μία φορά", "Μία ή περισσότερες φορές"], correct_answer: 3 },
            { id: 24, book: 9, question_en: "Which `find` command locates all files ending with `.log`?", question_gr: "Ποια εντολή `find` εντοπίζει όλα τα αρχεία που τελειώνουν σε `.log`;", options_en: ["find . -log", "find . -name \"*.log\"", "find *.log", "grep .log"], options_gr: ["find . -log", "find . -name \"*.log\"", "find *.log", "grep .log"], correct_answer: 1 },
            { id: 25, book: 9, question_en: "What does `grep -v 'pattern'` do?", question_gr: "Τι κάνει η εντολή `grep -v 'pattern'`;", options_en: ["Searches verbosely", "Counts matching lines", "Inverts the match (shows non-matching lines)", "Searches recursively"], options_gr: ["Αναζητά με λεπτομέρειες", "Μετρά τις γραμμές που ταιριάζουν", "Αντιστρέφει την αντιστοίχιση (δείχνει τις γραμμές που δεν ταιριάζουν)", "Αναζητά αναδρομικά"], correct_answer: 2 },
            { id: 26, book: 10, question_en: "In `sed`, what does the `g` flag in `s/old/new/g` signify?", question_gr: "Στη `sed`, τι υποδηλώνει η σημαία `g` στην εντολή `s/old/new/g`;", options_en: ["Greedy match", "Global (replace all occurrences on a line)", "Group match", "Go to next line"], options_gr: ["Άπληστη αντιστοίχιση", "Καθολική (αντικατάσταση όλων των εμφανίσεων σε μια γραμμή)", "Αντιστοίχιση ομάδας", "Μετάβαση στην επόμενη γραμμή"], correct_answer: 1 },
            { id: 27, book: 10, question_en: "In `awk`, which variable represents the entire current line?", question_gr: "Στην `awk`, ποια μεταβλητή αντιπροσωπεύει ολόκληρη την τρέχουσα γραμμή;", options_en: ["$1", "$NF", "$0", "$NR"], options_gr: ["$1", "$NF", "$0", "$NR"], correct_answer: 2 },
            { id: 28, book: 11, question_en: "Which command is used to securely log in to a remote server?", question_gr: "Ποια εντολή χρησιμοποιείται για την ασφαλή σύνδεση σε έναν απομακρυσμένο διακομιστή;", options_en: ["telnet", "ftp", "ssh", "connect"], options_gr: ["telnet", "ftp", "ssh", "connect"], correct_answer: 2 },
            { id: 29, book: 11, question_en: "What is the primary advantage of `rsync` over `cp` for network transfers?", question_gr: "Ποιο είναι το κύριο πλεονέκτημα της `rsync` έναντι της `cp` για μεταφορές δικτύου;", options_en: ["It is faster for a single file", "It only transfers the differences (delta transfer)", "It is more secure", "It can copy directories"], options_gr: ["Είναι ταχύτερη για ένα μόνο αρχείο", "Μεταφέρει μόνο τις διαφορές (μεταφορά δέλτα)", "Είναι πιο ασφαλής", "Μπορεί να αντιγράψει καταλόγους"], correct_answer: 1 },
            { id: 30, book: 12, question_en: "What is the command to initialize a new Git repository?", question_gr: "Ποια είναι η εντολή για την αρχικοποίηση ενός νέου αποθετηρίου Git;", options_en: ["git new", "git start", "git init", "git create"], options_gr: ["git new", "git start", "git init", "git create"], correct_answer: 2 },
            { id: 31, book: 12, question_en: "What is the three-step process for saving changes in Git?", question_gr: "Ποια είναι η διαδικασία τριών βημάτων για την αποθήκευση αλλαγών στο Git;", options_en: ["Modify, Commit, Push", "Modify, Stage (add), Commit", "Stage, Push, Save", "Add, Save, Push"], options_gr: ["Τροποποίηση, Commit, Push", "Τροποποίηση, Προετοιμασία (add), Commit", "Προετοιμασία, Push, Αποθήκευση", "Add, Αποθήκευση, Push"], correct_answer: 1 },
            { id: 32, book: 13, question_en: "What is the primary purpose of a virtual environment?", question_gr: "Ποιος είναι ο κύριος σκοπός ενός εικονικού περιβάλλοντος;", options_en: ["To run programs faster", "To isolate project dependencies and avoid conflicts", "To connect to the internet", "To compile code"], options_gr: ["Για την ταχύτερη εκτέλεση προγραμμάτων", "Για την απομόνωση των εξαρτήσεων του έργου και την αποφυγή συγκρούσεων", "Για τη σύνδεση στο διαδίκτυο", "Για τη μεταγλώττιση κώδικα"], correct_answer: 1 },
            { id: 33, book: 14, question_en: "Which file is conventionally used to list a Python project's dependencies?", question_gr: "Ποιο αρχείο χρησιμοποιείται συμβατικά για την καταγραφή των εξαρτήσεων ενός έργου Python;", options_en: ["packages.txt", "dependencies.json", "pip.conf", "requirements.txt"], options_gr: ["packages.txt", "dependencies.json", "pip.conf", "requirements.txt"], correct_answer: 3 },
            { id: 34, book: 15, question_en: "What is the standard package manager for Node.js?", question_gr: "Ποιος είναι ο τυπικός διαχειριστής πακέτων για το Node.js;", options_en: ["pip", "pkg", "npm", "node-get"], options_gr: ["pip", "pkg", "npm", "node-get"], correct_answer: 2 },
            { id: 35, book: 15, question_en: "Which tool is used to keep a Node.js application running 24/7?", question_gr: "Ποιο εργαλείο χρησιμοποιείται για να διατηρείται μια εφαρμογή Node.js σε λειτουργία 24/7;", options_en: ["forever", "nodemon", "pm2", "supervisor"], options_gr: ["forever", "nodemon", "pm2", "supervisor"], correct_answer: 2 },
            { id: 36, book: 16, question_en: "Which tool is the world's most famous port scanner?", question_gr: "Ποιο εργαλείο είναι ο πιο διάσημος σαρωτής θυρών στον κόσμο;", options_en: ["whois", "netstat", "nmap", "wireshark"], options_gr: ["whois", "netstat", "nmap", "wireshark"], correct_answer: 2 },
            { id: 37, book: 16, question_en: "In an `nmap` scan, what does a 'filtered' port state usually indicate?", question_gr: "Σε μια σάρωση `nmap`, τι υποδεικνύει συνήθως η κατάσταση 'filtered' μιας θύρας;", options_en: ["The port is open", "The port is closed", "A firewall is blocking access", "The service has crashed"], options_gr: ["Η θύρα είναι ανοιχτή", "Η θύρα είναι κλειστή", "Ένα τείχος προστασίας εμποδίζει την πρόσβαση", "Η υπηρεσία έχει καταρρεύσει"], correct_answer: 2 },
            { id: 38, book: 17, question_en: "What is the file extension for shared libraries in Linux?", question_gr: "Ποια είναι η επέκταση αρχείου για τις κοινόχρηστες βιβλιοθήκες στο Linux;", options_en: [".dll", ".lib", ".a", ".so"], options_gr: [".dll", ".lib", ".a", ".so"], correct_answer: 3 },
            { id: 39, book: 17, question_en: "What is the name of the program that connects an executable with its shared libraries at runtime?", question_gr: "Πώς ονομάζεται το πρόγραμμα που συνδέει ένα εκτελέσιμο με τις κοινόχρηστες βιβλιοθήκες του κατά το χρόνο εκτέλεσης;", options_en: ["Compiler", "Static Linker", "Dynamic Linker", "Loader"], options_gr: ["Μεταγλωττιστής", "Στατικός Συνδέτης", "Δυναμικός Συνδέτης", "Φορτωτής"], correct_answer: 2 },
            { id: 40, book: 18, question_en: "Which file does the `make` utility read to find build instructions?", question_gr: "Ποιο αρχείο διαβάζει το βοηθητικό πρόγραμμα `make` για να βρει οδηγίες κατασκευής;", options_en: ["build.xml", "Makefile", "package.json", "script.sh"], options_gr: ["build.xml", "Makefile", "package.json", "script.sh"], correct_answer: 1 },
            { id: 41, book: 18, question_en: "What does the `clang -c hello.c` command do?", question_gr: "Τι κάνει η εντολή `clang -c hello.c`;", options_en: ["Compiles and links hello.c into an executable", "Checks hello.c for errors without compiling", "Compiles hello.c into an object file (.o) without linking", "Creates a copy of hello.c"], options_gr: ["Μεταγλωττίζει και συνδέει το hello.c σε ένα εκτελέσιμο", "Ελέγχει το hello.c για σφάλματα χωρίς μεταγλώττιση", "Μεταγλωττίζει το hello.c σε ένα αντικειμενικό αρχείο (.o) χωρίς σύνδεση", "Δημιουργεί ένα αντίγραφο του hello.c"], correct_answer: 2 },
            { id: 42, book: 19, question_en: "What technology allows running a full Linux distribution in Termux without root?", question_gr: "Ποια τεχνολογία επιτρέπει την εκτέλεση μιας πλήρους διανομής Linux στο Termux χωρίς root;", options_en: ["Docker", "chroot", "proot", "VirtualBox"], options_gr: ["Docker", "chroot", "proot", "VirtualBox"], correct_answer: 2 },
            { id: 43, book: 19, question_en: "In Termux, where are executables like `ls` and `git` located?", question_gr: "Στο Termux, πού βρίσκονται τα εκτελέσιμα όπως το `ls` και το `git`;", options_en: ["/bin", "/usr/bin", "$PREFIX/bin", "/system/bin"], options_gr: ["/bin", "/usr/bin", "$PREFIX/bin", "/system/bin"], correct_answer: 2 },
            { id: 44, book: 20, question_en: "Which command from Termux:API returns information about the battery?", question_gr: "Ποια εντολή από το Termux:API επιστρέφει πληροφορίες για την μπαταρία;", options_en: ["termux-info", "termux-battery-status", "termux-power", "termux-device"], options_gr: ["termux-info", "termux-battery-status", "termux-power", "termux-device"], correct_answer: 1 },
            { id: 45, book: 20, question_en: "To take a picture with the back camera and save it as `photo.jpg`, what is the command?", question_gr: "Για να τραβήξετε μια φωτογραφία με την πίσω κάμερα και να την αποθηκεύσετε ως `photo.jpg`, ποια είναι η εντολή;", options_en: ["termux-photo photo.jpg", "termux-camera-photo -c 0 photo.jpg", "termux-camera-photo -c 1 photo.jpg", "termux-capture photo.jpg"], options_gr: ["termux-photo photo.jpg", "termux-camera-photo -c 0 photo.jpg", "termux-camera-photo -c 1 photo.jpg", "termux-capture photo.jpg"], correct_answer: 1 },
            { id: 46, book: 21, question_en: "What three components are needed to run a graphical desktop in Termux?", question_gr: "Ποια τρία στοιχεία χρειάζονται για την εκτέλεση ενός γραφικού περιβάλλοντος εργασίας στο Termux;", options_en: ["X11 Server, VNC Server, Desktop Environment", "Termux, Android, XFCE", "VNC Client, SSH Server, GNOME", "Xorg, Wayland, VNC"], options_gr: ["X11 Server, VNC Server, Περιβάλλον Εργασίας", "Termux, Android, XFCE", "VNC Client, SSH Server, GNOME", "Xorg, Wayland, VNC"], correct_answer: 0 },
            { id: 47, book: 22, question_en: "What is the primary Python library for data manipulation and analysis?", question_gr: "Ποια είναι η κύρια βιβλιοθήκη Python για χειρισμό και ανάλυση δεδομένων;", options_en: ["NumPy", "Matplotlib", "SciPy", "pandas"], options_gr: ["NumPy", "Matplotlib", "SciPy", "pandas"], correct_answer: 3 },
            { id: 48, book: 22, question_en: "Which web-based interactive environment is standard for data science?", question_gr: "Ποιο διαδραστικό περιβάλλον που βασίζεται στον ιστό είναι πρότυπο για την επιστήμη δεδομένων;", options_en: ["VS Code", "Spyder", "Jupyter Notebook", "PyCharm"], options_gr: ["VS Code", "Spyder", "Jupyter Notebook", "PyCharm"], correct_answer: 2 },
            { id: 49, book: 23, question_en: "What is the human-readable representation of machine code called?", question_gr: "Πώς ονομάζεται η αναγνώσιμη από τον άνθρωπο αναπαράσταση του κώδικα μηχανής;", options_en: ["Bytecode", "Assembly Language", "C Code", "Pseudo Code"], options_gr: ["Bytecode", "Γλώσσα Assembly", "Κώδικας C", "Ψευδοκώδικας"], correct_answer: 1 },
            { id: 50, book: 24, question_en: "What is it called when you build a program on one system to run on a different system?", question_gr: "Πώς ονομάζεται όταν χτίζετε ένα πρόγραμμα σε ένα σύστημα για να εκτελεστεί σε ένα διαφορετικό σύστημα;", options_en: ["Native Compilation", "Cross-Compilation", "Re-compilation", "Dynamic Compilation"], options_gr: ["Εγγενής Μεταγλώττιση", "Δια-μεταγλώττιση", "Επανα-μεταγλώττιση", "Δυναμική Μεταγλώττιση"], correct_answer: 1 },
            { id: 51, book: 1, question_en: "The `man` command is used for what?", question_gr: "Για ποιο λόγο χρησιμοποιείται η εντολή `man`;", options_en: ["Managing files", "Viewing manual pages", "Making directories", "Manual installation"], options_gr: ["Διαχείριση αρχείων", "Προβολή σελίδων εγχειριδίου", "Δημιουργία καταλόγων", "Χειροκίνητη εγκατάσταση"], correct_answer: 1 },
            { id: 52, book: 2, question_en: "Which command is used to change file ownership?", question_gr: "Ποια εντολή χρησιμοποιείται για την αλλαγή ιδιοκτησίας αρχείου;", options_en: ["chmod", "chown", "chgrp", "chaccess"], options_gr: ["chmod", "chown", "chgrp", "chaccess"], correct_answer: 1 },
            { id: 53, book: 3, question_en: "What does the `kill -9 [PID]` command do?", question_gr: "Τι κάνει η εντολή `kill -9 [PID]`;", options_en: ["Pauses a process", "Sends a gentle stop signal", "Forcefully terminates a process", "Restarts a process"], options_gr: ["Παγώνει μια διεργασία", "Στέλνει ένα ήπιο σήμα διακοπής", "Τερματίζει βίαια μια διεργασία", "Επανεκκινεί μια διεργασία"], correct_answer: 2 },
            { id: 54, book: 4, question_en: "In Vim, what does `dd` do in Normal Mode?", question_gr: "Στο Vim, τι κάνει το `dd` στην Κανονική Λειτουργία;", options_en: ["Duplicates the line", "Deletes the current character", "Deletes the entire current line", "Moves down two lines"], options_gr: ["Διπλασιάζει τη γραμμή", "Διαγράφει τον τρέχοντα χαρακτήρα", "Διαγράφει ολόκληρη την τρέχουσα γραμμή", "Κατεβαίνει δύο γραμμές"], correct_answer: 2 },
            { id: 55, book: 5, question_en: "In bash arithmetic `$(())`, what does `%` operator do?", question_gr: "Στην αριθμητική του bash `$(())`, τι κάνει ο τελεστής `%`;", options_en: ["Percentage", "Multiplication", "Division", "Modulo (remainder)"], options_gr: ["Ποσοστό", "Πολλαπλασιασμός", "Διαίρεση", "Υπόλοιπο διαίρεσης (Modulo)"], correct_answer: 3 },
            { id: 56, book: 6, question_en: "What keyword ends an `if` statement block in bash?", question_gr: "Ποια λέξη-κλειδί τερματίζει ένα μπλοκ δήλωσης `if` στο bash;", options_en: ["end", "endif", "fi", "stop"], options_gr: ["end", "endif", "fi", "stop"], correct_answer: 2 },
            { id: 57, book: 7, question_en: "In a bash function, what does `$#` represent?", question_gr: "Σε μια συνάρτηση bash, τι αντιπροσωπεύει το `$#`;", options_en: ["The first argument", "All arguments", "The name of the script", "The number of arguments"], options_gr: ["Το πρώτο όρισμα", "Όλα τα ορίσματα", "Το όνομα του σεναρίου", "Ο αριθμός των ορισμάτων"], correct_answer: 3 },
            { id: 58, book: 8, question_en: "Which Regex pattern matches a 4-digit number?", question_gr: "Ποιο μοτίβο Regex αντιστοιχεί σε έναν 4-ψήφιο αριθμό;", options_en: ["\\d{4}", "\\n{4}", "[0-9]+", "\\d*"], options_gr: ["\\d{4}", "\\n{4}", "[0-9]+", "\\d*"], correct_answer: 0 },
            { id: 59, book: 9, question_en: "Which `find` option is used to execute a command on found files?", question_gr: "Ποια επιλογή της `find` χρησιμοποιείται για την εκτέλεση μιας εντολής στα αρχεία που βρέθηκαν;", options_en: ["-do", "-run", "-exec", "-cmd"], options_gr: ["-do", "-run", "-exec", "-cmd"], correct_answer: 2 },
            { id: 60, book: 10, question_en: "How would you use `awk` to print only the first column (field) of a file?", question_gr: "Πώς θα χρησιμοποιούσατε την `awk` για να εκτυπώσετε μόνο την πρώτη στήλη (πεδίο) ενός αρχείου;", options_en: ["awk '{print $0}'", "awk '{print $1}'", "awk '{print #1}'", "awk '{column 1}'"], options_gr: ["awk '{print $0}'", "awk '{print $1}'", "awk '{print #1}'", "awk '{column 1}'"], correct_answer: 1 },
            { id: 61, book: 11, question_en: "What does the `-L` option in `curl` do?", question_gr: "Τι κάνει η επιλογή `-L` στην `curl`;", options_en: ["Lists files", "Follows redirects", "Logs the output", "Limits the speed"], options_gr: ["Εμφανίζει λίστα αρχείων", "Ακολουθεί ανακατευθύνσεις", "Καταγράφει την έξοδο", "Περιορίζει την ταχύτητα"], correct_answer: 1 },
            { id: 62, book: 12, question_en: "What is a `git branch`?", question_gr: "Τι είναι ένα `git branch`;", options_en: ["A copy of the repository", "A single commit", "An independent line of development", "A remote server"], options_gr: ["Ένα αντίγραφο του αποθετηρίου", "Ένα μεμονωμένο commit", "Μια ανεξάρτητη γραμμή ανάπτυξης", "Ένας απομακρυσμένος διακομιστής"], correct_answer: 2 },
            { id: 63, book: 13, question_en: "What is the key difference between an interpreter and a compiler?", question_gr: "Ποια είναι η βασική διαφορά μεταξύ ενός διερμηνέα και ενός μεταγλωττιστή;", options_en: ["Interpreters are faster", "Compilers produce standalone executables", "Interpreters are only for web development", "Compilers are easier to use"], options_gr: ["Οι διερμηνείς είναι ταχύτεροι", "Οι μεταγλωττιστές παράγουν αυτόνομα εκτελέσιμα", "Οι διερμηνείς είναι μόνο για ανάπτυξη ιστού", "Οι μεταγλωττιστές είναι ευκολότεροι στη χρήση"], correct_answer: 1 },
            { id: 64, book: 14, question_en: "What command creates a Python virtual environment named 'env'?", question_gr: "Ποια εντολή δημιουργεί ένα εικονικό περιβάλλον Python με το όνομα 'env';", options_en: ["python -m venv env", "virtualenv env", "python create-env env", "pip venv env"], options_gr: ["python -m venv env", "virtualenv env", "python create-env env", "pip venv env"], correct_answer: 0 },
            { id: 65, book: 15, question_en: "What is the purpose of the `package.json` file in a Node.js project?", question_gr: "Ποιος είναι ο σκοπός του αρχείου `package.json` σε ένα έργο Node.js;", options_en: ["To store the main application code", "To list project dependencies and metadata", "To configure the server", "To store user data"], options_gr: ["Να αποθηκεύει τον κύριο κώδικα της εφαρμογής", "Να καταγράφει τις εξαρτήσεις και τα μεταδεδομένα του έργου", "Να ρυθμίζει τον διακομιστή", "Να αποθηκεύει δεδομένα χρήστη"], correct_answer: 1 },
            { id: 66, book: 16, question_en: "The sum of all points where an attacker can try to enter or extract data is called what?", question_gr: "Το σύνολο όλων των σημείων όπου ένας επιτιθέμενος μπορεί να προσπαθήσει να εισάγει ή να εξάγει δεδομένα ονομάζεται τι;", options_en: ["The Security Perimeter", "The Attack Surface", "The Vulnerability Zone", "The Network Footprint"], options_gr: ["Η Περίμετρος Ασφαλείας", "Η Επιφάνεια Επίθεσης", "Η Ζώνη Ευπάθειας", "Το Αποτύπωμα Δικτύου"], correct_answer: 1 },
            { id: 67, book: 17, question_en: "Which command is used to list the shared libraries an executable depends on?", question_gr: "Ποια εντολή χρησιμοποιείται για την εμφάνιση της λίστας των κοινόχρηστων βιβλιοθηκών από τις οποίες εξαρτάται ένα εκτελέσιμο;", options_en: ["libs", "show-deps", "ldd", "readelf"], options_gr: ["libs", "show-deps", "ldd", "readelf"], correct_answer: 2 },
            { id: 68, book: 18, question_en: "In a Makefile, what is a 'target'?", question_gr: "Σε ένα Makefile, τι είναι ένας 'στόχος' (target);", options_en: ["A source code file", "A compiler flag", "A file to be built or an action to be performed", "A comment"], options_gr: ["Ένα αρχείο πηγαίου κώδικα", "Μια σημαία μεταγλωττιστή", "Ένα αρχείο προς κατασκευή ή μια ενέργεια προς εκτέλεση", "Ένα σχόλιο"], correct_answer: 2 },
            { id: 69, book: 19, question_en: "What is the command to log in to an installed Ubuntu distribution via proot-distro?", question_gr: "Ποια είναι η εντολή για να συνδεθείτε σε μια εγκατεστημένη διανομή Ubuntu μέσω του proot-distro;", options_en: ["proot-distro start ubuntu", "proot-distro run ubuntu", "proot-distro exec ubuntu", "proot-distro login ubuntu"], options_gr: ["proot-distro start ubuntu", "proot-distro run ubuntu", "proot-distro exec ubuntu", "proot-distro login ubuntu"], correct_answer: 3 },
            { id: 70, book: 20, question_en: "Which Termux:API command creates a native Android notification?", question_gr: "Ποια εντολή του Termux:API δημιουργεί μια εγγενή ειδοποίηση Android;", options_en: ["termux-toast", "termux-dialog", "termux-notify", "termux-notification"], options_gr: ["termux-toast", "termux-dialog", "termux-notify", "termux-notification"], correct_answer: 3 },
            { id: 71, book: 21, question_en: "What does VNC stand for?", question_gr: "Τι σημαίνουν τα αρχικά VNC;", options_en: ["Virtual Network Computing", "Visual Node Controller", "Virtual Network Connection", "Video Network Console"], options_gr: ["Virtual Network Computing", "Visual Node Controller", "Virtual Network Connection", "Video Network Console"], correct_answer: 0 },
            { id: 72, book: 22, question_en: "Which 'magic' command is used in Jupyter to display matplotlib plots inline?", question_gr: "Ποια 'μαγική' εντολή χρησιμοποιείται στο Jupyter για την ενσωματωμένη εμφάνιση γραφημάτων του matplotlib;", options_en: ["%matplotlib show", "%plots inline", "%matplotlib inline", "%render plot"], options_gr: ["%matplotlib show", "%plots inline", "%matplotlib inline", "%render plot"], correct_answer: 2 },
            { id: 73, book: 23, question_en: "What is 'static analysis' in reverse engineering?", question_gr: "Τι είναι η 'στατική ανάλυση' στην αντίστροφη μηχανική;", options_en: ["Analyzing a program while it is running", "Analyzing a program's source code", "Analyzing a program without running it", "Analyzing a program's network traffic"], options_gr: ["Ανάλυση ενός προγράμματος ενώ εκτελείται", "Ανάλυση του πηγαίου κώδικα ενός προγράμματος", "Ανάλυση ενός προγράμματος χωρίς να εκτελείται", "Ανάλυση της δικτυακής κίνησης ενός προγράμματος"], correct_answer: 2 },
            { id: 74, book: 24, question_en: "The core program of an OS that manages hardware is called the...?", question_gr: "Το κεντρικό πρόγραμμα ενός ΛΣ που διαχειρίζεται το υλικό ονομάζεται...;", options_en: ["Shell", "Kernel", "Bootloader", "Linker"], options_gr: ["Κέλυφος", "Πυρήνας", "Εκκινητής", "Συνδέτης"], correct_answer: 1 },
            { id: 75, book: 1, question_en: "What is the correct source for installing an up-to-date version of Termux?", question_gr: "Ποια είναι η σωστή πηγή για την εγκατάσταση μιας ενημερωμένης έκδοσης του Termux;", options_en: ["Google Play Store", "Amazon Appstore", "F-Droid", "Termux Website"], options_gr: ["Google Play Store", "Amazon Appstore", "F-Droid", "Ιστοσελίδα του Termux"], correct_answer: 2 },
            { id: 76, book: 2, question_en: "What is the purpose of the `rmdir` command?", question_gr: "Ποιος είναι ο σκοπός της εντολής `rmdir`;", options_en: ["To remove files and directories", "To remove only files", "To remove only empty directories", "To rename a directory"], options_gr: ["Να αφαιρεί αρχεία και καταλόγους", "Να αφαιρεί μόνο αρχεία", "Να αφαιρεί μόνο κενούς καταλόγους", "Να μετονομάζει έναν κατάλογο"], correct_answer: 2 },
            { id: 77, book: 3, question_en: "Which command shows background jobs running in the current shell session?", question_gr: "Ποια εντολή δείχνει τις εργασίες παρασκηνίου που εκτελούνται στην τρέχουσα συνεδρία του κελύφους;", options_en: ["ps", "top", "bg", "jobs"], options_gr: ["ps", "top", "bg", "jobs"], correct_answer: 3 },
            { id: 78, book: 8, question_en: "In Regex, what does `|` (pipe) signify?", question_gr: "Στις Regex, τι υποδηλώνει το `|` (pipe);", options_en: ["A literal pipe character", "The start of a line", "An OR condition", "A group"], options_gr: ["Έναν κυριολεκτικό χαρακτήρα pipe", "Την αρχή μιας γραμμής", "Μια συνθήκη OR (Ή)", "Μια ομάδα"], correct_answer: 2 },
            { id: 79, book: 12, question_en: "What command downloads changes from a remote Git repository to your local one?", question_gr: "Ποια εντολή κατεβάζει αλλαγές από ένα απομακρυσμένο αποθετήριο Git στο τοπικό σας;", options_en: ["git upload", "git fetch", "git push", "git pull"], options_gr: ["git upload", "git fetch", "git push", "git pull"], correct_answer: 3 },
            { id: 80, book: 15, question_en: "Which file acts as the manifest for a Node.js project, listing dependencies?", question_gr: "Ποιο αρχείο λειτουργεί ως το μανιφέστο για ένα έργο Node.js, καταγράφοντας τις εξαρτήσεις;", options_en: ["manifest.json", "dependencies.txt", "package.json", "project.js"], options_gr: ["manifest.json", "dependencies.txt", "package.json", "project.js"], correct_answer: 2 },
            { id: 81, book: 20, question_en: "What must you install from F-Droid to use commands like `termux-camera-photo`?", question_gr: "Τι πρέπει να εγκαταστήσετε από το F-Droid για να χρησιμοποιήσετε εντολές όπως η `termux-camera-photo`;", options_en: ["Termux:Boot", "Termux:Widget", "Termux:API", "Termux:Styling"], options_gr: ["Termux:Boot", "Termux:Widget", "Termux:API", "Termux:Styling"], correct_answer: 2 },
            { id: 82, book: 22, question_en: "Which Python library is primarily used for creating plots and visualizations?", question_gr: "Ποια βιβλιοθήκη Python χρησιμοποιείται κυρίως για τη δημιουργία γραφημάτων και οπτικοποιήσεων;", options_en: ["pandas", "NumPy", "matplotlib", "Seaborn"], options_gr: ["pandas", "NumPy", "matplotlib", "Seaborn"], correct_answer: 2 }
        ];

        const translations = {
            en: { userInfoTitle: "Enter Your Details", firstNameLabel: "First Name", lastNameLabel: "Last Name", startBtn: "Start Workbook Exam", page: "Page", of: "of", prevBtn: "Previous", nextBtn: "Next", submitBtn: "Submit Test", resultsTitle: "Test Complete!", certTitle: "Certificate of Completion", certAwardedTo: "This certificate is awarded to", certAchievement: "for successfully completing the Termux Mastery Series seminar with exceptional knowledge and skill.", certDate: "Date of Completion", failureTitle: "Keep Studying!", failureText1: "You have completed the test, but you made", failureText2: "mistakes. You need fewer than 20 mistakes to pass. Please review the material and try again!", restartBtn: "Try Again", gradeLabel: "Grade", gradeExcellent: "Excellent", gradeVeryGood: "Very Good", gradeGood: "Good", pdfError: "Sorry, there was an error creating the PDF.", mistakesLabel: "Mistakes", timeLeftLabel: "Time Left" },
            gr: { userInfoTitle: "Εισάγετε τα Στοιχεία σας", firstNameLabel: "Όνομα", lastNameLabel: "Επώνυμο", startBtn: "Έναρξη Εξέτασης", page: "Σελίδα", of: "από", prevBtn: "Προηγούμενο", nextBtn: "Επόμενο", submitBtn: "Υποβολή Εξέτασης", resultsTitle: "Η Εξέταση Ολοκληρώθηκε!", certTitle: "Πιστοποιητικό Ολοκλήρωσης", certAwardedTo: "Αυτό το πιστοποιητικό απονέμεται στον/στην", certAchievement: "για την επιτυχή ολοκλήρωση του σεμιναρίου Termux Mastery Series με εξαιρετική γνώση και δεξιότητα.", certDate: "Ημερομηνία Ολοκλήρωσης", failureTitle: "Συνεχίστε τη Μελέτη!", failureText1: "Ολοκληρώσατε την εξέταση, αλλά κάνατε", failureText2: "λάθη. Χρειάζεστε λιγότερα από 20 λάθη για να περάσετε. Παρακαλώ μελετήστε ξανά την ύλη και προσπαθήστε ξανά!", restartBtn: "Προσπαθήστε Ξανά", gradeLabel: "Βαθμός", gradeExcellent: "Άριστα", gradeVeryGood: "Πολύ Καλά", gradeGood: "Καλά", pdfError: "Παρουσιάστηκε σφάλμα κατά τη δημιουργία του PDF.", mistakesLabel: "Λάθη", timeLeftLabel: "Χρόνος Που Απομένει" }
        };

        let currentPage, userLang, userName, userAnswers, activeQuestions, mistakes, timerInterval, timeLeft;
        const maxMistakes = 20;
        const totalQuestionsInTest = 60;
        
        const certModal = document.getElementById('certification-modal');
        const elements = {
            languageSelection: certModal.querySelector('#language-selection'),
            userInfo: certModal.querySelector('#user-info'),
            quizStats: certModal.querySelector('#quiz-stats'),
            quizContainer: certModal.querySelector('#quiz-container'),
            resultsContainer: certModal.querySelector('#results-container'),
            navigationContainer: certModal.querySelector('#navigation-container'),
            prevBtn: certModal.querySelector('#prev-btn'),
            nextBtn: certModal.querySelector('#next-btn'),
            submitBtn: certModal.querySelector('#submit-btn'),
            pageIndicator: certModal.querySelector('#page-indicator'),
            nameForm: certModal.querySelector('#name-form'),
            firstNameInput: certModal.querySelector('#first-name'),
            lastNameInput: certModal.querySelector('#last-name'),
            mistakeCounter: certModal.querySelector('#mistake-counter'),
            timerDisplay: certModal.querySelector('#timer-display'),
        };

        const setVisibility = (el, isVisible) => el.classList.toggle('hidden', !isVisible);

        window.resetQuiz = () => {
            currentPage = 1; userLang = 'en'; userName = ''; mistakes = 0;
            clearInterval(timerInterval);
            
            elements.firstNameInput.value = ''; elements.lastNameInput.value = '';
            elements.quizContainer.innerHTML = ''; elements.resultsContainer.innerHTML = '';

            setVisibility(elements.userInfo, false); setVisibility(elements.quizContainer, false);
            setVisibility(elements.quizStats, false); setVisibility(elements.resultsContainer, false);
            setVisibility(elements.navigationContainer, false); setVisibility(elements.languageSelection, true);
        };

        const selectLanguage = (lang) => {
            userLang = lang;
            const t = translations[lang];
            certModal.querySelector('#user-info-title').innerText = t.userInfoTitle;
            certModal.querySelector('#first-name-label').innerText = t.firstNameLabel;
            certModal.querySelector('#last-name-label').innerText = t.lastNameLabel;
            certModal.querySelector('#start-btn').innerText = t.startBtn;
            setVisibility(elements.languageSelection, false); setVisibility(elements.userInfo, true);
        };

        const startQuiz = (event) => {
            event.preventDefault();
            const firstName = elements.firstNameInput.value.trim();
            const lastName = elements.lastNameInput.value.trim();
            if (firstName && lastName) {
                userName = `${firstName} ${lastName}`;
                activeQuestions = [...fullQuizData].sort(() => 0.5 - Math.random()).slice(0, totalQuestionsInTest);
                userAnswers = new Array(activeQuestions.length).fill(null);
                
                setVisibility(elements.userInfo, false); setVisibility(elements.quizContainer, true);
                setVisibility(elements.navigationContainer, true); setVisibility(elements.quizStats, true);
                
                buildPages();
                renderPage(1);
                startTimer();
            }
        };
        
        const buildPages = () => {
            elements.quizContainer.innerHTML = '';
            activeQuestions.forEach((q, index) => {
                const pageDiv = document.createElement('div');
                pageDiv.id = `page-${index + 1}`;
                pageDiv.className = 'quiz-page hidden';
                const optionsHTML = q[`options_${userLang}`].map((opt, optIndex) => `
                    <label><input type="radio" name="question-${index}" value="${optIndex}"><span>${opt}</span></label>
                `).join('');
                pageDiv.innerHTML = `<h2>...</h2><hr><div class="question-box"><p>${q[`question_${userLang}`]}</p></div><div class="options-container">${optionsHTML}</div>`;
                pageDiv.querySelectorAll(`input[name="question-${index}"]`).forEach(radio => {
                    radio.addEventListener('change', () => saveAnswer(index, parseInt(radio.value)));
                });
                elements.quizContainer.appendChild(pageDiv);
            });
        };

        const saveAnswer = (questionIndex, answerIndex) => {
            userAnswers[questionIndex] = answerIndex;
            // PERFORMANCE OPTIMIZATION: Only update mistake counter when an answer changes.
            updateMistakeDisplay();
        };

        const startTimer = () => {
            clearInterval(timerInterval);
            timeLeft = 600;
            updateTimerDisplay();
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    showResults(); 
                }
            }, 1000);
        };
        
        const updateMistakeDisplay = () => {
             let currentMistakes = 0;
            userAnswers.forEach((answer, index) => {
                if (answer !== null && answer !== activeQuestions[index].correct_answer) {
                    currentMistakes++;
                }
            });
            elements.mistakeCounter.innerText = `${translations[userLang].mistakesLabel}: ${currentMistakes}`;
        };

        const updateTimerDisplay = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            elements.timerDisplay.innerText = `${translations[userLang].timeLeftLabel}: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        const renderPage = (pageNumber) => {
            currentPage = pageNumber;
            certModal.querySelectorAll('.quiz-page').forEach(p => setVisibility(p, false));
            const currentPageElement = certModal.querySelector(`#page-${currentPage}`);
            if (currentPageElement) setVisibility(currentPageElement, true);

            const savedAnswer = userAnswers[currentPage - 1];
            if (savedAnswer !== null) {
                const radio = certModal.querySelector(`#page-${currentPage} input[value="${savedAnswer}"]`);
                if(radio) radio.checked = true;
            }
            updateNavigation();
            updateMistakeDisplay(); // Initial display for the page
        };

        const updateNavigation = () => {
            const t = translations[userLang];
            elements.prevBtn.disabled = currentPage === 1;
            elements.prevBtn.innerText = t.prevBtn;
            elements.nextBtn.innerText = t.nextBtn;
            elements.submitBtn.innerText = t.submitBtn;
            setVisibility(elements.nextBtn, currentPage !== activeQuestions.length);
            setVisibility(elements.submitBtn, currentPage === activeQuestions.length);
            elements.pageIndicator.innerText = `${t.page} ${currentPage} ${t.of} ${activeQuestions.length}`;
            // Update page header title
            const header = certModal.querySelector(`#page-${currentPage} h2`);
            if (header) header.innerText = `${t.page} ${currentPage} ${t.of} ${activeQuestions.length}`;
        };

        const navigatePage = (direction) => {
            const newPage = currentPage + direction;
            if (newPage > 0 && newPage <= activeQuestions.length) renderPage(newPage);
        };

        const generateCertificateHTML = (lang, name, grade) => {
            const t = translations[lang];
            const today = new Date();
            const dateString = lang === 'gr' 
                ? `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
                : today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            return `
            <div class="certificate-container">
                <div class="certificate">
                    <div class="grade-display">${t.gradeLabel}: ${grade}</div>
                    <div class="certificate-header">
                        <svg class="seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle class="seal-border" cx="50" cy="50" r="48"/>
                            <path class="seal-star" d="M50,15 L55.9,34.5 H77.1 L60.6,46.4 L66.5,65.9 L50,54 L33.5,65.9 L39.4,46.4 L22.9,34.5 H44.1 Z"/>
                            <text class="seal-text" x="50" y="55">DEDSEC</text>
                        </svg>
                        <h1>${t.certTitle}</h1>
                    </div>
                    <div class="certificate-body">
                        <p class="serif">${t.certAwardedTo}</p>
                        <h2 class="recipient-name">${name}</h2>
                        <p class="serif">${t.certAchievement}</p>
                    </div>
                    <div class="certificate-footer">
                        <div class="date-info">
                            <strong>${t.certDate}</strong><br>
                            <span class="serif">${dateString}</span>
                        </div>
                        <div class="signature">
                            <strong>Project Lead</strong><br>
                            <span class="serif" style="font-style: italic;">dedsec1121fk</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
        };

        const downloadCertificates = async (name, gradeEn, gradeGr) => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const captureCertificate = async (lang, grade) => {
                const html = generateCertificateHTML(lang, name, grade);
                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.left = '-9999px';
                container.style.width = '900px'; 
                document.body.appendChild(container);
                container.innerHTML = html;
                
                await new Promise(resolve => setTimeout(resolve, 100)); 

                const canvas = await html2canvas(container.querySelector('.certificate-container'), { 
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null 
                });
                const imgData = canvas.toDataURL('image/png');
                document.body.removeChild(container);
                return imgData;
            };
            
            try {
                const imgDataEn = await captureCertificate('en', gradeEn);
                pdf.addImage(imgDataEn, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.addPage();
                const imgDataGr = await captureCertificate('gr', gradeGr);
                pdf.addImage(imgDataGr, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Termux_Mastery_Certificate_${name.replace(/\s/g, '_')}.pdf`);
            } catch (error) {
                console.error("PDF Generation Failed:", error);
                alert(translations[userLang].pdfError);
            }
        };

        const showResults = async () => {
            clearInterval(timerInterval);
            let finalMistakes = userAnswers.reduce((acc, answer, index) => 
                (answer === null || answer !== activeQuestions[index].correct_answer) ? acc + 1 : acc, 0);

            setVisibility(elements.quizContainer, false); setVisibility(elements.navigationContainer, false);
            setVisibility(elements.quizStats, false); setVisibility(elements.resultsContainer, true);
            const t = translations[userLang];
            
            if (finalMistakes <= maxMistakes) {
                const getGrade = (m) => (m <= 5) ? 'Excellent' : (m <= 12) ? 'VeryGood' : 'Good';
                const gradeKey = getGrade(finalMistakes);
                const userVisibleGrade = translations[userLang][`grade${gradeKey}`];
                elements.resultsContainer.innerHTML = generateCertificateHTML(userLang, userName, userVisibleGrade);
                
                const downloadMessage = document.createElement('p');
                downloadMessage.innerText = translations[userLang].downloadMessage || 'Your certificate PDF is downloading automatically...';
                downloadMessage.className = 'download-message';
                elements.resultsContainer.appendChild(downloadMessage);

                setTimeout(() => {
                    downloadCertificates(userName, translations.en[`grade${gradeKey}`], translations.gr[`grade${gradeKey}`]);
                }, 500);

            } else {
                elements.resultsContainer.innerHTML = `
                    <h1 class="text-red-600">${t.failureTitle}</h1>
                    <p>${t.failureText1} <strong>${finalMistakes}</strong> ${t.failureText2}</p>
                    <button id="restart-quiz-btn">${t.restartBtn}</button>
                `;
                certModal.querySelector('#restart-quiz-btn').addEventListener('click', resetQuiz);
            }
        };

        elements.languageSelection.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => selectLanguage(btn.dataset.lang));
        });
        elements.nameForm.addEventListener('submit', startQuiz);
        elements.prevBtn.addEventListener('click', () => navigatePage(-1));
        elements.nextBtn.addEventListener('click', () => navigatePage(1));
        elements.submitBtn.addEventListener('click', showResults);
    }

    // --- INITIALIZE ALL FEATURES ---
    initializePortfolio();
    initializeCertificationQuiz();
});