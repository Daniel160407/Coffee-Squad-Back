/**
 * Quick Replies Configuration
 * This file defines the available quick reply options for the frontend
 * Each reply has user-friendly text and a backend payload
 */

export const QUICK_REPLIES_CONFIG = [
  {
    id: "GET_WORKOUT_PLAN",
    text: "Get My Workout Plan",
    payload: "GET_WORKOUT_PLAN",
    category: "workout",
    description: "Generate a personalized workout plan based on your goals",
  },
  {
    id: "GET_COMPLETE_DIET",
    text: "Get My Diet Plan",
    payload: "GET_COMPLETE_DIET",
    category: "nutrition",
    description: "Create a complete nutrition plan tailored to your needs",
  },
  {
    id: "VIEW_RECOVERY_TIPS",
    text: "Recovery & Wellness Tips",
    payload: "VIEW_RECOVERY_TIPS",
    category: "recovery",
    description: "Get personalized recovery and wellness recommendations",
  },
  {
    id: "GET_FITNESS_TIPS",
    text: "Fitness Tips & Advice",
    payload: "GET_FITNESS_TIPS",
    category: "tips",
    description: "Receive expert fitness tips and training advice",
  },
  {
    id: "GET_FULL_OVERVIEW",
    text: "My Complete Overview",
    payload: "GET_FULL_OVERVIEW",
    category: "analytics",
    description: "Get a comprehensive analysis of your fitness journey",
  },
];

// Helper function to get quick replies by category
export const getQuickRepliesByCategory = (category) => {
  return QUICK_REPLIES_CONFIG.filter((reply) => reply.category === category);
};

// Helper function to get all quick replies for frontend
export const getAllQuickReplies = () => {
  return QUICK_REPLIES_CONFIG.map(({ id, text, category, description }) => ({
    id,
    text,
    category,
    description,
  }));
};

// Helper function to get payloads for backend validation
export const getAllowedPayloads = () => {
  return QUICK_REPLIES_CONFIG.map((reply) => reply.payload);
};

// Helper function to find quick reply by payload
export const getQuickReplyByPayload = (payload) => {
  return QUICK_REPLIES_CONFIG.find((reply) => reply.payload === payload);
};
