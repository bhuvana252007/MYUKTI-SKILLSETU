import { 
  CommunityProfile, 
  CommunityMember, 
  CommunityTransaction, 
  MockUser, 
  MemberVerificationStatus,
  TransactionStatus
} from '../types';

export const USER_AUTH_KEY = 'skillsetu_mock_user_v1';
export const COMMUNITY_STORAGE_KEY = 'skillsetu_community_profile_v1';
export const TRANSACTIONS_STORAGE_KEY = 'skillsetu_community_transactions_v1';

// Initial Demo Community: Sahyadri Mahila Vikas Sangha
export const DEFAULT_COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: 'mem-1',
    name: 'Sunita Devi',
    mobile: '9876543210',
    village: 'Rampur',
    memberType: 'SHG Member',
    skills: 'Designer Blouses, Salwar Suits, Festive Stitching',
    experience: '8 years',
    status: 'Fully Verified',
    invitationCode: 'SETU-RAM-001',
    joinedDate: 'Oct 2023',
    transactionCount: 48,
    rating: 4.9,
    listingId: 'seller-1'
  },
  {
    id: 'mem-2',
    name: 'Parvati Bai',
    mobile: '9823456789',
    village: 'Anand Nagar',
    memberType: 'Artisan',
    skills: 'Homemade Tiffin, Sweets & Snacks, Pickles',
    experience: '12 years',
    status: 'Fully Verified',
    invitationCode: 'SETU-RAM-002',
    joinedDate: 'Nov 2023',
    transactionCount: 62,
    rating: 4.8,
    listingId: 'seller-2'
  },
  {
    id: 'mem-3',
    name: 'Shabana Khatun',
    mobile: '9712345678',
    village: 'Purani Basti',
    memberType: 'Artisan',
    skills: 'Bridal Mehendi, Arabic Floral Patterns',
    experience: '6 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-003',
    joinedDate: 'Jan 2024',
    transactionCount: 29,
    rating: 5.0,
    listingId: 'seller-3'
  },
  {
    id: 'mem-4',
    name: 'Meena Sharma',
    mobile: '9845012345',
    village: 'Vikas Nagar',
    memberType: 'Service Provider',
    skills: 'Primary Math, Science & English Tutoring',
    experience: '5 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-004',
    joinedDate: 'Feb 2024',
    transactionCount: 34,
    rating: 4.9,
    listingId: 'seller-4'
  },
  {
    id: 'mem-5',
    name: 'Rekha Verma',
    mobile: '9911223344',
    village: 'Shivaji Ward',
    memberType: 'SHG Member',
    skills: 'Festival Catering, Pure Ghee Ladoos, Mathri',
    experience: '9 years',
    status: 'Fully Verified',
    invitationCode: 'SETU-RAM-005',
    joinedDate: 'Dec 2023',
    transactionCount: 51,
    rating: 4.7,
    listingId: 'seller-6'
  },
  {
    id: 'mem-6',
    name: 'Kamala Ben',
    mobile: '9722334455',
    village: 'Gandhi Chowk',
    memberType: 'Artisan',
    skills: 'Zari Embroidery, Fall Piko, Saree Borders',
    experience: '14 years',
    status: 'Reference Verified',
    invitationCode: 'SETU-RAM-006',
    joinedDate: 'Mar 2024',
    transactionCount: 22,
    rating: 4.8,
    listingId: 'seller-5'
  },
  {
    id: 'mem-7',
    name: 'Lakshmi Rao',
    mobile: '9833445566',
    village: 'Navalgund',
    memberType: 'Producer',
    skills: 'Organic Turmeric, Desi Ghee & Spices',
    experience: '7 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-007',
    joinedDate: 'Apr 2024',
    transactionCount: 19,
    rating: 4.9
  },
  {
    id: 'mem-8',
    name: 'Anandi Bai',
    mobile: '9644556677',
    village: 'Hosur',
    memberType: 'Artisan',
    skills: 'Handloom Cotton Towels & Dhurries',
    experience: '11 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-008',
    joinedDate: 'May 2024',
    transactionCount: 16,
    rating: 4.6
  },
  {
    id: 'mem-9',
    name: 'Geeta Patil',
    mobile: '9855667788',
    village: 'Rampur',
    memberType: 'SHG Member',
    skills: 'Handmade Jute Bags & Canvas Pouches',
    experience: '4 years',
    status: 'Pending',
    invitationCode: 'SETU-RAM-009',
    joinedDate: 'Jul 2024',
    transactionCount: 7,
    rating: 4.5
  },
  {
    id: 'mem-10',
    name: 'Fatima Bi',
    mobile: '9766778899',
    village: 'Purani Basti',
    memberType: 'Artisan',
    skills: 'Crochet Lace & Baby Woolen Sets',
    experience: '8 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-010',
    joinedDate: 'Jun 2024',
    transactionCount: 18,
    rating: 4.8
  },
  {
    id: 'mem-11',
    name: 'Radha Devi',
    mobile: '9877889900',
    village: 'Sompura',
    memberType: 'Producer',
    skills: 'Fresh Cow Milk Paneer & Curd',
    experience: '6 years',
    status: 'Reference Verified',
    invitationCode: 'SETU-RAM-011',
    joinedDate: 'Aug 2024',
    transactionCount: 25,
    rating: 4.9
  },
  {
    id: 'mem-12',
    name: 'Usha Kumari',
    mobile: '9688990011',
    village: 'Anand Nagar',
    memberType: 'Service Provider',
    skills: 'Herbal Hair Oil & Scalp Massage',
    experience: '10 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-012',
    joinedDate: 'Sep 2024',
    transactionCount: 14,
    rating: 4.7
  },
  {
    id: 'mem-13',
    name: 'Savitri Devi',
    mobile: '9899001122',
    village: 'Kalyan Nagar',
    memberType: 'SHG Member',
    skills: 'Bhakri & Ragi Roti Making',
    experience: '15 years',
    status: 'Fully Verified',
    invitationCode: 'SETU-RAM-013',
    joinedDate: 'Sep 2024',
    transactionCount: 31,
    rating: 4.9
  },
  {
    id: 'mem-14',
    name: 'Pushpa Kulkarni',
    mobile: '9710112233',
    village: 'Rampur',
    memberType: 'Artisan',
    skills: 'Terracotta Diyas & Kitchen Pottery',
    experience: '7 years',
    status: 'Pending',
    invitationCode: 'SETU-RAM-014',
    joinedDate: 'Oct 2024',
    transactionCount: 3,
    rating: 4.3
  },
  {
    id: 'mem-15',
    name: 'Bharti Rawat',
    mobile: '9821223344',
    village: 'Vikas Nagar',
    memberType: 'Artisan',
    skills: 'Traditional Bamboo Baskets & Trays',
    experience: '5 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-015',
    joinedDate: 'Oct 2024',
    transactionCount: 11,
    rating: 4.6
  },
  {
    id: 'mem-16',
    name: 'Kavita Joshi',
    mobile: '9832334455',
    village: 'Sompura',
    memberType: 'Producer',
    skills: 'Organic Multigrain Flour & Daliya',
    experience: '6 years',
    status: 'Reference Verified',
    invitationCode: 'SETU-RAM-016',
    joinedDate: 'Nov 2024',
    transactionCount: 15,
    rating: 4.7
  },
  {
    id: 'mem-17',
    name: 'Manjula Gowda',
    mobile: '9843445566',
    village: 'Hosur',
    memberType: 'Artisan',
    skills: 'Kasuti Embroidery Saree Pallus',
    experience: '13 years',
    status: 'Fully Verified',
    invitationCode: 'SETU-RAM-017',
    joinedDate: 'Nov 2024',
    transactionCount: 27,
    rating: 5.0
  },
  {
    id: 'mem-18',
    name: 'Sharda Bai',
    mobile: '9854556677',
    village: 'Gandhi Chowk',
    memberType: 'SHG Member',
    skills: 'Papad, Khakhra & Roasted Namkeen',
    experience: '8 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-018',
    joinedDate: 'Dec 2024',
    transactionCount: 19,
    rating: 4.6
  },
  {
    id: 'mem-19',
    name: 'Rehana Begum',
    mobile: '9865667788',
    village: 'Purani Basti',
    memberType: 'Artisan',
    skills: 'Chikan Work Kurtas & Dupattas',
    experience: '9 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-019',
    joinedDate: 'Jan 2025',
    transactionCount: 12,
    rating: 4.8
  },
  {
    id: 'mem-20',
    name: 'Tara Choudhary',
    mobile: '9876778899',
    village: 'Rampur',
    memberType: 'Producer',
    skills: 'Cold Pressed Mustard & Sesame Oil',
    experience: '5 years',
    status: 'Pending',
    invitationCode: 'SETU-RAM-020',
    joinedDate: 'Jan 2025',
    transactionCount: 4,
    rating: 4.4
  },
  {
    id: 'mem-21',
    name: 'Basamma Pujar',
    mobile: '9887889900',
    village: 'Navalgund',
    memberType: 'SHG Member',
    skills: 'Homemade Chutney Powders & Masalas',
    experience: '12 years',
    status: 'Fully Verified',
    invitationCode: 'SETU-RAM-021',
    joinedDate: 'Feb 2025',
    transactionCount: 21,
    rating: 4.9
  },
  {
    id: 'mem-22',
    name: 'Indira Soni',
    mobile: '9898990011',
    village: 'Kalyan Nagar',
    memberType: 'Artisan',
    skills: 'Silk Thread Bangles & Hair Ornaments',
    experience: '4 years',
    status: 'Community Verified',
    invitationCode: 'SETU-RAM-022',
    joinedDate: 'Feb 2025',
    transactionCount: 8,
    rating: 4.7
  },
  {
    id: 'mem-23',
    name: 'Lalita Das',
    mobile: '9709001122',
    village: 'Shivaji Ward',
    memberType: 'Service Provider',
    skills: 'Handmade Soap & Herbal Ubtan',
    experience: '6 years',
    status: 'Reference Verified',
    invitationCode: 'SETU-RAM-023',
    joinedDate: 'Mar 2025',
    transactionCount: 13,
    rating: 4.8
  },
  {
    id: 'mem-24',
    name: 'Champa Devi',
    mobile: '9710112244',
    village: 'Vikas Nagar',
    memberType: 'SHG Member',
    skills: 'Cloth Bag Stitching & Patchwork Quilts',
    experience: '10 years',
    status: 'Pending',
    invitationCode: 'SETU-RAM-024',
    joinedDate: 'Mar 2025',
    transactionCount: 2,
    rating: 4.5
  }
];

