from fastapi import FastAPI, UploadFile, File
import os
import fitz  # PyMuPDF for PDFs
from docx import Document
import google.generativeai as genai
import tempfile

# Initialize FastAPI app
app = FastAPI()

# Set API Key
API_KEY = "your-gemini-api-key"
genai.configure(api_key=API_KEY)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF."""
    doc = fitz.open(pdf_path)
    return "\n".join([page.get_text("text") for page in doc])

def extract_text_from_docx(docx_path):
    """Extract text from a DOCX file."""
    doc = Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text(file_path):
    """Determine file type and extract text."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX are allowed.")

def evaluate_resume(resume_text):
    """Analyze the resume using Gemini API."""
    prompt = f"""
    Evaluate the given resume based on the following ATS compliance factors and assign a score out of 100. Provide a detailed score breakdown for each factor.

    *Scoring Criteria:*
    1. *Keyword Relevance & Industry Alignment (20%)*
       * Extract key industry-related terms from the resume, such as *job titles, skills, certifications, and technical terms*.
       * Evaluate whether these terms are *contextually relevant* to the candidate's industry and role.
       * Higher scores for resumes that naturally include *essential job-related keywords* without keyword stuffing.
       * Penalize keyword stuffing (excessive, unnatural repetition of terms).
    2. *Quantifying Impact (20%)*
       * Identify measurable achievements (e.g., *"Increased revenue by 30%"* or *"Reduced processing time by 40%"*).
       * Higher scores for resumes that include *metrics, KPIs, and tangible results* in job experience and projects.
       * Resumes that lack any quantifiable impact should receive a *significant penalty*.
    3. *Projects & Achievements (10%)*
       * Assess whether projects include *clear descriptions, technologies used, and measurable outcomes*.
       * Higher scores for resumes with well-structured project sections that demonstrate *problem-solving and technical expertise*.
    4. *Spelling & Grammar (10%)* (Dynamic Penalty Applied)
       * Detect spelling and grammar errors that could affect ATS parsing.
       * If errors are *minimal*, apply a small penalty.
       * If errors are *widespread and impact readability*, apply a significantly higher penalty.
    5. *Resume Readability & ATS Friendliness (5%)*
       * Ensure the resume follows *clean formatting, uses a **consistent font*, and avoids tables, columns, or excessive design elements that can break ATS parsing.
       * Penalize complex formatting that may cause parsing issues.
    6. *Resume Length (5%)*
       * Check if the resume length is appropriate for the candidate's experience:
          * *Entry-level:* 1 page preferred
          * *Mid-level to senior:* 1-2 pages
       * Penalize excessive length (e.g., 3+ pages without justification).
    7. *Bullet Points & Action Verbs (5%)*
       * Ensure bullet points are *short, concise, and action-driven*.
       * Evaluate the use of *strong, varied action verbs* that demonstrate leadership and impact.
       * Penalize weak or passive language (e.g., "Responsible for managing a team" instead of "Led a team of 5")
    8. *Essential Sections (5%)*
       * Check for the presence of *Summary, Experience, Education, and Skills* sections.
       * Missing critical sections should result in a penalty.
    9. *Soft Skills Demonstration (5%)*
       * Ensure soft skills (e.g., leadership, communication, adaptability) are *demonstrated through experience*, rather than just listed.
       * Example: "Led a team of 5 developers through Agile sprints" (✅) vs. "Good leadership skills" (❌).
    10. *Hard Skills & Technical Proficiency (5%)*
       * Verify if technical skills, software proficiency, and certifications are *clearly listed and relevant*.
       * Penalize resumes that lack relevant technical details for the field.

    *Resume to Evaluate:*
    {resume_text}

    *Evaluation Output Format:*
    1. *Overall ATS Score (out of 100)*
    
       Provide a thoughtful, personalized 2-3 sentence comment about the resume's overall quality. This should:
    
       * Provide meaningful appreciation if the resume content is good
       * Offer balanced feedback if the resume needs improvement
       * Be constructive and helpful if significant improvements are needed
    
       
    3. *Score Breakdown*
       For each factor, format as follows and address the candidate directly using "you" and "your":
       * *Factor Name:* X/Y
         [New line with detailed analysis about this specific factor]
       
       Note: DO NOT include the percentage weights in your output, but still use them in your scoring calculation.
     """ 
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error analyzing resume: {str(e)}"

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    """API endpoint to upload a resume and get ATS evaluation."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        temp_file.write(file.file.read())
        temp_filepath = temp_file.name
    
    try:
        resume_text = extract_text(temp_filepath)
        if len(resume_text) < 100:
            return {"error": "Resume text is too short or unreadable."}

        analysis = evaluate_resume(resume_text)
        return {"analysis": analysis}
    except Exception as e:
        return {"error": str(e)}
    finally:
        os.unlink(temp_filepath)
