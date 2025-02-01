import json
import os

import torch
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from coin_grader.model import Net

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
FEATURES = ['shape', 'wear', 'metal']
MODELS = {}

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#ACCESS = 'http://127.0.0.1:8000/'
DATABASE_FILE_PATH = 'static/coin_database.txt'
COLLECTION_FILE_PATH = 'static/display_collection.txt'


def overwrite_coin(id, image, denomination, region, year, currency, metal, diameter):
    # reads from file to change data at id and overwrites with new data
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    data[int(id)] = [id, image, denomination, region, year, currency, metal, diameter]
    f.close()
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(data))
    f.close()


def reset_database():
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps([["id", "image", "denomination", "region", "year", "currency", "metal", "diameter"]]))
    f.close()

def generate_new_id():
    # find the highest id and increments by one to generate a new coin id
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    highest_id = 0
    for coin in data:
        if coin[0] > highest_id:
            highest_id = coin[0]

    return highest_id + 1


def add_new_data(denomination, image, region, year, currency, metal, diameter):
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    f.close()
    data.append([generate_new_id(), image, denomination, region, year, currency, metal, diameter])
    data.append("/n")
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(data))
    f.close()


def write_collection(collection):
    f = open(COLLECTION_FILE_PATH, "w")
    f.write(json.dumps(collection))
    f.close()

def remove_data(coin_id):
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    f.close()

    result = [coin for coin in data if str(coin[0]) != str(coin_id)]

    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(result))
    f.close()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_models():
    for feature in FEATURES:
        # Loads the weights and initialises model.
        file_name = f'coin_grader/coins/{feature}.txt'
        model = Net(file_name)
        model.load_state_dict(torch.load(f'coin_grader/{feature}_weights.pth'))
        MODELS[feature] = model


def score(image_path):
    # Each feature has a label file.
    results = {}

    for feature in FEATURES:
        # Scores the model.
        tensors = Net.images_to_tensor([image_path])
        model = MODELS[feature]
        results[feature] = model.value_to_label(model.score(tensors)[0])

    return results


@app.route("/get_coins", methods=['GET'])
def get_coins():
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    f.close()
    return data


@app.route("/get_collection", methods=['GET'])
def get_collection():
    f = open(COLLECTION_FILE_PATH, "r")
    collection = json.loads(f.read())
    f.close()
    return collection

@app.route("/save_collection", methods=['POST'])
def save_collection():
    write_collection(request.get_json())
    return {'response': "OK"}


@app.route("/add", methods=['POST'])
def add():
    features = request.get_json()
    add_new_data(**features)
    return {'response': "OK"}


@app.route("/remove", methods=['POST'])
def remove():
    features = request.get_json()
    remove_data(features)
    return {'response': "OK"}


@app.route("/edit", methods=['POST'])
def edit():
    features = request.get_json()
    overwrite_coin(**features)
    return {'response': "OK"}


@app.route('/upload_image', methods=['POST'])
def upload_file():
    file = request.files['myfile']
    if file and allowed_file(file.filename):
        path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(path)
        return {'response': os.path.join('uploads', file.filename),
                'scores': score(path)}
    return {'response': "BAD"}


if __name__ == '__main__':
    load_models()
    app.run(host='0.0.0.0', port=8000)