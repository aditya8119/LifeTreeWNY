import nodemailer = require('nodemailer');
import smtpTransport = require('nodemailer-smtp-transport');
import nodeCron = require('node-cron')
import dashboardHandler from './dashboard-handler';
import mysqlAdapter from '../lib/mysql-adapter';

class FollowUpEmail {
  constructor() {
    this.mysqlAdapter = mysqlAdapter;
    this.transporter = nodemailer.createTransport(smtpTransport({
      //AIzaSyAeh5Mly0K5FMjknzKuNqyO1w1LFylFogw
      service: 'gmail',
      auth: {
        user: 'lifetreewnyemployee@gmail.com',
        pass: 'enelceleidpoutey'
      }
    }));

    this.sendFollowUpEmail();
  }

  private sendFollowUpEmail(): void {
    let content: any;
    try {
      this.mysqlAdapter.selectAll('email').then((success: any) => {
        setTimeout(() => {
          console.log(success);
          content = success[0];
          this.setupEmailJob(success[0])
        }, 2000);
      });
    } catch (err) {
      console.error(err);
    }
  }

  private sendmail(transporter: nodemailer.Transporter, mailOptions: any) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent' + info.response);
      }
    });
  }

  private setupEmailJob(content:any){
    let emailConfig: any;
    dashboardHandler.getCustomerEmailDetails().then((response: any) => {
      setTimeout(() => {
        emailConfig = JSON.parse(JSON.stringify(response[0]));
        this.scheduleCron(emailConfig,content)
      }, 3000);
     
    });
    
  }

  private scheduleCron(emailConfig:any,content:any){
    // nodeCron.schedule(content.cron, () => {
      emailConfig.forEach((element: any) => {
        let mailOptions = {
          from: 'lifetreewnyemployee@gmail.com',
          cc: 'dlum3328@gmail.com',
          //cc: element.email,
          subject: content.title,
          html: this.formatMessage(element, content.message),
        };
        console.log(mailOptions);
        // setTimeout(() => {
        //   this.sendmail(this.transporter, mailOptions);
        // }, 2000);
      });
    // });
  }

  private formatMessage(message: any, content: any): String {
    console.log(message)
    let msg = '<h3>Follow Up Email </h3>';
    msg += '<p>' + message['firstName'] + ' ' + message['lastName'] + '</p>';
    msg += '<p>' + message['email'] + '</p>';
    msg += '<p>' + message['phone'] + '</p>';
    msg += '<br>';
    msg += '<p>' + 'Note: </p>';
    msg += '<p>' + content['message'] + '</p>';
    return msg;
  }
  private transporter: any;
  mysqlAdapter: any;
}

export default new FollowUpEmail();