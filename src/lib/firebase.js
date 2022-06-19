import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: 'AIzaSyC9RURnrypArK-3ZKBSky65_1FSVShx4L0',
    authDomain: 'stolen-realm-planner.firebaseapp.com',
    projectId: 'stolen-realm-planner',
    storageBucket: 'stolen-realm-planner.appspot.com',
    messagingSenderId: '158794483107',
    appId: '1:158794483107:web:e1dc21984d8847e1e3c616',
    measurementId: 'G-LFP0NYDZEF',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize auth
export const auth = getAuth(app)
export const silentlyLogin = () => {
    return signInAnonymously(auth)
        .then((result) => result.user)
        .catch((error) => {
            var errorCode = error.code
            var errorMessage = error.message

            if (errorCode === 'auth/operation-not-allowed') {
                console.error(
                    'You must enable Anonymous auth in the Firebase Console.'
                )
            } else {
                console.error(error)
            }
        })
}

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
