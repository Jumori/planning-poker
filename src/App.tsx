import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { AdminRoom } from './pages/AdminRoom'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/rooms/:id" element={<AdminRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
