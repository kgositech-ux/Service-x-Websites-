import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, ProjectItem, ActivityItem } from '../types';

export const INITIAL_SAMPLE_USERS: UserProfile[] = [
  {
    uid: 'user_alex_morgan',
    email: 'alex.morgan@techscale.io',
    displayName: 'Alex Morgan',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'client',
    company: 'TechScale Ventures',
    bio: 'Founder at TechScale. Overseeing website expansion and e-commerce portal redesign.',
    phone: '+1 (415) 890-1234',
    status: 'active',
    createdAt: '2026-09-12T10:30:00Z',
    updatedAt: '2026-10-01T14:20:00Z',
    lastLoginAt: '2026-10-10T02:15:00Z',
  },
  {
    uid: 'user_sarah_chen',
    email: 'sarah.chen@luminahealth.com',
    displayName: 'Dr. Sarah Chen',
    photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    role: 'client',
    company: 'Lumina Health Systems',
    bio: 'Head of Digital Communications. Modernizing patient booking and medical website.',
    phone: '+1 (212) 555-7890',
    status: 'active',
    createdAt: '2026-09-18T08:45:00Z',
    updatedAt: '2026-10-05T09:10:00Z',
    lastLoginAt: '2026-10-09T18:40:00Z',
  },
  {
    uid: 'user_marcus_vance',
    email: 'marcus.vance@apexretail.co',
    displayName: 'Marcus Vance',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    role: 'client',
    company: 'Apex Retail Brands',
    bio: 'VP of Marketing. High-converting Shopify and custom Next.js storefront deployment.',
    phone: '+1 (312) 440-9182',
    status: 'active',
    createdAt: '2026-09-24T11:20:00Z',
    updatedAt: '2026-10-04T16:30:00Z',
    lastLoginAt: '2026-10-08T12:00:00Z',
  },
  {
    uid: 'user_elena_rostova',
    email: 'elena@nordicstudio.design',
    displayName: 'Elena Rostova',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    role: 'developer',
    company: 'Service4Websites Design Team',
    bio: 'Lead frontend architect specializing in motion UI, accessible design systems, and WebGL.',
    phone: '+44 20 7946 0912',
    status: 'active',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-10-02T11:45:00Z',
    lastLoginAt: '2026-10-10T04:10:00Z',
  },
  {
    uid: 'user_david_park',
    email: 'david.park@greenleaf-energy.com',
    displayName: 'David Park',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    role: 'client',
    company: 'GreenLeaf Clean Energy',
    bio: 'Sustainability Director. Enterprise ESG reporting portal and customer landing pages.',
    phone: '+1 (503) 721-4321',
    status: 'pending',
    createdAt: '2026-10-08T15:20:00Z',
    updatedAt: '2026-10-08T15:20:00Z',
    lastLoginAt: '2026-10-08T15:20:00Z',
  },
];

