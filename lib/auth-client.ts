import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"; // Deze import is cruciaal!

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    organizationClient(), // Voeg dit hier toe!
  ],
});

// Export de functies die je in je componenten gebruikt
export const { signUp, signIn, signOut, useSession, organization } = authClient;
