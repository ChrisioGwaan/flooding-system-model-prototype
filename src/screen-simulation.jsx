/* Data-driven simulation — 10 dataset playback with real-time flood risk analysis */

const { useState: useSim, useEffect: useSimEffect, useRef: useSimRef, useMemo: useSimMemo } = React;

/* ── Embedded dataset (10 sheets × 50 rows)
   row layout: [rainfall_mm, river_up_m, river_down_m, drain_in_Lps, drain_out_Lps, telecom_m, blockage_0to3, risk_0to3]
   risk: 0=Normal 1=Watch 2=HighRisk 3=Severe
   blockage: 0=none 1=small 2=big 3=severe
*/
const SIM_SHEETS = [{"id":"1_Normal","label":"S-01  Normal","rows":[[17.4,2.14,0.95,38.2,34.8,0.96,0,0],[19.0,2.16,0.98,33.2,26.8,0.9,0,0],[19.2,2.2,0.92,35.5,26.0,0.86,0,0],[18.4,2.12,0.94,36.4,28.8,0.99,0,0],[16.8,2.15,0.97,33.9,27.3,0.9,0,0],[17.4,2.03,0.89,37.0,34.2,0.92,0,0],[16.4,2.05,0.89,34.2,27.3,0.96,0,0],[19.1,1.97,0.92,36.7,26.8,0.97,0,0],[18.2,2.06,0.88,35.7,32.6,0.99,0,0],[18.9,2.08,1.01,35.3,29.2,0.93,0,0],[17.3,2.06,0.98,31.5,22.4,0.96,0,0],[20.2,2.16,0.96,36.2,28.3,0.92,0,0],[20.2,2.06,0.99,33.9,26.3,0.94,0,0],[17.9,2.06,0.98,32.6,25.0,0.98,0,0],[16.7,2.1,0.92,30.7,25.8,0.97,0,0],[17.2,2.06,1.03,35.5,31.1,1.0,0,0],[18.0,2.13,0.95,35.7,27.3,0.97,0,0],[17.9,2.08,0.97,31.2,22.8,0.96,0,0],[17.2,2.17,0.99,35.1,26.2,0.9,0,0],[18.4,2.14,0.91,33.6,24.3,0.93,0,0],[17.5,2.06,0.91,35.4,29.3,0.93,0,0],[16.5,2.14,0.91,31.4,25.4,0.92,0,0],[17.7,2.15,0.95,36.0,27.7,1.07,0,0],[17.9,2.15,0.98,34.3,27.1,0.94,0,0],[19.2,1.99,0.91,39.0,31.4,1.03,0,0],[17.0,2.07,0.95,32.3,23.9,0.96,0,0],[18.1,2.0,0.94,33.7,24.6,0.98,0,0],[18.3,2.18,0.91,33.4,28.7,0.95,0,0],[15.4,2.12,0.92,37.7,32.7,0.96,0,0],[18.5,2.09,0.94,37.9,35.1,0.95,0,0],[16.8,2.04,0.98,34.0,27.3,0.92,0,0],[17.6,2.06,0.94,35.6,33.3,0.98,0,0],[21.0,2.07,0.95,39.1,33.4,0.92,0,0],[19.8,2.14,0.97,35.3,29.0,0.87,0,0],[19.0,2.12,0.94,35.1,30.8,0.96,0,0],[17.8,2.16,0.99,31.0,24.2,0.86,0,0],[17.0,2.1,0.99,30.2,27.9,1.0,0,0],[18.5,1.98,0.91,37.6,35.3,0.99,0,0],[17.7,2.15,0.95,38.9,30.3,1.03,0,0],[16.4,2.15,0.94,35.5,30.6,0.93,0,0],[18.0,2.11,0.88,34.3,31.2,0.84,0,0],[16.9,2.13,0.91,33.8,27.7,0.99,0,0],[19.3,2.1,0.98,37.1,28.9,0.94,0,0],[17.4,2.1,0.95,38.7,35.0,1.01,0,0],[18.8,2.09,0.93,37.1,30.1,1.07,0,0],[17.4,2.03,0.93,37.8,35.1,0.97,0,0],[18.0,2.06,1.01,36.3,33.9,0.93,0,0],[18.2,1.98,0.91,30.5,24.2,0.94,0,0],[17.6,2.12,0.9,32.1,25.8,0.98,0,0],[20.6,2.07,0.95,38.0,30.9,0.93,0,0]]},{"id":"2_Normal_to_Watch","label":"S-02  Normal to Watch","rows":[[18.4,1.98,0.97,35.0,26.9,0.93,0,0],[21.2,2.16,0.95,32.7,25.8,0.98,0,0],[18.8,2.02,0.86,35.6,28.0,1.04,0,0],[18.8,2.16,1.05,32.7,29.0,1.03,0,0],[20.2,2.26,0.94,33.5,30.4,1.02,0,0],[19.1,2.2,0.95,33.6,31.5,1.02,0,0],[19.8,2.18,1.07,38.7,33.8,1.0,0,0],[19.5,2.23,1.07,39.7,33.0,1.1,0,0],[19.9,2.22,1.03,38.6,33.5,1.07,0,0],[21.8,2.26,1.04,41.2,35.7,1.0,0,0],[22.4,2.34,1.04,38.3,29.1,0.99,0,0],[22.6,2.25,1.02,38.9,34.1,1.03,0,0],[22.1,2.38,1.04,42.2,36.1,1.1,0,0],[20.8,2.35,1.08,38.7,30.5,1.2,0,0],[21.9,2.29,1.13,44.7,39.6,1.09,0,0],[22.7,2.3,1.14,35.0,28.0,1.07,0,0],[23.6,2.31,1.12,44.6,35.7,1.18,0,0],[24.3,2.35,1.02,39.7,30.1,1.15,0,0],[25.1,2.42,1.11,43.2,40.1,1.13,0,0],[23.8,2.33,1.0,43.0,33.6,1.12,0,0],[26.4,2.4,1.14,48.3,42.4,1.13,0,1],[26.2,2.51,1.13,41.7,37.6,1.14,0,1],[25.8,2.4,1.2,44.4,38.7,1.13,0,1],[26.4,2.51,1.14,45.7,35.8,1.22,0,1],[26.2,2.46,1.08,44.9,38.9,1.21,0,1],[25.8,2.51,1.13,45.7,41.1,1.19,0,1],[26.8,2.55,1.24,46.5,39.5,1.23,0,1],[27.8,2.58,1.22,45.4,41.4,1.27,0,1],[26.5,2.58,1.13,47.4,44.8,1.24,0,1],[27.5,2.61,1.17,47.3,44.3,1.19,0,1],[27.7,2.68,1.24,50.5,47.4,1.22,0,1],[27.6,2.57,1.19,42.9,39.7,1.2,0,1],[31.3,2.58,1.31,45.5,42.4,1.29,0,1],[29.8,2.68,1.27,49.6,42.5,1.26,0,1],[29.8,2.71,1.21,51.0,47.5,1.21,0,1],[28.5,2.77,1.24,49.1,44.4,1.3,0,1],[30.5,2.68,1.35,50.3,41.1,1.29,0,1],[30.8,2.69,1.27,49.3,43.5,1.28,0,1],[30.2,2.77,1.27,48.3,40.9,1.29,0,1],[31.3,2.7,1.34,50.7,47.3,1.33,0,1],[31.8,2.82,1.41,50.7,47.2,1.32,0,1],[32.9,2.81,1.39,52.1,49.8,1.38,0,1],[33.2,2.77,1.36,49.9,46.6,1.34,0,1],[31.9,2.85,1.33,54.7,50.4,1.41,0,1],[33.2,2.85,1.3,55.8,52.4,1.37,0,1],[34.3,2.78,1.39,53.8,51.1,1.37,0,1],[34.0,2.92,1.38,53.9,51.0,1.44,0,1],[35.5,2.87,1.37,53.1,47.4,1.37,0,1],[35.3,2.93,1.43,56.8,53.1,1.35,0,1],[33.8,2.88,1.36,55.8,50.9,1.35,0,1]]},{"id":"3_Watch","label":"S-03  Watch","rows":[[34.0,2.87,1.38,56.9,51.6,1.45,0,1],[34.7,2.98,1.39,54.1,47.6,1.44,0,1],[33.0,2.94,1.5,56.5,53.3,1.4,0,1],[35.4,2.89,1.47,57.6,54.1,1.42,0,1],[34.7,2.84,1.46,59.1,50.2,1.39,0,1],[32.0,2.84,1.3,55.5,45.9,1.31,0,1],[35.0,2.85,1.48,58.1,53.1,1.38,0,1],[35.7,2.79,1.44,53.9,49.8,1.46,0,1],[34.7,2.87,1.36,58.0,50.9,1.31,0,1],[35.3,2.83,1.28,53.4,48.2,1.39,0,1],[30.9,2.87,1.45,55.4,53.2,1.39,0,1],[32.6,3.03,1.4,57.9,54.7,1.41,0,1],[33.0,2.86,1.47,53.9,46.2,1.51,0,1],[34.0,2.9,1.32,54.5,47.2,1.38,0,1],[34.7,2.88,1.46,57.9,55.6,1.38,0,1],[33.4,3.2,1.34,56.3,52.6,1.46,0,1],[33.8,3.07,1.32,57.0,53.1,1.39,0,1],[34.5,2.91,1.37,57.3,49.9,1.39,0,1],[32.8,3.04,1.43,56.3,54.2,1.39,0,1],[33.4,2.85,1.43,54.3,51.5,1.36,0,1],[35.2,2.81,1.41,54.6,46.2,1.35,0,1],[36.7,2.95,1.38,52.3,48.9,1.4,0,1],[34.1,3.02,1.46,58.1,50.8,1.4,0,1],[34.0,2.91,1.38,56.4,52.4,1.45,0,1],[31.2,2.92,1.45,55.4,52.6,1.37,0,1],[33.8,2.83,1.39,55.8,51.9,1.41,0,1],[34.1,2.94,1.37,59.1,51.3,1.41,0,1],[33.4,2.77,1.39,52.4,43.6,1.35,0,1],[32.6,2.85,1.37,56.3,47.7,1.43,0,1],[33.6,2.89,1.44,56.0,50.8,1.3,0,1],[31.6,2.9,1.4,56.5,49.2,1.47,0,1],[32.8,2.84,1.37,52.2,48.6,1.34,0,1],[33.4,2.8,1.45,58.5,54.2,1.38,0,1],[33.2,2.93,1.38,57.3,48.2,1.33,0,1],[32.8,2.88,1.4,56.7,54.6,1.45,0,1],[35.5,2.92,1.44,57.7,55.0,1.41,0,1],[34.4,2.77,1.42,56.7,53.1,1.34,0,1],[34.7,2.9,1.35,57.5,55.3,1.44,0,1],[35.6,2.91,1.46,53.1,49.7,1.34,0,1],[34.0,2.82,1.43,56.4,49.7,1.45,0,1],[31.9,2.87,1.37,56.3,50.9,1.36,0,1],[34.2,2.82,1.37,55.8,46.6,1.35,0,1],[34.4,2.8,1.47,56.7,48.2,1.34,0,1],[35.2,2.97,1.42,60.0,55.2,1.39,0,1],[33.7,2.85,1.41,60.4,56.3,1.41,0,1],[32.5,2.93,1.47,55.8,50.8,1.35,0,1],[33.2,2.87,1.51,54.3,47.6,1.45,0,1],[33.0,2.91,1.33,57.8,53.7,1.39,0,1],[34.8,2.92,1.36,57.3,50.3,1.4,0,1],[34.2,2.89,1.35,52.6,47.3,1.39,0,1]]},{"id":"4_Watch_Blockage","label":"S-04  Watch + Blockage","rows":[[34.2,2.86,1.45,51.0,48.2,1.41,0,1],[33.5,2.85,1.36,57.1,49.0,1.35,0,1],[33.4,2.96,1.44,55.4,49.0,1.39,0,1],[38.1,2.85,1.38,56.6,46.9,1.4,0,1],[35.7,2.93,1.43,52.8,48.0,1.35,0,1],[33.1,2.9,1.47,59.9,52.8,1.41,0,1],[35.8,2.97,1.5,57.3,47.8,1.4,0,1],[33.9,2.95,1.39,53.2,50.4,1.28,0,1],[35.8,2.95,1.42,54.9,45.4,1.38,0,1],[34.9,2.85,1.45,59.7,52.2,1.45,0,1],[33.7,2.79,1.37,59.1,56.5,1.25,0,1],[31.8,2.87,1.46,55.7,51.3,1.42,0,1],[32.6,2.93,1.32,57.6,49.9,1.4,0,1],[34.2,2.76,1.41,53.3,50.8,1.4,0,1],[34.6,2.9,1.36,57.3,50.6,1.42,0,1],[33.2,2.91,1.34,60.0,55.3,1.45,0,1],[32.0,2.86,1.3,56.6,49.7,1.37,0,1],[35.4,2.96,1.43,57.0,54.6,1.43,0,1],[35.2,2.83,1.38,56.0,47.1,1.42,0,1],[34.2,2.82,1.43,55.4,45.6,1.35,0,1],[32.1,2.94,1.33,54.3,44.5,1.46,0,1],[32.7,2.9,1.36,55.4,47.4,1.47,0,1],[30.8,2.95,1.41,52.4,49.3,1.42,0,1],[36.0,2.89,1.45,58.5,50.4,1.43,0,1],[31.5,2.88,1.36,54.7,30.5,1.43,1,1],[34.4,2.93,1.42,52.9,23.0,1.43,1,1],[33.6,2.89,1.45,57.9,32.7,1.44,1,1],[34.2,2.91,1.43,58.4,29.3,1.45,1,1],[34.7,2.88,1.36,58.9,35.1,1.41,1,1],[35.9,2.78,1.33,59.1,35.4,1.42,1,1],[33.3,3.07,1.53,54.5,32.3,1.42,1,1],[32.7,2.79,1.4,55.4,28.1,1.32,1,1],[32.8,3.02,1.52,57.6,32.6,1.51,1,1],[35.4,2.89,1.42,59.1,30.2,1.46,1,1],[36.2,2.87,1.42,52.5,26.8,1.29,1,1],[34.3,2.92,1.39,57.9,28.1,1.41,1,1],[34.5,3.01,1.4,54.1,30.6,1.32,1,1],[34.8,2.96,1.42,53.8,24.8,1.38,1,1],[32.4,2.99,1.44,56.1,27.9,1.46,1,1],[36.8,2.94,1.47,56.9,28.8,1.47,1,1],[33.7,2.95,1.42,56.8,28.0,1.4,1,1],[33.3,3.06,1.39,53.6,25.5,1.35,1,1],[34.1,2.81,1.39,58.0,31.0,1.38,1,1],[32.3,2.9,1.45,54.9,31.9,1.41,1,1],[31.1,2.83,1.39,53.8,31.5,1.48,1,1],[34.7,2.86,1.38,56.9,27.5,1.41,1,1],[33.1,2.95,1.35,60.2,33.3,1.37,1,1],[34.6,3.13,1.36,56.8,28.4,1.4,1,1],[33.5,2.83,1.35,57.5,31.7,1.41,1,1],[33.2,2.91,1.35,57.7,34.7,1.42,1,1]]},{"id":"5_Watch_to_HighRisk","label":"S-05  Watch to High Risk","rows":[[32.1,2.91,1.43,57.2,50.6,1.49,0,1],[35.1,2.98,1.41,57.3,51.0,1.46,0,1],[34.6,3.06,1.49,56.3,49.5,1.46,0,1],[34.5,2.99,1.53,59.5,51.3,1.37,0,1],[35.9,3.04,1.44,58.8,50.3,1.49,0,1],[34.1,2.95,1.39,58.1,50.4,1.45,0,1],[37.2,3.06,1.5,60.0,50.4,1.51,0,1],[36.2,2.92,1.55,56.0,53.8,1.45,0,1],[39.2,3.11,1.48,57.3,53.8,1.53,0,1],[36.6,3.06,1.55,55.3,53.3,1.61,0,1],[38.8,3.14,1.57,57.2,50.0,1.66,0,1],[37.2,3.07,1.58,59.1,49.9,1.52,0,1],[37.5,3.11,1.49,60.2,56.3,1.65,0,1],[39.9,3.12,1.62,56.1,46.7,1.61,0,1],[40.7,3.17,1.67,58.1,55.6,1.61,0,1],[41.9,3.05,1.56,59.8,50.3,1.63,0,1],[40.7,3.07,1.59,61.5,56.7,1.7,0,1],[43.5,3.12,1.72,59.9,57.1,1.62,0,1],[45.9,3.13,1.61,60.8,54.9,1.61,0,1],[45.4,3.29,1.69,57.6,53.5,1.7,0,1],[41.1,3.18,1.68,59.4,55.1,1.76,0,1],[44.2,3.33,1.68,64.5,60.0,1.76,0,2],[43.7,3.22,1.77,65.3,56.9,1.75,0,2],[44.7,3.18,1.72,63.8,57.5,1.71,0,2],[48.2,3.34,1.75,64.8,60.4,1.79,0,2],[45.8,3.32,1.73,62.4,55.5,1.71,0,2],[46.7,3.32,1.78,63.0,55.3,1.78,0,2],[47.6,3.34,1.72,63.1,58.9,1.72,0,2],[48.5,3.41,1.79,64.5,59.2,1.77,0,2],[48.6,3.33,1.88,62.5,59.5,1.79,0,2],[44.7,3.49,1.77,62.4,58.9,1.81,0,2],[48.8,3.49,1.85,63.6,56.1,1.87,0,2],[49.8,3.44,1.83,66.7,63.3,1.84,0,2],[47.2,3.39,1.92,62.4,56.2,1.86,0,2],[50.3,3.48,1.84,65.7,58.0,1.84,0,2],[48.0,3.4,1.95,67.1,64.3,1.88,0,2],[50.0,3.43,1.91,62.3,55.8,1.9,0,2],[51.7,3.44,1.86,66.4,62.4,1.86,0,2],[49.1,3.52,1.88,65.8,56.1,1.95,0,2],[53.3,3.66,1.92,70.7,64.8,1.99,0,2],[54.7,3.59,1.97,65.2,56.7,2.0,0,2],[56.1,3.64,1.96,68.3,61.9,1.98,0,2],[54.1,3.57,2.03,71.4,69.1,1.98,0,2],[53.2,3.57,2.0,69.8,62.7,2.12,0,2],[52.2,3.59,1.99,68.0,58.4,2.03,0,2],[56.4,3.73,2.08,67.9,61.1,2.04,0,2],[58.1,3.56,2.08,69.3,60.7,1.95,0,2],[54.6,3.74,2.03,72.0,62.9,2.06,0,2],[59.8,3.7,2.04,69.3,65.5,2.08,0,2],[55.7,3.7,2.02,67.5,63.8,2.08,0,2]]},{"id":"6_Watch_to_HighRisk_Blocked","label":"S-06  Watch to High + Block","rows":[[34.3,2.8,1.36,56.8,28.7,1.41,1,1],[34.1,2.94,1.4,57.1,32.9,1.41,1,1],[37.6,2.88,1.41,54.7,32.5,1.47,1,1],[38.0,2.95,1.47,53.9,31.2,1.41,1,1],[35.2,3.04,1.46,58.2,28.4,1.46,1,1],[35.6,3.02,1.56,57.2,32.8,1.39,1,1],[37.9,3.0,1.49,54.9,26.8,1.47,1,1],[36.1,2.98,1.58,61.9,34.9,1.54,1,1],[40.2,3.01,1.56,55.0,30.0,1.51,1,1],[38.0,3.06,1.48,59.3,35.7,1.51,1,1],[40.0,3.14,1.6,61.4,38.4,1.52,1,1],[36.9,3.1,1.5,57.9,31.0,1.55,1,1],[40.2,3.12,1.63,58.2,30.0,1.65,1,1],[40.2,3.15,1.56,56.2,29.1,1.62,1,1],[41.1,3.12,1.66,58.8,32.6,1.64,1,1],[40.3,3.06,1.69,58.5,36.1,1.67,1,1],[43.5,3.17,1.66,61.7,32.0,1.58,1,1],[44.0,3.34,1.67,57.4,29.0,1.68,1,1],[41.5,3.12,1.61,60.8,36.5,1.65,1,1],[42.1,3.26,1.62,63.1,33.3,1.64,1,1],[42.1,3.19,1.68,61.8,35.0,1.78,1,1],[44.7,3.25,1.67,60.8,34.2,1.65,1,1],[45.1,3.19,1.73,62.7,34.8,1.8,1,2],[45.5,3.26,1.68,62.4,33.9,1.72,1,2],[44.9,3.3,1.82,61.8,34.5,1.76,1,2],[45.7,3.37,1.79,59.5,36.5,1.78,1,2],[46.9,3.38,1.83,65.0,40.3,1.83,1,2],[47.2,3.41,1.73,62.8,33.4,1.8,1,2],[49.4,3.33,1.84,61.9,38.1,1.83,1,2],[46.3,3.34,1.89,62.9,37.9,1.75,1,2],[49.8,3.37,1.83,63.4,38.0,1.83,1,2],[48.8,3.52,1.87,65.5,40.0,1.82,1,2],[49.4,3.53,1.92,65.7,38.8,1.94,1,2],[51.5,3.44,1.83,67.9,38.4,1.87,1,2],[50.9,3.53,1.89,62.9,39.0,1.9,1,2],[53.0,3.47,1.88,65.0,42.0,1.88,1,2],[49.2,3.5,1.85,65.4,41.9,1.83,1,2],[50.1,3.4,1.92,61.7,32.6,1.97,1,2],[53.5,3.59,1.88,64.5,37.3,1.85,1,2],[53.7,3.46,1.88,68.3,44.0,1.92,1,2],[52.2,3.61,1.93,65.2,36.7,2.0,1,2],[52.7,3.6,2.02,67.1,38.2,1.96,1,2],[52.3,3.6,2.01,65.7,37.0,1.93,1,2],[57.1,3.56,2.05,63.0,33.6,1.97,1,2],[54.3,3.59,2.02,65.8,41.8,2.1,1,2],[55.3,3.6,1.99,69.8,41.8,2.08,1,2],[55.5,3.63,2.06,69.0,43.3,2.02,1,2],[56.3,3.6,2.06,69.5,40.7,2.03,1,2],[55.6,3.74,1.99,68.7,40.8,2.02,1,2],[58.1,3.71,2.1,67.2,39.0,2.14,1,2]]},{"id":"7_HighRisk","label":"S-07  High Risk","rows":[[58.4,3.78,2.05,65.2,62.5,2.03,0,2],[56.4,3.76,2.08,70.1,61.0,2.06,0,2],[58.4,3.69,1.99,70.5,62.1,2.16,0,2],[60.2,3.77,2.0,69.6,63.5,2.1,0,2],[60.8,3.76,2.17,71.4,61.6,2.07,0,2],[54.4,3.71,2.05,65.0,59.7,2.18,0,2],[57.0,3.67,2.11,68.3,58.4,2.14,0,2],[55.2,3.7,2.05,67.3,60.0,2.15,0,2],[58.7,3.68,2.13,70.4,63.3,2.01,0,2],[61.8,3.76,2.03,75.0,71.7,2.09,0,2],[56.3,3.62,2.09,68.1,59.1,2.22,0,2],[58.0,3.73,2.16,70.2,64.8,2.15,0,2],[59.7,3.7,2.16,67.8,64.5,2.01,0,2],[59.3,3.74,2.04,69.3,67.2,2.06,0,2],[58.3,3.65,2.15,68.8,62.3,2.09,0,2],[58.7,3.71,2.09,74.3,68.1,2.16,0,2],[58.1,3.72,2.1,70.3,62.5,2.11,0,2],[57.4,3.71,2.02,68.4,59.3,2.1,0,2],[58.2,3.72,2.07,68.3,65.7,2.04,0,2],[58.6,3.74,2.17,66.3,58.4,2.13,0,2],[60.5,3.77,2.1,67.5,64.0,2.15,0,2],[59.3,3.69,2.08,68.3,59.4,2.09,0,2],[59.5,3.76,2.11,71.6,63.1,2.15,0,2],[56.8,3.7,2.12,69.4,63.1,2.16,0,2],[57.7,3.65,2.06,69.3,61.6,2.07,0,2],[53.7,3.58,2.11,67.4,62.9,2.1,0,2],[56.0,3.65,2.04,71.0,65.2,2.07,0,2],[60.2,3.83,2.18,70.4,61.9,2.17,0,2],[60.3,3.73,2.13,65.3,59.6,2.11,0,2],[56.4,3.79,2.12,70.4,65.5,2.12,0,2],[57.0,3.7,2.07,69.3,63.3,2.16,0,2],[60.2,3.69,2.09,67.2,58.6,2.09,0,2],[56.6,3.66,2.07,68.6,63.9,2.22,0,2],[58.4,3.65,2.07,68.9,65.5,2.11,0,2],[60.1,3.69,2.2,67.8,60.1,2.04,0,2],[58.8,3.62,2.01,72.3,63.7,2.14,0,2],[55.6,3.67,2.06,70.4,67.6,2.13,0,2],[57.2,3.73,2.14,69.5,65.6,2.06,0,2],[59.8,3.77,2.09,68.6,65.5,2.16,0,2],[58.3,3.72,2.14,68.5,63.7,2.22,0,2],[53.4,3.68,2.05,70.2,64.6,2.07,0,2],[60.4,3.73,2.1,69.2,61.2,2.19,0,2],[53.8,3.74,2.07,65.3,58.1,2.03,0,2],[58.3,3.6,2.01,69.0,62.1,2.08,0,2],[55.6,3.66,2.18,70.6,65.8,2.05,0,2],[61.8,3.8,2.04,68.5,59.8,2.19,0,2],[57.0,3.67,2.1,65.2,59.4,2.14,0,2],[56.6,3.73,2.08,70.8,60.9,2.05,0,2],[54.8,3.71,2.09,67.5,60.4,2.08,0,2],[56.8,3.63,2.15,66.7,63.7,2.14,0,2]]},{"id":"8_HighRisk_Blockage","label":"S-08  High Risk + Blockage","rows":[[58.6,3.72,2.05,69.8,65.5,2.11,0,2],[57.1,3.7,2.07,68.1,58.9,2.06,0,2],[58.2,3.64,2.1,71.5,68.6,2.05,0,2],[56.8,3.68,2.12,74.2,64.6,2.16,0,2],[60.6,3.59,2.16,71.5,67.0,2.09,0,2],[54.2,3.69,2.12,65.5,56.4,2.15,0,2],[58.9,3.64,2.19,66.8,60.0,2.16,0,2],[57.4,3.71,2.1,68.0,59.4,2.17,0,2],[58.7,3.67,2.12,70.0,60.1,2.2,0,2],[59.8,3.64,1.97,69.8,65.5,2.09,0,2],[58.1,3.76,2.09,66.2,56.5,2.05,0,2],[57.0,3.66,2.09,68.0,62.9,2.1,0,2],[57.2,3.84,1.96,68.7,63.6,2.08,0,2],[54.1,3.82,2.05,68.6,63.9,2.11,0,2],[56.9,3.73,2.06,66.4,60.1,2.13,0,2],[59.3,3.72,2.18,68.5,65.2,2.14,0,2],[62.4,3.89,2.07,71.5,65.1,2.08,0,2],[59.6,3.62,2.1,66.6,60.3,2.06,0,2],[60.3,3.61,2.05,66.9,58.8,2.08,0,2],[58.7,3.62,2.12,67.8,59.2,2.08,0,2],[59.7,3.75,2.06,71.5,65.9,2.2,0,2],[56.3,3.61,2.04,70.2,65.8,2.05,0,2],[61.9,3.71,2.1,70.3,66.2,2.05,0,2],[58.1,3.85,1.96,67.6,64.1,2.01,0,2],[55.9,3.78,2.07,69.6,23.4,2.12,2,2],[57.7,3.71,1.97,66.0,17.0,2.1,2,2],[57.8,3.63,2.05,69.5,26.4,2.07,2,2],[59.9,3.75,2.07,70.3,22.0,1.99,2,2],[58.2,3.72,2.15,69.4,26.4,2.08,2,2],[57.3,3.59,2.11,70.4,22.0,2.08,2,2],[62.1,3.61,2.1,70.6,26.4,2.15,2,2],[55.7,3.73,2.09,66.0,16.9,2.12,2,2],[57.9,3.76,2.16,71.6,22.0,2.06,2,2],[55.4,3.73,2.07,65.1,21.9,2.04,2,2],[58.4,3.85,2.04,69.5,23.8,2.2,2,2],[63.0,3.7,2.13,65.8,16.0,2.1,2,2],[57.3,3.7,2.03,65.3,19.4,2.12,2,2],[60.8,3.69,2.05,68.5,19.6,1.97,2,2],[55.4,3.63,2.1,67.8,21.1,2.1,2,2],[61.7,3.69,2.12,69.0,24.0,1.92,2,2],[59.9,3.73,2.1,69.4,25.1,2.1,2,2],[60.8,3.72,2.11,64.3,20.7,2.15,2,2],[51.8,3.75,2.19,65.7,17.6,2.09,2,2],[61.3,3.69,1.98,69.2,24.2,2.04,2,2],[59.5,3.74,2.07,68.1,22.0,1.95,2,2],[56.6,3.73,2.08,71.0,25.1,2.08,2,2],[60.1,3.73,2.08,69.4,22.8,2.04,2,2],[56.4,3.75,2.07,70.9,21.9,2.03,2,2],[60.2,3.63,2.19,70.8,20.9,2.13,2,2],[56.4,3.7,2.13,68.6,23.4,2.09,2,2]]},{"id":"9_HighRisk_to_Severe_Blocked","label":"S-09  High to Severe + Block","rows":[[60.3,3.71,2.01,71.1,24.0,2.1,2,2],[60.3,3.66,2.18,67.4,21.8,2.09,2,2],[59.6,3.67,2.07,70.5,27.4,2.12,2,2],[62.2,3.73,2.08,69.8,20.1,2.06,2,2],[55.3,3.79,2.2,69.0,22.7,2.21,2,2],[59.5,3.79,2.14,67.1,23.2,2.34,2,2],[61.2,3.71,2.12,70.6,24.6,2.3,2,2],[63.1,3.66,2.23,71.9,24.4,2.15,2,2],[63.6,3.76,2.22,68.9,26.3,2.37,2,2],[60.3,3.76,2.38,71.1,26.9,2.34,2,2],[64.6,3.71,2.27,70.4,22.0,2.34,2,2],[63.3,3.77,2.41,72.2,26.5,2.32,2,2],[64.0,3.87,2.47,69.9,23.6,2.33,2,2],[64.9,3.89,2.35,72.5,27.0,2.31,2,2],[68.2,3.83,2.45,71.5,29.1,2.28,2,2],[61.4,3.88,2.37,71.3,28.0,2.32,2,2],[65.6,3.82,2.53,69.3,23.8,2.37,2,2],[66.7,3.87,2.41,70.0,26.3,2.44,2,2],[69.0,3.82,2.48,72.8,30.4,2.49,2,2],[68.5,3.91,2.49,72.3,23.6,2.48,2,2],[65.2,3.94,2.47,75.0,25.1,2.42,2,2],[66.8,3.89,2.57,71.7,23.4,2.72,2,2],[67.5,3.97,2.59,72.6,23.7,2.61,2,2],[70.8,3.88,2.52,72.6,28.6,2.62,2,2],[68.0,4.05,2.65,71.1,21.4,2.7,2,2],[68.4,3.96,2.63,71.0,27.4,2.62,2,2],[74.7,3.95,2.7,74.2,24.6,2.72,2,2],[73.8,4.0,2.68,74.5,24.5,2.54,2,3],[72.7,4.01,2.77,74.4,26.7,2.66,2,3],[72.0,4.01,2.76,75.2,25.3,2.63,2,3],[73.9,4.05,2.68,75.4,28.9,2.65,2,3],[75.6,4.03,2.66,72.4,28.4,2.63,2,3],[74.3,4.06,2.81,75.3,29.8,2.79,2,3],[73.8,4.09,2.84,76.5,29.7,2.81,2,3],[77.4,4.1,2.75,76.0,33.4,2.8,2,3],[77.5,4.07,2.79,77.2,30.3,2.68,2,3],[77.0,4.07,2.91,75.5,25.7,2.89,2,3],[78.7,3.95,2.86,77.5,34.0,2.9,2,3],[79.3,4.16,2.86,77.6,29.3,2.86,2,3],[77.5,4.05,2.89,77.0,27.7,2.93,2,3],[75.3,4.11,2.85,80.0,30.5,2.85,2,3],[78.0,4.05,2.9,75.5,25.8,2.88,2,3],[76.6,4.01,2.95,76.6,30.4,3.02,2,3],[78.4,4.17,3.01,78.9,29.0,2.93,2,3],[79.4,4.08,2.98,79.2,31.1,2.99,2,3],[78.0,4.21,3.07,77.1,33.8,3.05,2,3],[79.5,4.15,3.12,77.4,31.6,3.09,2,3],[78.3,4.06,3.01,76.8,29.0,2.96,2,3],[83.6,4.14,3.12,78.0,34.0,2.97,2,3],[85.4,4.27,3.09,80.0,32.9,3.01,2,3]]},{"id":"10_Severe","label":"S-10  Severe","rows":[[83.8,4.22,3.19,78.2,74.2,3.08,0,3],[77.1,4.19,3.08,79.7,72.3,3.04,0,3],[82.7,4.22,3.04,78.0,70.3,3.14,0,3],[85.2,4.2,3.05,77.6,70.7,3.08,0,3],[82.0,4.28,3.13,76.7,72.2,3.09,0,3],[76.5,4.17,3.14,78.9,74.8,3.14,0,3],[76.8,4.17,3.07,79.4,72.7,3.09,0,3],[81.1,4.34,3.08,77.9,69.0,3.05,0,3],[85.5,4.34,3.29,76.0,66.4,3.08,0,3],[79.0,4.28,3.15,78.7,75.8,3.27,0,3],[82.4,4.18,3.16,76.0,72.8,3.14,0,3],[79.0,4.29,3.16,78.9,69.3,3.14,0,3],[81.1,4.19,3.08,80.0,72.1,3.11,0,3],[84.7,4.2,3.11,77.9,68.8,3.02,0,3],[84.5,4.16,3.13,77.0,73.3,3.08,0,3],[79.8,4.21,3.03,78.8,72.1,3.15,0,3],[81.6,4.15,3.11,79.5,71.9,2.94,0,3],[78.8,4.16,3.11,78.2,70.7,3.07,0,3],[81.8,4.23,3.05,79.8,74.5,3.03,0,3],[82.2,4.13,3.15,76.5,74.4,3.08,0,3],[81.0,4.12,3.11,78.0,71.4,3.12,0,3],[80.2,4.13,3.2,78.8,74.8,3.11,0,3],[88.0,4.35,3.02,78.7,73.1,3.07,0,3],[85.8,4.2,3.06,76.0,66.3,3.19,0,3],[78.4,4.19,3.13,79.4,74.2,2.95,0,3],[84.0,4.3,3.06,78.4,69.6,3.08,0,3],[80.9,4.23,3.12,77.7,74.2,3.13,0,3],[81.6,4.15,3.15,76.0,68.6,3.14,0,3],[82.6,4.26,3.0,79.9,70.1,3.09,0,3],[83.3,4.25,3.1,76.5,73.6,3.07,0,3],[85.2,4.25,3.1,77.2,75.1,3.09,0,3],[82.4,4.12,3.05,77.4,71.9,3.05,0,3],[80.7,4.28,3.18,80.0,77.2,3.04,0,3],[87.3,4.2,3.14,78.6,70.7,3.1,0,3],[80.3,4.16,3.12,78.5,69.2,3.05,0,3],[82.5,4.17,3.12,77.3,71.8,3.06,0,3],[81.0,4.11,3.09,78.8,74.7,3.14,0,3],[83.8,4.12,3.14,78.4,72.9,3.15,0,3],[78.7,4.26,3.12,80.0,72.2,3.12,0,3],[78.3,4.2,3.16,79.7,77.7,3.05,0,3],[88.4,4.08,3.16,76.7,70.0,2.97,0,3],[81.0,4.27,3.09,78.4,71.5,3.14,0,3],[82.1,4.16,3.12,77.0,69.9,3.07,0,3],[79.2,4.19,3.07,78.1,74.1,3.01,0,3],[79.6,4.16,3.08,77.3,69.6,3.12,0,3],[75.4,4.11,3.06,77.5,74.8,3.11,0,3],[80.6,4.28,3.15,77.5,73.9,3.13,0,3],[85.4,4.12,3.13,78.8,69.8,3.05,0,3],[80.9,4.24,3.15,77.4,69.5,2.99,0,3],[85.2,4.25,3.15,79.3,77.2,3.17,0,3]]}];

