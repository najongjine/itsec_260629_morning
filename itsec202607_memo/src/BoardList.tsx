import { useState } from 'react';
import { useEffect } from "react";

interface BoardType{
  title:string;
  content:string;
  date:string;
}

function BoardList() {
  useEffect(
    ()=>{
      init();
    }
  ,[]);
  async function init(){
    let response:any=await fetch(`http://localhost:8000/boardlist`
      ,{method:"GET"}
    );
    response=await response.json();
    console.log(`#response: `,response);
  }
 

  return (
    <div>
      <div> 게시판 리스트에요 </div>
      
    </div>
  );
}

export default BoardList;