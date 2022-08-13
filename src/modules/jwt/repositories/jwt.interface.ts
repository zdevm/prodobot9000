export interface JwtRepository {

  /**
   * Store object into repository.
   * @param data
   * @returns unique key (or id) which can be used later for retrieving or deleting etc..
   */
  store(data: any, key?: string): Promise<string>;

  /**
   * Retrieve
   * @param key Returned from 'store' method
   */
  retrieve<T>(key: string): Promise<T | null>;

  /**
   * Delete specified object from repository.
   * @param key Returned from 'store' method
   * @returns Deleted data
   */
  delete(key: string): Promise<any>;

}
