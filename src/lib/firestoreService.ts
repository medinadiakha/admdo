import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from './firebase';
import {
  NewsArticle,
  MeetingItem,
  HomeVideo,
  CustomSection,
  DonationButtonConfig,
  GalleryPhoto,
  PartnerDocument,
  FooterConfig,
  ContactMessage,
} from '../types';
import {
  INITIAL_NEWS,
  INITIAL_MEETINGS,
  INITIAL_VIDEOS,
  INITIAL_CUSTOM_SECTIONS,
  INITIAL_DONATION_BUTTONS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_DOCUMENTS,
  INITIAL_FOOTER_CONFIG,
} from '../data/initialData';

// 1. NEWS SERVICE
export function subscribeNews(
  onData: (news: NewsArticle[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'news';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        // Provide initial data as default fallback
        onData(INITIAL_NEWS);
      } else {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as NewsArticle),
          id: d.id,
        }));
        onData(items);
      }
    },
    (error) => {
      console.warn('News onSnapshot fallback to local data:', error);
      onData(INITIAL_NEWS);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveNewsItem(item: NewsArticle): Promise<void> {
  const path = `news/${item.id}`;
  try {
    await setDoc(doc(db, 'news', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteNewsItem(id: string): Promise<void> {
  const path = `news/${id}`;
  try {
    await deleteDoc(doc(db, 'news', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 2. MEETINGS SERVICE
export function subscribeMeetings(
  onData: (meetings: MeetingItem[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'meetings';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_MEETINGS);
      } else {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as MeetingItem),
          id: d.id,
        }));
        onData(items);
      }
    },
    (error) => {
      console.warn('Meetings onSnapshot fallback:', error);
      onData(INITIAL_MEETINGS);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveMeetingItem(item: MeetingItem): Promise<void> {
  const path = `meetings/${item.id}`;
  try {
    await setDoc(doc(db, 'meetings', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMeetingItem(id: string): Promise<void> {
  const path = `meetings/${id}`;
  try {
    await deleteDoc(doc(db, 'meetings', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. VIDEOS SERVICE
export function subscribeVideos(
  onData: (videos: HomeVideo[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'videos';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_VIDEOS);
      } else {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as HomeVideo),
          id: d.id,
        }));
        onData(items);
      }
    },
    (error) => {
      console.warn('Videos onSnapshot fallback:', error);
      onData(INITIAL_VIDEOS);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveVideoItem(item: HomeVideo): Promise<void> {
  const path = `videos/${item.id}`;
  try {
    await setDoc(doc(db, 'videos', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteVideoItem(id: string): Promise<void> {
  const path = `videos/${id}`;
  try {
    await deleteDoc(doc(db, 'videos', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. CUSTOM SECTIONS & THEMATIC DOSSIERS
export function subscribeCustomSections(
  onData: (sections: CustomSection[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'customSections';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_CUSTOM_SECTIONS);
      } else {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as CustomSection),
          id: d.id,
        }));
        onData(items);
      }
    },
    (error) => {
      console.warn('CustomSections fallback:', error);
      onData(INITIAL_CUSTOM_SECTIONS);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveCustomSectionItem(item: CustomSection): Promise<void> {
  const path = `customSections/${item.id}`;
  try {
    await setDoc(doc(db, 'customSections', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomSectionItem(id: string): Promise<void> {
  const path = `customSections/${id}`;
  try {
    await deleteDoc(doc(db, 'customSections', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. DONATION & MOBILE MONEY BUTTONS
export function subscribeDonationButtons(
  onData: (buttons: DonationButtonConfig[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'donationButtons';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_DONATION_BUTTONS);
      } else {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as DonationButtonConfig),
          id: d.id,
        }));
        onData(items);
      }
    },
    (error) => {
      console.warn('DonationButtons fallback:', error);
      onData(INITIAL_DONATION_BUTTONS);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveDonationButtonItem(item: DonationButtonConfig): Promise<void> {
  const path = `donationButtons/${item.id}`;
  try {
    await setDoc(doc(db, 'donationButtons', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDonationButtonItem(id: string): Promise<void> {
  const path = `donationButtons/${id}`;
  try {
    await deleteDoc(doc(db, 'donationButtons', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 6. GALLERY PHOTOS
export function subscribePhotos(
  onData: (photos: GalleryPhoto[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'photos';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_GALLERY_PHOTOS);
      } else {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as GalleryPhoto),
          id: d.id,
        }));
        onData(items);
      }
    },
    (error) => {
      console.warn('Photos fallback:', error);
      onData(INITIAL_GALLERY_PHOTOS);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function savePhotoItem(item: GalleryPhoto): Promise<void> {
  const path = `photos/${item.id}`;
  try {
    await setDoc(doc(db, 'photos', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePhotoItem(id: string): Promise<void> {
  const path = `photos/${id}`;
  try {
    await deleteDoc(doc(db, 'photos', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 7. PARTNER DOCUMENTS
export function subscribeDocuments(
  onData: (docsList: PartnerDocument[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'documents';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_DOCUMENTS);
      } else {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as PartnerDocument),
          id: d.id,
        }));
        onData(items);
      }
    },
    (error) => {
      console.warn('Documents fallback:', error);
      onData(INITIAL_DOCUMENTS);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveDocumentItem(item: PartnerDocument): Promise<void> {
  const path = `documents/${item.id}`;
  try {
    await setDoc(doc(db, 'documents', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDocumentItem(id: string): Promise<void> {
  const path = `documents/${id}`;
  try {
    await deleteDoc(doc(db, 'documents', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 8. SITE & FOOTER CONFIG
export function subscribeFooterConfig(
  onData: (config: FooterConfig) => void,
  onError?: (err: Error) => void
) {
  const path = 'siteConfig/footer';
  return onSnapshot(
    doc(db, 'siteConfig', 'footer'),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(INITIAL_FOOTER_CONFIG);
      } else {
        onData(snapshot.data() as FooterConfig);
      }
    },
    (error) => {
      console.warn('FooterConfig fallback:', error);
      onData(INITIAL_FOOTER_CONFIG);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveFooterConfig(config: FooterConfig): Promise<void> {
  const path = 'siteConfig/footer';
  try {
    await setDoc(doc(db, 'siteConfig', 'footer'), config, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 9. CONTACT MESSAGES (Inbox for admins)
export function subscribeContactMessages(
  onData: (messages: ContactMessage[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'contactMessages';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        ...(d.data() as ContactMessage),
        id: d.id,
      }));
      // Sort newest first
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      onData(items);
    },
    (error) => {
      console.warn('ContactMessages error (restricted to admins):', error);
      if (onError) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function sendContactMessage(
  data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const id = 'msg-' + Date.now();
  const path = `contactMessages/${id}`;
  const record: ContactMessage = {
    ...data,
    id,
    status: 'new',
    createdAt: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  try {
    await setDoc(doc(db, 'contactMessages', id), record);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateMessageStatus(
  id: string,
  status: 'new' | 'read' | 'replied'
): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await setDoc(doc(db, 'contactMessages', id), { status }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await deleteDoc(doc(db, 'contactMessages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 10. NEWSLETTER & MAILING
export async function registerSubscriber(email: string): Promise<void> {
  const sanitized = email.trim().toLowerCase().replace(/[^a-zA-Z0-9_\\-]/g, '_');
  const id = `sub-${sanitized}-${Date.now()}`;
  const path = `subscribers/${id}`;
  try {
    await setDoc(doc(db, 'subscribers', id), {
      email,
      subscribedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// 11. SEED INITIAL DATA TO FIRESTORE IF USER IS SUPERADMIN / ADMIN
export async function seedFirestoreWithDefaults(): Promise<{ count: number; error?: string }> {
  if (!auth.currentUser) {
    console.warn('Seeding Firestore ignoré : L\'administrateur doit être authentifié avec son compte Google.');
    return { count: 0, error: 'Authentification Google requise pour synchroniser Firestore.' };
  }

  let count = 0;
  const seedPath = 'seed';
  try {
    // 1. Seed Superadmin profile in admins collection first to establish permissions
    if (auth.currentUser?.uid) {
      await setDoc(
        doc(db, 'admins', auth.currentUser.uid),
        {
          id: auth.currentUser.uid,
          email: auth.currentUser.email || 'admdo.association@gmail.com',
          role: 'superadmin',
          name: auth.currentUser.displayName || 'Super Administrateur ADMDO',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
      count++;
    }

    // 2. Seed News
    for (const item of INITIAL_NEWS) {
      await setDoc(doc(db, 'news', item.id), item, { merge: true });
      count++;
    }
    // 3. Seed Meetings
    for (const item of INITIAL_MEETINGS) {
      await setDoc(doc(db, 'meetings', item.id), item, { merge: true });
      count++;
    }
    // 4. Seed Videos
    for (const item of INITIAL_VIDEOS) {
      await setDoc(doc(db, 'videos', item.id), item, { merge: true });
      count++;
    }
    // 5. Seed Sections
    for (const item of INITIAL_CUSTOM_SECTIONS) {
      await setDoc(doc(db, 'customSections', item.id), item, { merge: true });
      count++;
    }
    // 6. Seed Donation Buttons
    for (const item of INITIAL_DONATION_BUTTONS) {
      await setDoc(doc(db, 'donationButtons', item.id), item, { merge: true });
      count++;
    }
    // 7. Seed Photos
    for (const item of INITIAL_GALLERY_PHOTOS) {
      await setDoc(doc(db, 'photos', item.id), item, { merge: true });
      count++;
    }
    // 8. Seed Documents
    for (const item of INITIAL_DOCUMENTS) {
      await setDoc(doc(db, 'documents', item.id), item, { merge: true });
      count++;
    }
    // 9. Seed Footer
    await setDoc(doc(db, 'siteConfig', 'footer'), INITIAL_FOOTER_CONFIG, { merge: true });
    count++;
  } catch (error) {
    console.error('Erreur lors de la synchronisation Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, seedPath);
  }
  return { count };
}

// --- CONVENIENCE CRUD ALIASES & HELPERS FOR APP ---

// News
export async function createNews(data: Omit<NewsArticle, 'id'>): Promise<NewsArticle> {
  const id = 'news-' + Date.now();
  const item: NewsArticle = { ...data, id };
  await saveNewsItem(item);
  return item;
}

export async function updateNews(id: string, partial: Partial<NewsArticle>): Promise<void> {
  const path = `news/${id}`;
  try {
    await setDoc(doc(db, 'news', id), partial, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export const deleteNews = deleteNewsItem;

// Meetings
export async function createMeeting(data: Omit<MeetingItem, 'id'>): Promise<MeetingItem> {
  const id = 'meet-' + Date.now();
  const item: MeetingItem = { ...data, id };
  await saveMeetingItem(item);
  return item;
}

export async function updateMeeting(id: string, partial: Partial<MeetingItem>): Promise<void> {
  const path = `meetings/${id}`;
  try {
    await setDoc(doc(db, 'meetings', id), partial, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export const deleteMeeting = deleteMeetingItem;

// Videos
export async function createVideo(data: Omit<HomeVideo, 'id'>): Promise<HomeVideo> {
  const id = 'vid-' + Date.now();
  const item: HomeVideo = { ...data, id };
  await saveVideoItem(item);
  return item;
}

export async function updateVideo(id: string, partial: Partial<HomeVideo>): Promise<void> {
  const path = `videos/${id}`;
  try {
    await setDoc(doc(db, 'videos', id), partial, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export const deleteVideo = deleteVideoItem;

// Custom Sections
export async function createCustomSection(data: Omit<CustomSection, 'id'>): Promise<CustomSection> {
  const id = 'sec-' + Date.now();
  const item: CustomSection = { ...data, id };
  await saveCustomSectionItem(item);
  return item;
}

export async function updateCustomSection(id: string, partial: Partial<CustomSection>): Promise<void> {
  const path = `customSections/${id}`;
  try {
    await setDoc(doc(db, 'customSections', id), partial, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export const deleteCustomSection = deleteCustomSectionItem;

// Donation Buttons
export async function createDonationButton(data: Omit<DonationButtonConfig, 'id'>): Promise<DonationButtonConfig> {
  const id = 'don-' + Date.now();
  const item: DonationButtonConfig = { ...data, id };
  await saveDonationButtonItem(item);
  return item;
}

export async function updateDonationButton(id: string, partial: Partial<DonationButtonConfig>): Promise<void> {
  const path = `donationButtons/${id}`;
  try {
    await setDoc(doc(db, 'donationButtons', id), partial, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export const deleteDonationButton = deleteDonationButtonItem;

// Gallery / Photos
export const subscribeGallery = subscribePhotos;

export async function createGalleryPhoto(data: Omit<GalleryPhoto, 'id'>): Promise<GalleryPhoto> {
  const id = 'photo-' + Date.now();
  const item: GalleryPhoto = { ...data, id };
  await savePhotoItem(item);
  return item;
}

export const deleteGalleryPhoto = deletePhotoItem;

// Documents
export async function createDocument(data: Omit<PartnerDocument, 'id'>): Promise<PartnerDocument> {
  const id = 'doc-' + Date.now();
  const item: PartnerDocument = { ...data, id };
  await saveDocumentItem(item);
  return item;
}

export const deleteDocument = deleteDocumentItem;

// Footer
export const updateFooterConfig = saveFooterConfig;

// Contact Messages
export async function createContactMessage(data: {
  name: string;
  contact: string;
  subject?: string;
  message: string;
  date?: string;
}): Promise<string> {
  const id = 'msg-' + Date.now();
  const path = `contactMessages/${id}`;
  const record: ContactMessage = {
    id,
    name: data.name,
    contact: data.contact,
    subject: data.subject,
    message: data.message,
    status: 'new',
    createdAt: data.date || new Date().toISOString(),
    date: data.date || new Date().toLocaleDateString('fr-FR'),
  };
  try {
    await setDoc(doc(db, 'contactMessages', id), record);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return id;
  }
}

export async function clearAllContactMessages(): Promise<void> {
  const path = 'contactMessages';
  try {
    const snap = await getDocs(collection(db, path));
    const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
