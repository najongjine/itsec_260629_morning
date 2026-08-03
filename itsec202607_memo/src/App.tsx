import { useState } from 'react';
import './App.css';

function App() {
  let nums: Set<number> = new Set();

  // Number[]보다 number[] 사용을 권장합니다.
  const [lottonums, setLottonums] = useState<number[]>([]);

  /**
   * 1~45 중 랜덤 숫자 45개를 만들어서 nums에 저장
   */
  function randomnum() {
    for (; nums.size < 45; ) {
      const randomNumbers = Array.from(
        { length: 45 },
        () => Math.floor(Math.random() * 45) + 1
      );

      randomNumbers.forEach((number) => {
        nums.add(number);
      });
    }

    nums = new Set([...nums].slice(0, 45));

    setLottonums([...nums]);

    console.log('# nums:', nums);
  }

  return (
    <div className="app">
      <div className="lotto-card">
        <h1 className="title">로또번호 자동생성기</h1>

        <p className="description">
          버튼을 누르면 1부터 45까지의 번호를 무작위로 생성합니다.
        </p>

        <div className="result-box">
          <div className="result-title">생성한 랜덤 번호</div>
          <div className="number-list">
            {!lottonums?.length && (
                <span className="empty-message">
                  아직 생성된 번호가 없습니다.
                </span>
            )}
          </div>
          <div className="number-list">
            {lottonums?.map((number) => (
              <span className="number-ball" key={number}>
                {number}
              </span>
            ))}
          </div>
        </div>
        

        <button className="generate-button" onClick={randomnum}>
          번호 생성
        </button>
      </div>
    </div>
  );
}

export default App;