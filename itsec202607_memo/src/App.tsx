import { useState } from 'react'
import './App.css'


function App() {
  let nums:Set<number>=new Set();
  const [lottonums,set_lottonums]=useState<Number[]>([]);

  function randomnum(){
    for(;nums.size<45;){
      let _nums=Array.from(
        {length:45},
        (_,index)=> index+1
      );
      _nums.forEach((e)=>{nums.add(e)}); 
    }
    nums=new Set([...nums].slice(0,45));
    console.log(`# nums: `,nums);
  }
 

  return (
   <div>
    <div>로또번호 자동생성기</div>
   
    <div>
      <button onClick={()=>{}}>번호생성</button>
    </div>
   </div>
  )

}

export default App
