import { useState } from 'react';
import { useEffect } from "react";
import { Link } from 'react-router';
import { useAuth } from '../auth';


function Header() {
  const { isLoggedIn, user, token, logout,login } = useAuth()

  return (
    <div>
      <div> 
        <Link to="/"> 홈 </Link>
        <Link to="/boardlist"> 게시판 </Link>
        {!isLoggedIn && (
          <div>
            <Link to="/login"> 로그인 </Link>
          </div>
        )}
        {isLoggedIn && (
          <div>
            <div>{user?.username}</div>
            <div>
              <button onClick={(e)=>{
                logout();
              }}>로그아웃</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;