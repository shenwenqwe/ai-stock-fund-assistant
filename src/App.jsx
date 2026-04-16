import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MarketPage from './pages/MarketPage'
import ScreeningPage from './pages/ScreeningPage'
import AIRecommendPage from './pages/AIRecommendPage'
import MyPage from './pages/MyPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/screening" element={<ScreeningPage />} />
          <Route path="/ai-recommend" element={<AIRecommendPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
