import { ILogger } from "./ILogger";
import { injectable } from "inversify";
import "reflect-metadata";
@injectable()
export class Logger implements ILogger {
    public log(message: string): void {
        console.log(`[LOG]: ${message}`);
    }
}