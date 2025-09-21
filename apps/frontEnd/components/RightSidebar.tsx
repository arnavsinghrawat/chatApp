'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import assets from 'public/assets'
import { privateApi } from 'utils/axios'

const RightSidebar = () => {
  const selectedUser = useSelector((state: RootState) => state.selectedUser.value);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchImages = async () => {
      try {
        const res = await privateApi.get(`/api/messages/imagesSideContaner/${selectedUser._id}`);
        if (res.data.success) {
          const imageUrls = res.data.messages
            .map((msg: any) => msg.image)
            .filter(Boolean);
          setImages(imageUrls);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setImages([]);
      }
    };

    fetchImages();
  }, [selectedUser]);

  if (!selectedUser) return null;

  return (
    <div className='bg-[#8185B2]/10 text-white w-full relative overflow-y-auto transparent-scrollbar'>
      {/* User Info */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon.src}
          alt={selectedUser.fullName}
          className='w-20 aspect-[1/1] rounded-full'
        />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className='w-2 h-2 rounded-full bg-green-500'></p>
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* Media */}
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80 transparent-scrollbar'>
          {images.length > 0 ? (
            images.map((url, index) => (
              <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded'>
                <img src={url} alt="" className='h-full rounded-md' />
              </div>
            ))
          ) : (
            <p className='text-gray-400 text-center col-span-2'>No images yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RightSidebar