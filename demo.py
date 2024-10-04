
#prompt = input("Pick a topic: ")
#messages = chatprompt.format_messages(subject=prompt)
#result = chat.invoke(messages)
#while True:
#    print(result.content)
#    messages.append(result)
#    prompt = input("Response: ")
#    if (prompt=="Q"):
#        break
#    messages.append(HumanMessage(content=prompt))
#    result = chat.invoke(messages)
#prompt = listprompt.format(content=result.content)
#result = chat.invoke(prompt)
#list = listparser.parse(result.content)
#print(list)