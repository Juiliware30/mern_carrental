import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonials from '../components/Testimonials'
import Newletter from '../components/Newletter'


const Home = () => {
  return (    
    <>
        <Hero/>
        <FeaturedSection/>
        <Banner/>
        <Testimonials/>
        <Newletter/>

    </>
  )
}

export default Home