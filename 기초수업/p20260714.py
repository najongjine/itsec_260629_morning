"""
홀짝 맞추기
1. 컴퓨터가 임의의 정수를 랜덤으로 만듬
2. 사람이 홀,짝인지 예측
3. 컴퓨터가 만든 숫자, 사람이 예측한 결과 판정
"""
# #include <>
# 딴 사람이 만든 코드 뭉탱이 가져오기
import random

def check(random_range1,human_input):
    msg=""
    msg = f"컴퓨터의 숫자: {random_range1}"

    if random_range1 % 2 == 0:
        comp_r = 0
        msg += " (짝수)"
    else:
        comp_r = 1
        msg += " (홀수)"

    msg += "\n"

    if comp_r == human_input:
        msg += "맞췄습니다"
    else:
        msg += "틀렸습니다"
    return msg


print("짝수 0, 홀수 1")
print("입력하세요:",end=" ")
human_input=int(input())

"""
0~ (10000-1) 의 정수를 랜덤으로 만들어서
random_range1 이라는 변수에 저장
"""
random_range1 = random.randrange(10000)
print(f" 랜덤으로 만든숫자: {random_range1}")


comp_r = 0
msg=check(random_range1,human_input)

print(msg)