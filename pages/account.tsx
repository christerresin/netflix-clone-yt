import { User } from 'firebase/auth'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import Head from 'next/head'
import Link from 'next/link'
import { useRecoilState } from 'recoil'
import { subscriptionState, planState } from '../atoms/subscriptionAtom'
import Membership from '../components/Membership'

import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import { Plan } from '../typings'

type Props = {
  plans: Plan[]
}

export const getStaticProps = async () => {
  let data = [{}]
  const querySnapshot = await getDocs(collection(db, 'plans'))
  querySnapshot.forEach((document) => {
    data.push({ ...document.data() })
  })

  return {
    props: {
      plans: data,
    },
  }
}

function Account({ plans }: Props) {
  const { user, logout } = useAuth()
  const [userSubscription, setUserSubscription] =
    useRecoilState(subscriptionState)
  const [userPlan, setUserPlan] = useRecoilState(planState)

  const getUserDetails = async (userData: User) => {
    const userId = userData?.uid
    const q = query(collection(db, 'users'), where('uid', '==', userId))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setUserSubscription(doc.data().subscription)
      setUserPlan(doc.data().subscriptionDate)
    })
  }

  if (!userSubscription && user) {
    getUserDetails(user)
  }

  return (
    <div>
      <Head>
        <title>Account Settings - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            width={120}
            height={120}
            className="cursor-pointer object-contain"
          />
        </Link>
        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="cursor-pointer rounded"
          />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img
              src="https://rb.gy/4vfk4r"
              alt="account-date"
              className="h-7 w-7"
            />
            <p className="text-xs font-semibold text-[#555]">
              Member since {user?.metadata.creationTime}
            </p>
          </div>
        </div>

        <Membership />

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4 className="text-lg text-[gray]">Plan Details</h4>
          {/* Find current plan */}
          <div className="col-span-2 font-medium">
            {plans.filter((plan) => plan.name === userSubscription)[0]?.name}
          </div>
          <p className="cursor-pointer text-blue-500 hover:underline md:text-right">
            Change plan
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 cursor-pointer text-blue-500 hover:underline"
            onClick={logout}
          >
            Sign out of all devices
          </p>
        </div>
      </main>
    </div>
  )
}

export default Account
