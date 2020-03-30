import json
import random, math
import utils as ut
from nn import NeuralNetwork


def createTrainingsData():
    inputs = []
    targets = []
    idx = 0
    while idx < 10000:
        redOfFirst = math.floor(random.random() * 255)
        greenOfFirst = math.floor(random.random() * 255)
        blueOfFirst = math.floor(random.random() * 255)
        hex1 = ut.toHex(redOfFirst) + "" + ut.toHex(greenOfFirst) + "" + ut.toHex(blueOfFirst)

        lum = 1
        redOfSec = None
        greenOfSec = None
        blueOfSec = None
        while lum < 4.5:
            redOfSec = math.floor(random.random() * 255)
            greenOfSec = math.floor(random.random() * 255)
            blueOfSec = math.floor(random.random() * 255)

            hex2 = ut.toHex(redOfSec) + "" + ut.toHex(greenOfSec) + "" + ut.toHex(blueOfSec)
            lum = ut.calcLumin('#' + hex1, '#' + hex2)
        inputs.append([redOfFirst / 255, greenOfFirst / 255, blueOfFirst / 255])
        targets.append([redOfSec / 255, greenOfSec / 255, blueOfSec / 255])
        idx += 1
    return inputs, targets


def train():
    nn = NeuralNetwork.load('brain.json')
    # nn = NeuralNetwork(3, 11, 3)

    inputs, targets = createTrainingsData()
    for idx in range(0, 1):
        for i in range(0, len(inputs)):
            nn.train(inputs[i], targets[i])

    with open('brain.json', 'w') as outfile:
        json.dump(nn.serialize(), outfile)


train()
