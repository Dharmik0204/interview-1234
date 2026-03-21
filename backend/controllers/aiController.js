const OpenAI = require('openai');
const Interview = require('../models/Interview');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper to sanitize JSON from OpenAI
const sanitizeJSON = (text) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// Generate Questions
exports.generateQuestions = async (req, res, next) => {
    try {
        const { role, difficulty, count = 5 } = req.body;

        const prompt = `Generate ${count} realistic interview questions for a ${role} position with difficulty level: ${difficulty}. 
        Format the output as a JSON array of objects, each with 'question' and 'expectedAnswer' fields. 
        Only return the JSON array, no other text.`;

        let questions;
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            });

            const sanitized = sanitizeJSON(completion.choices[0].message.content);
            questions = JSON.parse(sanitized);
        } catch (aiErr) {
            console.error('AI Generation failed, using mock data:', aiErr.message);
            // Fallback mock questions for testing when quota is exceeded
            const mockPool = [
                { question: `What are the core responsibilities of a ${role}?`, expectedAnswer: "Discuss key tasks, tools, and technical skills required for the role." },
                { question: `Can you explain a challenging project you worked on as a ${role}?`, expectedAnswer: "Focus on problem-solving, your specific contribution, and the final outcome." },
                { question: "How do you stay updated with the latest trends in your field?", expectedAnswer: "Mention blogs, courses, community involvement, and hands-on experimentation." },
                { question: "Explain the difference between vertical and horizontal scaling.", expectedAnswer: "Vertical scaling means adding more power to an existing machine; horizontal scaling means adding more machines to the pool." },
                { question: "How do you handle conflict in a technical team?", expectedAnswer: "Emphasize communication, objective analysis of the problem, and striving for a consensus-based solution." },
                { question: "Walk me through your debugging process when you encounter a critical bug in production.", expectedAnswer: "Mention identifying the root cause, isolating the issue, writing failing tests, fixing, and deploying safely." },
                { question: "Describe a time you had to learn a new technology quickly to complete a task.", expectedAnswer: "Highlight adaptability, research strategies, consulting documentation, and applying the knowledge effectively." },
                { question: "What factors do you consider when choosing a database for a new project?", expectedAnswer: "Discuss relational vs non-relational, read/write patterns, scalability, schema flexibility, and transaction requirements." },
                { question: "How do you ensure your code is secure and resilient against common vulnerabilities?", expectedAnswer: "Mention input validation, avoiding SQL injection/XSS, using HTTPS, sanitizing data, and following OWASP guidelines." },
                { question: "Can you explain the concept of Continuous Integration and Continuous Deployment (CI/CD)?", expectedAnswer: "Explain automated testing, code integration, predictable deployments, and tools like GitHub Actions or Jenkins." },
                { question: `Describe a situation where you disagreed with a team member's architectural decision. How did you resolve it?`, expectedAnswer: "Focus on objective discussion, trade-off analysis, empathy, and coming to a consensus." },
                { question: "What is your approach to writing unit tests, and how do you determine what to test?", expectedAnswer: "Discuss code coverage, edge cases, happy paths, and the concept of testing behavior, not implementation details." },
                { question: "Explain the concept of rate limiting and why it is important for APIs.", expectedAnswer: "Mention preventing abuse, protecting resources, managing costs, and algorithms like token bucket or leaky bucket." },
                { question: "How do you optimize the performance of a web application?", expectedAnswer: "Discuss bundle size, caching strategies, lazy loading, database indexing, and CDN usage." },
                { question: "Describe the principles of RESTful API design.", expectedAnswer: "Mention statelessness, uniform interface, client-server architecture, standard HTTP methods, and appropriate status codes." }
            ];
            
            // Randomly select 'count' questions or return all if count exceeds pool size
            const shuffled = mockPool.sort(() => 0.5 - Math.random());
            questions = shuffled.slice(0, Math.min(count, mockPool.length));
        }

        // Create a new interview session
        const interview = await Interview.create({
            user: req.user.id,
            role,
            difficulty,
            questions: questions.map((q) => ({
                question: q.question,
                answer: q.expectedAnswer || q.answer,
            })),
        });

        res.status(201).json({
            success: true,
            data: interview,
        });
    } catch (err) {
        next(err);
    }
};

// Evaluate Answer
exports.evaluateAnswer = async (req, res, next) => {
    try {
        const { interviewId, questionId, userAnswer } = req.body;

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const questionObj = interview.questions.id(questionId);
        if (!questionObj) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const prompt = `Evaluate this interview answer:
        Question: ${questionObj.question}
        Expected Answer: ${questionObj.answer}
        User Answer: ${userAnswer}
        
        Provide a JSON response with:
        score: number (0-10),
        strengths: string,
        improvements: string,
        sampleAnswer: string
        
        Only return the JSON object, no other text.`;

        let feedback;
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            });

            const sanitizedFeedback = sanitizeJSON(completion.choices[0].message.content);
            feedback = JSON.parse(sanitizedFeedback);
        } catch (aiErr) {
            console.error('AI Evaluation failed, using mock feedback:', aiErr.message);
            feedback = {
                score: 8,
                strengths: "Your answer covers the fundamental concepts well and shows practical understanding.",
                improvements: "Try to include more specific technical examples or industry-standard best practices to strengthen your response.",
                sampleAnswer: "A complete answer would include a high-level overview followed by specific implementation details and trade-offs."
            };
        }

        // Update question with user answer and feedback
        questionObj.userAnswer = userAnswer;
        questionObj.feedback = feedback;

        await interview.save();

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (err) {
        next(err);
    }
};

// Finish Interview
exports.finishInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        interview.status = 'Completed';
        
        // Calculate total score
        const totalScore = interview.questions.reduce((acc, curr) => acc + (curr.feedback?.score || 0), 0);
        interview.totalScore = totalScore / interview.questions.length;

        await interview.save();

        res.status(200).json({
            success: true,
            data: interview,
        });
    } catch (err) {
        next(err);
    }
};

// Get User Interviews
exports.getInterviews = async (req, res, next) => {
    try {
        const interviews = await Interview.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews,
        });
    } catch (err) {
        next(err);
    }
};
