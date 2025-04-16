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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          High Scores
        </h3>
        <Button variant="outline" size="sm" onClick={onResetScores}>
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
          <h4 className="font-medium">Win Rate</h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  Player 1 <X className="w-3 h-3 ml-1 text-blue-600 dark:text-blue-400" />
                </span>
                <span>{player1Percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${player1Percentage}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  Player 2 <Circle className="w-3 h-3 ml-1 text-red-600 dark:text-red-400" />
                </span>
                <span>{player2Percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${player2Percentage}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  Computer <Circle className="w-3 h-3 ml-1 text-purple-600 dark:text-purple-400" />
                </span>
                <span>{computerPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${computerPercentage}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Draws</span>
                <span>{drawPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: `${drawPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Game History</h4>
        {gameHistory.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No games played yet. Start playing to record your history!
          </p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Mode</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Result</th>
                    <th className="px-4 py-2 text-left">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory
                    .slice()
                    .reverse()
                    .map((game, index) => (
                      <tr key={index} className="border-t dark:border-gray-700">
                        <td className="px-4 py-2">
                          {game.date.toLocaleDateString()}{" "}
                          {game.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-2">{game.mode === "two-player" ? "Two Player" : "vs Computer"}</td>
                        <td className="px-4 py-2">
                          {game.difficulty ? game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1) : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={
                              game.result === "win"
                                ? "text-green-600 dark:text-green-400"
                                : game.result === "loss"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-600 dark:text-gray-400"
                            }
                          >
                            {game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-2">{game.winner}</td>
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
