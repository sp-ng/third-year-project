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
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
from langchain.output_parsers import RetryWithErrorOutputParser


class Question(BaseModel):
    question: str = Field(description="some question to help practice a given topic")
    answer: str = Field(description="the answer to the question")

class Topics(BaseModel):
    topics: List[Tuple[str, List[str]]]

pyparser = PydanticOutputParser(pydantic_object=Question)
listparser = PydanticOutputParser(pydantic_object=Topics)

questionprompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": pyparser.get_format_instructions()},
)

output_parser = CommaSeparatedListOutputParser()

format_instructions = listparser.get_format_instructions()
print(format_instructions)
listprompt = PromptTemplate(
    template="List: {content}.\n Instructions: Format the above list to create a JSON with nested lists according to the following provided format instructions. Ignore any extra text in the List section that is not a part of the list.\n Format instructions: {format_instructions}",
    input_variables=["content"],
    partial_variables={"format_instructions": format_instructions}
)


chatprompt = ChatPromptTemplate.from_messages([
    ("system", "Work with the user to create a list of topics and subtopics for studying, after a response ask if the user wants any changes. It must always be a list of topics and subtopics."),
    ("human", "Generate a list of topics with subtopics for the following subject: {subject}"),
])
formatprompt = PromptTemplate(
    template="{content}.\n answer by generating a list of topics and subtopics using the following format:\n {format_instructions}",
    input_variables=["content"],
    partial_variables={"format_instructions": format_instructions}
)
#generate initial list by prompt in normal format
#then use that to begin an interactive chat to refine the topics
#once that is complete take the chat messages and extract the final list in normal format
#then take the list in normal format and output it in accordance to the formatting instructions


chat = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name="gpt-3.5-turbo", max_tokens=1000)
#history = ChatMessageHistory()
messages = [SystemMessage(content="You are a helpful assistant")]
template = """
Answer the following question by giving three bullet points. Question: {question}
"""
gprompt = PromptTemplate(
    input_variables=["question"],
    template=template,
)

model = OpenAI(temperature=0, openai_api_key=openai_api_key)
prompt = input("Pick a topic: ")
messages = chatprompt.format_messages(subject=prompt)
result = chat.invoke(messages)
while True:
    print(result.content)
    messages.append(result)
    prompt = input("Response: ")
    if (prompt=="Q"):
        break
    messages.append(HumanMessage(content=prompt))
    result = chat.invoke(messages)
    #result = model(listprompt.format(content=prompt))
    #result = model(gprompt.format(question=prompt))
    #print(result)
    #list = listparser.parse(result)
    #Sprint(list)
prompt = listprompt.format(content=result.content)
print(prompt)
result = chat.invoke(prompt)
print(result)
retry_parser = RetryWithErrorOutputParser.from_llm(
    parser=listparser, llm=chat
)
list = listparser.parse(result.content)
print(list)