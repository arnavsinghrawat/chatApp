'use client'

import assets from 'public/assets'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setAuth } from 'store/authSlice';
import { publicApi } from 'utils/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const [currState, setCurrState] = useState("Login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter()

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    try {
      if (currState === 'Sign up') {
        const res = await publicApi.post("/api/auth/signup", {
          fullName,
          email,
          password,
          bio
        });
        const { token, userData } = res.data;
        dispatch(setAuth({ token, user: userData }));

        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("Signup successful!");
        router.push('/');
      } else {
        // LOGIN
        const res = await publicApi.post("/api/auth/login", {
          email,
          password
        });
        const { token, userData } = res.data;
        dispatch(setAuth({ token, user: userData }));

        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("Login successful!");
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const toggleForm = () => {
    setCurrState(currState === 'Sign up' ? "Login" : "Sign up");
    setIsDataSubmitted(false);
  }

  return (
    <div className='min-h-screen bg-cover bg-center bg-transparent flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>


      <img src={assets.logo_big.src} alt="Logo" className='w-[min(30vw,250px)]' />


      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}

          {currState === 'Sign up' && isDataSubmitted && (
            <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon.src} alt="back arrow" className='w-5 cursor-pointer' />
          )}

        </h2>

        {currState === 'Sign up' && !isDataSubmitted && (
          <input
            type='text'
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
            placeholder='Full Name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              name="email"
              placeholder='Email Address'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              onChange={(e) => { setEmail(e.target.value) }}
              value={email}
            />
            <input
              type="password"
              name="password"
              placeholder='Password'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              onChange={(e) => { setPassword(e.target.value) }}
              value={password}
            />
          </>
        )}

        {
          currState === 'Sign up' && isDataSubmitted && (
            <textarea
              rows={4}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder='provide a short bio...'
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            ></textarea>
          )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === 'Sign up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === 'Sign up' ? (
            <p className='text-sm text-gray-600' onClick={() => toggleForm()}>
              Already have an account?
              <span className='font-medium text-violet-500 cursor-pointer ml-1'>Login here</span>
            </p>
          ) : (
            <p className='text-sm text-gray-600' onClick={() => toggleForm()}>
              Create an account
              <span className='font-medium text-violet-500 cursor-pointer ml-1'>Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage