export interface User {
  id: number;
  name: string;
  email: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
];

export class UserService {
  private users: User[] = sampleUsers;

  getUsers() {
    return this.users;
  }

  createUser(user: User) {
    this.users.push(user);
    return user;
  }

  updateUser(id: number, user: User) {
    this.users = this.users.map((u) => (u.id === id ? user : u));
    return user;
  }

  deleteUser(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
    return this.users;
  }
}
