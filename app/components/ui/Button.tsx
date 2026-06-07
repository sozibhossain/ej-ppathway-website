import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[#0e7490] text-white hover:bg-[#085a72]",
  secondary: "bg-[#064e63] text-white hover:bg-[#053b4b]",
  outline: "bg-transparent text-[#0e7490] border border-[#0e7490] hover:bg-[#e6f4f8]",
  ghost: "bg-transparent text-[#0e7490] hover:bg-[#e6f4f8]",
  white: "bg-white text-[#0e7490] hover:bg-[#f0f9fb] border border-[#0e7490]"
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base"
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = CommonProps & { href: string; target?: string; rel?: string };
type Props = ButtonProps | AnchorProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export function LinkButton({ href, variant = "primary", size = "md", className = "", children, target, rel }: AnchorProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  if (href.startsWith("http") || target === "_blank") {
    return (
      <a href={href} target={target} rel={rel || "noopener noreferrer"} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

// Convenience: render a button-ish element from a CMS Link shape.
export function CmsCtaButton({
  link,
  variant,
  size,
  className
}: {
  link?: { label?: string; href?: string };
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  if (!link?.label || !link.label.trim()) return null;
  const href = link.href || "#";
  return (
    <LinkButton href={href} variant={variant} size={size} className={className}>
      {link.label}
    </LinkButton>
  );
}

// Re-export for clarity
export type { Props as ButtonOrLinkProps };
