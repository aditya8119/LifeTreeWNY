import template from './customer-form.html';
import states from './states.js';

export let CustomerFormComponent = {
  templateUrl: template,
  selector: 'customerForm',
  bindings: {},
  /* @ngInject */
  controller: class CustomerFormCtrl {
    /* @ngInject */
    constructor($state, $timeout, FormSubmitterService, vcRecaptchaService) {
      this.timeout = $timeout;
      this.formSubmitter = FormSubmitterService;
      this.recaptchaService = vcRecaptchaService;
      this.states = states;

      this.headers = {
        welcome: {
          title: 'Contact Us',
          message: 'Send us your message and we will get back to you as soon as possible.'
        },
        success: {
          title: 'Thank you!',
          message: 'We will contact you as soon as possible. Enjoy your day!'
        },
        error: {
          title: 'Something went wrong.. ',
          message: 'Please contact us directly (716) 553-3318. We still want to hear your problem!'
        }
      };

      //defaults
      this.form = {};
      this.form.source = 'Google';
      this.form.state = 'NY';
      this.intro = this.headers.welcome;
      this.inProgress = false;
      this.formSubmitted = false;
      this.captchaAlert = false;
      this.key = "6Lf2wVEUAAAAABMFLsQIpRHIcIlI7yPhKwgc2VDg";
    }

    /**
     * Calls submit service
     */
    submitForm() {
      if (this.recaptchaService.getResponse() === '') {
        this.captchaAlert = true;
      } else {
        this.form['g-recaptcha-response'] = this.recaptchaService.getResponse();

        this.inProgress = true;
        this.formSubmitter.uploadFormData(this.form).then((result) => {
          console.log(result);
          this.inProgress = false;
          this.intro = this.headers.success;
          this.formSubmitted = true;
        }).catch((error) => {
          console.log(error);
          this.inProgress = false;
          this.intro = this.headers.error;
          this.formSubmitted = true;
        });
      }
    }
  }
};