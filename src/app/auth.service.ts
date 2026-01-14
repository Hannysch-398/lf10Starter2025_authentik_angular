import { Injectable, signal } from '@angular/core';
import { AuthConfig, OAuthService, OAuthEvent } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authConfig: AuthConfig = {
    issuer: 'http://localhost:9000/application/o/employee_api/',
    clientId: 'employee_api_client',
    redirectUri: 'http://localhost:4200/callback',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,
    requireHttps: false,
    postLogoutRedirectUri: 'http://localhost:4200/',
    strictDiscoveryDocumentValidation: false,
  };

  private configurePromise: Promise<void>;

  readonly isLoggedIn = signal<boolean>(false);

  constructor(private oauthService: OAuthService) {
    this.configurePromise = this.configure();

    this.oauthService.events.subscribe((_e: OAuthEvent) => {
      this.syncLoginState();
    });
  }

  private async configure() {
    this.oauthService.configure(this.authConfig);
    await this.oauthService.loadDiscoveryDocument();

    this.syncLoginState();

    this.oauthService.setupAutomaticSilentRefresh();
  }

  private syncLoginState() {
    this.isLoggedIn.set(this.oauthService.hasValidAccessToken());
  }

  ready(): Promise<void> {
    return this.configurePromise;
  }

  async tryRestoreLogin(): Promise<void> {
    await this.configurePromise;
    await this.oauthService.tryLoginCodeFlow();
    this.syncLoginState();
  }

  async login(returnUrl?: string) {
    await this.configurePromise;

    if (returnUrl) sessionStorage.setItem('returnUrl', returnUrl);

    this.oauthService.initCodeFlow();
  }

  logout() {
    this.isLoggedIn.set(false);
    sessionStorage.removeItem('returnUrl');

    this.oauthService.logOut();
  }

  hasValidToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public async handleCallback(): Promise<boolean> {
    await this.configurePromise;

    try {
      await this.oauthService.tryLoginCodeFlow();

      this.isLoggedIn.set(this.oauthService.hasValidAccessToken());

      return this.oauthService.hasValidAccessToken();
    } catch (err) {
      console.error('❌ Callback error:', err);
      this.isLoggedIn.set(false);
      return false;
    }
  }
}
