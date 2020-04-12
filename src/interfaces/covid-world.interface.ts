import "reflect-metadata";
import { WebhookClient } from 'dialogflow-fulfillment';
export interface ICovidWorld {
    getDataByCountry(agent: WebhookClient): void,
    getDataFromApi(country: string): Promise<any>
}