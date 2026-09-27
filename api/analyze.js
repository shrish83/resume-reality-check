const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    narrative: { type: 'string' },
    archetype: { type: 'object', additionalProperties: false, properties: {
      primary: { type: 'object', additionalProperties: false, properties: {
        name: { type: 'string', enum: ['Giver','Operator','Explorer','Artisan','Striver','Pioneer'] },
        explanation: { type: 'string' },
        evidence: { type: 'array', items: { type: 'string' } }
      }, required: ['name','explanation','evidence'] },
      secondary: { type: 'object', additionalProperties: false, properties: {
        name: { type: 'string', enum: ['Giver','Operator','Explorer','Artisan','Striver','Pioneer'] },
        explanation: { type: 'string' },
        evidence: { type: 'array', items: { type: 'string' } }
      }, required: ['name','explanation','evidence'] }
    }, required: ['primary','secondary'] },
    reader_takeaway: { type: 'object', additionalProperties: false, properties: {
      strengths: { type: 'array', items: { type: 'string' } },
      less_clear: { type: 'array', items: { type: 'string' } }
    }, required: ['strengths','less_clear'] },
    professional_signals: {
      type: 'array', items: { type: 'object', additionalProperties: false, properties: {
        signal: { type: 'string' }, strength: { type: 'string', enum: ['strong','moderate','light'] }, evidence: { type: 'array', items: { type: 'string' } }, explanation: { type: 'string' }
      }, required: ['signal','strength','evidence','explanation'] }
    },
    action_patterns: {
      type: 'array', items: { type: 'object', additionalProperties: false, properties: {
        pattern: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } }, explanation: { type: 'string' }
      }, required: ['pattern','evidence','explanation'] }
    },
    beyond_job_title: {
      type: 'array', items: { type: 'object', additionalProperties: false, properties: {
        category: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } }, explanation: { type: 'string' }
      }, required: ['category','evidence','explanation'] }
    },
    professional_voice: {
      type: 'array', items: { type: 'object', additionalProperties: false, properties: {
        dimension: { type: 'string' }, strength: { type: 'string', enum: ['strong','moderate','light'] }, evidence: { type: 'array', items: { type: 'string' } }, explanation: { type: 'string' }
      }, required: ['dimension','strength','evidence','explanation'] }
    },
    connections: {
      type: 'array', items: { type: 'object', additionalProperties: false, properties: {
        connection: { type: 'string' }, status: { type: 'string', enum: ['strong','moderate','weak','not_evidenced','ambiguous'] }, evidence: { type: 'array', items: { type: 'string' } }, explanation: { type: 'string' }
      }, required: ['connection','status','evidence','explanation'] }
    },
    observations: {
      type: 'array', items: { type: 'object', additionalProperties: false, properties: {
        type: { type: 'string', enum: ['strength','review','ambiguity','guardrail'] }, title: { type: 'string' }, explanation: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } }
      }, required: ['type','title','explanation','evidence'] }
    },
    confidence: { type: 'string', enum: ['high','medium','low'] }
  },
  required: ['narrative','archetype','reader_takeaway','professional_signals','action_patterns','beyond_job_title','professional_voice','connections','observations','confidence']
};

