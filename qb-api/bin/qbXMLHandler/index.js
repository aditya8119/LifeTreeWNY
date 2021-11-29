/*
 * This file is part of quickbooks-js
 * https://github.com/RappidDevelopment/quickbooks-js
 *
 * Based on qbws: https://github.com/johnballantyne/qbws
 */

var chalk = require('chalk');
var fs = require('fs');
var xmlparser = require('xml2js');
var moment = require('moment');
var data2xml = require('data2xml');
var builder = require('xmlbuilder');
var _ = require('lodash');
var qbdb_adapter = require("./qb-db-adapter").default;
var convert = data2xml({
  xmlHeader: '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n'
});


//map of req number -> id, proposal,id
var counter = 0;
var requestMap = {};
var sessionId = '';

// Public
module.exports = {
  /**
   * Make sure session id is up to date
   */
  updateSessionId: function (sid) {
    sessionId = sid;
  },

  /**
   * No more requests, clear existing request map - preserve memory
   */
  clearRequestMap: function () {
    counter = 0;
    requestMap = {};
    console.log('requestMap cleared');
  },

  /**
   * Builds an array of qbXML commands
   * to be run by QBWC.
   *
   * @param callback(err, requestArray)
   */
  fetchRequests: function (callback) {
    buildRequests(callback);
  },

  /**
   * Called when a qbXML response
   * is returned from QBWC.
   *
   * @param response - qbXML response
   */
  handleResponse: function (response, responseCounter) {
    console.log('Response From WebConnector:');
    console.log(chalk.blueBright(response));
    if (requestMap.hasOwnProperty(responseCounter)) {
      xmlparser.parseString(response, function (err, result) {
        var statusInfo = result.QBXML.QBXMLMsgsRs[0].InvoiceAddRs[0].$;
        if (!_.isEmpty(statusInfo)) {
          qbdb_adapter.updateResponse(requestMap[responseCounter], statusInfo, sessionId);
        }
      });
    }
  },

  /**
   * Called when there is an error
   * returned processing qbXML from QBWC.
   *
   * @param error - qbXML error response
   */
  didReceiveError: function (error, responseCounter) {
    console.log(chalk.red(error));
    if (requestMap.hasOwnProperty(responseCounter)) {
      var statusInfo = {
        statusCode: error,
        statusMessage: 'qbxml parsing error'
      }
      qbdb_adapter.updateResponse(requestMap[responseCounter], statusInfo, sessionId);
    }
  }
};

function generateCustomerQBXML(customerData, requests) {
  var QBJson = {
    QBXMLMsgsRq: {
      _attr: { onError: 'stopOnError' },
      CustomerAddRq: {
        CustomerAdd: {
          Name: customerData['First Name'] + ' ' + customerData['Last Name'],
          FirstName: customerData['First Name'],
          LastName: customerData['Last Name'],
          BillAddress: {
            Addr1: customerData['Billing Address Line 1'],
            City: customerData['Billing Address City'],
            State: customerData['Billing Address State'],
            PostalCode: customerData['Billing Address Postal Code'],
            Country: 'USA'
          }
        }
      }
    }
  };
  //non-required fields
  if (!_.isEmpty(customerData['Phone'])) QBJson.QBXMLMsgsRq.CustomerAddRq.CustomerAdd.Phone = customerData['Phone'];
  if (!_.isEmpty(customerData['Email'])) QBJson.QBXMLMsgsRq.CustomerAddRq.CustomerAdd.Email = customerData['Email'];

  var xml = convert('QBXML', QBJson);
  requests.push(xml);
  counter += 1;
}

function trimServiceName(itemName) {
  switch (itemName) {
    case 'Tree Trimming Class I Fine Pruning ':
      return 'Tree Trimming I'
    case 'Tree Trimming Class II Standard Pruning ':
      return 'Tree Trimming Class II'
    case 'Tree Trimming Class III Hazard Pruning':
      return 'Tree Trimming Class III'
    case 'Tree Trimming Class IV Hazard Pruning':
      return 'Tree Trimming Class IV'
    default:
      return itemName
  }
}

