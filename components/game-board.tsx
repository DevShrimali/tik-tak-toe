"use client"

import { cn } from "@/lib/utils"
import { X, Circle } from "lucide-react"
import { motion } from "framer-motion"

interface GameBoardProps {
  board: (string | null)[]
  onCellClick: (index: number) => void
  winningLine: number[] | null
}

export default function GameBoard({ board, onCellClick, winningLine }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 w-[350px] sm:w-[400px] aspect-square mx-auto p-4 md:p-6 bg-zinc-950/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
      {board.map((cell, index) => {
        const isWinningCell = winningLine?.includes(index)
        return (
          <button
            key={index}
            className={cn(
              "relative flex items-center justify-center text-4xl md:text-6xl font-bold rounded-2xl transition-all duration-300 overflow-hidden group",
              "bg-zinc-900/50 border border-white/5 hover:border-white/20 hover:bg-zinc-800/60",
              "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_15px_rgba(0,0,0,0.3)]",
              isWinningCell && "bg-emerald-500/10 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]",
              cell !== null && "pointer-events-none"
            )}
            onClick={() => onCellClick(index)}
            disabled={cell !== null}
          >
            {/* Hover subtle glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />

            {cell === "X" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <X className="w-14 h-14 md:w-20 md:h-20 text-cyan-400 stroke-[2.5] drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
              </motion.div>
            )}
            {cell === "O" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Circle className="w-14 h-14 md:w-20 md:h-20 text-rose-500 stroke-[2.5] drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
              </motion.div>
            )}
          </button>
        )
      })}
    </div>
  )
}
