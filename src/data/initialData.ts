import { AdminProfile, NewsArticle, MeetingItem } from '../types';

export const INITIAL_ADMIN_PROFILES: AdminProfile[] = [
  {
    id: 'admin-1',
    name: 'El Hadji Ousmane Diallo',
    role: 'Président de l’ADMDO',
    email: 'president.admdo@gmail.com',
    phone: '+221 77 000 11 22',
    badge: 'Présidence',
  },
  {
    id: 'admin-2',
    name: 'Mariama Cissé',
    role: 'Secrétaire Générale',
    email: 'secretariat.admdo@gmail.com',
    phone: '+221 77 111 22 33',
    badge: 'Secrétariat',
  },
  {
    id: 'admin-3',
    name: 'Ibrahima Sow',
    role: 'Chargé de Communication & Diaspora',
    email: 'communication.admdo@gmail.com',
    phone: '+33 6 00 11 22 33',
    badge: 'Communication',
  },
  {
    id: 'admin-4',
    name: 'Amadou Ba',
    role: 'Trésorier Général',
    email: 'tresorerie.admdo@gmail.com',
    phone: '+221 77 222 33 44',
    badge: 'Finances',
  },
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Installation et raccordement solaire du forage principal de Medina Diakha Wouly',
    category: 'Eau & Forage',
    summary:
      'Les panneaux photovoltaïques et la nouvelle pompe immergée fonctionnent désormais à plein régime, assurant un débit d’eau potable continu pour tout le village.',
    content:
      'Grâce aux cotisations solidaires des résidents et à la mobilisation exemplaire de la diaspora en Europe et à Dakar, les travaux de modernisation du forage principal sont achevés. Le système solaire permet de réduire les coûts de carburant et de sécuriser l’approvisionnement en eau pour les foyers et les abreuvoirs du cheptel. Un comité de veille local a été mis en place pour le suivi technique.',
    publishedAt: '12 Septembre 2026',
    authorName: 'El Hadji Ousmane Diallo',
    authorRole: 'Président de l’ADMDO',
    isPinned: true,
  },
  {
    id: 'news-2',
    title: 'Distribution de 180 kits scolaires complets pour les élèves de l’école primaire',
    category: 'Éducation',
    summary:
      'Cahiers, stylos, trousses et manuels scolaires ont été remis à tous les enfants inscrits au cycle élémentaire de Medina Diakha Wouly.',
    content:
      'À l’occasion de la rentrée des classes, l’ADMDO a organisé une journée citoyenne de distribution de fournitures scolaires pour soutenir les familles et encourager l’excellence des élèves. Un accent particulier a été mis sur le maintien des jeunes filles à l’école jusqu’au cycle secondaire.',
    publishedAt: '05 Septembre 2026',
    authorName: 'Mariama Cissé',
    authorRole: 'Secrétaire Générale',
    isPinned: false,
  },
  {
    id: 'news-3',
    title: 'Réapprovisionnement de la case de santé en médicaments de première urgence',
    category: 'Santé',
    summary:
      'L’association a réceptionné et transmis au responsable de santé du village un stock d’antiseptiques, antalgiques et pansements d’urgence.',
    content:
      'Pour éviter les ruptures de stocks saisonnières lors de l’hivernage, une dotation en produits médicaux essentiels a été acheminée. L’association continue de négocier avec les autorités sanitaires régionales pour des visites médicales itinérantes.',
    publishedAt: '28 Août 2026',
    authorName: 'Amadou Ba',
    authorRole: 'Trésorier Général',
    isPinned: false,
  },
  {
    id: 'news-4',
    title: 'Lancement du périmètre maraîcher communautaire des femmes de Medina Diakha Wouly',
    category: 'Vie Associative',
    summary:
      'Aménagement de parcelles avec clôture grillagée et semences certifiées pour diversifier les revenus des groupements féminins.',
    content:
      'Le projet agro-pastoral franchit une nouvelle étape : les femmes du village disposent désormais d’un espace sécurisé avec point d’eau pour la culture maraîchère (oignon, piment, gombo). Ce projet favorise l’autosuffisance alimentaire des foyers.',
    publishedAt: '15 Août 2026',
    authorName: 'Ibrahima Sow',
    authorRole: 'Communication & Diaspora',
    isPinned: false,
  },
];

