<template>
  <div class="home-container">
    <!-- Hero Section (unchanged) -->
    <section class="hero">
      <div class="hero-content">
        <h1>Test Your Knowledge with LetsQuiz</h1>
        <p class="hero-subtitle">Join thousands of learners and challenge yourself with our interactive quizzes</p>
        <div class="cta-buttons">
          <router-link to="/register" class="cta-primary">Get Started</router-link>
          <router-link to="/quizzes" class="cta-secondary">Browse Quizzes</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="../assets/dragon.svg" alt="Learning illustration" class="floating-animation">
      </div>
    </section>

    <!-- Updated Features Section -->
    <section class="features">
      <h2>Why Choose LetsQuiz?</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <i class="bi bi-lightbulb"></i>
          <h3>Learn Anywhere</h3>
          <p>Access our quizzes from any device, anytime</p>
        </div>
        <div class="feature-card">
          <i class="bi bi-graph-up"></i>
          <h3>Track Progress</h3>
          <p>Monitor your improvement with detailed statistics</p>
        </div>
        <div class="feature-card">
          <i class="bi bi-people"></i>
          <h3>Community Driven</h3>
          <p>Join a growing community of learners</p>
        </div>
        <div class="feature-card">
          <i class="bi bi-trophy"></i>
          <h3>Earn Achievements</h3>
          <p>Get rewarded for your learning journey</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomeView"
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 8%;
  gap: 2rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #2d3748;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(120deg, #3B82F6, #2563EB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
}

.cta-primary, .cta-secondary {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-primary {
  background-color: #3B82F6;
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.cta-primary:hover {
  background-color: #2563EB;
  transform: translateY(-2px);
}

.cta-secondary {
  background-color: white;
  color: #3B82F6;
  border: 2px solid #3B82F6;
}

.cta-secondary:hover {
  background-color: #f7fdf9;
  transform: translateY(-2px);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
}

.hero-image img {
  width: 100%;
  height: auto;
}

.floating-animation {
  animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.features {
  padding: 4rem 8%;
  text-align: center;
}

.features h2 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card i {
  font-size: 2.5rem; /* Slightly larger for Bootstrap icons */
  color: #3B82F6;
  margin-bottom: 1.2rem;
  display: inline-block;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2rem;
  color: #3B82F6;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #4a5568;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 2rem 5%;
  }

  .hero-content {
    max-width: 100%;
  }

  h1 {
    font-size: 2.5rem;
  }

  .cta-buttons {
    justify-content: center;
  }

  .hero-image {
    max-width: 80%;
  }
}
</style>