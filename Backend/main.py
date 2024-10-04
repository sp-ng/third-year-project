openai_api_key='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'
from langchain.chat_models import ChatOpenAI
from langchain.memory import ChatMessageHistory
from langchain.llms import OpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from langchain.prompts import PromptTemplate
from langchain.output_parsers import CommaSeparatedListOutputParser
from typing import List
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator

class Question(BaseModel):
    question: str = Field(description="some question to help practice a given topic")
    answer: str = Field(description="the answer to the question")

pyparser = PydanticOutputParser(pydantic_object=Question)

questionprompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": pyparser.get_format_instructions()},
)

output_parser = CommaSeparatedListOutputParser()

format_instructions = output_parser.get_format_instructions()
print(format_instructions)
listprompt = PromptTemplate(
    template="{content}.\n{format_instructions}",
    input_variables=["content"],
    partial_variables={"format_instructions": format_instructions}
)



chat = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name="gpt-3.5-turbo", max_tokens=500)
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
while True:
    prompt = input("ask for a question of something: ")
    #result = model(questionprompt.format(query=prompt))
    result = model(gprompt.format(question=prompt))
    print(result)
    #list = pyparser.parse(result)
    #print(list)