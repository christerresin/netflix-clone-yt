import Head from 'next/head'
import { useRecoilState, useRecoilValue } from 'recoil'
import { collection, getDocs } from 'firebase/firestore'
import { useState } from 'react'

import Header from '../components/Header'
import Banner from '../components/Banner'
import Row from '../components/Row'
import Plans from '../components/Plans'
import Modal from '../components/Modal'
import requests from '../utils/requests'
import { Movie } from '../typings'
import useAuth from '../hooks/useAuth'
import { db } from '../firebase'
import { modalState, movieState } from '../atoms/modalAtom'
import { planState, subscriptionState } from '../atoms/subscriptionAtom'
import useList from '../hooks/useList'
import { userRefState } from '../atoms/userRefAtom'

export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ])

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  }
}

type Props = {
  netflixOriginals: Movie[]
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}: Props) => {
  const [subscription, setSubscription] = useState<null | Boolean>(null)
  const { loading } = useAuth()
  const showModal = useRecoilValue(modalState)
  const [userSubscription, setUserSubscription] =
    useRecoilState(subscriptionState)
  const [userPlan, setUserPlan] = useRecoilState(planState)

  const { user } = useAuth()
  const checkUserSubscription = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((document) => {
      if (user?.uid === document.data().uid) {
        if (!document.data().subscription) {
          setSubscription(false)
        }
        if (document.data().subscription) {
          setUserSubscription(document.data().subscription)
          setUserPlan(document.data().subscriptionDate)
          setSubscription(true)
        }
      }
    })
  }
  const list = useList(user?.uid)

  if (loading || subscription === null) {
    checkUserSubscription()
    return null
  }

  if (!subscription) return <Plans />

  return (
    <div
      className={`relative h-screen bg-gradient-to-b lg:h-[140vh] ${
        showModal && '!h-screen overflow-hidden'
      }`}
    >
      <Head>
        <title>Home - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My list */}
          {list.length > 0 && <Row title="My List" movies={list} />}
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  )
}

export default Home
