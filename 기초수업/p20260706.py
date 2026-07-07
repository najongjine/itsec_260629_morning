for i in range(0,10):
    #print(f"i:{i}")
    pass

for i in [0,1,2,3,4,5,6,7,8,9]:
    #print(f"i:{i}")
    pass
    

print("프로그램 끝")


for a in range(1,10):
    #print(f"2 * {a}  = {2*a}")
    pass

for a in range(1,10):
    #print(f"3 * {a}  = {3*a}")
    pass


for a in range(1,5):
    for b in range(0,3):
        #print(f"a:{a},b:{b}")
        pass


for a in range(2,10):
    for b in range(1,10):
        #print(f"{a}*{b}={a*b}")
        pass


"""
for, if문을 섞으면 인공지능을 만들수 있습니다
정렬 인공지능 만듭시다
"""
"""
try except (자바에선 try catch)
예외처리
try 안에서 예상하지 못한 에러가 나면,
except 부분으로
"""
a=[6,99,0,7,56,88,197,1]

print(f"len: {len(a)}")

"""
0~7 까지 반복하고
k에 0,1,2,3,4,5,6,7 이 담긴다
"""
for j in range(0,len(a)):
    for k in range(0,len(a)):
        try:
            if a[k]>a[k+1]:
                t=a[k]
                a[k]=a[k+1]
                a[k+1]=t
            pass
        except Exception:
            pass

print(a)



"""
인공지능 정의:=
동물이나 사람을 모방하는 학문

그래서 이거 어떻게 하는건데?
소가 뒷걸질 치다 되는거에요
"""



"""
최적화, 경량화 - Big O 표기법
"""