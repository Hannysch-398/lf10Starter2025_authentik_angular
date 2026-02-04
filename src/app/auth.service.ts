import {computed, Injectable, signal} from '@angular/core';
import { AuthConfig, OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
type IdentityClaims = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  email?: string;
};
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

  readonly claims = signal<IdentityClaims | null>(null);
  readonly username = computed(() =>
    this.claims()?.preferred_username
    ?? this.claims()?.email
    ?? this.claims()?.name
    ?? null
  );

  constructor(private oauthService: OAuthService) {
    this.configurePromise = this.configure();

    this.oauthService.events.subscribe((_e: OAuthEvent) => {
      this.syncAuthState();
    });
  }

  private async configure() {
    this.oauthService.configure(this.authConfig);
    await this.oauthService.loadDiscoveryDocument();

    this.syncAuthState();
    this.oauthService.setupAutomaticSilentRefresh();
  }

  private syncAuthState() {
    const loggedIn = this.oauthService.hasValidAccessToken();
    this.isLoggedIn.set(loggedIn);

    const identity = this.oauthService.getIdentityClaims() as IdentityClaims | null;
    this.claims.set(identity);
  }

  ready(): Promise<void> {
    return this.configurePromise;
  }

  async tryRestoreLogin(): Promise<void> {
    await this.configurePromise;
    await this.oauthService.tryLoginCodeFlow();
    this.syncAuthState();
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
/* maybe !! */
  getAccessToken(): string {
    return this.oauthService.getAccessToken();
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