const SYSTEM = `You are the reasoning layer for Resume Reality Check, a professional narrative analyzer.
Analyze only what the resume text supports. Do not infer personality, intelligence, health, protected traits, socioeconomic background, age, gender, ethnicity, religion, political views, marital/family status, or other sensitive personal characteristics.
Do not expose, repeat, summarize, or use contact/personal identifiers such as email, phone, address, location, social handles, URLs, government IDs, salary, citizenship, visa/work authorization, date of birth, or references. If such information appears in the supplied text, ignore it completely.
Do not claim the resume was written by AI. You may identify generic/corporate language as a writing signal.
Do not invent career transitions, reasons for gaps, seniority, leadership, skills, project outcomes, or chronology. Use 'not evidenced' or 'ambiguous' when appropriate.
Professional signals describe what the document communicates, not who the person is.
Use James Root's six work archetypes only as a document-level communication lens: Giver, Operator, Explorer, Artisan, Striver, Pioneer. Select the primary archetype whose work signals are most consistently evidenced by the resume, and optionally a secondary archetype when there is meaningful evidence. Never state or imply that the person actually has that motivation or personality.
For the archetype, reason from documented work/activity signals such as collaboration/helping, dependable execution, variety/experimentation, mastery/craft, achievement/progression, and creating/change/entrepreneurial initiative. If evidence is mixed, choose the best-supported signal and explain the ambiguity.
For every conclusion, ground it in short evidence phrases copied from the resume, excluding personal/contact information. If evidence is absent, use an empty evidence array.
For 'beyond_job_title', actively look for any professional activity outside ordinary job titles, including projects, memberships, clubs, societies, volunteering, community involvement, hackathons, competitions, fellowships, scholarships, certifications, awards, publications, research, meetups, conferences, speaking, mentoring, student organizations, professional communities, and similar activity. Do not limit this to conventional section headings. Exclude personal/contact details.
For 'reader_takeaway', provide concrete professional signals that clearly come through and concrete signals that a reader may want clearer evidence for. 'Less clear' means not sufficiently evidenced by the resume; it does not mean the candidate lacks the capability.
Treat a resume as a professional document and distinguish documented evidence from interpretation.`;

function cleanInput(text) {
  let x = String(text || '');
  x = x.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '');
  x = x.replace(/(?:https?:\/\/|www\.)[^\s<>]+/gi, '');
  x = x.replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, '');
  x = x.replace(/(?<![A-Za-z0-9._%+-])@[A-Za-z0-9_][A-Za-z0-9_.-]{1,30}/g, '');
  x = x.replace(/^(?:address|home address|location|based in|based at|dob|date of birth|passport|national id|aadhaar|aadhar|ssn|social security|marital status|visa status|work authorization|citizenship|salary|compensation|references?)\s*[:\-].*$/gim, '');
  x = x.replace(/\b(?:aadhaar|aadhar)\s*(?:no\.?|number|#)?\s*[:\-]?\s*\d{4}\s*\d{4}\s*\d{4}\b/gi, '');
  x = x.replace(/\b\d{3}[- ]\d{2}[- ]\d{4}\b/g, '');
  return x.split(/\r?\n/).filter(Boolean).join('\n').slice(0, 50000);
}

function jsonResponse(status, body) {
  return { statusCode: status, headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }, body: JSON.stringify(body) };
}

module.exports = async (req) => {
  if (req.method === 'OPTIONS') return jsonResponse(204, {});
  if (req.method !== 'POST') return jsonResponse(405, { error: 'POST only' });
  if (!process.env.OPENAI_API_KEY) return jsonResponse(500, { error: 'OPENAI_API_KEY is not configured on the server.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const resume = cleanInput(body.resume);
    if (resume.length < 80) return jsonResponse(400, { error: 'Resume text is too short to analyze.' });

    const model = process.env.OPENAI_MODEL || 'gpt-5';
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: SYSTEM }] },
          { role: 'user', content: [{ type: 'input_text', text: `Analyze this resume. Return only the requested structured analysis.\n\nRESUME:\n${resume}` }] }
        ],
        text: { format: { type: 'json_schema', name: 'resume_reality_check', strict: true, schema } }
      })
    });

    const raw = await response.text();
    if (!response.ok) return jsonResponse(response.status, { error: 'LLM request failed.', detail: raw.slice(0, 1200) });
    const data = JSON.parse(raw);
    const outputText = data.output_text || data.output?.flatMap(x => x.content || []).find(x => x.type === 'output_text')?.text;
    if (!outputText) return jsonResponse(502, { error: 'The LLM returned no structured analysis.' });
    const analysis = JSON.parse(outputText);
    return jsonResponse(200, { analysis, model });
  } catch (err) {
    return jsonResponse(500, { error: 'Could not complete LLM analysis.', detail: String(err.message || err) });
  }
};
