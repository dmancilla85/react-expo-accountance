interface Repository<T> {
  add(item: T): Promise<void>;
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  update(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}

export default Repository;
