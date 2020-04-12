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

const container = new Container();

//  Register dependencies
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<ICovidWorld>(DependencyIdentifier.COVID_WORLD).to(CovidWorld)

// start the server
let server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
});

let serverInstance = server.build();
serverInstance.listen(process.env.port || 3000);
console.log("Server is listening")
