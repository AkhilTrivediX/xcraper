import { createRef, useEffect, useState } from "react"
import { Button } from "./ui/button";
import { FileText, MousePointerClick, PencilLine, Sparkle, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

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
    const [brief, setBrief] = useState('');
    const [tags, setTags] = useState([]);
    const [textTab, setTextTab] = useState('scraped');
    const aiBriefRef = createRef<HTMLDivElement>();
    const aiBriefDupRef = createRef<HTMLDivElement>();
    const [forms, setForms] = useState([]);
    const [currentForm, setCurrentForm] = useState(0);
    const [formMode, setFormMode] = useState('preview');
    const formViewRef = createRef<HTMLDivElement>();
    const [clickables, setClickables] = useState([]);
    const [currentClickable, setCurrentClickable] = useState(0);
    const [clickableMode, setClickableMode] = useState('preview');
    const clickableViewRef = createRef<HTMLDivElement>();

    useEffect(()=>{
        if('url' in info && !scrapedText) getScrapedText();
        if(forms.length<=0 && 'url' in info && info.formsToggle){
            console.log('Getting Scraped Forms');
            getForms();
        }
        if(clickables.length<=0 && 'url' in info && info.clickableToggle){
            console.log('Getting Scraped Clickables');
            getClickables();
        }
    },[info])

    useEffect(()=>{
        if(!scrapedText || scrapedText.startsWith('Error')) return;
        getBrief();
    },[scrapedText])

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

    async function getBrief()
    {
        const res = await fetch('/api/generateBrief', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({scrapedText, maxLength: (info as any).briefLength})
        });
        if(!res.ok)
        {
            setBrief('Error: ' + res.statusText);
        }
        const data = await res.json();
        const {tags, description} = JSON.parse(data.brief);
        setTextTab('brief');
        setBrief(description);
        setTags(tags);
    }

    useEffect(()=>{
        if(!aiBriefRef.current) return;
        typeBrief(0);
    },[brief])

    useEffect(()=>{
        updateFormView('preview');
    }, [forms])

    useEffect(()=>{
        updateClickableView('preview');
    }, [clickables])

    function typeBrief(index: number){
        if(!aiBriefRef.current) return;
        if( index >= brief.length)
        {
            if(aiBriefDupRef.current) (aiBriefDupRef.current as HTMLElement).innerHTML = brief;
            return;
        }
        setTimeout(()=>{
            if(aiBriefRef.current) (aiBriefRef.current as HTMLElement).innerHTML = brief.substring(0, index);
            if(aiBriefDupRef.current) (aiBriefDupRef.current as HTMLElement).innerHTML = brief.substring(0, index-Math.round(Math.random()*10));
            typeBrief(index+1)
        }, 10);
    }

    async function getForms()
    {
        console.log('Getting Scraped Forms');
        const res = await fetch('/api/scrapeForms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
        const data = await res.json();
        setForms(data.forms);
        console.log('Updated Forms:', data.forms)
    }

    async function getClickables()
    {
        console.log('Getting Scraped Clickables');
        const res = await fetch('/api/scrapeClickables', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
        const data = await res.json();
        setClickables(data.clickables);
    }

    function updateFormView(mode=(formMode=='preview'?'code':'preview'), id=(currentForm))
    {
        setFormMode(mode);
        setCurrentForm(id);

        console.log(formViewRef.current)
        if(!formViewRef.current) return;
        console.log('Current form:', forms[id])
        if(mode=='preview') formViewRef.current.innerHTML = forms[id]?(forms[id] as any).html:'<div className="w-full h-full skeletonAnimation rounded-md"/>';
        else formViewRef.current.innerText = forms[id]?(forms[id] as any).html:'Error while fetching the code!';
    }

    function updateClickableView(mode=(clickableMode=='preview'?'code':'preview'), id=(currentClickable))
    {
        setClickableMode(mode);
        setCurrentClickable(id);

        console.log(clickableViewRef.current)
        if(!clickableViewRef.current) return;
        console.log('Current clickable:', clickables[id])
        if(mode=='preview') clickableViewRef.current.innerHTML = clickables[id]?(clickables[id] as any).html:'<div className="w-full h-full skeletonAnimation rounded-md"/>';
        else clickableViewRef.current.innerText = clickables[id]?(clickables[id] as any).html:'Error while fetching the code!';
    }

    return (<div className='w-[80%] text-sm'>
            <div className="flex flex-col gap-2  mb-8">
                <div className="text-2xl font-bold">Scraping | <strong className="font-dmmono">{(info as any).url}</strong></div>
                <div className="flex gap-2">
                    {(tags || []).map((tag, index) => <Badge key={index}>{tag}</Badge>)}
                </div>
            </div>
            <div className="flex w-full flex-wrap gap-2 justify-center">
                <div className="flex flex-col border-[1px] rounded-xl border-white border-opacity-20 p-2 w-[49%]">
                    <div className="flex gap-2 p-2 border-b-[1px] border-white border-opacity-20">
                        <div className="flex items-center font-bold text-xs">TEXT</div>
                        <Button variant={textTab==='brief' ? 'default' : 'secondary'} onClick={() => setTextTab('brief')}><Sparkles size={18} className="mr-2"/> Brief</Button>
                        <Button variant={textTab==='scraped' ? 'default' : 'secondary'} onClick={() => setTextTab('scraped')}><FileText size={18} className="mr-2"/> Scraped Text</Button>
                    </div>
                    <div className="h-[300px] overflow-y-scroll p-2 opacity-80 relative font-dmmono">
                        <div className={textTab==='brief' ? 'flex flex-col' : 'hidden'}>
                            <div className="opacity-50" ref={aiBriefRef}><div className="w-full h-full skeletonAnimation rounded-md"/></div>
                            <div className="opacity-80 absolute top-0 left-0 p-2" ref={aiBriefDupRef}></div>
                        </div>
                        <div className={textTab==='scraped' ? 'flex flex-col w-full h-full' : 'hidden'}>
                            {scrapedText?scrapedText:<div className="w-full h-full skeletonAnimation rounded-md"/>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col border-[1px] rounded-xl border-white border-opacity-20 p-2 w-[49%]">
                    <div className="flex gap-2 p-2 border-b-[1px] border-white border-opacity-20  overflow-x-scroll">
                        <div className="flex items-center font-bold text-xs">FORMS</div>{(forms || []).map((form, index) => <Button key={index} variant={currentForm==index ? 'default' : 'secondary'} onClick={() => updateFormView(formMode, index)}><PencilLine size={18} className="mr-2"/> Form {index+1}</Button>)}
                    </div>
                    <Badge variant={formMode=='preview'?'default':'secondary'} className="mt-2 w-[max-content] ml-2 cursor-pointer" onClick={()=>{updateFormView();}}>Toggle Preview</Badge>
                    <div className={"h-[300px] overflow-y-scroll p-2 opacity-80 relative "+(formMode=='preview'?'':'font-dmmono')} ref={formViewRef}>
                        <div className="w-full h-full skeletonAnimation rounded-md"/>
                    </div>
                </div>
                <div className="flex flex-col border-[1px] rounded-xl border-white border-opacity-20 p-2 w-[99%]">
                    <div className="flex gap-2 p-2 border-b-[1px] border-white border-opacity-20 overflow-x-scroll">
                    <div className="flex items-center font-bold text-xs">CLICKABLES</div>{(clickables || []).map((clickable, index) => <Button key={index} variant={currentClickable==index ? 'default' : 'secondary'} onClick={() => updateClickableView(clickableMode, index)}><MousePointerClick size={18} className="mr-2"/> Clickable {index+1}</Button>)}
                    </div>
                    <Badge variant={clickableMode=='preview'?'default':'secondary'} className="mt-2 w-[max-content] ml-2 cursor-pointer" onClick={()=>{updateClickableView();}}>Toggle Preview</Badge>
                    <div className={"h-[300px] overflow-y-scroll p-2 opacity-80 relative "+(clickableMode=='preview'?'':'font-dmmono')} ref={clickableViewRef}>
                        <div className="w-full h-full skeletonAnimation rounded-md"/>
                    </div>
                </div>
            </div>
    </div>)
}