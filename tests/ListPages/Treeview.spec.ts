import {test,expect,chromium, Browser, BrowserContext, Page, Locator, selectors} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let noOfcount: string | null ;
let noOfRows: string[],no2: Number;
let count: string | null,no1: Number;

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
        await list.treeView.click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})

test('expansion in tree view',async()=>{
    await page.locator('div[class*="list-toggle"]').nth(1).waitFor({state:"visible"});
    const expand = await page.locator('div[class*="list-toggle"]').all();
    for(let i=0; i< expand.length;i++){
        await expand[i].click();
        console.log("validating rows");
        await expect(page.locator('text="Due Date"').nth(i)).toBeVisible();
        // try{await expect(page.locator("text='No Matching Data Found.'")).toBeVisible(); }
        // catch(Error){console.log(Error,i);}               
    }
})
test('validating item per page',async()=>{
    await test.step('Selecting the five options presents in item per page by using for loop',async()=>{
        for(let i=0; i<4; i++){
            await test.step('click on the item per page drop down',async()=>{
                await page.locator("div[class*='mat-select-arrow']").first().click();
            })
            await test.step('clicking an element and getting text of the selected element ',async()=>{
                count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
                await page.locator("span[class='mat-option-text']").nth(i).click();
            })            
            await test.step('getting count of the rows presented in the page',async()=>{
                await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                noOfRows = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').allTextContents();
                no1 = noOfRows.length; 
            })
            if(Number(count)>Number(no1)){console.log(no1);break;}
            await test.step('validating the selected count and presented no of rows',async()=>{
                expect(count).toContain(`${no1}`); 
            })
            await test.step('fetch the paginator range label from the page and print the count of the rows and range label ',async()=>{
                noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                console.log(noOfcount+" no.of invoice " +no1); 
            })
            await test.step('navigate to the next four pages and validating the pages respect to the selected count ',async()=>{
                for(let i=0; i<4;i++){
                    await test.step('navigating to the next page',async()=>{
                        await page.locator('button[class*="mat-paginator-navigation-next"]').click();
                    })
                    await test.step('getting count of the rows presented in the page',async()=>{
                        await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                        noOfRows = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').allTextContents();
                        no2 = noOfRows.length;    
                    })
                    if(no1>no2){
                        console.log(no2);
                        break;
                    }
                    await test.step('validating the selected count and presented no of rows',async()=>{
                    expect(count).toContain(`${no2}`);       
                    })
                    await test.step('fetch the paginator range label from the page and print the count of the rows and range label ',async()=>{
                        noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                        console.log(noOfcount," no.of invoice ",no2); 
                    })
                }
            })       
           }
    })  
})
