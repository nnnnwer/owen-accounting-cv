import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ResumePage from './pages/ResumePage.jsx'
import PortfolioPage from './pages/PortfolioPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// The dashboard (charts, table, Excel parser) is loaded only when a visitor opens it,
// keeping the first page load small on mobile data.
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
