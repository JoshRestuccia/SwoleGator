from flask import Flask, json
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logging.getLogger('flask_cors').level = logging.DEBUG

@app.route('/api/getdata')
def getData():
    # Create python script to move data from data file to application
    f = open('../../data/examples/generated/generated2.json')
    data = f.read()
    logging.log(2, "The JSON data looks like the following:\n", data)
    f.close()
    logging.log(2, "The JSON data looks like the following:\n", json.loads(data))
    return json.loads(data)

if __name__ == '__main__':
    app.run(host= '192.168.0.19', port=3000, debug=True)