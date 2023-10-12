import {Page} from "playwright";

export default class EleListPages{
    private page : Page;
    constructor(page: Page){
        this.page = page;
    }
    public get menu(){
        const menu1 = this.page.locator("//mat-icon[text()='view_comfy']");
        return menu1;
    }
    public get explorer(){
        const expo = this.page.locator("//span[text()='Fingress Explorer']");
        return expo;
    }
    public get listPages(){
        const list = this.page.locator("text='   List Pages   '");
        return list;
    }
    public get tabular(){
        const tab1 = this.page.locator('(//span[text()="Tabular"])[1]');
        return tab1;
    }
    public get listView(){
        const tab2 = this.page.locator('(//span[text()="List View"])[1]');
        return tab2;
    }
    public get action(){
        const tab2_1 = this.page.locator('button[class*="fg-icon-btn"]').nth(1);
        return tab2_1;
    }
    public get calendar(){
        const tab3 = this.page.locator('//span[text()="Calendar View"]');
        return tab3;
    }
    public get masterDetails(){
        const tab4 = this.page.locator('//span[text()="Master Detail"]');
        return tab4;
    }
    public get masterDetailsDashboard(){
        const tab4_1 = this.page.locator('text="Invoice # INV50967 raised on 2023-08-22T00:00:00.000Z "').nth(0);
        return tab4_1;
    }    
    public get kanban(){
        const tab5 = this.page.locator("text='Kanban'").nth(1);
        return tab5;
    }
    public get cardView(){
        const tab6 = this.page.locator("text='Card View'").nth(1);
        return tab6;
    }
    public get allListView(){
        const tab7 = this.page.locator("text='All List Views'").nth(1);
        return tab7;
    }
    public get allListViewTAB1(){
        const tab7_1 = this.page.locator("text='table_chart'");
        return tab7_1;
    }

    public get timeLineView(){
        const tab8 = this.page.locator("text='Timeline View'");
        return tab8;
    }
    public get treeView(){
        const tab9 = this.page.locator("text='Tree View'");
        return tab9;
    }
}
