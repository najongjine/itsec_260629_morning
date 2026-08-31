import { useState } from 'react';
import { useEffect } from "react";
import { Link } from 'react-router';


function Header() {


  return (
    <div>
      <div> 
        <Link to="/"> 홈 </Link>
        <Link to="/boardlist"> 게시판 </Link>
        <Link to="/login"> 로그인 </Link>
      </div>
    </div>
  );
}

export default Header;