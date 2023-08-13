export class UsersDTO {
  constructor(user) {
    this.name = user.firstName;
    this.last_name = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.cartID = user.cartID;
  }
}