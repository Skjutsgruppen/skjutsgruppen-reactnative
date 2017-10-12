import Session from '@services/storage/session';

class Auth {
  constructor() {
    this.session = Session;
    this.key = 'auth_skjuts_token';
  }

  logout() {
    return this.session.remove(this.key);
  }

  set(user) {
    return this.session.set(this.key, user);
  }

  get() {
    return this.session.get(this.key);
  }

  async setUser(user) {
    const auth = await this.get();
    auth.user = user;
    return this.set(auth);
  }

  async token() {
    const isLoggedIn = await this.isLoggedIn();

    if (isLoggedIn) {
      const auth = await this.get();
      return auth.token;
    }

    return '';
  }

  async user() {
    const isLoggedIn = await this.isLoggedIn();

    if (isLoggedIn) {
      const auth = await this.get();
      return auth.user;
    }

    return '';
  }

  async isLoggedIn() {
    const session = await this.session.get(this.key);
    return (session && session.token !== '');
  }
}

export default new Auth();
