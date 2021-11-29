"use strict";

/**
  * Form handler for user submitted form
  * 
  * @author Bartlomiej Karmilowicz <bartlomi@buffalo.edu>
  * @copyright 2015 Lifetree Services
  *
  */

import dropboxAdatper from '../lib/dropbox-adapter';
import mysqlAdapter from '../lib/mysql-adapter';
import mailAdapter from '../lib/mail-adapter';
import appConstants from '../lib/app-constants';
import { Promise } from 'es6-promise';
import * as request from 'request-promise';
import * as _ from 'lodash';
import fs = require('fs');
import moment = require('moment-timezone');

class FormHandler {
  constructor() {
    this.dropboxAdapter = dropboxAdatper;
    this.mysqlAdapter = mysqlAdapter;
    this.mailAdapter = mailAdapter;
  }

  public processFormRequest(customerObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.verifyRequestData(customerObj).then((success: any) => {
        let csvStr: String = this.generateArrayCSV(customerObj);
        this.storeDataInDatabase(customerObj, csvStr);
        this.dropboxAdapter.uploadFile('/Routzy/BackOffice/Data/' + 'new_customer_' + Date.now() + '.csv', csvStr).then((success: any) => {
          resolve(success);
        }, (error: any) => {
          reject(error.error);
        });
      }, (error: any) => {
        reject(error);
      });
    });
  }

  private storeDataInDatabase(customerObj: any, csvContents: any): void {
    let customer = {
      firstname: customerObj.firstname,
      lastname: customerObj.lastname,
      address: customerObj.address,
      zipcode: customerObj.zipcode,
      city: customerObj.city,
      phone: customerObj.phone,
      email: customerObj.email,
      source: customerObj.source,
      message: customerObj.message,
      voucher: (!_.isEmpty(customerObj.voucher)) ? customerObj.voucher : null,
      timestamp: moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss')
    }
    this.mysqlAdapter.insert('form_data', customer).then((success: any) => {
      console.log(success);
    });
    this.mailAdapter.sendSubmissionNotification(customer, csvContents);
  }

  private verifyRequestData(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (payload === 'undefined' || _.isEmpty(payload) || this.isInputInvalid(payload)) {
        reject('Invalid input');
      }
      this.verifyCaptcha(payload['g-recaptcha-response']).then((response: any) => {
        if (response['success'] == true) {
          resolve('Verified');
        } else {
          reject('Invalid captcha');
        }
      }, (error: any) => {
        reject(error);
      });
    });
  }

  private isInputInvalid(customerData: any): boolean {
    if (!customerData.hasOwnProperty('firstname') ||
      !customerData.hasOwnProperty('lastname') ||
      !customerData.hasOwnProperty('address') ||
      !customerData.hasOwnProperty('zipcode') ||
      !customerData.hasOwnProperty('email') ||
      !customerData.hasOwnProperty('phone') ||
      !customerData.hasOwnProperty('g-recaptcha-response')) {
      return true;
    }
    return false;
  }

  private verifyCaptcha(captcha: String): any {
    let options = {
      method: 'POST',
      uri: 'https://www.google.com/recaptcha/api/siteverify?secret=6Lf2wVEUAAAAADFLb8GF4RBcAfX-nzeaIW_tqC3e&response=' + captcha,
      json: true
    };
    return request(options);
  }

  private sanitizeData(customerData: any): void {
    customerData.firstname = this.capitalizeFirstLetter(customerData.firstname.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
    customerData.lastname = this.capitalizeFirstLetter(customerData.lastname.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
    customerData.address = customerData.address.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    customerData.zipcode = customerData.zipcode.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    customerData.city = customerData.city.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    customerData.phone = customerData.phone.replace(/[`~!@$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    customerData.email = customerData.email.toLowerCase().replace(/[`~!^*()|\=?;:'",<>\{\}\[\]\\\/]/gi, '');
    customerData.message = customerData.message.replace(/[`~$^*()_|+\-=;'"<>\{\}\[\]\\\/]/gi, '');
    customerData.source = customerData.source.replace(/[`~$^*()_|+\-=;:'"<>\{\}\[\]\\\/]/gi, '');
    if (!_.isEmpty(customerData.voucher)) customerData.voucher = customerData.voucher.replace(/[`~$^*()_|+\-=;:'"<>\{\}\[\]\\\/]/gi, '');
  }

  private updateMessage(customerData: any): void {
    customerData.message += ' SOURCE: ' + customerData.source;
    customerData.message += (_.isEmpty(customerData.voucher)) ? '' : ', VOUCHER: ' + customerData.voucher;
  }

  private capitalizeFirstLetter(str: String): String {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private generateArrayCSV(customerData: any): String {
    this.sanitizeData(customerData);
    this.updateMessage(customerData);

    let customerKeys = {
      0: customerData.firstname,
      2: customerData.lastname,
      5: customerData.address,
      7: customerData.city,
      8: customerData.state,
      9: customerData.zipcode,
      15: customerData.phone,
      18: customerData.email,
      22: customerData.message,
      24: 'new'
    };

    let csvContents: any = [];
    for (let i: number = 0; i < 51; i++) {
      if (customerKeys.hasOwnProperty(i)) {
        csvContents.push((<any>customerKeys)[i]);
      } else {
        csvContents.push('');
      }
    }

    //build csv contents
    let data: any = [appConstants.csv_schema, csvContents];
    let lineArray: Array<String> = [];
    data.forEach((arr: any, index: any) => {
      let line = arr.join(',');
      lineArray.push(line);
    });

    return lineArray.join('\n');
  }

  dropboxAdapter: any;
  mysqlAdapter: any;
  mailAdapter: any;
}

export default new FormHandler();