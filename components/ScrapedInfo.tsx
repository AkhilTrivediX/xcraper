import { useEffect, useState } from "react"
import { Button } from "./ui/button";

export default function ScrapedInfo({info}:{info:{
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
} | {}})
{
    const [scrapedText, setScrapedText] = useState('')
    const [textTab, setTextTab] = useState('brief');

    useEffect(()=>{
        if('url' in info && !scrapedText) getScrapedText();
    },[info])

    async function getScrapedText()
    {
        const res = await fetch('/api/scrapeText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
        if(!res.ok)
        {
            setScrapedText('Error: ' + res.statusText);
        }
        const data = await res.json();
        setScrapedText(data.text);
        
    }

    return (<div className='w-[75%] text-sm'>
            <div className="flex flex-col w-full">
                <div className="flex gap-2">
                    <Button variant={textTab==='brief' ? 'default' : 'secondary'} onClick={() => setTextTab('brief')}>Brief</Button>
                    <Button variant={textTab==='scraped' ? 'default' : 'secondary'} onClick={() => setTextTab('scraped')}>Scraped Text</Button>
                </div>
            </div>
    </div>)
}