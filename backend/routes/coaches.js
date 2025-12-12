const express = require('express');
const router = express.Router();
const {
    getAllCoaches,
    getCoachById,
    createCoach,
    updateCoach,
    deleteCoach
} = require('../controllers/coachController');

// Public routes
router.get('/', getAllCoaches);
router.get('/:id', getCoachById);

// Admin routes
router.post('/', createCoach);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);

module.exports = router;
