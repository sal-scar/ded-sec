document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL PORTFOLIO STATE ---
    let currentLanguage = 'en';
    let searchIndex = [];
    let usefulInfoSearchIndex = []; // Dedicated index for the modal
    let usefulInformationLoaded = false;
    let isFetchingUsefulInfo = false;
    
    // --- PORTFOLIO INITIALIZATION ---
    function initializePortfolio() {
        // --- MODAL HELPER FUNCTIONS ---
        function showModal(modal) {
            if (!modal) return;
            modal.classList.add('visible');
        }

        function hideModal(modal) {
            if (!modal) return;
            modal.classList.remove('visible');
        }

        // --- LANGUAGE AND MODAL LOGIC ---
        const languageModal = document.getElementById('language-selection-modal');
        const languageModalCloseBtn = languageModal.querySelector('.close-modal');
        const disclaimerModal = document.getElementById('disclaimer-modal');
        const installationModal = document.getElementById('installation-modal');

        window.changeLanguage = (lang) => {
            currentLanguage = lang;
            document.documentElement.lang = lang;
            
            document.querySelectorAll('[data-en]').forEach(el => {
                const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
                const isSimpleTextElement = el.matches('h1, h2, h3, p, label, button, span, a');

                // FIX: More robust check to prevent destroying child HTML elements.
                // Only update textContent if the element has no element children.
                const hasElementChild = el.children.length > 0;

                if (isSimpleTextElement && !hasElementChild) {
                     el.textContent = text;
                }
            });

            document.querySelectorAll('[data-lang-section]').forEach(el => {
                el.style.display = el.dataset.langSection === lang ? 'block' : 'none';
            });
            
            document.querySelectorAll('.language-button').forEach(button => {
                button.classList.toggle('selected', button.dataset.lang === lang);
            });

            const pageTitleEl = document.querySelector('title');
            if (pageTitleEl) document.title = "DedSec Project";

            const searchInput = document.getElementById('main-search-input');
            if (searchInput) {
                searchInput.placeholder = lang === 'gr' ? 'Αναζήτηση...' : 'Search...';
            }
            const usefulInfoSearchInput = document.getElementById('useful-info-search-input');
            if (usefulInfoSearchInput) {
                usefulInfoSearchInput.placeholder = lang === 'gr' ? 'Αναζήτηση άρθρων...' : 'Search articles...';
            }
        };
        
        languageModal.querySelectorAll('.language-button').forEach(button => {
            button.addEventListener('click', () => {
                try {
                    changeLanguage(button.dataset.lang);
                } catch (error) {
                    console.error("An error occurred while changing the language:", error);
                } finally {
                    hideModal(languageModal);
                }
            });
        });
        
        document.getElementById('lang-switcher-btn').addEventListener('click', () => {
            if (languageModalCloseBtn) languageModalCloseBtn.style.display = '';
            showModal(languageModal);
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

        // --- DISCLAIMER AND MODAL OPENING LOGIC ---
        document.getElementById('accept-disclaimer').addEventListener('click', () => {
            hideModal(disclaimerModal);
            if (installationModal) {
                showModal(installationModal);
            }
        });
        document.getElementById('decline-disclaimer').addEventListener('click', () => window.location.href = 'https://www.google.com');
        
        document.querySelectorAll('button.app-wrapper[data-modal], a.app-wrapper').forEach(wrapper => {
            const modalId = wrapper.dataset.modal;
            if (modalId) {
                const clickHandler = () => {
                    if (modalId === 'installation') {
                        if (disclaimerModal) showModal(disclaimerModal);
                    } else {
                        const modal = document.getElementById(`${modalId}-modal`);
                        if (modal) {
                             showModal(modal);
                             if (modalId === 'certification' && window.resetQuiz) {
                                 window.resetQuiz();
                             }
                             if (modalId === 'useful-information' && !usefulInformationLoaded) {
                                fetchUsefulInformation();
                             }
                        }
                    }
                };
                wrapper.addEventListener('click', clickHandler);
            }
        });

        // --- MODAL CLOSING AND RESET LOGIC ---
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            const closeModal = () => {
                hideModal(modal);

                // FIX: Add this check to prevent quiz timer memory leak upon closing the modal.
                if (modal.id === 'certification-modal' && window.resetQuiz) {
                    window.resetQuiz();
                }

                if (modal.id === 'useful-information-modal') {
                    document.getElementById('useful-info-prompt').style.display = 'block';
                    document.getElementById('useful-information-content').innerHTML = '';
                    document.getElementById('useful-info-search-input').value = '';
                    document.getElementById('useful-info-results-container').classList.add('hidden');
                    document.getElementById('useful-information-nav').querySelectorAll('.app-icon').forEach(article => {
                        article.style.display = 'flex';
                    });
                }
            };
            
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            const closeModalButton = modal.querySelector('.close-modal');
            if (closeModalButton) {
                closeModalButton.addEventListener('click', closeModal);
            }
        });
        
        window.copyToClipboard = (button, targetId) => {
            const codeElement = document.getElementById(targetId);
            if (!codeElement || !navigator.clipboard) return; 

            const textToCopy = codeElement.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = (currentLanguage === 'gr') ? 'Αντιγράφηке!' : 'Copied!';
                setTimeout(() => { button.textContent = originalText; }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
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
                    images.forEach((img, i) => img.classList.toggle('active', i === index));
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
        
        // --- SEARCH FUNCTIONALITY ---
        function buildSearchIndex() {
            if (searchIndex.length > 0) return;
            document.querySelectorAll('.app-wrapper[data-modal]').forEach(el => {
                const span = el.querySelector('.app-label');
                if (span && el.dataset.modal) {
                    searchIndex.push({
                        en: span.getAttribute('data-en') || '',
                        gr: span.getAttribute('data-gr') || '',
                        type: 'modal_button',
                        target: el.dataset.modal,
                        element: el
                    });
                }
            });
            // Include link-based app wrappers like 'DedSec Store'
            document.querySelectorAll('a.app-wrapper').forEach(el => {
                const span = el.querySelector('.app-label');
                if (span && el.href) {
                     searchIndex.push({
                        en: span.getAttribute('data-en') || span.textContent,
                        gr: span.getAttribute('data-gr') || span.textContent,
                        type: 'link_button',
                        target: el.href,
                        element: el
                    });
                }
            });
        }
        
        function initializeSearch() {
            const searchInput = document.getElementById('main-search-input');
            const resultsContainer = document.getElementById('search-results-container');
            const searchContainer = document.querySelector('.search-container');

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();
                resultsContainer.innerHTML = '';

                if (query.length < 2) {
                    resultsContainer.classList.add('hidden');
                    return;
                }
                
                let results = searchIndex.filter(item => {
                    // Check against both current language text and English/default text for robustness
                    const textEn = (item['en'] || '').toLowerCase();
                    const textGr = (item['gr'] || '').toLowerCase();
                    const currentText = (item[currentLanguage] || item['en'] || '').toLowerCase();
                    return currentText.includes(query) || textEn.includes(query) || textGr.includes(query);
                });
                
                if (results.length > 0) {
                    results.slice(0, 7).forEach(result => {
                        const itemEl = document.createElement('div');
                        itemEl.classList.add('search-result-item');
                        const mainText = result[currentLanguage] || result['en'];
                        itemEl.innerHTML = mainText.replace(new RegExp(query, 'gi'), '<strong>$&</strong>');
                        
                        itemEl.addEventListener('click', (e) => {
                            // FIX: Use requestAnimationFrame for reliable click propagation
                            e.preventDefault(); 
                            searchInput.value = '';
                            resultsContainer.classList.add('hidden');
                            
                            // Ensure the browser finishes handling the click on the result element 
                            // before the blur event fires and prevents the target element's click.
                            window.requestAnimationFrame(() => {
                                if (result.element) result.element.click();
                            });
                        });
                        resultsContainer.appendChild(itemEl);
                    });
                    resultsContainer.classList.remove('hidden');
                } else {
                    const noResultEl = document.createElement('div');
                    noResultEl.classList.add('search-result-item');
                    noResultEl.textContent = currentLanguage === 'gr' ? 'Δεν βρέθηκαν αποτελέσματα' : 'No results found';
                    resultsContainer.appendChild(noResultEl);
                    resultsContainer.classList.remove('hidden');
                }
            });

            searchInput.addEventListener('blur', () => {
                // Keep the small timeout to allow click events to register before hiding.
                setTimeout(() => {
                    resultsContainer.classList.add('hidden');
                }, 150);
            });

            document.addEventListener('click', (e) => {
                if (searchContainer && !searchContainer.contains(e.target)) {
                    resultsContainer.classList.add('hidden');
                }
            });
        }
        
        function initializeUsefulInfoSearch() {
            const searchInput = document.getElementById('useful-info-search-input');
            const resultsContainer = document.getElementById('useful-info-results-container');
            if (!searchInput || !resultsContainer) return;

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();
                resultsContainer.innerHTML = '';

                if (query.length < 3) {
                    resultsContainer.classList.add('hidden');
                    document.getElementById('useful-information-nav').querySelectorAll('.app-icon').forEach(article => {
                        article.style.display = 'flex';
                    });
                    return;
                }
                
                // Hide the main nav elements when search results appear
                document.getElementById('useful-information-nav').querySelectorAll('.app-icon').forEach(article => {
                    article.style.display = 'none';
                });

                let results = usefulInfoSearchIndex.filter(item => 
                    item.lang === currentLanguage && item.text.toLowerCase().includes(query)
                );
                
                // Sorted results (no deduplication)
                const sortedResults = results.sort((a, b) => b.weight - a.weight);

                if (sortedResults.length > 0) {
                    sortedResults.slice(0, 7).forEach(result => {
                        const itemEl = document.createElement('div');
                        itemEl.classList.add('search-result-item');
                        const snippet = result.text.substring(0, 100) + (result.text.length > 100 ? '...' : '');
                        const highlightedSnippet = snippet.replace(new RegExp(`(${query})`, 'gi'), '<strong>$1</strong>');
                        itemEl.innerHTML = `${highlightedSnippet} <small>${result.title}</small>`;
                        
                        itemEl.addEventListener('click', async () => {
                            searchInput.value = '';
                            resultsContainer.classList.add('hidden');
                            // This function handles loading the content and applying the highlight (yellow glow)
                            await loadInformationContent(result.url, result.text); 
                        });
                        resultsContainer.appendChild(itemEl);
                    });
                    resultsContainer.classList.remove('hidden');
                } else {
                    resultsContainer.classList.add('hidden');
                }
            });

            document.addEventListener('click', (e) => {
                const searchContainer = document.querySelector('.modal-search-container');
                if (searchContainer && !searchContainer.contains(e.target)) {
                    resultsContainer.classList.add('hidden');
                }
            });
        }
        
        // --- INITIAL PAGE LOAD ---
        if (languageModalCloseBtn) languageModalCloseBtn.style.display = 'none';
        showModal(languageModal);
        changeLanguage('en'); 
        document.querySelector('#language-selection-modal .modal-header h2').textContent = 'Choose Language / Επιλογή Γλώσσας';
        
        buildSearchIndex();
        initializeSearch();
        initializeUsefulInfoSearch();
    }

    // --- USEFUL INFORMATION LOGIC (GITHUB API - FIXED) ---
    async function fetchUsefulInformation() {
        if (usefulInformationLoaded || isFetchingUsefulInfo) return;

        isFetchingUsefulInfo = true;
        const navContainer = document.getElementById('useful-information-nav');
        const GITHUB_API_URL = 'https://api.github.com/repos/dedsec1121fk/dedsec1121fk.github.io/contents/Useful_Information';
        
        navContainer.innerHTML = `<p>${currentLanguage === 'gr' ? 'Φόρτωση...' : 'Loading...'}</p>`;
        
        try {
            const response = await fetch(GITHUB_API_URL);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            const files = await response.json();
            
            const htmlFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.html'));
            
            if (htmlFiles.length === 0) {
                 navContainer.innerHTML = `<p>${currentLanguage === 'gr' ? 'Δεν βρέθηκαν πληροφορίες.' : 'No information found.'}</p>`;
                 return;
            }
            
            usefulInfoSearchIndex = [];
            // This promise array will hold all the fetch operations for individual files.
            const indexPromises = htmlFiles.map(async (file) => {
                try {
                    const tipContentResponse = await fetch(file.download_url);
                    if (!tipContentResponse.ok) return; // Skip failed fetches
                    const htmlContent = await tipContentResponse.text();
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;
                    
                    const infoName = file.name.replace(/_\d*\.html$/, '').replace(/_/g, ' ');

                    tempDiv.querySelectorAll('[data-lang-section]').forEach(section => {
                        const lang = section.dataset.langSection;
                        section.querySelectorAll('p, li, h3, b, code').forEach(el => {
                            const text = el.textContent.trim();
                            if (text.length > 5) {
                                usefulInfoSearchIndex.push({
                                    lang: lang,
                                    title: infoName,
                                    text: text,
                                    url: file.download_url,
                                    weight: (el.tagName === 'H3' ? 5 : 1)
                                });
                            }
                        });
                    });
                } catch (e) {
                    console.error(`Failed to index information: ${file.name}`, e);
                }
            });
            
            // CRITICAL FIX: Wait for all the file fetches and indexing to complete.
            await Promise.all(indexPromises);

            // Now that indexing is complete, populate the navigation.
            navContainer.innerHTML = '';
            htmlFiles.forEach(file => {
                const button = document.createElement('button'); // Use button for accessibility
                button.className = 'app-icon';
                const icon = document.createElement('i');
                icon.className = 'fas fa-book-open';
                const span = document.createElement('span');
                span.textContent = file.name.replace(/_\d*\.html$/, '').replace(/_/g, ' ');
                button.appendChild(icon);
                button.appendChild(span);
                button.addEventListener('click', () => loadInformationContent(file.download_url));
                navContainer.appendChild(button);
            });

            usefulInformationLoaded = true;

        } catch (error) {
            console.error('Failed to fetch useful information:', error);
            navContainer.innerHTML = `<p style="color: var(--nm-danger);">${currentLanguage === 'gr' ? 'Αποτυχία φόρτωσης περιεχομένου.' : 'Failed to load content.'}</p>`;
        } finally {
            isFetchingUsefulInfo = false;
        }
    }

    async function loadInformationContent(url, textToHighlight = null) {
        const contentContainer = document.getElementById('useful-information-content');
        document.getElementById('useful-info-prompt').style.display = 'none';
        contentContainer.innerHTML = `<p>${currentLanguage === 'gr' ? 'Φόρτωση...' : 'Loading...'}</p>`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch content: ${response.status}`);
            const htmlContent = await response.text();
            contentContainer.innerHTML = htmlContent;
            changeLanguage(currentLanguage);

            // Logic to find, scroll, and highlight the result
            if (textToHighlight) {
                const allElements = contentContainer.querySelectorAll('p, li, h3, b, code');
                // Use .includes() for a more robust match
                const targetElement = Array.from(allElements).find(el => el.textContent.trim().includes(textToHighlight.trim()));

                if (targetElement) {
                    // Scroll the element into the middle of the view
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Add the highlight class
                    targetElement.classList.add('content-highlight');

                    // Remove the highlight after 2.5 seconds for a temporary effect
                    setTimeout(() => {
                        targetElement.classList.remove('content-highlight');
                    }, 2500);
                }
            }
        } catch (error) {
            console.error('Failed to load content:', error);
            contentContainer.innerHTML = `<p style="color: var(--nm-danger);">${currentLanguage === 'gr' ? 'Αποτυχία φόρτωσης περιεχομένου.' : 'Failed to load content.'}</p>`;
        }
    }
    
    // --- CERTIFICATION QUIZ LOGIC (DATA FETCHED EXTERNALLY) ---
    async function initializeCertificationQuiz() {
        // This will hold the quiz data once fetched
        let fullQuizData = [];

        const translations = {
            en: { userInfoTitle: "Enter Your Details", firstNameLabel: "First Name", lastNameLabel: "Last Name", startBtn: "Start Workbook Exam", page: "Page", of: "of", prevBtn: "Previous", nextBtn: "Next", submitBtn: "Submit Test", resultsTitle: "Test Complete!", certTitle: "Certificate of Completion", certAwardedTo: "This certificate is awarded to", certAchievement: "for successfully completing the Termux Mastery Series seminar with exceptional knowledge and skill.", certDate: "Date of Completion", failureTitle: "Keep Studying!", failureText1: "You have completed the test, but you made", failureText2: "mistakes. You need fewer than 20 mistakes to pass. Please review the material and try again!", restartBtn: "Try Again", gradeLabel: "Grade", gradeExcellent: "Excellent", gradeVeryGood: "Very Good", gradeGood: "Good", pdfError: "Sorry, there was an error creating the PDF.", mistakesLabel: "Mistakes", timeLeftLabel: "Time Left" },
            gr: { userInfoTitle: "Εισάγετε τα Στοιχεία σας", firstNameLabel: "Όνομα", lastNameLabel: "Επώνυμο", startBtn: "Έναρξη Εξέτασης", page: "Σελίδα", of: "από", prevBtn: "Προηγούμενο", nextBtn: "Επόμενο", submitBtn: "Υποβολή Εξέτασης", resultsTitle: "Η Εξέταση Ολοκληρώθηκε!", certTitle: "Πιστοποιητικό Ολοκλήρωσης", certAwardedTo: "Αυτό το πιστοποιητικό απονέμεται στον/στην", certAchievement: "για την επιτυχή ολοκλήρωση του σεμιναρίου Termux Mastery Series με εξαιρετική γνώση και δεξιότητα.", certDate: "Ημερομηνία Ολοκλήρωσης", failureTitle: "Συνεχíστε τη Μελέτη!", failureText1: "Ολοκληρώσατε την εξέταση, αλλά κάνατε", failureText2: "λάθη. Χρειάζεστε λιγότερα από 20 λάθη για να περάσετε. Παρακαλώ μελετήστε ξανά την ύλη και προσπαθήστε ξανά!", restartBtn: "Προσπαθήστε Ξανά", gradeLabel: "Βαθμός", gradeExcellent: "Άριστα", gradeVeryGood: "Πολύ Καλά", gradeGood: "Καλά", pdfError: "Παρουσιάστηκε σφάλμα κατά τη δημιουργία του PDF.", mistakesLabel: "Λάθη", timeLeftLabel: "Χρόνος Που Απομένει" }
        };
        
        // Fetch the quiz data from the external JSON file
        try {
            const response = await fetch('quiz-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            fullQuizData = await response.json();
        } catch (error) {
            console.error("Failed to load quiz data:", error);
            // Display an error message to the user inside the modal
            const certModal = document.getElementById('certification-modal');
            certModal.innerHTML = '<div class="modal-content"><p style="color: var(--nm-danger);">Error: Could not load quiz questions. Please check the console and try again.</p></div>';
            return; // Stop the function if data loading fails
        }

        let currentPage, userLang, userName, userAnswers, activeQuestions;
        let mistakes = 0;
        const maxMistakes = 20;
        const totalQuestionsInTest = 60;
        let timerInterval;
        let timeLeft = 600; 

        const certModal = document.getElementById('certification-modal');
        const languageSelectionDiv = certModal.querySelector('#language-selection');
        const userInfoDiv = certModal.querySelector('#user-info');
        const quizStatsDiv = certModal.querySelector('#quiz-stats');
        const quizContainerDiv = certModal.querySelector('#quiz-container');
        const resultsContainerDiv = certModal.querySelector('#results-container');
        const navigationContainerDiv = certModal.querySelector('#navigation-container');
        const prevBtn = certModal.querySelector('#prev-btn');
        const nextBtn = certModal.querySelector('#next-btn');
        const submitBtn = certModal.querySelector('#submit-btn');
        const pageIndicator = certModal.querySelector('#page-indicator');
        const nameForm = certModal.querySelector('#name-form');
        const firstNameInput = certModal.querySelector('#first-name');
        const lastNameInput = certModal.querySelector('#last-name');
        const mistakeCounterEl = certModal.querySelector('#mistake-counter');
        const timerDisplayEl = certModal.querySelector('#timer-display');

        window.resetQuiz = () => {
            currentPage = 1;
            userLang = 'en';
            userName = '';
            mistakes = 0;
            clearInterval(timerInterval);
            
            firstNameInput.value = '';
            lastNameInput.value = '';
            quizContainerDiv.innerHTML = '';
            resultsContainerDiv.innerHTML = '';

            userInfoDiv.classList.add('hidden');
            quizContainerDiv.classList.add('hidden');
            quizStatsDiv.classList.add('hidden');
            resultsContainerDiv.classList.add('hidden');
            navigationContainerDiv.classList.add('hidden');
            languageSelectionDiv.classList.remove('hidden');
        };

        const selectLanguage = (lang) => {
            userLang = lang;
            const t = translations[lang];
            certModal.querySelector('#user-info-title').innerText = t.userInfoTitle;
            certModal.querySelector('#first-name-label').innerText = t.firstNameLabel;
            certModal.querySelector('#last-name-label').innerText = t.lastNameLabel;
            certModal.querySelector('#start-btn').innerText = t.startBtn;
            languageSelectionDiv.classList.add('hidden');
            userInfoDiv.classList.remove('hidden');
        };

        const startQuiz = (event) => {
            event.preventDefault();
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            if (firstName && lastName) {
                userName = `${firstName} ${lastName}`;
                activeQuestions = [...fullQuizData].sort(() => Math.random() - 0.5).slice(0, totalQuestionsInTest);
                userAnswers = new Array(activeQuestions.length).fill(null);
                
                userInfoDiv.classList.add('hidden');
                quizContainerDiv.classList.remove('hidden');
                navigationContainerDiv.classList.remove('hidden');
                quizStatsDiv.classList.remove('hidden');
                
                buildPages();
                renderPage();
            }
        };
        
        const buildPages = () => {
            quizContainerDiv.innerHTML = '';
            activeQuestions.forEach((q, index) => {
                const t = translations[userLang];
                const pageDiv = document.createElement('div');
                pageDiv.id = `page-${index + 1}`;
                pageDiv.classList.add('quiz-page', 'hidden');

                const optionsHTML = q[`options_${userLang}`].map((opt, optIndex) => `
                    <label>
                        <input type="radio" name="question-${index}" value="${optIndex}">
                        <span>${opt}</span>
                    </label>
                `).join('');

                pageDiv.innerHTML = `
                    <h2>${t.page} ${index + 1} ${t.of} ${activeQuestions.length}</h2>
                    <hr>
                    <div class="question-box"><p>${q[`question_${userLang}`]}</p></div>
                    <div class="options-container">${optionsHTML}</div>
                `;
                pageDiv.querySelectorAll(`input[name="question-${index}"]`).forEach(radio => {
                    radio.addEventListener('change', () => saveAnswer(index, parseInt(radio.value)));
                });
                quizContainerDiv.appendChild(pageDiv);
            });
        };

        const saveAnswer = (questionIndex, answerIndex) => {
            userAnswers[questionIndex] = answerIndex;
        };

        const startTimer = () => {
            clearInterval(timerInterval);
            timeLeft = 600;
            updateStatsDisplay();

            timerInterval = setInterval(() => {
                timeLeft--;
                updateStatsDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    showResults(); 
                }
            }, 1000);
        };

        const updateStatsDisplay = () => {
            const t = translations[userLang];
            let currentMistakes = 0;
            userAnswers.forEach((answer, index) => {
                if (answer !== null && answer !== activeQuestions[index].correct_answer) {
                    currentMistakes++;
                }
            });
            mistakeCounterEl.innerText = `${t.mistakesLabel}: ${currentMistakes}`;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplayEl.innerText = `${t.timeLeftLabel}: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        const renderPage = () => {
            certModal.querySelectorAll('.quiz-page').forEach(p => p.classList.add('hidden'));
            const currentPageElement = certModal.querySelector(`#page-${currentPage}`);
            if (currentPageElement) {
                currentPageElement.classList.remove('hidden');
            }

            const savedAnswer = userAnswers[currentPage - 1];
            if (savedAnswer !== null) {
                const radioButtons = certModal.querySelectorAll(`#page-${currentPage} input[type="radio"]`);
                if(radioButtons[savedAnswer]) radioButtons[savedAnswer].checked = true;
            }
            updateNavigation();
            if (currentPage === 1) { 
                startTimer();
            }
            updateStatsDisplay();
        };

        const updateNavigation = () => {
            const t = translations[userLang];
            prevBtn.disabled = currentPage === 1;
            prevBtn.innerText = t.prevBtn;
            nextBtn.innerText = t.nextBtn;
            submitBtn.innerText = t.submitBtn;
            nextBtn.classList.toggle('hidden', currentPage === activeQuestions.length);
            submitBtn.classList.toggle('hidden', currentPage !== activeQuestions.length);
            pageIndicator.innerText = `${t.page} ${currentPage} ${t.of} ${activeQuestions.length}`;
        };

        const navigatePage = (direction) => {
            const newPage = currentPage + direction;
            if (newPage > 0 && newPage <= activeQuestions.length) {
                currentPage = newPage;
                renderPage();
            }
        };

        const generateCertificateHTML = (lang, name, grade, finalMistakes) => {
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

        const downloadCertificates = async (name, gradeEn, gradeGr, finalMistakes) => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const captureCertificate = async (lang, grade) => {
                const html = generateCertificateHTML(lang, name, grade, finalMistakes);
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
            
            let finalMistakes = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === null || answer !== activeQuestions[index].correct_answer) {
                    finalMistakes++;
                }
            });

            quizContainerDiv.classList.add('hidden');
            navigationContainerDiv.classList.add('hidden');
            quizStatsDiv.classList.add('hidden');
            resultsContainerDiv.classList.remove('hidden');
            const t = translations[userLang];
            
            if (finalMistakes <= maxMistakes) {
                const getGrade = (m) => {
                    if (m <= 5) return 'Excellent';
                    if (m <= 12) return 'VeryGood';
                    return 'Good';
                };
                const gradeKey = getGrade(finalMistakes);
                const gradeEn = translations.en[`grade${gradeKey}`];
                const gradeGr = translations.gr[`grade${gradeKey}`];
                const userVisibleGrade = userLang === 'en' ? gradeEn : gradeGr;

                resultsContainerDiv.innerHTML = generateCertificateHTML(userLang, userName, userVisibleGrade, finalMistakes);
                
                const downloadMessage = document.createElement('p');
                const messageText = {
                    en: 'Your certificate PDF is downloading automatically...',
                    gr: 'Το πιστοποιητικό σας σε PDF κατεβαίνει αυτόματα...'
                };
                downloadMessage.innerText = messageText[userLang];
                downloadMessage.style.marginTop = '1rem';
                downloadMessage.style.color = 'var(--nm-accent)';
                downloadMessage.style.fontFamily = "'Roboto Mono', monospace";
                resultsContainerDiv.appendChild(downloadMessage);

                setTimeout(() => {
                    downloadCertificates(userName, gradeEn, gradeGr, finalMistakes);
                }, 500);

            } else {
                resultsContainerDiv.innerHTML = `
                    <h1 class="text-red-600">${t.failureTitle}</h1>
                    <p>${t.failureText1} <strong>${finalMistakes}</strong> ${t.failureText2}</p>
                    <button id="restart-quiz-btn">${t.restartBtn}</button>
                `;
                certModal.querySelector('#restart-quiz-btn').addEventListener('click', resetQuiz);
            }
        };
        
        // --- EVENT LISTENERS ---
        languageSelectionDiv.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => selectLanguage(btn.dataset.lang));
        });
        nameForm.addEventListener('submit', startQuiz);
        prevBtn.addEventListener('click', () => navigatePage(-1));
        nextBtn.addEventListener('click', () => navigatePage(1));
        submitBtn.addEventListener('click', showResults);
    }

    // --- INITIALIZE ALL FEATURES ---
    initializePortfolio();
    initializeCertificationQuiz();
});
