import puppeteer from "puppeteer";

export async function POST(request: Request)
{
    
    const scrapOptions = await request.json();
    console.log(scrapOptions)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(scrapOptions.url);
    await page.setViewport({ width: 1080, height: 1024 });

    const clickables = await page.$$eval('*', (elements, scrapOptions) => {
        let clickableI = 0;
        let clickables:any[] = [];
        elements.forEach(element => {
            if((element.getBoundingClientRect().width && element.getBoundingClientRect().height) && ((element as HTMLElement).onclick || (element as HTMLAnchorElement).href))
            {
                clickables.push({
                    id: 'XCRAPE_CLICK'+(clickableI), html: element.outerHTML
                })
                clickableI++;
            }
        })
        return clickables;
    }, scrapOptions);

    console.log(clickables)
    browser.close();

    return Response.json({
        clickables
    })
}