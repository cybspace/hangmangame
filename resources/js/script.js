var UIController = (function(){

    //DOM elements
    var DOMStrings = {
        newGameBtnID: 'new-game',
        hintBtnID: 'hint',
        languageBtnID: 'language',

        gameTitleDivID: 'js--game-title',
        gameLogDivID: 'js--game-log',
        gameLogTextSpanID: 'js--game-log-text',

        tryCountSpanID: 'js--try-count',
        hintCountSpanID: 'js--hint-count',
        hintTextSpanID: 'js--hint-text',
        hintPlaceholderSpanID: 'js--hint-placeholder',

        hiddenWordDivID: 'js--hidden-word',

        lettersDivID: 'js--letters',
        lettersWrapperClass: 'letters-wrapper',
        letterUnitPlaceholderClass: 'letter-unit-placeholder',
        letterUnitBtnClass: 'letter-unit',

        navigationWrapperClass: 'navigation-wrapper',

        hiddenClass: 'hidden',
        centeredClass: 'centered'
    };

    var DOMElements = {
        newGameBtn: document.getElementById(DOMStrings.newGameBtnID),
        hintBtn: document.getElementById(DOMStrings.hintBtnID),
        languageBtn: document.getElementById(DOMStrings.languageBtnID),

        gameTitle: document.getElementById(DOMStrings.gameTitleDivID),
        gameLog: document.getElementById(DOMStrings.gameLogDivID),
        gameLogTextSpan: document.getElementById(DOMStrings.gameLogTextSpanID),

        tryCount: document.getElementById(DOMStrings.tryCountSpanID),
        hintCount: document.getElementById(DOMStrings.hintCountSpanID),
        hintText: document.getElementById(DOMStrings.hintTextSpanID),
        hintPlaceholder: document.getElementById(DOMStrings.hintPlaceholderSpanID),

        hiddenWord: document.getElementById(DOMStrings.hiddenWordDivID),

        alphabetPlaceholder: document.getElementById(DOMStrings.lettersDivID), alphabetWrapper: document.querySelector('.' + DOMStrings.lettersWrapperClass),
        navigationWrapper: document.querySelector('.' + DOMStrings.navigationWrapperClass)
    };

    var UITextContent = {
        RU: {
            gameTitle: 'Угадай слово',
            newGameBtnText: 'Новая игра',
            hintBtnText: 'Подсказка: ',
            hintText: 'Слово относится к категории: ',
            gameLogText: 'Разгадай слово за отведенное количество попыток: ',
            langeageBtnText: 'RU',
            winMessageText: 'Да братишка! Ты угадал!',
            loseMessageText: 'Попробуй еще...'
        },
        EN: {
            gameTitle: 'Guess the word',
            newGameBtnText: 'New game',
            hintBtnText: 'Hint: ',
            hintText: 'The word is from category: ',
            gameLogText: 'Discover the word for the remaining number of attempts: ',
            langeageBtnText: 'EN',
            winMessageText: 'Hooray, bro! You nailed it!',
            loseMessageText: 'Next time...'
        }
    };

    var clearAlphabet = function() {
        //clear Alphabet placeholder
        while (DOMElements.alphabetPlaceholder.firstChild) {
            DOMElements.alphabetPlaceholder.removeChild(DOMElements.alphabetPlaceholder.firstChild);
        }

        //remove alphabet wrapper classes
        DOMElements.alphabetWrapper.classList.remove('en');
        DOMElements.alphabetWrapper.classList.remove('ru');
    };

    var createElementWithClass = function (elementName, className) {
        var newElement = document.createElement(elementName);
        newElement.classList.add(className);
        return newElement;
    };

    var clearLogs = function() {
        DOMElements.hiddenWord.textContent = '';
        DOMElements.hintPlaceholder.textContent = '';
        DOMElements.hintText.textContent = '';
    };

    var switchLanguage = function() {
        //get current lang
        var lang = DOMElements.languageBtn.textContent;

        //get current hint button inner html for replacement
        var hintBtnInnerHtml = DOMElements.hintBtn.innerHTML;

        //switch lang based and replace hint button text
        if(lang === 'RU') {
            lang = 'EN';
            hintBtnInnerHtml = hintBtnInnerHtml.replace(/([А-Я]+)([а-я]+)[^0-9]\s/, UITextContent[lang].hintBtnText);
            DOMElements.hintBtn.innerHTML = hintBtnInnerHtml;
        } else {
            lang = 'RU';
            hintBtnInnerHtml = hintBtnInnerHtml.replace(/([A-Z]+)([a-z]+)[^0-9]\s/, UITextContent[lang].hintBtnText);
            DOMElements.hintBtn.innerHTML = hintBtnInnerHtml;
        }

        //reassign hint count span to DOMElements
        DOMElements.hintCount = document.getElementById(DOMStrings.hintCountSpanID);

        DOMElements.languageBtn.textContent = UITextContent[lang].langeageBtnText;
        DOMElements.gameTitle.textContent = UITextContent[lang].gameTitle;
        DOMElements.newGameBtn.textContent = UITextContent[lang].newGameBtnText;
        DOMElements.gameLogTextSpan.textContent = UITextContent[lang].gameLogText;
    };

    return {
        getDOMElements: function() {
            return DOMElements;
        },
        getDOMStrings: function() {
            return DOMStrings;
        },
        switchLanguage: function() {
            switchLanguage();
        },
        renderAlphabet: function(alph) {
            //check if alphebet already rendered
            if (DOMElements.alphabetWrapper.classList.contains(alph.lang.toLowerCase())) {
                //reset letters
                var letters = document.querySelectorAll('.' + DOMStrings.letterUnitBtnClass);
                letters.forEach(function(item) {
                    item.disabled = false;
                });
                return false;
            } else {
                //setupEventListeners alphabet wrapper and placeholder
                clearAlphabet();
                DOMElements.alphabetWrapper.classList.add(alph.lang.toLowerCase());

                //render alphabet
                for (let i = 0; i < alph.alphabet.length; i++) {
                    //create new letter and placeholder
                    var letterUnitPlaceholderClass, letterUnitButton;
                    letterUnitPlaceholderClass = createElementWithClass('div', DOMStrings.letterUnitPlaceholderClass);
                    letterUnitButton = createElementWithClass('button', DOMStrings.letterUnitBtnClass);

                    //add letter id and value
                    letterUnitButton.id = alph.alphabet[i];
                    letterUnitButton.textContent = alph.alphabet[i].toUpperCase();

                    //append letter to letter placeholder and append letter placeholder to alphabet placeholder
                    letterUnitPlaceholderClass.appendChild(letterUnitButton);
                    DOMElements.alphabetPlaceholder.appendChild(letterUnitPlaceholderClass);
                }

                return true;
            }

        },
        updateGameUI: function(gameInfoObj) {
            //update hidden word array
            DOMElements.hiddenWord.textContent = '';
            DOMElements.hiddenWord.textContent = gameInfoObj.answerWordArr.join(' ');

            //update try count
            DOMElements.tryCount.textContent = '';
            DOMElements.tryCount.textContent = gameInfoObj.tryCount;

            //update hint count
            DOMElements.hintCount.textContent = '';
            DOMElements.hintCount.textContent = gameInfoObj.hintsCount;
        },
        initUI: function() {
            clearLogs();

            DOMElements.navigationWrapper.classList.remove(DOMStrings.centeredClass);

            if (!DOMElements.gameTitle.classList.contains(DOMStrings.hiddenClass)) {
                DOMElements.gameTitle.classList.add(DOMStrings.hiddenClass);
            }

            if (DOMElements.gameLog.classList.contains(DOMStrings.hiddenClass)) {
                DOMElements.gameLog.classList.remove(DOMStrings.hiddenClass);
            }
        },
        resetUI: function(win) {
            var currentLang;

            currentLang = DOMElements.languageBtn.textContent;

            clearAlphabet();
            clearLogs();

            DOMElements.gameLog.classList.add(DOMStrings.hiddenClass);
            DOMElements.gameTitle.classList.remove(DOMStrings.hiddenClass);

            if (win) {
                DOMElements.gameTitle.textContent = UITextContent[currentLang].winMessageText;
            } else {
                DOMElements.gameTitle.textContent = UITextContent[currentLang].loseMessageText;
            }

            DOMElements.navigationWrapper.classList.add(DOMStrings.centeredClass);
        },
        displayCategoryHint: function(category) {
            var lang = DOMElements.languageBtn.textContent;
            DOMElements.hintText.textContent = UITextContent[lang].hintText;
            DOMElements.hintPlaceholder.textContent = category;
        }
    };


})();

