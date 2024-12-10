import React, { useState, useEffect } from 'react'
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

const clientWindow = typeof window !== 'undefined'

// *** problem 21 ile aynı çözüm yolu !!! ***

function App() {
  const [isClient, setIsClient] = useState(false)

  // *** client-side kontrolü useEffect ile yapılır. ***
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div>
      {isClient ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/protectedPage" element={<ProtectedPage />} />
            <Route path="/captcha" element={<Captcha />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <h1>Tarayıcı fonksiyonları kullanılamaz.</h1>
      )}
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('/captcha')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
      >
        Go to Protected Page
      </button>
    </div>
  )
}

const ProtectedPage = () => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()

  // sessionStorage kontrolü
  useEffect(() => {
    if (clientWindow) {
      // Tarayıcı kontrolü
      const isCaptchaPassed = sessionStorage.getItem('captchaPassed')
      if (isCaptchaPassed) {
        setIsAuthorized(true)
      } else {
        navigate('/') // Unauthorized kullanıcıyı Home'a yönlendir
      }
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {isAuthorized ? (
        <div className="text-xl font-bold">Gizli mesaj</div>
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  )
}

const Captcha = () => {
  const navigate = useNavigate()
  const [randomNumber, setRandomNumber] = useState(null)

  useEffect(() => {
    setRandomNumber(Math.ceil(Math.random() * 6))
  }, [])

  const handleNumberClick = (number) => {
    if (number === randomNumber) {
      alert('Captcha passed!')
      sessionStorage.setItem('captchaPassed', true) // Doğrulama durumu saklanıyor
      navigate('/protectedPage')
    } else {
      alert('Wrong number! Try again.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Captcha</h1>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((number) => (
          <div
            key={number}
            onClick={() => handleNumberClick(number)}
            className="cursor-pointer bg-white border border-gray-300 rounded shadow-md p-4 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <span className="text-4xl font-bold">{number}</span>
          </div>
        ))}
      </div>
      {randomNumber && (
        <p className="mt-4 text-lg">
          Please select the number:{' '}
          <span className="font-bold">{randomNumber}</span>
        </p>
      )}
    </div>
  )
}

export default App
