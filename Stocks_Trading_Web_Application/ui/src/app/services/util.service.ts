import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})

export class UtilService {

    constructor () { }

    public getDateFromEpoch(epoch: number): moment.Moment {
        return moment.unix(epoch);
    }

    public getDate(): moment.Moment {
        return moment();
    }
}
