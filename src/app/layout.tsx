import type { Metadata } from "next";
import { Fraunces, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kings Accountants Ltd | Chartered Accountants & Tax Advisors, Birmingham",
    template: "%s | Kings Accountants Ltd",
  },
  description:
    "Kings Accountants Ltd is an independent firm of accountants and tax advisors in Birmingham, UK, delivering statutory accounts, bookkeeping, tax advisory, and financial strategy to ambitious businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink-900">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
