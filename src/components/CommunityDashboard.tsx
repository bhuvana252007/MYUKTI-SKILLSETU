import React, { useState } from 'react';
import { 
  PageView, 
  SupportedLanguage, 
  CommunityProfile, 
  CommunityMember, 
  MemberVerificationStatus,
  MemberType
} from '../types';
import { 
  getStoredCommunity, 
  saveCommunity, 
  updateCommunityMember, 
  addCommunityMember, 
  deleteCommunityMember,
  getStoredTransactions,
  generateInvitationCode
} from '../utils/communityStorage';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  IndianRupee, 
  ArrowLeft, 
  Plus, 
  Share2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Edit3, 
  UserX, 
  ArrowUpRight, 
  Check, 
  X, 
  AlertCircle,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface CommunityDashboardProps {
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  onSelectProviderListing?: (listingId: string) => void;
}

const VERIFICATION_STATES: MemberVerificationStatus[] = [
  'Pending',
  'Community Verified',
  'Reference Verified',
  'Fully Verified',
  'Suspended'
];

export const CommunityDashboard: React.FC<CommunityDashboardProps> = ({
  language,
  onNavigate,
}) => {
  const [community, setCommunity] = useState<CommunityProfile>(() => getStoredCommunity());
  const transactions = getStoredTransactions();

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommunityMember | null>(null);

  // Add Member form state
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newType, setNewType] = useState<MemberType>('SHG Member');
  const [newSkills, setNewSkills] = useState('');
  const [newExperience, setNewExperience] = useState('2 years');

  // Metrics computation
  const totalMembers = community.members.length;
  const activeProviders = community.members.filter(
    (m) => m.status !== 'Suspended' && m.status !== 'Pending'
  ).length;
  const pendingMembers = community.members.filter((m) => m.status === 'Pending').length;

  const totalTransactionsCount = transactions.length;
  const totalTransactionValue = transactions.reduce((acc, t) => acc + (t.status !== 'Cancelled' && t.status !== 'Refunded' ? t.amount : 0), 0);

  // Status Badge Helper: strictly based on stored member status
  const renderVerificationBadge = (status: MemberVerificationStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'Community Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]">
            <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
            <span>Community Verified</span>
          </span>
        );
      case 'Reference Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]">
            <Check className="w-3 h-3 text-[#9333EA]" />
            <span>Reference Verified</span>
          </span>
        );
      case 'Fully Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]">
            <ShieldCheck className="w-3 h-3 text-[#059669]" />
            <span>Fully Verified</span>
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]">
            <UserX className="w-3 h-3 text-[#E11D48]" />
            <span>Suspended</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Change status of a member
  const handleStatusChange = (memberId: string, newStatus: MemberVerificationStatus) => {
    const updated = updateCommunityMember(memberId, { status: newStatus });
    setCommunity(updated);
  };

  // Suspend or Unsuspend toggle
  const handleToggleSuspend = (member: CommunityMember) => {
    const newStatus: MemberVerificationStatus = member.status === 'Suspended' ? 'Pending' : 'Suspended';
    const updated = updateCommunityMember(member.id, { status: newStatus });
    setCommunity(updated);
  };

  // WhatsApp share individual member invitation
  const handleInviteMember = (member: CommunityMember) => {
    const cleanPhone = (member.mobile || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `You have been invited to join ${community.name} on SkillSetu. Your invitation code is: ${member.invitationCode}. Link: https://skillsetu.app/join/${member.invitationCode}`
    );
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${message}` : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  // Add new member submit
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addCommunityMember({
      name: newName.trim(),
      mobile: newMobile.replace(/[^0-9]/g, ''),
      village: newVillage.trim() || community.village,
      memberType: newType,
      skills: newSkills.trim() || 'General Crafts',
      experience: newExperience.trim() || '1 year',
    });

    const refreshed = getStoredCommunity();
    setCommunity(refreshed);
    setIsAddModalOpen(false);

    // Reset
    setNewName('');
    setNewMobile('');
    setNewVillage('');
    setNewSkills('');
    setNewExperience('2 years');
  };

  // Save edited member
  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const updated = updateCommunityMember(editingMember.id, {
      name: editingMember.name,
      mobile: editingMember.mobile,
      village: editingMember.village,
      skills: editingMember.skills,
      experience: editingMember.experience,
      memberType: editingMember.memberType,
    });
    setCommunity(updated);
    setEditingMember(null);
  };

  // Filtered members list
  const filteredMembers = community.members.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => onNavigate('role-select')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6B5749] hover:text-[#3D2B1F] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Role Selection</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-[#3D2B1F]">
                  {community.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FBEEE8] text-[#C2542D] border border-[#F3D2C4] font-semibold text-xs">
                  {community.type}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B5749] flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C2542D]" />
                <span>{community.village}, {community.district}, {community.state}</span>
                <span>•</span>
                <span>Admin: {community.representative.name} ({community.representative.role})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="dash-add-member-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>

          <button
            id="dash-view-transactions-btn"
            onClick={() => onNavigate('community-transactions')}
            className="px-4 py-2.5 rounded-xl bg-[#1E4D38] hover:bg-[#163829] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Community Transactions ({totalTransactionsCount})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
        {/* Card 1: Total Members */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B5749] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-[#C2542D]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F]">
            {totalMembers}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-1">
            Enrolled artisans & providers
          </span>
        </div>

        {/* Card 2: Active Providers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B5749] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Providers</span>
            <UserCheck className="w-4 h-4 text-[#1E4D38]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1E4D38]">
            {activeProviders}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-1">
            Verified & offering services
          </span>
        </div>

        {/* Card 3: Pending Members */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B5749] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Members</span>
            <Clock className="w-4 h-4 text-[#D9822B]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#D9822B]">
            {pendingMembers}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-1">
            Awaiting verification
          </span>
        </div>

        {/* Card 4: Total Transactions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B5749] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <TrendingUp className="w-4 h-4 text-[#1E4D38]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F]">
            {totalTransactionsCount}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-1">
            Orders processed
          </span>
        </div>

        {/* Card 5: Total Transaction Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#6B5749] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Value</span>
            <IndianRupee className="w-4 h-4 text-[#C2542D]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#C2542D]">
            ₹{totalTransactionValue.toLocaleString('en-IN')}
          </span>
          <span className="block text-[11px] text-[#8C7E74] mt-1">
            Community income earned
          </span>
        </div>
      </div>

      {/* TRUST NOTICE (As required: "Do not claim government verification") */}
      <div className="mb-6 p-3.5 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] text-xs text-[#1E4D38] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#1E4D38]" />
          <span>
            <strong>Community-Driven Verification:</strong> Badges reflect peer endorsement, customer reviews, and leader verification. No government agency affiliation is claimed.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#4E6759]">
          100% Peer Transparency
        </span>
      </div>

      {/* MEMBERS TABLE SECTION */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] overflow-hidden shadow-sm">
        {/* Table Filters & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-[#EADBCE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C7E74] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search member by name, skill, or village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs sm:text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8C7E74]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs font-semibold text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
            >
              <option value="All">All Verification Statuses</option>
              {VERIFICATION_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF5EB] text-[#6B5749] font-bold uppercase tracking-wider border-b border-[#EADBCE]">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Services / Products</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-center">Transactions</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBCE]/70">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#FAF5EB]/50 transition-colors">
                  {/* Name + Details */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#3D2B1F] text-sm sm:text-base">
                      {member.name}
                    </div>
                    <div className="text-xs text-[#7A6455] flex items-center gap-2 mt-0.5">
                      <span>📍 {member.village}</span>
                      <span>•</span>
                      <span>📞 +91 {member.mobile || '—'}</span>
                    </div>
                    <div className="text-[10px] text-[#8C7E74] font-mono mt-0.5">
                      Code: {member.invitationCode}
                    </div>
                  </td>

                  {/* Services / Skills */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-[#3D2B1F]">
                      {member.skills}
                    </div>
                    <div className="text-xs text-[#7A6455] mt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] text-[10px] font-bold mr-1.5">
                        {member.memberType}
                      </span>
                      <span>{member.experience}</span>
                    </div>
                  </td>

                  {/* Verification Status (Badge + Admin Dropdown) */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1.5">
                      {/* Badge shown ONLY when that status is stored on member record */}
                      <div>
                        {renderVerificationBadge(member.status)}
                      </div>

                      {/* Dropdown for admin to update status */}
                      <select
                        value={member.status}
                        onChange={(e) => handleStatusChange(member.id, e.target.value as MemberVerificationStatus)}
                        className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-white border border-[#D8C7B4] text-[#3D2B1F] focus:outline-none focus:ring-1 focus:ring-[#C2542D] cursor-pointer"
                        title="Change Member Verification Status"
                      >
                        {VERIFICATION_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Transaction Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-extrabold text-[#3D2B1F] text-sm">
                      {member.transactionCount}
                    </span>
                    <span className="block text-[10px] text-[#8C7E74]">
                      completed
                    </span>
                  </td>

                  {/* Actions (Invite, Edit, Suspend) */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* WhatsApp Invite */}
                      <button
                        type="button"
                        onClick={() => handleInviteMember(member)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Send WhatsApp Invitation Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Invite</span>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#5C4533] transition-colors cursor-pointer"
                        title="Edit Member Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Suspend / Resume */}
                      <button
                        type="button"
                        onClick={() => handleToggleSuspend(member)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          member.status === 'Suspended'
                            ? 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#A7F3D0]'
                            : 'bg-[#FFE4E6] text-[#9F1239] hover:bg-[#FECDD3]'
                        }`}
                        title={member.status === 'Suspended' ? 'Unsuspend Member' : 'Suspend Member'}
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-8 text-center text-[#6B5749]">
            <p className="text-sm font-semibold">No members found matching your search.</p>
          </div>
        )}
      </div>

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] mb-4">
              <h3 className="text-lg font-bold font-heritage text-[#3D2B1F]">
                Add Community Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#8C7E74] hover:text-[#3D2B1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Basamma Pujar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="98878 89900"
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                    Village
                  </label>
                  <input
                    type="text"
                    placeholder="Village"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                    Member Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MemberType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                  >
                    <option value="SHG Member">SHG Member</option>
                    <option value="Artisan">Artisan</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Producer">Producer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Skills / Products
                </label>
                <input
                  type="text"
                  placeholder="e.g. Masalas, Chutney powders"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 years"
                  value={newExperience}
                  onChange={(e) => setNewExperience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                />
              </div>

              <div className="pt-3 border-t border-[#EADBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5EB] text-[#6B5749] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C2542D] text-white font-bold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] mb-4">
              <h3 className="text-lg font-bold font-heritage text-[#3D2B1F]">
                Edit Member: {editingMember.name}
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 rounded-lg text-[#8C7E74] hover:text-[#3D2B1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={editingMember.mobile}
                  onChange={(e) => setEditingMember({ ...editingMember, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Village
                </label>
                <input
                  type="text"
                  value={editingMember.village}
                  onChange={(e) => setEditingMember({ ...editingMember, village: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                  Skills / Products
                </label>
                <input
                  type="text"
                  value={editingMember.skills}
                  onChange={(e) => setEditingMember({ ...editingMember, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E]"
                />
              </div>

              <div className="pt-3 border-t border-[#EADBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5EB] text-[#6B5749] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1E4D38] text-white font-bold"
                >
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
