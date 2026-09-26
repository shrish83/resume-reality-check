# Resume Reality Check

### Does your resume actually make sense?

**Resume Reality Check** is an AI-assisted resume analysis tool that looks beyond grammar and ATS keywords to examine the **story a resume tells**.

Instead of automatically rewriting a resume, it diagnoses how the document may be interpreted by a reader — looking at career progression, evidence, professional signals, timeline, positioning, quantified claims, and language.

> **Diagnose. Don't automatically rewrite.**
---

## Why I built this

Most resume tools focus on questions like:

* Is my resume ATS-friendly?
* Do I have enough keywords?
* Can this bullet be rewritten?
* How can I make this sound more impressive?

Those are useful questions, but they miss a bigger one:

### **Does the resume actually tell a coherent professional story?**

A resume can have:

* strong experience but weak positioning
* impressive projects that don't connect to the career direction
* skills that aren't supported by evidence
* unexplained timeline periods
* quantified claims that appear inconsistent
* a mismatch between the headline and the experience
* generic corporate language that makes the document feel interchangeable
* multiple professional signals that don't fit neatly into one label

Resume Reality Check was designed to explore those questions.

---

# What it analyzes

## 1. Professional context

The analyzer first tries to understand the type of career story being presented.

Examples include:

* Student / current graduate
* Fresh graduate
* Early-career professional
* Experienced professional
* Career changer

The goal is to interpret other signals in context rather than applying the same rules to every resume.

---

## 2. Career timeline

The tool looks at dates, roles, education and transitions to identify things worth examining.

It distinguishes between concepts such as:

* Potential unexplained timeline gaps
* Career breaks
* Sabbaticals
* Education periods
* Overlapping roles
* Career transitions

Importantly, a missing period is **not automatically treated as a problem**.

The tool uses language such as:

> "Potential unexplained timeline gap"

rather than assuming why the gap exists.

---

## 3. Skills ↔ evidence

A Skills section can contain a long list of technologies and capabilities.

But listing a skill isn't the same as demonstrating it.

The analyzer therefore looks for evidence elsewhere in the resume:

```text
Skill
  ↓
Where does it appear?
  ↓
Work experience?
Project?
Education?
Other evidence?
```

This helps distinguish between:

**"Skill is listed"**

and

**"Skill is supported by evidence."**

---

## 4. Projects ↔ career direction

Projects can play very different roles depending on the person.

For example:

* A student's project may provide important evidence of capability.
* A career changer may use projects to demonstrate a new direction.
* An experienced professional may use projects to reinforce an existing specialization.

The analyzer therefore considers projects in the context of the overall resume rather than treating their mere presence as evidence.

---

## 5. Professional signals

Instead of forcing someone into a single career label, Resume Reality Check looks for multiple possible professional signals:

| Signal       | What it represents                                            |
| ------------ | ------------------------------------------------------------- |
| **Analyst**  | Analysis, metrics, insights and decision support              |
| **Builder**  | Creating systems, products, automation or technical solutions |
| **Operator** | Processes, execution, optimization and operational ownership  |
| **Leader**   | Ownership, coordination, influence and decision-making        |

A resume can communicate more than one signal.

For example:

> **Analyst + Builder + Operator**

may be a more accurate description of the evidence than forcing the resume into one category.

These are **signals communicated by the resume**, not psychological or personality assessments.

---

## 6. Positioning ↔ evidence

The analyzer checks whether the positioning of the resume is supported by the experience underneath it.

For example:

```text
Headline:
Product Manager

Experience:
Mostly data analysis and reporting
```

This doesn't mean the person *cannot* be a Product Manager.

It means the resume may not yet provide enough evidence for the positioning it is using.

The distinction matters.

---

## 7. Quantified claims

Numbers are powerful on resumes, but they can also create ambiguity.

Resume Reality Check looks for potentially inconsistent quantified claims while considering context.

For example:

```text
800+ customers annually
850+ internal stakeholders
```

should not automatically be considered contradictory because the populations are different.

The tool therefore aims to distinguish:

* genuine potential inconsistencies
* repeated metrics
* approximate numbers
* different populations
* contextual differences

---

## 8. Professional voice

The tool also looks for language patterns such as:

* Generic corporate language
* Vague phrasing
* Repetitive action verbs
* Highly polished / templated language
* Specific and evidence-based language

### What it does NOT do

It does **not** claim to detect whether a resume was written by AI.

"AI-ish" language is treated as a **style signal**, not authorship evidence.

---

# The reasoning architecture

The first version of the checker started as a collection of heuristic checks.

Testing it against a larger set of resume scenarios exposed an important problem:

> Resume analysis cannot reliably be reduced to keyword matching.

The current architecture therefore separates the analysis into layers:

```text
Resume
   │
   ▼
┌─────────────────────┐
│  Parsing            │
│  Sections / Dates   │
│  Extraction signals │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Evidence           │
│  Skills / Claims    │
│  Metrics / Projects │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Timeline Model     │
│  Roles / Gaps       │
│  Breaks / Pivots    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Narrative Model    │
│  Positioning        │
│  Career Direction   │
│  Evidence Links     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Professional Signals│
│ Analyst / Builder   │
│ Operator / Leader   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Language Analysis   │
│ Voice / Genericity  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Guardrails          │
│ Ambiguous / Missing │
│ Confidence          │
└──────────┬──────────┘
           ▼
      Reader-facing
         report
```

The separation is intentional: **evidence extraction comes before interpretation**.

---

