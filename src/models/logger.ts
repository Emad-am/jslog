import Log from './log';

export class Logger {


    constructor(public host: string, private secret: string, public platform_name: string) {}

    private async generateToken(): Promise<string> {

        const str = (new Date().valueOf() / 10) + this.secret;
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        
        // Generate SHA-256 hash
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        
        // Convert hash to hex string
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    }
    
    private createOptions(body: {}): {} {
        // const token = this.generateToken();
        return {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                // 'Authorization': token,
                'Platform-Name': this.platform_name,
                'Content-Type': 'application/json'
            }, 
        };
    }
    create(log: Log) {
        fetch(`${this.host}/create`, this.createOptions(log))
    }

    createMany(logs: Log[]) {
        fetch(`${this.host}/create-many`, this.createOptions({logs}));
    }
}