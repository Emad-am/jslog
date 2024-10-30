import LogLevel from "./enum/loglevel";
class Log {
  constructor(
    public level: LogLevel,
    public title: string,
    public message: string
  ) {}

  addField(key: string, value: any) {
    (this as any)[key] = value;
  }
}

export default Log;
