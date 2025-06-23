import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function EditStory() {
  const router = useRouter()
  const { id } = router.query
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`/api/stories/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.story.title)
          setContent(data.story.content)
          setLoading(false)
        })
    }
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/stories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    if (res.ok) {
      router.push('/profile')
    } else {
      alert('Failed to update')
    }
  }

  if (loading) return <p className="text-center mt-20 md:mt-28">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto mt-20 md:mt-28">
      <h1 className="text-2xl font-bold mb-4">Edit Story</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Update your story..."
          className="w-full border px-3 py-2 h-48"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  )
}
