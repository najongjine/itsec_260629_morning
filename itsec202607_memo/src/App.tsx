import { useState } from 'react';
import { useEffect } from "react";
import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import { Route, Routes } from 'react-router';
import Home from './Home';
import BoardUpsert from './BoardUpsert';
import BoardList from './BoardList';
import Login from './Login';


function App() { 

  return (
    <div>
      <Header/>

      <Routes>
        <Route path="/" element={ <Home /> }  />
        <Route path="/boardupsert" element={ <BoardUpsert /> }  />
        <Route path="/boardlist" element={ <BoardList /> }  />
        <Route path="/login" element={ <Login /> }  />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;