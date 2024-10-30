import Log from "./log";

export class Logger {
  constructor(
    public host: string,
    private secret: string,
    public platform_name: string
  ) {}

  private async generateToken(): Promise<string> {
    const str = Math.floor(new Date().valueOf() / 10000) + this.secret;
    console.log(str);
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert hash to hex string
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  private async createOptions(body: {}): Promise<RequestInit> {
    const token = await this.generateToken(); // Token generation happens just before request setup
    return {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Authorization": `${token}`,
        "Platform-Name": this.platform_name,
        "Content-Type": "application/json",
      },
    };
  }

  async create(log: Log): Promise<void> {
    try {
        console.log(await this.createOptions(log));
        
      const options = await this.createOptions(log);
      const response = await fetch(`${this.host}/create`, options);
      console.log("Response:", response);
      if (!response.ok) {
        console.error("Error in create request:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error in create:", error);
    }
  }

  async createMany(logs: Log[]): Promise<void> {
    try {
      const options = await this.createOptions({ logs });
      const response = await fetch(`${this.host}/create-many`, options);
      console.log("Response:", response);
      if (!response.ok) {
        console.error("Error in createMany request:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error in createMany:", error);
    }
  }
}
