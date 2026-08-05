import { useState } from 'react';
import { useEffect } from "react";


function BoardList() {
  let title=""


  return (
    <div>
      <div> 게시판 리스트에요 </div>
      <div>
        <label>제목:</label>
        <input onChange={ (e)=>{
          title=e?.target?.value;
          console.log(title);
        } } />
      </div>
    </div>
  );
}

export default BoardList;