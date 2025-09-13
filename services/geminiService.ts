import { GoogleGenAI, Type } from "@google/genai";
import { Student, NotificationTriggerEvent, InterviewFeedback, InterviewReport } from '../types';

// Initialize the GoogleGenAI client according to the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI se personalized notification generate karta hai.
 * Generates a personalized notification using AI.
 * @param student - The student for whom the notification is generated.
 * @param event - The event that triggered the notification.
 * @returns A personalized notification string.
 */
export const generatePersonalizedNotification = async (
  student: Student,
  event: NotificationTriggerEvent
): Promise<string> => {
  let prompt = '';
  switch (event.type) {
    case 'welcome':
      prompt = `Create a warm, encouraging, and short (20-25 words) welcome message for a student named ${student.name}. They are aspiring to be a ${student.careerGoals.toLowerCase().replace('become a ', '')}. The tone should be exciting and motivating, making them feel they are in the right place to start their career journey.`;
      break;
    case 'course_completion':
      prompt = `Generate a concise (25-30 words) and congratulatory message for ${student.name} for completing the course "${event.courseName}". Mention that this new skill significantly improves their chances for an internship like "${event.improvedInternship}". The tone should be celebratory and forward-looking.`;
      break;
    case 'project_completion':
      prompt = `Create a positive and motivating notification (30-35 words) for ${student.name} after completing a project named "${event.projectName}" with an impressive score of ${event.score}/100. Suggest they continue their momentum by trying the "${event.nextProject}" project next.`;
      break;
    case 'new_match':
      prompt = `Generate a short, exciting notification (20-25 words) for ${student.name}. A new internship, "${event.internshipName}", has opened up and it's a great ${event.matchScore}% match for their profile. Encourage them to check it out.`;
      break;
    case 'deadline_reminder':
      prompt = `Create an urgent but helpful reminder (20-25 words) for ${student.name}. The application deadline for the "${event.internshipName}" internship is in just ${event.daysLeft} day${event.daysLeft > 1 ? 's' : ''}. Advise them to apply soon to not miss out.`;
      break;
    case 'score_improvement':
      prompt = `Generate a highly motivating notification (25-30 words) for ${student.name}. Congratulate them on completing the "${event.reason}". Mention that this has boosted their match score for the "${event.internshipName}" internship by an impressive ${event.improvement}%.`;
      break;
  }

  if (!prompt) {
    return "You've got a new notification!";
  }

  try {
    // Use the Gemini API to generate content.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    // Extract text directly from the response object.
    return response.text.trim();
  } catch (error) {
    console.error("Error generating personalized notification:", error);
    // Fallback to a simpler message if API fails
    switch (event.type) {
        case 'welcome':
            return `Welcome, ${student.name}! Let's find your dream internship.`;
        case 'course_completion':
            return `Congratulations on completing ${event.courseName}, ${student.name}!`;
        case 'project_completion':
            return `Great job on the ${event.projectName}, ${student.name}! Your score was ${event.score}.`;
        case 'new_match':
            return `New high-match internship available: ${event.internshipName}!`;
        case 'deadline_reminder':
            return `The deadline for ${event.internshipName} is approaching! Only ${event.daysLeft} day(s) left.`;
        case 'score_improvement':
            return `Your profile match for ${event.internshipName} has improved by ${event.improvement}%!`;
        default:
            return "You have a new notification!";
    }
  }
};

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
}

/**
 * AI chatbot se response get karta hai.
 * Gets a response from the AI chatbot.
 * @param message - The user's current message.
 * @param history - The past conversation history.
 * @param student - The student who is interacting with the bot.
 * @returns A chatbot response string.
 */
export const getChatbotResponse = async (message: string, history: ChatMessage[], student: Student): Promise<string> => {
    const systemInstruction = `You are AI Mentor, a highly intelligent, conversational, and supportive chatbot designed to help students with internships, skill growth, and career guidance. Your behavior is similar to ChatGPT.
- Be interactive, friendly, and natural.
- You can answer in detail, explain concepts, or keep it short based on user preference.
- You should remember context during the chat.
- You can guide, motivate, and mentor like a real human coach.

The student you are talking to is ${student.name}.
Their profile is:
- Career Goal: ${student.careerGoals}
- Current Skills: ${student.skills.join(', ')}
- Qualifications: ${student.qualifications.join(', ')}
- Industry Focus: ${student.industryFocus.join(', ')}
- Preferred Internship Duration: ${student.preferredDuration}

### Capabilities:
1. Internship Help: Recommend best-fit internships based on skills, education, career goals, and location. Explain "match scores" clearly (why high/low, how to improve).
2. Skills & Upskilling: Identify gaps between the student profile and internship requirements. Recommend courses, certifications, or projects to close gaps.
3. Resume & Career Guidance: Suggest resume/profile improvements. Generate role-specific bullet points, summaries, and project highlights.
4. Mock Interviews: Generate internship/job-specific interview questions. Provide answers, tips, and role-play as an interviewer if requested.
5. General Chat: You can chat casually like ChatGPT (explain topics, clarify doubts, motivate, answer technical/non-technical queries). Always stay helpful, encouraging, and student-focused.

### Rules:
- Always keep conversations safe, respectful, and professional.
- If the student asks outside the scope (like entertainment or general knowledge), answer like ChatGPT but gently guide back to career/internship focus.
- Use bullet points, examples, and simple explanations whenever possible.
- Never give personal opinions—stay neutral and constructive.

Tone: Friendly, supportive, professional, and motivating.`;

    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.text }],
    }));
    // Add the current user message to the conversation history for the API call
    contents.push({ role: 'user', parts: [{ text: message }] });


    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents, // Pass the whole history
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "I'm having a little trouble connecting right now. Please try again in a moment.";
    }
};

/**
 * AI se interview performance report generate karta hai.
 * Generates an interview performance report using AI.
 * @param feedbackLog - A log of feedback events during the interview.
 * @returns A structured interview report object.
 */
export const generateInterviewReport = async (feedbackLog: InterviewFeedback[]): Promise<InterviewReport | null> => {
  const prompt = `You are an expert interview coach. Analyze the following log of observations from a student's mock interview. The student is practicing for a Product Manager role. Based on the log, generate a constructive and encouraging performance report.
  
  **Observation Log:**
  ${JSON.stringify(feedbackLog, null, 2)}
  
  Please provide a detailed report in JSON format. The overall score should be between 60 and 95. Be realistic but positive. Identify 2-3 clear strengths and 2-3 actionable areas for improvement. The detailed feedback should be a short, constructive sentence for each category.`;
  
  const reportSchema = {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.INTEGER, description: "An overall performance score out of 100." },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 2-3 key strengths observed during the interview."
      },
      areasForImprovement: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 2-3 actionable areas for improvement."
      },
      detailedFeedback: {
        type: Type.OBJECT,
        properties: {
          clarity: { type: Type.STRING, description: "Feedback on the clarity of speech." },
          confidence: { type: Type.STRING, description: "Feedback on perceived confidence." },
          bodyLanguage: { type: Type.STRING, description: "Feedback on body language and eye contact." },
          keywordUsage: { type: Type.STRING, description: "Feedback on the use of relevant industry keywords." }
        },
        required: ["clarity", "confidence", "bodyLanguage", "keywordUsage"]
      }
    },
    required: ["overallScore", "strengths", "areasForImprovement", "detailedFeedback"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      }
    });

    // The response text should be a valid JSON string conforming to the schema
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as InterviewReport;

  } catch (error) {
    console.error("Error generating interview report:", error);
    return null;
  }
};