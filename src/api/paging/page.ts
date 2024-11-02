export interface Page<T> {
  current: number
  size: number
  total: number
  records: Array<T>
}
