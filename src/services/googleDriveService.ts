import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth: Auth = getAuth(app);

// Workspace Google Drive Scope
export const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const provider = new GoogleAuthProvider();
DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account'
});

// Cache the access token STRICTLY in memory (Do NOT persist to localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
  description?: string;
  webViewLink?: string;
}

/**
 * Initialize Google Auth State listener.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not yet acquired in memory for this session, user must click Sign in to grant access token
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Google Sign In with Popup
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google access token not received');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory access token
 */
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Sign out and clear in-memory token
 */
export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Check if currently authenticated with Google Drive token
 */
export const isDriveAuthenticated = (): boolean => {
  return Boolean(auth.currentUser && cachedAccessToken);
};

export const BACKUP_FILE_NAME = 'daily-khata-pro-cloud-backup.json';
export const AUTO_SYNC_FILE_NAME = 'daily-khata-pro-auto-sync.json';

/**
 * List existing Daily Khata Pro backups on Google Drive
 */
export const listDriveBackups = async (): Promise<DriveFileInfo[]> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Not authenticated with Google Drive');

  const query = encodeURIComponent(
    "trashed = false and (name contains 'daily-khata-pro' or name contains 'Daily Khata')"
  );
  const fields = encodeURIComponent('files(id, name, modifiedTime, size, description, webViewLink)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google Drive query failed (${res.status})`);
  }

  const data = await res.json();
  return (data.files || []) as DriveFileInfo[];
};

/**
 * Upload or Update Khata Backup to Google Drive
 * Supports both manual 1-click backup and background automatic update
 */
export const uploadBackupToDrive = async (
  backupData: any,
  fileName: string = BACKUP_FILE_NAME,
  isAutoSync: boolean = false
): Promise<{ fileId: string; modifiedTime: string; webViewLink?: string }> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Google Drive access token is missing. Please sign in.');

  // Find if this specific file already exists on user's drive
  const existingFiles = await listDriveBackups().catch(() => []);
  const targetFile = existingFiles.find((f) => f.name === fileName);

  const totalEntries = Array.isArray(backupData?.entries) ? backupData.entries.length : 0;
  const now = new Date();
  const description = `${isAutoSync ? 'Auto-Sync' : '1-Click Backup'} — ${totalEntries} transactions | Updated: ${now.toLocaleString()}`;

  const jsonContent = JSON.stringify(backupData, null, 2);

  if (targetFile?.id) {
    // Update existing file content
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${targetFile.id}?uploadType=media`;
    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: jsonContent
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || 'Failed to update Google Drive file');
    }

    // Update metadata (description and timestamp)
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${targetFile.id}?fields=id,name,modifiedTime,webViewLink`;
    const metaRes = await fetch(metaUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description })
    });

    const metaData = await metaRes.json().catch(() => ({}));
    return {
      fileId: targetFile.id,
      modifiedTime: metaData.modifiedTime || now.toISOString(),
      webViewLink: metaData.webViewLink || targetFile.webViewLink
    };
  } else {
    // Create new file with Multipart upload
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      description
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      jsonContent +
      closeDelim;

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || 'Failed to create Google Drive file');
    }

    const created = await res.json();
    return {
      fileId: created.id,
      modifiedTime: created.modifiedTime || now.toISOString(),
      webViewLink: created.webViewLink
    };
  }
};

/**
 * Fetch and parse backup data from Google Drive by file ID
 */
export const downloadBackupFromDrive = async (fileId: string): Promise<any> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Not authenticated with Google Drive');

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to download backup (${res.status})`);
  }

  const content = await res.json();
  return content;
};

/**
 * Delete a file from Google Drive (Mandatory user confirmation required by caller!)
 */
export const deleteBackupFromDrive = async (fileId: string): Promise<void> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Not authenticated with Google Drive');

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete backup file (${res.status})`);
  }
};
