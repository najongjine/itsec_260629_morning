
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/** 정수 랜덤으로 퉤 뱉는놈 */
int myrand() {
    int mynum = 0;

    struct timespec ts;

    timespec_get(&ts, TIME_UTC);

    // 초와 나노초를 섞어서 시드 생성
    unsigned int seed =
        (unsigned int)ts.tv_sec ^
        (unsigned int)ts.tv_nsec;

    srand(seed);

    int random_num = rand();
    mynum = random_num;
    return mynum;
}
void sort(int * ar,int len) {
    for (int a = 0; a < len - 1; a++) {
        for (int b = 0; b < len - 1; b++) {
            if (ar[b] > ar[b + 1]) {
                int t = ar[b];
                ar[b] = ar[b + 1];
                ar[b + 1] = t;
            }
        }
    }
}
int main() {
    int arr[6] = { 0,0,0,0,0,0 };
    // 배열 길이 구하기
    int length = sizeof(arr) / sizeof(arr[0]);
    
    for (int i = 0; i < length; ) {
        int num1 = (myrand() % 45) + 1;
        // arr에 중복있나 검사
        int bDup = 0;
        for (int a = 0; a < length; a++) {
            if (num1 == arr[a]) {
                bDup = 1;
            }
        }
        if (bDup) {
            continue;
        }
        arr[i++] = num1;
    }
    sort(arr,length);
    for (int i = 0; i < length; i++) {
        printf("%d  ", arr[i]);
    }
    

    return 0;
}