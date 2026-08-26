import { useEffect, useState } from 'react';
import './BoardList.css';
import { useNavigate } from 'react-router';

interface BoardType {
  board_id: number;
  title: string;
  created_dt: string;
  user_id: number;
  username: string;
}

function BoardList() {
  const navigate=useNavigate();
  const [boardlist, setBoardlist] = useState<BoardType[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    let response: any = await fetch('http://localhost:8000/boardlist', { method: 'GET' });
    response = await response?.json() || {};
    console.log('#response: ', response);
    setBoardlist(response?.data || []);
  }

  return (
    <main className="board-list-page">
      <section className="board-list" aria-labelledby="board-list-title">
        <div className="board-list__heading">
          <p className="board-list__eyebrow">COMMUNITY</p>
          <h1 id="board-list-title">게시글 리스트</h1>
        </div>

        <div className="board-list__table" role="list">
          <div className="board-list__row board-list__row--header" aria-hidden="true">
            <span>번호</span><span>제목</span><span>작성자</span><span>작성일</span>
          </div>
          {boardlist.map((board) => (
            <div className="board-list__row" key={board.board_id} role="listitem">
              <div className="board-list__id" data-label="번호">{board.board_id}</div>
              <div className="board-list__title" data-label="제목">{board.title}</div>
              <div className="board-list__author" data-label="작성자">{board.username}</div>
              <div className="board-list__date" data-label="작성일">{board.created_dt}</div>
            </div>
          ))}
          {boardlist.length === 0 && <p className="board-list__empty">등록된 게시글이 없습니다.</p>}
        </div>
        <div>
          <button onClick={(e)=>{
            navigate("/boardupsert")
          }}>글 작성</button>
        </div>
      </section>
    </main>
  );
}

export default BoardList;
