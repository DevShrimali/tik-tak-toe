"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Trophy, X, Circle } from "lucide-react"

type ScoreType = {
  player1: number
  player2: number
  computer: number
  draws: number
}

type GameHistoryType = {
  date: Date
  mode: string
  difficulty?: string
  result: string
  winner: string
}

interface ScoreBoardProps {
  score: ScoreType
  gameHistory: GameHistoryType[]
  onResetScores: () => void
}

export default function ScoreBoard({ score, gameHistory, onResetScores }: ScoreBoardProps) {
  // Calculate total games
  const totalGames = score.player1 + score.player2 + score.computer + score.draws

  // Calculate win percentages
  const player1Percentage = totalGames > 0 ? Math.round((score.player1 / totalGames) * 100) : 0
  const player2Percentage = totalGames > 0 ? Math.round((score.player2 / totalGames) * 100) : 0
  const computerPercentage = totalGames > 0 ? Math.round((score.computer / totalGames) * 100) : 0
  const drawPercentage = totalGames > 0 ? Math.round((score.draws / totalGames) * 100) : 0

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h3 className="text-2xl font-bold flex items-center text-white drop-shadow-md">
          <Trophy className="w-6 h-6 mr-3 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
          High Scores
        </h3>
        <Button variant="outline" size="sm" onClick={onResetScores} className="bg-zinc-900/50 hover:bg-zinc-800 border-white/10 text-zinc-300">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Scores
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h4 className="font-medium">Statistics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Games:</span>
              <span className="font-bold">{totalGames}</span>
            </div>
            <div className="flex justify-between">
              <span>Player 1 (X) Wins:</span>
              <span className="font-bold">
                {score.player1} ({player1Percentage}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Player 2 (O) Wins:</span>
              <span className="font-bold">
                {score.player2} ({player2Percentage}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Computer Wins:</span>
              <span className="font-bold">
                {score.computer} ({computerPercentage}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Draws:</span>
              <span className="font-bold">
                {score.draws} ({drawPercentage}%)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-white mb-4">Win Rate</h4>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center text-zinc-300">
                  Player 1 <X className="w-3.5 h-3.5 ml-1.5 text-cyan-400" />
                </span>
                <span className="text-zinc-400">{player1Percentage}%</span>
              </div>
              <div className="w-full bg-zinc-900 overflow-hidden shadow-inner border border-white/5 rounded-full h-3">
                <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out" style={{ width: `${player1Percentage}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center text-zinc-300">
                  Player 2 <Circle className="w-3.5 h-3.5 ml-1.5 text-rose-500" />
                </span>
                <span className="text-zinc-400">{player2Percentage}%</span>
              </div>
              <div className="w-full bg-zinc-900 overflow-hidden shadow-inner border border-white/5 rounded-full h-3">
                <div className="bg-gradient-to-r from-rose-600 to-rose-500 h-full rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-1000 ease-out" style={{ width: `${player2Percentage}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center text-zinc-300">
                  Computer <Circle className="w-3.5 h-3.5 ml-1.5 text-purple-500" />
                </span>
                <span className="text-zinc-400">{computerPercentage}%</span>
              </div>
              <div className="w-full bg-zinc-900 overflow-hidden shadow-inner border border-white/5 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out" style={{ width: `${computerPercentage}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-300">Draws</span>
                <span className="text-zinc-400">{drawPercentage}%</span>
              </div>
              <div className="w-full bg-zinc-900 overflow-hidden shadow-inner border border-white/5 rounded-full h-3">
                <div className="bg-gradient-to-r from-zinc-600 to-zinc-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${drawPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <h4 className="font-semibold text-lg text-white">Game History</h4>
        {gameHistory.length === 0 ? (
          <div className="text-center bg-zinc-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-zinc-400 text-sm tracking-wide">
              No games played yet. Start playing to record your history!
            </p>
          </div>
        ) : (
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-900/60 backdrop-blur-lg shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-zinc-300 font-medium">
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Mode</th>
                    <th className="px-5 py-3 text-left">Difficulty</th>
                    <th className="px-5 py-3 text-left">Result</th>
                    <th className="px-5 py-3 text-left">Winner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-400">
                  {gameHistory
                    .slice()
                    .reverse()
                    .map((game, index) => (
                      <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 whitespace-nowrap">
                          {game.date.toLocaleDateString()}{" "}
                          <span className="text-zinc-500">
                            {game.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                        <td className="px-5 py-3">{game.mode === "two-player" ? "Two Player" : "vs Computer"}</td>
                        <td className="px-5 py-3">
                          {game.difficulty ? (
                            <span className="px-2 py-1 bg-white/5 rounded-md text-xs font-medium uppercase tracking-wider">{game.difficulty}</span>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={
                              game.result === "win"
                                ? "text-emerald-400 font-medium drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]"
                                : game.result === "loss"
                                  ? "text-rose-400 font-medium drop-shadow-[0_0_5px_rgba(251,113,133,0.5)]"
                                  : "text-zinc-400 font-medium"
                            }
                          >
                            {game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-medium text-zinc-200">{game.winner}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
