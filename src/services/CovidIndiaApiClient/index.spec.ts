import { expect } from 'chai';
import 'mocha';
import { CovidIndiaApiClient } from './index'
import Axios, { AxiosResponse } from 'axios'
import { Messages } from '../../utils/messages'
import 'mocha';
import sinon from 'sinon';
import { WebhookClient } from 'dialogflow-fulfillment';
import { Request, Response } from 'express';
import { Agent } from 'http';
import { syncBuiltinESMExports } from 'module';
describe('Test CovidIndiaApiClient ', () => {

    it('should call the axios get and post with correct params', async () => {
        let message = sinon.createStubInstance(Messages);
        let covidIndia = new CovidIndiaApiClient(message)
        let axiosGetSpy = sinon.spy();
        const axiosPostSpy = sinon.spy()
        const axiosStub = sinon.stub(Axios, 'create').callsFake((): any => {
            return {
                get: (path: any) => {
                    expect(path).equal('/api_india');
                    return Promise.resolve({ data: { items: [] } })
                },
                post: (path: any, param: any) => {
                    expect(path).equal('/');
                    expect(param).to.deep.equal({ searchBy: 'pincode', value: '441501' })
                    return Promise.resolve({ data: [] })
                },
            }
        });
        const res = await covidIndia.getStatsByPincode({ add: sinon.spy(), parameters: { pincode: '441501' } });
        axiosStub.restore();

    })
    it('should add  message to the agent for no pincode', async () => {
        let message = sinon.createStubInstance(Messages);
        let covidIndia = new CovidIndiaApiClient(message)
        const axiosStub = sinon.stub(Axios, 'create').callsFake((): any => {
            return {
                get: (path: any) => {

                    return Promise.resolve({ data: { items: [] } })
                },
                post: (path: any, param: any) => {
                    return Promise.resolve({ data: [{}] })
                },
            }
        });
        let agentAddSpy = sinon.spy()
        const res = await covidIndia.getStatsByPincode({ add: agentAddSpy, parameters: { pincode: '441501' } });
        expect(agentAddSpy.calledOnce).equal(true);
        axiosStub.restore()
    })
    it('should add message to the agent successfull', async () => {
        let message = sinon.createStubInstance(Messages);
        let covidIndia = new CovidIndiaApiClient(message)
        const axiosStub = sinon.stub(Axios, 'create').callsFake((): any => {
            return {
                get: (path: any) => {

                    return Promise.resolve({
                        data: {
                            state_wise: {
                                "Andhra Pradesh": {
                                    "district": {
                                        "Amravati": {
                                            confirmed: 20
                                        }
                                    }
                                }
                            }
                        }
                    })
                },
                post: (path: any, param: any) => {
                    return Promise.resolve({
                        data: [{
                            circle: "Andhra Pradesh",
                            district: "Amravati"
                        }]
                    })
                },
            }
        });
        let agentAddSpy = sinon.spy()
        const res = await covidIndia.getStatsByPincode({ add: agentAddSpy, parameters: { pincode: '441501' } });
        expect(agentAddSpy.calledOnce).equal(true);
        axiosStub.restore()
    })
    it('should handle errors from getDataFromApi api and return message', async () => {
        let message = sinon.createStubInstance(Messages);
        let covidIndia = new CovidIndiaApiClient(message)
        const axiosStub = sinon.stub(Axios, 'create').callsFake((): any => {
            return {
                get: (path: any) => {

                    return Promise.reject({
                        data: {
                            state_wise: {
                                "Andhra Pradesh": {
                                    "district": {
                                        "Amravati": {
                                            confirmed: 20
                                        }
                                    }
                                }
                            }
                        }
                    })
                },
                post: (path: any, param: any) => {
                    return Promise.resolve({
                        data: [{
                            circle: "Andhra Pradesh",
                            district: "Amravati"
                        }]
                    })
                },
            }
        });
        let agentAddSpy = sinon.spy()
        const res = await covidIndia.getStatsByPincode({ add: agentAddSpy, parameters: { pincode: '441501' } });
        expect(agentAddSpy.calledOnce).equal(true);
        axiosStub.restore()
    })
    it('should handle errors from getPostCodeDetails api and return message', async () => {
        let message = sinon.createStubInstance(Messages);
        let covidIndia = new CovidIndiaApiClient(message)
        const axiosStub = sinon.stub(Axios, 'create').callsFake((): any => {
            return {
                get: (path: any) => {

                    return Promise.resolve({
                        data: {
                            state_wise: {
                                "Andhra Pradesh": {
                                    "district": {
                                        "Amravati": {
                                            confirmed: 20
                                        }
                                    }
                                }
                            }
                        }
                    })
                },
                post: (path: any, param: any) => {
                    return Promise.reject({
                        data: [{
                            circle: "Andhra Pradesh",
                            district: "Amravati"
                        }]
                    })
                },
            }
        });
        let agentAddSpy = sinon.spy()
        const res = await covidIndia.getStatsByPincode({ add: agentAddSpy, parameters: { pincode: '441501' } });
        expect(agentAddSpy.calledOnce).equal(true);
        axiosStub.restore()
    })
})