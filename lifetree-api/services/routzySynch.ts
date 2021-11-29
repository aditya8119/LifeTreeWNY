"use strict";

/**
  * Data synchronizer for Routzy application
  *
  * Script responsible for synchronizing Routzy Application
  * with external database owned by Lifetree Services.
  * It does so by downloading .csv files from dropbox
  * and parsing them to retrieve the needed information.
  *
  * Two different type of files: contacts, proposals
  * 
  * @author Bartlomiej Karmilowicz <bartlomi@buffalo.edu>
  * @copyright 2015 Lifetree Services
  *
  */

import Dropbox = require('dropbox');
import fs = require('fs');
import * as _ from 'lodash';
import { Promise } from 'es6-promise';
import path = require('path');
import csvParser = require('csv-parse/lib/sync');
import dropboxAdatper from '../lib/dropbox-adapter';
import mysqlAdapter from '../lib/mysql-adapter';


class RoutzySynch {
  constructor(accessToken: string) {
    this.dbx = dropboxAdatper;
    this.mysqlAdapter = mysqlAdapter;
    this.ensureDirectoryExistence('downloads');
  }

  /**
   * Gets list of all folders.
   * Scans one by one looking if there has been a new update since last scan.
   * 
   * @param folderLocation {Proposals | Contacts} - two folders containing required data
   * @return Array holding all paths of files with new data
   * 
   * 1. Retrieve all folders {YYYY-MM} from {CONTACTS | PROPOSALS} - foldersPaths
   * 2. For each folder:
   * 2a. Retrieve absolute path for that folder ex. {/Routzy/BackOffice/Data/Contacts/2016-09}
   * 2b. Create map of {filepath, modified_timestamp}
   * 2c. Filter paths - If last entry timestamp is bigger than last's update timestamp -> updates avaiable (filePathTimestampMap)
   * 2d. Save new timestamp to timestamps.json
   * 2e. Appends paths to result holding all paths that need to be updated & return
   * 
   * Alt path: /Apps/Routzy/backoffice/data/
   *           /Routzy/BackOffice/Data/
   */

  folderCrawler(folderLocation: string): Promise<Array<any>> {
    return this.dbx.getFilesPaths('/Routzy/BackOffice/Data/' + folderLocation).then((response: any) => {
      let promises: Array<Promise<any>> = [];
      _.map(response.entries, 'path_display').forEach((folderPath: any) => promises.push(this.dbx.getFilesPaths(folderPath)));
      return Promise.all(promises);
    }).then((fileLists: Array<any>) => {
      let csvFilePaths: Array<any> = []; //paths of files holding new updates from routzy (not yet processed before!)
      fileLists.forEach((fileList: any) => {
        //figure out what's the last processed proposals timestamp, if none - set to 0
        let folderPath: string = path.resolve(path.dirname(fileList.entries[0].path_display));
        const LAST_RECORDED_UPDATE_TS = (this.timestampsLog != null && this.timestampsLog[folderPath]) ?
          this.timestampsLog[folderPath] : 0;
        //fetch paths and filter duplicates and already processed proposals
        let filePathTimestampMap: Array<any> = this.getFilePathToTimestampArrayMap(fileList.entries);
        filePathTimestampMap = this.filterFilePathList(filePathTimestampMap, LAST_RECORDED_UPDATE_TS);
        //log current timestamps
        this.logFilePathCrawl(folderPath, LAST_RECORDED_UPDATE_TS, filePathTimestampMap);
        //save timestamps for logging
        if (!_.isEmpty(filePathTimestampMap) && (LAST_RECORDED_UPDATE_TS < _.last(filePathTimestampMap).client_modified))
          this.timestampsLog[folderPath] = _.last(filePathTimestampMap).client_modified;
        //append to all paths requiring processing
        csvFilePaths = csvFilePaths.concat(filePathTimestampMap);
      });
      return Promise.resolve(csvFilePaths);
    }).catch((error: any) => {
      console.error(error);
      return Promise.reject(error);
    });
  }

