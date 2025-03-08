import os
import json
import torch
from flask import Flask, request
from coin_grader.model import Net

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Polymorphism in case the file names change.
CATALOGUE_FILE_PATH = 'static/coin_database.txt'
COLLECTION_FILE_PATH = 'static/display_collection.txt'
FEATURES = ['shape', 'wear', 'metal']
MODELS = {}


# Helper method to create a list of coins to traverse by reading the file.
def create_data_list(file_path):
    file = open(file_path, "r")
    json_object = json.loads(file.read())
    file.close()
    return json_object


# Helper method that overwrites the files with new data.
def overwrite_data_file(file_path, json_object):
    file = open(file_path, "w")
    file.write(json.dumps(json_object))
    file.close()


def overwrite_coin(id, image, denomination, region, year, currency, metal, diameter):
    data = create_data_list(CATALOGUE_FILE_PATH)
    index = -1
    # Finds index of old element with id and overwrites it.
    for i in range(len(data)):
        if str(data[i][0]) == str(id):
            index = i

    data[index] = [id, image, denomination, region, year, currency, metal, diameter]
    # Saves the change to the data by overwriting the file.
    overwrite_data_file(CATALOGUE_FILE_PATH, data)


# Used in development to test, resets the catalogue for sanity.
def reset_database():
    overwrite_data_file(CATALOGUE_FILE_PATH, json.dumps([["id", "image", "denomination", "region", "year", "currency", "metal", "diameter"]]))

def reset_collections():
    overwrite_data_file(COLLECTION_FILE_PATH, json.dumps([{"coins": [], "name": "Choose Collection"}]))


def generate_new_id():
    data = create_data_list(CATALOGUE_FILE_PATH)
    highest_id = 0
    id_list = []

    for coin in data:
        id_list.append(coin[0])
    # Finds the highest id from the list, so the new id is the highest incremented by one.
    for i in range(len(id_list) - 1):
        if int(id_list[i + 1]) > highest_id:
            highest_id = int(id_list[i + 1])

    return highest_id + 1


def add_new_data(denomination, image, region, year, currency, metal, diameter):
    data = create_data_list(CATALOGUE_FILE_PATH)
    data.append([generate_new_id(), image, denomination, region, year, currency, metal, diameter])
    overwrite_data_file(CATALOGUE_FILE_PATH, data)


def write_collection(collection):
    overwrite_data_file(COLLECTION_FILE_PATH, collection)


def remove_collection(collection):
    data = create_data_list(COLLECTION_FILE_PATH)
    result = []
    for coin_group in data:
        if coin_group[1] != collection[1]:
            result.append(data)
    overwrite_data_file(COLLECTION_FILE_PATH, result)


def remove_data(coin_id):
    data = create_data_list(CATALOGUE_FILE_PATH)
    result = [coin for coin in data if str(coin[0]) != str(coin_id)]
    overwrite_data_file(CATALOGUE_FILE_PATH, result)


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
    return create_data_list(CATALOGUE_FILE_PATH)


@app.route("/get_collection", methods=['GET'])
def get_collection():
    return create_data_list(COLLECTION_FILE_PATH)


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
    if file:
        path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(path)
        return {'response': os.path.join('uploads', file.filename),
                'scores': score(path)}
    return {'response': "BAD"}


if __name__ == '__main__':
    load_models()
    app.run(host='0.0.0.0', port=8000)