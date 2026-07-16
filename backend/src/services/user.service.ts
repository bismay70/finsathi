import { NotFoundException } from "../utils/app-error";
import { UpdateUserType } from "../validators/user.validator";
import { db } from "../config/firebase.config";

export const findByIdUserService = async (userId: string) => {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return null;
  return userDoc.data();
};

export const updateUserService = async (
  userId: string,
  body: UpdateUserType,
  profilePic?: Express.Multer.File
) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) throw new NotFoundException("User not found");

  const updateData: any = {};

  if (profilePic) {
    updateData.profilePicture = profilePic.path;
  }

  if (body.name) {
    updateData.name = body.name;
  }

  updateData.updatedAt = new Date();

  await userRef.update(updateData);

  const updatedDoc = await userRef.get();
  return updatedDoc.data();
};
