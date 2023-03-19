# ![Discord Content Toggle Logo](./readme-files/icon32.png) Discord Content Toggle
An extension for Discord that allows you to hide and show content in messages.

![Demo](./readme-files/demo.gif)

## Features
- Drop-down arrows are shown above content that can be hidden; similar to Slack.
- Hide images, animates gifs, videos, emojis, and embedded link content.
- Hidden content persists between page and application loads.
- Support for dark and light themes
- Works on the Web and Desktop apps.

---

## Installation
This works on both the desktop app and Discord.com.
The Desktop app needs a local installation of Python while the web app has a couple different options to use. 
 

### Discord.com
If you want to hide content on the Discord web app, this script is available as a browser extenstion on:
* [Chrome](https://chrome.google.com/webstore/detail/discord-content-toggle/nkhklilhgiobpmblfbcoffdmflpfokdn)
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/discord-content-toggle/)


#### User Script
If you have a user script extension such as [Violent Monkey](https://violentmonkey.github.io/), [Tamper Monkey](https://www.tampermonkey.net/), or [Grease Monkey](https://www.greasespot.net/), this script is hosted [here](https://greasyfork.org/en/scripts/460729-discord-content-toggle) on greasyfork.org

---

### Discord Desktop App
Unfortunately, the desktop installation isn't as seamless as it is on the web. A console command needs to be run whenever starting Discord, but that can be solved on Windows by creating a .bat file or something similar. The install process also has some prerequisites that need installed first. 


#### Windows
- Python is available on the [Microsoft Store](https://apps.microsoft.com/store/detail/python-310/9PJPW5LDXLZ5) or through the [Python website](https://docs.python.org/3/using/windows.html)
- Download and extract the lastest [release](https://github.com/yayitsd4n/Discord-Content-Toggle/releases) for the *discord-content-toggle* anywhere on your PC
- Open a cmd prompt, navigate to the folder you extracted, and type: 
    - `python -m pip install -r requirements.txt`
    - `python discord-content-toggle.py`

Discord will open with this script injected. The cmd prompt is safe to close if it didn't automatically.

##### Notes
- To launch again in the future, you only need to type:
`python discord-content-toggle.py`
- Consider making a .bat file that you can double click to run `python discord-content-toggle.py`

#### Mac
- If Python is not already installed, the install instructions are [here](https://docs.python.org/3/using/mac.html).
- Download and extract the lastest [release](https://github.com/yayitsd4n/Discord-Content-Toggle/releases) for the *discord-content-toggle* anywhere on your Mac
- Open a terminal, navigate to the folder you extracted, and type:
    - `python -m pip install -r requirements.txt`
    - `python discord-content-toggle.py`

Discord will open with this script injected. The terminal is safe to close if it didn't automatically.

#### Linux

Note: Assumes the Discord application is installed in `/usr/bin/Discord`

- Install Python if it's not already installed
- Download and extract the lastest [release](https://github.com/yayitsd4n/Discord-Content-Toggle/releases) for the *discord-content-toggle* anywhere on your computer
- Open a terminal, navigate to the folder you extracted, and type:
    - `python -m pip install -r requirements.txt`
    - `python discord-content-toggle.py`

##### Fedora
To make the extension seemless, create a local application launcher which will override the system launcher

```sh
cat > ~/.local/share/applications/discord.desktop <<EOL
[Desktop Entry]
Name=Discord
StartupWMClass=discord
Comment=All-in-one voice and text chat for gamers that's free, secure, and works on both your desktop and phone.
GenericName=Internet Messenger
Exec=python /opt/discord-ext/desktop-app/discord-content-toggle.py
Icon=discord
Type=Application
Categories=Network;InstantMessaging;
Path=/usr/bin
X-Desktop-File-Install-Version=0.26
EOL
```

##### Notes
- To launch again in the future, you only need to type:
`python discord-content-toggle.py`
