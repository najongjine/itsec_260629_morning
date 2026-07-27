let a=1;
a=`안녕하세요`;
let b=2;

a=1;
b=0.343;
a=`1`
b=2
// string interpolation
console.log(`a+b=${Number(a)+b}`)

a=["포도","사과","딸기"];
a.push("바나나")

/* 파이썬 dictionary랑 비슷
근데 한층더 업그레이드 됬습니다
javascript object 라고 불립니다 */
let a2={a:1,b:2}
a = {
  name: "페페",
  money: 5000,

  func1() {
    console.log(this.name);
    console.log(this.money);
  },
  b,
  a2
};


a.func1()


