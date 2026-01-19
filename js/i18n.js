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
      subtitle: "I'd love to hear from you. Send me a message and I'll get back to you as soon as possible.",
      scheduleTitle: 'Schedule a Meeting',
      scheduleText: 'Want to discuss your project, explore opportunities, or just chat? Book a convenient time slot for a meeting with me.',
      bookMeeting: 'Book a Meeting with Eytan',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.',
      phoneLabel: 'Phone',
      whatsappLabel: 'WhatsApp',
      whatsappLink: 'Message on WhatsApp',
      socialLinks: 'Social Links',
      qrTitle: 'Quick Connect',
      qrSubtitle: 'Scan this QR code to save my contact info',
      qrInstructions: 'Point your camera at the code',
      downloadVCard: 'Download Contact Card'
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

    // About Section
    about: {
      title: 'About Me',
      intro: "I'm an entrepreneur and consultant with a diverse portfolio spanning e-commerce, real estate, technology, and personal development. With over 20 years of pioneering experience, my unique combination of expertise allows me to help individuals and businesses grow across multiple dimensions.",
      realEstateTitle: '🏡 Real Estate',
      realEstateText: 'As a licensed broker in South Florida and Founder & Managing Partner of SoldHere, LDA in Portugal, I help clients navigate international property transactions across two vibrant markets. With expertise in property management and short-term rentals, I provide comprehensive real estate services from acquisition to operations. Whether you\'re investing in sunny South Florida through SoldHere.com or exploring opportunities in beautiful Portugal via SoldHere.pt, I bring local expertise and global perspective.',
      aiMarketingTitle: '🤖 AI & Marketing',
      aiMarketingText: 'As Managing Partner and Chief AI Transformation Strategist at Bogen.ai, I provide cutting-edge marketing and AI integration consulting. I help businesses leverage artificial intelligence to optimize their marketing strategies, automate processes, and stay ahead in an increasingly tech-driven marketplace.',
      ecommerceTitle: '🛒 E-commerce Pioneer',
      ecommerceText: 'With over 20 years of experience in e-commerce, I\'ve been at the forefront of online retail evolution. As an e-commerce specialist, I bring deep expertise in operations, logistics management, customer service excellence, and building scalable online businesses. From the early days of online commerce to today\'s sophisticated platforms, I\'ve helped countless businesses optimize their operations and deliver exceptional customer experiences.',
      coachingTitle: '💡 Coaching & Mastermind',
      coachingText: 'As a partner and manager at Reignation.com, I facilitate transformative coaching experiences and mastermind groups. I\'m passionate about helping leaders and entrepreneurs unlock their potential and achieve breakthrough results.',
      viewResume: 'View Resume',
      readBlog: 'Read Blog'
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
      title: 'Entrer en Contact',
      subtitle: 'J\'aimerais avoir de vos nouvelles. Envoyez-moi un message et je vous répondrai dès que possible.',
      scheduleTitle: 'Planifier une Réunion',
      scheduleText: 'Vous souhaitez discuter de votre projet, explorer des opportunités ou simplement discuter ? Réservez un créneau horaire qui vous convient pour une réunion avec moi.',
      bookMeeting: 'Réserver une Réunion avec Eytan',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer le Message',
      sending: 'Envoi en cours...',
      success: 'Message envoyé avec succès!',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.',
      phoneLabel: 'Téléphone',
      whatsappLabel: 'WhatsApp',
      whatsappLink: 'Message sur WhatsApp',
      socialLinks: 'Liens Sociaux',
      qrTitle: 'Connexion Rapide',
      qrSubtitle: 'Scannez ce code QR pour enregistrer mes informations de contact',
      qrInstructions: 'Pointez votre appareil photo sur le code',
      downloadVCard: 'Télécharger la Carte de Contact'
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

    // About Section
    about: {
      title: 'À Propos de Moi',
      intro: "Je suis un entrepreneur et consultant avec un portefeuille diversifié couvrant le e-commerce, l'immobilier, la technologie et le développement personnel. Avec plus de 20 ans d'expérience pionnière, ma combinaison unique d'expertise me permet d'aider les individus et les entreprises à croître sur plusieurs dimensions.",
      realEstateTitle: '🏡 Immobilier',
      realEstateText: "En tant que courtier agréé dans le sud de la Floride et Fondateur & Associé Gérant de SoldHere, LDA au Portugal, j'aide les clients à naviguer dans les transactions immobilières internationales sur deux marchés dynamiques. Avec une expertise en gestion immobilière et locations court terme, je fournis des services immobiliers complets de l'acquisition aux opérations. Que vous investissiez dans le sud ensoleillé de la Floride via SoldHere.com ou que vous exploriez des opportunités au beau Portugal via SoldHere.pt, j'apporte une expertise locale et une perspective mondiale.",
      aiMarketingTitle: '🤖 IA & Marketing',
      aiMarketingText: "En tant qu'Associé Gérant et Stratège en Chef de la Transformation IA chez Bogen.ai, je fournis du conseil de pointe en marketing et intégration de l'IA. J'aide les entreprises à tirer parti de l'intelligence artificielle pour optimiser leurs stratégies marketing, automatiser les processus et rester en avance dans un marché de plus en plus axé sur la technologie.",
      ecommerceTitle: '🛒 Pionnier du E-commerce',
      ecommerceText: "Avec plus de 20 ans d'expérience en e-commerce, j'ai été à l'avant-garde de l'évolution du commerce en ligne. En tant que spécialiste du e-commerce, j'apporte une expertise approfondie en opérations, gestion logistique, excellence du service client et construction d'entreprises en ligne évolutives. Des débuts du commerce en ligne aux plateformes sophistiquées d'aujourd'hui, j'ai aidé d'innombrables entreprises à optimiser leurs opérations et à offrir des expériences client exceptionnelles.",
      coachingTitle: '💡 Coaching & Mastermind',
      coachingText: "En tant que partenaire et gestionnaire chez Reignation.com, je facilite des expériences de coaching transformatrices et des groupes mastermind. Je suis passionné par l'aide aux leaders et entrepreneurs à libérer leur potentiel et obtenir des résultats exceptionnels.",
      viewResume: 'Voir le CV',
      readBlog: 'Lire le Blog'
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
