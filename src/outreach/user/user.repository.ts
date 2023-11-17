import { firestore } from '../../firestore.service';

export const UserRepository = firestore.collection('outreach_user');
