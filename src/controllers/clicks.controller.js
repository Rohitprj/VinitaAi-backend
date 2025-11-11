import { UserClicks } from "../models/clicks.model.js";

const trackClicks = async (req, res) => {
  const { userId, section } = req.body;
  try {
    let record = await UserClicks.findOne({ userId });

    if (!record) {
      record = await UserClicks.create({ userId, clicks: { [section]: 1 } });
    } else {
      record.clicks[section] = (record.clicks[section] || 0) + 1;
      await record.save();
    }

    res.status(200).json({ success: true, clicks: record.clicks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating click count" });
  }
};

export { trackClicks };