var dataController = (function() {

    var alphabets = {
      RU: {
          lang: 'RU',
          alphabet: ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'ё', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'],
      },
      EN: {
          lang: 'EN',
          alphabet: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
      }
    };

    var dictionary = {
        RU: [{
            category: 'Животное',
            words: ['кот', 'собака', 'слон', 'лягушка', 'бобёр', 'жираф', 'лев']
        }, {
            category: 'Авто',
            words: ['мустанг', 'додж', 'мерседес бенс', 'шевроле', 'лада', 'волга']
        }, {
            category: 'Настольная игра',
            words: ['шахматы', 'шашки', 'нарды', 'слова', 'домино', 'покер']
        }, {
            category: 'Растение',
            words: ['дерево', 'трава', 'куст', 'листик', 'цветок', 'шишка', 'семя']
        }, {
            category: 'Растение',
            words: ['дерево', 'трава', 'куст', 'листик', 'цветок', 'шишка', 'семя']
        }, {
            category: 'Спорт',
            words: ['футбол', 'бег', 'плавание', 'лыжи', 'гольф', 'сноубординг']
        }, {
            category: 'Музыкальное оборудование',
            words: ['синтезатор', 'ударные', 'звуковая карта', 'микрофон', 'микшер', 'бассуха']
        }, {
            category: 'Жанр музыки',
            words: ['техно', 'брейкбит', 'транс', 'джаз', 'хип хоп', 'блюз', 'хаус']
        }, {
            category: 'Тест',
            words: ['тест']
        }],
        EN: [{
            category: 'Animal',
            words: ['cat', 'dog', 'elephant', 'frog', 'bobcat', 'geeraf', 'lion']
        }, {
            category: 'Car',
            words: ['mustang', 'dodge', 'mersedes benz', 'chevrolet', 'lada', 'volga']
        }, {
            category: 'Boardgame',
            words: ['chess', 'checkers', 'backgamon', 'hangman', 'domino', 'poker']
        }, {
            category: 'Plant',
            words: ['tree', 'grass', 'bush', 'leaf', 'flower', 'cone', 'seed']
        }, {
            category: 'Sport',
            words: ['football', 'run', 'swimming', 'skiing', 'golf', 'snowboarding']
        }, {
            category: 'Music gear',
            words: ['synthesizer', 'drums', 'soundcard', 'mic', 'mixer', 'bass guitar']
        }, {
            category: 'Music genre',
            words: ['techno', 'breakbeat', 'trance', 'jazz', 'hip hop', 'blues', 'house']
        }, {
            category: 'Test',
            words: ['test']
        }]
    };

    var getRandomNumFromArrLength = function(arr) {
        return Math.floor(Math.random() * arr.length);
    };

    return {
        getAlphabet: function(lang) {
            lang = lang.toUpperCase();

            return alphabets[lang];
        },
        getRandomWord: function(lang) {
            var category, word, catNum, wordNum;

            lang = lang.toUpperCase();

            catNum = getRandomNumFromArrLength(dictionary[lang]);
            category = dictionary[lang][catNum].category;

            wordNum = getRandomNumFromArrLength(dictionary[lang][catNum].words);
            word = dictionary[lang][catNum].words[wordNum];

            return {
                category: category,
                word: word
            };
        },
        getRandomNumFromArrLength: function(arr) {
            return getRandomNumFromArrLength(arr);
        }
    };

})();

