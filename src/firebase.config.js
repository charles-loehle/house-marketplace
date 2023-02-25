import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyD_qpbtbKieAP7QAMr4Tun_Vo7xXtWy6i4',
	authDomain: 'house-marketplace-app-9bcdc.firebaseapp.com',
	projectId: 'house-marketplace-app-9bcdc',
	storageBucket: 'house-marketplace-app-9bcdc.appspot.com',
	messagingSenderId: '1025997357259',
	appId: '1:1025997357259:web:99f95bb6cd77fe12799b4e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
