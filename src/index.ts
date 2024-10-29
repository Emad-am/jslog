import { Logger } from "./models/logger";
import Log from "./models/log";
import LogLevel from "./models/enum/loglevel";
import Environment from "./models/enum/enviroment";


function init(host: string, secret: string, platform_name: string): Logger {
    
    return new Logger(host, secret, platform_name);
}

export { init, Log, LogLevel, Environment };