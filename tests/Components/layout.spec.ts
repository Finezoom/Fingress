import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";
import EleComponents from "./POM/components.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;

let components : EleComponents;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeEach(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
     components = new EleComponents(page);
     await page.goto(baseUrl);
     await test.step('Navigating to the calendar page from the home page',async()=>{
        await components.menu.click();
        await components.explorer.click();
        await components.Components.click();
        await components.Layout.click();
     })
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})

test('',async()=>{
    await page.locator('')
})