/*
 * Create a list that holds all of your cards
 */

var cardList = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-anchor','fa-leaf','fa-bicycle','fa-diamond','fa-bomb','fa-leaf','fa-bomb','fa-bolt','fa-bicycle','fa-paper-plane-o','fa-cube'];

// numbers of moves
var moves = 0;
// matches found
var matchFound = 0;
// opened cards
var openCards = [];
//
var gameStarted = false;
// timer
var timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
    $('#timer').html(timer.getTimeValues().toString());
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//reset timer
function resetTimer(){
	timer.stop();
	$('#timer').html('00:00:00');
}

//initial the score panel
function initScorePanel() {
	moves = 0;
	$('.moves').text('0');
}

//update moves
function updateMoves(){
	moves ++;
	$('.moves').text(moves);
	updateStars();
}

//reset stars
function resetStars(){
	$('#stars li').each(function(){
		$(this).children().removeClass('fa fa-star-o').addClass('fa fa-star');
	});
}

//update stars
function updateStars(){
	if(moves>23){
		$('#stars li:nth-child(2)').children().removeClass('fa fa-star').addClass('fa fa-star-o');
		$('#stars li:nth-child(3)').children().removeClass('fa fa-star').addClass('fa fa-star-o');
	} else if(moves>14 && moves<=23){
		$('#stars li:nth-child(3)').children().removeClass('fa fa-star').addClass('fa fa-star-o');
	}
}

// Initial the card deck
function initGame(){

	openCards = [];

	var cards = shuffle(cardList);

	$('.deck').empty();
	for(var i=0;i<cards.length;i++){
		$('.deck').append('<li class="animated card"><i class="fa '+cards[i]+'"></i></li>');
	}

	$('.deck').find('.card:not(".match, .open")').click(function(){
		clickCard(this);
	});

}

//reset the game
function resetGame(){
	gameStarted = false;
	openCards = [];
	matchFound = 0;
	initScorePanel();
	resetStars();
	resetTimer();
	initGame();
}

//
function clickCard(card) {

	if (gameStarted == false) {
        gameStarted = true;
        timer.start();
    }

	var cardClass = $(card).find('i').attr('class');

	if(openCards.length===0) {
		$(card).toggleClass('open show').animateCss('flipInY');
		openCards.push(cardClass);
	} else if(openCards.length===1) {
		updateMoves();
		$(card).addClass('open show').animateCss('flipInY');
		openCards.push(cardClass);
		setTimeout(matchOpenCards,1000);
	}

}

//check whether the opened cards are matched
function matchOpenCards(){
	if(openCards[0]==openCards[1]) {
		$('.deck').find('.card.open.show').off('click');
		$('.deck').find('.card.open.show').removeClass('open show').addClass('match').animateCss('pulse');
		checkWin();
	} else {
		$('.deck').find('.card.open.show').removeClass('open show');
	}
	openCards = [];
}

//check whether the game is finished
function checkWin() {
	matchFound++;
	if(matchFound == 8){
		timer.pause();
		showResult();
	}
}

//show game result
function showResult(){
	swal({
		allowOutsideClick:false,
		type: 'success',
		title: 'Congrats!',
		html:
			'<div class="success-score">'
			+	'<section class="score-panel">'
			+		'<ul class="stars">'
			+ 			$('#stars').html()
        	+		'</ul>'
			+	'</section>'

			+'</div>'
			+'<span class="success-score">Moves:'+moves+'</span>'
			+'<span class="success-score">Time:'+timer.getTimeValues().toString()+'</span>'
	});
}


$(document).ready(function(){

	openCards = [];
	matchFound = 0;
	initScorePanel();
	initGame();
	//
	$('.restart').click(function(){
		resetGame();
	});

});

