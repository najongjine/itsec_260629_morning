import { useState } from 'react';
import { useEffect } from "react";
import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import { Route, Routes } from 'react-router';
import Home from './Home';
import BoardList from './BoardList';


function App() { 

  return (
    <div>
      <Header/>

      <Routes>
        <Route path="/" element={ <Home /> }  />
        <Route path="/boardlist" element={ <BoardList /> }  />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;