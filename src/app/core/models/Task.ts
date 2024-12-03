export type Task = {
  id: number;
  userId?: number;
  projectId?: number;
  name: string;
  description: string;
  status: string;
}
