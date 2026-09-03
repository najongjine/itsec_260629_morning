import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth'
import { useNavigate, useSearchParams } from 'react-router';

interface BoardType {
  board_id: number;
  title: string;
  created_dt: string;
  user_id: number;
  username: string;
}

function Detail() {
  const navigate=useNavigate();
  const [searchParams]=useSearchParams();
  const id=searchParams.get("id");
  const { isLoggedIn, user, token, logout,login } = useAuth();
  const [board, setBoard] = useState<BoardType>();

  useEffect(() => {
    init();
  }, [id]);

  async function init() {
    let response: any = await fetch(`http://localhost:8000/get_a_board?id=2`, { method: 'GET' });
    response = await response?.json() || {};
    console.log('#response: ', response);
    setBoard(response?.data || {});
  }

  return (
    <div>
      <div> 디테일 </div>
      
    </div>
  );
}

export default Detail;