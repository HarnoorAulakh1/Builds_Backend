import messages from "../schema/messages.js";

export const getMessage = async (req, res) => {
  const { senderId, receiverId } = req.query;
  try {
    const response = await messages.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    res.send(response);
  } catch (err) {
    res.send("Error");
  }
};

export const getMessageLatest = async (req, res) => {
  const { senderId, receiverId } = req.query;
  try {
    const response = await messages
      .find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
      .sort({ createdAt: -1 });
      console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err.message);
    res.send("Error");
  }
};

export const sendMessage = async (req, res) => {
  const data = req.body;
  try {
    const response = await messages.create(data);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
};

export const deleteMessage = async (req, res) => {
  const data = req.body;
  try {
    const response = await messages.deleteOne({ _id: data.id });
    res.send(response);
  } catch (err) {
    res.send("Error");
  }
};
