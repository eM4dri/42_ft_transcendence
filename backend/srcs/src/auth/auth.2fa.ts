import { Injectable } from "@nestjs/common";
import * as speakeasy from "speakeasy";

@Injectable()
export class TwoFA {
  static generateSecret(): string {
    const secret = speakeasy.generateSecret();
    return secret.base32;
  }

  generateOTP(secret: string): string {
    const otp = speakeasy.totp({
      secret: secret,
      encoding: "base64",
      label: 'Nombre de la aplicación',
      issuer: 'Nombre de la empresa',
    });
    return otp;
  }

  verifyOTP(secret: string, userEnteredOTP: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: "base64",
      token: userEnteredOTP,
    });
  }
}
