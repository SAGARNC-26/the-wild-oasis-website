import type { Metadata } from "next";
import "./_style/globals.css";
import { Josefin_Sans } from "next/font/google";
import Header from "./_component/Header";
import { ReservationProvider } from "./_component/ReservationContext";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    //%s is a placeholder for the page title adds other pages title
    template: "%s | The Wild Oasis",
    //default title for the site
    default: "Welcome/The Wild Oasis",
  },

  description:
    "Lxurious cabin hotel,located in the heart of the Italian Dolomites,surrounded by beautiful mountains and dark forests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} bg-primary-950 text-gray-50 min-h-screen flex flex-col relative`}
      >
        <Header />
        <div className="flex-1 px-8 py-5 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
