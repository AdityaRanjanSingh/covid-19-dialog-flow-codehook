import { ILogger } from "./ILogger.interface";
import { injectable } from "inversify";
import "reflect-metadata";
@injectable()
export class Logger implements ILogger {
    public log(message: string): void {
        console.log(`[LOG]: ${message}`);
    }
}