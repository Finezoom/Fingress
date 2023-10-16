import {test,expect,chromium, Browser, BrowserContext, Page} from "@playwright/test";
import EleListPages from "./POM/listpages.page";



let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let yearMonth: string | null, day : string | null;
let count: string | null,no1: Number;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeEach(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleListPages(page);
     await page.goto(baseUrl);
     await test.step('Navigating to action view of list view from home page',async()=>{
        await list.menu.click();
        await list.explorer.click();
        await list.listPages.click();
        await list.listView.click();
        await list.action.click();
    })     
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})
test('Verify the page is navigated to detail form and vice versa by discarding it',async()=>{        
    // await expect(page).toHaveURL(`${baseUrl}fgPage/1c87e5c3-9e88-4e5b-87e8-2c7f63c28169/44b4eb67-f5b8-482b-934f-a03d7f8796be/detail/2cd79090-eec7-4806-9445-ce2a7df58d89?id=%7B%22BILL_NAME%22:%22Test01%22,%22BILL_TO_GST%22:%2200265356%22,%22INVOICE_TO_PIN_CODE%22:%22600100%22,%22REFERENCE_ID%22:%22INV20230906499765%22,%22SUB_TYPE_CODE%22:%22FG_INVOICES%22,%22CUSTOMER_REFERENCE%22:%2224041311167000042529377.30%22,%22DUE_AMOUNT%22:null,%22INV_EMAIL%22:null,%22INVOICE_DATE%22:%222023-09-07%22,%22AMOUNT%22:null,%22DATE_DELIVERED%22:null,%22RADIO_FIELD%22:null,%22TYPE_CODE%22:%22FG_DEMO%22,%22ID%22:%2238b49194-0e51-4c09-8cf6-803e40d0a814%22,%22PROCESS_ID%22:%2237915c62-4ca2-11ee-bbb4-346f24208dd3%22,%22CREATED_BY%22:882,%22LAST_UPDATED_BY%22:883,%22GST_AMOUNT%22:null,%22LINE_ITEM_DISCOUNT_AMT%22:null,%22BILL_FROM%22:null,%22IS_TEMPLATE%22:false,%22LAST_UPDATED_ON%22:%222023-09-06T11:12:58.432Z%22,%22LAST_AUTHORISED_ON%22:%222023-09-06T11:12:58.416Z%22,%22LINE_ITEM_AMT_BASE%22:null,%22NAME%22:%22Assam%22,%22LINE_ITEM_AMT%22:null,%22TOTAL_TAX%22:null,%22ANCHOR_CODE%22:null,%22BILL_TYPE%22:null,%22PRODUCT_STATUS%22:%22Below%202000%22,%22ISSUING_PARTY_CODE%22:%22FINGRESS%22,%22ADDRESS%22:%22ASSAM%22,%22CREATED_ON%22:%222023-09-06T10:41:47.024Z%22,%22EMAIL_ID%22:null,%22LINE_NO%22:null,%22INV_NUMBER%22:%22TEST0005%22,%22TASK_ID%22:%2237915c81-4ca2-11ee-bbb4-346f24208dd3%22,%22APPLICANT_PARTY_CODE%22:%22AMAZON%22,%22INV_NAME%22:%22360%20Networks%22,%22IDENTIFIER_KEY%22:%22%7B%5C%22VERSION_ID%5C%22:1,%5C%22REFERENCE_ID%5C%22:%5C%22INV20230906499765%5C%22,%5C%22ID%5C%22:%5C%2238b49194-0e51-4c09-8cf6-803e40d0a814%5C%22%7D%22,%22STAGE_CODE%22:%22INITIATION%22,%22CURRENCY_CODE%22:null,%22BENE_ACC_NUMBER%22:null,%22DESCRIPTION%22:null,%22DEBIT_ACC_NUMBER%22:null,%22LAST_AUTHORISED_BY%22:883,%22ICON%22:null,%22BILL_ADDR3%22:null,%22IS_MASTER_VERSION%22:false,%22BILL_PHONE%22:null,%22CITY_1%22:%22Chennai%22,%22BILL_ADDR1%22:null,%22TOTAL_TAX_BASE%22:null,%22BILL_ADDR2%22:null,%22INV_STATUS%22:null,%22ACTIVE_CODE%22:%22ACTV%22,%22COUNTERPARTY_CODE%22:null,%22INV_ADDRESS1%22:%22A1%22,%22DUE_DATE%22:%222023-09-08T00:00:00.000Z%22,%22INV_ADDRESS3%22:null,%22APPLICANT_PARTY%22:%22AMAZON%22,%22INV_ADDRESS2%22:null,%22CREATED_NAME%22:%22Rajamanickam%20Ramachandran%22,%22BENE_NAME%22:%22AMAZON%22,%22STATUS_CODE%22:%22REJECTED%22,%22BILL_TO_PIN_CODE%22:%22629401%22,%22UPLOAD_REF_ID%22:null,%22VERSION_ID%22:1,%22BILL_TO%22:null,%22BILLING_PERIOD%22:null,%22CITY%22:%22Delhi%22,%22BILL_EMAIL%22:null,%22DISCOUNT_AMOUNT%22:null,%22INV_PHONE%22:null,%22DMS_ID%22:null%7D&viewMode=view`);
    await test.step('Fetching text content from the dashboard',async()=>{
        for(let i=0;i<27;i++){
            await expect(page.locator('div[class="form-group"]').nth(i)).toBeVisible();
            const text = await page.locator('div[class="form-group"]').nth(i).textContent();
            console.log(text);
        }   
        await test.step('Clicking on the discard option',async()=>{
            await page.locator('text="Discard"').nth(0).click();
        })        
    })    
    // await expect(page).toHaveURL(`${baseUrl}fgPage/1c87e5c3-9e88-4e5b-87e8-2c7f63c28169/44b4eb67-f5b8-482b-934f-a03d7f8796be/detail/be760656-b999-4a42-bd20-5276c0f9f9e6`);
})
test('Verify the operation of check boxes selection and search box in detail form',async()=>{    
    await test.step('Checking the base check box',async()=>{
        await page.locator('span[class*="mat-checkbox-inner-container"]').nth(0).click();
    })
    await test.step('The child check box should be clicked',async()=>{
        await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(1)).toBeChecked();
    })
    const checkBoxes=await page.locator('span[class*="mat-checkbox-inner-container"]').all();
    for(let i=1; i<checkBoxes.length;i++){
        await test.step('Unchecking the child check box',async()=>{
            await page.locator('span[class*="mat-checkbox-inner-container"]').nth(i).click();
        })
    }
    await test.step('The base checkbox should be unchecked',async()=>{
        await expect(page.locator('span[class*="mat-checkbox-inner-container"]').nth(0)).not.toBeChecked();
    })    
    await test.step('Passing a invalid input in the search box',async()=>{
        await page.locator('input[class*="mat-input-element"]').nth(0).fill('djksbajdsbn');
    })
    await test.step('The search and clear options should be visible',async()=>{
        await page.locator('text="Search"').waitFor({state:"visible"});
        await expect(page.locator('text="Search"')).toBeVisible();
        await expect(page.locator('text="Clear"')).toBeVisible();
    })
    await test.step('Clicking the search option',async()=>{
        await page.locator('text="Search"').click();
    })
    await test.step('Validate the output visibility',async()=>{
        await expect(page.locator('text="No Matching Data Found."')).toBeVisible();
    })
    await test.step('Clicking the clear option',async()=>{
        await page.locator('text="Clear"').click();
    })
    await test.step('Output and search option should be hidden after clearing the selection',async()=>{
        await expect(page.locator('text="No Matching Data Found."')).not.toBeVisible();
        await expect(page.locator('text="Search"')).not.toBeVisible();
    })
    await test.step('Selecting the date and fetching the date as text',async()=>{
        await page.locator('text="calendar_today"').click();   
        await page.locator('text=" JUL "').click();
        yearMonth = await page.locator("button[aria-label*='Choose month']").textContent();
        day = await page.locator('text=" 7 "').textContent();
        await page.locator('text=" 7 "').click();
    })    
    await page.waitForTimeout(2000);
    await test.step('Getting displayed date from due date and comparing that with selected date ',async()=>{
        const date = await page.locator('p span[class="ng-star-inserted"]').nth(7).textContent();
        console.log('entered date :' +day+":"+yearMonth+ " displayed date :"+date);  
    })      
})
test('Verifying radio buttons of in detail page ',async()=>{        
    for(let i=0;i<3;i++){
        await test.step('Selecting radio button with for loop',async()=>{
            await page.locator('span[class="mat-radio-container"]').nth(i).click();
        })    
        if(i==0){
            await test.step('While checking the first button, second & third buttons should be unchecked',async()=>{
                await expect(page.locator('.mat-radio-container').nth(i+1)).not.toBeChecked();
                await expect(page.locator('.mat-radio-container').nth(i+2)).not.toBeChecked();
            })        
        }
        else if(i==1){
            await test.step('While checking the second button, first & third buttons should be unchecked',async()=>{
                await expect(page.locator('.mat-radio-container').nth(i-1)).not.toBeChecked();
                await expect(page.locator('.mat-radio-container').nth(i+1)).not.toBeChecked();
            })        
        }
        else {
            await test.step('while checking the third button, first & second buttons should be unchecked',async()=>{
                await expect(page.locator('.mat-radio-container').nth(i-2)).not.toBeChecked();
                await expect(page.locator('.mat-radio-container').nth(i-1)).not.toBeChecked();
            })        
    }    
    }
})
test('Verifying test page and its options ',async()=>{    
    await test.step('clicking the test page link',async()=>{
        await page.locator('text="Test"').click();
    })
    // await expect(page).toHaveURL(`${baseUrl}fgRequestList/e87cdbcd-a7d2-4ce6-bcea-f223d80145b3/44b4eb67-f5b8-482b-934f-a03d7f8796be`)
    await test.step('page title should be visible',async()=>{
        await expect(page.locator('text="Default List "')).toBeVisible();
    })
    await test.step('clicking the download option',async()=>{
        await page.locator('text="cloud_download"').click();
    })
    await test.step('downloading options should be visible',async()=>{
        await expect(page.locator('text="picture_as_pdf"')).toBeVisible();
        await expect(page.locator('text="border_all"')).toBeVisible();        
    })
    await test.step('downloading the page as pdf option',async()=>{
        await page.locator('text="picture_as_pdf"').click();
    })    
})
/*test("validating item per page in redirection of action ",async()=>{    
    await test.step('clicking the redirect page link',async()=>{
        await page.locator('text="Redirect"').click();
    })
    // await expect(page).toHaveURL(`${baseUrl}fgRequestList/0b62dca4-d629-4ab3-ad4e-27c9217f64d1/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    for(let i=0; i<4; i++){
        await test.step('clicking the item per page',async()=>{
            await page.locator("div[class*='mat-select-arrow']").first().click();
        })
        await test.step('selecting and fetching the count as text',async()=>{
            count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
            await page.locator("span[class='mat-option-text']").nth(i).click();
        })
        await page.waitForTimeout(2000);
        await test.step('fetching the count per page',async()=>{
            const noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();
            console.log(noOfcount);
        })              
        await page.locator('button[class*="fg-icon-btn"]').nth(4).waitFor({state:"visible"});
        await test.step('counting the items per page based on navigation options',async()=>{
            const no = await page.locator('button[class*="fg-icon-btn"]').all();
            no1 = no.length/2; 
        })
        if(i==3){console.log(no1);break;}
        await test.step('validating the counting and selected count',async()=>{            
            expect(count).toContain(`${no1}`);            
            console.log(" No.of invoice " +no1);
        })                   
        }
})*/