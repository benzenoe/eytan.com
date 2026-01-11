// i18n (Internationalization) System for eytan.com
// Handles bilingual English/French content

// Translation dictionary
const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      blog: 'Blog',
      resume: 'Resume',
      contact: 'Contact'
    },

    // Homepage Hero
    hero: {
      greeting: "Hi, I'm Eytan Benzeno",
      subtitle: 'AI & Marketing Consultant | Real Estate Broker | E-commerce Pioneer',
      experience: '20+ Years E-commerce and Real Estate Experience | AI, Logistics & Customer Service Expert'
    },

    // Blog Page
    blog: {
      title: "Eytan's Blog",
      subtitle: "Welcome to My Corner of the Internet\nI'm Eytan, and I'm glad you're here. This is where I share insights, experiences, and reflections from my journey through tech, business, and life. Pull up a chair, grab a coffee, dive in and explore.",
      allPosts: 'All Posts',
      readMore: 'Read More',
      minuteRead: 'min read',
      publishedOn: 'Published on',
      by: 'by',
      loading: 'Loading posts...',
      noPosts: 'No posts found',
      tags: 'Tags'
    },

    // Blog Post
    post: {
      shareOn: 'Share on',
      relatedPosts: 'More Posts',
      backToBlog: '← Back to Blog',
      publishedOn: 'Published on',
      readTime: 'min read'
    },

    // Contact Page
    contact: {
      title: 'Get In Touch',
      subtitle: "Let's connect and explore opportunities together",
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.',
      or: 'Or reach me directly',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      location: 'Location'
    },

    // Resume Page
    resume: {
      title: 'Resume',
      download: 'Download PDF',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      present: 'Present'
    },

    // Footer
    footer: {
      rights: 'All rights reserved',
      builtWith: 'Built with'
    },

    // Common
    common: {
      readMore: 'Read More',
      learnMore: 'Learn More',
      viewMore: 'View More',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete'
    }
  },

  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      blog: 'Blog',
      resume: 'CV',
      contact: 'Contact'
    },

    // Homepage Hero
    hero: {
      greeting: 'Bonjour, je suis Eytan Benzeno',
      subtitle: 'Consultant IA & Marketing | Courtier Immobilier | Pionnier du E-commerce',
      experience: '20+ ans d\'expérience en E-commerce et Immobilier | Expert en IA, Logistique & Service Client'
    },

    // Blog Page
    blog: {
      title: 'Le Blog d\'Eytan',
      subtitle: "Bienvenue dans Mon Coin d'Internet\nJe suis Eytan, et je suis heureux que vous soyez ici. C'est ici que je partage mes idées, expériences et réflexions de mon parcours à travers la tech, les affaires et la vie. Installez-vous, prenez un café et explorez.",
      allPosts: 'Tous les Articles',
      readMore: 'Lire la Suite',
      minuteRead: 'min de lecture',
      publishedOn: 'Publié le',
      by: 'par',
      loading: 'Chargement des articles...',
      noPosts: 'Aucun article trouvé',
      tags: 'Étiquettes'
    },

    // Blog Post
    post: {
      shareOn: 'Partager sur',
      relatedPosts: 'Plus d\'Articles',
      backToBlog: '← Retour au Blog',
      publishedOn: 'Publié le',
      readTime: 'min de lecture'
    },

    // Contact Page
    contact: {
      title: 'Contactez-Moi',
      subtitle: 'Connectons-nous et explorons les opportunités ensemble',
      name: 'Votre Nom',
      email: 'Votre Email',
      message: 'Votre Message',
      send: 'Envoyer le Message',
      sending: 'Envoi en cours...',
      success: 'Message envoyé avec succès!',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.',
      or: 'Ou contactez-moi directement',
      phone: 'Téléphone',
      whatsapp: 'WhatsApp',
      location: 'Localisation'
    },

    // Resume Page
    resume: {
      title: 'Curriculum Vitae',
      download: 'Télécharger PDF',
      experience: 'Expérience',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      present: 'Aujourd\'hui'
    },

    // Footer
    footer: {
      rights: 'Tous droits réservés',
      builtWith: 'Créé avec'
    },

    // Common
    common: {
      readMore: 'Lire la Suite',
      learnMore: 'En Savoir Plus',
      viewMore: 'Voir Plus',
      close: 'Fermer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer'
    }
  }
};

// Language Manager Class
class I18n {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'en';
    this.translations = translations;
  }

  // Get stored language preference from localStorage
  getStoredLanguage() {
    return localStorage.getItem('language');
  }

  // Set and store language preference
  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.error(`Language ${lang} not supported`);
      return;
    }

    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

    // Update all translatable elements
    this.updatePageTranslations();
  }

  // Get current language
  getLanguage() {
    return this.currentLanguage;
  }

  // Get translation for a key (dot notation: 'nav.home')
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value || key;
  }

  // Update all elements with data-i18n attribute
  updatePageTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      // Update text or placeholder based on element type
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        } else {
          element.value = translation;
        }
      } else {
        // Handle multiline translations (preserve HTML structure)
        if (translation.includes('\n')) {
          element.innerHTML = translation.replace(/\n/g, '<br>');
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update page title if it has data-i18n-title
    const titleElement = document.querySelector('[data-i18n-title]');
    if (titleElement) {
      const key = titleElement.getAttribute('data-i18n-title');
      document.title = this.t(key);
    }

    // Update language switcher active state
    this.updateLanguageSwitcher();
  }

  // Update language switcher buttons
  updateLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-switch');
    langButtons.forEach(button => {
      if (button.dataset.lang === this.currentLanguage) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  // Initialize i18n system
  init() {
    // Set initial language on page load
    document.documentElement.lang = this.currentLanguage;

    // Update all translations
    this.updatePageTranslations();

    // Set up language switcher listeners
    const langButtons = document.querySelectorAll('.lang-switch');
    langButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = button.dataset.lang;
        this.setLanguage(lang);
      });
    });

    console.log(`🌍 i18n initialized with language: ${this.currentLanguage}`);
  }
}

// Create global instance
const i18n = new I18n();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = i18n;
}
