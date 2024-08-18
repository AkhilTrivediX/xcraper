import puppeteer from "puppeteer";

const ssPrefix = 'SCRAPEX_SS_';
const ssPath = '/ss/screenshot_'

export default async function puppetterHandler(url_to_scrape) {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto('https://www.wikipedia.org/');

    await page.setViewport({ width: 1080, height: 1024 });

    //await page.locator('#searchInput').fill('India');

    
    // const extractedText = await page.$eval('*', (el) => el.innerText);
    // console.log(extractedText);


    const clickableElements = await page.$$eval('*', elements => {
        let ssId=0;
        let uniqueFuncs = [];
        let retEl = [];
            elements.filter(el => {
                const style = window.getComputedStyle(el);
                if((el.getBoundingClientRect().width && el.getBoundingClientRect().height) && (el.onclick || el.href)) {
                    let func;
                    if(el.onclick && !uniqueFuncs.includes(el.onclick)) {
                        func = el.onclick;
                    }
                    else if(el.href && !uniqueFuncs.includes(el.href)) {
                        func = el.href
                    }
                    else return false;

                    uniqueFuncs.push(func);
                    retEl.push({ssId: ssId, func: func});
                    el.classList.add('SCRAPEX_SS_'+ssId);
                    ssId++;
                    return true
                }
                else return false
            })

        return retEl;
    });


    console.log('Unique Links:');
    clickableElements.map(el=>{
        console.log(ssPath+el.ssId+'.png , ', el.func);
    })
    console.log('Elements fetched, now creating screenshots');
    
    for await (const el of clickableElements) {
        await (await page.locator('.SCRAPEX_SS_'+el.ssId).waitHandle()).screenshot({ path: `ss/screenshot_${el.ssId}.png` });
    }
    
   await browser.close();
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

    return 'Hello';
}