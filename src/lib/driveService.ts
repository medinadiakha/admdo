import { ContactFormData, DriveFileItem, StoredMessageRecord } from '../types';

const FOLDER_NAME = 'Formulaire de Contact - Messages';

/**
 * Searches for or creates a dedicated directory in Google Drive.
 */
export async function getOrCreateFolder(
  accessToken: string,
  folderName = FOLDER_NAME
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const query = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName.replace(
    /'/g,
    "\\'"
  )}' and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,webViewLink)&spaces=drive`;

  const searchRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!searchRes.ok) {
    const errText = await searchRes.text();
    throw new Error(`Échec de la recherche du dossier Drive: ${searchRes.status} ${errText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return {
      id: searchData.files[0].id,
      name: searchData.files[0].name,
      webViewLink: searchData.files[0].webViewLink,
    };
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Dossier créé automatiquement pour stocker les messages du formulaire de contact.',
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Échec de la création du dossier Drive: ${createRes.status} ${errText}`);
  }

  const newFolder = await createRes.json();
  return {
    id: newFolder.id,
    name: newFolder.name,
    webViewLink: newFolder.webViewLink,
  };
}

/**
 * Helper to upload a file via multipart upload into Google Drive
 */
async function uploadMultipartFile(
  accessToken: string,
  metadata: { name: string; parents?: string[]; mimeType?: string; description?: string },
  content: Blob | string,
  contentType: string
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const boundary = `-------DriveBoundary${Date.now()}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataString = JSON.stringify(metadata);

  let bodyBlob: Blob;

  if (typeof content === 'string') {
    const multipartBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      metadataString +
      delimiter +
      `Content-Type: ${contentType}\r\n\r\n` +
      content +
      closeDelimiter;

    bodyBlob = new Blob([multipartBody], { type: `multipart/related; boundary=${boundary}` });
  } else {
    // Blob/File content
    const headerPart =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      metadataString +
      delimiter +
      `Content-Type: ${contentType}\r\n\r\n`;

    bodyBlob = new Blob([headerPart, content, closeDelimiter], {
      type: `multipart/related; boundary=${boundary}`,
    });
  }

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,size,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: bodyBlob,
    }
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Erreur Drive lors de l'envoi du fichier: ${uploadRes.status} ${errorText}`);
  }

  return await uploadRes.json();
}

/**
 * Saves a contact form message to Google Drive
 */
export async function saveContactMessageToDrive(
  accessToken: string,
  formData: ContactFormData,
  attachment?: File | null
): Promise<{
  fileId: string;
  folderId: string;
  viewLink?: string;
  attachmentId?: string;
  record: StoredMessageRecord;
}> {
  // 1. Ensure Folder exists
  const folder = await getOrCreateFolder(accessToken);
  const now = new Date();
  const timestampIso = now.toISOString();
  const dateFormatted = now.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-');
  const timeFormatted = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(/:/g, '-');

  const safeName = formData.fullName
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 30);

  const messageRecordId = `msg_${Date.now()}`;

  // Optional attachment upload
  let attachmentId: string | undefined;
  if (attachment) {
    const attachMeta = {
      name: `PJ_${safeName}_${attachment.name}`,
      parents: [folder.id],
      description: `Pièce jointe du message de ${formData.fullName} (${formData.subject})`,
    };
    const attachResult = await uploadMultipartFile(
      accessToken,
      attachMeta,
      attachment,
      attachment.type || 'application/octet-stream'
    );
    attachmentId = attachResult.id;
  }

  // Structured record
  const record: StoredMessageRecord = {
    ...formData,
    id: messageRecordId,
    submittedAt: timestampIso,
    driveFolderId: folder.id,
    hasAttachment: !!attachment,
    attachmentName: attachment ? attachment.name : undefined,
  };

  // Text representation for human readability inside Drive
  const humanReadableContent = `======================================================================
FORMULAIRE DE CONTACT - RÉCEPTION D'UN NOUVEAU MESSAGE
======================================================================
Identifiant Message : ${messageRecordId}
Date d'envoi        : ${now.toLocaleString('fr-FR')}
Nom Complet         : ${formData.fullName}
Adresse Email       : ${formData.email}
Téléphone           : ${formData.phone || 'Non renseigné'}
Catégorie           : ${formData.category}
Priorité            : ${formData.priority}
Objet               : ${formData.subject}
Pièce jointe        : ${attachment ? `${attachment.name} (${Math.round(attachment.size / 1024)} Ko)` : 'Aucune'}

----------------------------------------------------------------------
CONTENU DU MESSAGE :
----------------------------------------------------------------------
${formData.message}

======================================================================
Données brutes JSON :
${JSON.stringify(record, null, 2)}
======================================================================`;

  const fileName = `Message_${dateFormatted}_${timeFormatted}_${safeName}.txt`;

  const uploadResult = await uploadMultipartFile(
    accessToken,
    {
      name: fileName,
      parents: [folder.id],
      description: `Message reçu de ${formData.fullName} - ${formData.subject} [${formData.priority}]`,
      mimeType: 'text/plain',
    },
    humanReadableContent,
    'text/plain; charset=UTF-8'
  );

  record.driveFileId = uploadResult.id;
  record.driveViewLink = uploadResult.webViewLink;

  return {
    fileId: uploadResult.id,
    folderId: folder.id,
    viewLink: uploadResult.webViewLink,
    attachmentId,
    record,
  };
}

/**
 * Lists messages stored in the Google Drive folder
 */
export async function listDriveMessages(accessToken: string): Promise<{
  folderId?: string;
  folderViewLink?: string;
  files: DriveFileItem[];
}> {
  const folder = await getOrCreateFolder(accessToken);
  const query = `'${folder.id}' in parents and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,createdTime,size,webViewLink,description)&orderBy=createdTime+desc&pageSize=50`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erreur lors de la récupération des fichiers Drive: ${res.status} ${err}`);
  }

  const data = await res.json();
  return {
    folderId: folder.id,
    folderViewLink: folder.webViewLink,
    files: data.files || [],
  };
}

/**
 * Reads content of a text file from Google Drive
 */
export async function readDriveFileContent(accessToken: string, fileId: string): Promise<string> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Impossible de lire le fichier Drive: ${res.status}`);
  }

  return await res.text();
}

/**
 * Permanently deletes a file from Drive (Must only be called after explicit user confirmation)
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(`Échec de suppression du fichier: ${res.status} ${err}`);
  }
}
