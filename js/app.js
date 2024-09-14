document.addEventListener('DOMContentLoaded', function() {
    const gameBtn = document.getElementById('game-btn');
    const gameSelectionScreen = document.getElementById('game-selection-screen');
    const gameScreen = document.getElementById('game-screen');
    const topScreen = document.getElementById('top-screen');
    const skyChallengeGameScreen = document.getElementById('sky-challenge-game-screen');
    const hideAndSeekGameScreen = document.getElementById('hide-and-seek-game-screen');
    const backToMainGameBtn = document.getElementById('back-to-main-game');
    const backToMainSky = document.getElementById('back-to-main-sky');
    const backToMainHide = document.getElementById('back-to-main-hide');

//ポテトキャッチ
    const scoreDisplay = document.getElementById('score');
    const snackCatchCanvas = document.getElementById('snack-catch-canvas');
    const ctx = snackCatchCanvas.getContext('2d');
    const descriptionBox = document.createElement('div'); 
    let score = 0;
    let snacks = [];
    let snackSpeed = 2;

    const snackImage = new Image();
    snackImage.src = './img/cupcake.png'; 

    const backgroundImage = new Image();
    backgroundImage.src = './img/gamebackground.png'; 

    const catcherImage = new Image();
    catcherImage.src = './img/kago.png'; 
    
    const vegetableImages = [
        new Image(),
        new Image(),
        new Image()
    ];
    vegetableImages[0].src = './img/vegetable1.png'; 
    vegetableImages[1].src = './img/vegetable2.png'; 
    vegetableImages[2].src = './img/vegetable3.png'; 
    

    let catcher = { x: 400, y: 400, width: 190, height: 190 };


    // 「START」ボタンを押すとゲーム選択画面を表示
    gameBtn.addEventListener('click', function() {
        gameSelectionScreen.style.display = 'block';
        topScreen.style.display = 'none';
        createGameSelectionScreen();
    });
    

    // ゲーム選択画面の作成
    function createGameSelectionScreen() {
        const gameSelectionHTML = `
            <h2>ゲームを選んでね</h2>
            <div id="game-selection-container">
                <div class="game-option" data-game="snackCatch">
                    <img src="./img/snack_catch_game.png" alt=もものポテトキャッチ">
                    <p>もものポテトキャッチ</p>
                </div>
                <div class="game-option" data-game="skyChallenge">
                    <img src="./img/fly_dai_game.png" alt="だいの空への挑戦">
                    <p>だいの空への挑戦</p>
                </div>
                <div class="game-option" data-game="hideAndSeek">
                    <img src="./img/hide_and_seek_game.png" alt="ももだいのかくれんぼ">
                    <p>ももだいのかくれんぼ</p>
                </div>
            </div>
        `;
        gameSelectionScreen.innerHTML = gameSelectionHTML;

        // 説明表示用の要素を追加
        descriptionBox.style.border = '1px solid #333';
        descriptionBox.style.padding = '10px';
        descriptionBox.style.marginTop = '20px';
        descriptionBox.textContent = 'ゲームの説明をここに表示するよ';
        gameSelectionScreen.appendChild(descriptionBox);

        // 各ゲーム選択のイベントリスナーを設定
        const gameOptions = document.querySelectorAll('.game-option');
        gameOptions.forEach(option => {
            option.addEventListener('mouseenter', function() {
                const selectedGame = option.getAttribute('data-game');
                displayGameDescription(selectedGame);
            });
            option.addEventListener('click', function() {
                const selectedGame = option.getAttribute('data-game');
                startSelectedGame(selectedGame);
            });
        });
    }


    // ゲームの説明を表示する関数
    function displayGameDescription(game) {
        let description = '';
        switch (game) {
            case 'snackCatch':
                description = 'ももの大好物、ポテトをキャッチしてポイントを集めよう！野菜をキャッチするとポイントが減るから注意！';
                break;
            case 'skyChallenge':
                description = '空を飛びたいだいが風船を使って空を飛ぶ挑戦！障害物を避けながら風船を集めよう';
                break;
            case 'hideAndSeek':
                description = 'ももとだいが公園に隠れるよ。制限時間内に見つけ出そう！';
                break;
            default:
                description = '不明なゲームだよ';
        }
        descriptionBox.textContent = description;
    }

    // 選択したゲームに応じてスタート
    function startSelectedGame(game) {
        gameSelectionScreen.style.display = 'none';

        switch (game) {
            case 'snackCatch':
                gameScreen.style.display = 'block';
                startSnackCatchGame();
                break;
            case 'skyChallenge':
                skyChallengeGameScreen.style.display = 'block';
                startSkyChallengeGame();
                break;
            case 'hideAndSeek':
                hideAndSeekGameScreen.style.display = 'block';
                startHideAndSeekGame();
                break;
            default:
                console.error('不明なゲームが選択されたよ');
        }
    }

    // お菓子キャッチゲームの開始
    function startSnackCatchGame() {
        snacks = [];
        score = 0;
        snackSpeed = 2; // スピードをリセット
        scoreDisplay.textContent = score;
        createSnack();
        requestAnimationFrame(updateSnackCatchGame);
    }

    // お菓子または野菜を作成する関数
function createSnack() {
    const isVegetable = Math.random() > 0.5; // 50%の確率で野菜かお菓子を生成
    const snack = {
        x: Math.random() * (snackCatchCanvas.width - 20),
        y: 0,
        width: 40,
        height: 40,
        isVegetable: isVegetable,
        vegetableType: isVegetable ? Math.floor(Math.random() * 3) : null // 野菜の場合、どの野菜かをランダムで選択
    };
    snacks.push(snack);
}

// ゲーム画面の更新処理
function updateSnackCatchGame() {
    ctx.clearRect(0, 0, snackCatchCanvas.width, snackCatchCanvas.height);

    // 背景画像を描画
    ctx.drawImage(backgroundImage, 0, 0, snackCatchCanvas.width, snackCatchCanvas.height);

    // キャッチャーを描画
    ctx.drawImage(catcherImage, catcher.x, catcher.y, catcher.width, catcher.height);

    snacks.forEach((snack, index) => {
        snack.y += snackSpeed;

        // お菓子か野菜を描画
        if (snack.isVegetable) {
            ctx.drawImage(vegetableImages[snack.vegetableType], snack.x, snack.y, snack.width, snack.height);
        } else {
            ctx.drawImage(snackImage, snack.x, snack.y, snack.width, snack.height);
        }

        // キャッチ判定
        if (snack.y + snack.height >= catcher.y && snack.x + snack.width > catcher.x && snack.x < catcher.x + catcher.width) {
            if (snack.isVegetable) {
                score--; // 野菜をキャッチしたらスコアを1減らす
                showNegativeEffect(); // ネガティブエフェクト
            } else {
                score++; // お菓子をキャッチしたらスコアを1増やす
                showPositiveEffect(); // ポジティブエフェクト
            }

            scoreDisplay.textContent = score;
            snacks.splice(index, 1); // キャッチしたアイテムを削除
            createSnack(); // 新しいアイテムを生成

            // 10ポイントごとに特別演出
            if (score > 0 && score % 10 === 0) {
                specialEffect();
            }
        }

        // 画面外に出たアイテムを削除
        if (snack.y > snackCatchCanvas.height) {
            snacks.splice(index, 1);
            createSnack();
        }
    });

    requestAnimationFrame(updateSnackCatchGame);
}

    // キャッチャーの移動処理
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && catcher.x > 0) {
            catcher.x -= 25; // 左に移動
        } else if (e.key === 'ArrowRight' && catcher.x < snackCatchCanvas.width - catcher.width) {
            catcher.x += 25; // 右に移動
        }
    });

    // 「戻る」ボタンの処理
    backToMainGameBtn.addEventListener('click', function() {
        gameScreen.style.display = 'none';
        gameSelectionScreen.style.display = 'block';
    });

    // ポジティブエフェクト
    function showPositiveEffect() {
        let ringSize = 30;
        let opacity = 1;

        function drawRing() {
            ctx.beginPath();
            ctx.arc(catcher.x + catcher.width / 2, catcher.y + catcher.height / 2, ringSize, 0, Math.PI * 2, false);
            ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`; // 金色の光
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.closePath();

            ringSize += 5;
            opacity -= 0.05;

            if (opacity > 0) {
                requestAnimationFrame(drawRing); // 再度描画をリクエスト
            }
        }

        drawRing(); // 最初に描画を開始
    }

    // ネガティブエフェクト
    function showNegativeEffect() {
        let opacity = 0;

        function darken() {
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // 黒で画面を暗くする
            ctx.fillRect(0, 0, snackCatchCanvas.width, snackCatchCanvas.height);
            opacity += 0.1;

            if (opacity < 1) {
                requestAnimationFrame(darken); // 画面を徐々に暗くする
            } else {
                setTimeout(lighten, 500); // 真っ暗な状態を維持してから明るく戻す
            }
        }

        function lighten() {
            let lightenOpacity = 1;

            function lightenScreen() {
                ctx.clearRect(0, 0, snackCatchCanvas.width, snackCatchCanvas.height);
                ctx.fillStyle = `rgba(0, 0, 0, ${lightenOpacity})`;
                ctx.fillRect(0, 0, snackCatchCanvas.width, snackCatchCanvas.height);
                lightenOpacity -= 0.1;

                if (lightenOpacity > 0) {
                    requestAnimationFrame(lightenScreen); // 徐々に画面を明るくする
                }
            }

            lightenScreen(); // 明るくする処理の開始
        }

        darken(); // 暗くする処理の開始
    }

    // 10ポイントごとに紙吹雪
    function specialEffect() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

//空への挑戦
    const skyChallengeCanvas = document.getElementById('sky-challenge-canvas');
    const skyCtx = skyChallengeCanvas.getContext('2d');
    const skyScoreDisplay = document.getElementById('sky-score');
    let skyScore = 0;
    let dai = { x: 225, y: 360, width: 190, height: 190 };
    let stars = [];
    let obstacles = [];
    let gravity = 0.3;
    let lift = -10;
    let velocity = 0;
    let isFlying = false;
    let isMovingLeft = false;
    let isMovingRight = false;

    // 画像の読み込み
    const daiImage = new Image();
    daiImage.src = './img/dai.png'; // だいの画像パス

    const balloonImage = new Image();
    balloonImage.src = './img/balloon.png'; // 風船の画像パス

    const birdImage = new Image();
    birdImage.src = './img/bird.png'; // 鳥（障害物）の画像パス

    const skyBackgroundImage = new Image();
    skyBackgroundImage.src = './img/sky_background.png'; // 背景の画像パス



    // だいの飛行開始処理
    function startSkyChallengeGame() {
        stars = [];
        obstacles = [];
        skyScore = 0;
        velocity = 0;
        skyScoreDisplay.textContent = skyScore;
        createStar();
        createObstacle();
        requestAnimationFrame(updateSkyChallengeGame);
    }

    // 風船を作成する関数
    function createStar() {
        const star = {
            x: Math.random() * (skyChallengeCanvas.width - 20),
            y: 0,
            width: 250,
            height: 250
        };
        stars.push(star);
    }

    // 障害物を作成する関数
    function createObstacle() {
        const obstacle = {
            x: Math.random() * (skyChallengeCanvas.width - 50),
            y: 0,
            width: 170,
            height: 170
        };
        obstacles.push(obstacle);
    }

 // 左右の動きを制御するための関数
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = true; // 左移動を開始
    }
    if (e.key === 'ArrowRight') {
        isMovingRight = true; // 右移動を開始
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = false; // 左移動を停止
    }
    if (e.key === 'ArrowRight') {
        isMovingRight = false; // 右移動を停止
    }
});

let skyBackgroundY = 0; // 背景のY座標（背景が上昇するように見せるため）

// ゲームの更新処理
function updateSkyChallengeGame() {
    // 背景画像を描画して上昇させる
    skyCtx.clearRect(0, 0, skyChallengeCanvas.width, skyChallengeCanvas.height);
    skyCtx.drawImage(skyBackgroundImage, 0, skyBackgroundY, skyChallengeCanvas.width, skyChallengeCanvas.height);
    skyCtx.drawImage(skyBackgroundImage, 0, skyBackgroundY - skyChallengeCanvas.height, skyChallengeCanvas.width, skyChallengeCanvas.height);

    skyBackgroundY += 2; // 背景が上昇しているように見せる
    if (skyBackgroundY >= skyChallengeCanvas.height) {
        skyBackgroundY = 0; // 背景をループさせる
    }

    // 重力と上昇力の計算
    if (isFlying) {
        velocity += lift;
        isFlying = false;
    }
    velocity += gravity;
    dai.y += velocity;

    // 左右の移動処理
    if (isMovingLeft && dai.x > 0) {
        dai.x -= 5; // 左に移動
    }
    if (isMovingRight && dai.x < skyChallengeCanvas.width - dai.width) {
        dai.x += 5; // 右に移動
    }

    // だいの移動制限
    if (dai.y > skyChallengeCanvas.height - dai.height) {
        dai.y = skyChallengeCanvas.height - dai.height;
        velocity = 0;
    }

    // だいを描画
    skyCtx.drawImage(daiImage, dai.x, dai.y, dai.width, dai.height);

    // 風船を描画し、キャッチ判定
    stars.forEach((star, index) => {
        star.y += 2;
        skyCtx.drawImage(balloonImage, star.x, star.y, star.width, star.height); // 風船の画像を描画

        // キャッチ判定
        if (star.y + star.height >= dai.y && star.x + star.width > dai.x && star.x < dai.x + dai.width) {
            skyScore++;
            skyScoreDisplay.textContent = skyScore;
            stars.splice(index, 1);
            createStar(); 
        }

        if (star.y > skyChallengeCanvas.height) {
            stars.splice(index, 1);
            createStar();
        }
    });

    // 障害物を描画し、衝突判定
    obstacles.forEach((obstacle, index) => {
        obstacle.y += 3;
        skyCtx.drawImage(birdImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height); // 障害物（鳥）を描画

        // 衝突判定
        if (obstacle.y + obstacle.height >= dai.y && obstacle.x + obstacle.width > dai.x && obstacle.x < dai.x + dai.width) {
            alert('障害物にぶつかった！ゲームオーバー');
            startSkyChallengeGame(); // ゲームリセット
        }

        if (obstacle.y > skyChallengeCanvas.height) {
            obstacles.splice(index, 1);
            createObstacle();
        }
    });

    requestAnimationFrame(updateSkyChallengeGame);
}

    // タップまたはクリックでだいを上昇させる
    skyChallengeCanvas.addEventListener('mousedown', function() {
        isFlying = true;
    });

    
//かくれんぼ
    const hideAndSeekCanvas = document.getElementById('hide-and-seek-canvas');
    const hideAndSeekScoreDisplay = document.getElementById('hide-and-seek-score');
    let hideAndSeekScore = 0; 

    const hideAndSeekCtx = hideAndSeekCanvas.getContext('2d');
    const timeDisplay = document.getElementById('time-remaining');

    // ももとだいの画像
    const momoImage = new Image();
    momoImage.src = './img/momo2.png'; // ももの画像のパス

    const daiCharacterImage = new Image(); // 変数名を変更
    daiCharacterImage.src = './img/dai2.png'; // だいの画像のパス

    // 背景画像
    const forestBackgroundImage = new Image();
    forestBackgroundImage.src = './img/forest.png'; // 森の背景画像のパス

    let momoAndDai = []; // ももとだいの位置を保持
    let isGameOver = false;
    let timeRemaining = 30;

    // ももだいを隠す処理
    function startHideAndSeekGame() {
        timeRemaining = 30;
        isGameOver = false;
        timeDisplay.textContent = timeRemaining;

        // ももとだいのランダムな位置を設定
        momoAndDai = [
            { x: Math.random() * (hideAndSeekCanvas.width - 180), y: Math.random() * (hideAndSeekCanvas.height - 180), img: momoImage },
            { x: Math.random() * (hideAndSeekCanvas.width - 180), y: Math.random() * (hideAndSeekCanvas.height - 180), img: daiCharacterImage } // 変数名を変更
        ];

        requestAnimationFrame(updateHideAndSeekGame);
        startTimer();
    }

    // ゲームの更新処理（背景とイラストの描画）
    function updateHideAndSeekGame() {
        if (isGameOver) return;

        // 背景を描画
        hideAndSeekCtx.drawImage(forestBackgroundImage, 0, 0, hideAndSeekCanvas.width, hideAndSeekCanvas.height);

        // ももとだいを描画
        momoAndDai.forEach(character => {
            hideAndSeekCtx.drawImage(character.img, character.x, character.y, 180, 180); // ももやだいのイラストを描画
        });

        requestAnimationFrame(updateHideAndSeekGame);
    }

    // クリックでキャッチ判定
hideAndSeekCanvas.addEventListener('click', function(e) {
    const rect = hideAndSeekCanvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    momoAndDai.forEach((character, index) => {
        if (clickX >= character.x && clickX <= character.x + 180 && clickY >= character.y && clickY <= character.y + 180) {
            alert(index === 0 ? 'ももを見つけた！' : 'だいを見つけた！');
            momoAndDai.splice(index, 1); // 見つけたキャラクターを削除
            hideAndSeekScore++; // 1ポイント追加
            hideAndSeekScoreDisplay.textContent = hideAndSeekScore; // スコアを更新

            if (momoAndDai.length === 0) {
                isGameOver = true;
                alert('全員見つけた！クリア！');
            }
        }
    });
});


    // タイマー処理
    function startTimer() {
        const timerInterval = setInterval(function() {
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                isGameOver = true;
                alert('時間切れ！ゲームオーバー');
            } else {
                timeRemaining--;
                timeDisplay.textContent = timeRemaining;
            }
        }, 1000);
    }

    // 「戻る」ボタンの処理
    backToMainSky.addEventListener('click', function() {
        skyChallengeGameScreen.style.display = 'none';
        gameSelectionScreen.style.display = 'block';
    });

    backToMainHide.addEventListener('click', function() {
        hideAndSeekGameScreen.style.display = 'none';
        gameSelectionScreen.style.display = 'block';
    });



});





