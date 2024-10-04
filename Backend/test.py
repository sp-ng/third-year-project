from practice import generateActivities

while (True):
    topic = input("Topic")
    activities = generateActivities(topic)
    print(activities)