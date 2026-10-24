import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Star,
  Zap,
  Flame,
  ShieldCheck,
  Lock,
  Check,
  ArrowRight,
  TrendingUp,
  Crown,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  getPersonaGamificationConfig,
  getPersonaKey,
  PERSONA_TABS,
  type LevelItem,
} from '@/data/gamificationLevels'
import { useGamificationStore } from '@/store/gamificationStore'
import LevelDetailModal from './LevelDetailModal'
import LevelQuizModal from './LevelQuizModal'
import { playBubblePop, toggleMute, isAudioMuted } from '@/utils/soundEffects'

interface CandyCrushLevelMapProps {
  userType: string
  compact?: boolean
  className?: string
  onExploreSkills?: () => void
}

export default function CandyCrushLevelMap({
  userType,
  compact = false,
  className = '',
}: CandyCrushLevelMapProps) {
  const stagnantGoal = useGamificationStore((s) => s.stagnantGoal)
  const setStagnantGoal = useGamificationStore((s) => s.setStagnantGoal)
  const getProgress = useGamificationStore((s) => s.getProgress)
  const resetProgress = useGamificationStore((s) => s.resetProgress)

  // Interactive Persona state: defaults to userType, but user can freely toggle all 5 personas!
  const [activePersona, setActivePersona] = useState<string>(userType || 'stagnant')
  const [isMuted, setIsMuted] = useState<boolean>(isAudioMuted())

  useEffect(() => {
    if (userType) setActivePersona(userType)
  }, [userType])

  const handleToggleSound = () => {
    const next = toggleMute()
    setIsMuted(next)
    if (!next) playBubblePop()
  }

  const isStagnant = activePersona === 'stagnant'
  const personaKey = getPersonaKey(activePersona, stagnantGoal)
  const config = useMemo(
    () => getPersonaGamificationConfig(activePersona, stagnantGoal),
    [activePersona, stagnantGoal],
  )
  const progress = getProgress(personaKey)

  const [selectedLevel, setSelectedLevel] = useState<LevelItem | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [quizLevel, setQuizLevel] = useState<LevelItem | null>(null)

  // Calculate stats
  const totalStars = useMemo(() => {
    return Object.values(progress.levelStars).reduce((sum, s) => sum + s, 0)
  }, [progress.levelStars])

  const completionPct = Math.round(
    (progress.completedLevels.length / config.levels.length) * 100,
  )

  const handleNodeClick = (level: LevelItem) => {
    playBubblePop()
    setSelectedLevel(level)
    setDetailModalOpen(true)
  }

  const handleStartQuiz = (level: LevelItem) => {
    playBubblePop()
    setDetailModalOpen(false)
    setQuizLevel(level)
    setQuizModalOpen(true)
  }

  const handleResetTrack = () => {
    playBubblePop()
    resetProgress(personaKey)
  }

  return (
    <div
      id="gamified-level-map"
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 text-white border border-indigo-500/30 shadow-2xl ${
        compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'
      } ${className}`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── 1. Top HUD (Heads-Up Display) ────────────────────── */}
      <div className="relative z-10 space-y-4 pb-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 text-pink-300 text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles size={13} className="text-pink-400 animate-spin-slow" />
                Candy Crush Career Journey
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Target: <strong className="text-sky-300">{config.targetElevation}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{config.trackName}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {config.salaryTarget}
              </span>
            </h2>

            <p className="text-xs text-slate-300 max-w-xl font-medium">
              {config.trackDescription}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2.5 sm:self-center shrink-0">
            {/* XP Badge */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2 shadow-inner">
              <Zap size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                  Career XP
                </span>
                <span className="text-xs font-black text-amber-300">
                  {progress.xp} XP
                </span>
              </div>
            </div>

            {/* Stars Meter */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2 shadow-inner">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                  Stars
                </span>
                <span className="text-xs font-black text-yellow-300">
                  {totalStars} / 15
                </span>
              </div>
            </div>

            {/* Streak */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2 shadow-inner">
              <Flame size={16} className="text-orange-400 fill-orange-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                  Streak
                </span>
                <span className="text-xs font-black text-orange-300">
                  {progress.streak} Days
                </span>
              </div>
            </div>

            {/* Audio Synth Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 transition cursor-pointer flex items-center justify-center shadow-inner"
            >
              {isMuted ? (
                <VolumeX size={16} className="text-slate-400" />
              ) : (
                <Volume2 size={16} className="text-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Reset Track Button */}
            <button
              type="button"
              onClick={handleResetTrack}
              title="Reset This Track's Progress"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-950/40 hover:border-rose-500/50 border border-white/15 text-slate-400 hover:text-rose-300 transition cursor-pointer flex items-center justify-center"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* ── INTERACTIVE 5-PERSONA SWITCHER BAR ─────────────────────── */}
        <div className="space-y-2 pt-3 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <Sparkles size={12} className="text-pink-400" />
              <span>Choose Career Persona (Distinct 5 Levels Each):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              Active: <strong className="text-white">{config.trackName}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PERSONA_TABS.map((tab) => {
              const isActive = activePersona === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    playBubblePop()
                    setActivePersona(tab.key)
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/25 via-purple-500/30 to-indigo-600/30 border-pink-400/90 shadow-md shadow-pink-500/25 ring-2 ring-pink-400/40 scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white truncate">{tab.label}</span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition">➔</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">{tab.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Stagnant Persona Goal Switcher (Promotion vs Switch Track) */}
        {isStagnant && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-pink-400/30">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Crown size={14} className="text-amber-400" />
              <span>Stagnant Career Strategy:</span>
            </span>

            <div className="inline-flex p-1 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  playBubblePop()
                  setStagnantGoal('promotion')
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  stagnantGoal === 'promotion'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown size={13} />
                <span>👑 Internal Promotion Track</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playBubblePop()
                  setStagnantGoal('switch')
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  stagnantGoal === 'switch'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp size={13} />
                <span>🚀 External Job Switch Track</span>
              </button>
            </div>
          </div>
        )}

        {/* Level Progression Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">
              Journey Completion:{' '}
              <strong className="text-emerald-400">
                {progress.completedLevels.length} of {config.levels.length} Levels Cleared
              </strong>
            </span>
            <span className="text-pink-400 font-extrabold">{completionPct}% Completed</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800/80 p-0.5 border border-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-400 shadow-sm"
              animate={{ width: `${Math.max(5, completionPct)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* ── 2. Candy Crush Winding Path Layout ───────────────── */}
      <div className="relative z-10 py-8 px-2 sm:px-6">
        {/* Winding Road Canvas */}
        <div className="max-w-2xl mx-auto flex flex-col space-y-6 sm:space-y-8 relative">
          {config.levels.map((lvl, index) => {
            const isCompleted = progress.completedLevels.includes(lvl.id)
            const isUnlocked = lvl.id <= progress.unlockedLevel
            const isCurrent = lvl.id === progress.unlockedLevel && !isCompleted
            const stars = progress.levelStars[lvl.id] || (isCompleted ? 3 : 0)
            const isBoss = lvl.id === 5

            // Alternating positions: 0 -> center-left, 1 -> center-right, 2 -> center, 3 -> left, 4 -> center (Boss)
            const alignClass =
              index % 2 === 0
                ? 'sm:self-start sm:translate-x-6'
                : 'sm:self-end sm:-translate-x-6'
            const finalAlign = isBoss ? 'sm:self-center sm:translate-x-0' : alignClass

            return (
              <div
                key={lvl.id}
                className={`relative flex flex-col items-center ${finalAlign} transition-all duration-300`}
              >
                {/* Connecting dashed path indicator */}
                {index > 0 && (
                  <div className="hidden sm:block absolute -top-8 w-1 h-8 border-l-2 border-dashed border-white/20" />
                )}

                {/* Level Card & Stepping Node */}
                <motion.div
                  whileHover={{ scale: isUnlocked ? 1.04 : 1 }}
                  whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
                  onClick={() => handleNodeClick(lvl)}
                  className={`group relative p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all w-full sm:w-80 ${
                    isBoss
                      ? 'bg-gradient-to-br from-amber-500/20 via-purple-900/40 to-slate-900 border-amber-400/80 shadow-2xl shadow-amber-500/20'
                      : isCompleted
                      ? 'bg-emerald-950/40 border-emerald-400/70 shadow-lg shadow-emerald-500/10'
                      : isCurrent
                      ? 'bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-pink-400 shadow-xl shadow-pink-500/20 ring-4 ring-pink-500/20'
                      : 'bg-slate-900/70 border-white/10 opacity-70 hover:opacity-90'
                  }`}
                >
                  {/* Floating Marker Badge for Active Node */}
                  {isCurrent && (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 shrink-0"
                    >
                      <Play size={10} className="fill-white" />
                      <span>YOUR CURRENT LEVEL</span>
                    </motion.div>
                  )}

                  {isBoss && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Crown size={11} className="fill-slate-950" />
                      <span>BOSS LEVEL 🏆</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3.5">
                    {/* 3D Round Node Icon */}
                    <div
                      className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shrink-0 transition-transform ${
                        isCompleted
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30'
                          : isCurrent
                          ? `${lvl.gradient} text-white shadow-pink-500/40 ring-2 ring-white/50`
                          : isBoss
                          ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 text-slate-950 shadow-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-white/10'
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={26} strokeWidth={3} />
                      ) : isUnlocked ? (
                        <span>{lvl.id}</span>
                      ) : (
                        <Lock size={20} className="text-slate-400" />
                      )}
                    </div>

                    {/* Level Meta */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">
                          {lvl.badge}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          +{lvl.xp} XP
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white leading-tight truncate">
                        {lvl.title}
                      </h4>

                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {lvl.subtitle}
                      </p>

                      {/* Stars for completed level */}
                      {isCompleted ? (
                        <div className="flex items-center gap-1 pt-1">
                          {[1, 2, 3].map((starIdx) => (
                            <Star
                              key={starIdx}
                              size={13}
                              className={
                                starIdx <= stars
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-slate-600'
                              }
                            />
                          ))}
                          <span className="text-[10px] text-emerald-400 font-bold ml-1">
                            Completed!
                          </span>
                        </div>
                      ) : isCurrent ? (
                        <div className="pt-1 flex items-center gap-1 text-[11px] font-black text-pink-400 group-hover:translate-x-0.5 transition-transform">
                          <span>Click to Play Challenge</span>
                          <ArrowRight size={12} />
                        </div>
                      ) : (
                        <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1">
                          <Lock size={10} />
                          <span>Complete previous level</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 3. Bottom Reset or Hint Strip ────────────────────── */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>
            Clear all 5 levels to unlock complete Career Disruption Shield and title upgrade.
          </span>
        </span>

        <button
          type="button"
          onClick={() => resetProgress(personaKey)}
          className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 underline self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw size={11} />
          <span>Reset Level Progress (Testing)</span>
        </button>
      </div>

      {/* Level Detail Mission Modal */}
      <LevelDetailModal
        level={selectedLevel}
        personaKey={personaKey}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onStartQuiz={handleStartQuiz}
      />

      {/* Level Interactive Quiz Challenge Modal */}
      {quizLevel && (
        <LevelQuizModal
          level={quizLevel}
          personaKey={personaKey}
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          onSuccessNextLevel={() => {
            const nextLvl = config.levels.find((l) => l.id === quizLevel.id + 1)
            if (nextLvl) {
              setSelectedLevel(nextLvl)
              setDetailModalOpen(true)
            }
          }}
        />
      )}
    </div>
  )
}
