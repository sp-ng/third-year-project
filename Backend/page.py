#make simple response giving a generated plan
#then make some shitty form
import sys
print(sys.path)
from flask import Flask, request, jsonify, g, Response
from flask_cors import CORS
import json
from plan import makeList
from practice import makeQuestion, makeMultChoice, makeFreeResponse, generateActivities
from reading import makeReading
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
        CREATE TABLE IF NOT EXISTS data(dataID INTEGER PRIMARY KEY, courseID INTEGER, data, completed, progressData);
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



testCourse = ['test', [('History of Pizza', ['Origins of pizza', 'Evolution of pizza throughout history', 'Famous pizza styles from different regions']), ('Pizza Ingredients', ['Dough', 'Sauce', 'Cheese', 'Toppings', 'Herbs and spices']), ('Pizza Making Techniques', ['Traditional hand-tossed pizza', 'Thin crust pizza', 'Deep-dish pizza', 'Neapolitan pizza', 'Wood-fired pizza']), ('Pizza Styles from Around the World', ['Neapolitan pizza (Italy)', 'New York-style pizza (United States)', 'Chicago-style pizza (United States)', 'Margherita pizza (Italy)', 'Sicilian pizza (Italy)', 'Greek pizza (Greece)', 'Hawaiian pizza (Canada)']), ('Pizza Toppings and Combinations', ['Classic toppings (pepperoni, mushrooms, onions, etc.)', 'Vegetarian toppings', 'Gourmet toppings', 'Unusual pizza combinations']), ('Pizza Culture and Traditions', ['Pizza in popular culture (movies, TV shows, etc.)', 'Pizza festivals and events', 'Pizza etiquette and traditions in different countries']), ('Health and Nutrition', ['Nutritional value of pizza', 'Healthy pizza alternatives', 'Gluten-free and vegan pizza options']), ('Pizza Industry and Business', ['Pizza chains and franchises', 'Pizza delivery services', 'Pizza marketing and advertising']), ('Pizza Recipes and DIY Pizza', ['Homemade pizza recipes', 'Pizza dough recipes', 'Creative pizza ideas']), ('Pizza Critique and Reviews', ['Pizza restaurant reviews', 'Pizza rating systems', 'Pizza competitions and awards'])]]
testSteps = ['Read','Free Response','Multiple Choice']

#database calls
#setup course: receives topic: generates course, adds it to DB, returns the courseID.
#get course/courses: gets courseID or just return all courses and their data
#get progress data using progressID
#get data data using dataID
#TODO:
#Implement progress system - make database call
#make DB call that returns progress data for the entire course
#
#

#for now simply mark as completed or not. -- DONE
#integrate stuff into frontend now!
#
#
#




#given a dataID and the course JSON it will return the path to the dataID so you can use the data to generate stuff
def searchTree(tree, ID):
    #print(tree)
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
                    return (tree[0], topic, subtopic, step)
    #print("failed")
    return ()

@app.route('/getCourses', methods=['GET'])
def getCourses():
    data = query_db("SELECT * FROM courses")
    result = []
    #print(data)
    for row in data:
        #print("bhfejfjsafvbusdjbg")
        #print(row[1])
        if (row[1] != None):
            rowDict= {
            'courseID': row[0],
            'data': json.loads(row[1])
            }
            result.append(rowDict)
    return jsonify(result)

@app.route('/getCourse', methods=['GET'])
def getCourse():
    args = request.args
    id = args["courseID"]
    data = query_db("SELECT * FROM courses WHERE courseID=?",(id,))
    #print(data)
    result = {
        'courseID': data[0][0],
        'data': json.loads(data[0][1])
    }
    return jsonify(result)



@app.route('/makeCourse', methods=['GET'])
def makeCourse():

    #TODO:
    #Implement using the activity chain to generate activities rather than using the premade ones
    #
    #
    #
    print("making course")
    args = request.args
    topic = args["topic"]
    print(topic)
    topics = makeList(topic)
    topicList = list(map(list, topics))[0]
    print(topicList)
    topicList[0]=topic
    #topicList = copy.deepcopy(testCourse)    
    pkey = insert_row("INSERT INTO courses (course) VALUES(NULL)")
    #print(topicList)
    for index, unit in enumerate(topicList[1]): 
        #print(unit)
        for inner_index, subtopic in enumerate(unit[1]):
            print(subtopic)
            print(f"{subtopic} in the context of {unit[0]} in the context of {topic}")
            activities = generateActivities(f"{subtopic} in the context of {unit[0]} in the context of {topic}")['activities']
            #print(activities)

            #for activity_index, activity in enumerate(activities):
            #    temp = [activity[0], 0, activity[1]]
            #    activities[activity_index] = temp

            print(activities)

            topicList[1][index][1][inner_index] = (subtopic, activities)
            #add the extra layer
            #topicList[1][index][1][inner_index] = (subtopic, copy.deepcopy(testSteps))
            for stepIndex, step in enumerate(topicList[1][index][1][inner_index][1]):
                #print(step)
                #pkeyProgress = insert_row("INSERT INTO progress (courseID, progress) VALUES(?, NULL)", (pkey,))
                pkeyData = insert_row("INSERT INTO data (courseID, data, completed) VALUES(?, NULL, 0)", (pkey,))
                #topicList[1][index][1][inner_index][1][stepIndex] = (step, pkeyData, pkeyProgress)
                topicList[1][index][1][inner_index][1][stepIndex] = (step, pkeyData)
            #add an extra layer containing the specific exercises to be done here. 

            #for each one of these just make a new row in each table, get its ID, add it into the list    
    #iterate through the leaves and make empty database rows for each one
    #print(json.dumps(topicList))
    insert_row("UPDATE courses SET course = ? WHERE courseID=?", (json.dumps(topicList),pkey))
    return jsonify(topicList)


