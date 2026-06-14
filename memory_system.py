import os
import sys

class MemorySystem:
    def __init__(self):
        self.memory = {}

    def add_memory(self, key, value):
        self.memory[key] = value

    def get_memory(self, key):
        return self.memory.get(key)

    def delete_memory(self, key):
        if key in self.memory:
            del self.memory[key]
