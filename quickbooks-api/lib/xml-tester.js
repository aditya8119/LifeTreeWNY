var builder = require('xmlbuilder');



// inputXMLDoc = builder.create('QBXML', { version: '1.0' })
// .instruction('qbxml', 'version="4.0"')
// .ele('QBXMLMsgsRq', { 'onError': 'stopOnError' })
//     .ele('CustomerAddRq')
//         .ele('CustomerAdd')
//           .ele('Name').text('Bart Karmilowicz').up()
//           .ele('FirstName').text('Bart').up()
//           .ele('LastName').text('Karmilowicz').up()
//           .ele('BillAddress')
//             .ele('Addr1').text('235 Carpenter Ave').up()
//             .ele('City').text('Buffalo').up()
//             .ele('State').text('NY').up()
//             .ele('PostalCode').text('14223').up()
//             .ele('Country').text('USA').up()
  
// strRequestXML = inputXMLDoc.end({ 'pretty': false });

// console.log(strRequestXML)

var builder = require('xmlbuilder');

var feedObj = {
  "QBXML": {
    "QBXMLMsgsRq": {
      "-onError": "stopOnError",
      "InvoiceAddRq": {
        "InvoiceAdd": {
          "CustomerRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "TxnDate": "DATETYPE",
          "BillAddress": {
            "Addr1": "STRTYPE",
            "Addr2": "STRTYPE",
            "Addr3": "STRTYPE",
            "Addr4": "STRTYPE",
            "Addr5": "STRTYPE",
            "City": "STRTYPE",
            "State": "STRTYPE",
            "PostalCode": "STRTYPE",
            "Country": "STRTYPE",
            "Note": "STRTYPE"
          },
          "InvoiceLineAdd": {
            "ItemRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "Desc": "STRTYPE",
            "Quantity": "QUANTYPE",
            "Rate": "PRICETYPE",
          },
          "InvoiceLineGroupAdd": {
            "ItemGroupRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "Quantity": "QUANTYPE",
            "UnitOfMeasure": "STRTYPE",
            "InventorySiteRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "InventorySiteLocationRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "DataExt": {
              "OwnerID": "GUIDTYPE",
              "DataExtName": "STRTYPE",
              "DataExtValue": "STRTYPE"
            }
          }
        },
        "IncludeRetElement": "STRTYPE"
      },
      "InvoiceAddRs": {
        "-statusCode": "INTTYPE",
        "-statusSeverity": "STRTYPE",
        "-statusMessage": "STRTYPE",
        "InvoiceRet": {
          "TxnID": "IDTYPE",
          "TimeCreated": "DATETIMETYPE",
          "TimeModified": "DATETIMETYPE",
          "EditSequence": "STRTYPE",
          "TxnNumber": "INTTYPE",
          "CustomerRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "ClassRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "ARAccountRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "TemplateRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "TxnDate": "DATETYPE",
          "RefNumber": "STRTYPE",
          "BillAddress": {
            "Addr1": "STRTYPE",
            "Addr2": "STRTYPE",
            "Addr3": "STRTYPE",
            "Addr4": "STRTYPE",
            "Addr5": "STRTYPE",
            "City": "STRTYPE",
            "State": "STRTYPE",
            "PostalCode": "STRTYPE",
            "Country": "STRTYPE",
            "Note": "STRTYPE"
          },
          "BillAddressBlock": {
            "Addr1": "STRTYPE",
            "Addr2": "STRTYPE",
            "Addr3": "STRTYPE",
            "Addr4": "STRTYPE",
            "Addr5": "STRTYPE"
          },
          "ShipAddress": {
            "Addr1": "STRTYPE",
            "Addr2": "STRTYPE",
            "Addr3": "STRTYPE",
            "Addr4": "STRTYPE",
            "Addr5": "STRTYPE",
            "City": "STRTYPE",
            "State": "STRTYPE",
            "PostalCode": "STRTYPE",
            "Country": "STRTYPE",
            "Note": "STRTYPE"
          },
          "ShipAddressBlock": {
            "Addr1": "STRTYPE",
            "Addr2": "STRTYPE",
            "Addr3": "STRTYPE",
            "Addr4": "STRTYPE",
            "Addr5": "STRTYPE"
          },
          "IsPending": "BOOLTYPE",
          "IsFinanceCharge": "BOOLTYPE",
          "PONumber": "STRTYPE",
          "TermsRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "DueDate": "DATETYPE",
          "SalesRepRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "FOB": "STRTYPE",
          "ShipDate": "DATETYPE",
          "ShipMethodRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "Subtotal": "AMTTYPE",
          "ItemSalesTaxRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "SalesTaxPercentage": "PERCENTTYPE",
          "SalesTaxTotal": "AMTTYPE",
          "AppliedAmount": "AMTTYPE",
          "BalanceRemaining": "AMTTYPE",
          "CurrencyRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "ExchangeRate": "FLOATTYPE",
          "BalanceRemainingInHomeCurrency": "AMTTYPE",
          "Memo": "STRTYPE",
          "IsPaid": "BOOLTYPE",
          "CustomerMsgRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "IsToBePrinted": "BOOLTYPE",
          "IsToBeEmailed": "BOOLTYPE",
          "CustomerSalesTaxCodeRef": {
            "ListID": "IDTYPE",
            "FullName": "STRTYPE"
          },
          "SuggestedDiscountAmount": "AMTTYPE",
          "SuggestedDiscountDate": "DATETYPE",
          "Other": "STRTYPE",
          "ExternalGUID": "GUIDTYPE",
          "LinkedTxn": {
            "TxnID": "IDTYPE",
            "TxnType": "ENUMTYPE",
            "TxnDate": "DATETYPE",
            "RefNumber": "STRTYPE",
            "LinkType": "ENUMTYPE",
            "Amount": "AMTTYPE"
          },
          "InvoiceLineRet": {
            "TxnLineID": "IDTYPE",
            "ItemRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "Desc": "STRTYPE",
            "Quantity": "QUANTYPE",
            "UnitOfMeasure": "STRTYPE",
            "OverrideUOMSetRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "Rate": "PRICETYPE",
            "RatePercent": "PERCENTTYPE",
            "ClassRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "Amount": "AMTTYPE",
            "InventorySiteRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "InventorySiteLocationRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "SerialNumber": "STRTYPE",
            "LotNumber": "STRTYPE",
            "ServiceDate": "DATETYPE",
            "SalesTaxCodeRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "Other1": "STRTYPE",
            "Other2": "STRTYPE",
            "DataExtRet": {
              "OwnerID": "GUIDTYPE",
              "DataExtName": "STRTYPE",
              "DataExtType": "ENUMTYPE",
              "DataExtValue": "STRTYPE"
            }
          },
          "InvoiceLineGroupRet": {
            "TxnLineID": "IDTYPE",
            "ItemGroupRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "Desc": "STRTYPE",
            "Quantity": "QUANTYPE",
            "UnitOfMeasure": "STRTYPE",
            "OverrideUOMSetRef": {
              "ListID": "IDTYPE",
              "FullName": "STRTYPE"
            },
            "IsPrintItemsInGroup": "BOOLTYPE",
            "TotalAmount": "AMTTYPE",
            "InvoiceLineRet": {
              "TxnLineID": "IDTYPE",
              "ItemRef": {
                "ListID": "IDTYPE",
                "FullName": "STRTYPE"
              },
              "Desc": "STRTYPE",
              "Quantity": "QUANTYPE",
              "UnitOfMeasure": "STRTYPE",
              "OverrideUOMSetRef": {
                "ListID": "IDTYPE",
                "FullName": "STRTYPE"
              },
              "Rate": "PRICETYPE",
              "RatePercent": "PERCENTTYPE",
              "ClassRef": {
                "ListID": "IDTYPE",
                "FullName": "STRTYPE"
              },
              "Amount": "AMTTYPE",
              "InventorySiteRef": {
                "ListID": "IDTYPE",
                "FullName": "STRTYPE"
              },
              "InventorySiteLocationRef": {
                "ListID": "IDTYPE",
                "FullName": "STRTYPE"
              },
              "SerialNumber": "STRTYPE",
              "LotNumber": "STRTYPE",
              "ServiceDate": "DATETYPE",
              "SalesTaxCodeRef": {
                "ListID": "IDTYPE",
                "FullName": "STRTYPE"
              },
              "Other1": "STRTYPE",
              "Other2": "STRTYPE",
              "DataExtRet": {
                "OwnerID": "GUIDTYPE",
                "DataExtName": "STRTYPE",
                "DataExtType": "ENUMTYPE",
                "DataExtValue": "STRTYPE"
              }
            },
            "DataExtRet": {
              "OwnerID": "GUIDTYPE",
              "DataExtName": "STRTYPE",
              "DataExtType": "ENUMTYPE",
              "DataExtValue": "STRTYPE"
            }
          },
          "DataExtRet": {
            "OwnerID": "GUIDTYPE",
            "DataExtName": "STRTYPE",
            "DataExtType": "ENUMTYPE",
            "DataExtValue": "STRTYPE"
          }
        },
        "ErrorRecovery": {
          "ListID": "IDTYPE",
          "OwnerID": "GUIDTYPE",
          "TxnID": "IDTYPE",
          "TxnNumber": "INTTYPE",
          "EditSequence": "STRTYPE",
          "ExternalGUID": "GUIDTYPE"
        }
      }
    }
  }
}

var feed = builder.create(feedObj, { encoding: 'utf-8' }).instruction('qbxml', 'version="13.0"');
console.log(feed.end({ pretty: true }));