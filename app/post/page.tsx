import NavBar from '@/components/NavBar'
import PostForm from '@/components/PostForm'

export default function PostPage() {
  return (
    <main>
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Share Your Stock Take
        </h1>
        <PostForm />
      </div>
    </main>
  )
} 