export const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: 'meet-1',
    title: 'Assemblée Générale Annuelle de l’ADMDO 2026',
    date: 'Dimanche 27 Septembre 2026',
    time: '15h30 GMT',
    location: 'Place publique du village & En visioconférence (WhatsApp / Google Meet)',
    organizerName: 'El Hadji Ousmane Diallo',
    organizerRole: 'Président',
    targetAudience: 'Tous les ressortissants, résidents et sympathisants',
    agenda:
      '1. Bilan moral et d’activités 2025-2026\n2. Rapport financier détaillé et état des cotisations\n3. Vote des priorités de l’année (deuxième forage et toitures des classes)\n4. Questions diverses et parole aux membres de la diaspora',
    status: 'upcoming',
  },
  {
    id: 'meet-2',
    title: 'Réunion technique : Suivi et entretien du réseau d’eau',
    date: 'Samedi 03 Octobre 2026',
    time: '10h00 GMT',
    location: 'Case communautaire de Medina Diakha Wouly',
    organizerName: 'Mariama Cissé',
    organizerRole: 'Secrétaire Générale',
    targetAudience: 'Comité de gestion du forage et chefs de quartiers',
    agenda:
      '1. État des lieux des canalisations et compteurs\n2. Fixation des plannings de relève et réserve de pièces détachées\n3. Hygiène autour des bornes-fontaines',
    status: 'upcoming',
  },
  {
    id: 'meet-3',
    title: 'Rencontre mensuelle de la Diaspora ADMDO',
    date: 'Dimanche 11 Octobre 2026',
    time: '18h00 GMT (20h00 heure de Paris)',
    location: 'Lien visio en direct (transmis aux inscrits)',
    organizerName: 'Ibrahima Sow',
    organizerRole: 'Chargé de Communication',
    targetAudience: 'Ressortissants en France, Espagne, Italie, USA, Gabon, etc.',
    agenda:
      '1. Point d’étape sur les dons et transferts solidaires\n2. Préparation du Forum des compétences pour la jeunesse du village\n3. Accueil des nouveaux adhérents',
    status: 'upcoming',
  },
];

export const INITIAL_VIDEOS: import('../types').HomeVideo[] = [
  {
    id: 'vid-1',
    title: 'Immersion à Medina Diakha Wouly : Travaux et Vie Communautaire',
    description: 'Découvrez en vidéo les récentes réalisations du village, l’inauguration de la pompe solaire du forage et les témoignages des aînés et des femmes maraîchères.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Can be replaced or updated in admin
    publishedAt: '08 Septembre 2026',
    isActive: true,
  },
  {
    id: 'vid-2',
    title: 'Message du Bureau de l’ADMDO aux Ressortissants et Partenaires',
    description: 'Allocution officielle du Président et du bureau exécutif appelant à la mobilisation pour les toitures des salles de classe et le dispensaire.',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    publishedAt: '01 Septembre 2026',
    isActive: true,
  },
];

