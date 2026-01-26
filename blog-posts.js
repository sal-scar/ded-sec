/* ============================================================================
   MAINTENANCE (DedSec Blog)
   - This file renders the Blog listing.
   - Primary mode: fetch posts from GitHub (auto-detects repo on *.github.io).
   - Offline fallback: EMBEDDED_POSTS below (update when you add/remove posts).
   ============================================================================ */
(() => {
  'use strict';

  const GRID_ID = 'blog-posts-grid';
  const DEFAULT_CFG = {
    github: {
      owner: 'dedsec1121fk',
      repo: 'dedsec1121fk.github.io',
      branch: 'main',
      blogDir: 'Blog'
    }
  };

  // Offline fallback for ZIP builds / rate limits.
  // Keep this list aligned with the "final" (non-redirect) posts you want to show in the Blog listing.
  const EMBEDDED_POSTS = [
  {
    "file": "ai-ethics-risk.html",
    "href": "../blog.html#ai-ethics-risk",
    "titleEn": "AI Ethics in Practice: Bias, Consent, and Accountability",
    "titleGr": "Ηθική AI στην πράξη: μεροληψία, συναίνεση και λογοδοσία",
    "descEn": "An educational, practical guide about artificial intelligence: AI Ethics in Practice: Bias, Consent, and Accountability.",
    "descGr": "Το θέμα «Ηθική AI στην πράξη: μεροληψία, συναίνεση και λογοδοσία» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνητή νοημοσύνη, μικρές…",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial intelligence",
      "Ethics",
      "Practice",
      "Bias",
      "Consent",
      "Accountability"
    ]
  },
  {
    "file": "ai-productivity-workflows.html",
    "href": "../Blog/ai-productivity-workflows.html",
    "titleEn": "AI for Productivity: Workflows that Respect Privacy and Quality",
    "titleGr": "AI για παραγωγικότητα: Workflows με ιδιωτικότητα και ποιότητα",
    "descEn": "An educational, practical guide about artificial intelligence: AI for Productivity: Workflows that Respect Privacy and Quality.",
    "descGr": "Το θέμα «AI για παραγωγικότητα: Workflows με ιδιωτικότητα και ποιότητα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνητή νοημοσύνη,…",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial intelligence",
      "Productivity",
      "Workflows",
      "Respect",
      "Privacy",
      "Quality"
    ]
  },
  {
    "file": "ai-security-privacy.html",
    "href": "../Blog/ai-security-privacy.html",
    "titleEn": "AI Security & Privacy: Data Leakage, Model Attacks, and Safe Use",
    "titleGr": "AI ασφάλεια & ιδιωτικότητα: Διαρροές, επιθέσεις και ασφαλής χρήση",
    "descEn": "An educational, practical guide about artificial intelligence: AI Security & Privacy: Data Leakage, Model Attacks, and Safe Use.",
    "descGr": "Το θέμα «AI ασφάλεια & ιδιωτικότητα: Διαρροές, επιθέσεις και ασφαλής χρήση» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνητή νοημοσύνη,…",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial intelligence",
      "Security",
      "Privacy",
      "Data",
      "Leakage",
      "Model",
      "Attacks",
      "Safe"
    ]
  },
  {
    "file": "algorithms-misinformation.html",
    "href": "../blog.html#algorithms-misinformation",
    "titleEn": "Algorithms & Misinformation: Why the Feed Feels Like Reality",
    "titleGr": "Αλγόριθμοι & παραπληροφόρηση: Γιατί το feed μοιάζει σαν πραγματικότητα",
    "descEn": "An educational, practical guide about conspiracy theories: Algorithms & Misinformation: Why the Feed Feels Like Reality.",
    "descGr": "Το θέμα «Αλγόριθμοι & παραπληροφόρηση: Γιατί το feed μοιάζει σαν πραγματικότητα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της θεωρίες…",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy theories",
      "Algorithms",
      "Misinformation",
      "Feed",
      "Like",
      "Reality"
    ]
  },
  {
    "file": "android-backups-security.html",
    "href": "../blog.html#android-backups-security",
    "titleEn": "Android Backups: How to Avoid Losing Data Without Losing Privacy",
    "titleGr": "Android backups: Πώς δεν χάνεις δεδομένα χωρίς να χάνεις ιδιωτικότητα",
    "descEn": "An educational, practical guide about android: Android Backups: How to Avoid Losing Data Without Losing Privacy.",
    "descGr": "Το θέμα «Android backups: Πώς δεν χάνεις δεδομένα χωρίς να χάνεις ιδιωτικότητα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της android, μικρές…",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Backups",
      "Avoid",
      "Losing",
      "Data",
      "Privacy"
    ]
  },
  {
    "file": "android-dev-options.html",
    "href": "../Blog/android-dev-options.html",
    "titleEn": "Developer Options Explained: Useful Tweaks vs Dangerous Switches",
    "titleGr": "Developer Options: Χρήσιμες ρυθμίσεις vs επικίνδυνοι διακόπτες",
    "descEn": "An educational, practical guide about android: Developer Options Explained: Useful Tweaks vs Dangerous Switches.",
    "descGr": "Το θέμα «Developer Options: Χρήσιμες ρυθμίσεις vs επικίνδυνοι διακόπτες» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της android, μικρές…",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Developer",
      "Options",
      "Explained",
      "Useful",
      "Tweaks",
      "Dangerous",
      "Switches"
    ]
  },
  {
    "file": "android-dns-private-relays.html",
    "href": "../Blog/android-dns-private-relays.html",
    "titleEn": "Private DNS & Tracking Protection on Android: Simple, Reversible Steps",
    "titleGr": "Private DNS & προστασία από tracking στο Android: Απλά, αναστρέψιμα βήματα",
    "descEn": "An educational, practical guide about android: Private DNS & Tracking Protection on Android: Simple, Reversible Steps.",
    "descGr": "Το θέμα «Private DNS & προστασία από tracking στο Android: Απλά, αναστρέψιμα βήματα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της android,…",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Private",
      "Tracking",
      "Protection",
      "DNS",
      "Simple",
      "Reversible",
      "Steps"
    ]
  },
  {
    "file": "android-permissions-privacy.html",
    "href": "../Blog/android-permissions-privacy.html",
    "titleEn": "Android Permissions & Privacy: What ‘Allow’ Really Means",
    "titleGr": "Άδειες & ιδιωτικότητα στο Android: Τι σημαίνει πραγματικά το ‘Allow’",
    "descEn": "An educational, practical guide about android: Android Permissions & Privacy: What ‘Allow’ Really Means.",
    "descGr": "Το θέμα «Άδειες & ιδιωτικότητα στο Android: Τι σημαίνει πραγματικά το ‘Allow’» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της android, μικρές…",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Permissions",
      "Privacy",
      "Allow’",
      "Really",
      "Means"
    ]
  },
  {
    "file": "android-sideloading-risks.html",
    "href": "../Blog/android-sideloading-risks.html",
    "titleEn": "Sideloading APKs Safely: The Risks, the Checks, and the Best Habits",
    "titleGr": "Sideloading APK με ασφάλεια: Ρίσκα, έλεγχοι και σωστές συνήθειες",
    "descEn": "An educational, practical guide about android: Sideloading APKs Safely: The Risks, the Checks, and the Best Habits.",
    "descGr": "Το θέμα «Sideloading APK με ασφάλεια: Ρίσκα, έλεγχοι και σωστές συνήθειες» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της android, μικρές…",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Sideloading",
      "Apks",
      "Safely",
      "Risks",
      "Checks",
      "Best",
      "Habits"
    ]
  },
  {
    "file": "antibiotic-resistance.html",
    "href": "../blog.html#antibiotic-resistance",
    "titleEn": "Antibiotic Resistance: How It Happens and How to Slow It Down",
    "titleGr": "Αντοχή στα αντιβιοτικά: Πώς συμβαίνει και πώς την περιορίζουμε",
    "descEn": "An educational, practical guide about biology: Antibiotic Resistance: How It Happens and How to Slow It Down.",
    "descGr": "Το θέμα «Αντοχή στα αντιβιοτικά: Πώς συμβαίνει και πώς την περιορίζουμε» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της βιολογία, μικρές…",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Antibiotic",
      "Resistance",
      "Happens",
      "Slow",
      "Down"
    ]
  },
  {
    "file": "climate-vs-weather.html",
    "href": "../blog.html#climate-vs-weather",
    "titleEn": "Climate vs Weather: The Difference That Changes Conversations",
    "titleGr": "Κλίμα vs Καιρός: Η διαφορά που αλλάζει τις συζητήσεις",
    "descEn": "An educational, practical guide about science: Climate vs Weather: The Difference That Changes Conversations.",
    "descGr": "Το θέμα «Κλίμα vs Καιρός: Η διαφορά που αλλάζει τις συζητήσεις» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της επιστήμη, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Climate",
      "Weather",
      "Difference",
      "Changes",
      "Conversations"
    ]
  },
  {
    "file": "cognitive-biases.html",
    "href": "../Blog/cognitive-biases.html",
    "titleEn": "Cognitive Biases 101: Why Smart People Believe Weird Things",
    "titleGr": "Γνωστικές προκαταλήψεις 101: Γιατί έξυπνοι άνθρωποι πιστεύουν περίεργα πράγματα",
    "descEn": "An educational, practical guide about conspiracy theories: Cognitive Biases 101: Why Smart People Believe Weird Things.",
    "descGr": "Το θέμα «Γνωστικές προκαταλήψεις 101: Γιατί έξυπνοι άνθρωποι πιστεύουν περίεργα πράγματα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της…",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy theories",
      "Cognitive",
      "Biases",
      "Smart",
      "People",
      "Believe",
      "Weird",
      "Things"
    ]
  },
  {
    "file": "containers-for-beginners.html",
    "href": "../blog.html#containers-for-beginners",
    "titleEn": "Containers for Beginners: Docker/Podman Concepts Without the Hype",
    "titleGr": "Containers για αρχάριους: Docker/Podman έννοιες χωρίς hype",
    "descEn": "An educational, practical guide about linux: Containers for Beginners: Docker/Podman Concepts Without the Hype.",
    "descGr": "Το θέμα «Containers για αρχάριους: Docker/Podman έννοιες χωρίς hype» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της linux, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Containers",
      "Beginners",
      "Docker",
      "Podman",
      "Concepts",
      "Hype"
    ]
  },
  {
    "file": "copyright-online.html",
    "href": "../blog.html#copyright-online",
    "titleEn": "Copyright Online: Fair Use, Quotes, and Creator Respect",
    "titleGr": "Πνευματικά δικαιώματα online: Fair use, παραθέματα και σεβασμός",
    "descEn": "An educational, practical guide about law: Copyright Online: Fair Use, Quotes, and Creator Respect.",
    "descGr": "Το θέμα «Πνευματικά δικαιώματα online: Fair use, παραθέματα και σεβασμός» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της νόμος, μικρές επιλογές",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Copyright",
      "Online",
      "Fair",
      "Quotes",
      "Use",
      "Creator",
      "Respect"
    ]
  },
  {
    "file": "crispr-gene-editing.html",
    "href": "../Blog/crispr-gene-editing.html",
    "titleEn": "CRISPR Explained: Editing Genes, Limits, and Real-World Uses",
    "titleGr": "CRISPR με απλά λόγια: Γονιδιακή επεξεργασία, όρια και εφαρμογές",
    "descEn": "An educational, practical guide about biology: CRISPR Explained: Editing Genes, Limits, and Real-World Uses.",
    "descGr": "Το θέμα «CRISPR με απλά λόγια: Γονιδιακή επεξεργασία, όρια και εφαρμογές» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της βιολογία, μικρές…",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "CRISPR",
      "Explained",
      "Editing",
      "Genes",
      "Limits",
      "Real-World",
      "Uses"
    ]
  },
  {
    "file": "cybercrime-basics.html",
    "href": "../Blog/cybercrime-basics.html",
    "titleEn": "Cybercrime Law Basics: What Counts as Illegal (and What Doesn’t)",
    "titleGr": "Βασικά για το cybercrime: Τι είναι παράνομο (και τι όχι)",
    "descEn": "An educational, practical guide about law: Cybercrime Law Basics: What Counts as Illegal (and What Doesn’t).",
    "descGr": "Το θέμα «Βασικά για το cybercrime: Τι είναι παράνομο (και τι όχι)» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της νόμος, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Cybercrime",
      "Basics",
      "Counts",
      "Illegal",
      "Doesn’t"
    ]
  },
  {
    "file": "digital-identity-wallets.html",
    "href": "../blog.html#digital-identity-wallets",
    "titleEn": "Digital Identity Wallets: Convenience, Risk, and How to Use Them Wisely",
    "titleGr": "Ψηφιακά Πορτοφόλια Ταυτότητας: Ευκολία, ρίσκο και σωστή χρήση",
    "descEn": "An educational, practical guide about technology: Digital Identity Wallets: Convenience, Risk, and How to Use Them Wisely.",
    "descGr": "Το θέμα «Ψηφιακά Πορτοφόλια Ταυτότητας: Ευκολία, ρίσκο και σωστή χρήση» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνολογία, μικρές…",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Digital",
      "Identity",
      "Wallets",
      "Convenience",
      "Risk",
      "Use",
      "Them"
    ]
  },
  {
    "file": "edge-computing-local-ai-2026.html",
    "href": "../Blog/edge-computing-local-ai-2026.html",
    "titleEn": "Edge Computing & On‑Device AI: Why 2026 Feels Faster (and Safer)",
    "titleGr": "Edge Computing & AI στη Συσκευή: Γιατί το 2026 μοιάζει πιο γρήγορο (και πιο ασφαλές)",
    "descEn": "An educational, practical guide about technology: Edge Computing & On‑Device AI: Why 2026 Feels Faster (and Safer).",
    "descGr": "Το θέμα «Edge Computing & AI στη Συσκευή: Γιατί το 2026 μοιάζει πιο γρήγορο (και πιο ασφαλές)» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της…",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Edge",
      "Computing",
      "Device",
      "On-Device"
    ]
  },
  {
    "file": "energy-storage-basics.html",
    "href": "../Blog/energy-storage-basics.html",
    "titleEn": "Energy Storage Basics: Batteries, Grids, and the Real Constraints",
    "titleGr": "Αποθήκευση ενέργειας: Μπαταρίες, δίκτυα και οι πραγματικοί περιορισμοί",
    "descEn": "An educational, practical guide about science: Energy Storage Basics: Batteries, Grids, and the Real Constraints.",
    "descGr": "Το θέμα «Αποθήκευση ενέργειας: Μπαταρίες, δίκτυα και οι πραγματικοί περιορισμοί» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της επιστήμη,…",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Energy",
      "Storage",
      "Basics",
      "Batteries",
      "Grids",
      "Real",
      "Constraints"
    ]
  },
  {
    "file": "everyday-integrity.html",
    "href": "../blog.html#everyday-integrity",
    "titleEn": "Everyday Integrity: Small Habits That Reduce Corruption’s Oxygen",
    "titleGr": "Καθημερινή ακεραιότητα: Μικρές συνήθειες που κόβουν το οξυγόνο της διαφθοράς",
    "descEn": "An educational, practical guide about corruption of greece: Everyday Integrity: Small Habits That Reduce Corruption’s Oxygen.",
    "descGr": "Το θέμα «Καθημερινή ακεραιότητα: Μικρές συνήθειες που κόβουν το οξυγόνο της διαφθοράς» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της διαφθορά…",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption of greece",
      "Everyday",
      "Integrity",
      "Small",
      "Habits",
      "Reduce",
      "Corruption’s",
      "Oxygen"
    ]
  },
  {
    "file": "fact-checking-toolkit.html",
    "href": "../Blog/fact-checking-toolkit.html",
    "titleEn": "A Fact‑Checking Toolkit: Fast Checks, Deep Checks, and Red Flags",
    "titleGr": "Toolkit επαλήθευσης: Γρήγοροι έλεγχοι, βαθιοί έλεγχοι και red flags",
    "descEn": "An educational, practical guide about conspiracy theories: A Fact‑Checking Toolkit: Fast Checks, Deep Checks, and Red Flags.",
    "descGr": "Το θέμα «Toolkit επαλήθευσης: Γρήγοροι έλεγχοι, βαθιοί έλεγχοι και red flags» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της θεωρίες…",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy theories",
      "Fact",
      "Checking",
      "Toolkit",
      "Fast",
      "Fact-Checking",
      "Checks",
      "Deep"
    ]
  },
  {
    "file": "gdpr-privacy-basics.html",
    "href": "../Blog/gdpr-privacy-basics.html",
    "titleEn": "Digital Privacy Basics (EU): GDPR Concepts You Can Use Daily",
    "titleGr": "Ψηφιακή ιδιωτικότητα (ΕΕ): GDPR έννοιες που χρησιμοποιείς καθημερινά",
    "descEn": "An educational, practical guide about law: Digital Privacy Basics (EU): GDPR Concepts You Can Use Daily.",
    "descGr": "Το θέμα «Ψηφιακή ιδιωτικότητα (ΕΕ): GDPR έννοιες που χρησιμοποιείς καθημερινά» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της νόμος, μικρές…",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Digital",
      "Privacy",
      "Basics",
      "GDPR",
      "Concepts",
      "Can",
      "Use"
    ]
  },
  {
    "file": "healthy-skepticism.html",
    "href": "../Blog/healthy-skepticism.html",
    "titleEn": "Healthy Skepticism vs Cynicism: How to Stay Sharp Without Going Dark",
    "titleGr": "Υγιής σκεπτικισμός vs κυνισμός: Πώς μένεις κοφτερός χωρίς να σκοτεινιάζεις",
    "descEn": "An educational, practical guide about conspiracy theories: Healthy Skepticism vs Cynicism: How to Stay Sharp Without Going Dark.",
    "descGr": "Το θέμα «Υγιής σκεπτικισμός vs κυνισμός: Πώς μένεις κοφτερός χωρίς να σκοτεινιάζεις» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της θεωρίες…",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy theories",
      "Healthy",
      "Skepticism",
      "Cynicism",
      "Stay",
      "Sharp",
      "Going",
      "Dark"
    ]
  },
  {
    "file": "how-conspiracies-spread.html",
    "href": "../Blog/how-conspiracies-spread.html",
    "titleEn": "How Conspiracy Theories Spread Online: A Map of the Pipeline",
    "titleGr": "Πώς εξαπλώνονται οι θεωρίες συνωμοσίας online: Χάρτης της διαδρομής",
    "descEn": "An educational, practical guide about conspiracy theories: How Conspiracy Theories Spread Online: A Map of the Pipeline.",
    "descGr": "Το θέμα «Πώς εξαπλώνονται οι θεωρίες συνωμοσίας online: Χάρτης της διαδρομής» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της θεωρίες…",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy theories",
      "Conspiracy",
      "Theories",
      "Spread",
      "Online",
      "Map",
      "Pipeline"
    ]
  },
  {
    "file": "how-llms-work.html",
    "href": "../Blog/how-llms-work.html",
    "titleEn": "How Large Language Models Work: Tokens, Training, and Hallucinations",
    "titleGr": "Πώς δουλεύουν τα LLM: tokens, εκπαίδευση και ‘παραισθήσεις’",
    "descEn": "An educational, practical guide about artificial intelligence: How Large Language Models Work: Tokens, Training, and Hallucinations.",
    "descGr": "Το θέμα «Πώς δουλεύουν τα LLM: tokens, εκπαίδευση και ‘παραισθήσεις’» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνητή νοημοσύνη, μικρές…",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial intelligence",
      "Large",
      "Language",
      "Models",
      "Work",
      "Tokens",
      "Training",
      "Hallucinations"
    ]
  },
  {
    "file": "icloud-security-basics.html",
    "href": "../blog.html#icloud-security-basics",
    "titleEn": "iCloud Security Basics: Backups, Keys, and Account Recovery",
    "titleGr": "iCloud ασφάλεια: Backups, κλειδιά και ανάκτηση λογαριασμού",
    "descEn": "An educational, practical guide about ios: iCloud Security Basics: Backups, Keys, and Account Recovery.",
    "descGr": "Το θέμα «iCloud ασφάλεια: Backups, κλειδιά και ανάκτηση λογαριασμού» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της ios, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Icloud",
      "Security",
      "Basics",
      "Backups",
      "Keys",
      "Account",
      "Recovery"
    ]
  },
  {
    "file": "incident-reporting.html",
    "href": "../Blog/incident-reporting.html",
    "titleEn": "Reporting Incidents: Evidence, Timelines, and Where to Ask for Help",
    "titleGr": "Αναφορά περιστατικών: Στοιχεία, χρονολόγιο και πού ζητάς βοήθεια",
    "descEn": "An educational, practical guide about law: Reporting Incidents: Evidence, Timelines, and Where to Ask for Help.",
    "descGr": "Το θέμα «Αναφορά περιστατικών: Στοιχεία, χρονολόγιο και πού ζητάς βοήθεια» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της νόμος, μικρές…",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Reporting",
      "Incidents",
      "Evidence",
      "Timelines",
      "Ask",
      "Help"
    ]
  },
  {
    "file": "ios-privacy-controls.html",
    "href": "../Blog/ios-privacy-controls.html",
    "titleEn": "iOS Privacy Controls: The Settings that Matter Most",
    "titleGr": "Ρυθμίσεις ιδιωτικότητας iOS: Αυτές που μετράνε πραγματικά",
    "descEn": "An educational, practical guide about ios: iOS Privacy Controls: The Settings that Matter Most.",
    "descGr": "Το θέμα «Ρυθμίσεις ιδιωτικότητας iOS: Αυτές που μετράνε πραγματικά» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της ios, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Privacy",
      "Controls",
      "Settings",
      "Matter",
      "Most"
    ]
  },
  {
    "file": "ios-profiles-mdm.html",
    "href": "../Blog/ios-profiles-mdm.html",
    "titleEn": "Profiles & MDM on iOS: What They Are and When to Worry",
    "titleGr": "Profiles & MDM στο iOS: Τι είναι και πότε να ανησυχείς",
    "descEn": "An educational, practical guide about ios: Profiles & MDM on iOS: What They Are and When to Worry.",
    "descGr": "Το θέμα «Profiles & MDM στο iOS: Τι είναι και πότε να ανησυχείς» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της ios, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Profiles",
      "They",
      "MDM",
      "Worry"
    ]
  },
  {
    "file": "ios-stalkerware-defense.html",
    "href": "../Blog/ios-stalkerware-defense.html",
    "titleEn": "Stalkerware & Account Takeovers: iOS Warning Signs and Fixes",
    "titleGr": "Stalkerware & hijacks: Σημάδια στο iOS και τι κάνεις",
    "descEn": "An educational, practical guide about ios: Stalkerware & Account Takeovers: iOS Warning Signs and Fixes.",
    "descGr": "Το θέμα «Stalkerware & hijacks: Σημάδια στο iOS και τι κάνεις» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της ios, μικρές επιλογές (ρυθμίσεις,…",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Stalkerware",
      "Account",
      "Takeovers",
      "Warning",
      "Signs",
      "Fixes"
    ]
  },
  {
    "file": "linux-laptop-hardening.html",
    "href": "../Blog/linux-laptop-hardening.html",
    "titleEn": "Hardening a Linux Laptop: Updates, Firewall, Disk Encryption",
    "titleGr": "Σκλήρυνση Linux laptop: Updates, firewall, κρυπτογράφηση δίσκου",
    "descEn": "An educational, practical guide about linux: Hardening a Linux Laptop: Updates, Firewall, Disk Encryption.",
    "descGr": "Το θέμα «Σκλήρυνση Linux laptop: Updates, firewall, κρυπτογράφηση δίσκου» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της linux, μικρές επιλογές",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Hardening",
      "Laptop",
      "Updates",
      "Firewall",
      "Disk",
      "Encryption"
    ]
  },
  {
    "file": "linux-networking-toolbox.html",
    "href": "../Blog/linux-networking-toolbox.html",
    "titleEn": "Linux Networking Toolbox: ip, ss, dig, tcpdump (Without Panic)",
    "titleGr": "Εργαλεία δικτύου στο Linux: ip, ss, dig, tcpdump (χωρίς πανικό)",
    "descEn": "An educational, practical guide about linux: Linux Networking Toolbox: ip, ss, dig, tcpdump (Without Panic).",
    "descGr": "Το θέμα «Εργαλεία δικτύου στο Linux: ip, ss, dig, tcpdump (χωρίς πανικό)» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της linux, μικρές επιλογές",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Networking",
      "Toolbox",
      "Tcpdump",
      "Dig",
      "Panic"
    ]
  },
  {
    "file": "linux-permissions-ownership.html",
    "href": "../Blog/linux-permissions-ownership.html",
    "titleEn": "Linux Permissions & Ownership: The Mental Model that Stops Mistakes",
    "titleGr": "Δικαιώματα & Ιδιοκτησία στο Linux: Το μοντέλο που σε γλιτώνει από λάθη",
    "descEn": "An educational, practical guide about linux: Linux Permissions & Ownership: The Mental Model that Stops Mistakes.",
    "descGr": "Το θέμα «Δικαιώματα & Ιδιοκτησία στο Linux: Το μοντέλο που σε γλιτώνει από λάθη» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της linux, μικρές…",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Permissions",
      "Ownership",
      "Mental",
      "Model",
      "Stops",
      "Mistakes"
    ]
  },
  {
    "file": "microbiome.html",
    "href": "../Blog/microbiome.html",
    "titleEn": "The Microbiome: What We Know, What We Guess, and What’s Hype",
    "titleGr": "Μικροβίωμα: Τι ξέρουμε, τι υποθέτουμε και τι είναι hype",
    "descEn": "An educational, practical guide about biology: The Microbiome: What We Know, What We Guess, and What’s Hype.",
    "descGr": "Το θέμα «Μικροβίωμα: Τι ξέρουμε, τι υποθέτουμε και τι είναι hype» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της βιολογία, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Microbiome",
      "Know",
      "Guess",
      "What’s",
      "Hype"
    ]
  },
  {
    "file": "nutrition-myths.html",
    "href": "../Blog/nutrition-myths.html",
    "titleEn": "Nutrition Myths: Labels, Studies, and Building Sanity Around Food",
    "titleGr": "Μύθοι διατροφής: Ετικέτες, μελέτες και πώς βρίσκεις ισορροπία",
    "descEn": "An educational, practical guide about biology: Nutrition Myths: Labels, Studies, and Building Sanity Around Food.",
    "descGr": "Το θέμα «Μύθοι διατροφής: Ετικέτες, μελέτες και πώς βρίσκεις ισορροπία» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της βιολογία, μικρές…",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Nutrition",
      "Myths",
      "Labels",
      "Studies",
      "Building",
      "Sanity",
      "Around"
    ]
  },
  {
    "file": "online-defamation.html",
    "href": "../Blog/online-defamation.html",
    "titleEn": "Online Speech & Defamation: How to Disagree Without Legal Trouble",
    "titleGr": "Online λόγος & δυσφήμιση: Πώς διαφωνείς χωρίς μπελάδες",
    "descEn": "An educational, practical guide about law: Online Speech & Defamation: How to Disagree Without Legal Trouble.",
    "descGr": "Το θέμα «Online λόγος & δυσφήμιση: Πώς διαφωνείς χωρίς μπελάδες» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της νόμος, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Online",
      "Speech",
      "Defamation",
      "Disagree",
      "Legal",
      "Trouble"
    ]
  },
  {
    "file": "open-data-tools.html",
    "href": "../Blog/open-data-tools.html",
    "titleEn": "Open Data & Transparency Tools: Turning Documents Into Accountability",
    "titleGr": "Open data & εργαλεία διαφάνειας: Από έγγραφα σε λογοδοσία",
    "descEn": "An educational, practical guide about corruption of greece: Open Data & Transparency Tools: Turning Documents Into Accountability.",
    "descGr": "Το θέμα «Open data & εργαλεία διαφάνειας: Από έγγραφα σε λογοδοσία» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της διαφθορά στην ελλάδα, μικρές",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption of greece",
      "Open",
      "Data",
      "Transparency",
      "Tools",
      "Turning",
      "Documents",
      "Accountability"
    ]
  },
  {
    "file": "passkeys-on-ios.html",
    "href": "../Blog/passkeys-on-ios.html",
    "titleEn": "Passkeys on iPhone: A Practical Migration Guide (No Drama)",
    "titleGr": "Passkeys στο iPhone: Πρακτικός οδηγός μετάβασης (χωρίς δράματα)",
    "descEn": "An educational, practical guide about ios: Passkeys on iPhone: A Practical Migration Guide (No Drama).",
    "descGr": "Το θέμα «Passkeys στο iPhone: Πρακτικός οδηγός μετάβασης (χωρίς δράματα)» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της ios, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Passkeys",
      "Iphone",
      "Practical",
      "Migration",
      "Guide",
      "Drama"
    ]
  },
  {
    "file": "passkeys-passwordless-auth.html",
    "href": "../Blog/passkeys-passwordless-auth.html",
    "titleEn": "Passkeys Explained: Passwordless Login That Actually Works",
    "titleGr": "Passkeys: Σύνδεση χωρίς κωδικούς που επιτέλους δουλεύει",
    "descEn": "An educational, practical guide about technology: Passkeys Explained: Passwordless Login That Actually Works.",
    "descGr": "Το θέμα «Passkeys: Σύνδεση χωρίς κωδικούς που επιτέλους δουλεύει» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνολογία, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Passkeys",
      "Explained",
      "Passwordless",
      "Login",
      "Actually",
      "Works"
    ]
  },
  {
    "file": "peer-review-explained.html",
    "href": "../Blog/peer-review-explained.html",
    "titleEn": "Peer Review Explained: What It Can and Cannot Guarantee",
    "titleGr": "Peer review: Τι εγγυάται και τι δεν μπορεί να εγγυηθεί",
    "descEn": "An educational, practical guide about science: Peer Review Explained: What It Can and Cannot Guarantee.",
    "descGr": "Το θέμα «Peer review: Τι εγγυάται και τι δεν μπορεί να εγγυηθεί» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της επιστήμη, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Peer",
      "Review",
      "Explained",
      "Can",
      "Cannot",
      "Guarantee"
    ]
  },
  {
    "file": "phishing-2026-defenses.html",
    "href": "../blog.html#phishing-2026-defenses",
    "titleEn": "Phishing in 2026: The New Tricks and the Defenses That Still Work",
    "titleGr": "Phishing το 2026: Τα νέα κόλπα και οι άμυνες που ακόμα δουλεύουν",
    "descEn": "An educational, practical guide about cybersecurity: Phishing in 2026: The New Tricks and the Defenses That Still Work.",
    "descGr": "Το θέμα «Phishing το 2026: Τα νέα κόλπα και οι άμυνες που ακόμα δουλεύουν» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της κυβερνοασφάλεια,…",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Phishing",
      "Tricks",
      "Defenses",
      "New",
      "Still",
      "Work"
    ]
  },
  {
    "file": "privacy-threat-model.html",
    "href": "../Blog/privacy-threat-model.html",
    "titleEn": "Privacy Threat Modeling: Pick the Right Defenses for Your Life",
    "titleGr": "Μοντελοποίηση Απειλών Ιδιωτικότητας: Διάλεξε άμυνες για τη δική σου ζωή",
    "descEn": "An educational, practical guide about cybersecurity: Privacy Threat Modeling: Pick the Right Defenses for Your Life.",
    "descGr": "Το θέμα «Μοντελοποίηση Απειλών Ιδιωτικότητας: Διάλεξε άμυνες για τη δική σου ζωή» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της…",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Privacy",
      "Threat",
      "Modeling",
      "Pick",
      "Right",
      "Defenses",
      "Life"
    ]
  },
  {
    "file": "procurement-transparency.html",
    "href": "../Blog/procurement-transparency.html",
    "titleEn": "Public Procurement Transparency: Why It Matters and How to Track It",
    "titleGr": "Διαφάνεια στις δημόσιες προμήθειες: Γιατί μετράει και πώς την παρακολουθείς",
    "descEn": "An educational, practical guide about corruption of greece: Public Procurement Transparency: Why It Matters and How to Track It.",
    "descGr": "Το θέμα «Διαφάνεια στις δημόσιες προμήθειες: Γιατί μετράει και πώς την παρακολουθείς» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της διαφθορά…",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption of greece",
      "Public",
      "Procurement",
      "Transparency",
      "Matters",
      "Track"
    ]
  },
  {
    "file": "prompting-evaluation.html",
    "href": "../Blog/prompting-evaluation.html",
    "titleEn": "Prompting & Evaluation: Getting Reliable Outputs Without Magic",
    "titleGr": "Prompting & αξιολόγηση: Αξιόπιστα αποτελέσματα χωρίς μαγεία",
    "descEn": "An educational, practical guide about artificial intelligence: Prompting & Evaluation: Getting Reliable Outputs Without Magic.",
    "descGr": "Το θέμα «Prompting & αξιολόγηση: Αξιόπιστα αποτελέσματα χωρίς μαγεία» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνητή νοημοσύνη, μικρές…",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial intelligence",
      "Prompting",
      "Evaluation",
      "Getting",
      "Reliable",
      "Outputs",
      "Magic"
    ]
  },
  {
    "file": "ransomware-backups-restore.html",
    "href": "../Blog/ransomware-backups-restore.html",
    "titleEn": "Ransomware 101: Backups, Recovery Drills, and What to Do First",
    "titleGr": "Ransomware 101: Αντίγραφα ασφαλείας, δοκιμές επαναφοράς και τι κάνεις πρώτα",
    "descEn": "An educational, practical guide about cybersecurity: Ransomware 101: Backups, Recovery Drills, and What to Do First.",
    "descGr": "Το θέμα «Ransomware 101: Αντίγραφα ασφαλείας, δοκιμές επαναφοράς και τι κάνεις πρώτα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της…",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Ransomware",
      "Backups",
      "Recovery",
      "Drills",
      "First"
    ]
  },
  {
    "file": "right-to-repair-open-hardware.html",
    "href": "../Blog/right-to-repair-open-hardware.html",
    "titleEn": "Right‑to‑Repair & Open Hardware: A Practical Guide for Buyers",
    "titleGr": "Δικαίωμα Επισκευής & Open Hardware: Πρακτικός οδηγός για αγοραστές",
    "descEn": "An educational, practical guide about technology: Right‑to‑Repair & Open Hardware: A Practical Guide for Buyers.",
    "descGr": "Το θέμα «Δικαίωμα Επισκευής & Open Hardware: Πρακτικός οδηγός για αγοραστές» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της τεχνολογία, μικρές…",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Right",
      "Repair",
      "Open",
      "Hardware",
      "Right-To-Repair",
      "Practical",
      "Guide"
    ]
  },
  {
    "file": "secure-home-network.html",
    "href": "../Blog/secure-home-network.html",
    "titleEn": "Secure Home Network: Router Hygiene, DNS, and Safer Wi‑Fi",
    "titleGr": "Ασφαλές Οικιακό Δίκτυο: Router hygiene, DNS και πιο ασφαλές Wi‑Fi",
    "descEn": "An educational, practical guide about cybersecurity: Secure Home Network: Router Hygiene, DNS, and Safer Wi‑Fi.",
    "descGr": "Το θέμα «Ασφαλές Οικιακό Δίκτυο: Router hygiene, DNS και πιο ασφαλές Wi‑Fi» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της κυβερνοασφάλεια,…",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Secure",
      "Home",
      "Network",
      "Router",
      "Hygiene",
      "DNS",
      "Wi-Fi"
    ]
  },
  {
    "file": "secure-messaging-metadata.html",
    "href": "../Blog/secure-messaging-metadata.html",
    "titleEn": "Secure Messaging Isn’t Just Encryption: Metadata, Backups, and Real Privacy",
    "titleGr": "Ασφαλή Μηνύματα δεν είναι μόνο Κρυπτογράφηση: Μεταδεδομένα, backup και πραγματική ιδιωτικότητα",
    "descEn": "An educational, practical guide about technology: Secure Messaging Isn’t Just Encryption: Metadata, Backups, and Real Privacy.",
    "descGr": "Το θέμα «Ασφαλή Μηνύματα δεν είναι μόνο Κρυπτογράφηση: Μεταδεδομένα, backup και πραγματική ιδιωτικότητα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον…",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Secure",
      "Messaging",
      "Just",
      "Encryption",
      "Isn’t",
      "Metadata",
      "Backups"
    ]
  },
  {
    "file": "sleep-biology.html",
    "href": "../Blog/sleep-biology.html",
    "titleEn": "Sleep Biology: Why You Can’t ‘Hack’ What You Don’t Respect",
    "titleGr": "Βιολογία ύπνου: Γιατί δεν ‘χακάρεται’ αυτό που δεν σέβεσαι",
    "descEn": "An educational, practical guide about biology: Sleep Biology: Why You Can’t ‘Hack’ What You Don’t Respect.",
    "descGr": "Το θέμα «Βιολογία ύπνου: Γιατί δεν ‘χακάρεται’ αυτό που δεν σέβεσαι» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της βιολογία, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Sleep",
      "Hack",
      "Can’t",
      "Hack’",
      "Don’t",
      "Respect"
    ]
  },
  {
    "file": "space-telescopes.html",
    "href": "../Blog/space-telescopes.html",
    "titleEn": "Space Telescopes: How We Turn Photons Into Knowledge",
    "titleGr": "Διαστημικά τηλεσκόπια: Πώς κάνουμε τα φωτόνια γνώση",
    "descEn": "An educational, practical guide about science: Space Telescopes: How We Turn Photons Into Knowledge.",
    "descGr": "Το θέμα «Διαστημικά τηλεσκόπια: Πώς κάνουμε τα φωτόνια γνώση» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της επιστήμη, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Space",
      "Telescopes",
      "Turn",
      "Photons",
      "Knowledge"
    ]
  },
  {
    "file": "systemd-explained.html",
    "href": "../Blog/systemd-explained.html",
    "titleEn": "systemd Explained: Services, Logs, Timers, and the Practical Bits",
    "titleGr": "systemd με απλά λόγια: Services, logs, timers και τα πρακτικά",
    "descEn": "An educational, practical guide about linux: systemd Explained: Services, Logs, Timers, and the Practical Bits.",
    "descGr": "Το θέμα «systemd με απλά λόγια: Services, logs, timers και τα πρακτικά» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της linux, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Systemd",
      "Explained",
      "Services",
      "Logs",
      "Timers",
      "Practical",
      "Bits"
    ]
  },
  {
    "file": "termux-local-webapps.html",
    "href": "../blog.html#termux-local-webapps",
    "titleEn": "Local Web Apps in Termux: Run Flask, Test APIs, Stay Offline",
    "titleGr": "Τοπικές Web εφαρμογές στο Termux: Flask, δοκιμές API, offline",
    "descEn": "An educational, practical guide about termux: Local Web Apps in Termux: Run Flask, Test APIs, Stay Offline.",
    "descGr": "Το θέμα «Τοπικές Web εφαρμογές στο Termux: Flask, δοκιμές API, offline» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της termux, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Local",
      "Apps",
      "Flask",
      "Web",
      "Run",
      "Test",
      "Apis"
    ]
  },
  {
    "file": "termux-python-automation.html",
    "href": "../Blog/termux-python-automation.html",
    "titleEn": "Python Automation in Termux: Small Scripts that Save Real Time",
    "titleGr": "Python αυτοματοποίηση στο Termux: Μικρά scripts που κερδίζουν χρόνο",
    "descEn": "An educational, practical guide about termux: Python Automation in Termux: Small Scripts that Save Real Time.",
    "descGr": "Το θέμα «Python αυτοματοποίηση στο Termux: Μικρά scripts που κερδίζουν χρόνο» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της termux, μικρές…",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Python",
      "Automation",
      "Small",
      "Scripts",
      "Save",
      "Real",
      "Time"
    ]
  },
  {
    "file": "termux-setup-hygiene.html",
    "href": "../Blog/termux-setup-hygiene.html",
    "titleEn": "Termux Setup Done Right: Packages, Storage, and a Clean Workflow",
    "titleGr": "Termux σωστά από την αρχή: Πακέτα, αποθήκευση και καθαρό workflow",
    "descEn": "An educational, practical guide about termux: Termux Setup Done Right: Packages, Storage, and a Clean Workflow.",
    "descGr": "Το θέμα «Termux σωστά από την αρχή: Πακέτα, αποθήκευση και καθαρό workflow» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της termux, μικρές…",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Setup",
      "Done",
      "Right",
      "Packages",
      "Storage",
      "Clean",
      "Workflow"
    ]
  },
  {
    "file": "termux-ssh-keys.html",
    "href": "../Blog/termux-ssh-keys.html",
    "titleEn": "SSH on Android with Termux: Keys, Agents, and Safer Remote Access",
    "titleGr": "SSH στο Android με Termux: Κλειδιά, agents και πιο ασφαλής πρόσβαση",
    "descEn": "An educational, practical guide about termux: SSH on Android with Termux: Keys, Agents, and Safer Remote Access.",
    "descGr": "Το θέμα «SSH στο Android με Termux: Κλειδιά, agents και πιο ασφαλής πρόσβαση» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της termux, μικρές…",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Android",
      "Keys",
      "SSH",
      "Agents",
      "Remote",
      "Access"
    ]
  },
  {
    "file": "termux-troubleshooting.html",
    "href": "../Blog/termux-troubleshooting.html",
    "titleEn": "Termux Troubleshooting: Battery, Permissions, and Weird Errors",
    "titleGr": "Termux Troubleshooting: Μπαταρία, άδειες και περίεργα σφάλματα",
    "descEn": "An educational, practical guide about termux: Termux Troubleshooting: Battery, Permissions, and Weird Errors.",
    "descGr": "Το θέμα «Termux Troubleshooting: Μπαταρία, άδειες και περίεργα σφάλματα» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της termux, μικρές επιλογές",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Troubleshooting",
      "Battery",
      "Permissions",
      "Weird",
      "Errors"
    ]
  },
  {
    "file": "vaccines-immune-basics.html",
    "href": "../Blog/vaccines-immune-basics.html",
    "titleEn": "Vaccines & the Immune System: Clear Explanations Without Jargon",
    "titleGr": "Εμβόλια & ανοσοποιητικό: Καθαρή εξήγηση χωρίς ορολογία",
    "descEn": "An educational, practical guide about science: Vaccines & the Immune System: Clear Explanations Without Jargon.",
    "descGr": "Το θέμα «Εμβόλια & ανοσοποιητικό: Καθαρή εξήγηση χωρίς ορολογία» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της επιστήμη, μικρές επιλογές…",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Vaccines",
      "Immune",
      "System",
      "Clear",
      "Explanations",
      "Jargon"
    ]
  },
  {
    "file": "what-is-corruption.html",
    "href": "../Blog/what-is-corruption.html",
    "titleEn": "What Corruption Is (and Isn’t): Definitions, Incentives, Indicators",
    "titleGr": "Τι είναι η διαφθορά (και τι δεν είναι): ορισμοί, κίνητρα, δείκτες",
    "descEn": "An educational, practical guide about corruption of greece: What Corruption Is (and Isn’t): Definitions, Incentives, Indicators.",
    "descGr": "Το θέμα «Τι είναι η διαφθορά (και τι δεν είναι): ορισμοί, κίνητρα, δείκτες» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της διαφθορά στην…",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption of greece",
      "Corruption",
      "Definitions",
      "Incentives",
      "Isn’t",
      "Indicators"
    ]
  },
  {
    "file": "whistleblower-protection.html",
    "href": "../Blog/whistleblower-protection.html",
    "titleEn": "Whistleblowing Safely: Rights, Protections, and Practical Precautions",
    "titleGr": "Whistleblowing με ασφάλεια: Δικαιώματα, προστασίες και πρακτικές προφυλάξεις",
    "descEn": "An educational, practical guide about corruption of greece: Whistleblowing Safely: Rights, Protections, and Practical Precautions.",
    "descGr": "Το θέμα «Whistleblowing με ασφάλεια: Δικαιώματα, προστασίες και πρακτικές προφυλάξεις» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της διαφθορά…",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption of greece",
      "Whistleblowing",
      "Safely",
      "Rights",
      "Protections",
      "Practical",
      "Precautions"
    ]
  },
  {
    "file": "zero-trust-for-humans.html",
    "href": "../Blog/zero-trust-for-humans.html",
    "titleEn": "Zero Trust for Humans: A Simple Model for Real Life (Home + Small Business)",
    "titleGr": "Zero Trust για ανθρώπους: Απλό μοντέλο για την πραγματική ζωή (σπίτι + μικρή δουλειά)",
    "descEn": "An educational, practical guide about cybersecurity: Zero Trust for Humans: A Simple Model for Real Life (Home + Small Business).",
    "descGr": "Το θέμα «Zero Trust για ανθρώπους: Απλό μοντέλο για την πραγματική ζωή (σπίτι + μικρή δουλειά)» ακουμπά ταυτόχρονα την καθημερινή ευκολία και τη μακροχρόνια ευθύνη. Στον χώρο της…",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Zero",
      "Trust",
      "Humans",
      "Simple",
      "Model",
      "Real",
      "Life"
    ]
  }
];


  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fileNameToTitle(name) {
    return String(name || '')
      .replace(/\.html?$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function getCurrentLang() {
    return (localStorage.getItem('language') || 'en').toLowerCase();
  }

  async function loadConfig() {
    try {
      const res = await fetch('../site-config.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('config fetch failed');
      const cfg = await res.json();
      return { ...DEFAULT_CFG, ...cfg, github: { ...DEFAULT_CFG.github, ...(cfg.github || {}) } };
    } catch (_) {
      return DEFAULT_CFG;
    }
  }

  function detectGitHubRepoFromLocation() {
    // If the site is hosted on *.github.io, derive owner/repo from the URL so copied repos work automatically.
    const host = String(location.hostname || '').toLowerCase();
    if (!host.endsWith('github.io')) return null;

    const owner = host.split('.')[0];
    const parts = String(location.pathname || '').split('/').filter(Boolean);

    // User/organization site: https://owner.github.io/       => repo is owner.github.io
    // Project site:          https://owner.github.io/repo/  => repo is the first path segment
    const repo = parts.length ? parts[0] : `${owner}.github.io`;
    return { owner, repo };
  }

  async function fetchRepoDirectory({ owner, repo, branch, blogDir }) {
    const base = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(blogDir)}`;
    const withRef = branch ? `${base}?ref=${encodeURIComponent(branch)}` : base;

    let res = await fetch(withRef, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    });

    // If the branch name is wrong (common when copying the site to a new repo),
    // retry without specifying a ref so GitHub uses the repo’s default branch.
    if (!res.ok && branch) {
      res = await fetch(base, {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store'
      });
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.filter((x) => x && x.type === 'file' && /\.html?$/i.test(x.name));
  }

  function parseMetaRefreshRedirect(doc) {
    const m = doc.querySelector('meta[http-equiv="refresh" i]');
    if (!m) return null;
    const content = String(m.getAttribute('content') || '');
    // formats: "0; url=target.html" or "0;url=target.html"
    const match = content.match(/url\s*=\s*([^;]+)\s*$/i);
    if (!match) return null;
    const url = String(match[1] || '').trim().replace(/^['"]|['"]$/g, '');
    return url || null;
  }

  async function fetchPostMeta(entry) {
    let titleEn = fileNameToTitle(entry.name);
    let titleGr = titleEn;
    let descEn = '';
    let descGr = '';
    let date = '';
    let section = '';
    let tags = [];
    let isRedirect = false;
    let redirectTo = '';

    try {
      const htmlText = await (await fetch(entry.download_url, { cache: 'no-store' })).text();
      const doc = new DOMParser().parseFromString(htmlText, 'text/html');

      // Detect "Moved" stub pages (meta refresh) and remove them from the listing later.
      const redir = parseMetaRefreshRedirect(doc);
      if (redir) {
        isRedirect = true;
        redirectTo = redir;
      }

      const h1 = doc.querySelector('.page-header h1');
      const p = doc.querySelector('.page-header p');

      const metaDesc = doc.querySelector('meta[name="description"]');
      const published = doc.querySelector('meta[property="article:published_time"]');
      const sectionMeta = doc.querySelector('meta[property="article:section"]');
      const tagMetas = Array.from(doc.querySelectorAll('meta[property="article:tag"]'));

      if (h1) {
        titleEn = (h1.getAttribute('data-en') || h1.textContent || titleEn).trim();
        titleGr = (h1.getAttribute('data-gr') || titleGr).trim();
      }
      if (p) {
        descEn = (p.getAttribute('data-en') || p.textContent || '').trim();
        descGr = (p.getAttribute('data-gr') || descGr).trim();
      } else if (metaDesc) {
        descEn = (metaDesc.getAttribute('content') || '').trim();
        descGr = descEn;
      }

      if (published) date = (published.getAttribute('content') || '').trim();
      if (sectionMeta) section = String(sectionMeta.getAttribute('content') || '').trim();
      if (tagMetas && tagMetas.length) {
        tags = tagMetas
          .map(m => String(m.getAttribute('content') || '').trim())
          .filter(Boolean);
      }
    } catch (_) {
      // keep fallbacks
    }

    return {
      file: entry.name,
      href: `../Blog/${entry.name}`,
      titleEn,
      titleGr,
      descEn,
      descGr,
      date,
      section,
      tags,
      isRedirect,
      redirectTo
    };
  }

  function renderPosts(grid, posts) {
    if (!posts.length) {
      grid.innerHTML = `
        <div class="feature-card" style="grid-column: 1 / -1;">
          <h3 class="feature-title" data-en="No posts found" data-gr="Δεν βρέθηκαν άρθρα">No posts found</h3>
          <p data-en="Upload an HTML file into the /Blog folder and it will appear here automatically." data-gr="Ανέβασε ένα HTML αρχείο στον φάκελο /Blog και θα εμφανιστεί εδώ αυτόματα.">
            Upload an HTML file into the /Blog folder and it will appear here automatically.
          </p>
        </div>`;
      return;
    }

    const cards = posts.map((p) => {
      const titleEn = escapeHtml(p.titleEn);
      const titleGr = escapeHtml(p.titleGr || p.titleEn);
      const descEn = escapeHtml(p.descEn || '');
      const descGr = escapeHtml(p.descGr || p.descEn || '');

      const taxonomy = (() => {
        const out = [];
        if (p.section) out.push(`<span class="badge">${escapeHtml(p.section)}</span>`);
        if (Array.isArray(p.tags)) {
          p.tags.slice(0, 3).forEach(t => out.push(`<span class="badge">#${escapeHtml(t)}</span>`));
        }
        return out.length
          ? `<div class="blog-taxonomy">${out.join('')}</div>`
          : '';
      })();

      const badge = p.date
        ? `<span class="badge" data-en="Updated ${escapeHtml(p.date)}" data-gr="Ενημέρωση ${escapeHtml(p.date)}">Updated ${escapeHtml(p.date)}</span>`
        : '';

      return `
        <a class="feature-card" href="${escapeHtml(p.href)}">
          <div class="feature-icon"><i class="fas fa-book-open"></i></div>
          <h3 class="feature-title" data-en="${titleEn}" data-gr="${titleGr}">${titleEn}</h3>
          <p data-en="${descEn}" data-gr="${descGr}">${descEn}</p>
          ${taxonomy}
          ${badge}
        </a>`;
    });

    grid.innerHTML = cards.join('');
  }

  function setupFilters(posts, grid) {
    const catWrap = document.getElementById('category-chips');
    const tagWrap = document.getElementById('tag-chips');
    const filtersBox = document.getElementById('blog-filters');
    if (!catWrap || !tagWrap) return;

    const allCats = Array.from(new Set(posts.map(p => (p.section || '').trim()).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));
    const allTags = Array.from(new Set(posts.flatMap(p => Array.isArray(p.tags) ? p.tags : []).map(t => String(t).trim()).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));

    // Hide the whole filter UI if there is nothing to filter by
    if ((!allCats.length) && (!allTags.length)) {
      if (filtersBox) filtersBox.style.display = 'none';
      return;
    }

    const params = new URLSearchParams(location.search || '');
    let selectedCat = params.get('cat') || 'All';
    let selectedTag = params.get('tag') || 'All';

    function mkChip(labelEn, labelGr, value, selected, onPick) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (selected === value ? ' is-active' : '');
      b.setAttribute('data-en', labelEn);
      b.setAttribute('data-gr', labelGr);
      b.textContent = labelEn;
      b.addEventListener('click', () => onPick(value));
      return b;
    }

    function renderChips(wrap, items, selected, onPick) {
      wrap.innerHTML = '';
      wrap.appendChild(mkChip('All', 'Όλα', 'All', selected, onPick));
      items.forEach(v => {
        // Categories/tags are stored in English (SEO). Keep label the same in both languages.
        const label = String(v);
        wrap.appendChild(mkChip(label, label, v, selected, onPick));
      });
      wrap.parentElement?.classList.toggle('is-empty', items.length === 0);
    }

    function apply() {
      const filtered = posts.filter(p => {
        const okCat = (selectedCat === 'All') || (String(p.section || '') === selectedCat);
        const okTag = (selectedTag === 'All') || (Array.isArray(p.tags) && p.tags.includes(selectedTag));
        return okCat && okTag;
      });

      // keep query params in sync (clean URLs)
      const next = new URLSearchParams(location.search || '');
      if (selectedCat === 'All') next.delete('cat'); else next.set('cat', selectedCat);
      if (selectedTag === 'All') next.delete('tag'); else next.set('tag', selectedTag);
      const nextStr = next.toString();
      const nextUrl = nextStr ? `${location.pathname}?${nextStr}` : location.pathname;
      history.replaceState(null, '', nextUrl);

      renderChips(catWrap, allCats, selectedCat, (v) => { selectedCat = v; apply(); });
      renderChips(tagWrap, allTags, selectedTag, (v) => { selectedTag = v; apply(); });

      renderPosts(grid, filtered);

      // Re-apply language on dynamically injected nodes
      if (typeof window.changeLanguage === 'function') {
        window.changeLanguage(getCurrentLang());
      }
    }

    apply();
  }

  function normalizePosts(posts) {
    // Remove redirect "Moved" stub pages from the listing.
    const out = (Array.isArray(posts) ? posts : []).filter(p => !p?.isRedirect);
    // Also remove duplicates by file/href
    const seen = new Set();
    return out.filter(p => {
      const key = String(p.href || p.file || '');
      if (!key) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async function main() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    const cfg = await loadConfig();

    // If this is a GitHub Pages URL (owner.github.io[/repo]/...), auto-detect the repo so the blog works in any copied/testing repository.
    const detected = detectGitHubRepoFromLocation();
    if (detected) {
      cfg.github = { ...cfg.github, ...detected, branch: '' };
    }

    let posts = [];
    try {
      const entries = await fetchRepoDirectory(cfg.github);
      const metas = await Promise.all(entries.map(fetchPostMeta));

      metas.sort((a, b) => {
        const d = (b.date || '').localeCompare(a.date || '');
        if (d) return d;
        return (a.titleEn || '').localeCompare(b.titleEn || '');
      });

      posts = metas;
    } catch (_) {
      // ignore and fall back to embedded list
    }

    // If GitHub API failed (offline / rate limit), use embedded posts from the ZIP build.
    if (!posts.length && Array.isArray(EMBEDDED_POSTS) && EMBEDDED_POSTS.length) {
      posts = EMBEDDED_POSTS.slice();
    }

    posts = normalizePosts(posts);

    if (!posts.length) {
      grid.innerHTML = `
        <div class="feature-card" style="grid-column: 1 / -1;">
          <h3 class="feature-title" data-en="Couldn’t load posts" data-gr="Αδυναμία φόρτωσης άρθρων">Couldn’t load posts</h3>
          <p data-en="Posts exist, but the list couldn’t be generated. If you’re viewing locally, open the site with a local server (not file://). On GitHub Pages, try refreshing." data-gr="Τα άρθρα υπάρχουν, αλλά η λίστα δεν μπόρεσε να δημιουργηθεί. Αν το βλέπεις τοπικά, άνοιξε το site με local server (όχι file://). Στο GitHub Pages δοκίμασε ανανέωση.">
            Posts exist, but the list couldn’t be generated. If you’re viewing locally, open the site with a local server (not file://). On GitHub Pages, try refreshing.
          </p>
        </div>`;
      return;
    }

    renderPosts(grid, posts);
    try { setupFilters(posts, grid); } catch (_) {}

    // Apply the saved language after rendering
    if (typeof window.changeLanguage === 'function') {
      window.changeLanguage(getCurrentLang());
    }
  }

  document.addEventListener('DOMContentLoaded', main);
})();
