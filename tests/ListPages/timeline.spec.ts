import {test,expect,chromium, Browser, BrowserContext, Page, Locator, selectors} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let view : Locator[],countOfInvoice: string[],invoice: Locator[];
let month :Locator[],monthBadge:string[];

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
        await list.timeLineView.click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('Validating the individual invoice count should be equal to the displayed invoice count',async()=>{
    selectors.setTestIdAttribute('class');
    await test.step('waiting for visibility of eye view and fetching all locators of eye view option',async()=>{
        await page.getByTestId('fa fa-eye pl-2 ng-star-inserted').nth(0).waitFor({state:"visible"}); 
        view = await page.getByTestId("fa fa-eye pl-2 ng-star-inserted").all(); //[class*="fa-eye"]
    })
    await test.step('getting text of count badge of invoice files',async()=>{
        countOfInvoice = await page.getByTestId('countBadge ng-star-inserted').allTextContents();//[class*="countBadge"]
    })  
    for(let i=0;i<view.length;i++){
        await test.step('clicking the eye view option',async()=>{
            view[i].click();
        })
        await test.step('waiting for the visibility of invoice files and getting locators of reference id',async()=>{
            await page.getByRole('row').nth(0).waitFor({state:"visible"});
            invoice = await page.getByRole('row').all();
        })
        await test.step('comparing the invoice count and displayed badge count',async()=>{
            const fileCount = invoice.length - 1;
            console.log("invoices count : "+fileCount,"Displayed on file "+countOfInvoice[i]);
            expect(fileCount).toBe(Number(countOfInvoice[i]));
        })
        await test.step('checking the invoice files visibilty after clicking the eye view',async()=>{
            await expect(page.getByTestId("container-fluid ng-star-inserted")).toBeVisible(); //[class*="container-fluid"]
        })
        await test.step('closing the reference file',async()=>{
            await page.getByTestId('fa fa-eye-slash pl-2 ng-star-inserted').click(); //[class*="fa-eye-slash"]
        })
        await test.step('after closing the files invoice files should be hidden',async()=>{
            await expect(page.getByTestId("container-fluid ng-star-inserted")).toBeHidden();
        })        
    }
})
test('Validating the monthly invoice count should be equal to the addition of individual invoice count',async()=>{
    selectors.setTestIdAttribute('class');
    await test.step('waiting for the visibilituy of monthly file & fetching the locators of month files',async()=>{
        await page.getByTestId('timeline-month ng-star-inserted').nth(0).waitFor({state:"visible"});
        month = await page.getByTestId('timeline-month ng-star-inserted').all(); //[class*="timeline-month"]
    })
    await test.step('closing all the opened monthly files',async()=>{
        for(let k=0; k < month.length;k++){
            await month[k].click();
        }
    })
    await test.step('fetching counts of all the monthly invoices',async()=>{
        monthBadge=await page.getByTestId('badge timelinecount ng-star-inserted').allTextContents();//[class*=badge]
    })   
    for(let i=0; i< month.length;i++){
        let a=0;//used to add invoice counts
        await test.step('opening the monthly files one by one',async()=>{
            await month[i].click();
        })
        await test.step('getting count of invoices per file',async()=>{
            countOfInvoice = await page.getByTestId('countBadge ng-star-inserted').allTextContents();
        })
        await test.step('adding the count of invoices',async()=>{            
            for(let j=0; j<countOfInvoice.length;j++){           
                a=a+Number(countOfInvoice[j]);
            }
        })
        await test.step('comparing the monthly count and total count',async()=>{
            console.log("Addition of invoice files "+a+" : "+monthBadge[i],"monthly count");
            expect(a).toBe(Number(monthBadge[i]));
        })
        await test.step('closing the opened monthly file',async()=>{
            await month[i].click();
        })       
    }
})
test('Verify the records are sorted',async()=>{
    selectors.setTestIdAttribute('class');
    await test.step('waiting for visibility of months and getting all months text',async()=>{
        await page.getByTestId('pr-1').nth(0).waitFor({state:"visible"});
        const months = await page.getByTestId('pr-1').allTextContents();
        console.log(months);
    })
    await test.step('clicking on the ascending order',async()=>{
        await page.locator("text=' Ascending '").click();
    })
    await test.step('after switching the sorting fetching the months as text',async()=>{
        const AscMonths = await page.getByTestId('pr-1').allTextContents();
        console.log(AscMonths);
    })   
})
test('Verify the individual invoice count should be equal to the displayed invoice count in created on list',async()=>{
    selectors.setTestIdAttribute('class');
    await test.step('clicking the more option',async()=>{
        await page.locator("text='more_vert'").click();
    })
    await test.step('checking the visibility of menu field',async()=>{
        await expect(page.getByRole('menu')).toBeVisible();
    })
    await test.step('selecting the created on mode',async()=>{
        await page.locator("text='Created On'").click();
    })    
    await test.step('waiting for visibility of eye view and fetching all locators of eye view option',async()=>{
        await page.getByTestId('fa fa-eye pl-2 ng-star-inserted').nth(0).waitFor({state:"visible"});
        view = await page.getByTestId("fa fa-eye pl-2 ng-star-inserted").all();
    })
    await test.step('getting text of count badge of invoice files',async()=>{
        countOfInvoice = await page.getByTestId('countBadge ng-star-inserted').allTextContents();
    })  
    for(let i=0;i<view.length;i++){
        await test.step('clicking the eye view option',async()=>{
            view[i].click();
        })
        await test.step('waiting for the visibility of invoice files and getting locators of reference id',async()=>{
            await page.getByRole('row').nth(0).waitFor({state:"visible"});
            invoice = await page.getByRole('row').all();
        })
        await test.step('comparing the invoice count and displayed badge count',async()=>{
            const fileCount=invoice.length-1;
            console.log("invoices count : "+fileCount,"Displayed on file "+countOfInvoice[i]);
            expect(fileCount).toBe(Number(countOfInvoice[i]));
        })
        await test.step('checking the invoice files visibilty after clicking the eye view',async()=>{
            await expect(page.getByTestId("container-fluid ng-star-inserted")).toBeVisible();
        })
        await test.step('closing the reference file',async()=>{
            await page.getByTestId('fa fa-eye-slash pl-2 ng-star-inserted').click();
        })
        await test.step('after closing the files invoice files should be hidden',async()=>{
            await expect(page.getByTestId("container-fluid ng-star-inserted")).toBeHidden();
        })        
    }
})
test('Validating the monthly invoice count should be equal to the addition of individual invoice count in created on',async()=>{
    selectors.setTestIdAttribute('class');
    await test.step('waiting for the visibilituy of monthly file & fetching the locators of month files',async()=>{
        await page.getByTestId('timeline-month ng-star-inserted').nth(0).waitFor({state:"visible"});
        month = await page.getByTestId('timeline-month ng-star-inserted').all();
    })
    await test.step('closing all the opened monthly files',async()=>{
        for(let k=0; k < month.length;k++){
            await month[k].click();
        }
    })
    await test.step('fetching counts of all the monthly invoices',async()=>{
        monthBadge=await page.getByTestId('badge timelinecount ng-star-inserted').allTextContents();
    })   
    for(let i=0; i< month.length;i++){
        let a=0;//used to add invoice counts
        await test.step('opening the monthly files one by one',async()=>{
            await month[i].click();
        })
        await test.step('getting count of invoices per file',async()=>{
            countOfInvoice = await page.getByTestId('countBadge ng-star-inserted').allTextContents();
        })
        await test.step('adding the count of invoices',async()=>{            
            for(let j=0; j<countOfInvoice.length;j++){           
                a=a+Number(countOfInvoice[j]);
            }
        })
        await test.step('comparing the monthly count and total count',async()=>{
            console.log("Addition of invoice files "+a+" : "+monthBadge[i]);
            expect(a).toBe(Number(monthBadge[i]));
        })
        await test.step('Close the selection for the month in timeline',async()=>{
            await month[i].click();
        })       
    }
})
    































































































































