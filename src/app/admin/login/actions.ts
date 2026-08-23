"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

/**
 * Server action sign-in. NextAuth v5's client-side `signIn()` helper proved
 * unreliable here (it resolved without ever issuing the callback request), so
 * the credential exchange runs on the server where it is also less brittle.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || "/admin",
    });
    return {};
  } catch (error) {
    // signIn throws a NEXT_REDIRECT on success — that must propagate.
    if (error instanceof AuthError) {
      return { error: "Those credentials weren't recognised." };
    }
    throw error;
  }
}
