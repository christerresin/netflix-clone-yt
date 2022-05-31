import { atom } from 'recoil'
import { DocumentData } from '@firebase/firestore-types'

export const userRefState = atom({
  key: 'userRefState',
  default: '',
})
