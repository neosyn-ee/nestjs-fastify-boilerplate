/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginDto {
  /**
   * User email address
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * Full name of the user
   * @example "password-john"
   */
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface CreateUserDto {
  /**
   * User email address
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * Full name of the user
   * @example "John Doe"
   */
  name: string;
  /**
   * Password of the user
   * @example "password-john"
   */
  password: string;
}

export interface RefreshTokenDto {
  /**
   * User email address
   * @example "john.doe@example.com"
   */
  email: string;
}

export interface UpdateUserDto {
  /**
   * User email address
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * Full name of the user
   * @example "John Doe"
   */
  name?: string;
  /**
   * Password of the user
   * @example "password-john"
   */
  password?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => 'undefined' !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title TicketManagement-authorization
 * @version 1.0
 * @contact
 *
 * Handles user authentication, including login, registration, and token management. It generates JWT Access Tokens and Refresh Tokens, storing them securely in HTTP-only cookies. Supports token refresh and session management, ensuring secure access to the application.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Allows a user to log in by providing their credentials (email and password). Upon successful login, the user receives an access token that grants access to protected resources. This access token should be included in the Authorization header of subsequent requests to authenticate the user.
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @summary User login
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, void>({
        path: `/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows a user to sign in by providing their credentials (email and password). Upon successful authentication, the user receives an access token and a refresh token. The access token grants access to protected resources, while the refresh token can be used to obtain a new access token without re-authenticating.
     *
     * @tags Auth
     * @name AuthControllerSignIn
     * @summary User sign in
     * @request POST:/auth/signIn
     */
    authControllerSignIn: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, void>({
        path: `/auth/signIn`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows a user to use their refresh token to obtain a new access token. The refresh token must be valid and unexpired. This operation helps maintain user sessions without requiring reauthentication, improving the user experience for long-lived sessions.
     *
     * @tags Auth
     * @name AuthControllerRefresh
     * @summary User refresh token
     * @request POST:/auth/refresh
     */
    authControllerRefresh: (
      data: RefreshTokenDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/auth/refresh`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Checks if the user is authenticated using a JWT token. This endpoint requires an email as a query parameter to identify the user and verify their authentication status. Returns user details if authenticated; otherwise, throws a 401 Unauthorized error.
     *
     * @tags Auth
     * @name AuthControllerIsAuthenticated
     * @summary User is authenticated
     * @request GET:/auth/is_authenticated
     * @secure
     */
    authControllerIsAuthenticated: (
      query: {
        /**
         * User email to be verified
         * @example "john.doe@example.com"
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/auth/is_authenticated`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Allows a user to log out by invalidating their session. This operation clears the access and refresh tokens, ensuring the user can no longer access protected resources until they authenticate again. The tokens are removed from the client, preventing unauthorized use.
     *
     * @tags Auth
     * @name AuthControllerLogout
     * @summary User logout
     * @request POST:/auth/logout
     * @secure
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/logout`,
        method: 'POST',
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * @description This endpoint allows you to retrieve a user by their unique ID. It returns the user details if the ID is valid, or a 404 error if the user is not found.
     *
     * @tags User
     * @name UserControllerGetUser
     * @summary Retrieve a user by ID
     * @request GET:/user/{id}
     * @secure
     */
    userControllerGetUser: (id: string, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/user/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint allows you to update an existing user by providing their unique ID and the new data in the request body. If the user is not found, a 404 error will be returned.
     *
     * @tags User
     * @name UserControllerUpdateUser
     * @summary Update a user by ID
     * @request PUT:/user/{id}
     * @secure
     */
    userControllerUpdateUser: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/user/${id}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This endpoint allows you to delete a user by their unique ID. If the user is not found, a 404 error will be returned. Successful deletion returns a 204 status.
     *
     * @tags User
     * @name UserControllerDeleteUser
     * @summary Delete a user by ID
     * @request DELETE:/user/{id}
     * @secure
     */
    userControllerDeleteUser: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint returns a list of all users in the system. It is a simple GET request to retrieve all available user records.
     *
     * @tags User
     * @name UserControllerGetAllUsers
     * @summary Retrieve all users
     * @request GET:/user
     * @secure
     */
    userControllerGetAllUsers: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description This endpoint allows you to create a new user by providing the necessary details in the request body. A new user will be created with the provided data.
     *
     * @tags User
     * @name UserControllerCreateUser
     * @summary Create a new user
     * @request POST:/user
     * @secure
     */
    userControllerCreateUser: (
      data: CreateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/user`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  metrics = {
    /**
     * No description
     *
     * @tags Metrics
     * @name MetricsControllerGetMetrics
     * @request GET:/metrics
     */
    metricsControllerGetMetrics: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/metrics`,
        method: 'GET',
        ...params,
      }),
  };
}
