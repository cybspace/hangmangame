(function () {
   'use strict';
   // this function is strict...
	var newGameButton = document.getElementById('new-game');
	var languageButton = document.getElementById('language');
	var hintButton = document.getElementById('hint');
	var gameTitle = document.getElementById('js--game-title');
	var gameLog = document.getElementById('js--game-log');
	var hintPlaceholder = document.getElementById('js--hint-placeholder');


	var alphabet = new Letters();
	var hiddenWord = new HiddenWord();


	languageButton.addEventListener('click', function () {
		languageButton.textContent.toLowerCase() === 'ru' ? switchLanguage('en') : switchLanguage('ru');
	});

	newGameButton.addEventListener('click', function () {
		document.querySelector('.navigation-wrapper').classList.remove('centered');
		if (!gameTitle.classList.contains('hidden')) {
			gameTitle.classList.add('hidden');
		}
		init();
	});

	hintButton.addEventListener('click', function() {
		console.log('listener work properly');
		hiddenWord.giveHint();
	});

	function init() {
		let language = languageButton.textContent;
		alphabet.renderAlphabet(language);
		hiddenWord.renderHiddenWord(language);
		addEventListenersToLetters();

		if (gameLog.classList.contains('hidden')) {
			gameLog.classList.remove('hidden');
		}
		gameLog = document.getElementById('js--game-log');
		hintPlaceholder.textContent = '';
	};

	function reset (win) {
		let winMessage, loseMessage;
		alphabet.clearLetters();
		hiddenWord.clearHiddenWord();
		gameLog.classList.add('hidden');
		gameTitle.classList.remove('hidden');
		hintPlaceholder.textContent = '';
		if (languageButton.textContent.toLowerCase() === 'ru') {
			winMessage = 'Да братишка! Ты угадал!';
			loseMessage = 'Попробуй еще...';
		} else {
			winMessage = 'Hooray! You win!';
			loseMessage = 'Next time bro...';
		}
		win ? gameTitle.textContent = winMessage : gameTitle.textContent = loseMessage;
		document.querySelector('.navigation-wrapper').classList.add('centered');
	};

	function switchLanguage (language) {
		switch (language.toLowerCase()) {
			case 'ru':
				newGameButton.textContent = 'Новая игра';
				languageButton.textContent = 'RU';
				hintButton.innerHTML = 'Подсказка: <span id="js--hint-count"></span>';
				gameTitle.textContent = 'Угадай слово';
				gameLog.innerHTML = '<p>Угадай слово за <span id="js--try-count">X</span> попыток</p>';
				hintPlaceholder.textContent = '';
				break;
			case 'en':
				newGameButton.textContent = 'New game';
				languageButton.textContent = 'EN';
				hintButton.innerHTML = 'Hint: <span id="js--hint-count"></span>';
				gameTitle.textContent = 'Hangman';
				gameLog.innerHTML = '<p>Guess the word in <span id="js--try-count">X</span> tries</p>';
				hintPlaceholder.textContent = '';
				break;
		}

		//if letters already renderred - trigger re-render alphabet and word
		if (document.querySelector('.letter-unit')) {
			alphabet.renderAlphabet(language);
			hiddenWord.renderHiddenWord(language);
			addEventListenersToLetters();
		}
	};

	function addEventListenersToLetters() {
		var letters = document.querySelectorAll('.letter-unit');
		letters.forEach(function (item) {
			item.addEventListener('click', function () {
				item.disabled = true;
				console.log(item.textContent);
				var checkTryCount = hiddenWord.checkAnswer(item.textContent.toLowerCase());
				if (checkTryCount <= 0) {
					reset(false);
				} else if (checkTryCount > 10) {
					reset(true);
				}
			});
		});
	};

	function Letters() {
		let lettersPlaceholder = document.getElementById('js--letters');
		let lettersWrapper = document.querySelector('.letters-wrapper');
		let alphabetEn = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
		let alphabetRu = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'ё', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']


		this._createElementWithClass = function (elementName, className) {
			let newElement = document.createElement(elementName);
			newElement.classList.add(className);
			return newElement;
		};

		this.clearLetters = function () {
			while (lettersPlaceholder.firstChild) {
				lettersPlaceholder.removeChild(lettersPlaceholder.firstChild);
			}
		};

		this.renderAlphabet = function(language) {
			var alphabet;
			if (language.toLowerCase() === 'ru') {
				lettersWrapper.classList.remove('en');
				lettersWrapper.classList.remove('ru');
				lettersWrapper.classList.add('ru');
				alphabet = alphabetRu;
			} else if (language.toLowerCase() === 'en') {
				lettersWrapper.classList.remove('ru');
				lettersWrapper.classList.remove('en');
				lettersWrapper.classList.add('en');
				alphabet = alphabetEn;
			}

			this.clearLetters();

			for (let i = 0; i < alphabet.length; i++) {
				//create new letter and placeholder
				let letterUnitPlaceholder, letterUnitButton;
				letterUnitPlaceholder = this._createElementWithClass('div', 'letter-unit-placeholder');
				letterUnitButton = this._createElementWithClass('button', 'letter-unit');

				//add letter id and value
				letterUnitButton.id = alphabet[i];
				letterUnitButton.textContent = alphabet[i].toUpperCase();

				//append letter to placeholder and append letter placeholder to main placeholder
				letterUnitPlaceholder.appendChild(letterUnitButton);
				(lettersPlaceholder).appendChild(letterUnitPlaceholder);
			}
		}
	};

	function HiddenWord() {
		let hiddenWordPlaceholder = document.getElementById('js--hidden-word');
		let tryCountSpan = document.getElementById('js--try-count');
		let hintCountSpan = document.getElementById('js--hint-count');
		let wordsEn = [['Animal', ['cat', 'dog', 'elephant', 'frog', 'bobcat', 'geeraf', 'lion']],
					   ['Car', ['mustang', 'dodge', 'mersedes benz', 'chevrolet', 'lada', 'volga']],
					   ['Boardgame', ['chess', 'checkers', 'backgamon', 'hangman', 'domino', 'poker']],
					   ['Plant', ['tree', 'grass', 'bush', 'leaf', 'flower', 'cone', 'seed']],
					   ['Sport', ['football', 'run', 'swimming', 'skiing', 'golf', 'snowboarding']],
					   ['Music gear', ['synthesizer', 'drums', 'soundcard', 'mic', 'mixer', 'bass guitar']],
					   ['Music genre', ['techno', 'breakbeat', 'trance', 'jazz', 'hip hop', 'blues', 'house']]];
		let wordsRu = [['Животное', ['кот', 'собака', 'слон', 'лягушка', 'бобёр', 'жираф', 'лев']],
					   ['Авто', ['мустанг', 'додж', 'мерседес бенс', 'шевроле', 'лада', 'волга']],
					   ['Настольная игра', ['шахматы', 'шашки', 'нарды', 'слова', 'домино', 'покер']],
					   ['Растение', ['дерево', 'трава', 'куст', 'листик', 'цветок', 'шишка', 'семя']],
					   ['Спорт', ['футбол', 'бег', 'плавание', 'лыжи', 'гольф', 'сноубординг']],
					   ['Музыкальное оборудование', ['синтезатор', 'ударные', 'звуковая карта', 'микрофон', 'микшер', 'бассуха']],
					   ['Жанр музыки', ['техно', 'брейкбит', 'транс', 'джаз', 'хип хоп', 'блюз', 'хаус']]];

		var hiddenWord, category, tryCount, hintCount;
		var emptyArray = [];

		this._generateRandomNumberByArray = function (array) {
			return Math.floor(Math.random() * array.length);
		};

		this._generateAndDisplayHiddenWordArray = function () {
			//clear hidden word array
			while (emptyArray.length >= 1) {
				emptyArray.shift();
			}

			//fill hidden word array with empty spaces
			for (let i = 0; i < hiddenWord.length; i++) {
				if (hiddenWord[i] === ' ') {
					emptyArray.push(' ')
				} else {
					emptyArray.push('_');
				}
			}

			//display hidden word array
			hiddenWordPlaceholder.textContent = emptyArray.join(' ');

			tryCountSpan = document.getElementById('js--try-count');
			tryCount = 10;
			tryCountSpan.textContent = tryCount;

			hintCountSpan = document.getElementById('js--hint-count');
			hintCount = 3;
			hintCountSpan.textContent = hintCount;
		};

		this.renderHiddenWord = function (language) {
			let words, categoryNum, wordNum;

			//select array based on language
			language.toLowerCase() === 'ru' ? words = wordsRu : words = wordsEn;

			//generate category and word
			categoryNum = this._generateRandomNumberByArray(words);
			category = words[categoryNum][0];
			wordNum = this._generateRandomNumberByArray(words[categoryNum][1]);
			hiddenWord = words[categoryNum][1][wordNum];

			this._generateAndDisplayHiddenWordArray();
		};

		this.clearHiddenWord = function () {
			hiddenWordPlaceholder.textContent = '';
		};

		this.checkAnswer = function (letter) {
			if (hiddenWord.indexOf(letter) > -1) {
				for (let i = 0; i < hiddenWord.length; i++) {
					if (hiddenWord[i] === letter) {
						emptyArray[i] = hiddenWord[i];
					}
				}

				if (hiddenWord.toLowerCase() === emptyArray.join('').toLowerCase()) {
					tryCount = 99;
				}

				hiddenWordPlaceholder.textContent = emptyArray.join(' ');
			} else {
				tryCount--;
				tryCountSpan.textContent = tryCount;
			}
			return tryCount;
		};

		this.giveHint = function () {
			console.log('giveHint entered');
			switch (hintCount) {
				case 3:
					console.log('case 3 entered');
					this._unhideCategory();
					break;
				case 2:
					this._unhideOneLetter();
					break;
				case 1:
					this._unhideOneLetter();
				default: break;
							 }
			if (hintCount > 0) {
				hintCount--;
				hintCountSpan.textContent = hintCount;
				console.log(hintCount);
			}
		};

		this._unhideCategory = function () {
			console.log('_unhideCategory entered');
			let hintMessage;
			if (languageButton.textContent.toLowerCase() === 'ru') {
				console.log('ru entered');
				hintMessage = 'Слово относится к категории: ';
			} else {
				console.log('en entered');
				hintMessage = 'The word is from category: ';
			}
			console.log(hintMessage + category);
			hintPlaceholder.textContent = hintMessage + category;
		};

		this._unhideOneLetter = function () {
			let randomLetter = this._generateRandomNumberByArray(hiddenWord);
			while (emptyArray[randomLetter] !== '_') {
				randomLetter = this._generateRandomNumberByArray(hiddenWord);
			}

			this.checkAnswer(hiddenWord[randomLetter]);
		};

		this.setCustomWord = function (customWord) {
			hiddenWord = customWord;
			this._generateAndDisplayHiddenWordArray();
		}
	}
}());
