"""
로또번호 생성 해보기
6개의 숫자
1~45

중복숫자 고르기는 아님
(ORM에 표기)
"""

"""
1.
1~45까지 배열에 미리 넣어두고, 섞기

2.
6개의 숫자를 랜덤으로 생성해서 채우기

3.
1~45까지 배열에 넣어주고,
인덱스 슬라이싱 기법(특정부분 자르기)
"""


import random

"""
배열이랑 비슷한데, 중복 제거가 추가된놈
지가 자동으로 중복을 제거함
"""
arr=set()

for i in range(45):
    num1 = random.randrange(start=1,stop=46)
    arr.add(num1)
    #print(f"{i}, num1: {num1}")

print(f"len(arr):{len(arr)}")
print(arr)
