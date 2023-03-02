import os, platform;
from electron_inject import inject;


appDirectory = '';

def filterAppFolder(folder):
    if (folder.startswith("app-")):
        return True
    else:
        return False

if platform.system() == 'Darwin':
    appDirectory = '/Applications/Discord.app/Contents/MacOS/Discord'
elif platform.system() == 'Windows':
    discordDir = f"{os.getenv('LOCALAPPDATA')}/Discord/"
    appFolder = sorted(filter(filterAppFolder, os.listdir(os.getenv('LOCALAPPDATA') + "/Discord/")))[-1]
    appDirectory = f"{discordDir}/{appFolder}/Discord.exe"



def load_file(file_name: str) -> str:
    return os.path.join(os.path.dirname(__file__), file_name)

inject(appDirectory, scripts=[load_file("script.js")]);