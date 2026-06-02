import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Clock, AlertTriangle, MessageCircle, Server, Search, HelpCircle, FileText, ChevronRight, User, Settings, Shield, Plus, X, Minus } from 'lucide-react';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { createSupportBotSession, sendChatMessage } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { AccountProfileGuideModal } from './AccountProfileGuideModal';
import { PrivacySecurityGuideModal } from './PrivacySecurityGuideModal';
import { FarmManagementGuideModal } from './FarmManagementGuideModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { PrivacySecurityModal } from './PrivacySecurityModal';
import { FarmManagementModal } from './FarmManagementModal';
import { Shield as ShieldIcon, Lock } from 'lucide-react';

export const SupportCenterPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'TEAM_CHAT'>('TICKETS');
  
  // Ticket State
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ticketScrollRef = useRef<HTMLDivElement>(null);

  // Team Chat State
  const [teamMessages, setTeamMessages] = useState<any[]>([]);
  const [teamText, setTeamText] = useState('');
  const teamScrollRef = useRef<HTMLDivElement>(null);

  // Farmer View State
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatInput, setChatInput] = useState('');
  const farmerChatScrollRef = useRef<HTMLDivElement>(null);
  const chatModalRef = useRef<HTMLDivElement>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isProfileGuideOpen, setIsProfileGuideOpen] = useState(false);
  const [isPrivacyGuideOpen, setIsPrivacyGuideOpen] = useState(false);
  const [isFarmGuideOpen, setIsFarmGuideOpen] = useState(false);
  const [showMobileNotice, setShowMobileNotice] = useState(false);

  useEffect(() => {
    if ((user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && window.innerWidth < 768) {
      setShowMobileNotice(true);
    }
  }, [user?.role]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatModalRef.current && !chatModalRef.current.contains(event.target as Node)) {
        setIsChatMinimized(true);
      }
    };

    if (isChatOpen && !isChatMinimized) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen, isChatMinimized]);

  useEffect(() => {
    console.log("[FRONTEND] SupportCenterPage useEffect triggered", { activeTab, role: user?.role, isAuthLoading, userId: user?.id });
    if (isAuthLoading) {
      console.log("[FRONTEND] Auth is still loading, skipping fetch");
      return;
    }
    
    if (!user) {
      console.log("[FRONTEND] No user found, skipping fetch");
      return;
    }

    if (user.role === 'FARMER') {
      console.log("[FRONTEND] Fetching tickets for FARMER");
      fetchTickets();
    } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      console.log("[FRONTEND] Fetching data for ADMIN/SUPER_ADMIN");
      fetchTickets();
      fetchTeamChat();
    }
  }, [activeTab, user?.role, isAuthLoading]);

  useEffect(() => {
    farmerChatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleStartFarmerChat = () => {
    setIsChatOpen(true);
    setIsChatMinimized(false);
    if (!chatSession) {
      const session = createSupportBotSession();
      setChatSession(session);
      setChatMessages([{ role: 'bot', text: `Hi ${user?.name}, I'm the Agrivision Support Bot. How can I help you today?` }]);
    }
  };

  const handleFarmerChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatSession) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const historyPayload = chatMessages.map(m => ({ role: m.role, text: m.text }));
      let botResponse = await sendChatMessage(chatSession, userMsg, historyPayload);
      
      // If the bot decides to escalate, create a ticket automatically
      if (botResponse.toLowerCase().includes('escalate') || botResponse.toLowerCase().includes('book a ticket')) {
        const fullHistory = chatMessages.map(m => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.text}`).join('\n') + `\nUser: ${userMsg}\nBot: ${botResponse}`;
        const newTicket = await ApiService.createTicket('Support Request via AI Bot', fullHistory);
        setTickets(prev => [newTicket, ...prev]);
        
        botResponse += `\n\nI have successfully booked an agent for you. Your unique ticket ID is #${newTicket.id.substring(0, 8)}. An agent will review your case shortly.`;
        
        // Simulate email notification
        setTimeout(() => {
          alert(`Email sent to ${user?.email} from Agrivision: Your ticket #${newTicket.id.substring(0, 8)} has been created and an agent will be with you shortly.`);
        }, 1000);
      }
      
      setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    ticketScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages]);

  useEffect(() => {
    teamScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [teamMessages]);

  const fetchTickets = async () => {
    console.log("[FRONTEND] fetchTickets called");
    try {
      const data = await ApiService.getTickets();
      console.log("[FRONTEND] fetchTickets success", { count: data.length, tickets: data });
      setTickets(data);
      if (data.length > 0 && !activeTicket) {
        console.log("[FRONTEND] Setting active ticket to first ticket", data[0].id);
        setActiveTicket(data[0]);
      }
    } catch (e) {
      console.error("[FRONTEND] Failed to load tickets", e);
    }
  };

  const fetchTeamChat = async () => {
    console.log("[FRONTEND] fetchTeamChat called");
    setIsLoading(true);
    try {
      const data = await ApiService.getTeamChat();
      console.log("[FRONTEND] fetchTeamChat success", { count: data.length, messages: data });
      setTeamMessages(data);
    } catch (e: any) {
      console.error("[FRONTEND] Failed to load team chat:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    setIsLoading(true);
    try {
      const updatedTicket = await ApiService.replyToTicket(activeTicket.id, replyText);
      setActiveTicket(updatedTicket);
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      setReplyText('');
      
      // Simulate email notification
      alert(`Email sent to ${activeTicket.farmer?.email || 'user'} from Agrivision: You have a new reply on ticket #${activeTicket.id.substring(0, 8)}`);
    } catch (e) {
      console.error("Failed to send reply", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!activeTicket) return;
    try {
      const updatedTicket = await ApiService.updateTicketStatus(activeTicket.id, status);
      setActiveTicket(updatedTicket);
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const handleSendTeamMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamText.trim()) return;

    setIsLoading(true);
    try {
      await ApiService.sendTeamMessage(teamText);
      await fetchTeamChat(); // Refresh chat
      setTeamText('');
    } catch (e) {
      console.error("Failed to send team message", e);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLinks = [
    {
      id: 'profile',
      title: 'Account & Profile',
      description: 'Learn how to manage your identity and security',
      icon: <User size={24} />,
      colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      onClick: () => setIsProfileGuideOpen(true)
    },
    {
      id: 'farm',
      title: 'Farm Management',
      description: 'Master the Agrivision platform features',
      icon: <Settings size={24} />,
      colorClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      onClick: () => setIsFarmGuideOpen(true)
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'How we protect your data and privacy',
      icon: <Shield size={24} />,
      colorClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      onClick: () => setIsPrivacyGuideOpen(true)
    }
  ];

  const filteredQuickLinks = quickLinks.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Support Center...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400">Please log in to access the Support Center.</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'FARMER') {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-fade-in relative">
        <div className="flex-1 overflow-y-auto">
          {/* Header / Hero Section */}
          <div className="bg-emerald-600 text-white p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10.01%)', backgroundSize: '20px 20px' }}></div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10">How can we help you today?</h1>
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for articles, guides, or topics..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-10">
            <div className="max-w-5xl mx-auto">
            
            {/* Quick Links */}
            {filteredQuickLinks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {filteredQuickLinks.map(link => (
                  <div 
                    key={link.id}
                    onClick={link.onClick}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${link.colorClass}`}>
                      {link.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">{link.title}</h3>
                    <p className="text-slate-500 dark:text-slate-200 text-sm">{link.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* My Tickets & Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText size={20} className="text-emerald-500" />
                  My Support Requests
                </h2>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  {filteredTickets.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      {searchQuery ? "No support requests match your search." : "You haven't submitted any support requests yet."}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {filteredTickets.map(ticket => (
                        <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{ticket.subject}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Last updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            ticket.status === 'RESOLVED' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                            ticket.status === 'ESCALATED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Still need help?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Our AI assistant can help you right away, or connect you with a human agent.</p>
                  <div className="space-y-3">
                    <button 
                      className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Contact Support
                    </button>
                    <button 
                      onClick={handleStartFarmerChat}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        </div>

        {/* AI Bot Chat Modal */}
        {isChatOpen && !isChatMinimized && (
          <div ref={chatModalRef} className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 bg-white dark:bg-slate-800 sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-700 flex flex-col h-[100dvh] sm:h-[500px] sm:max-h-[calc(100vh-6rem)] z-50 animate-fade-in">
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between sm:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Agrivision Support Bot</h3>
                  <p className="text-xs text-emerald-100">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsChatMinimized(true)} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <Minus size={20} />
                </button>
                <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
              <div ref={farmerChatScrollRef} />
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 sm:rounded-b-2xl">
              <form onSubmit={handleFarmerChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-slate-800 dark:text-slate-100"
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim() || isLoading}
                  className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Minimized Chat Button */}
        {isChatOpen && isChatMinimized && (
          <button 
            onClick={() => setIsChatMinimized(false)}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-500 hover:shadow-xl transition-all transform hover:-translate-y-1 z-50 flex items-center justify-center group"
          >
            <MessageCircle size={24} />
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out ml-0 group-hover:ml-2 font-medium">
              Open Chat
            </span>
          </button>
        )}
        {/* Management Modals */}
        <ProfileSettingsModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
        
        <PrivacySecurityModal 
          isOpen={isPrivacyModalOpen} 
          onClose={() => setIsPrivacyModalOpen(false)} 
        />
        
        <FarmManagementModal 
          isOpen={isFarmModalOpen} 
          onClose={() => setIsFarmModalOpen(false)} 
        />

        {/* Guide Modals */}
        <AccountProfileGuideModal 
          isOpen={isProfileGuideOpen} 
          onClose={() => setIsProfileGuideOpen(false)} 
          onAction={() => setIsProfileModalOpen(true)}
        />
        
        <PrivacySecurityGuideModal 
          isOpen={isPrivacyGuideOpen} 
          onClose={() => setIsPrivacyGuideOpen(false)} 
          onAction={() => setIsPrivacyModalOpen(true)}
        />
        
        <FarmManagementGuideModal 
          isOpen={isFarmGuideOpen} 
          onClose={() => setIsFarmGuideOpen(false)} 
          onAction={() => setIsFarmModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-fade-in">
      
      {/* Header Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`flex-1 py-4 font-bold text-sm transition-colors border-b-2 flex justify-center items-center gap-2 ${activeTab === 'TICKETS' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
        >
          <MessageCircle size={18} />
          User Complaints
        </button>
        <button
          onClick={() => setActiveTab('TEAM_CHAT')}
          className={`flex-1 py-4 font-bold text-sm transition-colors border-b-2 flex justify-center items-center gap-2 ${activeTab === 'TEAM_CHAT' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
        >
          <Server size={18} />
          Internal Staff Chat
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
        {/* --- TICKETS VIEW --- */}
        {activeTab === 'TICKETS' && (
          <>
            {/* Tickets Sidebar */}
            <div className={`w-full md:w-1/3 border-r border-slate-200 dark:border-slate-700 overflow-y-auto bg-slate-50 dark:bg-slate-900 ${activeTicket ? 'hidden md:block' : 'block'}`}>
              {tickets.length === 0 ? (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">No active complaints found.</div>
              ) : (
                [...tickets].sort((a, b) => {
                  // First come first serve: oldest OPEN/ESCALATED first. RESOLVED at the bottom.
                  if (a.status === 'RESOLVED' && b.status !== 'RESOLVED') return 1;
                  if (a.status !== 'RESOLVED' && b.status === 'RESOLVED') return -1;
                  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }).map(ticket => (
                  <div 
                    key={ticket.id} 
                    onClick={() => setActiveTicket(ticket)}
                    className={`p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-colors ${activeTicket?.id === ticket.id ? 'bg-white dark:bg-slate-800 shadow-sm border-l-4 border-l-emerald-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 dark:text-white truncate pr-2">{ticket.subject}</h4>
                      {ticket.status === 'OPEN' && <Clock size={16} className="text-blue-500 shrink-0" />}
                      {ticket.status === 'ESCALATED' && <AlertTriangle size={16} className="text-amber-500 shrink-0" />}
                      {ticket.status === 'RESOLVED' && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">From: {ticket.farmer?.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {ticket.messages?.[ticket.messages.length - 1]?.text || 'No messages'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Opened: {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Ticket Chat Area */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${!activeTicket ? 'hidden md:flex' : 'flex'}`}>
              {activeTicket ? (
                <>
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <button 
                        className="md:hidden p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                        onClick={() => setActiveTicket(null)}
                      >
                        <ChevronRight className="rotate-180" size={20} />
                      </button>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{activeTicket.subject}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Filed by {activeTicket.farmer?.name} ({activeTicket.farmer?.email})</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {activeTicket.status !== 'RESOLVED' && (
                         <button 
                           onClick={() => handleUpdateStatus('RESOLVED')}
                           className="px-3 py-1.5 bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white rounded-lg text-xs font-bold hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-colors"
                         >
                           Mark Resolved
                         </button>
                       )}
                       {activeTicket.status === 'OPEN' && user?.role === 'ADMIN' && (
                         <button 
                           onClick={() => handleUpdateStatus('ESCALATED')}
                           className="px-3 py-1.5 bg-amber-600 text-white dark:bg-amber-600 dark:text-white rounded-lg text-xs font-bold hover:bg-amber-500 dark:hover:bg-amber-500 transition-colors"
                         >
                           Escalate
                         </button>
                       )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTicket.messages?.map((msg: any, idx: number) => {
                      const isFarmer = msg.sender?.role === 'FARMER';
                      return (
                        <div key={idx} className={`flex gap-3 ${isFarmer ? '' : 'flex-row-reverse'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${isFarmer ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                            {msg.sender?.name.charAt(0)}
                          </div>
                          <div className={`max-w-[70%] p-4 rounded-2xl ${isFarmer ? 'bg-slate-100 dark:bg-slate-800 rounded-tl-none text-slate-800 dark:text-slate-200' : 'bg-emerald-500 text-white rounded-tr-none'}`}>
                            <p className="text-xs font-bold mb-1 opacity-75">{msg.sender?.name} ({msg.sender?.role})</p>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={ticketScrollRef} />
                  </div>

                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleTicketReply} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={activeTicket.status === 'RESOLVED' ? "Ticket resolved." : "Type your reply..."}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        disabled={activeTicket.status === 'RESOLVED' || isLoading}
                        className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-slate-800 dark:text-slate-100"
                      />
                      <button 
                        type="submit" 
                        disabled={!replyText.trim() || activeTicket.status === 'RESOLVED' || isLoading}
                        className="bg-emerald-600 text-white px-6 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  Select a ticket to view details
                </div>
              )}
            </div>
          </>
        )}

        {/* --- TEAM CHAT VIEW --- */}
        {activeTab === 'TEAM_CHAT' && (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
             <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Internal Staff Chat</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Secure communication for Admins and Super Admins</p>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {teamMessages.length === 0 ? (
                  <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-10">No messages yet. Start the conversation!</div>
                ) : (
                  teamMessages.map((msg: any) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                          {msg.sender?.name} • {msg.sender?.role === 'SUPER_ADMIN' ? '👑 Super Admin' : 'Admin'}
                        </span>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={teamScrollRef} />
             </div>
             <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <form onSubmit={handleSendTeamMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Message the team..."
                    value={teamText}
                    onChange={(e) => setTeamText(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-slate-800 dark:text-slate-100"
                  />
                  <button 
                    type="submit" 
                    disabled={!teamText.trim() || isLoading}
                    className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </form>
             </div>
          </div>
        )}
      </div>

      {/* Mobile Notice Modal */}
      {showMobileNotice && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Desktop Recommended</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
              For the best chat and support management experience, please use a PC or desktop device.
            </p>
            <button
              onClick={() => setShowMobileNotice(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
