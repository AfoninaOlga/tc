from flask import Flask, render_template, json, jsonify

from models import Canton, Grape
from evaluation import get_suitability

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def init():
    return render_template('map.html')


@app.route('/canton/<int:code>', methods=['GET'])
def get_data(code: int):
    data = Canton.get_canton_data(code)
    return jsonify(data)


@app.route('/cantons/<int:grape_id>', methods=['GET'])
def get_by_grape(grape_id):
    data = Canton.get_cantons_by_grape(grape_id)
    return jsonify(data)


@app.route('/suitability/<int:code>', methods=['GET'])
def get_suit(code: int):
    return jsonify(get_suitability(code))


@app.route('/grapes', methods=['GET'])
def get_grapes_list():
    return jsonify(Grape.get_grapes())


@app.route('/indexes', methods=['GET'])
def get_ind():
    return Canton.get_index()


@app.route('/names', methods=['GET'])
def get_name():
    return Canton.get_names()


@app.route('/grape/<int:code>', methods=['GET'])
def get_variety(code):
    data = Grape.get_grape(code)
    return jsonify(data)


@app.route('/filter/<string:filter>/<string:val>', methods=['GET'])
def get_cantons(filter, val):
    data = Canton.get_filtered_cantons(filter, val)
    return jsonify(data)


if __name__ == '__main__':
    app.run()
