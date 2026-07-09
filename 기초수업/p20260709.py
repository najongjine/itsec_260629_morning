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

class Dog(FourLegAnimal):
    def make_sound(self):
        print("멍멍")
    def move(self):
        print("달려요")

class 두더지(FourLegAnimal):
    def __init__(self):
        self.leg=4
        self.eye=0
        self.nose=1
        self.mouth=True
    def move(self):
        print("땅을파요")


dog=Dog()
print(dog.leg)
dog.move()
dd=두더지()
print(f"두더지 눈: {dd.eye}, 두더지 다리:{dd.leg}")