import './App.scss'
import { Route, Navigate, Routes, useRoutes } from 'react-router-dom'
import React from 'react'

import Index from './pages/index'
import User from './pages/user'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/:user' element={<User />}>
          <Route path=':number' element={<User />}>
            <Route path=':filter' element={<User />}>
              <Route path=':photoset' element={<User />} />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<Navigate replace to="/" />} />
      </Routes>
  );
}

export default App;