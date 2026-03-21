const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        required: [true, 'Please provide a job role'],
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium',
    },
    questions: [
        {
            question: String,
            answer: String,
            userAnswer: String,
            feedback: {
                score: Number,
                strengths: String,
                improvements: String,
                sampleAnswer: String,
            },
        },
    ],
    totalScore: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed'],
        default: 'In Progress',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Interview', interviewSchema);
