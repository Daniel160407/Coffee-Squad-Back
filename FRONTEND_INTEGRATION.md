# Frontend Integration Guide for Quick Replies

## Overview

The quick replies system now provides beautiful, user-friendly button text that can be directly displayed in your frontend, while maintaining backend logic through payloads.

## API Endpoints

### 1. Get Quick Replies Configuration

```bash
GET /api/gemini/quick-replies
```

**Response:**

```json
{
  "success": true,
  "data": {
    "quickReplies": [
      {
        "id": "GET_WORKOUT_PLAN",
        "text": "💪 Get My Workout Plan",
        "category": "workout",
        "description": "Generate a personalized workout plan based on your goals"
      },
      {
        "id": "GET_COMPLETE_DIET",
        "text": "🥗 Get My Diet Plan",
        "category": "nutrition",
        "description": "Create a complete nutrition plan tailored to your needs"
      }
      // ... more replies
    ],
    "total": 5,
    "categories": ["workout", "nutrition", "recovery", "tips", "analytics"]
  }
}
```

### 2. Filter by Category

```bash
GET /api/gemini/quick-replies?category=workout
```

## Frontend Implementation Examples

### React/JavaScript Example

```javascript
// Fetch quick replies configuration
const fetchQuickReplies = async (category = null) => {
  const url = category
    ? `/api/gemini/quick-replies?category=${category}`
    : "/api/gemini/quick-replies";

  const response = await fetch(url);
  const data = await response.json();
  return data.data.quickReplies;
};

// Render quick reply buttons
const QuickReplyButtons = ({ replies, onReplyClick }) => {
  return (
    <div className="quick-replies">
      {replies.map((reply) => (
        <button
          key={reply.id}
          className="quick-reply-btn"
          onClick={() => onReplyClick(reply.id)}
        >
          {reply.text}
        </button>
      ))}
    </div>
  );
};

// Usage
const MyComponent = () => {
  const [quickReplies, setQuickReplies] = useState([]);

  useEffect(() => {
    fetchQuickReplies().then(setQuickReplies);
  }, []);

  const handleReplyClick = (replyId) => {
    // Send the replyId as payload to your backend
    console.log("User clicked:", replyId);
  };

  return (
    <QuickReplyButtons replies={quickReplies} onReplyClick={handleReplyClick} />
  );
};
```

### Vue.js Example

```vue
<template>
  <div class="quick-replies">
    <button
      v-for="reply in quickReplies"
      :key="reply.id"
      @click="handleReplyClick(reply.id)"
      class="quick-reply-btn"
    >
      {{ reply.text }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quickReplies: [],
    };
  },
  async mounted() {
    const response = await fetch("/api/gemini/quick-replies");
    const data = await response.json();
    this.quickReplies = data.data.quickReplies;
  },
  methods: {
    handleReplyClick(replyId) {
      // Send replyId to backend
      console.log("User clicked:", replyId);
    },
  },
};
</script>
```

### CSS Styling Example

```css
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.quick-reply-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.quick-reply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.quick-reply-btn:active {
  transform: translateY(0);
}
```

## Benefits

1. **Frontend-Friendly**: Beautiful text with emojis ready for display
2. **Categorized**: Organize buttons by category (workout, nutrition, etc.)
3. **Flexible**: Filter by category or get all replies
4. **Consistent**: Same configuration used by AI and frontend
5. **Maintainable**: Single source of truth for quick reply options

## Backend Integration

When a user clicks a quick reply button, send the `id` field as the payload to your backend endpoints. The AI will use the same payloads when generating quick replies in responses.
