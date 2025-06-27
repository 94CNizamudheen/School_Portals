

import React from 'react'
import dynamic from 'next/dynamic'
import Spinner from '@/components/Spinner'
const Header= dynamic(()=>import('@/components/Header'),{loading:()=><Spinner/>})
const HeroSection = dynamic(()=>import('@/components/HeroSection'),{loading:()=><Spinner/>})
const AboutSection =dynamic(()=>import('@/components/AboutSection'),{loading:()=><Spinner/>})
const AcadamicSection= dynamic(()=>import('@/components/AcadamicSection'),{loading:()=><Spinner/>})
const ActivitiesSection =dynamic(()=>import('@/components/ActivitiesSection'),{loading:()=><Spinner/>})
const ContactSection = dynamic(()=>import('@/components/ContactSection'),{loading:()=><Spinner/>})
const Footer = dynamic(()=>import('@/components/Footer'),{loading:()=><Spinner/>})

const Home = () => {
  return (
    <div className='min-h-screen' >
      <Header/>
      <HeroSection/>
      <AboutSection/>
      <AcadamicSection/>
      <ActivitiesSection/>
      <ContactSection/>
      <Footer/>
    </div>
  )
}

export default Home
