import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StoryCard from '@/components/StoryCard'
import { Pencil, Trash2 } from 'lucide-react'


export default function MyStories() {
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

  if (!user) return <p className="text-center mt-20 md:mt-28">Redirecting...</p>
  if (loading) return <p className="text-center mt-20 md:mt-28">Loading...</p>

  return (
<>
    <div>
        <p className='mt-20 md:mt-28 mb-6 text-3xl font-bold text-center'>My Stories</p>
    </div>
  {stories.length === 0 ? (
        <p className="text-gray-500 text-center">You haven&apos;t written any stories yet.</p>
      ) : (
  <div className="space-y-4 m-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
    {stories.map((story) => (
      <div key={story._id} className="relative">
        <StoryCard story={story} />
        <div className="absolute top-2 md:top-4 right-2 md:right-6 flex gap-2 md:gap-3">
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
  </>
    )
  }
  