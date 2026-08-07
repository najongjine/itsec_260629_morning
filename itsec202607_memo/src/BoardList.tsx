import { useState } from 'react';
import { useEffect } from "react";

interface BoardType{
  title:string;
  content:string;
  date:string;
}

function BoardList() {
  let [title2,set_title2]=useState("");
  let [content,set_content]=useState("");
  let [boardList,set_boardList]=useState<BoardType[]>([]);

  return (
    <div>
      <div> 게시판 리스트에요 </div>
      <div>
        <label>제목:</label>
        <input onChange={ (e)=>{
          let title=""
          title=e?.target?.value;
          set_title2(title);
          console.log(title);
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
        <button>저장</button>
      </div>
    </div>
  );
}

export default BoardList;