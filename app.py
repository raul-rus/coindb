import json
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#ACCESS = 'http://127.0.0.1:8000/'
DATABASE_FILE_PATH = 'static/coin_database.txt'


# http://127.0.0.1:5000/static/display_collection.html
# http://127.0.0.1:5000/static/catalogue.html
# http://127.0.0.1:5000/static/edit_coin.html
# http://127.0.0.1:5000/static/add_coin.html


def overwrite_coin(id, image, denomination, region, year, currency, metal, diameter):
    # reads from file to change data at id and overwrites with new data
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    data[id] = [id, image, denomination, region, year, currency, metal, diameter]
    f.close()
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(data))
    f.close()

def reset_database():
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps([["id", "image", "denomination", "region", "year", "currency", "metal", "diameter"]]))
    f.close()


def add_new_data(denomination, image, region, year, currency, metal, diameter):
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    data.append([len(data), denomination, image, region, year, currency, metal, diameter])
    f = open(DATABASE_FILE_PATH, "w")
    f.write(json.dumps(data))
    f.close()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/get_coins", methods=['GET'])
def get_coins():
    f = open(DATABASE_FILE_PATH, "r")
    data = json.loads(f.read())
    return data


@app.route("/add", methods=['POST'])
def add():
    features = request.get_json()
    add_new_data(**features)
    return {'response': "Coin added"}

@app.route("/edit", methods=['POST'])
def edit():
    features = request.get_json()
    overwrite_coin(*features)
    return {'response': "Coin edited"}

@app.route('/upload_image', methods=['POST'])
def upload_file():
    # check if the post request has the file part
    if 'myfile' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['myfile']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return {'response': os.path.join('uploads', filename)}
    return {'response': "BAD"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)