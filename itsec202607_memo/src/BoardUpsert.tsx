import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth';
import { useNavigate, useSearchParams } from 'react-router';

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

  return (
    <div>
      <div> 게시판 리스트에요 </div>
      <div>
        <label>제목:</label>
        <input 
        value={title2}
        onChange={ (e)=>{
          let title=""
          title=e?.target?.value;
          set_title2(title);
        } } />
      </div>
      <div>
        <label>내용:</label>
      </div>
      <div>
        <textarea 
        value={content}
        placeholder='내용을 입력하세요'
        cols={50} rows={20}
        onChange={(e)=>{
          let _content=e?.target?.value||""
          set_content(_content);
        }}>
        </textarea>
      </div>
      <div>
        <button onClick={(e)=>{saveBoard();}}>저장</button>
      </div>
      <div>

      </div>
    </div>
  );
}

export default BoardUpsert;