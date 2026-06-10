export type FilterType = 'all' | 'active' | 'completed';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: string; // ISO date string YYYY-MM-DD
};
