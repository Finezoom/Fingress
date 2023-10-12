import { test, expect } from '@playwright/test';
var URL = 'http://chennai49.demo.fingress.com:9887/';
test('List_page - Card_view-01', async ({ page }) => {
  test.slow();
  await page.goto(URL);
  await page.locator('button').filter({ hasText: 'view_comfy' }).click();
  await page.locator('.mat-tooltip-trigger > div').first().click();
  await page.getByRole('button', { name: ' List Pages ' }).click();
  await page.getByRole('menuitem', { name: 'Card View' }).click();
  let Product_ID1 = await page.getByText('PC3016').textContent();  //validate
  let Card_view_discount_price1 = await page.getByText('105.59').textContent();  //validate  
  let Card_view_price1 = await page.getByText('831.8').first().textContent(); 
  console.log(Card_view_price1); //validate
  await page.locator('mat-card-content').filter({ hasText: 'PC3016105.59831.8' }).getByRole('button').click();
  const t1 = await page.getByText('831.8').textContent();  //validate
  let Detail_view_price1 = t1?.trim();
  let t2 = await page.getByText('105.59').textContent();  //validate
  let Detail_view_discount_price1 = t2?.trim();  
  // compare the discount price
  expect(Card_view_discount_price1).toBe(Detail_view_discount_price1);
  // compare the price
  expect(Card_view_price1).toBe(Detail_view_price1);
  console.log(Product_ID1);
  console.log('Discount amount in Card view : '+Card_view_discount_price1);
  console.log('Price in Card view : '+Card_view_price1);
  console.log('Discount amount in Detail view : '+Detail_view_discount_price1);  
  console.log('Price in Detail view : '+Detail_view_price1);
  console.log('Discount price & Actual price is same in Card view & Detail view');
  console.log('Test case-01 passed');
  // if (Card_view_discount_price1==Detail_view_discount_price1) {
  // console.log('Discount amount in Card view : '+Card_view_discount_price1);
  // console.log('Discount amount in Detail view : '+Detail_view_discount_price1);
  //   console.log('Discount price is same in Card view & Detail view');
  //   console.log('Test case-01 passed');
  // } else{
  //   console.log('Discount amount in Card view : '+Card_view_discount_price1);
  //   console.log('Discount amount in Detail view : '+Detail_view_discount_price1);
  //   console.log('Discount price is not same in Card view & Detail view');
  //   console.log('Test case-01 failed');
  // }
  // // compare the price
  // if (Card_view_price1 == Detail_view_price1) {
  //   console.log('Price in Card view : '+Card_view_price1);
  //   console.log('Price in Detail view : '+Detail_view_price1);
  //   console.log('Price is same in Card view & Detail view');
  //   console.log('Test case-01 passed');
  // } else{
  //   console.log('Price in Card view : '+Card_view_price1);
  //   console.log('Price in Detail view : '+Detail_view_price1);
  //   console.log('Price is not same in Card view & Detail view');
  //   console.log('Test case-01 failed');
  // }
  await page.goBack();
});

test('List_page - Card_view-02', async ({ page }) => {
  test.slow();
  await page.goto(URL);
  await page.locator('button').filter({ hasText: 'view_comfy' }).click();
  await page.locator('.mat-tooltip-trigger > div').first().click();
  await page.getByRole('button', { name: ' List Pages ' }).click();
  await page.getByRole('menuitem', { name: 'Card View' }).click();
  // 2nd testcase start
  let Product_ID2 = await page.getByText('PC3024').textContent();
  let Card_view_discount_price2 = await page.getByText('187.06').textContent();
  let Card_view_price2 = await page.getByText('603.96').textContent();
  await page.locator('mat-card-content').filter({ hasText: 'PC3024187.06603.96' }).getByRole('button').click();
  let Detail_view_discount_price2 = await page.getByText('122.63').textContent();
  let Detail_view_price2 = await page.getByText('903.7').textContent();
  try {
    expect(Card_view_discount_price2).toBe(Detail_view_discount_price2);
   }
   catch(err) { 
    console.log(Product_ID2);   
    console.log(Card_view_discount_price2 +' : '+ Detail_view_discount_price2 + " = Discount price is not matching");
   }

   try {
    expect(Card_view_price2).toBe(Detail_view_price2);
   }
   catch(err) {
    console.log(Product_ID2);
    console.log(Card_view_price2 +' : '+ Detail_view_price2 + " = Actual price is not matching");
   }
   console.log('Test case-02 passed');
   await page.goBack();  
  
  
});

test('Pagination_in_List_page', async ({ page }) => {
  test.slow();
  await page.goto(URL);
  await page.locator('button').filter({ hasText: 'view_comfy' }).click();
  await page.getByText('Fingress Explorer').click();
  await page.getByRole('button', { name: ' List Pages ' }).click();
  await page.getByRole('menuitem', { name: 'Card View' }).click();
  let Label1 = await page.getByText('1', { exact: true }).textContent();
  let Pageno1 = await page.getByText('Page 1 of 5').textContent();
  await page.getByText('Last').click();
  let Label5 = await page.getByText('5', { exact: true }).textContent();
  let Pageno5 = await page.getByText('Page 5 of 5').textContent();
  console.log(Label1, Pageno1);
  console.log(Label5, Pageno5);
});

test.only('test', async ({ page }) => {
  test.slow();
  await page.goto(URL);
  await page.getByText('view_comfy').click();
  await page.locator("(//i[@aria-hidden='true'])[15]").click();
  await page.getByRole('button', { name: ' List Pages ' }).click();  
  await page.locator("//span[7]//span[1]//button[1]//span[2]").click();
  //Reference number in all list view page
  var t3  = await page.getByText(' INV20230906499765').textContent();
  let RNLV = t3?.trim();
  await page.locator("(//mat-icon[@role='img'])[13]").click();
  // Reference number in Invoice detail tab
  let t4 = await page.getByText('INV20230906499765').textContent();
  let RNID = t4?.trim();
  // here i validate the list reference and invoice reference number
  expect(RNLV).toBe(RNID);  
  //Due date in Invoice Detail tab
  await page.locator("button[class*='dayMonthPicker']").click();
  await page.locator("text=' OCT '").click();  
  await page.locator("(//div)[753]").click( { timeout: 300000 });
  //text=' 05 '
  await page.locator("(//span)[188]").click();
  await page.locator("(//input[@id='fileDropRef'])[2]").setInputFiles('api.jpeg');

  //delete the uploaded file 
  //await page.locator("(//mat-icon[@role='img'])[11]").click();
       
});