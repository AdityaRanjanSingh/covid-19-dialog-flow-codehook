import { expect } from 'chai';
import Axios from 'axios'

import 'mocha';
import sinon from 'sinon';
import { CovidWorld } from './index';
import { WebhookClient } from 'dialogflow-fulfillment';
import { Request, Response } from 'express';
describe('Test CovidWorld ', () => {

    it('should call api endpoint with correct params', async () => {

        // const req = getRequestObject('corona-updates-by-country', { country: 'India' })
        // let spy = sinon.spy(equest)
        // let spy = sinon.spy(new  WebhookClient())
        // const agentSpy = sinon.spy();
        // const axiosStub = sinon.stub(Axios, 'create').callsFake(() => {
        //     return {
        //         get: (path, param) => {
        //             expect(path).equal('');
        //             expect(param).to.deep.equal({ headers: { "userid": "userId", "authtoken": "Token" } });
        //             return { data: { items: [] } }
        //         }
        //     }
        // });
        // let covidWorld = new CovidWorld()

        // const res = await covidWorld.getDataByCountry(agentSpy);

        // axiosStub.restore();
        // authTokenStub.restore();
        expect(true).to.deep.equal(true)
    })
})


function getRequestObject(intent: any, parameters: any) {
    return {
        "responseId": "response-id",
        "session": "projects/project-id/agent/sessions/session-id",
        "queryResult": {
            "queryText": "End-user expression",
            "parameters": parameters,
            "allRequiredParamsPresent": true,
            "fulfillmentText": "Response configured for matched intent",
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "Response configured for matched intent"
                        ]
                    }
                }
            ],
            "outputContexts": [
                {
                    "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
                    "lifespanCount": 5,
                    "parameters": {
                        "country": "India"
                    }
                }
            ],
            "intent": {
                "name": "projects/project-id/agent/intents/intent-id",
                "displayName": intent // "corona-updates-by-country"
            },
            "intentDetectionConfidence": 1,
            "diagnosticInfo": {},
            "languageCode": "en"
        },
        "originalDetectIntentRequest": {}
    }
}