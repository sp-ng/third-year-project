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
from pydantic import BaseModel, Field, validator
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
openai_api_key='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'
openai_model_name="gpt-3.5-turbo-1106"
chat = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name=openai_model_name, max_tokens=2000)
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
class MultipleChoice(BaseModel):
    question: str = Field(description="A multiple choice question")
    correct: str = Field(description="The correct answer to the multiple choice question")
    wrong1: str = Field(description="An incorrect answer to the multiple choice question")
    wrong2: str = Field(description="An incorrect answer to the multiple choice question")
    wrong3: str = Field(description="An incorrect answer to the multiple choice question")

MultChoiceParser = PydanticOutputParser(pydantic_object=MultipleChoice)

MultChoicePrompt = PromptTemplate(
    template="Create a multiple choice question based on the following topic: {topic}\n{format_instructions}",
    input_variables=["topic"],
    partial_variables={"format_instructions": MultChoiceParser.get_format_instructions()},
)
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
def makeQuestion(topic):
    result = MultChoiceChain.invoke({"topic": topic})
    return result.dict()

def makeMultChoice(topic):
    result = MultChoiceChain.invoke({"topic": topic})
    return result.dict()

def makeFreeResponse(topic):
    result = FreeResponseChain.invoke({"topic": topic})
    return result.dict()