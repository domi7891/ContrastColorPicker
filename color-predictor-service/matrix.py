import random, jsonpickle

import numpy as np


class Matrix:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.data = np.zeros((rows, cols))

    def copy(self):
        matrix = Matrix(self.rows, self.cols)
        for i in range(0, self.rows):
            for j in range(0, self.cols):
                matrix.data[i][j] = self.data[i][j]
        return matrix

    @staticmethod
    def fromArray(array):
        return Matrix(len(array), 1).map(lambda *e: array[e[1]])

    @staticmethod
    def subtract(a, b):
        if a.rows != b.rows or a.cols != b.cols:
            return
        return Matrix(a.rows, a.cols).map(lambda _, i, j: a.data[i][j] - b.data[i][j])

    def toArray(self):
        array = []
        for i in range(0, self.rows):
            for j in range(0, self.cols):
                array.append(self.data[i][j])
        return array

    def randomize(self):
        return self.map(lambda *e: random.random() * 2 - 1)

    def add(self, n):
        if isinstance(n, Matrix):
            if self.rows != n.rows or self.cols != n.cols:
                return
            return self.map(lambda e, i, j: e + n.data[i][j])
        return self.map(lambda e: e + n)

    @staticmethod
    def transpose(matrix):
        return Matrix(matrix.cols, matrix.rows).map(lambda _, i, j: matrix.data[j][i])

    @staticmethod
    def multiplyStatic(a, b):
        if a.cols != b.rows:
            return

        matrix = Matrix(a.rows, b.cols)
        for i in range(0, a.rows):
            for j in range(0, b.cols):
                sum = 0
                for idx in range(0, a.cols):
                    sum += a.data[i][idx] * b.data[idx][j]
                matrix.data[i][j] = sum
        return matrix

    def multiply(self, n):
        if isinstance(n, Matrix):
            if self.rows != n.rows or self.cols != n.cols:
                return
            return self.map(lambda e, i, j: e * n.data[i][j])
        return self.map(lambda *e: e[0] * n)

    def map(self, func):
        for i in range(0, self.rows):
            for j in range(0, self.cols):
                val = self.data[i][j]
                self.data[i][j] = func(val, i, j)
        return self

    @staticmethod
    def mapStatic(matrix, func):
        return Matrix(matrix.rows, matrix.cols).map(lambda e, i, j: func(matrix.data[i][j]))

    def print(self):
        print(self.data)

    def serialize(self):
        return jsonpickle.encode(self)

    @staticmethod
    def deserialize(data):
        if isinstance(data, str):
            data = jsonpickle.decode(data)
        matrix = Matrix(data.rows, data.cols)
        matrix.data = data.data
        return matrix
