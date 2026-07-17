
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
int main() {
    int arr[6] = { 0,0,0,0,0,0 };
    // 배열 길이 구하기
    int length = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < length; i++) {
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
        arr[i] = num1;
    }
    for (int i = 0; i < length; i++) {
        printf("%d  ", arr[i]);
    }

    return 0;
}