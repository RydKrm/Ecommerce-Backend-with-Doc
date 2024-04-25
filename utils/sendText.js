const axios = require("axios");

const sendText = async function (phoneNumber, message) {
  // send message
  const fields = {
    user_name: "GIC-BD",
    password: "GlObAl!!@896",
    sent_from: "8809617600162",
    sent_to: phoneNumber,
    text: message,
  };

  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const smsSend = await axios.post(
      "https://gicclients.com/sms/send-purple-sms",
      { ...fields },
      { headers: headers },
    );
    // console.log({ smsSend });
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendText;
