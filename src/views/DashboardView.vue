<template>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1>Welcome back, {{ user?.username }}!</h1>
            <p class="subtitle">Here's your learning progress</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="bi bi-journal-check"></i>
                </div>
                <div class="stat-content">
                    <h3>Total Quizzes Taken</h3>
                    <p class="stat-value">{{ stats.totalQuizzes || 0 }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="bi bi-graph-up"></i>
                </div>
                <div class="stat-content">
                    <h3>Average Score</h3>
                    <p class="stat-value">{{ stats.averageScore?.toFixed(1) || 0 }}%</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="bi bi-trophy"></i>
                </div>
                <div class="stat-content">
                    <h3>Best Score</h3>
                    <p class="stat-value">{{ stats.bestScore || 0 }}%</p>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="dashboard-card recent-activity">
                <div class="card-header">
                    <h2><i class="bi bi-clock-history"></i> Recent Activity</h2>
                </div>
                <div v-if="recentAttempts.length" class="activity-list">
                    <div v-for="attempt in recentAttempts" :key="attempt._id" class="activity-item">
                        <div class="quiz-info">
                            <h4>{{ attempt.quizTitle }}</h4>
                            <span class="timestamp">{{ formatDate(attempt.date) }}</span>
                        </div>
                        <div class="score-actions">
                            <div class="score-badge" :class="getScoreClass(attempt.score)">
                                {{ Math.round(attempt.score) }}%
                            </div>
                            <button @click="retakeQuiz(attempt.quizId)" class="refresh-btn" title="Re-take Quiz">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <i class="bi bi-clipboard-x"></i>
                    <p>No recent quiz attempts</p>
                    <router-link to="/quizzes" class="start-quiz-btn">
                        Start a Quiz
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'DashboardView',
    setup() {
        const user = ref(null);
        const stats = ref({});
        const recentAttempts = ref([]);
        const router = useRouter();

        const fetchDashboardData = async () => {
            try {
                const statsRes = await axios.get('https://backend-chih.onrender.com/api/users', { withCredentials: true });
                const userData = statsRes.data.data;
                
                stats.value = {
                    totalQuizzes: userData.attempts.length,
                    averageScore: userData.attempts.length 
                        ? userData.attempts.reduce((sum, att) => sum + att.score, 0) / userData.attempts.length 
                        : 0,
                    bestScore: userData.attempts.length 
                        ? Math.max(...userData.attempts.map(att => att.score)) 
                        : 0
                };
                
                recentAttempts.value = userData.attempts
                    .sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken))
                    .slice(0, 5)
                    .map(attempt => ({
                        _id: attempt._id,
                        quizTitle: attempt.quizId?.title || 'Unknown Quiz',
                        score: attempt.score,
                        date: attempt.dateTaken,
                        quizId: attempt.quizId?._id
                    }));
                
                user.value = userData;
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        const retakeQuiz = (quizId) => {
            router.push(`/quizzes/${quizId}`);
        };

        const formatDate = (date) => {
            if (!date) return 'No date';
            try {
                const now = new Date();
                const attemptDate = new Date(date);
                const diffInSeconds = Math.floor((now - attemptDate) / 1000);

                if (diffInSeconds < 60) {
                    return 'just now';
                } else if (diffInSeconds < 3600) {
                    const minutes = Math.floor(diffInSeconds / 60);
                    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
                } else if (diffInSeconds < 86400) {
                    const hours = Math.floor(diffInSeconds / 3600);
                    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                } else if (diffInSeconds < 604800) {
                    const days = Math.floor(diffInSeconds / 86400);
                    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
                } else {
                    return attemptDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                }
            } catch (error) {
                console.error('Error formatting date:', error);
                return 'Invalid Date';
            }
        };

        const getScoreClass = (score) => {
            if (score >= 80) return 'excellent';
            if (score >= 60) return 'good';
            return 'needs-improvement';
        };

        onMounted(fetchDashboardData);

        return {
            user,
            stats,
            recentAttempts,
            formatDate,
            getScoreClass,
            retakeQuiz
        };
    }
};
</script>

<style scoped>
.dashboard-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.dashboard-header {
    margin-bottom: 2rem;
    text-align: left;
}

.dashboard-header h1 {
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #718096;
    font-size: 1.1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-icon {
    background: #f7fafc;
    padding: 1rem;
    border-radius: 10px;
    color: #4a5568;
}

.stat-icon i {
    font-size: 1.5rem;
}

.stat-content h3 {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.stat-value {
    color: #2d3748;
    font-size: 1.5rem;
    font-weight: 600;
}

.dashboard-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
    font-size: 1.25rem;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.activity-list {
    padding: 1rem;
}

.activity-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    background: #f8fafc;
    transition: transform 0.2s;
}

.activity-item:hover {
    transform: translateX(4px);
    background: #f1f5f9;
}

.quiz-info h4 {
    color: #2d3748;
    font-size: 1rem;
    margin-bottom: 0.25rem;
}

.timestamp {
    color: #718096;
    font-size: 0.875rem;
}

.score-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.score-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
}

.refresh-btn {
    background: none;
    border: none;
    color: #4a90e2;
    cursor: pointer;
    font-size: 1.2rem;
    transition: color 0.3s;
}

.refresh-btn:hover {
    color: #357ab8;
}

.excellent {
    background: #C6F6D5;
    color: #22543D;
}

.good {
    background: #FEEBC8;
    color: #744210;
}

.needs-improvement {
    background: #FED7D7;
    color: #822727;
}

.empty-state {
    padding: 3rem 1.5rem;
    text-align: center;
    color: #718096;
}

.empty-state i {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.empty-state p {
    margin-bottom: 1.5rem;
}

.start-quiz-btn {
    display: inline-block;
    background: #3B82F6;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    transition: background 0.2s;
}

.start-quiz-btn:hover {
    background: #2563EB;
}

.retake-quiz-btn {
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.retake-quiz-btn:hover {
    background-color: #357ab8;
}

@media (max-width: 768px) {
    .dashboard-container {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .activity-item {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
    }

    .score-badge {
        width: 100%;
    }
}
</style>