'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import assets from 'public/assets';
import { privateApi } from 'utils/axios';

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();
  let displayPic

  // Fetch current user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await privateApi.get('/api/auth/check');
        if (res.data.success) {
          setName(res.data.user.fullName);
          setBio(res.data.user.bio);
          setProfilePic(res.data.user.profilePic || null);
        }
        displayPic = previewUrl ?? (profilePic && profilePic !== "" ? profilePic : assets.avatar_icon.src);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  // Create a preview URL for selected file
  useEffect(() => {
    if (!selectedImg) return;

    const url = URL.createObjectURL(selectedImg);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImg]);

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (selectedImg) formData.append('profilePic', selectedImg);
    formData.append('fullName', name);
    formData.append('bio', bio);

    try {
      const res = await privateApi.post('/api/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedImg(file);
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : profilePic
                  || assets.avatar_icon.src
              }
              alt="profile icon"
              className={`w-12 h-12 rounded-full object-cover`}
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder='Your name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          <textarea
            placeholder='Write profile bio'
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            required
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
            rows={4}
          ></textarea>
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
          >
            Save
          </button>
        </form>
        <img
          src={assets.logo_icon.src}
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
          alt=""
        />
      </div>
    </div>
  );
}

export default ProfilePage;
