import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/ILogger.interface";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { CovidIndiaApiClient } from './services/CovidIndiaApiClient'
import "reflect-metadata";

@injectable()
export class WebHookApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.DIALOG_FLOW_CLIENT) private covidIndiaApiClient: CovidIndiaApiClient) {
    }

    public async start(): Promise<void> {

        this.logger.log(`Starte apis`);


        try {
            // Get the response form dialog flow here
            process.exit(0)
        } catch (error) {
            this.logger.log(`${error}`)

            process.exit(1)
        }

    }

}