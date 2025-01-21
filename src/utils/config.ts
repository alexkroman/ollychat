export function requireEnv(name: keyof NodeJS.ProcessEnv): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Environment variable ${name} is required but not defined.`);
    }
    return value;
  }