# Evaluation-driven development

A major part of the project was building an evaluation corpus before continuing to add heuristics.

The corpus contains **75 controlled resume scenarios**, covering different career types and adversarial cases.

### Career archetypes

Examples include:

* Fresh graduates
* Current students
* Early-career professionals
* Experienced specialists
* Senior / leadership resumes
* Career changers
* Industry changers
* Function changers
* Freelancers / consultants
* Contractors
* Founders
* Academic → industry transitions
* Technical → management transitions
* Return-to-work candidates
* Portfolio careers

### Edge cases

The evaluation suite also tests:

* Genuine vs explained career gaps
* Sabbaticals
* Education-related gaps
* Overlapping roles
* Explicit and implicit career pivots
* Skills with and without evidence
* Projects supporting or contradicting stated direction
* Academic and personal projects
* Open-source work
* Extracurriculars and hobbies
* Approximate metrics
* Different populations with similar numbers
* Generic corporate language
* Mixed professional signals
* Headline/evidence mismatches
* Poor PDF extraction
* Two-column resumes
* Tables
* Missing headings
* Missing summaries

### Guardrails

The suite also explicitly tests that the analyzer does **not** over-infer.

Examples:

* Missing information → **"Not evidenced in the resume"**
* Ambiguous dates → Don't invent chronology
* Ambiguous titles → Don't infer seniority from the title alone
* Ambiguous transitions → Don't invent the reason
* Ambiguous hobbies → Don't infer personality
* A single leadership verb → Don't automatically conclude leadership

---

# Current evaluation

The current V2 implementation has been regression-tested against the 75-case controlled corpus.

**75 / 75 behavioral assertions passing**

**0 runtime failures**

The evaluation is intentionally not treated as proof that resume interpretation is "solved." It is a regression framework designed to make future changes measurable and prevent known failure modes from returning.

---

# Example analysis

For a resume containing:

```text
Professional Summary:
Business Operations Analyst...

Experience:
Revenue assurance
Operational dashboards
Process automation
Stakeholder management

Projects:
AI-powered workflow automation

Skills:
Excel, Tableau, Python, SQL...
```

the tool may identify signals such as:

```text
Professional context
Experienced professional

Professional signals
Operator
Builder
Analyst

Evidence
Strong evidence for operational ownership
Strong evidence for automation
Strong evidence for analytics

Potential observation
Some skills are listed without obvious supporting evidence
```

The goal is not to rewrite the resume automatically.

The goal is to help the person **see what their resume communicates**.

---

# Design principles

### 1. Diagnose before rewriting

The product is intentionally not another "make my resume sound better" tool.

### 2. Evidence before inference

A conclusion should be traceable to something present in the resume.

### 3. Ambiguity is allowed

If the resume doesn't provide enough information, the analyzer should say so.

### 4. Don't confuse absence of evidence with evidence of absence

Not mentioning something doesn't necessarily mean it didn't happen.

### 5. Don't infer personality

The tool analyzes the professional story communicated by the document — not the person behind it.

### 6. Don't claim AI authorship detection

Language can be generic, polished or templated without proving how it was written.

### 7. Context matters

The same resume pattern can mean different things for a student, career changer and experienced professional.

---

# Tech stack

Current V1/V2 is intentionally lightweight.

* **HTML**
* **CSS**
* **JavaScript**
* **PDF.js** for browser-side PDF text extraction
* Heuristic / rule-based reasoning
* GitHub Pages

No backend is required for the current version.

The project is designed to run as a standalone web application.

---

# Privacy

Resume content is processed in the browser for the current version.

The project does not require a resume database or backend service to operate.

Because resumes contain personal and professional information, privacy is treated as an important product constraint rather than an afterthought.

---

# Project structure

```text
resume-reality-check/
│
├── index.html
├── README.md
│
└── evaluation/
    ├── resume-reality-check-evaluation-corpus.json
    ├── resume-reality-check-evaluation-corpus.jsonl
    ├── resume-reality-check-evaluation-index.csv
    └── resume-reality-check-baseline-report.md
```

The evaluation artifacts may be kept separately depending on the intended public repository structure.

---

# What I learned building it

The biggest lesson from this project was that **resume analysis is fundamentally a reasoning problem, not just a text-matching problem**.

A simple checker can easily answer:

> "Does the resume contain the word Python?"

A useful career-analysis tool needs to ask:

> "Where is Python supported by evidence, what role does it play in the candidate's story, and how confident are we in that interpretation?"

That shift — from **keyword detection → evidence → context → narrative** — became the core design principle of the project.

---

# Future directions

Potential next iterations include:

* Layout-aware PDF parsing
* Better two-column and table extraction
* More robust date / timeline modeling
* Semantic skill-to-evidence matching
* Stronger project-to-career-direction analysis
* More sophisticated claim / metric consistency checks
* Explainable confidence scores
* Larger evaluation corpus
* Public anonymized test cases
* Optional AI-powered narrative analysis
* Comparison of resume versions over time

---

## Built as a portfolio project

This project was built to explore how AI-assisted tools can move beyond surface-level text transformation and toward **structured reasoning about messy professional information**.

The broader goal is not to create another resume generator.

It is to build a tool that helps answer:

> **"If someone read this resume for 30 seconds, what professional story would they actually take away?"**

---

### Author

**Shrishti Vaish**

Business Operations Analyst | Analytics | AI-enabled Automation | Data & Business Strategy

[LinkedIn](https://www.linkedin.com/in/shrishti-vaish/)
