export interface IJwtServicePayload {
  sub: string;
  name: string;
  admin: boolean;
  iat: number;
  email: string;
}

export type IHasuraJwtClaim = {
  'https://hasura.io/jwt/claims': {
    'x-hasura-default-role': string; // The default role assigned to the user
    'x-hasura-allowed-roles': string[]; // Array of roles allowed for the user
    'x-hasura-user-id': string; // Unique user ID for access control
    'x-hasura-email': string; // The user's email (could be useful for filtering queries)
    'x-hasura-region': string; // Optional claim to define a region for filtering data (e.g., 'us-east-1')
    'x-hasura-permissions': string[]; // Optional array of specific permissions that the user has
    'x-hasura-role': string; // User's primary role (could be used as a fallback role)
    'x-hasura-expiry': string;
    'x-hasura-org-id': string;
  };
} & IJwtServicePayload;

export interface IJwtService {
  checkToken(token: string): Promise<any>;
  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
