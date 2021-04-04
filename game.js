var gamePattern = []
var userClickedPattern = []
var level = 0
var gameStarted = false
var patternPlaying = false
var highScore = 0
const buttonColors = ['red', 'blue', 'green', 'yellow']

// use jQuery to add keypress listener to start the game when player presses any key
$(function(){
  $(document).on('keydown', function() {
      if (!gameStarted) {   // check if game has already started
        gameStarted = true
        nextSequence()      // begin game loop
      }
  })
})

// user jQuery to add click listeners to each button
buttonColors.forEach(color => {
  $('#' + color).click(() => {
    // only DO something if the game is started AND the pattern isn't playing
    if (gameStarted && !patternPlaying) {
      let userChosenColor = color
      playSound(color)
      animatePress(color)
      userClickedPattern.push(color)
      checkAnswer(userClickedPattern.length - 1)
    }
  })
})

function nextSequence() {
  level++
  $('#level-title').html('Level<br>' + level)
  let randomNumber = Math.floor(Math.random() * 4)
  let randomChosenColor = buttonColors[randomNumber]
  gamePattern.push(randomChosenColor)

  // disable input for the duration of pattern play
  patternPlaying = true
  setTimeout(() => {
    patternPlaying = false
  }, 500 * gamePattern.length)

  // play the pattern
  for (let i = 1 ; i < gamePattern.length + 1 ; i++) {
    setTimeout(() => {
      playSound(gamePattern[i - 1])
      animatePress(gamePattern[i - 1])
    }, 500 * i)
  }
}

// function for playing color-appropriate sound
function playSound(color) {
  let audio = new Audio('sounds/' + color + '.mp3');
  audio.play();
}

// function for toggling the 'pressed' class on each button for 100 ms
function animatePress(color) {
  $('#' + color).addClass('pressed')
  setTimeout(() => $('#' + color).removeClass('pressed'), 100)
}

// each time user presses button, check if it's true to the pattern
function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      userClickedPattern = []
      patternPlaying = true
      setTimeout(nextSequence, 500)
    }
  } else {
    $('body').addClass('game-over')
    $('#level-title').html('Game Over!<br>Press a Key to Start')
    playSound('wrong')
    setTimeout(() => $('body').removeClass('game-over'), 200)
    // update the high score
    if (highScore < level) {
      highScore = level
    }
    $('#high-score').text(highScore)
    startOver()
  }
}

// function for restarting the game
function startOver() {
  level = 0
  gamePattern = []
  userClickedPattern = []
  gameStarted = false
}