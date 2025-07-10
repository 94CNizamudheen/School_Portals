import HeroSection from "../components/HeroSection"
import AboutSection from "../components/AboutSection"
import AcadamicSection from "../components/AcadamicSection"
import ActivitiesSection from "../components/ActivitiesSection"
import ContactSection from "../components/ContactSection"
import Footer from "../components/Footer"
import Header from "../components/Header"


const Home = () => {
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
