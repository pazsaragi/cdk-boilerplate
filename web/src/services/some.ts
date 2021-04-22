import { Auth } from "aws-amplify"
import { API_VERSION } from "../constants"
import { HTTPService } from "./httpService"

export class SomeService extends HTTPService {

    private _baseUrl: string

    constructor() {
        super()
        this._baseUrl = `${process.env.REACT_APP_BACKEND_URL}/${API_VERSION}/crud`
    }

    async createRecord(input: any) {
        return await super.post(`${this._baseUrl}/create`,
            {
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
                }
            })
    }

    async getRecord(input: any) {
        return await super.get(`${this._baseUrl}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
                }
            })
    }
}
