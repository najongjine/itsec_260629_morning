import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth';
import { useNavigate, useSearchParams } from 'react-router';
import './BoardUpsert.css';

interface BoardType{
  title:string;
  content:string;
  date:string;
}

function BoardUpsert() {
  const [searchParams]=useSearchParams();
  let id=searchParams?.get("id")||0;
  const { isLoggedIn, user, token, logout,login } = useAuth();
  const navigate=useNavigate();
  let [title2,set_title2]=useState("");
  let [content,set_content]=useState("");
  let [userid,set_userid]=useState("0");

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
    let data=response?.data||{};
    console.log('#data: ', data);
    set_userid(String(data?.user_id||"0"));
    set_title2(data?.title||"");
    set_content(data?.content||"");
  }
  

  async function saveBoard(){
    const formdata=new URLSearchParams()
    formdata.append("title",title2)
    formdata.append("content",content)
    formdata.append("id",String(id))
    let response:any=await fetch(`http://localhost:8000/upsertboard`
      ,{
        method:"POST",
        headers:{
          "Content-Type":"application/x-www-form-urlencoded"
          ,Authorization: `Bearer ${token}`
        },
        body:formdata
      }
    );
    response=await response?.json()||{};
    console.log(`#response: `,response);
    if(!response?.success){
      alert(`게시글 저장 실패. ${response?.msg||""}`)
      return;
    }
    navigate("/boardlist")
  }

  const isEdit = Boolean(Number(id));

  return (
    <main className="board-upsert-page">
      <section className="board-upsert" aria-labelledby="board-upsert-title">
        <header className="board-upsert__header">
          <p className="board-upsert__eyebrow">COMMUNITY</p>
          <h1 id="board-upsert-title">{isEdit ? '게시글 수정' : '게시글 작성'}</h1>
          <p className="board-upsert__description">다른 사람에게 전하고 싶은 이야기를 작성해 주세요.</p>
        </header>
        <div className="board-upsert__form">
          <div className="board-upsert__field">
            <label htmlFor="board-title">제목</label>
            <input id="board-title" type="text" value={title2} placeholder="제목을 입력해 주세요" onChange={(e) => set_title2(e.target.value)} />
          </div>
          <div className="board-upsert__field board-upsert__field--content">
            <div className="board-upsert__label-row">
              <label htmlFor="board-content">내용</label>
              <span>{content.length.toLocaleString()}자</span>
            </div>
            <textarea id="board-content" value={content} placeholder="내용을 입력해 주세요" onChange={(e) => set_content(e.target.value)} />
          </div>
          <div className="board-upsert__actions">
            <button className="board-upsert__cancel" type="button" onClick={() => navigate('/boardlist')}>취소</button>
            <button className="board-upsert__submit" type="button" onClick={saveBoard}>저장하기</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BoardUpsert;
