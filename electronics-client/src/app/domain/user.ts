export interface User {
  _id?: string,
  username: string;
  password?: string;
  role: UserRole
}

export enum UserRole {
  Guest = "GUEST",
  User = "USER",
  Admin = "ADMIN",
}
