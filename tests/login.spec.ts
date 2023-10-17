import {test, expect,Browser,BrowserContext,Page,chromium} from "@playwright/test";
import EleListPages from "./POM/listpages.page";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let list : EleListPages;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch();
     context = await browser.newContext();
     page = await context.newPage();
     list = new EleListPages(page);
     await page.goto(baseUrl);
     await test.step('Landed on the Login page from the home page',async()=>{
        await list.menu.click();
        await list.explorer.click();
        await list.Components.click();
        await list.Login.click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('',async()=>{
    await page.locator("input[name*='F_NAME']").fill('jhesfjklngv');
    await page.locator('input[name*="PH_NO"]').fill('8478589345');
    await page.locator("input[name*='EMAIL']").fill('hqtrgv@mail.com');
    await page.locator('text="SUBMIT"').click();
})
test(' ',async()=>{   
    await page.locator('[data-placeholder="Domain Id"]').fill('g');
    await page.locator('[data-placeholder="Login Id"]').fill('g');
    await page.locator('[type="password"]').fill('1234');   
    await page.locator('text="Sign In"').click();
})
test('  ',async()=>{
    await page.locator('[name*="PHONE_NUMBER"]').fill('7856655346');
    await page.locator('text="Next"').nth(0).click();
    await expect(page.locator('text="Verify"')).toBeDisabled();
    const otp = await page.locator('[type="number"]').all();
    for(let i=0;i<otp.length;i++){ await otp[i].click();
    await page.keyboard.press('ArrowUp');}
    await expect(page.locator('text="Verify"')).toBeEnabled();
    await expect(page.locator('text="Previous"').nth(0)).toBeVisible();
    await page.locator('text="Verify"').click();
    await page.locator('text="Next"').nth(1).click();
    console.log(await page.locator('h1').textContent());   
})