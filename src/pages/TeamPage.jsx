import { useState, useEffect } from 'react';
import { fetchClient } from '@/api/fetchClient';
import toast from 'react-hot-toast';
import useDocumentMeta from '@/hooks/useDocumentMeta';
import { Loader2, UserPlus, Edit3, Trash2, Shield, User, Star, MonitorSmartphone } from 'lucide-react';

import AddStaffModal from '@/components/team/AddStaffModal';
import StaffSessionsModal from '@/components/team/StaffSessionsModal';

export default function TeamPage() {
  //Title & Description for SEO (and nice browser tab titles!)
  useDocumentMeta("Staff & Roles | Clezo Express Laundry", "Manage system access, passwords, and permissions for your team members in one secure location.");
  
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const response = await fetchClient('/admins?all=true');
      setTeam(response.data.staff);
    } catch (error) {
      toast.error('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenNew = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleViewSessions = (staff) => {
    setSelectedStaff(staff);
    setIsSessionsModalOpen(true);
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await fetchClient(`/admins/${staffId}`, { method: 'DELETE' });
      toast.success('Staff member permanently removed');
      loadTeam();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  // UI Helpers for Roles
  const roleStyles = {
    'SUPER_ADMIN': { color: 'bg-purple-100 text-purple-700', icon: Star, label: 'Super Admin' },
    'ADMIN': { color: 'bg-secondary/20 text-blue-700', icon: Shield, label: 'Manager' },
    'SALES_AGENT': { color: 'bg-orange-100 text-orange-700', icon: User, label: 'Sales Agent' }
  };

  return (
    <div className="max-w-400 mx-auto space-y-8 relative z-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Staff & Roles</h1>
          <p className="text-slate-400 font-medium mt-1">Manage system access, passwords, and permissions.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-fixed-variant text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_5px_15px_rgba(0,174,230,0.3)] hover:-translate-y-0.5"
        >
          <UserPlus size={18} strokeWidth={3} /> Add New Employee
        </button>
      </div>

      <div className="bg-on-primary-fixed/60 backdrop-blur-3xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden relative group z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[80px] pointer-events-none -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
        {isLoading ? (
          <div className="flex justify-center py-20 relative z-10"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {team.map((member) => {
                  const RoleIcon = roleStyles[member.role]?.icon || User;
                  
                  // Map role styles for dark mode manually if using roleStyles dictionary:
                  let roleBadgeClass = 'bg-primary/20 text-primary border border-primary/30';
                  if (member.role === 'SUPER_ADMIN') roleBadgeClass = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
                  if (member.role === 'SALES_AGENT') roleBadgeClass = 'bg-orange-500/20 text-orange-300 border border-orange-500/30';

                  return (
                    <tr key={member.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-white drop-shadow-sm">{member.name}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">@{member.username}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${roleBadgeClass}`}>
                          <RoleIcon size={12} strokeWidth={3} /> {roleStyles[member.role]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">
                        <p>{member.phone}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${member.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                          {member.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleViewSessions(member)} className="text-slate-400 hover:text-primary transition-colors" title="View Active Devices">
                            <MonitorSmartphone size={18} />
                          </button>
                          <button onClick={() => handleEdit(member)} className="text-primary hover:text-white transition-colors" title="Edit Profile">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(member.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete User">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddStaffModal 
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        staffData={selectedStaff}
        onSuccess={loadTeam}
      />

      <StaffSessionsModal
        isOpen={isSessionsModalOpen}
        setIsOpen={setIsSessionsModalOpen}
        targetStaff={selectedStaff}
      />
    </div>
  );
}