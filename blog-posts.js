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
    "file": "edge-computing-local-ai-2026.html",
    "href": "../Blog/edge-computing-local-ai-2026.html",
    "titleEn": "Edge Computing & On‑Device AI: Why 2026 Feels Faster (and Safer)",
    "titleGr": "Edge Computing & AI στη Συσκευή: Γιατί το 2026 μοιάζει πιο γρήγορο (και πιο ασφαλές)",
    "descEn": "An educational, practical guide about technology: Edge Computing & On‑Device AI: Why 2026 Feels Faster (and Safer).",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνολογία: Edge Computing & AI στη Συσκευή: Γιατί το 2026 μοιάζει πιο γρήγορο (και πιο ασφαλές).",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Edge",
      "Computing",
      "Device",
      "Feels"
    ]
  },
  {
    "file": "passkeys-passwordless-auth.html",
    "href": "../Blog/passkeys-passwordless-auth.html",
    "titleEn": "Passkeys Explained: Passwordless Login That Actually Works",
    "titleGr": "Passkeys: Σύνδεση χωρίς κωδικούς που επιτέλους δουλεύει",
    "descEn": "An educational, practical guide about technology: Passkeys Explained: Passwordless Login That Actually Works.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνολογία: Passkeys: Σύνδεση χωρίς κωδικούς που επιτέλους δουλεύει.",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Passkeys",
      "Explained",
      "Passwordless",
      "Login"
    ]
  },
  {
    "file": "right-to-repair-open-hardware.html",
    "href": "../Blog/right-to-repair-open-hardware.html",
    "titleEn": "Right‑to‑Repair & Open Hardware: A Practical Guide for Buyers",
    "titleGr": "Δικαίωμα Επισκευής & Open Hardware: Πρακτικός οδηγός για αγοραστές",
    "descEn": "An educational, practical guide about technology: Right‑to‑Repair & Open Hardware: A Practical Guide for Buyers.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνολογία: Δικαίωμα Επισκευής & Open Hardware: Πρακτικός οδηγός για αγοραστές.",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Right",
      "Repair",
      "Open",
      "Hardware"
    ]
  },
  {
    "file": "digital-identity-wallets.html",
    "href": "../Blog/digital-identity-wallets.html",
    "titleEn": "Digital Identity Wallets: Convenience, Risk, and How to Use Them Wisely",
    "titleGr": "Ψηφιακά Πορτοφόλια Ταυτότητας: Ευκολία, ρίσκο και σωστή χρήση",
    "descEn": "An educational, practical guide about technology: Digital Identity Wallets: Convenience, Risk, and How to Use Them Wisely.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνολογία: Ψηφιακά Πορτοφόλια Ταυτότητας: Ευκολία, ρίσκο και σωστή χρήση.",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Digital",
      "Identity",
      "Wallets",
      "Convenience"
    ]
  },
  {
    "file": "secure-messaging-metadata.html",
    "href": "../Blog/secure-messaging-metadata.html",
    "titleEn": "Secure Messaging Isn’t Just Encryption: Metadata, Backups, and Real Privacy",
    "titleGr": "Ασφαλή Μηνύματα δεν είναι μόνο Κρυπτογράφηση: Μεταδεδομένα, backup και πραγματική ιδιωτικότητα",
    "descEn": "An educational, practical guide about technology: Secure Messaging Isn’t Just Encryption: Metadata, Backups, and Real Privacy.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνολογία: Ασφαλή Μηνύματα δεν είναι μόνο Κρυπτογράφηση: Μεταδεδομένα, backup και πραγματική ιδιωτικότητα.",
    "date": "2026-01-26",
    "section": "Technology",
    "tags": [
      "Technology",
      "Secure",
      "Messaging",
      "Just",
      "Encryption"
    ]
  },
  {
    "file": "phishing-2026-defenses.html",
    "href": "../Blog/phishing-2026-defenses.html",
    "titleEn": "Phishing in 2026: The New Tricks and the Defenses That Still Work",
    "titleGr": "Phishing το 2026: Τα νέα κόλπα και οι άμυνες που ακόμα δουλεύουν",
    "descEn": "An educational, practical guide about cybersecurity: Phishing in 2026: The New Tricks and the Defenses That Still Work.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για κυβερνοασφάλεια: Phishing το 2026: Τα νέα κόλπα και οι άμυνες που ακόμα δουλεύουν.",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Phishing",
      "Tricks",
      "Defenses",
      "That"
    ]
  },
  {
    "file": "ransomware-backups-restore.html",
    "href": "../Blog/ransomware-backups-restore.html",
    "titleEn": "Ransomware 101: Backups, Recovery Drills, and What to Do First",
    "titleGr": "Ransomware 101: Αντίγραφα ασφαλείας, δοκιμές επαναφοράς και τι κάνεις πρώτα",
    "descEn": "An educational, practical guide about cybersecurity: Ransomware 101: Backups, Recovery Drills, and What to Do First.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για κυβερνοασφάλεια: Ransomware 101: Αντίγραφα ασφαλείας, δοκιμές επαναφοράς και τι κάνεις πρώτα.",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Ransomware",
      "Backups",
      "Recovery",
      "Drills"
    ]
  },
  {
    "file": "zero-trust-for-humans.html",
    "href": "../Blog/zero-trust-for-humans.html",
    "titleEn": "Zero Trust for Humans: A Simple Model for Real Life (Home + Small Business)",
    "titleGr": "Zero Trust για ανθρώπους: Απλό μοντέλο για την πραγματική ζωή (σπίτι + μικρή δουλειά)",
    "descEn": "An educational, practical guide about cybersecurity: Zero Trust for Humans: A Simple Model for Real Life (Home + Small Business).",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για κυβερνοασφάλεια: Zero Trust για ανθρώπους: Απλό μοντέλο για την πραγματική ζωή (σπίτι + μικρή δουλειά).",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Zero",
      "Trust",
      "Humans",
      "Simple"
    ]
  },
  {
    "file": "secure-home-network.html",
    "href": "../Blog/secure-home-network.html",
    "titleEn": "Secure Home Network: Router Hygiene, DNS, and Safer Wi‑Fi",
    "titleGr": "Ασφαλές Οικιακό Δίκτυο: Router hygiene, DNS και πιο ασφαλές Wi‑Fi",
    "descEn": "An educational, practical guide about cybersecurity: Secure Home Network: Router Hygiene, DNS, and Safer Wi‑Fi.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για κυβερνοασφάλεια: Ασφαλές Οικιακό Δίκτυο: Router hygiene, DNS και πιο ασφαλές Wi‑Fi.",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Secure",
      "Home",
      "Network",
      "Router"
    ]
  },
  {
    "file": "privacy-threat-model.html",
    "href": "../Blog/privacy-threat-model.html",
    "titleEn": "Privacy Threat Modeling: Pick the Right Defenses for Your Life",
    "titleGr": "Μοντελοποίηση Απειλών Ιδιωτικότητας: Διάλεξε άμυνες για τη δική σου ζωή",
    "descEn": "An educational, practical guide about cybersecurity: Privacy Threat Modeling: Pick the Right Defenses for Your Life.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για κυβερνοασφάλεια: Μοντελοποίηση Απειλών Ιδιωτικότητας: Διάλεξε άμυνες για τη δική σου ζωή.",
    "date": "2026-01-26",
    "section": "Cybersecurity",
    "tags": [
      "Cybersecurity",
      "Privacy",
      "Threat",
      "Modeling",
      "Pick"
    ]
  },
  {
    "file": "termux-setup-hygiene.html",
    "href": "../Blog/termux-setup-hygiene.html",
    "titleEn": "Termux Setup Done Right: Packages, Storage, and a Clean Workflow",
    "titleGr": "Termux σωστά από την αρχή: Πακέτα, αποθήκευση και καθαρό workflow",
    "descEn": "An educational, practical guide about termux: Termux Setup Done Right: Packages, Storage, and a Clean Workflow.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για termux: Termux σωστά από την αρχή: Πακέτα, αποθήκευση και καθαρό workflow.",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Setup",
      "Done",
      "Right"
    ]
  },
  {
    "file": "termux-python-automation.html",
    "href": "../Blog/termux-python-automation.html",
    "titleEn": "Python Automation in Termux: Small Scripts that Save Real Time",
    "titleGr": "Python αυτοματοποίηση στο Termux: Μικρά scripts που κερδίζουν χρόνο",
    "descEn": "An educational, practical guide about termux: Python Automation in Termux: Small Scripts that Save Real Time.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για termux: Python αυτοματοποίηση στο Termux: Μικρά scripts που κερδίζουν χρόνο.",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Python",
      "Automation",
      "Small"
    ]
  },
  {
    "file": "termux-ssh-keys.html",
    "href": "../Blog/termux-ssh-keys.html",
    "titleEn": "SSH on Android with Termux: Keys, Agents, and Safer Remote Access",
    "titleGr": "SSH στο Android με Termux: Κλειδιά, agents και πιο ασφαλής πρόσβαση",
    "descEn": "An educational, practical guide about termux: SSH on Android with Termux: Keys, Agents, and Safer Remote Access.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για termux: SSH στο Android με Termux: Κλειδιά, agents και πιο ασφαλής πρόσβαση.",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Android",
      "with",
      "Keys"
    ]
  },
  {
    "file": "termux-local-webapps.html",
    "href": "../Blog/termux-local-webapps.html",
    "titleEn": "Local Web Apps in Termux: Run Flask, Test APIs, Stay Offline",
    "titleGr": "Τοπικές Web εφαρμογές στο Termux: Flask, δοκιμές API, offline",
    "descEn": "An educational, practical guide about termux: Local Web Apps in Termux: Run Flask, Test APIs, Stay Offline.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για termux: Τοπικές Web εφαρμογές στο Termux: Flask, δοκιμές API, offline.",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Local",
      "Apps",
      "Flask"
    ]
  },
  {
    "file": "termux-troubleshooting.html",
    "href": "../Blog/termux-troubleshooting.html",
    "titleEn": "Termux Troubleshooting: Battery, Permissions, and Weird Errors",
    "titleGr": "Termux Troubleshooting: Μπαταρία, άδειες και περίεργα σφάλματα",
    "descEn": "An educational, practical guide about termux: Termux Troubleshooting: Battery, Permissions, and Weird Errors.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για termux: Termux Troubleshooting: Μπαταρία, άδειες και περίεργα σφάλματα.",
    "date": "2026-01-26",
    "section": "Termux",
    "tags": [
      "Termux",
      "Troubleshooting",
      "Battery",
      "Permissions"
    ]
  },
  {
    "file": "linux-permissions-ownership.html",
    "href": "../Blog/linux-permissions-ownership.html",
    "titleEn": "Linux Permissions & Ownership: The Mental Model that Stops Mistakes",
    "titleGr": "Δικαιώματα & Ιδιοκτησία στο Linux: Το μοντέλο που σε γλιτώνει από λάθη",
    "descEn": "An educational, practical guide about linux: Linux Permissions & Ownership: The Mental Model that Stops Mistakes.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για linux: Δικαιώματα & Ιδιοκτησία στο Linux: Το μοντέλο που σε γλιτώνει από λάθη.",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Permissions",
      "Ownership",
      "Mental"
    ]
  },
  {
    "file": "systemd-explained.html",
    "href": "../Blog/systemd-explained.html",
    "titleEn": "systemd Explained: Services, Logs, Timers, and the Practical Bits",
    "titleGr": "systemd με απλά λόγια: Services, logs, timers και τα πρακτικά",
    "descEn": "An educational, practical guide about linux: systemd Explained: Services, Logs, Timers, and the Practical Bits.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για linux: systemd με απλά λόγια: Services, logs, timers και τα πρακτικά.",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "systemd",
      "Explained",
      "Services",
      "Logs"
    ]
  },
  {
    "file": "linux-laptop-hardening.html",
    "href": "../Blog/linux-laptop-hardening.html",
    "titleEn": "Hardening a Linux Laptop: Updates, Firewall, Disk Encryption",
    "titleGr": "Σκλήρυνση Linux laptop: Updates, firewall, κρυπτογράφηση δίσκου",
    "descEn": "An educational, practical guide about linux: Hardening a Linux Laptop: Updates, Firewall, Disk Encryption.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για linux: Σκλήρυνση Linux laptop: Updates, firewall, κρυπτογράφηση δίσκου.",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Hardening",
      "Laptop",
      "Updates"
    ]
  },
  {
    "file": "linux-networking-toolbox.html",
    "href": "../Blog/linux-networking-toolbox.html",
    "titleEn": "Linux Networking Toolbox: ip, ss, dig, tcpdump (Without Panic)",
    "titleGr": "Εργαλεία δικτύου στο Linux: ip, ss, dig, tcpdump (χωρίς πανικό)",
    "descEn": "An educational, practical guide about linux: Linux Networking Toolbox: ip, ss, dig, tcpdump (Without Panic).",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για linux: Εργαλεία δικτύου στο Linux: ip, ss, dig, tcpdump (χωρίς πανικό).",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Networking",
      "Toolbox",
      "tcpdump"
    ]
  },
  {
    "file": "containers-for-beginners.html",
    "href": "../Blog/containers-for-beginners.html",
    "titleEn": "Containers for Beginners: Docker/Podman Concepts Without the Hype",
    "titleGr": "Containers για αρχάριους: Docker/Podman έννοιες χωρίς hype",
    "descEn": "An educational, practical guide about linux: Containers for Beginners: Docker/Podman Concepts Without the Hype.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για linux: Containers για αρχάριους: Docker/Podman έννοιες χωρίς hype.",
    "date": "2026-01-26",
    "section": "Linux",
    "tags": [
      "Linux",
      "Containers",
      "Beginners",
      "Docker",
      "Podman"
    ]
  },
  {
    "file": "android-permissions-privacy.html",
    "href": "../Blog/android-permissions-privacy.html",
    "titleEn": "Android Permissions & Privacy: What ‘Allow’ Really Means",
    "titleGr": "Άδειες & ιδιωτικότητα στο Android: Τι σημαίνει πραγματικά το ‘Allow’",
    "descEn": "An educational, practical guide about android: Android Permissions & Privacy: What ‘Allow’ Really Means.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για android: Άδειες & ιδιωτικότητα στο Android: Τι σημαίνει πραγματικά το ‘Allow’.",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Permissions",
      "Privacy",
      "What"
    ]
  },
  {
    "file": "android-dns-private-relays.html",
    "href": "../Blog/android-dns-private-relays.html",
    "titleEn": "Private DNS & Tracking Protection on Android: Simple, Reversible Steps",
    "titleGr": "Private DNS & προστασία από tracking στο Android: Απλά, αναστρέψιμα βήματα",
    "descEn": "An educational, practical guide about android: Private DNS & Tracking Protection on Android: Simple, Reversible Steps.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για android: Private DNS & προστασία από tracking στο Android: Απλά, αναστρέψιμα βήματα.",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Private",
      "Tracking",
      "Protection"
    ]
  },
  {
    "file": "android-backups-security.html",
    "href": "../Blog/android-backups-security.html",
    "titleEn": "Android Backups: How to Avoid Losing Data Without Losing Privacy",
    "titleGr": "Android backups: Πώς δεν χάνεις δεδομένα χωρίς να χάνεις ιδιωτικότητα",
    "descEn": "An educational, practical guide about android: Android Backups: How to Avoid Losing Data Without Losing Privacy.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για android: Android backups: Πώς δεν χάνεις δεδομένα χωρίς να χάνεις ιδιωτικότητα.",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Backups",
      "Avoid",
      "Losing"
    ]
  },
  {
    "file": "android-sideloading-risks.html",
    "href": "../Blog/android-sideloading-risks.html",
    "titleEn": "Sideloading APKs Safely: The Risks, the Checks, and the Best Habits",
    "titleGr": "Sideloading APK με ασφάλεια: Ρίσκα, έλεγχοι και σωστές συνήθειες",
    "descEn": "An educational, practical guide about android: Sideloading APKs Safely: The Risks, the Checks, and the Best Habits.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για android: Sideloading APK με ασφάλεια: Ρίσκα, έλεγχοι και σωστές συνήθειες.",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Sideloading",
      "APKs",
      "Safely",
      "Risks"
    ]
  },
  {
    "file": "android-dev-options.html",
    "href": "../Blog/android-dev-options.html",
    "titleEn": "Developer Options Explained: Useful Tweaks vs Dangerous Switches",
    "titleGr": "Developer Options: Χρήσιμες ρυθμίσεις vs επικίνδυνοι διακόπτες",
    "descEn": "An educational, practical guide about android: Developer Options Explained: Useful Tweaks vs Dangerous Switches.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για android: Developer Options: Χρήσιμες ρυθμίσεις vs επικίνδυνοι διακόπτες.",
    "date": "2026-01-26",
    "section": "Android",
    "tags": [
      "Android",
      "Developer",
      "Options",
      "Explained",
      "Useful"
    ]
  },
  {
    "file": "ios-privacy-controls.html",
    "href": "../Blog/ios-privacy-controls.html",
    "titleEn": "iOS Privacy Controls: The Settings that Matter Most",
    "titleGr": "Ρυθμίσεις ιδιωτικότητας iOS: Αυτές που μετράνε πραγματικά",
    "descEn": "An educational, practical guide about ios: iOS Privacy Controls: The Settings that Matter Most.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για ios: Ρυθμίσεις ιδιωτικότητας iOS: Αυτές που μετράνε πραγματικά.",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Privacy",
      "Controls",
      "Settings",
      "that"
    ]
  },
  {
    "file": "icloud-security-basics.html",
    "href": "../Blog/icloud-security-basics.html",
    "titleEn": "iCloud Security Basics: Backups, Keys, and Account Recovery",
    "titleGr": "iCloud ασφάλεια: Backups, κλειδιά και ανάκτηση λογαριασμού",
    "descEn": "An educational, practical guide about ios: iCloud Security Basics: Backups, Keys, and Account Recovery.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για ios: iCloud ασφάλεια: Backups, κλειδιά και ανάκτηση λογαριασμού.",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "iCloud",
      "Security",
      "Basics",
      "Backups"
    ]
  },
  {
    "file": "passkeys-on-ios.html",
    "href": "../Blog/passkeys-on-ios.html",
    "titleEn": "Passkeys on iPhone: A Practical Migration Guide (No Drama)",
    "titleGr": "Passkeys στο iPhone: Πρακτικός οδηγός μετάβασης (χωρίς δράματα)",
    "descEn": "An educational, practical guide about ios: Passkeys on iPhone: A Practical Migration Guide (No Drama).",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για ios: Passkeys στο iPhone: Πρακτικός οδηγός μετάβασης (χωρίς δράματα).",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Passkeys",
      "iPhone",
      "Practical",
      "Migration"
    ]
  },
  {
    "file": "ios-profiles-mdm.html",
    "href": "../Blog/ios-profiles-mdm.html",
    "titleEn": "Profiles & MDM on iOS: What They Are and When to Worry",
    "titleGr": "Profiles & MDM στο iOS: Τι είναι και πότε να ανησυχείς",
    "descEn": "An educational, practical guide about ios: Profiles & MDM on iOS: What They Are and When to Worry.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για ios: Profiles & MDM στο iOS: Τι είναι και πότε να ανησυχείς.",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Profiles",
      "What",
      "They",
      "When"
    ]
  },
  {
    "file": "ios-stalkerware-defense.html",
    "href": "../Blog/ios-stalkerware-defense.html",
    "titleEn": "Stalkerware & Account Takeovers: iOS Warning Signs and Fixes",
    "titleGr": "Stalkerware & hijacks: Σημάδια στο iOS και τι κάνεις",
    "descEn": "An educational, practical guide about ios: Stalkerware & Account Takeovers: iOS Warning Signs and Fixes.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για ios: Stalkerware & hijacks: Σημάδια στο iOS και τι κάνεις.",
    "date": "2026-01-26",
    "section": "iOS",
    "tags": [
      "iOS",
      "Stalkerware",
      "Account",
      "Takeovers",
      "Warning"
    ]
  },
  {
    "file": "how-conspiracies-spread.html",
    "href": "../Blog/how-conspiracies-spread.html",
    "titleEn": "How Conspiracy Theories Spread Online: A Map of the Pipeline",
    "titleGr": "Πώς εξαπλώνονται οι θεωρίες συνωμοσίας online: Χάρτης της διαδρομής",
    "descEn": "An educational, practical guide about conspiracy theories: How Conspiracy Theories Spread Online: A Map of the Pipeline.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για θεωρίες συνωμοσίας: Πώς εξαπλώνονται οι θεωρίες συνωμοσίας online: Χάρτης της διαδρομής.",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy Theories",
      "Conspiracy",
      "Theories",
      "Spread",
      "Online"
    ]
  },
  {
    "file": "cognitive-biases.html",
    "href": "../Blog/cognitive-biases.html",
    "titleEn": "Cognitive Biases 101: Why Smart People Believe Weird Things",
    "titleGr": "Γνωστικές προκαταλήψεις 101: Γιατί έξυπνοι άνθρωποι πιστεύουν περίεργα πράγματα",
    "descEn": "An educational, practical guide about conspiracy theories: Cognitive Biases 101: Why Smart People Believe Weird Things.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για θεωρίες συνωμοσίας: Γνωστικές προκαταλήψεις 101: Γιατί έξυπνοι άνθρωποι πιστεύουν περίεργα πράγματα.",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy Theories",
      "Cognitive",
      "Biases",
      "Smart",
      "People"
    ]
  },
  {
    "file": "fact-checking-toolkit.html",
    "href": "../Blog/fact-checking-toolkit.html",
    "titleEn": "A Fact‑Checking Toolkit: Fast Checks, Deep Checks, and Red Flags",
    "titleGr": "Toolkit επαλήθευσης: Γρήγοροι έλεγχοι, βαθιοί έλεγχοι και red flags",
    "descEn": "An educational, practical guide about conspiracy theories: A Fact‑Checking Toolkit: Fast Checks, Deep Checks, and Red Flags.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για θεωρίες συνωμοσίας: Toolkit επαλήθευσης: Γρήγοροι έλεγχοι, βαθιοί έλεγχοι και red flags.",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy Theories",
      "Fact",
      "Checking",
      "Toolkit",
      "Fast"
    ]
  },
  {
    "file": "healthy-skepticism.html",
    "href": "../Blog/healthy-skepticism.html",
    "titleEn": "Healthy Skepticism vs Cynicism: How to Stay Sharp Without Going Dark",
    "titleGr": "Υγιής σκεπτικισμός vs κυνισμός: Πώς μένεις κοφτερός χωρίς να σκοτεινιάζεις",
    "descEn": "An educational, practical guide about conspiracy theories: Healthy Skepticism vs Cynicism: How to Stay Sharp Without Going Dark.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για θεωρίες συνωμοσίας: Υγιής σκεπτικισμός vs κυνισμός: Πώς μένεις κοφτερός χωρίς να σκοτεινιάζεις.",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy Theories",
      "Healthy",
      "Skepticism",
      "Cynicism",
      "Stay"
    ]
  },
  {
    "file": "algorithms-misinformation.html",
    "href": "../Blog/algorithms-misinformation.html",
    "titleEn": "Algorithms & Misinformation: Why the Feed Feels Like Reality",
    "titleGr": "Αλγόριθμοι & παραπληροφόρηση: Γιατί το feed μοιάζει σαν πραγματικότητα",
    "descEn": "An educational, practical guide about conspiracy theories: Algorithms & Misinformation: Why the Feed Feels Like Reality.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για θεωρίες συνωμοσίας: Αλγόριθμοι & παραπληροφόρηση: Γιατί το feed μοιάζει σαν πραγματικότητα.",
    "date": "2026-01-26",
    "section": "Conspiracy Theories",
    "tags": [
      "Conspiracy Theories",
      "Algorithms",
      "Misinformation",
      "Feed",
      "Feels"
    ]
  },
  {
    "file": "peer-review-explained.html",
    "href": "../Blog/peer-review-explained.html",
    "titleEn": "Peer Review Explained: What It Can and Cannot Guarantee",
    "titleGr": "Peer review: Τι εγγυάται και τι δεν μπορεί να εγγυηθεί",
    "descEn": "An educational, practical guide about science: Peer Review Explained: What It Can and Cannot Guarantee.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για επιστήμη: Peer review: Τι εγγυάται και τι δεν μπορεί να εγγυηθεί.",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Peer",
      "Review",
      "Explained",
      "What"
    ]
  },
  {
    "file": "climate-vs-weather.html",
    "href": "../Blog/climate-vs-weather.html",
    "titleEn": "Climate vs Weather: The Difference That Changes Conversations",
    "titleGr": "Κλίμα vs Καιρός: Η διαφορά που αλλάζει τις συζητήσεις",
    "descEn": "An educational, practical guide about science: Climate vs Weather: The Difference That Changes Conversations.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για επιστήμη: Κλίμα vs Καιρός: Η διαφορά που αλλάζει τις συζητήσεις.",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Climate",
      "Weather",
      "Difference",
      "That"
    ]
  },
  {
    "file": "vaccines-immune-basics.html",
    "href": "../Blog/vaccines-immune-basics.html",
    "titleEn": "Vaccines & the Immune System: Clear Explanations Without Jargon",
    "titleGr": "Εμβόλια & ανοσοποιητικό: Καθαρή εξήγηση χωρίς ορολογία",
    "descEn": "An educational, practical guide about science: Vaccines & the Immune System: Clear Explanations Without Jargon.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για επιστήμη: Εμβόλια & ανοσοποιητικό: Καθαρή εξήγηση χωρίς ορολογία.",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Vaccines",
      "Immune",
      "System",
      "Clear"
    ]
  },
  {
    "file": "space-telescopes.html",
    "href": "../Blog/space-telescopes.html",
    "titleEn": "Space Telescopes: How We Turn Photons Into Knowledge",
    "titleGr": "Διαστημικά τηλεσκόπια: Πώς κάνουμε τα φωτόνια γνώση",
    "descEn": "An educational, practical guide about science: Space Telescopes: How We Turn Photons Into Knowledge.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για επιστήμη: Διαστημικά τηλεσκόπια: Πώς κάνουμε τα φωτόνια γνώση.",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Space",
      "Telescopes",
      "Turn",
      "Photons"
    ]
  },
  {
    "file": "energy-storage-basics.html",
    "href": "../Blog/energy-storage-basics.html",
    "titleEn": "Energy Storage Basics: Batteries, Grids, and the Real Constraints",
    "titleGr": "Αποθήκευση ενέργειας: Μπαταρίες, δίκτυα και οι πραγματικοί περιορισμοί",
    "descEn": "An educational, practical guide about science: Energy Storage Basics: Batteries, Grids, and the Real Constraints.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για επιστήμη: Αποθήκευση ενέργειας: Μπαταρίες, δίκτυα και οι πραγματικοί περιορισμοί.",
    "date": "2026-01-26",
    "section": "Science",
    "tags": [
      "Science",
      "Energy",
      "Storage",
      "Basics",
      "Batteries"
    ]
  },
  {
    "file": "crispr-gene-editing.html",
    "href": "../Blog/crispr-gene-editing.html",
    "titleEn": "CRISPR Explained: Editing Genes, Limits, and Real-World Uses",
    "titleGr": "CRISPR με απλά λόγια: Γονιδιακή επεξεργασία, όρια και εφαρμογές",
    "descEn": "An educational, practical guide about biology: CRISPR Explained: Editing Genes, Limits, and Real-World Uses.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για βιολογία: CRISPR με απλά λόγια: Γονιδιακή επεξεργασία, όρια και εφαρμογές.",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "CRISPR",
      "Explained",
      "Editing",
      "Genes"
    ]
  },
  {
    "file": "microbiome.html",
    "href": "../Blog/microbiome.html",
    "titleEn": "The Microbiome: What We Know, What We Guess, and What’s Hype",
    "titleGr": "Μικροβίωμα: Τι ξέρουμε, τι υποθέτουμε και τι είναι hype",
    "descEn": "An educational, practical guide about biology: The Microbiome: What We Know, What We Guess, and What’s Hype.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για βιολογία: Μικροβίωμα: Τι ξέρουμε, τι υποθέτουμε και τι είναι hype.",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Microbiome",
      "What",
      "Know"
    ]
  },
  {
    "file": "antibiotic-resistance.html",
    "href": "../Blog/antibiotic-resistance.html",
    "titleEn": "Antibiotic Resistance: How It Happens and How to Slow It Down",
    "titleGr": "Αντοχή στα αντιβιοτικά: Πώς συμβαίνει και πώς την περιορίζουμε",
    "descEn": "An educational, practical guide about biology: Antibiotic Resistance: How It Happens and How to Slow It Down.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για βιολογία: Αντοχή στα αντιβιοτικά: Πώς συμβαίνει και πώς την περιορίζουμε.",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Antibiotic",
      "Resistance",
      "Happens",
      "Slow"
    ]
  },
  {
    "file": "sleep-biology.html",
    "href": "../Blog/sleep-biology.html",
    "titleEn": "Sleep Biology: Why You Can’t ‘Hack’ What You Don’t Respect",
    "titleGr": "Βιολογία ύπνου: Γιατί δεν ‘χακάρεται’ αυτό που δεν σέβεσαι",
    "descEn": "An educational, practical guide about biology: Sleep Biology: Why You Can’t ‘Hack’ What You Don’t Respect.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για βιολογία: Βιολογία ύπνου: Γιατί δεν ‘χακάρεται’ αυτό που δεν σέβεσαι.",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Sleep",
      "Hack",
      "What"
    ]
  },
  {
    "file": "nutrition-myths.html",
    "href": "../Blog/nutrition-myths.html",
    "titleEn": "Nutrition Myths: Labels, Studies, and Building Sanity Around Food",
    "titleGr": "Μύθοι διατροφής: Ετικέτες, μελέτες και πώς βρίσκεις ισορροπία",
    "descEn": "An educational, practical guide about biology: Nutrition Myths: Labels, Studies, and Building Sanity Around Food.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για βιολογία: Μύθοι διατροφής: Ετικέτες, μελέτες και πώς βρίσκεις ισορροπία.",
    "date": "2026-01-26",
    "section": "Biology",
    "tags": [
      "Biology",
      "Nutrition",
      "Myths",
      "Labels",
      "Studies"
    ]
  },
  {
    "file": "how-llms-work.html",
    "href": "../Blog/how-llms-work.html",
    "titleEn": "How Large Language Models Work: Tokens, Training, and Hallucinations",
    "titleGr": "Πώς δουλεύουν τα LLM: tokens, εκπαίδευση και ‘παραισθήσεις’",
    "descEn": "An educational, practical guide about artificial intelligence: How Large Language Models Work: Tokens, Training, and Hallucinations.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνητή νοημοσύνη: Πώς δουλεύουν τα LLM: tokens, εκπαίδευση και ‘παραισθήσεις’.",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial Intelligence",
      "Large",
      "Language",
      "Models",
      "Work"
    ]
  },
  {
    "file": "ai-ethics-risk.html",
    "href": "../Blog/ai-ethics-risk.html",
    "titleEn": "AI Ethics in Practice: Bias, Consent, and Accountability",
    "titleGr": "Ηθική AI στην πράξη: μεροληψία, συναίνεση και λογοδοσία",
    "descEn": "An educational, practical guide about artificial intelligence: AI Ethics in Practice: Bias, Consent, and Accountability.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνητή νοημοσύνη: Ηθική AI στην πράξη: μεροληψία, συναίνεση και λογοδοσία.",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial Intelligence",
      "Ethics",
      "Practice",
      "Bias",
      "Consent"
    ]
  },
  {
    "file": "prompting-evaluation.html",
    "href": "../Blog/prompting-evaluation.html",
    "titleEn": "Prompting & Evaluation: Getting Reliable Outputs Without Magic",
    "titleGr": "Prompting & αξιολόγηση: Αξιόπιστα αποτελέσματα χωρίς μαγεία",
    "descEn": "An educational, practical guide about artificial intelligence: Prompting & Evaluation: Getting Reliable Outputs Without Magic.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνητή νοημοσύνη: Prompting & αξιολόγηση: Αξιόπιστα αποτελέσματα χωρίς μαγεία.",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial Intelligence",
      "Prompting",
      "Evaluation",
      "Getting",
      "Reliable"
    ]
  },
  {
    "file": "ai-productivity-workflows.html",
    "href": "../Blog/ai-productivity-workflows.html",
    "titleEn": "AI for Productivity: Workflows that Respect Privacy and Quality",
    "titleGr": "AI για παραγωγικότητα: Workflows με ιδιωτικότητα και ποιότητα",
    "descEn": "An educational, practical guide about artificial intelligence: AI for Productivity: Workflows that Respect Privacy and Quality.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνητή νοημοσύνη: AI για παραγωγικότητα: Workflows με ιδιωτικότητα και ποιότητα.",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial Intelligence",
      "Productivity",
      "Workflows",
      "that",
      "Respect"
    ]
  },
  {
    "file": "ai-security-privacy.html",
    "href": "../Blog/ai-security-privacy.html",
    "titleEn": "AI Security & Privacy: Data Leakage, Model Attacks, and Safe Use",
    "titleGr": "AI ασφάλεια & ιδιωτικότητα: Διαρροές, επιθέσεις και ασφαλής χρήση",
    "descEn": "An educational, practical guide about artificial intelligence: AI Security & Privacy: Data Leakage, Model Attacks, and Safe Use.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για τεχνητή νοημοσύνη: AI ασφάλεια & ιδιωτικότητα: Διαρροές, επιθέσεις και ασφαλής χρήση.",
    "date": "2026-01-26",
    "section": "Artificial Intelligence",
    "tags": [
      "Artificial Intelligence",
      "Security",
      "Privacy",
      "Data",
      "Leakage"
    ]
  },
  {
    "file": "gdpr-privacy-basics.html",
    "href": "../Blog/gdpr-privacy-basics.html",
    "titleEn": "Digital Privacy Basics (EU): GDPR Concepts You Can Use Daily",
    "titleGr": "Ψηφιακή ιδιωτικότητα (ΕΕ): GDPR έννοιες που χρησιμοποιείς καθημερινά",
    "descEn": "An educational, practical guide about law: Digital Privacy Basics (EU): GDPR Concepts You Can Use Daily.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για νόμος: Ψηφιακή ιδιωτικότητα (ΕΕ): GDPR έννοιες που χρησιμοποιείς καθημερινά.",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Digital",
      "Privacy",
      "Basics",
      "GDPR"
    ]
  },
  {
    "file": "cybercrime-basics.html",
    "href": "../Blog/cybercrime-basics.html",
    "titleEn": "Cybercrime Law Basics: What Counts as Illegal (and What Doesn’t)",
    "titleGr": "Βασικά για το cybercrime: Τι είναι παράνομο (και τι όχι)",
    "descEn": "An educational, practical guide about law: Cybercrime Law Basics: What Counts as Illegal (and What Doesn’t).",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για νόμος: Βασικά για το cybercrime: Τι είναι παράνομο (και τι όχι).",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Cybercrime",
      "Basics",
      "What",
      "Counts"
    ]
  },
  {
    "file": "copyright-online.html",
    "href": "../Blog/copyright-online.html",
    "titleEn": "Copyright Online: Fair Use, Quotes, and Creator Respect",
    "titleGr": "Πνευματικά δικαιώματα online: Fair use, παραθέματα και σεβασμός",
    "descEn": "An educational, practical guide about law: Copyright Online: Fair Use, Quotes, and Creator Respect.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για νόμος: Πνευματικά δικαιώματα online: Fair use, παραθέματα και σεβασμός.",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Copyright",
      "Online",
      "Fair",
      "Quotes"
    ]
  },
  {
    "file": "online-defamation.html",
    "href": "../Blog/online-defamation.html",
    "titleEn": "Online Speech & Defamation: How to Disagree Without Legal Trouble",
    "titleGr": "Online λόγος & δυσφήμιση: Πώς διαφωνείς χωρίς μπελάδες",
    "descEn": "An educational, practical guide about law: Online Speech & Defamation: How to Disagree Without Legal Trouble.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για νόμος: Online λόγος & δυσφήμιση: Πώς διαφωνείς χωρίς μπελάδες.",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Online",
      "Speech",
      "Defamation",
      "Disagree"
    ]
  },
  {
    "file": "incident-reporting.html",
    "href": "../Blog/incident-reporting.html",
    "titleEn": "Reporting Incidents: Evidence, Timelines, and Where to Ask for Help",
    "titleGr": "Αναφορά περιστατικών: Στοιχεία, χρονολόγιο και πού ζητάς βοήθεια",
    "descEn": "An educational, practical guide about law: Reporting Incidents: Evidence, Timelines, and Where to Ask for Help.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για νόμος: Αναφορά περιστατικών: Στοιχεία, χρονολόγιο και πού ζητάς βοήθεια.",
    "date": "2026-01-26",
    "section": "Law",
    "tags": [
      "Law",
      "Reporting",
      "Incidents",
      "Evidence",
      "Timelines"
    ]
  },
  {
    "file": "what-is-corruption.html",
    "href": "../Blog/what-is-corruption.html",
    "titleEn": "What Corruption Is (and Isn’t): Definitions, Incentives, Indicators",
    "titleGr": "Τι είναι η διαφθορά (και τι δεν είναι): ορισμοί, κίνητρα, δείκτες",
    "descEn": "An educational, practical guide about corruption of greece: What Corruption Is (and Isn’t): Definitions, Incentives, Indicators.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για διαφθορά στην ελλάδα: Τι είναι η διαφθορά (και τι δεν είναι): ορισμοί, κίνητρα, δείκτες.",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption Of Greece",
      "What",
      "Corruption",
      "Definitions",
      "Incentives"
    ]
  },
  {
    "file": "procurement-transparency.html",
    "href": "../Blog/procurement-transparency.html",
    "titleEn": "Public Procurement Transparency: Why It Matters and How to Track It",
    "titleGr": "Διαφάνεια στις δημόσιες προμήθειες: Γιατί μετράει και πώς την παρακολουθείς",
    "descEn": "An educational, practical guide about corruption of greece: Public Procurement Transparency: Why It Matters and How to Track It.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για διαφθορά στην ελλάδα: Διαφάνεια στις δημόσιες προμήθειες: Γιατί μετράει και πώς την παρακολουθείς.",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption Of Greece",
      "Public",
      "Procurement",
      "Transparency",
      "Matters"
    ]
  },
  {
    "file": "whistleblower-protection.html",
    "href": "../Blog/whistleblower-protection.html",
    "titleEn": "Whistleblowing Safely: Rights, Protections, and Practical Precautions",
    "titleGr": "Whistleblowing με ασφάλεια: Δικαιώματα, προστασίες και πρακτικές προφυλάξεις",
    "descEn": "An educational, practical guide about corruption of greece: Whistleblowing Safely: Rights, Protections, and Practical Precautions.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για διαφθορά στην ελλάδα: Whistleblowing με ασφάλεια: Δικαιώματα, προστασίες και πρακτικές προφυλάξεις.",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption Of Greece",
      "Whistleblowing",
      "Safely",
      "Rights",
      "Protections"
    ]
  },
  {
    "file": "open-data-tools.html",
    "href": "../Blog/open-data-tools.html",
    "titleEn": "Open Data & Transparency Tools: Turning Documents Into Accountability",
    "titleGr": "Open data & εργαλεία διαφάνειας: Από έγγραφα σε λογοδοσία",
    "descEn": "An educational, practical guide about corruption of greece: Open Data & Transparency Tools: Turning Documents Into Accountability.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για διαφθορά στην ελλάδα: Open data & εργαλεία διαφάνειας: Από έγγραφα σε λογοδοσία.",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption Of Greece",
      "Open",
      "Data",
      "Transparency",
      "Tools"
    ]
  },
  {
    "file": "everyday-integrity.html",
    "href": "../Blog/everyday-integrity.html",
    "titleEn": "Everyday Integrity: Small Habits That Reduce Corruption’s Oxygen",
    "titleGr": "Καθημερινή ακεραιότητα: Μικρές συνήθειες που κόβουν το οξυγόνο της διαφθοράς",
    "descEn": "An educational, practical guide about corruption of greece: Everyday Integrity: Small Habits That Reduce Corruption’s Oxygen.",
    "descGr": "Εκπαιδευτικός, πρακτικός οδηγός για διαφθορά στην ελλάδα: Καθημερινή ακεραιότητα: Μικρές συνήθειες που κόβουν το οξυγόνο της διαφθοράς.",
    "date": "2026-01-26",
    "section": "Corruption Of Greece",
    "tags": [
      "Corruption Of Greece",
      "Everyday",
      "Integrity",
      "Small",
      "Habits"
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
