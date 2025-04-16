"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, RefreshCw, User, Cpu, X, Circle } from "lucide-react"
import GameBoard from "./game-board"
import ScoreBoard from "./score-board"

// Game modes
const GAME_MODES = {
  TWO_PLAYER: "two-player",
  VS_COMPUTER: "vs-computer",
}

// Difficulty levels
const DIFFICULTY = {
  EASY: "easy",
  HARD: "hard",
  IMPOSSIBLE: "impossible",
}

// Player symbols
const PLAYER_X = "X"
const PLAYER_O = "O"

// Game result types
const RESULT = {
  WIN: "win",
  LOSS: "loss",
  DRAW: "draw",
}

// Initial game state
const initialGameState = Array(9).fill(null)

// Winning combinations
const winningCombinations = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
]

// Score type
type ScoreType = {
  player1: number
  player2: number
  computer: number
  draws: number
}

// Game history type
type GameHistoryType = {
  date: Date
  mode: string
  difficulty?: string
  result: string
  winner: string
}

export default function TicTacToe() {
  // Game state
  const [board, setBoard] = useState<(string | null)[]>(initialGameState)
  const [currentPlayer, setCurrentPlayer] = useState<string>(PLAYER_X)
  const [gameMode, setGameMode] = useState<string>(GAME_MODES.TWO_PLAYER)
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTY.EASY)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)

  // Score tracking
  const [score, setScore] = useState<ScoreType>({
    player1: 0,
    player2: 0,
    computer: 0,
    draws: 0,
  })

  // Game history
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([])

  // Handle player move
  const handleMove = (index: number) => {
    // Ignore if cell is already filled or game is over
    if (board[index] || gameOver) return

    // Create new board with the move
    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    // Check for win or draw
    const result = checkGameResult(newBoard)
    if (result.gameOver) {
      handleGameOver(result.winner, result.winningLine)
      return
    }

    // Switch player
    const nextPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X
    setCurrentPlayer(nextPlayer)

    // If playing against computer and it's computer's turn
    if (gameMode === GAME_MODES.VS_COMPUTER && nextPlayer === PLAYER_O) {
      setTimeout(() => makeComputerMove(newBoard), 500)
    }
  }

  // Computer move based on difficulty
  const makeComputerMove = (currentBoard: (string | null)[]) => {
    if (gameOver) return

    let moveIndex: number

    switch (difficulty) {
      case DIFFICULTY.IMPOSSIBLE:
        moveIndex = getBestMove(currentBoard, PLAYER_O)
        break
      case DIFFICULTY.HARD:
        // 70% chance of making the best move, 30% chance of random move
        moveIndex = Math.random() < 0.7 ? getBestMove(currentBoard, PLAYER_O) : getRandomMove(currentBoard)
        break
      case DIFFICULTY.EASY:
      default:
        // Random move
        moveIndex = getRandomMove(currentBoard)
        break
    }

    if (moveIndex !== -1) {
      const newBoard = [...currentBoard]
      newBoard[moveIndex] = PLAYER_O
      setBoard(newBoard)

      // Check for win or draw
      const result = checkGameResult(newBoard)
      if (result.gameOver) {
        handleGameOver(result.winner, result.winningLine)
        return
      }

      // Switch back to player
      setCurrentPlayer(PLAYER_X)
    }
  }

  // Get random valid move
  const getRandomMove = (currentBoard: (string | null)[]): number => {
    const availableMoves = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null) as number[]

    if (availableMoves.length === 0) return -1

    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  // Minimax algorithm for impossible difficulty
  const getBestMove = (currentBoard: (string | null)[], player: string): number => {
    // Get available moves
    const availableMoves = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null) as number[]

    if (availableMoves.length === 0) return -1

    // If only one move is available, return it
    if (availableMoves.length === 1) return availableMoves[0]

    // For first move, choose a corner or center for variety
    if (availableMoves.length >= 8) {
      const goodFirstMoves = [0, 2, 4, 6, 8]
      const filteredMoves = goodFirstMoves.filter((move) => availableMoves.includes(move))
      return filteredMoves[Math.floor(Math.random() * filteredMoves.length)]
    }

    let bestScore = Number.NEGATIVE_INFINITY
    let bestMove = -1

    // Try each available move
    for (const move of availableMoves) {
      const newBoard = [...currentBoard]
      newBoard[move] = player

      // Calculate score for this move
      const score = minimax(newBoard, 0, false)

      // Update best move if this score is better
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }

  // Minimax helper function
  const minimax = (currentBoard: (string | null)[], depth: number, isMaximizing: boolean): number => {
    // Check if game is over
    const result = checkGameResult(currentBoard)
    if (result.gameOver) {
      if (result.winner === PLAYER_O) return 10 - depth // Computer wins
      if (result.winner === PLAYER_X) return depth - 10 // Player wins
      return 0 // Draw
    }

    if (isMaximizing) {
      // Computer's turn (maximizing)
      let bestScore = Number.NEGATIVE_INFINITY
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard]
          newBoard[i] = PLAYER_O
          const score = minimax(newBoard, depth + 1, false)
          bestScore = Math.max(bestScore, score)
        }
      }
      return bestScore
    } else {
      // Player's turn (minimizing)
      let bestScore = Number.POSITIVE_INFINITY
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard]
          newBoard[i] = PLAYER_X
          const score = minimax(newBoard, depth + 1, true)
          bestScore = Math.min(bestScore, score)
        }
      }
      return bestScore
    }
  }

  // Check if game is over (win or draw)
  const checkGameResult = (currentBoard: (string | null)[]) => {
    // Check for win
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return {
          gameOver: true,
          winner: currentBoard[a],
          winningLine: combination,
        }
      }
    }

    // Check for draw
    if (!currentBoard.includes(null)) {
      return {
        gameOver: true,
        winner: null,
        winningLine: null,
      }
    }

    // Game is still ongoing
    return {
      gameOver: false,
      winner: null,
      winningLine: null,
    }
  }

  // Handle game over
  const handleGameOver = (winnerSymbol: string | null, line: number[] | null) => {
    setGameOver(true)
    setWinner(winnerSymbol)
    setWinningLine(line)

    // Update score
    const newScore = { ...score }
    const newHistory = [...gameHistory]

    if (winnerSymbol === PLAYER_X) {
      newScore.player1 += 1
      newHistory.push({
        date: new Date(),
        mode: gameMode,
        difficulty: gameMode === GAME_MODES.VS_COMPUTER ? difficulty : undefined,
        result: RESULT.WIN,
        winner: "Player 1",
      })
    } else if (winnerSymbol === PLAYER_O) {
      if (gameMode === GAME_MODES.TWO_PLAYER) {
        newScore.player2 += 1
        newHistory.push({
          date: new Date(),
          mode: gameMode,
          result: RESULT.WIN,
          winner: "Player 2",
        })
      } else {
        newScore.computer += 1
        newHistory.push({
          date: new Date(),
          mode: gameMode,
          difficulty,
          result: RESULT.LOSS,
          winner: `Computer (${difficulty})`,
        })
      }
    } else {
      // Draw
      newScore.draws += 1
      newHistory.push({
        date: new Date(),
        mode: gameMode,
        difficulty: gameMode === GAME_MODES.VS_COMPUTER ? difficulty : undefined,
        result: RESULT.DRAW,
        winner: "None (Draw)",
      })
    }

    setScore(newScore)
    setGameHistory(newHistory)
  }

  // Reset game
  const resetGame = () => {
    setBoard(initialGameState)
    setCurrentPlayer(PLAYER_X)
    setGameOver(false)
    setWinner(null)
    setWinningLine(null)

    // If playing against computer and computer goes first (O), make computer move
    if (gameMode === GAME_MODES.VS_COMPUTER && currentPlayer === PLAYER_O) {
      setTimeout(() => makeComputerMove(initialGameState), 500)
    }
  }

  // Handle game mode change
  const handleGameModeChange = (mode: string) => {
    setGameMode(mode)
    resetGame()
  }

  // Handle difficulty change
  const handleDifficultyChange = (level: string) => {
    setDifficulty(level)
    resetGame()
  }

  // Reset scores
  const resetScores = () => {
    setScore({
      player1: 0,
      player2: 0,
      computer: 0,
      draws: 0,
    })
    setGameHistory([])
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Tic Tac Toe</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="game" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="game">Game</TabsTrigger>
              <TabsTrigger value="scores">
                <Trophy className="w-4 h-4 mr-2" />
                High Scores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="game" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <GameBoard board={board} onCellClick={handleMove} winningLine={winningLine} />

                  {gameOver && (
                    <div className="mt-4 p-4 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {winner ? (
                        <p className="text-xl font-bold flex items-center justify-center">
                          {winner === PLAYER_X ? (
                            <span className="flex items-center">
                              Player 1 <X className="w-5 h-5 mx-1 text-blue-600 dark:text-blue-400" /> wins!
                            </span>
                          ) : gameMode === GAME_MODES.TWO_PLAYER ? (
                            <span className="flex items-center">
                              Player 2 <Circle className="w-5 h-5 mx-1 text-red-600 dark:text-red-400" /> wins!
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Computer <Circle className="w-5 h-5 mx-1 text-red-600 dark:text-red-400" /> ({difficulty})
                              wins!
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-xl font-bold">It's a draw!</p>
                      )}
                      <Button onClick={resetGame} className="mt-2" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                    </div>
                  )}

                  {!gameOver && (
                    <div className="mt-4 p-4 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="text-xl font-bold flex items-center justify-center">
                        Current Player:{" "}
                        {currentPlayer === PLAYER_X ? (
                          <span className="flex items-center ml-2">
                            Player 1 <X className="w-5 h-5 ml-1 text-blue-600 dark:text-blue-400" />
                          </span>
                        ) : gameMode === GAME_MODES.TWO_PLAYER ? (
                          <span className="flex items-center ml-2">
                            Player 2 <Circle className="w-5 h-5 ml-1 text-red-600 dark:text-red-400" />
                          </span>
                        ) : (
                          <span className="flex items-center ml-2">
                            Computer <Circle className="w-5 h-5 ml-1 text-red-600 dark:text-red-400" />
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Game Mode</h3>
                    <RadioGroup value={gameMode} onValueChange={handleGameModeChange} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={GAME_MODES.TWO_PLAYER} id="two-player" />
                        <Label htmlFor="two-player" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Two Player
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={GAME_MODES.VS_COMPUTER} id="vs-computer" />
                        <Label htmlFor="vs-computer" className="flex items-center">
                          <Cpu className="w-4 h-4 mr-2" />
                          vs Computer
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {gameMode === GAME_MODES.VS_COMPUTER && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Difficulty</h3>
                      <RadioGroup value={difficulty} onValueChange={handleDifficultyChange} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={DIFFICULTY.EASY} id="easy" />
                          <Label htmlFor="easy">Easy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={DIFFICULTY.HARD} id="hard" />
                          <Label htmlFor="hard">Hard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={DIFFICULTY.IMPOSSIBLE} id="impossible" />
                          <Label htmlFor="impossible">Impossible</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Current Score</h3>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium flex items-center justify-center">
                          Player 1 <X className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
                        </p>
                        <p className="text-2xl font-bold">{score.player1}</p>
                      </div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium flex items-center justify-center">
                          {gameMode === GAME_MODES.TWO_PLAYER ? (
                            <span className="flex items-center">
                              Player 2 <Circle className="w-4 h-4 ml-1 text-red-600 dark:text-red-400" />
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Computer <Circle className="w-4 h-4 ml-1 text-red-600 dark:text-red-400" />
                            </span>
                          )}
                        </p>
                        <p className="text-2xl font-bold">
                          {gameMode === GAME_MODES.TWO_PLAYER ? score.player2 : score.computer}
                        </p>
                      </div>
                      <div className="col-span-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium">Draws</p>
                        <p className="text-2xl font-bold">{score.draws}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={resetGame} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Game
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scores">
              <ScoreBoard score={score} gameHistory={gameHistory} onResetScores={resetScores} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