export const DEFAULT_COMMUNITY_PROFILE: CommunityProfile = {
  id: 'comm-sahyadri-01',
  name: 'Sahyadri Mahila Vikas Sangha',
  type: "Women's Collective",
  village: 'Rampur',
  district: 'Dharwad',
  state: 'Karnataka',
  description: 'Federation of 12 village self-help clusters empowering 140+ rural women artisans, home bakers, tailors, and producers with dignified livelihoods and direct market access.',
  contactNumber: '9876543200',
  representative: {
    name: 'Anusuya Deshmukh',
    phone: '9876543200',
    role: 'President',
    yearsInvolved: 6
  },
  members: DEFAULT_COMMUNITY_MEMBERS,
  createdAt: Date.now() - 86400000 * 180
};

// 15 Realistic Demo Transactions for the Community
// Strictly respecting privacy: abbreviated buyer and provider names, no phone, address or payment credentials
export const DEFAULT_COMMUNITY_TRANSACTIONS: CommunityTransaction[] = [
  {
    id: 'TXN-8041',
    date: '2025-03-28',
    buyerAbbr: 'Anita S.',
    providerAbbr: 'Sunita D.',
    providerMemberId: 'mem-1',
    serviceOrProduct: 'Festive Designer Blouse Stitching (x2)',
    amount: 1400,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-28 10:15 AM', done: true, note: 'Measurements and fabric received' },
      { stage: 'Provider accepted', timestamp: '2025-03-28 10:45 AM', done: true, note: 'Pattern cut initiated' },
      { stage: 'Payment confirmed', timestamp: '2025-03-28 11:00 AM', done: true, note: 'Advance paid securely' },
      { stage: 'Delivered', timestamp: '2025-03-30 04:30 PM', done: true, note: 'Trial and fitting completed' },
      { stage: 'Completed', timestamp: '2025-03-30 06:00 PM', done: true, note: 'Buyer verified 5-star rating' }
    ]
  },
  {
    id: 'TXN-8042',
    date: '2025-03-27',
    buyerAbbr: 'Vikram K.',
    providerAbbr: 'Parvati B.',
    providerMemberId: 'mem-2',
    serviceOrProduct: 'Monthly Lunch Tiffin Service (26 Days)',
    amount: 3120,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-01 08:30 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-01 09:00 AM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-01 09:15 AM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-27 01:15 PM', done: true },
      { stage: 'Completed', timestamp: '2025-03-27 02:00 PM', done: true }
    ]
  },
  {
    id: 'TXN-8043',
    date: '2025-03-26',
    buyerAbbr: 'Pooja M.',
    providerAbbr: 'Shabana K.',
    providerMemberId: 'mem-3',
    serviceOrProduct: 'Bridal Sangeet Mehendi (Full Hands & Feet)',
    amount: 2500,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-25 02:00 PM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-25 02:30 PM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-25 03:00 PM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-26 07:45 PM', done: true },
      { stage: 'Completed', timestamp: '2025-03-26 09:00 PM', done: true }
    ]
  },
  {
    id: 'TXN-8044',
    date: '2025-03-25',
    buyerAbbr: 'Rajesh P.',
    providerAbbr: 'Meena S.',
    providerMemberId: 'mem-4',
    serviceOrProduct: 'Class 8 Mathematics & Science 1-Month Tutoring',
    amount: 1800,
    status: 'In Progress',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-10 11:00 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-10 11:30 AM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-10 12:00 PM', done: true },
      { stage: 'Delivered', timestamp: 'Ongoing weekly sessions', done: false, note: '18 of 24 classes completed' },
      { stage: 'Completed', timestamp: 'Pending session completion', done: false }
    ]
  },
  {
    id: 'TXN-8045',
    date: '2025-03-24',
    buyerAbbr: 'Deepa T.',
    providerAbbr: 'Rekha V.',
    providerMemberId: 'mem-5',
    serviceOrProduct: 'Catering Snack Box: Pure Ghee Besan Ladoo (5kg)',
    amount: 2250,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-23 09:00 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-23 09:30 AM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-23 10:00 AM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-24 02:00 PM', done: true },
      { stage: 'Completed', timestamp: '2025-03-24 03:30 PM', done: true }
    ]
  },
  {
    id: 'TXN-8046',
    date: '2025-03-23',
    buyerAbbr: 'Sneha G.',
    providerAbbr: 'Kamala B.',
    providerMemberId: 'mem-6',
    serviceOrProduct: 'Handcrafted Zari Bordering on 2 Kanjeevaram Sarees',
    amount: 950,
    status: 'Paid',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-22 04:00 PM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-22 04:30 PM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-23 10:00 AM', done: true },
      { stage: 'Delivered', timestamp: 'Expected March 31', done: false, note: 'Intricate work in progress' },
      { stage: 'Completed', timestamp: 'Pending delivery', done: false }
    ]
  },
  {
    id: 'TXN-8047',
    date: '2025-03-22',
    buyerAbbr: 'Karthik N.',
    providerAbbr: 'Lakshmi R.',
    providerMemberId: 'mem-7',
    serviceOrProduct: 'Organic Stone-Ground Turmeric & Bilona Desi Ghee (2L)',
    amount: 1900,
    status: 'Accepted',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-22 01:00 PM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-22 01:45 PM', done: true, note: 'Batch ready for dispatch' },
      { stage: 'Payment confirmed', timestamp: 'Awaiting online/cash token', done: false },
      { stage: 'Delivered', timestamp: 'Pending', done: false },
      { stage: 'Completed', timestamp: 'Pending', done: false }
    ]
  },
  {
    id: 'TXN-8048',
    date: '2025-03-20',
    buyerAbbr: 'Ramesh B.',
    providerAbbr: 'Geeta P.',
    providerMemberId: 'mem-9',
    serviceOrProduct: 'Bulk Eco-Friendly Jute Conference Bags (x30)',
    amount: 4500,
    status: 'Disputed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-18 09:00 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-18 10:30 AM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-18 11:00 AM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-20 03:00 PM', done: true },
      { stage: 'Completed', timestamp: 'Dispute opened regarding print color mismatch', done: false }
    ],
    disputeReason: 'Bag handle stitching & logo print shade discrepancy',
    disputeExplanation: 'Buyer noted that handles were brown instead of specified green for 8 bags. Community coordinator mediation in progress.',
    disputeRaisedAt: '2025-03-20 05:40 PM'
  },
  {
    id: 'TXN-8049',
    date: '2025-03-18',
    buyerAbbr: 'Meera V.',
    providerAbbr: 'Anandi B.',
    providerMemberId: 'mem-8',
    serviceOrProduct: 'Pure Handloom Cotton Dhurrie Set (2 pcs)',
    amount: 1600,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-16 11:00 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-16 11:30 AM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-16 12:00 PM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-18 01:30 PM', done: true },
      { stage: 'Completed', timestamp: '2025-03-18 02:45 PM', done: true }
    ]
  },
  {
    id: 'TXN-8050',
    date: '2025-03-15',
    buyerAbbr: 'Suresh C.',
    providerAbbr: 'Savitri D.',
    providerMemberId: 'mem-13',
    serviceOrProduct: 'Hot Jowar & Ragi Bhakri Batch (50 pcs)',
    amount: 1000,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-15 07:00 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-15 07:15 AM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-15 07:30 AM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-15 12:30 PM', done: true },
      { stage: 'Completed', timestamp: '2025-03-15 01:00 PM', done: true }
    ]
  },
  {
    id: 'TXN-8051',
    date: '2025-03-12',
    buyerAbbr: 'Geeta H.',
    providerAbbr: 'Manjula G.',
    providerMemberId: 'mem-17',
    serviceOrProduct: 'Traditional Kasuti Embroidery Hand-Work on Saree',
    amount: 3200,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-05 10:00 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-05 10:30 AM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-05 11:00 AM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-12 04:00 PM', done: true },
      { stage: 'Completed', timestamp: '2025-03-12 05:30 PM', done: true }
    ]
  },
  {
    id: 'TXN-8052',
    date: '2025-03-10',
    buyerAbbr: 'Arun L.',
    providerAbbr: 'Fatima B.',
    providerMemberId: 'mem-10',
    serviceOrProduct: 'Baby Soft Woolen Sweater & Cap Set (x2)',
    amount: 1100,
    status: 'Refunded',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-08 02:00 PM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-08 03:00 PM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-08 03:30 PM', done: true },
      { stage: 'Delivered', timestamp: 'Cancelled by mutual agreement due to size change', done: false },
      { stage: 'Completed', timestamp: 'Full amount refunded safely', done: true }
    ]
  },
  {
    id: 'TXN-8053',
    date: '2025-03-07',
    buyerAbbr: 'Priya D.',
    providerAbbr: 'Sunita D.',
    providerMemberId: 'mem-1',
    serviceOrProduct: 'Anarkali Suit Tailoring & Dupatta Pico',
    amount: 850,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-04 11:30 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-04 12:00 PM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-04 12:30 PM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-07 03:30 PM', done: true },
      { stage: 'Completed', timestamp: '2025-03-07 05:00 PM', done: true }
    ]
  },
  {
    id: 'TXN-8054',
    date: '2025-03-04',
    buyerAbbr: 'Naveen R.',
    providerAbbr: 'Radha D.',
    providerMemberId: 'mem-11',
    serviceOrProduct: 'Fresh Dairy Paneer (3kg) for Family Gathering',
    amount: 1200,
    status: 'Completed',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-03 04:00 PM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-03 04:30 PM', done: true },
      { stage: 'Payment confirmed', timestamp: '2025-03-03 05:00 PM', done: true },
      { stage: 'Delivered', timestamp: '2025-03-04 08:30 AM', done: true },
      { stage: 'Completed', timestamp: '2025-03-04 09:15 AM', done: true }
    ]
  },
  {
    id: 'TXN-8055',
    date: '2025-03-01',
    buyerAbbr: 'Sunil J.',
    providerAbbr: 'Pushpa K.',
    providerMemberId: 'mem-14',
    serviceOrProduct: 'Clay Handcrafted Water Pot (Matka)',
    amount: 450,
    status: 'Cancelled',
    timeline: [
      { stage: 'Order created', timestamp: '2025-03-01 10:00 AM', done: true },
      { stage: 'Provider accepted', timestamp: '2025-03-01 10:15 AM', done: true },
      { stage: 'Payment confirmed', timestamp: 'Cancelled before payment', done: false },
      { stage: 'Delivered', timestamp: 'Buyer relocated', done: false },
      { stage: 'Completed', timestamp: 'Order voided', done: false }
    ]
  }
];

