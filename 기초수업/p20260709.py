class Student:
    """ ___init___ 이걸 생성자라고 해요
    클래스를 객체로 실체화할때 꼭 실행되요
    class의 함수 매개변수 에는 self라는게 꼭 들어가야해요
    """
    def __init__(self,name,score):
        self.name=name
        self.score=score
        pass
    def show(self):
        print(f"재 이름은 {self.name}, 점수는 {self.score}")
    pass

s=Student(name="페페",score=60)
s2=Student(score=70,name="올라프")
s.show()
s2.show()



class FourLegAnimal:
    def __init__(self):
        self.leg=4
        self.eye=2
        self.nose=1
        self.mouth=True
    def make_sound(self):
        print("낑낑")
    def move(self):
        print("걸어가요")