export class RegisterDto {
  name: string;
  email: string;
  password: string;
  role: string; // 'Company' | 'Developer'
  companyName?: string;
  title?: string;
  company?: string;
}
