import "reflect-metadata";
import { ICovidWorld } from "../../interfaces/covid-world.interface";
import { injectable, inject } from "inversify";
import { WebhookClient, Suggestion, Payload, } from 'dialogflow-fulfillment';
import { COVID_WORLD } from '../../constants/host-names'
import axios, { AxiosResponse } from 'axios'
import { DependencyIdentifier } from "../../DependencyIdentifiers";
import { IMessage } from "../../interfaces/messages.iterface";
import { errorReply, reply } from "./messages.constants";
import { casesTypeList } from "./casesType.constants";

@injectable()
export class CovidWorld {
    constructor(@inject(DependencyIdentifier.MESSAGES) private messages: IMessage) { }

    public async  getDataByCountry(agent: WebhookClient): Promise<any> {
        const { country, casesType } = agent.parameters;

        const response = await this.getDataFromApi(country)
        // this.logger.log(JSON.stringify(response))

        console.log('response', response);
        if (response.length !== 0) {
            const casesCount = this.getCategoryBasedCount(casesType, response[0]);
            const substitues = {
                casesType,
                country,
                count: casesCount
            };
            // const context = { name: 'countryName', lifespan: 5, parameters: country }
            // agent.setFollowupEvent('which country do you want it for ?')

            agent.add(this.messages.getMessage(reply, substitues));
            // this.sendOptions(agent, this.getSuggestionsList(casesType))
            return Promise.resolve(agent)
        } else {
            const substitues = {
                casesType: agent.parameters.casesType,
                country: agent.parameters.country,
            };
            agent.add(this.messages.getMessage(errorReply, substitues));
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
                resolve(response.data)

            }).catch(e => {
                console.log('error', e)
                resolve([])
            })
        })

    }

    public getCategoryBasedCount = (casesType: string, data: any) =>
        (casesType === 'active') ? data.confirmed - (data.recovered + data.deaths) : data[casesType];

    public getSuggestionsList = (caseType: string) => casesTypeList.filter(value => value !== caseType);

    // public sendOptions(agent: WebhookClient, options: string[]) {
    //     options.map(option => agent.add(new Suggestion(option)))
    //     let payload = new Payload('FACEBOOK', {
    //         text: "You cacn check for following parameters also.",
    //         quick_replies: options
    //             .slice(0, 5)
    //             .map(option => {
    //                 return {
    //                     content_type: "text",
    //                     title: option,
    //                     payload: option
    //                 }
    //             })
    //     });
    //     agent.add(payload)
    // }

}