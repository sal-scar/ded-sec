document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE & CONFIGURATION ---
    let currentLanguage = localStorage.getItem('lang') || 'en';
    let isDisclaimerAccepted = localStorage.getItem('disclaimerAccepted') === 'true';

    // --- SEARCH INDEXES ---
    let siteWideSearchIndex = []; // Search results for all modals (site-wide)
    let usefulInfoSearchIndex = []; // Search results for Useful Information articles
    let usefulInformationLoaded = false;
    let isFetchingUsefulInfo = false;

    // --- DOM REFERENCES ---
    const body = document.body;
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const languageModal = document.getElementById('language-selection-modal');
    const languageModalCloseBtn = languageModal.querySelector('.close-modal');
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const langSwitcherBtn = document.getElementById('lang-switcher-btn');
    const mainSearchInput = document.getElementById('main-search-input');
    const usefulInfoSearchInput = document.getElementById('useful-info-search-input');
    const appGrid = document.querySelector('.app-grid');


    // =================================================================
    //  HELPER FUNCTIONS
    // =================================================================

    /** Shows a modal by adding the 'visible' class. */
    const showModal = (modal) => {
        if (modal) modal.classList.add('visible');
    };

    /** Hides a modal by removing the 'visible' class and runs cleanup. */
    const hideModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('visible');
        
        // Modal-specific cleanup for Useful Information
        if (modal.id === 'useful-information-modal') {
            document.getElementById('useful-info-prompt').style.display = 'block';
            document.getElementById('useful-information-content').innerHTML = '';
            usefulInfoSearchInput.value = '';
            document.getElementById('useful-info-results-container').classList.add('hidden');
            document.getElementById('useful-information-nav').querySelectorAll('.app-icon').forEach(article => {
                article.style.display = 'flex';
            });
        }
        
        // Remove content highlight on close
        modal.querySelectorAll('.content-highlight').forEach(el => {
            el.classList.remove('content-highlight');
        });
    };

    /** Scrolls and highlights specific text within an open modal. */
    const highlightModalContent = (modal, text) => {
        const modalBody = modal.querySelector('.modal-body');
        if (!modalBody) return;
        
        // Look for the specific text within the currently active language section
        const activeSection = modalBody.querySelector(`[data-lang-section="${currentLanguage}"]`) || modalBody;
        
        // Select elements that typically contain the searchable text
        const allElements = activeSection.querySelectorAll('h3, h4, p, li, b, code, span, .tip, .note');
        
        // Find the element containing the exact search text.
        const targetElement = Array.from(allElements).find(el => el.textContent.trim().includes(text.trim()));

        if (targetElement) {
            // Ensure the modal body scrolls to the target element
            modalBody.scrollTo({ top: targetElement.offsetTop - 50, behavior: 'smooth' });
            
            // Add the highlight class
            targetElement.classList.add('content-highlight');

            // Remove the highlight after a delay for the pulsing effect
            setTimeout(() => {
                targetElement.classList.remove('content-highlight');
            }, 2500);
        } else {
             // Fallback: If exact text isn't found, try scrolling to the top of the modal content section.
             const firstContent = activeSection.querySelector('h3, p');
             if (firstContent) {
                 modalBody.scrollTo({ top: firstContent.offsetTop - 50, behavior: 'smooth' });
             }
        }
    };
    
    /** Open modal and optionally highlight text within it. */
    window.openModalAndHighlight = (modalId, highlightText = null) => {
        if (modalId === 'installation' && !isDisclaimerAccepted && disclaimerModal) {
            // Special case: must accept disclaimer first
            showModal(disclaimerModal);
            return;
        }
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) {
            showModal(modal);
            
            // If the Useful Info modal is opened, start fetching the content index if not loaded
            if (modalId === 'useful-information' && !usefulInformationLoaded) {
                fetchUsefulInformation();
            }
            
            // Highlight the text after a small delay to ensure the content is visible
            if (highlightText) {
                setTimeout(() => {
                    highlightModalContent(modal, highlightText);
                }, 100); 
            }
        }
    };

    /** Copies code to clipboard and shows a temporary 'Copied!' message. */
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

    // =================================================================
    //  LANGUAGE & THEME MANAGEMENT
    // =================================================================

    /** Updates text content and visibility based on the selected language. */
    const updateLanguageContent = (lang) => {
        currentLanguage = lang;
        
        try {
            localStorage.setItem('lang', lang);
        } catch(e) { /* Ignore storage errors in private mode */ }
        
        document.documentElement.lang = lang;
        
        // 1. Update data-lang translated text
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
            // Only update if the element has no other element children, to preserve complex HTML
            if (el.children.length === 0) {
                 el.textContent = text;
            }
        });

        // 2. Hide/Show language-specific sections by toggling a class
        // This is a refactor from inline style to be more CSS-friendly
        document.querySelectorAll('[data-lang-section]').forEach(el => {
            el.classList.toggle('hidden-by-default', el.dataset.langSection !== lang);
        });
        
        // 3. Update search input placeholders
        if (mainSearchInput) {
            mainSearchInput.placeholder = lang === 'gr' ? 'Αναζήτηση...' : 'Search...';
        }
        if (usefulInfoSearchInput) {
            usefulInfoSearchInput.placeholder = lang === 'gr' ? 'Αναζήτηση άρθρων...' : 'Search articles...';
        }
        
        // 4. Update language buttons
        document.querySelectorAll('.language-button').forEach(button => {
            button.classList.toggle('selected', button.dataset.lang === lang);
        });
        
        // 5. Update theme switcher display (since its text is translated)
        updateThemeDisplay(body.classList.contains('light-theme'));
    };

    /** Updates the theme switcher button text/icon and local storage. */
    const updateThemeDisplay = (isLightTheme) => {
        const themeIcon = themeSwitcherBtn.querySelector('i');
        const themeSpan = themeSwitcherBtn.querySelector('span');
        
        // Update Icon
        themeIcon.classList.toggle('fa-moon', !isLightTheme);
        themeIcon.classList.toggle('fa-sun', isLightTheme);
        
        // Update Text Attributes
        themeSpan.setAttribute('data-en', isLightTheme ? 'Light Theme' : 'Dark Theme');
        themeSpan.setAttribute('data-gr', isLightTheme ? 'Φωτεινό Θέμα' : 'Σκοτεινό Θέμα');

        // Re-apply translation for the updated button text attributes
        // (This call is now reliable due to the checks in updateLanguageContent)
        if (themeSpan.children.length === 0) {
            themeSpan.textContent = themeSpan.getAttribute(`data-${currentLanguage}`) || themeSpan.getAttribute('data-en');
        }
    };

    // =================================================================
    //  SEARCH INDEXING
    // =================================================================
    
    /** Builds a comprehensive index for all modal content. */
    const buildSiteWideSearchIndex = () => {
        if (siteWideSearchIndex.length > 0) return;
        
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            // Skip transient modals
            if (['language-selection-modal', 'disclaimer-modal', 'image-viewer-modal', 'useful-information-modal'].includes(modal.id)) return;
            
            const modalId = modal.id.replace('-modal', '');
            const modalTitleEl = modal.querySelector('.modal-header h2');
            
            // Get titles from data attributes
            const modalTitleEn = modalTitleEl ? modalTitleEl.getAttribute('data-en') : modalId;
            const modalTitleGr = modalTitleEl ? modalTitleEl.getAttribute('data-gr') : modalId;
            const titles = { 'en': modalTitleEn, 'gr': modalTitleGr };

            modal.querySelectorAll('.modal-body').forEach(body => {
                // Determine language section based on data-lang-section, default to 'en'
                const lang = body.dataset.langSection || 'en';

                // Select all relevant text containers within the body
                body.querySelectorAll('h3, h4, p, li, b, code, .tip, .note, .modal-disclaimer').forEach(el => {
                    const text = el.textContent.trim().replace(/\s\s+/g, ' ');
                    if (text.length < 5) return;
                    
                    const isTitle = ['H3', 'H4'].includes(el.tagName);
                    
                    siteWideSearchIndex.push({
                        lang: lang,
                        title: titles[lang],
                        text: text, // Store the full text for reliable highlighting
                        modalId: modalId,
                        weight: isTitle ? 5 : 1
                    });
                });
            });
        });
    };
    
    /** Initializes the main site-wide search input handler. */
    const initializeSearch = () => {
        const resultsContainer = document.getElementById('search-results-container');
        const searchContainer = document.querySelector('.search-container');

        if (!mainSearchInput || !resultsContainer) return;

        mainSearchInput.addEventListener('input', () => {
            const query = mainSearchInput.value.toLowerCase().trim();
            resultsContainer.innerHTML = '';

            if (query.length < 2) {
                resultsContainer.classList.add('hidden');
                return;
            }
            
            // Search the full, site-wide index
            let results = siteWideSearchIndex.filter(item => {
                return item.lang === currentLanguage && item.text.toLowerCase().includes(query);
            });

            // Sort results by weight (to prioritize titles)
            results.sort((a, b) => b.weight - a.weight);
            
            if (results.length > 0) {
                // Show top 7 results
                results.slice(0, 7).forEach(result => {
                    const itemEl = document.createElement('div');
                    itemEl.classList.add('search-result-item');
                    
                    // Create a snippet from the full text for display
                    const matchIndex = result.text.toLowerCase().indexOf(query);
                    const startIndex = Math.max(0, matchIndex - 30);
                    const snippet = result.text.substring(startIndex, startIndex + 100) + (result.text.length > startIndex + 100 ? '...' : '');
                    
                    // Display the title (modal name) and the snippet
                    const highlightedSnippet = snippet.replace(new RegExp(query, 'gi'), '<strong>$&</strong>');

                    itemEl.innerHTML = `${highlightedSnippet} <small>${result.title}</small>`;
                    
                    itemEl.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        mainSearchInput.value = '';
                        resultsContainer.classList.add('hidden');
                        
                        // Open the modal and pass the full indexed text for highlighting
                        window.openModalAndHighlight(result.modalId, result.text);
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

        // The blur timeout is removed, relying only on the document click listener
        mainSearchInput.addEventListener('blur', () => {
            setTimeout(() => { // Keep a small delay to allow click event to register
                resultsContainer.classList.add('hidden');
            }, 150);
        });

        document.addEventListener('click', (e) => {
            if (searchContainer && !searchContainer.contains(e.target)) {
                resultsContainer.classList.add('hidden');
            }
        });
    }

    // =================================================================
    //  USEFUL INFORMATION MODAL LOGIC (External Fetch)
    // =================================================================

    /** Fetches the index and content for the Useful Information modal. */
    async function fetchUsefulInformation() {
        if (usefulInformationLoaded || isFetchingUsefulInfo) return;

        isFetchingUsefulInfo = true;
        const navContainer = document.getElementById('useful-information-nav');
        // Using a direct link to the content folder to avoid rate limits/complexity of Git API
        const CONTENT_URL = 'https://raw.githubusercontent.com/dedsec1121fk/dedsec1121fk.github.io/master/Useful_Information/index.json';
        
        navContainer.innerHTML = `<p>${currentLanguage === 'gr' ? 'Φόρτωση...' : 'Loading...'}</p>`;
        
        try {
            const indexResponse = await fetch(CONTENT_URL);
            if (!indexResponse.ok) throw new Error(`Failed to fetch content index: ${indexResponse.status}`);
            const indexData = await indexResponse.json();
            
            // Clear existing index and load new index from JSON
            usefulInfoSearchIndex = indexData.index.map(item => ({
                ...item,
                // Ensure text is stored fully for accurate content highlighting later
                text: item.text.trim().replace(/\s\s+/g, ' '),
            }));

            // Populate the navigation buttons from the JSON metadata
            navContainer.innerHTML = '';
            indexData.files.forEach(file => {
                const button = document.createElement('button'); 
                button.className = 'app-icon';
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-book-open';

                const span = document.createElement('span');
                span.innerHTML = file.title_en;
                
                // Add sub-item for Greek title, which will be toggled by lang logic
                const subItem = document.createElement('span');
                subItem.className = 'sub-item hidden-by-default';
                subItem.setAttribute('data-lang-section', 'gr');
                subItem.textContent = file.title_gr;

                button.appendChild(icon);
                button.appendChild(span);
                button.appendChild(subItem);

                // Use the file's relative path for loading
                button.addEventListener('click', () => loadInformationContent(file.url_path));
                navContainer.appendChild(button);
            });

            updateLanguageContent(currentLanguage); // Apply language to newly created nav
            usefulInformationLoaded = true;

        } catch (error) {
            console.error('Failed to fetch useful information:', error);
            navContainer.innerHTML = `<p style="color: var(--nm-danger);">${currentLanguage === 'gr' ? 'Αποτυχία φόρτωσης περιεχομένου.' : 'Failed to load content.'}</p>`;
        } finally {
            isFetchingUsefulInfo = false;
        }
    }

    /** Loads and displays content from a URL into the useful information modal. */
    async function loadInformationContent(url, textToHighlight = null) {
        const contentContainer = document.getElementById('useful-information-content');
        document.getElementById('useful-info-prompt').style.display = 'none';
        contentContainer.innerHTML = `<p>${currentLanguage === 'gr' ? 'Φόρτωση...' : 'Loading...'}</p>`;
        
        // This is a dynamic path, we assume the base is the repo root for now
        const fullUrl = `https://raw.githubusercontent.com/dedsec1121fk/dedsec1121fk.github.io/master/${url}`;

        try {
            const response = await fetch(fullUrl);
            if (!response.ok) throw new Error(`Failed to fetch content: ${response.status}`);
            const htmlContent = await response.text();
            contentContainer.innerHTML = htmlContent;
            
            updateLanguageContent(currentLanguage); // Re-apply language to the new content

            // Logic to find, scroll, and highlight the result
            if (textToHighlight) {
                const modalBody = document.getElementById('useful-information-modal').querySelector('.modal-body');
                const activeSection = contentContainer.querySelector(`[data-lang-section="${currentLanguage}"]`) || contentContainer;
                const allElements = activeSection.querySelectorAll('p, li, h3, b, code');
                
                // Find element using the full text, as stored in the index
                const targetElement = Array.from(allElements).find(el => el.textContent.trim().includes(textToHighlight.trim()));

                if (targetElement) {
                    modalBody.scrollTo({ top: targetElement.offsetTop - 50, behavior: 'smooth' });
                    targetElement.classList.add('content-highlight');
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

    /** Initializes the search functionality inside the Useful Information modal. */
    const initializeUsefulInfoSearch = () => {
        const resultsContainer = document.getElementById('useful-info-results-container');
        if (!usefulInfoSearchInput || !resultsContainer) return;

        usefulInfoSearchInput.addEventListener('input', () => {
            const query = usefulInfoSearchInput.value.toLowerCase().trim();
            resultsContainer.innerHTML = '';

            // Hide/Show main nav based on query length
            const navContainer = document.getElementById('useful-information-nav');
            const navItems = navContainer.querySelectorAll('.app-icon');
            
            if (query.length < 3) {
                resultsContainer.classList.add('hidden');
                navItems.forEach(article => { article.style.display = 'flex'; });
                document.getElementById('useful-info-prompt').style.display = 'block';
                return;
            }
            
            navItems.forEach(article => { article.style.display = 'none'; });
            document.getElementById('useful-info-prompt').style.display = 'none';

            let results = usefulInfoSearchIndex.filter(item => 
                item.lang === currentLanguage && item.text.toLowerCase().includes(query)
            );
            
            results.sort((a, b) => b.weight - a.weight);

            if (results.length > 0) {
                // Show top 7 results
                results.slice(0, 7).forEach(result => {
                    const itemEl = document.createElement('div');
                    itemEl.classList.add('search-result-item');
                    
                    // Create a snippet from the full text for display
                    const matchIndex = result.text.toLowerCase().indexOf(query);
                    const startIndex = Math.max(0, matchIndex - 30);
                    const snippet = result.text.substring(startIndex, startIndex + 100) + (result.text.length > startIndex + 100 ? '...' : '');

                    const highlightedSnippet = snippet.replace(new RegExp(query, 'gi'), '<strong>$&</strong>');
                    itemEl.innerHTML = `${highlightedSnippet} <small>${result.title}</small>`;
                    
                    itemEl.addEventListener('click', async () => {
                        usefulInfoSearchInput.value = '';
                        resultsContainer.classList.add('hidden');
                        // Pass the full text of the match for accurate highlighting
                        await loadInformationContent(result.url, result.text); 
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

        document.addEventListener('click', (e) => {
            const searchContainer = document.querySelector('.modal-search-container');
            if (searchContainer && !searchContainer.contains(e.target)) {
                resultsContainer.classList.add('hidden');
            }
        });
    }

    // =================================================================
    //  CAROUSEL LOGIC
    // =================================================================

    /** Initializes the carousel in the collaborations modal. */
    const initializeCarousel = () => {
        const carousel = document.querySelector('.gym-carousel');
        if (!carousel) return;

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

    // =================================================================
    //  EVENT DELEGATION (App Grid)
    // =================================================================
    
    const initializeEventDelegation = () => {
        if (!appGrid) return;

        // Use event delegation on the app grid to handle clicks
        appGrid.addEventListener('click', (e) => {
            // Find the closest ancestor that is an app wrapper button/link
            const wrapper = e.target.closest('.app-wrapper'); 

            if (wrapper) {
                // If it's an internal button
                if (wrapper.tagName === 'BUTTON') {
                    const modalId = wrapper.dataset.modal;
                    if (modalId) {
                        e.preventDefault(); 
                        window.openModalAndHighlight(modalId);
                    }
                }
                // Links are handled by default HTML behavior (a href=...)
            }
        });
    }


    // =================================================================
    //  INITIALIZATION & ENTRY POINT
    // =================================================================

    /** Handles initial setup for language, theme, and first modal display. */
    const initializeSettings = () => {
        // --- THEME INIT ---
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
        }

        // --- LANGUAGE INIT ---
        updateLanguageContent(currentLanguage);
        
        // --- INITIAL MODAL DISPLAY ---
        if (!isDisclaimerAccepted) {
            // Enforce language selection first by hiding close button
            if (languageModalCloseBtn) languageModalCloseBtn.style.display = 'none';
            showModal(languageModal);
        } else {
            // If disclaimer is accepted, directly show the User Guide modal
            window.openModalAndHighlight('welcome');
        }
    };
    
    // --- RUN ALL INITIALIZATION ---
    buildSiteWideSearchIndex();
    initializeSettings();
    initializeSearch();
    initializeUsefulInfoSearch();
    initializeCarousel();
    initializeEventDelegation(); // Attach delegated handler

    // --- GENERAL MODAL CLOSING ---
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        // Close on overlay click (except for the initial language modal)
        modal.addEventListener('click', e => {
            if (e.target === modal && modal.id !== 'language-selection-modal') {
                hideModal(modal);
            }
        });
        // Close on X button click (only attach if it's not the disabled language close button)
        const closeModalButton = modal.querySelector('.close-modal');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => hideModal(modal));
        }
    });

    // --- LANGUAGE SWITCHER HANDLERS ---
    langSwitcherBtn.addEventListener('click', () => {
        // Allow closing the language modal when explicitly opened via button
        if (languageModalCloseBtn) languageModalCloseBtn.style.display = ''; 
        showModal(languageModal);
    });
    
    languageModal.querySelectorAll('.language-button').forEach(button => {
        button.addEventListener('click', () => {
            updateLanguageContent(button.dataset.lang);
            hideModal(languageModal);
            
            // After selecting language for the first time, show the disclaimer
            if (!isDisclaimerAccepted && disclaimerModal) {
                showModal(disclaimerModal);
            }
        });
    });

    // --- THEME SWITCHER HANDLER ---
    themeSwitcherBtn.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-theme');
        try {
             localStorage.setItem('theme', isLight ? 'light' : 'dark');
        } catch(e) { /* Ignore storage errors */ }
        
        updateThemeDisplay(isLight);
    });

    // --- DISCLAIMER HANDLERS ---
    document.getElementById('accept-disclaimer').addEventListener('click', () => {
        isDisclaimerAccepted = true;
        try {
             localStorage.setItem('disclaimerAccepted', 'true');
        } catch(e) { /* Ignore storage errors */ }
        
        hideModal(disclaimerModal);
        // Automatically open the User Guide after accepting the disclaimer
        window.openModalAndHighlight('welcome');
    });
    document.getElementById('decline-disclaimer').addEventListener('click', () => {
        // Redirect to a neutral page on decline
        window.location.href = 'https://www.google.com';
    });
});