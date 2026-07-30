import { useState } from 'react'
import './App.css'


function App() {
  let num1=1;
  const [count, setCount] = useState(0)

  function dummy(){
    num1++;
    console.log(`#num1:${num1}`)
  }

  return (
   <div>
    <div>ㅎㅇ</div>
    <div>num1: {num1}</div>
    <div>
      <button onClick={dummy}>숫자증가1</button>
    </div>
   </div>
  )

}

export default App
