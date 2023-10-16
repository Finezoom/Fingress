import {test,expect,chromium, Browser, BrowserContext, Page, Locator, selectors} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;
let minimize: Locator[],countOfMinimize:any;
let maximize: Locator[],countOfMaximize: any;
let count: string | null,no1: Number;
let kanbanOptions: Locator[];
let baseUrl = "http://192.168.1.49:8086/";


test.beforeEach(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleListPages(page);
     await page.goto(baseUrl);
     await test.step('Navigating to the kanban page from the home page',async()=>{
        await list.menu.click();
        await list.explorer.click();
        await list.listPages.click();
        await list.kanban.click();
     })     
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})
test.describe('Kanban',()=>{

test('Kanban - Verifying  the minimize,maximize options',async()=>{       
    await test.step('Fetching locators for all the minimizing option',async()=>{
        await page.locator("button[aria-label='minimize board']").nth(1).waitFor({state:"visible"});
        minimize =await page.locator("button[aria-label='minimize board']").all();
        countOfMinimize = minimize.length;  
    })              
    for(let i=0;i < countOfMinimize;i++){
        await test.step('Clicking minimize options one by one',async()=>{
            await minimize[0].waitFor({state:'visible'});
            await minimize[0].click();
        })
        await test.step('Checking the items size after minimizing',async()=>{
            //this locator is used to validate the minimized box of kanban
            if(i==countOfMinimize-1){ await expect(page.locator("div[style*='50px;']").nth(i-1)).toBeVisible();}
            else{await expect(page.locator("div[style*='50px;']").nth(i)).toBeVisible();}
        })        
    }
    await test.step('Fetching the count of  maximize options',async()=>{
        maximize = await page.locator('button[aria-label="maximize board"]').all();
        countOfMaximize= maximize.length;
    })
      
    for(let i=0;i<countOfMaximize;i++){
        await test.step('Clicking all maximizing options one by one',async()=>{
            await maximize[0].waitFor({state:'visible'});
            await maximize[0].click();
        })        
    }
})
test('Kanban - Board options',async()=>{   
    selectors.setTestIdAttribute('class');
    await test.step('Checking the availability of chart option',async()=>{
        await expect(page.getByTestId('gauge chart').nth(1)).toBeVisible();
    })        
    await test.step('Verifying the availability of kanban details',async()=>{
        await expect(page.locator('span[class*="line-clamp1"]').nth(1)).toBeVisible(); 
    })
    await test.step('Selection of the dashboard',async()=>{
        await page.locator('text="insert_chart"').click();
    })
    await test.step('show trend should be hidden',async()=>{
        expect(page.getByTestId('tree-map chart').nth(1)).not.toBeVisible();
    })   
    await test.step('clicking on the setting option',async()=>{
        await page.locator('text="settings"').click();
    })    
    await test.step('disabling the chart in board and kanban details, enabling the show trend',async()=>{
        await page.getByTestId('mat-slide-toggle-label').nth(0).click();
        await page.getByTestId('mat-slide-toggle-label').nth(1).click();
        await page.getByTestId('mat-slide-toggle-label').nth(2).click();
    })
    await test.step('clicking on the close option',async()=>{
        await page.locator('text="Close"').click();
    })
    await test.step('Show trend should be visible in dashboard',async()=>{
        await expect(page.getByTestId('tree-map chart')).toBeVisible();
    })
    await test.step('Select Kanban Work item page',async()=>{ 
        await page.locator('text="view_column"').click();
    })
    await test.step('Chart in board and kanban details should be hidden in kanban page',async()=>{
        await expect(page.getByTestId('gauge chart').nth(1)).toBeHidden();
        await expect(page.locator('span[class*="line-clamp1"]').nth(1)).toBeHidden(); 
    })    
})
test('kanban - Validating board items in settings',async()=>{        
    await test.step('Clicking on the setting option',async()=>{
        await page.locator('text="settings"').click();
    }) 
    await test.step('Getting locators of all options',async()=>{
        kanbanOptions = await page.locator('mat-chip').all();
    })      
    for(let i=0;i<kanbanOptions.length;i++){
        if(i!=0){await test.step('clicking on the setting option',async()=>{
            await page.locator('text="settings"').click();
        })}
        await test.step('Unchecking the kanban options one by one',async()=>{
            await kanbanOptions[i].waitFor({state:"visible"});    
            await kanbanOptions[i].click();
        })
        await test.step('Clicking close option',async()=>{
            await page.locator('text="Close"').click();
        })
        await test.step('Validating that the unchecking otions should be hidden in the kanban board',async()=>{
            await expect(page.locator(`//div[contains(text(),'${kanbanOptions[i].textContent}')]`)).toBeHidden();
        })        
    }
})
test('kanban - Verify the options available in detail page ',async()=>{       
    await test.step('clicking the navigating option, which presents inside the kanban options',async()=>{
        await page.locator('text="arrow_forward"').nth(0).click();
    }) 
    // await expect(page).toHaveURL(`${baseUrl}page/30c7ea83-61ec-4bd5-8d37-fa62b9222ef0/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    await test.step('checking the base check box',async()=>{
        await page.locator('span[class*="mat-checkbox-inner-container"]').nth(0).click();
    })
    await test.step('the child check box should be clicked',async()=>{
        await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(1)).toBeChecked();
    })
    await test.step('unchecking the child check box',async()=>{
        await page.locator('span[class*="mat-checkbox-inner-container"]').nth(1).click();
    })
    await test.step('the base checkbox should be unchecked',async()=>{
        await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(0)).not.toBeChecked();
    }) 
    await test.step('clicking the discard option',async()=>{
        await page.locator('text="Discard"').click();
    })    
    // await expect(page).toHaveURL(`${baseUrl}fgPage/7c33373a-c651-4579-a1f6-8d0bc948261c/44b4eb67-f5b8-482b-934f-a03d7f8796be`)
})
test("Validating item per page in Kanban",async()=>{        
    for(let i=0; i<4; i++){        
        await test.step('clicking the item per page',async()=>{
            await page.locator("div[class*='mat-select-arrow']").first().click();
        })
        await test.step('selecting count and fetching the count as text',async()=>{
            count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
            await page.locator("span[class='mat-option-text']").nth(i).click();
        })
        await page.waitForTimeout(2000);
        await test.step('Getting the count of work items',async()=>{
            const noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();
            console.log(noOfcount);
        })              
        await page.locator('button[class*="fg-icon-btn"]').nth(4).waitFor({state:"visible"});
        await test.step('counting the items per page based on navigation options',async()=>{
            const no = await page.locator('button[class*="fg-icon-btn"]').all();
            no1 = no.length; 
        })
        if(i==3){console.log(no1);break;}
        await test.step('Validating the counting and selected count',async()=>{            
            expect(count).toContain(`${no1}`);            
            console.log(" No.of items " +no1);
        })                   
        }        
})
})
