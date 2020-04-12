import { ICovidIndiaApiClient } from "../../interfaces/covid-india-api-client.interface";
import { injectable } from "inversify";
@injectable()
export class CovidIndiaApiClient implements ICovidIndiaApiClient {
    getCovidData() {
        console.log('get the data here')
    }
}