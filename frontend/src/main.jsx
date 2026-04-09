import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Todo from './pages/Todo'
import './index.css'

const PrivateRoute = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/" />

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/todo" element={<PrivateRoute><Todo /></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
)
