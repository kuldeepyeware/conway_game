"use client";

import { useState, useCallback, useRef } from "react";

const numRows = 30;
const numCols = 30;

const operations: [number, number][] = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = (): number[][] => {
  return Array.from({ length: numRows }, (): number[] =>
    Array.from({ length: numCols }, (): number => 0),
  );
};

function App(): React.ReactElement {
  const [grid, setGrid] = useState<number[][]>(generateEmptyGrid);
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      const newGrid = g.map((row) => [...row]);

      for (let i = 0; i < numRows; i++) {
        for (let k = 0; k < numCols; k++) {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newK = k + y;
            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
              const cell = g[newI]?.[newK];
              if (cell !== undefined) {
                neighbors += cell;
              }
            }
          });

          const currentCell = g[i]?.[k];
          if (currentCell !== undefined) {
            if (neighbors < 2 || neighbors > 3) {
              newGrid[i]![k] = 0;
            } else if (currentCell === 0 && neighbors === 3) {
              newGrid[i]![k] = 1;
            }
          }
        }
      }

      return newGrid;
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-4 space-x-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          onClick={() => {
            setRunning((prevRunning) => {
              runningRef.current = !prevRunning;
              if (!prevRunning) {
                runSimulation();
              }
              return !prevRunning;
            });
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          onClick={() => {
            const rows = Array.from({ length: numRows }, (): number[] =>
              Array.from({ length: numCols }, (): number =>
                Math.random() > 0.7 ? 1 : 0,
              ),
            );
            setGrid(rows);
          }}
        >
          Random
        </button>
      </div>
      <div className="flex h-[360px] w-[360px] flex-wrap bg-gray-200 md:h-[600px] md:w-[600px]">
        {grid.map((rows, i) =>
          rows.map((cell, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                setGrid((prevGrid) => {
                  const newGrid = prevGrid.map((row) => [...row]);
                  const currentCell = newGrid[i]?.[k];
                  if (currentCell !== undefined) {
                    newGrid[i]![k] = currentCell ? 0 : 1;
                  }
                  return newGrid;
                });
              }}
              className={`h-3 w-3 md:h-[20px] md:w-[20px] ${
                cell ? "bg-black" : "bg-white"
              } cursor-pointer border border-gray-300`}
            />
          )),
        )}
      </div>
    </div>
  );
}

export default App;
