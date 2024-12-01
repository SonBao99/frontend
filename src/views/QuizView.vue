<template>
    <div class="quiz-container">
        <div class="content-wrapper">
            <div class="quiz-header">
                <h1 class="section-title">Available Quizzes</h1>
                <div class="search-filter">
                    <div class="search-group">
                        <i class="bi bi-search"></i>
                        <input type="text" v-model="searchQuery" class="search-input" placeholder="Search quizzes...">
                    </div>
                    <div class="select-group">
                        <i class="bi bi-filter"></i>
                        <select v-model="selectedCategory" class="category-select">
                            <option value="">All Categories</option>
                            <option v-for="category in categories" :key="category" :value="category">
                                {{ category }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="quiz-grid" v-if="filteredQuizzes.length">
                <div v-for="quiz in paginatedQuizzes" :key="quiz._id" class="quiz-card">
                    <div class="quiz-card-header">
                        <span class="quiz-category">{{ quiz.category }}</span>
                        <span class="quiz-questions">{{ quiz.questions.length }} Questions</span>
                    </div>

                    <h2 class="quiz-title">{{ quiz.title }}</h2>
                    <p class="quiz-description">{{ quiz.description }}</p>

                    <div class="quiz-meta">
                        <div class="quiz-stats">
                            <span class="stat-item"
                                :title="quiz.attempts ? `${quiz.attempts} people have taken this quiz` : 'No attempts yet'">
                                <i class="bi bi-people"></i>
                                {{ formatAttempts(quiz.attempts) }}
                            </span>
                            <span class="stat-item"
                                :title="quiz.averageScore ? `Average score: ${quiz.averageScore.toFixed(1)}%` : 'No scores yet'">
                                <i class="bi bi-star"></i>
                                {{ formatScore(quiz.averageScore) }}
                            </span>
                        </div>

                        <div v-if="user && user.role === 'teacher'" class="quiz-actions-dropdown">
                            <button @click="toggleDropdown(quiz._id)" class="action-btn">Actions
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <div v-show="activeDropdown === quiz._id" class="dropdown-menu">
                                <router-link :to="`/quizzes/${quiz._id}/edit`" class="dropdown-item">
                                    <i class="bi bi-pencil"></i>
                                    Edit
                                </router-link>
                                <button @click="deleteQuiz(quiz._id)" class="dropdown-item delete">
                                    <i class="bi bi-trash"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                        <router-link v-else :to="`/quizzes/${quiz._id}`" class="take-quiz-btn">
                            Take Quiz
                            <i class="bi bi-arrow-right"></i>
                        </router-link>
                    </div>
                </div>
            </div>

            <div v-else-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>Loading quizzes...</p>
            </div>

            <div v-else class="empty-state">
                <i class="bi bi-journal-x"></i>
                <h2>No Quizzes Found</h2>
                <p>Try adjusting your search or filter criteria</p>
            </div>

            <div class="pagination-controls">
                <button 
                    @click="prevPage" 
                    :disabled="currentPage === 1"
                    class="pagination-btn"
                >
                    <i class="bi bi-chevron-left"></i>
                </button>
                
                <div class="page-numbers">
                    <button 
                        v-for="page in totalPages" 
                        :key="page"
                        @click="goToPage(page)"
                        class="page-number"
                        :class="{ active: currentPage === page }"
                    >
                        {{ page }}
                    </button>
                </div>

                <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class="pagination-btn"
                >
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            quizzes: [],
            searchQuery: '',
            selectedCategory: '',
            loading: true,
            error: null,
            currentPage: 1,
            itemsPerPage: 6,
            activeDropdown: null,
        };
    },
    computed: {
        categories() {
            return [...new Set(this.quizzes.map(quiz => quiz.category))].sort();
        },
        filteredQuizzes() {
            return this.quizzes.filter(quiz => {
                if (!quiz || !quiz.title) return false;
                const matchesSearch = quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = !this.selectedCategory || quiz.category === this.selectedCategory;
                return matchesSearch && matchesCategory;
            });
        },
        paginatedQuizzes() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.filteredQuizzes.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(this.filteredQuizzes.length / this.itemsPerPage);
        },
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        async fetchQuizzes() {
            this.loading = true;
            this.error = null;

            try {
                
                const response = await axios.get("/quizzes", {
                    params: {
                        populate: 'questions' 
                    }
                });

                // Validate and transform quiz data
                this.quizzes = response.data.map(quiz => ({
                    ...quiz,
                    duration: this.calculateQuizDuration(quiz),
                    category: quiz.category || 'General'
                })).filter(quiz => quiz.questions && quiz.questions.length > 0);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                this.error = error.response?.data?.message || 'Failed to load quizzes. Please try again.';
            } finally {
                this.loading = false;
            }
        },
        calculateQuizDuration(quiz) {
            
            if (quiz.duration) return quiz.duration;

            const questionCount = quiz.questions ? quiz.questions.length : 0;
            return Math.max(15, Math.min(questionCount * 1.5, 60)); // Between 15-60 mins
        },
        formatAttempts(attempts) {
            if (!attempts) return 'No attempts';
            return attempts === 1 ? '1 attempt' : `${attempts} attempts`;
        },
        formatScore(score) {
            if (!score) return 'No scores';
            return `${score.toFixed(1)}%`;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        goToPage(page) {
            this.currentPage = page;
        },
        async deleteQuiz(quizId) {
            if (confirm('Are you sure you want to delete this quiz?')) {
                try {
                    await axios.delete(`/quizzes/${quizId.trim()}`, {
                        withCredentials: true
                    });
                    this.$toast.success('Quiz deleted successfully', {
                        position: 'bottom-left',
                        duration: 2000
                    });
                    await this.fetchQuizzes();
                } catch (error) {
                    console.error('Delete error:', error.response?.data);
                    this.$toast.error(error.response?.data?.message || 'Failed to delete quiz', {
                        position: 'bottom-left',
                        duration: 2000
                    });
                }
            }
        },
        toggleDropdown(quizId) {
            this.activeDropdown = this.activeDropdown === quizId ? null : quizId;
        },
        closeDropdowns(event) {
            if (!event.target.closest('.quiz-actions-dropdown')) {
                this.activeDropdown = null;
            }
        }
    },
    mounted() {
        this.fetchQuizzes();
        document.addEventListener('click', this.closeDropdowns);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeDropdowns);
    }
};
</script>

