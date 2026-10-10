import { doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { ActivityItem } from '../types';

export async function logActivity(
  activity: Omit<ActivityItem, 'id' | 'createdAt'> & { id?: string }
): Promise<void> {
  const currentUser = auth.currentUser;
  const activityId = activity.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const payload: ActivityItem = {
    id: activityId,
    type: activity.type,
    title: activity.title,
    description: activity.description || '',
    actorName: activity.actorName || currentUser?.displayName || 'Team Member',
    actorPhoto:
      activity.actorPhoto ||
      currentUser?.photoURL ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.uid || 'guest'}`,
    targetId: activity.targetId || '',
    createdAt: new Date().toISOString(),
  };

  try {
    if (currentUser) {
      await setDoc(doc(db, 'activities', activityId), payload);
    }
  } catch (error) {
    console.warn('Could not record activity to Firestore:', error);
  }
}
