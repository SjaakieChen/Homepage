//initialize________________________________________________________________
    document.addEventListener('DOMContentLoaded', function() {
        loadTasks();        // Load saved tasks
        attachEventListeners(); // Attach event listeners to various elements
    });
    initializePositions();




    
// navbar url function
    function goToUrl() {
        const url = document.getElementById('urlInput').value;
        if (url) {
            window.open(url, '_blank').focus();
        }
    }





//task section___________________________________________________

    function deleteTask(task, listItem) {
        // Remove the task from localStorage
        let tasks = getSavedTasks();
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Remove the task from the DOM
        listItem.remove();
    }


    // Function to add a new task
    function addTask() {
        const taskInput = document.getElementById('taskInput');
        const task = taskInput.value;
        if (task) {
            addTaskToList(task);
            saveTask(task);
            taskInput.value = '';
        }
    }

    // Function to add a task to the list in the DOM
    function addTaskToList(task) {
    const li = document.createElement('li');
    li.textContent = task;
    
    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function() {
        deleteTask(task, li);
    };

    // Append the delete button to the list item
    li.appendChild(deleteBtn);

    // Append the list item to the task list
    document.getElementById('taskList').appendChild(li);
    }


    // Function to save a task to localStorage
    function saveTask(task) {
        let tasks = getSavedTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to retrieve saved tasks from localStorage
    function getSavedTasks() {
        let tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // Function to load tasks from localStorage and display them
    function loadTasks() {
        let tasks = getSavedTasks();
        tasks.forEach(task => addTaskToList(task));
    }





  //drag__________________________________________________________-

    // Initialize positions for all draggable elements
function initializePositions() {
document.querySelectorAll('.draggable').forEach(loadPosition);
}
    
    // Initialize saved positions for draggable elements when the DOM is loaded

    function makeDraggable(elem) {
        var offsetX = 0, offsetY = 0;

        elem.onmousedown = function(e) {
            // Check if the mousedown event is on an input field
            if (e.target.matches('.drag-handle')) {
                // If it's an input field, don't initiate dragging
            }
            else {
                return;
            }
    
            dragMouseDown(e);
        };
    
        function dragMouseDown(e) {
            e.preventDefault();
            offsetX = e.clientX - elem.getBoundingClientRect().left;
            offsetY = e.clientY - elem.getBoundingClientRect().top;
            document.onmousemove = elementDrag;
            document.onmouseup = closeDragElement;
        }
    
        function elementDrag(e) {
            e.preventDefault();
            elem.style.left = (e.clientX - offsetX + window.scrollX) + "px";
            elem.style.top = (e.clientY - offsetY + window.scrollY) + "px";
        }
    
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
            // Save the position of the element after dragging
            savePosition(elem);
        }
    }
    
    
    // This function saves the element's position to localStorage
    function savePosition(elem) {
        var id = elem.id; // Ensure your element has an ID
        var pos = { left: elem.style.left, top: elem.style.top };
        localStorage.setItem(id, JSON.stringify(pos));
    }
    
    // Apply the drag function to your elements and load their saved positions
    document.querySelectorAll('.draggable').forEach(function(elem) {
        makeDraggable(elem);
        loadPosition(elem);
    });
    
    // This function loads the saved position from localStorage
    function loadPosition(elem) {
        var id = elem.id;
        var pos = localStorage.getItem(id);
        if (pos) {
            pos = JSON.parse(pos);
            elem.style.left = pos.left;
            elem.style.top = pos.top;
        }
    }


    //chess_____________________________________________________________


    document.addEventListener('DOMContentLoaded', function() {
        var chessboard = document.getElementById('chessboard');
    
        // Create 64 squares
        for (var i = 0; i < 64; i++) {
            var square = document.createElement('div');
            square.classList.add('chess-square');
            chessboard.appendChild(square);
        }
    
        // Add click event to add or remove pieces
        var selectedPiece = '';
        var swap = false

        // Event listener for selecting a piece from the grid
        document.querySelectorAll('#pieceSelection .chess-piece').forEach(function(button) {
            button.addEventListener('click', function() {
                selectedPiece = this.getAttribute('data-piece');
            });
        });
        
        // Event listener for placing the piece on the chessboard
        document.querySelectorAll('#chessboard .chess-square').forEach(function(square) {
            square.addEventListener('click', function() {
                if (swap == true){
                    previous_square.innerHTML = '';
                    previous_square.style.backgroundColor = previous_color;
                    this.innerHTML = selectedPiece;
                    swap = false;
                    return
                }

                if (this.innerHTML == ''){
                    if (selectedPiece) {
                        this.innerHTML = selectedPiece;
                        return
                    }
            }
                if (this.innerHTML !==''){
                    previous_color = this.style.backgroundColor;
                    this.style.backgroundColor = 'cyan';
                    selectedPiece = this.innerHTML;
                    swap = true;
                    previous_square = this;
                    return
                }
            });
        });

        // Event listener for removing the piece on the chessboard
        document.querySelectorAll('#chessboard .chess-square').forEach(function(square) {
            square.addEventListener('contextmenu', function(event) {
                if (swap == false) {
                    this.innerHTML = '';
                    event.preventDefault();

                }
            });
        });

    });

//flappy bird___________________________________________________________________

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// general settings
let gamePlaying = false;
const gravity = .2;
const speed = 3;
const size = [51, 36];
const jump = -8.5;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  // make the pipe and bird moving 
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part 
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // pipe display
  if (gamePlaying){
    pipes.map(pipe => {
      // pipe moving
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // give 1 point & create new pipe
      if(pipe[0] <= -pipeWidth){
        currentScore++;
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);
        
        // remove & create new pipe
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }
    
      // if hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // draw bird
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // tell the browser to perform anim
  window.requestAnimationFrame(render);
}

// launch setup
setup();
img.onload = render;

// start game

document.getElementById('flappybird-section').addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;

//lofi___________________________________________________________________________________________

const playlist = [
    'Assets/Adift.mp3',
    'Assets/Separation.mp3'
    // Add more song URLs
];

let currentTrack = 0;
const player = document.getElementById('lofiPlayer');
var source = document.getElementById('lofiSource');

player.addEventListener('ended', function() {
    currentTrack++;
    if (currentTrack >= playlist.length) {
        currentTrack = 0;
    }
    source.src = playlist[currentTrack];
    player.load();
    player.play()
    console.log('works');

});

// Save the current state to localStorage
function savePlayerState() {
    localStorage.setItem('playerVolume', player.volume);
    localStorage.setItem('playerCurrentTime', player.currentTime);
    // store the index of the current track instead of the URL
    localStorage.setItem('currentTrack', currentTrack);
}

// Load the saved state from localStorage
function loadPlayerState() {
    const savedVolume = localStorage.getItem('playerVolume');
    const savedCurrentTime = localStorage.getItem('playerCurrentTime');
    const savedCurrentTrack = localStorage.getItem('currentTrack');

    if (savedVolume !== null) {
        player.volume = parseFloat(savedVolume);
    }
    if (savedCurrentTime !== null) {
        player.currentTime = parseFloat(savedCurrentTime);
    }
    // restore the previously playing track if available
    if (savedCurrentTrack !== null) {
        currentTrack = parseInt(savedCurrentTrack, 10);
        source.src = playlist[currentTrack];
    }

}

// Event listeners
player.onvolumechange = savePlayerState;
player.ontimeupdate = savePlayerState;

// Load state on page load
document.addEventListener('DOMContentLoaded', loadPlayerState);




    

