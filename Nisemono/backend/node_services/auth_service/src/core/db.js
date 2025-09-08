const mockUsers = [
  {
    id: "1",
    email: "prachiiyadav2409@gmail.com",
    username: "superadmin",
    passwordHash:
      "$2b$10$8NQiMM78eB6cvgBfy/t8we4NFsxVc6zof/Ao2dM1WroEVxUbDI7lG", // bcrypt hash for "password123"
    role: "Super Admin",
    requiresOtp: true,
  },
  {
    id: "2",
    email: "pprachhiii@gmail.com",
    username: "auditor1",
    passwordHash:
      "$2b$10$PdIXwQH2VIpDqAYDB5m63.bAlA/e7GJZhZERJJcUZ/SND.ZEbpk4e", // bcrypt hash for "auditorPass"
    role: "Auditor",
    requiresOtp: false,
  },
];

async function getUserFromDB(identifier) {
  if (!identifier) return null;

  const user = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === identifier.toLowerCase() ||
      u.username.toLowerCase() === identifier.toLowerCase()
  );

  return user || null;
}

async function addUserToDB(user) {
  user.id = String(mockUsers.length + 1);
  mockUsers.push(user);
  return user;
}

module.exports = { getUserFromDB, addUserToDB };
