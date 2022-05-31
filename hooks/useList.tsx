import {
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from '../firebase'
import { Movie } from '../typings'

function useList(uid: string | undefined) {
  const [list, setList] = useState<Movie[] | DocumentData[]>([])

  useEffect(() => {
    if (!uid) return

    const q = query(collection(db, 'users'), where('uid', '==', uid))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const moviesList = []
      querySnapshot.forEach((doc) => {
        setList(doc.data().myList)
      })
    })
  }, [db, uid])

  return list
}

export default useList
