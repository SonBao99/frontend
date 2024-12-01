<template>
    <div class="quiz-creation-container">
        <div class="content-wrapper">
            <div class="quiz-header">
                <h1 class="section-title">Create New Quiz</h1>
            </div>

            <form @submit.prevent="createQuiz" class="quiz-form">
                <div class="form-section">
                    <div class="form-group">
                        <div class="input-header">
                            <i class="bi bi-pencil-square"></i>
                            <label>Quiz Title</label>
                        </div>
                        <input v-model="quizData.title" type="text" placeholder="Enter an engaging title for your quiz"
                            :class="{ 'error': validationErrors.title }" required>
                        <span v-if="validationErrors.title" class="error-message">
                            {{ validationErrors.title }}
                        </span>
                    </div>

                    <div class="form-group">
                        <div class="input-header">
                            <i class="bi bi-tag"></i>
                            <label>Category</label>
                        </div>
                        <select v-model="quizData.category" :class="{ 'error': validationErrors.category }" required>
                            <option value="">Select a category</option>
                            <option value="Programming">Programming</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="General">General Knowledge</option>
                        </select>
                        <span v-if="validationErrors.category" class="error-message">
                            {{ validationErrors.category }}
                        </span>
                    </div>

                    <div class="form-group">
                        <div class="input-header">
                            <i class="bi bi-card-text"></i>
                            <label>Description</label>
                        </div>
                        <textarea v-model="quizData.description" placeholder="Provide a brief description of your quiz"
                            :class="{ 'error': validationErrors.description }" rows="3" required></textarea>
                        <span v-if="validationErrors.description" class="error-message">
                            {{ validationErrors.description }}
                        </span>
                    </div>
                </div>

                <div class="questions-section">
                    <h2>Questions</h2>
                    <div v-for="(question, index) in quizData.questions" :key="index" class="question-card">
                        <div class="question-header">
                            <div class="question-number">
                                <span class="number">{{ index + 1 }}</span>
                                <h3>Question</h3>
                            </div>
                            <button type="button" @click="removeQuestion(index)" class="remove-btn">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>

                        <div v-if="validationErrors.questions[index]" class="question-errors">
                            <p v-for="(error, errorIndex) in validationErrors.questions[index]" :key="errorIndex"
                                class="error-message">
                                {{ error }}
                            </p>
                        </div>

                        <div class="form-group question-input">
                            <input v-model="question.question" type="text" placeholder="Type your question here..."
                                required>
                        </div>

                        <div class="options-container">
                            <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-input">
                                <div class="option-letter">{{ String.fromCharCode(65 + optIndex) }}</div>
                                <input v-model="question.options[optIndex]" type="text"
                                    :placeholder="`Option ${optIndex + 1}`" required>
                                <label class="correct-answer">
                                    <input type="radio" :name="`correct-${index}`" :value="optIndex"
                                        v-model="question.correctAnswer" required>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="button" @click="addQuestion" class="add-question-btn">
                        <i class="bi bi-plus-lg"></i>
                        Add New Question
                    </button>
                </div>

                <div class="form-actions">
                    <button type="submit" class="save-quiz-btn">
                        <i class="bi bi-save"></i>
                        Create Quiz
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

import api from '@/services/api';

export default {
    name: 'QuizCreationView',
    data() {
        return {
            quizData: {
                title: '',
                category: '',
                description: '',
                questions: [this.createEmptyQuestion()]
            },
            validationErrors: {
                title: '',
                category: '',
                description: '',
                questions: []
            }
        };
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.userLoggedIn;
        }
    },
    mounted() {
        if (!this.isLoggedIn) {
            this.$router.push('/login');
            this.$toast.error('Please log in to create a quiz', {
                position: 'bottom-left',
                duration: 2000
            });
        }
    },
    methods: {
        createEmptyQuestion() {
            return {
                question: '',
                options: ['', '', '', ''],
                correctAnswer: null
            };
        },
        addQuestion() {
            this.quizData.questions.push(this.createEmptyQuestion());
        },
        removeQuestion(index) {
            if (this.quizData.questions.length > 1) {
                this.quizData.questions.splice(index, 1);
            }
        },
        validateForm() {
            let isValid = true;
            this.validationErrors = {
                title: '',
                category: '',
                description: '',
                questions: []
            };

            // Validate basic fields
            if (!this.quizData.title) {
                this.validationErrors.title = 'Please enter a quiz title';
                isValid = false;
            }
            if (!this.quizData.category) {
                this.validationErrors.category = 'Please select a category';
                isValid = false;
            }
            if (!this.quizData.description) {
                this.validationErrors.description = 'Please enter a description';
                isValid = false;
            }

            // Validate questions
            this.quizData.questions.forEach((q, index) => {
                const questionErrors = [];
                if (!q.question) {
                    questionErrors.push('Question text is required');
                }
                if (!q.options.every(opt => opt)) {
                    questionErrors.push('All options must be filled out');
                }
                if (q.correctAnswer === null) {
                    questionErrors.push('Please select the correct answer');
                }
                if (questionErrors.length > 0) {
                    this.validationErrors.questions[index] = questionErrors;
                    isValid = false;
                }
            });

            return isValid;
        },
        async createQuiz() {
            if (!this.validateForm()) {
                this.$toast.error('Please fill in all required fields', {
                    position: 'bottom-left',
                    duration: 3000
                });
                return;
            }

            try {
                await api.post('/quizzes/create', this.quizData);
                this.$toast.success('Quiz created successfully!', {
                    position: 'bottom-left',
                    duration: 2000
                });
                this.$router.push('/quizzes');
            } catch (error) {
                if (error.response?.status === 401) {
                    this.$router.push('/login');
                    this.$toast.error('Please log in to create a quiz', {
                        position: 'bottom-left',
                        duration: 2000
                    });
                } else {
                    this.$toast.error(error.response?.data?.message || 'Failed to create quiz', {
                        position: 'bottom-left',
                        duration: 2000
                    });
                }
            }
        }
    }
};
</script>


