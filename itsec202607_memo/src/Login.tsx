import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth'


function Login() {
  const { isLoggedIn, user, token, logout } = useAuth()
  let [username,set_username]=useState("");
  let [password,set_password]=useState("");
  

  async function login(){

    const formdata=new URLSearchParams()
    formdata.append("username",username)
    formdata.append("password",password)
    let response:any=await fetch(`http://localhost:8000/upsertboard`
      ,{
        method:"POST",
        headers:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        body:formdata
      }
    );
    response=await response?.json()||{};
    console.log(`#response: `,response);
  }

  return (
    <div>
      <div> 게시판 리스트에요 </div>
      <div>
        <label>제목:</label>
        <input onChange={ (e)=>{
          let title=""
          title=e?.target?.value;
          set_title2(title);
        } } />
      </div>
      <div>
        <label>내용:</label>
      </div>
      <div>
        <textarea placeholder='내용을 입력하세요'
        cols={50} rows={20}
        onChange={(e)=>{
          let _content=e?.target?.value||""
          set_content(_content);
        }}>
        </textarea>
      </div>
      <div>
        <button onClick={(e)=>{login();}}>저장</button>
      </div>
      <div>

      </div>
    </div>
  );
}

export default Login;