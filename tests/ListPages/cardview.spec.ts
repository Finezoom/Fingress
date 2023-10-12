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
     await test.step('navigating to the card view from the home page',async()=>{
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
test('Validating the view option and checking the visibiliy of the details',async()=>{
    test.slow();   
        await test.step('getting all the view options locator',async()=>{
            view = await page.locator("button[class*='fg-icon-btn']").all();
        })
        for(let i=0; i<view.length;i++){
            await test.step('clicking the view icon',async()=>{
                await view[i].click();
            })
            await test.step('checking visibility of the details of selected product',async()=>{
                await expect(page.locator("text=' Product Detail '")).toBeVisible();
                await expect(page.locator("text=' Name '")).toBeVisible();
                await expect(page.locator("text=' Description '")).toBeVisible();
                await expect(page.locator("text=' Discounted Price '")).toBeVisible();
                await expect(page.locator("text=' Price '")).toBeVisible();
            })
            await test.step('get back to the card view page by clciking back',async()=>{
                await page.locator("text='Back'").click();
            })
        }     
})
test('validating the page navigation and fetching the product count',async()=>{
    await test.step('clicking the last page',async()=>{
        await page.locator("text='Last'").click();
    })
    await test.step('fetching the text content of active page',async()=>{
        last_page = await page.locator('li[class*="active"]').textContent();
    })
    await test.step('clicking the first page',async()=>{
        await page.locator('text="First"').click();  
    })
    console.log(last_page);  
    for(let i=0; i<Number(last_page); i++){
        await test.step('waiting for the visibility of view and fetching the locators of all view options',async()=>{
            await page.locator("button[class*='fg-icon-btn']").nth(0).waitFor({state:"visible"});
            view = await page.locator("button[class*='fg-icon-btn']").all();
        })
        await test.step('fetching the text content of active page',async()=>{
            active_page = await page.locator('li[class*="active"]').textContent();
        })
        await test.step('printing the invoice count per page',async()=>{
            console.log(active_page +' count '+ view.length);
        })
        await test.step('clicking the next page option',async()=>{
            await page.locator('li[title="Next Page"]').click();
        })        
    }
})