/* ── Risk rules (2-of-5) */
const SIM_SOURCES = [
  { fi: 0, label: 'Rainfall 24h',        unit: 'mm', w: 25, h: 45, s: 70,  max: 95 },
  { fi: 1, label: 'River Upstream',       unit: 'm',  w: 2.5, h: 3.5, s: 4.0, max: 4.8 },
  { fi: 2, label: 'River Downstream',     unit: 'm',  w: 1.2, h: 1.7, s: 2.9, max: 3.6 },
  { fi: 3, label: 'Drain Inflow',         unit: 'L/s',w: 48, h: 64, s: 76,  max: 92 },
  { fi: 4, label: 'Telecom Level',        unit: 'm',  w: 1.2, h: 1.7, s: 2.9, max: 3.6 },
];
const RISK_NAMES   = ['Normal', 'Watch', 'High Risk', 'Severe'];
const RISK_TONES   = ['ok', 'warn', 'crit', 'crit'];
const RISK_COLORS  = ['var(--c-ok)', 'var(--c-warn)', 'var(--c-crit)', 'var(--hi-vis)'];
const BLOCK_NAMES  = ['No blockage', 'Small blockage', 'Big blockage', 'Severe blockage'];
const BLOCK_TONES  = ['ok', 'warn', 'crit', 'crit'];

