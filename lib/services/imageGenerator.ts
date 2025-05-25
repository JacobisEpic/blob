import { createCanvas, CanvasGradient, CanvasRenderingContext2D } from 'canvas'
import type { Blob } from '@/lib/supabase/client'

interface ImageOptions {
  width: number
  height: number
  padding: number
  maxFontSize: number
  minFontSize: number
}

const DEFAULT_OPTIONS: ImageOptions = {
  width: 1080, // Instagram square image size
  height: 1080,
  padding: 80,
  maxFontSize: 72,
  minFontSize: 36
}

export async function generateBlobImage(
  blob: Blob,
  userEmail: string,
  likeCount: number,
  options: Partial<ImageOptions> = {}
): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const canvas = createCanvas(opts.width, opts.height)
  const ctx = canvas.getContext('2d')

  // Set background
  drawBackground(ctx, opts)

  // Draw blob
  const blobRadius = Math.min(opts.width, opts.height) * 0.4
  drawBlob(ctx, opts.width / 2, opts.height / 2, blobRadius)

  // Add content
  drawContent(ctx, blob.content, opts)

  // Add metadata
  drawMetadata(ctx, userEmail, likeCount, opts)

  // Add branding
  drawBranding(ctx, opts)

  return canvas.toBuffer('image/png')
}

function drawBackground(ctx: CanvasRenderingContext2D, opts: ImageOptions) {
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, opts.width, opts.height)
  gradient.addColorStop(0, '#18181b') // zinc-900
  gradient.addColorStop(1, '#27272a') // zinc-800
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, opts.width, opts.height)
}

function drawBlob(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.save()
  
  // Create blob gradient
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)') // purple-500
  gradient.addColorStop(1, 'rgba(219, 39, 119, 0.8)') // pink-600
  
  ctx.fillStyle = gradient
  
  // Draw blob shape
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  
  // Add subtle glow effect
  ctx.shadowColor = 'rgba(168, 85, 247, 0.3)'
  ctx.shadowBlur = 30
  ctx.fill()
  
  ctx.restore()
}

function drawContent(ctx: CanvasRenderingContext2D, content: string, opts: ImageOptions) {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Calculate optimal font size
  let fontSize = opts.maxFontSize
  ctx.font = `${fontSize}px Inter`
  
  const maxWidth = opts.width - (opts.padding * 2)
  const words = content.split(' ')
  let lines: string[] = []
  let currentLine = words[0]
  
  // Word wrap and font size adjustment
  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + " " + word).width
    if (width < maxWidth) {
      currentLine += " " + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  
  // Adjust font size if too many lines
  while (lines.length > 4 && fontSize > opts.minFontSize) {
    fontSize -= 2
    ctx.font = `${fontSize}px Inter`
    lines = []
    currentLine = words[0]
    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + " " + word).width
      if (width < maxWidth) {
        currentLine += " " + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
  }
  
  // Draw text
  ctx.fillStyle = 'white'
  const lineHeight = fontSize * 1.2
  const totalHeight = lines.length * lineHeight
  const startY = (opts.height - totalHeight) / 2
  
  lines.forEach((line, i) => {
    ctx.fillText(line, opts.width / 2, startY + (i * lineHeight))
  })
  
  ctx.restore()
}

function drawMetadata(
  ctx: CanvasRenderingContext2D,
  userEmail: string,
  likeCount: number,
  opts: ImageOptions
) {
  ctx.save()
  
  // Draw like count
  ctx.font = '24px Inter'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`,
    opts.width / 2,
    opts.height - opts.padding - 30
  )
  
  // Draw author (if not anonymous)
  if (!userEmail.includes('anonymous')) {
    const username = userEmail.split('@')[0]
    ctx.font = '20px Inter'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fillText(
      `by @${username}`,
      opts.width / 2,
      opts.height - opts.padding
    )
  }
  
  ctx.restore()
}

function drawBranding(ctx: CanvasRenderingContext2D, opts: ImageOptions) {
  ctx.save()
  
  // Draw app name
  ctx.font = 'bold 28px Inter'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.textAlign = 'left'
  ctx.fillText('blob', opts.padding, opts.padding)
  
  // Draw timestamp
  const now = new Date()
  const timestamp = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  
  ctx.font = '20px Inter'
  ctx.textAlign = 'right'
  ctx.fillText(timestamp, opts.width - opts.padding, opts.padding)
  
  ctx.restore()
} 