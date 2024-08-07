export class UpdateNewsDto {
  readonly title?: string;
  readonly url?: string;
  readonly author?: string;
  readonly createdAt?: Date;
  readonly deleted?: boolean;
}
