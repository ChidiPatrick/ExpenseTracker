// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getFirestore,
  setDoc,
  collection,
  addDoc,
  doc,
  getDocs
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
const firebaseConfig = {
  apiKey: 'AIzaSyDi-BKnorTSiEJSH-n2kS3zBvRAhu5VSts',
  authDomain: 'expensetracker-66519.firebaseapp.com',
  projectId: 'expensetracker-66519',
  storageBucket: 'expensetracker-66519.appspot.com',
  messagingSenderId: '489590921159',
  appId: '1:489590921159:web:ef53b4c412159c2bc62be2',
  measurementId: 'G-S3D3TJRRNW'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
