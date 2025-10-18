import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class TokenUtil {
  /**
   * Generate Access Token
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "nextjs-starterkit",
      audience: "nextjs-app",
    });
  }

  /**
   * Generate Refresh Token
   */
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: "nextjs-starterkit",
      audience: "nextjs-app",
    });
  }

  /**
   * Verify Access Token
   */
  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: "nextjs-starterkit",
        audience: "nextjs-app",
      }) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify Refresh Token
   */
  static verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: "nextjs-starterkit",
        audience: "nextjs-app",
      }) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode token tanpa verify
   */
  static decode(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get token expiration date
   */
  static getExpirationDate(expiresIn: string): Date {
    const ms = this.parseExpiresIn(expiresIn);
    return new Date(Date.now() + ms);
  }

  private static parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    const units: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (units[unit] || 0);
  }
}