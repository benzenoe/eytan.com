// i18n (Internationalization) System for eytan.com
// Handles trilingual English/French/Portuguese content

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
      subtitle: 'Technologist | Operator | Real Estate Broker | E-commerce Pioneer | AI & Marketing Specialist',
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
      heading: 'Resume',
      downloadBtn: 'Download PDF Resume',
      modalTitle: 'Choose Your Version',
      modalSubtitle: 'Select the format that best fits your needs',
      modernTitle: 'Modern · Short',
      modernDesc: '1-page executive layout. Clean, visual, optimized for quick reads.',
      downloadModern: 'Download Modern',
      classicTitle: 'Classic · Long',
      classicDesc: 'Full career history. Detailed and comprehensive for formal applications.',
      downloadClassic: 'Download Classic',
      headerLocationsLabel: 'Locations:',
      headerLocations: 'Lisbon, Luxembourg, Miami',
      headerTitle: 'Technologist, Operator, Marketer',
      headerLicense1: 'Licensed Florida Real Estate Broker,',
      headerLicense2: 'IMI Licensed Real Estate Broker (Portugal)',
      summaryHeading: 'Professional Summary',
      summaryText: 'Senior operator with over 20 years of experience across real estate, technology, operations, asset management, e-commerce, and banking. Proven success in expanding and repositioning ventures—from developing multi-million-dollar e-commerce businesses to advising on property investments and managing high-performing hospitality portfolios. Expert in stabilizing execution, managing delivery risk, and ensuring high-value assets and projects perform reliably under real-world constraints. Highly proficient in artificial intelligence, business technology, digital marketing, lead generation, and customer experience, utilizing modern tools to boost efficiency and growth. Active in Portugal, Luxembourg, and the United States, focusing on operational execution, sales strategies, emerging technologies, and cross-border investments. Brings agile leadership, strong negotiation and deal-making skills, and a results-oriented mindset to future-focused organizations.',
      competenceHeading: 'Core Competence',
      competenceText: 'Operations • Project Management • E-commerce • Artificial Intelligence • Business Strategy • Marketing Strategy • Digital Advertising • Social Media • Team Leadership • Real Estate Investment • Deal Structuring • Asset Optimization • Property Acquisition & Management • Hospitality • Sales • Technology',
      experienceHeading: 'Professional Experience',
      sh_title: 'Founder & Partner',
      sh_company: 'SoldHere, LDA – Lisbon, Portugal | March 2023 – Present',
      sh_b1: 'Licensed by IMI to mediate real estate transactions in Portugal.',
      sh_b2: 'Collaborated with developers on land acquisition, subdivision licensing, and building plan approvals in Portugal.',
      sh_b3: 'Managed acquisition, sales, repositioning, licensing, and short-term rental strategy for high-yield properties in Portugal.',
      sh_b4: 'Leveraged AI and digital tools for customer targeting, automation, and operational optimization.',
      sh_b5: 'Oversaw full operational lifecycle, including AL licensing, guest experience, and performance analytics.',
      ba_title: 'Co-Founder & Technology Partner',
      ba_company: 'Bogen.ai / REIGNation Mastermind – Remote/USA | May 2023 – Present',
      ba_b1: 'Built a subscription-based coaching and mastermind platform serving a community of 400+ real-estate professionals.',
      ba_b2: 'Act as the head of technology, leading platform development, AI integrations, marketing strategies, and automation workflows. Providing a vast array of AI services and interactions to members & clients.',
      ba_b3: 'Designed and led courses for realtors on the use of AI to improve and streamline their real estate practice.',
      ba_b4: 'Implemented systems using automation and segmentation to improve client targeting and member experience.',
      bf_title: 'Licensed Real Estate Broker & Real Estate Advisor',
      bf_company: 'BeachFront Realty – South Florida, USA | 2009 – Present',
      bf_b1: 'Specializing in real estate farming, developing long-term relationships in targeted geographic markets to capture consistent listing opportunities.',
      bf_b2: 'Worked across both residential and commercial real estate, including transactions for investment properties, retail spaces, and mixed-use developments.',
      bf_b3: 'Collaborated with developers on land acquisition, subdivision licensing, and building plan approvals in Florida.',
      bf_b4: 'Specializing in high-end new construction and waterfront condos for U.S. & international clients.',
      bf_b5: 'Applied predictive analytics, AI, and advanced CRM tools to generate leads and structure personalized sales journeys.',
      bf_b6: 'Developed branded digital campaigns to capture affluent clientele.',
      bs_title: 'Founder & CEO',
      bs_company: 'BeachStore.com – USA | 1999 – 2020',
      bs_b1: 'Launched and scaled a direct-to-consumer e-commerce brand into a multi-million-dollar business.',
      bs_b2: 'Grew the business to $3M in seasonal sales per summer, with overall sales exceeding $30M over a period of 15 years.',
      bs_b3: 'First e-commerce business to sell beach chairs online; first-to-market and market leader in the category for over 15 years.',
      bs_b4: 'Directed all digital advertising (SEO, PPC, & Social Media), content creation, email marketing, purchasing, product design & development, logistics, operations, and warehousing.',
      bs_b5: 'Built and positioned a lifestyle brand in the leisure and recreation space, combining seasonal market insights with digital engagement strategies to drive growth and visibility.',
      bk_title: 'International Banking Officer',
      bk_company: 'Republic National Bank (later HSBC) – New York, NY | 1991 – 2003',
      bk_b1: 'Managed international banking accounts and led large-scale system integrations.',
      bk_b2: 'Directed the Y2K compliance project involving 3,400+ applications across 400 consultants.',
      bk_b3: 'Developed business intelligence processes for financial analysis, risk assessment, and operational forecasting.',
      bk_b4: 'Gained financial operations experience that later supported real-estate investment due diligence and structuring.',
      bnb_title: 'Manager, Summer House Bed & Breakfast',
      bnb_company: 'Private Hospitality Business – New York, USA | Summers, 1993–2003',
      bnb_b1: 'Managed seasonal sales & operations of self-run bed and breakfast properties in Fire Island and the Hamptons for over a decade.',
      bnb_b2: 'Acquired and operated strategic seasonal venues; managed all aspects of sales & guest services, including check-ins, housekeeping, food service, recreational programming, and tailored hospitality activities & experiences.',
      bnb_b3: 'Developed marketing strategies through word-of-mouth and local tourism boards to attract repeat and new clientele.',
      bnb_b4: 'Gained hands-on knowledge in hospitality service delivery and guest satisfaction that later informed professional hotel and short-term rental ventures.',
      eduHeading: 'Education',
      eduDegree: 'BBA – Banking & Finance',
      eduSchool: 'Adelphi University – NY, USA | 1991',
      eduDetails: "Dean's List | Courses: Finance, International Banking, Accounting, Marketing, Investment Analysis",
      techHeading: 'Tech Stack',
      langHeading: 'Languages',
      langFluent: 'English, French & Hebrew (Native Fluent)',
      langLearning: 'Portuguese & Spanish (Learning)',
      goalsHeading: 'Professional Goals',
      goalsText: 'Seeking leadership opportunities in real estate, hospitality, or asset management where innovation, technology, and strategic execution can drive growth and value creation.',
      affHeading: 'Groups & Affiliations',
      aff_1: 'REIGNation Real Estate Community – Founder & Member',
      aff_2: 'MED Condo Board – President',
      aff_3: 'American Club of Lisbon – Active Member',
      aff_4: 'International Portuguese Club – Active Member',
      aff_5: 'AEPi Alumni Association – Active Member',
      aff_6: 'Adelphi University Alumni Association – Active Member',
      aff_7: 'Miami Realtor® Association – Active Member',
      aff_8: 'National Association of REALTORS (NAR) – Member',
      aff_9: 'DiSi Credito, Playa Beach Company, CenterStage, Mountain Breeze, AdvanceFigures, & Dave T Productions – Board of Advisors/Directors.',
      aff_10: 'New York Road Runners (NYRR) – Member',
      intHeading: 'Personal Interest',
      intP1: 'Avid follower of global news and current affairs, with a strong focus on financial markets, politics, real estate, economics, AI, blockchain, quantum computing, renewable energy, biotech, and robotics. Enthusiast of space, science, quantum physics, and emerging technologies.',
      intP2: 'A happy bon vivant passionate about global cuisine and home cooking, with an active lifestyle (running, hiking, golf, cycling, tennis, fitness), frequent travel, cultural exploration, and community engagement.',
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
      subtitle: 'Technologue | Opérateur | Courtier Immobilier | Pionnier du E-commerce | Spécialiste IA & Marketing',
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
      heading: 'Curriculum Vitae',
      downloadBtn: 'Télécharger le CV en PDF',
      modalTitle: 'Choisissez votre version',
      modalSubtitle: 'Sélectionnez le format qui correspond le mieux à vos besoins',
      modernTitle: 'Moderne · Court',
      modernDesc: 'Mise en page executive 1 page. Épuré, visuel, optimisé pour une lecture rapide.',
      downloadModern: 'Télécharger Moderne',
      classicTitle: 'Classique · Long',
      classicDesc: 'Historique complet de carrière. Détaillé et exhaustif pour les candidatures formelles.',
      downloadClassic: 'Télécharger Classique',
      headerLocationsLabel: 'Lieux :',
      headerLocations: 'Lisbonne, Luxembourg, Miami',
      headerTitle: 'Technologue, Opérateur, Marketeur',
      headerLicense1: 'Courtier Immobilier Agréé en Floride,',
      headerLicense2: 'Courtier Immobilier Agréé IMI (Portugal)',
      summaryHeading: 'Résumé Professionnel',
      summaryText: "Opérateur senior avec plus de 20 ans d'expérience dans l'immobilier, la technologie, les opérations, la gestion d'actifs, le e-commerce et la banque. Succès avéré dans l'expansion et le repositionnement de ventures—du développement d'entreprises e-commerce à plusieurs millions de dollars au conseil en investissements immobiliers et à la gestion de portefeuilles d'hospitalité performants. Expert dans la stabilisation de l'exécution, la gestion des risques de livraison et la garantie que les actifs et projets de haute valeur fonctionnent de manière fiable sous des contraintes réelles. Très compétent en intelligence artificielle, technologie d'entreprise, marketing digital, génération de leads et expérience client, utilisant des outils modernes pour stimuler l'efficacité et la croissance. Actif au Portugal, au Luxembourg et aux États-Unis, se concentrant sur l'exécution opérationnelle, les stratégies de vente, les technologies émergentes et les investissements transfrontaliers. Apporte un leadership agile, de solides compétences en négociation et en conclusion d'accords, et un état d'esprit orienté résultats aux organisations tournées vers l'avenir.",
      competenceHeading: 'Compétences Clés',
      competenceText: "Opérations • Gestion de Projet • E-commerce • Intelligence Artificielle • Stratégie d'Entreprise • Stratégie Marketing • Publicité Digitale • Médias Sociaux • Leadership d'Équipe • Investissement Immobilier • Structuration d'Accords • Optimisation d'Actifs • Acquisition et Gestion de Propriétés • Hôtellerie • Ventes • Technologie",
      experienceHeading: 'Expérience Professionnelle',
      sh_title: 'Fondateur & Associé',
      sh_company: 'SoldHere, LDA – Lisbonne, Portugal | Mars 2023 – Présent',
      sh_b1: "Agréé par l'IMI pour exercer la médiation dans les transactions immobilières au Portugal.",
      sh_b2: "Collaboration avec des promoteurs sur l'acquisition de terrains, l'obtention de permis de lotissement et l'approbation de plans de construction au Portugal.",
      sh_b3: 'Gestion de l\'acquisition, des ventes, du repositionnement, de la mise en conformité et de la stratégie de location courte durée pour des propriétés à haut rendement au Portugal.',
      sh_b4: "Utilisation de l'IA et des outils numériques pour le ciblage client, l'automatisation et l'optimisation opérationnelle.",
      sh_b5: 'Supervision du cycle de vie opérationnel complet, y compris la mise en conformité AL, l\'expérience client et l\'analyse des performances.',
      ba_title: 'Co-Fondateur & Partenaire Technologique',
      ba_company: 'Bogen.ai / REIGNation Mastermind – Remote/USA | Mai 2023 – Présent',
      ba_b1: 'Construction d\'une plateforme de coaching et mastermind par abonnement au service d\'une communauté de 400+ professionnels de l\'immobilier.',
      ba_b2: "Rôle de responsable technologique, pilotant le développement de la plateforme, les intégrations IA, les stratégies marketing et les workflows d'automatisation. Offrant une vaste gamme de services et interactions IA aux membres et clients.",
      ba_b3: "Conception et animation de formations pour les agents immobiliers sur l'utilisation de l'IA pour améliorer et optimiser leur pratique.",
      ba_b4: "Mise en place de systèmes d'automatisation et de segmentation pour améliorer le ciblage client et l'expérience des membres.",
      bf_title: 'Courtier Immobilier Agréé & Conseiller Immobilier',
      bf_company: 'BeachFront Realty – Sud de la Floride, USA | 2009 – Présent',
      bf_b1: 'Spécialisé dans le développement de relations à long terme sur des marchés géographiques ciblés pour capter des opportunités de mise en vente régulières.',
      bf_b2: "Travail dans l'immobilier résidentiel et commercial, y compris les transactions pour des propriétés d'investissement, des espaces commerciaux et des développements mixtes.",
      bf_b3: "Collaboration avec des promoteurs sur l'acquisition de terrains, l'obtention de permis de lotissement et l'approbation de plans de construction en Floride.",
      bf_b4: 'Spécialisé dans les nouvelles constructions haut de gamme et les condos en bord de mer pour des clients américains et internationaux.',
      bf_b5: "Application de l'analyse prédictive, de l'IA et des outils CRM avancés pour générer des leads et structurer des parcours de vente personnalisés.",
      bf_b6: 'Développement de campagnes digitales de marque pour attirer une clientèle aisée.',
      bs_title: 'Fondateur & PDG',
      bs_company: 'BeachStore.com – USA | 1999 – 2020',
      bs_b1: "Lancement et mise à l'échelle d'une marque e-commerce direct-to-consumer en une entreprise multi-millionnaire.",
      bs_b2: "Croissance de l'entreprise à 3 millions de dollars de ventes saisonnières par été, avec des ventes totales dépassant 30 millions de dollars sur une période de 15 ans.",
      bs_b3: "Première entreprise e-commerce à vendre des chaises de plage en ligne ; précurseur et leader du marché dans cette catégorie pendant plus de 15 ans.",
      bs_b4: "Direction de toute la publicité digitale (SEO, PPC et Médias Sociaux), création de contenu, email marketing, achats, conception et développement de produits, logistique, opérations et gestion des entrepôts.",
      bs_b5: "Construction et positionnement d'une marque de style de vie dans l'espace loisirs et récréation, combinant des insights saisonniers avec des stratégies d'engagement digital pour stimuler la croissance et la visibilité.",
      bk_title: 'Chargé de Clientèle Bancaire International',
      bk_company: 'Republic National Bank (puis HSBC) – New York, NY | 1991 – 2003',
      bk_b1: "Gestion de comptes bancaires internationaux et direction d'intégrations de systèmes à grande échelle.",
      bk_b2: 'Direction du projet de conformité Y2K impliquant 3 400+ applications et 400 consultants.',
      bk_b3: "Développement de processus d'intelligence économique pour l'analyse financière, l'évaluation des risques et les prévisions opérationnelles.",
      bk_b4: "Acquisition d'une expérience en opérations financières qui a ensuite soutenu la diligence raisonnable et la structuration d'investissements immobiliers.",
      bnb_title: 'Directeur, Summer House Bed & Breakfast',
      bnb_company: "Entreprise d'Hôtellerie Privée – New York, USA | Étés, 1993–2003",
      bnb_b1: "Gestion des ventes saisonnières et des opérations de chambres d'hôtes autogérées à Fire Island et dans les Hamptons pendant plus d'une décennie.",
      bnb_b2: "Acquisition et exploitation de lieux saisonniers stratégiques ; gestion de tous les aspects des ventes et services aux clients, incluant les enregistrements, l'entretien, la restauration, les programmes récréatifs et les activités et expériences d'hôtellerie sur mesure.",
      bnb_b3: 'Développement de stratégies marketing par le bouche-à-oreille et les offices de tourisme locaux pour attirer des clients fidèles et nouveaux.',
      bnb_b4: "Acquisition de connaissances pratiques en prestation de services d'hôtellerie et en satisfaction client qui ont ensuite orienté les ventures professionnelles hôtelières et de location courte durée.",
      eduHeading: 'Formation',
      eduDegree: 'BBA – Banque & Finance',
      eduSchool: 'Université Adelphi – NY, USA | 1991',
      eduDetails: "Liste d'Honneur | Cours : Finance, Banque Internationale, Comptabilité, Marketing, Analyse d'Investissement",
      techHeading: 'Stack Technologique',
      langHeading: 'Langues',
      langFluent: 'Anglais, Français & Hébreu (Langue Maternelle Courante)',
      langLearning: 'Portugais & Espagnol (En Apprentissage)',
      goalsHeading: 'Objectifs Professionnels',
      goalsText: "À la recherche d'opportunités de leadership dans l'immobilier, l'hôtellerie ou la gestion d'actifs où l'innovation, la technologie et l'exécution stratégique peuvent créer de la croissance et de la valeur.",
      affHeading: 'Groupes & Affiliations',
      aff_1: 'REIGNation Real Estate Community – Fondateur & Membre',
      aff_2: 'MED Condo Board – Président',
      aff_3: 'American Club of Lisbon – Membre Actif',
      aff_4: 'International Portuguese Club – Membre Actif',
      aff_5: 'AEPi Alumni Association – Membre Actif',
      aff_6: 'Adelphi University Alumni Association – Membre Actif',
      aff_7: 'Miami Realtor® Association – Membre Actif',
      aff_8: 'National Association of REALTORS (NAR) – Membre',
      aff_9: "DiSi Credito, Playa Beach Company, CenterStage, Mountain Breeze, AdvanceFigures, & Dave T Productions – Conseil Consultatif/d'Administration.",
      aff_10: 'New York Road Runners (NYRR) – Membre',
      intHeading: "Centres d'Intérêt",
      intP1: 'Passionné des actualités mondiales et des affaires courantes, avec un fort intérêt pour les marchés financiers, la politique, l\'immobilier, l\'économie, l\'IA, la blockchain, l\'informatique quantique, les énergies renouvelables, la biotechnologie et la robotique. Passionné de l\'espace, des sciences, de la physique quantique et des technologies émergentes.',
      intP2: 'Un bon vivant heureux passionné par la cuisine mondiale et la cuisine maison, avec un mode de vie actif (course à pied, randonnée, golf, cyclisme, tennis, fitness), les voyages fréquents, l\'exploration culturelle et l\'engagement communautaire.',
      download: 'Télécharger PDF',
      experience: 'Expérience',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      present: "Aujourd'hui"
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
  },

  pt: {
    // Navigation
    nav: {
      home: 'Início',
      blog: 'Blog',
      resume: 'Currículo',
      contact: 'Contacto'
    },

    // Homepage Hero
    hero: {
      greeting: 'Olá, sou Eytan Benzeno',
      subtitle: 'Tecnólogo | Operador | Corretor Imobiliário | Pioneiro do E-commerce | Especialista em IA & Marketing',
      experience: '20+ anos de experiência em E-commerce e Imobiliário | Especialista em IA, Logística e Serviço ao Cliente'
    },

    // Blog Page
    blog: {
      title: 'O Blog do Eytan',
      subtitle: "Bem-vindo ao Meu Cantinho da Internet\nSou o Eytan e fico feliz por estar aqui. É aqui que partilho ideias, experiências e reflexões da minha jornada através da tecnologia, negócios e vida. Sente-se, pegue num café e explore.",
      allPosts: 'Todos os Artigos',
      readMore: 'Ler Mais',
      minuteRead: 'min de leitura',
      publishedOn: 'Publicado em',
      by: 'por',
      loading: 'A carregar artigos...',
      noPosts: 'Nenhum artigo encontrado',
      tags: 'Etiquetas'
    },

    // Blog Post
    post: {
      shareOn: 'Partilhar em',
      relatedPosts: 'Mais Artigos',
      backToBlog: '← Voltar ao Blog',
      publishedOn: 'Publicado em',
      readTime: 'min de leitura'
    },

    // Contact Page
    contact: {
      title: 'Entre em Contacto',
      subtitle: 'Adoraria ter notícias suas. Envie-me uma mensagem e responderei o mais breve possível.',
      scheduleTitle: 'Agendar uma Reunião',
      scheduleText: 'Quer discutir o seu projeto, explorar oportunidades ou simplesmente conversar? Reserve um horário conveniente para uma reunião comigo.',
      bookMeeting: 'Agendar uma Reunião com Eytan',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      subject: 'Assunto',
      message: 'Mensagem',
      send: 'Enviar Mensagem',
      sending: 'A enviar...',
      success: 'Mensagem enviada com sucesso!',
      error: 'Falha ao enviar a mensagem. Por favor, tente novamente.',
      phoneLabel: 'Telefone',
      whatsappLabel: 'WhatsApp',
      whatsappLink: 'Mensagem no WhatsApp',
      socialLinks: 'Redes Sociais',
      qrTitle: 'Ligação Rápida',
      qrSubtitle: 'Digitalize este código QR para guardar os meus dados de contacto',
      qrInstructions: 'Aponte a câmara para o código',
      downloadVCard: 'Descarregar Cartão de Contacto'
    },

    // Resume Page
    resume: {
      title: 'Currículo',
      heading: 'Currículo',
      downloadBtn: 'Descarregar CV em PDF',
      modalTitle: 'Escolha a sua versão',
      modalSubtitle: 'Selecione o formato que melhor se adequa às suas necessidades',
      modernTitle: 'Moderno · Curto',
      modernDesc: 'Layout executivo de 1 página. Limpo, visual, otimizado para leitura rápida.',
      downloadModern: 'Descarregar Moderno',
      classicTitle: 'Clássico · Longo',
      classicDesc: 'Historial completo de carreira. Detalhado e abrangente para candidaturas formais.',
      downloadClassic: 'Descarregar Clássico',
      headerLocationsLabel: 'Localizações:',
      headerLocations: 'Lisboa, Luxemburgo, Miami',
      headerTitle: 'Tecnólogo, Operador, Marketeer',
      headerLicense1: 'Corretor Imobiliário Licenciado na Flórida,',
      headerLicense2: 'Mediador Imobiliário Licenciado IMI (Portugal)',
      summaryHeading: 'Resumo Profissional',
      summaryText: 'Operador sénior com mais de 20 anos de experiência em imobiliário, tecnologia, operações, gestão de ativos, e-commerce e banca. Sucesso comprovado na expansão e reposicionamento de empreendimentos—desde o desenvolvimento de negócios de e-commerce multimilionários até ao aconselhamento em investimentos imobiliários e gestão de portfólios de hospitalidade de alto desempenho. Especialista em estabilizar a execução, gerir riscos de entrega e garantir que ativos e projetos de elevado valor funcionem de forma fiável em condições reais. Altamente proficiente em inteligência artificial, tecnologia empresarial, marketing digital, geração de leads e experiência do cliente, utilizando ferramentas modernas para impulsionar a eficiência e o crescimento. Ativo em Portugal, Luxemburgo e Estados Unidos, focado na execução operacional, estratégias de vendas, tecnologias emergentes e investimentos transfronteiriços. Traz liderança ágil, fortes competências de negociação e celebração de negócios, e uma mentalidade orientada para resultados a organizações com visão de futuro.',
      competenceHeading: 'Competências Principais',
      competenceText: 'Operações • Gestão de Projetos • E-commerce • Inteligência Artificial • Estratégia Empresarial • Estratégia de Marketing • Publicidade Digital • Redes Sociais • Liderança de Equipa • Investimento Imobiliário • Estruturação de Negócios • Otimização de Ativos • Aquisição e Gestão de Propriedades • Hospitalidade • Vendas • Tecnologia',
      experienceHeading: 'Experiência Profissional',
      sh_title: 'Fundador & Sócio',
      sh_company: 'SoldHere, LDA – Lisboa, Portugal | Março 2023 – Presente',
      sh_b1: 'Licenciado pelo IMI para mediar transações imobiliárias em Portugal.',
      sh_b2: 'Colaboração com promotores em aquisição de terrenos, licenciamento de loteamentos e aprovação de planos de construção em Portugal.',
      sh_b3: 'Gestão de aquisição, vendas, reposicionamento, licenciamento e estratégia de arrendamento de curta duração para propriedades de alto rendimento em Portugal.',
      sh_b4: 'Utilização de IA e ferramentas digitais para segmentação de clientes, automação e otimização operacional.',
      sh_b5: 'Supervisão do ciclo de vida operacional completo, incluindo licenciamento AL, experiência do hóspede e análise de desempenho.',
      ba_title: 'Co-Fundador & Parceiro Tecnológico',
      ba_company: 'Bogen.ai / REIGNation Mastermind – Remoto/EUA | Maio 2023 – Presente',
      ba_b1: 'Construção de uma plataforma de coaching e mastermind por subscrição ao serviço de uma comunidade de 400+ profissionais imobiliários.',
      ba_b2: 'Função de responsável tecnológico, liderando o desenvolvimento da plataforma, integrações de IA, estratégias de marketing e fluxos de trabalho de automação. Fornecendo uma vasta gama de serviços e interações de IA a membros e clientes.',
      ba_b3: 'Conceção e liderança de formações para agentes imobiliários sobre o uso de IA para melhorar e otimizar a sua prática imobiliária.',
      ba_b4: 'Implementação de sistemas de automação e segmentação para melhorar a segmentação de clientes e a experiência dos membros.',
      bf_title: 'Corretor Imobiliário Licenciado & Consultor Imobiliário',
      bf_company: 'BeachFront Realty – Sul da Flórida, EUA | 2009 – Presente',
      bf_b1: 'Especialização em farming imobiliário, desenvolvendo relações de longo prazo em mercados geográficos alvo para captar oportunidades consistentes de listagem.',
      bf_b2: 'Trabalho em imobiliário residencial e comercial, incluindo transações de propriedades de investimento, espaços de retalho e desenvolvimentos de uso misto.',
      bf_b3: 'Colaboração com promotores em aquisição de terrenos, licenciamento de loteamentos e aprovação de planos de construção na Flórida.',
      bf_b4: 'Especialização em novas construções de luxo e condomínios frente ao mar para clientes americanos e internacionais.',
      bf_b5: 'Aplicação de análise preditiva, IA e ferramentas CRM avançadas para gerar leads e estruturar percursos de vendas personalizados.',
      bf_b6: 'Desenvolvimento de campanhas digitais de marca para captar clientela abastada.',
      bs_title: 'Fundador & CEO',
      bs_company: 'BeachStore.com – EUA | 1999 – 2020',
      bs_b1: 'Lançamento e escala de uma marca de e-commerce direto ao consumidor num negócio multimilionário.',
      bs_b2: 'Crescimento do negócio para 3 milhões de dólares em vendas sazonais por verão, com vendas totais a ultrapassar 30 milhões de dólares ao longo de 15 anos.',
      bs_b3: 'Primeiro negócio de e-commerce a vender cadeiras de praia online; pioneiro e líder de mercado na categoria durante mais de 15 anos.',
      bs_b4: 'Direção de toda a publicidade digital (SEO, PPC e Redes Sociais), criação de conteúdo, email marketing, compras, conceção e desenvolvimento de produtos, logística, operações e armazenamento.',
      bs_b5: 'Construção e posicionamento de uma marca de estilo de vida no espaço de lazer e recreação, combinando insights sazonais de mercado com estratégias de envolvimento digital para impulsionar o crescimento e a visibilidade.',
      bk_title: 'Oficial de Banca Internacional',
      bk_company: 'Republic National Bank (posteriormente HSBC) – Nova Iorque, NY | 1991 – 2003',
      bk_b1: 'Gestão de contas bancárias internacionais e liderança de integrações de sistemas de grande escala.',
      bk_b2: 'Direção do projeto de conformidade Y2K envolvendo 3.400+ aplicações e 400 consultores.',
      bk_b3: 'Desenvolvimento de processos de inteligência empresarial para análise financeira, avaliação de riscos e previsão operacional.',
      bk_b4: 'Aquisição de experiência em operações financeiras que posteriormente apoiou a due diligence e estruturação de investimentos imobiliários.',
      bnb_title: 'Gerente, Summer House Bed & Breakfast',
      bnb_company: 'Negócio Privado de Hospitalidade – Nova Iorque, EUA | Verões, 1993–2003',
      bnb_b1: 'Gestão de vendas sazonais e operações de propriedades de bed and breakfast autogeridas em Fire Island e nos Hamptons durante mais de uma década.',
      bnb_b2: 'Aquisição e exploração de locais sazonais estratégicos; gestão de todos os aspetos de vendas e serviços ao hóspede, incluindo check-ins, limpeza, serviço de refeições, programação recreativa e atividades e experiências de hospitalidade personalizadas.',
      bnb_b3: 'Desenvolvimento de estratégias de marketing através do boca-a-boca e de juntas de turismo locais para atrair clientela fiel e nova.',
      bnb_b4: 'Aquisição de conhecimento prático em prestação de serviços de hospitalidade e satisfação do hóspede que posteriormente informou empreendimentos profissionais hoteleiros e de arrendamento de curta duração.',
      eduHeading: 'Formação',
      eduDegree: 'BBA – Banca & Finanças',
      eduSchool: 'Universidade Adelphi – NY, EUA | 1991',
      eduDetails: 'Lista de Honra | Disciplinas: Finanças, Banca Internacional, Contabilidade, Marketing, Análise de Investimentos',
      techHeading: 'Stack Tecnológico',
      langHeading: 'Idiomas',
      langFluent: 'Inglês, Francês & Hebraico (Fluente Nativo)',
      langLearning: 'Português & Espanhol (A Aprender)',
      goalsHeading: 'Objetivos Profissionais',
      goalsText: 'À procura de oportunidades de liderança em imobiliário, hospitalidade ou gestão de ativos onde a inovação, a tecnologia e a execução estratégica possam impulsionar o crescimento e a criação de valor.',
      affHeading: 'Grupos & Afiliações',
      aff_1: 'REIGNation Real Estate Community – Fundador & Membro',
      aff_2: 'MED Condo Board – Presidente',
      aff_3: 'American Club of Lisbon – Membro Ativo',
      aff_4: 'International Portuguese Club – Membro Ativo',
      aff_5: 'AEPi Alumni Association – Membro Ativo',
      aff_6: 'Adelphi University Alumni Association – Membro Ativo',
      aff_7: 'Miami Realtor® Association – Membro Ativo',
      aff_8: 'National Association of REALTORS (NAR) – Membro',
      aff_9: 'DiSi Credito, Playa Beach Company, CenterStage, Mountain Breeze, AdvanceFigures, & Dave T Productions – Conselho Consultivo/de Administração.',
      aff_10: 'New York Road Runners (NYRR) – Membro',
      intHeading: 'Interesses Pessoais',
      intP1: 'Seguidor ávido das notícias e assuntos mundiais, com forte foco nos mercados financeiros, política, imobiliário, economia, IA, blockchain, computação quântica, energias renováveis, biotecnologia e robótica. Entusiasta do espaço, ciência, física quântica e tecnologias emergentes.',
      intP2: 'Um bon vivant feliz apaixonado pela cozinha global e culinária caseira, com um estilo de vida ativo (corrida, caminhadas, golfe, ciclismo, ténis, fitness), viagens frequentes, exploração cultural e envolvimento comunitário.',
      download: 'Descarregar PDF',
      experience: 'Experiência',
      education: 'Formação',
      skills: 'Competências',
      languages: 'Idiomas',
      present: 'Presente'
    },

    // Footer
    footer: {
      rights: 'Todos os direitos reservados',
      builtWith: 'Criado com'
    },

    // About Section
    about: {
      title: 'Sobre Mim',
      intro: "Sou um empreendedor e consultor com um portfólio diversificado que abrange e-commerce, imobiliário, tecnologia e desenvolvimento pessoal. Com mais de 20 anos de experiência pioneira, a minha combinação única de especialização permite-me ajudar indivíduos e empresas a crescer em múltiplas dimensões.",
      realEstateTitle: '🏡 Imobiliário',
      realEstateText: "Como corretor licenciado no sul da Flórida e Fundador e Sócio-Gerente da SoldHere, LDA em Portugal, ajudo clientes a navegar em transações imobiliárias internacionais em dois mercados vibrantes. Com experiência em gestão de propriedades e arrendamentos de curta duração, forneço serviços imobiliários completos desde a aquisição até às operações. Quer esteja a investir no ensolarado sul da Flórida através do SoldHere.com ou a explorar oportunidades no belo Portugal via SoldHere.pt, trago experiência local e perspetiva global.",
      aiMarketingTitle: '🤖 IA e Marketing',
      aiMarketingText: "Como Sócio-Gerente e Estratega-Chefe de Transformação de IA na Bogen.ai, forneço consultoria de ponta em marketing e integração de IA. Ajudo empresas a aproveitar a inteligência artificial para otimizar as suas estratégias de marketing, automatizar processos e manter-se à frente num mercado cada vez mais orientado pela tecnologia.",
      ecommerceTitle: '🛒 Pioneiro do E-commerce',
      ecommerceText: "Com mais de 20 anos de experiência em e-commerce, estive na vanguarda da evolução do retalho online. Como especialista em e-commerce, trago profunda experiência em operações, gestão logística, excelência no serviço ao cliente e construção de negócios online escaláveis. Desde os primeiros dias do comércio online até às plataformas sofisticadas de hoje, ajudei inúmeras empresas a otimizar as suas operações e a proporcionar experiências excecionais aos clientes.",
      coachingTitle: '💡 Coaching e Mastermind',
      coachingText: "Como parceiro e gestor na Reignation.com, facilito experiências de coaching transformadoras e grupos mastermind. Sou apaixonado por ajudar líderes e empreendedores a desbloquear o seu potencial e alcançar resultados excecionais.",
      viewResume: 'Ver Currículo',
      readBlog: 'Ler Blog'
    },

    // Common
    common: {
      readMore: 'Ler Mais',
      learnMore: 'Saber Mais',
      viewMore: 'Ver Mais',
      close: 'Fechar',
      cancel: 'Cancelar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar'
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

    // Store language preference
    localStorage.setItem('language', lang);

    // Check if we're on a blog post page and need to redirect
    const path = window.location.pathname;
    const blogPostRedirect = this.getBlogPostRedirectUrl(path, lang);

    if (blogPostRedirect) {
      // Redirect to the language-specific blog post
      window.location.href = blogPostRedirect;
      return;
    }

    // Not a blog post page, just update translations in place
    this.currentLanguage = lang;
    document.documentElement.lang = lang;

    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

    // Update all translatable elements
    this.updatePageTranslations();
  }

  // Get redirect URL for blog posts when switching language
  getBlogPostRedirectUrl(path, targetLang) {
    // Check if this is a blog post page (not blog.html listing)
    // Patterns: /blog/slug.html, /blog/fr/slug.html, /blog/pt/slug.html
    const blogPostPattern = /^\/blog\/(fr\/|pt\/)?([^\/]+)\.html$/;
    const match = path.match(blogPostPattern);

    if (!match) {
      return null; // Not a blog post page
    }

    const currentLangPrefix = match[1] || ''; // 'fr/', 'pt/', or ''
    const slug = match[2]; // The post slug

    // Don't redirect if already on the correct language version
    const currentLang = currentLangPrefix === 'fr/' ? 'fr' : (currentLangPrefix === 'pt/' ? 'pt' : 'en');
    if (currentLang === targetLang) {
      return null;
    }

    // Build the new URL
    let newPath;
    if (targetLang === 'en') {
      newPath = `/blog/${slug}.html`;
    } else {
      newPath = `/blog/${targetLang}/${slug}.html`;
    }

    return newPath;
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

    // Update resume PDF download link
    this.updateResumePdfLink();

    // Update blog post links for language
    this.updateBlogPostLinks();

    // Update language switcher active state
    this.updateLanguageSwitcher();
  }

  // Update resume PDF download links based on language
  updateResumePdfLink() {
    const modernLink = document.getElementById('resume-modern-link');
    const classicLink = document.getElementById('resume-classic-link');
    const modernMap = {
      en: 'Eytan-Benzeno-Resume-EN-Modern.pdf',
      fr: 'Eytan-Benzeno-Resume-FR-Modern.pdf',
      pt: 'Eytan-Benzeno-Resume-PT-Modern.pdf'
    };
    const classicMap = {
      en: 'Eytan-Benzeno-Resume.pdf',
      fr: 'Eytan-Benzeno-Resume-FR.pdf',
      pt: 'Eytan-Benzeno-Resume-PT.pdf'
    };
    if (modernLink) modernLink.href = modernMap[this.currentLanguage] || modernMap.en;
    if (classicLink) classicLink.href = classicMap[this.currentLanguage] || classicMap.en;
  }

  // Update blog post links based on language
  updateBlogPostLinks() {
    const lang = this.currentLanguage;

    // Update links on blog listing page
    const blogCards = document.querySelectorAll('.blog-card[data-slug]');
    blogCards.forEach(card => {
      const slug = card.getAttribute('data-slug');

      // Update href based on language
      if (lang === 'fr') {
        card.setAttribute('href', `blog/fr/${slug}.html`);
      } else if (lang === 'pt') {
        card.setAttribute('href', `blog/pt/${slug}.html`);
      } else {
        card.setAttribute('href', `blog/${slug}.html`);
      }
    });
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
