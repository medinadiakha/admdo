import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Newspaper,
  Mail,
  ShieldCheck,
  CheckCircle,
  Pin,
  Clock,
  MapPin,
  Users,
  Video,
  Layers,
  Heart,
  Image,
  Lock,
  ExternalLink,
  Sparkles,
  Link,
  Copy,
  Check,
  FolderOpen,
  Sliders,
  Database,
  LogIn,
  LogOut,
} from 'lucide-react';
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
} from '../types';
import { AdmdoLogo } from './AdmdoLogo';
import { AdminDocumentsTab } from './AdminDocumentsTab';
import { AdminFooterTab } from './AdminFooterTab';
import { googleSignIn, logout as firebaseLogout, auth } from '../lib/firebase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  adminProfiles: AdminProfile[];
  currentProfile: AdminProfile;
  onSelectProfile: (profile: AdminProfile) => void;
  newsList: NewsArticle[];
  onAddNews: (news: Omit<NewsArticle, 'id'>) => void;
  onUpdateNews: (id: string, news: Partial<NewsArticle>) => void;
  onDeleteNews: (id: string) => void;
  meetingsList: MeetingItem[];
  onAddMeeting: (meet: Omit<MeetingItem, 'id'>) => void;
  onUpdateMeeting: (id: string, meet: Partial<MeetingItem>) => void;
  onDeleteMeeting: (id: string) => void;
  videos: HomeVideo[];
  onAddVideo: (video: Omit<HomeVideo, 'id'>) => void;
  onUpdateVideo: (id: string, video: Partial<HomeVideo>) => void;
  onDeleteVideo: (id: string) => void;
  customSections: CustomSection[];
  onAddCustomSection: (section: Omit<CustomSection, 'id'>) => void;
  onUpdateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  onDeleteCustomSection: (id: string) => void;
  donationButtons: DonationButtonConfig[];
  onAddDonationButton: (btn: Omit<DonationButtonConfig, 'id'>) => void;
  onUpdateDonationButton: (id: string, btn: Partial<DonationButtonConfig>) => void;
  onDeleteDonationButton: (id: string) => void;
  photos: GalleryPhoto[];
  onAddPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  onDeletePhoto: (id: string) => void;
  documents?: PartnerDocument[];
  onAddDocument?: (docItem: Omit<PartnerDocument, 'id'>) => void;
  onDeleteDocument?: (id: string) => void;
  footerConfig?: FooterConfig;
  onSaveFooterConfig?: (config: FooterConfig) => void;
  onSeedDefaults?: () => Promise<void>;
  messages: Array<{ name: string; contact: string; subject: string; message: string; date: string }>;
  onClearMessages: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  adminProfiles,
  currentProfile,
  onSelectProfile,
  newsList,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  meetingsList,
  onAddMeeting,
  onUpdateMeeting,
  onDeleteMeeting,
  videos,
  onAddVideo,
  onUpdateVideo,
  onDeleteVideo,
  customSections,
  onAddCustomSection,
  onUpdateCustomSection,
  onDeleteCustomSection,
  donationButtons,
  onAddDonationButton,
  onUpdateDonationButton,
  onDeleteDonationButton,
  photos,
  onAddPhoto,
  onDeletePhoto,
  documents = [],
  onAddDocument = () => {},
  onDeleteDocument = () => {},
  footerConfig = {
    email: 'admdo.association@gmail.com',
    phone: '+221 77 000 11 22',
    address: 'Medina Diakha Wouly, Sénégal',
    description: '',
  },
  onSaveFooterConfig = () => {},
  onSeedDefaults,
  messages,
  onClearMessages,
}) => {
  // Tabs
  type TabType =
    | 'videos'
    | 'sections'
    | 'donations'
    | 'documents'
    | 'news'
    | 'meetings'
    | 'gallery'
    | 'footer'
    | 'messages'
    | 'profiles';
  const [activeTab, setActiveTab] = useState<TabType>('videos');

  // Security Passcode Lock & Firebase Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [firebaseUserEmail, setFirebaseUserEmail] = useState<string | null>(auth.currentUser?.email || null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // Link Copied Feedback
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Video Form Modal State
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Custom Section Form Modal State
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [secTitle, setSecTitle] = useState('');
  const [secSubtitle, setSecSubtitle] = useState('');
  const [secCategory, setSecCategory] = useState('');
  const [secContent, setSecContent] = useState('');
  const [secImageUrl, setSecImageUrl] = useState('');
  const [secButtonText, setSecButtonText] = useState('');
  const [secButtonUrl, setSecButtonUrl] = useState('');

  // Donation Button Form Modal State
  const [isEditingDonation, setIsEditingDonation] = useState(false);
  const [editingDonationId, setEditingDonationId] = useState<string | null>(null);
  const [donLabel, setDonLabel] = useState('');
  const [donPlatform, setDonPlatform] = useState('Wave');
  const [donUrl, setDonUrl] = useState('');
  const [donDescription, setDonDescription] = useState('');
  const [donBadge, setDonBadge] = useState('');
  const [donIconType, setDonIconType] = useState<'heart' | 'wallet' | 'globe' | 'shield'>('wallet');
  const [donIsPrimary, setDonIsPrimary] = useState(false);

  // Gallery Photo Form Modal State
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<GalleryPhoto['category']>('Village');
  const [photoImageUrl, setPhotoImageUrl] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');

  // News Form Modal State
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsArticle['category']>('Vie Associative');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsIsPinned, setNewsIsPinned] = useState(false);

  // Meeting Form Modal State
  const [isEditingMeeting, setIsEditingMeeting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingAudience, setMeetingAudience] = useState('Tous les membres et résidents');
  const [meetingAgenda, setMeetingAgenda] = useState('');

  if (!isOpen) return null;

  // Passcode verification (default code: 2026 or admdo2026)
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (clean === '2026' || clean === 'admdo2026' || clean === 'admdo' || clean === 'admin') {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleGoogleAdminLogin = async () => {
    try {
      setIsFirebaseLoading(true);
      const res = await googleSignIn();
      if (res?.user?.email) {
        setFirebaseUserEmail(res.user.email);
        setIsAuthenticated(true);
        setPasscodeError(false);
      }
    } catch (e) {
      console.warn('Google sign-in skipped/failed:', e);
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const handleFirebaseLogout = async () => {
    try {
      await firebaseLogout();
      setFirebaseUserEmail(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerSeed = async () => {
    if (!auth.currentUser) {
      setSeedNotice('Compte Google requis : cliquez sur "Lier compte Google" pour synchroniser Firestore.');
      setTimeout(() => setSeedNotice(null), 6000);
      return;
    }
    if (onSeedDefaults) {
      try {
        setIsFirebaseLoading(true);
        await onSeedDefaults();
        setSeedSuccess('Base Firebase initialisée et synchronisée avec succès !');
        setTimeout(() => setSeedSuccess(null), 4000);
      } catch (e) {
        console.error(e);
        setSeedNotice('Échec de synchronisation. Vérifiez la connexion administrateur admdo.association@gmail.com.');
        setTimeout(() => setSeedNotice(null), 6000);
      } finally {
        setIsFirebaseLoading(false);
      }
    }
  };


  const copyShareableLink = (path: string, id: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const full = `${origin}${pathname}#${path}`;
    navigator.clipboard.writeText(full);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 3000);
  };

  // Video Actions
  const handleOpenAddVideo = () => {
    setEditingVideoId(null);
    setVideoTitle('');
    setVideoDescription('');
    setVideoUrl('');
    setIsEditingVideo(true);
  };

  const handleOpenEditVideo = (v: HomeVideo) => {
    setEditingVideoId(v.id);
    setVideoTitle(v.title);
    setVideoDescription(v.description || '');
    setVideoUrl(v.videoUrl);
    setIsEditingVideo(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    if (editingVideoId) {
      onUpdateVideo(editingVideoId, {
        title: videoTitle.trim(),
        description: videoDescription.trim(),
        videoUrl: videoUrl.trim(),
      });
    } else {
      const today = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      onAddVideo({
        title: videoTitle.trim(),
        description: videoDescription.trim(),
        videoUrl: videoUrl.trim(),
        publishedAt: today,
        isActive: true,
      });
    }
    setIsEditingVideo(false);
  };

  // Section Actions
  const handleOpenAddSection = () => {
    setEditingSectionId(null);
    setSecTitle('');
    setSecSubtitle('');
    setSecCategory('Projet');
    setSecContent('');
    setSecImageUrl('https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=80');
    setSecButtonText('Soutenir cette action');
    setSecButtonUrl('#dons');
    setIsEditingSection(true);
  };

  const handleOpenEditSection = (s: CustomSection) => {
    setEditingSectionId(s.id);
    setSecTitle(s.title);
    setSecSubtitle(s.subtitle || '');
    setSecCategory(s.category || 'Projet');
    setSecContent(s.content);
    setSecImageUrl(s.imageUrl || '');
    setSecButtonText(s.buttonText || '');
    setSecButtonUrl(s.buttonUrl || '');
    setIsEditingSection(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secTitle.trim() || !secContent.trim()) return;

    const slug = secTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `section-${Date.now()}`;

    if (editingSectionId) {
      onUpdateCustomSection(editingSectionId, {
        title: secTitle.trim(),
        subtitle: secSubtitle.trim(),
        category: secCategory.trim(),
        content: secContent.trim(),
        imageUrl: secImageUrl.trim(),
        buttonText: secButtonText.trim(),
        buttonUrl: secButtonUrl.trim(),
      });
    } else {
      onAddCustomSection({
        slug,
        title: secTitle.trim(),
        subtitle: secSubtitle.trim(),
        category: secCategory.trim(),
        content: secContent.trim(),
        imageUrl: secImageUrl.trim(),
        buttonText: secButtonText.trim(),
        buttonUrl: secButtonUrl.trim(),
        isPublished: true,
        order: customSections.length + 1,
      });
    }
    setIsEditingSection(false);
  };

  // Donation Actions
  const handleOpenAddDonation = () => {
    setEditingDonationId(null);
    setDonLabel('');
    setDonPlatform('Wave');
    setDonUrl('https://wave.com');
    setDonDescription('');
    setDonBadge('Paiement Rapide');
    setDonIconType('wallet');
    setDonIsPrimary(false);
    setIsEditingDonation(true);
  };

  const handleOpenEditDonation = (btn: DonationButtonConfig) => {
    setEditingDonationId(btn.id);
    setDonLabel(btn.label);
    setDonPlatform(btn.platformName);
    setDonUrl(btn.url);
    setDonDescription(btn.description || '');
    setDonBadge(btn.badge || '');
    setDonIconType(btn.iconType || 'wallet');
    setDonIsPrimary(!!btn.isPrimary);
    setIsEditingDonation(true);
  };

  const handleSaveDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donLabel.trim() || !donUrl.trim()) return;

    if (editingDonationId) {
      onUpdateDonationButton(editingDonationId, {
        label: donLabel.trim(),
        platformName: donPlatform.trim(),
        url: donUrl.trim(),
        description: donDescription.trim(),
        badge: donBadge.trim(),
        iconType: donIconType,
        isPrimary: donIsPrimary,
      });
    } else {
      onAddDonationButton({
        label: donLabel.trim(),
        platformName: donPlatform.trim(),
        url: donUrl.trim(),
        description: donDescription.trim(),
        badge: donBadge.trim(),
        iconType: donIconType,
        isActive: true,
        isPrimary: donIsPrimary,
      });
    }
    setIsEditingDonation(false);
  };

  // Gallery Photo Actions
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoImageUrl.trim()) return;

    const today = new Date().toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });

    onAddPhoto({
      title: photoTitle.trim(),
      description: photoDescription.trim(),
      category: photoCategory,
      imageUrl: photoImageUrl.trim(),
      date: today,
    });

    setIsAddingPhoto(false);
    setPhotoTitle('');
    setPhotoDescription('');
    setPhotoImageUrl('');
  };

  // News Actions
  const handleOpenAddNews = () => {
    setEditingNewsId(null);
    setNewsTitle('');
    setNewsCategory('Vie Associative');
    setNewsSummary('');
    setNewsContent('');
    setNewsIsPinned(false);
    setIsEditingNews(true);
  };

  const handleOpenEditNews = (item: NewsArticle) => {
    setEditingNewsId(item.id);
    setNewsTitle(item.title);
    setNewsCategory(item.category);
    setNewsSummary(item.summary);
    setNewsContent(item.content);
    setNewsIsPinned(!!item.isPinned);
    setIsEditingNews(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    if (editingNewsId) {
      onUpdateNews(editingNewsId, {
        title: newsTitle.trim(),
        category: newsCategory,
        summary: newsSummary.trim() || newsContent.trim().substring(0, 140) + '...',
        content: newsContent.trim(),
        isPinned: newsIsPinned,
      });
    } else {
      const today = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      onAddNews({
        title: newsTitle.trim(),
        category: newsCategory,
        summary: newsSummary.trim() || newsContent.trim().substring(0, 140) + '...',
        content: newsContent.trim(),
        publishedAt: today,
        authorName: currentProfile.name,
        authorRole: currentProfile.role,
        isPinned: newsIsPinned,
      });
    }
    setIsEditingNews(false);
  };

  // Meeting Actions
  const handleOpenAddMeeting = () => {
    setEditingMeetingId(null);
    setMeetingTitle('');
    setMeetingDate('');
    setMeetingTime('16h00 GMT');
    setMeetingLocation('Medina Diakha Wouly & Visioconférence');
    setMeetingAudience('Tous les membres et résidents');
    setMeetingAgenda('');
    setIsEditingMeeting(true);
  };

  const handleOpenEditMeeting = (item: MeetingItem) => {
    setEditingMeetingId(item.id);
    setMeetingTitle(item.title);
    setMeetingDate(item.date);
    setMeetingTime(item.time);
    setMeetingLocation(item.location);
    setMeetingAudience(item.targetAudience);
    setMeetingAgenda(item.agenda);
    setIsEditingMeeting(true);
  };

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim() || !meetingDate.trim()) return;

    if (editingMeetingId) {
      onUpdateMeeting(editingMeetingId, {
        title: meetingTitle.trim(),
        date: meetingDate.trim(),
        time: meetingTime.trim() || '16h00 GMT',
        location: meetingLocation.trim() || 'Medina Diakha Wouly',
        targetAudience: meetingAudience.trim(),
        agenda: meetingAgenda.trim(),
      });
    } else {
      onAddMeeting({
        title: meetingTitle.trim(),
        date: meetingDate.trim(),
        time: meetingTime.trim() || '16h00 GMT',
        location: meetingLocation.trim() || 'Medina Diakha Wouly',
        organizerName: currentProfile.name,
        organizerRole: currentProfile.role,
        targetAudience: meetingAudience.trim(),
        agenda: meetingAgenda.trim(),
        status: 'upcoming',
      });
    }
    setIsEditingMeeting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <AdmdoLogo variant="emblem" size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg">
                  Panneau d’Administration Privé ADMDO
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Espace Réservé & Sécurisé
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Publiez des vidéos, créez des sections, configurez les boutons de dons et partagez les liens directs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fermer le panneau d'administration"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Login Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Accès Administrateur Sécurisé</h2>
            <p className="text-sm text-slate-600 mb-6">
              Ce panneau est strictement réservé aux membres du bureau exécutif de l’ADMDO et au compte administrateur certifié pour gérer la plateforme en temps réel.
            </p>

            {/* Google / Firebase sign in option */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <button
                type="button"
                onClick={handleGoogleAdminLogin}
                disabled={isFirebaseLoading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>Connexion Google (admdo.association@gmail.com)</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Authentification directe Firebase pour le compte administrateur principal.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ou code d'accès bureau exécutif
                </label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Entrez le code d’accès (ex: 2026)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm text-center font-mono tracking-widest"
                />
                {passcodeError && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold">
                    Code erroné. Veuillez saisir le code d'accès administrateur (code démo : 2026).
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition active:scale-95 text-sm"
              >
                Déverrouiller le Panneau d’Administration
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
              <span>Code d'accès par défaut pour le bureau : </span>
              <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">2026</code>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Bar & Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Active Admin Profile & Firebase Status */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Connecté :</span>
                  <select
                    value={currentProfile.id}
                    onChange={(e) => {
                      const found = adminProfiles.find((p) => p.id === e.target.value);
                      if (found) onSelectProfile(found);
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-2xs"
                  >
                    {adminProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role})
                      </option>
                    ))}
                  </select>
                </div>

                {firebaseUserEmail ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 font-bold border border-emerald-300 text-[11px]">
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Firebase: {firebaseUserEmail}</span>
                    <button
                      type="button"
                      onClick={handleFirebaseLogout}
                      className="ml-1 text-slate-500 hover:text-rose-600"
                      title="Se déconnecter de Firebase"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleAdminLogin}
                    disabled={isFirebaseLoading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium text-[11px]"
                  >
                    <LogIn className="w-3 h-3 text-emerald-700" />
                    <span>Lier compte Google</span>
                  </button>
                )}

                {onSeedDefaults && (
                  <button
                    type="button"
                    onClick={handleTriggerSeed}
                    disabled={isFirebaseLoading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 text-[11px] transition"
                    title="Synchroniser la base Firestore avec les données par défaut si vide"
                  >
                    <Database className="w-3 h-3" />
                    <span>Synchroniser Firestore</span>
                  </button>
                )}

                {seedSuccess && (
                  <span className="text-emerald-700 font-bold text-[11px] animate-pulse">
                    {seedSuccess}
                  </span>
                )}

                {seedNotice && (
                  <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium animate-fade-in">
                    {seedNotice}
                  </span>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'videos'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Vidéos Accueil ({videos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sections')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'sections'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sections & Projets ({customSections.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('donations')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'donations'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Boutons de Dons ({donationButtons.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'documents'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Documents ({documents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('news')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'news'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Actualités ({newsList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('meetings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'meetings'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Réunions ({meetingsList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'gallery'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>Galerie ({photos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('footer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'footer'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Pied de page</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'messages'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Messages ({messages.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profiles')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'profiles'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Bureau ({adminProfiles.length})</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100/70">
              {/* TAB 1: VIDEOS D'ACCUEIL */}
              {activeTab === 'videos' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-emerald-700" />
                        <span>Vidéos publiées sur la page d'accueil</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ajoutez des vidéos YouTube, Vimeo ou fichiers vidéo directs. Elles apparaîtront instantanément sur la page d'accueil et chaque vidéo peut être partagée via son lien.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddVideo}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter une vidéo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                            <span className="text-slate-400 font-medium">{vid.publishedAt}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                vid.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {vid.isActive ? 'Visible sur l’accueil' : 'Masquée'}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm mb-1">{vid.title}</h4>
                          {vid.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 mb-3">{vid.description}</p>
                          )}

                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 text-xs font-mono text-slate-600 truncate mb-3">
                            <Link className="w-3 h-3 inline mr-1 text-slate-400" />
                            {vid.videoUrl}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => copyShareableLink(`accueil#video-card-${vid.id}`, vid.id)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            {copiedLink === vid.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Lien copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier lien de partage</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditVideo(vid)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                              title="Modifier la vidéo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Supprimer cette vidéo ?')) onDeleteVideo(vid.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Supprimer la vidéo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SECTIONS & PROJETS PERSONNALISÉS */}
              {activeTab === 'sections' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-700" />
                        <span>Création de Pages & Sections Thématiques</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Chaque section créée génère une page dédiée avec son propre lien (#section/slug) partageable aux partenaires et villageois.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddSection}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Créer une nouvelle section</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {customSections.map((sec) => (
                      <div
                        key={sec.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {sec.category || 'Dossier'}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              Lien : #section/{sec.slug}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-base">{sec.title}</h4>
                          {sec.subtitle && (
                            <p className="text-xs text-emerald-800 font-medium mb-1">{sec.subtitle}</p>
                          )}
                          <p className="text-xs text-slate-600 line-clamp-2">{sec.content}</p>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                          <button
                            type="button"
                            onClick={() => copyShareableLink(`section/${sec.slug}`, sec.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            {copiedLink === sec.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Lien copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier lien de la section</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSection(sec)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                              title="Modifier la section"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Supprimer cette section ?')) onDeleteCustomSection(sec.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Supprimer la section"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: BOUTONS DE DONS & PLATEFORMES */}
              {activeTab === 'donations' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-emerald-700" />
                        <span>Configuration des Boutons & Plateformes de Dons</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Insérez les liens de vos cagnottes externes (Wave, Orange Money, GoFundMe, Leetchi, HelloAsso, etc.) pour récupérer les dons en toute sécurité.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddDonation}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter un bouton de don</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {donationButtons.map((btn) => (
                      <div
                        key={btn.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {btn.platformName}
                            </span>
                            {btn.isPrimary && (
                              <span className="font-bold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                Principal
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm mb-1">{btn.label}</h4>
                          {btn.description && (
                            <p className="text-xs text-slate-600 mb-2 line-clamp-2">{btn.description}</p>
                          )}

                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-xs font-mono text-slate-600 truncate mb-3">
                            <ExternalLink className="w-3 h-3 inline mr-1 text-slate-400" />
                            {btn.url}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => copyShareableLink('dons', btn.id)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            {copiedLink === btn.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Lien copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier lien de la page de don</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDonation(btn)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                              title="Modifier le bouton"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Supprimer ce bouton de don ?')) onDeleteDonationButton(btn.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Supprimer le bouton"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ACTUALITÉS */}
              {activeTab === 'news' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-emerald-700" />
                        <span>Actualités & Communiqués officiels</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Publiez des comptes rendus de forages, distributions scolaires et alertes associatives.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddNews}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Rédiger une actualité</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newsList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {item.category}
                            </span>
                            <span className="text-slate-400">{item.publishedAt}</span>
                            {item.isPinned && (
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                                Épinglé
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-base mb-1">{item.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => copyShareableLink('actualites', item.id)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            {copiedLink === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Lien copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier lien</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditNews(item)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Supprimer cette actualité ?')) onDeleteNews(item.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: RÉUNIONS */}
              {activeTab === 'meetings' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span>Planification des Réunions & Assemblées</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Annoncez les dates des réunions au village et les visioconférences de la diaspora.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddMeeting}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Planifier une réunion</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {meetingsList.map((meet) => (
                      <div
                        key={meet.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 text-xs text-emerald-800 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{meet.date} • {meet.time}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base mb-1">{meet.title}</h4>
                          <p className="text-xs text-slate-500 mb-1">
                            <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                            {meet.location}
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-2">{meet.agenda}</p>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0">
                          <button
                            type="button"
                            onClick={() => copyShareableLink('reunions', meet.id)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            {copiedLink === meet.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Lien copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier lien</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMeeting(meet)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Supprimer cette réunion ?')) onDeleteMeeting(meet.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GALERIE PHOTOS */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Image className="w-4 h-4 text-emerald-700" />
                        <span>Photos du Village & Réalisations</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ajoutez des photographies classées par catégorie. L'application les présente page par page sans encombrer la page d'accueil.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingPhoto(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter une photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group relative flex flex-col justify-between"
                      >
                        <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Supprimer cette photo ?')) onDeletePhoto(p.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition opacity-0 group-hover:opacity-100"
                            title="Supprimer la photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-3">
                          <span className="text-[10px] font-bold text-emerald-700 block mb-0.5">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: MESSAGES REÇUS */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Boîte de réception des messages
                      </h3>
                      <p className="text-xs text-slate-500">
                        Messages envoyés via les formulaires de contact de la plateforme.
                      </p>
                    </div>

                    {messages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Voulez-vous supprimer tous les messages ?')) {
                            onClearMessages();
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Tout effacer</span>
                      </button>
                    )}
                  </div>

                  {messages.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                      <Mail className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-medium">Aucun message reçu pour l'instant.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-2 text-xs text-slate-700"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div className="font-bold text-slate-900 text-sm">
                              {m.name} <span className="text-xs text-slate-500 font-normal">({m.contact})</span>
                            </div>
                            <span className="text-slate-400">{m.date}</span>
                          </div>

                          {m.subject && (
                            <div>
                              <span className="font-bold text-slate-600">Objet : </span>
                              <span>{m.subject}</span>
                            </div>
                          )}

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 whitespace-pre-line text-slate-800">
                            {m.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: MEMBRES DU BUREAU */}
              {activeTab === 'profiles' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <h3 className="text-base font-bold text-slate-900">
                      Membres du Bureau Exécutif de l’ADMDO
                    </h3>
                    <p className="text-xs text-slate-500">
                      Profils administrateurs officiels habilités à valider les publications.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {adminProfiles.map((p) => (
                      <div
                        key={p.id}
                        className={`bg-white rounded-2xl p-5 border shadow-2xs transition-all ${
                          currentProfile.id === p.id
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-base font-extrabold text-slate-900 block">
                              {p.name}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 block">
                              {p.role}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {p.badge}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                          <div><strong>Email :</strong> {p.email}</div>
                          {p.phone && <div><strong>Tél :</strong> {p.phone}</div>}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          {currentProfile.id === p.id ? (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Profil Actif</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onSelectProfile(p)}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-colors"
                            >
                              Basculer sur ce profil
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: DOCUMENTS PARTENAIRES & RAPPORTS */}
              {activeTab === 'documents' && (
                <AdminDocumentsTab
                  documents={documents}
                  onAddDocument={onAddDocument}
                  onDeleteDocument={onDeleteDocument}
                />
              )}

              {/* TAB 10: PIED DE PAGE & COORDONNÉES */}
              {activeTab === 'footer' && (
                <AdminFooterTab
                  footerConfig={footerConfig}
                  onSaveFooterConfig={onSaveFooterConfig}
                />
              )}
            </div>
          </>
        )}

        {/* MODAL: AJOUTER/MODIFIER UNE VIDÉO D'ACCUEIL */}
        {isEditingVideo && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>{editingVideoId ? 'Modifier la vidéo' : 'Publier une vidéo sur la page d’accueil'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingVideo(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre de la vidéo *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Ex: Travaux d’installation du forage solaire à Medina Diakha Wouly"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lien Vidéo (YouTube, Vimeo ou fichier MP4) *
                  </label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Compatible avec tous les liens YouTube, YouTube Shorts, Vimeo ou liens directs .mp4
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description ou explications de la vidéo
                  </label>
                  <textarea
                    rows={3}
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Contexte, intervenants, remerciements à la diaspora..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingVideo(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    {editingVideoId ? 'Enregistrer les modifications' : 'Publier sur l’accueil'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AJOUTER/MODIFIER UNE SECTION THÉMATIQUE */}
        {isEditingSection && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>{editingSectionId ? 'Modifier la section' : 'Créer une nouvelle section / page'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingSection(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSection} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre principal de la section *
                  </label>
                  <input
                    type="text"
                    required
                    value={secTitle}
                    onChange={(e) => setSecTitle(e.target.value)}
                    placeholder="Ex: Le Nouveau Poste de Santé de Medina Diakha Wouly"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Catégorie ou Thématique
                    </label>
                    <input
                      type="text"
                      value={secCategory}
                      onChange={(e) => setSecCategory(e.target.value)}
                      placeholder="Ex: Santé, Éducation, Forage..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Sous-titre accrocheur
                    </label>
                    <input
                      type="text"
                      value={secSubtitle}
                      onChange={(e) => setSecSubtitle(e.target.value)}
                      placeholder="Ex: Une infrastructure vitale pour les mères et enfants"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Image d'illustration (URL)
                  </label>
                  <input
                    type="url"
                    value={secImageUrl}
                    onChange={(e) => setSecImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contenu complet de la page / section *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={secContent}
                    onChange={(e) => setSecContent(e.target.value)}
                    placeholder="Rédigez la présentation détaillée de cette section..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Texte du bouton d'action
                    </label>
                    <input
                      type="text"
                      value={secButtonText}
                      onChange={(e) => setSecButtonText(e.target.value)}
                      placeholder="Ex: Participer au projet"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Lien du bouton (URL ou #dons)
                    </label>
                    <input
                      type="text"
                      value={secButtonUrl}
                      onChange={(e) => setSecButtonUrl(e.target.value)}
                      placeholder="#dons ou lien externe"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingSection(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    {editingSectionId ? 'Enregistrer les modifications' : 'Créer la section'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AJOUTER/MODIFIER UN BOUTON DE DON */}
        {isEditingDonation && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>{editingDonationId ? 'Modifier le bouton de don' : 'Ajouter un bouton de don externe'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingDonation(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDonation} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Intitulé du bouton *
                  </label>
                  <input
                    type="text"
                    required
                    value={donLabel}
                    onChange={(e) => setDonLabel(e.target.value)}
                    placeholder="Ex: Donner via Wave / Orange Money"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nom de la Plateforme *
                    </label>
                    <input
                      type="text"
                      required
                      value={donPlatform}
                      onChange={(e) => setDonPlatform(e.target.value)}
                      placeholder="Ex: Wave, Orange Money, GoFundMe, Leetchi..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Badge descriptif
                    </label>
                    <input
                      type="text"
                      value={donBadge}
                      onChange={(e) => setDonBadge(e.target.value)}
                      placeholder="Ex: Mobile Money Sénégal"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lien URL de redirection pour le don *
                  </label>
                  <input
                    type="url"
                    required
                    value={donUrl}
                    onChange={(e) => setDonUrl(e.target.value)}
                    placeholder="https://wave.com ou https://gofundme.com/f/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Instructions d'accompagnement
                  </label>
                  <textarea
                    rows={2}
                    value={donDescription}
                    onChange={(e) => setDonDescription(e.target.value)}
                    placeholder="Numéro à contacter ou instructions de virement..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="donIsPrimary"
                    checked={donIsPrimary}
                    onChange={(e) => setDonIsPrimary(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="donIsPrimary" className="font-semibold text-slate-700 cursor-pointer">
                    Mettre en avant ce moyen de paiement (Bouton Principal)
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingDonation(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    {editingDonationId ? 'Enregistrer' : 'Ajouter le bouton'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AJOUTER UNE PHOTO DANS LA GALERIE */}
        {isAddingPhoto && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Image className="w-4 h-4 text-emerald-600" />
                  <span>Ajouter une photo à la médiathèque</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingPhoto(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre ou légende de la photo *
                  </label>
                  <input
                    type="text"
                    required
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="Ex: Raccordement de la borne fontaine du quartier Nord"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={photoCategory}
                    onChange={(e) => setPhotoCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
                  >
                    <option value="Village">Village</option>
                    <option value="Forage & Eau">Forage & Eau</option>
                    <option value="École">École</option>
                    <option value="Santé">Santé</option>
                    <option value="Maraîchage">Maraîchage</option>
                    <option value="Événements">Événements</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    URL de l'image *
                  </label>
                  <input
                    type="url"
                    required
                    value={photoImageUrl}
                    onChange={(e) => setPhotoImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description complémentaire
                  </label>
                  <textarea
                    rows={2}
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                    placeholder="Détails sur l'événement ou le projet photographié..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingPhoto(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    Ajouter la photo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AJOUTER/MODIFIER UNE ACTUALITÉ */}
        {isEditingNews && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900">
                  {editingNewsId ? 'Modifier l’actualité' : 'Publier une nouvelle actualité'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingNews(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNews} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre de l’actualité *
                  </label>
                  <input
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="Ex: Arrivée du nouveau matériel pour la case de santé"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
                    >
                      <option value="Eau & Forage">Eau & Forage</option>
                      <option value="Éducation">Éducation</option>
                      <option value="Santé">Santé</option>
                      <option value="Vie Associative">Vie Associative</option>
                      <option value="Diaspora">Diaspora</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="newsIsPinned"
                      checked={newsIsPinned}
                      onChange={(e) => setNewsIsPinned(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="newsIsPinned" className="font-semibold text-slate-700 cursor-pointer">
                      Épingler en haut
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Résumé court (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    placeholder="Une phrase résumant l'action..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contenu complet de l'article *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    placeholder="Détails complets de l'action..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingNews(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    {editingNewsId ? 'Enregistrer' : 'Publier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: PLANIFIER UNE RÉUNION */}
        {isEditingMeeting && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900">
                  {editingMeetingId ? 'Modifier la réunion' : 'Planifier une nouvelle réunion'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingMeeting(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMeeting} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Intitulé de la réunion *
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Ex: Assemblée Générale Ordinaire 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      placeholder="Ex: Dimanche 25 Octobre 2026"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Heure
                    </label>
                    <input
                      type="text"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      placeholder="Ex: 16h00 GMT"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lieu ou Lien visioconférence
                  </label>
                  <input
                    type="text"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    placeholder="Ex: Place du village & Visioconférence WhatsApp"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ordre du jour & Points à aborder
                  </label>
                  <textarea
                    rows={3}
                    value={meetingAgenda}
                    onChange={(e) => setMeetingAgenda(e.target.value)}
                    placeholder="1. Bilan d'activité...&#10;2. Financement du forage..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingMeeting(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    {editingMeetingId ? 'Enregistrer' : 'Planifier la réunion'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
