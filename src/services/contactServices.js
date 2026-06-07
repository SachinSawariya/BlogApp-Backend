
const saveContactFormMsgToDB = async (req) => {
  try {
    const { Contact } = global.connections.models;
    const { name, email,subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await contact.save();

    return {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    };
  } catch (error) {
    console.error("Error saving contact form message to database:", error);
    throw error;
  }
};

const getAllMsg = async () => {
  try {
    const { Contact } = global.connections.models;
    const contactMsgs = await Contact.find();
    return contactMsgs;
  } catch (error) {
    console.error("Error fetching all contact form messages:", error);
    throw error;
  }
};


module.exports = {
  saveContactFormMsgToDB,
  getAllMsg,
};