function generateServiceQBXML(invoiceDetailsData, requests) {
  var items = Array.from(new Set(invoiceDetailsData.map(entry => entry.Item)));
  items.forEach(function (itemName) {
    var xml = convert(
      'QBXML',
      {
        QBXMLMsgsRq: {
          _attr: { onError: 'stopOnError' },
          ItemServiceAddRq: {
            ItemServiceAdd: {
              Name: trimServiceName(itemName),
              SalesOrPurchase: {
                AccountRef: {
                  FullName: 'Income'
                }
              }
            }
          }
        }
      }
    );
    requests.push(xml);
    counter += 1;
  });
}

function generateInvoiceQBXML(invoiceData, invoiceDetailsData, requests, rows) {
  //passing id of quickbooks_db for further response update - will be inserted in 'other' field
  var id = rows.filter(obj => obj.proposal_id == invoiceData['Proposal ID']).map(obj => obj.id)[0];
  var QBJson = {
    QBXMLMsgsRq: {
      _attr: { onError: 'stopOnError' },
      InvoiceAddRq: {
        InvoiceAdd: {
          CustomerRef: {
            FullName: invoiceData['First Name'] + ' ' + invoiceData['Last Name']
          },
          TxnDate: moment(invoiceData['Date']).format('YYYY-MM-DD'),
          BillAddress: {
            Addr1: invoiceData['Billing Address Line 1'],
            City: invoiceData['Billing Address City'],
            State: invoiceData['Billing Address State'],
            PostalCode: invoiceData['Billing Address Postal Code'],
            Country: 'USA'
          },
          InvoiceLineAdd: [],
        }
      }
    }
  };

  //build invoice line items & append to invoice
  invoiceDetailsData.forEach(function (invoiceItem) {
    var obj = {
      ItemRef: {
        FullName: trimServiceName(invoiceItem['Item'])
      },
      Quantity: (invoiceItem['Item'] === 'Discount' || invoiceItem['Item'] === 'Payment') ? '' : invoiceItem['Quantity'],
      Rate: invoiceItem['Unit Price']
    }
    //non-required fields
    // if (!_.isEmpty(invoiceItem['Item Description']) && invoiceItem['Item Description'].length < 100) {
    //   invoiceItem['Item Description'] = invoiceItem['Item Description'].replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    //   obj.Desc = invoiceItem['Item Description'];
    // }
    //... add more if needed

    QBJson.QBXMLMsgsRq.InvoiceAddRq.InvoiceAdd.InvoiceLineAdd.push(obj);
  });

  //store request info - needed for updating response
  requestMap[counter++] = {
    'qid': id,
    'proposal_id': invoiceData['Proposal ID']
  }

  var xml = convert('QBXML', QBJson);
  requests.push(xml);
}

function generateQBXMLS(invoice, invoiceDetails, rows, requests) {
  //generate qbxml for customer entry (might exist)
  generateCustomerQBXML(invoice, requests);

  //generate qbxml for potentially new service
  generateServiceQBXML(invoiceDetails.filter(invoiceDetails =>
    invoiceDetails.FK_Proposal_ID == invoice['Proposal ID']), requests);

  //generate qbxml for invoice 
  generateInvoiceQBXML(invoice,
    invoiceDetails.filter(invoiceDetails => invoiceDetails.FK_Proposal_ID == invoice['Proposal ID']), requests, rows);
}


function buildRequests(callback) {
  qbdb_adapter.dequeue().then(function (rows) {
    console.log('STATUS: dequeue...');
    console.log(rows);
    if (_.isEmpty(rows)) {
      console.log('STATUS: empty queue');
      return callback(null, []);
    }
    qbdb_adapter.fetchInvoices(rows.map(obj => obj.proposal_id)).then(function (invoices) {
      console.log('STATUS: invoices size : ' + invoices.length);
      console.log(invoices);
      //invoices[0] - invoices
      //invoices[1] - invoices subdetails (service items)
      //console.log(invoices[1]);
      let requests = new Array();
      invoices[0].forEach(function (invoice) {
        generateQBXMLS(invoice, invoices[1], rows, requests);
      });
      return callback(null, requests);
    }, function (error) {
      console.log(error);
    });
  });
}

/**
 * @function serviceLog
 *
 * @desc Writes a string to the console and log file.
 *
 * @param {String} data - The information to be logged.
 */
function serviceLog(data) {
  // TODO: Put the log file somewhere else
  var consoleLogging = true;
  if (consoleLogging) {
    console.log(data);
  }
  fs.appendFile('log.log', chalk.stripColor(data) + '\n', function callback(err) {
    if (err) {
      console.log(err);
    }
  });
}