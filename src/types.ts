export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  priority: 'Basse' | 'Normale' | 'Haute' | 'Urgente';
  message: string;
  consent: boolean;
}

export interface StoredMessageRecord extends ContactFormData {
  id: string;
  submittedAt: string;
  driveFileId?: string;
  driveFolderId?: string;
  driveViewLink?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: string;
  webViewLink?: string;
  description?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  token: string | null;
  loading: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  badge: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Eau & Forage' | 'Éducation' | 'Santé' | 'Vie Associative' | 'Diaspora' | 'Urgent';
  summary: string;
  content: string;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  isPinned?: boolean;
}

export interface MeetingItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  organizerRole: string;
  targetAudience: string;
  agenda: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface HomeVideo {
  id: string;
  title: string;
  description?: string;
  videoUrl: string; // YouTube, Vimeo, direct mp4 or cloud link
  publishedAt: string;
  isActive: boolean;
}

export interface CustomSection {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  category?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  isPublished: boolean;
  order: number;
}

export interface DonationButtonConfig {
  id: string;
  label: string;
  url: string; // e.g. Wave, Orange Money, GoFundMe, Leetchi, PayPal, HelloAsso, or bank transfer link
  description?: string;
  badge?: string;
  platformName: string; // "Wave", "Orange Money", "GoFundMe", "Virement bancaire", etc.
  iconType?: 'heart' | 'wallet' | 'globe' | 'shield';
  isActive: boolean;
  isPrimary?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  category: 'Village' | 'Forage & Eau' | 'École' | 'Santé' | 'Maraîchage' | 'Événements';
  imageUrl: string;
  date: string;
}

export interface PartnerDocument {
  id: string;
  title: string;
  description: string;
  category: 'Statuts & Règlements' | 'Rapports Financiers' | 'Dossiers Projets' | 'Conventions & Partenariats';
  fileUrl: string;
  format: 'PDF' | 'DOCX' | 'XLSX' | 'LIEN';
  fileSize?: string;
  publishedAt: string;
  createdAt?: string;
}

export interface FooterConfig {
  id?: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  whatsapp?: string;
  facebook?: string;
  youtube?: string;
  copyrightText?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  email?: string;
  phone?: string;
  organization?: string;
  subject?: string;
  message: string;
  category?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  date?: string;
}