export const INITIAL_CUSTOM_SECTIONS: import('../types').CustomSection[] = [
  {
    id: 'sec-1',
    slug: 'forage-solaire',
    title: 'Le Grand Défi de l’Eau : Notre Forage Solaire',
    subtitle: 'Une autonomie en eau potable garantie 24h/24 pour toutes les familles',
    content: `L'accès à une eau saine a toujours été la priorité absolue de l'ADMDO. Medina Diakha Wouly a franchi une étape historique grâce au passage à l'énergie solaire. 

Les points clés du projet :
- Installation de 24 panneaux photovoltaïques à haut rendement
- Remplacement du groupe électrogène thermique par une pompe solaire hybride
- Zéro émission de CO2 et économie mensuelle de plus de 350 000 FCFA de carburant
- 6 bornes-fontaines réparties équitablement dans les quartiers du village
- Abreuvoir extérieur dédié au cheptel pour préserver l'hygiène des points d'eau humaine

Ce modèle de gestion communautaire est suivi quotidiennement par le comité villageois désigné en assemblée générale.`,
    category: 'Eau & Énergie',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Soutenir les extensions d’eau',
    buttonUrl: '#donations',
    isPublished: true,
    order: 1,
  },
  {
    id: 'sec-2',
    slug: 'ecole-reussite',
    title: 'Éducation & Jeunesse : L’Avenir de Medina Diakha Wouly',
    subtitle: 'Offrir à chaque enfant du village les moyens de réussir et de poursuivre ses études',
    content: `L'école primaire de Medina Diakha Wouly accueille plus de 180 élèves chaque année. Notre mission est d'éliminer toutes les barrières matérielles qui empêchent les enfants, et tout particulièrement les jeunes filles, d'aller jusqu'au bout de leur scolarité.

Actions menées par l'association :
- Dotation complète en fournitures (sacs, cahiers, stylos, livres)
- Prime d'encouragement aux meilleurs élèves des examens de passage
- Réparation des tables-bancs et toitures avant la saison des pluies
- Aménagement d'un coin bibliothèque pour stimuler l'apprentissage de la lecture`,
    category: 'Éducation & Avenir',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Parrainer un écolier',
    buttonUrl: '#donations',
    isPublished: true,
    order: 2,
  },
  {
    id: 'sec-3',
    slug: 'maraichage-femmes',
    title: 'Périmètre Maraîcher Communautaire des Femmes',
    subtitle: 'Autonomie financière féminine et autosuffisance alimentaire',
    content: `Regroupées au sein du groupement d’intérêt économique féminin du village, plus de 60 femmes cultivent désormais un hectare aménagé et sécurisé.

Ce périmètre permet :
- La récolte continue d'oignons, de gombos, de tomates, d'aubergines et de piments
- L'enrichissement de l'alimentation des enfants et des familles
- Des revenus propres pour les femmes réinvestis dans la santé et la scolarisation
- L'utilisation de techniques agroécologiques respectueuses des sols`,
    category: 'Agriculture & Femmes',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Découvrir nos actions',
    buttonUrl: '#contact',
    isPublished: true,
    order: 3,
  },
];

export const INITIAL_DONATION_BUTTONS: import('../types').DonationButtonConfig[] = [
  {
    id: 'don-1',
    label: 'Faire un Don via Wave / Orange Money',
    url: 'https://wave.com', // External URL can be updated to specific payment link by admin
    description: 'Transfert direct sécurisé pour les résidents au Sénégal et dans la sous-région (+221 77 000 11 22).',
    badge: 'Mobile Money Sénégal',
    platformName: 'Wave / Orange Money',
    iconType: 'wallet',
    isActive: true,
    isPrimary: true,
  },
  {
    id: 'don-2',
    label: 'Cagnotte Solidaire Diaspora (Carte bancaire / PayPal)',
    url: 'https://www.gofundme.com', // Or Leetchi / HelloAsso / PayPal
    description: 'Idéal pour la diaspora en France, Europe, États-Unis et partout dans le monde.',
    badge: 'Carte bancaire & PayPal',
    platformName: 'Cagnotte en Ligne',
    iconType: 'globe',
    isActive: true,
    isPrimary: false,
  },
  {
    id: 'don-3',
    label: 'Virement Bancaire Officiel ADMDO',
    url: 'mailto:admdo.association@gmail.com?subject=Demande%20du%20RIB%20officiel%20ADMDO',
    description: 'Demandez le Relevé d’Identité Bancaire (RIB/IBAN) officiel pour les virements de partenaires ou mécènes.',
    badge: 'Compte Bancaire Dédié',
    platformName: 'RIB Bancaire',
    iconType: 'shield',
    isActive: true,
    isPrimary: false,
  },
];

