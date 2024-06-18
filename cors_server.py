from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'x-api-key,Content-Type')
        super(CORSRequestHandler, self).end_headers()

port = 8000
os.chdir(os.path.dirname(__file__))  # 将当前目录设置为服务器的根目录
httpd = HTTPServer(('localhost', port), CORSRequestHandler)
print(f"Serving on port {port}")
httpd.serve_forever()
