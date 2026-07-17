
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    struct timespec ts;

    timespec_get(&ts, TIME_UTC);

    // 초와 나노초를 섞어서 시드 생성
    unsigned int seed =
        (unsigned int)ts.tv_sec ^
        (unsigned int)ts.tv_nsec;

    srand(seed);

    // 1부터 100 사이 랜덤 정수
    int random_num = rand();

    printf("seed: %u\n", seed);
    printf("random_num: %d\n", random_num);
    int arr[6] = { 0,0,0,0,0,0 };

    return 0;
}