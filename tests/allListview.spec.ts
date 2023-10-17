import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let count: string | null,noOfcount: string | null , count1: string | undefined;
let noOfRows: string[],no1: Number,no2: Number;
let filters: Locator[],no:any;

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
test('Verify the pages are navigated with proper pagination in tabular view',async()=>{    
       
    // await expect(page).toHaveURL(`${baseUrl}page/02d3c622-00d9-4c90-a1ac-82dbed96c655/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    await test.step('Selecting the five options presents in item per page by using for loop',async()=>{
        for(let i=0; i<4; i++){
            await test.step('clicking on the item per page drop down',async()=>{
                await page.locator("div[class*='mat-select-arrow']").first().click();
            })
            await test.step('clicking an element and getting text of the selected element ',async()=>{
                count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
                await page.locator("span[class='mat-option-text']").nth(i).click();
            })            
            await test.step('getting count of the rows presented in the page',async()=>{
                await page.locator('td[class*="cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                noOfRows = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').allTextContents();
                no1 = noOfRows.length; 
            })
            if(Number(count)>Number(no1)){console.log(no1,count);break;}
            await test.step('validating the selected count and presented no.of rows',async()=>{
                expect(count).toContain(`${no1}`); 
            })
            await test.step('fetch the paginator range label from the page and print the count of the rows  ',async()=>{
                noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                console.log(noOfcount+" no.of invoice " +no1); 
            })
            await test.step('navigate to the next four pages and validating the pages with the selected count ',async()=>{
                for(let i=0; i<4;i++){
                    await test.step('navigating to the next page',async()=>{
                        await page.locator('button[class*="mat-paginator-navigation-next"]').click();
                    })
                    await test.step('getting count of the rows presented in the page',async()=>{
                        await page.locator('td[class*="cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                        noOfRows = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').allTextContents();
                        no2 = noOfRows.length;    
                    })
                    if(no1>no2){
                        console.log(no2,count);
                        break;
                    }
                    await test.step('validating the selected count and presented no of rows',async()=>{
                    expect(count).toContain(`${no2}`);       
                    })
                    await test.step('fetch the paginator range label from the page and print the count of the rows and range label ',async()=>{
                        noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                        console.log(noOfcount+" no.of invoice " +no2); 
                    })
                }
            })       
           }
    })    
})

test.only('Filtering the records in List view',async()=>{        
    await test.step('clicking the table chart list',async()=>{
        await page.locator('text="table_chart"').click();
    })     
    await test.step('Identifying the applicable filters',async()=>{
        await page.locator('button[class*="btn-toggle"]').nth(1).waitFor({state:"visible"});
        filters = await page.locator('button[class*="btn-toggle"]').all();
        no = filters.length;
    })
    //inputs of the filters
    const inputs = ['INV20230828474932','CRN1000339','INITIATION','NEW'];
    const filter = ['Reference','Customer reference','Stage','status'];
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