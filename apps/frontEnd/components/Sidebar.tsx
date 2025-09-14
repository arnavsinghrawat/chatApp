'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/store'
import { setSelectedUser } from 'store/selectedUserSlice';
import { setOnlineUsers } from 'store/socketSlice';
import assets, { userDummyData } from '../public/assets'
import { getSocket } from 'utils/socket'
import { privateApi } from 'utils/axios';

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedUser = useSelector((state: RootState) => state.selectedUser.value);
  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);

  console.log(onlineUsers);

  const [allUsers, setAllUsers] = useState(userDummyData);

  const handleClick = () => {
    router.push('/profile');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await privateApi.get('/api/messages/users');
        const realUsers = res.data.users;

        console.log("realUsers:", realUsers, Array.isArray(realUsers));

        const mergedUsers = [
          ...userDummyData,
          ...realUsers.filter(
            (dbUser: any) => !userDummyData.some(dummy => dummy._id === dbUser._id)
          ),
        ];

        setAllUsers(mergedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Listen to online users via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const updateOnline = (users: string[]) => {
      dispatch(setOnlineUsers(users));
    };

    socket.on('getOnlineUsers', updateOnline);

    return () => {
      socket.off('getOnlineUsers', updateOnline);
    };
  }, []);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto transparent-scrollbar text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={'/logo.png'} alt="logo" className='max-w-40' />
          <div className='relative py-2 group'>
            <img src={'/menu_icon.png'} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={handleClick} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={'/search_icon.png'} alt="Search" className='w-3' />
          <input type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
        </div>
      </div>

      <div className='flex flex-col'>
        {allUsers.map((user) => (
          <div key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
            <img src={user?.profilePic || assets.avatar_icon.src} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-neutral-400'}`}>
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar;
