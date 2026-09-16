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

// Local Storage keys for permanent connection & token persistence
export const TOKEN_KEY = 'dkp_drive_token';
export const TOKEN_EXPIRY_KEY = 'dkp_drive_token_expiry';
export const USER_PROFILE_KEY = 'dkp_drive_user_profile';
export const GOOGLE_LINKED_KEY = 'dkp_drive_google_linked';

export interface StoredUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
  description?: string;
  webViewLink?: string;
}

/**
 * Retrieve saved user profile from localStorage
 */
export const getStoredUserProfile = (): StoredUserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore parse error
  }
  return null;
};

/**
 * Persist user profile and permanent linked state
 */
export const setStoredUserProfile = (profile: StoredUserProfile | null) => {
  try {
    if (profile) {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(GOOGLE_LINKED_KEY, 'true');
    } else {
      localStorage.removeItem(USER_PROFILE_KEY);
      localStorage.removeItem(GOOGLE_LINKED_KEY);
    }
  } catch (e) {
    // Ignore storage errors
  }
};

/**
 * Check if the user has permanently linked their Google Account
 */
export const isGoogleLinked = (): boolean => {
  try {
    return (
      Boolean(auth.currentUser) ||
      localStorage.getItem(GOOGLE_LINKED_KEY) === 'true' ||
      Boolean(getStoredUserProfile())
    );
  } catch {
    return false;
  }
};

/**
 * Retrieve stored Google OAuth token (does NOT proactively delete on expiry to prevent jarring logouts)
 */
export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

/**
 * Check if the stored token has passed its expiry window
 */
export const isTokenExpired = (): boolean => {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    // Mark expired 2 minutes before actual expiration
    return Date.now() >= (parseInt(expiry, 10) - 2 * 60 * 1000);
  } catch {
    return true;
  }
};

/**
 * Store Google OAuth access token with expiration timestamp
 */
export const setStoredToken = (token: string | null, expiresInSeconds: number = 3600) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + expiresInSeconds * 1000).toString());
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  } catch (e) {
    // Ignore storage errors
  }
};

// In-memory token cache
let cachedAccessToken: string | null = getStoredToken();
let isSigningIn = false;

/**
 * Create Google Auth Provider with offline access and email hint
 */
export const createGoogleProvider = (emailHint?: string) => {
  const provider = new GoogleAuthProvider();
  DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));
  const params: Record<string, string> = {
    access_type: 'offline',
    include_granted_scopes: 'true'
  };
  if (emailHint) {
    params.login_hint = emailHint;
  }
  provider.setCustomParameters(params);
  return provider;
};

/**
 * Initialize Google Auth State listener.
 * Preserves user connection permanently across app reloads, tab switches, and offline modes.
 */
