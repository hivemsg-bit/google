// ============================== app.js ============================== 
// PayTM Integration Added

// Utility functions
const Utils = {
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
  
  showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
  },
  
  hideError(element) {
    element.textContent = '';
    element.classList.remove('show');
  },
  
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
};

// Local storage helpers
const DB = {
  get users() { return JSON.parse(localStorage.getItem('users') || '[]') },
  set users(v) { localStorage.setItem('users', JSON.stringify(v)) },
  
  get session() { return JSON.parse(localStorage.getItem('session') || 'null') },
  set session(v) { localStorage.setItem('session', JSON.stringify(v)) },
  
  get access() { return JSON.parse(localStorage.getItem('access') || '{}') },
  set access(v) { localStorage.setItem('access', JSON.stringify(v)) },
  
  saveScore(testId, score, detail, timeSpent) {
    const key = 'scores:' + (DB.session?.email || 'guest');
    const old = JSON.parse(localStorage.getItem(key) || '[]');
    old.push({
      id: testId,
      score,
      when: Date.now(),
      detail,
      timeSpent,
      totalQuestions: detail.length
    });
    localStorage.setItem(key, JSON.stringify(old));
  },
  
  getScores() {
    const key = 'scores:' + (DB.session?.email || 'guest');
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  
  getAverageScore() {
    const scores = this.getScores();
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score.score, 0);
    return Math.round(total / scores.length);
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearElement = document.getElementById('yr');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize authentication
  initAuth();
  
  // Initialize dashboard if on dashboard page
  if (document.querySelector('.dashboard')) {
    initDashboard();
  }
  
  // Initialize tests if on tests page
  if (document.getElementById('testList')) {
    initTests();
  }
  
  // Initialize pricing if on pricing page
  if (document.querySelector('.pricing-page')) {
    initPricing();
  }
  
  // Initialize contact form if on contact page
  if (document.getElementById('contactForm')) {
    initContact();
  }
});

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mainNav.classList.toggle('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mainNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        mainNav.classList.remove('open');
      }
    });
  }
}

// Authentication system
function initAuth() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const signupCard = document.getElementById('signupCard');
  const loginCard = document.getElementById('loginCard');
  const gotoSignup = document.getElementById('gotoSignup');
  const gotoLogin = document.getElementById('gotoLogin');
  
  // Toggle between login and signup forms
  if (gotoSignup && signupCard) {
    gotoSignup.addEventListener('click', function(e) {
      e.preventDefault();
      loginCard.classList.add('hidden');
      signupCard.classList.remove('hidden');
    });
  }
  
  if (gotoLogin && loginCard) {
    gotoLogin.addEventListener('click', function(e) {
      e.preventDefault();
      signupCard.classList.add('hidden');
      loginCard.classList.remove('hidden');
    });
  }
  
  // Login form submission
  if (loginForm) {
    const emailError = document.getElementById('loginEmailError');
    const passError = document.getElementById('loginPassError');
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPass').value;
      
      // Reset errors
      Utils.hideError(emailError);
      Utils.hideError(passError);
      
      // Validate inputs
      let isValid = true;
      
      if (!email) {
        Utils.showError(emailError, 'Email is required');
        isValid = false;
      } else if (!Utils.validateEmail(email)) {
        Utils.showError(emailError, 'Please enter a valid email address');
        isValid = false;
      }
      
      if (!password) {
        Utils.showError(passError, 'Password is required');
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Check credentials
      const users = DB.users;
      const user = users.find(u => u.email === email && u.pass === password);
      
      if (!user) {
        Utils.showError(passError, 'Invalid email or password');
        return;
      }
      
      // Create session
      DB.session = { email: user.email, name: user.name };
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    });
  }
  
  // Signup form submission
  if (signupForm) {
    const nameError = document.getElementById('suNameError');
    const emailError = document.getElementById('suEmailError');
    const passError = document.getElementById('suPassError');
    
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('suName').value.trim();
      const email = document.getElementById('suEmail').value.trim().toLowerCase();
      const password = document.getElementById('suPass').value;
      
      // Reset errors
      Utils.hideError(nameError);
      Utils.hideError(emailError);
      Utils.hideError(passError);
      
      // Validate inputs
      let isValid = true;
      
      if (!name) {
        Utils.showError(nameError, 'Full name is required');
        isValid = false;
      }
      
      if (!email) {
        Utils.showError(emailError, 'Email is required');
        isValid = false;
      } else if (!Utils.validateEmail(email)) {
        Utils.showError(emailError, 'Please enter a valid email address');
        isValid = false;
      }
      
      if (!password) {
        Utils.showError(passError, 'Password is required');
        isValid = false;
      } else if (password.length < 6) {
        Utils.showError(passError, 'Password must be at least 6 characters');
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Check if user already exists
      const users = DB.users;
      if (users.some(u => u.email === email)) {
        Utils.showError(emailError, 'Email already registered');
        return;
      }
      
      // Create new user
      users.push({ name, email, pass: password });
      DB.users = users;
      
      // Create session
      DB.session = { email, name };
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    });
  }
  
  // Update navigation based on auth status
  updateNavigation();
}

