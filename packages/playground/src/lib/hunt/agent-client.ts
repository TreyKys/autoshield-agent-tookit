// Agent Client for Dashboard
// This is a minimal client to interface with the local or remote NullShot Agent

export async function callAgent(prompt: string) {
    console.log("Mock Agent Call:", prompt);

    // In a real implementation, this would call the backend API (e.g. playground or dedicated agent endpoint)
    // For now, we simulate the call which triggers the UI state transitions in App.tsx

    return Promise.resolve({
        status: "success",
        message: "Agent activated"
    });
}
