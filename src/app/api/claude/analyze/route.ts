import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const DISCOVERY_ANALYSIS_PROMPT = `You are an expert Agentforce consultant analyzing a client's discovery questionnaire.

Client Information:
Company: {{clientName}}
Use Case: {{useCaseName}}
Description: {{useCaseDescription}}
Monthly Volume: {{monthlyVolume}}
Current Process: {{currentProcess}}
Systems: {{existingSystems}}
Timeline: {{desiredTimeline}}

Analyze this use case and provide a JSON response with:

1. **Opportunity Score** (0-100)
   Score based on:
   - Volume (0-20): Higher volume = higher score
   - Repeatability (0-20): More standardized = higher score
   - Complexity (0-20): Clearer decision trees = higher score
   - Data (0-20): Better data availability = higher score
   - ROI (0-20): Clearer benefits = higher score

2. **AI Insights** (array of insights)
   Identify:
   - Key strengths (why this is a good fit)
   - Potential challenges (technical or organizational)
   - Recommendations (what to prioritize)

3. **Recommended Architecture**
   Design:
   - Topics (5-7 conversation topics with descriptions)
   - Actions (Salesforce Flows/Apex needed)
   - Variables (data to track in conversation state)
   - Integrations (external systems to connect)

4. **Cost Estimates**
   Calculate:
   - Implementation cost (based on complexity, integrations)
   - Monthly platform cost (Agentforce Flex + Data Cloud if needed)
   - Actions per conversation estimate
   - Use the formula: monthlyVolume * avgActionsPerConv * 0.10

5. **ROI Projections**
   Estimate:
   - Current annual cost (based on team size mentioned)
   - Projected savings
   - Payback period in months
   - 3-year ROI percentage

Format your response as valid JSON matching this structure:
{
  "opportunityScore": 92,
  "scoringBreakdown": {
    "volume": 19,
    "repeatability": 18,
    "complexity": 18,
    "data": 20,
    "roi": 17
  },
  "insights": [
    {
      "type": "positive" | "warning" | "recommendation",
      "title": "Short title",
      "description": "Detailed explanation"
    }
  ],
  "architecture": {
    "topics": [
      {
        "name": "topic_name",
        "displayName": "Topic Display Name",
        "description": "What this topic handles",
        "priority": "high" | "medium" | "low"
      }
    ],
    "actions": [
      {
        "name": "Action_Name",
        "description": "What this action does",
        "type": "flow" | "apex",
        "inputs": ["param1", "param2"],
        "outputs": ["result1"],
        "complexity": "low" | "medium" | "high"
      }
    ],
    "variables": [
      {
        "name": "variable_name",
        "type": "string" | "boolean" | "number",
        "description": "What this variable stores"
      }
    ],
    "integrations": [
      {
        "system": "System Name",
        "required": true | false,
        "complexity": "low" | "medium" | "high",
        "notes": "Integration requirements"
      }
    ]
  },
  "costEstimates": {
    "implementationCost": {
      "min": 55000,
      "max": 75000,
      "recommended": 65000,
      "breakdown": {
        "baseImplementation": 45000,
        "integrations": 15000,
        "testing": 5000
      }
    },
    "monthlyPlatformCost": {
      "agentforceFlex": 1850,
      "dataCloud": 0,
      "total": 1850
    },
    "assumptions": {
      "avgActionsPerConversation": 2.5,
      "containmentRate": 0.75
    }
  },
  "roiProjections": {
    "currentState": {
      "annualCost": 325000,
      "teamSize": 5,
      "costPerConversation": 3.56
    },
    "futureState": {
      "year1TotalCost": 87200,
      "year1Savings": 172800,
      "paybackMonths": 4.5,
      "threeYearRoi": 286
    }
  }
}

IMPORTANT: 
- Respond ONLY with valid JSON
- No markdown formatting
- No explanatory text outside JSON
- Use realistic, conservative estimates
- Base recommendations on Agentforce best practices`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { discoveryData } = body;

    if (!discoveryData) {
      return NextResponse.json(
        { error: "Discovery data is required" },
        { status: 400 }
      );
    }

    // Replace placeholders in the prompt with actual data
    const prompt = DISCOVERY_ANALYSIS_PROMPT
      .replace("{{clientName}}", discoveryData.clientName || "Unknown")
      .replace("{{useCaseName}}", discoveryData.useCaseName || "Unknown")
      .replace("{{useCaseDescription}}", discoveryData.useCaseDescription || "Unknown")
      .replace("{{monthlyVolume}}", discoveryData.monthlyVolume?.toString() || "0")
      .replace("{{currentProcess}}", discoveryData.currentProcess || "Unknown")
      .replace("{{existingSystems}}", discoveryData.existingSystems?.join(", ") || "None")
      .replace("{{desiredTimeline}}", discoveryData.desiredTimeline || "Unknown");

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const analysisText = response.content[0].type === "text" ? response.content[0].text : "";
    
    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI analysis response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return NextResponse.json(
      { error: "Failed to generate AI analysis" },
      { status: 500 }
    );
  }
}
