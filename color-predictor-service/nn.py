import json
import jsonpickle
import math

from matrix import Matrix


class ActivationFunction:
    def __init__(self, func, dfunc):
        self.func = func
        self.dfunc = dfunc


sigmoid = ActivationFunction(lambda *x: 1 / (1 + math.exp(-x[0])), lambda *y: y[0] * (1 - y[0]))

tanh = ActivationFunction(lambda *x: math.tanh(x[0]), lambda *y: 1 - (y[0] * y[0]))


class NeuralNetwork:
    def __init__(self, *in_layers):  # hidden_layers, out_layers):

        if isinstance(in_layers, NeuralNetwork):
            nn = in_layers
            self.input_layers = nn.input_layers
            self.hidden_layers = nn.hidden_layers
            self.output_layers = nn.output_layers

            self.ih_weights = nn.ih_weights.copy()
            self.ho_weights = nn.ho_weights.copy()

            self.h_bias = nn.h_bias.copy()
            self.o_bias = nn.o_bias.copy()
        else:
            self.input_layers = in_layers[0]
            self.hidden_layers = in_layers[1]  # hidden_layers
            self.output_layers = in_layers[2]  # out_layers

            self.ih_weights = Matrix(self.hidden_layers, self.input_layers)
            self.ho_weights = Matrix(self.output_layers, self.hidden_layers)
            self.ih_weights.randomize()
            self.ho_weights.randomize()

            self.h_bias = Matrix(self.hidden_layers, 1)
            self.o_bias = Matrix(self.output_layers, 1)
            self.h_bias.randomize()
            self.o_bias.randomize()

        self.setLearningRate()
        self.setActivationFunc()

    def setLearningRate(self, learning_rate=0.1):
        self.learning_rate = learning_rate

    def setActivationFunc(self, func=sigmoid):
        self.activation_function = func

    def predict(self, in_val):
        inputs = Matrix.fromArray(in_val)
        hidden = Matrix.multiplyStatic(self.ih_weights, inputs)
        hidden.add(self.h_bias)
        hidden.map(self.activation_function.func)

        output = Matrix.multiplyStatic(self.ho_weights, hidden)
        output.add(self.o_bias)
        output.map(self.activation_function.func)

        return output.toArray()

    def train(self, in_val, target):
        inputs = Matrix.fromArray(in_val)
        hidden = Matrix.multiplyStatic(self.ih_weights, inputs)
        hidden.add(self.h_bias)
        hidden.map(self.activation_function.func)

        output = Matrix.multiplyStatic(self.ho_weights, hidden)
        output.add(self.o_bias)
        output.map(self.activation_function.func)

        targets = Matrix.fromArray(target)

        out_err = Matrix.subtract(targets, output)

        gradients = Matrix.mapStatic(output, self.activation_function.dfunc)
        gradients.multiply(out_err)
        gradients.multiply(self.learning_rate)

        hidden_T = Matrix.transpose(hidden)
        ho_weights_delta = Matrix.multiplyStatic(gradients, hidden_T)

        self.ho_weights.add(ho_weights_delta)
        self.o_bias.add(gradients)

        ho_weights_t = Matrix.transpose(self.ho_weights)
        hid_err = Matrix.multiplyStatic(ho_weights_t, out_err)

        hid_grad = Matrix.mapStatic(hidden, self.activation_function.dfunc)
        hid_grad.multiply(hid_err)
        hid_grad.multiply(self.learning_rate)

        inputs_t = Matrix.transpose(inputs)
        ih_weights_delta = Matrix.multiplyStatic(hid_grad, inputs_t)

        self.ih_weights.add(ih_weights_delta)
        self.h_bias.add(hid_grad)

    def serialize(self):
        return jsonpickle.encode(self)

    @staticmethod
    def deserialize(data):
        if isinstance(data, str):
            data = jsonpickle.decode(data)

        nn = NeuralNetwork(data.input_layers, data.hidden_layers, data.output_layers)
        nn.ih_weights = Matrix.deserialize(data.ih_weights)
        nn.ho_weights = Matrix.deserialize(data.ho_weights)
        nn.h_bias = Matrix.deserialize(data.h_bias)
        nn.o_bias = Matrix.deserialize(data.o_bias)
        nn.learning_rate = data.learning_rate
        return nn

    @staticmethod
    def load(path):
        with open('brain.json') as json_file:
            data = json.load(json_file)
            data = jsonpickle.decode(data)
        return NeuralNetwork.deserialize(data)

    def copy(self):
        return NeuralNetwork(self)

    def mutate(self, func):
        self.ih_weights.map(func)
        self.ho_weights.map(func)
        self.h_bias.map(func)
        self.o_bias.map(func)
