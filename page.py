#make simple response giving a generated plan
#then make some shitty form
import sys
print(sys.path)
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from plan import makeList
from practice import makeQuestion
app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    print("procesing")
    result = str(makeList("compiler design"))
    print(result)
    return result

#make get requests for basic parts of the app, generate a plan from text, return a list. given a topic generate a question.
#need to make serer side state later, for now just make requests that work
#simple workflow for now is 1. take input topic, receive list of topics and subtopics
#then just iterate through each and request a practice question for the current topic. 
@app.route('/generateTopics', methods=['GET'])
def generateTopics():
    args = request.args
    topic = args["topic"]
    print(topic)
    topics = makeList(topic)
    topicList = list(map(list, topics))
    return jsonify(topicList)


@app.route('/generateQuestion', methods=['GET'])
def generateQuestions():
    args = request.args
    topic = args["topic"]
    result = makeQuestion(topic)
    print(result)
    print(type(result))
    return jsonify(result)