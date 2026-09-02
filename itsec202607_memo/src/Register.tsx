import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth'
import { useNavigate } from 'react-router';


function Register() {
  const navigate=useNavigate();
  const { isLoggedIn, user, token, logout,login } = useAuth();
  let [username,set_username]=useState("");
  let [password,set_password]=useState("");
  let [password2,set_password2]=useState("");
  let [email,set_email]=useState("");
  let [gender,set_gender]=useState("m");
  

  async function onRegister(){
    if(password != password2){
      alert(`비밀번호 잘 확인해봐`);
      return;
    }
    const formdata=new URLSearchParams()
    formdata.append("username",username)
    formdata.append("password",password)
    formdata.append("email",email)
    formdata.append("gender",gender)
    let response:any=await fetch(`http://localhost:8000/register`
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
      alert(`회원가입 실패. ${response?.msg}`);
      return;
    }
    response=response?.data||{}
    login({
      token:response?.token||""
      ,userinfo:response?.userinfo||{}
    })
    navigate("/boardlist")
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
        <input type='password' onChange={ (e)=>{
          let 사용자입력=""
          사용자입력=e?.target?.value;
          set_password(사용자입력);
        } } />
      </div>
      <div>
        <label>비밀번호 재입력:</label>
      </div>
      <div>
        <input type='password' onChange={ (e)=>{
          let 사용자입력=""
          사용자입력=e?.target?.value;
          set_password2(사용자입력);
        } } />
      </div>
      <div>
        <label>email:</label>
      </div>
      <div>
        <input onChange={ (e)=>{
          let 사용자입력=""
          사용자입력=e?.target?.value;
          set_email(사용자입력);
        } } />
      </div>
      <div>
        <label>성별:</label>
      </div>
      <div>
        <select value={gender} onChange={(e) => set_gender(e.target.value)}>
          <option value="m">남자</option>
          <option value="f">여자</option>
        </select>
      </div>
      <div>
        <button onClick={(e)=>{onRegister();}}>회원가입</button>
      </div>
      <div>

      </div>
    </div>
  );
}

export default Register;
