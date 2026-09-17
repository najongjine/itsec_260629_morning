import { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from './auth';
import { useNavigate, useSearchParams } from 'react-router';
import './ProductUpsert.css';



function Product() {
  const [searchParams]=useSearchParams();
  let id=searchParams?.get("id")||0;
  const { isLoggedIn, user, token, logout,login } = useAuth();
  const navigate=useNavigate();
  

  useEffect(() => {
    init();
  }, [id]);

  async function init() {
    const params=new URLSearchParams({id:String(id)})
    let response: any = 
    await fetch(`http://localhost:8000/get_a_product?${params}`
      , { method: 'GET' }
      
    );
    response = await response?.json() || {};
    let data=response?.data||{};
    console.log('#data: ', data);

  }
  

  async function saveBoard(){
    const formdata=new URLSearchParams()

    let response:any=await fetch(`http://localhost:8000/upsert_product`
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
      alert(`업로드 저장 실패. ${response?.msg||""}`)
      return;
    }
    navigate("/")
  }

 

  return (
    <div>
      <div>상품업로드</div>
    </div>
  );
}

export default Product;
