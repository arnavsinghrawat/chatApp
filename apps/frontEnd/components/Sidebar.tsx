'use client'

import React, { useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/store'
import { IUser, setSelectedUser } from 'store/selectedUserSlice';
import { setOnlineUsers } from 'store/socketSlice';
import assets, { userDummyData } from '../public/assets'
import { getSocket, subscribeToNewMessages, unsubscribeFromNewMessages } from 'utils/socket'
import { privateApi } from 'utils/axios'

interface IMessage {
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
}

// Reducer for unseen messages
type UnseenAction =
  | { type: 'increment', senderId: string }
  | { type: 'reset', senderId: string }
  | { type: 'set', payload: Record<string, number> }

const unseenReducer = (state: Record<string, number>, action: UnseenAction) => {
  switch (action.type) {
    case 'increment':
      return { ...state, [action.senderId]: (state[action.senderId] || 0) + 1 };
    case 'reset':
      return { ...state, [action.senderId]: 0 };
    case 'set':
      return { ...action.payload };
    default:
      return state;
  }
};

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedUser = useSelector((state: RootState) => state.selectedUser.value);
  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);

  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [unseenMessages, dispatchUnseen] = useReducer(unseenReducer, {});
  const [searchQuery, setSearchQuery] = useState('');

  const handleClick = () => router.push('/profile');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await privateApi.get('/api/messages/users');
        const realUsers: IUser[] = res.data.users;
        const unseen: Record<string, number> = res.data.unseenMessages || {};

        const mergedUsers = [
          ...realUsers.filter(dbUser => !userDummyData.some(dummy => dummy._id === dbUser._id))
        ];

        setAllUsers(mergedUsers);
        dispatchUnseen({ type: 'set', payload: unseen });
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Handle new messages
    const handleNewMessage = (message: IMessage) => {
      if (selectedUser?._id === message.senderId) return;
      dispatchUnseen({ type: 'increment', senderId: message.senderId });
    };

    subscribeToNewMessages(handleNewMessage);

    // Handle online users
    const handleOnlineUsers = (users: string[]) => {
      dispatch(setOnlineUsers(users));
    };

    socket.on('getOnlineUsers', handleOnlineUsers);

    return () => {
      socket.off('getOnlineUsers', handleOnlineUsers);
      unsubscribeFromNewMessages();
    };
  }, [selectedUser]);

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto transparent-scrollbar text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* Header */}
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
          <input
            type="text"
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
            placeholder='Search User...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users list */}
      <div className='flex flex-col'>
        {filteredUsers.map(user => (
          <div key={user._id}
            onClick={() => {
              dispatch(setSelectedUser(user));
              dispatchUnseen({ type: 'reset', senderId: user._id });
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}>
            <img src={user.profilePic || assets.avatar_icon.src} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-neutral-400'}`}>
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </span>
            </div>
            {unseenMessages[user._id]! > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}

        {/* If no users match */}
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-4">No users found</p>
        )}
      </div>
    </div>
  )
}

export default Sidebar;
