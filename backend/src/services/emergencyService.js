class EmergencyService {
    async triggerSOS(userId, location) {
      // In a real application, this would trigger a notification to emergency services,
      // alert nearby hospitals, and notify emergency contacts.
      // For now, we'll just log the event and return a dummy response.
      console.log(`SOS triggered for user ${userId} at location:`, location);
      
      const dummyEmergencyId = `EMG-${Date.now()}`;
      const dummyInstructions = [
        'Stay calm and wait for emergency services.',
        'Do not move if you are injured.',
        'Provide clear details to the dispatcher if they call.'
      ];

      return {
        message: 'SOS signal sent successfully. Help is on the way.',
        emergency: {
          id: dummyEmergencyId,
          emergencyType: 'Medical Emergency', // Placeholder
          severity: 'critical', // Placeholder
          status: 'pending', // Placeholder
          createdAt: new Date().toISOString(),
        },
        instructions: dummyInstructions,
      };
    }
  }
  
  module.exports = new EmergencyService();