import { PlaywrightAdapter } from "./playwrightAdapter";

export class BrowserAbstraction {
    private playwrightAdapter: PlaywrightAdapter;

    constructor(playwrightAdapter: PlaywrightAdapter) {
        this.playwrightAdapter = playwrightAdapter;
    }

    public navigate(url: string): void {
        // Implement navigation logic here
    }
}