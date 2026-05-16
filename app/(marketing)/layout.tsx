import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { AuthModalProvider } from "../components/layout/AuthModalProvider";
import { getSiteContent } from "../lib/site-content";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const global = await getSiteContent("global");
  return (
    <AuthModalProvider>
      <Header global={global} />
      <main className="flex-1">{children}</main>
      <Footer global={global} />
    </AuthModalProvider>
  );
}
