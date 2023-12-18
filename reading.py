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
#loader = TextLoader('../../../state_of_the_union.txt')
loader = DirectoryLoader('./Docs', glob="*.pdf")
documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(
    # Set a really small chunk size, just to show.
    chunk_size = 1000,
    chunk_overlap  = 50,
    length_function = len,
    add_start_index = True,
)
texts = text_splitter.split_documents(documents)
#print(texts[0])
#print(texts[1])
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
db = FAISS.from_documents(texts, embeddings)
retriever = db.as_retriever(search_kwargs={"k": 7})


#Reading Material
MaterialPrompt = PromptTemplate(
    template="Explain the following topic: {topic}. You may base your response on some of the following text retrieved from source materials if it is helpful: {retrieved}\n",
    input_variables=["topic", "retrieved"],
)
MaterialChain = MaterialPrompt | chat

#Interactive Teaching
StarterPrompt = PromptTemplate(
    template="Create a short list of the most important points to teach about the following topic, only return a list: {topic}.",
    input_variables=["topic"],
)
chatprompt = ChatPromptTemplate.from_messages([
    ("system", "Your job is to teach a user about {topic}. Allow the user to ask follow up questions. Be as accurate as possible in your responses."),
    ("human", "I want you to explain {topic}, specifically {points}."),
])
prompt = input("Pick a topic: ")
points = chat.invoke(StarterPrompt.format(topic=prompt))
messages = chatprompt.format_messages(topic=prompt, points=points)
result = chat.invoke(messages)
while True:
    print(result.content)
    messages.append(result)
    prompt = input("Response: ")
    messages.append(HumanMessage(content=prompt))
    result = chat.invoke(messages)
    #prompt = input("Input text: ")
    #result = MaterialChain.invoke({"topic": prompt, "retrieved": retriever.invoke(prompt)})
    #result = retriever.invoke(prompt)
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

