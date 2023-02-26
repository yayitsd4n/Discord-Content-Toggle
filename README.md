# ![Discord Content Toggle Logo](./readme-files/icon32.png) Discord Content Toggle


![Demo](./readme-files/demo.gif)

**An extension for Discord that allows you to hide and show content in messages.**


- Drop-down arrows are shown above content that can be hidden; similar to Slack.
- Hide images, animates gifs, videos, emojis, and embedded link content.
- Hidden content persists between page and application loads.
- Works on the Web and Desktop apps.

---

## Installation
This works on both the Desktop and Web apps.
The Desktop app needs a local installation of Python while the web app has a few different options to use. 
 

### Web App Installation
If you want to run this script on the Discord web app, there are a couple ways to do that.

#### Chrome Extension
If you want to use this script as a chrome extension:
- Download the latest [release](https://github.com/yayitsd4n/Discord-Content-Toggle/releases) for the *chrome-extension* and extract the folder anywhere on your machine
- Open Chrome and type `chrome://extensions/` into the address bar
- Click the *Load unpacked* button
    - A file browser will open
- Navigate to the root of the folder you extracted and hit *Select*

Chrome will add the extenstion and automitically enable it. Make sure to refresh the Discord web app if it is already opened.


#### User Script
If you have a user script extension such as [Violent Monkey](https://violentmonkey.github.io/), [Tamper Monkey](https://www.tampermonkey.net/), or [Grease Monkey](https://www.greasespot.net/), this script is hosted [here](https://greasyfork.org/en/scripts/460729-discord-content-toggle) on greasyfork.org

### Desktop App Installation
Python 3 is prerequisite for using this script. The script will be injected into the desktop app with help from the [electron-inject](https://github.com/tintinweb/electron-inject) package.



#### Windows
- Python is available on the [Microsoft Store](https://apps.microsoft.com/store/detail/python-310/9PJPW5LDXLZ5) or through the [Python website](https://www.python.org/downloads/)
- Download and extract the lastest [release](https://github.com/yayitsd4n/Discord-Content-Toggle/releases) for the *desktop-app* anywhere on your machine
- Open a cmd prompt, navigate to the folder you extracted, and type: `python discord-content-toggle.py`

Discord will open with this script injected. The cmd prompt is safe to close if it didn't automatically.

#### Mac
- Current versions of Mac OS ship with Python preinstalled with the name space of `python3`. If Python is not installed for some reason, head [here](https://www.python.org/downloads/) and download the latest version for your machine.
- Download and extract the lastest [release](https://github.com/yayitsd4n/Discord-Content-Toggle/releases) for the *desktop-app* anywhere on your machine
- Open a terminal, navigate to the folder you extracted, and type: `python3 discord-content-toggle.py`

Discord will open with this script injected. The terminal is safe to close if it didn't automatically.
