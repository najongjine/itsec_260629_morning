def intro():
    print(f"안녕하세요 반갑습니다")
    print(f"안내사항은 힌트로 제공되요")
    pass

"""
매개변수(parameter, argument)
- 변수선언을 () 안에다가 하는것
- 즉, 이건 변수다
- 근데 왜 이악물고 () 안에다가 하냐?
  데이터를 다른놈으로부터 받을수 있다
"""
def myinfo(name="출소자",gender="남성",age=20):
    print(f"성별 {gender} 나이 {age} {name} 님 세계를 구해 주세요")

"""
return := 퉤 뱉고 빠져 나온다
"""
def mymod(num1,num2):
    return num1 % num2
    print("계속 일해라")

#print(mymod(3,5))

"""
함수가 호출이 되면 scope가 만들어집니다
함수가 종료되면, scope도 날라갑니다
"""
def testscope():
    a=9


"""
java, python 자료 결합도
- 숫자, boolean, string 얘네는 자료결합도,   나머지는 다 stamp 결합도
- 원본 데이터는 손상이 안감
"""
def testchange(n):
    n=n+1

n=1
testchange(n)
print(f"n: {n}")





