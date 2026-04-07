import subprocess, sys, time, requests
from flask import Flask, request, jsonify, render_template

SEARXNG_URL = "http://127.0.0.1:8080"

# --- Funkcija: pārbauda, vai Docker konteiners darbojas ---
def is_searxng_running():
    result = subprocess.run(
        ["docker", "ps", "--filter", "name=searxng_api", "--format", "{{.Names}}"],
        capture_output=True, text=True
    )
    return "searxng_api" in result.stdout

# --- Funkcija: startē Docker, ja nav palaižams ---
def start_searxng():
    print("SearXNG Docker nav palaists. Palaižu kontejneru...")
    subprocess.run(["docker", "compose", "up", "-d"], check=True)
    # pagaidi, lai SearXNG tiešām uzsāktu
    print("Gaidām 5 sekundes, lai SearXNG uzsāktu...")
    time.sleep(5)

# --- Pārbaude ---
if not is_searxng_running():
    start_searxng()
else:
    print("SearXNG Docker jau darbojas.")

# --- Flask serveris ---
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search")
def search():
    q = request.args.get("q", "")
    page = int(request.args.get("page", 0))
    per_page = 20
    res = requests.get(f"{SEARXNG_URL}/search", params={"q": q, "format":"json"}).json()
    # slice
    results = res.get("results", [])[page*per_page:(page+1)*per_page]
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)