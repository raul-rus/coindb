import os
import json
import pandas as pd
import sys
from flask import Flask, request, render_template
app = Flask(__name__)

ACCESS = 'http://127.0.0.1:8000/hello'
ROOT = '/Users/raulrus/coindb-data'
DATABASE_FILE_PATH = os.path.join(ROOT, 'coin_database.txt')


def create_database():
    # create a dataframe
    data = {
        "id": [],
        "denomination": [],
        "region": [],
        "year": [],
        "currency": [],
        "metal": [],
        "diameter": []
    }
    db = pd.DataFrame(data, index=[])
    print(db)

    f = open(DATABASE_FILE_PATH, "w")
    print(DATABASE_FILE_PATH)
    f.write(db.to_json())
    print(db.to_json())
    f.close()

create_database()
sys.exit(0)


@app.route("/show")
def show():
    file = open("static/coin_database.txt")
    content = file.read()
    coins = json.loads(content)
    denominations = [coin['denomination'] for coin in coins]
    return content

@app.route("/catalogue")
def catalogue():
    return render_template('catalogue.html')

@app.route("/display_collection")
def display_collection():
    return render_template('display_collection.html')

@app.route("/add_coin")
def add_coin():
    return render_template('add_coin.html')

@app.route("/edit_coin")
def edit_coin():
    return render_template('edit_coin.html')

if __name__ == '__main__':
   app.run()