import { UnauthorizedException } from "../utils/app-error";
import { calulateNextReportDate } from "../utils/helper";
import { firebaseAuth, db } from "../config/firebase.config";

export const syncUserService = async (token: string, body: any) => {
  const decodedToken = await firebaseAuth.verifyIdToken(token);
  if (!decodedToken || !decodedToken.uid) {
    throw new UnauthorizedException("Invalid Firebase token");
  }

  const { uid, email, name: tokenName, picture } = decodedToken;
  const { name = tokenName || "User" } = body;

  try {
    const userRef = db.collection("users").doc(uid);
    const reportSettingRef = db.collection("report_settings").doc(uid);

    const userDoc = await userRef.get();
    let user: any = null;
    let reportSetting: any = null;

    if (!userDoc.exists) {
      // Create new user if they don't exist
      const batch = db.batch();
      
      user = {
        firebaseUid: uid,
        email: email,
        name: name,
        profilePicture: picture || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      batch.set(userRef, user);

      reportSetting = {
        userId: uid,
        frequency: "MONTHLY", // Assuming ReportFrequencyEnum.MONTHLY corresponds to this
        isEnabled: true,
        nextReportDate: calulateNextReportDate(),
        lastSentDate: null,
      };
      batch.set(reportSettingRef, reportSetting);

      await batch.commit();
    } else {
      user = userDoc.data();
      const reportSettingDoc = await reportSettingRef.get();
      if (reportSettingDoc.exists) {
        reportSetting = reportSettingDoc.data();
      }
    }

    return { user, reportSetting };
  } catch (error) {
    throw error;
  }
};
