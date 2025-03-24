const { OpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('langchain/prompts');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4', // Use a more advanced model if available
});

// Templates for question generation and feedback
const questionTemplate = PromptTemplate.fromTemplate(`
  You are an expert interviewer for a {role} position at {company}. 
  Based on the job description: "{description}", generate a challenging behavioral or technical interview question 
  that tests the candidate’s skills and experience relevant to this role.
`);

const feedbackTemplate = PromptTemplate.fromTemplate(`
  You are an expert interviewer evaluating a candidate’s response. 
  The question was: "{question}".
  The candidate’s answer was: "{answer}".
  Provide detailed feedback, including:
  - Strengths of the answer
  - Areas for improvement
  - A score out of 10
  - Suggestions for a better response
`);

// Memory to maintain conversation context
const memory = new BufferMemory();

const chain = new ConversationChain({
  llm: openai,
  memory: memory
});

// Generate a question
async function generateQuestion(job) {
  const prompt = await questionTemplate.format({
    role: job.title,
    company: job.company,
    description: job.description
  });
  const response = await chain.call({ input: prompt });
  return response.response;
}

// Generate feedback for an answer
async function generateFeedback(question, answer) {
  const prompt = await feedbackTemplate.format({ question, answer });
  const response = await chain.call({ input: prompt });
  return response.response;
}

// Generate a follow-up question based on previous interaction
async function generateFollowUp() {
  const prompt = `Based on the previous question and answer in the conversation history, 
  generate a relevant follow-up question to dig deeper into the candidate’s experience.`;
  const response = await chain.call({ input: prompt });
  return response.response;
}

module.exports = { generateQuestion, generateFeedback, generateFollowUp };