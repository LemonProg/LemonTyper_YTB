let videoField = document.querySelector('#videoLink');
let player;
let volumeRange = document.querySelector('#volume');
let h1 = document.querySelector('h1');
let nextlyrics = document.querySelector('h3');
let typer = document.querySelector('#typer');

typer.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
    }
});

var datas;

videoField.addEventListener('change', () => {
    link = videoField.value;
    id = link.split('v=')[1];

    fetch("http://127.0.0.1:3000/subs", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        data.subs.forEach(sub => {
            if (sub.text.includes("♪")) {
                sub.text = sub.text.replace(/♪/g, "");
                sub.text = sub.text.trimStart();
                sub.text = sub.text.trim();
                sub.text = sub.text.replace('\n', " ")
            }
            if (sub.text.includes("[")) {
                sub.text = sub.text.replace(/\[.*?\]/g, "");
                sub.text = sub.text.trim();
            }
        });
        datas = data;
    })
});


function onYouTubeIframeAPIReady() {
    
    videoField.addEventListener('change', () => {
        link = videoField.value;
        id = link.split('v=')[1];
    
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: id,
            playerVars: { 
                'autoplay': 0, 
                'controls': 0,
                'cc_load_policy' : 0 
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    });

    function onPlayerReady(event) {
        user = event.target;

        volumeRange.addEventListener('change', () => {
            user.setVolume(volumeRange.value);
        });
        
        // user.seekTo(datas.subs[0].start - 1);
    }
    
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            typer.focus();

            // Focus on input when clicking somewhere else
            document.addEventListener('click', () => {
                typer.focus();
            })

            typer.addEventListener('input', () => {
                text = h1.textContent.split('');
                array_letters = typer.value.split('');
                
                last_input = array_letters[array_letters.length -1];
                last_text = text[array_letters.length - 1]
            
                if (last_input === last_text) {
                    console.log("correct");
                } else {
                    typer.value = typer.value.slice(0, -1);
                }
                if (h1.textContent === typer.value) {
                    typer.style.color = "#4afb26";
                }
            });

            loopTime = setInterval(() => {
                currentTime = player.getCurrentTime().toFixed(1);
                
                if (datas) {
                    subs = datas.subs;

                    for (let i = 0; i < subs.length; i++) {
                        start_sub = subs[i].start.toFixed(1);
                        if (start_sub === currentTime) {
                            h1.textContent = subs[i].text.toLowerCase();
                            nextlyrics.textContent = subs[i + 1].text.toLowerCase();
                            typer.value = "";
                            typer.style.color = "#10b6d0";
                        } 
                    }
                }

            }, 50);
        }
        if (event.data === YT.PlayerState.PAUSED) {
            clearInterval(loopTime);
        }
    }
}