// Get array of artists
async function getSongs() {
  let songs = await fetch("http://127.0.0.1:5500/songs/");
  let songstext = await songs.text();
  let div = document.createElement("div");
  div.innerHTML = songstext;
  let asongs = div.querySelectorAll(".icon-directory");

  let songlist = [];
  for (let index = 0; index < asongs.length; index++) {
    const tempElement = asongs[index];
    if (tempElement.href.includes("songs")) {
      // let temp1=tempElement.href.replaceAll("%20"," ")
      temp1 = tempElement.href;
      songlist.push(temp1);
    }
  }
  return songlist;
}

// Get song addresses of various artists
async function getSongArtists(name) {
  let artistlist = await getSongs();
  let ans;
  for (artistaddress of artistlist) {
    if (artistaddress.includes(name)) {
      ans = artistaddress;
    }
  }
  return ans;
}

// Convert seconds to minutes:seconds
function getDuration(seconds) {
  let minutes = Math.floor(seconds / 60).toString();
  let remainingseconds = Math.floor(seconds % 60).toString();
  if (remainingseconds.length == 1) remainingseconds = "0" + remainingseconds;
  let ans;
  ans = minutes + ":" + remainingseconds;
  return ans;
}

// Display function to list all the songs
async function displaySongList(address, id) {
  //  Fetch the address
  let songaddress = await fetch(address);
  //  Parse the address html into text
  songaddress = await songaddress.text();

  let div = document.createElement("div");
  div.innerHTML = songaddress;
  let songlinks = div.querySelectorAll("ul>li>a");
  let songlist = [];
  for (let i = 0; i < songlinks.length; i++) {
    let temp = songlinks[i];
    if (temp.href.endsWith(".mp3")) {
      temp = temp.href;
      songlist.push(temp);
    }
  }

  let box = document.querySelector("#songlisitings");
  box.innerHTML = "";

  let z = 0;
  // Display all songs of the artists
  while (z < songlist.length) {
    // Creat song lists div
    let tempdiv = document.createElement("div");
    tempdiv.setAttribute(
      "style",
      "width: 100%; height: 3rem; background-color: var(--secondarybcg); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; margin: 0.4rem 0; cursor: pointer;"
    );
    tempdiv.setAttribute("class", "mainsonglistitem");

    // Add Event Listener for hover effect
    tempdiv.addEventListener("mouseenter", () => {
      tempdiv.setAttribute(
        "style",
        " width: 100%; height: 3rem; background-color: #2d2d2d; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; margin: 0.4rem 0; cursor: pointer; transition: transform 0.2s ease; transform: translateY(-2px);"
      );
    });

    tempdiv.addEventListener("mouseleave", () => {
      tempdiv.setAttribute(
        "style",
        " width: 100%; height: 3rem; background-color: var(--secondarybcg); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; margin: 0.4rem 0; cursor: pointer; transition: transform: 0.5s ease; "
      );
    });

    // Add serial number to the songs
    let serialnumber = document.createElement("div");
    serialnumber.setAttribute("style", "width: 10%; color: white;");
    serialnumber.innerHTML = z + 1;
    tempdiv.append(serialnumber);

    // Add song name
    let temp = id + "/";
    let songtrack = document.createElement("div");
    tempdiv.append(songtrack);
    songtrack.setAttribute("style", "width: 30%; color: white;");
    songtrack.setAttribute("class", "songnamecontainer");
    songtrack.innerHTML = songlist[z]
      .split(temp)[1]
      .replaceAll("%20", " ")
      .split("mp3")[0]
      .slice(0, -1);

    // Add artists name
    let artistname = document.createElement("div");
    tempdiv.append(artistname);
    artistname.setAttribute("style", "width: 30%; color: white;");
    artistname.setAttribute("class", "artistnamecontainer");
    artistname.innerHTML = songlist[0]
      .split("songs/")[1]
      .split("/")[0]
      .replaceAll("%20", " ");

    // Add audio duration
    const audio = document.createElement("audio");
    audio.src = songlist[z];
    let durationcont = document.createElement("div");
    tempdiv.append(durationcont);
    durationcont.setAttribute("style", "width: 25%; color: white");
    durationcont.setAttribute("class", "durationcontainer");
    audio.onloadedmetadata = function () {
      let seconds = audio.duration;
      durationcont.innerHTML = getDuration(seconds);
    };

    // Add download links
    let play = document.createElement("div");
    play.setAttribute("style", "width: 10%;");
    let downloadtag = document.createElement("a");
    downloadtag.setAttribute("class", "musicsource");
    downloadtag.href = songlist[z];
    downloadtag.download = downloadtag.href
      .split(temp)[1]
      .replaceAll("%20", " ");
    let img = document.createElement("img");
    img.src = "http://127.0.0.1:5500/assets/download.svg";
    img.alt = "Example Image";
    img.height = 20;
    downloadtag.append(img);
    play.append(downloadtag);
    tempdiv.append(play);

    box.append(tempdiv);
    z = z + 1;
  }

  addSongToLibrary();
}

