import React, { useState, useEffect } from 'react';
import {
  Droplets,
  BookOpen,
  HeartPulse,
  Users,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  Newspaper,
  Heart,
  Image,
  Layers,
  Video,
  Share2,
  ExternalLink,
  ArrowRight,
  Menu,
  X,
  FolderOpen,
  FileText,
  Database,
} from 'lucide-react';
import { SimpleContact } from './components/SimpleContact';
import { AdmdoLogo } from './components/AdmdoLogo';
import { NewsSection } from './components/NewsSection';
import { MeetingsSection } from './components/MeetingsSection';
import { AdminPortal } from './components/AdminPortal';
import { HomeVideoSection } from './components/HomeVideoSection';
import { DonationsPage } from './components/DonationsPage';
import { GalleryPage } from './components/GalleryPage';
import { DocumentsPage } from './components/DocumentsPage';
import { Footer } from './components/Footer';
import {
  CustomSectionsDirectory,
  SingleSectionPage,
} from './components/CustomSectionsView';
import { ShareButton } from './components/ShareButton';
import {
  INITIAL_ADMIN_PROFILES,
  INITIAL_NEWS,
  INITIAL_MEETINGS,
  INITIAL_VIDEOS,
  INITIAL_CUSTOM_SECTIONS,
  INITIAL_DONATION_BUTTONS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_DOCUMENTS,
  INITIAL_FOOTER_CONFIG,
} from './data/initialData';
import {
  NewsArticle,
  MeetingItem,
  AdminProfile,
  HomeVideo,
  CustomSection,
  DonationButtonConfig,
  GalleryPhoto,
  PartnerDocument,
  FooterConfig,
  ContactMessage,
} from './types';
import {
  subscribeVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  subscribeCustomSections,
  createCustomSection,
  updateCustomSection,
  deleteCustomSection,
  subscribeDonationButtons,
  createDonationButton,
  updateDonationButton,
  deleteDonationButton,
  subscribeNews,
  createNews,
  updateNews,
  deleteNews,
  subscribeMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  subscribeGallery,
  createGalleryPhoto,
  deleteGalleryPhoto,
  subscribeDocuments,
  createDocument,
  deleteDocument,
  subscribeFooterConfig,
  updateFooterConfig,
  subscribeContactMessages,
  createContactMessage,
  deleteContactMessage,
  clearAllContactMessages,
  seedFirestoreWithDefaults,
} from './lib/firestoreService';

interface MessageItem {
  name: string;
  contact: string;
  subject: string;
  message: string;
  date: string;
}

