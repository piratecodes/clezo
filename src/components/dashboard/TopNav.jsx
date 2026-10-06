import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bell, Search, UserCircle, LogOut, ChevronDown, KeyRound, Menu as MenuIcon, Monitor } from 'lucide-react';
import LoadingBar from 'react-top-loading-bar';
import { useAuth } from '@/contexts/AuthContext.jsx';

import MyAccountModal from './MyAccountModal';
import ChangePasswordModal from './ChangePasswordModal';
import ActiveDevicesModal from './ActiveDevicesModal';

// THE BULLETPROOF URL BUILDER
const getImageUrl = (pic) => {
  if (!pic || pic === 'default-avatar.png') return null;
  if (pic.startsWith('http')) return pic;
  
  let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  baseUrl = baseUrl.replace('/api/v1', '').replace(/\/$/, '');
  
  return `${baseUrl}/uploads/${pic}`;
};

export default function TopNav({ setIsSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const loadingBarRef = useRef(null);
  const { user: adminData, logout } = useAuth();
  
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isActiveDevicesOpen, setIsActiveDevicesOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  const adminName = adminData?.name || 'Admin';
  const adminDesignation = adminData?.designation || '';
  const profilePic = adminData?.profilePic || null;

  // Auto-close menu on route change
  useEffect(() => {
    setIsAccountModalOpen(false);
  }, [location.pathname]); 
  const handleLogout = async () => {
    loadingBarRef.current.continuousStart();
    try {
      await logout();
    } catch (e) {
      console.error('Logout error', e);
    }
    setTimeout(() => {
      loadingBarRef.current.complete();
      navigate('/login');
    }, 500);
  };

  // 👇 THIS IS WHAT WE FIXED! It now strictly uses the bulletproof function!
  const displayImage = getImageUrl(profilePic);

  return (
    <>
      <header className="relative h-20 bg-on-primary-fixed/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 z-40 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        
        {/* Ambient Sky Color Glares Container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[400px] h-[100px] bg-primary/20 blur-[60px] animate-pulse"></div>
          <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[300px] h-[100px] bg-primary/20 blur-[50px]"></div>
        </div>

        <LoadingBar color="#00aee6" ref={loadingBarRef} shadow={true} height={3} />

        <div className="flex items-center gap-4 flex-1 relative z-10">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Sidebar"
          >
            <MenuIcon size={24} />
          </button>
          {/* ... Search Bar placeholder if needed ... */}
        </div>

        <div className="flex items-center gap-5">
          {/* <button className="p-2.5 text-slate-400 bg-white/5 hover:bg-primary/20 hover:text-white rounded-full border border-white/10 shadow-sm transition-all duration-300 relative group">
            <Bell size={18} className="group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full shadow-[0_0_5px_rgba(2,132,199,0.8)] animate-pulse"></span>
          </button> */}

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 shadow-sm hover:shadow-[0_0_15px_rgba(0,174,230,0.2)] hover:border-primary/40 transition-all duration-300 focus:outline-none group">
              
              {displayImage ? (
                <img 
                  src={displayImage} 
                  alt={adminName} 
                  className="h-9 w-9 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform border border-white/10"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform border border-white/10">
                  <UserCircle size={22} />
                </div>
              )}
              
              <div className="hidden text-left md:block">
                <p className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors">{adminName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{adminDesignation}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors ml-1" />
            </MenuButton>

            <MenuItems transition anchor="bottom end" className="w-56 mt-2 bg-on-primary-fixed/95 backdrop-blur-2xl rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-white/10 focus:outline-none z-[100] transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 data-[closed]:translate-y-2 overflow-hidden p-2">
              <div className="px-3 py-2 mb-2 border-b border-white/10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
              </div>
              <div className="space-y-1">
                <MenuItem as="button" onClick={() => setIsAccountModalOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors text-slate-300 data-[focus]:bg-primary/20 data-[focus]:text-white group">
                  <UserCircle size={16} className="text-slate-400 group-data-[focus]:text-white" /> My Profile
                </MenuItem>
                <MenuItem as="button" onClick={() => setIsChangePasswordOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors text-slate-300 data-[focus]:bg-primary/20 data-[focus]:text-white group">
                  <KeyRound size={16} className="text-slate-400 group-data-[focus]:text-white" /> Change Password
                </MenuItem>
                <MenuItem as="button" onClick={() => setIsActiveDevicesOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors text-slate-300 data-[focus]:bg-primary/20 data-[focus]:text-white group">
                  <Monitor size={16} className="text-slate-400 group-data-[focus]:text-white" /> Active Devices
                </MenuItem>
                <div className="h-px bg-white/10 my-2"></div>
                <MenuItem as="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors text-slate-300 hover:text-red-400 data-[focus]:bg-red-500/20 data-[focus]:text-red-400 group">
                  <LogOut size={16} className="text-slate-400 group-data-[focus]:text-red-400" /> Secure Logout
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>

      <MyAccountModal isOpen={isAccountModalOpen} onProfileUpdate={(newPic) => { if (newPic) setProfilePic(newPic); }} setIsOpen={setIsAccountModalOpen} />
      <ActiveDevicesModal isOpen={isActiveDevicesOpen} setIsOpen={setIsActiveDevicesOpen} />
      <ChangePasswordModal isOpen={isChangePasswordOpen} setIsOpen={setIsChangePasswordOpen} />
    </>
  );
}