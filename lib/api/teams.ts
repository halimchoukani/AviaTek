import { teams } from "../appwrite";

export const getTeamMembers = async () => {
  try {
    const response = await teams.listMemberships("6985f8b7003536f92be8");

    console.log(response.memberships);
  } catch (error) {
    console.log(error);
  }
};