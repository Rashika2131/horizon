import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, UserCheck, ArrowRight, X } from 'lucide-react'
import ChatHeader from './conversational/ChatHeader'
import ResumeUploadZone from './conversational/ResumeUploadZone'
import ChatMessageBubble from './conversational/ChatMessageBubble'
import ChatInputBar from './conversational/ChatInputBar'
import LiveProfileCard from './conversational/LiveProfileCard'
import ConfirmScreen from './conversational/ConfirmScreen'
import CandyCrushLevelMap from '@/components/gamification/CandyCrushLevelMap'
import GamificationCelebrationBanner from '@/components/gamification/GamificationCelebrationBanner'
import { useOnboardingAgent } from './conversational/useOnboardingAgent'
import { useVoiceAssistant } from './conversational/useVoiceAssistant'

interface ConversationalOnboardingProps {
  onSwitchToForm: () => void
}

export default function ConversationalOnboarding({ onSwitchToForm }: ConversationalOnboardingProps) {
  const { i18n } = useTranslation()
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('en-IN')
  const [rightTab, setRightTab] = useState<'profile' | 'gamification'>('profile')
  const [showFullLevelMapModal, setShowFullLevelMapModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    isUploading,
    uploadError,
    isDone,
    isConfirming,
    canConfirm,
    showConfirmScreen,
    setShowConfirmScreen,
    profileDraft,
    handleSendMessage,
    handleFileUpload,
    handleStartOver,
    resumeAnalyzed,
    handleProceedToDashboard,
  } = useOnboardingAgent()

  const {
    isMicActive,
    isRecordingFallback,
    isTranscribing,
    speakingMsgId,
    toggleVoice,
    handleToggleSpeak,
  } = useVoiceAssistant({
    voiceLang,
    onTranscript: (text) => setInputMessage((prev) => (prev ? `${prev} ${text}` : text)),
  })

  // When resume analysis succeeds, automatically switch right tab AND open dedicated Level Map modal
  useEffect(() => {
    if (resumeAnalyzed) {
      setRightTab('gamification')
      setShowFullLevelMapModal(true)
    }
  }, [resumeAnalyzed])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isTranscribing, resumeAnalyzed])

  const toggleLanguage = () => {
    const next = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN'
    setVoiceLang(next)
    i18n.changeLanguage(next === 'hi-IN' ? 'hi' : 'en')
  }

  const userType = ((profileDraft as Record<string, unknown>).user_type as string) || 'stagnant'

  if (showConfirmScreen) {
    return (
      <ConfirmScreen
        profileDraft={profileDraft as Record<string, unknown>}
        onFinish={handleProceedToDashboard}
        onBackToChat={() => setShowConfirmScreen(false)}
        isFinalizing={isConfirming}
      />
    )
  }

  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[600px] flex flex-col space-y-3">
      <ChatHeader
        voiceLang={voiceLang}
        onToggleLang={toggleLanguage}
        onSwitchToForm={onSwitchToForm}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Chat Assistant & Resume Upload */}
        <div className="lg:col-span-7 flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <ResumeUploadZone
            onUpload={handleFileUpload}
            isUploading={isUploading}
            uploadError={uploadError}
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Celebratory Banner when resume analysis is complete */}
            {resumeAnalyzed && (
              <GamificationCelebrationBanner
                userType={userType}
                onOpenLevelMap={() => {
                  setRightTab('gamification')
                  setShowFullLevelMapModal(true)
                }}
              />
            )}

            {messages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                msg={msg}
                speakingMsgId={speakingMsgId}
                onToggleSpeak={handleToggleSpeak}
                onQuickReply={(text) => {
                  if (
                    text.toLowerCase().includes('level map') ||
                    text.toLowerCase().includes('gamified')
                  ) {
                    setRightTab('gamification')
                    setShowFullLevelMapModal(true)
                  } else if (
                    text.toLowerCase().includes('confirm') ||
                    text.toLowerCase().includes('dashboard')
                  ) {
                    handleSendMessage('', 'confirm')
                  } else {
                    handleSendMessage(text)
                  }
                }}
                isTyping={isTyping}
                isDone={isDone}
              />
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-9">
                <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInputBar
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSend={(text) => handleSendMessage(text)}
            isTyping={isTyping}
            isMicActive={isMicActive}
            isRecordingFallback={isRecordingFallback}
            voiceLang={voiceLang}
            onToggleVoice={toggleVoice}
          />
        </div>

        {/* Right Column: Tab Switcher (Live Profile vs Gamification Level Map) */}
        <div className="lg:col-span-5 flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Right Header Navigation Tabs */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 flex items-center justify-between shrink-0">
            <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={() => setRightTab('profile')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  rightTab === 'profile'
                    ? 'bg-[#0B4F9C] text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <UserCheck size={13} />
                <span>Live Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setRightTab('gamification')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  rightTab === 'gamification'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Trophy size={13} />
                <span>🎮 Level Map</span>
                {resumeAnalyzed && (
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                )}
              </button>
            </div>

            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" />
              Interactive Mode
            </span>
          </div>

          {/* Right Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {rightTab === 'profile' ? (
              <LiveProfileCard
                profileDraft={profileDraft as Record<string, unknown>}
                canConfirm={canConfirm}
                onConfirm={() => handleSendMessage('', 'confirm')}
                isConfirming={isConfirming}
                onStartOver={handleStartOver}
              />
            ) : (
              <div className="p-3">
                <CandyCrushLevelMap
                  userType={userType}
                  compact={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Dedicated Level Map Modal Overlay */}
      <AnimatePresence>
        {showFullLevelMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-4 p-4 sm:p-6"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                    <Trophy size={18} />
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      Your 5-Level Candy Crush Career Map
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Level 1 is unlocked! Complete challenges to earn XP and stars.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFullLevelMapModal(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <X size={14} />
                    <span>Back to Chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToDashboard}
                    className="px-4 py-1.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-600 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Dashboard</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Full Candy Crush Map */}
              <CandyCrushLevelMap userType={userType} compact={false} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
