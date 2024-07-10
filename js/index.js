const categoryMenu = document.querySelector("#categoryMenu");
const difficultyOptions = document.querySelector("#difficultyOptions");
const questionsNumber = document.querySelector("#questionsNumber");
const confirmBtn = document.querySelector("#startQuiz");

const form = document.querySelector("#quizOptions");
const myRow = document.querySelector(".row");

let allQuestions;
let newQuiz;

confirmBtn.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let number = questionsNumber.value;

  newQuiz = new Quiz(category, difficulty, number);
  allQuestions = await newQuiz.getQuestions();
  let firstQuestion = new Question(0);

  form.classList.replace("d-flex", "d-none");
  firstQuestion.displayQuestion();

  console.log(allQuestions);
  console.log(firstQuestion);
});

class Quiz {
  constructor(category, difficulty, number) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.score = 0;
  }

  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getQuestions() {
    let req = await fetch(this.getApi());
    let res = await req.json();
    return res.results;
  }

  showResult() {
    return `
      <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <h2 class="mb-0">${
          this.score == this.number
            ? "Full Score!"
            : `Your Score is : ${this.score} out of ${this.number}`
        }</h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.category = allQuestions[index].category;
    this.correct_answer = allQuestions[index].correct_answer;
    this.difficulty = allQuestions[index].difficulty;
    this.incorrect_answers = allQuestions[index].incorrect_answers;
    this.question = allQuestions[index].question;
    this.answers = this.getAllAnswers();
    this.flag = false;
  }

  getAllAnswers() {
    let allAnswers = [...this.incorrect_answers, this.correct_answer];
    allAnswers.sort();
    return allAnswers;
  }

  displayQuestion() {
    const questionDisplayer = `
      <div
        class="question shadow-lg col-lg-6 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
      >
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions">${this.index + 1} of ${
      allQuestions.length
    }</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
        ${this.answers
          .map((choice) => `<li>${choice}</li>`)
          .toString()
          .replaceAll(",", "")}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score : ${
          newQuiz.score
        }</h2>        
      </div>
    `;

    myRow.innerHTML = questionDisplayer;

    let allChoices = document.querySelectorAll(".choices li");
    allChoices.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.checkAnswer(elem);
        this.nextQuestion();
      });
    });
  }

  checkAnswer(choice) {
    if (!this.flag) {
      this.flag = true;
      if (choice.innerHTML == this.correct_answer) {
        newQuiz.score++;
        choice.classList.add("correct", "animate__animated", "animate__pulse");
      } else {
        choice.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
    }
  }

  nextQuestion() {
    this.index++;
    setTimeout(() => {
      if (this.index < allQuestions.length) {
        let newQuestion = new Question(this.index);
        newQuestion.displayQuestion();
      } else {
        myRow.innerHTML = newQuiz.showResult();
        document.querySelector(".again").addEventListener("click", function () {
          window.location.reload();
        });
      }
    }, 2000);
  }
}
