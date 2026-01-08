import React, { useState } from "react";
import { Student, Notification } from "../types";
import Button from "./common/Button";
import Spinner from "./common/Spinner";
import { generatePersonalizedNotification } from "../services/aiService";
import { INTERNSHIPS } from "../constants";
import { calculateMatchScore } from "../services/matchingService";

interface SimulatorProps {
  student: Student;
  // FIX: The type for addNotification was incorrect. It should not expect a `read` property, as this is handled by the `App` component.
  addNotification: (
    notification: Omit<Notification, "id" | "userType" | "read">
  ) => void;
}

const Simulator: React.FC<SimulatorProps> = ({ student, addNotification }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setScore(null);

    // --- AI Score Improvement Logic ---
    // The simulated project grants the 'Data Analysis' skill.
    const newSkill = "Data Analysis";
    let scoreImprovementNotificationText: string | null = null;

    // Check if student already has the skill to avoid fake notifications
    if (!student.skills.includes(newSkill)) {
      // Find a relevant internship to show score improvement for.
      const relevantInternship = INTERNSHIPS.find((i) =>
        i.requiredSkills.includes(newSkill)
      );

      if (relevantInternship) {
        const initialScore = await calculateMatchScore(student, relevantInternship);

        // Create a temporary student profile with the new skill
        const studentWithNewSkill: Student = {
          ...student,
          skills: [...student.skills, newSkill],
        };
        const newScore = await calculateMatchScore(
          studentWithNewSkill,
          relevantInternship
        );
        const improvement = newScore - initialScore;

        if (improvement > 0) {
          scoreImprovementNotificationText =
            await generatePersonalizedNotification(student, {
              type: "score_improvement",
              internshipName: relevantInternship.title,
              improvement: Math.round(improvement),
              reason: "Market Analysis Report project",
            });
        }
      }
    }
    // --- End of AI Score Improvement Logic ---

    await new Promise((resolve) => setTimeout(resolve, 3000));
    const newScoreValue = Math.floor(Math.random() * (95 - 75 + 1)) + 75; // Random score between 75 and 95
    setScore(newScoreValue);
    setIsSimulating(false);

    // If we generated a score improvement notification, use it. Otherwise, use the old one.
    if (scoreImprovementNotificationText) {
      addNotification({
        message: scoreImprovementNotificationText,
        type: "success",
      });
    } else {
      // Fallback to the original project completion notification
      const notificationText = await generatePersonalizedNotification(student, {
        type: "project_completion",
        projectName: "Market Analysis Report",
        score: newScoreValue,
        nextProject: "Competitive Landscape Deck",
      });
      addNotification({ message: notificationText, type: "success" });
    }
  };

  return (
    <div className="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Complete a mini-project to showcase your skills. Our AI will evaluate
        your performance, and the score will be considered in your final
        allocation.
      </p>
      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md mb-4">
        <h4 className="font-semibold text-gray-800 dark:text-white">
          Task: Market Analysis Report
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Analyze the provided dataset and create a one-page report on market
          trends for Q3.
        </p>
      </div>

      {score === null ? (
        <Button
          onClick={handleStartSimulation}
          disabled={isSimulating}
          className="w-full sm:w-auto"
        >
          {isSimulating ? <Spinner /> : "Submit Project for AI Evaluation"}
        </Button>
      ) : (
        <div className="text-center bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
          <p className="font-bold text-green-800 dark:text-green-200">
            Evaluation Complete!
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">
            Your Score: {score}/100
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            This score has been added to your profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default Simulator;