export const initAuth = (
  onAuthSuccess?: (user: User | StoredUserProfile, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  // 1. Immediately emit existing linked profile from localStorage (prevents blank/flickering states)
  const existingProfile = getStoredUserProfile();
  const existingToken = getStoredToken();
  if (isGoogleLinked() && existingProfile) {
    if (onAuthSuccess) onAuthSuccess(auth.currentUser || existingProfile, existingToken);
  }

  // 2. Listen to Firebase auth state changes
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const profile: StoredUserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      setStoredUserProfile(profile);

      const token = cachedAccessToken || getStoredToken();

      if (onAuthSuccess) {
        onAuthSuccess(user, token);
      }
    } else {
      // Firebase auth instance is currently null (e.g., initial boot or offline)
      if (isGoogleLinked()) {
        const prof = getStoredUserProfile();
        if (prof && onAuthSuccess) {
          onAuthSuccess(prof, cachedAccessToken || getStoredToken());
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

/**
 * Google Sign In with Popup
 */
export const googleSignIn = async (
  isReauth: boolean = false
): Promise<{ user: User | StoredUserProfile; accessToken: string }> => {
  try {
    isSigningIn = true;
    const emailHint = auth.currentUser?.email || getStoredUserProfile()?.email || undefined;
    const provider = createGoogleProvider(isReauth ? emailHint : undefined);

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google access token not received');
    }

    cachedAccessToken = credential.accessToken;
    setStoredToken(cachedAccessToken, 3600);

    const profile: StoredUserProfile = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
    setStoredUserProfile(profile);

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current access token
 */
export const getAccessToken = (): string | null => {
  return cachedAccessToken || getStoredToken();
};

/**
 * Ensures a valid access token is available, automatically refreshing if needed
 */
export const getOrRefreshAccessToken = async (interactive: boolean = false): Promise<string> => {
  // If active and valid, return immediately
  if (cachedAccessToken && !isTokenExpired()) {
    return cachedAccessToken;
  }

  const stored = getStoredToken();
  if (stored && !isTokenExpired()) {
    cachedAccessToken = stored;
    return stored;
  }

  // If we still have stored token, attempt to use it
  if (stored) {
    cachedAccessToken = stored;
    return stored;
  }

  // If interactive mode is permitted (e.g. user initiated 1-click backup/restore/sync)
  if (interactive) {
    const res = await googleSignIn(true);
    return res.accessToken;
  }

  throw new Error('Google Drive session expired. Please sign in to reconnect.');
};

/**
 * Explicit user-triggered Sign Out — permanently disconnects Google account
 */
export const googleSignOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('[Google Drive] Firebase sign out error:', e);
  }
  cachedAccessToken = null;
  setStoredToken(null);
  setStoredUserProfile(null);
};

/**
 * Check if currently authenticated with Google Drive token
 */
export const isDriveAuthenticated = (): boolean => {
  return isGoogleLinked() && Boolean(getAccessToken());
};

/**
 * Wraps Drive API calls with automatic 401 retry & token self-healing
 */
async function executeDriveRequest(
  requestFn: (token: string) => Promise<Response>,
  interactiveOnFail: boolean = true
): Promise<Response> {
  let token = await getOrRefreshAccessToken(false).catch(() => getAccessToken() || '');
  if (!token) {
    token = await getOrRefreshAccessToken(interactiveOnFail);
  }

  let res = await requestFn(token);
  if (res.status === 401) {
    console.warn('[Google Drive] Token expired (401).');
    if (interactiveOnFail) {
      // Re-authenticate seamlessly with login_hint
      const reauth = await googleSignIn(true);
      token = reauth.accessToken;
      res = await requestFn(token);
    }
  }
  return res;
}

export const BACKUP_FILE_NAME = 'daily-khata-pro-cloud-backup.json';
export const AUTO_SYNC_FILE_NAME = 'daily-khata-pro-auto-sync.json';

/**
 * List existing Daily Khata Pro backups on Google Drive
 */
export const listDriveBackups = async (interactiveOnFail: boolean = true): Promise<DriveFileInfo[]> => {
  const query = encodeURIComponent(
    "trashed = false and (name contains 'daily-khata-pro' or name contains 'Daily Khata')"
  );
  const fields = encodeURIComponent('files(id, name, modifiedTime, size, description, webViewLink)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime desc`;

  const res = await executeDriveRequest(
    (token) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    interactiveOnFail
  );

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
  // Find if this specific file already exists on user's drive
  const existingFiles = await listDriveBackups(!isAutoSync).catch(() => []);
  const targetFile = existingFiles.find((f) => f.name === fileName);

  const totalEntries = Array.isArray(backupData?.entries) ? backupData.entries.length : 0;
  const now = new Date();
  const description = `${isAutoSync ? 'Auto-Sync' : '1-Click Backup'} — ${totalEntries} transactions | Updated: ${now.toLocaleString()}`;

  const jsonContent = JSON.stringify(backupData, null, 2);

  if (targetFile?.id) {
    // Update existing file content
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${targetFile.id}?uploadType=media`;
    const res = await executeDriveRequest(
      (token) =>
        fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: jsonContent
        }),
      !isAutoSync // In background auto-sync, don't pop up unless interactive
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || 'Failed to update Google Drive file');
    }

    // Update metadata (description and timestamp)
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${targetFile.id}?fields=id,name,modifiedTime,webViewLink`;
    const metaRes = await executeDriveRequest(
      (token) =>
        fetch(metaUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ description })
        }),
      !isAutoSync
    );

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

    const res = await executeDriveRequest(
      (token) =>
        fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime,webViewLink',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartRequestBody
          }
        ),
      !isAutoSync
    );

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
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const res = await executeDriveRequest((token) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  );

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
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const res = await executeDriveRequest((token) =>
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  );

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete backup file (${res.status})`);
  }
};

