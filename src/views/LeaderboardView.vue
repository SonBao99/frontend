<template>
    <div class="leaderboard-container">
        <div class="content-wrapper">
            <div class="leaderboard-header">
                <h1>Quiz Leaderboards</h1>
                <div class="filter-section">
                    <div class="select-group">
                        <i class="bi bi-filter"></i>
                        <select v-model="selectedQuiz" class="quiz-select">
                            <option value="">All Quizzes</option>
                            <option v-for="quiz in quizzes" :key="quiz._id" :value="quiz._id">
                                {{ quiz.title }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>Loading leaderboard...</p>
            </div>

            <div v-else-if="error" class="error-state">
                <i class="bi bi-exclamation-circle"></i>
                <p>{{ error }}</p>
            </div>

            <div v-else class="leaderboard-grid">
                <div v-for="quiz in filteredQuizzes" :key="quiz._id" class="leaderboard-card">
                    <div class="card-header">
                        <h2>{{ quiz.title }}</h2>
                        <span class="category-badge">{{ quiz.category }}</span>
                    </div>

                    <div class="top-performers">
                        <div v-for="(attempt, index) in getTopAttempts(quiz)" :key="index" class="performer-row"
                            :class="{ 'gold': index === 0, 'silver': index === 1, 'bronze': index === 2 }">
                            <div class="rank">{{ index + 1 }}</div>
                            <div class="user-info">
                                <span class="username">{{ attempt.username }}</span>
                                <span class="score">{{ Math.round(attempt.score).toFixed(0) }}%</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="!quiz.attempts?.length" class="no-attempts">
                        <i class="bi bi-trophy"></i>
                        <p>Be the first to complete this quiz!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import api from '@/services/api';

export default {
    name: 'LeaderboardView',
    data() {
        return {
            quizzes: [],
            selectedQuiz: '',
            loading: true,
            error: null
        };
    },
    computed: {
        filteredQuizzes() {
            return this.selectedQuiz
                ? this.quizzes.filter(quiz => quiz._id === this.selectedQuiz)
                : this.quizzes;
        }
    },
    methods: {
        async fetchLeaderboards() {
            try {
                const response = await api.get('/leaderboard');
                this.quizzes = response.data;
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                this.error = 'Failed to load leaderboard data';
            } finally {
                this.loading = false;
            }
        },
        getTopAttempts(quiz) {
            return quiz.attempts
                ?.sort((a, b) => b.score - a.score)
                .slice(0, 5) || [];
        }
    },
    mounted() {
        this.fetchLeaderboards();
    }
};
</script>

<style scoped>
.leaderboard-container {
    min-height: calc(100vh - 64px);
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    padding: 2rem;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.leaderboard-header {
    margin-bottom: 2rem;
}

.leaderboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.leaderboard-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.category-badge {
    background: #e9ecef;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
    color: #495057;
}

.performer-row {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    background: #f8f9fa;
}

.gold {
    background: linear-gradient(to right, #ffd700, #fff8e7);
}

.silver {
    background: linear-gradient(to right, #c0c0c0, #f5f5f5);
}

.bronze {
    background: linear-gradient(to right, #cd7f32, #faf0e6);
}

.rank {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #3B82F6;
    color: white;
    font-weight: bold;
    margin-right: 1rem;
}

.user-info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.no-attempts {
    text-align: center;
    padding: 2rem;
    color: #718096;
}

.no-attempts i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #3B82F6;
}
</style>