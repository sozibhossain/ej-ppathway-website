/**
 * Shared TypeScript types for the website.
 * Loose — matches the SiteContent schema shapes one-to-one.
 */

export type LinkValue = { label?: string; href?: string };
export type Step = { icon?: string; title?: string; description?: string };
export type CardItem = { icon?: string; title?: string; description?: string; image?: string; href?: string };
export type StatItem = { value?: string; label?: string };

export type NavItem = { label: string; href: string };

export type GlobalSections = {
  siteName?: string;
  logo?: string;
  logoDark?: string;
  nav?: NavItem[];
  auth?: { loginLabel?: string; signupLabel?: string };
  footer?: {
    tagline?: string;
    columns?: { title?: string; links?: NavItem[] }[];
    socialLinks?: { platform?: string; href?: string }[];
    appStoreLink?: string;
    playStoreLink?: string;
    copyright?: string;
    contact?: { email?: string; phone?: string; address?: string };
  };
};

export type HomeSections = {
  hero?: { badge?: string; title?: string; highlightedWord?: string; subtitle?: string; backgroundImage?: string; ctaPrimary?: LinkValue; ctaSecondary?: LinkValue };
  howItWorks?: { sectionLabel?: string; title?: string; subtitle?: string; steps?: Step[] };
  watchInAction?: { sectionLabel?: string; title?: string; subtitle?: string; videoUrl?: string; posterImage?: string };
  featuredAdvisorsHeader?: { sectionLabel?: string; title?: string; subtitle?: string; viewAllLabel?: string };
  whyChoose?: { sectionLabel?: string; title?: string; subtitle?: string; cards?: CardItem[] };
  appPromo?: { eyebrow?: string; title?: string; subtitle?: string; features?: string[]; appStoreLink?: string; playStoreLink?: string; screenshotImages?: string[] };
  testimonialsHeader?: { sectionLabel?: string; title?: string; subtitle?: string; trustpilotRating?: string; totalReviews?: string };
  cta?: { eyebrow?: string; title?: string; subtitle?: string; buttonPrimary?: LinkValue; buttonSecondary?: LinkValue; backgroundImage?: string };
  faqHeader?: { sectionLabel?: string; title?: string };
};

export type HowItWorksSections = {
  hero?: { title?: string; subtitle?: string; ctaPrimary?: LinkValue; ctaSecondary?: LinkValue };
  bookingSteps?: { title?: string; subtitle?: string; steps?: Step[] };
  sessionTypes?: {
    title?: string;
    subtitle?: string;
    types?: { name?: string; icon?: string; description?: string; bullets?: string[]; startingPrice?: string; accentColor?: string }[];
  };
  schedulingMadeSimple?: { title?: string; cards?: CardItem[] };
  cancellationPolicy?: {
    title?: string;
    subtitle?: string;
    sectionTitle?: string;
    rules?: { title?: string; description?: string }[];
  };
  cta?: { title?: string; subtitle?: string; buttonPrimary?: LinkValue };
};

export type AdvisorsSections = {
  hero?: { eyebrow?: string; title?: string; subtitle?: string };
  listSettings?: { viewAllLabel?: string; emptyStateText?: string };
};

export type AdvisorDetailSections = {
  labels?: {
    goBack?: string;
    aboutMe?: string;
    expertiseCategories?: string;
    skills?: string;
    styles?: string;
    languages?: string;
    weeklySchedule?: string;
    introVideo?: string;
    pricing?: string;
    bookSession?: string;
    sendMessage?: string;
    reviewsAndRatings?: string;
    averageRating?: string;
    performanceHighlights?: string;
  };
};

export type JoinAsAdvisorSections = {
  hero?: { title?: string; subtitle?: string; backgroundImage?: string; ctaPrimary?: LinkValue };
  joiningProcess?: { sectionLabel?: string; title?: string; subtitle?: string; steps?: Step[] };
  application?: { stepLabel?: string; title?: string; description?: string; bullets?: string[]; image?: string; ctaPrimary?: LinkValue };
  interview?: { stepLabel?: string; title?: string; description?: string; image?: string; ctaPrimary?: LinkValue };
  contractOnboarding?: { stepLabel?: string; title?: string; description?: string; image?: string; ctaPrimary?: LinkValue };
  reachStats?: { eyebrow?: string; title?: string; subtitle?: string; image?: string; items?: StatItem[] };
  whyJoin?: { sectionLabel?: string; title?: string; subtitle?: string; cards?: CardItem[] };
  requirements?: { title?: string; bullets?: string[]; image?: string };
  advisorTestimonials?: { sectionLabel?: string; title?: string; videos?: { name?: string; quote?: string; videoUrl?: string; thumbnail?: string }[] };
  beforeYouApply?: { eyebrow?: string; title?: string; body?: string; ctaPrimary?: LinkValue; footnote?: string };
};

