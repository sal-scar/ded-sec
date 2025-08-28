document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL PORTFOLIO STATE ---
    let currentLanguage = 'en';
    let initialSetupDone = false;
    
    // --- PORTFOLIO INITIALIZATION ---
    function initializePortfolio() {
        // --- LANGUAGE AND MODAL LOGIC ---
        const languageModal = document.getElementById('language-selection-modal');
        const disclaimerModal = document.getElementById('disclaimer-modal');

        window.changeLanguage = (lang) => {
            currentLanguage = lang;
            document.documentElement.lang = lang;
            
            document.querySelectorAll('[data-en]').forEach(el => {
                const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
                const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
                
                if (el.matches('h1, h2, h3, p, label') || (el.matches('span') && !el.parentElement.classList.contains('app-icon'))) {
                    el.textContent = text;
                } else if (textNode) {
                    textNode.textContent = text;
                } else if (el.matches('span')) {
                     el.textContent = text;
                }
            });

            document.querySelectorAll('[data-lang-section]').forEach(el => {
                el.style.display = el.dataset.langSection === lang ? '' : 'none';
            });
            
            document.querySelectorAll('.language-button').forEach(button => {
                button.classList.toggle('selected', button.dataset.lang === lang);
            });

            const pageTitleEl = document.querySelector('title');
            if (pageTitleEl) document.title = "DedSec Project";
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
        
        document.getElementById('lang-switcher-btn').addEventListener('click', () => languageModal.classList.add('visible'));

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
            // Re-apply current language to the new text
            changeLanguage(currentLanguage);
        };

        themeSwitcherBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeButton(isLight);
        });
        
        // On page load, check for saved theme
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
        
        if (profilepic) {
            profilePic.addEventListener('click', () => {
                imageViewer.querySelector('#expanded-img').src = profilePic.src;
                imageViewer.classList.add('visible');
            });
        }

        imageViewer.addEventListener('click', () => {
            imageViewer.classList.remove('visible');
        });
        
        window.copyToClipboard = (button, targetId) => {
            const codeElement = document.getElementById(targetId);
            if (!codeElement) return;
            navigator.clipboard.writeText(codeElement.innerText).then(() => {
                const originalText = button.textContent;
                button.textContent = (currentLanguage === 'gr') ? 'Αντιγράφηκε!' : 'Copied!';
                setTimeout(() => { button.textContent = originalText; }, 1500);
            }).catch(err => console.error('Failed to copy', err));
        };
        
        languageModal.classList.add('visible');
        changeLanguage('en'); 
        document.querySelector('#language-selection-modal .modal-header h2').textContent = 'Choose Language / Επιλογή Γλώσσας';
    }
    
    // --- CERTIFICATION QUIZ LOGIC ---
    function initializeCertificationQuiz() {
        const quizData = [
            { id: 1, title_en: "First Contact & Navigation", title_gr: "Πρώτη Επαφή & Πλοήγηση", question_en: "Which command shows your current directory path?", question_gr: "Ποια εντολή δείχνει την τρέχουσα διαδρομή του καταλόγου σας;", options_en: ["ls", "cd", "pwd", "whoami"], options_gr: ["ls", "cd", "pwd", "whoami"], correct_answer: 2 },
            { id: 2, title_en: "File Management & Permissions", title_gr: "Διαχείριση Αρχείων & Δικαιώματα", question_en: "What does `chmod 755 script.sh` do?", question_gr: "Τι κάνει η εντολή `chmod 755 script.sh`;", options_en: ["Makes it readable by everyone", "Makes it executable for you, readable/executable for others", "Deletes the script", "Makes it writable by the group"], options_gr: ["Το κάνει αναγνώσιμο από όλους", "Το κάνει εκτελέσιμο για εσάς, αναγνώσιμο/εκτελέσιμο για τους άλλους", "Διαγράφει το σενάrio", "Το κάνει εγγράψιμο από την ομάδα"], correct_answer: 1 },
            { id: 3, title_en: "Pipes & Redirection", title_gr: "Pipes & Ανακατεύθυνση", question_en: "Which symbol appends the output of a command to a file?", question_gr: "Ποιο σύμβολο προσθέτει την έξοδο μιας εντολής στο τέλος ενός αρχείου;", options_en: [">", "&", "|", ">>"], options_gr: [">", "&", "|", ">>"], correct_answer: 3 },
            { id: 4, title_en: "Software & Text Editing", title_gr: "Λογισμικό & Επεξεργασία Κειμένου", question_en: "Which command is used to install new packages in Termux?", question_gr: "Ποια εντολή χρησιμοποιείται για την εγκατάσταση νέων πακέτων στο Termux;", options_en: ["install", "apt-get", "pkg install", "termux-install"], options_gr: ["install", "apt-get", "pkg install", "termux-install"], correct_answer: 2 },
            { id: 5, title_en: "Shell Scripting Fundamentals", title_gr: "Θεμελιώδεις Αρχές Σεναρίων Κελύφους", question_en: "What is the first line of a bash script called?", question_gr: "Πώς ονομάζεται η πρώτη γραμμή ενός σεναρίου bash;", options_en: ["Header", "Shebang", "Initializer", "Comment"], options_gr: ["Κεφαλίδα", "Shebang", "Αρχικοποιητής", "Σχόλιο"], correct_answer: 1 },
            { id: 6, title_en: "Logic and Loops", title_gr: "Λογική και Βρόχοι", question_en: "Which statement is used for decision making in scripts?", question_gr: "Ποια δήλωση χρησιμοποιείται για τη λήψη αποφάσεων στα σενάρια;", options_en: ["for", "while", "decide", "if/else"], options_gr: ["for", "while", "decide", "if/else"], correct_answer: 3 },
            { id: 7, title_en: "Functions & Arrays", title_gr: "Συναρτήσεις & Πίνακες", question_en: "How do you access the first argument passed to a function?", question_gr: "Πώς αποκτάτε πρόσβαση στο πρώτο όρισμα που δίνεται σε μια συνάρτηση;", options_en: ["$0", "$1", "$@", "$#"], options_gr: ["$0", "$1", "$@", "$#"], correct_answer: 1 },
            { id: 8, title_en: "Mastering Regex", title_gr: "Εξειδίκευση στις Regex", question_en: "In Regex, what does the `.` (dot) character match?", question_gr: "Στις Κανονικές Εκφράσεις (Regex), με τι αντιστοιχεί ο χαρακτήρας `.` (τελεία);", options_en: ["A literal dot", "The end of a line", "Any single character", "A digit"], options_gr: ["Μια κυριολεκτική τελεία", "Το τέλος μιας γραμμής", "Οποιονδήποτε μεμονωμένο χαρακτήρα", "Ένα ψηφίο"], correct_answer: 2 },
            { id: 9, title_en: "Finding with `grep` and `find`", title_gr: "Βρίσκοντας με `grep` και `find`", question_en: "Which `grep` option makes the search case-insensitive?", question_gr: "Ποια επιλογή της `grep` κάνει την αναζήτηση χωρίς διάκριση πεζών-κεφαλαίων;", options_en: ["-c", "-v", "-i", "-r"], options_gr: ["-c", "-v", "-i", "-r"], correct_answer: 2 },
            { id: 10, title_en: "Text Manipulation with `sed` and `awk`", title_gr: "Χειρισμός Κειμένου με `sed` και `awk`", question_en: "Which command is primarily used for programmatic find-and-replace?", question_gr: "Ποια εντολή χρησιμοποιείται κυρίως για προγραμματιστική εύρεση-και-αντικατάσταση;", options_en: ["awk", "grep", "find", "sed"], options_gr: ["awk", "grep", "find", "sed"], correct_answer: 3 },
        ];
        const translations = {
            en: { userInfoTitle: "Enter Your Details", firstNameLabel: "First Name", lastNameLabel: "Last Name", startBtn: "Start Workbook Exam", page: "Page", of: "of", prevBtn: "Previous", nextBtn: "Next", submitBtn: "Submit Test", resultsTitle: "Test Complete!", certTitle: "Certificate of Completion", certAwardedTo: "This certificate is awarded to", certAchievement: "for successfully completing the Termux Mastery Series seminar with exceptional knowledge and skill.", certDate: "Date of Completion", failureTitle: "Keep Studying!", failureText1: "You have completed the test, but you made", failureText2: "mistakes. You need fewer than 20 mistakes to pass. Please review the material and try again!", restartBtn: "Try Again", gradeLabel: "Grade", gradeExcellent: "Excellent", gradeVeryGood: "Very Good", gradeGood: "Good", pdfError: "Sorry, there was an error creating the PDF.", mistakesLabel: "Mistakes", timeLeftLabel: "Time Left" },
            gr: { userInfoTitle: "Εισάγετε τα Στοιχεία σας", firstNameLabel: "Όνομα", lastNameLabel: "Επώνυμο", startBtn: "Έναρξη Εξέτασης", page: "Σελίδα", of: "από", prevBtn: "Προηγούμενο", nextBtn: "Επόμενο", submitBtn: "Υποβολή Εξέτασης", resultsTitle: "Η Εξέταση Ολοκληρώθηκε!", certTitle: "Πιστοποιητικό Ολοκλήρωσης", certAwardedTo: "Αυτό το πιστοποιητικό απονέμεται στον/στην", certAchievement: "για την επιτυχή ολοκλήρωση του σεμιναρίου Termux Mastery Series με εξαιρετική γνώση και δεξιότητα.", certDate: "Ημερομηνία Ολοκλήρωσης", failureTitle: "Συνεχίστε τη Μελέτη!", failureText1: "Ολοκληρώσατε την εξέταση, αλλά κάνατε", failureText2: "λάθη. Χρειάζεστε λιγότερα από 20 λάθη για να περάσετε. Παρακαλώ μελετήστε ξανά την ύλη και προσπαθήστε ξανά!", restartBtn: "Προσπαθήστε Ξανά", gradeLabel: "Βαθμός", gradeExcellent: "Άριστα", gradeVeryGood: "Πολύ Καλά", gradeGood: "Καλά", pdfError: "Παρουσιάστηκε σφάλμα κατά τη δημιουργία του PDF.", mistakesLabel: "Λάθη", timeLeftLabel: "Χρόνος Που Απομένει" }
        };

        // Quiz state variables
        let currentPage, userLang, userName, userAnswers, shuffledQuestions;
        let mistakes = 0;
        const maxMistakes = 20;
        let timerInterval;
        let timeLeft = 80;

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
                // Shuffle questions and reset answers
                shuffledQuestions = [...quizData].sort(() => Math.random() - 0.5);
                userAnswers = new Array(shuffledQuestions.length).fill(null);
                
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
            shuffledQuestions.forEach((q, index) => {
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
                    <h2>${t.page} ${index + 1} ${t.of} ${shuffledQuestions.length}: ${q[`title_${userLang}`]}</h2>
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

        const handleTimeout = () => {
            clearInterval(timerInterval);
            mistakes++;
            updateStatsDisplay();
            
            if (mistakes >= maxMistakes) {
                showResults();
                return;
            }

            if (currentPage === shuffledQuestions.length) {
                showResults();
            } else {
                navigatePage(1);
            }
        };

        const startTimer = () => {
            clearInterval(timerInterval);
            timeLeft = 80;
            updateStatsDisplay();

            timerInterval = setInterval(() => {
                timeLeft--;
                updateStatsDisplay();
                if (timeLeft <= 0) {
                    handleTimeout();
                }
            }, 1000);
        };

        const updateStatsDisplay = () => {
            const t = translations[userLang];
            mistakeCounterEl.innerText = `${t.mistakesLabel}: ${mistakes} / ${maxMistakes}`;
            timerDisplayEl.innerText = `${t.timeLeftLabel}: ${timeLeft}s`;
        };

        const renderPage = () => {
            certModal.querySelectorAll('.quiz-page').forEach(p => p.classList.add('hidden'));
            certModal.querySelector(`#page-${currentPage}`).classList.remove('hidden');

            const savedAnswer = userAnswers[currentPage - 1];
            if (savedAnswer !== null) {
                const radioButtons = certModal.querySelectorAll(`#page-${currentPage} input[type="radio"]`);
                if(radioButtons[savedAnswer]) radioButtons[savedAnswer].checked = true;
            }
            updateNavigation();
            startTimer();
        };

        const updateNavigation = () => {
            const t = translations[userLang];
            prevBtn.disabled = currentPage === 1;
            prevBtn.innerText = t.prevBtn;
            nextBtn.innerText = t.nextBtn;
            submitBtn.innerText = t.submitBtn;
            nextBtn.classList.toggle('hidden', currentPage === shuffledQuestions.length);
            submitBtn.classList.toggle('hidden', currentPage !== shuffledQuestions.length);
            pageIndicator.innerText = `${t.page} ${currentPage} ${t.of} ${shuffledQuestions.length}`;
        };

        const navigatePage = (direction) => {
            currentPage += direction;
            renderPage();
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
                    <div class="grade-display">${grade}</div>
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
                container.style.width = '900px'; // A fixed width for consistent rendering
                document.body.appendChild(container);
                container.innerHTML = html;

                // Wait for images/fonts if any
                await new Promise(resolve => setTimeout(resolve, 100)); 

                const canvas = await html2canvas(container.querySelector('.certificate-container'), { 
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null // Make background transparent to see the container's bg
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
            
            // Calculate final mistakes based on answers
            let finalMistakes = 0;
            userAnswers.forEach((answer, index) => {
                if (answer !== null && answer !== shuffledQuestions[index].correct_answer) {
                    finalMistakes++;
                }
            });
            // Add mistakes from timeouts
            finalMistakes = mistakes; // The 'mistakes' variable already tracks timeouts

            quizContainerDiv.classList.add('hidden');
            navigationContainerDiv.classList.add('hidden');
            quizStatsDiv.classList.add('hidden');
            resultsContainerDiv.classList.remove('hidden');
            const t = translations[userLang];
            
            if (finalMistakes < maxMistakes) { // Passing score
                const getGrade = (m) => {
                    if (m <= 2) return 'Excellent';
                    if (m <= 7) return 'Very Good';
                    return 'Good';
                };
                const gradeKey = getGrade(finalMistakes);
                const gradeEn = translations.en[`grade${gradeKey}`];
                const gradeGr = translations.gr[`grade${gradeKey}`];
                const userVisibleGrade = userLang === 'en' ? gradeEn : gradeGr;

                resultsContainerDiv.innerHTML = generateCertificateHTML(userLang, userName, userVisibleGrade);
                
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
                    downloadCertificates(userName, gradeEn, gradeGr);
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

        languageSelectionDiv.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => selectLanguage(btn.dataset.lang));
        });
        nameForm.addEventListener('submit', startQuiz);
        prevBtn.addEventListener('click', () => navigatePage(-1));
        nextBtn.addEventListener('click', () => navigatePage(1));
        submitBtn.addEventListener('click', showResults);
    }

    initializePortfolio();
    initializeCertificationQuiz();
});