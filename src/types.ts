export interface Task {
  _id: string;
  taskName: string;
  status: boolean;
  createdAt: Date;
}

export type TaskFilter = 'all' | 'active' | 'completed';