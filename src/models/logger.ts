import Environment from "./enum/enviroment";
import Log from "./log";

export class Logger {
  constructor(
    public host: string,
    private secret: string,
    private platform_name: string,
    private enviroment: Environment,
  ) {}

  private async generateToken(): Promise<string> {
    
    const str = Math.floor(new Date().getTime() / 10000) + this.secret;
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  private async createOptions(body: {}): Promise<RequestInit> {
    const token = await this.generateToken(); 
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
    log.addField("enviroment", this.enviroment);
    try {
      const options = await this.createOptions(log);
      const response = await fetch(`${this.host}/create`, options);
      if (!response.ok) {
        console.error("Error in create request:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error in create:", error);
    }
  }

  async createMany(logs: Log[]): Promise<void> {

    logs.map((log) => log.addField("enviroment", this.enviroment));
    
    try {
      const options = await this.createOptions({ logs });
      const response = await fetch(`${this.host}/create-many`, options);
      if (!response.ok) {
        console.error("Error in createMany request:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error in createMany:", error);
    }
  }
}
