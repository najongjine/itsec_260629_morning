import { useState } from 'react'
import './App.css'


function App() {
  let nums:Set<number>=new Set();
  const [lottonums,set_lottonums]=useState<Number[]>([]);

  /**
   * 1~45 중 랜덤숫자 45개를 만들어서 nums 에 저장하는 코드.
   *@param 없음
   @returns 없음
   */
  function randomnum(){
    for(;nums.size<45;){
      // 1~45중 랜덤 숫자 45개
      let _nums=Array.from(
        {length:45},
        (_,index)=> Math.floor(Math.random()*45)+1
      );
      _nums.forEach((e)=>{nums.add(e)}); 
    }
    // 100% 45개만 갖게됨
    nums=new Set([...nums].slice(0,45));
    console.log(`# nums: `,nums);
  }
 

  return (
   <div>
    <div>로또번호 자동생성기</div>
   
    <div>
      <button onClick={()=>{randomnum();}}>번호생성</button>
    </div>
   </div>
  )

}

export default App
