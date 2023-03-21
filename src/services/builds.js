import {
    getDoc,
    getDocs,
    addDoc,
    collection,
    doc,
    query,
    where,
    orderBy,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
    startAfter,
    limit,
} from 'firebase/firestore'

import { db, auth } from '../lib/firebase'

const pageSize = 10
let lastVisibleBuild

export const getBuilds = async (order = 'popular', next = false) => {
    let orderConstraint
    switch (order) {
        case 'new':
            orderConstraint = orderBy('createdAt', 'desc')
            break
        case 'popular':
        default:
            orderConstraint = orderBy('likes', 'desc')
    }

    const args = [
        collection(db, 'builds'),
        // where('skillPointsRemaining', '==', 0),
        orderConstraint,
        limit(pageSize),
    ]

    if (next && lastVisibleBuild) {
        args.push(startAfter(lastVisibleBuild))
    }

    const q = query(...args)

    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs?.length === 0) {
        return []
    }

    lastVisibleBuild = querySnapshot.docs[querySnapshot.docs.length - 1]

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
        likes: 0,
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
            likes: increment(1),
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
            likes: increment(-1),
        })
        console.log('Document updated: ', result)
        return result
    } catch (e) {
        console.error('Error updating document: ', e)
    }
}
