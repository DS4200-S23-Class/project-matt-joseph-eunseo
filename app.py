from flask import Flask, request, render_template
import json

from helpers import get_data, get_genes, get_diseases

app = Flask(__name__, template_folder='', static_folder='')

@app.route('/')
def layout():
    return render_template('index.html')

@app.route('/data', methods=['GET'])
def send_data():
    gene = request.args.get('gene', default='ERBB2', type=str)
    data = get_data(gene)
    return data.to_json()

@app.route('/genes', methods=['GET'])
def send_genes():
    genes = get_genes()
    return json.dumps(genes)

@app.route('/diseases', methods=['GET'])
def send_diseases():
    diseases = get_diseases()
    return json.dumps(diseases)

if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0', port = 8000)
