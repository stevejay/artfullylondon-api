import { ManagementClient } from "auth0";

export async function deleteUser(id) {
  if (!process.env.IS_OFFLINE) {
    const management = new ManagementClient({
      token: process.env.AUTH0_MANAGEMENT_API_TOKEN,
      domain: process.env.AUTH0_MANAGEMENT_API_DOMAIN
    });

    await management.users.delete({ id });
  }
}
