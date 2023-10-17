import {Page} from "playwright";

export default class EleDashboardPages{
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
   
    public get Dashboards(){
        const dashboards = this.page.locator("text='   Dashboards   '");
        return dashboards;
    }
    
    public get barChart(){
        const tab1 = this.page.locator("text='Bar Charts'");
        return tab1;
    }
    public get pieChart(){
        const tab2 = this.page.locator('text="Pie Charts"');
        return tab2;
    }
    public get lineChart(){
        const tab2 = this.page.locator('text="Line Charts"');
        return tab2;
    }
    public get advanceChart(){
        const tab2 = this.page.locator('text="Advance Charts"');
        return tab2;
    }


}
