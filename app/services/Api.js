/* global fetch */
import { API_URL } from '@config';

class Api {
  constructor() {
    this.apiUrl = API_URL;
  }

  getUrl(resource) {
    return `${this.apiUrl}/${resource}`;
  }

  get(resource) {
    return fetch(this.getUrl(resource)).then(response => response.json());
  }
}

export default new Api();
