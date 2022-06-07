import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { PokerRoom } from './pages/PokerRoom'

import { AuthContextProvider } from './context/AuthContext'

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
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
          <Route path="/poker-room/:id" element={<PokerRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
