import { ILogger } from "../../interfaces/ILogger.interface";
import { injectable } from "inversify";
@injectable()
export class Logger implements ILogger {
    public log(message: string): void {
        console.log(`[LOG]: ${message}`);
    }
}