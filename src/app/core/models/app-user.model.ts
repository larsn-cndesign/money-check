/**
 * Class representing a user.
 */
export class AppUser {
  /**
   * The name of the user
   * @public
   * @default '' User has not been set.
   */
  name = '';

  /**
   * A boolean flag indicating if the user is an administrator
   * @public
   * @default false User is not an admin.
   */
  isAdmin = false;
}
