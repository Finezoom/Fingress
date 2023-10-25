import {Page} from "playwright";

export default class EleComponents{
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
    public get Components(){
        const components = this.page.locator("text='    Components   '");
        return components;
    }
    public get Login(){
        const tab3 = this.page.locator("text='Login'");
        return tab3;
    }
    public get Layout(){
        const tab5 = this.page.locator("text='Layouts'");
        return tab5;
    }

}    