export const INITIAL_SAMPLE_PROJECTS: (currentUserId: string) => ProjectItem[] = (currentUserId) => [
  {
    id: 'proj_ecommerce_apex',
    title: 'Apex Luxury Apparel E-Commerce Storefront',
    clientName: 'Apex Retail Brands',
    clientEmail: 'marcus.vance@apexretail.co',
    ownerId: currentUserId,
    category: 'E-Commerce Platform',
    status: 'in_progress',
    budget: 28500,
    deadline: '2026-11-15',
    description: 'High-speed headless e-commerce store with Algolia search, custom checkout, and 99+ mobile performance score.',
    driveSyncStatus: 'synced',
    driveFileId: 'drive_apex_docs_01',
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-10-07T14:30:00Z',
  },
  {
    id: 'proj_lumina_portal',
    title: 'Lumina Patient Portal & Clinic Directory',
    clientName: 'Lumina Health Systems',
    clientEmail: 'sarah.chen@luminahealth.com',
    ownerId: currentUserId,
    category: 'Web Application',
    status: 'review',
    budget: 42000,
    deadline: '2026-10-30',
    description: 'HIPAA-compliant web platform for doctor scheduling, telemedicine triage, and patient resource hub.',
    driveSyncStatus: 'synced',
    driveFileId: 'drive_lumina_docs_02',
    createdAt: '2026-09-20T09:15:00Z',
    updatedAt: '2026-10-08T16:00:00Z',
  },
  {
    id: 'proj_techscale_brand',
    title: 'TechScale Corporate Rebrand & SaaS Website',
    clientName: 'TechScale Ventures',
    clientEmail: 'alex.morgan@techscale.io',
    ownerId: currentUserId,
    category: 'Corporate Website',
    status: 'in_progress',
    budget: 19500,
    deadline: '2026-11-01',
    description: 'B2B enterprise SaaS website featuring interactive product demos, pricing calculator, and HubSpot CRM integration.',
    driveSyncStatus: 'not_synced',
    createdAt: '2026-09-28T12:00:00Z',
    updatedAt: '2026-10-06T11:15:00Z',
  },
  {
    id: 'proj_greenleaf_seo',
    title: 'GreenLeaf Clean Energy Growth Funnel & SEO Overhaul',
    clientName: 'GreenLeaf Clean Energy',
    clientEmail: 'david.park@greenleaf-energy.com',
    ownerId: currentUserId,
    category: 'SEO Optimization',
    status: 'planning',
    budget: 12000,
    deadline: '2026-12-01',
    description: 'Targeted lead generation landing pages, Core Web Vitals optimization, and national keyword authority strategy.',
    driveSyncStatus: 'not_synced',
    createdAt: '2026-10-08T16:00:00Z',
    updatedAt: '2026-10-08T16:00:00Z',
  },
  {
    id: 'proj_urban_bistro',
    title: 'Urban Bistro Culinary Website & Online Reservations',
    clientName: 'Urban Hospitality Group',
    clientEmail: 'reservations@urbanbistro.com',
    ownerId: currentUserId,
    category: 'Landing Page & Booking',
    status: 'completed',
    budget: 9800,
    deadline: '2026-09-30',
    description: 'Atmospheric restaurant website with OpenTable sync, seasonal menu viewer, and private event inquiry portal.',
    driveSyncStatus: 'synced',
    driveFileId: 'drive_urban_bistro_03',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-30T18:00:00Z',
  },
];

export const INITIAL_SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_101',
    type: 'project_updated',
    title: 'Apex Luxury Apparel E-Commerce Storefront',
    description: 'Status advanced to in_progress with high-speed headless checkout.',
    actorName: 'Alex Morgan',
    actorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    targetId: 'proj_ecommerce_apex',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'act_102',
    type: 'drive_synced',
    title: 'Google Drive Project Synchronized',
    description: 'Apex Luxury Apparel deliverables and specs backed up to Google Drive.',
    actorName: 'Marcus Vance',
    actorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    targetId: 'proj_ecommerce_apex',
    createdAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
  },
  {
    id: 'act_103',
    type: 'project_created',
    title: 'Lumina Patient Portal & Clinic Directory',
    description: 'New healthcare web portal project initiated with $42,000 budget.',
    actorName: 'Dr. Sarah Chen',
    actorPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    targetId: 'proj_lumina_portal',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act_104',
    type: 'user_signup',
    title: 'New Client Partner Onboarded',
    description: 'David Park (GreenLeaf Clean Energy) registered in the agency portal.',
    actorName: 'David Park',
    actorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    targetId: 'user_david_park',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act_105',
    type: 'profile_updated',
    title: 'Profile Picture & Bio Customized',
    description: 'Elena Rostova updated lead frontend designer bio and portfolio photo.',
    actorName: 'Elena Rostova',
    actorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    targetId: 'user_elena_rostova',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act_106',
    type: 'project_completed',
    title: 'Urban Bistro Culinary Website',
    description: 'Project marked completed and launched with OpenTable reservation sync.',
    actorName: 'Alex Morgan',
    actorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    targetId: 'proj_urban_bistro',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

/**
 * Ensures initial database collections are seeded if empty
 */
export async function seedInitialDataIfEmpty(currentUserId?: string) {
  if (!currentUserId || currentUserId === 'guest' || !auth.currentUser) {
    return;
  }
  try {
    // Check if users collection has documents
    const usersSnap = await getDocs(collection(db, 'users'));
    if (usersSnap.empty) {
      for (const u of INITIAL_SAMPLE_USERS) {
        await setDoc(doc(db, 'users', u.uid), u);
      }
    }

    // Check if projects collection has documents
    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty) {
      const sampleProjects = INITIAL_SAMPLE_PROJECTS(currentUserId);
      for (const p of sampleProjects) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
    }

    // Check if activities collection has documents
    const actSnap = await getDocs(collection(db, 'activities'));
    if (actSnap.empty) {
      for (const a of INITIAL_SAMPLE_ACTIVITIES) {
        await setDoc(doc(db, 'activities', a.id), a);
      }
    }
  } catch (err) {
    console.warn('Seeding check complete or skipped:', err);
  }
}
