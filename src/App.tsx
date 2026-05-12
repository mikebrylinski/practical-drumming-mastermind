import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ApplyPage } from './pages/ApplyPage'
import { FaqPage } from './pages/FaqPage'
import { ClubPage } from './pages/ClubPage'

function AnimatedOutlet() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[50vh]"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route element={<AnimatedOutlet />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/club" element={<ClubPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
