import puppeteer from "puppeteer";

export default async function puppetterHandler(url_to_scrape) {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto('https://design4u.vercel.app/featured');

    await page.setViewport({ width: 1080, height: 1024 });

    //await page.locator('#searchInput').fill('India');

    
    // const extractedText = await page.$eval('*', (el) => el.innerText);
    // console.log(extractedText);


    const clickableElements = await page.$$eval('*', elements => {
        let ssId=0;
        return {
            elements: elements.filter(el => {
                const style = window.getComputedStyle(el);
                if((el.getBoundingClientRect().width && el.getBoundingClientRect().height) && (el.onclick || el.tagName === 'A' || el.tagName === 'BUTTON' || style.cursor === 'pointer')) {
                    el.classList.add('SCRAPEX_SS_'+ssId);
                    ssId++;
                    return true
                }
                else return false
            }).map(el => el.outerHTML),
            ssCount: ssId
        };
    });


    console.log('Elements fetched, now creating screenshots');
    Array(clickableElements.ssCount).fill(0).map(async (_,i) => {
        await (await page.locator('.SCRAPEX_SS_'+i).waitHandle()).screenshot({ path: `ss/screenshot_${i}.png` });
    })
    return 'Wait'

    // Iterate over clickable elements and take screenshots
    for (let i = 0; i < clickableElements.length; i++) {
        const element = clickableElements[i];
        await page.evaluate((el) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = el;
            document.body.appendChild(tempDiv.firstChild);
        }, element);

        const screenshotElement = await page.$(element);
        if (screenshotElement) {
            await screenshotElement.screenshot({ path: `screenshot_${i}.png` });
        }
    }

   await browser.close();
    return 'Hello';
}