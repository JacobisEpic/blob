'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Blob as BlobType } from '@/lib/supabase/client'

interface BlobProps {
  blob: BlobType
  onLike: () => void
  isLiked: boolean
  position?: { x: number; y: number }
}

export function Blob({ blob, onLike, isLiked, position }: BlobProps) {
  const [pos, setPos] = useState(position || { x: Math.random() * 80, y: Math.random() * 80 })
  const posRef = useRef(pos)
  const [velocity, setVelocity] = useState({ 
    x: (Math.random() - 0.5) * 0.5,
    y: (Math.random() - 0.5) * 0.5
  })
  const velocityRef = useRef(velocity)
  const requestRef = useRef<number>()
  const lastTimeRef = useRef<number>()
  
  // Fixed blob size that can fit 100 characters
  const blobSize = 200 // Large enough for max content + padding + like button

  useEffect(() => {
    posRef.current = pos
    velocityRef.current = velocity
  }, [pos, velocity])

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const deltaTime = (time - lastTimeRef.current) / 16
        
        let newVelocity = { ...velocityRef.current }
        const newPos = { ...posRef.current }

        // Update position
        newPos.x += newVelocity.x * deltaTime
        newPos.y += newVelocity.y * deltaTime

        // Bounce off walls with improved mechanics
        const minSpeed = 0.1
        const dampening = 0.95

        if (newPos.x <= 0) {
          newPos.x = 0
          newVelocity.x = Math.max(minSpeed, Math.abs(newVelocity.x * dampening))
        } else if (newPos.x >= 90) {
          newPos.x = 90
          newVelocity.x = -Math.max(minSpeed, Math.abs(newVelocity.x * dampening))
        }

        if (newPos.y <= 0) {
          newPos.y = 0
          newVelocity.y = Math.max(minSpeed, Math.abs(newVelocity.y * dampening))
        } else if (newPos.y >= 90) {
          newPos.y = 90
          newVelocity.y = -Math.max(minSpeed, Math.abs(newVelocity.y * dampening))
        }

        setVelocity(newVelocity)
        setPos(newPos)
      }

      lastTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Add random movement variations
  useEffect(() => {
    const interval = setInterval(() => {
      setVelocity(v => {
        const speedBoost = Math.random() * 0.3 + 0.2 // Random boost between 0.2 and 0.5
        return {
          x: v.x + (Math.random() - 0.5) * speedBoost,
          y: v.y + (Math.random() - 0.5) * speedBoost
        }
      })
    }, 3000) // More frequent updates

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn(
        'absolute rounded-full flex items-center justify-center p-6',
        'bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-sm',
        'hover:scale-110 cursor-pointer shadow-lg'
      )}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: `${blobSize}px`,
        height: `${blobSize}px`,
        transform: `translate(-50%, -50%)`
      }}
    >
      <div className="text-white text-center max-w-[85%]">
        <p className="font-medium mb-2 text-sm leading-tight break-words">{blob.content}</p>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLike()
          }}
          className={cn(
            'transition-all duration-300 p-1',
            isLiked ? 'text-red-500' : 'text-white/80 hover:text-red-500'
          )}
        >
          <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
        </button>
      </div>
    </div>
  )
} 