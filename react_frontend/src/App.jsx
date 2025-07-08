// src/App.tsx
import React, { Suspense, lazy } from "react"
import Spinner from "./components/Spinner"

const Header = lazy(() => import("./components/Header"))
const HeroSection = lazy(() => import("./components/HeroSection"))
const AboutSection = lazy(() => import("./components/AboutSection"))
const AcadamicSection = lazy(() => import("./components/AcadamicSection"))
const ActivitiesSection = lazy(() => import("./components/ActivitiesSection"))
const ContactSection = lazy(() => import("./components/ContactSection"))
const Footer = lazy(() => import("./components/Footer"))

const App = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="min-h-screen">
        <Header />
        <HeroSection />
        <AboutSection />
        <AcadamicSection />
        <ActivitiesSection />
        <ContactSection />
        <Footer />
      </div>
    </Suspense>
  )
}

export default App
