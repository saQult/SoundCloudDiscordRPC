from json import loads
from os import getpid
from time import time, sleep
from http.server import HTTPServer,  BaseHTTPRequestHandler 
from pypresence import Presence
from modules import check_if_process_running

client_id = '951749786908897311'

print('waiting for discord')

while check_if_process_running('discord') == False:
  sleep(1)

print('discord was found')
print('rpc will start after 10 seconds')
sleep(10)

RPC = Presence(client_id)
RPC.connect()

hostName = "localhost"
serverPort = 8080


class MusicHandler(BaseHTTPRequestHandler):  

  def do_OPTIONS(self):
    self.send_response(200, "ok")
    self.send_header('Access-Control-Allow-Credentials', 'true')
    self.send_header('Access-Control-Allow-Origin', 'http://localhost:8080')
    self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")

  def do_POST(self):

    if check_if_process_running('discord') == False:
      print('waiting for discord')
      self.send_response_only(400)
      return

    self.send_response_only(200)
    song_info = loads(self.rfile.read(int(self.headers['Content-Length'])))
    print(song_info)
    
    if song_info['is_paused']:
      RPC.clear()
      return  

    name = song_info['name']
    image = song_info['avatar']
    artist = song_info['artist']
    time_passed = int(song_info['time_passed'])
    duration = int(song_info['duration'])
    url = song_info['url']
    buttons = [
      {
        'label': 'Listen SoundCloud',
        'url': url
      } 
    ]
    RPC.update(pid = getpid(),
          details = name,
          state = 'by ' + artist,
          large_image = image,
          small_image = 'https://m.sndcdn.com/_next/static/images/apple-touch-icon-180-893d0d532e8fbba714cceb8d9eae9567.png',
          large_text = name, # не ебу зачем это надо
          small_text =artist, # и это тоже
          buttons=buttons,
          end=time() + duration - time_passed
          )



if __name__ == "__main__":        
  webServer = HTTPServer((hostName, serverPort), MusicHandler)
  print("Server started http://%s:%s" % (hostName, serverPort))
  try:
    webServer.serve_forever()
  except KeyboardInterrupt:
    pass


webServer.server_close()
print("Server stopped.")