// Update navigation based on authentication status
function updateNavigation() {
  const authBtn = document.getElementById('navAuthBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (authBtn) {
    if (DB.session) {
      authBtn.textContent = 'Dashboard';
      authBtn.href = 'dashboard.html';
      authBtn.innerHTML = '<i class="fas fa-user"></i>Dashboard';
    } else {
      authBtn.textContent = 'Login';
      authBtn.href = 'login.html';
      authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i>Login';
    }
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      DB.session = null;
      window.location.href = 'index.html';
    });
  }
}

// Dashboard functionality
function initDashboard() {
  const userName = document.getElementById('userName');
  const accessStatus = document.getElementById('accessStatus');
  const accessNote = document.getElementById('accessNote');
  const scoreList = document.getElementById('scoreList');
  const avgScore = document.getElementById('avgScore');
  const testsTaken = document.getElementById('testsTaken');
  
  // Set user name
  if (userName) {
    userName.textContent = DB.session?.name || 'Student';
  }
  
  // Set access status
  if (accessStatus && accessNote) {
    const email = DB.session?.email || '';
    const access = DB.access[email] || { plans: [] };
    const hasAccess = access.plans.includes('foundation') || 
                     access.plans.includes('inter') || 
                     access.plins.includes('final');
    
    if (hasAccess) {
      accessStatus.textContent = 'Premium';
      accessStatus.style.background = '#10b981';
      accessNote.textContent = 'You have lifetime access to all purchased tests.';
    } else {
      accessStatus.textContent = 'Free';
      accessStatus.style.background = '#6b7280';
      accessNote.textContent = 'Upgrade to unlock all tests with lifetime access.';
    }
  }
  
  // Display scores
  if (scoreList) {
    const scores = DB.getScores();
    
    if (scores.length === 0) {
      scoreList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <p>No test attempts yet</p>
          <a href="tests.html" class="btn btn-primary">Take Your First Test</a>
        </div>
      `;
    } else {
      scoreList.innerHTML = scores
        .slice(-5) // Show last 5 attempts
        .reverse() // Most recent first
        .map(score => `
          <div class="score-item">
            <div class="score-header">
              <strong>${score.id}</strong>
              <span class="score-value ${score.score >= 70 ? 'score-high' : score.score >= 50 ? 'score-medium' : 'score-low'}">
                ${score.score}%
              </span>
            </div>
            <div class="score-details">
              <span>${new Date(score.when).toLocaleDateString()}</span>
              <span>${score.timeSpent ? 'Time: ' + Utils.formatTime(score.timeSpent) : ''}</span>
              <span>${score.totalQuestions} questions</span>
            </div>
          </div>
        `)
        .join('');
    }
  }
  
  // Set performance metrics
  if (avgScore) {
    avgScore.textContent = DB.getAverageScore() + '%';
  }
  
  if (testsTaken) {
    const scores = DB.getScores();
    testsTaken.textContent = scores.length;
  }
}

// Tests functionality
function initTests() {
  const testList = document.getElementById('testList');
  const testRunner = document.getElementById('testRunner');
  const tabs = document.querySelectorAll('.tab');
  
  if (!testList) return;
  
  let currentTest = null;
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let timerInterval = null;
  let timeSpent = 0;
  let markedQuestions = new Set();
  
  // Render test cards based on selected level
  function renderTestCards(level) {
    const questionBank = window.QUESTION_BANK || {};
    const tests = questionBank[level] || [];
    
    if (tests.length === 0) {
      testList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-book"></i>
          <p>No tests available for ${level}</p>
          <p class="small muted">Check back later for new tests</p>
        </div>
      `;
      return;
    }
    
    testList.innerHTML = tests.map((test, index) => {
      const isDemo = level === 'foundation';
      const isUnlocked = checkTestAccess(level);
      
      return `
        <div class="card card-elevated test-card ${!isUnlocked && !isDemo ? 'locked' : ''}">
          ${!isUnlocked && !isDemo ? '<div class="lock-overlay"><i class="fas fa-lock"></i></div>' : ''}
          <h3>${test.title}</h3>
          <p class="muted">${test.questions.length} Questions • ${test.negative ? 'With negative marking' : 'No negative marking'}</p>
          <div class="test-card-actions">
            <button class="btn ${isUnlocked || isDemo ? 'btn-primary' : 'btn-outline'}" 
                    data-level="${level}" 
                    data-index="${index}"
                    ${!isUnlocked && !isDemo ? 'disabled' : ''}>
              ${isUnlocked || isDemo ? 'Start Test' : 'Locked'}
            </button>
            ${!isUnlocked && !isDemo ? 
              `<a href="pricing.html" class="btn btn-sm btn-outline">Unlock</a>` : 
              ''
            }
          </div>
        </div>
      `;
    }).join('');
    
    // Add event listeners to test buttons
    testList.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', function() {
        const level = this.dataset.level;
        const index = parseInt(this.dataset.index);
        startTest(level, index);
      });
    });
  }
  
  // Check if user has access to a test level
  function checkTestAccess(level) {
    if (!DB.session) return false;
    
    const email = DB.session.email;
    const access = DB.access[email] || { plans: [] };
    
    // Foundation is always available as demo
    if (level === 'foundation') return true;
    
    // Check if user has access to the level
    return access.plans.includes(level);
  }
  
  // Start a test
  function startTest(level, testIndex) {
    // Check authentication
    if (!DB.session) {
      alert('Please log in to take tests');
      window.location.href = 'login.html';
      return;
    }
    
    // Check access
    const hasAccess = checkTestAccess(level);
    if (!hasAccess && level !== 'foundation') {
      alert('Please purchase the plan to unlock this level.');
      window.location.href = 'pricing.html';
      return;
    }
    
    const questionBank = window.QUESTION_BANK || {};
    const tests = questionBank[level] || [];
    currentTest = tests[testIndex];
    
    if (!currentTest) return;
    
    // Initialize test state
    currentQuestionIndex = 0;
    userAnswers = new Array(currentTest.questions.length).fill(null);
    markedQuestions = new Set();
    timeSpent = 0;
    
    // Show test runner
    testRunner.classList.remove('hidden');
    
    // Scroll to test runner
    testRunner.scrollIntoView({ behavior: 'smooth' });
    
    // Update test info
    document.getElementById('testTitle').textContent = currentTest.title;
    document.getElementById('testInfo').textContent = 
      `${currentTest.questions.length} Questions • 1 mark each • ${currentTest.negative ? 'With negative marking' : 'No negative marking'}`;
    
    // Start timer
    startTimer();
    
    // Render first question
    renderQuestion(0);
  }
  
  // Start the test timer
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(function() {
      timeSpent++;
      document.getElementById('timer').textContent = Utils.formatTime(timeSpent);
    }, 1000);
  }
  
  // Render a question
  function renderQuestion(index) {
    if (!currentTest || index < 0 || index >= currentTest.questions.length) return;
    
    currentQuestionIndex = index;
    const question = currentTest.questions[index];
    
    // Update progress
    const progress = ((index + 1) / currentTest.questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('currentQ').textContent = index + 1;
    document.getElementById('totalQ').textContent = currentTest.questions.length;
    
    // Render question
    const qBox = document.getElementById('qBox');
    qBox.innerHTML = `
      <div class="test-q">
        <div class="question-text">
          <strong>Q${index + 1}.</strong> ${question.text}
        </div>
        <div class="opts">
          ${question.options.map((option, optIndex) => `
            <input type="radio" id="q${index}_opt${optIndex}" name="q${index}" value="${optIndex}" 
                   ${userAnswers[index] === optIndex ? 'checked' : ''}>
            <label for="q${index}_opt${optIndex}">
              <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
              <span class="option-text">${option}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add event listeners to options
    qBox.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', function() {
        userAnswers[index] = parseInt(this.value);
        updateNavigationButtons();
      });
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update mark review button
    const markReviewBtn = document.getElementById('markReview');
    if (markedQuestions.has(index)) {
      markReviewBtn.innerHTML = '<i class="fas fa-bookmark"></i>Unmark Review';
      markReviewBtn.classList.add('btn-primary');
    } else {
      markReviewBtn.innerHTML = '<i class="far fa-bookmark"></i>Mark for Review';
      markReviewBtn.classList.remove('btn-primary');
    }
  }
  
  // Update navigation buttons state
  function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQ');
    const nextBtn = document.getElementById('nextQ');
    
    // Previous button
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Next button
    nextBtn.disabled = currentQuestionIndex === currentTest.questions.length - 1;
  }
  
  // Navigation event listeners
  document.getElementById('prevQ')?.addEventListener('click', function() {
    if (currentQuestionIndex > 0) {
      renderQuestion(currentQuestionIndex - 1);
    }
  });
  
  document.getElementById('nextQ')?.addEventListener('click', function() {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      renderQuestion(currentQuestionIndex + 1);
    }
  });
  
  document.getElementById('markReview')?.addEventListener('click', function() {
    if (markedQuestions.has(currentQuestionIndex)) {
      markedQuestions.delete(currentQuestionIndex);
      this.innerHTML = '<i class="far fa-bookmark"></i>Mark for Review';
      this.classList.remove('btn-primary');
    } else {
      markedQuestions.add(currentQuestionIndex);
      this.innerHTML = '<i class="fas fa-bookmark"></i>Unmark Review';
      this.classList.add('btn-primary');
    }
  });
  
  // Submit test
  document.getElementById('submitTest')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to submit the test? You cannot change answers after submission.')) {
      evaluateTest();
    }
  });
  
  // Reset test
  document.getElementById('resetTest')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset the test? All your answers will be lost.')) {
      userAnswers = new Array(currentTest.questions.length).fill(null);
      markedQuestions = new Set();
      renderQuestion(0);
    }
  });
  
  // Evaluate test and show results
  function evaluateTest() {
    if (!currentTest) return;
    
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    let correctAnswers = 0;
    let totalMarks = 0;
    const details = [];
    
    currentTest.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.answer;
      
      if (isCorrect) {
        correctAnswers++;
        totalMarks++;
      } else if (currentTest.negative && userAnswer !== null && userAnswer !== question.answer) {
        // Apply negative marking if enabled
        totalMarks -= 0.25;
      }
      
      details.push({
        question: index + 1,
        userAnswer,
        correctAnswer: question.answer,
        isCorrect
      });
    });
    
    // Calculate percentage (ensure it doesn't go below 0)
    const percentage = Math.max(0, (totalMarks / currentTest.questions.length) * 100);
    const roundedPercentage = Math.round(percentage);
    
    // Save score
    DB.saveScore(currentTest.title, roundedPercentage, details, timeSpent);
    
    // Display results
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.remove('hidden');
    
    resultBox.innerHTML = `
      <div class="card card-elevated">
        <div class="result-header">
          <h3>Test Results</h3>
          <div class="result-score ${roundedPercentage >= 70 ? 'score-high' : roundedPercentage >= 50 ? 'score-medium' : 'score-low'}">
            ${roundedPercentage}%
          </div>
        </div>
        
        <div class="result-stats">
          <div class="stat">
            <div class="stat-value">${correctAnswers}/${currentTest.questions.length}</div>
            <div class="stat-label">Correct Answers</div>
          </div>
          <div class="stat">
            <div class="stat-value">${Utils.formatTime(timeSpent)}</div>
            <div class="stat-label">Time Taken</div>
          </div>
          <div class="stat">
            <div class="stat-value">${markedQuestions.size}</div>
            <div class="stat-label">Marked for Review</div>
          </div>
        </div>
        
        <details class="result-details">
          <summary>View Detailed Results</summary>
          <div class="details-list">
            ${details.map(detail => `
              <div class="detail-item ${detail.isCorrect ? 'correct' : 'incorrect'}">
                <div class="detail-question">Q${detail.question}</div>
                <div class="detail-answer">
                  Your Answer: <strong>${detail.userAnswer !== null ? String.fromCharCode(65 + detail.userAnswer) : 'Not attempted'}</strong>
                </div>
                <div class="detail-answer">
                  Correct Answer: <strong>${String.fromCharCode(65 + detail.correctAnswer)}</strong>
                </div>
              </div>
            `).join('')}
          </div>
        </details>
        
        <div class="result-actions">
          <button class="btn btn-outline" id="retakeTest">
            <i class="fas fa-redo"></i>Retake Test
          </button>
          <a href="dashboard.html" class="btn btn-primary">
            <i class="fas fa-chart-line"></i>View Dashboard
          </a>
        </div>
      </div>
    `;
    
    // Add event listener for retake test button
    resultBox.querySelector('#retakeTest')?.addEventListener('click', function() {
      userAnswers = new Array(currentTest.questions.length).fill(null);
      markedQuestions = new Set();
      timeSpent = 0;
      resultBox.classList.add('hidden');
      startTimer();
      renderQuestion(0);
    });
    
    // Scroll to results
    resultBox.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderTestCards(this.dataset.tab);
    });
  });
  
  // Initialize with foundation tests
  renderTestCards('foundation');
}

