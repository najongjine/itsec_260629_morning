"""
비교연산자
1>0
1>=0
1==1
"a"=="a"
"b">"a"
a>b

항상 결과같이 True | False 로 떨어진다
"""
a=1
b=2
print(a>b)


"""
if문 기본 문법
앞에 if 라는 키워드 나와야함
True, False로 치환되는 조건이 있어야함
: 들어가야함
조건검사후 실행되는 코드는 tab으로 들여쓰기가 되어야함
"""
a=2
b=2

if b>a:
    print("b는 a보다 큽니다")
elif a==b:
    print("a와b는 같아요")
else :
    print("b는 a보다 작다")

"""
if 라는 키워드 만났으면 무조건 한번 검사 해야한다
True 하고 False면 안한다
"""
if b<a:
    print("b는 a보다 큽니다")
if b==a:
    print("a와b는 같아요")
if b<a:
    print("b는 a보다 작다")


print("점수를 입력 하세요(숫자만):")
score=input()
print(f"입력한 점수는:{score}")
