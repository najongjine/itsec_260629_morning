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
    let response:any=await fetch(`http://localhost:8000/login`
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
      <div> 로그인 </div>
      <div>
        <label>username:</label>
        <input onChange={ (e)=>{
          let 사용자입력=""
          사용자입력=e?.target?.value;
          set_username(사용자입력);
        } } />
      </div>
      <div>
        <label>비밀번호:</label>
      </div>
      <div>
        <input onChange={ (e)=>{
          let 사용자입력=""
          사용자입력=e?.target?.value;
          set_password(사용자입력);
        } } />
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