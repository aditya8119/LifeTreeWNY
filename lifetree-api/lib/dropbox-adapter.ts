import Dropbox = require('dropbox');
import fs = require('fs');
import * as _ from 'lodash';
import { Promise } from 'es6-promise';
import path = require('path');
import csvParser = require('csv-parse/lib/sync');

class DropboxAdapter {
  constructor() {
    this.dbx = new Dropbox({
      accessToken: 'TFZcuhg5fr4AAAAAAAAWxec1U7jnfS_4sBwYbgGx5qB00rVwKUZmDXOHlzjP4U_n'
    });
  }

  /**
   * Uploads file under specified file path
   * @param filepath where the file should be placed
   * @param fileContents contents of the file
   */
  uploadFile(filepath: string, fileContents: string) {
    return this.dbx.filesUpload({ path: filepath, contents: fileContents })
      .then((response: any) => {
        console.log('success');
        console.log(response);
        return Promise.resolve(response);
      })
      .catch((error: any) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  /**
   * Downloads requested file from dropbox
   * @param filePath path to the requested file
   * @return file contents 
   */
  downloadFile(filePath: string): Promise<any> {
    return this.dbx.filesDownload({ path: filePath }).then((response: any) => {
      //console.log('File: ' + response.name + ' downloaded ' + '| size: ' + response.size);
      return Promise.resolve(response.fileBinary);
    }).catch((error: any) => {
      console.error('ERROR: ' + JSON.stringify(error.error));
      return Promise.reject(error);
    });
  }

  /**
   * @param dir name of parent directory
   * @return paths of all subfolders                          
   */
  getFilesPaths(filePath: string): Promise<any> {
    return this.dbx.filesListFolder({ path: filePath }).then((response: any) => {
      return Promise.resolve(response);
    }).catch((error: any) => {
      return Promise.reject(error);
    });
  }

  private dbx: any;
}

export default new DropboxAdapter();