function sensorLevel(src, val) {
  if (val >= src.s) return 3;
  if (val >= src.h) return 2;
  if (val >= src.w) return 1;
  return 0;
}

function computeOverall(row) {
  const votes = SIM_SOURCES.map(s => sensorLevel(s, row[s.fi]));
  for (let lvl = 3; lvl >= 1; lvl--) {
    if (votes.filter(v => v >= lvl).length >= 2) return lvl;
  }
  return 0;
}

function computeBlockage(row) {
  const diff = row[3] - row[4]; // drain_in - drain_out
  if (diff > 60) return 3;
  if (diff > 40) return 2;
  if (diff > 20) return 1;
  return 0;
}

/* ── Sensor chart (SVG with threshold bands + live cursor) */
function SensorChart({ rows, idx, src }) {
  const W = 240, H = 130;
  const PL = 8, PR = 8, PT = 6, PB = 18;
  const vals = rows.map(r => r[src.fi]);
  const toX = i => PL + (i / (rows.length - 1)) * (W - PL - PR);
  const toY = v => PT + (1 - v / src.max) * (H - PT - PB);

  const safeIdx = Math.min(idx, rows.length - 1);
  const val = vals[safeIdx];
  const lvl = sensorLevel(src, val);
  const tone = RISK_TONES[lvl];
  const col  = RISK_COLORS[lvl];

  const pastPts   = vals.slice(0, safeIdx + 1).map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const futurePts = vals.slice(safeIdx).map((v, i) => `${toX(safeIdx + i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');

  const yW = toY(src.w), yH = toY(src.h), yS = toY(src.s);
  const cx = toX(safeIdx), cy = toY(val);
  const dec = src.unit === 'mm' || src.unit === 'L/s' ? 1 : 2;

  return (
    <div className="panel sim-chart-card" data-risk-level={lvl}>
      <div className="panel-head" style={{ padding: '7px 10px' }}>
        <span className="panel-title" style={{ fontSize: 9 }}>{src.label}</span>
        <Pill tone={tone}>{RISK_NAMES[lvl]}</Pill>
      </div>
      <div style={{ padding: '3px 10px 0', display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 600, color: col, fontVariantNumeric: 'tabular-nums', transition: 'color 500ms' }}>
          {val.toFixed(dec)}
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{src.unit}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block' }}>
        {/* threshold zones */}
        <rect x={PL} y={yS} width={W-PL-PR} height={toY(src.h)-yS} fill="var(--c-crit)" opacity="0.07" />
        <rect x={PL} y={yH} width={W-PL-PR} height={yW-yH}         fill="var(--c-warn)" opacity="0.07" />
        {/* threshold lines */}
        <line x1={PL} y1={yW} x2={W-PR} y2={yW} stroke="var(--c-warn)" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
        <line x1={PL} y1={yH} x2={W-PR} y2={yH} stroke="var(--c-crit)" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
        <line x1={PL} y1={yS} x2={W-PR} y2={yS} stroke="var(--hi-vis)" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
        {/* labels */}
        <text x={W-PR-2} y={yW-2} textAnchor="end" fontSize="7" fill="var(--c-warn)" opacity="0.75">W</text>
        <text x={W-PR-2} y={yH-2} textAnchor="end" fontSize="7" fill="var(--c-crit)" opacity="0.75">H</text>
        <text x={W-PR-2} y={yS-2} textAnchor="end" fontSize="7" fill="var(--hi-vis)" opacity="0.75">S</text>
        {/* future (dim) */}
        {safeIdx < rows.length - 1 && (
          <polyline fill="none" stroke="var(--ink-4)" strokeWidth="1" opacity="0.22" points={futurePts} />
        )}
        {/* past line */}
        {safeIdx >= 0 && (
          <polyline fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" points={pastPts} style={{ transition: 'stroke 500ms' }} />
        )}
        {/* cursor */}
        <line x1={cx} y1={PT} x2={cx} y2={H-PB} stroke={col} strokeWidth="1" opacity="0.35" />
        <circle cx={cx} cy={cy} r="4" fill={col} stroke="var(--bg-elev)" strokeWidth="1.5" style={{ transition: 'fill 500ms' }} />
        {/* x-axis ticks */}
        {[0, 12, 24, 36, 49].map(i => (
          <text key={i} x={toX(i)} y={H-4} textAnchor="middle" fontSize="7" fill="var(--ink-4)">{i+1}</text>
        ))}
      </svg>
    </div>
  );
}

/* ── Drain flow chart (dual-line inflow vs outflow) */
function DrainChart({ rows, idx }) {
  const W = 500, H = 100;
  const PL = 6, PR = 6, PT = 8, PB = 16;
  const maxV = 100;
  const toX = i => PL + (i / (rows.length - 1)) * (W - PL - PR);
  const toY = v => PT + (1 - v / maxV) * (H - PT - PB);

  const safeIdx = Math.min(idx, rows.length - 1);
  const inVals  = rows.map(r => r[3]);
  const outVals = rows.map(r => r[4]);

  const inPast    = inVals.slice(0, safeIdx + 1).map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const outPast   = outVals.slice(0, safeIdx + 1).map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const inFuture  = inVals.slice(safeIdx).map((v, i) => `${toX(safeIdx+i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const outFuture = outVals.slice(safeIdx).map((v, i) => `${toX(safeIdx+i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');

  const curIn  = inVals[safeIdx];
  const curOut = outVals[safeIdx];
  const blk    = computeBlockage(rows[safeIdx]);
  const blkCol = ['var(--c-ok)', 'var(--c-warn)', 'var(--c-crit)', 'var(--hi-vis)'][blk];

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ flex: 1, height: H, display: 'block', minWidth: 0 }}>
        {/* capacity line */}
        <line x1={PL} y1={toY(80)} x2={W-PR} y2={toY(80)} stroke="var(--ink-3)" strokeWidth="0.6" strokeDasharray="4,4" opacity="0.4" />
        <text x={PL+2} y={toY(80)-3} fontSize="7" fill="var(--ink-4)">capacity 80 L/s</text>
        {/* future dim */}
        {safeIdx < rows.length-1 && <>
          <polyline fill="none" stroke="var(--c-info)" strokeWidth="0.8" opacity="0.18" points={inFuture} />
          <polyline fill="none" stroke="var(--c-ok)"   strokeWidth="0.8" opacity="0.18" points={outFuture} />
        </>}
        {/* past lines */}
        <polyline fill="none" stroke="var(--c-info)" strokeWidth="2" strokeLinejoin="round" points={inPast} />
        <polyline fill="none" stroke="var(--c-ok)"   strokeWidth="2" strokeLinejoin="round" points={outPast} />
        {/* cursor */}
        <line x1={toX(safeIdx)} y1={PT} x2={toX(safeIdx)} y2={H-PB} stroke="var(--ink)" strokeWidth="0.8" opacity="0.2" />
        <circle cx={toX(safeIdx)} cy={toY(curIn)}  r="3.5" fill="var(--c-info)" stroke="var(--bg-elev)" strokeWidth="1.5" />
        <circle cx={toX(safeIdx)} cy={toY(curOut)} r="3.5" fill="var(--c-ok)"   stroke="var(--bg-elev)" strokeWidth="1.5" />
        {/* x ticks */}
        {[0, 12, 24, 36, 49].map(i => (
          <text key={i} x={toX(i)} y={H-3} textAnchor="middle" fontSize="7" fill="var(--ink-4)">{i+1}</text>
        ))}
      </svg>
      {/* legend / live readout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 150 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 3, background: 'var(--c-info)', borderRadius: 2 }} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Inflow</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{curIn.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 3, background: 'var(--c-ok)', borderRadius: 2 }} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Outflow</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{curOut.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 3, background: blkCol, borderRadius: 2, transition: 'background 500ms' }} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Diff</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, marginLeft: 'auto', color: blkCol, fontVariantNumeric: 'tabular-nums', transition: 'color 500ms' }}>
            +{Math.max(0, curIn - curOut).toFixed(1)}
          </span>
        </div>
        <div className="hr" style={{ margin: '0' }} />
        <Pill tone={BLOCK_TONES[blk]}>{BLOCK_NAMES[blk]}</Pill>
      </div>
    </div>
  );
}

/* ── Main simulation screen */
function ScreenSimulation() {
  const [sheetIdx, setSheetIdx] = useSim(0);
  const [step,     setStep]     = useSim(0);
  const [playing,  setPlaying]  = useSim(false);
  const [speed,    setSpeed]    = useSim(1);
  const timerRef = useSimRef(null);

  const sheet = SIM_SHEETS[sheetIdx];
  const rows  = sheet.rows;
  const total = rows.length;
  const safeIdx = Math.min(step, total - 1);
  const row   = rows[safeIdx];

  const computed = computeOverall(row);
  const blockage = computeBlockage(row);
  const refRisk  = row[7];
  const refBlock = row[6];
  const riskMatch  = computed === refRisk;
  const blockMatch = blockage === refBlock;
  const votes = SIM_SOURCES.map(s => sensorLevel(s, row[s.fi]));

  /* playback timer */
  useSimEffect(() => {
    clearInterval(timerRef.current);
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= total - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, 600 / speed);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed, total]);

  /* auto-start on sheet change */
  useSimEffect(() => {
    setStep(0);
    setPlaying(true);
  }, [sheetIdx]);

  const toggle  = () => setPlaying(p => !p);
  const restart = () => { setStep(0); setPlaying(true); };
  const prev    = () => { setPlaying(false); setStep(s => Math.max(0, s - 1)); };
  const next    = () => { setPlaying(false); setStep(s => Math.min(total - 1, s + 1)); };

  const riskTone  = RISK_TONES[computed];
  const riskColor = RISK_COLORS[computed];
  const pct = ((safeIdx + 1) / total) * 100;

  return (
    <div className="screen">

      {/* ── Dataset picker ── */}
      <Panel title="Select dataset" seq="DAT"
        right={<span className="mono dim" style={{ fontSize: 10 }}>10 SCENARIOS · 50 STEPS EACH</span>}>
        <div className="sim-picker">
          {SIM_SHEETS.map((sh, i) => (
            <button key={sh.id} className="sim-pick-btn"
              data-active={i === sheetIdx}
              data-risk={sh.rows[sh.rows.length - 1][7]}
              onClick={() => setSheetIdx(i)}>
              {sh.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* ── Main content ── */}
      <div className="sim-main">

        {/* ── Left column: risk + controls ── */}
        <div className="sim-left">

          {/* Big risk badge */}
          <div className="panel sim-risk-panel" data-risk-level={computed} style={{ borderColor: riskColor }}>
            <div className="panel-head" style={{ padding: '10px 14px' }}>
              <span className="panel-title" style={{ fontSize: 9 }}>OVERALL RISK</span>
              <span className="mono dim" style={{ fontSize: 9 }}>STEP {safeIdx + 1}/{total}</span>
            </div>
            <div className="sim-risk-body">
              <div className="sim-risk-name" style={{ color: riskColor, transition: 'color 500ms' }}>
                {RISK_NAMES[computed]}
              </div>
              <div className="sim-risk-glow" style={{ background: riskColor, transition: 'background 500ms' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: riskMatch ? 'var(--c-ok)' : 'var(--c-warn)' }}>
                  {riskMatch ? '✓ Matches reference' : `Expected: ${RISK_NAMES[refRisk]}`}
                </span>
              </div>
            </div>
          </div>

          {/* Sensor vote breakdown */}
          <Panel title="2-of-5 sensor votes" seq="VOT">
            <div style={{ display: 'grid', gap: 6 }}>
              {SIM_SOURCES.map((s, i) => (
                <div key={i} className="sim-vote-row">
                  <span className="sim-vote-label">{s.label}</span>
                  <span className="sim-vote-val mono" style={{ color: RISK_COLORS[votes[i]], transition: 'color 500ms' }}>
                    {row[s.fi].toFixed(s.unit === 'mm' || s.unit === 'L/s' ? 1 : 2)} {s.unit}
                  </span>
                  <span className="sim-vote-badge" data-level={votes[i]}>{RISK_NAMES[votes[i]]}</span>
                </div>
              ))}
              <div className="hr" style={{ margin: '4px 0' }} />
              <div className="sim-vote-row" style={{ fontWeight: 600 }}>
                <span className="sim-vote-label">Overall (2/5 rule)</span>
                <span className="sim-vote-val" />
                <span className="sim-vote-badge" data-level={computed}>{RISK_NAMES[computed]}</span>
              </div>
            </div>
          </Panel>

          {/* Blockage status */}
          <Panel title="Drainage blockage" seq="DRN">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Pill tone={BLOCK_TONES[blockage]}>{BLOCK_NAMES[blockage]}</Pill>
              {!blockMatch && (
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--c-warn)' }}>
                  expected: {BLOCK_NAMES[refBlock]}
                </span>
              )}
            </div>
            <div className="kv">
              <span className="k">Inflow</span>   <span className="v">{row[3].toFixed(1)} L/s</span>
              <span className="k">Outflow</span>  <span className="v">{row[4].toFixed(1)} L/s</span>
              <span className="k">Difference</span>
              <span className="v" style={{ color: blockage > 0 ? 'var(--c-warn)' : 'inherit' }}>
                {Math.max(0, row[3] - row[4]).toFixed(1)} L/s
              </span>
              <span className="k">Threshold (small)</span><span className="v">&gt; 20 L/s</span>
              <span className="k">Threshold (big)</span>  <span className="v">&gt; 40 L/s</span>
            </div>
          </Panel>

          {/* Playback controls */}
          <Panel title="Playback" seq="SIM">
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              <button className="btn ghost" style={{ padding: '7px 10px', fontSize: 11, flex: 1, justifyContent: 'center' }} onClick={restart}>↺</button>
              <button className="btn ghost" style={{ padding: '7px 10px', fontSize: 11, flex: 1, justifyContent: 'center' }} onClick={prev}>‹</button>
              <button className="btn" style={{ padding: '7px 14px', fontSize: 11, flex: 2, justifyContent: 'center' }} onClick={toggle}>
                {playing ? '⏸ Pause' : '▶ Play'}
              </button>
              <button className="btn ghost" style={{ padding: '7px 10px', fontSize: 11, flex: 1, justifyContent: 'center' }} onClick={next}>›</button>
            </div>
            {/* progress bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 6, background: 'var(--bg-inset)', borderRadius: 3, overflow: 'hidden', cursor: 'pointer' }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setStep(Math.round(pct * (total - 1)));
                  setPlaying(false);
                }}>
                <div style={{ height: '100%', width: `${pct}%`, background: riskColor, transition: 'background 500ms', borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span className="mono dim" style={{ fontSize: 9 }}>STEP {safeIdx + 1}</span>
                <span className="mono dim" style={{ fontSize: 9 }}>{playing ? 'PLAYING' : 'PAUSED'} · {speed}x</span>
                <span className="mono dim" style={{ fontSize: 9 }}>{total}</span>
              </div>
            </div>
            {/* speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mono dim" style={{ fontSize: 10, minWidth: 40 }}>SPEED</span>
              <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                {[0.5, 1, 2, 4].map(s => (
                  <button key={s} className="btn ghost"
                    style={{ padding: '4px 8px', fontSize: 10, flex: 1, justifyContent: 'center', background: speed === s ? 'var(--bg-inset)' : undefined }}
                    onClick={() => setSpeed(s)}>{s}x</button>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Right column: charts ── */}
        <div className="sim-right">

          {/* 5 sensor charts */}
          <div className="sim-charts-grid">
            {SIM_SOURCES.map((src, i) => (
              <SensorChart key={i} rows={rows} idx={safeIdx} src={src} />
            ))}
          </div>

          {/* Drain flow comparison */}
          <Panel title="Drainage — Inflow vs Outflow" seq="DRN.2"
            right={<span className="mono dim" style={{ fontSize: 9 }}>80 L/s PIPE CAPACITY</span>}>
            <DrainChart rows={rows} idx={safeIdx} />
          </Panel>

          {/* Threshold reference card */}
          <Panel title="Threshold reference" seq="REF">
            <div style={{ overflowX: 'auto' }}>
              <table className="sim-ref-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th style={{ color: 'var(--c-warn)' }}>Watch</th>
                    <th style={{ color: 'var(--c-crit)' }}>High Risk</th>
                    <th style={{ color: 'var(--hi-vis)' }}>Severe</th>
                  </tr>
                </thead>
                <tbody>
                  {SIM_SOURCES.map((s, i) => (
                    <tr key={i}>
                      <td>{s.label}</td>
                      <td>{s.w}–{s.h} {s.unit}</td>
                      <td>{s.h}–{s.s} {s.unit}</td>
                      <td>{s.s}+ {s.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 8, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--ink-3)' }}>
                Rule: 2 of 5 sources at threshold level triggers that risk level.
                Drain blockage: diff &gt;20 small · &gt;40 big · &gt;60 severe.
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.ScreenSimulation = ScreenSimulation;
