import mysqlAdapter from '../lib/mysql-adapter';
import { Promise } from 'es6-promise';
import * as request from 'request-promise';
import * as _ from 'lodash';
import qbHandler from './quickbooks'
import routzySynch from './routzySynch'

class DashboardHandler {
  constructor() {
    this.mysqlAdapter = mysqlAdapter;
  }

  public processCustomerFormDataRequest(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      //verify request token
      mysqlAdapter.selectAll('form_data').then((success: any) => {
        resolve(success);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public processRefreshInvoicesRequest(req: any): Promise<any> {
    return routzySynch.synchronize();
  }

  public processProposalsDataRequest(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // fetch all
      if (req.params.id === 'all') {
        mysqlAdapter.selectAll('proposals').then((success: any) => {
          resolve(success);
        }, (error: any) => {
          reject(error);
        });
      } else {
        // fetch specific proposal
        if (_.isEmpty(req.params.id)) {
          reject('invalid id');
        }
        let a = mysqlAdapter.select('proposals', 'Proposal ID', [req.params.id]);
        let b = mysqlAdapter.select('proposal_details', 'FK_Proposal_ID', [req.params.id]);

        Promise.all([a,b]).then((response: any) => {
          if (!_.isEmpty(response)) {
            let result: any = {};
            result.invoice = response[0];
            result.items = response[1];
            resolve(result);
          }
        }, (error: any) => {
          reject(error);
        });
        
        // mysqlAdapter.select('proposals', 'Proposal ID', [req.params.id]).then((success: any) => {
        //   resolve(success);
        // }, (error: any) => {
        // });
      }
    });
  }

  public processEnqueueQBRequest(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      //verify request token
      let invoiceIds = req.map((invoice: any) => invoice.proposal_id);
      console.log(invoiceIds);
      qbHandler.enqueueInvoices(invoiceIds).then((success: any) => {
        console.log(success);
        resolve(success);
      }, (error: any) => {
        console.log(error);
        reject(error);
      });
    });
  }

  public processDeleteQBRequest(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      //verify request token
      console.log(req);
      mysqlAdapter.delete('quickbooks', req).then((success: any) => {
        resolve(success);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public processQBQueueDataRequest(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      //verify request token
      mysqlAdapter.join('quickbooks', 'proposals', 'quickbooks.proposal_id', 'proposals.Proposal ID').then((success: any) => {
        console.log('processQBQueueDataRequest success');
        resolve(success);
      }, (error: any) => {
        console.log('processQBQueueDataRequest failure');
        reject(error);
      });
    });
  }

  mysqlAdapter: any;
}

export default new DashboardHandler();