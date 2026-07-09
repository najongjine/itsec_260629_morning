class Student:
    """ ___init___ 이걸 생성자라고 해요
    클래스를 객체로 실체화할때 꼭 실행되요
    class의 함수 매개변수 에는 self라는게 꼭 들어가야해요
    """
    def __init__(self,name,score):
        self.name=name
        self.score=score
        pass
    pass

s=Student()
print(s.name)
print(s.score)