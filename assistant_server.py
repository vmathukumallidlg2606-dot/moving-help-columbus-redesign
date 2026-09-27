import json
import os
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(__file__), 'dist')
CONTEXT_PATH = os.path.join(os.path.dirname(__file__), 'ollama_corpus.txt')
OLLAMA_URL = 'http://127.0.0.1:11434/api/generate'
MODEL = 'gemma3:latest'


def read_context():
    try:
        with open(CONTEXT_PATH, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except FileNotFoundError:
        return 'Business context file not found.'


def generate_answer(question: str) -> str:
    context = read_context()
    prompt = (
        'You are the business assistant for Moving Help Columbus Ohio. '
        'Use only the provided business context file as the source of truth. '
        'If a detail is not in the context, say you do not have that information. '
        'Keep answers brief, helpful, and grounded in facts.\n\n'
        f'Context:\n{context}\n\nQuestion: {question}\n\nAnswer:'
    )

    payload = json.dumps({
        'model': MODEL,
        'prompt': prompt,
        'stream': False,
        'options': {'temperature': 0.2, 'top_p': 0.9}
    }).encode('utf-8')

    req = urllib.request.Request(
        OLLAMA_URL,
        data=payload,
        headers={'Content-Type': 'application/json'}
    )

    with urllib.request.urlopen(req, timeout=60) as response:
        data = json.loads(response.read().decode('utf-8'))
        return data.get('response', 'I could not generate a response from the local model.').strip()


class AssistantHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/chat':
            question = urllib.parse.parse_qs(parsed.query).get('question', [''])
            q = question[0].strip()
            if not q:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Question is required'}).encode('utf-8'))
                return

            try:
                answer = generate_answer(q)
                body = json.dumps({'answer': answer}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except Exception as exc:  # pragma: no cover - runtime safety
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(exc)}).encode('utf-8'))
            return

        if parsed.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode('utf-8'))
            return

        safe_path = parsed.path
        if safe_path == '/':
            safe_path = '/index.html'

        file_path = os.path.normpath(os.path.join(ROOT, safe_path.lstrip('/')))
        if os.path.commonpath([ROOT, file_path]) != ROOT:
            self.send_response(403)
            self.end_headers()
            return

        if not os.path.exists(file_path) or os.path.isdir(file_path):
            self.send_response(404)
            self.end_headers()
            return

        with open(file_path, 'rb') as fh:
            content = fh.read()

        extension = os.path.splitext(file_path)[1].lower()
        mime_types = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.json': 'application/json; charset=utf-8',
        }

        self.send_response(200)
        self.send_header('Content-Type', mime_types.get(extension, 'application/octet-stream'))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        return


if __name__ == '__main__':
    port = 8789
    server = ThreadingHTTPServer(('127.0.0.1', port), AssistantHandler)
    print(f'assistant server running on http://127.0.0.1:{port}')
    server.serve_forever()
