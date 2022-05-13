// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDXy3qjs3CQatwFVOcCoBZJCzors4ZYb0g',
  authDomain: 'nextflix-yt.firebaseapp.com',
  projectId: 'nextflix-yt',
  storageBucket: 'nextflix-yt.appspot.com',
  messagingSenderId: '890703289283',
  appId: '1:890703289283:web:f456e7dca870e465c2fb76',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }
