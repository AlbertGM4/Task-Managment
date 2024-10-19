// models/user.ts

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface UserListProps {
  users?: User[];
}