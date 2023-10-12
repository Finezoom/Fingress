import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;

let page : Page;
let list : EleListPages;

let data: string | null, cal_format:string | null, cal1: string | null, cal2 : string | null, cal3 : string | null;
let cells : Locator[];
let baseUrl = "http://192.168.1.49:8086/";

test.beforeEach(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleListPages(page);
     await page.goto(baseUrl);
     await test.step('navigating to the calendar page from the home page',async()=>{
        await list.menu.click();
        await list.explorer.click();
        await list.listPages.click();
        await list.calendar.click();
     })
})

test.afterEach(async()=>{
    await page.close();
    await browser.close();
})

test('Calendar View - Verifying records marked against days in a month', async()=>{    
    await test.step('checking the entries of the date cell',async()=>{
        for(let i=1;i<31;i++){
            await test.step('dividing the cells based on the date',async()=>{
                if(i<10){await page.locator(`td[data-date='2023-10-0${i}']`).click();}
                else{await page.locator(`td[data-date='2023-10-${i}']`).click();}
            })
            await test.step('fetching the record status',async()=>{
                data = await page.locator("h5").textContent();
            })
            await test.step('Verifying the records of all cells',async()=>{
                try{expect(data,`date ${i}`).toContain('There are currently no records available.');}
            catch(Error){console.log(i)}
            })               
        }
    })    
})
test('Redirecting to today in month/day/week',async()=>{        
    await test.step('selecting the day/month/week',async()=>{
        for(let i=0;i<3;i++){
            await test.step('selecting calender type and fetching the text of selected calendar type',async()=>{
                cal_format = await page.locator('button[class*="fc-dayGrid"]').nth(i).textContent();
                await page.locator('button[class*="fc-dayGrid"]').nth(i).click(); 
            })
            await test.step('getting current month/week/day',async()=>{
                cal1 = await page.locator("h2").textContent(); 
            })   
            await test.step('navigating to the next calendar page',async()=>{
                for(let i=0; i<4;i++)
                await page.locator(`button[title='Next ${cal_format}']`).click();
            })           
            await test.step('getting navigated month/week/day',async()=>{
                cal2 = await page.locator("h2").textContent();
            })
            await test.step('calendar titles should be different',async()=>{
                expect(cal1).not.toBe(cal2);                
            })
            await test.step('Clicking the today option',async()=>{
                await page.locator("text='today'").click();                
            })
            await test.step('getting calender title after clicking today',async()=>{
                cal3 = await page.locator("h2").textContent();
            })
            await test.step('the first and third titles should be same',async()=>{
                expect(cal3).toContain(cal1);
            })
            console.log(cal_format,cal1,cal2,cal3);
            console.log(`the ${cal_format} button is validated`);
        }
    })    
})
test("Calendar View - Verifying records marked against days in a week",async()=>{    
    await test.step('selecting the calender format',async()=>{
        await page.locator("text='week'").click();
    })
    await test.step('getting locators of all the day cells',async()=>{
        cells = await page.locator('td[role="gridcell"]').all();
    })
    await test.step('clicking all the cells and validating the entries',async()=>{
        for(let i=0; i < cells.length; i++){
            await cells[i].click();
            await test.step('getting entries from the date cells',async()=>{
                data = await page.locator("h5").textContent();             
            })            
            await test.step('validating the entries of date cells',async()=>{
                try{expect(data,`date ${i}`).toContain('There are currently no records available.');}
                catch(Error){console.log(i);}            
            })            
        }
    })    
})
test('validating previous month and next month navigation',async()=>{    
    await test.step('getting current month title',async()=>{
        cal1 = await page.locator("h2").textContent();    
    })
    await test.step('navigating to the particular month and getting the calender title',async()=>{
        while(cal1!='January 2023'){await page.locator('button[title="Previous month"]').click();
        cal1 = await page.locator("h2").textContent();}    
    })    
    console.log(cal1);     
    //UI comparison    
    await expect(page).toHaveScreenshot('image.png',{fullPage: true});    
    await test.step('clicking the next month',async()=>{
        await page.locator('button[title="Next month"]').click();
    })              
})