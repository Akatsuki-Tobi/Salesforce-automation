import os
import sys

class TechnicalDebtAnalysis:
    def __init__(self):
        self.technical_debt = {}

    def add_technical_debt(self, name, debt):
        self.technical_debt[name] = debt

    def get_technical_debt(self, name):
        return self.technical_debt.get(name)

    def delete_technical_debt(self, name):
        if name in self.technical_debt:
            del self.technical_debt[name]
