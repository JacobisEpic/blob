'use client'
import { useState } from 'react'
import { MessageSquare, Share2, Bookmark, ChevronUp, MoreHorizontal, Heart } from 'lucide-react'

interface ShoutCardProps {
  shout: {
    id: string
    content: string
    created_at: string
    upvotes: number
    profiles?: {
      username: string
    }
  }
}

function extractTitleAndBody(content: string) {
  const [title, ...bodyParts] = content.trim().split('\n')
  return {
    title: title.trim(),
    body: bodyParts.join('\n').trim()
  }
}

function formatDate(date: Date) {
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })
  return formatter.format(date)
}

export default function ShoutCard({ shout }: ShoutCardProps) {
  const { title, body } = extractTitleAndBody(shout.content)
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = body.length > 150 && !isExpanded
  const displayBody = shouldTruncate ? body.slice(0, 150) + '...' : body
  
  return (
    <article className="bg-[#F9F6FF] rounded-2xl">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#5AA1FF] rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-sm">
              AL
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#0F1419]">@{shout.profiles?.username}</span>
              <div className="flex items-center gap-1 text-[#536471] text-[13px]">
                <span>{formatDate(new Date(shout.created_at))}</span>
                <span>•</span>
                <span>2.1k views</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ChevronUp className="w-4 h-4 text-[#536471]" />
              <span className="font-medium text-sm text-[#0F1419]">{shout.upvotes}</span>
            </div>
            <button className="text-[#536471] hover:text-[#0F1419] transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <h2 className="text-[22px] font-bold text-[#0F1419] leading-7 mb-2">{title}</h2>
          <p className="text-[#536471] text-[15px] leading-[20px]">
            {displayBody}
            {shouldTruncate && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="text-[#1D9BF0] hover:underline ml-1 text-[15px]"
              >
                Read more
              </button>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 mt-4">
          <button className="flex items-center gap-2 text-[#536471] hover:text-[#F91880] group transition-colors">
            <Heart className="w-[18px] h-[18px] group-hover:fill-[#F91880]" />
            <span className="text-[13px] font-medium">89</span>
          </button>
          <button className="flex items-center gap-2 text-[#536471] hover:text-[#1D9BF0] group transition-colors">
            <MessageSquare className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">24</span>
          </button>
          <button className="flex items-center gap-2 text-[#536471] hover:text-[#00BA7C] group transition-colors">
            <Share2 className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">Share</span>
          </button>
          <button className="ml-auto text-[#536471] hover:text-[#FFD700] group transition-colors">
            <Bookmark className="w-[18px] h-[18px] group-hover:fill-[#FFD700]" />
          </button>
        </div>
      </div>
    </article>
  )
}
