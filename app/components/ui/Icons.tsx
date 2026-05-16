/**
 * Lightweight inline SVG icon set keyed by string.
 * Admins type icon keys like 'user', 'video', 'card', 'star' in the SiteContent
 * editor — render uses these to render the corresponding SVG.
 */
import React from "react";

export type IconProps = { className?: string; size?: number; strokeWidth?: number };

const I = ({
  size = 24,
  className,
  strokeWidth = 1.6,
  children
}: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const UserIcon = (p: IconProps) => <I {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></I>;
export const VideoIcon = (p: IconProps) => <I {...p}><rect x="2" y="6" width="14" height="12" rx="2" /><polygon points="22,8 16,12 22,16" /></I>;
export const CardIcon = (p: IconProps) => <I {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></I>;
export const StarIcon = (p: IconProps) => <I {...p}><polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 9 12 2" /></I>;
export const ChatIcon = (p: IconProps) => <I {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></I>;
export const LockIcon = (p: IconProps) => <I {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></I>;
export const CompassIcon = (p: IconProps) => <I {...p}><circle cx="12" cy="12" r="10" /><polygon points="16 8 14 14 8 16 10 10 16 8" /></I>;
export const GlobeIcon = (p: IconProps) => <I {...p}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></I>;
export const ShieldCheckIcon = (p: IconProps) => <I {...p}><path d="M12 2 4 5v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V5l-8-3z" /><path d="M9 12l2 2 4-4" /></I>;
export const PhoneIcon = (p: IconProps) => <I {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" /></I>;
export const CalendarIcon = (p: IconProps) => <I {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></I>;
export const BoltIcon = (p: IconProps) => <I {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></I>;
export const BellIcon = (p: IconProps) => <I {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></I>;
export const CheckIcon = (p: IconProps) => <I {...p}><polyline points="20 6 9 17 4 12" /></I>;
export const SearchIcon = (p: IconProps) => <I {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></I>;
export const DocIcon = (p: IconProps) => <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></I>;
export const MonitorIcon = (p: IconProps) => <I {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></I>;
export const DocSignedIcon = (p: IconProps) => <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="8 16 11 19 16 14" /></I>;
export const WalletIcon = (p: IconProps) => <I {...p}><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path d="M16 12h.01" /></I>;
export const UsersIcon = (p: IconProps) => <I {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></I>;
export const HeartIcon = (p: IconProps) => <I {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></I>;
export const ArrowRightIcon = (p: IconProps) => <I {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></I>;
export const ArrowLeftIcon = (p: IconProps) => <I {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></I>;
export const ChevronDownIcon = (p: IconProps) => <I {...p}><polyline points="6 9 12 15 18 9" /></I>;
export const ChevronRightIcon = (p: IconProps) => <I {...p}><polyline points="9 18 15 12 9 6" /></I>;
export const PlayIcon = (p: IconProps) => <I {...p}><polygon points="6 4 20 12 6 20 6 4" /></I>;
export const PlusIcon = (p: IconProps) => <I {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></I>;
export const MinusIcon = (p: IconProps) => <I {...p}><line x1="5" y1="12" x2="19" y2="12" /></I>;
export const XIcon = (p: IconProps) => <I {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></I>;
export const MailIcon = (p: IconProps) => <I {...p}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22,6 12,13 2,6" /></I>;
export const MapPinIcon = (p: IconProps) => <I {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></I>;
export const ClockIcon = (p: IconProps) => <I {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></I>;
export const EyeIcon = (p: IconProps) => <I {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></I>;
export const EyeOffIcon = (p: IconProps) => <I {...p}><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.45 19.45 0 0 1 5.06-6.06" /><path d="M1 1l22 22" /></I>;
export const FacebookIcon = (p: IconProps) => <I {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></I>;
export const TwitterIcon = (p: IconProps) => <I {...p}><path d="M22 4s-1 3-5 4c-1.5-2-4-3-6-2-3 1-3 4-3 5C2 12 1 5 1 5s4 4 9 4c-1-5 5-7 8-4 1 0 3-1 3-1z" /></I>;
export const InstagramIcon = (p: IconProps) => <I {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></I>;
export const LinkedInIcon = (p: IconProps) => <I {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></I>;
export const MenuIcon = (p: IconProps) => <I {...p}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></I>;
export const SparkleIcon = (p: IconProps) => <I {...p}><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></I>;

const REG: Record<string, React.FC<IconProps>> = {
  user: UserIcon,
  video: VideoIcon,
  card: CardIcon,
  star: StarIcon,
  chat: ChatIcon,
  lock: LockIcon,
  compass: CompassIcon,
  globe: GlobeIcon,
  "shield-check": ShieldCheckIcon,
  shield: ShieldCheckIcon,
  phone: PhoneIcon,
  calendar: CalendarIcon,
  bolt: BoltIcon,
  bell: BellIcon,
  check: CheckIcon,
  search: SearchIcon,
  doc: DocIcon,
  monitor: MonitorIcon,
  "doc-signed": DocSignedIcon,
  wallet: WalletIcon,
  users: UsersIcon,
  heart: HeartIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  chevronDown: ChevronDownIcon,
  chevronRight: ChevronRightIcon,
  play: PlayIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  x: XIcon,
  mail: MailIcon,
  mapPin: MapPinIcon,
  clock: ClockIcon,
  sparkle: SparkleIcon
};

const SOCIAL: Record<string, React.FC<IconProps>> = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon
};

/** Render a registered icon by name, falling back to a sparkle if unknown. */
export function Icon({ name, size = 24, className }: { name?: string; size?: number; className?: string }) {
  const C = (name && REG[name]) || SparkleIcon;
  return <C size={size} className={className} />;
}

export function SocialIcon({ platform, size = 18, className }: { platform?: string; size?: number; className?: string }) {
  const C = (platform && SOCIAL[platform.toLowerCase()]) || GlobeIcon;
  return <C size={size} className={className} />;
}
