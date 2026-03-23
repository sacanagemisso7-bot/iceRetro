declare module "next" {
  export interface Metadata {
    title?: unknown;
    description?: string;
    [key: string]: unknown;
  }

  export interface NextConfig {
    typedRoutes?: boolean;
    experimental?: Record<string, unknown>;
    [key: string]: unknown;
  }
}

declare module "next/link" {
  import type { AnchorHTMLAttributes, ReactNode } from "react";

  type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  };

  export default function Link(props: LinkProps): JSX.Element;
}

declare module "next/navigation" {
  export function redirect(path: string): never;
}

declare module "next/cache" {
  export function revalidatePath(path: string, type?: string): void;
}

declare module "next/headers" {
  export type CookieValue = {
    value: string;
  };

  export type CookieStore = {
    get(name: string): CookieValue | undefined;
    set(
      name: string,
      value: string,
      options?: {
        httpOnly?: boolean;
        sameSite?: "strict" | "lax" | "none";
        secure?: boolean;
        path?: string;
        maxAge?: number;
      }
    ): void;
    delete(name: string): void;
  };

  export function cookies(): Promise<CookieStore>;
}

declare module "next/font/google" {
  export type FontLoaderResult = {
    className: string;
    variable: string;
    style: {
      fontFamily: string;
    };
  };

  export function Bungee(config: Record<string, unknown>): FontLoaderResult;
  export function Manrope(config: Record<string, unknown>): FontLoaderResult;
  export function Outfit(config: Record<string, unknown>): FontLoaderResult;
}

declare module "next/server" {
  export class NextResponse<Body = unknown> extends Response {
    static json<Body = unknown>(body: Body, init?: ResponseInit): NextResponse<Body>;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
  }
}
