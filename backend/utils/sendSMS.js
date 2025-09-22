const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('SMS would be sent:', { to, message });
      return { success: false, message: 'SMS service not configured' };
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};

const sendEmergencySMS = async (to, patient, location) => {
  const message = `🚨 EMERGENCY ALERT
Patient: ${patient.fullName}
Location: ${location.address || `Lat: ${location.coordinates.latitude}, Lng: ${location.coordinates.longitude}`}
Emergency Contact: ${patient.emergencyContact?.phone}
Please respond immediately!`;

  return sendSMS(to, message);
};

module.exports = { sendSMS, sendEmergencySMS };