// USER / MOCK AUTH HELPERS
export function getMockUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(USER_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export function saveMockUser(user: MockUser): void {
  try {
    localStorage.setItem(USER_AUTH_KEY, JSON.stringify(user));
  } catch (_) {}
}

export function clearMockUser(): void {
  try {
    localStorage.removeItem(USER_AUTH_KEY);
  } catch (_) {}
}

// COMMUNITY HELPERS
export function getStoredCommunity(): CommunityProfile {
  try {
    const raw = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name && Array.isArray(parsed.members)) {
        return parsed;
      }
    }
  } catch (_) {}

  // Fallback to default enriched community
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(DEFAULT_COMMUNITY_PROFILE));
  } catch (_) {}
  return DEFAULT_COMMUNITY_PROFILE;
}

export function saveCommunity(profile: CommunityProfile): void {
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(profile));
  } catch (_) {}
}

export function generateInvitationCode(communityName: string, index: number): string {
  const prefix = communityName
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'SETU';
  const num = (index + 1).toString().padStart(3, '0');
  return `SKU-${prefix}-${num}`;
}

export function addCommunityMember(
  newMemberData: Omit<CommunityMember, 'id' | 'invitationCode' | 'status' | 'joinedDate' | 'transactionCount'>
): CommunityMember {
  const community = getStoredCommunity();
  const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const invitationCode = generateInvitationCode(community.name, community.members.length);
  
  const member: CommunityMember = {
    ...newMemberData,
    id,
    invitationCode,
    status: 'Pending',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    transactionCount: 0,
    rating: 5.0
  };

  community.members = [member, ...community.members];
  saveCommunity(community);
  return member;
}

