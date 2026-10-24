import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { LevelItem, QuizOption } from '@/data/gamificationLevels'
import { useGamificationStore } from '@/store/gamificationStore'
import ConfettiEffect from './ConfettiEffect'
import {
  playBubblePop,
  playLevelSuccess,
  playLevelUnlock,
  playWompError,
} from '@/utils/soundEffects'

interface LevelQuizModalProps {
  level: LevelItem
  personaKey: string
  isOpen: boolean
  onClose: () => void
  onSuccessNextLevel?: () => void
}

export default function LevelQuizModal({
  level,
  personaKey,
  isOpen,
  onClose,
  onSuccessNextLevel,
}: LevelQuizModalProps) {
  const navigate = useNavigate()
  const completeLevel = useGamificationStore((s) => s.completeLevel)
  const unlockLevel = useGamificationStore((s) => s.unlockLevel)
  const recordQuizResult = useGamificationStore((s) => s.recordQuizResult)

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isPassed, setIsPassed] = useState<boolean>(false)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)

  if (!isOpen || !level.quiz) return null

  const quiz = level.quiz
  const selectedOption: QuizOption | undefined = quiz.options.find(
    (o) => o.id === selectedOptionId,
  )

  const handleSubmit = () => {
    if (!selectedOption) return
    const passed = selectedOption.isCorrect
    setSubmitted(true)
    setIsPassed(passed)
    recordQuizResult(personaKey, level.id, passed, selectedOption.id)

    if (passed) {
      playLevelSuccess()
      setShowConfetti(true)
      completeLevel(personaKey, level.id, 3, level.xp)
      unlockLevel(personaKey, level.id + 1)
      setTimeout(() => playLevelUnlock(), 500)
    } else {
      playWompError()
    }
  }

  const handleOptionClick = (optId: string) => {
    if (!submitted) {
      playBubblePop()
      setSelectedOptionId(optId)
    }
  }

  const handleRetry = () => {
    playBubblePop()
    setSelectedOptionId(null)
    setSubmitted(false)
    setIsPassed(false)
    setShowConfetti(false)
  }

  const handleGoToSkills = () => {
    onClose()
    navigate(quiz.gapFeedback.roadmapUrl || '/skills')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        {showConfetti && <ConfettiEffect count={50} />}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${level.gradient} text-white flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0`}
              >
                <Sparkles size={24} className="animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400 block">
                  {level.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {level.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scenario Context Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-pink-50/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border border-blue-200/60 dark:border-slate-700/60 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-sky-400 flex items-center gap-1.5">
              <Zap size={12} className="text-amber-500 fill-amber-500" />
              Live Career Challenge Scenario • {quiz.skillName}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {quiz.scenario}
            </p>
          </div>

          {/* Question Title */}
          <div className="space-y-1">
            <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {quiz.question}
            </p>
            <p className="text-xs text-slate-400">
              Select the optimal decision to prove promotion readiness:
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {quiz.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id
              let borderClass = 'border-slate-200 dark:border-slate-700/80'
              let bgClass = 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800'

              if (submitted) {
                if (opt.isCorrect) {
                  borderClass = 'border-emerald-500 dark:border-emerald-400'
                  bgClass = 'bg-emerald-50/80 dark:bg-emerald-950/40'
                } else if (isSelected && !opt.isCorrect) {
                  borderClass = 'border-rose-500 dark:border-rose-400'
                  bgClass = 'bg-rose-50/80 dark:bg-rose-950/40'
                } else {
                  bgClass = 'opacity-50 bg-slate-50 dark:bg-slate-800/40'
                }
              } else if (isSelected) {
                borderClass = 'border-[#0B4F9C] dark:border-sky-400 ring-2 ring-blue-500/20'
                bgClass = 'bg-blue-50/60 dark:bg-slate-800'
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleOptionClick(opt.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${borderClass} ${bgClass}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 uppercase transition ${
                      submitted && opt.isCorrect
                        ? 'bg-emerald-500 text-white'
                        : submitted && isSelected && !opt.isCorrect
                        ? 'bg-rose-500 text-white'
                        : isSelected
                        ? 'bg-[#0B4F9C] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt.id}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      {opt.text}
                    </p>
                    {submitted && (opt.isCorrect || isSelected) && (
                      <p
                        className={`text-xs font-medium pt-1 ${
                          opt.isCorrect
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feedback & Result Screen */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border ${
                  isPassed
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                } space-y-3`}
              >
                {isPassed ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                      <span className="text-base sm:text-lg">
                        Awesome! Level {level.id} Completed! ⭐⭐⭐
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                      You demonstrated top-tier engineering leadership. Your score unlocked{' '}
                      <strong>Level {level.id + 1}</strong> and awarded you{' '}
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        +{level.xp} XP
                      </span>
                      !
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          onClose()
                          onSuccessNextLevel?.()
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer transition hover:scale-[1.02]"
                      >
                        <span>Continue to Level {level.id + 1} →</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                      >
                        Back to Map
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black">
                      <AlertTriangle size={20} className="text-amber-600" />
                      <span className="text-base sm:text-lg">
                        {quiz.gapFeedback.headline}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
                      {quiz.gapFeedback.explanation}
                    </p>

                    <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Critical Skill To Bridge
                        </span>
                        <span className="font-black text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                          {quiz.gapFeedback.missingSkill}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-950">
                        Gap Identified ⚡
                      </span>
                    </div>

                    {/* Direct Roadmaps CTA to My Skills Page */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={handleGoToSkills}
                        className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer transition hover:scale-[1.02]"
                      >
                        <BookOpen size={14} />
                        <span>{quiz.gapFeedback.roadmapButtonText}</span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        onClick={handleRetry}
                        className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={13} />
                        <span>Try Question Again</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Bar (When Not Yet Submitted) */}
          {!submitted && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">
                Reward: <strong className="text-amber-500">+{level.xp} XP</strong> &{' '}
                <strong className="text-emerald-500">{level.riskCut}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedOptionId}
                  className="px-6 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-black shadow-md shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                >
                  <Award size={14} />
                  <span>Submit Answer</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
