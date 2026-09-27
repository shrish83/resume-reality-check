Resume Reality Check

Does your resume actually make sense?

Resume Reality Check is an AI-assisted resume analysis tool that looks beyond grammar and ATS keywords to examine the professional story a resume communicates.

Instead of automatically rewriting a resume, the tool asks:

What does this resume actually communicate to a reader?

It analyzes evidence, career progression, transitions, projects, education, professional signals, language, and other activities to identify where the story is clear, where it is ambiguous, and what could be made more explicit.

Why I Built This

Most resume tools focus on questions like:

Does this resume contain the right keywords?

Is it ATS-friendly?

Are there grammar issues?

Can the bullet points be rewritten?

Those are useful questions, but they don't fully answer a more important one:

What professional profile does this resume actually communicate?

A resume can contain strong experiences and still leave a reader unclear about:

how the candidate's career has evolved

what connects their different experiences

whether their skills are supported by evidence

what their projects contribute to their professional story

whether their education connects to their work

what signals come from activities outside employment

what a reader is likely to understand immediately

what remains unclear or insufficiently evidenced

Resume Reality Check was designed around this problem.

What It Analyzes

1. Career narrative

What story does the resume tell across roles, education, projects, and other experiences?

2. Timeline

Looks at chronology, potential gaps, overlapping roles, transitions, and progression without inventing explanations for ambiguous periods.

3. Evidence

Looks for concrete evidence behind claims, including metrics, outcomes, actions, measurable results, and repeated evidence.

4. Skills vs. evidence

Looks at whether important capabilities listed on the resume are actually supported elsewhere by experience or outcomes.

5. Projects

Considers how projects contribute to the professional story, particularly for students, fresh graduates, career changers, technical professionals, and portfolio-based careers.

6. Education

Considers connections between education, work experience, projects, and career direction without assuming that an unrelated degree is a problem.

7. Beyond the job title

Looks for signals from projects, memberships, clubs, societies, volunteering, communities, hackathons, competitions, fellowships, scholarships, certifications, awards, research, publications, conferences, meetups, mentoring, and speaking.

8. Professional signals

Identifies signals communicated by the document, such as analysis, building, execution, operations, leadership, experimentation, expertise, achievement, and transformation.

These describe the resume, not the person's personality.

9. Professional archetype

Uses six work archetypes from James Root's The Archetype Effect as a document-level communication lens:

Giver

Operator

Explorer

Artisan

Striver

Pioneer

The archetype represents the professional profile the resume most strongly communicates based on its evidence. It is not a personality diagnosis.

10. Professional voice

Looks at clarity, specificity, action language, evidence, generic corporate phrasing, and repeated language patterns.

It does not claim to determine whether a resume was written by AI.

11. Reader takeaway

Separates:

COMING THROUGH — concrete professional signals that are clearly communicated.

LESS CLEAR — signals a reader may want stronger evidence or explanation for.

"Less clear" does not mean the candidate lacks the capability. It means the resume does not currently make that capability sufficiently evident.

How It Works

Resume Reality Check uses a hybrid architecture combining deterministic programming with LLM-based reasoning.

                    RESUME
                       |
                       v
               PDF / TXT extraction
                       |
                       v
              Privacy sanitization
                       |
              +--------+--------+
              |                 |
              v                 v
       Deterministic          LLM
          analysis           reasoning
              |                 |
              +--------+--------+
                       |
                       v
               Structured result
                       |
                       v
              Validated report
                       |
                       v
                Visual analysis

The LLM is not responsible for everything.

Deterministic Analysis

JavaScript handles tasks suited to explicit rules and structured logic, including:

PDF text extraction

text handling

section detection

date detection

timeline construction

number extraction

metric detection

evidence patterns

privacy sanitization

fallback analysis

report rendering

LLM Analysis

The LLM is used where contextual interpretation is more useful than simple pattern matching, including:

narrative synthesis

professional signals

connections between experiences

project interpretation

professional voice

reader takeaway

archetype reasoning

interpreting evidence in context

