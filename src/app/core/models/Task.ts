export type Task = {
  id: number;
  userId?: number;
  endDate?: string;
  projectId?: number;
  name: string;
  description: string;
  status: string;
}