var gameController = (function(dataCtrl, UICtrl) {

    var gameInfoObj, DOMElmnts, DOMStrngs;
    const tryCountNumber = 5;
    const hintsCountNumber = 3;
    const hintLetters = 7;

    DOMElmnts = UICtrl.getDOMElements();
    DOMStrngs = UICtrl.getDOMStrings();

    var addEventListenersToLetters = function(lettersRerendered) {
        if (lettersRerendered) {
            var letters = document.querySelectorAll('.' + DOMStrngs.letterUnitBtnClass);
            letters.forEach(function(item) {
                item.addEventListener('click', function () {
                    //1. disable button
                    item.disabled = true;

                    //2. check if letter in the hiddent word
                    checkLetter(item.textContent);

                });
            });
        }
    };

    var setupEventListeners = function() {
        DOMElmnts.newGameBtn.addEventListener('click', newGame);
        DOMElmnts.hintBtn.addEventListener('click', giveHint);
        DOMElmnts.languageBtn.addEventListener('click', function() {
            UICtrl.switchLanguage();
            if(DOMElmnts.alphabetPlaceholder.firstChild.textContent.trim() != '' ) {
                newGame();
            }
        });
    };

    var reset = function() {
        var language, alphabet;

        UICtrl.initUI();

        gameInfoObj = {
            answerWordArr: [],
            tryCount: tryCountNumber,
            hintsCount: hintsCountNumber,
            wordObj: {}
        };

        //get current language
        language = DOMElmnts.languageBtn.textContent;

        //generate wordObj based on lang
        gameInfoObj.wordObj = dataCtrl.getRandomWord(language);

        //get alphabet based on lang
        alphabet = dataCtrl.getAlphabet(language);


        //fill word array with underscores for each letter or space in hidden word
        for (let i = 0; i < gameInfoObj.wordObj.word.length; i++) {
            if (gameInfoObj.wordObj.word[i] === ' ') {
                gameInfoObj.answerWordArr.push(' ');
            } else {
                gameInfoObj.answerWordArr.push('_');
            }
        }

        addEventListenersToLetters(UICtrl.renderAlphabet(alphabet));
    };

    var newGame = function() {
        reset();
        UICtrl.updateGameUI(gameInfoObj);
    };

    var checkLetter = function(letter) {
        letter = letter.toLowerCase();

        //check if letter in wordObj.word
        if (gameInfoObj.wordObj.word.indexOf(letter) > -1) {
            for (let i = 0; i < gameInfoObj.wordObj.word.length; i++) {
                if (gameInfoObj.wordObj.word[i].toLowerCase() === letter) {
                    gameInfoObj.answerWordArr[i] = gameInfoObj.wordObj.word[i];
                }
            }

            //update UI
            UICtrl.updateGameUI(gameInfoObj);

            //check if word already discovered and player have remaining attempts
            if (gameInfoObj.wordObj.word.toLowerCase() === gameInfoObj.answerWordArr.join('').toLowerCase() && gameInfoObj.tryCount >= 1) {
                UICtrl.resetUI(true); //true if win
            }

        } else if (gameInfoObj.tryCount > 1) {
            gameInfoObj.tryCount--;

            //update UI
            UICtrl.updateGameUI(gameInfoObj);
        } else {
            UICtrl.resetUI(false); //false if loose
        }

    };

    var unhideOneLetter = function () {
        //generate random number
        var randomLetter = dataCtrl.getRandomNumFromArrLength(gameInfoObj.answerWordArr);

        //while etter with this index is hidden, generate new randLetter
        while (gameInfoObj.answerWordArr[randomLetter] !== '_') {
            randomLetter = dataCtrl.getRandomNumFromArrLength(gameInfoObj.wordObj.word);
        }

        //unhide rand letter & disable that letter
        checkLetter(gameInfoObj.wordObj.word[randomLetter]);
        document.getElementById(gameInfoObj.wordObj.word[randomLetter]).disabled = true;
    };

    var disableUselessLetters = function() {
        //get all letters
        var wordToDiscover, letters;

        letters = document.querySelectorAll('.' + DOMStrngs.letterUnitBtnClass);
        wordToDiscover = gameInfoObj.wordObj.word;

        //disable letters
        for (let i = 0; i < hintLetters; i++) {
            //get random num for letter disabling
            var randLetter = dataCtrl.getRandomNumFromArrLength(letters);

            //check if letter with index = randLetter is already disabled or if in is in hidden word - if so we select another letter
            while (letters[randLetter].disabled !== false || wordToDiscover.indexOf(letters[randLetter].textContent.toLowerCase()) !== -1) {
                randLetter = dataCtrl.getRandomNumFromArrLength(letters);
            }

            //just disable letter
            letters[randLetter].disabled = true;
        }

    };

    var giveHint = function() {
        switch(gameInfoObj.hintsCount) {
            case 3:
                UICtrl.displayCategoryHint(gameInfoObj.wordObj.category);
                break;
            case 2:
                unhideOneLetter();
                break;
            case 1:
                disableUselessLetters();
                break;
            default:
                break;
                                     }
        if (gameInfoObj.hintsCount > 0) {
            gameInfoObj.hintsCount--;
            UICtrl.updateGameUI(gameInfoObj);
        }
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };

})(dataController, UIController);

gameController.init();
