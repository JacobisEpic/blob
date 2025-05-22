'use client';

import { Heart } from 'lucide-react';

interface CirclePostProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    upvotes: number;
  };
  style?: React.CSSProperties;
}

function extractTitleAndBody(content: string) {
  const [title, ...bodyParts] = content.trim().split('\n');
  return {
    title: title.trim(),
    body: bodyParts.join('\n').trim(),
  };
}

export default function CirclePost({ post, style }: CirclePostProps) {
  const { title, body } = extractTitleAndBody(post.content);
  
  // Calculate size based on upvotes (min 200px, max 350px)
  const baseSize = Math.max(200, Math.min(350, 200 + post.upvotes * 0.5));
  
  return (
    <div
      className="absolute transform transition-all duration-500 ease-in-out"
      style={style}
    >
      <div className="relative">
        <div
          className="circle-post rounded-full bg-white/90 backdrop-blur-sm border border-purple-100 shadow-lg
                     flex flex-col items-center justify-center p-6 text-center"
          style={{
            width: `${baseSize}px`,
            height: `${baseSize}px`,
          }}
        >
          {/* Title */}
          <h2 className="font-bold text-gray-800 mb-3 px-4 line-clamp-2">
            {title}
          </h2>
          
          {/* Brief excerpt */}
          <p className="text-sm text-gray-600 px-4 line-clamp-3">
            {body.split('\n')[0]}
          </p>
          
          {/* Upvotes indicator */}
          <div className="absolute bottom-6 flex items-center gap-1 text-sm text-purple-500">
            <Heart className="w-4 h-4" />
            <span>{post.upvotes}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 