import Link from 'next/link'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import CirclePost from '@/components/CirclePost'
import CircleAnimation from '@/components/CircleAnimation'

const samplePosts = [
  {
    id: '1',
    content: "The Art of Simple Living\n\nLess is more. After a year of minimizing possessions and commitments, I've discovered that simplicity brings clarity. The fewer distractions we have, the more we can focus on what truly matters.\n\nStart small: Remove one unnecessary thing each day.",
    created_at: '2024-05-20T10:30:00Z',
    upvotes: 142
  },
  {
    id: '2',
    content: "Why Everyone Should Learn to Cook\n\nCooking is more than just food preparation - it's a form of meditation, creativity, and connection. When you cook, you're engaging all your senses and creating something meaningful.\n\nStart with simple recipes and build your confidence gradually.",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    upvotes: 89
  },
  {
    id: '3',
    content: "The Power of Daily Walks\n\nWalking isn't just exercise - it's a chance to:\n- Clear your mind\n- Find inspiration\n- Connect with your environment\n- Boost creativity\n\nTry walking without headphones sometimes. Listen to the world around you.",
    created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    upvotes: 56
  },
  {
    id: '4',
    content: "Digital Gardens vs Social Media\n\nInstead of posting for likes, what if we created to learn and share?\n\nDigital gardens are personal spaces where:\n- Ideas grow over time\n- Knowledge compounds\n- Connections form naturally\n\nIt's slow, intentional, and deeply fulfilling.",
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    upvotes: 56
  },
  {
    id: '5',
    content: "The Joy of Learning Languages\n\nEvery new language opens a door to a different way of thinking. It's not just about communication - it's about understanding different perspectives and cultures.\n\nThe best approach? Immerse yourself in content you love.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvotes: 95
  },
  {
    id: '6',
    content: "Mindful Technology Use\n\nTechnology should serve us, not control us. Create intentional boundaries:\n- No phones during meals\n- Digital sunset before bed\n- Regular digital detox days\n\nReclaim your attention, reclaim your life.",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    upvotes: 123
  },
  {
    id: '7',
    content: "The Renaissance of Board Games\n\nModern board games are experiencing a golden age. They offer:\n- Deep strategic thinking\n- Social connection\n- Screen-free entertainment\n- Lasting memories\n\nStart with gateway games and explore!",
    created_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    upvotes: 78
  },
  {
    id: '8',
    content: "Urban Gardening Revolution\n\nYou don't need a yard to grow food. Start with:\n- Windowsill herbs\n- Balcony tomatoes\n- Microgreens indoor\n\nConnect with your food, reduce waste, and enjoy the freshest ingredients possible.",
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    upvotes: 112
  },
  {
    id: '9',
    content: "The Lost Art of Letter Writing\n\nIn a world of instant messages, taking time to write letters by hand is revolutionary. It forces us to slow down, think deeply, and connect meaningfully.\n\nStart writing to one person this week.",
    created_at: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    upvotes: 67
  },
  {
    id: '10',
    content: "Minimalist Photography\n\nLess is more in photography too. Focus on:\n- Simple compositions\n- Negative space\n- Single subjects\n- Clean backgrounds\n\nLimit your tools to expand your creativity.",
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    upvotes: 94
  },
  {
    id: '11',
    content: "The Science of Naps\n\nPerfect naps are an art and science:\n- 20 minutes for alertness\n- 60 minutes for memory\n- 90 minutes for creativity\n\nTime them right, and they're like a superpower.",
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    upvotes: 145
  },
  {
    id: '12',
    content: "Sustainable Fashion Choices\n\nBuild a wardrobe that lasts:\n- Choose quality over quantity\n- Invest in timeless pieces\n- Learn basic repairs\n- Shop secondhand first\n\nGood for your wallet and the planet.",
    created_at: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
    upvotes: 88
  },
  {
    id: '13',
    content: "The Power of Morning Pages\n\nThree pages of stream-of-consciousness writing each morning can:\n- Clear mental clutter\n- Spark creativity\n- Solve problems\n- Reduce anxiety\n\nNo rules, just write.",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    upvotes: 167
  },
  {
    id: '14',
    content: "Rediscovering Local Libraries\n\nModern libraries are community hubs offering:\n- Free learning resources\n- Workspace\n- Community events\n- Digital services\n\nYour library card is a passport to infinite possibilities.",
    created_at: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    upvotes: 104
  }
]

function getRandomPosition(index: number) {
  // Just add random initial offset and animation delay
  return {
    transform: 'none',
    animationDelay: `${-Math.random() * 10}s`
  };
}

export default function Home() {
  return (
    <main className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {/* Header - more compact */}
      <div className="absolute top-0 left-0 right-0 z-10 text-center py-4 bg-white/60 backdrop-blur-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Big Circles
        </h1>
      </div>

      {/* Content - adjusted to account for smaller header */}
      <div className="absolute inset-0 pt-12">
        <CircleAnimation>
          {samplePosts.map((post) => (
            <CirclePost
              key={post.id}
              post={post}
              style={{ transform: 'none' }}
            />
          ))}
        </CircleAnimation>
      </div>
    </main>
  )
}