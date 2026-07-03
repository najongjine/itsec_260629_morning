"""
성적 분류기 만들기
score가 90이상이면 result가 "A"
score가 80이상이면 result가 "B"
score가 70이상이면 result가 "C"
score가 60이상이면 result가 "D"
그 미만은 "F"
"""
score=77
result=""
"""
if score >= 90 :
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
elif score >= 60:
    print("D")
else :
    print("F")
"""

if score >= 90 :
    print("A")
if 89>= score >= 80:
    print("B")
if 79 >= score >= 70:
    print("C")
if 69 >= score >= 60:
    print("D")
if score < 60:
    print("F")