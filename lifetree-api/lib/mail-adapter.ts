import nodemailer = require('nodemailer');
import smtpTransport = require('nodemailer-smtp-transport');
import * as _ from 'lodash';

class MailAdapter {
  constructor() {
    this.transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: 'lifetreewny.mailer@gmail.com',
        pass: 'adv49507'
      }
    }));
  }

  private formatMessage(message: any): String {
    let msg = '<h3>New Submission From: </h3>';
    msg += '<p>' + message['firstname'] + ' ' + message['lastname'] + '</p>';
    msg += '<p>' + message['address'] + '</p>';
    msg += '<p>' + message['city'] + ', ' + message['zipcode'] + '</p>';
    msg += '<p>' + message['email'] + '</p>';
    msg += '<p>' + message['phone'] + '</p>';
    msg += '<br>';
    msg += '<p>' + 'Note: </p>';
    msg += '<p>' + message['message'] + '</p>';
    return msg;
  }

  private sendSubmissionNotification(message: any, csvContents: any) {
    let mailOptions = {
      from: 'lifetreewny.mailer@gmail.com',
      to: 'slifetreewny@gmail.com',
      replyTo: message['email'],
      subject: 'New Form Submission',
      html: this.formatMessage(message),
      attachments: [
        {
          filename: 'routzy-contact-import.csv',
          content: csvContents
        }
      ]
    };
    this.transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  private transporter: any;
}

export default new MailAdapter();