  fetchProposals(): Promise<any[]> {
    return this.folderCrawler('Proposals').then((paths: any) => {
      console.log('\n\nFetching Requested Proposal files: ' + paths.length);
      let promises: Array<Promise<any>> = [];
      paths.forEach((path: any) => {
        promises.push(this.dbx.downloadFile(path.path_display));
      });
      return Promise.all(promises);
    });
  }

  fetchContacts(): Promise<any[]> {
    return this.folderCrawler('Contacts').then((paths: any) => {
      console.log('\n\nFetching Requested Contact files: ' + paths.length);
      let promises: Array<Promise<any>> = [];
      paths.forEach((path: any) => {
        promises.push(this.dbx.downloadFile(path.path_display));
      });
      return Promise.all(promises);
    });
  }

  private processContacts(rawContacts: any) {
    console.time('Contacts Processing Completed: ');
    rawContacts.forEach((rawContactCsvFile: any, i: any) => {
      let contactArr: Array<any> = this.parseCsv(rawContactCsvFile); //array of arrays
      let contact: any = this.joinKeysValues(contactArr[0], contactArr[1]);
      if (contact.Action == 'Edit' || contact.Action == 'Add' || contact.Action == 'Delete') {
        let where: any = {
          'First Name': contact['First Name'],
          'Last Name': contact['Last Name']
        };
        //add more in future if needed, don't forget to update mysql schema!
        let what: any = {
          'Email': contact['Primary E-mail Address'],
          'Phone': contact['Primary Phone Number'],
          'Customer Notes': contact['Customer Notes']
        };
        this.mysqlAdapter.update('proposals', where, what).then((success: any) => {
          //console.log(success);
        }).catch((error: any) => {
          console.log(error);
        });;
      }
    });
    console.timeEnd('Contacts Processing Completed: ');
  }

  private processProposals(rawProposals: any) {
    console.time('Proposal Processing Completed: ');
    rawProposals.forEach((rawProposal: any, i: any) => {
      //"Proposal ID", "Activity ID", "First Name", "Middle Name", "Last Name", "Company", "Shipping Address Line 1" ...
      let data: Array<any> = this.parseCsv(rawProposal); //array of arrays
      //console.log(data);
      let proposal: any = this.joinKeysValues(data[0], data[1]);
      proposal['Date'] = this.convertDate(proposal['Date']);

      //["Item", "Item Description", "Quantity", "Unit Price", "UOM", "Taxable"]
      let proposalDetails: any = [];
      data = data.splice(2);
      if (data.length > 1) {
        for (let i = 1; i < data.length; i++) {
          let proposalItem = _.extend(this.joinKeysValues(data[0], data[i]),
            { 'FK_Proposal_ID': proposal['Proposal ID'], 'Timestamp': proposal['Timestamp'] });
          proposalDetails.push(proposalItem);
        }
      }
      if (!_.isEmpty(proposal)) this.insertProposalsToMysql(proposal, proposalDetails);
    });
    console.timeEnd('Proposal Processing Completed: ');
  }

  synchronizeProposals(): Promise<any> {
    console.time('Proposal Fetching Completed: ');
    return this.fetchProposals().then((proposals: Array<any>) => {
      console.timeEnd('Proposal Fetching Completed: ');
      console.log('Downloaded ' + proposals.length + ' files');
      console.log('Processing proposals...');
      if (proposals.length > 0) this.processProposals(proposals);
      return ('Proposal processing finished');
    }).catch((error: any) => {
      console.error(error);
      throw error;
    });
  }

  synchronizeContacts(): Promise<any> {
    console.time('Contacts Fetching Completed: ');
    return this.fetchContacts().then((contacts: Array<any>) => {
      console.timeEnd('Contacts Fetching Completed: ');
      console.log('Downloaded ' + contacts.length + ' files');
      console.log('Processing contacts...');
      if (contacts.length > 0) this.processContacts(contacts);
      return ('Contacts processing finished');
    }).catch((error: any) => {
      console.error(error);
      throw error;
    });
  }

