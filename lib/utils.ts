import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomPosition() {
  return {
    x: Math.random() * 80 + 10, // Keep blobs 10% away from edges
    y: Math.random() * 80 + 10
  }
}

export function getRandomVelocity(speed = 0.5) {
  return {
    x: (Math.random() - 0.5) * speed,
    y: (Math.random() - 0.5) * speed
  }
} 