'use server';
/**
 * @fileOverview A Genkit flow for a contextual voice assistant that provides real-time,
 * context-aware information based on natural language questions.
 *
 * - contextualVoiceAssistant - A function that handles voice assistant queries.
 * - ContextualVoiceAssistantInput - The input type for the contextualVoiceAssistant function.
 * - ContextualVoiceAssistantOutput - The return type for the contextualVoiceAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the contextual voice assistant
const ContextualVoiceAssistantInputSchema = z.object({
  question: z.string().describe('The user\'s natural language question to the Guardian AI.'),
  currentLocation: z
    .object({
      latitude: z.number().describe('The current latitude of the user.'),
      longitude: z.number().describe('The current longitude of the user.'),
    })
    .optional()
    .describe('The user\'s current geographical coordinates, if available.'),
  routeContext: z
    .string()
    .optional()
    .describe('Additional context about the user\'s current or intended route, e.g., "N1 Northbound".'),
});
export type ContextualVoiceAssistantInput = z.infer<typeof ContextualVoiceAssistantInputSchema>;

// Output Schema for the contextual voice assistant
const ContextualVoiceAssistantOutputSchema = z.object({
  answer: z.string().describe('The context-aware answer provided by the Guardian AI.'),
});
export type ContextualVoiceAssistantOutput = z.infer<typeof ContextualVoiceAssistantOutputSchema>;

// --- Tools Definition ---

// Dummy tool for getting nearest accident information
const getNearestAccidentInfo = ai.defineTool(
  {
    name: 'getNearestAccidentInfo',
    description: 'Provides information about the nearest accident to the user\'s current location. Use this when the user asks about accidents or incidents.',
    inputSchema: z.object({
      userLocation: z.object({
        latitude: z.number().describe('The user\'s current latitude.'),
        longitude: z.number().describe('The user\'s current longitude.'),
      }).describe('The user\'s current geographical coordinates.'),
      route: z.string().optional().describe('The current route the user is on, if relevant.'),
    }),
    outputSchema: z.string().describe('A descriptive string about the nearest accident, or indicating no accidents found.'),
  },
  async (input) => {
    // In a real application, this would call a service to query a real-time accident database.
    // For this example, we'll return a static response or simulate based on input.
    if (input.userLocation.latitude === -23.9000 && input.userLocation.longitude === 29.4667) { // Polokwane area
      return 'Accident reported 5km ahead on N1 Southbound, minor delays expected. No severe injuries.';
    }
    return 'No significant accidents reported in your immediate vicinity.';
  }
);

// Dummy tool for checking route safety status
const getRouteSafetyStatus = ai.defineTool(
  {
    name: 'getRouteSafetyStatus',
    description: 'Checks the safety status of a specified route, including potential hazards, high-crime zones, or construction. Use this when the user asks if a route is safe.',
    inputSchema: z.object({
      userLocation: z.object({
        latitude: z.number().describe('The user\'s current latitude.'),
        longitude: z.number().describe('The user\'s current longitude.'),
      }).describe('The user\'s current geographical coordinates.'),
      route: z.string().optional().describe('The route the user is currently on or intends to take, e.g., "N1 to Polokwane".'),
    }),
    outputSchema: z.string().describe('A descriptive string about the safety status of the route, including warnings if any.'),
  },
  async (input) => {
    // In a real application, this would query a route safety service.
    // For this example, we'll return a static response or simulate.
    if (input.route?.toLowerCase().includes('r81')) {
      return 'Warning: High-crime zone reported recently on parts of R81. Exercise extreme caution. Alternative routes available via R71.';
    } else if (input.route?.toLowerCase().includes('n1')) {
      return 'N1 appears to be clear and safe. Minor construction observed near junction 10, proceed with care.';
    } else if (input.userLocation.latitude === -24.0000 && input.userLocation.longitude === 29.5000) {
      return 'The route around your current location seems safe, but always stay vigilant.';
    }
    return 'The current route appears safe. Drive responsibly.';
  }
);


// Genkit Prompt Definition
const contextualVoiceAssistantPrompt = ai.definePrompt({
  name: 'contextualVoiceAssistantPrompt',
  input: {schema: ContextualVoiceAssistantInputSchema},
  output: {schema: ContextualVoiceAssistantOutputSchema},
  tools: [getNearestAccidentInfo, getRouteSafetyStatus], // Make tools available to the LLM
  system: `You are Provincial Intelligent Safety, a 24/7 Guardian Angel AI for citizens in Limpopo, South Africa.
  Your primary goal is to provide real-time, context-aware, and lifesaving information.
  You are concise, direct, and always prioritize the user's safety.
  When appropriate, use the available tools to gather information before responding.
  If the user's question relates to accidents or incidents, use the 'getNearestAccidentInfo' tool.
  If the user's question relates to the safety of a route, use the 'getRouteSafetyStatus' tool.
  Always incorporate the information from the tools into your answer.
  If a tool cannot be used (e.g., missing location information) or does not return relevant data, state that you cannot provide that specific real-time data but offer general safety advice.

  Current user context:
  {{#if currentLocation}}
  User's current location: Latitude {{{currentLocation.latitude}}}, Longitude {{{currentLocation.longitude}}}.
  {{/if}}
  {{#if routeContext}}
  User is on or asking about route: {{{routeContext}}}.
  {{/if}}
  `,
  prompt: 'User query: {{{question}}}',
});

// Genkit Flow Definition
const contextualVoiceAssistantFlow = ai.defineFlow(
  {
    name: 'contextualVoiceAssistantFlow',
    inputSchema: ContextualVoiceAssistantInputSchema,
    outputSchema: ContextualVoiceAssistantOutputSchema,
  },
  async (input) => {
    // Call the prompt with the input. The LLM will decide whether to use tools based on the prompt instructions.
    const {output} = await contextualVoiceAssistantPrompt(input);
    return output!;
  }
);

// Wrapper function to expose the flow
export async function contextualVoiceAssistant(
  input: ContextualVoiceAssistantInput
): Promise<ContextualVoiceAssistantOutput> {
  return contextualVoiceAssistantFlow(input);
}