  /**
   * Main entry point of script.
   * Synchronization of proposals / contacts start here. 
   */
  synchronize(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        console.log('SYNCHRONIZE....');
        this.timestampsLog = this.loadLatestSynchTimestamps('/home/bart/apps/lifetree-api/timestamps.json');
        console.log('TIMESTAMPS LOADED... ');
        console.log(this.timestampsLog);
        this.synchronizeProposals().then((success: any) => {
          this.synchronizeContacts().then((success: any) => {
            resolve('SUCCESS');
            this.flushUpdatedTimestamps();
            console.log('DONE.');
            this.timestampsLog = {};
          });
        });
      } 
      catch(error) {
        reject(error);
      }
    });
  }

  private capitalizeFirstLetter(str: String): String {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private sanitizeProposalData(proposal: any): void {
    proposal['First Name'] = (_.isEmpty(proposal['First Name'])) ? '' : this.capitalizeFirstLetter(proposal['First Name'].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
    proposal['Last Name'] = (_.isEmpty(proposal['Last Name'])) ? '' : this.capitalizeFirstLetter(proposal['Last Name'].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
    proposal['Shipping Address Line 1'] = (_.isEmpty(proposal['Shipping Address Line 1'])) ? '' : proposal['Shipping Address Line 1'].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    proposal['Shipping Address Postal Code'] = (_.isEmpty(proposal['Shipping Address Postal Code'])) ? '' : proposal['Shipping Address Postal Code'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    proposal['Shipping Address City'] = (_.isEmpty(proposal['Shipping Address City'])) ? '' : proposal['Shipping Address City'].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    proposal['Billing Address Line 1'] = (_.isEmpty(proposal['Billing Address Line 1'])) ? '' : proposal['Billing Address Line 1'].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    proposal['Billing Address Postal Code'] = (_.isEmpty(proposal['Billing Address Postal Code'])) ? '' : proposal['Billing Address Postal Code'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    proposal['Billing Address City'] = (_.isEmpty(proposal['Billing Address City'])) ? '' : proposal['Billing Address City'].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    proposal['Phone'] = (_.isEmpty(proposal['Phone'])) ? '' : proposal['Phone'].replace(/[`~!@$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    proposal['Email'] = (_.isEmpty(proposal['Email'])) ? '' : proposal['Email'].toLowerCase().replace(/[`~!^*()|\=?;:'",<>\{\}\[\]\\\/]/gi, '');
    proposal['Customer Notes'] = (_.isEmpty(proposal['Customer Notes'])) ? '' : proposal['Customer Notes'].replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
  }

  private sanitizeProposalDetails(proposalDetails: any): void {
    proposalDetails.forEach((item: any) => {
      item['Item Description'] = (_.isEmpty(item['Item Description'])) ? '' : item['Item Description'].replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    });
  }

  /**
   * Deletes proposal detail from mysql and reuploads fresh copy to keep data in synch
   * @param proposalDetails [{"FK_Proposal_ID", "Item", "Item Description", "Quantity", "Unit Price", "UOM", "Taxable"}]
   */
  private insertProposalsToMysql(proposal: any, proposalDetails: Array<any>): void {
    this.sanitizeProposalData(proposal);
    this.sanitizeProposalDetails(proposalDetails);
    this.mysqlAdapter.upsert('proposals', proposal).then((success: any) => {
      console.log(success);
    }, (error: any) => {
      console.error(error);
    });
    this.mysqlAdapter.delete('proposal_details', _.pick(proposalDetails[0], 'FK_Proposal_ID')).then((success: any) => {
      console.log(success);
      this.mysqlAdapter.insert('proposal_details', proposalDetails).then((success: any) => {
        console.log(success);
      }, (error: any) => {
        console.error(error);
      });
    }, (error: any) => {
      console.error(error);
    });
  }

  private filterFilePathList(filePathTimestampMap: Array<any>, timestamp: number) {
    filePathTimestampMap = filePathTimestampMap.filter((file: any) => {
      return file.client_modified > timestamp;
    });
    //reverse, remove duplicates, reverse again - only latest updates left
    filePathTimestampMap = filePathTimestampMap.reverse();
    filePathTimestampMap = _.uniqBy(filePathTimestampMap, 'proposal_id');
    filePathTimestampMap = filePathTimestampMap.reverse();
    return filePathTimestampMap;
  }

  private loadLatestSynchTimestamps(filePath: string): any {
    try {
      let ts = fs.readFileSync(filePath, 'utf8');
      return !_.isEmpty(ts) ? JSON.parse(ts) : {};
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private flushUpdatedTimestamps(): void {
    console.log('writting file...');
    console.log(this.timestampsLog);
    fs.writeFile('/home/bart/apps/lifetree-api/timestamps.json', JSON.stringify(this.timestampsLog), (err: any) => {
      console.error('ERROR:' + err);
    });
  }

  private ensureDirectoryExistence(dirname: string): void {
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
  }

  private parseCsv(fileContents: any): any {
    return csvParser(fileContents, { relax_column_count: true });
  }

  private logFilePathCrawl(folderPath: string, lastRecordedTs: any, filePathTimestampMap: Array<any>): void {
    let currentTS: number = 0;
    if (!_.isEmpty(filePathTimestampMap)) {
      currentTS = _.last(filePathTimestampMap).client_modified;
    }
    console.log('PATH: ' + folderPath + ' || LAST_TS: ' + lastRecordedTs + ' || CURRENT_TS: ' + currentTS);
    console.log('NEW_ENTRIES: ' + filePathTimestampMap.length + ' || DELTA(hrs): ' +
      (_.isEmpty(_.last(filePathTimestampMap)) ? '0' : Math.floor((_.last(filePathTimestampMap).client_modified - lastRecordedTs) / 1000 / 60 / 60)));
  }

  /**
   * Utility function to join two arrays into one single {}
   * @param keys array holding keys of requested object
   * @param values array holding values of requested object 
   * @return object
   */
  private joinKeysValues(keys: Array<any>, values: Array<any>): any {
    if (keys.length != values.length) {
      console.log('joinKeysValues: not equal keys/values arrays!');
      return {};
    }
    let obj: any = {};
    keys.forEach((key: any, i: any) => obj[key] = values[i]);
    return obj;
  }

  /**
   * Utility function to convert MM/DD/YYYY -> YYYY-MM-DDD
   * @param usDate date to convert
   * @return converted date
   */
  private convertDate(usDate: String): String {
    var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
  }

  /**
   * @param folderEntries - array of objects holding metadata about each file (path_display, client_modified etc)
   * @return pathsArr - array of mappings (path_display -> client_modified) already sorted
   */
  private getFilePathToTimestampArrayMap(folderEntries: Array<any>): Array<any> {
    let pathsArr: Array<any> = [];
    folderEntries.forEach((fileInfo: any) => {
      let fileInfoTuple: any = {
        path_display: fileInfo.path_display,
        client_modified: Date.parse(fileInfo.client_modified),
        proposal_id: (fileInfo.path_display).split(' ')[0].match(/([^\/]*)\/*$/)[1]
      };
      pathsArr.push(fileInfoTuple);
    });
    return pathsArr;
  }

  dbx: any;
  mysqlAdapter: any;
  timestampsLog: any;
}

export default new RoutzySynch('TFZcuhg5fr4AAAAAAAAWxec1U7jnfS_4sBwYbgGx5qB00rVwKUZmDXOHlzjP4U_n');

// let routzySynch = new RoutzySynch('TFZcuhg5fr4AAAAAAAAWxec1U7jnfS_4sBwYbgGx5qB00rVwKUZmDXOHlzjP4U_n');
// routzySynch.synchronize();