import { CheckIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DocumentData } from '@firebase/firestore-types'
import { collection, getDocs } from 'firebase/firestore'

import useAuth from '../hooks/useAuth'
import { db } from '../firebase'
import { Plan } from '../typings'
import Table from './Table'

function Plans() {
  const { logout } = useAuth()
  const [plans, setPlans] = useState<DocumentData | null>()

  useEffect(() => {
    const getData = async () => {
      const databaseRef = collection(db, 'plans')
      const response = await getDocs(databaseRef)
      setPlans(response.docs.map((data) => data.data()))
    }
    getData()
  }, [])

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
      <main className="transisiton-all max-w-5xl px-5 pt-28 pb-12 md:px-10">
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
              <div className="planBox" key={plan.name}>
                {plan.name}
              </div>
            ))}
          </div>

          <Table plans={plans} />

          <button>Subscribe</button>
        </div>
      </main>
    </div>
  )
}

export default Plans