<style scoped>
.quiz-container {
    min-height: calc(100vh - 64px);
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    padding: 2rem;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.quiz-header {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.search-filter {
    display: flex;
    gap: 1rem;
}

.search-group,
.select-group {
    position: relative;
    flex: 1;
}

.search-group i,
.select-group i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #718096;
}

.search-input,
.category-select {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-input:focus,
.category-select:focus {
    border-color: #3B82F6;
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.quiz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.quiz-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.quiz-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15);
}

.quiz-card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.quiz-category {
    background: #3B82F6;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
}

.quiz-questions {
    color: #718096;
    font-size: 0.875rem;
}

.quiz-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
}

.quiz-description {
    color: #718096;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.quiz-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.quiz-stats {
    display: flex;
    gap: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #718096;
    font-size: 0.875rem;
}

.take-quiz-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #3B82F6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.take-quiz-btn:hover {
    background: #2563EB;
    transform: translateX(4px);
}

.loading-state,
.empty-state {
    text-align: center;
    padding: 4rem 0;
    color: #718096;
}

.spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #00AA48;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.empty-state i {
    font-size: 3rem;
    color: #00AA48;
    margin-bottom: 1rem;
}

.empty-state h2 {
    color: #2d3748;
    margin-bottom: 0.5rem;
}

.pagination-controls {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
}

.pagination-btn {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
    background: #f7fafc;
    border-color: #cbd5e0;
}

.page-numbers {
    display: flex;
    gap: 0.5rem;
}

.page-number {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.page-number.active {
    background: #3B82F6;
    color: white;
    border-color: #3B82F6;
}

.page-number:not(.active):hover {
    background: #f7fafc;
    border-color: #cbd5e0;
}

.quiz-actions {
    display: flex;
    gap: 0.5rem;
}

.edit-quiz-btn, .delete-quiz-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.edit-quiz-btn {
    background: #3B82F6;
    color: white;
    text-decoration: none;
}

.delete-quiz-btn {
    background: #EF4444;
    color: white;
    border: none;
    cursor: pointer;
}

.edit-quiz-btn:hover, .delete-quiz-btn:hover {
    transform: translateY(-2px);
    filter: brightness(110%);
}

.quiz-actions-dropdown {
    position: relative;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #3B82F6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn:hover {
    background: #2563EB;
    transform: translateX(4px);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    min-width: 160px;
    z-index: 10;
    margin-top: 0.5rem;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    color: #4a5568;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
}

.dropdown-item:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.dropdown-item:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.dropdown-item:hover {
    background: #f7fafc;
    color: #2d3748;
}

.dropdown-item.delete {
    color: #e53e3e;
}

.dropdown-item.delete:hover {
    background: #FED7D7;
    color: #C53030;
}
</style>