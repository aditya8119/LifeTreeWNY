/**
 * Class responsible for managing quickbooks queue.
 * @author Bart Karmilowicz
 */

import mysqlAdapter from '../lib/mysql-adapter';
import { Promise } from 'es6-promise';
import moment = require('moment-timezone');

class Quickbooks {
  constructor() {
    this.mysqlAdapter = mysqlAdapter;
  }
  
  private getDateTime() {
    return moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss');
  }

  public enqueueInvoices(invoiceIds: any): any {
    let insertableArr: Array<any> = [];
    invoiceIds.map((invoiceId: any) => insertableArr.push({ 'proposal_id': invoiceId, 'enqueue_time':  this.getDateTime()}));
    console.log('enqueue');
    console.log(insertableArr);
    return mysqlAdapter.insert('quickbooks', insertableArr);
  }

  mysqlAdapter: any;
}

export default new Quickbooks();