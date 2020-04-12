import { ICovidWorld } from "../../interfaces/covid-world.interface";
import { injectable, inject } from "inversify";
import { WebhookClient } from 'dialogflow-fulfillment';
import { COVID_WORLD } from '../../constants/host-names'
import axios, { AxiosResponse } from 'axios'
import "reflect-metadata";
@injectable()
export class CovidWorld {
    public async  getDataByCountry(agent: WebhookClient): Promise<any> {

        const response = await this.getDataFromApi(agent.parameters.country)
        // this.logger.log(JSON.stringify(response))
        if (response.length !== 0) {
            agent.add(`I can see the confirmed cases in ${response[0].country} has gone up to ${response[0].confirmed}`)
            return Promise.resolve(agent)
        } else {
            agent.add(`I'm sorry, I could not find a country by that name `);
            return Promise.resolve(agent)
        }
    }

    public async  getDataFromApi(country: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const client = axios.create({
                baseURL: COVID_WORLD.URL,
                timeout: 1000,
                headers: {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": COVID_WORLD.HOST,
                    "x-rapidapi-key": process.env.COVID_19_WORLD
                }
            });
            return client.get('/country', {
                "params": {
                    "format": "json",
                    "name": country
                }
            }).then((response: AxiosResponse) => {
                console.log("response", response)
                resolve(response.data)

            }).catch(e => {
                console.log(e);
                resolve([])
            })
        })

    }
}