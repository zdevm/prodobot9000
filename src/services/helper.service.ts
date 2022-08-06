export class HelperService {

  /**
   * Return object's identifier
   * @param object Object has id or _id property
   * @returns 
   */
  static id(object?: any): string | undefined {
    if (!object) {
      return undefined;
    }
    return (object._id || object.id || object)?.toString() || object;
  }

  /**
   * Checks if specified value is falsy or non-object type or empty object
   * @param obj 
   * @returns 
   */
  static isEmptyObject(obj?: object) {
    return !obj || (typeof obj !== 'object') || !Object.keys(obj).length
  }

  /**
   * Put @val in array.
   * @returns If val is array or falsy, return val - else [val] 
  */
  static toArray<T>(val: any): T[] | undefined {
    if (!val || Array.isArray(val)) {
      return val;
    }
    return [val];
  }

}