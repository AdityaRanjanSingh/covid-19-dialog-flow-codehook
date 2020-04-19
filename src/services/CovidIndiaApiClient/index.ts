import "reflect-metadata";
import { ICovidIndiaApiClient } from "../../interfaces/covid-india-api-client.interface";
import { injectable, inject } from "inversify";
import axios from 'axios';
import { COVID_INDIA, INDIA_PINCODE_API } from "../../constants/host-names";
import { pinCodeNotFound, areaNotFoundInData, reply } from "./messages.contants";
import { DependencyIdentifier } from "../../DependencyIdentifiers";
import { IMessage } from "../../interfaces/messages.iterface";
@injectable()
export class CovidIndiaApiClient implements ICovidIndiaApiClient {
    constructor(@inject(DependencyIdentifier.MESSAGES) private messages: IMessage) { }

    public async getStatsByPincodeOrCity(agent: any) {
        const pincode = agent.parameters.pincode;
        const city = agent.parameters.city;
        if (!pincode && !city) {
            agent.add('Please tell me city of pincode please')
        } else if (pincode) {
            return this.getStatsByPincode(agent);
        } else {
            return this.getStatsByCity(agent)
        }
    }
    public async getStatsByCity(agent: any): Promise<void> {
        const city = agent.parameters.city;
        let cityData
        const dataResponse = await this.getDataFromApi();
        for (const key in dataResponse.state_wise) {
            if (key) {
                for (const district in dataResponse.state_wise[key].district) {
                    if (district.toLowerCase() === city.toLowerCase()) {
                        cityData = { ...dataResponse.state_wise[key].district[district], "state": key, district }
                    }
                }
            }
        }
        if (cityData) {
            const substitues = {
                district: cityData.district,
                state: cityData.state,
                confirmed: cityData.confirmed
            }
            agent.add(this.messages.getMessage(reply, substitues))
        } else {
            agent.add(this.messages.getMessage(areaNotFoundInData, {}))
        }

    }
    public async getStatsByPincode(agent: any): Promise<void> {
        // Getting the the district name and the state name using post code api
        // Also getting the corona data from india api

        const [pinResponse, dataResponse]: any[] = await Promise.all([
            this.getPostCodeDetails(agent.parameters.pincode),
            this.getDataFromApi()
        ])


        if (pinResponse.length === 0) { // Check if are can be found by the post code
            agent.add(this.messages.getMessage(pinCodeNotFound, { pincode: agent.parameters.pincode }))
        } else if (!dataResponse.state_wise || !dataResponse.state_wise[pinResponse[0].circle] || !dataResponse.state_wise[pinResponse[0].circle].district[pinResponse[0].district]) {
            // comes inside when the there is no state or no district
            agent.add(this.messages.getMessage(areaNotFoundInData, { district: pinResponse[0].district, state: pinResponse[0].circle }))
        } else {
            console.log(dataResponse.state_wise[pinResponse[0].circle].district[pinResponse[0].district])
            const data = dataResponse.state_wise[pinResponse[0].circle].district[pinResponse[0].district]
            const substitues = {
                district: pinResponse[0].district,
                state: pinResponse[0].circle,
                confirmed: data.confirmed
            }
            agent.add(this.messages.getMessage(reply, substitues))
        }

    }
    private async getDataFromApi(): Promise<any> {
        return new Promise((resolve) => {
            const client = axios.create({
                baseURL: COVID_INDIA.URL
            });
            client.get('/api_india', {
                headers: {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": COVID_INDIA.HOST,
                    "x-rapidapi-key": process.env.COVID_19_WORLD
                }
            }).then((response) => {
                resolve(response.data)

            }).catch(e => {
                resolve([])
            })
        })
    }

    private async getPostCodeDetails(postCode: string): Promise<any> {
        return new Promise((resolve) => {
            const client = axios.create({
                baseURL: INDIA_PINCODE_API.URL,
                headers: {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": INDIA_PINCODE_API.HOST,
                    "x-rapidapi-key": process.env.COVID_19_WORLD
                }
            });
            client.post('/', {
                searchBy: 'pincode',
                value: postCode
            }
            ).then((response) => {
                resolve(response.data)

            }).catch(e => {
                resolve([])
            })
        })
    }
}