import { Montserrat, Geist } from "next/font/google";
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import "@/style/globals.css";
import { Partytown } from "@qwik.dev/partytown/react";

import Threads from "@/components/Threads"
import Particles from '@/components/particles'

//Header & footer Files to add in layout.jsx
import Nav from "@/components/nav";
import Floating from "@/components/FloatingContact";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata = {
  charSet: 'UTF-8',
  title: {
    template: " %s | Clezo",
    default: "Clezo | Premium Fashion for Men, Women, Kids and Accessories",
  },
  description: "Shop premium fashion for Men, Women, Kids and Accessories at Clezo.",
  canonical: "https://www.clezo.com/",
  sitename: "Clezo",
  keywords: ["fashion", "clezo", "clothing", "accessories", "men", "women", "kids"],
  openGraph: {
    url: 'https://www.clezo.com',
    title: "Clezo",
    type: 'website',
    siteName: "Clezo",
    description: "Shop premium fashion for Men, Women, Kids and Accessories at Clezo.",
    images: [
      { url: "https://www.clezo.com/icon.png", alt: "Clezo | Logo", type: 'image/png', sizes: "192x192", fetchPriority: "auto" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home - Clezo",
    creator: "Clezo",
    description: "Shop premium fashion for Men, Women, Kids and Accessories at Clezo.",
    images: [
      { url: "https://www.clezo.com/icon.png", alt: "Clezo | Logo", type: 'image/png', sizes: "192x192", fetchPriority: "auto" },
    ],
  },
  icons: {
    icon: [
      { url: '/icon.png', type: "image/png", sizes: "192x192", rel: "icon", fetchPriority: "auto" },
    ],
    shortcut: { url: '/icon.png', type: "image/png", fetchPriority: "auto" },
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: true,
  // Also supported but less commonly used
  // 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <Partytown debug={false} forward={["dataLayer.push"]} lib="/~Clezopackersandmovers/" />
        {/* <!-- Google Tag Manager (noscript) --> */}
        <Script id="tag_manager_index" async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MeasurementId_ga}`} type="text/partytown" />
        <Script id="tag_manager" strategy="afterInteractive" type="text/partytown" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTMId}');` }} />

        {/* Browser Update */}
        <Script id="browser-update" type="text/partytown" dangerouslySetInnerHTML={{ __html: `var $buoop = {required:{e:-4,f:-3,o:-3,s:-1,c:-3},insecure:true,api:2025.06 }; function $buo_f(){ var e = document.createElement("script"); e.src = "https://browser-update.org/update.min.js"; document.body.appendChild(e); }; try {document.addEventListener("DOMContentLoaded", $buo_f,false)} catch(e){window.attachEvent("onload", $buo_f)}` }} />
      </head>
      <body className={`${montserrat.variable} antialiased overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-secondary scrollbar-corner-indigo-700 scrollbar-track-primary/75`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe loading="lazy" src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTMId}`} className='hidden invisible' height="0" width="0"></iframe></noscript>

        {/* Google Analitics */}
        <Script strategy='afterInteractive' type="text/partytown" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MeasurementId_ga}`} />

        <NextTopLoader color="#675fdf" initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} showSpinner={false} easing="ease" speed={200} shadow="0 0 10px #f1a4c7,0 0 5px #f1a4c7" />
        <div className="w-full h-screen fixed inset-0 z-0">
          {/* <Threads amplitude={1} distance={0} enableMouseInteraction /> */}
          <Particles particleCount={555} particleSpread={55} speed={0.5} particleColors={["#1a3fb0", "#1c1d6e"]} moveParticlesOnHover particleHoverFactor={1} alphaParticles={false} particleBaseSize={222} sizeRandomness={1} cameraDistance={55} disableRotation={false} />
        </div>
        <Nav />
        {children}
        <Toaster position="top-right" />
        <Floating />
        <Footer />
      </body>
    </html>
  );
}
