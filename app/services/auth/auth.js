import Session from '@services/storage/session';

class Auth {
  constructor() {
    this.session = Session;
    this.userKey = 'auth_skjuts_user';
    this.tokenKey = 'auth_skjuts_token';
  }

  async logout() {
    await this.session.remove(this.userKey);
    return this.session.remove(this.tokenKey);
  }

  async setAuth({ user, token }) {
    await this.setUser(user);
    return this.setToken(token);
  }

  setToken(user) {
    return this.session.set(this.tokenKey, user);
  }

  getToken() {
    return this.session.get(this.tokenKey);
  }

  setUser(user) {
    return this.session.set(this.userKey, user);
  }

  getUser() {
    return this.session.get(this.userKey);
  }

  async hasUser() {
    const user = await this.getUser();
    const token = await this.getToken();

    return (token !== null && user !== null);
  }

  async isLoggedIn() {
    const token = await this.session.get(this.tokenKey);
    const user = await this.session.get(this.userKey);

    if (token && user) {
      return (user.emailVerified && token !== '');
    }

    return false;
  }
}

export default new Auth();
