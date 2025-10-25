"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload } from "lucide-react";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section3CommonQuestionsProps {
  formData: DiscoveryFormData;
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
}

const exampleQuestions = [
  "Where's my order?",
  "How do I reset my password?",
  "What's the price for Enterprise plan?",
  "Can I return this item?",
  "How do I cancel my subscription?",
  "What are your business hours?",
  "Do you offer discounts for bulk orders?",
  "How do I update my billing information?",
];

export default function Section3CommonQuestions({
  formData,
  addQuestion,
  removeQuestion,
  updateField,
}: Section3CommonQuestionsProps) {
  const [showExamples, setShowExamples] = useState(false);

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.commonQuestions];
    newQuestions[index] = value;
    updateField("commonQuestions", newQuestions);
  };

  const addExampleQuestion = (question: string) => {
    const newQuestions = [...formData.commonQuestions];
    const firstEmptyIndex = newQuestions.findIndex((q) => !q.trim());
    if (firstEmptyIndex !== -1) {
      newQuestions[firstEmptyIndex] = question;
      updateField("commonQuestions", newQuestions);
    } else if (newQuestions.length < 15) {
      updateField("commonQuestions", [...newQuestions, question]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Understanding common questions helps us build smarter agents
        </h3>
        <p className="text-blue-800 text-sm">
          List the 10-15 most common questions or requests you handle. Claude
          will generate Topics directly from these questions.
        </p>
      </div>

      {/* Example Questions */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Example Questions</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
          >
            {showExamples ? "Hide" : "Show"} Examples
          </Button>
        </div>

        {showExamples && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">
              Click any example to add it to your list:
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addExampleQuestion(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Your Most Common Questions</h4>
          <div className="text-sm text-gray-500">
            {formData.commonQuestions.filter((q) => q.trim()).length} / 15
          </div>
        </div>

        {formData.commonQuestions.map((question, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
              {index + 1}
            </div>
            <Input
              value={question}
              onChange={(e) => updateQuestion(index, e.target.value)}
              placeholder={`Question ${index + 1}...`}
              className="flex-1"
            />
            {formData.commonQuestions.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeQuestion(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {formData.commonQuestions.length < 15 && (
          <Button variant="outline" onClick={addQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Question
          </Button>
        )}
      </div>

      {/* File Upload Section */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">
          Upload Questions Document (Optional)
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          If you have a document with common questions, you can upload it here.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Choose File
          </Button>
          <span className="text-sm text-gray-500">
            Supports .txt, .csv, .docx files
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: File upload functionality will be implemented in a future update
        </p>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude generates Topics directly from
          these questions
        </p>
      </div>
    </div>
  );
}
