<template>
    <div class="quiz-test-container">
        <div class="content-wrapper" v-if="quiz">
            <div class="quiz-header">
                <h1>{{ quiz.title }}</h1>
                <div class="quiz-meta">
                    <div class="progress-indicator">
                        <span class="question-counter">Question {{ currentQuestion + 1 }}/{{ quiz.questions.length }}</span>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: `${(currentQuestion + 1) / quiz.questions.length * 100}%` }"></div>
                        </div>
                    </div>
                    <div class="score-display">
                        <i class="bi bi-star-fill"></i>
                        <span>{{ score }}/{{ quiz.questions.length }}</span>
                    </div>
                </div>
            </div>

            <div v-if="currentQuestion !== null" class="quiz-content">
                <div class="question-card">
                    <p class="question-text">{{ quiz.questions[currentQuestion].question }}</p>
                    <div class="options-grid">
                        <button v-for="(option, index) in quiz.questions[currentQuestion].options" 
                                :key="index"
                                @click="checkAnswer(index)" 
                                class="option-button"
                                :class="{ 'hover-effect': true }">
                            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                            <span class="option-text">{{ option }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="quiz-completed">
                <div class="result-card">
                    <div class="score-circle">
                        <svg viewBox="0 0 36 36" class="circular-chart">
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eee"
                                stroke-width="3" />
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                :stroke="getScoreColor(score / quiz.questions.length * 100)"
                                stroke-width="3"
                                :stroke-dasharray="`${score / quiz.questions.length * 100}, 100`" />
                            <text x="18" y="20.35" class="percentage">{{ Math.round(score / quiz.questions.length * 100) }}%</text>
                        </svg>
                    </div>
                    <h2>{{ getScoreMessage() }}</h2>
                    <div class="quiz-actions">
                        <button @click="saveAttempt" class="save-attempt-btn">
                            <i class="bi bi-save"></i>
                            Save Result
                        </button>
                        <router-link to="/quizzes" class="back-to-quizzes-btn">
                            <i class="bi bi-arrow-left"></i>
                            Back to Quizzes
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

export default {
    setup() {
        const quiz = ref(null);
        const currentQuestion = ref(0);
        const score = ref(0);
        const loading = ref(true);
        const error = ref(null);
        const router = useRouter();

        const fetchQuiz = async () => {
            const quizId = router.currentRoute.value.params.id;
            loading.value = true;
            try {
                const response = await api.get(`/quizzes/${quizId}`);
                quiz.value = response.data;
                if (!quiz.value || !quiz.value.questions || !quiz.value.questions.length) {
                    throw new Error('Invalid quiz data');
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
                error.value = "Failed to load quiz";
                router.push('/quizzes');
            } finally {
                loading.value = false;
            }
        };

        const getScoreColor = (percentage) => {
            if (percentage >= 80) return '#00AA48'; // Green
            if (percentage >= 60) return '#F59E0B'; // Yellow
            return '#EF4444'; // Red
        };

        const getScoreMessage = () => {
            if (!quiz.value) return '';
            const percentage = (score.value / quiz.value.questions.length) * 100;
            if (percentage === 100) return "Perfect Score! Excellent Job!";
            if (percentage >= 80) return "Great Performance!";
            if (percentage >= 60) return "Good Job! Keep Improving!";
            if (percentage >= 40) return "Not Bad, But You Can Do Better!";
            return "Need More Practice!";
        };

        onMounted(() => {
            fetchQuiz();
        });

        const checkAnswer = (selectedOptionIndex) => {
            if (!quiz.value || currentQuestion.value === null) return;
            
            const correctAnswerIndex = quiz.value.questions[currentQuestion.value].correctAnswer;
            if (selectedOptionIndex === correctAnswerIndex) {
                score.value++;
            }
            
            if (currentQuestion.value < quiz.value.questions.length - 1) {
                currentQuestion.value++;
            } else {
                currentQuestion.value = null; // End of quiz
            }
        };

        const saveAttempt = async () => {
            if (!quiz.value) return;
            
            const scorePercentage = (score.value / quiz.value.questions.length) * 100;
            try {
                await api.post('/users/attempts', {
                    quizId: quiz.value._id,
                    score: scorePercentage
                });
                
                router.push('/dashboard');
            } catch (error) {
                if (error.response?.status === 401) {
                    router.push('/login');
                }
                console.error("Error saving attempt:", error);
            }
        };

        return {
            quiz,
            currentQuestion,
            score,
            loading,
            error,
            checkAnswer,
            saveAttempt,
            getScoreColor,
            getScoreMessage
        };
    }
};
</script>

<style scoped>
.quiz-test-container {
    min-height: calc(100vh - 64px);
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    padding: 2rem;
}

.content-wrapper {
    max-width: 900px;
    margin: 0 auto;
}

.quiz-header {
    text-align: center;
    margin-bottom: 2rem;
}

.quiz-header h1 {
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 1.5rem;
}

.quiz-meta {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.progress-indicator {
    flex: 1;
    margin-right: 2rem;
}

.question-counter {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 500;
}

.progress-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: #3B82F6;
    transition: width 0.3s ease;
}

.score-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #00AA48;
    font-weight: 600;
    font-size: 1.1rem;
}

.question-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-top: 2rem;
}

.question-text {
    font-size: 1.25rem;
    color: #2d3748;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

.option-button {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.option-button.hover-effect:hover {
    border-color: #00AA48;
    transform: translateX(8px);
}

.option-letter {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7fafc;
    border-radius: 50%;
    margin-right: 1rem;
    color: #4a5568;
    font-weight: 600;
}

.option-text {
    flex: 1;
    color: #4a5568;
    font-size: 1rem;
}

.quiz-completed {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
}

.result-card {
    background: white;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    text-align: center;
    max-width: 500px;
    width: 100%;
}

.score-circle {
    width: 200px;
    margin: 0 auto 2rem;
}

.circular-chart {
    width: 100%;
    height: auto;
}

.circular-chart path {
    transition: stroke-dasharray 1s ease;
}

.percentage {
    fill: #2d3748;
    font-size: 0.5em;
    text-anchor: middle;
    font-weight: bold;
}

.quiz-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

.save-attempt-btn,
.back-to-quizzes-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.save-attempt-btn {
    background: #00AA48;
    color: white;
    border: none;
    cursor: pointer;
}

.back-to-quizzes-btn {
    background: #4a5568;
    color: white;
    text-decoration: none;
}

.save-attempt-btn:hover,
.back-to-quizzes-btn:hover {
    transform: translateY(-2px);
    filter: brightness(110%);
}

@media (max-width: 768px) {
    .quiz-test-container {
        padding: 1rem;
    }

    .quiz-meta {
        flex-direction: column;
        gap: 1rem;
    }

    .progress-indicator {
        margin-right: 0;
        width: 100%;
    }

    .options-grid {
        grid-template-columns: 1fr;
    }
}
</style>