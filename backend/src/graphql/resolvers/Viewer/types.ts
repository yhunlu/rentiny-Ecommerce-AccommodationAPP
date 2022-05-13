export interface LogInArgs {
  login: { code: string } | null;
}

export interface ConnectStripeArgs {
  input: { code: string };
}
