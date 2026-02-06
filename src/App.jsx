import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import InputData from './pages/InputData'
import GenerateTimetable from './pages/GenerateTimetable'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/input" element={<Layout><InputData /></Layout>} />
      <Route path="/generate" element={<Layout><GenerateTimetable /></Layout>} />
    </Routes>
  )
}

export default App
