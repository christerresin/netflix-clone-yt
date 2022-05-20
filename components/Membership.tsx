import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useRouter } from 'next/router'

import Loader from './Loader'
import useAuth from '../hooks/useAuth'
import { db } from '../firebase'

import { planState, subscriptionState } from '../atoms/subscriptionAtom'

function Membership() {
  const { user } = useAuth()
  const [isBillingLoading, setIsBillingLoading] = useState(false)
  const userPlan = useRecoilValue(planState)
  const userSubscription = useRecoilValue(subscriptionState)
  const router = useRouter()

  const manageSubscription = async () => {
    const updateFoundUser = async (foundUserObj: {
      docId: string
      email: string
      uid: string
      subscription: string
      subscriptionDate: number
    }) => {
      const userRef = doc(db, 'users', foundUserObj.docId)
      await updateDoc(userRef, {
        subscription: '',
      })
      setIsBillingLoading(false)
    }

    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((document) => {
      if (user?.uid === document.data().uid) {
        let foundUser = {
          uid: document.data().uid,
          email: document.data().email,
          subscription: document.data().subscription,
          docId: document.id,
          subscriptionDate: document.data().subscriptionDate,
        }

        if (foundUser) {
          updateFoundUser(foundUser)
          router.push('/')
        }
      }
    })
    setIsBillingLoading(true)
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
      <div className="space-y-2 py-4">
        <h4 className="text-lg text-[gray]">Membership & Billing</h4>
        <button
          disabled={isBillingLoading || !userSubscription}
          className="h-10 w-3/5 whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5"
          onClick={manageSubscription}
        >
          {isBillingLoading ? (
            <Loader color="dark:fill-[#e50914]" />
          ) : (
            'Cancel Membership'
          )}
        </button>
      </div>

      <div className="col-span-3">
        <div className="flex flex-col justify-between border-b border-white/10 py-4 md:flex-row">
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-[gray]">Password: **********</p>
          </div>
          <div className="md:text-right">
            <p className="membershipLink">Change email</p>
            <p className="membershipLink">Change password</p>
          </div>
        </div>

        <div className="flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0">
          <div>
            <p>
              {userPlan
                ? `Your membership will end on ${new Date(
                    userPlan + 2592000000
                  ).toDateString()}`
                : null}
            </p>
          </div>
          <div className="md:text-right">
            <p className="membershipLink">Manage payment info</p>
            <p className="membershipLink">Add backup payment method</p>
            <p className="membershipLink">Billing Details</p>
            <p className="membershipLink">Change billing day</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Membership