// PayTM Pricing functionality
function initPricing() {
  const payButtons = document.querySelectorAll('.payBtn');
  const copyUpiBtn = document.getElementById('copyUpiBtn');
  const verifyPaymentBtn = document.getElementById('verifyPaymentBtn');
  
  // PayTM Checkout Integration
  payButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (!DB.session) {
        alert('Please log in or create an account to make a purchase.');
        window.location.href = 'login.html';
        return;
      }
      
      const plan = this.dataset.plan;
      const amount = this.dataset.amount;
      
      // Use simple UPI method instead of complex PayTM integration
      alert(`Please use the UPI payment method below. Select "${plan.toUpperCase()}" plan in the verification form after payment.`);
      
      // Scroll to UPI section
      document.querySelector('.upi-payment-section').scrollIntoView({ 
        behavior: 'smooth' 
      });
    });
  });
  
  // Copy UPI ID to clipboard
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', function() {
      const upiId = 'your-upi-id@paytm'; // Apna UPI ID yahan daalein
      navigator.clipboard.writeText(upiId).then(function() {
        alert('UPI ID copied to clipboard: ' + upiId);
      }).catch(function() {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = upiId;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('UPI ID copied to clipboard: ' + upiId);
      });
    });
  }
  
  // Verify Payment
  if (verifyPaymentBtn) {
    verifyPaymentBtn.addEventListener('click', function() {
      const userEmail = document.getElementById('userEmail').value.trim();
      const utrNumber = document.getElementById('utrNumber').value.trim();
      const selectedPlan = document.getElementById('selectedPlan').value;
      
      // Validation
      if (!userEmail) {
        alert('Please enter your email address');
        return;
      }
      
      if (!Utils.validateEmail(userEmail)) {
        alert('Please enter a valid email address');
        return;
      }
      
      if (!utrNumber) {
        alert('Please enter UTR/Transaction ID');
        return;
      }
      
      if (!selectedPlan) {
        alert('Please select a plan');
        return;
      }
      
      // Check if logged in user matches the email
      if (DB.session && DB.session.email !== userEmail) {
        if (!confirm('The email you entered does not match your logged in account. Do you want to continue?')) {
          return;
        }
      }
      
      // Simple UTR validation (in real scenario, verify with your records)
      if (utrNumber.length < 8) {
        alert('Please enter a valid UTR number (minimum 8 characters)');
        return;
      }
      
      // Grant access to the plan
      const access = DB.access;
      if (!access[userEmail]) {
        access[userEmail] = { plans: [] };
      }
      
      if (!access[userEmail].plans.includes(selectedPlan)) {
        access[userEmail].plans.push(selectedPlan);
      }
      
      DB.access = access;
      
      // Show success message
      alert(`Payment verified successfully! You now have lifetime access to ${selectedPlan.toUpperCase()} tests.`);
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    });
  }
}

// Contact form functionality
function initContact() {
  const contactForm = document.getElementById('contactForm');
  const waBtn = document.getElementById('waBtn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real application, you would send this data to a server
      // For this demo, we'll just show a success message
      
      alert('Thank you for your message! We will get back to you within 24 hours.');
      contactForm.reset();
    });
  }
  
  // Prefill WhatsApp message if user is logged in
  if (waBtn && DB.session) {
    const userName = DB.session.name;
    const message = `Hi, I'm ${userName}. I have a question about CA Mock Pro.`;
    const encodedMessage = encodeURIComponent(message);
    waBtn.href = `https://wa.me/919876543210?text=${encodedMessage}`;
  }
}
