// Final Project of Anna Zadorenko for CS3043
document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.getElementById("themeButton");
  const body = document.body;
  const storedTheme = localStorage.getItem("anna_cs3043_theme");
  if (storedTheme === "light") {
    body.classList.add("light-theme");
  }

  themeButton.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    localStorage.setItem("anna_cs3043_theme", body.classList.contains("light-theme") ? "light" : "dark");
  });

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  const counters = document.querySelectorAll(".stat-number");
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = Number(counter.dataset.target);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(interval);
        } else {
          counter.textContent = current;
        }
      }, 35);
    });
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) observer.observe(heroStats);

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabPanels.forEach(panel => panel.classList.remove("active"));
      button.classList.add("active");
      const panel = document.getElementById(button.dataset.tab);
      if (panel) panel.classList.add("active");
    });
  });

  const slider = document.getElementById("ethicsSlider");
  const sliderLabel = document.getElementById("sliderLabel");
  const sliderText = document.getElementById("sliderText");

  const updateSliderMessage = (value) => {
    if (value < 34) {
      sliderLabel.textContent = "Low ethical focus";
      sliderText.textContent = "When user needs are not central, systems may look advanced but still create exclusion and risk.";
    } else if (value < 67) {
      sliderLabel.textContent = "Balanced design";
      sliderText.textContent = "A balanced approach combines technical innovation with privacy, accessibility, and direct user input.";
    } else {
      sliderLabel.textContent = "Strong user-centered ethics";
      sliderText.textContent = "When disabled users are included in design, testing, and review, AI is more likely to be fair, safe, and useful.";
    }
  };

  slider.addEventListener("input", (e) => {
    updateSliderMessage(Number(e.target.value));
  });
  updateSliderMessage(Number(slider.value));

  const quizQuestions = Array.from(document.querySelectorAll(".quiz-question"));
  const quizFeedback = document.getElementById("quizFeedback");
  const quizScore = document.getElementById("quizScore");
  const nextQuestion = document.getElementById("nextQuestion");
  const prevQuestion = document.getElementById("prevQuestion");

  let currentQuestion = 0;
  let answers = {};
  let score = 0;

  const renderQuestion = () => {
    quizQuestions.forEach((q, index) => q.classList.toggle("active", index === currentQuestion));
    prevQuestion.disabled = currentQuestion === 0;
    nextQuestion.textContent = currentQuestion === quizQuestions.length - 1 ? "Finish" : "Next";
  };

  const calculateScore = () => {
    score = 0;
    quizQuestions.forEach((q, index) => {
      const correct = q.dataset.answer;
      if (answers[index] === correct) score += 1;
    });
    quizScore.textContent = `Score: ${score} / ${quizQuestions.length}`;
  };

  quizQuestions.forEach((question, index) => {
    const options = question.querySelectorAll(".quiz-option");
    options.forEach(option => {
      option.addEventListener("click", () => {
        const correctAnswer = question.dataset.answer;
        answers[index] = option.dataset.choice;

        options.forEach(btn => {
          btn.classList.remove("correct", "incorrect");
          if (btn.dataset.choice === correctAnswer) btn.classList.add("correct");
        });

        if (option.dataset.choice !== correctAnswer) {
          option.classList.add("incorrect");
          quizFeedback.textContent = "Not quite. The highlighted answer is correct.";
        } else {
          quizFeedback.textContent = "Correct. Nice job.";
        }

        calculateScore();
      });
    });
  });

  nextQuestion.addEventListener("click", () => {
    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
    } else {
      calculateScore();
      quizFeedback.textContent = `Final result: ${score} out of ${quizQuestions.length}.`;
    }
  });

  prevQuestion.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
      renderQuestion();
    }
  });

  renderQuestion();

  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
});
