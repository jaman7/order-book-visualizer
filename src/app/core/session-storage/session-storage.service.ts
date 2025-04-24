export abstract class AbstractStorageService {
  abstract getItem(key: string): string | null;

  abstract setItem(key: string, value: string): void;

  abstract removeItem(key: string): void;

  abstract clear(): void;
}

export class SessionStorageService extends AbstractStorageService {
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
