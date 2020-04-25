import "reflect-metadata";
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { WebhookClient } from 'dialogflow-fulfillment';
import { inject } from 'inversify';
import { DependencyIdentifier } from './DependencyIdentifiers';
import { CovidWorld } from './services/CovidWorldApiClient';
import { CovidIndiaApiClient } from "./services/CovidIndiaApiClient";
@controller('/covid-19')
export class Controller {
    public constructor(
        @inject(DependencyIdentifier.COVID_WORLD) private covidWorld: CovidWorld,
        @inject(DependencyIdentifier.COVID_INDIA) private covidIndia: CovidIndiaApiClient
    ) {
    }

    @httpPost('/')
    public async post(request: Request, response: Response): Promise<any> {
        const that = this;
        const agent = new WebhookClient({ request, response });
        const intentMap = new Map();
        // map all the intent with the fulfillment functions here
        intentMap.set('corona-updates-by-country', async (a: WebhookClient) => { return await this.covidWorld.getDataByCountry(a) }); // Could pass the function directly but gives an error hence a workaround
        intentMap.set('corona-updates-by-pincode-india', async (a: WebhookClient) => { return await this.covidIndia.getStatsByPincodeOrCity(a) }); // Could pass the function directly but gives an error hence a workaround

        return Promise.resolve(agent.handleRequest(intentMap));
    }
}