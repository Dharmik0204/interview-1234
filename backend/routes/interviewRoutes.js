const express = require('express');
const {
    generateQuestions,
    evaluateAnswer,
    finishInterview,
    getInterviews,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/generate', generateQuestions);
router.post('/evaluate', evaluateAnswer);
router.put('/:id/finish', finishInterview);
router.get('/', getInterviews);

module.exports = router;
