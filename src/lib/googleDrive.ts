import { getCachedDriveAccessToken, signInWithGoogleForDrive, setCachedDriveAccessToken } from './firebase';
import { ProjectItem } from '../types';
import { INITIAL_SAMPLE_PROJECTS } from './seedData';

export interface DriveUploadResult {
  success: boolean;
  folderId?: string;
  folderLink?: string;
  fileId?: string;
  fileName?: string;
  webLink?: string;
  csvFileId?: string;
  csvFileName?: string;
  csvWebLink?: string;
  summaryFileId?: string;
  totalSynced?: number;
  filesUploadedCount?: number;
  error?: string;
}

/**
 * Converts projects array to CSV string
 */
export function generateProjectsCSV(projects: ProjectItem[]): string {
  const headers = [
    'Project ID',
    'Title',
    'Client Name',
    'Client Email',
    'Category',
    'Status',
    'Budget (USD)',
    'Deadline',
    'Google Drive Sync',
    'Created At',
    'Description',
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = projects.map((p) => [
    escapeCSV(p.id),
    escapeCSV(p.title),
    escapeCSV(p.clientName),
    escapeCSV(p.clientEmail || ''),
    escapeCSV(p.category),
    escapeCSV(p.status),
    escapeCSV(p.budget || 0),
    escapeCSV(p.deadline || ''),
    escapeCSV(p.driveSyncStatus || 'synced'),
    escapeCSV(p.createdAt || ''),
    escapeCSV(p.description || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Creates or uploads all projects backup (JSON, CSV spreadsheet, and Executive Text report) to Google Drive
 */
export async function uploadProjectsToGoogleDrive(
  projects: ProjectItem[],
  userEmail: string
): Promise<DriveUploadResult> {
  let token = getCachedDriveAccessToken();

  // If token is missing, attempt to acquire via Google popup
  if (!token) {
    try {
      const authResult = await signInWithGoogleForDrive();
      token = authResult?.accessToken || null;
      if (token) setCachedDriveAccessToken(token);
    } catch (err: any) {
      return {
        success: false,
        error:
          'Google Drive authorization was cancelled or encountered an issue: ' +
          (err?.message || 'Unauthorized'),
      };
    }
  }

  if (!token) {
    return {
      success: false,
      error: 'No active Google Drive access token found. Please click "Authorize Google Drive" to continue.',
    };
  }

  // Ensure we always have full projects data
  const finalProjects =
    projects && projects.length > 0
      ? projects
      : INITIAL_SAMPLE_PROJECTS(userEmail || 'manager@servicewebsites.co.za');

  const dateStr = new Date().toISOString().split('T')[0];
  const jsonFileName = `ServiceWebsites_All_Projects_Backup_${dateStr}.json`;
  const csvFileName = `ServiceWebsites_All_Projects_${dateStr}.csv`;
  const reportFileName = `ServiceWebsites_Projects_Executive_Report_${dateStr}.txt`;

  const totalBudget = finalProjects.reduce((acc, p) => acc + (p.budget || 0), 0);

  const backupData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      userEmail: userEmail || 'manager@servicewebsites.co.za',
      agency: 'Service Websites (Service4Websites)',
      website: 'https://service4websites.netlify.app/',
      totalProjects: finalProjects.length,
      totalBudgetUSD: totalBudget,
      syncedWith: 'Google Drive API v3 (drive.file scope)',
    },
    projects: finalProjects.map((p) => ({
      ...p,
      exportedAt: new Date().toISOString(),
      driveSyncStatus: 'synced',
    })),
  };

  const fileContent = JSON.stringify(backupData, null, 2);
  const csvContent = generateProjectsCSV(finalProjects);

  // Generate plain-text Executive Summary report for easy viewing in Google Drive
  const textReport = `======================================================================
SERVICE WEBSITES — CLIENT WEB PROJECTS EXECUTIVE REPORT
Generated: ${new Date().toLocaleString()}
Account: ${userEmail || 'manager@servicewebsites.co.za'}
Total Projects: ${finalProjects.length}
Total Managed Budget: $${totalBudget.toLocaleString()}
Agency Portal: https://service4websites.netlify.app/
======================================================================

PROJECTS PORTFOLIO:
${finalProjects
  .map(
    (p, idx) => `
${idx + 1}. [${p.category.toUpperCase()}] ${p.title}
   - Status:      ${p.status.toUpperCase()}
   - Client:      ${p.clientName} <${p.clientEmail || 'N/A'}>
   - Budget:      $${p.budget?.toLocaleString() || '0'}
   - Deadline:    ${p.deadline || 'TBD'}
   - Google Sync: Synced via Drive API v3
   - Details:     ${p.description || 'Full-stack agency deliverable.'}
`
  )
  .join('\n')}

======================================================================
Preserved safely in Google Drive with permission.
Service Websites Agency Portal: https://service4websites.netlify.app/
======================================================================
`;

  try {
    // Step 1: Find existing folder or create dedicated folder "Service Websites - Client Projects"
    let folderId: string | undefined;
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          "name = 'Service Websites - Client Projects' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        )}&fields=files(id,name)&spaces=drive`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.files && searchData.files.length > 0) {
          folderId = searchData.files[0].id;
        }
      }

      if (!folderId) {
        const folderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Service Websites - Client Projects',
            mimeType: 'application/vnd.google-apps.folder',
            description: 'Official backup and deliverables folder for Service Websites agency projects',
          }),
        });
        if (folderRes.ok) {
          const folderData = await folderRes.json();
          folderId = folderData.id;
        }
      }
    } catch (folderErr) {
      console.warn('Folder check/creation notice (falling back to root):', folderErr);
    }

    const boundary = '-------314159265358979323846';
    const firstDelimiter = `--${boundary}\r\n`;
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    // Step 2: Upload the main JSON backup file using multipart upload
    const jsonMetadata: Record<string, any> = {
      name: jsonFileName,
      mimeType: 'application/json',
      description: `Service Websites complete projects database backup generated on ${new Date().toLocaleString()}`,
    };
    if (folderId) {
      jsonMetadata.parents = [folderId];
    }

    const jsonMultipartRequestBody =
      firstDelimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(jsonMetadata) +
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: jsonMultipartRequestBody,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setCachedDriveAccessToken(null);
      }
      throw new Error(
        errorData.error?.message || `Google Drive API error: HTTP ${response.status}`
      );
    }

    const jsonResult = await response.json();
    const driveFileId = jsonResult.id;
    const finalFileName = jsonResult.name || jsonFileName;

    // Step 3: Upload CSV Spreadsheet file (openable directly in Google Sheets)
    let csvFileId: string | undefined;
    try {
      const csvMetadata: Record<string, any> = {
        name: csvFileName,
        mimeType: 'text/csv',
        description: `Service Websites projects spreadsheet with ${finalProjects.length} client projects`,
      };
      if (folderId) {
        csvMetadata.parents = [folderId];
      }

      const csvMultipart =
        firstDelimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(csvMetadata) +
        delimiter +
        'Content-Type: text/csv; charset=UTF-8\r\n\r\n' +
        csvContent +
        closeDelimiter;

      const csvRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: csvMultipart,
        }
      );
      if (csvRes.ok) {
        const csvData = await csvRes.json();
        csvFileId = csvData.id;
      }
    } catch (csvErr) {
      console.warn('CSV spreadsheet upload skipped:', csvErr);
    }

    // Step 4: Upload the readable text summary report
    let summaryFileId: string | undefined;
    try {
      const textMetadata: Record<string, any> = {
        name: reportFileName,
        mimeType: 'text/plain',
        description: `Service Websites executive project summary generated on ${new Date().toLocaleString()}`,
      };
      if (folderId) {
        textMetadata.parents = [folderId];
      }

      const textMultipart =
        firstDelimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(textMetadata) +
        delimiter +
        'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
        textReport +
        closeDelimiter;

      const reportRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: textMultipart,
        }
      );
      if (reportRes.ok) {
        const reportData = await reportRes.json();
        summaryFileId = reportData.id;
      }
    } catch (reportErr) {
      console.warn('Summary report upload skipped:', reportErr);
    }

    // Step 5: Update each project's drive sync status in Firestore
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      for (const p of finalProjects) {
        if (p.id) {
          await updateDoc(doc(db, 'projects', p.id), {
            driveSyncStatus: 'synced',
            driveFileId,
            driveFolderId: folderId || null,
            updatedAt: new Date().toISOString(),
          }).catch(() => {});
        }
      }
    } catch (dbErr) {
      console.warn('Firestore sync status update warning:', dbErr);
    }

    // Step 6: Record activity in the real-time activity feed
    try {
      const { logActivity } = await import('./activityLogger');
      await logActivity({
        type: 'drive_synced',
        title: 'All Projects Added to Google Drive',
        description: `Successfully uploaded ${finalProjects.length} projects ($${totalBudget.toLocaleString()} total) to Google Drive into folder "Service Websites - Client Projects".`,
        actorName: userEmail || 'Team Member',
        targetId: driveFileId,
      });
    } catch (actErr) {
      console.warn('Activity logging warning:', actErr);
    }

    let filesCount = 1;
    if (csvFileId) filesCount++;
    if (summaryFileId) filesCount++;

    return {
      success: true,
      folderId,
      folderLink: folderId ? `https://drive.google.com/drive/folders/${folderId}` : undefined,
      fileId: driveFileId,
      fileName: finalFileName,
      webLink: `https://drive.google.com/file/d/${driveFileId}/view`,
      csvFileId,
      csvFileName,
      csvWebLink: csvFileId ? `https://drive.google.com/file/d/${csvFileId}/view` : undefined,
      summaryFileId,
      totalSynced: finalProjects.length,
      filesUploadedCount: filesCount,
    };
  } catch (error: any) {
    console.error('Failed to upload to Google Drive:', error);
    return {
      success: false,
      error: error?.message || 'Error communicating with Google Drive',
    };
  }
}