export function updateCommunityMember(memberId: string, updates: Partial<CommunityMember>): CommunityProfile {
  const community = getStoredCommunity();
  community.members = community.members.map(m => m.id === memberId ? { ...m, ...updates } : m);
  saveCommunity(community);
  return community;
}

export function deleteCommunityMember(memberId: string): CommunityProfile {
  const community = getStoredCommunity();
  community.members = community.members.filter(m => m.id !== memberId);
  saveCommunity(community);
  return community;
}

// TRANSACTIONS HELPERS
export function getStoredTransactions(): CommunityTransaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}

  // Fallback to 15 demo transactions
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(DEFAULT_COMMUNITY_TRANSACTIONS));
  } catch (_) {}
  return DEFAULT_COMMUNITY_TRANSACTIONS;
}

export function saveTransactions(transactions: CommunityTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (_) {}
}

export function reportTransactionDispute(txnId: string, reason: string, explanation: string): boolean {
  const txns = getStoredTransactions();
  let found = false;
  const nowStr = new Date().toLocaleString('en-US', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });

  const updated = txns.map(t => {
    if (t.id === txnId) {
      found = true;
      const timelineCopy = [...t.timeline];
      timelineCopy.push({
        stage: 'Completed',
        timestamp: `${nowStr} - Dispute reported`,
        done: false,
        note: `Reason: ${reason}`
      });
      return {
        ...t,
        status: 'Disputed' as TransactionStatus,
        disputeReason: reason,
        disputeExplanation: explanation,
        disputeRaisedAt: nowStr,
        timeline: timelineCopy
      };
    }
    return t;
  });

  if (found) {
    saveTransactions(updated);
  }
  return found;
}

