import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth'
import { useNavigate, useSearchParams } from 'react-router';
import './Detail.css';

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
    <main className="detail-page">
      <article className="detail-card" aria-labelledby="detail-title">
        <header className="detail-card__header">
          <p className="detail-card__eyebrow">COMMUNITY</p>
          <h1 id="detail-title" className="detail-card__title">{board?.title || '게시글을 불러오는 중입니다.'}</h1>

          <dl className="detail-card__meta">
            <div>
              <dt>작성자</dt>
              <dd>{board?.username || '-'}</dd>
            </div>
            <div>
              <dt>작성일</dt>
              <dd>{board?.created_dt || '-'}</dd>
            </div>
          </dl>
        </header>

        <div className="detail-card__divider" />
        <div className="detail-card__content">{board?.content || '내용이 없습니다.'}</div>
        <div>
          <button 
          onClick={(e)=>{navigate(`/boardupsert?id=${board?.board_id||"0"}`)}}
          >수정</button>
          <button>삭제</button>
        </div>
      </article>
    </main>
  );
}

export default Detail;
