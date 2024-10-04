from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
openai_api_key='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'
from langchain.memory import ChatMessageHistory
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from langchain.prompts import PromptTemplate
from langchain.prompts.chat import ChatPromptTemplate
from langchain.output_parsers import CommaSeparatedListOutputParser
from typing import Deque, List, Optional, Tuple
from langchain.output_parsers import RetryWithErrorOutputParser
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
# from langchain_core.output_parsers import JsonOutputParser
# from langchain_core.pydantic_v1 import BaseModel, Field

class Topics(BaseModel):
    topics: List[Tuple[str, List[str]]]
#What previous chain generates:
#Literally just a nested list of topics and subtopics

#What you need to generate:
#1. overall title -- do after
#2. topics
#3. subtopics for each topic
#4. specific practice and reading steps for each subtopic -- doing afterwards
#
#4 fucking levels of nesting here compared to just 2 before
#can at least generate the title afterwards but ideally at the start.
#two factors when picking activities:
#1. the amount, based on the desnsity of info in the subtopic, info density is managed best by splitting info
#    best way to manage this point is to introduce sub-subtopics to further distribute information
#    then just have 1 reading section for each
#2. the type, how do you pick which types of practice you want based on what you are learning.
#    what is each type of practice good at and bad at
#
#Three types of practice:
#   1. mult choice
#   2. free response
#   3. Q&A
#
#The main pattern here is that each question demands an increasingly complex understanding. 
#Q&A might also be a direct replacement for free response. 
#could maybe have it pregenerate a list of things to check and it goes in order questioning the user? idk too much effort. 
#
#ignore Q&A for now, just make sure the way you do things can be modified to use Q&A
#
#I think for each subtopic you will have an individual process that generates both the topics of questioning and the types of questions you want
#for the entire subtopic in one go
#
#I need to tune the topic and subtopic generation too, though that is very well handled by natural lanaguage feedback in generation
#
#1. make a chain that generates the questions based on a nice complete input
#2. use the chain to setup a logic to batch generate stuff and put questions into the database.
#
#actually a pretty good idea to integrate further splitting of reading into this step
#the chain creates a list of reading topics, and questions
#







class TopicsTest(BaseModel):
    title: str = Field(description="A title for the topics")
    topics: List[Tuple[str, List[str]]]
    



# listparser = JsonOutputParser(pydantic_object=Topics)
# listparserTest = JsonOutputParser(pydantic_object=TopicsTest)


listparserTest = PydanticOutputParser(pydantic_object=TopicsTest)


format_instructionsTest = listparserTest.get_format_instructions()

#Define JSON schema
class Topics(BaseModel):
    topics: List[Tuple[str, List[str]]]
listparser = PydanticOutputParser(pydantic_object=Topics)
#Chat message template to create topics and then change them with user feedback
chatprompt = ChatPromptTemplate.from_messages([
    ("system", """Work with the user to create a list of topics and subtopics for studying, after a response ask if the user wants any changes. 
     It must always be a list of topics and subtopics."""),
    ("human", "Generate a list of topics with subtopics for the following subject: {subject}"),
])
#This template takes the final list in text form and formats it as JSON so it can be parsed
listprompt = PromptTemplate(
    template="""List: {content}.\n Instructions: Format the above list to create a JSON with nested lists according to the following provided 
    format instructions. Ignore any extra text in the List section that is not a part of the list.\n Format instructions: {format_instructions}""",
    input_variables=["content"],
    partial_variables={"format_instructions": listparser.get_format_instructions()}
)

format_instructions = listparser.get_format_instructions()

topicprompt = PromptTemplate(
    template="Create topics and subtopics for studying the following topic: {topic}.\n Format the above list to create a JSON with nested lists according to the following provided format instructions. Format instructions: {format_instructions}",
    input_variables=["topic"],
    partial_variables={"format_instructions": format_instructions}
)
topictestprompt = PromptTemplate(
    template="Create topics and their corresponding subtopics for studying the following topic: {topic}.\n Format instructions: {format_instructions}",
    input_variables=["topic"],
    partial_variables={"format_instructions": format_instructions}
)
topictestpromptTest = PromptTemplate(
    template="Create a title and then topics and their corresponding subtopics for studying the following: {topic}.\n Format instructions: {format_instructions}",
    input_variables=["topic"],
    partial_variables={"format_instructions": format_instructionsTest}
)

formatprompt = PromptTemplate(
    template="{content}.\n answer by generating a list of topics and subtopics using the following format:\n {format_instructions}",
    input_variables=["content"],
    partial_variables={"format_instructions": format_instructions}
)

titleprompt = PromptTemplate(
    template="{content}.\n answer by generating a list of topics and subtopics using the following format:\n {format_instructions}",
    input_variables=["content"],
)

chat = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name="gpt-3.5-turbo", max_tokens=4000)
chatJSON = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name="gpt-3.5-turbo", max_tokens=4000, model_kwargs={"response_format": {"type": "json_object"}})
topicChain = topictestprompt | chatJSON | listparser
topicChainTest = topictestpromptTest | chatJSON | listparserTest
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

def makeList(topic): #Makes list directly from topics
    #messages = chatprompt.format_messages(subject=topic)
    #print(format_instructionsTest)
    result = topicChain.invoke({"topic": topic})
    #messages = topicprompt.format(topic=topic)
    #resultTest = chatJSON.invoke(topictestpromptTest.format(topic=topic))
    #print(resultTest.content)
    #result = listparserTest.parse(resultTest.content)
    #list = listparser.parse(result.content)
    #list = formatList(result.content)
    
    #print(result)
    return result

def formatList(listText): #takes a list of topics as a string and parses it
    print("parsing")
    prompt = listprompt.format(content=listText)
    result = chat.invoke(prompt)
    list = listparser.parse(result.content)
    return list

#make a response from original topic
def startPlanChat(topic):
    messages = chatprompt.format_messages(subject=topic)
    result = chat.invoke(messages)
    return result