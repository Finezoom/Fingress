import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let filters: Locator[],no:any;
let pageCount: string | null, activePage: string | null, no_of_page: string | null, count1:string[];
let noOfRows: Number;
let baseUrl = "http://192.168.1.49:8086/";


test.beforeEach(async()=>{
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    list = new EleListPages(page);
    await page.goto(baseUrl);  
    await test.step('Landed to List View from Home',async()=>{       
        await list.menu.click();
        await list.explorer.click();
        await list.listPages.click();
        await list.listView.waitFor({state:"visible" });
        await list.listView.click();
    })
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})
test('List expansion',async()=>{    
        
    //await expect(page).toHaveURL(`${baseUrl}fgPage/7618c0a1-9446-4c04-a00e-6634352f6111/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    //const view = await page.locator('div[class*="list-toggle"]').all();
    await test.step('Verifying the lists are expanded with its fields',async()=>{
        for(let i=0; i< 10;i++){
            await page.locator('div[class*="list-toggle"]').nth(i).click();
            console.log("list view is expanded");
            await expect(page.locator('//strong[text()="Due Date"]').nth(i)).toBeVisible();
        }
    })    
})
test('Filtering the records in List view',async()=>{    
        
    await test.step('Identifying the applicable filters',async()=>{
        await page.locator('button[class*="btn-toggle"]').nth(1).waitFor({state:"visible"});
        filters = await page.locator('button[class*="btn-toggle"]').all();
        no = filters.length;
    })
    //inputs of the filters
    const inputs = ['INV20230828474932','INITIATION','NEW'];
    const filter = ['Reference','Stage','status'];
    await test.step('verify the records are filtered in the list view',async()=>{
        for(let i=0;i<no;i++){
            await test.step('valid input data for search filter ',async()=>{
                await filters[i].click();
                await page.locator("input[class*='mat-form-field-autofill-control']").fill(inputs[i]);
                await page.locator('text="Search"').click();
            })
            await test.step('Verifying the filtered Records',async()=>{
                await page.locator("button[class*='fg-icon-btn']").nth(0).waitFor({state:"visible"});
                const count = await page.locator("button[class*='fg-icon-btn']").allTextContents();
                console.log(filter[i]," : ",count.length);
            })
            await test.step('clearing the input data',async()=>{
                await filters[i].click();
                await page.locator('text="Clear"').click();
            })            
        }
    })    
})
test("Navigating between pages to find the records per page",async()=>{        
    await test.step('Identify the total number of pages',async()=>{
        pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent();
        console.log(pageCount);
    })
    await test.step('Identifying the last page',async()=>{
        await page.locator('//a[text()="Last"]').click();
        no_of_page = await page.locator('(//a[@class="page-link"])[6]').textContent(); 
    })
    await test.step('Navigating to first page through First option from navigation panel',async()=>{
        await page.locator('//a[text()="First"]').click();
    })
    await test.step('fetching number of the active page and getting count of rows',async()=>{
        activePage=await page.locator('li[class*="active"]').textContent();       
        count1 = await page.locator('div[class*="list-toggle"]').allTextContents();
        noOfRows = count1.length;
        console.log(no_of_page,activePage);       
    })    
    await test.step('print the details of the first page',async()=>{
        const numb = await page.locator('span[class*="fg-paginator-total-records"]').textContent();
        console.log(pageCount, " : ",noOfRows," : ",numb);
    })  
    await test.step('getting count of rows from all the pages',async()=>{
        while(activePage!=no_of_page){             
            await test.step('clicking the next page button',async()=>{
                await page.locator("li[class*='page-next-item']").click();  
            })
            await test.step('waiting for the expand option pagination label visibility',async()=>{
                await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
                await page.locator('div[class*="list-toggle"]').nth(1).waitFor({state: "visible"});
            })          
            await test.step('fetching the active page number,paginator label,total record label',async()=>{
                activePage = await page.locator('li[class*="active"]').textContent();
                const pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent(); 
                count1 = await page.locator('div[class*="list-toggle"]').allTextContents();
                const numb = await page.locator('span[class*="fg-paginator-total-records"]').textContent();
                console.log(pageCount, " : ",count1.length," : ",numb); 
            })            
        }
    })        
})
test('first & last visibility in List view pagination',async()=>{    
    
    await test.step('the first page & previous page links should be hidden in first page',async()=>{
        await expect(page.locator('//a[text()="First"]')).toBeHidden();
        await expect(page.locator('li[title="Previous Page"]')).toBeHidden();
    })
    await test.step('the last page & next page links should be visible',async()=>{
        await expect(page.locator('li[title="Next Page"]')).toBeVisible();
        await expect(page.locator('//a[text()="Last"]')).toBeVisible();
    })    
    await test.step('Clicking on the last page',async()=>{
        await page.locator('//a[text()="Last"]').click();
    })
    await test.step('the last page & next page link should be hidden in last page',async()=>{
        await expect(page.locator('//a[text()="Last"]')).toBeHidden();
        await expect(page.locator('li[title="Next Page"]')).toBeHidden();
    })
    await test.step('The first and previous page links should be visible ',async()=>{
        await expect(page.locator('//a[text()="First"]')).toBeVisible();
        await expect(page.locator('li[title="Previous Page"]')).toBeVisible();
    })
    await test.step('clicking on the random middle page',async()=>{
        await page.locator('(//a[@class="page-link"])[4]').click();
    })    
    await test.step('All the four page links should be visible in the middle page',async()=>{
        await expect(page.locator('li[title="Previous Page"]')).toBeVisible();
        await expect(page.locator('//a[text()="First"]')).toBeVisible();    
        await expect(page.locator('//a[text()="Last"]')).toBeVisible();
        await expect(page.locator('li[title="Next Page"]')).toBeVisible();
    })        
})
test('Validating Next Page, Previous Page and Number page visibility', async()=>{
    
    await test.step('Verify that first five page links should be visible in the first page',async()=>{
        for(let i=0;i<5;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('Clicking on the last page',async()=>{
        await page.locator('//a[text()="Last"]').click();
    })
    await test.step('four page links should be visible in the last page',async()=>{
        for(let i=0;i<4;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('clicking on the random middle page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).click();
    })   
    await test.step('the middle page should contains five number page links',async()=>{
        for(let i=0;i<4;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
})