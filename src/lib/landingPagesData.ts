/**
 * Service Websites Agency - 25 Comprehensive Landing Pages Data
 * Extracted and compiled from official landing pages zip distribution.
 */

export interface LandingPageItem {
  slug: string;
  title: string;
  category: 'Company' | 'Web Design' | 'Local SEO' | 'Software & Portals' | 'Industry Solutions';
  categoryGroup: 'company' | 'web-design' | 'seo' | 'software' | 'industries';
  metaDescription: string;
  badge: string;
  headline: string;
  subheadline: string;
  readTime: string;
  overview: string[];
  features: {
    title: string;
    description: string;
    iconName: string;
  }[];
  deliverables: string[];
  pricingEstimate: string;
  turnaroundTime: string;
  targetAudience: string;
  faq: {
    question: string;
    answer: string;
  }[];
  ctaHeading: string;
  ctaText: string;
}

export const LANDING_PAGES: LandingPageItem[] = [
  // 1. About Us
  {
    slug: 'about-us',
    title: 'About Service Websites Agency',
    category: 'Company',
    categoryGroup: 'company',
    metaDescription: 'Learn about Service Websites Agency in Rustenburg. We design high-converting websites and custom software for South African businesses.',
    badge: 'Rustenburg Web Agency',
    headline: 'Building Digital Engines for South African Businesses',
    subheadline: 'From our base in Tlhabane, Rustenburg to enterprises nationwide across South Africa, we bridge local service craftsmanship with modern web architecture.',
    readTime: '4 min read',
    overview: [
      'Service Websites Agency was established with a single, uncompromising vision: to give South African small businesses, contractors, and growing enterprises the same high-performing digital capabilities as global tech leaders.',
      'Headquartered in Moumo Street, Tlhabane, Rustenburg (North West Province), our team crafts ultra-responsive websites, local SEO architectures, and secure client portal systems that reliably turn search traffic into booked quotes and repeat revenue.',
      'Unlike generic design agencies that deliver static brochure pages, we engineer measurable business assets. Every project is configured with automated Google Business Profile linking, instant WhatsApp messaging pipelines, schema markup for local search dominance, and blazing-fast loading speeds on mobile data networks.'
    ],
    features: [
      {
        title: 'Rooted in Rustenburg & Nationwide Reach',
        description: 'Deep understanding of South African consumers, local markets, load shedding resilience, and mobile data speed constraints.',
        iconName: 'MapPin'
      },
      {
        title: '5.0-Star Google Verified Track Record',
        description: 'Over 47 verified 5-star Google client reviews endorsing our responsiveness, design precision, and transparent pricing.',
        iconName: 'Star'
      },
      {
        title: 'Engineering Beyond Templates',
        description: 'Handcrafted Next.js, React, Tailwind CSS, and cloud backends that out-perform bulky WordPress sites on every speed benchmark.',
        iconName: 'Zap'
      },
      {
        title: 'Integrated Client Management Portal',
        description: 'Our proprietary self-service client portal gives business owners real-time visibility into visitors, leads, and deliverables.',
        iconName: 'LayoutDashboard'
      }
    ],
    deliverables: [
      'Dedicated North West project manager',
      'Google Business Profile synchronization',
      'Mobile-first responsive UX/UI engineering',
      'WhatsApp direct quote booking integration',
      'Enterprise cloud hosting on fast local CDNs',
      'Continuous maintenance and security patching'
    ],
    pricingEstimate: 'Flexible project tiers from R3,500',
    turnaroundTime: '5 – 10 business days',
    targetAudience: 'South African entrepreneurs, local trade businesses, SMMEs, and corporate enterprises.',
    faq: [
      {
        question: 'Where is Service Websites Agency physically located?',
        answer: 'Our physical agency office is located on Moumo Street, Tlhabane, Rustenburg, 0309, North West Province, South Africa. We service clients locally in Rustenburg as well as nationwide.'
      },
      {
        question: 'Do you work with businesses outside Rustenburg?',
        answer: 'Yes! While Rustenburg and North West are our home base, over 60% of our clients operate across Gauteng, Pretoria, Johannesburg, Cape Town, and Durban.'
      }
    ],
    ctaHeading: 'Partner with a Verified Local Team',
    ctaText: 'Speak directly with our principal designers in Rustenburg to plan your website launch.'
  },

  // 2. Why Choose Us
  {
    slug: 'why-choose-us',
    title: 'Why Choose Service Websites Agency',
    category: 'Company',
    categoryGroup: 'company',
    metaDescription: 'Discover why South African companies choose Service Websites for web design, SEO, and software: 5.0 rating, zero bloat, and proven ROI.',
    badge: '100% Quality Guarantee',
    headline: 'Why South Africa’s Top Businesses Choose Us',
    subheadline: 'Speed, measurable quote conversion, transparent communication, and dedicated local support that never leaves you hanging.',
    readTime: '3 min read',
    overview: [
      'In a market crowded with overpriced agencies and abandoned freelancer projects, Service Websites delivers certainty. We treat your website not as an art project, but as your most productive 24/7 sales representative.',
      'Every site we build is tuned for conversion. From the placement of the WhatsApp floating trigger to one-tap tap-to-call buttons and high-speed mobile caching, we ensure zero friction between a prospect finding your business and requesting a quote.'
    ],
    features: [
      {
        title: 'PageSpeed 95+ Mobile Ratings',
        description: 'Optimized code bundles and WebP imagery that load instantly on 3G and 4G South African cellular connections.',
        iconName: 'Zap'
      },
      {
        title: 'No Lock-in & Full Ownership',
        description: 'You own 100% of your domain, codebase, database, and assets. No captive retainer traps or hidden licensing fees.',
        iconName: 'Shield'
      },
      {
        title: 'Local SEO Grounding Included',
        description: 'We don’t just build pages; we configure your Google Business Profile, LocalBusiness Schema JSON-LD, and geographic meta-tags.',
        iconName: 'Globe'
      },
      {
        title: 'Direct WhatsApp Support',
        description: 'Quick human response directly from our tech leads for updates, email accounts, and content modifications.',
        iconName: 'MessageCircle'
      }
    ],
    deliverables: [
      'Guaranteed on-time project delivery',
      'Interactive client dashboard access',
      'PayFast & Ozow payment gateway setup',
      'Full source code repository handover',
      'Free 30-day post-launch warranty support'
    ],
    pricingEstimate: 'Transparent quotes with zero hidden extras',
    turnaroundTime: 'Average 7 working days',
    targetAudience: 'Companies requiring dependable, high-yield digital presence without technical jargon.',
    faq: [
      {
        question: 'What makes your websites faster than WordPress?',
        answer: 'We build with modern frameworks like Vite, React, and server-rendered HTML rather than heavy WordPress plugins that slow down mobile load times.'
      }
    ],
    ctaHeading: 'Experience the Service Websites Advantage',
    ctaText: 'Schedule a discovery discussion or visit our Rustenburg studio.'
  },

  // 3. Our Clients
  {
    slug: 'our-clients',
    title: 'Our Clients & Success Stories',
    category: 'Company',
    categoryGroup: 'company',
    metaDescription: 'Case studies and proven track record of Service Websites Agency across South Africa. See our work for plumbers, builders, and retailers.',
    badge: 'Real Case Studies',
    headline: 'Proven Results for South African Business Leaders',
    subheadline: 'Browse client engagements spanning trades, retail, medical practices, law firms, and engineering contractors across the country.',
    readTime: '4 min read',
    overview: [
      'Our portfolio reflects the backbone of the South African economy. From regional plumbing contractors in Rustenburg needing 24-hour emergency booking funnels to national e-commerce retailers handling thousands of monthly orders, our work speaks through client revenue.',
      'Explore live client deployments, technical specifications, and before-and-after conversion benchmarks that demonstrate our agency impact.'
    ],
    features: [
      {
        title: 'Apex Apparel Headless E-Commerce',
        description: 'Custom luxury fashion storefront delivering 99+ mobile score and seamless PayFast checkout.',
        iconName: 'ShoppingBag'
      },
      {
        title: 'Lumina Health Patient Portal',
        description: 'HIPAA-compliant patient directory and booking platform serving 12 healthcare clinics.',
        iconName: 'Shield'
      },
      {
        title: 'Vance Logistics Tracking Portal',
        description: 'Real-time fleet tracking and quote generator processing hundreds of freight requests weekly.',
        iconName: 'Navigation'
      },
      {
        title: 'Rustenburg Trade Contractors',
        description: 'Over 15 local North West service tradesmen ranked in Google’s top 3 map results.',
        iconName: 'CheckCircle2'
      }
    ],
    deliverables: [
      'Live website and mobile application links',
      'Documented ROI and visitor growth metrics',
      'Client references available upon request',
      'Comprehensive case study breakdowns'
    ],
    pricingEstimate: 'Custom solutions scaled to your ambitions',
    turnaroundTime: 'Varies by engagement scope',
    targetAudience: 'Prospective clients seeking verifiable proof of excellence before commissioning a build.',
    faq: [
      {
        question: 'Can I speak with a past client before hiring you?',
        answer: 'Yes, we are happy to introduce you to past clients who have agreed to act as business references.'
      }
    ],
    ctaHeading: 'Add Your Business to Our Success Roster',
    ctaText: 'Let us build a case-study worthy website for your company.'
  },

  // 4. Use Cases
  {
    slug: 'use-cases',
    title: 'Use Cases & Practical Applications',
    category: 'Company',
    categoryGroup: 'company',
    metaDescription: 'Explore practical use cases for Service Websites Agency: emergency service dispatch, quote calculators, e-commerce, and client portals.',
    badge: 'Applied Solutions',
    headline: 'Solving Real Business Bottlenecks with Digital Architecture',
    subheadline: 'Whether replacing paper quote sheets or automating client file sharing, we engineer digital solutions that reduce overhead.',
    readTime: '3 min read',
    overview: [
      'Modern businesses face complex operational friction: lost quote requests on WhatsApp, slow email back-and-forth, manual invoice tracking, and poor Google rankings that surrender market share to competitors.',
      'We design specific solutions designed around South African workflows, offline realities, and high-converting mobile interactions.'
    ],
    features: [
      {
        title: 'Instant Quote Calculators',
        description: 'Allow customers to specify square meters, room counts, or service tiers and receive an estimated quote immediately.',
        iconName: 'DollarSign'
      },
      {
        title: 'WhatsApp Dispatch Pipelines',
        description: 'Route website leads directly into your WhatsApp Business with pre-filled customer details and location data.',
        iconName: 'MessageCircle'
      },
      {
        title: 'Self-Service Client Portals',
        description: 'Allow clients to log in securely, download invoices, review project milestones, and access shared Google Drive files.',
        iconName: 'LayoutDashboard'
      },
      {
        title: 'Automated Review Generation',
        description: 'Trigger follow-up prompts encouraging satisfied clients to leave 5-star Google Business Profile reviews.',
        iconName: 'Star'
      }
    ],
    deliverables: [
      'Tailored business workflow mapping',
      'Custom interactive calculators and forms',
      'CRM and WhatsApp integration hooks',
      'Team onboarding walkthrough'
    ],
    pricingEstimate: 'Priced per feature module',
    turnaroundTime: '1 – 2 weeks',
    targetAudience: 'Service providers wanting to automate manual quote handling and administrative time.',
    faq: [
      {
        question: 'Can website quote forms connect to our accounting system?',
        answer: 'Yes, we integrate forms and booking calculators with platforms like Xero, QuickBooks, Google Sheets, and custom databases.'
      }
    ],
    ctaHeading: 'Solve Your Biggest Administrative Headache',
    ctaText: 'Describe your current operational bottleneck and we will design a digital fix.'
  },

  // 5. Website Cost Survey South Africa 2026
  {
    slug: 'website-cost-survey-south-africa-2026',
    title: 'Website Cost Survey South Africa (2026)',
    category: 'Company',
    categoryGroup: 'company',
    metaDescription: 'Comprehensive 2026 South Africa website pricing survey. What does a website cost in ZAR? Compare starter sites, e-commerce, and custom portals.',
    badge: '2026 Pricing Benchmark',
    headline: 'How Much Does a Website Cost in South Africa in 2026?',
    subheadline: 'A transparent market analysis of web design rates, hosting costs, e-commerce platforms, and SEO investments in South Africa.',
    readTime: '6 min read',
    overview: [
      'Understanding fair web development pricing in South Africa is notoriously difficult. Quotes for an identical 5-page website can range from R1,500 on gumtree to R45,000 from large Sandton ad agencies.',
      'Based on data from over 180 South African web projects and regional agencies, our 2026 Industry Cost Benchmark breaks down standard market rates for starter websites, trade contractor funnels, e-commerce storefronts, and enterprise portals.'
    ],
    features: [
      {
        title: 'Starter Business Websites (R3,500 – R6,500)',
        description: 'Ideal for trades and local businesses. 3–5 pages, mobile responsive, WhatsApp button, and basic local SEO setup.',
        iconName: 'Globe'
      },
      {
        title: 'Growth & Trade Websites (R6,500 – R12,000)',
        description: 'Includes multi-location SEO, photo galleries, quote calculators, Google Business optimization, and fast cloud hosting.',
        iconName: 'Zap'
      },
      {
        title: 'E-Commerce Online Stores (R10,000 – R25,000)',
        description: 'Full product catalogs, PayFast/Ozow/Yoco checkout, inventory tracking, courier API sync (Courier Guy, Fastway), and cart recovery.',
        iconName: 'ShoppingBag'
      },
      {
        title: 'Custom Web Apps & Portals (R18,000 – R50,000+)',
        description: 'User logins, database backends, client self-service hubs, real-time analytics, and bespoke business workflows.',
        iconName: 'LayoutDashboard'
      }
    ],
    deliverables: [
      'Itemized price-to-value comparison table',
      'Ongoing monthly cost breakdown (Hosting: R150–R450/mo)',
      'Hidden fee warning checklist (Domain renewals, licenses)',
      'Agency vs Freelancer vs DIY Builder analysis'
    ],
    pricingEstimate: 'Free industry research guide',
    turnaroundTime: 'Instant read',
    targetAudience: 'Business owners budgeting for website upgrades who want to avoid getting ripped off.',
    faq: [
      {
        question: 'Why are cheap R1,000 websites usually a trap?',
        answer: 'Ultra-cheap sites typically use pirated WordPress themes, lack SSL security, load too slowly for mobile users, and are abandoned with no post-launch support or SEO.'
      },
      {
        question: 'What are the ongoing monthly costs of owning a website in South Africa?',
        answer: 'Expect R150 to R350/month for fast local cloud hosting with business emails, plus R150 to R250/year for .co.za domain registration.'
      }
    ],
    ctaHeading: 'Get an Honest, Fixed-Price Quote',
    ctaText: 'We provide itemized, all-inclusive proposals with no surprise fees.'
  },

  // 6. Website Design Rustenburg
  {
    slug: 'website-design-rustenburg',
    title: 'Website Design Rustenburg',
    category: 'Web Design',
    categoryGroup: 'web-design',
    metaDescription: 'Top-rated website design agency in Rustenburg, North West. Custom, high-speed websites that rank on Google and win local customers.',
    badge: 'Rustenburg #1 Agency',
    headline: 'Modern, High-Speed Website Design in Rustenburg',
    subheadline: 'Crafted right here in Rustenburg for local mining contractors, service providers, retail shops, and professional firms.',
    readTime: '4 min read',
    overview: [
      'Rustenburg is one of the most vibrant economic centers in South Africa, driven by mining, manufacturing, construction, and independent trades. Yet countless local businesses still rely on outdated Facebook pages or invisible websites.',
      'Service Websites Agency is Rustenburg’s premier web design partner. We design distinctive websites with high local search visibility, helping you stand out in Tlhabane, Boitekong, Geelhoutpark, Cashan, Waterfall Mall precinct, and greater North West.'
    ],
    features: [
      {
        title: 'Geotargeted Rustenburg SEO',
        description: 'Engineered to rank for high-intent searches like "best contractor in Rustenburg" and "Rustenburg 24hr services".',
        iconName: 'MapPin'
      },
      {
        title: 'Mobile-Optimized for North West Users',
        description: 'Loads in under 1.2 seconds on all cellular networks with lightweight code and optimized visual assets.',
        iconName: 'Zap'
      },
      {
        title: 'Local Google Map Embed & Profile Sync',
        description: 'Directly linked with your verified Google Business Profile to build local social proof and trust.',
        iconName: 'Globe'
      },
      {
        title: 'Instant WhatsApp Callout Buttons',
        description: 'Enables Rustenburg residents and procurement officers to tap one button and chat directly with your dispatch.',
        iconName: 'MessageCircle'
      }
    ],
    deliverables: [
      'Custom website tailored to your brand identity',
      'Rustenburg LocalBusiness JSON-LD Schema',
      'Integration with Moumo Street studio support team',
      'Business email accounts (@yourbusiness.co.za)',
      'High-speed SSD hosting and SSL security'
    ],
    pricingEstimate: 'Starter packages from R3,900',
    turnaroundTime: '5 – 7 business days',
    targetAudience: 'Rustenburg business owners, contractors, medical suites, and retail storefronts.',
    faq: [
      {
        question: 'Can I meet with your team in person in Rustenburg?',
        answer: 'Yes! We are located in Tlhabane, Rustenburg. We welcome local business owners for an in-person briefing or can visit your premises.'
      }
    ],
    ctaHeading: 'Dominate the Rustenburg Market Today',
    ctaText: 'Contact our local Rustenburg design team for an obligation-free consultation.'
  },

  // 7. Website Design South Africa
  {
    slug: 'website-design-south-africa',
    title: 'Website Design South Africa',
    category: 'Web Design',
    categoryGroup: 'web-design',
    metaDescription: 'Professional website design services across South Africa. Fast, secure, modern web engineering for Johannesburg, Pretoria, Cape Town, and Durban.',
    badge: 'Nationwide Delivery',
    headline: 'Nationwide Website Design for Modern South African Brands',
    subheadline: 'World-class frontend engineering, conversion-centered UX, and reliable cloud infrastructure built for the South African commercial landscape.',
    readTime: '4 min read',
    overview: [
      'South African consumers are overwhelmingly mobile-first, value-conscious, and impatient with clunky, slow-loading websites. A modern South African website must be lightweight, load instantly on mobile networks, and offer immediate payment and communication options.',
      'Service Websites Agency delivers full-stack web solutions across all nine provinces. We build digital assets that outshine competitors in major metros as well as regional hubs.'
    ],
    features: [
      {
        title: 'National & Multi-City SEO Structures',
        description: 'Dynamic location landing pages that allow your company to rank across Johannesburg, Pretoria, Durban, and Cape Town.',
        iconName: 'Globe'
      },
      {
        title: 'Seamless South African Payments',
        description: 'Pre-configured integrations with PayFast, Ozow, Yoco, Netcash, and Capitec Pay for frictionless transactions.',
        iconName: 'DollarSign'
      },
      {
        title: 'POPIA & Privacy Compliance',
        description: 'Built-in cookie consents, secure form data handling, and privacy policies aligned with South African POPIA regulations.',
        iconName: 'Shield'
      },
      {
        title: 'High-Availability Local Hosting',
        description: 'Hosted on top-tier Teraco Johannesburg & Cape Town data center nodes for low-latency browsing.',
        iconName: 'Zap'
      }
    ],
    deliverables: [
      'Full-stack responsive design across all devices',
      'Comprehensive Google Analytics 4 integration',
      'Automated sitemap submissions to Google Search Console',
      'Branded client portal access'
    ],
    pricingEstimate: 'Standard builds from R4,500 – R14,500',
    turnaroundTime: '7 – 12 working days',
    targetAudience: 'South African companies scaling regionally or nationally.',
    faq: [
      {
        question: 'How do we coordinate projects remotely across South Africa?',
        answer: 'We maintain clear, organized workflows via WhatsApp, Google Meet, and our real-time client management portal.'
      }
    ],
    ctaHeading: 'Build Your Brand Nationwide',
    ctaText: 'Let us build a web presence that elevates your South African market position.'
  },

  // 8. Local SEO Rustenburg
  {
    slug: 'local-seo-rustenburg',
    title: 'Local SEO Rustenburg',
    category: 'Local SEO',
    categoryGroup: 'seo',
    metaDescription: 'Get your Rustenburg business to #1 on Google. Local SEO, Google Business Profile ranking, local citations, and map pack dominance.',
    badge: '#1 Google Map Rankings',
    headline: 'Win the Google 3-Pack in Rustenburg',
    subheadline: 'When customers in Rustenburg search for your service, make sure your phone rings first — not your competitors.',
    readTime: '4 min read',
    overview: [
      'Over 78% of local service inquiries in Rustenburg now start on a smartphone searching Google Maps or typing "service near me". If your business does not appear in the top 3 Google Map pack results, you are losing valuable customers every single day.',
      'Our dedicated Local SEO Rustenburg framework combines Google Business Profile auditing, local citation cleanup, geo-tagged photo uploads, review velocity campaigns, and localized on-page schema markup.'
    ],
    features: [
      {
        title: 'Google Business Profile Master Optimization',
        description: 'Complete category selection, service menu structuring, operating hours verification, and link synchronization.',
        iconName: 'MapPin'
      },
      {
        title: 'Rustenburg Citations & Directories',
        description: 'Consistent NAP (Name, Address, Phone) citations across Brabys, Yellow Pages SA, Hotfrog, and local chambers.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Local Keyword Dominance',
        description: 'Targeted ranking for high-value phrases across Rustenburg, Tlhabane, Phokeng, and surrounding mining communities.',
        iconName: 'Search'
      },
      {
        title: '5-Star Review Generation Strategy',
        description: 'Proven automated workflows to turn happy customers into verified 5-star Google reviews consistently.',
        iconName: 'Star'
      }
    ],
    deliverables: [
      'Comprehensive local rank tracking dashboard',
      'Google Maps listing optimization report',
      'Localized content optimization for core service pages',
      'Direct link to your verified Google profile'
    ],
    pricingEstimate: 'Setup from R2,800 or monthly growth retainer',
    turnaroundTime: 'Initial rollout within 5 days',
    targetAudience: 'Plumbers, mechanics, electricians, clinics, restaurants, and contractors in Rustenburg.',
    faq: [
      {
        question: 'How long does it take to rank on Google Maps in Rustenburg?',
        answer: 'Most clients see noticeable ranking jumps within 3 to 6 weeks, with competitive categories achieving top 3 status within 60 to 90 days.'
      }
    ],
    ctaHeading: 'Claim Top Spot in Rustenburg Google Maps',
    ctaText: 'Request a free Local SEO audit of your current Google Business presence.'
  },

  // 9. Local SEO South Africa
  {
    slug: 'local-seo-south-africa',
    title: 'Local SEO South Africa',
    category: 'Local SEO',
    categoryGroup: 'seo',
    metaDescription: 'Dominant Local SEO strategies across South Africa. Multi-location ranking, Google Business Profile management, and regional citations.',
    badge: 'Multi-City SEO',
    headline: 'Multi-Location Local SEO Across South Africa',
    subheadline: 'Rank in multiple suburbs, cities, and provinces simultaneously with structured geographic schema and local citation networks.',
    readTime: '4 min read',
    overview: [
      'For companies servicing multiple branches across Gauteng, North West, KwaZulu-Natal, and the Western Cape, generic SEO is ineffective. You need surgical, localized landing pages and synchronized Google Business Profiles for every branch.',
      'We build scalable Local SEO architectures that establish localized authority in every market you serve.'
    ],
    features: [
      {
        title: 'Sub-location Landing Page Architecture',
        description: 'Dedicated, non-duplicate neighborhood and city landing pages optimized for localized search intent.',
        iconName: 'Globe'
      },
      {
        title: 'Hierarchical Schema Markup',
        description: 'Structured Organization and LocalBusiness data that helps search engine spiders index your multi-branch footprint.',
        iconName: 'Zap'
      },
      {
        title: 'National Citation Distribution',
        description: 'Placement across major South African trade and commercial directories with perfect NAP alignment.',
        iconName: 'Shield'
      },
      {
        title: 'Competitor Gap Exploitation',
        description: 'Identify high-intent local search queries that your regional competitors are neglecting.',
        iconName: 'Search'
      }
    ],
    deliverables: [
      'Multi-branch Google Business configuration',
      'Quarterly local visibility audits',
      'Localized content writing for target cities',
      'Rank tracking by GPS coordinates'
    ],
    pricingEstimate: 'Tailored to branch network size',
    turnaroundTime: 'Ongoing monthly momentum',
    targetAudience: 'Franchises, security firms, field service companies, and expanding national brands.',
    faq: [
      {
        question: 'Can we rank in cities where we do not have a physical storefront?',
        answer: 'Yes, through properly configured Service Area Business (SAB) profiles and specialized geographic landing pages.'
      }
    ],
    ctaHeading: 'Scale Your Local Search Footprint',
    ctaText: 'Let us map out a multi-city Local SEO roadmap for your South African business.'
  },

  // 10. E-Commerce Website South Africa
  {
    slug: 'ecommerce-website-south-africa',
    title: 'E-Commerce Websites South Africa',
    category: 'Web Design',
    categoryGroup: 'web-design',
    metaDescription: 'High-converting online store design in South Africa. PayFast, Ozow, Courier Guy API integration, and mobile checkout optimization.',
    badge: 'Online Store Experts',
    headline: 'High-Converting Online Stores Built for South Africa',
    subheadline: 'Sell products 24/7 with instant PayFast/Ozow checkout, automated courier dispatch, and blazing-fast mobile catalog browsing.',
    readTime: '5 min read',
    overview: [
      'South African e-commerce is booming, but shoppers quickly abandon online stores with slow image loading, confusing checkouts, or unfamiliar payment gateways. Your store must provide immediate trust and frictionless payments.',
      'We build modern, headless and high-performance e-commerce storefronts tailored to South African retail habits, integrated directly with local couriers and payment gateways.'
    ],
    features: [
      {
        title: 'South African Payment Gateways',
        description: 'Support PayFast, Ozow Instant EFT, Capitec Pay, Yoco, and Mobicred right out of the box.',
        iconName: 'DollarSign'
      },
      {
        title: 'Automated Courier Guy & Fastway Shipping',
        description: 'Real-time shipping rate calculation and waybill label generation for seamless parcel fulfillment.',
        iconName: 'Navigation'
      },
      {
        title: 'Lightning Mobile Catalog Experience',
        description: 'Instant search filtering, product variants, and sub-second page transitions that keep customers browsing.',
        iconName: 'ShoppingBag'
      },
      {
        title: 'Abandoned Cart Recovery on WhatsApp & Email',
        description: 'Automatically nudge shoppers who left items in their cart to recover 15–25% in lost sales.',
        iconName: 'MessageCircle'
      }
    ],
    deliverables: [
      'Complete product catalog setup and category tagging',
      'Secure SSL encrypted checkout flow',
      'Inventory stock tracking with low-stock alerts',
      'Staff training on order fulfillment and coupon codes'
    ],
    pricingEstimate: 'Turnkey stores from R8,500 – R22,000',
    turnaroundTime: '10 – 18 business days',
    targetAudience: 'Fashion boutiques, wholesalers, hardware suppliers, and artisanal South African producers.',
    faq: [
      {
        question: 'Do I have to pay monthly transaction fees to you?',
        answer: 'Never. You only pay your standard gateway fee (e.g. PayFast or Yoco standard 2.5–3.5%). We take 0% of your revenue.'
      }
    ],
    ctaHeading: 'Launch Your South African Online Store',
    ctaText: 'Speak with our e-commerce specialists to review your product catalog and checkout requirements.'
  },

  // 11. Website Hosting South Africa
  {
    slug: 'website-hosting-south-africa',
    title: 'Website Hosting South Africa',
    category: 'Web Design',
    categoryGroup: 'web-design',
    metaDescription: 'Ultra-fast SSD website hosting in South Africa. Hosted in Teraco data centers with 99.9% uptime, free SSL, and daily cloud backups.',
    badge: 'Teraco Cloud Servers',
    headline: 'High-Speed Local Cloud Hosting in South Africa',
    subheadline: 'Host your website close to your customers with sub-30ms latency, zero overseas lag, and load-shedding resilient data center power.',
    readTime: '3 min read',
    overview: [
      'Hosting your South African website on cheap shared servers in North America or Europe adds 200–400ms of lag to every single tap. For mobile users in Rustenburg, Johannesburg, or Cape Town, that delay kills conversions.',
      'Our managed hosting cluster is deployed directly in Johannesburg and Cape Town Teraco internet exchanges, powered by redundant diesel generators and Tier-3 infrastructure.'
    ],
    features: [
      {
        title: 'NVMe SSD Storage Drives',
        description: 'Up to 10x faster disk read/write speeds compared to standard shared hard drives.',
        iconName: 'Zap'
      },
      {
        title: 'Free Automated SSL Certificates',
        description: 'Every domain receives free auto-renewing Let’s Encrypt HTTPS certificates for secure browsing.',
        iconName: 'Shield'
      },
      {
        title: 'Daily Automated Cloud Backups',
        description: 'Nightly snapshots stored off-site so your website can be restored in minutes if ever needed.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Custom Business Email Accounts',
        description: 'Professional @yourbusiness.co.za webmail with spam filtering, DKIM, SPF, and mobile sync.',
        iconName: 'Mail'
      }
    ],
    deliverables: [
      'DNS migration and domain transfer assistance',
      '99.9% network uptime SLA guarantee',
      'DDoS attack mitigation and firewall protection',
      'Direct support from our Rustenburg engineering desk'
    ],
    pricingEstimate: 'From R149/month or included in care plans',
    turnaroundTime: 'Activated same day',
    targetAudience: 'Any business wanting fast, secure, hassle-free South African website hosting.',
    faq: [
      {
        question: 'What happens to the servers during load shedding?',
        answer: 'Our infrastructure is housed in Tier-3 enterprise data centers with multi-megawatt diesel generators and UPS backups that run continuously through any stage of load shedding.'
      }
    ],
    ctaHeading: 'Migrate to Blazing-Fast Local Hosting',
    ctaText: 'We handle your domain and file migration with zero downtime.'
  },

  // 12. Website Maintenance Rustenburg
  {
    slug: 'website-maintenance-rustenburg',
    title: 'Website Maintenance Rustenburg',
    category: 'Web Design',
    categoryGroup: 'web-design',
    metaDescription: 'Reliable monthly website maintenance in Rustenburg. Plugin updates, security monitoring, speed tune-ups, and unlimited content tweaks.',
    badge: 'Monthly Peace of Mind',
    headline: 'Proactive Website Maintenance & Care in Rustenburg',
    subheadline: 'Keep your website secure, blazing fast, and always up-to-date while you focus on running your business.',
    readTime: '3 min read',
    overview: [
      'Websites are living digital assets. Left unmonitored, plugins break, security vulnerabilities emerge, outdated phone numbers turn customers away, and Google rankings quietly drop.',
      'Our monthly Rustenburg website care plans provide proactive updates, security auditing, and quick monthly content edits without expensive hourly charges.'
    ],
    features: [
      {
        title: 'Routine Core & Framework Updates',
        description: 'We test and apply all software updates in a sandbox environment before pushing live.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Security Scanning & Malware Removal',
        description: 'Continuous monitoring against brute-force logins, spam injections, and malicious redirects.',
        iconName: 'Shield'
      },
      {
        title: 'Monthly Content & Price Edits Included',
        description: 'Send us price updates, new project photos, or announcement banners via WhatsApp and we update them quickly.',
        iconName: 'Zap'
      },
      {
        title: 'Speed & Uptime Monitoring',
        description: 'Round-the-clock ping checks ensure immediate alerts and resolution if your site ever experiences an outage.',
        iconName: 'Clock'
      }
    ],
    deliverables: [
      'Monthly executive performance and traffic summary',
      'Quarterly Local SEO health checkup',
      'Priority emergency support channel',
      'Free staging site restorations'
    ],
    pricingEstimate: 'Plans from R450 to R1,250/month',
    turnaroundTime: 'Same-day turnaround for standard content requests',
    targetAudience: 'Business owners who want their website permanently handled by experts.',
    faq: [
      {
        question: 'Can you maintain a website that another agency built?',
        answer: 'Yes! We frequently take over, audit, and revitalize existing websites built on WordPress, Shopify, Webflow, or custom code.'
      }
    ],
    ctaHeading: 'Put Your Website on Autopilot',
    ctaText: 'Choose a monthly care tier and never worry about technical website issues again.'
  },

  // 13. Business Software South Africa
  {
    slug: 'business-software-south-africa',
    title: 'Business Software South Africa',
    category: 'Software & Portals',
    categoryGroup: 'software',
    metaDescription: 'Custom business software development in South Africa. Bespoke client management, workflow automation, and operational dashboards.',
    badge: 'Custom Engineering',
    headline: 'Bespoke Business Software Built for South African Operations',
    subheadline: 'Eliminate clunky spreadsheets and expensive US Dollar subscriptions with custom cloud software built for your exact workflow.',
    readTime: '5 min read',
    overview: [
      'Off-the-shelf software packages often force your business to adapt to their rigid rules, while charging punitive monthly fees in US Dollars that skyrocket as the Rand fluctuates.',
      'We build clean, robust custom business software: job cards, inventory trackers, dispatch portals, client databases, and automated reporting systems tailored to your specific operations.'
    ],
    features: [
      {
        title: 'Zero Per-User Licensing Traps',
        description: 'You own the software completely. Add 5 or 500 team members without paying punitive per-seat SaaS costs.',
        iconName: 'DollarSign'
      },
      {
        title: 'Cloud-Based with Offline Sync',
        description: 'Accessible on phone, tablet, and laptop anywhere in South Africa with local caching for spotty internet coverage.',
        iconName: 'Globe'
      },
      {
        title: 'Role-Based Team Access Control',
        description: 'Admin, manager, technician, and client permission levels ensure sensitive financial data remains protected.',
        iconName: 'Shield'
      },
      {
        title: 'Google Drive & Workspace Integration',
        description: 'Synchronize files, invoices, and job summaries directly to your company Google Drive storage automatically.',
        iconName: 'LayoutDashboard'
      }
    ],
    deliverables: [
      'Full technical architecture specification',
      'Secure PostgreSQL / Firestore database backing',
      'Tailored staff training and documentation',
      'Full source code handover'
    ],
    pricingEstimate: 'Projects from R15,000 – R45,000 depending on scope',
    turnaroundTime: '3 – 6 weeks in iterative sprints',
    targetAudience: 'Growing South African companies outgrowing Excel and generic software.',
    faq: [
      {
        question: 'Do we own the software code after completion?',
        answer: 'Yes, 100%. We transfer the complete source code and database architecture directly to your organization.'
      }
    ],
    ctaHeading: 'Build Software Built for Your Business',
    ctaText: 'Schedule a systems scoping discussion with our technical architect.'
  },

  // 14. Client Portal Software South Africa
  {
    slug: 'client-portal-software-south-africa',
    title: 'Client Portal Software South Africa',
    category: 'Software & Portals',
    categoryGroup: 'software',
    metaDescription: 'Custom client portal software in South Africa. Secure self-service logins, document downloads, project tracking, and live analytics.',
    badge: 'Self-Service Portals',
    headline: 'Elevate Your Client Experience with a Self-Service Portal',
    subheadline: 'Give your clients a branded 24/7 web portal to track project milestones, download invoices, review deliverables, and approve proposals.',
    readTime: '4 min read',
    overview: [
      'Answering repetitive client emails asking "What is the status of my project?" or "Can you resend last month’s invoice?" drains valuable team hours every week.',
      'Our custom Client Portal software gives your clients a private, secure, beautifully branded self-service hub, elevating your professional reputation.'
    ],
    features: [
      {
        title: 'Secure OTP & Google Sign-In',
        description: 'Frictionless passwordless authentication with email verification codes and one-tap Google login.',
        iconName: 'Shield'
      },
      {
        title: 'Real-Time Project Milestone Timelines',
        description: 'Clients track visual progress phases from planning through review and live handover.',
        iconName: 'Clock'
      },
      {
        title: 'Automated Document & Invoice Vault',
        description: 'Centralized access to proposals, contracts, tax invoices, and architectural drawings.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Real-Time Activity Feeds',
        description: 'Live timestamped log of project updates, file uploads, and milestone completions.',
        iconName: 'Zap'
      }
    ],
    deliverables: [
      'Custom branded portal deployed under portal.yourbusiness.co.za',
      'Admin management dashboard for team members',
      'Integrated Google Drive file backup synchronization',
      'Responsive design across mobile and desktop'
    ],
    pricingEstimate: 'Turnkey portal deployment from R9,500',
    turnaroundTime: '7 – 14 business days',
    targetAudience: 'Law practices, accounting firms, creative agencies, engineering consultancies, and construction managers.',
    faq: [
      {
        question: 'Can clients use the portal on their smartphones?',
        answer: 'Yes, our portals are progressive web apps that work smoothly on iPhone, Android, tablets, and laptops.'
      }
    ],
    ctaHeading: 'Give Your Clients a Modern Digital Hub',
    ctaText: 'Test-drive our client portal architecture or request a custom demo.'
  },

  // 15. CRM Software South Africa
  {
    slug: 'crm-software-south-africa',
    title: 'CRM Software South Africa',
    category: 'Software & Portals',
    categoryGroup: 'software',
    metaDescription: 'Lightweight, effective CRM software for South African businesses. Track leads, automate WhatsApp follow-ups, and close more deals.',
    badge: 'Lead Capture & CRM',
    headline: 'Simple, Powerful CRM Software Built for South African Sales',
    subheadline: 'Never lose another lead. Capture website inquiries, manage follow-up tasks, and track quote closing rates in one intuitive pipeline.',
    readTime: '4 min read',
    overview: [
      'Enterprise CRMs like Salesforce or HubSpot are overwhelmingly complex, laden with features your team will never use, and priced in punishing US Dollars.',
      'We design practical, visual CRM pipelines that South African sales teams actually enjoy using. Track every lead from website form submission to paid invoice.'
    ],
    features: [
      {
        title: 'Instant WhatsApp Lead Notification',
        description: 'Alert sales reps on WhatsApp the second a high-value quote request is submitted online.',
        iconName: 'MessageCircle'
      },
      {
        title: 'Kanban Sales Pipeline View',
        description: 'Drag and drop deals from New Lead to Quoted, Negotiating, Won, and Inactive with clear deal values.',
        iconName: 'LayoutDashboard'
      },
      {
        title: 'Customer Interaction History',
        description: 'Full log of phone calls, WhatsApp messages, sent estimates, and client notes in one place.',
        iconName: 'Clock'
      },
      {
        title: 'Conversion Rate Analytics',
        description: 'Real-time charts showing which marketing channels and team members close the highest percentage of deals.',
        iconName: 'Zap'
      }
    ],
    deliverables: [
      'Customized sales stages matching your sales cycle',
      'Automated email confirmation workflows',
      'CSV lead export and backup features',
      'User permissions for sales reps and management'
    ],
    pricingEstimate: 'Setup from R7,500 with zero monthly seat licensing',
    turnaroundTime: '7 – 10 working days',
    targetAudience: 'Sales-driven trade companies, solar installers, vehicle dealerships, and service providers.',
    faq: [
      {
        question: 'Can we import our existing customer contacts into the CRM?',
        answer: 'Yes, we provide easy one-click CSV and Excel import tools to transfer all your existing customer databases.'
      }
    ],
    ctaHeading: 'Close More Leads Every Single Week',
    ctaText: 'See how our lightweight CRM streamlines your sales pipeline.'
  },

  // 16. Project Management Software South Africa
  {
    slug: 'project-management-software-south-africa',
    title: 'Project Management Software South Africa',
    category: 'Software & Portals',
    categoryGroup: 'software',
    metaDescription: 'Field and project management software in South Africa. Track site tasks, budgets, deadlines, and deliverables in real time.',
    badge: 'Job & Project Tracking',
    headline: 'Manage Field Projects, Budgets & Deliverables Effortlessly',
    subheadline: 'From construction sites to digital deliverables, keep your entire team aligned with real-time project management dashboards.',
    readTime: '4 min read',
    overview: [
      'Running multiple simultaneous client jobs across different job sites or departments often leads to missed deadlines, budget overruns, and miscommunication.',
      'Our Project Management platform brings clarity. Track budgets, task assignments, milestone completions, and drive sync backups in a clean interface.'
    ],
    features: [
      {
        title: 'Interactive Project Tracking Grid',
        description: 'Filter projects by status (Planning, In Progress, In Review, Completed), client, and trade category.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Budget & Financial Overviews',
        description: 'Monitor individual job budgets and cumulative portfolio revenues with visual metrics.',
        iconName: 'DollarSign'
      },
      {
        title: 'Google Drive Project Auto-Backup',
        description: 'One-click export of entire project catalogs into dedicated Google Drive cloud folders with executive text reports.',
        iconName: 'LayoutDashboard'
      },
      {
        title: 'Real-Time Activity Audit Trail',
        description: 'Automatically logs every project update, completion, and profile change for full operational accountability.',
        iconName: 'Clock'
      }
    ],
    deliverables: [
      'Production-grade responsive dashboard application',
      'Configurable project statuses and metadata schemas',
      'Instant local JSON and Google Drive backup tools',
      'Real-time Firestore cloud database synchronization'
    ],
    pricingEstimate: 'Modular systems from R8,500',
    turnaroundTime: '1 – 2 weeks',
    targetAudience: 'Contractors, civil builders, creative studios, solar installers, and IT teams.',
    faq: [
      {
        question: 'Can this connect with Google Drive directly?',
        answer: 'Yes! Our system has built-in Google Drive API v3 integration that uploads project databases and summaries directly into your personal Drive.'
      }
    ],
    ctaHeading: 'Take Control of Project Delivery',
    ctaText: 'Deploy our proven project management framework for your team today.'
  },

  // 17. Website Design for Plumbers
  {
    slug: 'website-design-for-plumbers',
    title: 'Website Design for Plumbers',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'High-converting websites for plumbers in South Africa. 24/7 emergency burst pipe callouts, geyser replacement funnels, and local SEO.',
    badge: 'Plumbing Specialists',
    headline: 'High-Converting Websites for South African Plumbers',
    subheadline: 'When someone in your town has a burst geyser at 11 PM, make sure your website answers with a one-tap emergency callout button.',
    readTime: '4 min read',
    overview: [
      'Plumbing is fundamentally an urgent, local search business. Homeowners and property managers don’t browse leisurely; they have an emergency leak, blocked drain, or broken solar geyser and need immediate help.',
      'We engineer plumber websites designed for speed and urgency: prominent 24/7 emergency dispatch banners, direct WhatsApp location-sharing triggers, insurance compliance badges (PIRB), and top Local SEO rankings.'
    ],
    features: [
      {
        title: 'Instant 1-Tap Emergency Call Trigger',
        description: 'Fixed header with high-contrast emergency dial buttons so panicked homeowners connect in seconds.',
        iconName: 'Phone'
      },
      {
        title: 'Geyser & Drain Problem Selectors',
        description: 'Interactive checklists allowing clients to specify their emergency for faster dispatch triage.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Insurance & PIRB Compliance Trust Badges',
        description: 'Highlight certifications, liability insurance, and workmanship guarantees to justify premium rates.',
        iconName: 'Shield'
      },
      {
        title: 'Local Google 3-Pack SEO Dominance',
        description: 'Rank for high-intent queries like "emergency plumber near me" and "burst geyser replacement".',
        iconName: 'MapPin'
      }
    ],
    deliverables: [
      'Custom plumber website with emergency callout layout',
      'Service area radius map and suburbs breakdown',
      'WhatsApp live chat location share prompt',
      'Google Business Profile emergency hours configuration'
    ],
    pricingEstimate: 'Complete plumber packages from R4,200',
    turnaroundTime: '5 – 7 business days',
    targetAudience: 'Independent plumbers, plumbing contractors, and drain cleaning companies.',
    faq: [
      {
        question: 'Will this help us get more after-hours emergency calls?',
        answer: 'Yes! We configure dedicated 24-hour emergency landing pages and Google Business Profile emergency attributes specifically for night callouts.'
      }
    ],
    ctaHeading: 'Turn Emergencies into Profitable Callouts',
    ctaText: 'Get a website engineered specifically for South African plumbing contractors.'
  },

  // 18. Website Design for Electricians
  {
    slug: 'website-design-for-electricians',
    title: 'Website Design for Electricians',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Websites for electricians and solar installers in South Africa. Certificate of Compliance (COC) booking, solar backups, and local SEO.',
    badge: 'Electrical & Solar',
    headline: 'Websites for Electricians, Solar Installers & COC Specialists',
    subheadline: 'Win high-margin commercial contracts, solar backup installations, and domestic electrical work with a professional digital presence.',
    readTime: '4 min read',
    overview: [
      'With South Africa’s energy crisis, homeowners and factories are constantly searching for certified electricians for backup inverter installations, solar conversions, fault finding, and Certificates of Compliance (COC).',
      'We build electrician websites that project unassailable safety, technical authority, and prompt emergency availability.'
    ],
    features: [
      {
        title: 'COC Inspection Booking Funnel',
        description: 'Dedicated intake form for home sellers needing rapid electrical Certificates of Compliance.',
        iconName: 'Shield'
      },
      {
        title: 'Solar & Inverter ROI Estimator',
        description: 'Interactive questionnaire helping clients select the right battery and inverter capacity for their home.',
        iconName: 'Zap'
      },
      {
        title: 'DoL / ECA Registration Trust Seals',
        description: 'Prominently display Department of Labour and Electrical Conformance Board credentials.',
        iconName: 'CheckCircle2'
      },
      {
        title: '24/7 Power Failure Emergency Button',
        description: 'Direct WhatsApp link for urgent trippping breakers, storm damage, and industrial power failures.',
        iconName: 'Phone'
      }
    ],
    deliverables: [
      'Custom electrician website with solar service showcase',
      'Mobile-optimized quote calculator for wiring & solar',
      'Local SEO ranking architecture for residential & industrial',
      'Customer review showcase with 5-star Google integration'
    ],
    pricingEstimate: 'Packages from R4,500',
    turnaroundTime: '5 – 8 working days',
    targetAudience: 'Certified electricians, electrical contractors, and residential/commercial solar installers.',
    faq: [
      {
        question: 'Can we showcase both general electrical work and solar installations?',
        answer: 'Yes, we create dedicated siloed sections for general electrical maintenance, COC inspections, and commercial/residential solar.'
      }
    ],
    ctaHeading: 'Electrify Your Local Inbound Leads',
    ctaText: 'Speak with our team to launch your new electrical and solar website.'
  },

  // 19. Website Design for Builders
  {
    slug: 'website-design-for-builders',
    title: 'Website Design for Builders & Civil Contractors',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Websites for builders, civil contractors, and home renovators in South Africa. High-resolution project portfolios, tender profiles, and quote requests.',
    badge: 'Building & Construction',
    headline: 'Websites for Builders, Home Renovators & Civil Contractors',
    subheadline: 'Showcase completed developments, past builds, and building credentials to win high-value construction tenders and private builds.',
    readTime: '4 min read',
    overview: [
      'Clients investing hundreds of thousands of Rands into home building or commercial extensions demand deep credibility. They want to see past project galleries, structural guarantees, and NHBRC registration.',
      'We build construction websites featuring high-definition before-and-after project galleries, architectural specifications, and comprehensive tender-ready company profiles.'
    ],
    features: [
      {
        title: 'High-Resolution Project Portfolio Galleries',
        description: 'Filter builds by new homes, commercial extensions, paving, boundary walls, and renovations.',
        iconName: 'LayoutDashboard'
      },
      {
        title: 'NHBRC & CIDB Certification Badging',
        description: 'Highlight registration with the National Home Builders Registration Council to build immediate trust.',
        iconName: 'Shield'
      },
      {
        title: 'Detailed Plan Upload & Quote Intake',
        description: 'Allow clients and architects to upload PDF architectural plans directly for bill-of-quantities estimation.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Client Video & Photo Testimonials',
        description: 'Verified reviews from past home buyers and corporate clients endorsing build quality.',
        iconName: 'Star'
      }
    ],
    deliverables: [
      'Full architectural project gallery with zoomable imagery',
      'Downloadable corporate capability PDF brochure',
      'Quote request system with plan attachment support',
      'Local SEO targeting premium residential estates'
    ],
    pricingEstimate: 'Construction builds from R5,500 – R12,500',
    turnaroundTime: '7 – 12 business days',
    targetAudience: 'General building contractors, home renovators, civil engineering firms, and property developers.',
    faq: [
      {
        question: 'Can clients upload their architectural plans through the website?',
        answer: 'Yes! We configure secure document upload fields accepting PDF, DWG, and image files directly into your email and Google Drive.'
      }
    ],
    ctaHeading: 'Showcase Your Builds with Pride',
    ctaText: 'Request a proposal for your construction and building company website.'
  },

  // 20. Website Design for Contractors
  {
    slug: 'website-design-for-contractors',
    title: 'Website Design for Contractors',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Websites for trade contractors in South Africa: painters, roofers, landscapers, borehole drillers, and paving specialists.',
    badge: 'Trade Contractors',
    headline: 'High-Converting Websites for South African Trade Contractors',
    subheadline: 'Turn local searchers into booked on-site estimates with fast mobile websites designed for tradesmen and specialty contractors.',
    readTime: '4 min read',
    overview: [
      'Whether you specialize in borehole drilling, waterproofing, exterior painting, security fencing, or paving, word-of-mouth is no longer enough. Homeowners and facility managers verify your business online before inviting you onto their property.',
      'We design trade websites that present your equipment, team, past projects, and transparent guarantees with complete clarity.'
    ],
    features: [
      {
        title: 'Square Meter & Service Estimator',
        description: 'Simple interactive sliders allowing homeowners to calculate ballpark project estimates instantly.',
        iconName: 'DollarSign'
      },
      {
        title: 'Service Radius & Suburb Coverage',
        description: 'Clear maps highlighting the towns and suburbs your team travels to for free on-site inspections.',
        iconName: 'MapPin'
      },
      {
        title: 'WhatsApp Photo Inspection Uploads',
        description: 'Encourage clients to snap a photo of their roof leak or borehole site and send it directly for rapid quoting.',
        iconName: 'MessageCircle'
      },
      {
        title: 'Guaranteed Workmanship Badges',
        description: 'Highlight 5-year guarantees, SABS-approved materials, and prompt cleanup policies.',
        iconName: 'Shield'
      }
    ],
    deliverables: [
      'Fast-loading responsive contractor website',
      'Integrated WhatsApp quote request pipeline',
      'Google Business Profile integration and review link',
      'Full SEO optimization for your specialty trade'
    ],
    pricingEstimate: 'Turnkey trade packages from R3,900',
    turnaroundTime: '5 – 7 working days',
    targetAudience: 'Painters, roofers, borehole drillers, landscapers, welders, and paving contractors.',
    faq: [
      {
        question: 'Do you write the website copy for our trade?',
        answer: 'Yes! Our professional copywriters craft all the text, headlines, and service descriptions based on your trade specialties.'
      }
    ],
    ctaHeading: 'Keep Your Work Bakkies Busy Year-Round',
    ctaText: 'Get a contractor website that delivers consistent weekly estimate requests.'
  },

  // 21. Website Design for Construction Companies
  {
    slug: 'website-design-for-construction-companies',
    title: 'Website Design for Construction Companies',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Enterprise websites for construction, civil engineering, and plant hire firms in South Africa. CIDB compliance, safety records, and project sheets.',
    badge: 'Enterprise Construction',
    headline: 'Enterprise Websites for Civil & Construction Firms',
    subheadline: 'Position your construction firm to win municipal tenders, private commercial developments, and mining infrastructure contracts.',
    readTime: '5 min read',
    overview: [
      'Commercial developers, mine procurement managers, and government tender committees scrutinize your digital footprint. An unprofessional website can disqualify your firm before you even submit your tender documents.',
      'We engineer authoritative construction websites displaying CIDB grading, ISO safety certifications, plant equipment inventory, completed project sheets, and executive leadership profiles.'
    ],
    features: [
      {
        title: 'CIDB Grading & Compliance Showcase',
        description: 'Prominently display CIDB contractor gradings, BBBEE scorecard verification, and tax clearance certifications.',
        iconName: 'Shield'
      },
      {
        title: 'Fleet & Plant Equipment Directory',
        description: 'Showcase excavators, tippers, graders, and yellow metal plant available for contract work or hire.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Downloadable Project Fact Sheets',
        description: 'Generate clean PDF project summaries with contract values, client names, and scope specs.',
        iconName: 'LayoutDashboard'
      },
      {
        title: 'Health & Safety (OHS) Compliance Portal',
        description: 'Highlight zero-harm safety records, mine safety compliance, and environmental stewardship policies.',
        iconName: 'Zap'
      }
    ],
    deliverables: [
      'Corporate construction website with tender-ready architecture',
      'High-resolution heavy equipment and site photography display',
      'Executive team and corporate governance profiles',
      'Secure client and partner portal integration'
    ],
    pricingEstimate: 'Enterprise packages from R8,500 – R24,000',
    turnaroundTime: '10 – 20 business days',
    targetAudience: 'Medium to large construction firms, civil engineering contractors, and earthmoving/mining service providers.',
    faq: [
      {
        question: 'Can you include a career portal for site workers and engineers?',
        answer: 'Yes, we can build custom job application and CV upload forms directly into the website.'
      }
    ],
    ctaHeading: 'Elevate Your Corporate Construction Profile',
    ctaText: 'Schedule a discovery session with our commercial web design leads.'
  },

  // 22. Website Design for Cleaning Companies
  {
    slug: 'website-design-for-cleaning-companies',
    title: 'Website Design for Cleaning Companies',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Websites for residential and commercial cleaning companies in South Africa. Online booking forms, service checklists, and quote calculators.',
    badge: 'Cleaning & Hygiene',
    headline: 'Websites for Commercial & Residential Cleaning Services',
    subheadline: 'Attract lucrative commercial office cleaning contracts and residential deep-cleaning clients with an automated booking funnel.',
    readTime: '4 min read',
    overview: [
      'Cleaning businesses operate in a competitive market where trust, vetting, and ease of booking determine who wins the customer. Clients want to know your staff are vetted, what your checklist includes, and how quickly you can quote.',
      'We design fresh, sparkling websites for cleaning companies with instant square-meter quote forms, recurring contract options, and verified customer testimonials.'
    ],
    features: [
      {
        title: 'Instant Service Booking & Quote Calculator',
        description: 'Allow clients to select bedrooms, bathrooms, carpet square meters, or office square footage for instant pricing.',
        iconName: 'DollarSign'
      },
      {
        title: 'Vetted Staff & Trust Guarantees',
        description: 'Highlight background checks, staff training, eco-friendly chemicals, and public liability insurance.',
        iconName: 'Shield'
      },
      {
        title: 'Commercial Cleaning Contract Portal',
        description: 'Dedicated landing pages specifically targeting office parks, medical clinics, schools, and industrial facilities.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Before & After Transformation Sliders',
        description: 'Interactive visual sliders showcasing carpet cleaning, deep kitchen degreasing, and post-construction cleanups.',
        iconName: 'Zap'
      }
    ],
    deliverables: [
      'Complete cleaning service website with interactive booking funnel',
      'Detailed commercial and domestic service checklists',
      'WhatsApp direct inquiry integration',
      'Local SEO ranking for citywide cleaning searches'
    ],
    pricingEstimate: 'Turnkey cleaning packages from R3,900',
    turnaroundTime: '5 – 7 working days',
    targetAudience: 'Commercial contract cleaners, domestic maid services, carpet cleaning specialists, and hygiene providers.',
    faq: [
      {
        question: 'Can customers schedule recurring weekly or monthly cleanings?',
        answer: 'Yes, we configure recurring booking forms with frequency discounts (weekly, bi-weekly, monthly).'
      }
    ],
    ctaHeading: 'Fill Your Cleaning Schedule with Profitable Jobs',
    ctaText: 'Launch a cleaning company website that converts visitors into bookings.'
  },

  // 23. Website Design for Lawyers
  {
    slug: 'website-design-for-lawyers',
    title: 'Website Design for Lawyers & Law Firms',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Prestigious websites for attorneys, law firms, and advocates in South Africa. Practice area guides, confidential consultation bookings, and SEO.',
    badge: 'Legal & Attorneys',
    headline: 'Prestigious Websites for Attorneys & Legal Practices',
    subheadline: 'Establish professional authority, explain practice areas clearly, and capture confidential client consultation requests securely.',
    readTime: '4 min read',
    overview: [
      'Legal clients are often facing stressful, high-stakes decisions regarding commercial contracts, labor disputes, divorce, property conveyancing, or criminal matters. They seek supreme confidentiality, proven expertise, and reassuring professionalism.',
      'We design refined law firm websites with practice area guides, attorney biographical profiles, legal insights blog feeds, and POPIA-compliant encrypted consultation intake forms.'
    ],
    features: [
      {
        title: 'Confidential Consultation Intake Funnel',
        description: 'Secure, encrypted forms with conflict-of-interest disclaimers and confidential file upload support.',
        iconName: 'Shield'
      },
      {
        title: 'Comprehensive Practice Area Silos',
        description: 'Dedicated search-optimized pages for Conveyancing, Commercial Law, Labor Law, Litigation, and Estate Planning.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Attorney & Partner Credential Profiles',
        description: 'Showcase degrees (LLB, LLM), admissions to the High Court, Legal Practice Council registration, and case experience.',
        iconName: 'Star'
      },
      {
        title: 'Legal Knowledge Base & Article Feed',
        description: 'Demonstrate thought leadership with clean typography for publishing legal commentaries and South African law updates.',
        iconName: 'LayoutDashboard'
      }
    ],
    deliverables: [
      'Sophisticated, typographically elegant law firm website',
      'LPC regulatory compliance and legal disclaimer architecture',
      'End-to-end encrypted consultation booking funnel',
      'Local SEO for high-value attorney search queries'
    ],
    pricingEstimate: 'Legal firm packages from R5,500 – R16,000',
    turnaroundTime: '7 – 14 business days',
    targetAudience: 'Attorneys, conveyancers, labor consultants, mediators, and multi-partner law firms across South Africa.',
    faq: [
      {
        question: 'Are consultation forms compliant with POPIA and legal confidentiality?',
        answer: 'Yes. All data is transmitted over TLS 1.3 encrypted connections and can be routed exclusively to designated partner email addresses.'
      }
    ],
    ctaHeading: 'Position Your Practice as the Premier Legal Authority',
    ctaText: 'Speak with our design director to review sample law firm architectures.'
  },

  // 24. Website Design for Restaurants
  {
    slug: 'website-design-for-restaurants',
    title: 'Website Design for Restaurants & Food Outlets',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Mouthwatering websites for restaurants, cafes, and food franchises in South Africa. Mobile digital menus, table bookings, and food ordering.',
    badge: 'Hospitality & Dining',
    headline: 'Mouthwatering Websites for Restaurants & Dining Spots',
    subheadline: 'Fill your dining room and drive takeout orders with interactive mobile menus, direct table reservations, and seamless WhatsApp ordering.',
    readTime: '4 min read',
    overview: [
      'Hungry patrons searching on their smartphones won’t struggle with awkward PDF downloads to view a menu. If your menu isn’t instantly readable on mobile, they’ll simply pick another restaurant.',
      'We craft appetizing restaurant websites featuring interactive mobile menus with dietary filters (Halal, vegan, gluten-free), live table booking widgets, and zero-commission WhatsApp takeaway order funnels.'
    ],
    features: [
      {
        title: 'Mobile-Optimized Interactive Digital Menus',
        description: 'Crisp, categorized food and beverage menus with appetizing imagery, prices, and allergen badges that load in milliseconds.',
        iconName: 'ShoppingBag'
      },
      {
        title: 'Zero-Commission Table Reservations',
        description: 'Direct table booking form that sends reservations straight to your manager’s phone or WhatsApp without paying third-party booking fees.',
        iconName: 'Clock'
      },
      {
        title: 'WhatsApp Takeaway Ordering Funnel',
        description: 'Patrons select meals, tap order, and generate a pre-formatted WhatsApp order message ready for kitchen preparation.',
        iconName: 'MessageCircle'
      },
      {
        title: 'Google Maps & Operating Hours Integration',
        description: 'Synchronized with your Google Business Profile so diners always know your kitchen closing times and exact address.',
        iconName: 'MapPin'
      }
    ],
    deliverables: [
      'Visually appetizing restaurant website with photography display',
      'Digital QR-code ready mobile menu system',
      'Special events, functions, and catering booking forms',
      'Google Maps local dining SEO configuration'
    ],
    pricingEstimate: 'Restaurant packages from R4,200',
    turnaroundTime: '5 – 7 business days',
    targetAudience: 'Restaurants, cafes, bistros, steakhouses, food trucks, and catering companies.',
    faq: [
      {
        question: 'Can we easily update our menu prices and daily specials ourselves?',
        answer: 'Yes! We provide an effortless menu management screen where your team can adjust prices, add seasonal dishes, or mark items as sold out in seconds.'
      }
    ],
    ctaHeading: 'Turn Hungry Searchers into Loyal Diners',
    ctaText: 'Launch an appetizing website that drives bookings every night of the week.'
  },

  // 25. Website Design for Small Businesses
  {
    slug: 'website-design-for-small-businesses',
    title: 'Website Design for Small Businesses',
    category: 'Industry Solutions',
    categoryGroup: 'industries',
    metaDescription: 'Affordable, high-converting websites for South African SMMEs and small businesses. Mobile-friendly, fast setup, and built for growth.',
    badge: 'SMME Growth Engine',
    headline: 'High-Impact, Affordable Websites for South African SMMEs',
    subheadline: 'Everything your small business needs to look professional, get found on Google, and start generating customer inquiries online.',
    readTime: '4 min read',
    overview: [
      'Small business owners wear every hat: sales, operations, customer support, and administration. You don’t have time to wrestle with complicated website builders or waste money on agency fluff.',
      'Our Small Business package is streamlined, proven, and cost-effective. We handle everything from domain registration and copywriting to design, local SEO, and WhatsApp buttons so you can focus on serving your customers.'
    ],
    features: [
      {
        title: 'Turnkey All-in-One Setup',
        description: 'We handle the domain name, hosting, copywriting, mobile design, and Google setup. Zero technical knowledge required on your end.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Budget-Friendly Investment',
        description: 'Clear, transparent pricing designed specifically for South African small business cash flows.',
        iconName: 'DollarSign'
      },
      {
        title: 'Instant WhatsApp Customer Communication',
        description: 'Allows potential customers to message you immediately while browsing on their phones.',
        iconName: 'MessageCircle'
      },
      {
        title: 'Google Map & Business Profile Setup Included',
        description: 'We register and verify your business on Google Maps so local neighbors can find your shop or service.',
        iconName: 'MapPin'
      }
    ],
    deliverables: [
      'Professional 3 to 5 page business website',
      '.co.za domain registration and 1 year included',
      'Professional business email address (@yourbrand.co.za)',
      'Free 1-on-1 walkthrough showing you how everything works'
    ],
    pricingEstimate: 'All-inclusive small business packages from R3,500',
    turnaroundTime: '5 working days',
    targetAudience: 'Sole proprietors, family businesses, consultants, local shops, and emerging entrepreneurs across South Africa.',
    faq: [
      {
        question: 'What do I need to provide to get started?',
        answer: 'Just your logo (if you have one), a brief summary of what services or products you offer, and your contact details. We handle all the technical design and copywriting!'
      }
    ],
    ctaHeading: 'Give Your Small Business the Digital Presence It Deserves',
    ctaText: 'Contact our friendly team today to start your small business website.'
  }
];