function removeEventListeners(element) {
  let clone = element.cloneNode(true);
  element.parentNode.replaceChild(clone, element);
  return clone;
}

function displayCurrentSong(currentdiv, audiosource, audioname, artistname) {
  currentdiv.setAttribute(
    "style",
    "display: flex; justify-content: space-between; align-items: center; height: 60px; width: 100%; padding: 0.9rem 1.5rem; background-color: #2d2d2d; margin: 0.2rem 0rem; "
  );

  // Unhilight other list items if present
  let allListItems = document.querySelectorAll("#songplaylist li");
  let otherListItems = Array.from(allListItems).filter(
    (item) => item !== currentdiv
  );
  otherListItems.forEach((item) => {
    item.setAttribute(
      "style",
      "display: flex; justify-content: space-between; align-items: center; height: 60px; width: 100%; padding: 0.9rem 1.5rem; background-color: var(--secondarbcg); margin: 0.2rem 0rem; "
    );
  });

  document.querySelector("#currentaudio").src = audiosource;
  document.querySelector("#songinfo").innerHTML = audioname;

  let audiocont = document.querySelector("#currentaudio");

  //  Get the current song duration
  audiocont.addEventListener("loadedmetadata", function () {
    duration = audiocont.duration;
    document.querySelector("#duration").innerHTML = getDuration(duration);
  });

  //  Play the current song
  audiocont.play();
  let playbtn = document.querySelector("#playbtn");
  playbtn = removeEventListeners(playbtn);
  playbtn.querySelector("#playbtnimage").src =
    "http://127.0.0.1:5500/assets/pause.png";

  //   To get the current duration of the songs
  audiocont.addEventListener("timeupdate", () => {
    let currentTime = audiocont.currentTime;
    document.querySelector("#currenttime").innerHTML = getDuration(currentTime)+'/';
    // }
  });

  //  To play/pause the song
  playbtn.addEventListener("click", () => {
    if (audiocont.paused) {
      audiocont.play();
      console.log("Playing music");
      playbtn.querySelector("#playbtnimage").src =
        "http://127.0.0.1:5500/assets/pause.png";
    } else {
      audiocont.pause();
      console.log("Pausing the music");
      playbtn.querySelector("#playbtnimage").src =
        "http://127.0.0.1:5500/assets/playwhite.png";
    }
  });

  volumeSlider = document.querySelector("#volumeSlider");
  volumeSlider = removeEventListeners(volumeSlider);

  // Add volume input for the current song
  volumeSlider.addEventListener("input", function () {
    audiocont.volume = this.value;
  });

  // Move to next song if the song has ended
  audiocont.addEventListener("ended", function () {
    //Change the playbutton to default play image
    playbtn.querySelector("#playbtnimage").src =
      "http://127.0.0.1:5500/assets/playwhite.png";

    // Move to the next song if available
    let nextsibling = currentdiv.nextElementSibling;
    console.log(currentdiv);
    console.log(nextsibling);
    if (nextsibling) {
      let nextsiblingaudio = nextsibling.children[3].children[1].src;

      let audioname = nextsibling.children[1].innerHTML;
      let artistname = nextsibling.children[2].innerHTML;

      displayCurrentSong(nextsibling, nextsiblingaudio, audioname, artistname);
    }
  });

  // Play the previous song
  let previousbutton = document.querySelector("#previousbtn");
  previousbutton = removeEventListeners(previousbutton);
  previousbutton.addEventListener("click", () => {
    let previoussonglistitem = currentdiv.previousElementSibling;

    // If previous song exist
    if (previoussonglistitem) {
      let prevsiblingaudio = previoussonglistitem.children[3].children[1].src;

      let audioname = previoussonglistitem.children[1].innerHTML;
      let artistname = previoussonglistitem.children[2].innerHTML;

      displayCurrentSong(
        previoussonglistitem,
        prevsiblingaudio,
        audioname,
        artistname
      );
    }
    // Display no previous song exist
    else {
      let msgbox = document.createElement("div");
      if (!previousbutton.querySelector("#prevmsg")) {
        console.log("msgbox created");

        previousbutton.append(msgbox);
        msgbox.innerHTML = "No previous song exist";
        previousbutton.setAttribute(
          "style",
          "positon: relative; cursor: pointer;"
        );
        msgbox.setAttribute(
          "style",
          "color: white; background-color: var(--primarybcg); padding: 0.2rem 0.5rem; position: absolute; bottom: 70px; display: block; z-index: 1; height: auto; width: auto;"
        );
        msgbox.setAttribute("id", "prevmsg");
        console.log(msgbox);
        setTimeout(() => {
          document.querySelector("#prevmsg").remove();
        }, 1500);
      }
    }
  });

  // Play the next song
  let nextbutton = document.querySelector("#nextbtn");
  nextbutton.addEventListener("click", () => {
    let nextsonglistitem = currentdiv.nextElementSibling;

    // If next song exist
    if (nextsonglistitem) {
      let nextsiblingaudio = nextsonglistitem.children[3].children[1].src;

      let audioname = nextsonglistitem.children[1].innerHTML;
      let artistname = nextsonglistitem.children[2].innerHTML;

      displayCurrentSong(
        nextsonglistitem,
        nextsiblingaudio,
        audioname,
        artistname
      );
    }
    // Display no next song exist
    else {
      let nmsgbox = document.createElement("div");
      if (!nextbutton.querySelector("#nextmsg")) {
        nextbutton.append(nmsgbox);
        nmsgbox.innerHTML = "No next song exist";
        nextbutton.setAttribute("style", "positon: relative; cursor: pointer;");
        nmsgbox.setAttribute(
          "style",
          "color: white; background-color: var(--primarybcg); padding: 0.2rem 0.5rem; position: absolute; bottom: 70px; display: block; z-index: 1; height: auto; width: auto;"
        );
        nmsgbox.setAttribute("id", "nextmsg");
        setTimeout(() => {
          document.querySelector("#nextmsg").remove();
        }, 1500);
      }
    }
  });
}

