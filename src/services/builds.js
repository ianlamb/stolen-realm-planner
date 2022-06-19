import {
    getDoc,
    getDocs,
    addDoc,
    collection,
    doc,
    query,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore'

import { db, auth } from '../lib/firebase'

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
        return docSnap.data()
    } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
    }
}

export const createBuild = async (build) => {
    const data = {
        ...build,
        likedBy: [],
        createdBy: auth.currentUser.uid,
        createdAt: new Date().toJSON(),
        updatedBy: auth.currentUser.uid,
        updatedAt: new Date().toJSON(),
    }

    try {
        const docRef = await addDoc(collection(db, 'builds'), data)
        console.log('Document written with ID: ', docRef.id)
        return { buildId: docRef.id, data }
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}

export const updateBuild = async (id, build) => {
    const docRef = doc(db, 'builds', id)
    const data = {
        ...build,
        likedBy: Array.from(build.likedBy),
        updatedBy: auth.currentUser.uid,
        updatedAt: new Date().toJSON(),
    }

    try {
        const result = await setDoc(docRef, data)
        console.log('Document updated: ', result)
        return result
    } catch (e) {
        console.error('Error updating document: ', e)
    }
}

export const likeBuild = async (id) => {
    const docRef = doc(db, 'builds', id)

    try {
        const result = await updateDoc(docRef, {
            likedBy: arrayUnion(auth.currentUser.uid),
        })
        console.log('Document updated: ', result)
        return result
    } catch (e) {
        console.error('Error updating document: ', e)
    }
}

export const unlikeBuild = async (id) => {
    const docRef = doc(db, 'builds', id)

    try {
        const result = await updateDoc(docRef, {
            likedBy: arrayRemove(auth.currentUser.uid),
        })
        console.log('Document updated: ', result)
        return result
    } catch (e) {
        console.error('Error updating document: ', e)
    }
}
