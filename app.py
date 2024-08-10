import os
import json
import pandas as pd
import sys
from flask import Flask, request, render_template
app = Flask(__name__, static_folder='static',)

ACCESS = 'http://127.0.0.1:8000/hello'
DATABASE_FILE_PATH = 'static/coin_database.txt'
f = open(DATABASE_FILE_PATH, "r")
data = json.loads(f.read())
f.close()

def find_id(denomination, region, year, currency, metal, diameter):
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    # parse through data and find the id
    return -1

def create_database():
    #data.append(["id", "image", "denomination", "region", "year", "currency", "metal", "diameter"])
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps([["id", "image", "denomination", "region", "year", "currency", "metal", "diameter"]]))
    f.close()

def add_new_data(denomination, image, region, year, currency, metal, diameter):
    data.append([len(data), denomination, region, year, currency, metal, diameter])
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(data))
    f.close()

def overwrite_data(id, image, denomination, region, year, currency, metal, diameter):
    data[id] = [id, image, denomination, region, year, currency, metal, diameter]

create_database()

@app.route("/get_coins", methods=['GET'])
def get_coins():
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    return data


@app.route("/add", methods=['POST'])
def add():
    features = request.get_json()
    add_new_data(*features)
    return {'response': "Coin added"}

@app.route("/edit", methods=['POST'])
def edit():
    features = request.get_json()
    print(features)
    serial = find_id(*features)
    #overwrite_data(serial, *features)
    return {'response': "Coin edited"}

if __name__ == '__main__':
   app.run()