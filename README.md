
![yt-aurora-toast-nologo](https://github.com/user-attachments/assets/de3cf414-2858-4629-95a5-e723dd8deb3f)

# userscript-youtube-play-in-mpv
Allows you to launch the current YouTube video in MPV directly from the video page with a single click.   
Adds buttons to YouTube video pages that let you open the video in MPV at various resolutions (e.g., 1080p, 720p) for improved playback performance or external viewing.

Designed to work on Linux.  
Dependencies:
- mpv player
- yt-dlp
- mpv-handler https://github.com/akiirui/mpv-handler.git
- the Violentmonkey browser extension

Other prerequisites, optional, depending on use case:
- Graphics drivers installed
- mpv configured correctly for hardware video decoding


## Installation instructions

### Garuda Linux & Arch

##### 1. Install mpv and yt-dlp
```
sudo pacman -S mpv yt-dlp
```

##### 2. Install mpv-handler
Please follow the installation instructions from the mpv-handler repository [https://github.com/akiirui/mpv-handler](https://github.com/akiirui/mpv-handler?tab=readme-ov-file#manual-installation)  
For convenience, here are the manual installation instructions for mpv-handler:

- Go to the project's repo (link above) and download the latest Linux release
- Unzip the archive
- Copy mpv-handler to $HOME/.local/bin
- Copy mpv-handler.desktop to $HOME/.local/share/applications/
- Copy mpv-handler-debug.desktop to $HOME/.local/share/applications/
- Set executable permission for binary
```
$ chmod +x $HOME/.local/bin/mpv-handler
```
Register xdg-mime (thanks for the linuxuprising reminder)
```
$ xdg-mime default mpv-handler.desktop x-scheme-handler/mpv
$ xdg-mime default mpv-handler-debug.desktop x-scheme-handler/mpv-debug
```
Add $HOME/.local/bin to your environment variable PATH  
Optional: Copy config.toml to $HOME/.config/mpv-handler/config.toml and configure


#### 3. Install the Violentmonkey browser extension for your favourite browser.

#### 4. Add the user script.
Once you have installed Violentmonkey, open it and create a new script.  
In this new script, delete all the boilerplate and paste the entire contents of the `user-script.js` file from this repository.


## Usage

Open youtube and start playing a video.  
Whenever you want to open it in mpv, click one of the buttons that appear beneath the video. 
You will have several buttons:
- The first button is for the maximum possible quality.
- Other buttons are for 1440p, 1080p, 720p
- The other buttons appear only for resolutions that are actually available on the current video

Once you click on a button, you will see:
- the video will stop playing on the page
- a loading animation on the button
- a toast-type notification in the bottom right of the browser window
- after a few seconds, mpv will open and the video will start playing in it

In mpv, you have the option to go to the next/previous chapters, just like you do in the Youtube player.

---
## Advantages of playing in mpv
- Much less cpu usage, especially in browsers that don't properly support hardware decoding in linux
- Playback is smoother, no dropped frames
- Seeking is much faster, both forward and backward
- Can easily skip through chapters
- Clear indication of how much of the video is cached
- Once the video is cached, you don't have to stay connected to the internet

## Downsides
- The browser can't know when mpv actually opens or closes, so once you click a button the script deactivates all buttons for the next 10 seconds to prevent accidentally clicking it multiple times.
- It's more cumbersome to write a comment or like a video because now you have to go back to the browser window and do these actions.
- Auto-play next video is not implemented. To be determined if it's even possible, at least for playlists.
- No ability to have closed captions / subtitles.

---
## Why does this exist?
Mostly because 4k video support is not that great on linux currently. For example in Windows you might be able to play four 4k videos all at once in different browser windows, and you'd still be able to carry on working as usual on the computer.   

However in Linux things are a bit different, especially on dual-gpu laptops, mostly intel+nvidia.   
In certain situations and for certain hardware configurations, hardware video decoding doesn't work very well, especially in browsers.   
As an example, in Brave/Chrome/Chromium, a 4k 60fps video might cause over 25% CPU utilization for an intel i9-11900H, plus over 50% for both GPUs.   

This project allows you to pause the video in the browser and open it in mpv where support for hardware video acceleration is much better, resulting in way less resources utilized.
