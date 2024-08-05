import os
import json
import pandas as pd
import sys
from flask import Flask, request, render_template
app = Flask(__name__)

ACCESS = 'http://127.0.0.1:8000/hello'
ROOT = '/Users/raulrus/coindb-data'
DATABASE_FILE_PATH = os.path.join(ROOT, 'coin_database.txt')
f = open(DATABASE_FILE_PATH, "r")
data = json.loads(f.read())
f.close()

def create_database():
    data.append(["id", "denomination", "region", "year", "currency", "metal", "diameter"])
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(data))
    f.close()

def add_new_data(denomination, region, year, currency, metal, diameter):
    data.append([len(data), denomination, region, year, currency, metal, diameter])
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(data))
    f.close()

def overwrite_data(id, denomination, region, year, currency, metal, diameter):
    data[id] = [id, denomination, region, year, currency, metal, diameter]


@app.route("/show")
def show():
    file = open("static/coin_database.txt")
    content = file.read()
    coins = json.loads(content)
    denominations = [coin['denomination'] for coin in coins]
    return content

# parameters flask
@app.route("/add", methods=['POST'])
def add():
    features = request.get_json()
    add_new_data(*features)
    return {'response': "Coin added"}

@app.route("/catalogue")
def catalogue():
    return render_template('catalogue.html')

@app.route("/display_collection")
def display_collection():
    return render_template('display_collection.html')
@app.route("/dummy")
def dummy():
    return 'DUMMY'

@app.route("/coins")
def coins():
    f = open(DATABASE_FILE_PATH, "r")
    result = f.read()
    f.close()
    return result

@app.route("/add_coin")
def add_coin():
    return render_template('add_coin.html')

@app.route("/edit_coin")
def edit_coin():
    return render_template('edit_coin.html')

if __name__ == '__main__':
   app.run()