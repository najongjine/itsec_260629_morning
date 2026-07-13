"""
가위 바위 보
"""

rpc=["가위","바위","보"]

#     % len(rpc) 를 이용해서 에러 방지를 수학수식으로 표현
comp=rpc[984%len(rpc)]

print(f"1=가위, 2=바위, 3=보 \n 입력하세요: ")
"""
1을 입력했다 치면
human = 1-1 = 0 이 담겨요
human = rpc[1] = "바위"    이렇게 담겨요
"""
human=int(input()) - 1
human=rpc[human]

# 사람이 뭐냈고 컴퓨터가 뭐 냈는지
print(f" 사람:{human}, 컴퓨터:{comp}")

# 판정
if human == comp:
    print(f"무승부")
elif human=="가위" and comp=="바위":
    print(f"컴퓨터 승")
elif human=="가위" and comp=="보":
    print(f"사람 승")
elif human=="바위" and comp=="가위":
    print(f"사람 승")
elif human=="바위" and comp=="보":
    print(f"컴퓨터 승")
elif human=="보" and comp=="가위":
    print(f"컴퓨터 승")
elif human=="보" and comp=="바위":
    print(f"사람 승")
else:
    print(f"몰라")


