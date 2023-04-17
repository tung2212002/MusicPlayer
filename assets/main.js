const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const nameCurSong = $("header h2");
const cdThumb = $("#cd-thumb img");
const audio = $("#audio");
const playBtn = $(".fa-play-circle");
const pauseBtn = $(".fa-pause-circle");
const progress = $("#progress");
const playlist = $("#playlist");
const volum = $(".volum");

const app={
    curIndex: 0,
    isPlay : false,
    isRepeat: false,
    songs: [
        {
            name: 'Anh nhận ra',
            singer: 'Khắc Việt',
            path: './music/music2.mp3',
            image: 'img2'
        },
        {
            name: 'Chỉ anh hiểu em',
            singer: 'Khắc Việt',
            path: './music/music3.mp3',
            image: 'img3'
        },
        {
            name: 'Ngỡ',
            singer: 'Khắc Việt',
            path: './music/music4.mp3',
            image: 'img4'
        },
        {
            name: 'Quên',
            singer: 'Khắc Việt',
            path: './music/music5.mp3',
            image: 'img5'
        },
        {
            name: 'Yêu',
            singer: 'Khắc Việt',
            path: './music/music6.mp3',
            image: 'img6'
        },
        {
            name: 'Yêu lại từ đầu',
            singer: 'Khắc Việt',
            path: './music/music7.mp3',
            image: 'img7'
        },
        {
            name: 'Anh khác hay em khác',
            singer: 'Khắc Việt',
            path: './music/music1.mp3',
            image: 'img1'
        }
    ],
    render : function(){
        var htmls = this.songs.map(function(song,index){
            return ` <div class="song" data-index="${index}">
                        <div class="thumb">
                            <img src="./img/${song.image}.png" alt="">
                        </div>
                        <div class="content">
                            <h3>${song.name}</h3>
                            <p>${song.singer}</p>
                        </div>
                        <div class="options">
                            <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                        </div>
                    </div>`;
        });
        htmls = htmls.join("");
        $("#playlist").innerHTML = htmls;

    },
    handleEvents: function(){
        const _this = this;
        const cd = $("#cd-thumb");
        const cdWidth = cd.offsetWidth;
        const nextBtn = $(".fa-step-forward");
        const prevBtn = $(".fa-step-backward");
        const randomBtn = $(".fa-random");
        const refreshBtn = $(".fa-refresh");

        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || document.scrollTop;
            const newcdWidth = cdWidth- scrollTop;
            cd.style.width = (scrollTop<220||scrollTop===undefined)? (newcdWidth+'px'):0;
            cd.style.opacity = newcdWidth/cdWidth;
        };

        playBtn.onclick = function(){
                audio.play();
                _this.isPlay = true;
                pauseBtn.classList.add('play');
                playBtn.classList.remove('play'); 
                myCircle();
        };
        pauseBtn.onclick= function(){
            audio.pause();
            _this.isPlay= false;
            pauseBtn.classList.remove('play');
            playBtn.classList.add('play');
            clearInterval(myInterval);
            currentAngle = currentAngle % 360;
        };
        audio.ontimeupdate = function(){
            if(audio.duration){
                var progressPer = Math.floor(audio.currentTime/audio.duration*100);
                progress.value = progressPer;
            }
        };

        progress.onchange = function(){
            audio.currentTime = progress.value/100*audio.duration;
        };

        var myInterval;
        var currentAngle = 0;
        function myCircle(){
            myInterval=setInterval(function() {
                currentAngle  += 1;
                cdThumb.style.transform = "rotate(" + currentAngle  + "deg)";
                }, 50);
        };

        nextBtn.onclick = function(){
            _this.nextSong();
            if(_this.isPlay){
                audio.play();
            }
        };
        prevBtn.onclick = function(){
            _this.prevSong();
            if(_this.isPlay){
                audio.play();
            }
        };

        randomBtn.onclick = function(){
            _this.randomSong();
            if(_this.isPlay){
                audio.play();
            }
        };

        audio.onended = function(){
            _this.prevSong();
            if(_this.isPlay){
                audio.play();
            }
        };

        refreshBtn.onclick = function(){
            _this.loadCurSong();
            if(_this.isPlay){
                audio.play();
            }
            else{
                audio.play();
                _this.isPlay = true;
                pauseBtn.classList.add('play');
                playBtn.classList.remove('play'); 
                myCircle(); 
            }
        };

        playlist.onclick = function(e){
            const node = e.target.closest('.song');
            if(node){
                _this.curIndex = node.dataset.index;
                _this.loadCurSong();
                if(_this.isPlay){
                    audio.play();
                }
            }
        };


        volum.onchange = function(){
            audio.volume = volum.value/100;
            this.style.setProperty('--value', volum.value);
            // console.log(volum.value/100)
        }

    },
    defineProperties: function(){
        Object.defineProperty(this, 'curSong', {
            get: function(){
                return this.songs[this.curIndex];
            }
        })
    },
    loadCurSong: function(){
        nameCurSong.innerHTML = this.curSong.name;
        cdThumb.src = `./img/${this.curSong.image}.png`;
        audio.src = this.curSong.path;

    },
    nextSong: function(){
        this.curIndex++;
        if(this.curIndex>=this.songs.length){
            this.curIndex =0;
        }
        this.loadCurSong();
    },

    prevSong: function(){
        this.curIndex--;
        if(this.curIndex<0){
            this.curIndex = this.songs.length;
        }
        this.loadCurSong();
    },

    randomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }while(newIndex === this.curIndex)
        this.curIndex = newIndex;
        this.loadCurSong();
    },

    start : function(){
        this.defineProperties();
        this.loadCurSong();
        this.handleEvents();
        this.render();
    }
}

app.start();