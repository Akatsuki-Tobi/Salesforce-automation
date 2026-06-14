import os
import sys

class WorkflowOrchestration:
    def __init__(self):
        self.workflows = {}

    def add_workflow(self, name, workflow):
        self.workflows[name] = workflow

    def get_workflow(self, name):
        return self.workflows.get(name)

    def delete_workflow(self, name):
        if name in self.workflows:
            del self.workflows[name]
