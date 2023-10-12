import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch();
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleListPages(page);
     await page.goto(baseUrl);
     await test.step('',async()=>{
        await list.menu.click();
        await list.explorer.click();
        await list.listPages.click();
        await list.allListView.click();
     })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('',async()=>{
    
})