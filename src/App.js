import './App.scss'
import { Route, Navigate, Routes, useRoutes} from 'react-router-dom'
import React from 'react'

import Index from './pages/index'
import PhotosetList from './pages/photosetlist'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/photosets/' element={<PhotosetList />}>
          <Route path='/photosets/:number' element={<PhotosetList />} />
        </Route>
        <Route path='*' element={<Navigate replace to="/" />} />
      </Routes>
  );
}

export default App;