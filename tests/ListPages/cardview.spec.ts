import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let view : Locator[];
let last_page : string | null, active_page : string|null;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleListPages(page);
     await page.goto(baseUrl);
     await test.step('Navigating to the card view from the home page',async()=>{
        await list.menu.click();
        await list.explorer.click();
        await list.listPages.click();
        await list.cardView.click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('Card view - Validating the view option and checking visibility of the details',async()=>{   
        await test.step('Getting locator for all the view options ',async()=>{
            view = await page.locator("button[class*='fg-icon-btn']").all();
        })
        for(let i=0; i<view.length;i++){
            await test.step('Clicking the view icon',async()=>{
                await view[i].click();
            })
            await test.step('Checking the visibility of chosen product details',async()=>{
                await expect(page.locator("text=' Product Detail '")).toBeVisible();
                await expect(page.locator("text=' Name '")).toBeVisible();
                await expect(page.locator("text=' Description '")).toBeVisible();
                await expect(page.locator("text=' Discounted Price '")).toBeVisible();
                await expect(page.locator("text=' Price '")).toBeVisible();
            })
            await test.step('Move back to the card view page',async()=>{
                await page.locator("text='Back'").click();
            })
        }     
})
test('Card view - Validating page navigation and fetching the product count',async()=>{
    await test.step("Clicking the 'last' page",async()=>{
        await page.locator("text='Last'").click();
    })
    await test.step('Fetching the text content of active page',async()=>{
        last_page = await page.locator('li[class*="active"]').textContent();
    })
    await test.step("Clicking the 'first' page",async()=>{
        await page.locator('text="First"').click();  
    })
    console.log(last_page);  
    for(let i=0; i<Number(last_page); i++){
        await test.step('Checking the visibility of view option and fetching the locators for all view options',async()=>{
            await page.locator("button[class*='fg-icon-btn']").nth(0).waitFor({state:"visible"});
            view = await page.locator("button[class*='fg-icon-btn']").all();
        })
        await test.step('Fetching of active page number',async()=>{
            active_page = await page.locator('li[class*="active"]').textContent();
        })
        await test.step('Printing the invoice count per page',async()=>{
            console.log(active_page +' count '+ view.length);
        })
        await test.step('Clicking the next page option',async()=>{
            await page.locator('li[title="Next Page"]').click();
        })        
    }
})