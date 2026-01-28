import cron from "node-cron";
import { User } from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: fifteenMinutesAgo },
      });

      console.log(
        `Cron Job: Removed ${result.deletedCount} unverified accounts`
      );
    } catch (error) {
      console.error("Cron Job Error:", error.message);
    }
  });
};