export const LANDING_PAGE_CATEGORIES = [
  {
    name: 'Company & Trust',
    group: 'company' as const,
    description: 'Learn about our agency, team, guarantees, and verified South African track record.',
    pages: LANDING_PAGES.filter((p) => p.categoryGroup === 'company')
  },
  {
    name: 'Web Design & Hosting',
    group: 'web-design' as const,
    description: 'Custom, high-speed web design, e-commerce stores, and high-availability SSD hosting.',
    pages: LANDING_PAGES.filter((p) => p.categoryGroup === 'web-design')
  },
  {
    name: 'Local SEO & Maps',
    group: 'seo' as const,
    description: 'Rank #1 on Google in Rustenburg and nationwide across South Africa with Google Business Profile SEO.',
    pages: LANDING_PAGES.filter((p) => p.categoryGroup === 'seo')
  },
  {
    name: 'Software & Portals',
    group: 'software' as const,
    description: 'Custom software, self-service client portals, lightweight CRMs, and project tracking tools.',
    pages: LANDING_PAGES.filter((p) => p.categoryGroup === 'software')
  },
  {
    name: 'Industry Solutions',
    group: 'industries' as const,
    description: 'Bespoke web design tailored to plumbers, electricians, builders, contractors, lawyers, and cleaners.',
    pages: LANDING_PAGES.filter((p) => p.categoryGroup === 'industries')
  }
];
