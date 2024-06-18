import React, { useState, useEffect } from 'react';
import { ref, push, set, onValue, update } from "firebase/database";
import { database } from './firebase';

const App = () => {
  const [name, setName] = useState('');
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    const chatListRef = ref(database, 'chats');
    onValue(chatListRef, (snapshot) => {
      const data = snapshot.val();
      const chatArray = data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
      setChats(chatArray);
    });
  }, []);

  const sendChat = () => {
    const chatListRef = ref(database, 'chats');

    if (editKey) {
      const chatRef = ref(database, `chats/${editKey}`);
      update(chatRef, { message: msg, timestamp: Date.now() });
      setEditKey(null);
    } else {
      const chatRef = push(chatListRef);
      const chatKey = chatRef.key;

      set(chatRef, {
        key: chatKey,
        name,
        message: msg,
        timestamp: Date.now(),
        hidden: false
      });
    }

    setMsg('');
  };

  const deleteChatUI = (key) => {
    const chatRef = ref(database, `chats/${key}`);
    update(chatRef, { hidden: true });
  };

  const editChat = (chat) => {
    setMsg(chat.message);
    setEditKey(chat.key);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className='flex flex-col h-screen'>
      {!isNameSet ? (
        <div className="flex flex-col items-center justify-center h-full">
          <input
            type="text"
            placeholder="Enter your name to start"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='outline-none p-2 rounded-md border border-gray-300 mb-4'
          />
          <button onClick={() => setIsNameSet(true)} className='bg-blue-500 text-white p-2 rounded-md'>Start Chat</button>
        </div>
      ) : (
        <div className='flex flex-col h-full'>
          <header className="bg-blue-500 text-white p-4 text-center text-xl font-bold">
            Chatting as {name}
          </header>
          <div className="flex flex-col flex-grow overflow-y-auto p-4 bg-gray-100">
            {chats.map((c, index) => (
              !c.hidden && (
                <div 
                  key={index} 
                  className={`mb-2 p-2 rounded-lg max-w-[70%] ${c.name === name ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'}`}
                >
                  <p>
                    <strong>{c.name}</strong>: {c.message}
                  </p>
                  <span className="text-xs text-gray-400">{formatTime(c.timestamp)}</span>
                  {c.name === name && (
                    <>
                      <button onClick={() => deleteChatUI(c.key)} className="text-red-500 ml-2">Delete</button>
                      <button onClick={() => editChat(c)} className="text-green-500 ml-2">Edit</button>
                    </>
                  )}
                </div>
              )
            ))}
          </div>
          <div className="bg-white p-4 flex gap-2 items-center">
            <input
              className="outline-none bg-gray-200 p-2 flex-grow rounded-md"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              type="text"
              placeholder="Enter your message"
            />
            <button onClick={sendChat} className="bg-blue-500 text-white p-2 rounded-md">{editKey ? 'Update' : 'Send'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
