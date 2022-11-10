export interface User {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  email: string;
  name: string;
  password?: string;
  nickname?: string | null;
}
