import User from "./User";

export default interface SelectedStore {
  _id: string
  name: string
  employees: Array<User>
  managers: Array<User>
  _createdAt: Date
  _updatedAt: Date
}