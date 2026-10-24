import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  delay: number
}

const COLORS = [
  '#FF007A',
  '#7928CA',
  '#0070F3',
  '#00DFD8',
  '#F5A623',
  '#10B981',
  '#F43F5E',
  '#EAB308',
  '#8B5CF6',
]

export default function ConfettiEffect({ count = 40 }: { count?: number }) {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 450,
      y: -Math.random() * 250 - 50,
      color: COLORS[i % COLORS.length],
      size: Math.random() * 8 + 6,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 0.2,
    }))
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 1,
            scale: 0,
            x: 0,
            y: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.2, 0.8],
            x: p.x,
            y: [0, p.y, p.y + 200],
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.8,
            delay: p.delay,
            ease: [0.25, 1, 0.5, 1],
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * (Math.random() > 0.5 ? 1.5 : 1),
            borderRadius: Math.random() > 0.4 ? '3px' : '50%',
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}88`,
          }}
        />
      ))}
    </div>
  )
}
