import { central, db1, db2, db3, vault } from "./databases.js";

function getUserData(id) {
  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3
  };
}

export async function getUserInfo(id) {
  try {
    // Get the database name from central database
    const dbName = await central(id);

    // Based on dbName, fetch user data from the respective database
    let userData;
    switch (dbName) {
      case 'db1':
        userData = await db1(id);
        break;
      case 'db2':
        userData = await db2(id);
        break;
      case 'db3':
        userData = await db3(id);
        break;
      default:
        throw new Error(`Unknown database returned from central for user ${id}`);
    }

    // Fetch additional personal data from vault
    const personalData = await vault(id);

    // Combine all data into a single object
    const userInfo = {
      id: id,
      name: personalData.name,
      username: userData.username,
      email: personalData.email,
      address: personalData.address,
      phone: personalData.phone,
      website: userData.website,
      company: userData.company
    };

    return userInfo;
  } catch (error) {
    throw new Error(`Failed to retrieve user information for user ${id}: ${error.message}`);
  }
}