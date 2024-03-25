"use client";

import { useState } from "react";

interface Question {
  question: string;
  answers: string[];
  correctAnswer: any;
}

const Home: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match("text.*")) {
      alert("Please select a text file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      parseQuestions(content);
    };
    reader.readAsText(file);
  };

  const parseQuestions = (content: string) => {
    const lines = content.split("\n");
    const parsedQuestions: Question[] = [];
    let currentQuestion: Question | null = null;
    let answers: string[] = [];

    for (const line of lines) {
      if (line.trim().length === 0) {
        continue;
      } else if (!isNaN(parseInt(line.trim()[0]))) {
        let i = 0;
        while (!isNaN(parseInt(line[i]))) {
          i++;
        }
        if (currentQuestion) {
          currentQuestion.answers = answers;
          parsedQuestions.push(currentQuestion);
        }
        currentQuestion = {
          question: line.trim().substring(i).replace("-", ""),
          answers: [],
          correctAnswer: "",
        };
        answers = [];
      } else if (
        line.trim().startsWith("A.") ||
        line.trim().startsWith("B.") ||
        line.trim().startsWith("C.") ||
        line.trim().startsWith("D.") ||
        line.trim().startsWith("E.")
      ) {
        const answer = line.trim().substring(2);
        if (line.includes("*")) {
          currentQuestion!.correctAnswer = answers.length;
          answers.push(answer.replace("*", ""));
        } else {
          answers.push(answer);
        }
      }
    }

    if (currentQuestion) {
      currentQuestion.answers = answers;
      parsedQuestions.push(currentQuestion);
    }

    setQuestions(parsedQuestions);
  };

  return (
    <div className="p-12">
      <form className=" bg-gray-900 flex justify-center items-center">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />

        <label
          htmlFor="fileInput"
          className=" cursor-pointer  text-white p-10 rounded font-bold text-3xl"
        >
          Choose file
        </label>
      </form>
      <div></div>
      {questions.length > 0 && (
        <div className=" border-2 border-black p-5 flex flex-col gap-16">
          {questions.map((q, index) => (
            <div key={index} className=" flex flex-col gap-5">
              <h3 className=" text-2xl font-extrabold">{q.question}</h3>
              <ul>
                {q.answers.map((answer, i) => (
                  <li key={i}>{answer}</li>
                ))}
              </ul>
              <div className="flex gap-2">
                <p className=" text-lg text-green-500 font-bold">
                  Correct Answer:
                </p>
                <p>{q.correctAnswer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/*the text file content */}
      {/* <pre className=" border-2 border-black p-5 bg-orange-100">
        {fileContent}
      </pre> */}
    </div>
  );
};

export default Home;
