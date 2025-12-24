// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      language: string;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

// Allow JSON imports
declare module "*.json" {
  const value: any;
  export default value;
}

export {};
