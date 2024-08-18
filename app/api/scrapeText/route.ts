import puppeteer from "puppeteer";

export async function POST(request: Request)
{
    
    const scrapOptions = await request.json();
    console.log(scrapOptions)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(scrapOptions.url);
    await page.setViewport({ width: 1080, height: 1024 });

    const extractedText = await page.$eval('*', (el) => el.innerText);
    console.log(extractedText);

    await browser.close();

    return Response.json({
        text: extractedText
    })
}