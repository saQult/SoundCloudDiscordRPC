from json import loads
from os import getpid
from time import time
from http.server import HTTPServer,  BaseHTTPRequestHandler 
from pypresence import Presence


client_id = '951749786908897311'
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
    self.send_response_only(200)
    song_info = loads(self.rfile.read(int(self.headers['Content-Length'])))
    print(song_info)
    try:
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
    except Exception:
      pass

if __name__ == "__main__":        
  webServer = HTTPServer((hostName, serverPort), MusicHandler)
  print("Server started http://%s:%s" % (hostName, serverPort))
  try:
    webServer.serve_forever()
  except KeyboardInterrupt:
    pass


webServer.server_close()
print("Server stopped.")
