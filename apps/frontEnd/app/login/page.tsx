import assets from 'public/assets'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='min-h-screen bg-cover bg-center bg-transparent flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* left side */}

      <img src={assets.logo_big.src} alt="Logo" className='w-[min(30vw,250px)]'/>

      {/* right side */}

      <form action="" className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'></form>
    </div>
  )
}

export default LoginPage
