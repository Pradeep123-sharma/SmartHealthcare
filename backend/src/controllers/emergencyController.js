const emergencyService = require('../services/emergencyService');

class EmergencyController {
  async triggerSOS(req, res, next) {
    try {
      const { userId, location } = req.body;
      const result = await emergencyService.triggerSOS(userId, location);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmergencyController();