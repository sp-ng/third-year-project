#make simple response giving a generated plan
#then make some shitty form
import sys
print(sys.path)
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import json
from plan import makeList
from practice import makeQuestion
import sqlite3
import copy
app = Flask(__name__)
CORS(app)

DATABASE = "data.db"

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def init_db():
    with app.app_context():
        db = get_db()
        db.cursor().executescript("""        
        BEGIN;
        CREATE TABLE IF NOT EXISTS courses(courseID INTEGER PRIMARY KEY, course);
        CREATE TABLE IF NOT EXISTS progress(progressID INTEGER PRIMARY KEY, courseID INTEGER, progress);
        CREATE TABLE IF NOT EXISTS data(dataID INTEGER PRIMARY KEY, courseID INTEGER, data);
        COMMIT;
        """)
        res = db.cursor().execute("SELECT name FROM sqlite_master")
        print(res.fetchall())

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def insert_row(query, args=()):
    get_db().execute(query, args)
    get_db().commit()
    pkey = query_db('SELECT last_insert_rowid()')
    return pkey[0][0]




init_db()

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()



testCourse = ['topics', [('History of Pizza', ['Origins of pizza', 'Evolution of pizza throughout history', 'Famous pizza styles from different regions']), ('Pizza Ingredients', ['Dough', 'Sauce', 'Cheese', 'Toppings', 'Herbs and spices']), ('Pizza Making Techniques', ['Traditional hand-tossed pizza', 'Thin crust pizza', 'Deep-dish pizza', 'Neapolitan pizza', 'Wood-fired pizza']), ('Pizza Styles from Around the World', ['Neapolitan pizza (Italy)', 'New York-style pizza (United States)', 'Chicago-style pizza (United States)', 'Margherita pizza (Italy)', 'Sicilian pizza (Italy)', 'Greek pizza (Greece)', 'Hawaiian pizza (Canada)']), ('Pizza Toppings and Combinations', ['Classic toppings (pepperoni, mushrooms, onions, etc.)', 'Vegetarian toppings', 'Gourmet toppings', 'Unusual pizza combinations']), ('Pizza Culture and Traditions', ['Pizza in popular culture (movies, TV shows, etc.)', 'Pizza festivals and events', 'Pizza etiquette and traditions in different countries']), ('Health and Nutrition', ['Nutritional value of pizza', 'Healthy pizza alternatives', 'Gluten-free and vegan pizza options']), ('Pizza Industry and Business', ['Pizza chains and franchises', 'Pizza delivery services', 'Pizza marketing and advertising']), ('Pizza Recipes and DIY Pizza', ['Homemade pizza recipes', 'Pizza dough recipes', 'Creative pizza ideas']), ('Pizza Critique and Reviews', ['Pizza restaurant reviews', 'Pizza rating systems', 'Pizza competitions and awards'])]]
testSteps = ['Read','Free Response','Read','Free Response','Multiple Choice']

#database calls
#setup course: receives topic: generates course, adds it to DB, returns the courseID.
#get course/courses: gets courseID or just return all courses and their data
#get progress data using progressID
#get data data using dataID
#TODO:
#Implement progress system - make database call
#
#Setup getData, will need a function that given a dataID and the course JSON it will return the path to the ID so you can use the data to generate stuff
#
#
#
#Figure out how you will specify what type of content each piece of data will be, setup with course generation
#If you want to have any intelligent generation of the steps within a topic u need to store it in the DB.
#Just add another layer to the tree JSON -- DONE
#
#


#given a dataID and the course JSON it will return the path to the dataID so you can use the data to generate stuff
def searchTree(tree, ID):
    for topics in tree[1]:
        topic = topics[0]
        for subtopics in topics[1]:
            subtopic = subtopics[0]
            #print(subtopics)
            for steps in subtopics[1]:
                step = steps[0]
                dataID = steps[1]
                #print("DataID and ID are: " + str(dataID) + " " + str(ID))
                if (int(dataID) == int(ID)):
                    #print("found")
                    return (topic, subtopic, step)
    #print("failed")
    return ()



@app.route('/makeCourse', methods=['GET'])
def makeCourse():
    args = request.args
    topic = args["topic"]
    print(topic)
    #topics = makeList(topic)
    #topicList = list(map(list, topics))
    topicList = copy.deepcopy(testCourse)    
    pkey = insert_row("INSERT INTO courses (course) VALUES(NULL)")
    for index, unit in enumerate(topicList[1]): 
        #print(unit)
        for inner_index, topic in enumerate(unit[1]):
            #print(topic)
            #add the extra layer
            topicList[1][index][1][inner_index] = (topic, copy.deepcopy(testSteps))
            for stepIndex, step in enumerate(topicList[1][index][1][inner_index][1]):
                #print(step)
                pkeyProgress = insert_row("INSERT INTO progress (courseID, progress) VALUES(?, NULL)", (pkey,))
                pkeyData = insert_row("INSERT INTO data (courseID, data) VALUES(?, NULL)", (pkey,))
                topicList[1][index][1][inner_index][1][stepIndex] = (step, pkeyData, pkeyProgress)
            #add an extra layer containing the specific exercises to be done here. 

            #for each one of these just make a new row in each table, get its ID, add it into the list    
    #iterate through the leaves and make empty database rows for each one
    #print(json.dumps(topicList))
    insert_row("UPDATE courses SET course = ? WHERE courseID=?", (json.dumps(topicList),pkey))
    return jsonify(topicList)

@app.route('/getProgress', methods=['GET'])
def getProgress():
    
    args = request.args
    topic = args["topic"]


@app.route('/getData', methods=['GET'])
def getData():
    #get data at provided dataID. 
    #if null then go find all the topic data using the dataID and course ID and generate stuff.
    args = request.args
    id = args["dataID"]
    data = query_db("SELECT courseID, data FROM data WHERE dataID=?",(id,))
    print("doing shit")
    if (data[0][1] == None):
        print("not cached")
        #1. get json from courses with matching courseID       
        coursestr = query_db("SELECT course FROM courses WHERE courseID=?",(data[0][0],))
        course = json.loads(coursestr[0][0])[1]       
        #2. search through json to find the leaf with matching dataID
        searchFields = searchTree(json.loads(coursestr[0][0]), id)
        print(searchFields)
        topicname = searchFields[1]
        #for topic in course:
        #    for subtopic in topic[1]:
        #        print("something")
        #        if int(subtopic[1][0][1]) == int(id):
        #            print(subtopic[0])
        #            topicname = subtopic[0]
        #            print("Generating new topic about: " + str(topicname))
        #3. use the topic found to generate content
        result = makeQuestion(topicname)
        print(result)
        #4. insert it into the DB and return the data
        insert_row("UPDATE data SET data=? WHERE dataID=?", (json.dumps(result),id))
        return jsonify(result)
    else:        
        print("cached")
        return jsonify(json.loads(data[0][1]))
    







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
    print("generating a question about " + topic)
    result = makeQuestion(topic)
    print(result)
    print(type(result))
    return jsonify(result)