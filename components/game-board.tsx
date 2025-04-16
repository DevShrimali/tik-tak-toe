"use client"

import { cn } from "@/lib/utils"
import { X, Circle } from "lucide-react"

interface GameBoardProps {
  board: (string | null)[]
  onCellClick: (index: number) => void
  winningLine: number[] | null
}

export default function GameBoard({ board, onCellClick, winningLine }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 aspect-square">
      {board.map((cell, index) => (
        <button
          key={index}
          className={cn(
            "flex items-center justify-center text-4xl md:text-6xl font-bold bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700",
            winningLine?.includes(index) && "bg-green-100 dark:bg-green-900",
          )}
          onClick={() => onCellClick(index)}
          disabled={cell !== null}
        >
          {cell === "X" && <X className="w-12 h-12 md:w-16 md:h-16 text-blue-600 dark:text-blue-400 stroke-[2.5]" />}
          {cell === "O" && <Circle className="w-12 h-12 md:w-16 md:h-16 text-red-600 dark:text-red-400 stroke-[2.5]" />}
        </button>
      ))}
    </div>
  )
}
