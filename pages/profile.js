import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StoryCard from '@/components/StoryCard'
import { Pencil, Trash2 } from 'lucide-react'


export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this story?')) {
    const res = await fetch(`/api/stories/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      setStories(stories.filter((story) => story._id !== id))
    } else {
      alert(data.error || 'Failed to delete.')
    }
  }
}


  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
    } else {
      const userData = JSON.parse(storedUser)
      setUser(userData)

      fetch(`/api/stories/user?authorName=${userData.name}`)
        .then(res => res.json())
        .then(data => {
          setStories(data.stories || [])
          setLoading(false)
        })
    }
  }, [router])

  if (!user) return <p className="text-center mt-10">Redirecting...</p>
  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto mt-18 md:mt-24 p-4">
        <div className='p-4 mb-4 bg-gray-200 rounded-md shadow'>
            <h1 className="text-3xl font-bold mb-2 text-purple-800">👤 Profile</h1>
            <p className="text-gray-700">Name: <span className="font-medium">{user.name}</span></p>
            <p className="text-gray-700">Email: <span className="font-medium">{user.email}</span></p>
        </div>
      <h2 className="text-2xl font-semibold mb-4">📝 Your Stories</h2>
      {stories.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t written any stories yet.</p>
      ) : (
<div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {stories.map((story) => (
    <div key={story._id} className="relative">
      <StoryCard story={story} />
      <div className="absolute top-2 md:top-4 right-2 md:right-4 flex gap-2 md:gap-3">
        <button
          onClick={() => router.push(`/edit/${story._id}`)}
          className="text-blue-600 text-sm font-medium cursor-pointer"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => handleDelete(story._id)}
          className="text-red-600 text-sm font-medium cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  )
}
