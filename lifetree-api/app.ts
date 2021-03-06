import * as express from 'express';
import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';
import * as cors from 'cors';
import { Request, Response } from "express";
import * as bodyParser from "body-parser";

//services
import formHandler from './services/form-handler';
import dashboardHandler from './services/dashboard-handler';
import routzySynch  from './services/routzySynch'

class App {
  public app: any;
  public authCheck: any;

  constructor() {
    this.app = express();
    this.config();
    this.authCheck = jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://dev-s001fnzy.us.auth0.com/.well-known/jwks.json"
      }),
      audience: 'ifkbnJmKfK10u8Am3kASINeHCKSCqYoD', // Paste your API audience here.
      issuer: "https://dev-s001fnzy.us.auth0.com/",
      algorithms: ['RS256']
    });
    this.mountRoutes();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private mountRoutes(): void {
    const router = express.Router();

    router.get('/get/', (req: any, res: any) => {
      console.log(req.body);
      res.json({
        message: 'Hello World!'
      })
    });


    router.get('/dashboard/proposals/address', function(req: any, res: any) {
      console.log('request from dashboard- fetch addresses');
      dashboardHandler.processCustomerAddressRequest(req).then((response: any) => {
        console.log(response);
        res.status(200).send(response);
      });
    });

    router.post('/dashboard/email/update', function(req: Request, res: Response) {
      console.log('Request from Follow Up Email DashBoard');
      console.log(req.body);
      dashboardHandler.updateEmailConfig(req.body).then((response: any) => {
        console.log(response);
        res.status(200).send(response);
      });
    });

    router.post('/form/post/', (req: Request, res: Response) => {
      // query a database and save data
      formHandler.processFormRequest(req.body).then((response: any) => {
        res.status(200).send('success');
      }, (error) => {
        console.log(error);
        res.status(500).send(error);
      });
    });

    router.get('/dashboard/formData/', this.authCheck, function(req: any, res: any) {
      console.log('request from dashboard');
      dashboardHandler.processCustomerFormDataRequest(req).then((response: any) => {
        console.log(response);
        res.status(200).send(response);
      });
    });

    router.get('/dashboard/proposals/:id', this.authCheck, (req: Request, res: Response) => {
      console.log('request from dashboard');
      console.log('id: ' + req.params.id);
      dashboardHandler.processProposalsDataRequest(req).then((response: any) => {
        // console.log(response);
        res.status(200).send(response);
      });
    });

    router.post('/dashboard/proposals/update',(req: Request, res: Response) => {
      dashboardHandler.processProposalsDataRequestUpdate(req.body).then((response: any) => {
        res.status(200).send('success');
      }, (error) => {
        console.log(error);
        res.status(500).send(error);
      });
    });

    router.get('/dashboard/routzy/sync/', this.authCheck, (req: Request, res: Response) => {
      console.log('request from dashboard - refresh jobs');

      routzySynch.synchronize().then((success:any) => {
        console.log(success);
        res.status(200).send(success);
      }, (error: any) => {
        res.status(500).send(error);
      });

      // dashboardHandler.processRefreshInvoicesRequest(req).then((success: any) => {
      //   console.log(success);
      //   res.status(200).send(success);
      // }, (error: any) => {
      //   res.status(500).send(error);
      // });
    });

    router.post('/dashboard/quickbooks/queue/enqueue/', this.authCheck, (req: Request, res: Response) => {
      // query a database and save data
      dashboardHandler.processEnqueueQBRequest(req.body).then((response: any) => {
        res.status(200).send('success');
      }, (error) => {
        console.log(error);
        res.status(500).send(error);
      });
    });

    router.post('/dashboard/quickbooks/queue/delete/', this.authCheck, (req: Request, res: Response) => {
      // query a database and save data
      dashboardHandler.processDeleteQBRequest(req.body).then((response: any) => {
        res.status(200).send('success');
      }, (error) => {
        console.log(error);
        res.status(500).send(error);
      });
    });

    router.get('/dashboard/quickbooks/queue/', this.authCheck, (req: Request, res: Response) => {
      // fetch current quickbooks queue
      dashboardHandler.processQBQueueDataRequest(req.body).then((response: any) => {
        res.status(200).send(response);
      }, (error) => {
        console.log(error);
        res.status(500).send(error);
      });
    });


    this.app.use('/', router);
  }
}

export default new App().app
