#include <bits/stdc++.h>
using namespace std;

bool canSchedule(vector<vector<int>>& meetings, int M, long long B) {
    int N = meetings.size();
    vector<long long> rooms(M, LLONG_MIN);

    for (int i = 0; i < N; i++) {
        long long preferred = meetings[i][0];
        long long duration = meetings[i][1];
        long long earliest = preferred - B;
        long long latest = preferred + B;

        int bestRoom = -1;
        long long bestStart = LLONG_MAX;

        for (int r = 0; r < M; r++) {
            long long possibleStart = max(earliest, rooms[r]);
            if (possibleStart <= latest) {
                if (bestRoom == -1 || possibleStart < bestStart) {
                    bestRoom = r;
                    bestStart = possibleStart;
                }
            }
        }

        if (bestRoom == -1) return false;
        rooms[bestRoom] = bestStart + duration;
    }
    return true;
}

int minFlexibilityBuffer(int N, int M, vector<vector<int>>& meetings) {
    sort(meetings.begin(), meetings.end());

    long long lo = 0, hi = 2e7;
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (canSchedule(meetings, M, mid))
            hi = mid;
        else
            lo = mid + 1;
    }
    return (int)lo;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int N, M;
    cin >> N >> M;

    vector<vector<int>> meetings(N, vector<int>(2));
    for (int i = 0; i < N; i++) {
        cin >> meetings[i][0] >> meetings[i][1];
    }

    cout << minFlexibilityBuffer(N, M, meetings) << endl;
    return 0;
}
