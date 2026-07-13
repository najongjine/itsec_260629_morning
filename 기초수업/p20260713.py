"""
가위 바위 보
"""

rpc=["가위","바위","보"]

#     % len(rpc) 를 이용해서 에러 방지를 수학수식으로 표현
comp=rpc[984%len(rpc)]

print(f"1=가위, 2=바위, 3=보 \n 입력하세요: ")
human=int(input())
human=rpc[human]

