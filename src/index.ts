import { Container } from "inversify";
import { ILogger } from "./services/Logger/ILogger";
import { Logger } from "./services/Logger/index";
import { WebHookApp } from "./WebHookApp";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { CovidIndiaApiClient } from './services/CovidIndiaApiClient';
import { ICovidIndiaApiClient } from './services/CovidIndiaApiClient/covid-india-api-client.interface'


const container = new Container({
    defaultScope: "Singleton",
});

//Register dependencies
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<ICovidIndiaApiClient>(DependencyIdentifier.DIALOG_FLOW_CLIENT).to(CovidIndiaApiClient)


const app = container.resolve(WebHookApp);

//Start application
(async () => {
    await app.start();
})();