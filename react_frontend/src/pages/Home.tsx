import HeroSection from "../components/HeroSection"
import AboutSection from "../components/AboutSection"
import AcadamicSection from "../components/AcadamicSection"
import ActivitiesSection from "../components/ActivitiesSection"
import ContactSection from "../components/ContactSection"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../hooks/app.hooks"


const Home = () => {
  const role= useAppSelector((state)=>state.auth.role)
  console.log("role is",role)
  const navigate= useNavigate()
  useEffect(()=>{
    if(role=="STUDENT"){
      navigate('/student/dashboard')
    }
  })
  return (
    <div className="min-h-screen">
        <Header />
        <HeroSection />
        <AboutSection />
        <AcadamicSection />
        <ActivitiesSection />
        <ContactSection />
        <Footer />
      </div>
  )
}

export default Home
