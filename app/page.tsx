'use client'

import ScrapedInfo from "@/components/ScrapedInfo";
import ScrapeForm from "@/components/ScrapeForm";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [scrapeInfo, setScrapeInfo] = useState<{
    url: string,
    briefToggle: boolean,
    briefLenght: number,
    clickableToggle: boolean,
    maxClickable: number,
    clickablesImagesToggle: boolean,
    formsToggle: boolean,
    maxForms: number,
    formsImagesToggle: boolean,
    extractedText: string
  } | {}>({});
  return (
    <main className="w-screen h-screen flex flex-col p-4 pt-20 items-center">
      {Object.keys(scrapeInfo).length!=0?<ScrapedInfo info={scrapeInfo}/>:<ScrapeForm updateScrapeInfo={setScrapeInfo}/>}
    </main>
  );
}
