import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PortfolioProvider } from './context/PortfolioContext'
import { ThemeProvider } from './context/ThemeContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import AboutMe from './pages/AboutMe'
import Projects from './pages/Projects'
import ContactSection from './components/ContactSection'
import CursorGlow from './components/CursorGlow'

function App() {
  return (
    <ThemeProvider>
    <PortfolioProvider>
      <CursorGlow />
      <BrowserRouter basename="/">
        <Navigation />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/about"    element={<AboutMe />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact"  element={<ContactSection />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
    </ThemeProvider>
  )
}

export default App
