# Dynamic Quick Replies System

## Overview

The system now supports two modes of operation:

1. **Initial Quick Replies**: Static buttons from `QUICK_REPLIES_CONFIG` for first-time users
2. **Dynamic Quick Replies**: AI-generated contextual buttons based on the current conversation

## How It Works

### Step 1: User Sees Initial Quick Replies

Frontend fetches static quick replies from `/api/gemini/quick-replies`:

```json
{
  "success": true,
  "data": {
    "quickReplies": [
      {
        "id": "GET_WORKOUT_PLAN",
        "text": "Get My Workout Plan",
        "category": "workout",
        "description": "Generate a personalized workout plan based on your goals"
      },
      {
        "id": "GET_COMPLETE_DIET",
        "text": "Get My Diet Plan",
        "category": "nutrition",
        "description": "Create a complete nutrition plan tailored to your needs"
      }
      // ... more static options
    ]
  }
}
```

### Step 2: User Clicks a Quick Reply Button

Frontend sends the quick reply payload to `/api/gemini/insight`:

```javascript
// When user clicks "Get My Workout Plan" button
const response = await fetch("/api/gemini/insight", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    quickReplyPayload: "GET_WORKOUT_PLAN",
    userId: "507f1f77bcf86cd799439011",
    insightType: "custom-query",
  }),
});
```

### Step 3: AI Generates Response + Dynamic Quick Replies

The AI responds with both the requested content AND new contextual quick replies:

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Your Personalized Workout Plan",
    "summary": "Based on your fitness goals, I've created a comprehensive workout plan...",
    "recommendations": [
      {
        "category": "workout",
        "text": "Focus on compound movements for maximum efficiency",
        "priority": "high"
      }
    ],
    "quickReplies": [
      {
        "text": "Create Upper Body Focus Plan",
        "payload": "CREATE_UPPER_BODY_PLAN",
        "category": "workout",
        "description": "Generate a specialized upper body workout routine"
      },
      {
        "text": "Build Cardio Routine",
        "payload": "BUILD_CARDIO_ROUTINE",
        "category": "workout",
        "description": "Create an effective cardiovascular training program"
      },
      {
        "text": "Plan My Weekly Schedule",
        "payload": "PLAN_WEEKLY_SCHEDULE",
        "category": "workout",
        "description": "Organize workouts into a weekly training schedule"
      }
    ],
    "userId": "507f1f77bcf86cd799439011",
    "insightType": "custom-query"
  }
}
```

### Step 4: Frontend Displays Dynamic Buttons

Frontend now shows the AI-generated contextual buttons instead of the static ones.

## API Usage Examples

### Regular Prompt (No Quick Reply)

```javascript
const response = await fetch("/api/gemini/insight", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Help me with my nutrition goals",
    userId: "507f1f77bcf86cd799439011",
  }),
});
```

### Quick Reply Selection

```javascript
const response = await fetch("/api/gemini/insight", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    quickReplyPayload: "GET_COMPLETE_DIET",
    userId: "507f1f77bcf86cd799439011",
  }),
});
```

## Frontend Implementation

### React Example

```javascript
const ChatComponent = () => {
  const [staticQuickReplies, setStaticQuickReplies] = useState([]);
  const [dynamicQuickReplies, setDynamicQuickReplies] = useState([]);
  const [currentInsight, setCurrentInsight] = useState(null);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  // Load initial static quick replies
  useEffect(() => {
    fetch("/api/gemini/quick-replies")
      .then((res) => res.json())
      .then((data) => setStaticQuickReplies(data.data.quickReplies));
  }, []);

  const handleQuickReplyClick = async (payload) => {
    const response = await fetch("/api/gemini/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quickReplyPayload: payload,
        userId: "507f1f77bcf86cd799439011",
      }),
    });

    const result = await response.json();
    setCurrentInsight(result.data);
    setDynamicQuickReplies(result.data.quickReplies);
    setIsFirstInteraction(false);
  };

  const handleDynamicReplyClick = async (payload) => {
    // Same as above, but now using dynamic replies
    const response = await fetch("/api/gemini/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quickReplyPayload: payload,
        userId: "507f1f77bcf86cd799439011",
      }),
    });

    const result = await response.json();
    setCurrentInsight(result.data);
    setDynamicQuickReplies(result.data.quickReplies);
  };

  return (
    <div>
      {/* Display current insight */}
      {currentInsight && (
        <div className="insight">
          <h3>{currentInsight.title}</h3>
          <p>{currentInsight.summary}</p>
        </div>
      )}

      {/* Display quick reply buttons */}
      <div className="quick-replies">
        {(isFirstInteraction ? staticQuickReplies : dynamicQuickReplies).map(
          (reply) => (
            <button
              key={reply.payload || reply.id}
              onClick={() => handleQuickReplyClick(reply.payload || reply.id)}
              className="quick-reply-btn"
            >
              {reply.text}
            </button>
          )
        )}
      </div>
    </div>
  );
};
```

## Benefits

1. **Contextual Relevance**: AI generates quick replies specific to the current conversation
2. **Progressive Discovery**: Users can explore deeper into topics through dynamic suggestions
3. **Reduced Cognitive Load**: Users don't need to think of what to ask next
4. **Personalized Experience**: Quick replies adapt to user's specific needs and context
5. **Seamless Flow**: Natural conversation progression through suggested actions

## Dynamic Quick Reply Examples

### After Workout Plan Request:

- "Create Upper Body Focus Plan"
- "Build Cardio Routine"
- "Plan My Weekly Schedule"
- "Track My Progress"

### After Nutrition Request:

- "Calculate My Macros"
- "Plan My Weekly Meals"
- "Find Healthy Snacks"
- "Create Shopping List"

### After Recovery Tips Request:

- "Sleep Optimization Tips"
- "Stress Management Plan"
- "Injury Prevention Guide"
- "Meditation Routine"
