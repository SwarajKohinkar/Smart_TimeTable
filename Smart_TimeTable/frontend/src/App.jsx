import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import InputData from './pages/InputData'
import GenerateTimetable from './pages/GenerateTimetable'
import Statistics from './pages/Statistics'
import TeacherWorkload from './pages/TeacherWorkload'
import ShareTimetable from './pages/ShareTimetable'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/input" element={<Layout><InputData /></Layout>} />
        <Route path="/generate" element={<Layout><GenerateTimetable /></Layout>} />
        <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
        <Route path="/workload" element={<Layout><TeacherWorkload /></Layout>} />
        <Route path="/share/:id" element={<ShareTimetable />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
