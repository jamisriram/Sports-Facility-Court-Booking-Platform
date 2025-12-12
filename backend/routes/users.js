const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createOrFindUser
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createOrFindUser);

module.exports = router;
