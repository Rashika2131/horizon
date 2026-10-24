import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StagnantGoal = 'promotion' | 'switch'

export interface LevelProgress {
  unlockedLevel: number
  completedLevels: number[]
  levelStars: Record<number, number>
  xp: number
  streak: number
  lastQuizResult?: Record<
    number,
    {
      isPassed: boolean
      selectedOptionId: string
      timestamp: string
    }
  >
}

interface GamificationState {
  stagnantGoal: StagnantGoal
  userLevels: Record<string, LevelProgress>
  // UI state
  activeModalLevel: number | null
  activeQuizLevel: number | null
  showLevelMapModal: boolean
  soundEnabled: boolean
  completedTasks: Record<string, boolean>

  // Actions
  setStagnantGoal: (goal: StagnantGoal) => void
  toggleSound: () => void
  toggleTask: (personaKey: string, levelNum: number, taskIdx: number) => void
  isTaskCompleted: (personaKey: string, levelNum: number, taskIdx: number) => boolean
  completeLevel: (personaKey: string, levelNum: number, stars?: number, xpBonus?: number) => void
  unlockLevel: (personaKey: string, levelNum: number) => void
  recordQuizResult: (
    personaKey: string,
    levelNum: number,
    isPassed: boolean,
    selectedOptionId: string,
  ) => void
  getProgress: (personaKey: string) => LevelProgress
  resetProgress: (personaKey: string) => void
  setActiveModalLevel: (level: number | null) => void
  setActiveQuizLevel: (level: number | null) => void
  setShowLevelMapModal: (show: boolean) => void
}

const DEFAULT_PROGRESS: LevelProgress = {
  unlockedLevel: 1,
  completedLevels: [],
  levelStars: {},
  xp: 100,
  streak: 1,
  lastQuizResult: {},
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      stagnantGoal: 'promotion',
      userLevels: {},
      activeModalLevel: null,
      activeQuizLevel: null,
      showLevelMapModal: false,
      soundEnabled: true,
      completedTasks: {},

      setStagnantGoal: (goal) => set({ stagnantGoal: goal }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      toggleTask: (personaKey, levelNum, taskIdx) => {
        const state = get()
        const key = `${personaKey}:${levelNum}:${taskIdx}`
        const wasDone = !!state.completedTasks[key]
        const nextState = !wasDone
        const updatedTasks = { ...state.completedTasks, [key]: nextState }

        // If newly completed, award +25 XP
        const currentProgress = state.userLevels[personaKey] || { ...DEFAULT_PROGRESS }
        const xpDelta = nextState ? 25 : -25
        const updatedProgress = {
          ...currentProgress,
          xp: Math.max(0, currentProgress.xp + xpDelta),
        }

        set({
          completedTasks: updatedTasks,
          userLevels: {
            ...state.userLevels,
            [personaKey]: updatedProgress,
          },
        })
      },

      isTaskCompleted: (personaKey, levelNum, taskIdx) => {
        const state = get()
        return !!state.completedTasks[`${personaKey}:${levelNum}:${taskIdx}`]
      },

      setActiveModalLevel: (level) => set({ activeModalLevel: level }),
      setActiveQuizLevel: (level) => set({ activeQuizLevel: level }),
      setShowLevelMapModal: (show) => set({ showLevelMapModal: show }),

      getProgress: (personaKey) => {
        const state = get()
        return state.userLevels[personaKey] || { ...DEFAULT_PROGRESS }
      },

      completeLevel: (personaKey, levelNum, stars = 3, xpBonus = 150) => {
        const state = get()
        const current = state.userLevels[personaKey] || { ...DEFAULT_PROGRESS }
        const alreadyCompleted = current.completedLevels.includes(levelNum)
        const newCompleted = alreadyCompleted
          ? current.completedLevels
          : [...current.completedLevels, levelNum].sort((a, b) => a - b)

        const nextLevel = Math.max(current.unlockedLevel, levelNum + 1)
        const updatedStars = {
          ...current.levelStars,
          [levelNum]: Math.max(current.levelStars[levelNum] || 0, stars),
        }
        const updatedXp = current.xp + (alreadyCompleted ? 25 : xpBonus)

        set({
          userLevels: {
            ...state.userLevels,
            [personaKey]: {
              ...current,
              completedLevels: newCompleted,
              unlockedLevel: nextLevel,
              levelStars: updatedStars,
              xp: updatedXp,
            },
          },
        })
      },

      unlockLevel: (personaKey, levelNum) => {
        const state = get()
        const current = state.userLevels[personaKey] || { ...DEFAULT_PROGRESS }
        if (levelNum > current.unlockedLevel) {
          set({
            userLevels: {
              ...state.userLevels,
              [personaKey]: {
                ...current,
                unlockedLevel: levelNum,
              },
            },
          })
        }
      },

      recordQuizResult: (personaKey, levelNum, isPassed, selectedOptionId) => {
        const state = get()
        const current = state.userLevels[personaKey] || { ...DEFAULT_PROGRESS }
        const lastResults = { ...(current.lastQuizResult || {}) }
        lastResults[levelNum] = {
          isPassed,
          selectedOptionId,
          timestamp: new Date().toISOString(),
        }

        set({
          userLevels: {
            ...state.userLevels,
            [personaKey]: {
              ...current,
              lastQuizResult: lastResults,
            },
          },
        })
      },

      resetProgress: (personaKey) => {
        const state = get()
        set({
          userLevels: {
            ...state.userLevels,
            [personaKey]: { ...DEFAULT_PROGRESS },
          },
        })
      },
    }),
    {
      name: 'punarshuru-gamification',
    },
  ),
)
