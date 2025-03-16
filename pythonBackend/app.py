from fastapi import FastAPI, UploadFile, Form, File
import base64
import io
import os
from dotenv import load_dotenv
import pdf2image
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_pdf(uploaded_file):
    images = pdf2image.convert_from_bytes(uploaded_file.read())
    first_page = images[0]
    img_byte_arr = io.BytesIO()
    first_page.save(img_byte_arr, format='JPEG')
    img_byte_arr = img_byte_arr.getvalue()
    return [{"mime_type": "image/jpeg", "data": base64.b64encode(img_byte_arr).decode()}]

def get_gemini_response(input_text, pdf_content, prompt):
    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content([input_text, pdf_content[0], prompt])
    return response.text

@app.post("/analyze_resume/")
async def analyze_resume(job_desc: str = Form(...), uploaded_file: UploadFile = File(...), mode: str = Form(...)):
    pdf_content = process_pdf(uploaded_file.file)
    
    prompts = {
        "review": """You are an experienced Technical Human Resource Manager,your task is to review the provided resume against the job description. 
  Please share your professional evaluation on whether the candidate's profile aligns with the role. 
 Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.""",
        "match": """You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality,
your task is to evaluate the resume against the provided job description. give me the percentage of match if the resume matches
the job description. First the output should come as percentage and then keywords missing and last final thoughts"""
    }
    
    response = get_gemini_response(job_desc, pdf_content, prompts.get(mode, ""))
    return {"response": response}
