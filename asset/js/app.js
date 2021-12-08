const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const menuBtn = $('.menu-icon')
const closeBtn = $('.close-btn')
const menuOption = $('.menu-options')
const volumeInput = $('.volume-input')
const openOption = $('.option-icon_open')
const closeOption = $('.option-icon_close')
const searchOption = $('.search-option')
const searching = $('.searching')
const searchInput = $('.search-input')
const errorName = $('.warn-text span')
const unfound = $('.not-find_box')
const removeBtn = $('.remove-btn')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isSong: false,
    songs:[
        {
        name:"A Town With An Ocean View",
        author: "Kiki's Delivery Service",
        img: './asset/img/ảnh 1.jpg',
        path: './asset/music/yt1s.com - A Town With An Ocean View Bản Gốc Tik Tok  Bản Nhạc Gây Nghiện Tik Tok 2021.mp3'
        },
        {
        name:"Ngẫu Hứng",
        author: "Hoaprox",
        img: "./asset/img/ảnh 2.jpg",
        path: './asset/music/yt1s.com - Hoaprox  Ngẫu Hứng 绘师岸田 Remix  By JodieStarlings.mp3'
        },
        {
        name:"Fly Away",
        author: "The Fat Rat",
        img: "./asset/img/ảnh 3.jpg",
        path: "./asset/music/yt1s.com - TheFatRat  Fly Away feat Anjulie.mp3"
        },
        {
        name:"Nevada",
        author: "Vicetone",
        img: "./asset/img/ảnh 4.jpg",
        path: "./asset/music/yt1s.com - Vicetone  Nevada ft Cozi Zuehlsdorff.mp3"
        },
        {
        name:"Hazy Moon",
        author: "Hatsune Miku",
        img: "./asset/img/ảnh 5.jpg",
        path: "./asset/music/yt1s.com - VietsubHazy MoonÁnh Trăng Huyền ẢoDoraaemon MovieHatsune Miku.mp3"
        },
        {
        name:"Ikson - Anywhere",
        author: "Ikson",
        img: "./asset/img/ảnh 6.jpg",
        path: "./asset/music/song 1.mp3"
        },
        {
        name:"Quan Sơn Tửu",
        author: "关山酒 - 等什么君",
        img: "./asset/img/ảnh 7.jpg",
        path: "./asset/music/song 2.mp3"
        },
        {
        name:"Ampyx",
        author: "Wontolla Remix",
        img: "./asset/img/ảnh 8.jpg",
        path: "./asset/music/song 3.mp3"
        },
        {
        name:"Xomu",
        author: "Lanterns",
        img: "./asset/img/ảnh 9.jpg",
        path: "./asset/music/song 4.mp3"
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
        return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" index="${index}">
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.author}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const cdWidth = cd.offsetWidth
        const cdThumAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumAnimate.pause();
        if(window.innerWidth > 991){
            document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop
                if(newCdWidth > 0){
                cd.style.width = newCdWidth + 'px'
                }
                else{
                cd.style.width = 0;
                }
                cd.style.opacity = newCdWidth / cdWidth
            }
        }
        playBtn.onclick = function() {
            if(app.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
        }
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumAnimate.play()
        }
        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumAnimate.pause()
        }
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        nextBtn.onclick = function() {
            if(app.isRandom){
                app.randomSong();
            }else{
                app.nextSong();
            }
            audio.play();
        }
        prevBtn.onclick = function() {
            if(app.isRandom){
                app.randomSong();
            }else{
                app.prevSong();
            }
            audio.play();
        }
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active',app.isRepeat)
        }
        playList.onclick = function(e) {
            const songNotActive = e.target.closest('.song:not(.active)')
            if(songNotActive || e.target.closest('.option')){
                if(songNotActive){
                    app.currentIndex = Number(songNotActive.getAttribute('index'))
                    app.loadCurrentSong();
                    app.activeSong();
                    audio.play();
                }
            }
        }
        audio.onended = function() {
            if(app.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }
        menuBtn.onclick = function() {
            menuOption.style.width = '240px'
        }
        closeBtn.onclick = function() {
            menuOption.style.width = '0px'
        }
        volumeInput.onchange = function(e) {
            audio.volume = e.target.value / 100
        }
        openOption.onclick = function() {
            searchOption.style.width = '240px'
        }
        closeOption.onclick = function() {
            searchOption.style.width = '0px'
        }
        searchInput.oninput = function(e) {
            var songName = e.target.value
            searching.onclick = function() {
                app.searchSong(songName)
            }
        }
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.activeSong();
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.activeSong();
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong();
        this.activeSong();
    },
    searchSong: function(songName) {
        for(var i = 0;i < app.songs.length;i++){
            if(app.songs[i].name === songName){
                app.currentIndex = i;
                app.isSong = true;
                break;
            }
            else{
                app.isSong = false;
            }
        }
        if(app.isSong === true){
            this.loadCurrentSong();
            this.activeSong();
            audio.play();
        }
        else{
            unfound.style.height = '200px'
            errorName.textContent = `"${songName}"`
            removeBtn.onclick = function() {
                unfound.style.height = '0px'
            }
        }
    },
    activeSong: function(){
        var loopSongs = $$('.song');
        for (song of loopSongs){
            song.classList.remove('active')
        }
        const activeSong = loopSongs[this.currentIndex]
        activeSong.classList.add('active')
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    start: function() {
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
    }
}
    app.start();