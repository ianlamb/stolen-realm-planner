import {
    getDoc,
    getDocs,
    addDoc,
    collection,
    doc,
    query,
    where,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

export const getBuilds = async () => {
    const q = query(collection(db, 'builds'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
}

export const getBuild = async (id) => {
    const docRef = doc(db, 'builds', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        console.log('Document data:', docSnap.data())
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
    }
}

export const createBuild = async (data) => {
    try {
        const docRef = await addDoc(collection(db, 'builds'), data)
        console.log('Document written with ID: ', docRef.id)
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}
