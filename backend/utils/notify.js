import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

/**
 * Notification Utility
 * 
 * Centralized place for handling all in-app database notifications.
 * Stores alerts in MongoDB so users can view them in their dashboard.
 */

const notify = {
  // @desc Core helper to send a notification to a specific user
  sendToUser: async (userId, title, message, type = "system", relatedId = null) => {
    try {
      await Notification.create({ userId, title, message, type, relatedId });
    } catch (err) {
      console.error("Failed to create in-app notification:", err);
    }
  },

  // @desc Core helper to broadcast a notification to ALL admins
  sendToAdmins: async (title, message, type = "system", relatedId = null) => {
    try {
      // Find all admins
      const admins = await User.find({ role: "admin" }).select("_id");
      const notifications = admins.map((admin) => ({
        userId: admin._id,
        title,
        message,
        type,
        relatedId,
      }));
      
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (err) {
      console.error("Failed to notify admins:", err);
    }
  },

  // --- Domain Specific Notification Triggers ---

  // Called when a rental request changes status
  rentalStatusChanged: async (tenantId, ownerId, propertyAddress, status) => {
    // Notify tenant that their request status changed
    await notify.sendToUser(
      tenantId, 
      "Rental Request Update", 
      `Your request for ${propertyAddress} has been ${status}.`, 
      "rental_request"
    );
  },

  // Called when a service request is updated or quoted
  serviceStatusChanged: async (requesterId, companyName, status, cost) => {
    let msg = `Your request with ${companyName} is now ${status}.`;
    if (cost) msg += ` Estimated cost: BDT ${cost}`;
    
    // Notify the user who requested the service
    await notify.sendToUser(
      requesterId,
      "Service Request Update",
      msg,
      "service_request"
    );
  },

  // Called when a property gets too many reports (e.g. >= 3)
  adminHighReportAlert: async (propertyId, reportCount) => {
    await notify.sendToAdmins(
      "High Report Alert",
      `Property has reached ${reportCount} reports! Immediate review required.`,
      "report",
      propertyId
    );
  }
};

export default notify;
