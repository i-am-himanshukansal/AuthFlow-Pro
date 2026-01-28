import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
  console.log("TWILIO_SID:", process.env.TWILIO_SID);
  console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
  console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);
});
