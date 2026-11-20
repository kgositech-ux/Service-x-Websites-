export interface SearchLayerItem {
  id: 'seo' | 'aeo' | 'geo';
  code: string;
  title: string;
  tagline: string;
  description: string;
  aiSignal: string;
  icon: 'Globe' | 'Trophy' | 'Bot';
}

export interface SeoServicePillar {
  number: string;
  title: string;
  summary: string;
  whyAiCares: string;
  deliverables: string[];
  icon:
    | 'Network'
    | 'Search'
    | 'FileText'
    | 'Code2'
    | 'MapPin'
    | 'Link2'
    | 'Bot'
    | 'ShieldCheck'
    | 'BarChart3';
}

export interface BlogArticle {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  directAnswer: string;
  publishedDate: string;
  updatedDate: string;
  readTime: string;
  authorName: string;
  authorRole: string;
  reviewerName: string;
  keyTakeaways: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const THREE_SEARCH_LAYERS: SearchLayerItem[] = [
  {
    id: 'seo',
    code: 'SEO',
    title: 'SEO: Be Found',
    tagline: 'Search Engine Optimisation',
    description:
      'Technical health, relevance and authority so Google can crawl, index and rank the pages that lead to enquiries and sales.',
    aiSignal: 'Ensures clean HTML crawlability, fast Core Web Vitals, and topical keyword relevance.',
    icon: 'Globe',
  },
  {
    id: 'aeo',
    code: 'AEO',
    title: 'AEO: Be The Answer',
    tagline: 'Answer Engine Optimisation',
    description:
      'Pages structured around the real questions buyers ask, with direct answers, FAQs and schema that featured snippets and answer engines can lift accurately.',
    aiSignal: 'Formats high-clarity Q&A and JSON-LD markup for instant extraction by answer engines.',
    icon: 'Trophy',
  },
  {
    id: 'geo',
    code: 'GEO',
    title: 'GEO: Be Recommended',
    tagline: 'Generative Engine Optimisation',
    description:
      'Consistent brand facts across your site, listings and third-party sources, backed by reviews and evidence, so AI tools describe you correctly and include you in their shortlists.',
    aiSignal: 'Aligns canonical NAP entity records, Knowledge Graph IDs, and verified social proof.',
    icon: 'Bot',
  },
];

export const NINE_SEO_SERVICES: SeoServicePillar[] = [
  {
    number: '01',
    title: 'Technical SEO',
    summary:
      'Crawlability, indexing, site speed, Core Web Vitals and mobile experience, fixed in priority order so nothing holds your pages back.',
    whyAiCares:
      'Both Googlebot and AI crawlers (GPTBot, Google-Extended, PerplexityBot) deprioritise slow, broken, or poorly structured DOMs.',
    deliverables: [
      'Full XML sitemap, robots.txt & canonical audit',
      'Core Web Vitals optimisation (LCP < 2.5s, CLS < 0.1)',
      'Mobile-first responsiveness on South African 3G/4G networks',
    ],
    icon: 'Network',
  },
  {
    number: '02',
    title: 'Keyword And Question Research',
    summary:
      'We map the searches and the conversational questions your buyers ask, by intent, so every page has a clear job to do.',
    whyAiCares:
      'AI prompts are longer and more conversational than legacy 2-word keywords; mapping real buyer questions prevents keyword cannibalisation.',
    deliverables: [
      'Commercial, transactional & informational intent matrix',
      'Conversational AI prompt mapping for Rustenburg & SA buyers',
      'Dedicated landing-page architecture per service intent',
    ],
    icon: 'Search',
  },
  {
    number: '03',
    title: 'Answer-Ready Content',
    summary:
      'Service pages, articles and FAQs written to answer clearly and early, with the depth and expertise that Google and AI tools reward.',
    whyAiCares:
      'Leading with a direct, evidence-backed summary allows LLM retrieval systems to quote your business accurately with attribution.',
    deliverables: [
      'Direct 40–60 word answer blocks above technical deep dives',
      'First-hand E-E-A-T demonstrations and local South African context',
      'Structured buyer FAQs targeting zero-click & voice queries',
    ],
    icon: 'FileText',
  },
  {
    number: '04',
    title: 'Schema And Structured Data',
    summary:
      'Organisation, service, product, FAQ and review markup that matches what is on the page, so machines read your business correctly.',
    whyAiCares:
      'Verified JSON-LD graphs resolve entity ambiguity and link your brand, location, pricing, and 5.0-star reviews cleanly.',
    deliverables: [
      'ProfessionalService / LocalBusiness JSON-LD with geo-coordinates',
      'Service, OfferCatalog, FAQPage & BlogPosting markup parity',
      'Zero mismatch validation against visible page content',
    ],
    icon: 'Code2',
  },
  {
    number: '05',
    title: 'Local SEO And Google Business Profile',
    summary:
      'Optimised Google Business Profile and Bing Places listings, consistent NAP details and review strategy for every location you serve.',
    whyAiCares:
      'ChatGPT, Gemini, and Google AI Overviews heavily cross-reference Google Business Profile and Bing Places for local shortlists.',
    deliverables: [
      'Google Business Profile & Bing Places verification and tuning',
      'Consistent Name, Address & Phone (NAP) across local directories',
      'Automated 5-star review velocity and keyword-rich replies',
    ],
    icon: 'MapPin',
  },
  {
    number: '06',
    title: 'Link Building And Digital PR',
    summary:
      'Earned mentions and links from relevant, credible websites. These build rankings and are among the sources AI tools cite.',
    whyAiCares:
      'Independent third-party corroboration signals authority and prevents AI models from treating claims as unverified self-promotion.',
    deliverables: [
      'South African industry & regional directory citations',
      'Credible editorial mentions and partner case study features',
      'Toxic backlink monitoring and domain authority growth',
    ],
    icon: 'Link2',
  },
  {
    number: '07',
    title: 'AI Visibility Tracking',
    summary:
      'We monitor priority prompts across ChatGPT, Gemini, Perplexity and Google AI Overviews and report where your brand appears, and where it does not.',
    whyAiCares:
      'Traditional rank trackers miss LLM recommendations; prompt-level auditing reveals how AI assistants summarise your competitors.',
    deliverables: [
      'Monthly prompt share-of-voice tracking across 4 major AI engines',
      'Brand sentiment & factual accuracy verification in AI answers',
      'Gap analysis showing why competitors get cited and how to overtake them',
    ],
    icon: 'Bot',
  },
  {
    number: '08',
    title: 'Entity And Brand Consistency',
    summary:
      'Your name, services, locations and proof points aligned across your site, directories and profiles, removing the mixed signals that erode AI confidence.',
    whyAiCares:
      'Conflicting phone numbers, outdated addresses, or inconsistent pricing across websites cause LLMs to lower confidence and omit your brand.',
    deliverables: [
      'Single canonical source of truth for contact, hours & service scope',
      'Knowledge Graph (`kgmid`) & `sameAs` profile alignment',
      'Duplicate or stale directory listing cleanup',
    ],
    icon: 'ShieldCheck',
  },
  {
    number: '09',
    title: 'Reporting That Means Something',
    summary:
      'Monthly reporting on organic leads, calls, sales and AI referral traffic from GA4 and Search Console, with clear next steps.',
    whyAiCares:
      'Connects search visibility and AI citations directly to WhatsApp enquiries, phone calls, and booked quotes—not vanity impressions.',
    deliverables: [
      'GA4 conversion & AI assistant referral attribution tracking',
      'Google Search Console query & snippet impression breakdown',
      'Plain-language monthly roadmap of priority actions',
    ],
    icon: 'BarChart3',
  },
];

export const CONSULTATION_STEPS = [
  {
    step: 'Step 1',
    title: 'Submit Your Details',
    description:
      'Complete the consultation form by filling in your full name, email address, mobile number, business name, and website URL.',
  },
  {
    step: 'Step 2',
    title: 'Schedule Confirmation',
    description:
      'Get contacted directly by Service Websites Agency to establish the best time and method for your one-on-one session.',
  },
  {
    step: 'Step 3',
    title: 'Strategy & Execution Roadmap',
    description:
      'Have a focused 30-minute consultation with a senior SEO, AEO & GEO specialist on how to reach your business goals with our services.',
  },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'seo-aeo-geo-guide-google-and-ai-search',
    category: 'Pillar Authority Guide · SEO, AEO & GEO',
    title: 'Search Has Changed. Your SEO Should Too: How to Win on Google & AI Search',
    subtitle:
      'Get found when customers search on Google, and recommended when they ask ChatGPT, Gemini, Perplexity or Google’s AI Overviews.',
    directAnswer:
      'Modern search visibility requires three stacked disciplines working together: Technical & On-Page SEO so search engines can crawl and index your pages, Answer Engine Optimisation (AEO) so featured snippets and voice assistants lift accurate answers, and Generative Engine Optimisation (GEO) so consistent entity data and third-party proof prompt ChatGPT, Gemini, and Perplexity to shortlist your brand.',
    publishedDate: 'November 20, 2026',
    updatedDate: 'November 20, 2026',
    readTime: '8 min read',
    authorName: 'Service Websites Editorial & Technical SEO Team',
    authorRole: 'Senior Search & Web Architecture Specialists · Rustenburg, SA',
    reviewerName: 'Verified against Google Search Essentials & Schema.org v27',
    keyTakeaways: [
      'AEO and GEO do not replace SEO—they are built directly on crawlable, well-structured SEO foundations.',
      'AI search tools quote and recommend businesses with consistent entity facts, verifiable reviews, and answer-ready pages.',
      'Winning both the Google click and the AI citation doubles qualified inbound enquiries for South African service businesses.',
    ],
    sections: [
      {
        heading: 'Why Traditional Keyword Stuffing No Longer Wins',
        paragraphs: [
          'Your customers still search Google, but more of their research now starts and ends inside an AI answer: Google AI Overviews and AI Mode, ChatGPT, Gemini, Perplexity and Copilot. These tools draw on websites they can crawl, understand and trust.',
          'If your pages are hard to interpret, inconsistent across directories, or light on verifiable proof, AI assistants quote and recommend a competitor instead—often before a buyer ever clicks a traditional search link.',
        ],
        bulletPoints: [
          'Buyers ask full natural-language questions ("Who is the most reliable web designer in Rustenburg with PayFast experience?") instead of short fragments.',
          'Zero-click answers reward pages that state facts clearly in the first paragraph rather than burying answers under fluff.',
          'Mixed signals—such as an old phone number on a directory or missing schema—directly erode AI confidence.',
        ],
      },
      {
        heading: 'The Core Principle: Unified Three-Layer Optimisation',
        paragraphs: [
          'AEO and GEO do not replace SEO. They are built on it. AI assistants rely on the same crawlable, well-structured and credible pages that rank on Google, which is why our campaigns optimise for all three in one integrated programme rather than selling them as disconnected projects.',
          'When Service Websites Agency engineers a website in Rustenburg or nationwide across South Africa, technical speed, answer-ready copy, and matching JSON-LD structured data ship together from day one.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between SEO, AEO, and GEO?',
        answer:
          'SEO (Search Engine Optimisation) ensures search engines crawl, index, and rank your pages. AEO (Answer Engine Optimisation) structures direct answers, FAQs, and schema so featured snippets and answer engines extract them cleanly. GEO (Generative Engine Optimisation) aligns consistent entity facts, reviews, and third-party mentions so AI assistants like ChatGPT, Gemini, and Perplexity include your business in their recommendations.',
      },
      {
        question: 'Can a small local business in Rustenburg appear in ChatGPT and Google AI Overviews?',
        answer:
          'Yes. Local and regional businesses often outperform large national brands in AI answers when their website publishes exact local service areas, clear pricing transparency, valid LocalBusiness JSON-LD schema, and consistent Google Business Profile reviews.',
      },
      {
        question: 'Does AEO or GEO replace traditional Google SEO?',
        answer:
          'No. AEO and GEO are built on technical SEO. AI search systems retrieve and verify facts from crawlable, authoritative, fast-loading web pages that already follow search fundamentals.',
      },
    ],
  },
  {
    slug: 'entity-consistency-and-schema-for-ai-trust',
    category: 'Technical Trust · Schema & Entities',
    title: 'Entity & Brand Consistency: How AI Tools Decide Which Businesses to Trust',
    subtitle:
      'Eliminate mixed signals across your website, Schema.org markup, and Google Business Profile so machine-reading systems endorse your brand with confidence.',
    directAnswer:
      'AI search systems verify business credibility by cross-checking identical Name, Address, Phone (NAP), service scope, and review proof across your website HTML, JSON-LD structured data, Google Business Profile, and third-party directories. Discrepancies reduce entity confidence and cause recommendation models to skip your brand.',
    publishedDate: 'November 18, 2026',
    updatedDate: 'November 20, 2026',
    readTime: '5 min read',
    authorName: 'Service Websites Editorial & Technical SEO Team',
    authorRole: 'Structured Data & Local Authority Engineering',
    reviewerName: 'Audited against Schema.org ProfessionalService Spec',
    keyTakeaways: [
      'JSON-LD markup must strictly match visible human-readable text on the page.',
      'Canonical sameAs links connect your domain, Google Knowledge Graph ID (/g/11nvhct_53), and verified review profiles.',
      'Unambiguous service boundaries and pricing ranges help AI assistants qualify leads before they contact you.',
    ],
    sections: [
      {
        heading: 'How Machine Readers Build Your Brand Profile',
        paragraphs: [
          'Large Language Models do not simply match strings of text; they construct an entity graph connecting who you are, where you operate, what you sell, and who vouches for your work.',
          'If your footer lists one email address, your Google Business Profile lists another, and your schema omits your operating hours, algorithmic trust drops immediately.',
        ],
        bulletPoints: [
          'Keep your canonical email (e.g. manager@servicewebsites.co.za), phone (+27 60 137 5180), and street address identical everywhere.',
          'Declare explicit geo-coordinates (-25.6425, 27.2081) and areaServed sub-regions (Tlhabane, Phokeng, Boitekong, Cashan, Waterfall East, Nationwide SA).',
          'Embed verifiable aggregateRating and review counts only when backed by real platform listings.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Which Schema.org types matter most for South African service websites?',
        answer:
          'ProfessionalService (or LocalBusiness), Service with OfferCatalog, FAQPage, BlogPosting, and BreadcrumbList provide the clearest machine-readable signals for both Google Search and generative AI engines.',
      },
      {
        question: 'How do you track whether AI tools are recommending our brand?',
        answer:
          'Through AI Visibility Tracking, we test buyer-intent prompts regularly across ChatGPT, Gemini, Perplexity, and Google AI Overviews, measuring citation share, factual accuracy, and GA4 AI referral traffic.',
      },
    ],
  },
  {
    slug: 'local-seo-rustenburg-and-google-business-authority',
    category: 'Local Authority · North West & SA',
    title: 'Local SEO & Google Business Profile Blueprint for Rustenburg Service Businesses',
    subtitle:
      'Turn local searches across Tlhabane, Waterfall East, Phokeng, and North West into direct WhatsApp enquiries and phone calls.',
    directAnswer:
      'Dominating local search in Rustenburg requires a verified, actively updated Google Business Profile linked to a fast local landing page with matching NAP details, region-specific service pages, consistent 5-star client reviews, and Bing Places synchronisation so both Google Maps and ChatGPT Search recommend your company first.',
    publishedDate: 'November 14, 2026',
    updatedDate: 'November 20, 2026',
    readTime: '6 min read',
    authorName: 'Service Websites Editorial & Technical SEO Team',
    authorRole: 'Rustenburg Local Search & Conversion Strategists',
    reviewerName: 'Backed by 47+ Verified 5.0★ Google Client Reviews',
    keyTakeaways: [
      'Bing Places feeds search results used heavily by ChatGPT and Microsoft Copilot—never neglect it.',
      'Dedicated suburb and trade landing pages outperform single generic homepages for local intent.',
      'Direct WhatsApp and click-to-call routing turns mobile rankings into measurable quotes within seconds.',
    ],
    sections: [
      {
        heading: 'Why Local Authority Drives Both Clicks and AI Shortlists',
        paragraphs: [
          'When a Rustenburg homeowner or procurement manager asks Google or an AI assistant for a trusted contractor or web agency nearby, models look for hyper-local proof: street-level signals, authentic reviews mentioning specific suburbs, and fast mobile pages.',
          'At Service Websites Agency, every local campaign pairs technical site engineering with real Google Business Profile management and digital PR citations.',
        ],
        bulletPoints: [
          'Consistent NAP across Google Business Profile, Bing Places, and South African business directories.',
          'Dedicated industry and local pages answering real cost, turnaround, and compliance questions.',
          'Monthly GA4 and Search Console reporting focused on phone calls, WhatsApp chats, and form leads.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why does Bing Places matter for AI search optimisation?',
        answer:
          'Bing’s local index powers location discovery for Copilot and informs web-grounded local queries in ChatGPT, making Bing Places consistency essential alongside Google Business Profile.',
      },
      {
        question: 'How long does it take to see measurable Local SEO and AI visibility improvements?',
        answer:
          'Technical fixes and Google Business Profile enhancements often lift local map impressions within 3 to 6 weeks, while topical content clusters and digital PR compound organic and AI citations over 2 to 4 months.',
      },
    ],
  },
];

export const CANONICAL_ENTITY_FACTS = {
  legalName: 'Service Websites Agency (Pty) Ltd',
  brandName: 'Service Websites Agency',
  address: 'Moumo Street, Tlhabane, Rustenburg, 0309, North West, South Africa',
  phone: '060 137 5180 (+27 60 137 5180)',
  email: 'manager@servicewebsites.co.za',
  hours: 'Open 24 Hours (Monday – Sunday)',
  rating: '5.0 ★ across 47 verified Google reviews',
  kgmid: '/g/11nvhct_53',
  serviceAreas: 'Rustenburg · Tlhabane · Phokeng · Boitekong · Cashan · Waterfall East · Gauteng · Nationwide South Africa',
};
