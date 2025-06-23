
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Pencil, Home, BookOpen, Tags, User, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [clicked, setClicked] = useState(false)
  const boxRef = useRef(null);

  // Watch for route changes and update user from localStorage
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }

    checkUser()

    // Listen to route changes to update the user
    const handleRouteChange = () => {
      checkUser()
    }

    router.events?.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  const handleClick = () => {
    setClicked(true)
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setClicked(false);
      }
    };

    if (clicked) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [clicked]);

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  const linkStyle = (path) =>
    router.pathname === path
      ? 'bg-white text-purple-700 px-3 py-1 rounded'
      : 'text-white hover:underline'

  return (

    <nav className="bg-purple-700 text-white px-4 md:px-10 py-4 md:py-6 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-md">
  <div className="text-xl md:text-2xl font-bold">
    <Link href="/">MyStree</Link>
  </div>
  <div className="flex gap-4 md:gap-10 items-center">

 {user && (
            <>
              <Link href="/write" className="hover:text-gray-300 flex items-center text-sm md:text-lg gap-1 md:gap-2">
                <Pencil className="w-3 md:w-4 h-3 md:h-4 md:w-5 md:h-6" /> Write
              </Link>
              <Link href="/mystories" className="hover:text-gray-300 flex items-center text-sm md:text-xl gap-1 md:gap-2">
                <BookOpen className="w-3 md:w-4 h-4 md:h-4 md:w-5 md:h-6" /> My Stories
              </Link>
            </>
          )}


    {user ? (
      <div className="relative group">
        <span className="cursor-pointer text-md flex md:gap-1 md:text-xl"><User onClick={handleClick} className="w-5 h-5 md:w-6 md:h-6" /> <span className='hidden md:block'>{user.name} </span></span>

        {clicked && (
        <div ref={boxRef} className="absolute group-hover:opacity-100 visible group-hover:visible transition-all duration-200 bg-white text-black right-0 mt-2 py-2 md:py-4 px-4 md:px-6 md:text-xl rounded shadow">
          <Link className='' href="/profile">Profile</Link><br />
          <button className="cursor-pointer" onClick={handleLogout}>Logout</button>
        </div> 
        ) 
      }
      <div ref={boxRef} className="absolute group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 bg-white text-black right-0 mt-2 py-2 md:py-4 px-4 md:px-6 md:text-xl rounded shadow">
          <Link className='' href="/profile">Profile</Link><br />
          <button className="cursor-pointer" onClick={handleLogout}>Logout</button>
        </div> 
        
      </div>
    ) : (
      <>
        <Link href="/login" className={`md:text-xl ${linkStyle('/login')}`}>Login</Link>
        <Link href="/signup" className={`md:text-xl ${linkStyle('/signup')}`}>Sign Up</Link>
      </>
    )}
  </div>
</nav>

  )
}
