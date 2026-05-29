import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface QueryClient {
    invalidateQueries(queryKey: readonly unknown[]): Promise<void>;
    invalidateQueries(queryKey: readonly unknown[][]): Promise<void>;
  }
}
