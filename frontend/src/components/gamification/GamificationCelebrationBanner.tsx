import { motion } from 'framer-motion'
import { Sparkles, Trophy, ArrowRight, Play, Star } from 'lucide-react'

interface GamificationCelebrationBannerProps {
  onOpenLevelMap: () => void
  userType?: string
}

export default function GamificationCelebrationBanner({
  onOpenLevelMap,
  userType = 'stagnant',
}: GamificationCelebrationBannerProps) {
  const isStagnant = userType === 'stagnant'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white p-5 sm:p-6 shadow-xl border border-pink-400/40"
    >
      {/* Background sparkle blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300 shadow-md shrink-0 border border-white/30">
            <Trophy size={28} className="animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 shadow-sm flex items-center gap-1">
                <Sparkles size={11} className="fill-slate-950" />
                Resume Analyzed • Level Map Unlocked!
              </span>
              <span className="text-xs font-bold text-pink-200 flex items-center gap-1">
                <Star size={12} className="text-yellow-300 fill-yellow-300" />
                5 Levels Generated
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              {isStagnant
                ? 'Your Stagnation Breakout Journey is Ready!'
                : 'Your Gamified Career Roadmap is Calibrated!'}
            </h3>

            <p className="text-xs text-pink-100 max-w-lg leading-relaxed font-medium">
              We parsed your resume vectors and calibrated your personalized 5-Level Candy Crush journey. Take the Level 1 Skill Assessment now to unlock Level 2!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLevelMap}
          className="px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-xl shadow-yellow-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Play size={14} className="fill-slate-950" />
          <span>Open My Level Map 🎮</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  )
}
