import { useState } from 'react';
import { useEffect } from "react";
import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import { Route, Routes } from 'react-router';
import BoardUpsert from './BoardUpsert';
import ProductList from './ProductList';
import Login from './Login';
import Register from './Register';
import Detail from './Detail';

function App() { 

  return (
    <div>
      <Header/>

      <Routes>
        <Route path="/boardupsert" element={ <BoardUpsert /> }  />
        <Route path="/" element={ <ProductList /> }  />
        <Route path="/login" element={ <Login /> }  />
        <Route path="/register" element={ <Register /> }  />
        <Route path="/detail" element={ <Detail /> }  />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;