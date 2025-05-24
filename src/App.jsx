import { BrowserRouter as Router } from "react-router-dom"
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import About from "./components/About"
import Features from "./components/Features"
import StegTool from "./components/StegTool"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="app dark-theme">
        <Header />
        <Navbar />
        <main>
          <Home />
          <About />
          <Features />
          <StegTool />
          <Contact />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

App.jsx

