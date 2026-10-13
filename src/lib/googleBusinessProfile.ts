/**
 * Service Websites Agency - Official Google Business Profile Configuration
 * Verified profile link: https://share.google/7Ec5oYGoW892EXMhq
 * Knowledge Graph ID: /g/11nvhct_53 (kgs: 54d4eaf08cbd28bd)
 */

export interface BusinessProfileData {
  name: string;
  tradeName: string;
  shareUrl: string;
  searchUrl: string;
  mapsSearchUrl: string;
  reviewUrl: string;
  kgmid: string;
  kgs: string;
  rating: number;
  reviewCount: number;
  category: string;
  subCategories: string[];
  status: string;
  verificationBadge: string;
  address: {
    street: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    countryCode: string;
    fullFormatted: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    phoneInternational: string;
    whatsapp: string;
    whatsappLink: string;
    email: string;
    website: string;
  };
  openingHours: { days: string; hours: string; isOpenNow?: boolean }[];
  serviceAreas: string[];
  attributes: string[];
  highlights: { title: string; desc: string; icon: string }[];
}

export const GOOGLE_BUSINESS_PROFILE: BusinessProfileData = {
  name: 'Service Websites Agency',
  tradeName: 'Service Websites',
  shareUrl: 'https://share.google/7Ec5oYGoW892EXMhq',
  searchUrl:
    'https://www.google.com/search?kgmid=/g/11nvhct_53&q=Service+Websites&kgs=54d4eaf08cbd28bd',
  mapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=Service+Websites+Moumo+Street+Tlhabane+Rustenburg',
  reviewUrl: 'https://share.google/7Ec5oYGoW892EXMhq',
  kgmid: '/g/11nvhct_53',
  kgs: '54d4eaf08cbd28bd',
  rating: 5.0,
  reviewCount: 47,
  category: 'Website Designer & Software Development Company',
  subCategories: [
    'Web Designer',
    'Internet Marketing Service',
    'Software Company',
    'E-Commerce Service Provider',
  ],
  status: 'Verified Business on Google',
  verificationBadge: 'Google Business Profile Verified',
  address: {
    street: 'Moumo Street',
    suburb: 'Tlhabane',
    city: 'Rustenburg',
    province: 'North West',
    postalCode: '0309',
    country: 'South Africa',
    countryCode: 'ZA',
    fullFormatted: 'Moumo Street, Tlhabane, Rustenburg, North West, 0309, South Africa',
    coordinates: {
      latitude: -25.6425,
      longitude: 27.2081,
    },
  },
  contact: {
    phone: '060 137 5180',
    phoneInternational: '+27601375180',
    whatsapp: '060 137 5180',
    whatsappLink:
      'https://wa.me/27601375180?text=Hello%20Service%20Websites,%20I%20found%20your%20Google%20Business%20Profile%20and%20would%20like%20a%20website%20quote',
    email: 'manager@servicewebsites.co.za',
    website: 'https://servicewebsites.co.za',
  },
  openingHours: [
    { days: 'Monday – Friday', hours: 'Open 24 hours' },
    { days: 'Saturday', hours: 'Open 24 hours' },
    { days: 'Sunday', hours: 'Open 24 hours' },
  ],
  serviceAreas: [
    'Rustenburg',
    'Tlhabane',
    'Phokeng',
    'Boitekong',
    'Waterfall East',
    'Boksburg',
    'Gauteng',
    'Nationwide South Africa',
  ],
  attributes: [
    'Google Verified Local Business',
    'Online appointments & video consultations',
    'On-site meetings in Rustenburg & Tlhabane',
    'Instant WhatsApp support & rapid quoting',
    'Mobile-first responsive architecture',
    'PayFast, Ozow, Yoco, Paystack integration',
  ],
  highlights: [
    {
      title: '5.0 ★ Google Rating',
      desc: 'Top-ranked local website development agency in North West with 47+ 5-star reviews.',
      icon: 'star',
    },
    {
      title: 'Local Rustenburg Presence',
      desc: 'Physical office on Moumo Street, Tlhabane serving local contractors and national brands.',
      icon: 'map-pin',
    },
    {
      title: 'Direct Instant Contact',
      desc: 'One-tap dialling on 060 137 5180 and fast WhatsApp chat dispatch.',
      icon: 'phone',
    },
  ],
};