// SAMPLE CSV TEMPLATE BUILDER FOR STEP 3
export function generateSampleCsvContent(): string {
  const header = 'Name,Mobile,Location,Member Type,Skills,Experience\n';
  const rows = [
    'Sunita Devi,9876543210,Rampur,SHG Member,"Designer Blouses, Salwar Suits",8 years',
    'Parvati Bai,9823456789,Anand Nagar,Artisan,"Homemade Tiffin, Sweets & Snacks",12 years',
    'Shabana Khatun,9712345678,Purani Basti,Artisan,"Bridal Mehendi, Floral Patterns",6 years',
    'Meena Sharma,9845012345,Vikas Nagar,Service Provider,"Primary Math & Science Tutoring",5 years',
    'Rekha Verma,9911223344,Shivaji Ward,SHG Member,"Festival Catering, Ghee Ladoos",9 years',
    'Kamala Ben,9722334455,Gandhi Chowk,Artisan,"Zari Embroidery, Fall Piko",14 years',
    'Lakshmi Rao,9833445566,Navalgund,Producer,"Organic Turmeric, Desi Ghee",7 years',
    'Anandi Bai,9644556677,Hosur,Artisan,"Handloom Towels & Rugs",11 years'
  ].join('\n');
  return header + rows;
}

// CSV PARSER
export function parseCsvMembers(csvContent: string): { 
  success: boolean; 
  members: Partial<CommunityMember>[]; 
  errors: string[] 
} {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return { success: false, members: [], errors: ['CSV file is empty or missing data rows.'] };
  }

  const errors: string[] = [];
  const members: Partial<CommunityMember>[] = [];

  // Simple CSV line splitter respecting quoted fields
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (row.length < 4) {
      errors.push(`Row ${i + 1}: Insufficient columns`);
      continue;
    }
    const [name, mobile, location, memberType, skills, experience] = row;
    if (!name) {
      errors.push(`Row ${i + 1}: Name is required`);
      continue;
    }

    const validMemberTypes = ['SHG Member', 'Artisan', 'Service Provider', 'Producer', 'Other'];
    const matchedType = validMemberTypes.find(t => t.toLowerCase() === (memberType || '').toLowerCase()) || 'SHG Member';

    members.push({
      name: name.replace(/^"|"$/g, ''),
      mobile: (mobile || '').replace(/[^0-9]/g, ''),
      village: (location || 'Local Village').replace(/^"|"$/g, ''),
      memberType: matchedType as any,
      skills: (skills || 'General Crafts').replace(/^"|"$/g, ''),
      experience: (experience || '2 years').replace(/^"|"$/g, ''),
      status: 'Pending',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      transactionCount: 0
    });
  }

  return {
    success: members.length > 0,
    members,
    errors
  };
}
