// pages/write.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function WritePage() {
  const [user, setUser] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !content) {
      setError('Both title and content are required.')
      return
    }

    
    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, authorName: user.name })
    })

    if (res.ok) {
      router.push('/')
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
    }
  }

  
    useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])



  if (!user) return <p className="text-center mt-20 md:mt-28">Redirecting...</p>

  return (
    <div className="max-w-2xl mx-auto mt-20 md:mt-28">
      <p>Welcome, {user.name}!</p>
      <h1 className="text-2xl font-bold mb-4">Write a New Story</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your story..."
          className="w-full border px-3 py-2 h-48"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'

// export default function WritePage() {
//   const [user, setUser] = useState(null)
//   const router = useRouter()

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user')
//     if (!storedUser) {
//       router.push('/login')
//     } else {
//       setUser(JSON.parse(storedUser))
//     }
//   }, [])

//   if (!user) return <p className="text-center mt-10">Redirecting...</p>

//   return (
//     <div className="max-w-2xl mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Write Your Story</h1>
//       <p>Welcome, {user.name}!</p>
//       {/* Add story form here */}
//     </div>
//   )
// }
