class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func
        this.dfunc = dfunc
    }
}

let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
)

let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
)

class NeuralNetwork {

    constructor(in_layers, hidden_layers, out_layers) {

        //Check if a neural Network is passed
        if (in_layers instanceof NeuralNetwork) {
            //Copy Network

            let nn = in_layers;
            this.in_layers = a.in_layers
            this.hidden_layers = a.hidden_layers
            this.out_layers = a.out_layers

            this.ih_weights = a.ih_weights.copy()
            this.ho_weights = a.ho_weights.copy()

            this.h_bias = a.h_bias.copy()
            this.o_bias = a.o_bias.copy()
        } else {
            this.in_layers = in_layers
            this.hidden_layers = hidden_layers
            this.out_layers = out_layers

            this.ih_weights = new Matrix(this.hidden_layers, this.in_layers)
            this.ho_weights = new Matrix(this.out_layers, this.hidden_layers)
            this.ih_weights.randomize()
            this.ho_weights.randomize()

            this.h_bias = new Matrix(this.hidden_layers, 1)
            this.o_bias = new Matrix(this.out_layers, 1)
            this.h_bias.randomize()
            this.o_bias.randomize()
        }

        this.setLearningRate()
        this.setActivationFunc()
    }

    predict(input) {

        let inputs = Matrix.fromArray(input)
        let hidden = Matrix.multiply(this.ih_weights, inputs)
        hidden.add(this.h_bias)
        hidden.map(this.activation_function.func)

        let output = Matrix.multiply(this.ho_weights, hidden)
        output.add(this.o_bias)
        output.map(this.activation_function.func)

        return output.toArray()
    }

    setLearningRate(learning_rate = 0.1) {
        this.learning_rate = learning_rate
    }

    setActivationFunc(func = sigmoid) {
        this.activation_function = func
    }

    train(input, target) {
        let inputs = Matrix.fromArray(input)
        let hidden = Matrix.multiply(this.ih_weights, inputs)
        hidden.add(this.h_bias)
        hidden.map(this.activation_function.func)

        let outputs = Matrix.multiply(this.ho_weights, hidden)
        outputs.add(this.o_bias)
        outputs.map(this.activation_function.func)

        let targets = Matrix.fromArray(target)

        let out_err = Matrix.subtract(targets, outputs)

        let gradients = Matrix.map(outputs, this.activation_function.dfunc)
        gradients.multiply(out_err)
        gradients.multiply(this.learning_rate)

        let hidden_T = Matrix.transpose(hidden)
        let ho_weights_delta = Matrix.multiply(gradients, hidden_T)

        this.ho_weights.add(ho_weights_delta)
        this.o_bias.add(gradients)

        let ho_weights_t = Matrix.transpose(this.ho_weights)
        let hid_err = Matrix.multiply(ho_weights_t, out_err)

        let hid_grad = Matrix.map(hidden, this.activation_function.dfunc)
        hid_grad.multiply(hid_err)
        hid_grad.multiply(this.learning_rate)

        let inputs_t = Matrix.transpose(inputs)
        let ih_weights_delta = Matrix.multiply(hid_grad, inputs_t)

        this.ih_weights.add(ih_weights_delta)
        this.h_bias.add(hid_grad)
    }

    serialize() {
        let json = JSON.stringify(this)
        return json
    }

    static deserialize(data) {
        if (typeof data == 'string')
            data = JSON.parse(data)

        let nn = new NeuralNetwork(data.in_layers, data.hidden_layers, data.out_layers)
        nn.ih_weights = Matrix.deserialize(data.ih_weights)
        nn.ho_weights = Matrix.deserialize(data.ho_weights)
        nn.h_bias = Matrix.deserialize(data.h_bias)
        nn.o_bias = Matrix.deserialize(data.o_bias)
        nn.learning_rate = data.learning_rate
        return nn
    }

    copy() {
        return new NeuralNetwork(this)
    }

    mutate(func) {
        this.ih_weights.map(func)
        this.oh_weights.map(func)
        this.h_bias.map(func)
        this.o_bias.map(func)
    }

}