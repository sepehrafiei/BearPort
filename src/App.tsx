import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from './pages/Dashboard/Dashboard';
import Wrapper from './pages/Wrapper/Wrapper';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={
        <Wrapper>
          <Dashboard/>
        </Wrapper>
      } />
    </Routes>
    </BrowserRouter>
  )
}

export default App