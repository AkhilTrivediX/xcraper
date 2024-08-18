'use client'

import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { FormDescription } from "./ui/form"
import { ComboBox } from "./ui/comboBox"
import { useState } from "react"


export default function ScrapeForm({updateScrapeInfo}:{updateScrapeInfo:Function})
{
    const [scrapingUrl, setScrapingUrl] = useState('');
    const [briefToggle, setBriefToggle] = useState(true);
    const [briefLength, setBriefLength] = useState(100);
    const [clickableToggle, setClickableToggle] = useState(true);
    const [maxClickable, setMaxClickable] = useState(25);
    const [clickablesImagesToggle, setClickablesImagesToggle] = useState(true);
    const [formsToggle, setFormsToggle] = useState(true);
    const [maxForms, setMaxForms] = useState(5);
    const [formsImagesToggle, setFormsImagesToggle] = useState(true);


    async function requestScrape()
    {

        if(!scrapingUrl) return alert("Please enter a valid website URL");

            updateScrapeInfo({
                url: scrapingUrl,
                brief: briefToggle,
                briefLength: briefLength,
                clickable: clickableToggle,
                maxClickable: maxClickable,
                clickablesImages: clickablesImagesToggle,
                forms: formsToggle,
                maxForms: maxForms,
                formsImages: formsImagesToggle,
            });
    }
    return(
        <main className="w-[75%] text-sm">
            <div className="text-3xl font-bold mb-2">Scrape Website</div>
            <div className="opacity-80">Enter details and options for web-scraping.</div>
            <div className="py-2 my-2">
                <Label htmlFor="weburl">Website URL</Label>
                <div className="py-1 flex w-1/2 gap-2">
                    <Input id="weburl" placeholder="https://www.akhiltrivedi.me" onChange={(e)=>setScrapingUrl(e.target.value)}/>
                    <Button type="submit" className="font-dmmono font-bold" onClick={requestScrape}>Xcrape</Button>
                </div>
            </div>

            <div className="py-2 my-2">
                <div className="py-1 flex gap-4 items-center">
                    <div className="flex flex-col">
                        <Label >Website Brief</Label>
                        <div className="text-xs opacity-60 w-[200px]">Generate description for website</div>
                    </div>
                    <Switch checked={briefToggle} onCheckedChange={setBriefToggle}/>
                    <div className={"flex overflow-hidden "+(briefToggle?"max-w-[300px]":"max-w-[0px]")}>
                        <ComboBox optionSet={[20,50,100,200].map(x=>({value:x+'', label:x}))} defaultValue={100} sideTitle="Max Length" onValueChange={setBriefLength}/>
                    </div>
                </div>
            </div>

            <div className="py-2 my-2">
                <div className="py-1 flex gap-4 items-center">
                    <div className="flex flex-col">
                        <Label >Fetch Clickables</Label>
                        <div className="text-xs opacity-60 w-[200px]">Scrape clickable links and buttons</div>
                    </div>
                    <Switch checked={clickableToggle} onCheckedChange={setClickableToggle}/>
                    <div className={"flex overflow-hidden items-center gap-2 "+(clickableToggle?"max-w-[900px]":"max-w-[0px]")}>
                        <ComboBox optionSet={[10, 25, 50, 100].map(x=>({value:x+'', label:x}))} defaultValue={25} sideTitle="Max Count" onValueChange={setMaxClickable}/>
                        <div className="ml-1 opacity-60">Fetch Screenshots</div>
                        <Switch checked={clickablesImagesToggle} onCheckedChange={setClickablesImagesToggle}/>
                    </div>
                </div>
            </div>

            <div className="py-2 my-2">
                <div className="py-1 flex gap-4 items-center">
                    <div className="flex flex-col">
                        <Label >Fetch Forms</Label>
                        <div className="text-xs opacity-60 w-[200px]">Scrape available forms on website</div>
                    </div>
                    <Switch checked={formsToggle} onCheckedChange={setFormsToggle}/>
                    <div className={"flex overflow-hidden items-center gap-2 "+(formsToggle?"max-w-[900px]":"max-w-[0px]")}>
                        <ComboBox optionSet={[5, 10, 15, 20].map(x=>({value:x+'', label:x}))} defaultValue={5} sideTitle="Max Count" onValueChange={setMaxForms}/>
                        <div className="ml-1 opacity-60">Fetch Screenshots</div>
                        <Switch checked={formsImagesToggle} onCheckedChange={setFormsImagesToggle}/>
                    </div>
                </div>
            </div>
        </main>
    )
}