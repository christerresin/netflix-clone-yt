import { CheckIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DocumentData } from '@firebase/firestore-types'
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'

import useAuth from '../hooks/useAuth'
import { db } from '../firebase'
import { Plan } from '../typings'
import Table from './Table'
import Loader from './Loader'

function Plans() {
  const { logout, user } = useAuth()
  const [plans, setPlans] = useState<DocumentData>([])
  const [selectedPlan, setSelectedPlan] = useState<DocumentData | null>(null)
  const [isBillingLoading, setIsBillingLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const databaseRef = collection(db, 'plans')
      const response = await getDocs(databaseRef)
      setPlans(response.docs.map((data) => data.data()))
    }
    getData()
  }, [])

  useEffect(() => {
    setSelectedPlan(plans[2])
  }, [plans])

  const subscribeToPlan = async () => {
    if (!user) return

    const userData = {
      uid: user.uid,
      email: user.email,
      subscription: selectedPlan?.name,
    }

    // Look for user in dB
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((document) => {
      if (user.uid === document.data().uid) {
        let foundUser = {
          uid: document.data().uid,
          email: document.data().email,
          subscription: document.data().subscription,
          docId: document.id,
        }
        // Add user and selected subscription to dB
        if (!foundUser) {
          const newUserRef = doc(collection(db, 'users'))
          setDoc(newUserRef, userData)
        }

        // Update users subscription plan
        if (foundUser) {
          const userRef = doc(db, 'users', foundUser.docId)
          updateDoc(userRef, {
            subscription: userData.subscription,
          })
        }
      }
    })
  }

  if (!plans) return null

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>
        <button
          className="text-lg font-medium hover:underline"
          onClick={logout}
        >
          Sign Out
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that's right for you
        </h1>
        <ul>
          <li className="subscriptionListitem">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want.
            Ad-free.
          </li>
          <li className="subscriptionListitem">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations
            just for you.
          </li>
          <li className="subscriptionListitem">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel
            your plan anytime.
          </li>
        </ul>

        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center justify-end self-end md:w-3/5">
            {plans?.map((plan: Plan) => (
              <div
                className={`planBox ${
                  selectedPlan?.name === plan.name
                    ? 'opacity-100'
                    : 'opacity-60'
                }`}
                key={plan.name}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.name}
              </div>
            ))}
          </div>
          <Table plans={plans} selectedPlan={selectedPlan!} />

          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? (
              <Loader color="dark:fill-gray-300" />
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Plans
