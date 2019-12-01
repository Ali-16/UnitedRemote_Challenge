export class Credentials {

  public email?: string; 
  public password?: string;
  public register_email?: string;
  public register_password?: string; 
  public register_password_confirmation?: string;

  constructor(
    type: string,
    email: string, 
    password: string,
    password_confirmation?: string
    ) {
      if (type==="signup"){
        this.register_email=email;
        this.register_password=password;
        this.register_password_confirmation=password_confirmation;
      }
      if(type === "signin"){
        this.email=email;
        this.password=password;

      }
    
  }
}