@app.route('/setProgress', methods=['GET', 'POST'])
def setProgress():
    #sets completed column to 0 or 1
    #optionally sets progress data if supplied (must be JSON)
    args = request.args
    progress = args["completed"]
    id = args["id"]
    if "progressData" in args:
        data = args["progressData"]
        #print("thingy")
        #print(data)
        insert_row("UPDATE data SET completed=?, progressData=? WHERE dataID=?", (progress,data,id))
    else:
        insert_row("UPDATE data SET completed=? WHERE dataID=?", (progress,id))
    return (Response(),200)

@app.route('/getProgress', methods=['GET'])
def getProgress():
    #returns completion and whatever extra data is contained in the progressData column
    args = request.args
    id = args["id"]
    progress = query_db('SELECT completed, progressData FROM data WHERE dataID=?',(id,))
    response = dict()
    response["completed"] = progress[0][0]
    if progress[0][1] != None:
        response["progressData"] = json.loads(progress[0][1])
    return jsonify(response)

@app.route('/getCourseProgress', methods=['GET'])
def getCourseProgress():
    #count how many subtopics have been completed overall
    #1. get course structure
    args = request.args
    id = args["courseID"]
    data = query_db("SELECT * FROM courses WHERE courseID=?",(id,))
    course = json.loads(data[0][1])[1]
    #print(course)
    #2. iterate through the subtopics, checking if they are fully completed or not.
    subTopics = 0
    completed = 0
    for topic in course:
        #print(topic)
        for subtopic in topic[1]:
            subTopics += 1
            #print(subtopic)
            complete = True
            for step in subtopic[1]:
                complete = query_db("SELECT completed FROM data WHERE dataID=?",(step[1],))[0][0]
                #print(complete)
                if int(complete) != 1:
                    complete = False
            if complete:
                completed += 1
    return jsonify(subTopics, completed)



def generateData(id):
    #1. get json from courses with matching courseID       
    data = query_db("SELECT courseID, data FROM data WHERE dataID=?",(id,))
    if data == None:
        return '{}'
    coursestr = query_db("SELECT course FROM courses WHERE courseID=?",(data[0][0],))
    course = json.loads(coursestr[0][0])[1]       
    #2. search through json to find the data relating to the matching dataID
    searchFields = searchTree(json.loads(coursestr[0][0]), id)
    print("SEARCH FIELDS:")
    print(searchFields)

    topicstr = f"{searchFields[3][1]} in the context of {searchFields[2]} in the context of {searchFields[1]} in the context of {searchFields[0]}"
    type = searchFields[3]
    print("TYPE:")
    print(type)
    match type[0]:
        case 'Reading':
            result = makeReading(topicstr)
            result['title'] = searchFields[3][1]
        case 'Free Response':
            result = makeFreeResponse(topicstr)
        case 'Multiple Choice':
            result = makeMultChoice(topicstr)

    #3. use the topic found to generate content
    #result = makeQuestion(topicname)
    #print(result)
    #4. insert it into the DB and return the data
    insert_row("UPDATE data SET data=? WHERE dataID=?", (json.dumps(result),id))
    return jsonify(result)

@app.route('/getData', methods=['GET'])
def getData():
    #get data at provided dataID. 
    #if null then go find all the topic data using the dataID and course ID and generate stuff.
    args = request.args
    id = args["dataID"]
    data = query_db("SELECT courseID, data FROM data WHERE dataID=?",(id,))
    #print("doing shit")
    if (data[0][1] == None):
        
        # #print("not cached")
        # #1. get json from courses with matching courseID       
        # coursestr = query_db("SELECT course FROM courses WHERE courseID=?",(data[0][0],))
        # course = json.loads(coursestr[0][0])[1]       
        # #2. search through json to find the data relating to the matching dataID
        # searchFields = searchTree(json.loads(coursestr[0][0]), id)
        # print("SEARCH FIELDS:")
        # print(searchFields)
    
        # topicstr = f"{searchFields[3][1]} in the context of {searchFields[2]} in the context of {searchFields[1]} in the context of {searchFields[0]}"
        # type = searchFields[3]
        # print("TYPE:")
        # print(type)
        # match type[0]:
        #     case 'Reading':
        #         result = makeReading(topicstr)
        #         result['title'] = searchFields[3][1]
        #     case 'Free Response':
        #         result = makeFreeResponse(topicstr)
        #     case 'Multiple Choice':
        #         result = makeMultChoice(topicstr)

        # #3. use the topic found to generate content
        # #result = makeQuestion(topicname)
        # #print(result)
        # #4. insert it into the DB and return the data
        # insert_row("UPDATE data SET data=? WHERE dataID=?", (json.dumps(result),id))
        generateData(int(id)+1)
        generateData(int(id)+2)
        
        result = generateData(id)
        return result
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