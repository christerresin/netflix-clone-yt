import { atom } from 'recoil'

export const subscriptionState = atom({
  key: 'subscriptionState',
  default: '',
})

export const planState = atom({
  key: 'planState',
  default: 0,
})
