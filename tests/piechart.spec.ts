import {test,expect,Browser,BrowserContext,Page,chromium} from "@playwright/test";
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
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})

test('pie chart validation',async({page})=>{
    await list.menu.click();
    await list.explorer.click();
    await list.listPages.click();
    await page.locator('text="Dashboards"').click();
    await page.locator('text="Pie Charts"').click();
    const fields = await page.locator(".arc").all();
    for(let i=0;i<fields.length;i++){
        await fields[i].hover();
    }
})