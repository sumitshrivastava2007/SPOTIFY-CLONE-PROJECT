let currentsong = new Audio();
let songs;
async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

function formatTime(seconds) {
  // Use Math.floor to ignore fractional seconds
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const playmusic = (track) => {
  // let audio = new Audio(/songs/ + track)
  currentsong.src = "/songs/" + track;
  currentsong.play();
  play.src = "pause.svg";
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
  let songs = await getsongs();
  console.log(songs);

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
    
                <img class="invert" src="music.svg" alt="" />
                <div class="info">
                  <div> ${song.replace("%20", " ")}</div>
                  <div>sumit</div>
                </div>
                <div class="playnow">
                  <span>Play now</span>
                  <img class="invert" src="play.svg" alt="" />
                </div>

    
   </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //attach eventlistner to play, previous and next button
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  //litsen for timeupdate event
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentsong.currentTime
    )}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%"
  });

  // add event listner to seek bar 
  document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration)*percent)/100
  })

  // Add an event listner for hamburger
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0"
  })
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%"
  })

  //add eventlistner to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentsong.volume = parseInt(e.target.value)/100
  })
}

main();
