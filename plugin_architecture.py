import os
import sys

class PluginArchitecture:
    def __init__(self):
        self.plugins = {}

    def add_plugin(self, name, plugin):
        self.plugins[name] = plugin

    def get_plugin(self, name):
        return self.plugins.get(name)

    def delete_plugin(self, name):
        if name in self.plugins:
            del self.plugins[name]
