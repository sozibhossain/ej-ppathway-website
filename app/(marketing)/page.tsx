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
  return (
    <>
      <Hero hero={home.hero || {}} />

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
          buttonPrimary={home.cta.buttonPrimary}
          buttonSecondary={home.cta.buttonSecondary}
          iconName="sparkle"
          tone="deep"
        />
      )}

      <FAQSection sectionLabel={home.faqHeader?.sectionLabel} title={home.faqHeader?.title} />
    </>
  );
}
