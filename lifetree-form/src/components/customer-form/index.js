import angular from 'angular';
import vcRecaptcha from 'angular-recaptcha';
import { CustomerFormComponent } from './customer-form.component';

export * from './customer-form.component';

export default angular.module('customerForm', [vcRecaptcha])
    .component(CustomerFormComponent.selector, CustomerFormComponent)
    .name;
