import {
  collection,
  DocumentData,
  onSnapshot,
  query,
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
      querySnapshot.forEach((doc) => {
        setList(doc.data().myList)
      })
    })
  }, [db, uid])

  return list
}

export default useList
