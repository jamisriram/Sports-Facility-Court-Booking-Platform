const express = require('express');
const router = express.Router();
const {
    getAllCourts,
    getCourtById,
    createCourt,
    updateCourt,
    deleteCourt
} = require('../controllers/courtController');

// Public routes
router.get('/', getAllCourts);
router.get('/:id', getCourtById);

// Admin routes
router.post('/', createCourt);
router.put('/:id', updateCourt);
router.delete('/:id', deleteCourt);

module.exports = router;
