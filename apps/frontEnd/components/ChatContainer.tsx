'use client'

import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/store'
import assets, { messagesDummyData } from 'public/assets'
import { clearSelectedUser } from 'store/selectedUserSlice'
import { formatMessageTime } from 'utils/helperFunctions'
import { addMessage, setMessages } from 'store/messageSlice'
import { privateApi } from 'utils/axios'
import toast from 'react-hot-toast'
import { getSocket, subscribeToNewMessages, unsubscribeFromNewMessages } from 'utils/socket'

const ChatContainer = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state: RootState) => state.selectedUser.value);
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const messages = useSelector((state: RootState) => state.message.list);
  const [userMessage, setUserMessage] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleUserMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  }

  const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const receiverId = selectedUser?._id;

    try {
      const result = await privateApi.post(`/api/messages/send/${receiverId}`, {
        text: userMessage,
        image
      });
      if (!result.data.success) {
        toast.error("Error: ", result.data.error);
      }

      if (result.data.success) {
        const formattedMessage = {
          senderId: authUser!._id,
          receiverId: selectedUser!._id,
          text: userMessage ?? undefined,
          image: image ?? undefined,
          seen: false,
          createdAt: new Date().toISOString()
        };

        dispatch(addMessage(formattedMessage))

        setUserMessage('');
        setImage(null);
      }
      toast.success("Message Sent")
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }

  const getMessages = async (receiverId: string) => {
    try {
      if (!selectedUser?._id) {
        toast.error("No user selected");
        return;
      }
      const res = await privateApi.get(`/api/messages/${receiverId}`);
      dispatch(setMessages(res.data.messages));
      toast.success("messages retrieved");
    } catch (error) {
      toast.error("Error")
    }
  }


  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return;

    const handleNewMeesage = (message: any) => {
      dispatch(addMessage(message));
    };

    subscribeToNewMessages(handleNewMeesage);

    return () => {
      unsubscribeFromNewMessages()
    }
  })

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser!._id)
    }
  }, [selectedUser])

  // useEffect(() => {
  //   dispatch(setMessages(messagesDummyData));
  // }, [dispatch])


  return selectedUser ? (
    <div className='h-full flex flex-col overflow-hidden relative backdrop-blur-lg'>
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon.src} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-srclg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={() => dispatch(clearSelectedUser())} src={assets.arrow_icon.src} alt=""
          className='md:hidden max-w-7' />
        <img src={assets.help_icon.src} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/* chat area */}
      <div className='flex-1 overflow-y-auto p-3 pb-15 transparent-scrollbar'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId === authUser?._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <div className="max-w-[230px] mb-8 border border-gray-700 rounded-lg overflow-hidden">
                <Image
                  src={msg.image as string}
                  alt="chat image"
                  width={230}
                  height={230}
                  className="rounded-lg object-cover"
                  priority={false} // lazy load
                />
              </div>
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.text}
              </p>
            )}
            <div>
              <img
                src={
                  msg.senderId === authUser?._id
                    ? authUser.profilePic || assets.avatar_icon.src
                    : selectedUser?.profilePic || assets.avatar_icon.src
                }
                alt="profile photo"
                className="w-7 rounded-full"
              />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input type="text" placeholder="Send a message" onChange={handleUserMessageChange}
            value={userMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage(e as any)
              }
            }}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none
                   text-white placeholder-gray-400/' />
          <input type="file" id="image" accept="image/png, image/jpeg" onChange={handleImageUpload} hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon.src} alt="" className="w-5 mr-2
                   cursor-pointer" />
          </label>
          <button onClick={handleSendMessage}>
            <img src={assets.send_button.src} alt="Send" className="w-7 cursor-pointer" />
          </button>
        </div>

      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon.src} className='max-w-16' alt="logo" />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
