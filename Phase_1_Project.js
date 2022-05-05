// Quiz Data
let totalScore = 0;
let questions = [];
let fullName = '';
let mobileNumber = '';

// Configuration and data fetch
const externalUrl = 'https://the-trivia-api.com/api/questions'
const localUrl = 'http://localhost:3000/questions'
document.addEventListener('DOMContentLoaded', function(){
  fetch(externalUrl)
  .then((response) => response.json())
  .then((json) => {
    questions = json
  })
  .then(() => console.log(questions))
  .catch((error) => console.warn(error))
});

function startQuiz(){
  fullName = document.getElementById('fullName').value;
  mobileNumber = document.getElementById('mobileNumber').value;

  displayQuestion(0);  
};

function displayQuestion (questionIndex) {
  const quizContainer = document.getElementById('question-answer');
  const speechmarkPattern = /(\"|\')/g // regular expressions

  // https://javascript.info/array-methods#shuffle-an-array
  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  // Check if quiz finished
  if (questionIndex >= questions.length){
    displayResult();
  } else {
    // Next question Answers
    const questionData = questions[questionIndex]
    const answerList = [...questionData.incorrectAnswers,questionData.correctAnswer]
    const formattedAnswerList = answerList.map((answer) => answer.replace(speechmarkPattern,''))
    shuffle(formattedAnswerList)

    // Set new questions on page
    quizContainer.innerHTML=
    `
    <div class="question-row">
      <div class="col-sm-3">${questionIndex+1}</div>
      <div class="col-sm-9">${questionData.question}</div>
    </div>
    <div class="answer-row">
      ${formattedAnswerList.map((answer)=>(
        `<button 
          class="col-sm-12 col-lg-3" 
          onclick='submitAnswer(${questionIndex+1}, "${answer}", "${questionData.correctAnswer.replace(speechmarkPattern,'')}")'>
            ${answer}
          </button>`)).join('')}
    </div>
  `
  }
};

function submitAnswer(nextQuestionIndex,userAnswer,correctAnswer) {
  if (userAnswer === correctAnswer) {
    totalScore = totalScore + 1
  };
  displayQuestion(nextQuestionIndex);
};

function saveData(userData){
  fetch("http://localhost:3000/userData",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(userData)
  })
  // .then(function(response) {
  //   return response.json();
  // })
  // .then(function(object) {
  //   console.log(object);
  // })
  .catch(function(error) {
    alert("Error saving to server");
    console.log(error.message);
  });
}

function displayResult() {
  
  // Show Result
  const quizContainer = document.getElementById('question-answer');
  quizContainer.innerHTML= `
  <div class="col-sm-12">
    YOUR TOTAL CORRECTED ANSWER IS ${totalScore} OUT OF ${questions.length}
  </div>
  `
  // Save result to database
  const userData = {
    "fullName": fullName, 
    "mobileNumber": mobileNumber, 
    "totalScore": totalScore
  }
  saveData(userData);
};

function tryAgain(){
  totalScore = 0;
  startQuiz()
};

let userData =[];

function allUsers(){
  fetch("http://localhost:3000/userData")
  .then((response) => response.json())
  .then((json) => {
  userData = json
})
.then(() => createTable())
.then(() => console.log(userData))
};


function createTable(){
// let userData = [
//   {
//     "fullName": "656456",
//     "mobileNumber": "456456",
//     "totalScore": 0,
//     "id": 1
//   },
//   {
//     "fullName": "Demo Name",
//     "mobileNumber": "123456",
//     "totalScore": 5,
//     "id": 2
//   },
//   {
//     "fullName": "opop",
//     "mobileNumber": "0432220",
//     "totalScore": 3,
//     "id": 9
//   }
// ]

let col = [];
for (let i = 0; i < userData.length; i++){
  for (let key in userData[i]){
    if (col.indexOf(key) === -1){
      col.push(key);
    }
  }
}

let table = document.createElement("table");

let tr = table.insertRow(-1);

for (let i = 0; i < col.length; i++){
  var th = document.createElement("th");
  th.innerHTML = col[i];
  tr.appendChild(th);
}

for (let i = 0; i < userData.length; i++){
  tr = table.insertRow(-1);
  for (let j=0; j < col.length; j++){
  let tabCell = tr.insertCell(-1);
  tabCell.innerHTML = userData[i][col[j]]; 
  }
}

let userContainer = document.getElementById("userContainer");
userContainer.innerHTML = "";
userContainer.appendChild(table);
}


// const allUsers=document.querySelector("#allUsers");
    // const userName=document.createElement("li");
    // userName.innerHTML="Demo"
    // allUsers.append(userName);
    // console.log(json)

// https://www.encodedna.com/javascript/populate-json-data-to-html-table-using-javascript.htm
// let userContainer = document.querySelector("#userContainer");

// let table = document.createElement("User-Table");
// table.setAttribute("id","myTable");
// document.body.appendChild(table);

// let row = document.createElement("TR");
// row.setAttribute("id", "myTR");
// document.getElementById("myTable").appendChild(row);

// let td = document.createElement("TD");
// document.getElementById("myTR").appendChild(td);


  // .then(function(response) {
  //   return response.json();
  // })
  // .then(function(object) {
  //   console.log(object);
  // })



// -------------------------------------------------------------------
// Like function

// from https://github.com/Studentfaruk0308/fewpjs-build-the-example/blob/master/main.js
function mimicServerCall(url="http://mimicServer.example.com", config={}) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      let isRandomFailure = Math.random() < .2
      if (isRandomFailure) {
        reject("Random server error. Try again.");
      } else {
        resolve("Pretend remote server notified of action!");
      }
    }, 300);
  });
}

function like(){
  const likeButton = document.getElementById("like");
  likeButton.innerHTML = '<div class="loader"></div>'
  mimicServerCall()
    .then(()=>{ likeButton.innerHTML=`♥`})
    .catch((error)=>{ 
      alert(error)
      likeButton.innerHTML=`error ♡`
    })
}
