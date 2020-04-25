import "reflect-metadata";
import { ICovidWorld } from "../../interfaces/covid-world.interface";
import { injectable, inject } from "inversify";
import { WebhookClient, Suggestion, Payload, } from 'dialogflow-fulfillment';
import { COVID_WORLD } from '../../constants/host-names'
import axios, { AxiosResponse } from 'axios'
import { DependencyIdentifier } from "../../DependencyIdentifiers";
import { IMessage } from "../../interfaces/messages.iterface";
import { errorReply, reply, increasePercReply } from "./messages.constants";
import { casesTypeList } from "./casesType.constants";

@injectable()
export class CovidWorld {
    constructor(@inject(DependencyIdentifier.MESSAGES) private messages: IMessage) { }

    public async  getDataByCountry(agent: WebhookClient): Promise<any> {
        let { country } = agent.parameters;
        const { casesType } = agent.parameters;
        country = country === "United States" ? "USA" : country;
        const totalCaseCountsPromise = this.getDataFromApi(country);
        const yesterdayCaseCountsPromise = this.getYesterdayDataFromApi(country);
        const [totalCaseCounts, yesterdayCaseCounts] = [await totalCaseCountsPromise, await yesterdayCaseCountsPromise]
        console.log(JSON.stringify(totalCaseCounts))
        console.log(JSON.stringify(yesterdayCaseCounts))
        if (totalCaseCounts) {
            const casesCount = this.getCategoryBasedCount(casesType, totalCaseCounts);
            const substitues = {
                casesType,
                country,
                count: casesCount
            };
            agent.add(this.messages.getMessage(reply, substitues));
            if (yesterdayCaseCounts) {
                const percIncrease = this.getIncreaseCasePerc(totalCaseCounts, yesterdayCaseCounts, casesType).toFixed(2);
                agent.add(this.messages.getMessage(increasePercReply, {
                    casesType,
                    country,
                    perc: percIncrease
                }));
            }
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
                timeout: 5000,
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
                resolve(response.data[0])

            }).catch(e => {
                console.log('error', e)
                resolve(null)
            })
        })

    }

    public async  getYesterdayDataFromApi(country: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const today = this.getYesterDayDate()
            const client = axios.create({
                baseURL: COVID_WORLD.URL,
                timeout: 5000,
                headers: {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": COVID_WORLD.HOST,
                    "x-rapidapi-key": process.env.COVID_19_WORLD
                }
            });
            return client.get('/report/country/name', {
                "params": {
                    "date": today,
                    "name": country,
                    "format": "json",
                }
            }).then((response: AxiosResponse) => {
                const data = response.data[0].provinces.reduce((acc: any, province: any) => {
                    Object.keys(province).forEach((key) => {
                        acc[key] = acc[key] + parseInt(province[key], 10);
                    });
                    return acc;
                }, {
                    "confirmed": 0,
                    "recovered": 0,
                    "deaths": 0,
                    "active": 0,
                })
                resolve(data);

            }).catch(e => {
                console.log('error', e)
                resolve(null)
            })
        })
    }

    public getIncreaseCasePerc(totalCaseCounts: any, yesterdayCaseCounts: any, casesType: string) {
        if (casesType === 'active') {
            const yesterdayActive = yesterdayCaseCounts.confirmed - (yesterdayCaseCounts.recovered + yesterdayCaseCounts.deaths)
            const totalActive = totalCaseCounts.confirmed - (totalCaseCounts.recovered + totalCaseCounts.deaths);
            const percent = (totalActive - yesterdayActive) / yesterdayActive
            return yesterdayActive !== 0 ? percent * 100 : 0
        } else {
            if (!yesterdayCaseCounts[casesType] || yesterdayCaseCounts[casesType] === 0) { return 0 }
            return (totalCaseCounts[casesType] - yesterdayCaseCounts[casesType]) / yesterdayCaseCounts[casesType] * 100;
        }
    }

    public getYesterDayDate() {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }

    public getCategoryBasedCount = (casesType: string, data: any) =>
        (casesType === 'active') ? data.confirmed - (data.recovered + data.deaths) : data[casesType];


}