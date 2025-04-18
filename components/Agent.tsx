"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface Message {
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface AgentProps {
    userName: string;
    userId?: string;
    type?: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom of the chat when new messages arrive
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Simulate receiving a message from the AI
    const simulateAIResponse = () => {
        setIsSpeaking(true);
        setTimeout(() => {
            const responses = [
                "Tell me about your experience with this technology.",
                "What challenges did you face in your previous project?",
                "How would you handle a scenario where requirements change mid-project?",
                "Can you explain your approach to problem-solving?",
                "What interests you about this position?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            setMessages(prev => [...prev, { 
                text: randomResponse, 
                sender: 'ai', 
                timestamp: new Date() 
            }]);
            setIsSpeaking(false);
        }, 1500);
    };

    // Handle sending a new message
    const handleSendMessage = () => {
        if (inputText.trim() === '') return;
        
        // Add user message
        setMessages(prev => [...prev, { 
            text: inputText, 
            sender: 'user', 
            timestamp: new Date() 
        }]);
        
        setInputText('');
        
        // Simulate AI response
        simulateAIResponse();
    };

    // Handle key press (Enter to send)
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle call button click
    const handleCallClick = () => {
        setCallStatus(CallStatus.CONNECTING);
        setTimeout(() => {
            setCallStatus(CallStatus.ACTIVE);
            // Add initial AI message when call starts
            setMessages([{ 
                text: "Hello! I'm your AI interviewer. Let's begin with your interview. Tell me about yourself.", 
                sender: 'ai', 
                timestamp: new Date() 
            }]);
        }, 1500);
    };

    // Handle call end
    const handleEndCall = () => {
        setCallStatus(CallStatus.FINISHED);
    };

    // Format timestamp for display
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
            <div className='call-view mb-4'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src="/ai-avatar.png" alt="AI" width={65} height={54} className="object-cover" />
                        {isSpeaking && <span className='animate-speak' />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src="/user-avatar.png" alt='user avatar' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>{userName}</h3>
                        {userId && <p className="text-sm text-gray-500">ID: {userId}</p>}
                        {type && <p className="text-sm text-gray-500">Mode: {type}</p>}
                    </div>
                </div>
            </div>

            <div className='w-full flex justify-center gap-4 mb-4'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button 
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
                        onClick={handleCallClick}
                    >
                        <span>
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? 'Call' : 'Connecting...'}
                        </span>
                    </button>
                ) : (
                    <button 
                        className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full btn-disconnect' 
                        onClick={handleEndCall}
                    >
                        End Call
                    </button>
                )}
                
                {callStatus === CallStatus.ACTIVE && (
                    <button 
                        className={`px-6 py-2 rounded-full ${showChat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => setShowChat(!showChat)}
                    >
                        {showChat ? 'Hide Chat' : 'Show Chat'}
                    </button>
                )}
            </div>

            {/* Chat section */}
            {showChat && callStatus === CallStatus.ACTIVE && (
                <div className="w-full border rounded-lg shadow-md bg-white overflow-hidden">
                    <div className="p-3 bg-blue-600 text-white font-medium">
                        Interview Chat
                    </div>
                    
                    {/* Messages container */}
                    <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`max-w-3/4 rounded-lg p-3 ${
                                        message.sender === 'user' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <p>{message.text}</p>
                                    <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>
                    
                    {/* Input area */}
                    <div className="p-3 border-t flex">
                        <textarea
                            className="flex-grow p-2 border rounded-l-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Type your message..."
                            rows={2}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agent;