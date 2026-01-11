const getDB = () => JSON.parse(localStorage.getItem("usersDB")) || [];

const saveDB = (db) => localStorage.setItem("usersDB", JSON.stringify(db));

export const handleGoogleAuth = (googleUser) => {
  const db = getDB();

  const existingUser = db.find((user) => user.email === googleUser.email);

  if (existingUser) {
    console.log("Login successful: User found in DB");
    return { status: "success", user: existingUser, isNew: false };
  } else {
    console.log("Register successful: Creating new user in DB");
    const newUser = {
      id: Date.now(),
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      provider: "google",
      joinedAt: new Date().toISOString(),
    };

    db.push(newUser);
    saveDB(db);

    return { status: "success", user: newUser, isNew: true };
  }
};
