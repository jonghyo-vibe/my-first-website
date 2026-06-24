import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import AboutMe from './pages/AboutMe'
import Projects from './pages/Projects'

function App() {
  return (
    <BrowserRouter basename="/my-first-website/my-portfolio">
      <Navigation />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<AboutMe />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
