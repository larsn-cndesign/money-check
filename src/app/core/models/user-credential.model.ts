/**
 * Interface representing credentials for a user.
 */
export interface UserCredential {
  /**
   * The email of the user
   * @public
   */
  email: string;

  /**
   * The password of the user
   * @public
   */
  password: string;
}
