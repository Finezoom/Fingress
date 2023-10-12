import {test,expect} from "@playwright/test";

const baseUrl = "http://chennai49.demo.fingress.com:9887/";

test('Validating filter of redirect',async({page})=>{
    await page.goto(baseUrl);
    await page.locator("//mat-icon[text()='view_comfy']").click();
    await page.locator("//span[text()='Fingress Explorer']").click(); //searchbox does not work in automation
    await page.locator("text='   List Pages   '").click();
    await page.locator('//span[text()="Master Detail"]').click();
    await page.locator('text=" 360 Networks "').nth(0).click();
    await page.locator('text="Redirect"').click();
    await page.locator("text='search'").nth(1).click();
    await page.locator('input[class*="mat-input-element"]').nth(1).fill("INV20230810444854");
    await page.locator('input[class*="mat-input-element"]').nth(2).fill("INV20230810444854");
    await page.locator('input[class*="mat-input-element"]').nth(3).fill("INV20230810444854");
    await page.locator('svg[class*="mat-datepicker"]').nth(0).click();
})
test('validating count selection',async({page})=>{
    await page.goto(baseUrl);
    await page.locator("//mat-icon[text()='view_comfy']").click();
    await page.locator("//span[text()='Fingress Explorer']").click();
    await page.locator("text='   List Pages   '").click();
    await page.locator('//span[text()="Tabular"]').first().click();
    for(let i=0; i<5; i++){
    await page.locator("div[class*='mat-select-arrow']").first().click();
    await page.locator("span[class='mat-option-text']").nth(i).click();
    const count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
    await page.locator('button[class*="fg-icon-btn"]').nth(i).waitFor({state:"visible"});
    const no = await page.locator('button[class*="fg-icon-btn"]').all();
    const no1 = no.length;
    expect(count).toContain(`${no1}`);
    const text = await page.locator('div[class="mat-paginator-range-label"]').textContent();
    console.log(text + " No.of invoice " +count);
    }
})
test('action view - removed feature',async({page})=>{
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();
    // await list.listPages.click();
    // await list.tabular.click();
    await page.locator('button[class*="fg-icon-btn"]').first().click();
    await page.locator('//p[text()=" Gallery Card "]').waitFor({state:"visible"});
    const text = page.locator('//p[text()=" Gallery Card "]');
    await expect(text).toBeVisible();    
    console.log(await text.textContent());
})
test("validating refresh",async({page})=>{
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();
    // await list.listPages.click();
    // await list.listView.waitFor({state:"visible" });
    // await list.listView.click();
    await page.locator('//mat-icon[text()="refresh"]').click();
    await page.waitForTimeout(7000);
    await page.locator('//span[text()=" INV20230518345473"]').waitFor({state:"visible"});
    const firstPage = page.locator('//a[text()="1"]');
    try{await expect(firstPage,"Page box is not presented").toBeVisible();}catch(Error){console.log(Error)}
    finally{
    const pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent();
    console.log(pageCount); 
    expect(pageCount,'count is not displayed').toContain("51");}
})

test('validating buttons in master details',async({page})=>{
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();
    // await list.listPages.click();
    // await list.masterDetails.click();
    for(let i=0;i<39;i++){
    await page.locator('//label //span').nth(i).click();
    await expect( page.locator('//label //span').nth(i)).toBeChecked();
    await page.locator("//label //span").nth(i).click();
    await expect( page.locator('//label //span').nth(i)).not.toBeChecked();
    }    
})
test('validating file uploading in master details',async({page})=>{
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();
    // await list.listPages.click();
    // await list.masterDetails.click();
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#fileDropRef').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('PlaywrightFrameScreenshot 2023-09-06 164338.png');    
    await expect(page.locator('text="Attachment upload successfully"')).toBeVisible();   
    await expect(page.locator("div[class*='single-file']")).toBeVisible();
    await expect(page.locator('#fileDropRef')).not.toBeVisible();
    await page.locator('text="delete"').click();
    await expect(page.locator('text="Attachment Removed Successfully."')).toBeVisible();
    await expect(page.locator("div[class*='single-file']")).not.toBeVisible();
})
test('kanban - kanban details',async({page})=>{
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();
    // await list.listPages.click();
    // await list.kanban.click();
    const details = await page.locator('span[class*="line-clamp1"]').allTextContents();
    const redirect = await page.locator('text="arrow_forward"').all();
    for(let i=0;i<redirect.length;i++){
        await redirect[i].click();
        for(let j=0;j<4;j++){

        }
    }
})
test('validating browse file',async({page})=>{//require work in delete///////////////////////////////////////////////////
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();
    // await list.listPages.click();
    // await list.masterDetails.click();
    // await list.masterDetailsDashboard.click();
    await page.locator('text="Browse"').click();
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=" Choose "').click();
    const fileChooser = await fileChooserPromise;    
    await fileChooser.setFiles('PlaywrightFrameScreenshot 2023-09-06 164338.png'); 
    await expect(page.locator('div[class="mt-3"]').nth(0)).toBeVisible();
    await page.locator('text=" Upload "').click();
    await expect(page.locator('text=" Successfully uploaded"')).toBeVisible();
    await page.locator('text="Browse"').click();
    await page.locator("text='Cancel'").click();
    await page.locator('text="Browse"').click();
    await page.locator("text='close'").click();
    await expect(page.locator("//mat-icon[text()='delete']")).toBeVisible(); 
    await page.locator("//mat-icon[text()='delete']").click();
    await expect(page.locator('text="Attachment removed Successfully"')).toBeVisible();
})
test('Validating Search box & refresh',async({page})=>{
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();///////////////////////////////////////reowrk in count validation/////////////////////////////////bdfgsdkjablast
    // await list.listPages.click();
    // await list.masterDetails.click();
    // await list.masterDetailsDashboard.click();
    await page.locator('text="Redirect"').click();
    for(let i=0; i<15; i++){
    const refno = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').nth(i).textContent();
    const input = refno?.substring(2,20)
    console.log()
    await page.locator('input[class*="mat-input-element"]').fill(`${input}`);
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
    const no = await page.locator('button[class*="fg-icon-btn"]').all();
    const no1 = no.length/2;    
    expect(no1).toBe(1);
    await page.pause();
    await page.locator('button[mattooltip="Refresh"]').click();
    await page.waitForLoadState('networkidle');
    const no_ = await page.locator('button[class*="fg-icon-btn"]').all();
    const no2 = no_.length/2; 
    await page.waitForTimeout(4000)
    expect(no2).toBe(50);
    }    
})
test('kanban - item per page',async({page})=>{///////////////////array rework//////////////////////////////////////////////////////
    await page.goto(baseUrl);
    // await list.menu.click();
    // await list.explorer.click();
    // await list.listPages.click();
    // await list.kanban.click();
    await page.locator("div[class*='mat-select-arrow-wrapper']").click();
    const no = await page.locator("mat-option[role$='option']").allTextContents();
    for(let i=0;i<4;i++){        
        await page.locator("mat-option[role$='option']").nth(i).click();
        const forward = await page.locator('text="arrow_forward"').all();
        const count=forward.length;
        console.log(no);
        expect(no[i], `${no}`).toContain(`${count}`);
    }
})
