function acceptLogin(){   
    startGame();
};

function startGame() {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var ballX = 400;
    var ballY = 200;
    var directionX = true;
    var directionY = true;
    var paddle1Y = 25;
    var paddle2Y = 25;
    var Acc1Prev = 0; 
    var Acc2Prev = 0; 
    var p1Score = 0; 
    var p2Score = 0; 
    
    var socket = io.connect('http://128.237.126.96:3000/');
    socket.on('receive', function(data){
        // console.log('Got this: ' + data.player);
        // console.log(data.y);
        if (data.player == '1'){
            if (Math.abs(data.y) > Acc1Prev){
                if (paddle1Y <= 398)
                    paddle1Y += 2;
            }
            else{
                if (paddle1Y >= 2)
                    paddle1Y -= 2;
            }
            Acc1Prev = data.y; 
        }
        if (data.player == '2'){
            if (Math.abs(data.y) > Acc2Prev){
                if (paddle2Y + 2 <= 400)
                    paddle2Y += 2;
            }
            else{
                if (paddle2Y - 2 >= 0)
                    paddle2Y -= 2;
            }
            Acc2Prev = data.y; 
        }
    })

    canvas.setAttribute('tabindex','0');
    canvas.focus();
    ctx.fillStyle ='rgb(256,256,256)';
    
    drawPaddles(25,25);
    
    setInterval(drawBall, 50);
    
    function resetPlay(){
        ballX = 400;
        ballY = 200;
        // if (directionX = true) directionX = false;
        // else directionX = true; 
    }

    function drawPaddles(y1, y2){
        ctx.save();
        ctx.fillRect(25, y1, 20, 150);
        ctx.fillRect(755, y2, 20, 150);
        ctx.restore();
    };
    
    function drawBall(){
        ctx.fillStyle ='rgb(256,256,256)';
        ctx.clearRect(0,0,800,550);  
        
        ctx.fillRect(398, 0, 4, 550);
        
        checkCollisions();
        if(directionX)
        {
            ballX +=10;
            if (directionY)
                ballY +=10;
            else
                ballY -=10;
            ctx.beginPath();
            ctx.arc(ballX,ballY,20,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        else
        {
            ballX -=10;
            if (directionY)
                ballY +=10;
            else
                ballY -=10;
            ctx.beginPath();
            ctx.arc(ballX,ballY,20,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        // drawScore(); 
        drawPaddles(paddle1Y, paddle2Y);
        drawFooter();
    };
    
    function drawFooter(){
        ctx.fillStyle ='rgb(155,155,155)';
        ctx.fillRect(0, 550, 800, 80);
        drawScore();
    }

    function drawScore(){
        ctx.font = "20px Arial";
        ctx.fillStyle = 'rgb(256,256,256)';
        ctx.fillText('Scores:', 368, 575);
        ctx.fillText('Player 1:' + p1Score, 200, 610);
        ctx.fillText('Player 2:' + p2Score, 485, 610);
    }

    function checkCollisions(){
        if (ballX <= 68) {
            if (paddle1Y < ballY && (paddle1Y+150) > ballY)
                directionX = true;
            else{
                if (ballX < 0){
                    // console.log('Player 2 Scored!');
                    p2Score++; 
                    resetPlay();
                }
            }
        }
        if (ballX >= 732){
            if (paddle2Y < ballY && (paddle2Y+150) > ballY)
                directionX = false;
            else{
                if (ballX > 800){
                    // console.log('Player 1 Scored!'); 
                    p1Score++;
                    resetPlay();
                }
            }
        }
        if (ballY >= 530) directionY = false;
        if (ballY <= 20) directionY = true;
    }
}
