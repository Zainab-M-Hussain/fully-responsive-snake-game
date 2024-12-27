'use client';
import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20; // Fixed cell size in pixels
const SPEED = 200;

type Position = {
  x: number;
  y: number;
};

const App: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateFood = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[0];

    let newHead: Position;
    switch (direction) {
      case "UP":
        newHead = { x: head.x, y: (head.y - 1 + GRID_SIZE) % GRID_SIZE };
        break;
      case "DOWN":
        newHead = { x: head.x, y: (head.y + 1) % GRID_SIZE };
        break;
      case "LEFT":
        newHead = { x: (head.x - 1 + GRID_SIZE) % GRID_SIZE, y: head.y };
        break;
      case "RIGHT":
        newHead = { x: (head.x + 1) % GRID_SIZE, y: head.y };
        break;
      default:
        return;
    }

    if (newSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    if (gameOver) return;
    gameLoop.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [snake, direction, gameOver]);

  const handleDirectionChange = (newDirection: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    if (
      (newDirection === "UP" && direction !== "DOWN") ||
      (newDirection === "DOWN" && direction !== "UP") ||
      (newDirection === "LEFT" && direction !== "RIGHT") ||
      (newDirection === "RIGHT" && direction !== "LEFT")
    ) {
      setDirection(newDirection);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div
        className="relative"
        style={{
          width: `${GRID_SIZE * CELL_SIZE}px`,
          height: `${GRID_SIZE * CELL_SIZE}px`,
          backgroundColor: "#1e293b",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`w-5 h-5 ${
                isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-gray-800"
              }`}
            ></div>
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => {
              setSnake([{ x: 10, y: 10 }]);
              setFood(generateFood());
              setDirection("RIGHT");
              setGameOver(false);
            }}
          >
            Restart
          </button>
        </div>
      )}
      <div className="mt-4 flex gap-4">
        <button
          className="p-4 bg-blue-500 hover:bg-blue-600 rounded"
          onClick={() => handleDirectionChange("UP")}
        >
          Up
        </button>
        <div className="flex gap-4">
          <button
            className="p-4 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => handleDirectionChange("LEFT")}
          >
            Left
          </button>
          <button
            className="p-4 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => handleDirectionChange("RIGHT")}
          >
            Right
          </button>
        </div>
        <button
          className="p-4 bg-blue-500 hover:bg-blue-600 rounded"
          onClick={() => handleDirectionChange("DOWN")}
        >
          Down
        </button>
      </div>
    </div>
  );
};

export default App;

