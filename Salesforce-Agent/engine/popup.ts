export class Popup {
  private extension: Extension;

  constructor(extension: Extension) {
    this.extension = extension;
  }

  public popup(): Promise<boolean> {
    // Implement popup logic
  }
}