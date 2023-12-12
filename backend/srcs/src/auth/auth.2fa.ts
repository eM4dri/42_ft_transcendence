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
      label: 'Application name',
      issuer: 'Company name',
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
