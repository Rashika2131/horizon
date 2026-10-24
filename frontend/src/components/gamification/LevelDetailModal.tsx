import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  Award,
  Play,
  RotateCcw,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LevelItem } from '@/data/gamificationLevels'
import { useGamificationStore } from '@/store/gamificationStore'
import {
  playBubblePop,
  playStarDing,
  playLevelSuccess,
  playLevelUnlock,
} from '@/utils/soundEffects'

interface LevelDetailModalProps {
  level: LevelItem | null
  personaKey: string
  isOpen: boolean
  onClose: () => void
  onStartQuiz: (level: LevelItem) => void
}

export default function LevelDetailModal({
  level,
  personaKey,
  isOpen,
  onClose,
  onStartQuiz,
}: LevelDetailModalProps) {
  const getProgress = useGamificationStore((s) => s.getProgress)
  const completeLevel = useGamificationStore((s) => s.completeLevel)
  const unlockLevel = useGamificationStore((s) => s.unlockLevel)
  const isTaskCompleted = useGamificationStore((s) => s.isTaskCompleted)
  const toggleTask = useGamificationStore((s) => s.toggleTask)

  if (!isOpen || !level) return null

  const progress = getProgress(personaKey)
  const isCompleted = progress.completedLevels.includes(level.id)
  const isUnlocked = level.id <= progress.unlockedLevel
  const isCurrent = level.id === progress.unlockedLevel && !isCompleted
  const stars = progress.levelStars[level.id] || (isCompleted ? 3 : 0)

  const completedTaskCount = level.whatToDo.filter((_, idx) =>
    isTaskCompleted(personaKey, level.id, idx),
  ).length

  const handleManualComplete = () => {
    playLevelSuccess()
    completeLevel(personaKey, level.id, 3, level.xp)
    unlockLevel(personaKey, level.id + 1)
    setTimeout(() => playLevelUnlock(), 400)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-6"
        >
          {/* Header Banner */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-2xl ${level.gradient} text-white flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={30} className="text-white" />
                ) : isUnlocked ? (
                  <Sparkles size={28} className="animate-spin-slow" />
                ) : (
                  <Lock size={26} className="text-white/80" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                    {level.badge}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <span>Completed</span>
                      <span className="flex items-center">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            size={10}
                            className={s <= stars ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}
                          />
                        ))}
                      </span>
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 animate-pulse">
                      Active Mission 🔥
                    </span>
                  )}
                  {!isUnlocked && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Locked 🔒
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight mt-0.5">
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

          {/* Subtitle / Pitch */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {level.subtitle}
          </p>

          {/* 3 Metric Pills: XP, Time, Risk */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 flex flex-col items-center justify-center text-center">
              <Zap size={16} className="text-amber-500 fill-amber-500 mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400">XP Reward</span>
              <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                +{level.xp} XP
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 flex flex-col items-center justify-center text-center">
              <Clock size={16} className="text-[#0B4F9C] dark:text-sky-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Time</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                {level.time}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-slate-700 flex flex-col items-center justify-center text-center">
              <ShieldCheck size={16} className="text-emerald-500 mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Risk Reduction</span>
              <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                {level.riskCut}
              </span>
            </div>
          </div>

          {/* Interactive "How to Complete This Level" Checklist */}
          <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#0B4F9C] dark:text-sky-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Mission Action Checklist
                </h4>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                {completedTaskCount} of {level.whatToDo.length} Completed (+25 XP each)
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{
                  width: `${(completedTaskCount / (level.whatToDo.length || 1)) * 100}%`,
                }}
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Click each action item as you complete it to earn bonus XP and track your readiness:
            </p>

            <ul className="space-y-2">
              {level.whatToDo.map((step, idx) => {
                const done = isTaskCompleted(personaKey, level.id, idx)
                return (
                  <li
                    key={idx}
                    onClick={() => {
                      toggleTask(personaKey, level.id, idx)
                      if (!done) {
                        playStarDing(idx + 1)
                      } else {
                        playBubblePop()
                      }
                    }}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      done
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 transition-colors ${
                        done
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'border-2 border-slate-300 dark:border-slate-600 text-slate-400 hover:border-blue-500'
                      }`}
                    >
                      {done ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <span className={`text-xs font-medium leading-relaxed ${done ? 'line-through opacity-80' : ''}`}>
                        {step}
                      </span>
                      {done && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                          +25 XP Earned
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-750 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Deliverable Proof:</span>
              <span className="text-[11px] font-extrabold text-[#0B4F9C] dark:text-sky-300">
                {level.deliverable}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {isUnlocked ? (
              <>
                {level.hasQuiz && (
                  <button
                    onClick={() => onStartQuiz(level)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-black text-sm shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw size={16} />
                        <span>Retake Skill Verification Challenge</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} className="fill-white" />
                        <span>Start Level {level.id} Skill Challenge 🎮</span>
                      </>
                    )}
                  </button>
                )}

                {level.actionLink && (
                  <Link
                    to={level.actionLink.to}
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-2xl bg-[#0B4F9C] hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    <span>{level.actionLink.label}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}

                {!level.hasQuiz && !isCompleted && (
                  <button
                    onClick={handleManualComplete}
                    className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Mission as Completed (+{level.xp} XP)</span>
                  </button>
                )}
              </>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                  <Lock size={14} className="text-slate-400" />
                  <span>Level {level.id} is Locked</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Complete Level {level.id - 1} first to unlock this mission.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
