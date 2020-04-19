import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
// Interfaces
import { ILogger } from "./interfaces/ILogger.interface";
// Services
import { Logger } from "./services/Logger/index";
import { DependencyIdentifier } from "./DependencyIdentifiers";

import './controller';
import { ICovidWorld } from "./interfaces/covid-world.interface";
import { CovidWorld } from "./services/CovidWorldApiClient";
import { CovidIndiaApiClient } from "./services/CovidIndiaApiClient"
import { ICovidIndiaApiClient } from "./interfaces/covid-india-api-client.interface";
import { IMessage } from "./interfaces/messages.iterface";
import { Messages } from "./utils/messages";

const container = new Container();

//  Register dependencies
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<ICovidWorld>(DependencyIdentifier.COVID_WORLD).to(CovidWorld)
container.bind<ICovidIndiaApiClient>(DependencyIdentifier.COVID_INDIA).to(CovidIndiaApiClient)
container.bind<IMessage>(DependencyIdentifier.MESSAGES).to(Messages)
// start the server
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
});

const serverInstance = server.build();
const port = process.env.PORT || 3000;
console.log(port)
serverInstance.listen(port);
console.log("Server is listening")
