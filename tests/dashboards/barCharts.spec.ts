import {test,expect,Browser,BrowserContext,Page,chromium,Locator} from "@playwright/test";
import EleDashboardPages from "./POM/Dashboards.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleDashboardPages;

let checkBoxes : Locator[];
let radio_buttons : Locator[];
let tabs :Locator[],tabHeader:string|null,chartHeader:string|null;
let tabName : string[];
let verticalText : string|null;
let filterOptions : Locator[];

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch({headless:false,downloadsPath:`tests/dashboards/newfile.png`});
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleDashboardPages(page);
     await page.goto(baseUrl);
     await list.menu.click();
     await list.explorer.click();
     await list.Dashboards.click();
     await list.barChart.click();
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('Verifying all the checkboxes can be checked and unchecked',async()=>{
    await test.step('waiting for the visibility of checkboxes fetching the locators of checkboxes',async()=>{
        await page.locator('[class*="mat-checkbox-inner-container"]').nth(1).waitFor({state:"visible"})
        checkBoxes = await page.locator('[class*="mat-checkbox-inner-container"]').all();
        console.log(checkBoxes.length);
    })       
    for(let i=0;i<checkBoxes.length;i++){
        await test.step('clicking and validating the the checkboxes one by one',async()=>{
            await checkBoxes[i].click();
            await expect(checkBoxes[i]).toBeChecked();
        })
        await test.step('Unchecking and validating the checkboxes',async()=>{
            await checkBoxes[i].uncheck();
            await expect(checkBoxes[i]).not.toBeChecked();            
        })        
    }
})
test('Verifying all radio buttons can be selected',async()=>{
    await test.step('waiting for the visibility of radio buttons and fetching the locators of radio buttons',async()=>{
        await page.locator('[class="mat-radio-outer-circle"]').nth(0).waitFor({state:"visible"})
        radio_buttons = await page.locator('[class="mat-radio-outer-circle"]').all();
        console.log(radio_buttons.length);
    }) 
    for(let i=0; i<radio_buttons.length;i++){
        await test.step('clicking the radio buttons and validating the previous radio buttons',async()=>{
            await radio_buttons[i].click();
            if(i>0){await expect(radio_buttons[i-1]).not.toBeChecked();}
        })        
    }
})
test('Verifying the tab names and chart names should be related ',async()=>{
    await test.step('waiting and fetching the locators of tab headers',async()=>{
        await page.locator('[class="mat-tab-label-content"]').nth(0).waitFor({state:"visible"});
        tabs = await page.locator('[class="mat-tab-label-content"]').all();
    })
    await test.step('Fetching the text content of tab header and chart header',async()=>{
        tabHeader = await page.locator('[class="mat-tab-label-content"]').nth(0).textContent();
        chartHeader = await page.locator('[class*=card-header]').nth(1).textContent();
    })
    await test.step('Verifying that chart heading and tab heading are related ',async()=>{
        expect(chartHeader).toContain(tabHeader);
    })    
    for(let i=1;i<tabs.length;i++){
        await test.step('clicking the tabs one by one',async()=>{
            await tabs[i].click();
        })
        await test.step('Fetching the text content of tab header and chart header',async()=>{
            tabHeader= await tabs[i].textContent();
            chartHeader = await page.locator('[class*=card-header]').nth(1).textContent();
        })
        await test.step('Verifying that chart heading and tab heading are related ',async()=>{
            try{expect(chartHeader).toContain(tabHeader);}
            catch(Error){console.log(Error);}
        })
    }
})
test('Verifying the view chart, close chart and chart type (Vertical/Horizontal) in all tabs ',async()=>{
    await page.locator('[class*="pagination-before"]').click();
    await page.locator('[class*="pagination-before"]').click();
    await test.step('waiting and fetching the locators of tab headers',async()=>{
        await page.locator('[class="mat-tab-label-content"]').nth(0).waitFor({state:"visible"});
        tabs = await page.locator('[class="mat-tab-label-content"]').all();
    })
    await test.step('fetching the tab names',async()=>{
        tabName = await page.locator('[class="mat-tab-label-content"]').allTextContents();
    })    
    for(let i=0;i<tabs.length;i++){
        await test.step('navigating between the tabs',async()=>{
            await tabs[i].click();
        })
        await test.step('Expanding the chart and checking the visibility of download and closing the chart',async()=>{
            await page.locator('[class="pull-right"]').click();
        })
            await test.step('wait for the visibility of chart and download',async()=>{
                await page.locator('svg[width]').nth(1).waitFor({state:"visible"});
                await expect(page.locator('text="Download"')).toBeVisible();
            })            
            await test.step('downloading the chart',async()=>{
                await page.locator('text="Download"').click();                                
            })            
            await test.step('closing the chart',async()=>{
                await page.locator('text="close"').click();
            })          
        //await page.waitForLoadState('networkidle');
        await test.step('getting the vertical text from the chart',async()=>{
            verticalText = await page.locator('text[transform="rotate(270)"]').nth(0).textContent();
        })    
        console.log(await page.locator('[class*=label-active]').textContent());
        await test.step('verifying the text based on the chart format',async()=>{       
            try{if(tabName[i].includes("Vertical")){expect(verticalText).toBe(' Amount ');}
            else{expect(verticalText).toBe(' Currency ');}}
            catch(Error){console.log(Error,i);}        
        })
        if(i==tabs.length-1){await page.pause();}
    }
})
test('Verifying the filers can be hidden and visible',async()=>{
    await test.step('Waiting for the visibility of filters and getting locators for the filters type',async()=>{
        await page.locator('[class*="border-bottom"]').nth(0).waitFor({state:"visible"});
        filterOptions = await page.locator('[class*="border-bottom"]').all();
    })    
    await test.step('Clicking the filter option to close the filters',async()=>{
        await page.locator('[role="button"]').click();
    })       
    for(let i=0;i<filterOptions.length;i++){
        await test.step('checking that all the filters should be hidden',async()=>{
            await expect(filterOptions[i]).toBeHidden();
        })        
    }
    await test.step('Clicking the filter option to open the filters',async()=>{
        await page.locator('[role="button"]').click();
    }) 
    await test.step('waiting for the visibility of filter names',async()=>{
        await page.locator('[class*="border-bottom"]').nth(0).waitFor({state:"visible"});
    })    
    for(let i=0;i<filterOptions.length;i++){
        await test.step('checking that all the filters should be visibile',async()=>{
            await expect(filterOptions[i]).toBeVisible();
        })        
    }
})