export const INITIAL_DOCUMENTS: import('../types').PartnerDocument[] = [
  {
    id: 'doc-1',
    title: 'Statuts Officiels et Règlement Intérieur de l’ADMDO',
    description: 'Document officiel régissant les statuts, les objectifs de développement et l’organisation interne de l’association.',
    category: 'Statuts & Règlements',
    fileUrl: 'https://drive.google.com',
    format: 'PDF',
    fileSize: '1.4 Mo',
    publishedAt: 'Janvier 2026',
  },
  {
    id: 'doc-2',
    title: 'Rapport Financier Annuel et Bilan des Cotisations',
    description: 'Rapport certifié de la trésorerie générale détaillant les rentrées de fonds, cotisations diaspora et dépenses d’infrastructures.',
    category: 'Rapports Financiers',
    fileUrl: 'https://drive.google.com',
    format: 'PDF',
    fileSize: '2.1 Mo',
    publishedAt: 'Août 2026',
  },
  {
    id: 'doc-3',
    title: 'Fiche Technique & Dossier du Projet Forage et Eau Potable',
    description: 'Étude technique du forage solaire, dimensionnement du château d’eau et cartographie des 6 bornes-fontaines.',
    category: 'Dossiers Projets',
    fileUrl: 'https://drive.google.com',
    format: 'PDF',
    fileSize: '3.8 Mo',
    publishedAt: 'Mai 2026',
  },
  {
    id: 'doc-4',
    title: 'Convention Cadre de Partenariat & Mécénat Solidaire',
    description: 'Modèle de convention pour les ONG, fondations, partenaires institutionnels et mécènes souhaitant soutenir Medina Diakha Wouly.',
    category: 'Conventions & Partenariats',
    fileUrl: 'https://drive.google.com',
    format: 'DOCX',
    fileSize: '850 Ko',
    publishedAt: 'Février 2026',
  },
];

export const INITIAL_FOOTER_CONFIG: import('../types').FooterConfig = {
  email: 'admdo.association@gmail.com',
  phone: '+221 77 000 11 22',
  address: 'Medina Diakha Wouly, Arrondissement de Koussanar, Région de Tambacounda, Sénégal',
  description: 'L’Association pour le Développement de Medina Diakha Wouly (ADMDO) œuvre pour l’accès à l’eau potable, l’éducation, la santé et l’autonomisation économique des femmes.',
  whatsapp: '+221 77 000 11 22',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
  copyrightText: '© 2026 ADMDO - Association pour le Développement de Medina Diakha Wouly. Tous droits réservés.',
};

export const INITIAL_GALLERY_PHOTOS: import('../types').GalleryPhoto[] = [

  {
    id: 'gal-1',
    title: 'Panneaux solaires et château d’eau du village',
    description: 'Le forage principal alimenté à 100% par l’énergie solaire propre.',
    category: 'Forage & Eau',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    date: 'Septembre 2026',
  },
  {
    id: 'gal-2',
    title: 'Rentrée des classes à l’école primaire',
    description: 'Distribution solidaire des fournitures pour les élèves de tous les niveaux.',
    category: 'École',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    date: 'Septembre 2026',
  },
  {
    id: 'gal-3',
    title: 'Jardin maraîcher des femmes',
    description: 'Culture maraîchère communautaire en plein essor.',
    category: 'Maraîchage',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    date: 'Août 2026',
  },
  {
    id: 'gal-4',
    title: 'Place publique et assemblée villageoise',
    description: 'Rassemblement des ressortissants et habitants sous le grand arbre à palabres.',
    category: 'Village',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    date: 'Août 2026',
  },
  {
    id: 'gal-5',
    title: 'Case de santé et soins de proximité',
    description: 'Assurer une assistance médicale essentielle aux familles de Medina Diakha Wouly.',
    category: 'Santé',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    date: 'Juillet 2026',
  },
  {
    id: 'gal-6',
    title: 'Célébration associative et solidarité',
    description: 'Rencontre et cohésion sociale entre toutes les générations.',
    category: 'Événements',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    date: 'Juin 2026',
  },
];