// Add a single song to song library
function addSingleSongToLibrary(div) {
  // Get the playlist container to add the songs

  let cont = document.querySelector("#songplaylist");
  // Add new list item to the container
  let songdiv = document.createElement("li");
  songdiv.setAttribute(
    "style",
    "display: flex; justify-content: space-between; align-items: center; height: 60px; width: 100%; padding: 0.9rem 1.5rem; background-color: var(--secondarybcg); margin: 0.2rem 0rem; "
  );
  songdiv.setAttribute("class", "librarysong");

  // Add serial number in the new list item
  let snodiv = document.createElement("div");
  snodiv.setAttribute("class", "in-block");
  snodiv.setAttribute("style", "color: white; background-color: transparent");
  snodiv.innerHTML =
    Array.from(document.querySelector("#songplaylist").children).length + 1;
  songdiv.append(snodiv);

  cont.append(songdiv);

  // Add song name in the new list item
  let trackdiv = document.createElement("div");
  trackdiv.setAttribute("class", "in-block");
  trackdiv.setAttribute(
    "style",
    "color: white; background-color: transparent; width: 40%; height: auto;"
  );
  trackdiv.innerHTML = div.querySelector(".songnamecontainer").innerHTML;
  songdiv.append(trackdiv);

  // Add artist name in the new list item
  let artistdiv = document.createElement("div");
  artistdiv.setAttribute("class", "in-block");
  artistdiv.setAttribute(
    "style",
    "color: white; background-color: transparent; width: 40%; height: auto;"
  );
  artistdiv.innerHTML = div.querySelector(".artistnamecontainer").innerHTML;
  songdiv.append(artistdiv);

  // Add play button in the new list item
  let playButtonDiv = document.createElement("div");
  playButtonDiv.setAttribute("class", "in-block play-button");
  playButtonDiv.setAttribute(
    "style",
    " width: 5%; color: white; background-color: transparent; cursor: pointer;"
  );

  let playButtonImg = document.createElement("img");
  playButtonImg.src = "http://127.0.0.1:5500/assets/playwhite.png";

  playButtonImg.alt = "Play";
  playButtonImg.setAttribute("style", "width: 15px; height: 15px;");
  playButtonImg.setAttribute("class", "libplaybtn");
  playButtonDiv.append(playButtonImg);

  // Add the audio source
  let audioElement = document.createElement("audio");
  audioElement.src = div.querySelector(".musicsource").href;

  playButtonDiv.append(audioElement);

  // Add event listener to play/pause songs
  playButtonDiv.addEventListener("click", () => {
    // removePreviousSong()
    displayCurrentSong(
      songdiv,
      audioElement.src,
      trackdiv.innerHTML,
      artistdiv.innerHTML
    );
  });

  // Add playbutton to the list item
  songdiv.append(playButtonDiv);

  // Add song in the song library
  cont.append(songdiv);
}

// Add songs to library when clicked when the songs are displayed
function addSongToLibrary() {
  // Get all the listed songs as HTML collection
  let displayedsongs = document.querySelectorAll(".mainsonglistitem");

  // Convert HTML collection into array
  let displayedsongsarr = Array.from(displayedsongs);

  displayedsongsarr.forEach((song) => {
    song.addEventListener("click", () => {
      addSingleSongToLibrary(song);
    });
  });
}

async function getArtistfromClick() {
  let singeraddress;
  let temp = document.querySelectorAll(".playiconcont");
  // Display songs list for corresponding artists when clicked
  Array.from(temp).forEach((element) =>
    element.addEventListener("click", async () => {
      singeraddress = await getSongArtists(element.id);
      displaySongList(singeraddress, element.id);
    })
  );
}

async function main() {
  getArtistfromClick();
}

main();
