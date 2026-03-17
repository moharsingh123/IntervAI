import axios from 'axios';
const askAI = async (messages) => {
    try {
        // validate that we received a non-empty array of messages
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Message array is empty or invalid")
        }
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                // correct model ID per OpenRouter documentation
                model: 'openai/gpt-4o-mini',
                messages: messages
            },
            {
                headers: {
                    Authorization:`Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            },
        );

        const content= response.data.choices?.[0].message.content;

        if (!content || !content.trim()) {
            throw new Error("AI returned empty response.");
        }
        console.log(response.data, content);
        return content
    } catch (error) {
        console.log("OpenRouter Error:" , error.response?.data || error.message)
        throw new Error('OpenRouter API Error ')
    }
}
export default askAI;