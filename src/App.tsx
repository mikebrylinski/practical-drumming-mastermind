import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { HomePage2 } from './pages/HomePage2'
import { AboutPage } from './pages/AboutPage'
import { ApplyPage } from './pages/ApplyPage'
import { FaqPage } from './pages/FaqPage'
import { ClubPage } from './pages/ClubPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<HomePage2 />} />
          <Route path="home-2" element={<Navigate to="/" replace />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="apply" element={<ApplyPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="club" element={<ClubPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
