export interface ImageProcessorOperations<T> {
  [value: string]: (instance: T) => (...args: string[]) => void;
}
