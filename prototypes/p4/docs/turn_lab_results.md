# Turn Lab results (P4, Edit 49)

Each run: 180 s of two-way traffic, one car every 2.5 s (±20%), the dummy away. Spawn hold on (`traffic.gridlockSeconds` 6).
A run passes with no jam (a car stopped ≥ 6 s waiting on nothing or on a cycle of cars) and no time with car bodies overlapping.

| Piece | Setting | Centre R | Lane R (min) | Mix | Driver | Cars out /min | Longest stop (s) | Jam at (s) | Bodies overlap (s) | Spawns held (s) | Pass |
|---|---|---:|---:|---|---|---:|---:|---:|---:|---:|---|
| L corner (90°) | R 24 | 24 | 4.1 | sedans | P3 | 19.3 | 1 | — | 1.8 | 0 | **no** |
| L corner (90°) | R 24 | 24 | 4.1 | sedans | P4 | 18 | 0.6 | — | 0.4 | 0 | **no** |
| L corner (90°) | R 24 | 24 | 4.1 | mixed 40% vans | P3 | 17.7 | 1.2 | — | 3.5 | 0 | **no** |
| L corner (90°) | R 24 | 24 | 4.1 | mixed 40% vans | P4 | 16.3 | 0.7 | — | 0.9 | 0 | **no** |
| L corner (90°) | R 24 | 24 | 4.1 | vans | P3 | 16 | 1.2 | — | 4.2 | 0 | **no** |
| L corner (90°) | R 24 | 24 | 4.1 | vans | P4 | 15 | 0.7 | — | 2.9 | 0 | **no** |
| L corner (90°) | R 32 | 31.6 | 3.6 | sedans | P3 | 18.7 | 4.8 | — | 0 | 0 | yes |
| L corner (90°) | R 32 | 31.6 | 3.6 | sedans | P4 | 21 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 32 | 31.6 | 3.6 | mixed 40% vans | P3 | 17.3 | 2.7 | — | 0 | 0 | yes |
| L corner (90°) | R 32 | 31.6 | 3.6 | mixed 40% vans | P4 | 19.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 32 | 31.6 | 3.6 | vans | P3 | 15 | 5.3 | — | 0.2 | 0 | **no** |
| L corner (90°) | R 32 | 31.6 | 3.6 | vans | P4 | 18.3 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 40 | 39.5 | 11.5 | sedans | P3 | 22 | 0.5 | — | 0 | 0 | yes |
| L corner (90°) | R 40 | 39.5 | 11.5 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 40 | 39.5 | 11.5 | mixed 40% vans | P3 | 21.7 | 4.1 | — | 0 | 0 | yes |
| L corner (90°) | R 40 | 39.5 | 11.5 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 40 | 39.5 | 11.5 | vans | P3 | 21.3 | 2.5 | — | 0 | 0 | yes |
| L corner (90°) | R 40 | 39.5 | 11.5 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 48 | 46.8 | 18.9 | sedans | P3 | 22.3 | 0.3 | — | 0 | 0 | yes |
| L corner (90°) | R 48 | 46.8 | 18.9 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 48 | 46.8 | 18.9 | mixed 40% vans | P3 | 22 | 1.5 | — | 0 | 0 | yes |
| L corner (90°) | R 48 | 46.8 | 18.9 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 48 | 46.8 | 18.9 | vans | P3 | 21.7 | 7.4 | 61.8 | 0 | 0 | **no** |
| L corner (90°) | R 48 | 46.8 | 18.9 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 56 | 54.7 | 26.7 | sedans | P3 | 22.7 | 0.1 | — | 0 | 0 | yes |
| L corner (90°) | R 56 | 54.7 | 26.7 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 56 | 54.7 | 26.7 | mixed 40% vans | P3 | 22.3 | 0.5 | — | 0 | 0 | yes |
| L corner (90°) | R 56 | 54.7 | 26.7 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 56 | 54.7 | 26.7 | vans | P3 | 22 | 8.2 | 61.2 | 0 | 0 | **no** |
| L corner (90°) | R 56 | 54.7 | 26.7 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 64 | 61.5 | 33.5 | sedans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 64 | 61.5 | 33.5 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 64 | 61.5 | 33.5 | mixed 40% vans | P3 | 22.7 | 0.2 | — | 0 | 0 | yes |
| L corner (90°) | R 64 | 61.5 | 33.5 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 64 | 61.5 | 33.5 | vans | P3 | 22 | 8.4 | 62.6 | 0 | 0 | **no** |
| L corner (90°) | R 64 | 61.5 | 33.5 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 96 | 90.7 | 62.7 | sedans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 96 | 90.7 | 62.7 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 96 | 90.7 | 62.7 | mixed 40% vans | P3 | 22.7 | 1.4 | — | 0 | 0 | yes |
| L corner (90°) | R 96 | 90.7 | 62.7 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 96 | 90.7 | 62.7 | vans | P3 | 22.3 | 4.4 | — | 0 | 0 | yes |
| L corner (90°) | R 96 | 90.7 | 62.7 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 128 | 116 | 88.2 | sedans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 128 | 116 | 88.2 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 128 | 116 | 88.2 | mixed 40% vans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 128 | 116 | 88.2 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| L corner (90°) | R 128 | 116 | 88.2 | vans | P3 | 22.7 | 5.3 | — | 0 | 0 | yes |
| L corner (90°) | R 128 | 116 | 88.2 | vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Z jog, P3 (two 90° corners) | R 64, lat 48 | 23.9 | 2.6 | sedans | P3 | 0 | 174.4 | 11.7 | 0 | 167.7 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 48 | 23.9 | 2.6 | sedans | P4 | 3.7 | 116.6 | 69.4 | 4.4 | 110.6 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 48 | 23.9 | 2.6 | mixed 40% vans | P3 | 0 | 174.1 | 11.9 | 0 | 167.7 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 48 | 23.9 | 2.6 | mixed 40% vans | P4 | 0.3 | 165.7 | 20.3 | 165.8 | 157.6 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 48 | 23.9 | 2.6 | vans | P3 | 0 | 174.1 | 11.9 | 0 | 167.7 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 48 | 23.9 | 2.6 | vans | P4 | 9.7 | 4.1 | — | 36.6 | 0 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 84 | 41.4 | 13.4 | sedans | P3 | 0 | 174.4 | 11.6 | 0 | 167.7 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 84 | 41.4 | 13.4 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Z jog, P3 (two 90° corners) | R 64, lat 84 | 41.4 | 13.4 | mixed 40% vans | P3 | 0 | 174.2 | 11.8 | 0 | 167.7 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 84 | 41.4 | 13.4 | mixed 40% vans | P4 | 21.7 | 0 | — | 0.1 | 0 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 84 | 41.4 | 13.4 | vans | P3 | 0 | 174.2 | 11.8 | 0 | 167.7 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 84 | 41.4 | 13.4 | vans | P4 | 21.3 | 0 | — | 0.2 | 0 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 128 | 61.5 | 33.5 | sedans | P3 | 9.3 | 90.7 | 71.7 | 0 | 84.2 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 128 | 61.5 | 33.5 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Z jog, P3 (two 90° corners) | R 64, lat 128 | 61.5 | 33.5 | mixed 40% vans | P3 | 15.7 | 42.3 | 28.5 | 0 | 15.3 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 128 | 61.5 | 33.5 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Z jog, P3 (two 90° corners) | R 64, lat 128 | 61.5 | 33.5 | vans | P3 | 2 | 170.5 | 32.4 | 0 | 146.9 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 128 | 61.5 | 33.5 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Z jog, P3 (two 90° corners) | R 64, lat 168 | 61.5 | 33.5 | sedans | P3 | 12.3 | 78.2 | 70.8 | 0 | 65.3 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 168 | 61.5 | 33.5 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Z jog, P3 (two 90° corners) | R 64, lat 168 | 61.5 | 33.5 | mixed 40% vans | P3 | 3.3 | 143 | 27.7 | 0 | 135.1 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 168 | 61.5 | 33.5 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Z jog, P3 (two 90° corners) | R 64, lat 168 | 61.5 | 33.5 | vans | P3 | 1.7 | 170.5 | 27 | 0 | 152.6 | **no** |
| Z jog, P3 (two 90° corners) | R 64, lat 168 | 61.5 | 33.5 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 84 | 61.9 | 33.9 | sedans | P3 | 0.3 | 172.2 | 13.8 | 0 | 165.1 | **no** |
| Diagonal jog, P4 (45°) | R 64, lat 84 | 61.9 | 33.9 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 84 | 61.9 | 33.9 | mixed 40% vans | P3 | 0 | 174.3 | 11.8 | 0 | 167.7 | **no** |
| Diagonal jog, P4 (45°) | R 64, lat 84 | 61.9 | 33.9 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 84 | 61.9 | 33.9 | vans | P3 | 0 | 174.3 | 11.8 | 0 | 167.7 | **no** |
| Diagonal jog, P4 (45°) | R 64, lat 84 | 61.9 | 33.9 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 160 | 61.9 | 33.9 | sedans | P3 | 21.7 | 13.5 | 25.3 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 64, lat 160 | 61.9 | 33.9 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 160 | 61.9 | 33.9 | mixed 40% vans | P3 | 21.7 | 15.4 | 25.8 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 64, lat 160 | 61.9 | 33.9 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 160 | 61.9 | 33.9 | vans | P3 | 19.3 | 19.4 | 26.4 | 0 | 0.1 | **no** |
| Diagonal jog, P4 (45°) | R 64, lat 160 | 61.9 | 33.9 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 240 | 61.9 | 33.9 | sedans | P3 | 22 | 0.8 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 240 | 61.9 | 33.9 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 240 | 61.9 | 33.9 | mixed 40% vans | P3 | 21.7 | 5.3 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 240 | 61.9 | 33.9 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 64, lat 240 | 61.9 | 33.9 | vans | P3 | 19.3 | 28.6 | 135.1 | 0 | 0.1 | **no** |
| Diagonal jog, P4 (45°) | R 64, lat 240 | 61.9 | 33.9 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 84 | 88.5 | 61.2 | sedans | P3 | 19.7 | 27.4 | 68.5 | 0 | 0.1 | **no** |
| Diagonal jog, P4 (45°) | R 96, lat 84 | 88.5 | 61.2 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 84 | 88.5 | 61.2 | mixed 40% vans | P3 | 18.3 | 25.9 | 25.7 | 0 | 0.1 | **no** |
| Diagonal jog, P4 (45°) | R 96, lat 84 | 88.5 | 61.2 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 84 | 88.5 | 61.2 | vans | P3 | 0.3 | 171.2 | 14.9 | 0 | 165 | **no** |
| Diagonal jog, P4 (45°) | R 96, lat 84 | 88.5 | 61.2 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 160 | 88.5 | 60.8 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 160 | 88.5 | 60.8 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 160 | 88.5 | 60.8 | mixed 40% vans | P3 | 21.3 | 16.4 | 24.7 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 96, lat 160 | 88.5 | 60.8 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 160 | 88.5 | 60.8 | vans | P3 | 21.7 | 16.6 | 25.2 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 96, lat 160 | 88.5 | 60.8 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 240 | 88.5 | 60.8 | sedans | P3 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 240 | 88.5 | 60.8 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 240 | 88.5 | 60.8 | mixed 40% vans | P3 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 240 | 88.5 | 60.8 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 96, lat 240 | 88.5 | 60.8 | vans | P3 | 21.7 | 13.4 | 67 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 96, lat 240 | 88.5 | 60.8 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 84 | 118.1 | 90.2 | sedans | P3 | 22 | 7.1 | 110.1 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 128, lat 84 | 118.1 | 90.2 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 84 | 118.1 | 90.2 | mixed 40% vans | P3 | 21.3 | 13.1 | 67.1 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 128, lat 84 | 118.1 | 90.2 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 84 | 118.1 | 90.2 | vans | P3 | 9.3 | 96.7 | 69 | 0 | 89.4 | **no** |
| Diagonal jog, P4 (45°) | R 128, lat 84 | 118.1 | 90.2 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 160 | 118.1 | 90.2 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 160 | 118.1 | 90.2 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 160 | 118.1 | 90.2 | mixed 40% vans | P3 | 22.3 | 15.4 | 23.4 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 128, lat 160 | 118.1 | 90.2 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 160 | 118.1 | 90.2 | vans | P3 | 22 | 3.5 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 160 | 118.1 | 90.2 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 240 | 118.1 | 90.2 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 240 | 118.1 | 90.2 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 240 | 118.1 | 90.2 | mixed 40% vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 240 | 118.1 | 90.2 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 240 | 118.1 | 90.2 | vans | P3 | 22 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 128, lat 240 | 118.1 | 90.2 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 84 | 130 | 102.3 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 84 | 130 | 102.3 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 84 | 130 | 102.3 | mixed 40% vans | P3 | 21.3 | 12.6 | 66.6 | 0 | 0 | **no** |
| Diagonal jog, P4 (45°) | R 224, lat 84 | 130 | 102.3 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 84 | 130 | 102.3 | vans | P3 | 20.3 | 14.9 | 67.2 | 0 | 0.1 | **no** |
| Diagonal jog, P4 (45°) | R 224, lat 84 | 130 | 102.3 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 160 | 188.4 | 160.8 | sedans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 160 | 188.4 | 160.8 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 160 | 188.4 | 160.8 | mixed 40% vans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 160 | 188.4 | 160.8 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 160 | 188.4 | 160.8 | vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 160 | 188.4 | 160.8 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 240 | 188.4 | 160.8 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 240 | 188.4 | 160.8 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 240 | 188.4 | 160.8 | mixed 40% vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 240 | 188.4 | 160.8 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 240 | 188.4 | 160.8 | vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Diagonal jog, P4 (45°) | R 224, lat 240 | 188.4 | 160.8 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 96 | 61.9 | 33.9 | sedans | P3 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 96 | 61.9 | 33.9 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 96 | 61.9 | 33.9 | mixed 40% vans | P3 | 22 | 2.4 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 96 | 61.9 | 33.9 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 96 | 61.9 | 33.9 | vans | P3 | 22 | 3.5 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 96 | 61.9 | 33.9 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 160 | 61.9 | 33.9 | sedans | P3 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 160 | 61.9 | 33.9 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 160 | 61.9 | 33.9 | mixed 40% vans | P3 | 22 | 0.2 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 160 | 61.9 | 33.9 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 160 | 61.9 | 33.9 | vans | P3 | 22 | 0.6 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 64, cut 160 | 61.9 | 33.9 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 96 | 88.5 | 61 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 96 | 88.5 | 61 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 96 | 88.5 | 61 | mixed 40% vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 96 | 88.5 | 61 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 96 | 88.5 | 61 | vans | P3 | 22 | 0.1 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 96 | 88.5 | 61 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 160 | 88.5 | 60.8 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 160 | 88.5 | 60.8 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 160 | 88.5 | 60.8 | mixed 40% vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 160 | 88.5 | 60.8 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 160 | 88.5 | 60.8 | vans | P3 | 22 | 3.4 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 96, cut 160 | 88.5 | 60.8 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 96 | 118.1 | 90.2 | sedans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 96 | 118.1 | 90.2 | sedans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 96 | 118.1 | 90.2 | mixed 40% vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 96 | 118.1 | 90.2 | mixed 40% vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 96 | 118.1 | 90.2 | vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 96 | 118.1 | 90.2 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 160 | 118.1 | 90.2 | sedans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 160 | 118.1 | 90.2 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 160 | 118.1 | 90.2 | mixed 40% vans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 160 | 118.1 | 90.2 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 160 | 118.1 | 90.2 | vans | P3 | 22.3 | 3.3 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 128, cut 160 | 118.1 | 90.2 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 96 | 145.1 | 117.3 | sedans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 96 | 145.1 | 117.3 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 96 | 145.1 | 117.3 | mixed 40% vans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 96 | 145.1 | 117.3 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 96 | 145.1 | 117.3 | vans | P3 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 96 | 145.1 | 117.3 | vans | P4 | 22.3 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 160 | 188.4 | 160.8 | sedans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 160 | 188.4 | 160.8 | sedans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 160 | 188.4 | 160.8 | mixed 40% vans | P3 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 160 | 188.4 | 160.8 | mixed 40% vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 160 | 188.4 | 160.8 | vans | P3 | 22.7 | 0.5 | — | 0 | 0 | yes |
| Chamfered L, P4 (45° cut) | R 224, cut 160 | 188.4 | 160.8 | vans | P4 | 22.7 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 32 | 31.6 | 3.6 | sedans | P3 | 3.7 | 120.4 | 71.3 | 0 | 92.2 | **no** |
| Stepped L, P3 (two steps) | R 32 | 31.6 | 3.6 | sedans | P4 | 17.7 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 32 | 31.6 | 3.6 | mixed 40% vans | P3 | 6 | 81.3 | 78.4 | 71.8 | 71.4 | **no** |
| Stepped L, P3 (two steps) | R 32 | 31.6 | 3.6 | mixed 40% vans | P4 | 16.7 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 32 | 31.6 | 3.6 | vans | P3 | 3 | 122.8 | 70.5 | 0 | 101.7 | **no** |
| Stepped L, P3 (two steps) | R 32 | 31.6 | 3.6 | vans | P4 | 15.7 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 48 | 46.8 | 18.9 | sedans | P3 | 17.7 | 40 | 136.4 | 0 | 0.1 | **no** |
| Stepped L, P3 (two steps) | R 48 | 46.8 | 18.9 | sedans | P4 | 21.7 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 48 | 46.8 | 18.9 | mixed 40% vans | P3 | 9 | 69.7 | 46 | 0 | 49.3 | **no** |
| Stepped L, P3 (two steps) | R 48 | 46.8 | 18.9 | mixed 40% vans | P4 | 21.3 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 48 | 46.8 | 18.9 | vans | P3 | 4 | 111.8 | 36.7 | 104.5 | 105.1 | **no** |
| Stepped L, P3 (two steps) | R 48 | 46.8 | 18.9 | vans | P4 | 21 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 64 | 61.5 | 33.5 | sedans | P3 | 11 | 73.2 | 72.4 | 0 | 45.8 | **no** |
| Stepped L, P3 (two steps) | R 64 | 61.5 | 33.5 | sedans | P4 | 21.7 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 64 | 61.5 | 33.5 | mixed 40% vans | P3 | 10.3 | 71.3 | 64.3 | 0 | 53.4 | **no** |
| Stepped L, P3 (two steps) | R 64 | 61.5 | 33.5 | mixed 40% vans | P4 | 21.7 | 0 | — | 0 | 0 | yes |
| Stepped L, P3 (two steps) | R 64 | 61.5 | 33.5 | vans | P3 | 8.7 | 81.9 | 46.2 | 66.3 | 74.1 | **no** |
| Stepped L, P3 (two steps) | R 64 | 61.5 | 33.5 | vans | P4 | 21.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 0 | 31.8 | 3.8 | sedans | P3 | 2.3 | 151.1 | 34.9 | 0 | 144.7 | **no** |
| Roundabout (W → E, the long way round half) | Rf 0 | 31.8 | 3.8 | sedans | P4 | 19 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 0 | 31.8 | 3.8 | mixed 40% vans | P3 | 1.7 | 156 | 30 | 0 | 149.7 | **no** |
| Roundabout (W → E, the long way round half) | Rf 0 | 31.8 | 3.8 | mixed 40% vans | P4 | 18.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 0 | 31.8 | 3.8 | vans | P3 | 1.3 | 158.2 | 27.8 | 0 | 149.7 | **no** |
| Roundabout (W → E, the long way round half) | Rf 0 | 31.8 | 3.8 | vans | P4 | 17.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 32 | 30.6 | 3.1 | sedans | P3 | 1.3 | 158.9 | 27.2 | 0 | 152.6 | **no** |
| Roundabout (W → E, the long way round half) | Rf 32 | 30.6 | 3.1 | sedans | P4 | 18.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 32 | 30.6 | 3.1 | mixed 40% vans | P3 | 2.3 | 149.1 | 36.9 | 0 | 141.9 | **no** |
| Roundabout (W → E, the long way round half) | Rf 32 | 30.6 | 3.1 | mixed 40% vans | P4 | 17.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 32 | 30.6 | 3.1 | vans | P3 | 2.3 | 148.9 | 37.1 | 0 | 141.9 | **no** |
| Roundabout (W → E, the long way round half) | Rf 32 | 30.6 | 3.1 | vans | P4 | 16.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 48 | 46 | 18 | sedans | P3 | 10 | 92.7 | 70.7 | 0 | 85.3 | **no** |
| Roundabout (W → E, the long way round half) | Rf 48 | 46 | 18 | sedans | P4 | 21.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 48 | 46 | 18 | mixed 40% vans | P3 | 2.3 | 152.4 | 33.6 | 0 | 144.7 | **no** |
| Roundabout (W → E, the long way round half) | Rf 48 | 46 | 18 | mixed 40% vans | P4 | 21.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 48 | 46 | 18 | vans | P3 | 1.3 | 159.2 | 26.8 | 0 | 152.6 | **no** |
| Roundabout (W → E, the long way round half) | Rf 48 | 46 | 18 | vans | P4 | 21 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 64 | 60.1 | 32.3 | sedans | P3 | 9 | 103.6 | 82.4 | 0 | 97.2 | **no** |
| Roundabout (W → E, the long way round half) | Rf 64 | 60.1 | 32.3 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 64 | 60.1 | 32.3 | mixed 40% vans | P3 | 20.3 | 12.7 | 87.2 | 0 | 0 | **no** |
| Roundabout (W → E, the long way round half) | Rf 64 | 60.1 | 32.3 | mixed 40% vans | P4 | 21.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 64 | 60.1 | 32.3 | vans | P3 | 10.3 | 75.6 | 72.2 | 0 | 63.7 | **no** |
| Roundabout (W → E, the long way round half) | Rf 64 | 60.1 | 32.3 | vans | P4 | 21.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 96 | 88.2 | 60.4 | sedans | P3 | 22 | 7.4 | 65.4 | 0 | 0 | **no** |
| Roundabout (W → E, the long way round half) | Rf 96 | 88.2 | 60.4 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 96 | 88.2 | 60.4 | mixed 40% vans | P3 | 21.7 | 11.9 | 96.1 | 0 | 0 | **no** |
| Roundabout (W → E, the long way round half) | Rf 96 | 88.2 | 60.4 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 96 | 88.2 | 60.4 | vans | P3 | 19.3 | 27.5 | 54.4 | 0 | 3 | **no** |
| Roundabout (W → E, the long way round half) | Rf 96 | 88.2 | 60.4 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 128 | 120.2 | 92.3 | sedans | P3 | 22 | 1.7 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 128 | 120.2 | 92.3 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 128 | 120.2 | 92.3 | mixed 40% vans | P3 | 22 | 8.2 | 52.2 | 0 | 0 | **no** |
| Roundabout (W → E, the long way round half) | Rf 128 | 120.2 | 92.3 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → E, the long way round half) | Rf 128 | 120.2 | 92.3 | vans | P3 | 20.7 | 12.9 | 52.4 | 0 | 0 | **no** |
| Roundabout (W → E, the long way round half) | Rf 128 | 120.2 | 92.3 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 0 | 9.9 | 3.2 | sedans | P3 | 1 | 158.5 | 27.5 | 2.8 | 150.8 | **no** |
| Roundabout (W → S, three quarters round) | Rf 0 | 9.9 | 3.2 | sedans | P4 | 8.3 | 90.4 | 95.6 | 113.7 | 83.7 | **no** |
| Roundabout (W → S, three quarters round) | Rf 0 | 9.9 | 3.2 | mixed 40% vans | P3 | 0.3 | 157.1 | 28.9 | 8 | 149.3 | **no** |
| Roundabout (W → S, three quarters round) | Rf 0 | 9.9 | 3.2 | mixed 40% vans | P4 | 12.3 | 46.4 | 139.6 | 94.2 | 40.4 | **no** |
| Roundabout (W → S, three quarters round) | Rf 0 | 9.9 | 3.2 | vans | P3 | 1 | 157.1 | 29 | 3.5 | 148.4 | **no** |
| Roundabout (W → S, three quarters round) | Rf 0 | 9.9 | 3.2 | vans | P4 | 7.7 | 85.2 | 100.8 | 108.7 | 79.2 | **no** |
| Roundabout (W → S, three quarters round) | Rf 32 | 30.6 | 3.1 | sedans | P3 | 2 | 152.6 | 33.4 | 0 | 144.7 | **no** |
| Roundabout (W → S, three quarters round) | Rf 32 | 30.6 | 3.1 | sedans | P4 | 17.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 32 | 30.6 | 3.1 | mixed 40% vans | P3 | 1.3 | 159 | 27 | 0 | 151.8 | **no** |
| Roundabout (W → S, three quarters round) | Rf 32 | 30.6 | 3.1 | mixed 40% vans | P4 | 17 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 32 | 30.6 | 3.1 | vans | P3 | 1.3 | 158.9 | 27.1 | 0 | 151.8 | **no** |
| Roundabout (W → S, three quarters round) | Rf 32 | 30.6 | 3.1 | vans | P4 | 16.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 48 | 46 | 18 | sedans | P3 | 10.3 | 84 | 73.2 | 0 | 77.9 | **no** |
| Roundabout (W → S, three quarters round) | Rf 48 | 46 | 18 | sedans | P4 | 21 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 48 | 46 | 18 | mixed 40% vans | P3 | 9.3 | 90.4 | 95.6 | 0 | 84.4 | **no** |
| Roundabout (W → S, three quarters round) | Rf 48 | 46 | 18 | mixed 40% vans | P4 | 20.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 48 | 46 | 18 | vans | P3 | 2.3 | 149.7 | 36.3 | 0 | 141.9 | **no** |
| Roundabout (W → S, three quarters round) | Rf 48 | 46 | 18 | vans | P4 | 20.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 64 | 60.1 | 32.3 | sedans | P3 | 20.7 | 2 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 64 | 60.1 | 32.3 | sedans | P4 | 21.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 64 | 60.1 | 32.3 | mixed 40% vans | P3 | 4.3 | 137.1 | 48.9 | 0 | 131.1 | **no** |
| Roundabout (W → S, three quarters round) | Rf 64 | 60.1 | 32.3 | mixed 40% vans | P4 | 21.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 64 | 60.1 | 32.3 | vans | P3 | 2.7 | 151.5 | 34.5 | 0 | 144.7 | **no** |
| Roundabout (W → S, three quarters round) | Rf 64 | 60.1 | 32.3 | vans | P4 | 21.3 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 96 | 88.2 | 60.4 | sedans | P3 | 21.3 | 3.6 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 96 | 88.2 | 60.4 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 96 | 88.2 | 60.4 | mixed 40% vans | P3 | 20.7 | 8.9 | 83.5 | 0 | 0 | **no** |
| Roundabout (W → S, three quarters round) | Rf 96 | 88.2 | 60.4 | mixed 40% vans | P4 | 21.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 96 | 88.2 | 60.4 | vans | P3 | 2.3 | 153 | 33 | 0 | 146.9 | **no** |
| Roundabout (W → S, three quarters round) | Rf 96 | 88.2 | 60.4 | vans | P4 | 21.7 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 128 | 120.2 | 92.3 | sedans | P3 | 22 | 1.5 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 128 | 120.2 | 92.3 | sedans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 128 | 120.2 | 92.3 | mixed 40% vans | P3 | 20.7 | 7 | 136.7 | 0 | 0.1 | **no** |
| Roundabout (W → S, three quarters round) | Rf 128 | 120.2 | 92.3 | mixed 40% vans | P4 | 22 | 0 | — | 0 | 0 | yes |
| Roundabout (W → S, three quarters round) | Rf 128 | 120.2 | 92.3 | vans | P3 | 19.3 | 8.6 | 48.2 | 0 | 0.1 | **no** |
| Roundabout (W → S, three quarters round) | Rf 128 | 120.2 | 92.3 | vans | P4 | 22 | 0 | — | 0 | 0 | yes |
