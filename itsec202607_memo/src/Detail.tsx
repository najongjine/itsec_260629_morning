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
  content:string;
}

function Detail() {
  const navigate=useNavigate();
  const [searchParams]=useSearchParams();
  const id=searchParams?.get("id")||0;
  const { isLoggedIn, user, token, logout,login } = useAuth();
  const [board, setBoard] = useState<BoardType>();

  useEffect(() => {
    init();
  }, [id]);

  async function init() {
    const params=new URLSearchParams({id:String(id)})
    let response: any = 
    await fetch(`http://localhost:8000/get_a_board?${params}`
      , { method: 'GET' }
      
    );
    response = await response?.json() || {};
    console.log('#response: ', response);
    setBoard(response?.data || {});
  }

  return (
    <div>
      <div> 디테일 </div>
      <div>{board?.title}</div>
      <div>{board?.username}</div>
      <div>{board?.created_dt}</div>
      <hr/>
      <div>{board?.content}</div>
    </div>
  );
}

export default Detail;