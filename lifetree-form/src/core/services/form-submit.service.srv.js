export default class FormSubmitter {
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  uploadFormData(formData) {
    let req = {
      method: 'POST',
      url: '/api/form/post/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: formData
    };

    return this.$http(req).then((response) => {
      return this.$q.resolve(response.data);
    }, (error) => {
      return this.$q.reject(error);
    });
  }
}