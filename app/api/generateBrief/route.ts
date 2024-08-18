import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
    const {scrapedText, maxLength} = await request.json();

    if(!scrapedText){
        return Response.json({error: 'Invalid scraped text'}, {status: 400})
    }

            const brief = await makeBriefIterator(scrapedText, maxLength);

            return Response.json({brief});
}

async function makeBriefIterator(scrapedText: string, maxLength: number) {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": `Your job is to just take scraped data of a website as input, and tell information regarding the website in JSON. It should only contain two information: Tags: to represent the type of website like Ecommerce or Portfolio, should be array and allow more than one tag and other key is description: a brief about website under ${maxLength} words and whats it about.`
          },
          {
            "role": "user",
            "content": scrapedText.substring(0,4096)
          }
        ],
        "model": "mixtral-8x7b-32768",
        "temperature": 0.7,
        "max_tokens": 2048,
        "top_p": 1,
        "stream": false,
        "response_format": {
          "type": "json_object"
        },
        "stop": null
      });
    
      return chatCompletion.choices[0].message.content;
}
