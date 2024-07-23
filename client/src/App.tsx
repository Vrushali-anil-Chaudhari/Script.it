import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './layout'
import Signin from './pages/Signin'
import Search from './pages/Search'
import Signup from './pages/Signup'
import FileHistory from './pages/FileHistory'
import ProtectedRoute from './components/ProtectedRoute'
function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signin' element={<Signin   />} />
            <Route path='/signup' element={<Signup   />} />
            <Route path='/search' element={<ProtectedRoute User={<Search />}/>} />
            <Route path='/history' element={<FileHistory   />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default App
