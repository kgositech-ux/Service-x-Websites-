export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'client' | 'developer' | 'manager' | 'admin';
  company?: string;
  bio?: string;
  phone?: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  clientName?: string;
  clientEmail?: string;
  ownerId: string;
  category: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  budget?: number;
  deadline?: string;
  description?: string;
  driveSyncStatus?: 'synced' | 'pending' | 'not_synced';
  driveFileId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisitorSession {
  id: string;
  ipMasked: string;
  page: string;
  country: string;
  device: 'desktop' | 'mobile' | 'tablet';
  referrer: string;
  durationSeconds: number;
  isConverted: boolean;
  timestamp: string;
}

export interface TrafficStats {
  activeVisitors: number;
  totalVisitors: number;
  pageViews: number;
  bounceRate: number;
  conversionRate: number;
  conversions: number;
  avgSessionDuration: string;
  dailyTrend: {
    time: string;
    visitors: number;
    pageViews: number;
    conversions: number;
  }[];
  sources: {
    source: string;
    visitors: number;
    conversionRate: number;
    color: string;
  }[];
  devices: {
    device: string;
    percentage: number;
    visitors: number;
  }[];
  topPages: {
    path: string;
    name: string;
    views: number;
    conversion: number;
  }[];
  funnel: {
    step: string;
    count: number;
    dropoff: string;
    rate: number;
  }[];
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'project_updated' | 'project_completed' | 'user_signup' | 'profile_updated' | 'drive_synced';
  title: string;
  description?: string;
  actorName: string;
  actorPhoto?: string;
  targetId?: string;
  createdAt: string;
}

