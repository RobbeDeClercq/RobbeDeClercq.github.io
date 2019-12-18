let question, answerDiv, difficultyDiv, 
    difficultyP, select, interval, nextQuestionInterval,
    countdownDiv, scoreMinDOM, scorePlusDOM;

let scoreMin = 0;
let scorePlus = 0;

let showQuestion = function(json) {
    let answers = [];
    
    let correct_answer = json.correct_answer;

    answers.push(json.correct_answer);
    json.incorrect_answers.forEach(element => {
        answers.push(element);
    });

    answers = shuffle(answers);
    
    question.innerHTML = json.question;

    answers.forEach(element => {
        answerDiv.innerHTML += `<div class="c-trivia__answers--item">
                                    <button class="c-trivia__button">${element}</button>
                                </div>`;
    });

    let buttons = document.querySelectorAll('.js-answers');

    buttons = buttons[0].children;

    let counter = 0;

    for (let element of buttons){
        element = element.firstElementChild;
        element.addEventListener('click', function(){
            var parser = new DOMParser;
            var dom = parser.parseFromString(
                '<!doctype html><body>' + correct_answer,
                'text/html');
            
            var decodedString = dom.body.textContent;
            
            if(element.textContent == decodedString){
                scorePlus += 1;
                element.classList.add('correct');
            }else{
                scoreMin += 1;
                element.classList.add('incorrect');
            }

            for(let element of buttons){
                element = element.firstElementChild;
                element.disabled = true;

                if(element.textContent == decodedString){
                    element.classList.add('correct');
                }else{
                    element.classList.add('incorrect');
                }
            }

            scoreMinDOM.innerHTML = scoreMin;
            scorePlusDOM.innerHTML = scorePlus;
            select.disabled = true;
            interval = setInterval(getAPI, 5000);
            nextQuestionInterval = setInterval(nextQuestionCountdown, 1000)
        });
        counter++;
    }

    difficultyDiv.className = difficultyDiv.className.replace(/\beasy\b/g, "");
    difficultyDiv.className = difficultyDiv.className.replace(/\bmed\b/g, "");
    difficultyDiv.className = difficultyDiv.className.replace(/\bhard\b/g, "");

    switch(json.difficulty){
        case 'easy':
            difficultyP.innerHTML = "Easy";
            difficultyDiv.classList.add("easy");
            break;
        case 'medium':
            difficultyP.innerHTML = "Medium";
            difficultyDiv.classList.add("med");
            break;
        case 'hard':
            difficultyP.innerHTML = "Hard";
            difficultyDiv.classList.add("hard");
            break;
    }
}

let counterQuestion = 4;

const nextQuestionCountdown = function(){
    if(counterQuestion == 0){
        clearInterval(nextQuestionInterval);
        counterQuestion = 4;
    }else{
        question.innerHTML = `Next question in: ${counterQuestion}`;
        counterQuestion--;
    }
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

let getAPI = function() {
    answerDiv.innerHTML = "";
    // Eerst bouwen we onze url op
    let url;

    category = select.value;
    
    if(category > 0){
    	url = `https://opentdb.com/api.php?amount=1&category=${category}&type=multiple`;
    }else{
        url = `https://opentdb.com/api.php?amount=1&type=multiple`;
    }

	// Met de fetch API proberen we de data op te halen.
	// const response = fetch(url);
	fetch(url).then(function(response)	{
		console.info('Er is een response teruggekomen van de server');
		return response.json();
	}).then(function(jsonObject) {
		console.info('json object is aangemaakt');
		showQuestion(jsonObject.results[0]);
		}).catch(function(error) {
			console.error(`fout bij verwerken json${error}`);
        });
        
    clearInterval(interval);
    select.disabled = false;
    
};

document.addEventListener('DOMContentLoaded', function() {
    question = document.querySelector('.js-question');
    answerDiv = document.querySelector('.js-answers');
    difficultyDiv = document.querySelector('.c-difficulty');
    difficultyP = document.querySelector('.js-difficulty');
    select = document.querySelector('.js-select');
    countdownDiv = document.querySelector('.js-countdown');
    scoreMinDOM = document.querySelector('.js-score__min');
    scorePlusDOM = document.querySelector('.js-score__plus');

    select.addEventListener('change', function(){
        scoreMin = 0;
        scorePlus = 0;
        scoreMinDOM.innerHTML = scoreMin;
        scorePlusDOM.innerHTML = scorePlus;
        getAPI();
    });

	console.log('script Loaded!');
	getAPI();
});