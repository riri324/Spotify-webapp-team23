export class Message {
  constructor(
    public id: number, // Assuming an id is generated on the backend
    public subject: string,
    public content: string,
    public sent: Date,
    public seen?: boolean,
    public status?: MessageStatus,
    public sender?: User,
    public recipient?: User,
  ) {}
}

export enum MessageStatus {
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export class User {
  constructor(
    public login: string,
    public passwordHash?: string,
    public firstName?: string,
    public lastName?: string,
    public followers?: number,
  ) {}
}
