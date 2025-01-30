import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyB5I3XLbpaTEN2L_aCWHXScdvAdUk7UqRM',
	authDomain: 'todolistdeploy.firebaseapp.com',
	projectId: 'todolistdeploy',
	storageBucket: 'todolistdeploy.firebasestorage.app',
	messagingSenderId: '53973149101',
	appId: '1:53973149101:web:6aa4d0e89afa0be1ff6d24',
	databaseURL: 'https://todolistdeploy-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
// ===================================================
