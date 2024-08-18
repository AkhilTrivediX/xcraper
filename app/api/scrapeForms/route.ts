import puppeteer from "puppeteer";

export async function POST(request: Request)
{
    
    const scrapOptions = await request.json();
    console.log(scrapOptions)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(scrapOptions.url);
    await page.setViewport({ width: 1080, height: 1024 });

    const forms = await page.$$eval('*', (elements, scrapOptions) => {
        let formI = 0;
        let forms:any[] = [];
        elements.forEach(element => {
            if(element.tagName == 'FORM')
            {
                forms.push({
                    id: 'XCRAPE_FORM'+(formI), html: element.outerHTML
                })
                formI++;
            }
        })
        return forms;
    }, scrapOptions);

    console.log(forms)
    browser.close();

    return Response.json({
        forms
    })
}