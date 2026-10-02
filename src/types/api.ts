export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create?(data: Partial<T>): Promise<T>;
  update?(id: string, data: Partial<T>): Promise<T>;
  delete?(id: string): Promise<boolean>;
}
