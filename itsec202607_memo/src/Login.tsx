import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth'


function Login() {
  const { isLoggedIn, user, token, logout,login } = useAuth();
  let [username,set_username]=useState("");
  let [password,set_password]=useState("");
  

  async function onlogin(){
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
    if(!response?.success){
      alert("너 아이디나 비번 틀림");
      return;
    }
    response=response?.data||{}
    login({
      token:response?.token||""
      ,userinfo:response?.userinfo||{}
    })
    
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
        <button onClick={(e)=>{onlogin();}}>로그인</button>
      </div>
      <div>

      </div>
    </div>
  );
}

export default Login;