<style scoped>
.quiz-creation-container {
    min-height: calc(100vh - 64px);
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    padding: 2rem;
}

.content-wrapper {
    max-width: 800px;
    margin: 0 auto;
}

.quiz-header {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.section-title::before {
    content: '';
    width: 4px;
    height: 24px;
    background: #3B82F6;
    border-radius: 2px;
    display: inline-block;
}

.form-section {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 2rem;
}

.form-group:last-child {
    margin-bottom: 0;
}

.input-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.input-header i {
    color: #3B82F6;
    font-size: 1.2rem;
}

.input-header label {
    color: #2d3748;
    font-weight: 600;
    font-size: 1.1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    background: #f8fafc;
    color: #2d3748;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    background: #fff;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
}

.form-group select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%234a5568' viewBox='0 0 16 16'%3E%3Cpath d='M8 10.5l-4-4h8l-4 4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #a0aec0;
}

.question-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.question-card:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.question-number {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.question-number .number {
    background: #3B82F6;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.question-number h3 {
    color: #2d3748;
    font-weight: 600;
    font-size: 1.2rem;
}

.question-input input {
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    width: 100%;
    transition: all 0.3s ease;
}

.question-input input:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.options-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1.5rem;
}

.option-input {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.option-input:hover {
    background: #f1f5f9;
}

.option-letter {
    background: #e2e8f0;
    color: #4a5568;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
}

.option-input input[type="text"] {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0.5rem;
    font-size: 1rem;
}

.option-input input[type="text"]:focus {
    outline: none;
}

.correct-answer {
    position: relative;
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.correct-answer input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: #fff;
    border: 2px solid #e2e8f0;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.correct-answer:hover .checkmark {
    border-color: #3B82F6;
}

.correct-answer input:checked~.checkmark {
    background-color: #3B82F6;
    border-color: #3B82F6;
}

.checkmark:after {
    content: '';
    position: absolute;
    display: none;
}

.correct-answer input:checked~.checkmark:after {
    display: block;
    left: 8px;
    top: 4px;
    width: 4px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

@media (max-width: 768px) {
    .options-container {
        grid-template-columns: 1fr;
    }

    .question-card {
        padding: 1.5rem;
    }

    .form-section {
        padding: 1.5rem;
    }

    .section-title {
        font-size: 1.75rem;
    }

    .input-header label {
        font-size: 1rem;
    }
}

.remove-btn {
    background: #FED7D7;
    color: #822727;
    border: none;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.remove-btn:hover {
    background: #FEB2B2;
    transform: scale(1.05);
}

.options-grid {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
}

.option-input {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.add-question-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: white;
    color: #3B82F6;
    padding: 1rem 2rem;
    border: 2px dashed #3B82F6;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin: 2rem auto;
    transition: all 0.3s ease;
    width: fit-content;
}

.add-question-btn:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}

.add-question-btn i {
    font-size: 1.2rem;
}

.form-actions {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.save-quiz-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: #3B82F6;
    color: white;
    padding: 1rem 3rem;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.save-quiz-btn:hover {
    background: #2563EB;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
}

.save-quiz-btn:disabled {
    background: #718096;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.save-quiz-btn i {
    font-size: 1.2rem;
}

/* Add this for better spacing between questions */
.questions-section {
    margin-top: 3rem;
}

.questions-section h2 {
    color: #2d3748;
    font-size: 1.75rem;
    margin-bottom: 2rem;
    font-weight: 600;
}

.error {
    border-color: #EF4444 !important;
}

.error-message {
    color: #EF4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: block;
}

.question-errors {
    background: #FEF2F2;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
}

.question-card.has-errors {
    border: 1px solid #EF4444;
}
</style>