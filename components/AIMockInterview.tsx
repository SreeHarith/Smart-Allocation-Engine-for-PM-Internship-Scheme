import React, { useState, useEffect, useRef } from "react";
import { Student, InterviewFeedback, InterviewReport } from "../types";
import { MOCK_INTERVIEW_QUESTIONS } from "../constants";
import { generateInterviewReport } from "../services/aiService";
import Card from "./common/Card";
import Button from "./common/Button";
import Spinner from "./common/Spinner";
import {
  VideoCameraIcon,
  StopCircleIcon,
  MicrophoneIcon,
} from "./common/Icons";
import InterviewReportDisplay from "./InterviewReportDisplay";
import RecordingPlayerModal from "./RecordingPlayerModal";

// Add SpeechRecognition type definitions for browsers that support it
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface AIMockInterviewProps {
  student: Student;
}

type InterviewStatus = "idle" | "recording" | "processing" | "finished";

const MOCK_REALTIME_FEEDBACK = [
  { type: "tone", value: "Slightly monotonous, try varying your pitch." },
  { type: "pace", value: "Good speaking pace, easy to follow." },
  {
    type: "bodyLanguage",
    value: "Good eye contact, but try to use more hand gestures.",
  },
  { type: "keywords", value: 'Excellent use of "user-centric design".' },
  { type: "tone", value: "Sounding more confident now!" },
  { type: "pace", value: "Pace is a little fast, take a breath." },
] as const;

const AIMockInterview: React.FC<AIMockInterviewProps> = ({ student }) => {
  const [status, setStatus] = useState<InterviewStatus>("idle");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedbackLog, setFeedbackLog] = useState<InterviewFeedback[]>([]);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Recording state
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        return stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Could not access your camera. Please check permissions and try again."
      );
    }
    return null;
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = async (stream: MediaStream) => {
    recordedChunksRef.current = [];
    const options = { mimeType: "video/webm; codecs=vp9" };
    mediaRecorderRef.current = new MediaRecorder(stream, options);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordingUrl(url);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
          .trim()
          .toLowerCase();
        if (transcript.includes("next question")) {
          handleNextQuestion();
        } else if (transcript.includes("finish interview")) {
          handleStopInterview();
        }
      };
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Speech recognition already started.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    setupSpeechRecognition();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopCamera();
      stopListening();
    };
  }, []);

  const handleStartInterview = async () => {
    const stream = await startCamera();
    if (stream) {
      startRecording(stream);
      setStatus("recording");
      setFeedbackLog([]);
      setReport(null);
      setRecordingUrl(null);
      setCurrentQuestionIndex(0);

      startListening();

      timerRef.current = setInterval(() => {
        const randomFeedback =
          MOCK_REALTIME_FEEDBACK[
            Math.floor(Math.random() * MOCK_REALTIME_FEEDBACK.length)
          ];
        setFeedbackLog((prev) => [
          ...prev,
          { ...randomFeedback, timestamp: Date.now() },
        ]);
      }, 15000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < MOCK_INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const handleStopInterview = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopRecording();
    stopCamera();
    stopListening();
    setStatus("processing");
    const finalReport = await generateInterviewReport(feedbackLog);
    setReport(finalReport);
    setStatus("finished");
  };

  const handleRetake = () => {
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }
    setStatus("idle");
    setReport(null);
    setRecordingUrl(null);
  };

  const currentQuestion = MOCK_INTERVIEW_QUESTIONS[currentQuestionIndex];

  const renderContent = () => {
    switch (status) {
      case "idle":
        return (
          <div className="text-center">
            <VideoCameraIcon className="h-16 w-16 mx-auto text-brand-600 dark:text-brand-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              AI Mock Interview
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Practice for your Product Manager interview. Our AI will provide
              feedback on your performance. You can say "Next question" or
              "Finish interview" to navigate.
            </p>
            <Button onClick={handleStartInterview} className="mt-6">
              Start Interview
            </Button>
          </div>
        );
      case "recording":
        return (
          <div>
            <div className="relative mb-4 bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              ></video>
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-bold rounded flex items-center">
                  <span className="h-2 w-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                  REC
                </div>
                <div
                  className={`p-1.5 rounded-full ${
                    isListening ? "bg-green-500/80" : "bg-gray-500/80"
                  }`}
                >
                  <MicrophoneIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded-md text-xs">
                Voice Commands: "Next question" | "Finish interview"
              </p>
            </div>
            <Card className="bg-gray-50 dark:bg-gray-900/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of{" "}
                {MOCK_INTERVIEW_QUESTIONS.length}
              </p>
              <p className="font-semibold text-lg text-gray-800 dark:text-white mt-1">
                {currentQuestion.text}
              </p>
            </Card>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={handleStopInterview} variant="danger">
                <StopCircleIcon className="h-5 w-5 mr-2" />
                Finish Interview & Get Report
              </Button>
              <Button
                onClick={handleNextQuestion}
                variant="light"
                disabled={
                  currentQuestionIndex >= MOCK_INTERVIEW_QUESTIONS.length - 1
                }
              >
                Next Question
              </Button>
            </div>
          </div>
        );
      case "processing":
        return (
          <div className="text-center py-16">
            <Spinner />
            <p className="mt-4 font-semibold text-gray-700 dark:text-gray-200">
              Analyzing your performance...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Our AI is generating your detailed report.
            </p>
          </div>
        );
      case "finished":
        return report ? (
          <InterviewReportDisplay
            report={report}
            onRetake={handleRetake}
            onViewRecording={() => setIsRecordingModalOpen(true)}
            recordingUrl={recordingUrl}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-red-500">
              Could not generate your report. Please try again.
            </p>
            <Button onClick={handleRetake} className="mt-4">
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div>
      {renderContent()}
      {isRecordingModalOpen && recordingUrl && (
        <RecordingPlayerModal
          videoUrl={recordingUrl}
          onClose={() => setIsRecordingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AIMockInterview;
