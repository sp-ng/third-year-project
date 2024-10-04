#Create multiple choice or free response questions
#Use RAG
#Be able to assess them too.
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from langchain.memory import ChatMessageHistory
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from langchain.prompts import PromptTemplate
from langchain.prompts.chat import ChatPromptTemplate
from langchain.output_parsers import CommaSeparatedListOutputParser
from typing import Deque, List, Optional, Tuple
from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
#from pydantic import BaseModel, Field, validator
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
from enum import Enum, IntEnum
openai_api_key='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'
openai_model_name="gpt-3.5-turbo-1106"
chat = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name=openai_model_name, max_tokens=2000)
chatJSON = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name="gpt-3.5-turbo", max_tokens=4000, model_kwargs={"response_format": {"type": "json_object"}})
#replace loader with dir loader
#replace splitter with recursive splitter
#setup caching docs
""" loader = TextLoader('../../../state_of_the_union.txt')
loader = DirectoryLoader('./Docs', glob="*.pdf")
documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 500,
    chunk_overlap  = 50,
    length_function = len,
    add_start_index = True,
)
texts = text_splitter.split_documents(documents)
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
db = FAISS.from_documents(texts, embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})
 """
#Multiple Choice

#Define JSON schema
#LangChain can also use this to generate formatting instructions for the model
class MultipleChoice(BaseModel):
    question: str = Field(description="A multiple choice question")
    correct: str = Field(description="The correct answer to the multiple choice question")
    wrong1: str = Field(description="An incorrect answer to the multiple choice question")
    wrong2: str = Field(description="An incorrect answer to the multiple choice question")
    wrong3: str = Field(description="An incorrect answer to the multiple choice question")

MultChoiceParser = PydanticOutputParser(pydantic_object=MultipleChoice)

#Create prompt template to instruct the model based on an input topic
MultChoicePrompt = PromptTemplate(
    template="Create a multiple choice question based on the following: {topic}\n{format_instructions}",
    input_variables=["topic"],
    partial_variables={"format_instructions": MultChoiceParser.get_format_instructions()},
)
#Link the prompt template, chat model, and parser together.
MultChoiceChain = MultChoicePrompt | chat | MultChoiceParser

#Free Response
class FreeResponse(BaseModel):
    question: str = Field(description="A free response choice question")
    answer: str = Field(description="An example answer for the question")

FreeResponseParser = PydanticOutputParser(pydantic_object=FreeResponse)

FreeResponsePrompt = PromptTemplate(
    template="""Create a free response question based on the following topic, include an example answer to help 
    guide assessment: {topic}\n{format_instructions}""",
    input_variables=["topic"],
    partial_variables={"format_instructions": FreeResponseParser.get_format_instructions()},
)
FreeResponseChain = FreeResponsePrompt | chat | FreeResponseParser

#Free Response assessment
ResponseCheckerPrompt = PromptTemplate(
    template="""
    You will be provided with a question, and example answer to guide marking, and an answer to mark. 
    Question: {question}
    Example: {example}
    Use the above to mark the following answer. Give it a mark out of 10 representing how the response 
    indicates a correct understanding of the topic. State what was correct in the answer and what was missing/could be improved
    Answer: {answer}
    """,
    input_variables=["question", "example", "answer"],
)
ResponseCheckerChain = ResponseCheckerPrompt | chat

#Questioning
chatprompt = ChatPromptTemplate.from_messages([
    ("system", """Your job is to question a user about {topic}. You want to encourage them to think critically about the topic and
      try to test their understanding to help promote deeper understanding of the topic. Try not to directly give the answer but
      give hints that can help the user come up with the answer themselves."""),
    ("human", "I want you to test my understanding of {topic}, start asking me about it"),
])

""" prompt = input("Pick a topic: ")
messages = chatprompt.format_messages(topic=prompt)
result = chat.invoke(messages)
while True:
    print(result.content)
    messages.append(result)
    prompt = input("Response: ")
    messages.append(HumanMessage(content=prompt))
    result = chat.invoke(messages)
 """





    #prompt = input("Input text: ")
    #result = retriever.get_relevant_documents(prompt)
    #print(result)
    #result = MultChoiceChain.invoke({"topic": prompt})
    #result = FreeResponseChain.invoke({"topic": prompt})
    #print(result.question)
    #print("/n")
    #print(result.answer)
    #answer = input("\nAnswer the question: ")
    #result2 = ResponseCheckerChain.invoke({"question": result.question, "example": result.answer, "answer": answer})
    #print(result2)
    #fmt = MultChoicePrompt.format(content=prompt)
    #print(fmt)
    #result = model(fmt)
    
    #list = MultChoiceParser.parse(result)
    #print(list)


#Chain that takes in some topic and generates a list of reading material and questions in some useful way


class Topics(BaseModel):
    topics: List[Tuple[str, List[str]]]

class ActivityEnum(str, Enum):
    reading = 'Reading'
    mult_choice = 'Multiple Choice'
    free_response = 'Free Response'

class Activities(BaseModel):
    activities: List[Tuple[ActivityEnum, str]]

ActivityParser = JsonOutputParser(pydantic_object=Activities)

ActivityPrompt = PromptTemplate(
    template="""Create a list of activities for someone to learn about {topic}. Each activity can either be reading (the user reads and learns about a part of the overall learning goal),
    a multiple choice question, or a free response question. Every activity should have a specific topic that it should be about, this will be used to generate content at a later point,
    do not generate the questions themselves.
    Try to have good coverage in teaching each aspect of {topic} while also not having too many activities. 
    Ensure questions about a topic have the the information needed taught in a reading activity beforehand. \n{format_instructions}\n
    """,
    input_variables=["topic"],
    partial_variables={"format_instructions": ActivityParser.get_format_instructions()},
)

ActivityChain = ActivityPrompt | chatJSON | ActivityParser



PActivityParser = JsonOutputParser()

PActivityPrompt = PromptTemplate(
    template="""Create a list of activities for someone to learn about {topic}. Each activity can either be reading (the user reads and learns about a part of the overall learning goal),
    a multiple choice question, or a free response question and every activity should have a specific topic that it should be about. Do not generate the questions, only the topic that specic question would be about.
    Try to have good coverage in teaching each aspect of {topic} and equally good coverage in providing practice. 
    Ensure questions about a topic have the the information needed taught in a reading activity beforehand. \n{format_instructions}\n
    """,
    input_variables=["topic"],
    partial_variables={"format_instructions": PActivityParser.get_format_instructions()},
)

PActivityChain = PActivityPrompt | chatJSON | PActivityParser



def generateActivities(topic):
    # print(PActivityParser.get_format_instructions())
    #result = ActivityChain.invoke({"topic": topic})
    # response = chatJSON.invoke(PActivityPrompt.format(topic=topic))
    # print("RESULT######")
    # print(response.content)
    # result = PActivityParser.parse(response.content)
    # print(result)
    #print(ActivityParser.get_format_instructions())
    response = chatJSON.invoke(ActivityPrompt.format(topic=topic))
    #print("RESULT######")
    #print(response.content)
    result = ActivityParser.parse(response.content)
    print(result)
    return result

def makeQuestion(topic):
    result = MultChoiceChain.invoke({"topic": topic})
    return result.dict()

def makeMultChoice(topic):
    result = MultChoiceChain.invoke({"topic": topic})
    return result.dict()

def makeFreeResponse(topic):
    result = FreeResponseChain.invoke({"topic": topic})
    return result.dict()