import { Hero } from "../components/sections/Hero";
import { HowItWorks } from "../components/sections/HowItWorks";
import { WatchInAction } from "../components/sections/WatchInAction";
import { FeaturedAdvisors } from "../components/sections/FeaturedAdvisors";
import { WhyChoose } from "../components/sections/WhyChoose";
import { AppPromo } from "../components/sections/AppPromo";
import { Testimonials } from "../components/sections/Testimonials";
import { CTA } from "../components/sections/CTA";
import { FAQSection } from "../components/sections/FAQSection";
import { getSiteContent } from "../lib/site-content";

export default async function HomePage() {
  const home = await getSiteContent("home");
  const hero = home.hero || {};
  // Primary hero CTA ("Talk to Someone Now") should take users to the login page.
  const heroWithLogin = {
    ...hero,
    ctaPrimary: hero.ctaPrimary ? { ...hero.ctaPrimary, href: "/login" } : hero.ctaPrimary,
  };
  return (
    <>
      <Hero hero={heroWithLogin} />

      {home.howItWorks && (
        <HowItWorks
          sectionLabel={home.howItWorks.sectionLabel}
          title={home.howItWorks.title}
          subtitle={home.howItWorks.subtitle}
          steps={home.howItWorks.steps}
        />
      )}

      {home.watchInAction && (
        <WatchInAction
          sectionLabel={home.watchInAction.sectionLabel}
          title={home.watchInAction.title}
          subtitle={home.watchInAction.subtitle}
          videoUrl={home.watchInAction.videoUrl}
          posterImage={home.watchInAction.posterImage}
        />
      )}

      <FeaturedAdvisors
        sectionLabel={home.featuredAdvisorsHeader?.sectionLabel}
        title={home.featuredAdvisorsHeader?.title}
        subtitle={home.featuredAdvisorsHeader?.subtitle}
        viewAllLabel={home.featuredAdvisorsHeader?.viewAllLabel}
      />

      {home.whyChoose && (
        <WhyChoose
          sectionLabel={home.whyChoose.sectionLabel}
          title={home.whyChoose.title}
          subtitle={home.whyChoose.subtitle}
          cards={home.whyChoose.cards}
        />
      )}

      {home.appPromo && (
        <AppPromo
          eyebrow={home.appPromo.eyebrow}
          title={home.appPromo.title}
          subtitle={home.appPromo.subtitle}
          features={home.appPromo.features}
          appStoreLink={home.appPromo.appStoreLink}
          playStoreLink={home.appPromo.playStoreLink}
          screenshotImages={home.appPromo.screenshotImages}
        />
      )}

      <Testimonials
        sectionLabel={home.testimonialsHeader?.sectionLabel}
        title={home.testimonialsHeader?.title}
        subtitle={home.testimonialsHeader?.subtitle}
        trustpilotRating={home.testimonialsHeader?.trustpilotRating}
        totalReviews={home.testimonialsHeader?.totalReviews}
      />

      {home.cta && (
        <CTA
          title={home.cta.title}
          subtitle={home.cta.subtitle}
          buttonPrimary={{ label: home.cta.buttonPrimary?.label || "Start Your First Session", href: "/login" }}
          iconName="sparkle"
          tone="deep"
        />
      )}

      <FAQSection sectionLabel={home.faqHeader?.sectionLabel} title={home.faqHeader?.title} />
    </>
  );
}
