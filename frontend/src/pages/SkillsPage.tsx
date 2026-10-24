import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, RefreshCw, Zap, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import { useSkillGap } from '@/hooks/useSkillGap'
import { useUserProfile } from '@/store/userProfileStore'
import { useGamificationStore } from '@/store/gamificationStore'
import { getPersonaKey } from '@/data/gamificationLevels'
import SkillCategorizationCards from '@/components/skillgap/SkillCategorizationCards'
import HiddenStrengthsCard from '@/components/skillgap/HiddenStrengthsCard'
import Skeleton from '@/components/common/Skeleton'

const benchmarkRoles = [
  'GenAI Engineer',
  'Logistics Tech Analyst',
  'Automation QA / SDET',
  'AI Chatbot Trainer / Product Analyst',
  'Senior Python Developer',
  'DevOps Engineer',
]

export default function SkillsPage() {
  const { t } = useTranslation()
  const { profile } = useActiveProfile()
  const { targetRole: storeTargetRole, setTargetRole } = useUserProfile()
  const [selectedRole, setSelectedRole] = useState<string>(
    storeTargetRole || profile?.target_role || 'GenAI Engineer'
  )

  const {
    gap: gapData,
    matchPct,
    haveSkills,
    partialSkills,
    missingSkills,
    refetch,
    isFetching,
    isLoading,
  } = useSkillGap(selectedRole)

  const stagnantGoal = useGamificationStore((s) => s.stagnantGoal)
  const getProgress = useGamificationStore((s) => s.getProgress)
  const personaKey = getPersonaKey(profile?.user_type || 'stagnant', stagnantGoal)
  const gamificationProgress = getProgress(personaKey)
  const lastLevel1Result = gamificationProgress.lastQuizResult?.[1]
  const hasLevel1Gap = lastLevel1Result && !lastLevel1Result.isPassed

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('skill_gap.title', 'My Skills & Gap Analysis')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('skill_gap.subtitle', 'Audit your competencies against live market benchmarks and bridge critical deficits.')}
          </p>
        </div>

        <Link
          to="/path"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-md transition-all self-start sm:self-auto"
        >
          <span>{t('skill_gap.view_path', 'View My Path')}</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Gamification Level 1 Skill Gap Notice (when user was redirected from Level Quiz) */}
      {hasLevel1Gap && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-orange-500/10 border border-amber-300 dark:border-amber-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles size={20} className="animate-spin-slow" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  Level 1 Assessment Gap Identified
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Candy Crush Journey
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Critical Promotion / Switch Deficit: Focus on Missing Architectural & Modern Skills
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                Review your required skills breakdown below. Once you understand the concepts, return to your Home dashboard to retake the Level 1 Quiz and unlock Level 2!
              </p>
            </div>
          </div>

          <Link
            to="/home"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-black shrink-0 shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Retake Level 1 Challenge 🎮</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* 2. Match % Card + Role Selector */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('skill_gap.target_role_benchmark', 'Target Role Benchmark')}
              </span>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                {selectedRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
              <span>{t('skill_gap.recalculate_match', 'Recalculate match')}</span>
            </button>
          </div>
        </div>

        {/* Role Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {benchmarkRoles.map((role) => {
            const active = selectedRole === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setSelectedRole(role)
                  setTargetRole(role)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {role}
              </button>
            )
          })}
        </div>

        {/* Match Progress Bar */}
        {isLoading && !gapData ? (
          <Skeleton variant="chart" className="h-16" />
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {t('skill_gap.match_for', `Skills Match for ${selectedRole}`, { role: selectedRole })}
              </span>
              <span className="text-2xl font-black text-[#0B4F9C] dark:text-sky-400">
                {Math.round(matchPct)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#0B4F9C] dark:bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(matchPct)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Have / Learning needed / Missing lists */}
      <SkillCategorizationCards
        haveSkills={haveSkills}
        partialSkills={partialSkills}
        missingSkills={missingSkills}
      />

      {/* 4. Hidden Strengths */}
      <HiddenStrengthsCard
        currentRole={profile?.current_role || 'Professional'}
        skills={profile?.skills_raw || haveSkills}
      />
    </div>
  )
}
