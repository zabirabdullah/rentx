import Notification from "../models/notificationModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private (Any logged-in user)
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Security check: ensure the user owns this notification
  if (notification.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to modify this notification");
  }

  notification.isRead = true;
  await notification.save();
  res.json(notification);
});

// @desc    Mark all my notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );
  res.json({ message: "All notifications marked as read" });
});

export { getMyNotifications, markAsRead, markAllAsRead };
