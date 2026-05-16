import Link from "next/link";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "../../components/ui/Icons";
import { ContactForm } from "./contact-form";
import { FAQSection } from "../../components/sections/FAQSection";
import { getSiteContent } from "../../lib/site-content";

export default async function ContactPage() {
  const data = await getSiteContent("contact");
  const info = data.contactInfo || {};
  const help = data.quickHelp || {};
  const form = data.formSettings || {};

  return (
    <div className="container-page py-10 md:py-14">
      <div className="text-center mb-10">
        {data.hero?.title && <h1 className="text-3xl md:text-5xl font-bold text-[#0e7490]">{data.hero.title}</h1>}
        {data.hero?.subtitle && <p className="mt-3 text-slate-600 max-w-2xl mx-auto">{data.hero.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        <aside className="space-y-4">
          <div className="bg-[#e6f4f8] border border-[#cfe9f0] rounded-2xl p-5">
            <h3 className="text-lg font-bold text-[#0e7490] mb-4">{info.title || "Contact Information"}</h3>
            <ul className="space-y-3 text-sm">
              {info.email && <Item icon={<MailIcon size={16} />} label="Email" value={info.email} caption={info.emailLabel} href={`mailto:${info.email}`} />}
              {info.phone && <Item icon={<PhoneIcon size={16} />} label="Phone" value={info.phone} caption={info.phoneLabel} href={`tel:${info.phone}`} />}
              {info.office && <Item icon={<MapPinIcon size={16} />} label={info.officeLabel || "Office"} value={info.office} />}
              {(info.businessHours || []).length > 0 && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#0e7490]"><ClockIcon size={16} /></span>
                  <div>
                    <div className="font-semibold text-slate-900">Business Hours</div>
                    {(info.businessHours || []).map((h, i) => (
                      <div key={i} className="text-slate-700 text-xs">{h}</div>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {help.title && (
            <div className="bg-[#e6f4f8] border border-[#cfe9f0] rounded-2xl p-5">
              <h3 className="text-lg font-bold text-[#0e7490] mb-2">{help.title}</h3>
              {help.body && <p className="text-sm text-slate-600 mb-4">{help.body}</p>}
              {help.ctaPrimary?.href ? (
                <Link href={help.ctaPrimary.href} className="block w-full text-center h-11 leading-[44px] rounded-lg bg-[#0e7490] text-white font-semibold">
                  {help.ctaPrimary.label || "Visit Help Center"}
                </Link>
              ) : null}
            </div>
          )}
        </aside>

        <ContactForm
          title={form.title}
          subtitle={form.subtitle}
          categories={form.categories || []}
          successMessage={form.successMessage}
          footnote={form.footnote}
        />
      </div>

      <FAQSection sectionLabel="FAQ" title="Frequently Asked Questions" />
    </div>
  );
}

function Item({ icon, label, value, caption, href }: { icon: React.ReactNode; label: string; value: string; caption?: string; href?: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 text-[#0e7490]">{icon}</span>
      <div>
        <div className="font-semibold text-slate-900">{label}</div>
        {href ? (
          <a href={href} className="text-slate-700 hover:text-[#0e7490] text-sm break-all">{value}</a>
        ) : (
          <div className="text-slate-700 text-sm whitespace-pre-line">{value}</div>
        )}
        {caption && <div className="text-xs text-slate-500">{caption}</div>}
      </div>
    </li>
  );
}
