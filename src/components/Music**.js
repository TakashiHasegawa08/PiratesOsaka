import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Music() {
  useEffect(() => {
    let source; // オーディオソースを保持するためのグローバル変数

    const playBtn = document.querySelector(".player-timer-btn");
    const song = document.querySelector(".song");
    const sounds = document.querySelectorAll(".soundList-item");
    const player = document.querySelector(".player");
    const volumeControl = document.getElementById("volumeControl");

    const setInitialSong = () => {
      const initialSound = sounds[0];
      const songData = initialSound.getAttribute("data-sound");
      const imageUrl = initialSound.getAttribute("data-image");
      const startTime = initialSound.getAttribute("data-start-time");

      song.src = songData;
      player.style.backgroundImage = `url(${imageUrl})`;

      song.addEventListener(
        "loadedmetadata",
        () => {
          song.currentTime = startTime;
        },
        { once: true }
      );
    };

    const canvas = document.getElementById("audioVisualizer");
    const ctx = canvas.getContext("2d");
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();
    let dataArray, bufferLength;

    const initAudioVisualizer = () => {
      if (!source) {
        source = audioCtx.createMediaElementSource(song);
        source.connect(analyser);
      }
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 2048;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      drawVisualizer();
    };

    let animationId;

    const drawVisualizer = () => {
      animationId = requestAnimationFrame(drawVisualizer);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let barWidth = canvas.width / 180;
      let barHeight;
      let x = 0;

      for (let i = 0; i < 60; i++) {
        let index = Math.floor((i * bufferLength) / 130);
        barHeight = dataArray[index] / 3;

        ctx.fillStyle = "rgb(255, 255, 255,0.6)";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth * 3;
      }
    };

    song.addEventListener("ended", () => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const fadeIn = (duration = 1) => {
      let volume = 0;
      song.volume = volume;
      const interval = setInterval(() => {
        volume += 1 / (duration * 60);
        if (volume >= 1) {
          volume = 1;
          clearInterval(interval);
        }
        song.volume = volume;
      }, 1000 / 60);
    };

    const fadeOut = (duration = 0.1, callback = () => {}) => {
      let volume = song.volume;
      const interval = setInterval(() => {
        volume -= 1 / (duration * 20);
        if (volume <= 0) {
          volume = 0;
          clearInterval(interval);
          callback();
        }
        song.volume = volume;
      }, 1000 / 60);
    };

    playBtn.addEventListener("click", () => {
      if (song.paused) {
        const playSong = () => {
          fadeIn();
          song.play();
          playBtn.src = "common/image/stop.svg";
          if (audioCtx.state === "suspended") {
            audioCtx.resume();
          }
          initAudioVisualizer();

          song.removeEventListener("canplaythrough", playSong);
        };

        song.addEventListener("canplaythrough", playSong);
        song.load();
      } else {
        fadeOut(3, () => {
          song.pause();
          playBtn.src = "common/image/play.svg";
          audioCtx.suspend();
          cancelAnimationFrame(animationId);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
      }
    });

    sounds.forEach((sound) => {
      sound.addEventListener("click", function () {
        const songData = this.getAttribute("data-sound");
        const imageUrl = this.getAttribute("data-image");
        const startTime = parseFloat(this.getAttribute("data-start-time"));

        song.src = songData;
        player.style.backgroundImage = `url(${imageUrl})`;
        playBtn.src = "common/image/play.svg";

        song.addEventListener("loadedmetadata", () => {
          song.currentTime = startTime;
        });

        initAudioVisualizer();

        if (!song.paused) {
          song.pause();
        }
      });
    });

    setInitialSong();

    volumeControl.addEventListener("input", () => {
      song.volume = volumeControl.value;
    });

    return () => {
      audioCtx.close(); // AudioContext を解放
    };
  }, []);

  // 楽曲データ
  const soundList = [
    // Do Dance feat.MaiShiroi
    {
      title: "Do Dance feat.MaiShiroi",
      sound: "/sounds/DoDance.mp3",
      image: "/img/music_img/Do_Dance_jacket_3000px.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/do-dance-single/1779931690",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/album/3PiKXmnE3iM2bVAko6ZQkR",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/watch?v=OcirHxnXfEw&si=0ucipZI-QjgYNsaD",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://amazon.co.jp/music/player/albums/B0DN6GD92N",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/launch?target=album&item=mb0000000004003f80",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://n0.com/a/vvg3fenyenhm",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Gravity of Kiss feat.よつは
    {
      title: "Gravity of Kiss feat.よつは",
      sound: "/sounds/track12_GravityofKiss.mp3",
      image: "/img/music_img/jacket12_Gravity_of_Kiss.webp",
      startTime: 59,
      stores: [
        {
          href: "https://x.gd/DBdmo",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://x.gd/vsXA9",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://x.gd/N0n4V",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://x.gd/AvzUU",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://lin.ee/PAEIgps",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/dix4qwey",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Missing You feat.kyon.
    {
      title: "Missing You feat.kyon.",
      sound: "/sounds/track17_MissingYou.mp3",
      image: "/img/music_img/jacket17_MissingYou.webp",
      startTime: 61,
      stores: [
        {
          href: "https://music.apple.com/jp/album/missing-you-single/1760536530",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/1PbNitz3wjzzaSTch93FaM?si=Xo7-tNiVS1Kg3fsWT9s-xw",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/watch?v=6MOXo_BZG_E&si=0Mdjr3OxQLrTY0Fs",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://music.amazon.co.jp/albums/B0DBVKCXMP?marketplaceId=A1VC38T7YXB528&musicTerritory=JP&ref=dm_sh_d6cYq1gJrQvo5adb3geUlSHVd",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://lin.ee/ZTcF3HQ",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/4iwrck9v",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // トワイライト ドライブ feat.kyon.
    {
      title: "トワイライト ドライブ feat.kyon.",
      sound: "/sounds/track16_Twilight_Drive.mp3",
      image: "/img/music_img/jacket16_Twilight_Drive.webp",
      startTime: 61,
      stores: [
        {
          href: "https://music.apple.com/jp/album/twilight-drive-feat-kyon-single/1756850850",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/4kMfjMXlXw7WWlCLQTg7yz",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/search?q=%22%E3%83%88%E3%83%AF%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88+%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96+feat.kyon.%22+%22T.HASE%22",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://amazon.co.jp/music/player/albums/B0D97NLYNV?marketplaceId=A1VC38T7YXB528&musicTerritory=JP&ref=dm_sh_CihESJYqFolPVsKGIl6cI9tDQ",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/launch?target=album&item=mb0000000003bfd6f8&cc=JP&v=1",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/erynwuk3",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Chance in the Moment feat.suna
    {
      title: "Chance in the Moment feat.suna",
      sound: "/sounds/track04_Chance_in_the_moment.mp3",
      image: "/img/music_img/jacket04_Chance_in_the_moment.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/chance-in-the-moment-feat-suna-single/1703934373",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/7ylve4P6W9O9UV66b73daE",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_lj0OYrRC5hLTak-dM2T__V2_IgFMvnWsY",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0CGCBNWZG/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&keywords=%22Chance+in+the+Moment+feat.suna%22+%22T.HASE%22&marketplaceId=A1VC38T7YXB528&musicTerritory=JP&qid=1702172315&s=dmusic&sr=1-1&trackAsin=B0CGCBNWZG",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb000000000305b125",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/4z0j71t9",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Hurry up! feat.イズキ
    {
      title: "Hurry up! feat.イズキ",
      sound: "/sounds/track15_HurryUp.mp3",
      image: "/img/music_img/jacket15_HurryUp.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/hurry-up-single/1747675156",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/track/4UxU6ShWJhXQJw8O3o6cju",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/watch?v=91JuqDaTW14",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0D4TRW6RR/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&dib=eyJ2IjoiMSJ9.L6BwdOyqrfQ3MyLLT8KO2uM3Mits_p59wIif4j07WFE.y8_VXzp-XOiyxm-KqzAvkUl_4V67_s9FTeXeowht_v4&dib_tag=se&keywords=%22Hurry+up%21+feat.%E3%82%A4%E3%82%BA%E3%82%AD%22+%22T.HASE%22&qid=1717212228&s=dmusic&sr=1-1",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb0000000003a59f45",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/fbwt48v9",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    //  Farewell Song feat.花摘藍
    {
      title: "Farewell Song feat.花摘藍",
      sound: "/sounds/track14_Farewell_Song.mp3",
      image: "/img/music_img/jacket14_Farewell_Song.webp",
      startTime: 59,
      stores: [
        {
          href: "https://music.apple.com/jp/album/farewell-song-single/1745492377",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/album/20inEHWpdqHyHdS99j2W3c",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/watch?v=Y918MG8qy2o",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0D3PMT7PS/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&dib=eyJ2IjoiMSJ9.vFPCyEYqXI3s8cx_twdWsbuomhD4EOjffQ0MCZPkGC0.oKb-E6noa7lld8yBlmgtUuGzyFUEeEZ4tCVEEVN8gJk&dib_tag=se&keywords=%22Farewell+Song+feat.%E8%8A%B1%E6%91%98%E8%97%8D%22+%22T.HASE%22&marketplaceId=A1VC38T7YXB528&musicTerritory=JP&qid=1715481382&s=dmusic&sr=1-1&trackAsin=B0D3PMT7PS",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/launch?target=album&item=mb00000000039ea8f4&cc=JP&v=1",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/nzmcy815",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // 真と偽 feat.amane
    {
      title: "真と偽 feat.amane",
      sound: "/sounds/track13_shintogi.mp3",
      image: "/img/music_img/jacket13_shintogi.webp",
      startTime: 59,
      stores: [
        {
          href: "https://music.apple.com/jp/album/true-and-false-single/1745492111",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/album/1Wt7atHECHeUPxEV4XbzNH",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_mJ-MBpp9CITGeBrqrCdqAAn3naMOJQI80",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://x.gd/Ildqk",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/launch?target=album&item=mb00000000039ea8e3&cc=JP&v=1",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/rzn3esad",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // ラスト ステーション feat.amane
    {
      title: "ラスト ステーション feat.amane",
      sound: "/sounds/track11_last_station.mp3",
      image: "/img/music_img/jacket11_last_station.webp",
      startTime: 45,
      stores: [
        {
          href: "https://x.gd/ftmlk",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://x.gd/RYuf4",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://x.gd/qpw26",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://x.gd/IkiLH",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://lin.ee/UvEaiC0",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/gi5y0xk8",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },

    // J-O-Y
    {
      title: "J-O-Y feat.イズキ",
      sound: "/sounds/track01_JOY.mp3",
      image: "/img/music_img/jacket01_JOY.webp",
      startTime: 48,
      stores: [
        {
          href: "https://music.apple.com/jp/album/j-o-y-single/1719230413",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/0k3wkTKAUWXmePjtZHgilh",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_kkag7zwy4pLGyA_M779dHD09_lN62pKTk",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0CP8Q5TCJ/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=3C2WO5PY0SQJ1&keywords=J-O-Y+feat.%E3%82%A4%E3%82%BA%E3%82%AD&marketplaceId=A1VC38T7YXB528&musicTerritory=JP&qid=1702171948&s=dmusic&sprefix=j-o-y+feat.%E3%82%A4%E3%82%BA%E3%82%AD%2Cdigital-music%2C146&sr=1-1&trackAsin=B0CP8Q5TCJ",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb00000000033e848e",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/wgx9f31i",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Fallin' Angels feat.Sammy
    {
      title: "Fallin' Angels feat.Sammy",
      sound: "/sounds/track02_Fallin_Angels.mp3",
      image: "/img/music_img/jacket02_Fallin_Angels.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/fallin-angels-feat-sammy-single/1719230372",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/0JWzy9IfLeacHRrbIlOTFK",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_nh2de2NYhgLfVzq5oxfcAILj9ML6ZXbxE",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0CP8RKSM5/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&keywords=%22Fallin%27+Angels+feat.Sammy%22+%22T.HASE%22&marketplaceId=A1VC38T7YXB528&musicTerritory=JP&qid=1702171780&s=dmusic&sr=1-1&trackAsin=B0CP8RKSM5",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb00000000033e848f",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/pi3fr6dv",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },

    // C'mon C'mon!
    {
      title: "C'mon C'mon!",
      sound: "/sounds/track05_Cmon_Cmon.mp3",
      image: "/img/music_img/jacket05_Cmon_Cmon.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/cmon-cmon-single/1692605643",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/5aLuf8tepCnK2qRjiGipWB",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_maQMG2SB4OyGIzNSOVp4SMzgZFYGtBHUQ",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0C7ZH7J89/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&keywords=%22C%27mon+C%27mon%21%22+%22T.HASE%22&qid=1702172422&s=dmusic&sr=1-1",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/search/albums?query=C%27mon%20C%27mon%21%20T.HASE",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/3warn27j",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },

    // 紫陽花 feat.Y
    {
      title: "紫陽花 feat.Y",
      sound: "/sounds/track06_ajisai.mp3",
      image: "/img/music_img/jacket06_ajisai.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/hydrangea-single/1687637990",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/6c5x0B4uCnuKoao55UAL33",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_mJBEdduxi38dBVYCNU436gWVEb6oZRS4E",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0C5CX3VBH/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&keywords=%22%E7%B4%AB%E9%99%BD%E8%8A%B1+feat.Y%22+%22T.HASE%22&marketplaceId=A1VC38T7YXB528&musicTerritory=JP&qid=1702172475&s=dmusic&sr=1-1&trackAsin=B0C5CX3VBH",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb0000000002dbb5ba",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/bygd021f",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // ハナレテイテモ feat.maya ando
    {
      title: "ハナレテイテモ feat.maya ando",
      sound: "/sounds/track07_hanareteitemo.mp3",
      image: "/img/music_img/jacket07_hanareteitemo.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/%E3%83%8F%E3%83%8A%E3%83%AC%E3%83%86%E3%82%A4%E3%83%86%E3%83%A2-feat-maya-ando/1675222616?i=1675222617",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/3dNaSMXaCVuWrtN1UHtnNS",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_mvPuMadi5V_wIOazSJ3NzQxhXJwM3T9ko",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0BX93P4ND/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&keywords=%22%E3%83%8F%E3%83%8A%E3%83%AC%E3%83%86%E3%82%A4%E3%83%86%E3%83%A2+feat.maya+ando%22+%22T.HASE%22&qid=1702172534&s=dmusic&sr=1-1",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb0000000002c563c8",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/u79zi8m1",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // クロール (feat. Yasu)
    {
      title: "クロール feat.Yasu",
      sound: "/sounds/track08_crawl.mp3",
      image: "/img/music_img/jacket08_crawl.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/crawl-feat-yasu-single/1645071254",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/5dPBOeNdeDNo2AhY2sOULN",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_kLSgqQPS0w5NAOMFV8MbCShfOUe-Go-zI",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0BFFWPVSV/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&keywords=%22%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB+feat.Yasu%22+%22T.HASE%22&qid=1702172108&s=dmusic&sr=1-1",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb000000000295b1d8",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/q3a1zps7",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Knocking on a closed door feat.zz
    {
      title: "Knocking on a closed door feat.zz",
      sound: "/sounds/track09_Knocking_onaclosed_door.mp3",
      image: "/img/music_img/jacket09_Knocking_onaclosed_door.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/knocking-on-a-closed-door-feat-zz/1675222727?i=1675222729",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/album/3WgfSlkM2IGGoJLTB54Z6C",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_n0MM2JGMJ5P-ISj7ZLqp_mu6oQPfSDnPY",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/music/player/albums/B0BX9BR4C4?s=dmusic&keywords=%26amp%3Bquot%3BKnocking+on+a+closed+door+feat.zz%26amp%3Bquot%3B+%26amp%3Bquot%3BT.HASE%26amp%3Bquot%3B&ASIN=B0BX9BR4C4&qid=1702172581&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&sr=1-1",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb0000000002c563dc",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/ptaxzc5v",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Blue Capillaries
    {
      title: "Blue Capillaries",
      sound: "/sounds/track10_Blue_Capillaries.mp3",
      image: "/img/music_img/jacket10_Blue_Capillaries.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/blue-capillaries-single/1650401109",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/track/3Xew5u4V4xkUq5jeuA6nIs",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/playlist?list=OLAK5uy_loqY7zBBLJNFDLs85bX8VpN27tFScjRSw",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://www.amazon.co.jp/dp/B0BJKJ58FS/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&keywords=%22Blue+Capillaries%22+%22T.HASE%22&qid=1702172716&s=dmusic&sr=1-1",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb00000000029e570b",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://nodee.net/a/ah473kgb",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },
    // Do Dance VOCALOID mix (Ver.0.0)
    {
      title: "Do Dance VOCALOID mix",
      sound: "/sounds/DoDanceVOCALOID.mp3",
      image: "/img/music_img/Do Dance_jacket_mono_3000px.webp",
      startTime: 1,
      stores: [
        {
          href: "https://music.apple.com/jp/album/do-dance-vocaloid-mix-single/1777189615",
          icon: "/img/music_img/icon/apple_music.png",
        },
        {
          href: "https://open.spotify.com/intl-ja/track/4lizxZGahsdJbyLrEYPVSC?si=4b18a483c4a1489b",
          icon: "/img/music_img/icon/spotify.png",
        },
        {
          href: "https://music.youtube.com/watch?v=t6VClWtdwhE&si=etz2rzfHEzIkUo7f",
          icon: "/img/music_img/icon/youtube_music_key.png",
        },
        {
          href: "https://amazon.co.jp/music/player/albums/B0DLGQXZ4G?marketplaceId=A1VC38T7YXB528&musicTerritory=JP&ref=dm_sh_15jVkEW9bIhLBQUZOTiYKKVb6",
          icon: "/img/music_img/icon/amazon_music_unlimited.png",
        },
        {
          href: "https://music.line.me/webapp/album/mb0000000003f8201f",
          icon: "/img/music_img/icon/line.png",
        },
        {
          href: "https://n0.com/a/ypr9wsa20bwp",
          icon: "/img/music_img/icon/all.png",
        },
      ],
    },

    // Gravity of Kiss VOCALOID mix (Ver.2.0)
  ];

  return (
    <div>
      <Header />
      <main className="contents_inner">
        <div className="outer">
          <article className="all_wrap">
            {/* イントロ部分 */}
            <div id="intro">
              <button type="button" id="navbtn"></button>
              <div className="player_wrap">
                <section className="player">
                  <audio
                    className="song"
                    src="/sounds/track08_crawl.mp3"
                    loop
                  ></audio>
                  <canvas id="audioVisualizer"></canvas>
                  <div className="btn_wrap">
                    <img
                      src="/img/music_img/play.svg"
                      alt=""
                      className="player-timer-btn"
                    />
                  </div>
                </section>
              </div>
              <div className="volume_box PC-only">
                <div className="volume_wrap">
                  <p className="tag">volume</p>
                  <input
                    type="range"
                    id="volumeControl"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="1"
                  />
                </div>
              </div>
            </div>

            {/* 楽曲リスト */}
            <section className="selection">
              <h1 className="title">Music Works</h1>
              <p className="credit">
                All songs written, composed, programmed by
              </p>
              <div className="T_HASE_rogo">
                <img
                  src="/img/music_img/T_HASE_rogo_300px.jpg"
                  alt="T.HASE logo"
                />
              </div>
              <div className="soundList_wrap">
                <div className="soundList">
                  {soundList.map((song, index) => (
                    <div
                      key={index}
                      className="soundList-item"
                      data-sound={song.sound}
                      data-image={song.image}
                      data-start-time={song.startTime}
                    >
                      <div className="image-wrapper">
                        <img
                          src={song.image}
                          alt={song.title}
                          className="soundList-image"
                        />
                      </div>
                      <div className="soundList-text">
                        <p className="soundList-title">{song.title}</p>
                        <ul className="store_lists">
                          {song.stores.map((store, idx) => (
                            <li key={idx}>
                              <a
                                href={store.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img src={store.icon} alt={song.title} />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="other_link">
                <p className="lead">
                  Girls vocal unit "Geminids2" produced by T.HASE
                </p>
                <a
                  href="https://geminids2.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/music_img/Gemi_title.jpg" alt="Geminids2" />
                </a>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Music;