The model receives structured instructions and returns structured JSON rather than arbitrary prose.

Structured AI Output

The LLM response is organized into fields such as:

narrative
archetype
reader_takeaway
professional_signals
action_patterns
beyond_job_title
professional_voice
connections
observations
confidence

Privacy & API Security

The application performs initial processing in the browser.

Before AI analysis, sensitive personal information is sanitized where possible, including:

email addresses

phone numbers

URLs

social handles

addresses

labeled personal information

certain sensitive identifiers

The OpenAI API key is never sent to the browser.

API key handling

The API key should never be placed in:

index.html

frontend JavaScript

vercel.json

JSON files

README.md

GitHub Actions files

any other public repository file

The backend accesses it through:

process.env.OPENAI_API_KEY

The actual key is stored in the deployment environment, such as Vercel Environment Variables.

Vercel
→ Project
→ Settings
→ Environment Variables
→ OPENAI_API_KEY

The GitHub repository can therefore remain public without exposing the API key.

.env.example

The repository may contain:

.env.example

with only placeholders:

OPENAI_API_KEY=
OPENAI_MODEL=gpt-5

The actual .env file should remain local and should be included in .gitignore.

Technology Stack

Technology

Purpose

HTML5

Frontend structure

CSS3

UI and responsive styling

JavaScript

Application logic and analysis

PDF.js

Browser-based PDF text extraction

OpenAI Responses API

AI reasoning

GPT-5

LLM analysis

JSON Schema

Structured AI output

SVG

Archetype illustrations

Vercel

Serverless backend and deployment

GitHub

Source control and project hosting

cdnjs

PDF.js delivery

Project Structure

resume-reality-check/
│
├── index.html
│
├── api/
│   └── analyze.js
│
├── vercel.json
│
├── .gitignore
├── .env.example
├── README.md
│
└── evaluation/
    ├── README.md
    ├── evaluation-corpus.json
    ├── evaluation-index.csv
    └── regression-report.md

Running the Project

Frontend only

The frontend can run without the AI backend. This allows the deterministic analysis functionality to operate locally.

It can process:

PDF resumes

TXT resumes

pasted resume text

The LLM-enhanced analysis requires the backend.

Full AI version

The complete version requires:

GitHub repository

Vercel deployment

OpenAI API key

Architecture:

GitHub
   |
   v
Vercel
   |
   +-- index.html
   |
   +-- /api/analyze
            |
            v
       OpenAI API

Deployment

1. Create the GitHub repository

Create a repository such as:

resume-reality-check

Upload the project files.

Do not upload:

.env
personal resumes
personal LinkedIn exports
API keys

2. Connect the repository to Vercel

Import the GitHub repository into Vercel.

Vercel will deploy the frontend and the serverless function:

/api/analyze

3. Add the API key

In Vercel:

Project
→ Settings
→ Environment Variables

Add:

OPENAI_API_KEY

with your actual OpenAI API key.

Optionally add:

OPENAI_MODEL

with:

gpt-5

4. Redeploy

After adding the environment variables, redeploy the project.

The frontend can then call /api/analyze without exposing the API key to users.

What This Project Does NOT Do

Resume Reality Check intentionally avoids several types of inference.

It does not attempt to determine:

personality

intelligence

mental health

physical health

protected characteristics

political beliefs

religion

ethnicity

gender identity

family status

socioeconomic status

It also does not claim:

"This resume was written by AI."

Language analysis is limited to observable writing patterns.

Important Reasoning Principles

Missing evidence is not negative evidence

If a resume does not mention something, the system should generally say:

"Not evidenced in the resume."

rather than:

"The candidate does not have this skill."

Ambiguity is preserved

If dates or transitions are unclear, the system should not invent an explanation.

Titles are not treated as proof of seniority

A job title alone is not enough to determine leadership level.

One verb is not enough to establish leadership

For example, the word "led" alone should not automatically produce a leadership conclusion.

A career transition does not imply a reason

The resume may show a transition without explaining why it happened.

Archetypes describe the document

The archetype is a lens for understanding the professional profile communicated by the resume, not a personality diagnosis.

