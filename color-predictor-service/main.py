import traceback
from nn import NeuralNetwork
from flask import Flask, request, jsonify
from flask_cors import cross_origin

app = Flask('contrastPicker')
nn = None


def calc(r, g, b):
    return r / 255, g / 255, b / 255


def success_resp(value):
    return jsonify(
        success=True,
        value=value
    ), 200


def error_resp(value):
    return jsonify(
        success=False,
        value=value
    ), 500


@app.route("/run")
@cross_origin()
def run():
    try:
        r = request.args.get("r", type=str)
        g = request.args.get("g", type=str)
        b = request.args.get("b", type=str)

        inputs = calc(int(r), int(g), int(b))

        out = nn.predict(inputs)

        outR = out[0]
        outG = out[1]
        outB = out[2]

        return success_resp([outR, outG, outB])
    except (KeyboardInterrupt, SystemExit):
        raise
    except Exception:
        return error_resp(traceback.format_exc())


if __name__ == '__main__':
    nn = NeuralNetwork.load('brain.json')
    print('Setup done')

    app.run()


