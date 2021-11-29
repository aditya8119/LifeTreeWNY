import knex = require('knex');

class MysqlAdapter {
  constructor() {

    this.knex = knex({
      client: 'mysql',
      connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'adv49507',
        database: 'customers'
      }
    });

    //checking mysql connection
    this.knex.raw('select 1+1 as result').then((success: any) => {
      console.log('mysql connection stable.');
    }).catch((err: any) => {
      console.log(err);
    });
  }

  public select(table: String, column: String, values: Array<String>): Promise<any> {
    return this.knex(table).whereIn(column, values).then((rows: any) => {
      return rows;
    }, (error: any) => {
      return error;
    });
  }

  public selectAll(tableName: String): Promise<any> {
    return this.knex.select().table(tableName);
  }

  public insert(table: String, data: any): Promise<any> {
    return this.knex(table).insert(data).then((success: any) => {
      return ('Data inserted to db successfully to ' + table);
    }, (error: any) => {
      return (error);
    });
  }

  public delete(table: String, condition: any): Promise<any> {
    return this.knex(table).where(condition).del().then((success: any) => {
      return ('Data successfully deleted from ' + table);
    }, (error: any) => {
      return error;
    });
  }

  public update(table: String, condition: any, what: any): Promise<any> {
    return this.knex(table).where(condition).update(what).then((success: any) => {
      return ('Data successfully updated in ' + table);
    }, (error: any) => {
      return error;
    });
  }

  public upsert(table: String, data: any, update: any): Promise<any> {
    if (!update) update = data;
    let insert = this.knex(table).insert(data).toString();
    update = this.knex(table).update(update).toString().replace(/^update .* set /i, '');
    return this.knex.raw(insert + ' on duplicate key update ' + update).then((success: any) => {
      return ('Data inserted to db successfully to ' + table);
    }, (error: any) => {
      return (error);
    });
  }

  private replace(table: String, data: any) {
    let insert = this.knex(table).insert(data).toString().replace(/^INSERT/i, 'REPLACE');
    return this.knex.raw(insert);
  }

  public join(table1: String, table2: String, field1: String, field2: String): Promise<any> {
    return this.knex(table1).join(table2, field1, '=', field2);
  }
  

  public createProposalsTable(): void {
    this.knex.schema.createTable('proposals', (table: any) => {
      table.string('Proposal ID');
      table.unique('Proposal ID');
      table.string('Activity ID');
      table.string('First Name');
      table.string('Middle Name');
      table.string('Last Name');
      table.string('Company');
      table.string('Shipping Address Line 1');
      table.string('Shipping Address Line 2');
      table.string('Shipping Address City');
      table.string('Shipping Address State');
      table.string('Shipping Address Postal Code');
      table.string('Billing Address Line 1');
      table.string('Billing Address Line 2');
      table.string('Billing Address City');
      table.string('Billing Address State');
      table.string('Billing Address Postal Code');
      table.string('Proposal Name');
      table.string('Proposal Number');
      table.string('Date');
      table.string('Time');
      table.string('Subtotal');
      table.string('Tax Total');
      table.string('Total');
      table.string('Tax Name');
      table.string('Tax Rate');
      table.string('Timestamp');
      table.string('Number Of Items');
    }).then((success: any) => {
      console.log('success');
    }).catch((error: any) => {
      console.log(error);
    });
  }

  //private connection: any;
  private knex: any;
}

export default new MysqlAdapter();
