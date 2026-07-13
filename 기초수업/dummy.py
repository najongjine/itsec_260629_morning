a=[9,6,1,7,8]

for i0 in range(len(a)):
    for i1 in range(len(a)):
        try:
            if(a[i1]>a[i1 + 1]):
                a[i1],a[i1+1]=a[i1+1],a[i1]
            pass
        except :
            pass