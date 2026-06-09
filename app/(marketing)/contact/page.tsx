import { MailIcon, PhoneIcon, ClockIcon } from "../../components/ui/Icons";
import { MapPin } from "lucide-react";
import { ContactForm } from "./contact-form";
import { FAQSection } from "../../components/sections/FAQSection";
import { getSiteContent } from "../../lib/site-content";

export default async function ContactPage() {
  const data = await getSiteContent("contact");
  const info = data.contactInfo || {};
  const form = data.formSettings || {};

  return (
    <>
      <div className="container-page py-8 sm:py-10 md:py-14">
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
          {data.hero?.title && (
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0e7490] leading-tight">
              {data.hero.title}
            </h1>
          )}
          {data.hero?.subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600">{data.hero.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5 sm:gap-6">
          <aside className="space-y-4">
            <div className="bg-[#e6f4f8] border border-[#cfe9f0] rounded-2xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-[#0e7490] mb-4">
                {info.title || "Contact Information"}
              </h3>
              <ul className="space-y-4 text-sm">
                {info.email && (
                  <Item
                    icon={<MailIcon size={16} />}
                    label="Email"
                    value={info.email}
                    caption={info.emailLabel}
                    href={`mailto:${info.email}`}
                  />
                )}
                {info.phone && (
                  <Item
                    icon={<PhoneIcon size={16} />}
                    label="Phone"
                    value={info.phone}
                    caption={info.phoneLabel}
                    href={`tel:${info.phone}`}
                  />
                )}
                {info.office && (
                  <Item
                    icon={<MapPin size={16} />}
                    label={info.officeLabel || "Office"}
                    value={info.office}
                  />
                )}
                {(info.businessHours || []).length > 0 && (
                  <li className="flex items-start gap-3">
                    <span className="h-9 w-9 rounded-lg bg-white text-[#0e7490] inline-flex items-center justify-center shrink-0">
                      <ClockIcon size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900">Business Hours</div>
                      {(info.businessHours || []).map((h, i) => (
                        <div key={i} className="text-slate-700 text-xs sm:text-sm">
                          {h}
                        </div>
                      ))}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </aside>

          <ContactForm
            title={form.title}
            subtitle={form.subtitle}
            categories={form.categories || []}
            successMessage={form.successMessage}
            footnote={form.footnote}
          />
        </div>
      </div>

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />
    </>
  );
}

function Item({
  icon,
  label,
  value,
  caption,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption?: string;
  href?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="h-9 w-9 rounded-lg bg-white text-[#0e7490] inline-flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-900">{label}</div>
        {href ? (
          <a
            href={href}
            className="text-slate-700 hover:text-[#0e7490] text-sm break-all transition-colors"
          >
            {value}
          </a>
        ) : (
          <div className="text-slate-700 text-sm whitespace-pre-line">{value}</div>
        )}
        {caption && <div className="text-xs text-slate-500 mt-0.5">{caption}</div>}
      </div>
    </li>
  );
}
