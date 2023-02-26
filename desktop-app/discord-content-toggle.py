import os, platform;
from electron_inject import inject;


appDirectory = '';

if platform.system() == 'Darwin':
    appDirectory = '/Applications/Discord.app/Contents/MacOS/Discord'
elif platform.system() == 'Windows':
    discordDir = f"{os.getenv('LOCALAPPDATA')}/Discord/"
    prefixed = [filename for filename in os.listdir(os.getenv('LOCALAPPDATA') + "/Discord/") if filename.startswith("app-")]
    appDirectory = f"{discordDir}/{prefixed[0]}/Discord.exe"

def load_file(file_name: str) -> str:
    return os.path.join(os.path.dirname(__file__), file_name)



inject(appDirectory, scripts=[load_file("script.js")]);