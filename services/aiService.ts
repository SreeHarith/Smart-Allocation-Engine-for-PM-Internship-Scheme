import { OpenRouter } from "@openrouter/sdk";
import {
  Student,
  NotificationTriggerEvent,
  InterviewFeedback,
  InterviewReport,
} from "../types";

// 1. Initialize the OpenRouter client
const openrouter = new OpenRouter({
  apiKey: process.env.API_KEY, // Ensure this matches your Vite config
});

const MODEL_NAME = "qwen/qwen-2.5-vl-7b-instruct:free";

// --- Helper Function to Handle Streaming to String ---
// Your app expects a Promise<string>, but the SDK snippet you gave uses streaming.
// This helper consumes the stream and joins it into a single string.
async function getCompletion(messages: any[]): Promise<string> {
  try {
    const stream = await openrouter.chat.send({
      model: MODEL_NAME,
      messages: messages,
      stream: true, // We keep your preferred streaming method
    });

    let fullResponse = "";

    // @ts-ignore - The SDK types might sometimes conflict with strict TS setups, ignoring for safety
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }
    return fullResponse.trim();
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw error;
  }
}

/**
 * Generates a personalized notification using AI.
 */
export const generatePersonalizedNotification = async (
  student: Student,
  event: NotificationTriggerEvent
): Promise<string> => {
  let prompt = "";
  // (Switch cases match your original logic exactly)
  switch (event.type) {
    case "welcome":
      prompt = `Create a warm, encouraging, and short (20-25 words) welcome message for a student named ${
        student.name
      }. They are aspiring to be a ${student.careerGoals
        .toLowerCase()
        .replace(
          "become a ",
          ""
        )}. The tone should be exciting and motivating.`;
      break;
    case "course_completion":
      prompt = `Generate a concise (25-30 words) and congratulatory message for ${student.name} for completing the course "${event.courseName}". Mention that this new skill improves their chances for "${event.improvedInternship}".`;
      break;
    case "project_completion":
      prompt = `Create a positive notification (30-35 words) for ${student.name} after completing project "${event.projectName}" with score ${event.score}/100. Suggest trying "${event.nextProject}" next.`;
      break;
    case "new_match":
      prompt = `Generate a short, exciting notification (20-25 words) for ${student.name}. A new internship "${event.internshipName}" is a ${event.matchScore}% match.`;
      break;
    case "deadline_reminder":
      prompt = `Create an urgent reminder (20-25 words) for ${student.name}. Application deadline for "${event.internshipName}" is in ${event.daysLeft} days.`;
      break;
    case "score_improvement":
      prompt = `Generate a motivating notification (25-30 words) for ${student.name}. Completing "${event.reason}" boosted their match score for "${event.internshipName}" by ${event.improvement}%.`;
      break;
  }

  if (!prompt) return "You've got a new notification!";

  try {
    return await getCompletion([{ role: "user", content: prompt }]);
  } catch (error) {
    return "You have a new notification!"; // Fallback
  }
};

interface ChatMessage {
  text: string;
  sender: "user" | "ai";
}

/**
 * Gets a response from the AI chatbot.
 */
export const getChatbotResponse = async (
  message: string,
  history: ChatMessage[],
  student: Student
): Promise<string> => {
  const systemInstruction = `You are AI Mentor, a supportive chatbot for students.
  Student: ${student.name}
  Goals: ${student.careerGoals}
  Skills: ${student.skills.join(", ")}
  
  (Behave like a helpful mentor. Keep responses concise and friendly.)`;

  // Format messages for OpenRouter
  const messages = [
    { role: "system", content: systemInstruction },
    ...history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    { role: "user", content: message },
  ];

  try {
    return await getCompletion(messages);
  } catch (error) {
    return "I'm having trouble connecting right now.";
  }
};

/**
 * Generates an interview performance report using AI.
 */
export const generateInterviewReport = async (
  feedbackLog: InterviewFeedback[]
): Promise<InterviewReport | null> => {
  const prompt = `You are an expert interview coach. Analyze this feedback log:
  ${JSON.stringify(feedbackLog, null, 2)}
  
  Generate a performance report in STRICT JSON format.
  Do not include markdown (\`\`\`json). Just the raw JSON object.
  
  Schema:
  {
    "overallScore": (number 60-95),
    "strengths": ["string", "string"],
    "areasForImprovement": ["string", "string"],
    "detailedFeedback": {
       "clarity": "string",
       "confidence": "string",
       "bodyLanguage": "string",
       "keywordUsage": "string"
    }
  }`;

  try {
    const jsonString = await getCompletion([{ role: "user", content: prompt }]);

    // Clean up potential markdown formatting if the model adds it
    const cleanJson = jsonString
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson) as InterviewReport;
  } catch (error) {
    console.error("Error generating report:", error);
    return null;
  }
};
