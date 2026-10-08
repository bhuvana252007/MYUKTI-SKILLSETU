import React, { useState, useRef } from 'react';
import { 
  PageView, 
  SupportedLanguage, 
  CommunityProfile, 
  CommunityType, 
  RepresentativeRole, 
  MemberType, 
  CommunityMember 
} from '../types';
import { 
  saveCommunity, 
  generateSampleCsvContent, 
  parseCsvMembers,
  DEFAULT_COMMUNITY_MEMBERS,
  generateInvitationCode
} from '../utils/communityStorage';
import { 
  Building2, 
  UserCheck, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Share2, 
  Sparkles, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface CommunityWizardProps {
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  onCommunitySubmitted: (profile: CommunityProfile) => void;
}

const COMMUNITY_TYPES: CommunityType[] = [
  'Self Help Group',
  "Women's Collective",
  'Village Community',
  'Producer Group',
  'Cooperative',
  'Other'
];

const REPRESENTATIVE_ROLES: RepresentativeRole[] = [
  'SHG Leader',
  'Coordinator',
  'President',
  'Secretary',
  'Authorized Representative',
  'Other'
];

const MEMBER_TYPES: MemberType[] = [
  'SHG Member',
  'Artisan',
  'Service Provider',
  'Producer',
  'Other'
];

export const CommunityWizard: React.FC<CommunityWizardProps> = ({
  language,
  onNavigate,
  onCommunitySubmitted,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State: Community Info
  const [name, setName] = useState('');
  const [type, setType] = useState<CommunityType>('Self Help Group');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Step 2 State: Representative
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [repRole, setRepRole] = useState<RepresentativeRole>('SHG Leader');
  const [yearsInvolved, setYearsInvolved] = useState('3');

  // Step 3 State: Members list
  const [members, setMembers] = useState<Partial<CommunityMember>[]>(() => {
    // Start with 24 default members ready to register
    return DEFAULT_COMMUNITY_MEMBERS.map(m => ({ ...m }));
  });

  // Single member add form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberMobile, setNewMemberMobile] = useState('');
  const [newMemberVillage, setNewMemberVillage] = useState('');
  const [newMemberType, setNewMemberType] = useState<MemberType>('SHG Member');
  const [newMemberSkills, setNewMemberSkills] = useState('');
  const [newMemberExp, setNewMemberExp] = useState('');

  // Editing state for table rows
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // CSV feedback
  const [csvMessage, setCsvMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedProfile, setSubmittedProfile] = useState<CommunityProfile | null>(null);

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Community name is required';
    if (!village.trim()) errs.village = 'Village / Town is required';
    if (!district.trim()) errs.district = 'District is required';
    if (!state.trim()) errs.state = 'State is required';
    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'Please provide a descriptive overview (at least 10 characters)';
    }
    const cleanPhone = contactNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.contactNumber = 'Enter a valid 10-digit contact number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!repName.trim()) errs.repName = 'Representative name is required';
    const cleanPhone = repPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.repPhone = 'Enter a valid 10-digit mobile number';
    }
    const yearsNum = parseInt(yearsInvolved, 10);
    if (isNaN(yearsNum) || yearsNum < 0) {
      errs.yearsInvolved = 'Please enter valid years of involvement';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step navigation handlers
  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextToStep4 = () => {
    if (members.length === 0) {
      alert('Please add at least one member to the community before proceeding.');
      return;
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add individual member form submit
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      alert('Member name is required');
      return;
    }

    const newMem: Partial<CommunityMember> = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: newMemberName.trim(),
      mobile: newMemberMobile.replace(/[^0-9]/g, ''),
      village: newMemberVillage.trim() || village || 'Local Village',
      memberType: newMemberType,
      skills: newMemberSkills.trim() || 'General Crafts',
      experience: newMemberExp.trim() || '1 year',
      status: 'Pending',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      transactionCount: 0,
      rating: 5.0
    };

    setMembers([newMem, ...members]);
    // Reset form
    setNewMemberName('');
    setNewMemberMobile('');
    setNewMemberVillage('');
    setNewMemberSkills('');
    setNewMemberExp('');
  };

  // CSV Sample Download
  const handleDownloadSampleCsv = () => {
    const csvContent = generateSampleCsvContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'skillsetu_sample_community_members.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // CSV Upload handler
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const parsed = parseCsvMembers(text);
      if (parsed.success && parsed.members.length > 0) {
        setMembers((prev) => [...parsed.members, ...prev]);
        setCsvMessage({
          text: `Successfully imported ${parsed.members.length} members from CSV!`,
          isError: false,
        });
      } else {
        setCsvMessage({
          text: `CSV import failed: ${parsed.errors.join('; ') || 'Invalid format'}`,
          isError: true,
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove member row
  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  // Final Submission
  const handleSubmitCommunity = () => {
    const commId = `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const finalMembers: CommunityMember[] = members.map((m, idx) => {
      const invCode = generateInvitationCode(name || 'SETU', idx);
      const cleanPhone = (m.mobile || '').replace(/[^0-9]/g, '');
      const inviteMsg = encodeURIComponent(
        `You have been invited to join ${name} on SkillSetu. Join here with your unique invite code: ${invCode} - https://skillsetu.app/join/${invCode}`
      );
      const inviteLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${inviteMsg}` : `https://wa.me/?text=${inviteMsg}`;

      return {
        id: m.id || `mem-${idx + 1}`,
        name: m.name || `Member ${idx + 1}`,
        mobile: m.mobile || '',
        village: m.village || village || 'Local Village',
        memberType: m.memberType || 'SHG Member',
        skills: m.skills || 'Artisan Crafts',
        experience: m.experience || '2 years',
        status: 'Pending', // As specified: "give each member status 'Pending'"
        invitationCode: invCode,
        invitationLink: inviteLink,
        joinedDate: m.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        transactionCount: m.transactionCount || 0,
        rating: m.rating || 5.0,
      };
    });

    const profile: CommunityProfile = {
      id: commId,
      name: name.trim() || 'Sahyadri Mahila Vikas Sangha',
      type,
      village: village.trim(),
      district: district.trim(),
      state: state.trim(),
      description: description.trim(),
      contactNumber: contactNumber.replace(/[^0-9]/g, ''),
      representative: {
        name: repName.trim(),
        phone: repPhone.replace(/[^0-9]/g, ''),
        role: repRole,
        yearsInvolved: parseInt(yearsInvolved, 10) || 1,
      },
      members: finalMembers,
      createdAt: Date.now(),
    };

    saveCommunity(profile);
    setSubmittedProfile(profile);
    setIsSubmitted(true);
    onCommunitySubmitted(profile);
  };

  // SUCCESS MODAL / SCREEN
  if (isSubmitted && submittedProfile) {
    const whatsappInviteMessage = `You have been invited to join ${submittedProfile.name} on SkillSetu.`;
    const generalWhatsAppUrl = `https://wa.me/?text=${encodeURIComponent(
      `You have been invited to join ${submittedProfile.name} on SkillSetu. Register your skills and reach verified local buyers!`
    )}`;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#1E4D38] p-6 sm:p-10 shadow-xl text-center">
          <div className="w-18 h-18 rounded-3xl bg-[#EEF6F2] border-2 border-[#C7E4D3] text-[#1E4D38] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-[#1E4D38] text-white text-xs font-bold uppercase tracking-wider mb-2">
            Registration Complete
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold font-heritage text-[#1E4D38] mb-3">
            {submittedProfile.name} is now Registered!
          </h1>

          <p className="text-sm sm:text-base text-[#6B5749] max-w-xl mx-auto mb-6">
            All <strong>{submittedProfile.members.length} members</strong> have been given status 
            <span className="inline-block mx-1.5 px-2.5 py-0.5 rounded-full bg-[#FDF5EA] text-[#D9822B] border border-[#E8C888] font-bold text-xs">
              Pending
            </span> 
            with unique invitation codes and shareable WhatsApp invitation links.
          </p>

          {/* Invitation Message Card */}
          <div className="p-5 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] text-left mb-6 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E4D38] block mb-1">
              Member Invitation Template:
            </span>
            <p className="text-sm font-semibold text-[#1E4D38] italic">
              "{whatsappInviteMessage}"
            </p>
          </div>

          {/* Share with Members Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Invitation Link on WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigate('community-dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#1E4D38] hover:bg-[#163829] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Open Community Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Sample invitation codes snippet */}
          <div className="text-left border-t border-[#EADBCE] pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-3">
              Generated Member Invitation Codes (Preview):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {submittedProfile.members.slice(0, 6).map((m) => (
                <div key={m.id} className="p-2.5 rounded-xl bg-[#FAF5EB] border border-[#EADBCE] flex items-center justify-between">
                  <span className="font-semibold text-[#3D2B1F]">{m.name}</span>
                  <span className="font-mono font-bold text-[#C2542D] bg-[#FBEEE8] px-2 py-0.5 rounded">
                    {m.invitationCode}
                  </span>
                </div>
              ))}
            </div>
            {submittedProfile.members.length > 6 && (
              <p className="text-xs text-[#7A6455] text-center mt-3">
                + {submittedProfile.members.length - 6} more member invitation codes available in the Community Dashboard.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28">
      {/* Top Wizard Header */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('role-select')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6B5749] hover:text-[#3D2B1F] mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </button>
        <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-[#3D2B1F] tracking-tight">
          Community Registration
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5749]">
          Register your collective, self-help group, or artisan cluster on SkillSetu
        </p>
      </div>

      {/* 4-STEP PROGRESS BAR */}
      <div className="mb-8 p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2542D]">
            Step {currentStep} of 4
          </span>
          <span className="text-xs font-semibold text-[#6B5749]">
            {currentStep === 1 && '1. Community Info'}
            {currentStep === 2 && '2. Representative'}
            {currentStep === 3 && '3. Add Members'}
            {currentStep === 4 && '4. Review & Submit'}
          </span>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="w-full h-2.5 bg-[#EADBCE] rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-gradient-to-r from-[#C2542D] to-[#1E4D38] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Stepper icons */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-[#EADBCE]/50 text-center">
          {[
            { num: 1, label: 'Community', icon: Building2 },
            { num: 2, label: 'Representative', icon: UserCheck },
            { num: 3, label: 'Add Members', icon: Users },
            { num: 4, label: 'Review', icon: CheckCircle2 },
          ].map(({ num, label, icon: Icon }) => {
            const isDone = currentStep > num;
            const isCurrent = currentStep === num;
            return (
              <div 
                key={num} 
                className={`flex flex-col items-center gap-1 ${
                  isCurrent ? 'text-[#C2542D] font-bold' : isDone ? 'text-[#1E4D38] font-semibold' : 'text-[#8C7E74]'
                }`}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    isCurrent 
                      ? 'bg-[#FBEEE8] border-2 border-[#C2542D] text-[#C2542D]' 
                      : isDone 
                      ? 'bg-[#EEF6F2] border border-[#C7E4D3] text-[#1E4D38]' 
                      : 'bg-[#FAF5EB] border border-[#EADBCE] text-[#8C7E74]'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] sm:text-xs truncate">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: COMMUNITY INFO */}
      {currentStep === 1 && (
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 sm:p-10 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FBEEE8] text-[#C2542D] flex items-center justify-center border border-[#F3D2C4]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F]">
                1. Community Information
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5749]">
                Basic details about the group, location, and contact
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Community Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                Community Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sahyadri Mahila Vikas Sangha"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D] ${
                  errors.name ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Community Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                Community Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CommunityType)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
              >
                {COMMUNITY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Location row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                  Village / Town *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rampur"
                  value={village}
                  onChange={(e) => {
                    setVillage(e.target.value);
                    if (errors.village) setErrors({ ...errors, village: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D] ${
                    errors.village ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                  }`}
                />
                {errors.village && <p className="text-xs text-red-600 mt-1">{errors.village}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                  District *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dharwad"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (errors.district) setErrors({ ...errors, district: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D] ${
                    errors.district ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                  }`}
                />
                {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (errors.state) setErrors({ ...errors, state: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D] ${
                    errors.state ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                  }`}
                />
                {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                Community Description *
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe your collective, services offered by members, and background..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D] ${
                  errors.description ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                }`}
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                Official Contact Number *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-sm font-semibold text-[#8C7E74]">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43200"
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                  }}
                  className={`w-full pl-14 pr-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D] ${
                    errors.contactNumber ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                  }`}
                />
              </div>
              {errors.contactNumber && <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EADBCE] flex justify-end">
            <button
              id="wizard-step1-next"
              type="button"
              onClick={handleNextToStep2}
              className="px-6 py-3.5 rounded-2xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Next: Representative Info</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: REPRESENTATIVE */}
      {currentStep === 2 && (
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 sm:p-10 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6F2] text-[#1E4D38] flex items-center justify-center border border-[#C7E4D3]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F]">
                2. Representative Information
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5749]">
                Details of the SHG Leader, President, or authorized coordinator
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Representative Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                Representative Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Anusuya Deshmukh"
                value={repName}
                onChange={(e) => {
                  setRepName(e.target.value);
                  if (errors.repName) setErrors({ ...errors, repName: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#1E4D38] ${
                  errors.repName ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                }`}
              />
              {errors.repName && <p className="text-xs text-red-600 mt-1">{errors.repName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                Representative Phone Number *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-sm font-semibold text-[#8C7E74]">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43200"
                  value={repPhone}
                  onChange={(e) => {
                    setRepPhone(e.target.value);
                    if (errors.repPhone) setErrors({ ...errors, repPhone: '' });
                  }}
                  className={`w-full pl-14 pr-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#1E4D38] ${
                    errors.repPhone ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                  }`}
                />
              </div>
              {errors.repPhone && <p className="text-xs text-red-600 mt-1">{errors.repPhone}</p>}
            </div>

            {/* Role & Years */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                  Role in Community *
                </label>
                <select
                  value={repRole}
                  onChange={(e) => setRepRole(e.target.value as RepresentativeRole)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#1E4D38]"
                >
                  {REPRESENTATIVE_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5749] mb-1.5">
                  Years Involved *
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={yearsInvolved}
                  onChange={(e) => {
                    setYearsInvolved(e.target.value);
                    if (errors.yearsInvolved) setErrors({ ...errors, yearsInvolved: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-[#FAF5EB] border text-sm text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#1E4D38] ${
                    errors.yearsInvolved ? 'border-red-500 bg-red-50/30' : 'border-[#D8C7B4]'
                  }`}
                />
                {errors.yearsInvolved && <p className="text-xs text-red-600 mt-1">{errors.yearsInvolved}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EADBCE] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-3 rounded-2xl bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#5C4533] font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              id="wizard-step2-next"
              type="button"
              onClick={handleNextToStep3}
              className="px-6 py-3.5 rounded-2xl bg-[#1E4D38] hover:bg-[#163829] text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Next: Add Members (Step 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ADD MEMBERS (3 WAYS: Form, CSV Upload, Review Table) */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Way 1 & Way 2: Add member form & CSV upload side-by-side or stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WAY 1: "Add member" form */}
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#EADBCE]">
                <Plus className="w-5 h-5 text-[#C2542D]" />
                <h3 className="text-base font-bold font-heritage text-[#3D2B1F]">
                  1. "Add member" Form
                </h3>
              </div>

              <form onSubmit={handleAddMember} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                      Member Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Geeta Patil"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="98556 67788"
                      value={newMemberMobile}
                      onChange={(e) => setNewMemberMobile(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                      Village / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rampur"
                      value={newMemberVillage}
                      onChange={(e) => setNewMemberVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                      Member Type
                    </label>
                    <select
                      value={newMemberType}
                      onChange={(e) => setNewMemberType(e.target.value as MemberType)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                    >
                      {MEMBER_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                      Skills / Products
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jute Bags, Embroidery"
                      value={newMemberSkills}
                      onChange={(e) => setNewMemberSkills(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5749] mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 years"
                      value={newMemberExp}
                      onChange={(e) => setNewMemberExp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#D8C7B4] text-xs text-[#2A221E] focus:outline-none focus:ring-2 focus:ring-[#C2542D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member to List</span>
                </button>
              </form>
            </div>

            {/* WAY 2: "Add multiple members" (CSV Upload & Sample) */}
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#EADBCE]">
                  <Upload className="w-5 h-5 text-[#1E4D38]" />
                  <h3 className="text-base font-bold font-heritage text-[#3D2B1F]">
                    2. "Add multiple members": CSV Upload
                  </h3>
                </div>

                <p className="text-xs text-[#6B5749] leading-relaxed mb-4">
                  Upload a spreadsheet CSV with columns: <strong>Name, Mobile, Location, Member Type, Skills, Experience</strong>.
                </p>

                {/* Download Sample File */}
                <div className="p-4 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-[#1E4D38] shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-[#1E4D38]">
                        Download Sample Template
                      </span>
                      <span className="block text-[11px] text-[#4E6759]">
                        Pre-formatted with matching columns
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="px-3.5 py-2 rounded-xl bg-[#1E4D38] hover:bg-[#163829] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Sample CSV</span>
                  </button>
                </div>

                {/* CSV File Input */}
                <div className="border-2 border-dashed border-[#D8C7B4] rounded-2xl p-5 text-center hover:bg-[#FAF5EB] transition-colors relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-7 h-7 text-[#8C7E74] mx-auto mb-2" />
                  <span className="block text-xs font-bold text-[#3D2B1F]">
                    Click or Drag CSV here to Upload
                  </span>
                  <span className="block text-[11px] text-[#8C7E74] mt-0.5">
                    Supports .csv files
                  </span>
                </div>

                {/* Upload feedback */}
                {csvMessage && (
                  <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    csvMessage.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3]'
                  }`}>
                    {csvMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{csvMessage.text}</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-[#8C7E74] italic mt-4">
                Tip: You can upload multiple CSV files; members will be merged automatically.
              </div>
            </div>
          </div>

          {/* WAY 3: Review Table saying "24 members ready to register" */}
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EADBCE]">
              <div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-[#C2542D]" />
                  <h3 className="text-lg font-bold font-heritage text-[#3D2B1F]">
                    3. Review Table
                  </h3>
                </div>
                {/* As requested: Review table saying "24 members ready to register" */}
                <p className="text-sm font-bold text-[#C2542D] mt-1">
                  {members.length} members ready to register
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMembers(DEFAULT_COMMUNITY_MEMBERS.map(m => ({ ...m })))}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#5C4533] text-xs font-semibold border border-[#EADBCE] cursor-pointer"
                >
                  Reset to 24 Preset Members
                </button>
                <button
                  type="button"
                  onClick={() => setMembers([])}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold border border-red-200 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-2xl border border-[#EADBCE]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EB] text-[#6B5749] font-bold uppercase tracking-wider sticky top-0 border-b border-[#EADBCE] z-10">
                  <tr>
                    <th className="py-3 px-3.5">#</th>
                    <th className="py-3 px-3.5">Name</th>
                    <th className="py-3 px-3.5">Mobile</th>
                    <th className="py-3 px-3.5">Location</th>
                    <th className="py-3 px-3.5">Member Type</th>
                    <th className="py-3 px-3.5">Skills / Products</th>
                    <th className="py-3 px-3.5">Experience</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADBCE]/70">
                  {members.map((mem, index) => {
                    const isEditing = editingIndex === index;
                    return (
                      <tr key={mem.id || index} className="hover:bg-[#FAF5EB]/50 transition-colors">
                        <td className="py-2.5 px-3.5 text-[#8C7E74] font-medium">{index + 1}</td>
                        <td className="py-2.5 px-3.5 font-bold text-[#3D2B1F]">
                          {isEditing ? (
                            <input
                              type="text"
                              value={mem.name || ''}
                              onChange={(e) => {
                                const copy = [...members];
                                copy[index].name = e.target.value;
                                setMembers(copy);
                              }}
                              className="px-2 py-1 rounded bg-white border border-[#D8C7B4] text-xs w-full"
                            />
                          ) : (
                            mem.name
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#5C4533]">
                          {isEditing ? (
                            <input
                              type="text"
                              value={mem.mobile || ''}
                              onChange={(e) => {
                                const copy = [...members];
                                copy[index].mobile = e.target.value;
                                setMembers(copy);
                              }}
                              className="px-2 py-1 rounded bg-white border border-[#D8C7B4] text-xs w-28"
                            />
                          ) : (
                            mem.mobile || '—'
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#5C4533]">
                          {isEditing ? (
                            <input
                              type="text"
                              value={mem.village || ''}
                              onChange={(e) => {
                                const copy = [...members];
                                copy[index].village = e.target.value;
                                setMembers(copy);
                              }}
                              className="px-2 py-1 rounded bg-white border border-[#D8C7B4] text-xs w-24"
                            />
                          ) : (
                            mem.village
                          )}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] font-semibold text-[10px]">
                            {mem.memberType || 'SHG Member'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-[#5C4533] max-w-xs truncate">
                          {isEditing ? (
                            <input
                              type="text"
                              value={mem.skills || ''}
                              onChange={(e) => {
                                const copy = [...members];
                                copy[index].skills = e.target.value;
                                setMembers(copy);
                              }}
                              className="px-2 py-1 rounded bg-white border border-[#D8C7B4] text-xs w-full"
                            />
                          ) : (
                            mem.skills
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#7A6455]">
                          {mem.experience}
                        </td>
                        <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() => setEditingIndex(null)}
                              className="text-xs font-bold text-[#1E4D38] hover:underline mr-2 cursor-pointer"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setEditingIndex(index)}
                              className="p-1 text-[#6B5749] hover:text-[#3D2B1F] rounded mr-1 cursor-pointer"
                              title="Edit Row"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(index)}
                            className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Step navigation bottom bar */}
            <div className="mt-6 pt-6 border-t border-[#EADBCE] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 rounded-2xl bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#5C4533] font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                id="wizard-step3-next"
                type="button"
                onClick={handleNextToStep4}
                className="px-6 py-3.5 rounded-2xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Proceed to Review & Submit ({members.length} members)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-6 sm:p-10 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6F2] text-[#1E4D38] flex items-center justify-center border border-[#C7E4D3]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F]">
                4. Review and Submit
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5749]">
                Review all registered community details before generating member invitations
              </p>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Community card */}
            <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2542D] block mb-1">
                Community Info
              </span>
              <h3 className="text-lg font-bold font-heritage text-[#3D2B1F] mb-1">
                {name || 'Sahyadri Mahila Vikas Sangha'}
              </h3>
              <p className="text-xs font-semibold text-[#1E4D38] mb-2">{type}</p>
              <p className="text-xs text-[#5C4533] leading-relaxed mb-3">
                {description || 'Community of skilled rural women offering local verified services.'}
              </p>
              <div className="text-xs text-[#6B5749] space-y-1">
                <p>📍 {village || 'Rampur'}, {district || 'Dharwad'}, {state || 'Karnataka'}</p>
                <p>📞 +91 {contactNumber || '9876543200'}</p>
              </div>
            </div>

            {/* Representative card */}
            <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4D38] block mb-1">
                Authorized Representative
              </span>
              <h3 className="text-lg font-bold font-heritage text-[#3D2B1F] mb-1">
                {repName || 'Anusuya Deshmukh'}
              </h3>
              <p className="text-xs font-semibold text-[#1E4D38] mb-2">{repRole} ({yearsInvolved} years involved)</p>
              <div className="text-xs text-[#6B5749] space-y-1">
                <p>📞 +91 {repPhone || '9876543200'}</p>
                <p>🛡️ Community Administrator & Member Onboarding Lead</p>
              </div>
            </div>
          </div>

          {/* Members Count Notice */}
          <div className="p-4 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] mb-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#1E4D38]" />
              <div>
                <span className="text-sm font-bold text-[#1E4D38]">
                  {members.length} Members Enrolled for Registration
                </span>
                <span className="block text-xs text-[#4E6759]">
                  Each will receive status "Pending" and a unique invitation code.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs font-bold text-[#1E4D38] hover:underline cursor-pointer"
            >
              Edit Members →
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[#EADBCE] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-3 rounded-2xl bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#5C4533] font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              id="submit-community-btn"
              type="button"
              onClick={handleSubmitCommunity}
              className="px-8 py-4 rounded-2xl bg-[#1E4D38] hover:bg-[#163829] text-white font-bold text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-5 h-5 text-[#DDA74F]" />
              <span>Submit & Open Community Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
