import { useState } from 'react';
import { useEffect } from "react";

interface BoardType{
  board_id:number
  ,title:string
  ,created_dt:string
  ,user_id:number
  ,username:string
}

function BoardList() {
  const [boardlist,setBoardlist]=useState<BoardType[]>([]);
  useEffect(
    ()=>{
      init();
    }
  ,[]);
  async function init(){
    let response:any= await fetch(`http://localhost:8000/boardlist`
      ,{method:"GET"}
    );
    response= await response?.json()||{};
    console.log(`#response: `,response);
    setBoardlist(response?.data||[]);
  }


  return (
    <div>
      <div> 게시판 리스트에요 </div>
      <div>
        {boardlist?.map(
          (e:BoardType)=>(
            <div key={e.board_id}>
              <div>게시글id:{e.board_id}</div>
              <div>제목:</div>
              <div>작성자username:</div>
              <div>생성일:</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default BoardList;