Evaluation

The project was developed using an evaluation-driven approach.

A controlled evaluation corpus was created with 75 scenarios covering different resume structures and edge cases.

The scenarios include:

Career stages

fresh graduate

current student

early-career professional

experienced specialist

senior/leadership

career changer

industry changer

function changer

freelancer/consultant

contractor

founder

academic → industry

technical → management

return-to-work

portfolio career

Edge cases

genuine unexplained gaps

explained career breaks

sabbaticals

education-related gaps

overlapping roles

short-term jobs

explicit pivots

implicit pivots

unsupported pivots

projects supporting a pivot

skills with strong evidence

skills with weak evidence

skills without evidence

extracurricular evidence

project-heavy resumes

inconsistent metrics

approximate numbers

generic corporate language

AI-polished language

headline/evidence mismatch

parsing problems

Guardrails

The evaluation also checks that the system does not:

invent chronology

invent transition reasons

infer personality

infer protected characteristics

infer leadership from one isolated verb

treat missing evidence as proof of absence

expose personal information

Evaluation Result

The deterministic analysis engine was regression-tested against the controlled evaluation corpus.

The earlier validated version achieved:

75 / 75 behavioral assertions passed
0 runtime failures

The LLM-enhanced version introduces an additional reasoning layer, so AI output should still be evaluated separately for consistency and hallucination.

Design Philosophy

The project follows five principles:

1. Diagnose before rewriting

The goal is not automatically to rewrite someone's resume. First understand the story.

2. Evidence over assumptions

Claims should be connected to observable evidence.

3. Document analysis over personality prediction

The product analyzes what the resume communicates, not who the person "really is."

4. AI where it helps

Use deterministic logic for structured problems and an LLM where contextual reasoning adds value.

5. Graceful degradation

If the AI service is unavailable, deterministic analysis can still provide useful results.

Limitations

This is an experimental portfolio project rather than a replacement for human recruiting judgment.

Important limitations include:

PDF extraction quality depends on the source PDF

scanned/image-only PDFs may not contain extractable text

unusual layouts can affect parsing

heuristic analysis cannot understand every possible resume structure

LLM interpretations can still be imperfect

professional signals are interpretations of the document

archetype classification is a communication lens, not a psychological assessment

resume evidence is inherently incomplete

The product should therefore be treated as a decision-support and reflection tool, not an automated hiring decision system.

Why the Architecture Is Hybrid

A fully rule-based system would struggle with nuanced professional narratives.

A fully LLM-based system could be inconsistent and harder to validate.

The hybrid approach combines both:

Rules
+
LLM reasoning
+
Guardrails
+
Structured output
=
More useful resume analysis

The deterministic layer provides structure and predictable checks.

The LLM provides contextual interpretation.

The final report combines both.

Future Directions

Potential future improvements include:

richer resume parsing

better timeline reasoning

stronger project-to-career connections

comparison between resume and target job description

recruiter-oriented analysis

candidate self-assessment mode

improved evaluation of LLM outputs

additional document formats

multilingual resume support

stronger privacy controls

user-controlled analysis depth

Portfolio Context

This project demonstrates more than an AI API integration.

It combines:

product thinking

business problem framing

document processing

frontend development

JavaScript programming

deterministic analytics

LLM integration

prompt design

structured outputs

privacy considerations

evaluation design

UX design

deployment architecture

The central idea is:

AI should add reasoning where it is useful, while deterministic systems provide structure, validation, and guardrails.

Author

Shrishti Vaish

Business Operations | Analytics | AI-powered workflow and decision-support projects

LinkedIn:
https://www.linkedin.com/in/shrishti-vaish/

License

This project is licensed under the MIT License.

Copyright (c) 2026 Shrishti Vaish.

The MIT License allows others to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the terms of the license. The copyright notice and license notice must be included in copies or substantial portions of the software.

See the LICENSE file for the complete license text.

Third-party components

This license applies to the original work in this repository. Third-party libraries, services, datasets, fonts, and other external components remain subject to their respective licenses and terms.