export type EthicalStandardsSections = {
  hero?: { badge?: string; title?: string; subtitle?: string; banner?: string; backgroundImage?: string };
  standards?: CardItem[];
  commitment?: { eyebrow?: string; title?: string; body?: string; ctaPrimary?: LinkValue; ctaSecondary?: LinkValue };
};

export type ReviewsSections = {
  hero?: { badge?: string; title?: string; subtitle?: string };
  commitment?: {
    title?: string;
    cards?: { icon?: string; title?: string; description?: string; bullets?: string[] }[];
  };
  trustedByThousands?: { title?: string; stats?: StatItem[] };
  fairResolution?: { title?: string; subtitle?: string; steps?: Step[]; importantNote?: string };
  testimonialsHeader?: { eyebrow?: string; title?: string; subtitle?: string; trustpilotRating?: string; totalReviews?: string };
  contactBlock?: { title?: string; subtitle?: string; ctaPrimary?: LinkValue; contactEmail?: string; contactPhone?: string };
};

export type BlogsSections = {
  hero?: { eyebrow?: string; title?: string; subtitle?: string; searchPlaceholder?: string; backgroundImage?: string };
  categories?: string[];
  newsletterCta?: { title?: string; subtitle?: string; placeholder?: string; buttonLabel?: string };
};

export type AboutSections = {
  hero?: { title?: string; subtitle?: string };
  story?: { title?: string; paragraphs?: string[] };
  values?: { title?: string; cards?: CardItem[] };
  howItWorks?: { sectionLabel?: string; title?: string; subtitle?: string; steps?: Step[] };
  whyChoose?: { sectionLabel?: string; title?: string; subtitle?: string; cards?: CardItem[] };
  cta?: { title?: string; subtitle?: string; buttonPrimary?: LinkValue; buttonSecondary?: LinkValue };
};

export type ContactSections = {
  hero?: { title?: string; subtitle?: string };
  contactInfo?: {
    title?: string;
    email?: string;
    emailLabel?: string;
    phone?: string;
    phoneLabel?: string;
    office?: string;
    officeLabel?: string;
    businessHours?: string[];
  };
  quickHelp?: { title?: string; body?: string; ctaPrimary?: LinkValue };
  formSettings?: { title?: string; subtitle?: string; categories?: string[]; successMessage?: string; footnote?: string };
};

export type SiteContentDoc<TSections> = {
  _id?: string;
  pageSlug: string;
  pageName: string;
  sections: TSections;
  updatedAt?: string;
};

export type SectionsMap = {
  global: GlobalSections;
  home: HomeSections;
  "how-it-works": HowItWorksSections;
  advisors: AdvisorsSections;
  "advisor-detail": AdvisorDetailSections;
  "join-as-advisor": JoinAsAdvisorSections;
  "ethical-standards": EthicalStandardsSections;
  reviews: ReviewsSections;
  blogs: BlogsSections;
  about: AboutSections;
  contact: ContactSections;
};

export type SiteContentSlug = keyof SectionsMap;

// ===== Domain types (from backend) =====
export type Blog = {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  type?: string;
  thumbnail?: string;
  authorName?: string;
  authorTitle?: string;
  authorPhoto?: string;
  profilePicture?: string;
  readMinutes?: number;
  publishedAt?: string;
  createdAt: string;
  isPublished?: boolean;
};

export type Faq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
  isActive: boolean;
};

export type Advisor = {
  profile: {
    _id: string;
    user: string;
    professionalTitle?: string;
    bio?: string;
    detailedDescription?: string;
    yearsOfExperience?: string;
    expertise?: string[];
    styles?: string[];
    languages?: string[];
    introVideoUrl?: string;
    pricing?: { chatPerMin?: number; callPerMin?: number; videoPerMin?: number };
    isOnline?: boolean;
    isFeaturedOnHome?: boolean;
    tier?: "bronze" | "silver" | "gold";
    avgRating?: number;
    ratingsCount?: number;
    ratingBreakdown?: Record<string, number>;
    totalSessions?: number;
    weeklySchedule?: Record<string, { enabled?: boolean; from?: string; to?: string }>;
  };
  user: {
    _id: string;
    name?: string;
    email?: string;
    profilePhoto?: string;
    country?: string;
    city?: string;
    currency?: string;
    location?: string;
  };
};

export type Review = {
  _id: string;
  rating: number;
  comment?: string;
  sessionType?: "chat" | "call" | "video";
  isFeaturedTestimonial?: boolean;
  isAdminShowcase?: boolean;
  showcaseName?: string;
  showcaseLocation?: string;
  showcasePhoto?: string;
  user?: { _id: string; name?: string; profilePhoto?: string };
  advisor?: { _id: string; name?: string };
  createdAt: string;
};

export type CmsPage = { slug: string; title: string; content: string };