export default function App() {
  // Navigation Routing State
  // Possible views: 'accueil' | 'actualites' | 'reunions' | 'projets' | 'dons' | 'galerie' | 'sections' | 'section-detail' | 'contact'
  const [currentView, setCurrentView] = useState<string>('accueil');
  const [activeSectionSlug, setActiveSectionSlug] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistence data states backed by Firebase Firestore with offline fallbacks
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newsList, setNewsList] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [meetingsList, setMeetingsList] = useState<MeetingItem[]>(INITIAL_MEETINGS);
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>(INITIAL_ADMIN_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<AdminProfile>(INITIAL_ADMIN_PROFILES[0]);
  const [videos, setVideos] = useState<HomeVideo[]>(INITIAL_VIDEOS);
  const [customSections, setCustomSections] = useState<CustomSection[]>(INITIAL_CUSTOM_SECTIONS);
  const [donationButtons, setDonationButtons] = useState<DonationButtonConfig[]>(INITIAL_DONATION_BUTTONS);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [documents, setDocuments] = useState<PartnerDocument[]>(INITIAL_DOCUMENTS);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(INITIAL_FOOTER_CONFIG);

  // Admin Portal Modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(false);

  // Synchronize hash routing for direct page-by-page sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'accueil') {
        setCurrentView('accueil');
        setActiveSectionSlug(null);
      } else if (hash.startsWith('section/')) {
        const slug = hash.replace('section/', '');
        setActiveSectionSlug(slug);
        setCurrentView('section-detail');
      } else if (
        [
          'actualites',
          'reunions',
          'projets',
          'dons',
          'galerie',
          'sections',
          'documents',
          'contact',
        ].includes(hash)
      ) {
        setCurrentView(hash);
        setActiveSectionSlug(null);
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: string, slug?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (view === 'section-detail' && slug) {
      setActiveSectionSlug(slug);
      window.location.hash = `section/${slug}`;
    } else {
      setActiveSectionSlug(null);
      window.location.hash = view === 'accueil' ? '' : view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Subscribe to Firebase Firestore collections in real-time
  useEffect(() => {
    const unsubNews = subscribeNews((data) => {
      if (data && data.length > 0) setNewsList(data);
    });

    const unsubMeetings = subscribeMeetings((data) => {
      if (data && data.length > 0) setMeetingsList(data);
    });

    const unsubVideos = subscribeVideos((data) => {
      if (data && data.length > 0) setVideos(data);
    });

    const unsubSections = subscribeCustomSections((data) => {
      if (data && data.length > 0) setCustomSections(data);
    });

    const unsubDonations = subscribeDonationButtons((data) => {
      if (data && data.length > 0) setDonationButtons(data);
    });

    const unsubGallery = subscribeGallery((data) => {
      if (data && data.length > 0) setPhotos(data);
    });

    const unsubDocuments = subscribeDocuments((data) => {
      if (data && data.length > 0) setDocuments(data);
    });

    const unsubFooter = subscribeFooterConfig((cfg) => {
      if (cfg) setFooterConfig(cfg);
    });

    const unsubMessages = subscribeContactMessages((msgs) => {
      if (msgs) {
        setMessages(
          msgs.map((m) => ({
            name: m.name,
            contact: m.contact,
            subject: m.subject || '',
            message: m.message,
            date: m.date || m.createdAt || '',
          }))
        );
      }
    });

    return () => {
      unsubNews();
      unsubMeetings();
      unsubVideos();
      unsubSections();
      unsubDonations();
      unsubGallery();
      unsubDocuments();
      unsubFooter();
      unsubMessages();
    };
  }, []);

  // News Handlers (Firestore CRUD with immediate local state)
  const handleAddNews = async (newNewsData: Omit<NewsArticle, 'id'>) => {
    try {
      const item = await createNews(newNewsData);
      setNewsList((prev) => [item, ...prev]);
    } catch (e) {
      console.error('Error adding news:', e);
      const fallback: NewsArticle = { ...newNewsData, id: 'news-' + Date.now() };
      setNewsList((prev) => [fallback, ...prev]);
    }
  };

  const handleUpdateNews = async (id: string, partial: Partial<NewsArticle>) => {
    try {
      await updateNews(id, partial);
      setNewsList((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    } catch (e) {
      console.error('Error updating news:', e);
      setNewsList((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNews(id);
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error('Error deleting news:', e);
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Meeting Handlers (Firestore CRUD)
  const handleAddMeeting = async (newMeetData: Omit<MeetingItem, 'id'>) => {
    try {
      const item = await createMeeting(newMeetData);
      setMeetingsList((prev) => [item, ...prev]);
    } catch (e) {
      console.error('Error adding meeting:', e);
      const fallback: MeetingItem = { ...newMeetData, id: 'meet-' + Date.now() };
      setMeetingsList((prev) => [fallback, ...prev]);
    }
  };

  const handleUpdateMeeting = async (id: string, partial: Partial<MeetingItem>) => {
    try {
      await updateMeeting(id, partial);
      setMeetingsList((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    } catch (e) {
      console.error('Error updating meeting:', e);
      setMeetingsList((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
      setMeetingsList((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error('Error deleting meeting:', e);
      setMeetingsList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Video Handlers (Firestore CRUD)
  const handleAddVideo = async (vidData: Omit<HomeVideo, 'id'>) => {
    try {
      const item = await createVideo(vidData);
      setVideos((prev) => [item, ...prev]);
    } catch (e) {
      console.error('Error adding video:', e);
      const fallback: HomeVideo = { ...vidData, id: 'vid-' + Date.now() };
      setVideos((prev) => [fallback, ...prev]);
    }
  };

  const handleUpdateVideo = async (id: string, partial: Partial<HomeVideo>) => {
    try {
      await updateVideo(id, partial);
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...partial } : v)));
    } catch (e) {
      console.error('Error updating video:', e);
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...partial } : v)));
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      console.error('Error deleting video:', e);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // Custom Sections Handlers (Firestore CRUD)
  const handleAddCustomSection = async (secData: Omit<CustomSection, 'id'>) => {
    try {
      const item = await createCustomSection(secData);
      setCustomSections((prev) => [...prev, item]);
    } catch (e) {
      console.error('Error adding section:', e);
      const fallback: CustomSection = { ...secData, id: 'sec-' + Date.now() };
      setCustomSections((prev) => [...prev, fallback]);
    }
  };

  const handleUpdateCustomSection = async (id: string, partial: Partial<CustomSection>) => {
    try {
      await updateCustomSection(id, partial);
      setCustomSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)));
    } catch (e) {
      console.error('Error updating section:', e);
      setCustomSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)));
    }
  };

  const handleDeleteCustomSection = async (id: string) => {
    try {
      await deleteCustomSection(id);
      setCustomSections((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error('Error deleting section:', e);
      setCustomSections((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Donation Buttons Handlers (Firestore CRUD)
  const handleAddDonationButton = async (btnData: Omit<DonationButtonConfig, 'id'>) => {
    try {
      const item = await createDonationButton(btnData);
      setDonationButtons((prev) => [...prev, item]);
    } catch (e) {
      console.error('Error adding donation button:', e);
      const fallback: DonationButtonConfig = { ...btnData, id: 'don-' + Date.now() };
      setDonationButtons((prev) => [...prev, fallback]);
    }
  };

  const handleUpdateDonationButton = async (id: string, partial: Partial<DonationButtonConfig>) => {
    try {
      await updateDonationButton(id, partial);
      setDonationButtons((prev) => prev.map((b) => (b.id === id ? { ...b, ...partial } : b)));
    } catch (e) {
      console.error('Error updating donation button:', e);
      setDonationButtons((prev) => prev.map((b) => (b.id === id ? { ...b, ...partial } : b)));
    }
  };

  const handleDeleteDonationButton = async (id: string) => {
    try {
      await deleteDonationButton(id);
      setDonationButtons((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error('Error deleting donation button:', e);
      setDonationButtons((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Photos Handlers (Firestore CRUD)
  const handleAddPhoto = async (photoData: Omit<GalleryPhoto, 'id'>) => {
    try {
      const item = await createGalleryPhoto(photoData);
      setPhotos((prev) => [item, ...prev]);
    } catch (e) {
      console.error('Error adding photo:', e);
      const fallback: GalleryPhoto = { ...photoData, id: 'photo-' + Date.now() };
      setPhotos((prev) => [fallback, ...prev]);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await deleteGalleryPhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error('Error deleting photo:', e);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Partner Documents Handlers (Firestore CRUD)
  const handleAddDocument = async (docData: Omit<PartnerDocument, 'id' | 'createdAt'>) => {
    try {
      const newDoc = await createDocument(docData);
      setDocuments((prev) => [newDoc, ...prev]);
    } catch (e) {
      console.error('Error adding document:', e);
      const fallback: PartnerDocument = {
        ...docData,
        id: 'doc-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setDocuments((prev) => [fallback, ...prev]);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error('Error deleting document:', e);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // Footer Configuration Handlers (Firestore CRUD)
  const handleSaveFooterConfig = async (newCfg: FooterConfig) => {
    try {
      await updateFooterConfig(newCfg);
      setFooterConfig(newCfg);
    } catch (e) {
      console.error('Error saving footer config:', e);
      setFooterConfig(newCfg);
    }
  };

  // Seeding Database Handler
  const handleSeedDefaults = async () => {
    try {
      await seedFirestoreWithDefaults();
    } catch (e) {
      console.error('Error seeding defaults:', e);
    }
  };

  // Profile selection
  const handleSelectProfile = (profile: AdminProfile) => {
    setCurrentProfile(profile);
    try {
      localStorage.setItem('admdo_active_profile_id', profile.id);
    } catch (e) {
      console.error(e);
    }
  };

  // Message Handlers (Firestore CRUD)
  const handleMessageSent = async (newMsg: MessageItem) => {
    setMessages((prev) => [newMsg, ...prev]);
    try {
      await createContactMessage({
        name: newMsg.name,
        contact: newMsg.contact,
        subject: newMsg.subject,
        message: newMsg.message,
        date: newMsg.date,
      });
    } catch (e) {
      console.error('Error saving message to Firestore:', e);
    }
  };

  const handleClearMessages = async () => {
    setMessages([]);
    try {
      await clearAllContactMessages();
    } catch (e) {
      console.error('Error clearing messages in Firestore:', e);
    }
  };

  const activeSectionData = customSections.find((s) => s.slug === activeSectionSlug);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. EN-TÊTE OFFICIEL AVEC LOGO & NAVIGATION PAGE PAR PAGE */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo officiel de l'association */}
          <div
            onClick={() => navigateTo('accueil')}
            className="cursor-pointer hover:opacity-95 transition-opacity"
            title="ADMDO - Retour à l'accueil"
          >
            <AdmdoLogo variant="banner" size="md" />
          </div>

          {/* Navigation fluide page par page */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => navigateTo('accueil')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'accueil'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              Accueil
            </button>

            <button
              type="button"
              onClick={() => navigateTo('actualites')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'actualites'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Actualités</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              type="button"
              onClick={() => navigateTo('reunions')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'reunions'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Réunions</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('projets')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'projets'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Nos Projets</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('galerie')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'galerie'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Galerie Photos</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('sections')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'sections' || currentView === 'section-detail'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dossiers Thématiques</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('documents')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'documents'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('dons')}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1.5 ${
                currentView === 'dons'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Faire un Don</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className={`px-3.5 py-1.5 rounded-xl transition-colors font-bold text-xs ${
                currentView === 'contact'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              Contact
            </button>

            {/* Espace Administrateur Renforcé */}
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="ml-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 text-xs font-bold border border-slate-700"
              title="Panneau privé réservé aux administrateurs du bureau"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Espace Admin</span>
            </button>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => navigateTo('dons')}
              className="px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>Dons</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="p-2 bg-slate-900 text-white rounded-lg text-xs"
              title="Espace Administrateur"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg text-sm font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => navigateTo('accueil')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Accueil</span>
              {currentView === 'accueil' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('actualites')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Actualités</span>
              {currentView === 'actualites' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('reunions')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Réunions & Assemblées</span>
              {currentView === 'reunions' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('projets')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Nos 4 Projets Prioritaires</span>
              {currentView === 'projets' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('galerie')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Galerie Photos</span>
              {currentView === 'galerie' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('sections')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Sections & Dossiers Thématiques</span>
              {currentView === 'sections' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('documents')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Documents & Statuts Officiels</span>
              {currentView === 'documents' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('dons')}
              className="w-full text-left px-3 py-2 rounded-lg bg-rose-50 text-rose-700 font-bold flex items-center justify-between"
            >
              <span>Plateforme de Dons & Cotisations</span>
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex items-center justify-between"
            >
              <span>Formulaire de Contact</span>
              <Mail className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        )}
      </header>

      {/* 2. RENDU CONDITIONNEL DU CONTENU PAGE PAR PAGE */}

      {/* PAGE 1: ACCUEIL */}
      {currentView === 'accueil' && (
        <main className="flex-1">
          {/* Bannière de bienvenue Hero */}
          <section id="presentation" className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <div className="flex justify-center mb-5">
                <div className="p-3 bg-white rounded-3xl shadow-xs border border-slate-200/80 inline-flex items-center justify-center">
                  <AdmdoLogo variant="emblem" size="lg" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold mb-4 border border-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Medina Diakha Wouly • Sénégal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                Association pour le Développement de{' '}
                <span className="text-emerald-700">Medina Diakha Wouly</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
                Bienvenue sur le portail officiel de l'ADMDO. Notre association rassemble tous les habitants du village, les jeunes, les aînés et les ressortissants de la diaspora pour bâtir ensemble un avenir durable, solidaire et prospère.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('actualites')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Voir les actualités</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('dons')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Soutenir nos actions</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('galerie')}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-2"
                >
                  <Image className="w-4 h-4 text-emerald-700" />
                  <span>Galerie photos</span>
                </button>

                <div className="self-center">
                  <ShareButton
                    pageTitle="ADMDO - Association pour le Développement de Medina Diakha Wouly"
                    pagePath="accueil"
                    label="Partager ce portail"
                    variant="ghost"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section Vidéos publiées par les administrateurs dans l'accueil */}
          <HomeVideoSection videos={videos} />

          {/* Aperçu Actualités sur l'accueil */}
          <section className="py-12 bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                    Actualités Récentes
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Les dernières nouvelles du village
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('actualites')}
                  className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Toutes les actualités ({newsList.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsList.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-500 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-bold text-emerald-700">{item.category}</span>
                        <span>{item.publishedAt}</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4">{item.summary}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo('actualites')}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>Lire la suite</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Aperçu Projets Clés sur l'accueil */}
          <section className="py-12 bg-slate-50 border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                4 Chantiers Prioritaires
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                Nos piliers de développement
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-8">
                L’association concentre ses ressources sur des besoins vitaux : eau potable, école, maternité et maraîchage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">Eau potable & Forage</h3>
                  <p className="text-xs text-slate-600">Modernisation de la pompe solaire et extension des bornes-fontaines.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">Éducation & École</h3>
                  <p className="text-xs text-slate-600">Fournitures scolaires, soutien aux enseignants et réfection des classes.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">Santé & Maternité</h3>
                  <p className="text-xs text-slate-600">Médicaments essentiels et assistance d'urgence sanitaire pour la case.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">Femmes & Maraîchage</h3>
                  <p className="text-xs text-slate-600">Jardins communautaires maraîchers et activités génératrices de revenus.</p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => navigateTo('projets')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition shadow-2xs"
                >
                  <span>Découvrir la page complète de nos actions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Section d'appel aux dons & plateformes directes */}
          <section className="py-12 bg-gradient-to-r from-emerald-900 to-slate-900 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <Heart className="w-10 h-10 mx-auto text-rose-400 mb-3" />
              <h2 className="text-2xl sm:text-3xl font-black mb-2">
                Participez à la cagnotte de solidarité de Medina Diakha Wouly
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
                Chaque don direct par Wave, Orange Money ou virement est utilisé dans la plus grande transparence pour nos chantiers.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('dons')}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Accéder à la plateforme de dons</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition border border-white/20"
                >
                  Nous contacter directement
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* PAGE 2: ACTUALITÉS DÉDIÉE */}
      {currentView === 'actualites' && (
        <main className="flex-1">
          <div className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Page Thématique</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Actualités & Communiqués Officiels
                </h1>
              </div>
              <ShareButton
                pageTitle="Actualités - ADMDO Medina Diakha Wouly"
                pagePath="actualites"
                label="Partager les actualités"
                variant="primary"
              />
            </div>
          </div>
          <NewsSection newsList={newsList} onOpenAdmin={() => setIsAdminOpen(true)} />
        </main>
      )}

      {/* PAGE 3: RÉUNIONS DÉDIÉE */}
      {currentView === 'reunions' && (
        <main className="flex-1">
          <div className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Page Thématique</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Calendrier des Réunions & Assemblées
                </h1>
              </div>
              <ShareButton
                pageTitle="Réunions & Assemblées - ADMDO"
                pagePath="reunions"
                label="Partager les réunions"
                variant="primary"
              />
            </div>
          </div>
          <MeetingsSection
            meetingsList={meetingsList}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        </main>
      )}

      {/* PAGE 4: NOS PROJETS CONCRETS */}
      {currentView === 'projets' && (
        <main className="flex-1 py-12 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-10">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Page Projets</span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Les Grands Chantiers de l'ADMDO
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Découvrez comment vos cotisations et dons transforment le quotidien à Medina Diakha Wouly.
                </p>
              </div>
              <ShareButton
                pageTitle="Projets Prioritaires - ADMDO"
                pagePath="projets"
                label="Partager nos projets"
                variant="primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Projet 1: Forage */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <Droplets className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg text-slate-900 mb-2">1. Forage & Eau Potable</h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  L'accès à une eau propre et saine est la première des priorités. L'association a permis la pose de pompes solaires et entretient les bornes-fontaines pour les différents quartiers du village.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('dons')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Soutenir le raccordement d'eau</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Projet 2: École */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg text-slate-900 mb-2">2. École & Éducation Primaire</h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Chaque rentrée scolaire, l'ADMDO offre des kits complets (cahiers, stylos, livres) à tous les élèves de l'école élémentaire pour qu'aucun enfant ne soit exclu du savoir.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('dons')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Financer des fournitures scolaires</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Projet 3: Santé */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg text-slate-900 mb-2">3. Santé & Maternité</h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Approvisionnement périodique de l'armoire à pharmacie d'urgence et transport sanitaire des femmes enceintes et des urgences médicales vers les centres hospitaliers de référence.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('dons')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Faire un don pour la santé</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Projet 4: Maraîchage */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg text-slate-900 mb-2">4. Maraîchage Féminin & Économie</h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Soutien aux groupements féminins du village pour l'exploitation agricole maraîchère, assurant la sécurité alimentaire et l'autonomie financière des familles de Medina Diakha Wouly.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('dons')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Soutenir le maraîchage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* PAGE 5: DONS & COTISATIONS */}
      {currentView === 'dons' && (
        <main className="flex-1">
          <DonationsPage
            donationButtons={donationButtons}
            onNavigateContact={() => navigateTo('contact')}
          />
        </main>
      )}

      {/* PAGE 6: GALERIE PHOTOS */}
      {currentView === 'galerie' && (
        <main className="flex-1">
          <GalleryPage photos={photos} />
        </main>
      )}

      {/* PAGE 7: DOSSIERS THÉMATIQUES & SECTIONS PERSONNALISÉES */}
      {currentView === 'sections' && (
        <main className="flex-1">
          <CustomSectionsDirectory
            sections={customSections}
            onSelectSection={(slug) => navigateTo('section-detail', slug)}
            onNavigateDonations={() => navigateTo('dons')}
            onNavigateContact={() => navigateTo('contact')}
          />
        </main>
      )}

      {/* PAGE 8: DETAIL D'UNE SECTION SPÉCIFIQUE AVEC LIEN UNIQUE */}
      {currentView === 'section-detail' && (
        <main className="flex-1">
          {activeSectionData ? (
            <SingleSectionPage
              section={activeSectionData}
              onBack={() => navigateTo('sections')}
              onNavigateDonations={() => navigateTo('dons')}
              onNavigateContact={() => navigateTo('contact')}
            />
          ) : (
            <div className="py-20 text-center max-w-md mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Section introuvable</h2>
              <p className="text-sm text-slate-500 mb-6">
                Le dossier que vous recherchez n'existe pas ou a été déplacé.
              </p>
              <button
                type="button"
                onClick={() => navigateTo('sections')}
                className="px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-sm"
              >
                Retour aux sections
              </button>
            </div>
          )}
        </main>
      )}

      {/* PAGE 9: DOCUMENTS & STATUTS OFFICIELS POUR PARTENAIRES */}
      {currentView === 'documents' && (
        <main className="flex-1">
          <DocumentsPage onNavigateBack={() => navigateTo('accueil')} />
        </main>
      )}

      {/* PAGE 10: CONTACT DIRECT */}
      {currentView === 'contact' && (
        <main className="flex-1 py-12 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Nous Écrire</span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Contactez le Secrétariat de l'ADMDO
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Adhésion, propositions de partenariats ou questions des résidents et de la diaspora.
                </p>
              </div>
              <ShareButton
                pageTitle="Formulaire de Contact - ADMDO"
                pagePath="contact"
                label="Partager ce formulaire"
                variant="primary"
              />
            </div>

            <SimpleContact onMessageSent={handleMessageSent} />
          </div>
        </main>
      )}

      {/* VOLET ACCÈS RAPIDE AUX MESSAGES */}
      <section className="bg-slate-100 border-t border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowQuickMessages(!showQuickMessages)}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>
                Boîte de réception des messages ({messages.length})
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showQuickMessages ? 'rotate-180' : ''
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panneau d’administration sécurisé</span>
            </button>
          </div>

          {showQuickMessages && (
            <div className="mt-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-white p-4 rounded-xl border border-slate-200">
                  Aucun message reçu pour le moment.
                </p>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1.5 text-xs text-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="font-bold text-slate-900 text-sm">
                        {m.name}
                      </div>
                      <span className="text-slate-400">{m.date}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Contact :</span>{' '}
                      <span className="text-slate-800">{m.contact}</span>
                    </div>
                    {m.subject && (
                      <div>
                        <span className="font-semibold text-slate-500">Objet :</span>{' '}
                        <span className="text-slate-800">{m.subject}</span>
                      </div>
                    )}
                    <div className="pt-1 text-slate-800 whitespace-pre-wrap">
                      {m.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* PIED DE PAGE DYNAMIQUE CONFIGURÉ PAR L'ADMINISTRATION ET FIRESTORE */}
      <Footer
        footerConfig={footerConfig}
        onNavigate={navigateTo}
        onOpenInbox={() => setIsAdminOpen(true)}
      />

      {/* 3. MODALE / ESPACE D'ADMINISTRATION PRIVÉ & SÉCURISÉ */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminProfiles={adminProfiles}
        currentProfile={currentProfile}
        onSelectProfile={handleSelectProfile}
        newsList={newsList}
        onAddNews={handleAddNews}
        onUpdateNews={handleUpdateNews}
        onDeleteNews={handleDeleteNews}
        meetingsList={meetingsList}
        onAddMeeting={handleAddMeeting}
        onUpdateMeeting={handleUpdateMeeting}
        onDeleteMeeting={handleDeleteMeeting}
        videos={videos}
        onAddVideo={handleAddVideo}
        onUpdateVideo={handleUpdateVideo}
        onDeleteVideo={handleDeleteVideo}
        customSections={customSections}
        onAddCustomSection={handleAddCustomSection}
        onUpdateCustomSection={handleUpdateCustomSection}
        onDeleteCustomSection={handleDeleteCustomSection}
        donationButtons={donationButtons}
        onAddDonationButton={handleAddDonationButton}
        onUpdateDonationButton={handleUpdateDonationButton}
        onDeleteDonationButton={handleDeleteDonationButton}
        photos={photos}
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
        documents={documents}
        onAddDocument={handleAddDocument}
        onDeleteDocument={handleDeleteDocument}
        footerConfig={footerConfig}
        onSaveFooterConfig={handleSaveFooterConfig}
        onSeedDefaults={handleSeedDefaults}
        messages={messages}
        onClearMessages={handleClearMessages}
      />
    </div>
  );
}
