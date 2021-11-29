/**
 * Used to fetch data enqueued in quickbooks_queue table and update status based
 * on quickbooks web connector response.
 * 
 * Table Schema:
 * ID, PROPOSAL_ID, ENQUEUE_TIME, DEQUEUE_TIME, TICKET_ID, STATUS
 * 
 * @author Bart Karmilowicz
 */

"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
var knex = require("knex");
var Promise = require('promise');
var moment = require('moment-timezone');

var QBDBAdapter = /** @class */ (function () {
  function QBDBAdapter() {
    this.knex = knex({
      client: 'mysql',
      connection: {
        host: '104.131.80.5',
        user: 'customer_updater',
        password: 'Z0n3alarm22!',
        database: 'customers'
      }
    });
    //checking mysql connection
    this.knex.raw('select 1+1 as result').then(function (success) {
      console.log('mysql connection stable.');
    }).catch(function (err) {
      console.log(err);
    });
  }

  QBDBAdapter.prototype.dequeue = function () {
    return this.knex('quickbooks').where({
      'status': 'q'
    }).then(function (rows) {
      return (rows);
    }, function (error) {
      return (error);
    });
  };

  QBDBAdapter.prototype.fetchInvoices = function (invoiceIds) {
    var queries = [];
    console.log(invoiceIds);
    queries.push(this.knex('proposals').whereIn('Proposal ID', invoiceIds));
    queries.push(this.knex('proposal_details').whereIn('FK_PROPOSAL_ID', invoiceIds));
    return Promise.all(queries).then(function (values) {
      console.log(values);
      return values;
    }, function (error) {
      return error;
    });
  };

  QBDBAdapter.prototype.updateResponse = function (queueRequest, statusInfo, sessionId) {
    var updateContents = {
      status: (statusInfo.statusCode == '0') ? 'c' : 'e',
      dequeue_time: moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss'),
      msg: statusInfo.statusMessage,
      code: statusInfo.statusCode,
      ticket_id: sessionId
    }
    // update quickbooks queue database
    this.knex('quickbooks').where({
      id: queueRequest.qid
    }).update(updateContents).then(function (success) {
      console.log('status updated for : ' + queueRequest.proposal_id);
    });
    
    // update proposal status in proposals table
    this.knex('proposals').where({
      'Proposal ID': queueRequest.proposal_id
    }).update({
      QB_EXPORTED: 1
    }).then(function (success) {
      console.log('status updated for : ' + queueRequest.proposal_id);
    });
  };


  return QBDBAdapter;
}());
exports.default = new QBDBAdapter();
