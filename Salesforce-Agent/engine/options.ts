export class Options {
  private popup: Popup;

  constructor(popup: Popup) {
    this.popup = popup;
  }

  public options(): Promise<boolean> {
    // Implement options logic
  }
}