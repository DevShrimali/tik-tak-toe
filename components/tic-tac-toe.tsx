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
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 lg:max-h-[95vh] flex flex-col justify-center relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0,_transparent_50%)]" />
      <div className="relative z-10 text-zinc-100 flex-shrink flex-grow-0 w-full">
        <header className="text-center pt-3 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
            Tic Tac Toe
          </h1>
        </header>
        <div className="p-2 md:p-4 w-full">
          <Tabs defaultValue="game" className="w-full">
            <TabsList className="grid w-full max-w-[200px] mx-auto grid-cols-2 mb-4 h-10 bg-zinc-900/60 p-1 rounded-xl border border-white/5 shadow-inner">
              <TabsTrigger value="game" className="rounded-lg text-sm font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all">Game</TabsTrigger>
              <TabsTrigger value="scores" className="rounded-lg text-sm font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all">
                <Trophy className="w-3.5 h-3.5 mr-1.5" />
                Scores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="game" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 flex flex-col items-center justify-center">
                  <div className="w-full flex justify-center scale-90 md:scale-95 origin-center">
                    <GameBoard board={board} onCellClick={handleMove} winningLine={winningLine} />
                  </div>

                  {gameOver && (
                    <div className="mt-2 p-3 w-full max-w-[400px] text-center bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                      {winner ? (
                        <p className="text-lg font-bold flex items-center justify-center mb-1">
                          {winner === PLAYER_X ? (
                            <span className="flex items-center">
                              Player 1 <X className="w-4 h-4 mx-2 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" /> wins!
                            </span>
                          ) : gameMode === GAME_MODES.TWO_PLAYER ? (
                            <span className="flex items-center">
                              Player 2 <Circle className="w-4 h-4 mx-2 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> wins!
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Computer <Circle className="w-4 h-4 mx-2 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> ({difficulty})
                              wins!
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-lg font-bold text-zinc-300 mb-1">It's a draw!</p>
                      )}
                      <Button onClick={resetGame} className="mt-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg px-4 py-2 text-sm transition-transform active:scale-95" size="sm">
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                        Play Again
                      </Button>
                    </div>
                  )}

                  {!gameOver && (
                    <div className="mt-2 p-2 w-full max-w-[400px] text-center bg-zinc-900/30 border border-white/5 rounded-xl flex items-center justify-center gap-2">
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                        Turn
                      </p>
                      <span className="h-4 w-px bg-white/10 mx-1"></span>
                      <p className="text-sm font-bold flex items-center m-0">
                        {currentPlayer === PLAYER_X ? (
                          <span className="flex items-center">
                            Player 1 <X className="w-4 h-4 ml-1.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                          </span>
                        ) : gameMode === GAME_MODES.TWO_PLAYER ? (
                          <span className="flex items-center">
                            Player 2 <Circle className="w-4 h-4 ml-1.5 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Computer <Circle className="w-4 h-4 ml-1.5 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-500">Game Mode</h3>
                    <RadioGroup value={gameMode} onValueChange={handleGameModeChange} className="grid grid-cols-2 gap-2">
                      <div>
                        <RadioGroupItem value={GAME_MODES.TWO_PLAYER} id="two-player" className="peer sr-only" />
                        <Label htmlFor="two-player" className="flex flex-col items-center justify-center p-2.5 border border-white/5 rounded-xl bg-zinc-900/40 peer-data-[state=checked]:bg-white/10 peer-data-[state=checked]:border-white/20 hover:bg-zinc-800/50 cursor-pointer transition-all">
                          <User className="w-5 h-5 mb-1.5 text-zinc-400 peer-data-[state=checked]:text-white" />
                          <span className="font-medium text-xs text-zinc-400 peer-data-[state=checked]:text-white">2 Player</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value={GAME_MODES.VS_COMPUTER} id="vs-computer" className="peer sr-only" />
                        <Label htmlFor="vs-computer" className="flex flex-col items-center justify-center p-2.5 border border-white/5 rounded-xl bg-zinc-900/40 peer-data-[state=checked]:bg-white/10 peer-data-[state=checked]:border-white/20 hover:bg-zinc-800/50 cursor-pointer transition-all">
                          <Cpu className="w-5 h-5 mb-1.5 text-zinc-400 peer-data-[state=checked]:text-white" />
                          <span className="font-medium text-xs text-zinc-400 peer-data-[state=checked]:text-white">vs CPU</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {gameMode === GAME_MODES.VS_COMPUTER && (
                    <div className="space-y-2 animate-in slide-in-from-top-4 fade-in duration-300">
                      <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-500">Difficulty</h3>
                      <RadioGroup value={difficulty} onValueChange={handleDifficultyChange} className="grid grid-cols-3 gap-2">
                        <div>
                          <RadioGroupItem value={DIFFICULTY.EASY} id="easy" className="peer sr-only" />
                          <Label htmlFor="easy" className="flex items-center justify-center py-2 text-[10px] uppercase tracking-wider font-semibold border border-white/5 rounded-lg bg-zinc-900/40 peer-data-[state=checked]:bg-emerald-500/20 peer-data-[state=checked]:border-emerald-500/50 peer-data-[state=checked]:text-emerald-400 text-zinc-400 hover:bg-zinc-800/50 cursor-pointer transition-all">Easy</Label>
                        </div>
                        <div>
                          <RadioGroupItem value={DIFFICULTY.HARD} id="hard" className="peer sr-only" />
                          <Label htmlFor="hard" className="flex items-center justify-center py-2 text-[10px] uppercase tracking-wider font-semibold border border-white/5 rounded-lg bg-zinc-900/40 peer-data-[state=checked]:bg-amber-500/20 peer-data-[state=checked]:border-amber-500/50 peer-data-[state=checked]:text-amber-400 text-zinc-400 hover:bg-zinc-800/50 cursor-pointer transition-all">Hard</Label>
                        </div>
                        <div>
                          <RadioGroupItem value={DIFFICULTY.IMPOSSIBLE} id="impossible" className="peer sr-only" />
                          <Label htmlFor="impossible" className="flex items-center justify-center py-2 text-[10px] uppercase tracking-wider font-semibold border border-white/5 rounded-lg bg-zinc-900/40 peer-data-[state=checked]:bg-rose-500/20 peer-data-[state=checked]:border-rose-500/50 peer-data-[state=checked]:text-rose-400 text-zinc-400 hover:bg-zinc-800/50 cursor-pointer transition-all">Imposs</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-500">Current Score</h3>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-3 bg-zinc-900/40 border border-white/5 rounded-2xl">
                        <p className="font-medium text-zinc-400 text-xs flex items-center justify-center mb-1">
                          P1 <X className="w-3 h-3 ml-1 text-cyan-400" />
                        </p>
                        <p className="text-2xl font-bold text-white tracking-tighter">{score.player1}</p>
                      </div>
                      <div className="p-3 bg-zinc-900/40 border border-white/5 rounded-2xl">
                        <p className="font-medium text-zinc-400 text-xs flex items-center justify-center mb-1">
                          {gameMode === GAME_MODES.TWO_PLAYER ? (
                            <span className="flex items-center">
                              P2 <Circle className="w-3 h-3 ml-1 text-rose-500" />
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Comp <Circle className="w-3 h-3 ml-1 text-rose-500" />
                            </span>
                          )}
                        </p>
                        <p className="text-2xl font-bold text-white tracking-tighter">
                          {gameMode === GAME_MODES.TWO_PLAYER ? score.player2 : score.computer}
                        </p>
                      </div>
                      <div className="col-span-2 p-2 bg-zinc-900/20 border border-white/5 rounded-xl flex items-center justify-between px-4">
                        <p className="font-medium text-zinc-400 text-xs uppercase tracking-widest">Draws</p>
                        <p className="text-xl font-bold text-white">{score.draws}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={resetGame} variant="outline" className="w-full bg-zinc-900/30 border-white/10 hover:bg-white/10 text-zinc-300 py-4 rounded-xl text-sm font-medium transition-all active:scale-95">
                    <RefreshCw className="w-3.5 h-3.5 mr-2" />
                    Reset Game
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scores">
              <ScoreBoard score={score} gameHistory={gameHistory} onResetScores={resetScores} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
